// ============================================================================
// raschIRT.js — Adaptive Question-Selection Engine for Social Steps
// ============================================================================
//
//   PRIMARY ALGORITHM   : Rasch Item Response Theory (1-Parameter Logistic)
//   SECONDARY ALGORITHM : Weighted Random (Roulette Wheel) Selection
//
// This module selects the next question for a child based on their
// estimated ability (theta) per social-skill module.  Every module has
// its own independent theta, and the question bank is a flat pool per
// module (no Easy/Medium/Hard levels).
//
// ----------------------------------------------------------------------------
// 1. RASCH IRT MATHEMATICS (1PL)
// ----------------------------------------------------------------------------
//   P(correct | theta, b) = 1 / (1 + exp(-(theta - b)))
//
//   theta == b  ->  P = 0.5   (question exactly matched to ability)
//   theta  >  b ->  P > 0.5   (question is easier than the ability)
//   theta  <  b ->  P < 0.5   (question is harder than the ability)
//
// ----------------------------------------------------------------------------
// 2. ABILITY (THETA) ESTIMATION — PER MODULE
// ----------------------------------------------------------------------------
//   theta_new = theta_old + learningRate * (response - P)
//
//   Each module maintains its own theta in the child's moduleTheta map.
//   This ensures that a child's greeting skill does not affect their
//   emotion-recognition ability estimate, and vice versa.
//
// ----------------------------------------------------------------------------
// 3. ADAPTIVE QUESTION SELECTION (PIPELINE)
// ----------------------------------------------------------------------------
//   current theta (per module)
//         |
//         v
//   filter by module ............... flat pool for this module
//         |
//         v
//   exclude already-shown ......... questions from current quiz run
//         |
//         v
//   Rasch distance = |theta - b| .. compute item-person proximity
//         |
//         v
//   candidate set .................. within DISTANCE_THRESHOLD or closest
//         |
//         v
//   compute weights ................ see section 4
//         |
//         v
//   roulette wheel selection ...... sample one question proportionally
//         |
//         v
//   return next question
//
// ----------------------------------------------------------------------------
// 4. WEIGHTED RANDOM (ROULETTE WHEEL)
// ----------------------------------------------------------------------------
//   w_i = exp(-SHARPNESS * distance_i) * exposureWeight_i * recencyWeight_i
//
//   exposureWeight: unseen=1.5, incorrect=1.8, correct=0.8
//   recencyWeight:  recently shown=0.3, otherwise=1.0
// ============================================================================

import ChildProfile from '../models/ChildProfile.js';
import questionBank from '../data/questions.js';

// ---- Algorithm hyper-parameters ----
export const LEARNING_RATE = 0.1;
export const DISTANCE_THRESHOLD = 0.6;
export const THETA_INITIAL = 0.0;
export const RASCH_SHARPNESS = 4;
export const RECENT_WINDOW = 5;
export const MAX_HISTORY = 100;
export const THETA_MIN = -3;
export const THETA_MAX = 3;
export const QUIZ_LENGTH = 10;

export const WEIGHT_FACTORS = {
  UNSEEN: 1.5,
  ANSWERED_INCORRECT: 1.8,
  ANSWERED_CORRECT: 0.8,
  RECENTLY_SHOWN: 0.3,
};

// ---------------------------------------------------------------------------
// Rasch probability: P(correct) = 1 / (1 + exp(-(theta - b)))
// ---------------------------------------------------------------------------
export function calculateRaschProbability(theta, difficulty) {
  const z = theta - difficulty;
  const clamped = Math.max(-30, Math.min(30, z));
  return 1 / (1 + Math.exp(-clamped));
}

// ---------------------------------------------------------------------------
// Single gradient step: theta_new = theta_old + lr * (response - P)
// ---------------------------------------------------------------------------
export function updateTheta(theta, difficulty, response) {
  const P = calculateRaschProbability(theta, difficulty);
  return theta + LEARNING_RATE * (response - P);
}

export function clampTheta(theta) {
  return Math.min(THETA_MAX, Math.max(THETA_MIN, theta));
}

// Stable, collision-free key that identifies a question in the flat pool.
export function buildQuestionKey(module, index) {
  return `${module}:${index}`;
}

