// backend/utils/indexRepo.js

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { ChromaClient } = require("chromadb");

const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { getEmbedder } = require('./embeddingProvider');

const chroma = new ChromaClient({ path: "http://localhost:8000" });

async function getChunksFromFiles(repoPath) {
  console.log(`Getting chunks from files`);
  const chunks = [];
  const includedFiles = [];

  const walk = async (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (let entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (
        entry.name.endsWith('.js') ||
        entry.name.endsWith('.ts') ||
        entry.name.endsWith('.jsx') ||
        entry.name.endsWith('.tsx') ||
        entry.name.endsWith('.md')
      ) {
        const content = fs.readFileSync(fullPath, 'utf-8');

        const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 500, chunkOverlap: 50
        });
        const parts = await splitter.splitText(content);

        includedFiles.push(fullPath);

        for (let part of parts) {
          chunks.push({
            id: uuidv4(),
            text: part,
            file: fullPath,
          });
        }
      }
    }
  };

  await walk(repoPath);

  return chunks;
}

async function indexRepo(repoId, repoPath) {
  console.log(`Indexing repo: ${repoId}`);
  const chunks = await getChunksFromFiles(repoPath);

  const embedder = await getEmbedder(); // TODO:- Dynamically get the selected embedder

  const embeddings = await Promise.all(chunks.map(c => embedder.embedQuery(c.text)));

  // Create or get collection
  const collection = await chroma.getOrCreateCollection({ name: repoId });

  await collection.add({
    ids: chunks.map(c => c.id),
    embeddings,
    documents: chunks.map(c => c.text),
    metadatas: chunks.map(c => ({ file: c.file }))
  });

  console.log(`✅ Indexed ${chunks.length} chunks for ${repoId}`);
}

module.exports = { indexRepo };
