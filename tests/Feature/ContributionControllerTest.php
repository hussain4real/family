<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Contribution;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ContributionControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $financialSecretary;
    protected User $contributor;
    protected Category $category;

    protected function setUp(): void
    {
        parent::setUp();

        // Create permissions and roles
        Permission::create(['name' => 'view-own-contributions']);
        Permission::create(['name' => 'view-all-contributions']);
        Permission::create(['name' => 'create-contributions']);
        Permission::create(['name' => 'delete-contributions']);

        $contributorRole = Role::create(['name' => 'contributor']);
        $contributorRole->givePermissionTo(['view-own-contributions']);

        $secretaryRole = Role::create(['name' => 'financial-secretary']);
        $secretaryRole->givePermissionTo([
            'view-own-contributions',
            'view-all-contributions',
            'create-contributions',
            'delete-contributions',
        ]);

        // Create category
        $this->category = Category::create([
            'name' => 'Married',
            'slug' => 'married',
            'monthly_fee' => 50.00,
            'description' => 'Married members',
            'is_active' => true,
        ]);

        // Create users
        $this->financialSecretary = User::factory()->create([
            'category_id' => $this->category->id,
        ]);
        $this->financialSecretary->assignRole('financial-secretary');

        $this->contributor = User::factory()->create([
            'category_id' => $this->category->id,
        ]);
        $this->contributor->assignRole('contributor');
    }

    public function test_contributor_can_view_own_contributions()
    {
        // Create some contributions for the contributor
        Contribution::factory()->count(3)->create([
            'user_id' => $this->contributor->id,
            'recorded_by_id' => $this->financialSecretary->id,
        ]);

        $response = $this->actingAs($this->contributor)
            ->get(route('contributions.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page->component('Contributions/Index'));
    }

    public function test_contributor_cannot_view_other_contributions()
    {
        $otherUser = User::factory()->create(['category_id' => $this->category->id]);
        $otherUser->assignRole('contributor');

        $contribution = Contribution::factory()->create([
            'user_id' => $otherUser->id,
            'recorded_by_id' => $this->financialSecretary->id,
        ]);

        $response = $this->actingAs($this->contributor)
            ->get(route('contributions.show', $contribution));

        $response->assertStatus(403);
    }

    public function test_financial_secretary_can_view_admin_dashboard()
    {
        $response = $this->actingAs($this->financialSecretary)
            ->get(route('contributions.admin'));

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page->component('Contributions/Admin'));
    }

    public function test_contributor_cannot_access_admin_dashboard()
    {
        $response = $this->actingAs($this->contributor)
            ->get(route('contributions.admin'));

        $response->assertStatus(403);
    }

    public function test_financial_secretary_can_create_contribution()
    {
        $contributionData = [
            'user_id' => $this->contributor->id,
            'amount' => 50.00,
            'date' => now()->format('Y-m-d'),
            'description' => 'Monthly contribution',
        ];

        $response = $this->actingAs($this->financialSecretary)
            ->post(route('contributions.store'), $contributionData);

        $response->assertRedirect(route('contributions.admin'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('contributions', [
            'user_id' => $this->contributor->id,
            'amount' => 50.00,
            'recorded_by_id' => $this->financialSecretary->id,
        ]);
    }

    public function test_contributor_cannot_create_contribution()
    {
        $contributionData = [
            'user_id' => $this->contributor->id,
            'amount' => 50.00,
            'date' => now()->format('Y-m-d'),
        ];

        $response = $this->actingAs($this->contributor)
            ->post(route('contributions.store'), $contributionData);

        $response->assertStatus(403);
    }

    public function test_financial_secretary_can_delete_contribution()
    {
        $contribution = Contribution::factory()->create([
            'user_id' => $this->contributor->id,
            'recorded_by_id' => $this->financialSecretary->id,
        ]);

        $response = $this->actingAs($this->financialSecretary)
            ->delete(route('contributions.destroy', $contribution));

        $response->assertRedirect(route('contributions.admin'));
        $response->assertSessionHas('success');

        $this->assertDatabaseMissing('contributions', [
            'id' => $contribution->id,
        ]);
    }

    public function test_validation_prevents_negative_amounts()
    {
        $contributionData = [
            'user_id' => $this->contributor->id,
            'amount' => -10.00,
            'date' => now()->format('Y-m-d'),
        ];

        $response = $this->actingAs($this->financialSecretary)
            ->post(route('contributions.store'), $contributionData);

        $response->assertSessionHasErrors(['amount']);
    }

    public function test_validation_prevents_future_dates()
    {
        $contributionData = [
            'user_id' => $this->contributor->id,
            'amount' => 50.00,
            'date' => now()->addDay()->format('Y-m-d'),
        ];

        $response = $this->actingAs($this->financialSecretary)
            ->post(route('contributions.store'), $contributionData);

        $response->assertSessionHasErrors(['date']);
    }
}
