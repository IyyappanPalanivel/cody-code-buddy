// backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const simpleGit = require('simple-git');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Root route to test backend
app.get('/', (req, res) => {
  res.send('🚀 Cody Backend is Running!');
});

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  console.log("Received from frontend:", message);
  res.json({ reply: `Echo: ${message}` });
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

    const files = fs.readdirSync(clonePath);
    res.json({ success: true, repoName, files });
  } catch (error) {
    console.error("Clone error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🧠 Cody backend listening at http://localhost:${PORT}`);
});
