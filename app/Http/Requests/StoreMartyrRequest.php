<?php

namespace App\Http\Requests;

use App\Models\EmploymentStatus;
use App\Models\MaritalStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreMartyrRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Ensure only authenticated users can create martyrs
        return auth()->check();
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Sanitize and normalize input data
        $this->merge([
            'file_number' => $this->file_number ? trim($this->file_number) : null,
            'full_name' => $this->full_name ? trim($this->full_name) : null,
            'national_id' => $this->national_id ? preg_replace('/\s+/', '', $this->national_id) : null,
            'address' => $this->address ? trim($this->address) : null,
            'workplace' => $this->workplace ? trim($this->workplace) : null,
            'previous_workplace' => $this->previous_workplace ? trim($this->previous_workplace) : null,
            'military_number' => $this->military_number ? trim($this->military_number) : null,
            'bank_account_number' => $this->bank_account_number ? trim($this->bank_account_number) : null,
            'agent_name' => $this->agent_name ? trim($this->agent_name) : null,
            'agent_phone' => $this->agent_phone ? preg_replace('/\s+/', '', $this->agent_phone) : null,
            'agent_relationship' => $this->agent_relationship ? trim($this->agent_relationship) : null,
            'agent_passport_number' => $this->agent_passport_number ? trim($this->agent_passport_number) : null,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Basic Information (Required)
            'file_number' => ['required', 'string', 'max:50', 'unique:martyrs,file_number'],
            'full_name' => ['required', 'string', 'min:3', 'max:255', 'regex:/^[\p{Arabic}\s]+$/u'],
            'national_id' => ['required', 'string', 'digits:12', 'unique:martyrs,national_id'],
            'address' => ['required', 'string', 'min:5', 'max:500'],
            'death_date' => ['required', 'date', 'before_or_equal:today'],
            'has_martyr_decision' => ['boolean'],
            'decision_number' => ['nullable', 'string', 'max:100', 'required_if:has_martyr_decision,1'],
            'decision_date' => ['nullable', 'date', 'before_or_equal:today', 'required_if:has_martyr_decision,1'],

            // Family Status (Required)
            'parents_status_id' => ['required', 'integer', 'exists:parents_statuses,id'],
            'marital_status_id' => ['required', 'integer', 'exists:marital_statuses,id'],
            'children_count' => ['nullable', 'integer', 'min:0', 'max:20'],
            'wife_status' => ['nullable', 'string', 'in:ارملة,متزوجة'],

            // Employment Information (Required)
            'employment_status_id' => ['required', 'integer', 'exists:employment_statuses,id'],
            'employer_id' => ['nullable', 'integer', 'exists:employers,id'],
            'employer_location_id' => ['nullable', 'integer', 'exists:employer_locations,id'],
            'job_grade_id' => ['nullable', 'integer', 'exists:job_grades,id'],
            'workplace' => ['nullable', 'string', 'max:255'],
            'has_previous_workplace' => ['boolean'],
            'previous_employer_id' => ['nullable', 'integer', 'exists:employers,id', 'required_if:has_previous_workplace,1'],
            'previous_employer_location_id' => ['nullable', 'integer', 'exists:employer_locations,id', 'required_if:has_previous_workplace,1'],
            'previous_workplace' => ['nullable', 'string', 'max:255'],

            // Military Information (Conditional - Required if military employment)
            'military_number' => ['nullable', 'string', 'max:50'],
            'military_rank_id' => ['nullable', 'integer', 'exists:military_ranks,id'],

            // Banking Information (Optional)
            'bank_id' => ['nullable', 'integer', 'exists:banks,id'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id', 'required_with:bank_id'],
            'bank_account_number' => ['nullable', 'string', 'min:10', 'max:34', 'regex:/^[0-9]+$/'],

            // Agent Information (Optional)
            'agent_name' => ['nullable', 'string', 'min:3', 'max:255', 'regex:/^[\p{Arabic}\s]+$/u'],
            'agent_phone' => ['nullable', 'string', 'regex:/^(091|092|093|094)\d{7}$/'],
            'agent_relationship' => ['nullable', 'string', 'max:100'],
            'agent_passport_number' => ['nullable', 'string', 'max:50', 'regex:/^[A-Z0-9]+$/'],

            // File Uploads (Optional)
            'profile_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048', 'dimensions:min_width=200,min_height=200'],
            'national_id_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'art_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:5120'],
        ];
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            // Full Name
            'full_name.required' => 'الاسم الكامل مطلوب. | Full name is required.',
            'full_name.min' => 'الاسم الكامل يجب أن يكون 3 أحرف على الأقل. | Full name must be at least 3 characters.',
            'full_name.max' => 'الاسم الكامل يجب ألا يتجاوز 255 حرفاً. | Full name must not exceed 255 characters.',
            'full_name.regex' => 'الاسم الكامل يجب أن يحتوي على أحرف عربية فقط. | Full name must contain Arabic characters only.',

            // National ID
            'national_id.required' => 'الرقم الوطني مطلوب. | National ID is required.',
            'national_id.digits' => 'الرقم الوطني يجب أن يكون 12 رقماً بالضبط. | National ID must be exactly 12 digits.',
            'national_id.unique' => 'الرقم الوطني مسجل بالفعل. | This National ID is already registered.',

            // Address
            'address.required' => 'العنوان مطلوب. | Address is required.',
            'address.min' => 'العنوان يجب أن يكون 5 أحرف على الأقل. | Address must be at least 5 characters.',
            'address.max' => 'العنوان يجب ألا يتجاوز 500 حرف. | Address must not exceed 500 characters.',

            // Death Date
            'death_date.required' => 'تاريخ الوفاة مطلوب. | Death date is required.',
            'death_date.date' => 'تاريخ الوفاة يجب أن يكون تاريخاً صحيحاً. | Death date must be a valid date.',
            'death_date.before_or_equal' => 'تاريخ الوفاة يجب ألا يكون في المستقبل. | Death date cannot be in the future.',

            // Martyr Decision
            'has_martyr_decision.boolean' => 'قيمة قرار الشهيد يجب أن تكون صحيحة أو خاطئة. | Martyr decision value must be true or false.',
            'decision_number.required_if' => 'رقم القرار مطلوب عند وجود قرار شهيد. | Decision number is required when martyr decision exists.',
            'decision_number.max' => 'رقم القرار يجب ألا يتجاوز 100 حرف. | Decision number must not exceed 100 characters.',
            'decision_date.required_if' => 'تاريخ القرار مطلوب عند وجود قرار شهيد. | Decision date is required when martyr decision exists.',
            'decision_date.date' => 'تاريخ القرار يجب أن يكون تاريخاً صحيحاً. | Decision date must be a valid date.',
            'decision_date.before_or_equal' => 'تاريخ القرار يجب ألا يكون في المستقبل. | Decision date cannot be in the future.',

            // Parents Status
            'parents_status_id.required' => 'حالة الوالدين مطلوبة. | Parents status is required.',
            'parents_status_id.exists' => 'حالة الوالدين المحددة غير صالحة. | Selected parents status is invalid.',

            // Marital Status
            'marital_status_id.required' => 'الحالة الاجتماعية مطلوبة. | Marital status is required.',
            'marital_status_id.exists' => 'الحالة الاجتماعية المحددة غير صالحة. | Selected marital status is invalid.',

            // Children Count
            'children_count.integer' => 'عدد الأطفال يجب أن يكون رقماً صحيحاً. | Children count must be an integer.',
            'children_count.min' => 'عدد الأطفال لا يمكن أن يكون سالباً. | Children count cannot be negative.',
            'children_count.max' => 'عدد الأطفال يجب ألا يتجاوز 20. | Children count must not exceed 20.',

            // Employment Status
            'employment_status_id.required' => 'الحالة الوظيفية مطلوبة. | Employment status is required.',
            'employment_status_id.exists' => 'الحالة الوظيفية المحددة غير صالحة. | Selected employment status is invalid.',

            // Job Grade
            'job_grade_id.integer' => 'الدرجة الوظيفية يجب أن تكون رقماً صحيحاً. | Job grade must be an integer.',
            'job_grade_id.exists' => 'الدرجة الوظيفية المحددة غير صالحة. | Selected job grade is invalid.',

            // Military Information
            'military_number.max' => 'الرقم العسكري يجب ألا يتجاوز 50 حرفاً. | Military number must not exceed 50 characters.',
            'military_rank_id.exists' => 'الرتبة العسكرية المحددة غير صالحة. | Selected military rank is invalid.',

            // Banking Information
            'bank_id.exists' => 'البنك المحدد غير صالح. | Selected bank is invalid.',
            'branch_id.exists' => 'الفرع المحدد غير صالح. | Selected branch is invalid.',
            'branch_id.required_with' => 'الفرع مطلوب عند اختيار البنك. | Branch is required when bank is selected.',
            'bank_account_number.min' => 'رقم الحساب يجب أن يكون 10 أرقام على الأقل. | Account number must be at least 10 digits.',
            'bank_account_number.max' => 'رقم الحساب يجب ألا يتجاوز 34 رقماً. | Account number must not exceed 34 digits.',
            'bank_account_number.regex' => 'رقم الحساب يجب أن يحتوي على أرقام فقط. | Account number must contain digits only.',

            // Agent Information
            'agent_name.min' => 'اسم الوكيل يجب أن يكون 3 أحرف على الأقل. | Agent name must be at least 3 characters.',
            'agent_name.max' => 'اسم الوكيل يجب ألا يتجاوز 255 حرفاً. | Agent name must not exceed 255 characters.',
            'agent_name.regex' => 'اسم الوكيل يجب أن يحتوي على أحرف عربية فقط. | Agent name must contain Arabic characters only.',
            'agent_phone.regex' => 'رقم هاتف الوكيل يجب أن يبدأ بـ 091 أو 092 أو 093 أو 094 ويكون 10 أرقام. | Agent phone must start with 091, 092, 093, or 094 and be 10 digits.',
            'agent_relationship.max' => 'صلة القرابة يجب ألا تتجاوز 100 حرف. | Relationship must not exceed 100 characters.',
            'agent_passport_number.max' => 'رقم جواز السفر يجب ألا يتجاوز 50 حرفاً. | Passport number must not exceed 50 characters.',
            'agent_passport_number.regex' => 'رقم جواز السفر يجب أن يحتوي على أحرف إنجليزية كبيرة وأرقام فقط. | Passport number must contain uppercase letters and digits only.',

            // File Uploads
            'profile_image.image' => 'صورة الملف الشخصي يجب أن تكون صورة. | Profile image must be an image.',
            'profile_image.mimes' => 'صورة الملف الشخصي يجب أن تكون بصيغة jpeg أو png أو jpg. | Profile image must be jpeg, png, or jpg.',
            'profile_image.max' => 'حجم صورة الملف الشخصي يجب ألا يتجاوز 2 ميجابايت. | Profile image size must not exceed 2MB.',
            'profile_image.dimensions' => 'صورة الملف الشخصي يجب أن تكون 200×200 بكسل على الأقل. | Profile image must be at least 200x200 pixels.',

            'national_id_file.mimes' => 'ملف الهوية يجب أن يكون بصيغة pdf أو jpg أو jpeg أو png. | National ID file must be pdf, jpg, jpeg, or png.',
            'national_id_file.max' => 'حجم ملف الهوية يجب ألا يتجاوز 5 ميجابايت. | National ID file size must not exceed 5MB.',

            'art_image.image' => 'الصورة الفنية يجب أن تكون صورة. | Art image must be an image.',
            'art_image.mimes' => 'الصورة الفنية يجب أن تكون بصيغة jpeg أو png أو jpg. | Art image must be jpeg, png, or jpg.',
            'art_image.max' => 'حجم الصورة الفنية يجب ألا يتجاوز 5 ميجابايت. | Art image size must not exceed 5MB.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            // Conditional validation: Children count should only be provided for married status
            if ($this->marital_status_id) {
                $maritalStatus = MaritalStatus::find($this->marital_status_id);

                if ($maritalStatus && stripos($maritalStatus->name_ar, 'أعزب') !== false || stripos($maritalStatus->name_ar, 'عزباء') !== false) {
                    if ($this->children_count && $this->children_count > 0) {
                        $validator->errors()->add(
                            'children_count',
                            'عدد الأطفال يجب أن يكون فارغاً للحالة الاجتماعية "أعزب/عزباء". | Children count must be empty for single marital status.',
                        );
                    }
                } elseif ($maritalStatus && stripos($maritalStatus->name_ar, 'متزوج') !== false) {
                    if (! $this->wife_status) {
                        $validator->errors()->add(
                            'wife_status',
                            'حالة الزوجة مطلوبة للحالة الاجتماعية "متزوج". | Wife status is required for married marital status.',
                        );
                    }
                }
            }

            // Conditional validation: Military fields required when employment status is military
            if ($this->employment_status_id) {
                $employmentStatus = EmploymentStatus::find($this->employment_status_id);

                if ($employmentStatus && stripos($employmentStatus->name_ar, 'عسكري') !== false) {
                    if (! $this->military_number) {
                        $validator->errors()->add(
                            'military_number',
                            'الرقم العسكري مطلوب للحالة الوظيفية العسكرية. | Military number is required for military employment status.',
                        );
                    }

                    if (! $this->military_rank_id) {
                        $validator->errors()->add(
                            'military_rank_id',
                            'الرتبة العسكرية مطلوبة للحالة الوظيفية العسكرية. | Military rank is required for military employment status.',
                        );
                    }
                }
            }

            // Validate that if branch is selected, bank must also be selected
            if ($this->branch_id && ! $this->bank_id) {
                $validator->errors()->add(
                    'bank_id',
                    'يجب اختيار البنك عند اختيار الفرع. | Bank must be selected when branch is selected.',
                );
            }
        });
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'full_name' => 'الاسم الكامل | Full Name',
            'national_id' => 'الرقم الوطني | National ID',
            'address' => 'العنوان | Address',
            'parents_status_id' => 'حالة الوالدين | Parents Status',
            'marital_status_id' => 'الحالة الاجتماعية | Marital Status',
            'children_count' => 'عدد الأطفال | Children Count',
            'employment_status_id' => 'الحالة الوظيفية | Employment Status',
            'job_grade_id' => 'الدرجة الوظيفية | Job Grade',
            'workplace' => 'مكان العمل | Workplace',
            'previous_workplace' => 'مكان العمل السابق | Previous Workplace',
            'military_number' => 'الرقم العسكري | Military Number',
            'military_rank_id' => 'الرتبة العسكرية | Military Rank',
            'bank_id' => 'البنك | Bank',
            'branch_id' => 'الفرع | Branch',
            'bank_account_number' => 'رقم الحساب البنكي | Bank Account Number',
            'agent_name' => 'اسم الوكيل | Agent Name',
            'agent_phone' => 'هاتف الوكيل | Agent Phone',
            'agent_relationship' => 'صلة القرابة | Relationship',
            'agent_passport_number' => 'رقم جواز السفر | Passport Number',
            'profile_image' => 'صورة الملف الشخصي | Profile Image',
            'national_id_file' => 'ملف الهوية الوطنية | National ID File',
            'art_image' => 'الصورة الفنية | Art Image',
        ];
    }
}
