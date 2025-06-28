<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at,
            'category_id' => $this->category_id,
            'category' => $this->when($this->relationLoaded('category'), [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'monthly_fee' => $this->category?->monthly_fee,
            ]),
            'monthly_fee' => $this->when(
                $this->relationLoaded('category'),
                function () {
                    return $this->category?->monthly_fee;
                }
            ),
            'outstanding_balance' => $this->when(
                $this->relationLoaded('contributions') && $this->relationLoaded('category'),
                function () {
                    if (!$this->category) {
                        return 0;
                    }
                    $monthsSinceStart = now()->diffInMonths($this->created_at) + 1;
                    $totalExpected = $monthsSinceStart * $this->category->monthly_fee;
                    $totalPaid = $this->contributions->sum('amount');
                    return max(0, $totalExpected - $totalPaid);
                }
            ),
            'total_contributions' => $this->when(
                $this->relationLoaded('contributions'),
                function () {
                    return $this->contributions->sum('amount');
                }
            ),
            'roles' => $this->when(
                $this->relationLoaded('roles'),
                function () {
                    return $this->roles->pluck('name');
                }
            ),
            'permissions' => $this->when(
                $this->relationLoaded('permissions'),
                function () {
                    return $this->getAllPermissions()->pluck('name');
                }
            ),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
