import GameProgress from '../models/GameProgress.js';
import ChildProfile from '../models/ChildProfile.js';
import questionBank from '../data/questions.js';
import {
  recordAnswer,
  getNextAdaptiveQuestion,
  readTheta,
  THETA_INITIAL,
} from '../irt/raschIRT.js';

const MODULES = ['greeting', 'sharing', 'waiting', 'emotion', 'communication'];

// `moduleTheta` is a Mongoose Map, but may be a plain object on profiles
// written before the schema change. Normalise both into a plain object so
// Object.fromEntries is never handed a non-iterable.
const serializeModuleTheta = (profile) => {
  const out = {};
  for (const m of MODULES) out[m] = readTheta(profile, m);
  return out;
};

// ============================================================
// Adaptive next-question selection (Rasch 1PL IRT)
// ============================================================
export const getNextQuestion = async (req, res) => {
  try {
    const { module } = req.params;

    const excludeKeys = req.query.exclude
      ? String(req.query.exclude).split(',').filter(Boolean)
      : [];

    const result = await getNextAdaptiveQuestion(req.user.id, module, excludeKeys);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Child profile or question not found',
      });
    }

    res.status(200).json({
      success: true,
      question: result.question,
      theta: result.theta,
      difficulty: result.question.difficulty,
      distance: result.distance,
      weight: result.weight,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================
// Answer evaluation + per-module theta estimation
// ============================================================
const parseQuestionKey = (questionKey) => {
  const parts = String(questionKey).split(':');
  if (parts.length !== 2) return null;
  return { module: parts[0], index: parseInt(parts[1], 10) };
};

export const checkAnswer = async (req, res) => {
  try {
    const { module, questionIndex, questionKey, userAnswer, responseTime } = req.body;

    let index = null;
    if (questionKey) {
      const parsed = parseQuestionKey(questionKey);
      if (parsed) index = parsed.index;
    } else if (questionIndex !== undefined) {
      index = questionIndex;
    }

    const questions = questionBank[module];
    if (!questions || questions[index] === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Invalid module or question key',
      });
    }

    const question = questions[index];
    const correct = userAnswer === question.correct;

    const result = await recordAnswer(req.user.id, module, index, correct, {
      answer: userAnswer,
      responseTime: typeof responseTime === 'number' ? responseTime : null,
    });
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Child profile not found',
      });
    }

    res.json({
      success: true,
      correct,
      correctIndex: question.correct,
      correctAnswer: question.options[question.correct],
      feedback: correct ? 'Correct answer' : 'Try again',
      difficulty: typeof question.difficulty === 'number' ? question.difficulty : 0,
      theta: result.theta,
      thetaDelta: result.thetaDelta,
      predictedProbability: result.predictedProbability,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================
// Threshold-Based Reward (Stars & Badges)
// ============================================================
const calculateReward = (score, total) => {
  const pct = total > 0 ? (score / total) * 100 : 0;

  if (pct === 100) return { stars: 3, badge: 'Gold' };
  if (pct >= 70) return { stars: 2, badge: 'Silver' };
  if (pct >= 50) return { stars: 1, badge: 'Bronze' };
  return { stars: 0, badge: 'None' };
};

// ============================================================
// Save quiz result
// ============================================================
export const saveGameProgress = async (req, res) => {
  try {
    const { child, module, score, total, completed } = req.body;

    const reward = calculateReward(score, total);

    const progress = await GameProgress.findOneAndUpdate(
      { child, module },
      { score, total, starsEarned: reward.stars, badge: reward.badge, completed },
      { upsert: true, new: true, runValidators: true }
    );

    if (completed) {
      const childProfile = await ChildProfile.findById(child);
      if (!childProfile) {
        return res.status(404).json({ success: false, message: 'Child profile not found' });
      }

      // Award stars & badge
      childProfile.stars += reward.stars;
      if (reward.badge !== 'None' && !childProfile.badges.includes(reward.badge)) {
        childProfile.badges.push(reward.badge);
      }

      // Score aggregation
      childProfile.totalCorrect += score;
      childProfile.totalQuestions += total;
      const aggPct = childProfile.totalQuestions > 0
        ? Math.round((childProfile.totalCorrect / childProfile.totalQuestions) * 100)
        : 0;
      childProfile.overallProgress = aggPct;

      // Update per-module progress
      const pct = total > 0 ? Math.round((score / total) * 100) : 0;
      const existing = childProfile.moduleProgress.find(m => m.module === module);
      if (existing) {
        existing.score = Math.max(existing.score, score);
        existing.total = Math.max(existing.total, total);
        existing.percentage = Math.max(existing.percentage, pct);
      } else {
        childProfile.moduleProgress.push({ module, score, total, percentage: pct });
      }

      await childProfile.save();
    }

    res.status(200).json({
      success: true,
      progress,
      reward,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================
// Get module progress
// ============================================================
export const getModuleProgress = async (req, res) => {
  try {
    const profile = await ChildProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const progress = await GameProgress.find({
      child: profile._id,
      module: req.params.module,
    });

    const completed = {};
    progress.forEach(p => { if (p.completed) completed[p.module] = true; });

    res.status(200).json({ success: true, module: req.params.module, completed, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================
// Get game progress by child ID
// ============================================================
export const getGameProgress = async (req, res) => {
  try {
    const progress = await GameProgress.find({ child: req.params.childId });

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// Get dashboard
// ============================================================
export const getDashboard = async (req, res) => {
  try {
    const profile = await ChildProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'No child profile found' });
    }

    const gameProgress = await GameProgress.find({ child: profile._id });

    res.status(200).json({
      success: true,
      dashboard: {
        id: profile._id,
        childName: profile.childName,
        stars: profile.stars,
        overallProgress: profile.overallProgress,
        totalCorrect: profile.totalCorrect,
        totalQuestions: profile.totalQuestions,
        moduleProgress: profile.moduleProgress,
        badges: profile.badges,
        moduleTheta: serializeModuleTheta(profile),
        gameProgress,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
