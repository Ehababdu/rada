<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EmploymentStatus>
 */
class EmploymentStatusFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->randomElement([
                'موظف',
                'عاطل عن العمل',
                'طالب',
                'متقاعد',
                'ربة منزل',
                'عامل حر',
            ]),
        ];
    }
}
