<?php

namespace App\Actions;

use App\Models\Category;
use App\Models\Contribution;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class GetContributionSummaryAction
{
    public function __construct(
        private CalculateUserBalanceAction $calculateBalance
    ) {}

    public function execute(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $startDate = $startDate ?? now()->startOfMonth();
        $endDate = $endDate ?? now()->endOfMonth();

        $totalCollected = $this->getTotalCollected($startDate, $endDate);
        $totalMembers = $this->getTotalMembers();
        $monthlyTarget = $this->getMonthlyTarget();
        $collectionRate = $monthlyTarget > 0 ? ($totalCollected / $monthlyTarget) * 100 : 0;

        return [
            'total_collected' => $totalCollected,
            'total_outstanding' => $this->getTotalOutstanding(),
            'total_all_time_collected' => $this->getTotalAllTimeCollected(),
            'monthly_target' => $monthlyTarget,
            'collection_rate' => $collectionRate,
            'total_members' => $totalMembers,
            'by_category' => $this->getSummaryByCategory($startDate, $endDate),
            'recent_contributions' => $this->getRecentContributions(),
            'period' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
        ];
    }

    private function getTotalCollected(Carbon $startDate, Carbon $endDate): float
    {
        return Contribution::whereBetween('date', [$startDate, $endDate])
            ->sum('amount');
    }

    private function getTotalOutstanding(): float
    {
        return User::with('category')
            ->whereHas('category')
            ->get()
            ->sum(function ($user) {
                $balance = $this->calculateBalance->execute($user);
                return $balance['outstanding_balance'];
            });
    }

    private function getTotalAllTimeCollected(): float
    {
        return Contribution::sum('amount');
    }

    private function getSummaryByCategory(Carbon $startDate, Carbon $endDate): Collection
    {
        return Category::with(['users.contributions' => function ($query) use ($startDate, $endDate) {
            $query->whereBetween('date', [$startDate, $endDate]);
        }])->get()->map(function ($category) {
            $totalCollected = $category->users->sum(function ($user) {
                return $user->contributions->sum('amount');
            });

            $totalOutstanding = $category->users->sum(function ($user) {
                $balance = $this->calculateBalance->execute($user);
                return $balance['outstanding_balance'];
            });

            return [
                'category' => $category->name,
                'total_members' => $category->users->count(),
                'total_collected' => $totalCollected,
                'total_outstanding' => $totalOutstanding,
                'monthly_fee' => $category->monthly_fee,
            ];
        });
    }

    private function getRecentContributions(int $limit = 10): Collection
    {
        return Contribution::with(['user', 'recordedBy'])
            ->latest('date')
            ->limit($limit)
            ->get();
    }

    private function getTotalMembers(): int
    {
        return User::whereHas('category')->count();
    }

    private function getMonthlyTarget(): float
    {
        return User::with('category')
            ->whereHas('category')
            ->get()
            ->sum(function ($user) {
                return $user->category->monthly_fee ?? 0;
            });
    }
}
