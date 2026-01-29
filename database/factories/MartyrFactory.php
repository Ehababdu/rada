<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Martyr>
 */
class MartyrFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $employmentStatus = \App\Models\EmploymentStatus::inRandomOrder()->first() ?? \App\Models\EmploymentStatus::create(['name' => 'عسكري']);
        $employmentStatusId = $employmentStatus->id;
        $isMilitary = str_contains(strtolower($employmentStatus->name), 'عسكري');

        $parentsStatus = \App\Models\ParentsStatus::inRandomOrder()->first() ?? \App\Models\ParentsStatus::create(['name_ar' => 'على قيد الحياة', 'name_en' => 'Alive']);
        $maritalStatus = \App\Models\MaritalStatus::inRandomOrder()->first() ?? \App\Models\MaritalStatus::create(['name_ar' => 'متزوج', 'name_en' => 'Married']);

        $bank = \App\Models\Bank::inRandomOrder()->first();
        if (! $bank) {
            $user = \App\Models\User::first() ?? \App\Models\User::factory()->create();
            $bank = \App\Models\Bank::create([
                'name_ar' => 'مصرف '.$this->faker->unique()->word,
                'created_by' => $user->id,
            ]);
        }

        $branch = \App\Models\Branch::where('bank_id', $bank->id)->inRandomOrder()->first() ?? \App\Models\Branch::create([
            'bank_id' => $bank->id,
            'name_ar' => 'فرع '.$this->faker->city,
        ]);

        $militaryRankId = null;
        if ($isMilitary) {
            $militaryRank = \App\Models\MilitaryRank::inRandomOrder()->first() ?? \App\Models\MilitaryRank::create(['name_ar' => 'جندي', 'name_en' => 'Soldier']);
            $militaryRankId = $militaryRank->id;
        }

        return [
            'full_name' => $this->faker->randomElement([
                $this->faker->name(),
                'محمد أحمد علي',
                'أحمد محمد سالم',
                'علي حسن محمود',
                'حسن محمد عبدالله',
                'عبدالله أحمد حسن',
                'فاطمة محمد علي',
                'زينب أحمد سالم',
                'مريم حسن محمود',
            ]),
            'national_id' => $this->faker->unique()->numerify('############'),
            'address' => $this->faker->randomElement([
                $this->faker->address(),
                'دمشق، سوريا',
                'حلب، سوريا',
                'حمص، سوريا',
                'حماة، سوريا',
                'اللاذقية، سوريا',
            ]),
            'parents_status_id' => $parentsStatus->id,
            'marital_status_id' => $maritalStatus->id,
            'children_count' => $this->faker->optional()->numberBetween(1, 5),
            'employment_status_id' => $employmentStatusId,
            'military_number' => $isMilitary ? $this->faker->optional()->numerify('########') : null,
            'military_rank_id' => $militaryRankId,
            'bank_id' => $bank->id,
            'branch_id' => $branch->id,
            'agent_name' => $this->faker->optional()->name(),
            'agent_phone' => $this->faker->optional()->regexify('/^09[1-4]\d{7}$/'),
            'agent_relationship' => $this->faker->optional()->word(),
            'profile_image' => null,
            'agent_passport_number' => $this->faker->optional()->numerify('##########'),
        ];
    }
}
