<?php

namespace App\Actions;

use App\Models\Category;
use App\Models\Contribution;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class GetContributionSummaryAction
{
    public function execute(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $startDate = $startDate ?? now()->startOfMonth();
        $endDate = $endDate ?? now()->endOfMonth();

        return [
            'total_collected' => $this->getTotalCollected($startDate, $endDate),
            'total_outstanding' => $this->getTotalOutstanding(),
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
        return User::with('category', 'contributions')
            ->get()
            ->sum(function ($user) {
                return $user->outstanding_balance ?? 0;
            });
    }

    private function getSummaryByCategory(Carbon $startDate, Carbon $endDate): Collection
    {
        return Category::with(['users.contributions' => function ($query) use ($startDate, $endDate) {
            $query->whereBetween('date', [$startDate, $endDate]);
        }])->get()->map(function ($category) {
            $totalCollected = $category->users->sum(function ($user) {
                return $user->contributions->sum('amount');
            });

            $totalOutstanding = $category->users->sum('outstanding_balance');

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
}
