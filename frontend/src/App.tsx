import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import VideoPage from "./pages/VideoPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChannelPage from "./pages/ChannelPage";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video/:id" element={<VideoPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/channel/:userId" element={<ChannelPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;