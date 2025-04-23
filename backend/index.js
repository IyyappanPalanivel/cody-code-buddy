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
  const { repoUrl } = req.body;
  if (!repoUrl) {
    return res.status(400).json({ success: false, error: 'Repo URL required' });
  }

  const repoId = uuidv4();
  const clonePath = path.join(__dirname, 'cloned-repos', repoId);

  try {
    const git = simpleGit();
    await git.clone(repoUrl, clonePath);

    const files = fs.readdirSync(clonePath);
    const repoName = path.basename(repoUrl, '.git');

    res.json({
      success: true,
      repoName,
      repoId,
      files,
    });
  } catch (error) {
    console.error("Clone error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🧠 Cody backend listening at http://localhost:${PORT}`);
});
