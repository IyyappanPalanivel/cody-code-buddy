// backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const simpleGit = require('simple-git');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

require('dotenv').config(); // Load environment variables from .env file

const { indexRepo } = require('./src/utils/indexRepo');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Root route to test backend
app.get('/', (req, res) => {
  res.send('🚀 Cody Backend is Running!');
});

const { ChatGroq } = require("@langchain/groq");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const model = new ChatGroq({
  model: "llama3-8b-8192", // or mixtral/other supported model
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.2,
});

app.post('/api/chat', async (req, res) => {
  const { message, repoId } = req.body; // Now includes repoId

  // If repoId is provided, find the corresponding folder
  let repoInfo = {};
  try {
    const messages = [
      new SystemMessage("You are Cody, an AI assistant that helps developers with their code."),
      new HumanMessage(message),
    ];

    const response = await model.invoke(messages);

    res.json({ reply: response.content });
  } catch (err) {
    console.error("LangChain error:", err.message);
    res.status(500).json({ reply: "Something went wrong." });
  }

});

app.post('/api/index-repo', async (req, res) => {
  const { repoUrl, refresh } = req.body;
  const repoName = path.basename(repoUrl, '.git');
  const clonePath = path.join(__dirname, 'cloned-repos', repoName);

  try {
    if (fs.existsSync(clonePath)) {
      if (refresh) {
        fs.rmSync(clonePath, { recursive: true, force: true });
        console.log(`🔁 Refreshing repo ${repoName}`);
      } else {
        console.log(`📦 Repo ${repoName} already cloned, skipping clone.`);
      }
    }

    if (!fs.existsSync(clonePath)) {
      const git = simpleGit();
      await git.clone(repoUrl, clonePath);
    }

    // 🔗 NEW: Index the repo after it's cloned
    await indexRepo(repoName, clonePath);

    const files = fs.readdirSync(clonePath);
    res.json({ success: true, repoName, files });
  } catch (error) {
    console.error("Clone/Index error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🧠 Cody backend listening at http://localhost:${PORT}`);
});
