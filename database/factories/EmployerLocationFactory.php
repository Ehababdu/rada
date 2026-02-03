<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EmployerLocation>
 */
class EmployerLocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name_ar' => $this->faker->city . ' (عربي)',
            'name_en' => $this->faker->city,
            'employer_id' => null, // Will be set when creating
            'is_active' => $this->faker->boolean(80), // 80% chance of being active
        ];
    }
}
