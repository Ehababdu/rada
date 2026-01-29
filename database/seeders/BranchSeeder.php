<?php

namespace Database\Seeders;

use App\Models\Bank;
use App\Models\Branch;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $banks = Bank::all();

        $branches = [
            ['name_ar' => 'فرع دمشق', 'bank_id' => $banks->first()->id],
            ['name_ar' => 'فرع حلب', 'bank_id' => $banks->first()->id],
            ['name_ar' => 'فرع حمص', 'bank_id' => $banks->first()->id],
            ['name_ar' => 'فرع حماة', 'bank_id' => $banks->first()->id],
            ['name_ar' => 'فرع اللاذقية', 'bank_id' => $banks->first()->id],
            ['name_ar' => 'فرع طرطوس', 'bank_id' => $banks->skip(1)->first()->id],
            ['name_ar' => 'فرع درعا', 'bank_id' => $banks->skip(1)->first()->id],
            ['name_ar' => 'فرع السويداء', 'bank_id' => $banks->skip(1)->first()->id],
            ['name_ar' => 'فرع القامشلي', 'bank_id' => $banks->skip(2)->first()->id],
            ['name_ar' => 'فرع الحسكة', 'bank_id' => $banks->skip(2)->first()->id],
            ['name_ar' => 'فرع دير الزور', 'bank_id' => $banks->skip(3)->first()->id],
            ['name_ar' => 'فرع الرقة', 'bank_id' => $banks->skip(3)->first()->id],
            ['name_ar' => 'فرع إدلب', 'bank_id' => $banks->skip(4)->first()->id],
            ['name_ar' => 'فرع جبلة', 'bank_id' => $banks->skip(4)->first()->id],
            ['name_ar' => 'فرع بانياس', 'bank_id' => $banks->skip(5)->first()->id],
        ];

        foreach ($branches as $branch) {
            Branch::create($branch);
        }
    }
}
