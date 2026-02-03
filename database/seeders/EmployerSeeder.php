<?php

namespace Database\Seeders;

use App\Models\Employer;
use Illuminate\Database\Seeder;

class EmployerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // الحصول على المستخدم الأول ليكون created_by
        $user = \App\Models\User::first();

        if (! $user) {
            // إنشاء مستخدم افتراضي إذا لم يكن هناك أي مستخدم
            $user = \App\Models\User::create([
                'name' => 'System Admin',
                'email' => 'admin@system.com',
                'password' => bcrypt('password'),
            ]);
        }

        $newEmployerNames = [
            'جهاز الردع',
            'إدارة العمليات و الأمن القضائي',
            'جهاز الهجرة غير شرعية',
            'جهاز النواصي',
            'باب تاجوراء',
            'جهاز الأمن الداخلي',
            'جهاز الرقابة',
            'وزارة الصحة',
            'السجل المدني',
            'المطقة العسكرية طرابلس',
            'كتيبة 111',
        ];

        // حذف الجهات التي ليست في القائمة الجديدة
        Employer::whereNotIn('name_ar', $newEmployerNames)->delete();

        $employers = [
            [
                'name_ar' => 'جهاز الردع',
                'name_en' => 'Deterrence Agency',
                'is_active' => true,
            ],
            [
                'name_ar' => 'إدارة العمليات و الأمن القضائي',
                'name_en' => 'Operations and Judicial Security Administration',
                'is_active' => true,
            ],
            [
                'name_ar' => 'جهاز الهجرة غير شرعية',
                'name_en' => 'Illegal Immigration Agency',
                'is_active' => true,
            ],
            [
                'name_ar' => 'جهاز النواصي',
                'name_en' => 'Nawasi Agency',
                'is_active' => true,
            ],
            [
                'name_ar' => 'باب تاجوراء',
                'name_en' => 'Bab Tajoura',
                'is_active' => true,
            ],
            [
                'name_ar' => 'جهاز الأمن الداخلي',
                'name_en' => 'Internal Security Agency',
                'is_active' => true,
            ],
            [
                'name_ar' => 'جهاز الرقابة',
                'name_en' => 'Control Agency',
                'is_active' => true,
            ],
            [
                'name_ar' => 'وزارة الصحة',
                'name_en' => 'Ministry of Health',
                'is_active' => true,
            ],
            [
                'name_ar' => 'السجل المدني',
                'name_en' => 'Civil Registry',
                'is_active' => true,
            ],
            [
                'name_ar' => 'المطقة العسكرية طرابلس',
                'name_en' => 'Tripoli Military Region',
                'is_active' => true,
            ],
            [
                'name_ar' => 'كتيبة 111',
                'name_en' => 'Battalion 111',
                'is_active' => true,
            ],
        ];

        // إضافة created_by لجميع الجهات
        $employers = array_map(function ($employer) use ($user) {
            $employer['created_by'] = $user->id;

            return $employer;
        }, $employers);

        foreach ($employers as $employer) {
            Employer::updateOrCreate(
                ['name_ar' => $employer['name_ar']],
                $employer,
            );
        }
    }
}
