<?php

namespace Database\Seeders;

use App\Models\Bank;
use Illuminate\Database\Seeder;

class BankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $banks = [
            ['name_ar' => 'مصرف الجمهورية'],
            ['name_ar' => 'مصرف الوحدة'],
            ['name_ar' => 'مصرف شمال افريقيا'],
            ['name_ar' => 'مصرف الصحارى'],
            ['name_ar' => 'مصرف التجاري الوطني'],
            ['name_ar' => 'مصرف الاسلامي الليبي'],
            ['name_ar' => 'مصرف الاندلس'],
            ['name_ar' => 'مصرف الواحة'],
            ['name_ar' => 'مصرف التجارة والتنمية'],
            ['name_ar' => 'مصرف المتوسط'],
        ];

        foreach ($banks as $bank) {
            Bank::create(array_merge($bank, ['created_by' => \App\Models\User::first()->id ?? 1]));
        }
    }
}
