<?php

namespace App\Actions;

use App\Models\Contribution;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CreateContributionAction
{
    public function execute(array $data): Contribution
    {
        $this->validateData($data);

        return DB::transaction(function () use ($data) {
            return Contribution::create([
                'user_id' => $data['user_id'],
                'amount' => $data['amount'],
                'date' => Carbon::parse($data['date']),
                'recorded_by_id' => $data['recorded_by_id'],
                'notes' => $data['notes'] ?? $data['description'] ?? null,
            ]);
        });
    }

    private function validateData(array $data): void
    {
        if (!isset($data['user_id']) || !User::find($data['user_id'])) {
            throw ValidationException::withMessages(['user_id' => 'Invalid user selected.']);
        }

        if (!isset($data['amount']) || $data['amount'] <= 0) {
            throw ValidationException::withMessages(['amount' => 'Amount must be greater than zero.']);
        }

        if (!isset($data['date'])) {
            throw ValidationException::withMessages(['date' => 'Date is required.']);
        }

        try {
            Carbon::parse($data['date']);
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['date' => 'Invalid date provided.']);
        }

        if (!isset($data['recorded_by_id']) || !User::find($data['recorded_by_id'])) {
            throw ValidationException::withMessages(['recorded_by_id' => 'Invalid recorder.']);
        }
    }
}
