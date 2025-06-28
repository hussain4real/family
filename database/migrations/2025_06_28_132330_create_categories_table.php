<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // married, single, student
            $table->string('slug')->unique(); // married, single, student (for URL-friendly)
            $table->decimal('monthly_fee', 8, 2); // monthly contribution amount
            $table->text('description')->nullable(); // optional description
            $table->boolean('is_active')->default(true); // to enable/disable categories
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
