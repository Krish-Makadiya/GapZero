import ytSearch from 'yt-search';
import axios from 'axios';
import { geminiModel } from '../config/gemini.js';

export const getMicroLesson = async (req, res) => {
  const { missingSkill } = req.body; // e.g., "Docker Compose"

  if (!missingSkill) {
    return res.status(400).json({ success: false, message: "Skill is required" });
  }

  try {
    console.log(`🔍 Searching YouTube for: "${missingSkill}"...`);
    // Clean query (slashes cause issues in search)
    const cleanSkill = missingSkill.replace(/\//g, ' ');
    console.log(`Cleaned skill query: "${cleanSkill}"`);
    const searchResults = await ytSearch(`${cleanSkill} masterclass tutorial`);
    console.log(`YouTube search found ${searchResults?.videos?.length || 0} videos.`);

    // Filter for educational length (2 to 30 mins) and exclude noise keywords
    let potentialVideos = searchResults.videos
      .filter(v => {
        const title = v.title.toLowerCase();
        const hasNoise = /live|gaming|shorts|vlog|trailer|unboxing|podcast/i.test(title);
        return v.seconds > 120 && v.seconds < 1800 && !hasNoise;
      })
      .slice(0, 5); // Pick top 5 quality candidates

    // Lenient Filtering: Allow shorter videos if no main tutorial is found
    if (potentialVideos.length === 0) {
      console.log("Strict filter returned 0, trying lenient filter (30s+)...");
      potentialVideos = searchResults.videos
        .filter(v => v.seconds > 30)
        .slice(0, 3);
    }

    if (potentialVideos.length === 0 && searchResults.videos.length > 0) {
      console.log("Leniency fallback to raw results.");
      potentialVideos = searchResults.videos.slice(0, 3);
    }

    // Pick the top valid video
    let topVideo = potentialVideos[0];
    if (!topVideo) {
      throw new Error("No videos found even in raw search results.");
    }
    let videoId = topVideo.videoId;
    let transcriptRaw = null;
    let formattedTranscript = "";

    // ==========================================
    // STEP 4: FETCH TRANSCRIPT VIA RAPIDAPI
    // ==========================================
    const fetchTranscriptRapid = async (vid) => {
      const apiKey = process.env.RAPIDAPI_KEY;
      if (!apiKey || apiKey === 'YOUR_RAPID_API_KEY_HERE') {
        throw new Error("RapidAPI key not configured");
      }

      const options = {
        method: 'GET',
        url: 'https://youtube-transcript3.p.rapidapi.com/api/transcript',
        params: { videoId: vid },
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'youtube-transcript3.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      return response.data; // Example: { transcript: [{ text: "...", start: 0, duration: 2 }] }
    };

    try {
      console.log(`📜 Attempting RapidAPI transcript for video ID: ${videoId}...`);
      const data = await fetchTranscriptRapid(videoId);
      console.log("RapidAPI raw response received.");

      const captions = data.transcript || (Array.isArray(data) ? data : null);

      if (Array.isArray(captions) && captions.length > 0) {
        transcriptRaw = captions;
        formattedTranscript = transcriptRaw
          .slice(0, 200) // Increase context slightly
          .map(t => {
            const time = t.start !== undefined ? t.start : (t.offset !== undefined ? t.offset : 0);
            const content = t.text || t.s || "";
            return `[${Math.round(time)}s] ${content}`;
          })
          .join('\n');
        console.log("✅ Transcript successfully grabbed via RapidAPI");
      }
    } catch (e) {
      console.warn("RapidAPI failed:", e.message);
      console.log("Moving to Smart Generation (no-transcript mode).");
    }

    // ==========================================
    // STEP 5: GEMINI GENERATION (WITH SMART FALLBACK)
    // ==========================================
    let prompt = "";
    if (formattedTranscript) {
      prompt = `
        You are an AI assistant helping a student follow a video tutorial. 
        Target Skill: "${missingSkill}".
        Video Title: "${topVideo.title}"
        Transcript Snippet:
        ${formattedTranscript}
        
        Task: Extract the exact, chronological points the tutor makes in this transcript and format them as beautifully structured Markdown revision notes. 
        Rules:
        1. ONLY return a valid JSON object.
        2. Format MUST be exactly: 
        {
          "start": number, 
          "end": number, 
          "revisionNotes": "### Markdown Content Here..."
        }
      `;
    } else {
      // SMART FALLBACK PROMPT
      prompt = `
        You are an expert tutor teaching: "${missingSkill}".
        The user is watching a video titled: "${topVideo.title}".
        I couldn't retrieve the transcript, so I need you to generate "Professional Revision Notes" that would typically cover this topic for a beginner.
        
        Task: Generate beautifully structured Markdown notes as if they were written by a human tutor for this video.
        Include:
        1. ### Key Concepts
        2. ### Step-by-Step Implementation (if applicable)
        3. ### Essential Commands/Terms (with \`code blocks\`)
        
        Rules:
        1. ONLY return a valid JSON object.
        2. Guess the most relevant 'start' and 'end' seconds based on the title (usually 0 to 180).
        3. Format MUST be exactly: 
        {
          "start": number, 
          "end": number, 
          "revisionNotes": "### [Content Here with **bolding** and *italics*]"
        }
      `;
    }

    console.log(`🤖 Sending to Gemini... Prompt Length: ${prompt.length}`);
    let aiData = null;

    try {
      const result = await geminiModel.generateContent(prompt);
      const geminiText = result.response.text().trim();
      console.log("Gemini response length:", geminiText.length);

      const jsonMatch = geminiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiData = JSON.parse(jsonMatch[0]);
        console.log("Successfully parsed Gemini JSON.");
      }
    } catch (geminiError) {
      console.error("Gemini Generation/Parse failed:", geminiError.message);
      // We'll handle the null aiData below
    }

    // FINAL FALLBACK: If Gemini failed or returned junk
    if (!aiData) {
      console.log("Using static high-quality fallback for notes.");
      aiData = {
        start: 0,
        end: 300,
        revisionNotes: `### 📘 AI Study Guide: ${missingSkill}\n\n* **Core Architecture:** Understanding how ${missingSkill} integrates with modern development workflows.\n* **Implementation Strategy:** \n   1. **Initialization:** Setting up the core environment and configuration files.\n   2. **Logic Construction:** Building out the primary functionality and state management.\n   3. **Deployment:** Bundling and optimizing for production environments.\n* **Modern Best Practices:** \n   * \`Keep components modular\` for better reuse.\n   * \`Optimize data fetching\` to prevent performance bottlenecks.\n\n> *Note: AI-powered specific timestamp analysis is currently limited, showing generalized high-level concepts for this video.*`
      };
    }

    return res.json({
      success: true,
      skill: missingSkill,
      videoTitle: topVideo?.title || `${missingSkill} Tutorial`,
      videoId: videoId,
      start: aiData.start || 0,
      end: aiData.end || 180,
      revisionNotes: aiData.revisionNotes,
      embedUrl: `https://www.youtube.com/embed/${videoId}?start=${aiData.start || 0}&end=${aiData.end || 180}&autoplay=1`
    });

  } catch (error) {
    console.error("Micro-lesson pipeline critical failure:", error);
    return res.json({
      success: false,
      message: "We couldn't generate a micro-lesson for this skill right now. Please try again later.",
      skill: missingSkill
    });
  }
};

export const identifySkillGaps = async (req, res) => {
  const { userSkills, jobDescription } = req.body;

  if (!userSkills || !jobDescription) {
    return res.status(400).json({ success: false, message: "User skills and Job Description are required" });
  }

  try {
    const prompt = `
            You are a career consultant. 
            Compare the user's skills with the following job description.
            Identify the top 3-5 technical skills that the user is missing or could improve upon to be a better fit for this role.
            
            User Skills: ${Array.isArray(userSkills) ? userSkills.join(", ") : userSkills}
            
            Job Description: ${jobDescription}
            
            Rules:
            1. ONLY return a valid JSON array of strings. 
            2. Format MUST be exactly: ["Skill 1", "Skill 2", "Skill 3"]
            3. Focus on concrete technical skills (e.g., "Docker", "Redux", "TypeScript").
        `;

    const result = await geminiModel.generateContent(prompt);
    const geminiText = result.response.text().trim();

    const cleanJson = geminiText.replace(/```json|```/g, "").trim();
    const skillGaps = JSON.parse(cleanJson);

    return res.json({
      success: true,
      skillGaps
    });
  } catch (error) {
    console.error("Skill gap analysis failed:", error);
    return res.status(500).json({ success: false, message: "Analysis failed", fallback: ["React", "Node.js", "Docker"] });
  }
};