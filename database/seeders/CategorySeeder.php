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
                'name' => 'Employed',
                'slug' => 'employed',
                'monthly_fee' => 4000.00, // ₦4,000
                'description' => 'For employed family members',
                'is_active' => true,
            ],
            [
                'name' => 'Unemployed',
                'slug' => 'unemployed',
                'monthly_fee' => 2000.00, // ₦2,000
                'description' => 'For unemployed family members - reduced contribution',
                'is_active' => true,
            ],
            [
                'name' => 'Student',
                'slug' => 'student',
                'monthly_fee' => 1000.00, // ₦1,000
                'description' => 'For student family members - minimal contribution due to limited income',
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
