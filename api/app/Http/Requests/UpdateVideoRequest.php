<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVideoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|max:2000',
            'video'       => 'sometimes|required|file|mimes:mp4|max:604800',
            'poster'      => 'sometimes|required|image|mimes:jpg,jpeg,png,gif,webp|max:10240',
        ];
    }

    public function attributes(): array
    {
        return [
            'title'       => 'Название видео',
            'description' => 'Описание видео',
            'video'       => 'Видео-файл',
            'poster'      => 'Обложка (постер)',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'       => ':attribute — обязательно, если вы его обновляете.',
            'description.required' => ':attribute — обязательно, если вы его обновляете.',
            'video.required'       => ':attribute — загрузите новый файл.',
            'video.mimes'          => ':attribute должен быть в формате: mp4, mov, avi, wmv.',
            'video.max'            => ':attribute не более 500 МБ.',
            'poster.required'      => ':attribute — загрузите новую обложку.',
            'poster.image'         => ':attribute должен быть изображением.',
            'poster.max'           => ':attribute не более 10 МБ.',
        ];
    }
}
