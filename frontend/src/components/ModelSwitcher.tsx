import React from 'react'

const ModelSwitcher = () => {
  return (
    <div className="bg-gray-800 p-4 rounded text-white mt-4">
      <h2 className="text-lg mb-2 font-semibold">Model Selector</h2>
      <select className="bg-gray-700 p-2 rounded w-full">
        <option>Ollama (Local)</option>
        <option>GROQ</option>
        <option>OpenAI</option>
      </select>
    </div>
  )
}

export default ModelSwitcher