// ---------------------------------------------------------------------------
// Per-module ability read/write helpers.
//
// `moduleTheta` is declared as a Mongoose Map in the ChildProfile schema, so
// bracket access (profile.moduleTheta[module]) silently does nothing — the
// value would never persist and every session would restart at THETA_INITIAL.
// These helpers normalise the three shapes this field can take in practice:
//   * a Mongoose Map           -> .get() / .set()
//   * a plain object (legacy)   -> property access
//   * undefined                 -> seeded with THETA_INITIAL
// ---------------------------------------------------------------------------
export function readTheta(profile, module) {
  const store = profile.moduleTheta;
  if (!store) return THETA_INITIAL;

  const value = typeof store.get === 'function'
    ? store.get(module)
    : store[module];

  return typeof value === 'number' && Number.isFinite(value) ? value : THETA_INITIAL;
}

export function writeTheta(profile, module, theta) {
  const store = profile.moduleTheta;

  if (store && typeof store.set === 'function') {
    store.set(module, theta);
    return;
  }
  profile.moduleTheta = { ...(store || {}), [module]: theta };
}

// ---------------------------------------------------------------------------
// Get the flat pool for a module
// ---------------------------------------------------------------------------
export function getModulePool(module) {
  return questionBank[module] || [];
}

// ---------------------------------------------------------------------------
// Derive exposure status of every question from answer history:
// unseen / answered-correctly / answered-incorrectly
// ---------------------------------------------------------------------------
function getQuestionStatusMap(history) {
  const map = new Map();
  for (const entry of history) {
    if (!entry || !entry.questionKey) continue;
    if (entry.correct) {
      if (!map.has(entry.questionKey)) map.set(entry.questionKey, 'correct');
    } else {
      map.set(entry.questionKey, 'incorrect');
    }
  }
  return map;
}

function isRecentlyShown(questionKey, history) {
  return history.slice(-RECENT_WINDOW).some((e) => e.questionKey === questionKey);
}

// ---------------------------------------------------------------------------
// Candidate generation: questions whose Rasch distance is within
// DISTANCE_THRESHOLD of theta, excluding already-shown keys.
// Fallback: the closest-distance items.
// ---------------------------------------------------------------------------
export function getCandidateQuestions(module, theta, history = [], excludeKeys = []) {
  const pool = getModulePool(module);
  if (!pool) return [];

  const excluded = new Set(excludeKeys);
  const candidates = [];

  for (let i = 0; i < pool.length; i++) {
    const q = pool[i];
    const key = buildQuestionKey(module, i);
    if (excluded.has(key)) continue;

    const b = typeof q.difficulty === 'number' ? q.difficulty : 0;
    const distance = Math.abs(theta - b);
    candidates.push({ questionKey: key, index: i, difficulty: b, distance });
  }

  const within = candidates.filter((c) => c.distance <= DISTANCE_THRESHOLD);
  if (within.length > 0) return within;

  if (candidates.length === 0) return [];
  const minDist = Math.min(...candidates.map((c) => c.distance));
  return candidates.filter((c) => c.distance === minDist);
}

// ---------------------------------------------------------------------------
// Weight for a candidate: Rasch kernel * exposure * recency
// ---------------------------------------------------------------------------
export function calculateQuestionWeight(candidate, theta, history = []) {
  const statusMap = getQuestionStatusMap(history);
  const status = statusMap.get(candidate.questionKey);

  let exposureWeight;
  if (status === undefined) {
    exposureWeight = WEIGHT_FACTORS.UNSEEN;
  } else if (status === 'incorrect') {
    exposureWeight = WEIGHT_FACTORS.ANSWERED_INCORRECT;
  } else {
    exposureWeight = WEIGHT_FACTORS.ANSWERED_CORRECT;
  }

  const recencyWeight = isRecentlyShown(candidate.questionKey, history)
    ? WEIGHT_FACTORS.RECENTLY_SHOWN
    : 1.0;

  return Math.exp(-RASCH_SHARPNESS * candidate.distance) * exposureWeight * recencyWeight;
}

// ---------------------------------------------------------------------------
// Roulette wheel selection: sample proportionally to weight
// ---------------------------------------------------------------------------
export function rouletteWheelSelection(candidates) {
  if (!candidates || candidates.length === 0) return null;

  const total = candidates.reduce((s, c) => s + (c.weight || 0), 0);
  if (total <= 0) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  let pointer = Math.random() * total;
  for (const c of candidates) {
    pointer -= c.weight;
    if (pointer <= 0) return c;
  }
  return candidates[candidates.length - 1];
}

