<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Contribution;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contribution>
 */
class ContributionFactory extends Factory
{
    protected $model = Contribution::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'amount' => $this->faker->randomFloat(2, 10, 100),
            'date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'recorded_by_id' => User::factory(),
            'description' => $this->faker->optional(0.7)->sentence(),
        ];
    }

    public function forAmount(float $amount): self
    {
        return $this->state(['amount' => $amount]);
    }

    public function forDate(string $date): self
    {
        return $this->state(['date' => $date]);
    }

    public function withDescription(string $description): self
    {
        return $this->state(['description' => $description]);
    }

    public function withoutDescription(): self
    {
        return $this->state(['description' => null]);
    }
}
