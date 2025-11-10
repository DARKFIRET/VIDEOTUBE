import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { mockVideos } from "@/data/mockData";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, ThumbsDown, Share2, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function VideoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const video = mockVideos.find((v) => v.id === id);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video?.likeCount || 0);

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">Video not found</p>
        </div>
      </div>
    );
  }

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
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
      setLiked(false);
    } else {
      setLikeCount(likeCount + 1);
      setLiked(true);
    }
  };

  const relatedVideos = mockVideos.filter((v) => v.id !== id).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden aspect-video">
              <video
                src={video.videoUrl}
                controls
                className="w-full h-full"
                poster={video.thumbnailUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="mt-4 bg-white rounded-lg p-4">
              <h1 className="text-xl font-bold text-gray-900 mb-3">
                {video.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  onClick={() => navigate(`/channel/${video.userId}`)}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={video.channelAvatar} alt={video.channelName} />
                    <AvatarFallback>{video.channelName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{video.channelName}</p>
                    <p className="text-sm text-gray-600">
                      {formatViews(video.viewCount)} views • {formatDate(video.uploadDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={liked ? "default" : "secondary"}
                    size="sm"
                    onClick={handleLike}
                    className="gap-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    {formatViews(likeCount)}
                  </Button>
                  <Button variant="secondary" size="sm" className="gap-2">
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-gray-600" />
                  <span className="font-semibold text-sm text-gray-900">
                    {formatViews(video.viewCount)} views
                  </span>
                  <span className="text-sm text-gray-600">
                    {formatDate(video.uploadDate)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {video.description}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Related Videos</h2>
            <div className="space-y-3">
              {relatedVideos.map((relatedVideo) => (
                <div
                  key={relatedVideo.id}
                  className="flex gap-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors"
                  onClick={() => navigate(`/video/${relatedVideo.id}`)}
                >
                  <div className="relative w-40 flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={relatedVideo.thumbnailUrl}
                      alt={relatedVideo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-gray-900">
                      {relatedVideo.title}
                    </h3>
                    <p className="text-xs text-gray-600">{relatedVideo.channelName}</p>
                    <p className="text-xs text-gray-600">
                      {formatViews(relatedVideo.viewCount)} views
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}