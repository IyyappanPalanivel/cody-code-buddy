// backend/utils/embeddingProvider.js
const { HuggingFaceInferenceEmbeddings } = require("@langchain/community/embeddings/hf");
const { OllamaEmbeddings } = require("@langchain/ollama")
// const { OpenAIEmbeddings } = require("@langchain/openai"); // Optional

require('dotenv').config();

// TODO: add Groq and Ollama when ready

async function getEmbedder(source = 'ollama') {
  switch (source) {
    case 'openai':
    //   return new OpenAIEmbeddings({
    //     modelName: "text-embedding-ada-002", // example
    //   });
    throw new Error(`${source} embeddings not implemented yet.`);
    case 'huggingface':
      return new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HUGGINGFACEHUB_API_KEY,
      });
    case 'ollama':
      return new OllamaEmbeddings({
        model: "nomic-embed-text", // Default value
        baseUrl: "http://localhost:11434", // Default value
      });
    case 'groq':
      throw new Error(`${source} embeddings not implemented yet.`);
    default:
      throw new Error(`Unknown embedding source: ${source}`);
  }
}

module.exports = { getEmbedder };
