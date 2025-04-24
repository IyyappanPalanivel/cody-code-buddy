const { ChromaClient } = require("chromadb");

// TEMP: Replace with real embedding logic later
async function fakeEmbed(text) {
    return text.split(" ").slice(0, 10).map((_, i) => i * 0.1); // dummy vector
}

async function getRelevantChunks(query, repoName, topK = 5) {
    const chroma = new ChromaClient({ path: "http://localhost:8000" });
    const collection = await chroma.getCollection({ name: repoName });

    const queryEmbedding = await fakeEmbed(query);

    const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: topK,
    });

    const chunks = results.documents[0].map((doc, i) => ({
        text: doc,
        metadata: results.metadatas[0][i],
        score: results.distances[0][i], // optional: show similarity
    }));

    return chunks;
}

module.exports = { getRelevantChunks };
