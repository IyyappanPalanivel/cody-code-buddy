// frontend/src/components/ChatBox.tsx
import { useState } from "react";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });
    const data = await res.json();
    setResponse(data.reply);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <textarea
        className="w-full border p-2 rounded"
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about your repo..."
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleSend}
      >
        Ask Cody
      </button>
      {response && (
        <div className="mt-4 p-3 bg-gray-100 rounded">{response}</div>
      )}
    </div>
  );
}
