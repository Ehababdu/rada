<?php

namespace Database\Seeders;

use App\Models\MilitaryRank;
use Illuminate\Database\Seeder;

class MilitaryRankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ranks = [
            ['name_ar' => 'فرد', 'order' => 1],
            ['name_ar' => 'ن.ع', 'order' => 2],
            ['name_ar' => 'عريف', 'order' => 3],
            ['name_ar' => 'ر.ع', 'order' => 4],
            ['name_ar' => 'ر.ع.ا', 'order' => 5],
            ['name_ar' => 'م.ظ', 'order' => 6],
            ['name_ar' => 'م.ظ.أ', 'order' => 7],
            ['name_ar' => 'ن.ظ', 'order' => 8],
            ['name_ar' => 'ظابط', 'order' => 9],
            ['name_ar' => 'ملازم', 'order' => 10],
            ['name_ar' => 'ملازم أول', 'order' => 11],
            ['name_ar' => 'ملازم تاني', 'order' => 12],
            ['name_ar' => 'رائد', 'order' => 13],
            ['name_ar' => 'عقيد', 'order' => 14],
            ['name_ar' => 'عميد', 'order' => 15],
            ['name_ar' => 'لواء', 'order' => 16],
            ['name_ar' => 'فريق', 'order' => 17],
            ['name_ar' => 'مشير', 'order' => 18],
        ];

        foreach ($ranks as $rank) {
            MilitaryRank::create($rank);
        }
    }
}
