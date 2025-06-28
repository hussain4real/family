<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContributionResource extends JsonResource
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
            'amount' => $this->amount,
            'date' => $this->date->format('Y-m-d'),
            'formatted_date' => $this->date->format('M d, Y'),
            'notes' => $this->notes,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'category' => $this->user->category?->name,
            ],
            'recorded_by' => [
                'id' => $this->recordedBy->id,
                'name' => $this->recordedBy->name,
            ],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
