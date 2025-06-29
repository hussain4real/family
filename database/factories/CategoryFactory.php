<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            ['name' => 'Married', 'slug' => 'married', 'fee' => 20000.00, 'description' => 'For married family members'],
            ['name' => 'Single', 'slug' => 'single', 'fee' => 12000.00, 'description' => 'For single family members'],
            ['name' => 'Student', 'slug' => 'student', 'fee' => 6000.00, 'description' => 'For student family members'],
        ];

        $category = fake()->randomElement($categories);

        return [
            'name' => $category['name'],
            'slug' => $category['slug'],
            'monthly_fee' => $category['fee'],
            'description' => $category['description'],
            'is_active' => true,
        ];
    }
}
