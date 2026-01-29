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
        Schema::create('employer_locations', function (Blueprint $table) {
            $table->id();
            $table->string('name_ar');
            $table->string('name_en');
            $table->boolean('is_active')->default(true);
            // optional link back to employer (set later)
            $table->unsignedBigInteger('employer_id')->nullable();
            $table->index('employer_id');
            $table->timestamps();

            $table->index('name_ar');
            $table->index('name_en');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employer_locations');
    }
};
