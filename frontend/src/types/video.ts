export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  channelName: string;
  channelAvatar: string;
  viewCount: number;
  likeCount: number;
  uploadDate: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  description?: string;
}