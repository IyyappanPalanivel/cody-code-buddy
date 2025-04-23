import React, { useState } from 'react'

const RepoUploader = () => {
  const [repoUrl, setRepoUrl] = useState("");

  interface RepoInfo {
    repoName: string;
    files: string[];
  }

  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [status, setStatus] = useState('idle'); // idle | connecting | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!repoUrl) return;
    setStatus('connecting');
    setMessage('');

    try {
      console.log("Repo URL:", repoUrl);
      const res = await fetch("http://localhost:3001/api/index-repo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await res.json();
      if (data.success) {
        setRepoInfo(data);

        setStatus('success');
        setMessage(`✅ Repo "${data.repoName}" connected!`);
      } else {
        setStatus('error');
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setStatus('error');
      setMessage(`❌ Network error: ${err.message}`);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded text-white">
      <h2 className="text-lg mb-2 font-semibold">Connect Your Repository</h2>
      <input
        className="p-2 w-full mb-2 bg-gray-700 rounded"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        placeholder="Enter GitHub Repo URL"
      />
      <button
        onClick={handleSubmit}
        className="bg-green-600 px-4 py-2 rounded"
        disabled={status === 'connecting'}
      >
        {status === 'connecting' ? 'Connecting...' : 'Connect Repo'}
      </button>
      <p className='mt-2'>{message}</p>

      {repoInfo && (
        <div className="mt-4 text-sm text-gray-200">
          <p><strong>Repo:</strong> {repoInfo.repoName}</p>
          <p><strong>Files:</strong></p>
          <ul className="list-disc ml-5">
            {repoInfo.files.map((file, i) => (
              <li key={i}>{file}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RepoUploader