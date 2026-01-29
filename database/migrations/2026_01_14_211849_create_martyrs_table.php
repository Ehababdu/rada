<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('martyrs', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('national_id')->unique();
            $table->text('address');
                // Create foreign id columns without constraints to avoid ordering FK errors during migrate:fresh
                $table->foreignId('parents_status_id')->nullable();
                $table->foreignId('marital_status_id')->nullable();
            $table->integer('children_count')->nullable();
            $table->enum('wife_status', ['ارملة', 'متزوجة'])->nullable();
            $table->foreignId('employment_status_id')->nullable();
            // Job grade as FK (consolidated - final schema)
                $table->foreignId('job_grade_id')->nullable();
            // `workplace` and `previous_workplace` removed — use employer/employer_location relations
            $table->string('military_number')->nullable();
            $table->foreignId('military_rank_id')->nullable();
            $table->foreignId('bank_id')->nullable();
            $table->foreignId('branch_id')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->string('agent_name')->nullable();
            $table->string('agent_phone')->nullable();
            $table->string('agent_relationship')->nullable();
            $table->string('profile_image')->nullable();
            $table->string('agent_passport_number')->nullable();
            $table->date('death_date')->nullable();
            $table->boolean('has_martyr_decision')->default(false);
            $table->string('decision_number')->nullable();
            $table->date('decision_date')->nullable();
            // Final status enum consolidated (complete/incomplete)
            $table->enum('status', ['complete', 'incomplete'])->default('incomplete');

            // Employer and previous employer fields (consolidated)
                $table->foreignId('employer_id')->nullable();
                $table->foreignId('employer_location_id')->nullable();
            $table->boolean('has_previous_workplace')->default(false);
                $table->foreignId('previous_employer_id')->nullable();
                $table->foreignId('previous_employer_location_id')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        // Add indexes conditionally
        $indexes = [
            'martyrs_full_name_index' => ['full_name'],
            'martyrs_national_id_index' => ['national_id'],
            'martyrs_parents_status_id_index' => ['parents_status_id'],
            'martyrs_marital_status_id_index' => ['marital_status_id'],
            'martyrs_employment_status_id_index' => ['employment_status_id'],
            'martyrs_bank_id_index' => ['bank_id'],
            'martyrs_branch_id_index' => ['branch_id'],
            'martyrs_death_date_index' => ['death_date'],
            'martyrs_created_at_index' => ['created_at'],
        ];

        $driver = DB::getDriverName();

        foreach ($indexes as $indexName => $columns) {
            if ($driver === 'sqlite') {
                // SQLite in-memory DB used by tests doesn't support SHOW INDEX; attempt to add index directly
                try {
                    Schema::table('martyrs', function (Blueprint $table) use ($columns, $indexName) {
                        $table->index($columns, $indexName);
                    });
                } catch (\Exception $e) {
                    // ignore duplicate or unsupported index exceptions in sqlite during tests
                }

                continue;
            }

            $exists = DB::select('SHOW INDEX FROM `martyrs` WHERE Key_name = ?', [$indexName]);
            if (empty($exists)) {
                Schema::table('martyrs', function (Blueprint $table) use ($columns, $indexName) {
                    $table->index($columns, $indexName);
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('martyrs');
    }
};
