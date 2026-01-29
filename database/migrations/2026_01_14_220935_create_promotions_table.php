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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('martyr_id')->constrained()->onDelete('cascade');
            // references to ranks (ids) - converted from legacy strings in later migrations
            $table->unsignedBigInteger('current_rank')->nullable();
            $table->date('current_rank_date')->nullable();
            $table->unsignedBigInteger('promotion_rank')->nullable();
            $table->integer('promotion_years');
            $table->unsignedBigInteger('current_job_grade_id')->nullable();
            $table->unsignedBigInteger('promotion_job_grade_id')->nullable();
            $table->date('next_due_date');
            $table->text('description')->nullable();
            $table->enum('status', ['pending', 'overdue', 'completed'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
