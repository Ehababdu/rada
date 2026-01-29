<?php

namespace Database\Seeders;

use App\Models\AttachmentType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttachmentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            'شهادة الوفاء',
            'الوضع العائلي',
            'تقرير الطبيب الشرعي',
            'محصر جمع الإسدالات',
            'شهادة ميلاد الشهيد',
            'شهادة ميلاد الوكيل',
            'إثبات الهوية للشهيد',
            'إثبات هوية للوكيل',
            'توكيل شرعي',
            'فريضة شرعية',
            'قرار تعيين',
            'قرار شهيد',
            'قرار ترقية',
            'قرار تنسيب',
            'قرار نقل',
            'قرار انفكاك',
            'قرار تسوية',
            'مؤهل علمي',
            'مكافآت',
        ];

        foreach ($types as $label) {
            AttachmentType::firstOrCreate([
                'label' => $label,
            ]);
        }
    }
}
