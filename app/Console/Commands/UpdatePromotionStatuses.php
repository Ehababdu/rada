<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class UpdatePromotionStatuses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'promotions:update-statuses';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update promotion statuses based on due dates';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Updating promotion statuses...');

        $promotions = \App\Models\Promotion::where('status', '!=', 'completed')->get();
        $updated = 0;

        foreach ($promotions as $promotion) {
            $oldStatus = $promotion->status;

            if ($promotion->next_due_date->isPast()) {
                $promotion->status = 'overdue';
            } else {
                $promotion->status = 'pending';
            }

            if ($oldStatus !== $promotion->status) {
                $promotion->save();
                $updated++;
            }
        }

        $this->info("Updated {$updated} promotions");
        $this->info('Promotion statuses updated successfully!');
    }
}
