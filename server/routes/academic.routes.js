import express from 'express';
import multer from 'multer';
import { processAcademicDocs, getAcademicAlignment } from '../controllers/academic.controller.js';

const router = express.Router();

// Configure multer to store files in memory
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Route for uploading and processing transcript and syllabus
router.post('/upload', upload.fields([
    { name: 'transcript', maxCount: 1 },
    { name: 'syllabus', maxCount: 1 }
]), processAcademicDocs);

// Route to fetch latest academic alignment data for the user
router.get('/results/:clerkId', getAcademicAlignment);

export default router;
