import express from 'express';
import mongoose from 'mongoose';

import questionBank from '../data/questions.js';

import {
  saveGameProgress,
  getGameProgress,
  getModuleProgress,
  getDashboard,
  checkAnswer,
  getNextQuestion,
} from '../controllers/gameController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Unauthenticated health probe: confirms the API is reachable and that each
// module has an item bank loaded. Useful when the quiz reports that it could
// not load a question.
router.get('/health', (req, res) => {
  const modules = {};
  for (const [name, pool] of Object.entries(questionBank)) {
    modules[name] = Array.isArray(pool) ? pool.length : 0;
  }
  res.status(200).json({
    success: true,
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    modules,
  });
});

router.get('/dashboard/me', authMiddleware, getDashboard);
router.get('/module/:module', authMiddleware, getModuleProgress);
router.get('/adaptive/:module', authMiddleware, getNextQuestion);
router.post('/check-answer', authMiddleware, checkAnswer);
router.post('/', authMiddleware, saveGameProgress);
router.get('/:childId', authMiddleware, getGameProgress);

export default router;
