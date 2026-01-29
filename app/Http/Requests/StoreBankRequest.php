<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBankRequest extends FormRequest
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
            'name_ar' => 'required|string|max:255|unique:banks,name_ar',
        ];
    }

    public function messages(): array
    {
        return [
            'name_ar.required' => __('Bank Arabic name is required.'),
            'name_ar.unique' => __('Bank Arabic name must be unique.'),
        ];
    }

    public function attributes(): array
    {
        return [
            'name_ar' => __('Arabic Name'),
        ];
    }
}
