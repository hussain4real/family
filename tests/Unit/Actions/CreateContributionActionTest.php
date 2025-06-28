<?php

namespace Tests\Unit\Actions;

use App\Actions\CreateContributionAction;
use App\Models\Category;
use App\Models\Contribution;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class CreateContributionActionTest extends TestCase
{
    use RefreshDatabase;

    protected CreateContributionAction $action;
    protected User $user;
    protected User $recorder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->action = new CreateContributionAction();

        $category = Category::create([
            'name' => 'Test Category',
            'slug' => 'test',
            'monthly_fee' => 25.00,
            'notes' => 'Test category',
            'is_active' => true,
        ]);

        $this->user = User::factory()->create(['category_id' => $category->id]);
        $this->recorder = User::factory()->create(['category_id' => $category->id]);
    }

    public function test_creates_contribution_successfully()
    {
        $data = [
            'user_id' => $this->user->id,
            'amount' => 50.00,
            'date' => '2024-01-15',
            'recorded_by_id' => $this->recorder->id,
            'notes' => 'Test contribution',
        ];

        $contribution = $this->action->execute($data);

        $this->assertInstanceOf(Contribution::class, $contribution);
        $this->assertEquals($this->user->id, $contribution->user_id);
        $this->assertEquals(50.00, $contribution->amount);
        $this->assertEquals('2024-01-15', $contribution->date->format('Y-m-d'));
        $this->assertEquals($this->recorder->id, $contribution->recorded_by_id);
        $this->assertEquals('Test contribution', $contribution->notes);

        $this->assertDatabaseHas('contributions', [
            'user_id' => $this->user->id,
            'amount' => 50.00,
            'recorded_by_id' => $this->recorder->id,
        ]);
    }

    public function test_creates_contribution_without_description()
    {
        $data = [
            'user_id' => $this->user->id,
            'amount' => 25.00,
            'date' => '2024-01-15',
            'recorded_by_id' => $this->recorder->id,
        ];

        $contribution = $this->action->execute($data);

        $this->assertInstanceOf(Contribution::class, $contribution);
        $this->assertNull($contribution->notes);
    }

    public function test_throws_validation_exception_for_invalid_user()
    {
        $data = [
            'user_id' => 99999, // Non-existent user
            'amount' => 50.00,
            'date' => '2024-01-15',
            'recorded_by_id' => $this->recorder->id,
        ];

        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('Invalid user selected.');

        $this->action->execute($data);
    }

    public function test_throws_validation_exception_for_negative_amount()
    {
        $data = [
            'user_id' => $this->user->id,
            'amount' => -10.00,
            'date' => '2024-01-15',
            'recorded_by_id' => $this->recorder->id,
        ];

        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('Amount must be greater than zero.');

        $this->action->execute($data);
    }

    public function test_throws_validation_exception_for_zero_amount()
    {
        $data = [
            'user_id' => $this->user->id,
            'amount' => 0,
            'date' => '2024-01-15',
            'recorded_by_id' => $this->recorder->id,
        ];

        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('Amount must be greater than zero.');

        $this->action->execute($data);
    }

    public function test_throws_validation_exception_for_invalid_date()
    {
        $data = [
            'user_id' => $this->user->id,
            'amount' => 50.00,
            'date' => 'invalid-date',
            'recorded_by_id' => $this->recorder->id,
        ];

        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('Invalid date provided.');

        $this->action->execute($data);
    }

    public function test_throws_validation_exception_for_invalid_recorder()
    {
        $data = [
            'user_id' => $this->user->id,
            'amount' => 50.00,
            'date' => '2024-01-15',
            'recorded_by_id' => 99999, // Non-existent recorder
        ];

        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('Invalid recorder.');

        $this->action->execute($data);
    }

    public function test_throws_validation_exception_for_missing_user_id()
    {
        $data = [
            'amount' => 50.00,
            'date' => '2024-01-15',
            'recorded_by_id' => $this->recorder->id,
        ];

        $this->expectException(ValidationException::class);

        $this->action->execute($data);
    }

    public function test_throws_validation_exception_for_missing_amount()
    {
        $data = [
            'user_id' => $this->user->id,
            'date' => '2024-01-15',
            'recorded_by_id' => $this->recorder->id,
        ];

        $this->expectException(ValidationException::class);

        $this->action->execute($data);
    }
}
