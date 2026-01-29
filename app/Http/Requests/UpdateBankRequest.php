<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBankRequest extends FormRequest
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
            'name_ar' => [
                'required',
                'string',
                'max:255',
                Rule::unique('banks')->ignore($this->route('bank')->id),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name_ar.required' => __('Bank Arabic name is required.'),
            'name_ar.unique' => __('Bank Arabic name must be unique.'),
            'name_en.required' => __('Bank English name is required.'),
            'name_en.unique' => __('Bank English name must be unique.'),
            'code.required' => __('Bank code is required.'),
            'code.unique' => __('Bank code must be unique.'),
            'email.email' => __('Please enter a valid email address.'),
            'website.url' => __('Please enter a valid website URL.'),
        ];
    }

    public function attributes(): array
    {
        return [
            'name_ar' => __('Arabic Name'),
            'name_en' => __('English Name'),
            'code' => __('Bank Code'),
            'address_ar' => __('Arabic Address'),
            'address_en' => __('English Address'),
            'phone' => __('Phone'),
            'email' => __('Email'),
            'website' => __('Website'),
            'is_active' => __('Active Status'),
        ];
    }
}
