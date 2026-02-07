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
            ['name_ar' => 'أولى', 'order' => 1],
            ['name_ar' => 'ثانية', 'order' => 2],
            ['name_ar' => 'ثالثة', 'order' => 3],
            ['name_ar' => 'رابعة', 'order' => 4],
            ['name_ar' => 'خامسة', 'order' => 5],
            ['name_ar' => 'سادسة', 'order' => 6],
            ['name_ar' => 'سابعة', 'order' => 7],
            ['name_ar' => 'ثامنة', 'order' => 8],
            ['name_ar' => 'تاسعة', 'order' => 9],
            ['name_ar' => 'عاشرة', 'order' => 10],
        ];

        foreach ($grades as $grade) {
            JobGrade::create($grade);
        }
    }
}
