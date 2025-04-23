// frontend/src/pages/Home.tsx
import React, { useState } from 'react'
import ChatBox from "../components/ChatBox";
import ModelSwitcher from "../components/ModelSwitcher";
import RepoUploader from "../components/RepoUploader";

const Home = () => {
    const [repoId, setRepoId] = useState<string | null>(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div>
                <RepoUploader onRepoConnected={setRepoId}/>
                <ModelSwitcher />
            </div>
            {repoId && <ChatBox repoId={repoId} />}
        </div>
    );
}

export default Home;