// ---------------------------------------------------------------------------
// Create one answer-history entry for persistence
// ---------------------------------------------------------------------------
export function createHistoryEntry({ module, index, correct, answer = null, responseTime = null }) {
  const pool = getModulePool(module);
  const q = pool[index];
  const itemDifficulty = typeof q?.difficulty === 'number' ? q.difficulty : 0;

  return {
    questionKey: buildQuestionKey(module, index),
    module,
    itemDifficulty,
    answer,
    correct: Boolean(correct),
    responseTime: typeof responseTime === 'number' ? responseTime : null,
    timestamp: new Date(),
  };
}

// ---------------------------------------------------------------------------
// Record one answer: update per-module theta and persist history.
// ---------------------------------------------------------------------------
export async function recordAnswer(userId, module, index, correct, meta = {}) {
  const profile = await ChildProfile.findOne({ user: userId });
  if (!profile) return null;

  const pool = getModulePool(module);
  const q = pool[index];
  const difficulty = typeof q?.difficulty === 'number' ? q.difficulty : 0;

  // Per-module theta. `moduleTheta` is a Mongoose Map, so it must be read
  // and written with .get()/.set() — bracket notation silently no-ops and
  // the ability estimate would never persist across sessions.
  const oldTheta = readTheta(profile, module);

  const predictedProbability = calculateRaschProbability(oldTheta, difficulty);
  const thetaNew = updateTheta(oldTheta, difficulty, correct ? 1 : 0);
  const clamped = clampTheta(thetaNew);

  writeTheta(profile, module, clamped);

  profile.questionHistory = profile.questionHistory || [];
  profile.questionHistory.push(
    createHistoryEntry({
      module,
      index,
      correct,
      answer: meta.answer ?? null,
      responseTime: meta.responseTime ?? null,
    })
  );
  if (profile.questionHistory.length > MAX_HISTORY) {
    profile.questionHistory = profile.questionHistory.slice(-MAX_HISTORY);
  }

  await profile.save();

  return {
    theta: clamped,
    thetaDelta: clamped - oldTheta,
    predictedProbability,
  };
}

// ---------------------------------------------------------------------------
// ORCHESTRATOR — full adaptive selection pipeline.
// Returns the next question plus diagnostics.
// ---------------------------------------------------------------------------
export async function getNextAdaptiveQuestion(userId, module, excludeKeys = []) {
  const profile = await ChildProfile.findOne({ user: userId });
  if (!profile) return null;

  const theta = readTheta(profile, module);
  const history = profile.questionHistory || [];

  // Pedagogical steering: after a correct answer, prefer items at or above
  // the last difficulty; after an incorrect answer, prefer items at or below.
  const lastEntry = [...history]
    .reverse()
    .find((h) => h && h.module === module);

  let candidates = getCandidateQuestions(module, theta, history, excludeKeys);

  // Cold start: a child new to this module sits at theta ~= 0, so the easy
  // illustrated band (b <= 0) is both the closest IRT match and the only band
  // that carries a visual scaffold. Without this, stochastic sampling can
  // hand a brand-new child several unillustrated items before the first
  // picture appears - precisely when the support matters most. If every
  // illustrated item is already excluded, fall back to the normal pool.
  if (!lastEntry && candidates.length > 0) {
    const pool = getModulePool(module);
    const illustrated = candidates.filter((c) => pool[c.index] && pool[c.index].image);
    if (illustrated.length > 0) candidates = illustrated;
  }

  if (lastEntry) {
    const lastIdx = Number(String(lastEntry.questionKey).split(':')[1]);
    const pool = getModulePool(module);
    const lastQ = pool[lastIdx];
    if (lastQ && typeof lastQ.difficulty === 'number') {
      const steered = candidates.filter((c) =>
        lastEntry.correct
          ? c.difficulty >= lastQ.difficulty - 1e-9
          : c.difficulty <= lastQ.difficulty + 1e-9
      );
      if (steered.length > 0) candidates = steered;
    }
  }

  // Assign weights and roulette-wheel sample
  const weighted = candidates.map((c) => ({
    ...c,
    weight: calculateQuestionWeight(c, theta, history),
  }));

  const chosen = rouletteWheelSelection(weighted);
  if (!chosen) return null;

  const pool = getModulePool(module);
  const question = pool[chosen.index];
  if (!question) return null;

  return {
    question: {
      questionKey: chosen.questionKey,
      q: question.q,
      options: question.options,
      image: question.image || null,
      difficulty: chosen.difficulty,
      explanation: question.explanation || '',
    },
    theta,
    distance: chosen.distance,
    weight: chosen.weight,
  };
}
