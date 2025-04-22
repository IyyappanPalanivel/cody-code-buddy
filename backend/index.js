// backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// ✅ Root route to test backend
app.get('/', (req, res) => {
  res.send('🚀 Cody Backend is Running!');
});

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  console.log("Received from frontend:", message);
  res.json({ reply: `Echo: ${message}` });
});

app.listen(PORT, () => {
  console.log(`Cody backend listening at http://localhost:${PORT}`);
});
