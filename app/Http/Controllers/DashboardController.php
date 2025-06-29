<?php

namespace App\Http\Controllers;

use App\Actions\CalculateUserBalanceAction;
use App\Actions\GetContributionSummaryAction;
use App\Http\Resources\ContributionResource;
use App\Http\Resources\UserResource;
use App\Models\Contribution;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        private GetContributionSummaryAction $getSummary,
        private CalculateUserBalanceAction $calculateBalance,
    ) {}

    public function index(Request $request)
    {
        $user = $request->user();

        // Data for all users
        $userBalance = $this->calculateBalance->execute($user);

        // Recent contributions for the current user
        $recentContributions = $user->contributions()
            ->with('recordedBy')
            ->latest('date')
            ->limit(5)
            ->get();

        // Category information
        $category = $user->category;

        $data = [
            'user' => new UserResource($user->load('category')),
            'balance' => $userBalance,
            'recentContributions' => ContributionResource::collection($recentContributions),
            'category' => $category,
        ];

        // Add admin data if user has admin permissions
        if ($user->can('view-all-contributions')) {
            $summary = $this->getSummary->execute();

            // Get recent contributions from all users for admin
            $allRecentContributions = Contribution::with(['user.category', 'recordedBy'])
                ->latest('date')
                ->limit(10)
                ->get();

            // Get members who haven't contributed this month
            $currentMonth = now()->format('Y-m');
            $membersWithoutContribution = User::with('category')
                ->whereHas('category')
                ->whereDoesntHave('contributions', function ($query) use ($currentMonth) {
                    $query->whereRaw('strftime("%Y-%m", date) = ?', [$currentMonth]);
                })
                ->get();

            $data['adminData'] = [
                'summary' => $summary,
                'allRecentContributions' => ContributionResource::collection($allRecentContributions),
                'membersWithoutContribution' => UserResource::collection($membersWithoutContribution)->resolve(),
                'currentMonth' => now()->format('F Y'),
            ];
        }

        return Inertia::render('dashboard', $data);
    }
}
