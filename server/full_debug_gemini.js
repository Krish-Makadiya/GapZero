import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function check() {
  try {
    // The listModels method is on the genAI object in some versions
    // but let's try to get it from the API directly if needed.
    // For now, let's just try the most basic model ever.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Using model:", model.model);
    const result = await model.generateContent("Hi");
    console.log("Success:", result.response.text());
  } catch (e) {
    console.error("Error Details:", e);
  }
}

check();
