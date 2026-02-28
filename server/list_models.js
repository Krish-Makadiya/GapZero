import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function list() {
  try {
    // This is not a direct method in genAI usually, but let's see
    console.log("Testing API key...");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("test");
    console.log("Success with gemini-pro");
  } catch (e) {
    console.error("Failed with gemini-pro:", e.message);
  }
}

list();
