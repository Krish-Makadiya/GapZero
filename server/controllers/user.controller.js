import { db } from "../config/firebase.js";
import axios from "axios";
import FormData from "form-data";

export const onboardingController = async (req, res) => {
    try {
        const clerkId = req.body.clerkId;
        const payloadStr = req.body.payload;

        if (!clerkId) {
            return res.status(400).json({ message: "Clerk ID is required" });
        }

        let parsedPayload = {};
        if (payloadStr) {
            try {
                parsedPayload = JSON.parse(payloadStr);
            } catch (e) {
                console.warn("Could not parse payload string:", payloadStr);
            }
        } else {
            parsedPayload = req.body; // fallback if JSON was somehow sent directly
        }

        const {
            role,
            experienceLevel,
            jobTypes,
            skills,
            companies,
            countries,
        } = parsedPayload;

        // Save to Firebase
        await db
            .collection("users")
            .doc(clerkId)
            .set(
                {
                    role: role || "",
                    experienceLevel: experienceLevel || "",
                    jobTypes: jobTypes || [],
                    skills: skills || [],
                    companies: companies || [],
                    countries: countries || [],
                },
                { merge: true },
            );

        console.log("Onboarding Data Saved for:", clerkId);

        // Forward to n8n webhook
        try {
            const formData = new FormData();
            formData.append("userId", clerkId);
            if (role) formData.append("role", role);
            if (experienceLevel)
                formData.append("experienceLevel", experienceLevel);
            if (jobTypes) formData.append("jobTypes", JSON.stringify(jobTypes));
            if (skills) formData.append("skills", JSON.stringify(skills));

            // Attach the file if one was uploaded
            if (req.file) {
                formData.append("file", req.file.buffer, {
                    filename: req.file.originalname,
                    contentType: req.file.mimetype,
                });
            }

            // Adjust this webhook URL if necessary
            await axios.post(
                "http://localhost:5678/webhook/get-filtered-jobs",
                formData,
                {
                    headers: formData.getHeaders(),
                },
            );

            console.log("Details successfully forwarded to n8n Webhook.");
        } catch (webhookErr) {
            console.warn("Failed to contact n8n webhook:", webhookErr.message);
        }

        res.json({ message: "User onboarding successful" });
    } catch (error) {
        console.error("Error in onboarding:", error);
        res.status(500).json({ message: "Onboarding failed" });
    }
};

export const userProfileController = async (req, res) => {
    try {
        const data = req.body;
        const { clerkId } = data;

        if (!clerkId) {
            return res.status(400).json({ message: "Clerk ID is required" });
        }

        console.log("Saving User Profile Data for:", clerkId);

        // Save to Firestore 'users' collection with clerkId as document ID
        await db.collection("users").doc(clerkId).set(data, { merge: true });

        res.status(200).json({
            message: "User profile updated successfully",
            data: data,
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({
            message: "Failed to update user profile",
            error: error.message,
        });
    }
};

export const getUserProfileController = async (req, res) => {
    try {
        const { clerkId } = req.params;

        if (!clerkId) {
            return res.status(400).json({ message: "Clerk ID is required" });
        }

        const userDoc = await db.collection("users").doc(clerkId).get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: "User profile not found" });
        }

        res.status(200).json(userDoc.data());
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            message: "Failed to fetch user profile",
            error: error.message,
        });
    }
};

export const getUserLearningsController = async (req, res) => {
    try {
        const { clerkId } = req.params;

        if (!clerkId) {
            return res.status(400).json({ message: "Clerk ID is required" });
        }

        console.log("User ID: ", clerkId);

        const learningsSnapshot = await db
            .collection("users")
            .doc(clerkId)
            .collection("learnings")
            .get();

        const learnings = [];
        learningsSnapshot.forEach((doc) => {
            learnings.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json({ learnings });
    } catch (error) {
        console.error("Error fetching user learnings:", error);
        res.status(500).json({
            message: "Failed to fetch user learnings",
            error: error.message,
        });
    }
};

export const updateLearningTaskController = async (req, res) => {
    try {
        const { clerkId, learningId } = req.params;
        const { skillIndex, taskIndex, completed } = req.body;

        if (
            !clerkId ||
            !learningId ||
            skillIndex === undefined ||
            taskIndex === undefined ||
            completed === undefined
        ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const learningRef = db
            .collection("users")
            .doc(clerkId)
            .collection("learnings")
            .doc(learningId);
        const doc = await learningRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Learning path not found" });
        }

        const data = doc.data();
        let updated = false;

        // Handle case where path structure might be skills_roadmap -> tasks OR skills_roadmap -> paths
        // Or if taskIndex === -1, it means the skill itself is the task!
        if (data.skills_roadmap && data.skills_roadmap[skillIndex]) {
            const skill = data.skills_roadmap[skillIndex];

            if (taskIndex === -1) {
                skill.completed = completed;
                updated = true;
            } else if (skill.tasks && skill.tasks[taskIndex]) {
                skill.tasks[taskIndex].completed = completed;
                updated = true;
            } else if (skill.paths && skill.paths[taskIndex]) {
                skill.paths[taskIndex].completed = completed;
                updated = true;
            }
        }

        if (updated) {
            await learningRef.update({ skills_roadmap: data.skills_roadmap });
            res.status(200).json({ message: "Task updated successfully" });
        } else {
            res.status(400).json({ message: "Task not found to update" });
        }
    } catch (error) {
        console.error("Error updating learning task:", error);
        res.status(500).json({
            message: "Failed to update learning task",
            error: error.message,
        });
    }
};

export const parseResumeController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No resume file provided" });
        }

        const formData = new FormData();
        formData.append("file", req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const n8nResponse = await axios.post(
            "http://localhost:5678/webhook-test/parse-resume",
            formData,
            {
                headers: formData.getHeaders(),
            },
        );

        res.status(200).json(n8nResponse.data);
    } catch (error) {
        console.error("Error parsing resume via backend:", error);
        res.status(500).json({
            message: "Failed to parse resume via backend",
            error: error.message,
        });
    }
};
