<?php

namespace Tests\Unit\Actions;

use App\Actions\CalculateUserBalanceAction;
use App\Actions\GetContributionSummaryAction;
use App\Models\Category;
use App\Models\Contribution;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GetContributionSummaryActionTest extends TestCase
{
    use RefreshDatabase;

    protected GetContributionSummaryAction $action;
    protected Category $employedCategory;
    protected Category $unemployedCategory;
    protected User $employedUser;
    protected User $unemployedUser;

    protected function setUp(): void
    {
        parent::setUp();

        $calculateBalanceAction = new CalculateUserBalanceAction();
        $this->action = new GetContributionSummaryAction($calculateBalanceAction);

        // Create categories
        $this->employedCategory = Category::create([
            'name' => 'Employed',
            'slug' => 'employed',
            'monthly_fee' => 4000.00,
            'notes' => 'Employed members',
            'is_active' => true,
        ]);

        $this->unemployedCategory = Category::create([
            'name' => 'Unemployed',
            'slug' => 'unemployed',
            'monthly_fee' => 2000.00,
            'notes' => 'Unemployed members',
            'is_active' => true,
        ]);

        // Create users
        $this->employedUser = User::factory()->create([
            'category_id' => $this->employedCategory->id,
            'created_at' => now()->subMonths(2), // Created 2 months ago
        ]);

        $this->unemployedUser = User::factory()->create([
            'category_id' => $this->unemployedCategory->id,
            'created_at' => now()->subMonths(2), // Created 2 months ago
        ]);
    }

    public function test_calculates_summary_for_current_month()
    {
        // Create contributions for current month
        Contribution::create([
            'user_id' => $this->employedUser->id,
            'amount' => 4000.00,
            'date' => now()->startOfMonth()->addDays(5),
            'recorded_by_id' => $this->employedUser->id,
        ]);

        Contribution::create([
            'user_id' => $this->unemployedUser->id,
            'amount' => 2000.00,
            'date' => now()->startOfMonth()->addDays(10),
            'recorded_by_id' => $this->unemployedUser->id,
        ]);

        $summary = $this->action->execute();

        $this->assertEquals(6000.00, $summary['total_collected']); // 4000 + 2000
        $this->assertGreaterThan(0, $summary['total_outstanding']);
        $this->assertCount(2, $summary['by_category']);
        $this->assertInstanceOf(\Illuminate\Support\Collection::class, $summary['recent_contributions']);
        $this->assertEquals(now()->startOfMonth()->format('Y-m-d'), $summary['period']['start']);
        $this->assertEquals(now()->endOfMonth()->format('Y-m-d'), $summary['period']['end']);
    }

    public function test_calculates_summary_for_custom_date_range()
    {
        $startDate = Carbon::parse('2024-01-01');
        $endDate = Carbon::parse('2024-01-31');

        // Create contributions within date range
        Contribution::create([
            'user_id' => $this->employedUser->id,
            'amount' => 4000.00,
            'date' => Carbon::parse('2024-01-15'),
            'recorded_by_id' => $this->employedUser->id,
        ]);

        // Create contribution outside date range
        Contribution::create([
            'user_id' => $this->unemployedUser->id,
            'amount' => 2000.00,
            'date' => Carbon::parse('2024-02-15'),
            'recorded_by_id' => $this->unemployedUser->id,
        ]);

        $summary = $this->action->execute($startDate, $endDate);

        $this->assertEquals(4000.00, $summary['total_collected']); // Only January contribution
        $this->assertEquals('2024-01-01', $summary['period']['start']);
        $this->assertEquals('2024-01-31', $summary['period']['end']);
    }

    public function test_handles_empty_data_gracefully()
    {
        $summary = $this->action->execute();

        $this->assertEquals(0, $summary['total_collected']);
        $this->assertGreaterThanOrEqual(0, $summary['total_outstanding']);
        $this->assertInstanceOf(\Illuminate\Support\Collection::class, $summary['by_category']);
        $this->assertInstanceOf(\Illuminate\Support\Collection::class, $summary['recent_contributions']);
        $this->assertArrayHasKey('period', $summary);
    }
}
