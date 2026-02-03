<?php

namespace Database\Factories;

use App\Models\Martyr;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Compensation>
 */
class CompensationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'martyr_id' => null, // Will be set by forMartyr method
            'recipient_name' => $this->faker->name(),
            'recipient_passport_number' => $this->faker->regexify('[A-Z][0-9]{9}'),
            'amount' => $this->faker->randomFloat(2, 1000, 100000),
            'receipt_date' => $this->faker->date(),
        ];
    }

    /**
     * Create a compensation for a specific martyr.
     */
    public function forMartyr(Martyr $martyr): static
    {
        return $this->state(fn (array $attributes) => [
            'martyr_id' => $martyr->id,
        ]);
    }
}
