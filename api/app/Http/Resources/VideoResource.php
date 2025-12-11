<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use FFMpeg\FFMpeg;
use Illuminate\Support\Facades\Cache;

class VideoResource extends JsonResource
{
    public function toArray($request): array
    {
        $user = $request->user('sanctum');

        // Вычисляем длительность ТОЛЬКО для одного видео (show), НЕ для коллекции
        $duration = null;
        if (!$this->resource instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            $duration = $this->getDuration();
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'video_url' => $this->video_path ? asset('storage/' . $this->video_path) : null,
            'poster_url' => $this->poster_path ? asset('storage/' . $this->poster_path) : null,
            'views' => $this->views,
            'duration' => $duration, // ← ВОТ ОНО!
            'likes_count' => $this->likes()->count(),
            'is_liked' => $user ? $this->likedByUser($user->id) : false,
            'user' => new UserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Получить длительность видео (mm:ss) с кэшированием
     */
    protected function getDuration(): ?string
    {
        if (!$this->video_path) {
            return null;
        }

        $filePath = storage_path('app/public/' . $this->video_path);

        if (!file_exists($filePath)) {
            return null;
        }

        return Cache::remember("video_duration_{$this->id}", 3600, function () use ($filePath) {
            try {
                $ffmpeg = FFMpeg::create([
                    'timeout' => 30,
                ]);
                $video = $ffmpeg->open($filePath);
                $seconds = (int) $video->getFormat()->get('duration');
                return gmdate('i:s', $seconds);
            } catch (\Exception $e) {
                \Log::warning("FFmpeg error for video {$this->id}: " . $e->getMessage());
                return null;
            }
        });
    }
}
