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
        Schema::create('scout_index', function (Blueprint $table) {
            $table->id();
            $table->string('index');
            $table->string('object_id');
            $table->string('object_type');
            $table->json('data');
            $table->timestamps();

            $table->unique(['index', 'object_id', 'object_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scout_index');
    }
};
