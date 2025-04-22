// frontend/src/pages/Home.tsx
import ChatBox from "../components/ChatBox";
import ModelSwitcher from "../components/ModelSwitcher";
import RepoUploader from "../components/RepoUploader";

const Home = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">🤖 Cody – Your Code Buddy</h1>
            <RepoUploader />
            <ModelSwitcher />
            <ChatBox />
        </div>
    );
}

export default Home;