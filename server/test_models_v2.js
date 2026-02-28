import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// Try to use a different endpoint or version if possible
// The standard way doesn't allow passing version to constructor easily in this SDK version
// but let's try to use the model name with version if supported
async function check() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Sometimes the model needs to be prefixed with 'models/' if not already
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hi");
    console.log("Success with 1.5-flash:", result.response.text());
  } catch (e) {
    console.error("1.5-flash failed, trying 2.0-flash-exp...");
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      const result = await model.generateContent("Hi");
      console.log("Success with 2.0-flash-exp:", result.response.text());
    } catch (e2) {
      console.error("2.0-flash failed too:", e2.message);
    }
  }
}

check();
