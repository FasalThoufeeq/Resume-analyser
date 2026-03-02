import express from 'express';
import multer from 'multer';
import { analyzeResume } from '../controllers/analyzeController.js';

import { checkFreeLimit } from '../middlewares/guardrails.js';

const router = express.Router();

// Memory storage since we'll send it directly to Python service
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.post('/analyze', upload.single('resume'), checkFreeLimit, analyzeResume);

export default router;
