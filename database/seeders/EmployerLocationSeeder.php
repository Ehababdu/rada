<?php

namespace Database\Seeders;

use App\Models\EmployerLocation;
use Illuminate\Database\Seeder;

class EmployerLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            // جهاز الردع - مواقع العمل
            ['name_ar' => 'الكتيبة الأولى', 'name_en' => 'First Battalion', 'is_active' => true, 'employer_id' => 1],
            ['name_ar' => 'الكتيبة الثانية', 'name_en' => 'Second Battalion', 'is_active' => true, 'employer_id' => 1],
            ['name_ar' => 'الكتيبة الثالثة', 'name_en' => 'Third Battalion', 'is_active' => true, 'employer_id' => 1],
            ['name_ar' => 'الكتيبة الرابعة', 'name_en' => 'Fourth Battalion', 'is_active' => true, 'employer_id' => 1],
            ['name_ar' => 'الكتيبة الخامسة', 'name_en' => 'Fifth Battalion', 'is_active' => true, 'employer_id' => 1],
            ['name_ar' => 'الكتيبة السادسة', 'name_en' => 'Sixth Battalion', 'is_active' => true, 'employer_id' => 1],
            ['name_ar' => 'الكتيبة السابعة', 'name_en' => 'Seventh Battalion', 'is_active' => true, 'employer_id' => 1],
            ['name_ar' => 'إدارة الفرق', 'name_en' => 'Bands Administration', 'is_active' => true, 'employer_id' => 1],
            ['name_ar' => 'الشؤون الأمنية', 'name_en' => 'Security Affairs', 'is_active' => true, 'employer_id' => 1],
            ['name_ar' => 'الشؤون الفنية', 'name_en' => 'Technical Affairs', 'is_active' => true, 'employer_id' => 1],
            ['name_ar' => 'وحدة الانضباط', 'name_en' => 'Discipline Unit', 'is_active' => true, 'employer_id' => 1],
            ['name_ar' => 'قوة حماية طرابلس', 'name_en' => 'Tripoli Protection Force', 'is_active' => true, 'employer_id' => 1],
            ['name_ar' => 'وحدة المحروقات', 'name_en' => 'Fuel Unit', 'is_active' => true, 'employer_id' => 1],
            ['name_ar' => 'إدارة الحركة', 'name_en' => 'Traffic Administration', 'is_active' => true],
            ['name_ar' => 'المكتب الصحي', 'name_en' => 'Medical Office', 'is_active' => true],

        ];

        foreach ($locations as $location) {
            EmployerLocation::create($location);
        }
    }
}
