<?php

namespace App\Jobs;

use App\Exports\MartyrsExport;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class ExportMartyrs implements ShouldQueue
{
    use Queueable;

    protected $user;

    protected $filters;
    protected $columns;

    /**
     * Create a new job instance.
     */
    public function __construct(User $user, array $filters = [], array $columns = [])
    {
        $this->user = $user;
        $this->filters = $filters;
        $this->columns = $columns;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $fileName = 'martyrs_'.now()->format('Y-m-d_H-i-s').'.xlsx';
        $path = 'exports/'.$fileName;

        // Queue the export job using the Excel queue (so that heavy export work happens on the queue worker)
        Excel::queue(new MartyrsExport($this->filters, $this->columns ?? []), $path, 'public');

        // When queuing, the file might not exist immediately. We still provide a temporary URL (worker should generate the file soon).
        $url = Storage::disk('public')->temporaryUrl($path, now()->addMinutes(60));

        $this->user->notify(new \App\Notifications\MartyrsExportReady($url));
    }
}
