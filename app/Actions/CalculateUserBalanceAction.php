<?php

namespace App\Actions;

use App\Models\User;
use Carbon\Carbon;

class CalculateUserBalanceAction
{
    public function execute(User $user, ?Carbon $asOfDate = null): array
    {
        $asOfDate = $asOfDate ?? now();

        if (!$user->category) {
            return [
                'monthly_fee' => 0,
                'months_due' => 0,
                'total_expected' => 0,
                'total_paid' => 0,
                'outstanding_balance' => 0,
                'status' => 'no_category',
            ];
        }

        $monthsDue = $this->calculateMonthsDue($user, $asOfDate);
        $totalExpected = $monthsDue * $user->category->monthly_fee;
        $totalPaid = $user->contributions()
            ->where('date', '<=', $asOfDate)
            ->sum('amount');

        $outstandingBalance = max(0, $totalExpected - $totalPaid);

        return [
            'monthly_fee' => $user->category->monthly_fee,
            'months_due' => $monthsDue,
            'total_expected' => $totalExpected,
            'total_paid' => $totalPaid,
            'outstanding_balance' => $outstandingBalance,
            'status' => $this->getPaymentStatus($outstandingBalance, $user->category->monthly_fee),
            'as_of_date' => $asOfDate->format('Y-m-d'),
        ];
    }

    private function calculateMonthsDue(User $user, Carbon $asOfDate): int
    {
        // Calculate months from user creation or a specific start date
        $startDate = $user->created_at;

        // If the user was created in the future relative to asOfDate, return 0
        if ($startDate->isAfter($asOfDate)) {
            return 0;
        }

        return $startDate->diffInMonths($asOfDate) + 1;
    }

    private function getPaymentStatus(float $outstandingBalance, float $monthlyFee): string
    {
        if ($outstandingBalance == 0) {
            return 'up_to_date';
        }

        if ($outstandingBalance <= $monthlyFee) {
            return 'behind_one_month';
        }

        return 'significantly_behind';
    }
}
