<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name_ar' => 'required|string|max:255|unique:employers,name_ar',
            'name_en' => 'nullable|string|max:255|unique:employers,name_en',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name_ar.required' => __('Employer Arabic name is required.'),
            'name_ar.unique' => __('Employer Arabic name must be unique.'),
            'name_en.unique' => __('Employer English name must be unique.'),
        ];
    }

    public function attributes(): array
    {
        return [
            'name_ar' => __('Arabic Name'),
            'name_en' => __('English Name'),
            'is_active' => __('Active'),
        ];
    }
}
