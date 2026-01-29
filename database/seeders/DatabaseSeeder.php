<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            RolesAndPermissionsSeeder::class, // Ensure this runs first
            EmploymentStatusSeeder::class,
            MilitaryRankSeeder::class,
            JobGradeSeeder::class,
            AttachmentTypeSeeder::class,
            EmployerLocationSeeder::class, // Must run before EmployerSeeder
            EmployerSeeder::class,
        ]);

        // Ensure Super Admin user is created before BankSeeder
        $superAdminUser = User::firstOrCreate([
            'email' => 'test@example.com',
        ], [
            'name' => 'Test User',
            'password' => bcrypt('password'),
        ]);

        $this->call([
            BankSeeder::class,
            ParentsStatusesSeeder::class,
            MaritalStatusesSeeder::class,
            // BranchSeeder::class,
            // MartyrSeeder::class,
            // AttachmentSeeder::class,
        ]);

        $superAdminUser->assignRole('Super Admin');
        $superAdminUser->syncPermissions(Permission::all());
    }
}
