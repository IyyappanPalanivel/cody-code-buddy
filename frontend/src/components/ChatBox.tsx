// frontend/src/components/ChatBox.tsx
import { useState } from "react";

export default function ChatBox() {

  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages([...messages, "🧑: " + userMsg]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg }),
    });
    const data = await res.json();
    setMessages((prev) => [...prev, "🤖: " + data.reply]);
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-900 text-white rounded-xl shadow-md">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="p-2 bg-gray-800 rounded">{msg}</div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-gray-800 text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your code..."
        />
        <button className="px-4 py-2 bg-blue-600 rounded" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
