import { Router } from "express";
import multer from "multer";
import {
    getUserProfileController,
    onboardingController,
    userProfileController,
    parseResumeController,
    getUserLearningsController,
    updateLearningTaskController,
} from "../controllers/user.controller.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post("/onboarding", upload.single("resume"), onboardingController);
router.post("/parse-resume", upload.single("file"), parseResumeController);
router.post("/user-profile", userProfileController);
router.get("/user-profile/:clerkId", getUserProfileController);
router.get("/learnings/:clerkId", getUserLearningsController);
router.put("/learnings/:clerkId/:learningId", updateLearningTaskController);

export default router;
