import { Video } from "@/types/video";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const navigate = useNavigate();

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden border-0 bg-white"
      onClick={() => navigate(`/video/${video.id}`)}
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-3">
        <div className="flex gap-3">
          <Avatar 
            className="w-9 h-9 flex-shrink-0 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/channel/${video.userId}`);
            }}
          >
            <AvatarImage src={video.channelAvatar} alt={video.channelName} />
            <AvatarFallback>{video.channelName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-gray-900">
              {video.title}
            </h3>
            <p 
              className="text-xs text-gray-600 mb-1 hover:text-gray-900 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/channel/${video.userId}`);
              }}
            >
              {video.channelName}
            </p>
            <p className="text-xs text-gray-600">
              {formatViews(video.viewCount)} views • {formatDate(video.uploadDate)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}