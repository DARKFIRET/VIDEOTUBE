import { useState } from "react";
import { mockVideos, currentUser } from "@/data/mockData";
import { Video } from "@/types/video";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userVideos, setUserVideos] = useState<Video[]>(
    currentUser ? mockVideos.filter((v) => v.userId === currentUser.id) : []
  );
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    videoUrl: "",
  });

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
      month: "short",
      day: "numeric",
    });
  };

  const handleUpload = () => {
    if (!currentUser) return;
    
    const newVideo: Video = {
      id: `video-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      thumbnailUrl: formData.thumbnailUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      videoUrl: formData.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      channelName: currentUser.name,
      channelAvatar: currentUser.avatar,
      viewCount: 0,
      likeCount: 0,
      uploadDate: new Date().toISOString().split("T")[0],
      userId: currentUser.id,
    };
    setUserVideos([newVideo, ...userVideos]);
    setIsUploadDialogOpen(false);
    setFormData({ title: "", description: "", thumbnailUrl: "", videoUrl: "" });
  };

  const handleEdit = () => {
    if (selectedVideo) {
      const updatedVideos = userVideos.map((v) =>
        v.id === selectedVideo.id
          ? {
              ...v,
              title: formData.title,
              description: formData.description,
              thumbnailUrl: formData.thumbnailUrl,
              videoUrl: formData.videoUrl,
            }
          : v
      );
      setUserVideos(updatedVideos);
      setIsEditDialogOpen(false);
      setSelectedVideo(null);
      setFormData({ title: "", description: "", thumbnailUrl: "", videoUrl: "" });
    }
  };

  const handleDelete = () => {
    if (selectedVideo) {
      setUserVideos(userVideos.filter((v) => v.id !== selectedVideo.id));
      setIsDeleteDialogOpen(false);
      setSelectedVideo(null);
    }
  };

  const openEditDialog = (video: Video) => {
    setSelectedVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.videoUrl,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (video: Video) => {
    setSelectedVideo(video);
    setIsDeleteDialogOpen(true);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg p-12 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Please Log In</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to view your profile</p>
            <Button onClick={() => navigate("/login")}>Go to Login</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentUser.name}</h1>
                <p className="text-gray-600">{userVideos.length} videos</p>
              </div>
            </div>
            <Button onClick={() => setIsUploadDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Upload Video
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Your Videos</h2>
          {userVideos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">You haven't uploaded any videos yet</p>
              <Button onClick={() => setIsUploadDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Upload Your First Video
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                  <div
                    className="relative aspect-video overflow-hidden bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/video/${video.id}`)}
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2 text-gray-900">
                      {video.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      {formatViews(video.viewCount)} views • {formatDate(video.uploadDate)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(video)}
                        className="flex-1 gap-2"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(video)}
                        className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload New Video</DialogTitle>
            <DialogDescription>
              Add details about your video. Click upload when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter video title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter video description"
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
              <Input
                id="thumbnail"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="video">Video URL (optional)</Label>
              <Input
                id="video"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://example.com/video.mp4"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!formData.title || !formData.description}>
              Upload Video
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
            <DialogDescription>
              Update your video details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter video title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter video description"
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-thumbnail">Thumbnail URL</Label>
              <Input
                id="edit-thumbnail"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-video">Video URL</Label>
              <Input
                id="edit-video"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://example.com/video.mp4"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={!formData.title || !formData.description}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your video
              "{selectedVideo?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}