const express = require("express");
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Transfer-Encoding", "chunked");

    const ollamaResponse = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3.2",
        prompt: prompt,
        stream: true,
      },
      { responseType: "stream" }
    );

    ollamaResponse.data.on("data", (chunk) => {
      const chunkStr = chunk.toString().trim();
      res.write(`${JSON.stringify({ response: chunkStr })}\n`);
    });

    ollamaResponse.data.on("end", () => {
      res.end();
    });
  } catch (error) {
    console.error("Error calling Ollama API:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
