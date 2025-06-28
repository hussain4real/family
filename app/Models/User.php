<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'category_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function contributions(): HasMany
    {
        return $this->hasMany(Contribution::class);
    }

    public function recordedContributions(): HasMany
    {
        return $this->hasMany(Contribution::class, 'recorded_by_id');
    }

    public function getMonthlyFeeAttribute(): ?float
    {
        return $this->category?->monthly_fee;
    }

    public function getOutstandingBalanceAttribute(): float
    {
        if (!$this->category) {
            return 0;
        }

        $monthsSinceStart = now()->diffInMonths($this->created_at) + 1;
        $totalExpected = $monthsSinceStart * $this->category->monthly_fee;
        $totalPaid = $this->contributions->sum('amount');

        return max(0, $totalExpected - $totalPaid);
    }
}
