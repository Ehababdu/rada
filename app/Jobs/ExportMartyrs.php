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

    protected $ids;

    /**
     * Create a new job instance.
     */
    public function __construct(User $user, array $filters = [], array $columns = [], array $ids = [])
    {
        $this->user = $user;
        $this->filters = $filters;
        $this->columns = $columns;
        $this->ids = $ids;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $fileName = 'martyrs_' . now()->format('Y-m-d_H-i-s') . '.xlsx';
        $path = 'exports/' . $fileName;

        // Queue the export job using the Excel queue (so that heavy export work happens on the queue worker)
        Excel::queue(new MartyrsExport($this->filters, $this->columns ?? [], $this->ids ?? []), $path, 'public');

        // For local development, use a regular URL instead of temporary URL
        $url = Storage::disk('public')->url($path);

        $this->user->notify(new \App\Notifications\MartyrsExportReady($url));
    }
}
