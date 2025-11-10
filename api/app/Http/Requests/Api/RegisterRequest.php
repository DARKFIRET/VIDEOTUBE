<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'channel_name' => 'required|string|max:255|unique:users',
            'channel_description' => 'nullable|string|max:1000', // убрал required
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8', // убрал confirmed
            'profile_picture' => 'nullable|image|max:20480', // 20MB max
        ];
    }

    public function messages(): array
    {
        return [
            'channel_name.required' => 'Название канала обязательно для заполнения',
            'channel_name.unique' => 'Такое название канала уже существует',
            'email.required' => 'Email обязателен для заполнения',
            'email.email' => 'Введите корректный email',
            'email.unique' => 'Пользователь с таким email уже существует',
            'password.required' => 'Пароль обязателен для заполнения',
            'password.min' => 'Пароль должен быть не менее 8 символов',
            'profile_picture.image' => 'Файл должен быть изображением',
            'profile_picture.max' => 'Размер изображения не должен превышать 20MB',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Ошибки валидации',
            'errors' => $validator->errors()
        ], 422));
    }
}
