import express from 'express';
const router = express.Router();
import explanationController from '../controllers/explanationController.js';

router.post('/explain', explanationController.getExplanation);

export default router;
