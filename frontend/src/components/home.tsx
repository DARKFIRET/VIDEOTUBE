import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";

interface Video {
  id: number;
  title: string;
  poster_url: string;
  duration?: string;
  created_at?: string;
  views?: number;
  likes_count?: number;
  user?: {
    channel_name: string;
  };
}

export default function Home() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Токен
  const token = localStorage.getItem("token");
  const getAuthHeader = () => {
    if (!token) return null;
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    return `Bearer ${cleanToken}`;
  };

  useEffect(() => {
    const authHeader = getAuthHeader();

    const fetchVideos = async () => {
      try {
        const url = authHeader
          ? "http://127.0.0.1:8000/api/videos" // авторизован — все видео
          : "http://127.0.0.1:8000/api/videos?public=1"; // неавторизован — только публичные (если есть)

        const res = await fetch(url, {
          headers: authHeader
            ? {
                Authorization: authHeader,
                Accept: "application/json",
              }
            : {
                Accept: "application/json",
              },
        });

        if (!res.ok) throw new Error("Не удалось загрузить видео");

        const data = await res.json();

        // Берём массив видео из data.data (Laravel pagination)
        const videoList: Video[] = Array.isArray(data.data)
          ? data.data
          : data.data?.data || [];

        setVideos(videoList);
      } catch (err: any) {
        setError(err.message);
        console.error("Fetch videos error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка видео...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:underline"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {videos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">Видео пока нет</p>
            <p className="text-sm text-gray-500">
              {token ? "Загрузите первое видео на своём канале!" : "Войдите, чтобы увидеть больше"}
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Рекомендации
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  // Клик по карточке → переход на видео
                  onClick={() => navigate(`/video/${video.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}