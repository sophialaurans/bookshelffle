import express from 'express';
import subjectsController from '../controllers/subjectsController.js';

const router = express.Router();

router.get('/', subjectsController.getSubjects);

export default router;