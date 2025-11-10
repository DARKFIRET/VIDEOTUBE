<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'description', 'video_path', 'poster_path', 'views'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // app/Models/Video.php

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function likedByUser($userId)
    {
        return $this->likes()->where('user_id', $userId)->exists();
    }
}
