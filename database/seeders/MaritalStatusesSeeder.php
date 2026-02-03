<?php

namespace Database\Seeders;

use App\Models\MaritalStatus;
use Illuminate\Database\Seeder;

class MaritalStatusesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['name_ar' => 'متزوج', 'name_en' => 'Married'],
            ['name_ar' => 'أعزب', 'name_en' => 'Single'],
        ];

        foreach ($statuses as $status) {
            MaritalStatus::create($status);
        }
    }
}
