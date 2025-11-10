import { useParams, useNavigate } from "react-router-dom";
import { mockVideos, mockUsers } from "@/data/mockData";
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ChannelPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const channel = mockUsers.find((u) => u.id === userId);
  const channelVideos = mockVideos.filter((v) => v.userId === userId);

  if (!channel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">Channel not found</p>
        </div>
      </div>
    );
  }

  const formatViews = (videos: typeof mockVideos) => {
    const totalViews = videos.reduce((sum, v) => sum + v.viewCount, 0);
    if (totalViews >= 1000000) {
      return `${(totalViews / 1000000).toFixed(1)}M`;
    } else if (totalViews >= 1000) {
      return `${(totalViews / 1000).toFixed(1)}K`;
    }
    return totalViews.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={channel.avatar} alt={channel.name} />
              <AvatarFallback className="text-3xl">{channel.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{channel.name}</h1>
              {channel.description && (
                <p className="text-gray-600 mb-3">{channel.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{channelVideos.length} видео</span>
                <span>•</span>
                <span>{formatViews(channelVideos)} просмотров</span>
              </div>
            </div>
            <Button size="lg">Подписаться</Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Видео</h2>
          {channelVideos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">На этом канале пока нет видео</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {channelVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
