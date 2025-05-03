// backend/src/scripts/inspectCollection.js

const { ChromaClient } = require("chromadb");

async function inspectCollection(repoName) {
  const chroma = new ChromaClient({ path: "http://localhost:8000" });

  try {
    const collection = await chroma.getCollection({ name: repoName });

    const results = await collection.query({
      queryEmbeddings: [Array(1536).fill(0)], // Dummy embedding for query
      nResults: 10, // Inspect top 10 entries
    });

    console.log(`📊 Inspecting collection: ${repoName}`);
    results.documents[0].forEach((doc, i) => {
      const file = results.metadatas[0][i]?.file;
      const score = results.distances[0][i];
      console.log(`\n📝 Document #${i + 1}`);
      console.log(`📁 File: ${file}`);
      console.log(`📈 Similarity score: ${score}`);
      console.log(`📄 Text preview:\n${doc.slice(0, 300)}...`);
    });
  } catch (err) {
    console.error("❌ Error inspecting collection:", err.message);
  }
}

// Run with: node backend/utils/inspectCollection.js <repoName>
// Ex:- node src/scripts/inspectCollection.js cssm-adminpanel
const repoName = process.argv[2];
if (!repoName) {
  console.error("Usage: node inspectCollection.js <repoName>");
  process.exit(1);
}

inspectCollection(repoName);
