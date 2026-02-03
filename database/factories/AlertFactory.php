<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Alert>
 */
class AlertFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'message' => $this->faker->paragraph(),
            'type' => $this->faker->randomElement(['info', 'warning', 'success', 'error']),
            'user_id' => \App\Models\User::factory(),
            'data' => ['test' => 'data'],
            'read_at' => $this->faker->optional(0.5)->dateTime(), // 50% chance of being read
        ];
    }
}
