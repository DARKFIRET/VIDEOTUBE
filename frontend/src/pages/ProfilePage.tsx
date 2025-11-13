import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ChannelPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Форма загрузки
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Получаем и очищаем токен
  const rawToken = localStorage.getItem("token");
  const getAuthHeader = () => {
    if (!rawToken) return null;
    const token = rawToken.startsWith("Bearer ") ? rawToken.slice(7) : rawToken;
    return `Bearer ${token}`;
  };

  useEffect(() => {
    const authHeader = getAuthHeader();
    if (!authHeader) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: authHeader,
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Не авторизован");
        const data = await res.json();
        setUser(data.data);

        // Загружаем видео пользователя
        const vids = await fetch(
          `http://127.0.0.1:8000/api/videos?user_id=${data.data.id}`,
          {
            headers: {
              Authorization: authHeader,
              Accept: "application/json",
            },
          }
        );

        if (!vids.ok) throw new Error("Ошибка загрузки видео");
        const videoData = await vids.json();
        setVideos(videoData.data || []);
      } catch (err: any) {
        setError(err.message);
        if (err.message.includes("авториз")) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Загрузка видео
  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Введите название видео");
      return;
    }
    if (!videoFile) {
      alert("Выберите видео");
      return;
    }
    if (!posterFile) {
      alert("Выберите постер");
      return;
    }

    const authHeader = getAuthHeader();
    if (!authHeader) {
      navigate("/login");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("video", videoFile);
    formData.append("poster", posterFile);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/videos", {
        method: "POST",
        headers: {
          Authorization: authHeader,
          // НЕ указывай Content-Type — браузер сам добавит multipart/form-data с boundary
        },
        body: formData,
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.detail || responseData.message || "Ошибка загрузки");
      }

      // Добавляем новое видео в начало списка
      setVideos((prev) => [responseData.data, ...prev]);

      // Сброс формы
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setPosterFile(null);
      alert("Видео успешно загружено!");
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) return null;

  const profilePicture = `http://127.0.0.1:8000${user.profile_picture_url}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Профиль */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profilePicture} alt={user.channel_name} />
              <AvatarFallback className="text-3xl">
                {user.channel_name[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.channel_name}
              </h1>
              <p className="text-gray-600 mb-3">{user.channel_description}</p>
              <div className="text-sm text-gray-600">ID: {user.id}</div>
            </div>
          </div>
        </div>

        {/* Форма загрузки видео */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Добавить видео</h2>
          <form onSubmit={handleUploadVideo} className="space-y-4">
            <div>
              <Label htmlFor="title">Название видео *</Label>
              <Input
                id="title"
                type="text"
                placeholder="Моё крутое видео"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Расскажите, о чём видео..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="poster">Постер (обложка) *</Label>
              <Input
                id="poster"
                type="file"
                accept="image/*"
                onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
                required
              />
              {posterFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Выбран: {posterFile.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="video">Видео файл *</Label>
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                required
              />
              {videoFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Выбран: {videoFile.name}
                </p>
              )}
            </div>

            <Button type="submit" disabled={uploading} className="w-full sm:w-auto">
              {uploading ? "Загрузка..." : "Опубликовать видео"}
            </Button>
          </form>
        </div>

        <Separator className="my-6" />

        {/* Список видео */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Ваши видео ({videos.length})
          </h2>

          {videos.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <p className="text-lg">У вас пока нет видео</p>
              <p className="text-sm mt-2">Загрузите первое видео выше!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}