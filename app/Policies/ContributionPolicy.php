<?php

namespace App\Policies;

use App\Models\Contribution;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ContributionPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view-all-contributions');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Contribution $contribution): bool
    {
        // Financial secretary can view all contributions
        if ($user->hasPermissionTo('view-all-contributions')) {
            return true;
        }

        // Contributors can only view their own contributions
        return $user->hasPermissionTo('view-own-contributions') &&
            $contribution->user_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create-contributions');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Contribution $contribution): bool
    {
        return $user->hasPermissionTo('update-contributions');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Contribution $contribution): bool
    {
        return $user->hasPermissionTo('delete-contributions');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Contribution $contribution): bool
    {
        return $user->hasPermissionTo('update-contributions');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Contribution $contribution): bool
    {
        return $user->hasPermissionTo('delete-contributions');
    }

    /**
     * Determine whether the user can view own contributions.
     */
    public function viewOwn(User $user): bool
    {
        return $user->hasPermissionTo('view-own-contributions');
    }

    /**
     * Determine whether the user can view reports.
     */
    public function viewReports(User $user): bool
    {
        return $user->hasPermissionTo('view-contribution-reports');
    }
}

