// frontend/src/pages/Home.tsx
import ChatBox from "../components/ChatBox";
import ModelSwitcher from "../components/ModelSwitcher";
import RepoUploader from "../components/RepoUploader";

const Home = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div>
                <RepoUploader />
                <ModelSwitcher />
            </div>
            <ChatBox />
        </div>
    );
}

export default Home;