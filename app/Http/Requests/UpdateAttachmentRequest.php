<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAttachmentRequest extends FormRequest
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
            'attachment_type' => 'required|exists:attachment_types,id',
            'file' => 'nullable|file|max:10240|mimes:pdf,doc,docx,jpg,jpeg,png',
            'description' => 'nullable|string|max:500',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'attachment_type.required' => 'نوع المرفق مطلوب.',
            'attachment_type.in' => 'نوع المرفق غير صحيح.',
            'file.max' => 'حجم الملف يجب أن يكون أقل من 10 ميجابايت.',
            'file.mimes' => 'نوع الملف يجب أن يكون pdf, doc, docx, jpg, jpeg, أو png.',
            'description.max' => 'الوصف يجب أن يكون أقل من 500 حرف.',
        ];
    }
}
