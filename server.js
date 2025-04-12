// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your actual Gemini API key from Google AI Studio
const GEMINI_API_KEY = "AIzaSyAIRj3t5KwD03Sx38NqD71Sg7GC7sYVgLA"; // 🔐 Don't share this!

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    // 🐞 Debugging logs
    console.log("✅ Request received at /chat");
    console.log("📨 Message from client:", userMessage);

    if (!userMessage) {
      console.log("⚠️ No message provided");
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: userMessage }
            ]
          }
        ]
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Sorry, I didn't get that.";
    console.log("🤖 Gemini reply:", reply);
    res.json({ reply });

  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("🔍 Gemini response error:", error.response.data);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("✅ Server is running at http://localhost:5000");
});
