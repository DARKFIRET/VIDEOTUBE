<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage; // <--- Для работы с файлами

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        // 1. Валидация прошла

        // 2. Сохранение картинки (если передана)
        $path = null;
        if ($request->hasFile('profile_picture')) {
            $path = $request->file('profile_picture')->store('profile_pictures', 'public');
        }

        // 3. Создание пользователя
        $user = User::create([
            'channel_name' => $request->channel_name,
            'channel_description' => $request->channel_description,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'profile_picture_path' => $path, // null или profile_pictures/abc.jpg
        ]);

        // 4. Создание токена
        $token = $user->createToken('api_token')->plainTextToken;

        // 5. Ответ
        return response()->json([
            'message' => 'Регистрация прошла успешно',
            'user' => new UserResource($user),
            'token' => $token
        ], 201);
    }

    /**
     * Аутентификация пользователя
     */
    public function login(LoginRequest $request)
    {
        // 1. Валидация прошла через LoginRequest

        // 2. Попытка аутентификации
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Неверные email или пароль'
            ], 401);
        }

        // 3. Получаем пользователя
        $user = User::where('email', $request->email)->firstOrFail();

        // 4. Создаем токен
        $token = $user->createToken('api_token')->plainTextToken;

        // 5. Возвращаем ответ
        return response()->json([
            'message' => 'Вход выполнен успешно',
            'user' => new UserResource($user), // Используем ресурс
            'token' => $token
        ], 200);
    }
}
