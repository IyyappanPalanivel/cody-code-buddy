// backend/utils/queryRepo.js
const { ChromaClient } = require("chromadb");
const { getEmbedder } = require("./embeddingProvider");

const chroma = new ChromaClient({ path: "http://localhost:8000" });

async function queryRepo(repoId, userQuery, topK = 5) {
  const embedder = await getEmbedder('ollama'); // later make this dynamic
  const queryEmbedding = await embedder.embedQuery(userQuery);

  const collection = await chroma.getCollection({ name: repoId });
  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK,
  });

  const documents = results.documents?.[0] || [];
  const metadatas = results.metadatas?.[0] || [];

  const matches = documents.map((doc, i) => ({
    text: doc,
    file: metadatas[i]?.file || 'unknown',
    score: results.distances?.[0]?.[i] || 0,
  }));

  return matches;
}

module.exports = { queryRepo };
