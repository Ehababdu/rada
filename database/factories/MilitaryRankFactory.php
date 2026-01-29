<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MilitaryRank>
 */
class MilitaryRankFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name_ar' => $this->faker->word(),
            'name_en' => $this->faker->word(),
            'order' => $this->faker->numberBetween(1, 100),
            'is_active' => true,
        ];
    }
}
