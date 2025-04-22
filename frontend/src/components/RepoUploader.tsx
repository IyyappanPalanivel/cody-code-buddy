import React, { useState } from 'react'

const RepoUploader = () => {
  const [repoUrl, setRepoUrl] = useState("");

  const handleSubmit = () => {
    console.log("Repo URL:", repoUrl);
    // We'll integrate backend GitHub clone in Phase 2
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
      <button onClick={handleSubmit} className="bg-green-600 px-4 py-2 rounded">
        Connect Repo
      </button>
    </div>
  );
}

export default RepoUploader