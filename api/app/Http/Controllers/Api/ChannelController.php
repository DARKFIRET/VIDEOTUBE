<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Video;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Http\Resources\VideoResource;

class ChannelController extends Controller
{
    /**
     * Получить информацию о канале (пользователе)
     */
    public function show($id)
    {
        $user = User::findOrFail($id);

        return response()->json([
            'data' => new UserResource($user)
        ]);
    }

    /**
     * Получить видео канала
     */
    public function videos($id)
    {
        $videos = Video::where('user_id', $id)
            ->with('user') // Подгружаем автора, если нужно
            ->latest()
            ->get();

        // Можно добавить пагинацию, если видео много: ->paginate(12)

        return VideoResource::collection($videos);
    }
}
