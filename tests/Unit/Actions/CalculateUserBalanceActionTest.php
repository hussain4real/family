<?php

namespace Tests\Unit\Actions;

use App\Actions\CalculateUserBalanceAction;
use App\Models\Category;
use App\Models\Contribution;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CalculateUserBalanceActionTest extends TestCase
{
    use RefreshDatabase;

    protected CalculateUserBalanceAction $action;
    protected Category $category;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->action = new CalculateUserBalanceAction();

        $this->category = Category::create([
            'name' => 'Test Category',
            'slug' => 'test',
            'monthly_fee' => 50.00,
            'description' => 'Test category',
            'is_active' => true,
        ]);

        $this->user = User::factory()->create([
            'category_id' => $this->category->id,
            'created_at' => Carbon::parse('2024-01-01'),
        ]);
    }

    public function test_calculates_balance_for_user_with_no_payments()
    {
        // User created 3 months ago, no payments
        $asOfDate = Carbon::parse('2024-03-01');

        $result = $this->action->execute($this->user, $asOfDate);

        $this->assertEquals(50.00, $result['monthly_fee']);
        $this->assertEquals(3, $result['months_due']); // Jan, Feb, Mar
        $this->assertEquals(150.00, $result['total_expected']); // 3 * 50
        $this->assertEquals(0, $result['total_paid']);
        $this->assertEquals(150.00, $result['outstanding_balance']);
        $this->assertEquals('significantly_behind', $result['status']);
    }

    public function test_calculates_balance_for_user_up_to_date()
    {
        // User created 2 months ago, paid in full
        $asOfDate = Carbon::parse('2024-02-28');

        Contribution::create([
            'user_id' => $this->user->id,
            'amount' => 100.00, // 2 months worth
            'date' => Carbon::parse('2024-02-15'),
            'recorded_by_id' => $this->user->id,
        ]);

        $result = $this->action->execute($this->user, $asOfDate);

        $this->assertEquals(50.00, $result['monthly_fee']);
        $this->assertEquals(2, $result['months_due']); // Jan, Feb
        $this->assertEquals(100.00, $result['total_expected']);
        $this->assertEquals(100.00, $result['total_paid']);
        $this->assertEquals(0, $result['outstanding_balance']);
        $this->assertEquals('up_to_date', $result['status']);
    }

    public function test_calculates_balance_for_user_behind_one_month()
    {
        // User created 3 months ago, paid for 2 months
        $asOfDate = Carbon::parse('2024-03-31');

        Contribution::create([
            'user_id' => $this->user->id,
            'amount' => 100.00, // 2 months worth
            'date' => Carbon::parse('2024-02-15'),
            'recorded_by_id' => $this->user->id,
        ]);

        $result = $this->action->execute($this->user, $asOfDate);

        $this->assertEquals(3, $result['months_due']); // Jan, Feb, Mar
        $this->assertEquals(150.00, $result['total_expected']);
        $this->assertEquals(100.00, $result['total_paid']);
        $this->assertEquals(50.00, $result['outstanding_balance']);
        $this->assertEquals('behind_one_month', $result['status']);
    }

    public function test_calculates_balance_for_user_with_overpayment()
    {
        // User created 1 month ago, paid more than required
        $asOfDate = Carbon::parse('2024-01-31');

        Contribution::create([
            'user_id' => $this->user->id,
            'amount' => 100.00, // 2 months worth but only 1 month due
            'date' => Carbon::parse('2024-01-15'),
            'recorded_by_id' => $this->user->id,
        ]);

        $result = $this->action->execute($this->user, $asOfDate);

        $this->assertEquals(1, $result['months_due']);
        $this->assertEquals(50.00, $result['total_expected']);
        $this->assertEquals(100.00, $result['total_paid']);
        $this->assertEquals(0, $result['outstanding_balance']); // max(0, expected - paid)
        $this->assertEquals('up_to_date', $result['status']);
    }

    public function test_calculates_balance_for_user_without_category()
    {
        $userWithoutCategory = User::factory()->create([
            'category_id' => null,
        ]);

        $result = $this->action->execute($userWithoutCategory);

        $this->assertEquals(0, $result['monthly_fee']);
        $this->assertEquals(0, $result['months_due']);
        $this->assertEquals(0, $result['total_expected']);
        $this->assertEquals(0, $result['total_paid']);
        $this->assertEquals(0, $result['outstanding_balance']);
        $this->assertEquals('no_category', $result['status']);
    }

    public function test_calculates_balance_for_future_user()
    {
        // User created in the future relative to asOfDate
        $futureUser = User::factory()->create([
            'category_id' => $this->category->id,
            'created_at' => Carbon::parse('2024-05-01'),
        ]);

        $asOfDate = Carbon::parse('2024-03-01');

        $result = $this->action->execute($futureUser, $asOfDate);

        $this->assertEquals(0, $result['months_due']);
        $this->assertEquals(0, $result['total_expected']);
        $this->assertEquals(0, $result['outstanding_balance']);
        $this->assertEquals('up_to_date', $result['status']);
    }

    public function test_only_counts_payments_up_to_as_of_date()
    {
        $asOfDate = Carbon::parse('2024-02-15');

        // Payment before asOfDate (should be counted)
        Contribution::create([
            'user_id' => $this->user->id,
            'amount' => 30.00,
            'date' => Carbon::parse('2024-02-10'),
            'recorded_by_id' => $this->user->id,
        ]);

        // Payment after asOfDate (should NOT be counted)
        Contribution::create([
            'user_id' => $this->user->id,
            'amount' => 50.00,
            'date' => Carbon::parse('2024-02-20'),
            'recorded_by_id' => $this->user->id,
        ]);

        $result = $this->action->execute($this->user, $asOfDate);

        $this->assertEquals(30.00, $result['total_paid']); // Only the first payment
        $this->assertEquals(70.00, $result['outstanding_balance']); // 100 expected - 30 paid
    }

    public function test_uses_current_date_when_no_as_of_date_provided()
    {
        $result = $this->action->execute($this->user);

        $this->assertNotNull($result['as_of_date']);
        $this->assertEquals(now()->format('Y-m-d'), $result['as_of_date']);
    }
}
