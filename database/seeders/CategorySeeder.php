<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Married',
                'slug' => 'married',
                'monthly_fee' => 50.00,
                'description' => 'For married family members - higher contribution due to dual income potential',
                'is_active' => true,
            ],
            [
                'name' => 'Single',
                'slug' => 'single',
                'monthly_fee' => 30.00,
                'description' => 'For single family members - moderate contribution amount',
                'is_active' => true,
            ],
            [
                'name' => 'Student',
                'slug' => 'student',
                'monthly_fee' => 15.00,
                'description' => 'For student family members - reduced contribution due to limited income',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
