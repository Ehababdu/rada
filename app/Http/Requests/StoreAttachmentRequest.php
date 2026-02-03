<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttachmentRequest extends FormRequest
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
            'attachment_type' => [
                'required',
                'exists:attachment_types,id',
                function ($attribute, $value, $fail) {
                    if ($value != 19) { // مكافآت
                        $exists = \App\Models\Attachment::where('martyr_id', $this->route('martyr')->id)
                            ->where('attachment_type', $value)
                            ->exists();

                        if ($exists) {
                            $fail('لا يمكن رفع مرفق من هذا النوع لأنه موجود مسبقاً.');
                        }
                    }
                },
            ],
            'file' => 'required|file|max:20480|mimes:pdf,doc,docx,jpg,jpeg,png',
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
            'attachment_type.exists' => 'نوع المرفق غير صحيح.',
            'file.required' => 'الملف مطلوب.',
            'file.max' => 'حجم الملف يجب أن يكون أقل من 10 ميجابايت.',
            'file.mimes' => 'نوع الملف يجب أن يكون pdf, doc, docx, jpg, jpeg, أو png.',
            'description.max' => 'الوصف يجب أن يكون أقل من 500 حرف.',
        ];
    }
}
