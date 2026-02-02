<?php

namespace App\Jobs;

use App\Exports\PromotionsExport;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class ExportPromotions implements ShouldQueue
{
    use Queueable;

    protected $user;

    protected $filters;

    /**
     * Create a new job instance.
     */
    public function __construct(User $user, array $filters = [])
    {
        $this->user = $user;
        $this->filters = $filters;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $fileName = 'promotions_'.now()->format('Y-m-d_H-i-s').'.xlsx';
        $path = 'exports/'.$fileName;

        // Queue the export job using the Excel queue (so that heavy export work happens on the queue worker)
        Excel::queue(new PromotionsExport($this->filters), $path, 'public');

        // For local development, use a regular URL instead of temporary URL
        $url = Storage::disk('public')->url($path);

        $this->user->notify(new \App\Notifications\PromotionsExportReady($url));
    }
}