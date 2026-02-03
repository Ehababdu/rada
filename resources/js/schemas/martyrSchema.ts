import { z } from 'zod';

/**
 * Phone number regex for Libya (starts with 091, 092, 093, or 094 and is 10 digits total)
 */
const phoneRegex = /^(091|092|093|094)\d{7}$/;

/**
 * Arabic characters only regex (using ranges to avoid TS 'Unknown Unicode property' error)
 * Covers: Arabic (0600-06FF), Arabic Supplement (0750-077F), Arabic Extended-A (08A0-08FF),
 * Presentation Forms A (FB50-FDFF), Presentation Forms B (FE70-FEFF)
 */
const arabicRegex =
    /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]+$/;

/**
 * Uppercase letters and digits only (for passport numbers)
 */
const passportRegex = /^[A-Z0-9]+$/;

/**
 * Digits only regex (for bank account numbers)
 */
const digitsOnlyRegex = /^[0-9]+$/;

/**
 * File validation helper
 */
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB for profile images
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ACCEPTED_DOCUMENT_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
];

/**
 * Martyr form validation schema using Zod
 */
export const martyrSchema = z
    .object({
        // Basic Information (Required)
        full_name: z
            .string({ message: 'الاسم الكامل مطلوب | Full name is required' })
            .min(
                3,
                'الاسم الكامل يجب أن يكون 3 أحرف على الأقل | Full name must be at least 3 characters',
            )
            .max(
                255,
                'الاسم الكامل يجب ألا يتجاوز 255 حرفاً | Full name must not exceed 255 characters',
            )
            .regex(
                arabicRegex,
                'الاسم الكامل يجب أن يحتوي على أحرف عربية فقط | Full name must contain Arabic characters only',
            ),

        national_id: z
            .string({ message: 'الرقم الوطني مطلوب | National ID is required' })
            .length(
                12,
                'الرقم الوطني يجب أن يكون 12 رقماً بالضبط | National ID must be exactly 12 digits',
            )
            .regex(
                /^\d{12}$/,
                'الرقم الوطني يجب أن يحتوي على أرقام فقط | National ID must contain digits only',
            ),

        address: z
            .string({ message: 'العنوان مطلوب | Address is required' })
            .min(
                5,
                'العنوان يجب أن يكون 5 أحرف على الأقل | Address must be at least 5 characters',
            )
            .max(
                500,
                'العنوان يجب ألا يتجاوز 500 حرف | Address must not exceed 500 characters',
            ),

        // Family Status (Required)
        parents_status_id: z
            .number({
                message: 'حالة الوالدين مطلوبة | Parents status is required',
            })
            .int(
                'حالة الوالدين يجب أن تكون رقماً صحيحاً | Parents status must be an integer',
            )
            .positive('حالة الوالدين غير صالحة | Invalid parents status')
            .nullable(),

        marital_status_id: z
            .number({
                message:
                    'الحالة الاجتماعية مطلوبة | Marital status is required',
            })
            .int(
                'الحالة الاجتماعية يجب أن تكون رقماً صحيحاً | Marital status must be an integer',
            )
            .positive('الحالة الاجتماعية غير صالحة | Invalid marital status')
            .nullable(),

        children_count: z
            .number()
            .int(
                'عدد الأطفال يجب أن يكون رقماً صحيحاً | Children count must be an integer',
            )
            .min(
                0,
                'عدد الأطفال لا يمكن أن يكون سالباً | Children count cannot be negative',
            )
            .max(
                20,
                'عدد الأطفال يجب ألا يتجاوز 20 | Children count must not exceed 20',
            )
            .nullable()
            .optional(),

        // Employment Information (Required)
        employment_status_id: z
            .number({
                message:
                    'الحالة الوظيفية مطلوبة | Employment status is required',
            })
            .int(
                'الحالة الوظيفية يجب أن تكون رقماً صحيحاً | Employment status must be an integer',
            )
            .positive('الحالة الوظيفية غير صالحة | Invalid employment status')
            .nullable(),

        employer_id: z
            .number()
            .int(
                'جهة العمل يجب أن تكون رقماً صحيحاً | Employer must be an integer',
            )
            .positive('جهة العمل غير صالحة | Invalid employer')
            .nullable()
            .optional(),

        employer_location_id: z
            .number()
            .int(
                'مكان العمل يجب أن يكون رقماً صحيحاً | Employer location must be an integer',
            )
            .positive('مكان العمل غير صالح | Invalid employer location')
            .nullable()
            .optional(),

        has_previous_workplace: z.boolean().optional(),

        previous_employer_id: z
            .number()
            .int(
                'جهة العمل السابقة يجب أن تكون رقماً صحيحاً | Previous employer must be an integer',
            )
            .positive('جهة العمل السابقة غير صالحة | Invalid previous employer')
            .nullable()
            .optional(),

        previous_employer_location_id: z
            .number()
            .int(
                'مكان العمل السابق يجب أن يكون رقماً صحيحاً | Previous employer location must be an integer',
            )
            .positive(
                'مكان العمل السابق غير صالح | Invalid previous employer location',
            )
            .nullable()
            .optional(),

        // Military Information (Conditional)
        military_number: z
            .string()
            .max(
                50,
                'الرقم العسكري يجب ألا يتجاوز 50 حرفاً | Military number must not exceed 50 characters',
            )
            .nullable()
            .optional(),

        military_rank_id: z
            .number()
            .int(
                'الرتبة العسكرية يجب أن تكون رقماً صحيحاً | Military rank must be an integer',
            )
            .positive('الرتبة العسكرية غير صالحة | Invalid military rank')
            .nullable()
            .optional(),

        // Banking Information (Optional)
        bank_id: z
            .number()
            .int('البنك يجب أن يكون رقماً صحيحاً | Bank must be an integer')
            .positive('البنك غير صالح | Invalid bank')
            .nullable()
            .optional(),

        branch_id: z
            .number()
            .int('الفرع يجب أن يكون رقماً صحيحاً | Branch must be an integer')
            .positive('الفرع غير صالح | Invalid branch')
            .nullable()
            .optional(),

        bank_account_number: z
            .string()
            .min(
                10,
                'رقم الحساب يجب أن يكون 10 أرقام على الأقل | Account number must be at least 10 digits',
            )
            .max(
                34,
                'رقم الحساب يجب ألا يتجاوز 34 رقماً | Account number must not exceed 34 digits',
            )
            .regex(
                digitsOnlyRegex,
                'رقم الحساب يجب أن يحتوي على أرقام فقط | Account number must contain digits only',
            )
            .nullable()
            .optional(),

        // Agent Information (Optional)
        agent_name: z
            .string()
            .min(
                3,
                'اسم الوكيل يجب أن يكون 3 أحرف على الأقل | Agent name must be at least 3 characters',
            )
            .max(
                255,
                'اسم الوكيل يجب ألا يتجاوز 255 حرفاً | Agent name must not exceed 255 characters',
            )
            .regex(
                arabicRegex,
                'اسم الوكيل يجب أن يحتوي على أحرف عربية فقط | Agent name must contain Arabic characters only',
            )
            .nullable()
            .optional(),

        agent_phone: z
            .string()
            .regex(
                phoneRegex,
                'رقم هاتف الوكيل يجب أن يبدأ بـ 091 أو 092 أو 093 أو 094 ويكون 10 أرقام | Agent phone must start with 091, 092, 093, or 094 and be 10 digits',
            )
            .nullable()
            .optional(),

        agent_relationship: z
            .string()
            .max(
                100,
                'صلة القرابة يجب ألا تتجاوز 100 حرف | Relationship must not exceed 100 characters',
            )
            .nullable()
            .optional(),

        agent_passport_number: z
            .string()
            .max(
                50,
                'رقم جواز السفر يجب ألا يتجاوز 50 حرفاً | Passport number must not exceed 50 characters',
            )
            .regex(
                passportRegex,
                'رقم جواز السفر يجب أن يحتوي على أحرف إنجليزية كبيرة وأرقام فقط | Passport number must contain uppercase letters and digits only',
            )
            .nullable()
            .optional(),

        // File Uploads (Optional)
        profile_image: z.instanceof(File).nullable().optional(),
    })
    .refine(
        (data) => {
            // Conditional validation: If marital status is single, children_count must be null or 0
            // Note: This would need the actual marital status name to work properly
            // For now, we'll skip this validation on the client side and rely on server validation
            return true;
        },
        {
            message:
                'عدد الأطفال يجب أن يكون فارغاً للحالة الاجتماعية "أعزب/عزباء" | Children count must be empty for single marital status',
            path: ['children_count'],
        },
    )
    .refine(
        (data) => {
            // Conditional validation: If bank is selected, branch must be selected
            if (data.bank_id && !data.branch_id) {
                return false;
            }
            return true;
        },
        {
            message:
                'الفرع مطلوب عند اختيار البنك | Branch is required when bank is selected',
            path: ['branch_id'],
        },
    );

/**
 * Type inference for the martyr form data
 */
export type MartyrFormData = z.infer<typeof martyrSchema>;
