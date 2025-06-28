<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreContributionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->can('create-contributions');
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'date' => ['required', 'date', 'before_or_equal:today'],
            'notes' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'], // Keep for backward compatibility
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'Please select a family member.',
            'user_id.exists' => 'The selected family member is invalid.',
            'amount.required' => 'Please enter the contribution amount.',
            'amount.min' => 'The contribution amount must be greater than zero.',
            'date.required' => 'Please select the contribution date.',
            'date.before_or_equal' => 'The contribution date cannot be in the future.',
        ];
    }
}
