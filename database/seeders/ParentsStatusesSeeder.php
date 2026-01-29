<?php

namespace Database\Seeders;

use App\Models\ParentsStatus;
use Illuminate\Database\Seeder;

class ParentsStatusesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['name_ar' => 'كلا الوالدين متوفيان', 'name_en' => 'Both parents deceased'],
            ['name_ar' => 'الأب حي', 'name_en' => 'Father alive'],
            ['name_ar' => 'الأم حية', 'name_en' => 'Mother alive'],
            ['name_ar' => 'كلا الوالدين أحياء', 'name_en' => 'Both parents alive'],
        ];

        foreach ($statuses as $status) {
            ParentsStatus::create($status);
        }
    }
}
