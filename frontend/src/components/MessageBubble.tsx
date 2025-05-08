import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function MessageBubble({ message, isUser }) {
  return (
    <div className={`message-bubble ${isUser ? 'user' : 'bot'}`}>
      {isUser ? (
        <p>{message}</p>
      ) : (
        <ReactMarkdown>{message}</ReactMarkdown>
      )}
    </div>
  );
}

export default MessageBubble;