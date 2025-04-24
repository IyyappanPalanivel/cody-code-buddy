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

app.post('/api/chat', (req, res) => {
  const { message, repoId } = req.body; // Now includes repoId

  // If repoId is provided, find the corresponding folder
  let repoInfo = {};
  if (repoId) {
    const clonePath = path.join(__dirname, 'cloned-repos', repoId);

    // Check if repo exists
    if (fs.existsSync(clonePath)) {
      const files = fs.readdirSync(clonePath);
      repoInfo = { repoName: repoId, files };  // You can add more metadata if needed
    }
  }

  // Construct a dummy response based on message and repo context
  let reply = 'I didn’t get that. Can you please clarify?';

  if (repoInfo.repoName) {
    // Add basic repo details in response for now (expandable with more logic)
    reply = `Your repo '${repoInfo.repoName}' contains files like ${repoInfo.files.join(', ')}. How can I help you with it?`;
  }

  res.json({ reply });
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
