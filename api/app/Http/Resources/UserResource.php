<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage; // <--- Импортируем Storage

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'channel_name' => $this->channel_name,
            'email' => $this->email,
            'channel_description' => $this->channel_description,
            // Генерируем полную URL-ссылку на аватар
            'profile_picture_url' => $this->profile_picture_path
                ? Storage::url($this->profile_picture_path)
                : null,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
