<?php

namespace App\Http\Controllers;

use App\Actions\CalculateUserBalanceAction;
use App\Actions\CreateContributionAction;
use App\Actions\GetContributionSummaryAction;
use App\Http\Requests\StoreContributionRequest;
use App\Http\Resources\ContributionResource;
use App\Http\Resources\UserResource;
use App\Models\Category;
use App\Models\Contribution;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ContributionController extends Controller
{
    public function __construct(
        private CreateContributionAction $createContribution,
        private GetContributionSummaryAction $getSummary,
        private CalculateUserBalanceAction $calculateBalance,
    ) {
        $this->middleware('permission:view-own-contributions')->only(['index', 'show']);
        $this->middleware('permission:view-all-contributions')->only(['adminIndex']);
        $this->middleware('permission:create-contributions')->only(['create', 'store']);
        $this->middleware('permission:update-contributions')->only(['edit', 'update']);
        $this->middleware('permission:delete-contributions')->only(['destroy']);
    }

    public function index(Request $request)
    {
        $user = $request->user();

        $contributions = $user->contributions()
            ->with('recordedBy')
            ->latest('date')
            ->paginate(15);

        $balance = $this->calculateBalance->execute($user);

        return Inertia::render('Contributions/Index', [
            'contributions' => ContributionResource::collection($contributions)->resolve(),
            'balance' => $balance,
            'user' => new UserResource($user),
        ]);
    }

    public function adminIndex(Request $request)
    {
        $this->authorize('viewAny', Contribution::class);

        $contributions = Contribution::with(['user.category', 'recordedBy'])
            ->when($request->category_id, function ($query, $categoryId) {
                $query->whereHas('user', function ($q) use ($categoryId) {
                    $q->where('category_id', $categoryId);
                });
            })
            ->when($request->user_id, function ($query, $userId) {
                $query->where('user_id', $userId);
            })
            ->latest('date')
            ->paginate(20);

        $summary = $this->getSummary->execute();

        // Get recent contributions (last 10)
        $recentContributions = Contribution::with(['user.category', 'recordedBy'])
            ->latest('date')
            ->limit(10)
            ->get();

        // Get all users with categories for the create form
        $users = User::with('category')
            ->whereHas('category')
            ->orderBy('name')
            ->get();

        // Get all categories
        $categories = \App\Models\Category::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Contributions/Admin', [
            'contributions' => ContributionResource::collection($contributions)->resolve(),
            'summary' => $summary,
            'recentContributions' => ContributionResource::collection($recentContributions)->resolve(),
            'users' => UserResource::collection($users)->resolve(),
            'categories' => $categories,
            'filters' => $request->only(['category_id', 'user_id']),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Contribution::class);

        $users = User::with('category')
            ->whereHas('category')
            ->orderBy('name')
            ->get();

        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Contributions/Create', [
            'users' => UserResource::collection($users)->resolve(),
            'categories' => $categories,
        ]);
    }

    public function store(StoreContributionRequest $request)
    {
        $this->authorize('create', Contribution::class);

        $contribution = $this->createContribution->execute([
            ...$request->validated(),
            'recorded_by_id' => Auth::id(),
        ]);

        return redirect()
            ->route('contributions.admin')
            ->with('success', 'Contribution recorded successfully.');
    }

    public function show(Contribution $contribution)
    {
        $this->authorize('view', $contribution);

        return Inertia::render('Contributions/Show', [
            'contribution' => new ContributionResource($contribution->load(['user.category', 'recordedBy'])),
        ]);
    }

    public function destroy(Contribution $contribution)
    {
        $this->authorize('delete', $contribution);

        $contribution->delete();

        return redirect()
            ->route('contributions.admin')
            ->with('success', 'Contribution deleted successfully.');
    }
}
