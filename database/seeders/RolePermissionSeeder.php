<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'view-own-contributions',
            'view-all-contributions',
            'create-contributions',
            'update-contributions',
            'delete-contributions',
            'view-contribution-reports',
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $contributorRole = Role::updateOrCreate(['name' => 'contributor']);
        $contributorRole->givePermissionTo(['view-own-contributions']);

        $financialSecretaryRole = Role::updateOrCreate(['name' => 'financial-secretary']);
        $financialSecretaryRole->givePermissionTo([
            'view-own-contributions',
            'view-all-contributions',
            'create-contributions',
            'update-contributions',
            'delete-contributions',
            'view-contribution-reports',
        ]);
    }
}
