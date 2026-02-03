<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Promotion>
 */
class PromotionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $currentDate = now()->subYears(rand(1, 10));
        $promotionYears = rand(2, 5);
        $nextDueDate = $currentDate->copy()->addYears($promotionYears);

        return [
            'martyr_id' => \App\Models\Martyr::factory(),
            'current_rank' => \App\Models\MilitaryRank::factory(),
            'promotion_rank' => \App\Models\MilitaryRank::factory(),
            'current_job_grade_id' => \App\Models\JobGrade::factory(),
            'promotion_job_grade_id' => \App\Models\JobGrade::factory(),
            'current_rank_date' => $currentDate,
            'promotion_years' => $promotionYears,
            'next_due_date' => $nextDueDate,
            'description' => $this->faker->sentence(),
        ];
    }
}
