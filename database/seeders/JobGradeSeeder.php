<?php

namespace Database\Seeders;

use App\Models\JobGrade;
use Illuminate\Database\Seeder;

class JobGradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $grades = [
            ['name_ar' => 'أولى', 'name_en' => 'First', 'order' => 1],
            ['name_ar' => 'ثانية', 'name_en' => 'Second', 'order' => 2],
            ['name_ar' => 'ثالثة', 'name_en' => 'Third', 'order' => 3],
            ['name_ar' => 'رابعة', 'name_en' => 'Fourth', 'order' => 4],
            ['name_ar' => 'خامسة', 'name_en' => 'Fifth', 'order' => 5],
            ['name_ar' => 'سادسة', 'name_en' => 'Sixth', 'order' => 6],
            ['name_ar' => 'سابعة', 'name_en' => 'Seventh', 'order' => 7],
            ['name_ar' => 'ثامنة', 'name_en' => 'Eighth', 'order' => 8],
            ['name_ar' => 'تاسعة', 'name_en' => 'Ninth', 'order' => 9],
            ['name_ar' => 'عاشرة', 'name_en' => 'Tenth', 'order' => 10],
        ];

        foreach ($grades as $grade) {
            JobGrade::create($grade);
        }
    }
}
