import express from "express";
import { getMicroLesson, identifySkillGaps } from "../controllers/resource.controller.js";

const router = express.Router();

router.post("/get-micro-lesson", getMicroLesson);
router.post("/identify-skill-gaps", identifySkillGaps);

export default router;