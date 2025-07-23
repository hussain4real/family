<?php

use App\Models\User;
use App\Models\Category;
use App\Models\Contribution;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Gate;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create permissions
    Permission::create(['name' => 'create-contributions']);
    Permission::create(['name' => 'view-all-contributions']);
    
    $this->user = User::factory()->create();
    $this->category = Category::factory()->create();
    $this->user->update(['category_id' => $this->category->id]);
    
    // Give user necessary permissions
    $this->user->givePermissionTo(['create-contributions', 'view-all-contributions']);
    $this->actingAs($this->user);
    
    // Mock Gate to allow all operations
    Gate::before(function ($user, $ability) {
        return true;
    });
});

test('successful contribution creation shows success flash message', function () {
    $contributionData = [
        'user_id' => $this->user->id,
        'amount' => 100.00,
        'date' => '2024-01-01',
        'notes' => 'Test contribution'
    ];

    $response = $this->post(route('contributions.store'), $contributionData);

    $response->assertRedirect(route('contributions.admin'));
    $response->assertSessionHas('flash.status', 'success');
    $response->assertSessionHas('flash.message', 'Contribution recorded successfully.');
});

test('error test parameter shows error flash message', function () {
    $contributionData = [
        'user_id' => $this->user->id,
        'amount' => 100.00,
        'date' => '2024-01-01',
        'notes' => 'Test contribution',
        'test_error' => true
    ];

    $response = $this->post(route('contributions.store'), $contributionData);

    $response->assertRedirect(route('contributions.admin'));
    $response->assertSessionHas('flash.status', 'error');
    $response->assertSessionHas('flash.message', 'This is a test error to verify the red alert functionality.');
});
