<?php

namespace Database\Seeders;

use App\Models\EmploymentStatus;
use Illuminate\Database\Seeder;

class EmploymentStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['name' => 'موظف'],
            ['name' => 'عسكري'],
        ];

        foreach ($statuses as $status) {
            EmploymentStatus::create($status);
        }
    }
}
