<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            CategorySeeder::class,
        ]);

        // Create categories first, then users
        $employedCategory = \App\Models\Category::where('slug', 'employed')->first();
        $unemployedCategory = \App\Models\Category::where('slug', 'unemployed')->first();
        $studentCategory = \App\Models\Category::where('slug', 'student')->first();

        // Create test financial secretary
        $financialSecretary = User::factory()->create([
            'name' => 'Financial Secretary',
            'email' => 'secretary@family.com',
            'category_id' => $employedCategory->id,
        ]);
        $financialSecretary->assignRole('financial-secretary');

        // Create test contributors
        $contributor1 = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@family.com',
            'category_id' => $employedCategory->id,
        ]);
        $contributor1->assignRole('contributor');

        $contributor2 = User::factory()->create([
            'name' => 'Jane Smith',
            'email' => 'jane@family.com',
            'category_id' => $unemployedCategory->id,
        ]);
        $contributor2->assignRole('contributor');

        $contributor3 = User::factory()->create([
            'name' => 'Bob Student',
            'email' => 'bob@family.com',
            'category_id' => $studentCategory->id,
        ]);
        $contributor3->assignRole('contributor');
    }
}
