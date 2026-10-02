import mongoose from 'mongoose';

const moduleProgressSchema = new mongoose.Schema({
  module: { type: String, required: true },
  score: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
}, { _id: false });

// One entry per answered question, used by the Rasch IRT engine for
// exposure weighting and recent-answer tracking.
const answerHistorySchema = new mongoose.Schema({
  questionKey: { type: String, required: true },
  module: { type: String },
  itemDifficulty: { type: Number },
  answer: { type: mongoose.Schema.Types.Mixed },
  correct: { type: Boolean, default: false },
  responseTime: { type: Number },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const childProfileSchema = new mongoose.Schema(
  {
    childName: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 1,
      max: 18,
    },
    stars: {
      type: Number,
      default: 0,
    },
    overallProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    moduleProgress: [moduleProgressSchema],
    totalCorrect: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    badges: {
      type: [String],
      default: [],
    },
    // Per-module ability estimates (theta). Each social skill domain
    // has its own independent ability estimate so that progress in
    // greeting does not affect emotion recognition scores, etc.
    moduleTheta: {
      type: Map,
      of: Number,
      default: {},
    },
    // History of answered questions (questionKey, outcome, time).
    questionHistory: {
      type: [answerHistorySchema],
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChildProfile = mongoose.model('ChildProfile', childProfileSchema);

export default ChildProfile;
