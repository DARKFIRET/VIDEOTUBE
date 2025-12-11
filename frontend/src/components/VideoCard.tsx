import { Card, CardContent } from "@/components/ui/card";
import { Play, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VideoCardProps {
  video: {
    id: number;
    title: string;
    poster_url: string; // УЖЕ ПОЛНЫЙ URL: http://127.0.0.1:8000/storage/posters/...
    duration?: string;
    created_at?: string;
    user?: {
      id: number;
      channel_name: string;
      profile_picture_url?: string;
    };
  };
  onClick?: () => void;
}

export default function VideoCard({ video }: VideoCardProps) {
  const navigate = useNavigate();

  // БЕРЁМ poster_url КАК ЕСТЬ — НЕ ДОБАВЛЯЕМ НИЧЕГО!
  const posterUrl = video.poster_url || "https://via.placeholder.com/320x180.png?text=Нет+постера";

  // Форматируем "1 ч. назад", "3 д. назад"
  const formatTimeAgo = (dateString?: string): string => {
    if (!dateString) return "Недавно";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Только что";
    if (diffMins < 60) return `${diffMins} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays < 7) return `${diffDays} д. назад`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} нед. назад`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} мес. назад`;
    return `${Math.floor(diffDays / 365)} г. назад`;
  };

  const handleChannelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (video.user?.id) {
      navigate(`/channel/${video.user.id}`);
    }
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer group border-0"
      onClick={() => navigate(`/video/${video.id}`)}
    >
      {/* Обложка */}
      <div className="relative aspect-video bg-gray-100">
        <img
          src={posterUrl}
          alt={video.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = "https://via.placeholder.com/320x180.png?text=Ошибка";
            console.warn("Poster load failed:", posterUrl);
          }}
        />

        {/* Play иконка при наведении */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        {/* Длительность */}
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
            {video.duration}
          </span>
        )}
      </div>

      {/* Инфо */}
      <CardContent className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2 leading-tight mb-1">
          {video.title}
        </h3>

        {video.user && (
          <div
            className="flex items-center gap-2 mb-2 mt-2 w-fit cursor-pointer group/channel"
            onClick={handleChannelClick}
          >
            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {video.user.profile_picture_url ? (
                <img
                  src={video.user.profile_picture_url}
                  alt={video.user.channel_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-500">
                  {video.user.channel_name[0]}
                </div>
              )}
            </div>
            <div
              className="text-xs text-gray-600 group-hover/channel:text-gray-900 font-medium transition-colors"
              title={video.user.channel_name}
            >
              {video.user.channel_name}
            </div>
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTimeAgo(video.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  );
}