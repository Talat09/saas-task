const axios = require("axios");
const Summary = require("../models/Summary");

const generateSummary = async (
  userId,
  prompt,
  text,
  model = "gpt-3.5-turbo"
) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages: [
          { role: "system", content: "You are a helpful text summarizer." },
          { role: "user", content: `${prompt}: ${text}` },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data.choices[0].message.content;
    const wordCount = summary.split(/\s+/).length;

    // Save to database
    const newSummary = await Summary.create({
      user: userId,
      originalText: text,
      prompt,
      summary,
      wordCount,
      modelUsed: model,
    });

    return { prompt, text, summary, wordCount, model, id: newSummary._id, cached: false };
  } catch (error) {
    console.error("AI Service Error:", error.response?.data || error.message);
    throw new Error("Failed to generate summary");
  }
};

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}

module.exports = { generateSummary };
