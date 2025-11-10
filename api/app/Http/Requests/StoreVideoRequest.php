<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVideoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => 'required|string|max:255',
            'description' => 'required|string|max:2000', // ← ОБЯЗАТЕЛЬНО!
            'video'       => 'required|file|mimes:mp4|max:604800',
            'poster'      => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:10240',
        ];
    }

    public function attributes(): array
    {
        return [
            'title'       => 'Название видео',
            'description' => 'Описание видео',     // ← Чётко и понятно
            'video'       => 'Видео-файл',
            'poster'      => 'Обложка (постер)',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'       => ':attribute — обязательно для заполнения.',
            'title.max'            => ':attribute не может быть длиннее :max символов.',

            'description.required' => ':attribute — обязательно для заполнения.',
            'description.max'      => ':attribute не может быть длиннее :max символов.',

            'video.required'       => ':attribute — обязательно загрузите видео.',
            'video.mimes'          => ':attribute должен быть в формате: mp4, mov, avi, wmv.',
            'video.max'            => ':attribute не может превышать 200 МБ.',

            'poster.required'      => ':attribute — обязательно загрузите обложку.',
            'poster.image'         => ':attribute должен быть изображением.',
            'poster.mimes'         => ':attribute должен быть в формате: jpg, jpeg, png, gif, webp.',
            'poster.max'           => ':attribute не может превышать 10 МБ.',
        ];
    }
}
