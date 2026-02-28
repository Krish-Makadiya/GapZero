import { db } from "../config/firebase.js";
import { GoogleGenAI } from "@google/genai";
import { PDFParse } from "pdf-parse";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Multi-Document Processing
export const processAcademicDocs = async (req, res) => {
    try {
        const { clerkId } = req.body;

        if (!clerkId) {
            return res.status(400).json({ message: "Clerk ID is required" });
        }

        const transcriptFile = req.files?.transcript?.[0];
        const syllabusFile = req.files?.syllabus?.[0];

        if (!transcriptFile && !syllabusFile) {
            return res.status(400).json({ message: "No documents uploaded" });
        }

        let transcriptData = [];
        let syllabusTopics = [];

        // 1. Process Transcript
        if (transcriptFile) {
            const transcriptParser = new PDFParse({ data: transcriptFile.buffer });
            const transcriptObj = await transcriptParser.getText();
            const transcriptText = transcriptObj.text;
            await transcriptParser.destroy();
            const transcriptPrompt = `
                Extract a structured JSON array of objects with { semester, subject, grade } from the following transcript text.
                Return ONLY valid JSON array.
                Transcript Text:
                ${transcriptText.substring(0, 10000)}
            `;

            const transcriptResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: transcriptPrompt,
            });
            const text = transcriptResponse.text;
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            try {
                transcriptData = JSON.parse(jsonStr);
            } catch (e) {
                console.error("Transcript JSON parsing error", e);
            }
        }

        // 2. Process Syllabus
        if (syllabusFile) {
            const syllabusParser = new PDFParse({ data: syllabusFile.buffer });
            const syllabusObj = await syllabusParser.getText();
            const syllabusText = syllabusObj.text;
            await syllabusParser.destroy();
            const syllabusPrompt = `
                Extract the core technical topics covered in this syllabus. 
                Return ONLY a JSON array of strings representing the core topics.
                Syllabus Text:
                ${syllabusText.substring(0, 10000)}
            `;
            const syllabusResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: syllabusPrompt,
            });
            const text = syllabusResponse.text;
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            try {
                syllabusTopics = JSON.parse(jsonStr);
            } catch (e) {
                console.error("Syllabus JSON parsing error", e);
            }
        }

        // Fetch User Data for target role
        const userDoc = await db.collection("users").doc(clerkId).get();
        const userData = userDoc.data() || {};
        const targetRole = userData.role || "Software Engineer";

        // 3. Collaborative Analysis Logic (The "Bridge" Brain)
        const analysisPrompt = `
            You are an expert career and academic advisor. 
            Analyze the following student data against 2026 Industry Standards for the target role of "${targetRole}".
            
            CRITICAL INSTRUCTION: You must NEVER use critical language like "missing", "not sufficient", "gap", or "lacking".
            Instead, you must use supportive, scaffolding terminology like "Industry Extension", "Modern Toolset Alignment", and "Foundational Stronghold".

            Student Transcript Data: ${JSON.stringify(transcriptData)}
            Student Core Syllabus Topics: ${JSON.stringify(syllabusTopics)}

            Generate a highly structured JSON object with exactly these keys:
            1. "overallScore": A number from 1 to 100 representing their overall alignment.
            2. "subScores": Array of objects { category: string, score: number }. Break down the overall score by 3-4 key technical categories relevant to the role.
            3. "foundationalStrongholds": Array of objects { subject: string, quickTake: string, bullets: array of 3 short strings }. Identify subjects where grades or topics provide a competitive edge.
            4. "industryAlignmentOpportunities": Array of objects { topic: string, quickTake: string, gamificationBadge: string (e.g. "High Demand"), bullets: array of 3 short strings }. Identify modern tools complementing college theory.
            5. "strategicBridgeModules": Array of objects { module: string, quickTake: string, bullets: array of 3 short strings }. Suggest 2-3 micro-learning paths bridging an academic subject to real-world application.

            Return ONLY raw valid JSON.
        `;

        const analysisResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: analysisPrompt,
        });
        const analysisText = analysisResponse.text;
        const analysisJsonStr = analysisText.replace(/```json/g, '').replace(/```/g, '').trim();

        let alignmentData = {};
        try {
            alignmentData = JSON.parse(analysisJsonStr);
        } catch (e) {
            console.error("Analysis JSON parsing error", e);
            return res.status(500).json({ message: "Failed to generate alignment data" });
        }

        const finalPayload = {
            transcriptData,
            syllabusTopics,
            alignment: alignmentData,
            updatedAt: new Date().toISOString()
        };

        // Save to academic_alignment sub-collection
        await db
            .collection("users")
            .doc(clerkId)
            .collection("academic_alignment")
            .doc("latest")
            .set(finalPayload);

        // --- Loop Closing: Push to Learning Hub ---
        if (alignmentData.strategicBridgeModules && alignmentData.strategicBridgeModules.length > 0) {
            const courseRecs = alignmentData.strategicBridgeModules.map(moduleObj => ({
                skill: moduleObj.module,
                reason: moduleObj.bullets ? moduleObj.bullets.join(' ') : (moduleObj.quickTake || 'Bridge Module')
            }));

            await db
                .collection("users")
                .doc(clerkId)
                .collection("saved_jobs")
                .doc("academic_enrichment_latest")
                .set({
                    jobType: "Academic Enrichment",
                    course_recommendations: courseRecs,
                    createdAt: new Date().toISOString()
                });
        }
        // --- End Loop Closing ---

        return res.status(200).json({
            message: "Academic documents processed successfully",
            data: finalPayload
        });

    } catch (error) {
        console.error("Error processing academic documents:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const getAcademicAlignment = async (req, res) => {
    try {
        const { clerkId } = req.params;

        if (!clerkId) {
            return res.status(400).json({ message: "Clerk ID is required" });
        }

        const docTracker = await db
            .collection("users")
            .doc(clerkId)
            .collection("academic_alignment")
            .doc("latest")
            .get();

        if (!docTracker.exists) {
            return res.status(404).json({ message: "No academic alignment data found" });
        }

        return res.status(200).json(docTracker.data());
    } catch (error) {
        console.error("Error fetching academic alignment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
