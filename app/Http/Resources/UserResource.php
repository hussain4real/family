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
            'category' => $this->when($this->category, [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'monthly_fee' => $this->category?->monthly_fee,
            ]),
            'monthly_fee' => $this->monthly_fee,
            'outstanding_balance' => $this->outstanding_balance,
            'total_contributions' => $this->when(
                $this->relationLoaded('contributions'),
                $this->contributions->sum('amount')
            ),
            'roles' => $this->when(
                $this->relationLoaded('roles'),
                $this->roles->pluck('name')
            ),
            'permissions' => $this->when(
                $this->relationLoaded('permissions'),
                $this->getAllPermissions()->pluck('name')
            ),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
