<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVideoRequest;
use App\Http\Requests\UpdateVideoRequest;
use App\Http\Resources\VideoResource;
use App\Models\Video;
use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VideoController extends Controller
{
    // app/Http/Controllers/Api/VideoController.php

    public function index(Request $request)
    {
        $query = Video::with('user');

        // 1. Поиск по названию видео
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }


        // 2. Поиск по ID пользователя
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Сортировка и пагинация
        $videos = $query->latest()->paginate(10);

        // Сохраняем ВСЕ фильтры в ссылках пагинации
        $videos->appends($request->only(['search', 'channel', 'user_id']));

        return VideoResource::collection($videos);
    }

    public function store(StoreVideoRequest $request)
    {
        $data = $request->validated();

        $videoPath = $request->file('video')->store('videos', 'public');
        $posterPath = $request->file('poster')->store('posters', 'public');

        $video = Video::create([
            'user_id'     => auth()->id() ?? 1,
            'title'       => $data['title'],
            'description' => $data['description'] ?? null,
            'video_path'  => $videoPath,
            'poster_path' => $posterPath,
        ]);

        return new VideoResource($video);
    }

    public function show($id)
    {
        $video = Video::findOrFail($id);
        $video->increment('views');
        return new VideoResource($video->load('user'));
    }

    public function update(UpdateVideoRequest $request, $id)
    {
        $video = Video::findOrFail($id);

        if ($video->user_id !== auth()->id()) {
            return response()->json(['error' => 'Вы не можете редактировать чужое видео.'], 403);
        }

        $data = $request->validated();

        if ($request->hasFile('video')) {
            Storage::disk('public')->delete($video->video_path);
            $video->video_path = $request->file('video')->store('videos', 'public');
        }

        if ($request->hasFile('poster')) {
            if ($video->poster_path) {
                Storage::disk('public')->delete($video->poster_path);
            }
            $video->poster_path = $request->file('poster')->store('posters', 'public');
        }

        $video->update([
            'title'       => $data['title'] ?? $video->title,
            'description' => $data['description'] ?? $video->description,
        ]);

        return new VideoResource($video);
    }

    public function destroy($id)
    {
        $video = Video::findOrFail($id);

        if ($video->user_id !== auth()->id()) {
            return response()->json(['error' => 'Доступ запрещён'], 403);
        }

        Storage::disk('public')->delete([$video->video_path, $video->poster_path]);
        $video->delete();

        return response()->json(['message' => 'Видео удалено']);
    }

    public function like($id)
    {
        $user = auth()->user();
        $video = Video::findOrFail($id);

        $like = $video->likes()->where('user_id', $user->id)->first();

        if ($like) {
            $like->delete();
            $status = 'unliked';
        } else {
            Like::create([
                'user_id' => $user->id,
                'video_id' => $video->id,
            ]);
            $status = 'liked';
        }

        return response()->json([
            'message' => $status === 'liked' ? 'Видео понравилось' : 'Лайк убран',
            'status' => $status,
            'likes_count' => $video->likes()->count(),
            'is_liked' => $status === 'liked',
        ]);
    }
}
