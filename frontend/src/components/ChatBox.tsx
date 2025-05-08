// frontend/src/components/ChatBox.tsx
import React, { useState } from 'react';
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ChatBoxProps {
  repoId: string;
}

export default function ChatBox({ repoId }: ChatBoxProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([]);

  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          repoId, // 🧠 Send repo context here
        }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "bot", content: data.reply }]);
      console.error("Chat error:", error);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-900 text-white rounded-xl shadow-md">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded leading-relaxed ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"
              }`}
          >
            <div className="font-semibold mb-1">
              {msg.role === "user" ? "🧑 You" : "🤖 Cody"}
            </div>
            {msg.role === "bot" ? (
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-700 px-1 py-0.5 rounded" {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {msg.content}
              </ReactMarkdown>
            ) : (
              <p>{msg.content}</p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-gray-800 text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your code..."
        />
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
