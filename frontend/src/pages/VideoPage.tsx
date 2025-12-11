import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, Clock, ThumbsUp } from "lucide-react";

interface VideoData {
  id: number;
  title: string;
  description: string;
  video_url: string;
  poster_url: string;
  views: number;
  duration: string;
  likes_count: number;
  is_liked: boolean;
  created_at: string;
  user: {
    id: number;
    channel_name: string;
    profile_picture_url: string;
  };
}

export default function VideoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiking, setIsLiking] = useState(false);

  const token = localStorage.getItem("token");
  const getAuthHeader = () => {
    if (!token) return null;
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    return `Bearer ${cleanToken}`;
  };

  useEffect(() => {
    const authHeader = getAuthHeader();
    if (!authHeader) {
      navigate("/login");
      return;
    }

    const fetchVideo = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/videos/${id}`, {
          headers: {
            Authorization: authHeader,
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Видео не найдено");
        const data = await res.json();
        setVideo(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id, navigate]);

  // Лайк / анлайк
  const handleLike = async () => {
    if (!video || isLiking) return;

    const authHeader = getAuthHeader();
    if (!authHeader) {
      navigate("/login");
      return;
    }

    setIsLiking(true);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/videos/${video.id}/like`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Ошибка лайка");

      const result = await res.json();

      setVideo((prev) =>
        prev
          ? {
            ...prev,
            is_liked: result.is_liked,
            likes_count: result.likes_count,
          }
          : null
      );
    } catch (err) {
      alert("Не удалось поставить лайк"); // ИСПРАВЛЕНО: — → (
    } finally {
      setIsLiking(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)} млн`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)} тыс.`;
    return views.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Загрузка видео...</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Видео не найдено"}</p>
          <Button onClick={() => navigate(-1)}>Назад</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Видеоплеер */}
        <div className="bg-black rounded-xl overflow-hidden mb-6 aspect-video shadow-2xl relative group">
          <video
            src={video.video_url}
            poster={video.poster_url}
            controls
            className="w-full h-full object-contain"
            preload="metadata"
            onTimeUpdate={(e) => {
              const target = e.currentTarget;
              const percent = target.currentTime / target.duration;

              // Если просмотрено более 50% и просмотр ещё не засчитан
              if (percent > 0.5 && !sessionStorage.getItem(`viewed_${video.id}`)) {
                sessionStorage.setItem(`viewed_${video.id}`, "true");

                // Отправляем запрос на инкремент
                fetch(`http://127.0.0.1:8000/api/videos/${video.id}/view`, {
                  method: "POST",
                }).then(res => res.json()).then(data => {
                  if (data.views) {
                    setVideo(prev => prev ? ({ ...prev, views: data.views }) : null);
                  }
                }).catch(console.error);
              }
            }}
          >
            Ваш браузер не поддерживает видео.
          </video>
        </div>

        {/* Заголовок и метаданные */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {video.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{formatViews(video.views)} просмотров</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(video.created_at)}</span>
            </div>
          </div>

          {/* Кнопка лайка */}
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant={video.is_liked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              disabled={isLiking}
              className="flex items-center gap-1.5"
            >
              <ThumbsUp
                className="w-4 h-4"
                fill={video.is_liked ? "currentColor" : "none"}
              />
              <span>{video.likes_count}</span>
            </Button>
          </div>

          <Separator className="my-4" />

          {/* Автор */}
          <div
            className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate(`/channel/${video.user.id}`)}
          >
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={`http://127.0.0.1:8000${video.user.profile_picture_url}`}
                alt={video.user.channel_name}
              />
              <AvatarFallback>{video.user.channel_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">
                {video.user.channel_name}
              </p>
              <p className="text-sm text-gray-600">Канал</p>
            </div>
          </div>
        </div>

        {/* Описание */}
        {video.description && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-3">Описание</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{video.description}</p>
          </div>
        )}
      </main>
    </div>
  );
}