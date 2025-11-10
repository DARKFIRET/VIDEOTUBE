<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VideoController;

Route::get('/', fn() => "test");

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/user', fn(Request $request) =>
new \App\Http\Resources\UserResource($request->user())
);

// === ВИДЕО ===

Route::get('/videos', [VideoController::class, 'index']);
Route::get('/videos/{id}', [VideoController::class, 'show'])->where('id', '[0-9]+');

// === Создание видео (открыто для теста) ===


// === Защищённые маршруты ===
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/videos', [VideoController::class, 'store']);
    Route::put('/videos/{id}', [VideoController::class, 'update'])->where('id', '[0-9]+');
    Route::delete('/videos/{id}', [VideoController::class, 'destroy'])->where('id', '[0-9]+');
    Route::post('/videos/{id}/like', [VideoController::class, 'like'])->where('id', '[0-9]+');
});
