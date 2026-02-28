import { geminiModel } from './config/gemini.js';

async function test() {
  try {
    const result = await geminiModel.generateContent("Hello, are you active? Just reply YES.");
    console.log("Gemini Response:", result.response.text());
  } catch (e) {
    console.error("Gemini Test Failed:", e.message);
  }
}

test();
