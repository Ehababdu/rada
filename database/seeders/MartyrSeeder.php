<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class MartyrSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Martyr::factory(10)->create();
    }
}
