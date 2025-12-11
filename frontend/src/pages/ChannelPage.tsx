import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ChannelData {
  id: number;
  channel_name: string;
  channel_description: string;
  profile_picture_url: string; // Updated field
  email: string;
}

interface VideoData {
  id: number;
  title: string;
  poster_url: string; // URL from API
  views: number;
  duration?: string;
  created_at: string;
}

export default function ChannelPage() {
  const { userId } = useParams<{ userId: string }>();
  const [channel, setChannel] = useState<ChannelData | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Channel Info
        const userRes = await fetch(`http://127.0.0.1:8000/api/channels/${userId}`);
        if (!userRes.ok) throw new Error("Channel not found");
        const userData = await userRes.json();
        setChannel(userData.data);

        // 2. Fetch Channel Videos
        const videosRes = await fetch(`http://127.0.0.1:8000/api/channels/${userId}/videos`);
        if (videosRes.ok) {
          const videosData = await videosRes.json();
          setVideos(videosData.data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading channel...</p>
        </div>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">{error || "Channel not found"}</p>
        </div>
      </div>
    );
  }

  const formatViews = (videosList: VideoData[]) => {
    const totalViews = videosList.reduce((sum, v) => sum + v.views, 0);
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
              <AvatarImage src={channel.profile_picture_url} alt={channel.channel_name} />
              <AvatarFallback className="text-3xl">{channel.channel_name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{channel.channel_name}</h1>
              {channel.channel_description && (
                <p className="text-gray-600 mb-3">{channel.channel_description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{videos.length} видео</span>
                <span>•</span>
                <span>{formatViews(videos)} просмотров</span>
              </div>
            </div>
            <Button size="lg">Подписаться</Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Видео</h2>
          {videos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">На этом канале пока нет видео</p>
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
