<?php

namespace Database\Seeders;

use App\Models\Martyr;
use Illuminate\Database\Seeder;

class MartyrsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Martyr::factory()->count(300)->create();
    }
}
