import express from 'express';
import authorsController from '../controllers/authorsController.js';

const router = express.Router();

router.get('/', authorsController.getAuthors);

export default router;
