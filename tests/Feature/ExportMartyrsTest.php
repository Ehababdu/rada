<?php

namespace Tests\Feature;

use App\Jobs\ExportMartyrs;
use App\Models\User;
use App\Notifications\MartyrsExportReady;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Tests\TestCase;

class ExportMartyrsTest extends TestCase
{
    use RefreshDatabase;

    public function test_export_route_dispatches_job()
    {
        Bus::fake();

        $user = User::factory()->create();
        \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'martyrs.export']);
        $user->givePermissionTo('martyrs.export');

        $this->actingAs($user)
            ->post('/martyrs/export', ['search' => 'test'])
            ->assertSessionHas('success');

        Bus::assertDispatched(ExportMartyrs::class);
    }

    public function test_export_job_handles_and_notifies_user()
    {
        // Integration-style: set queue to sync so Excel::queue runs synchronously
        config(['queue.default' => 'sync']);

        Notification::fake();
        Storage::shouldReceive('disk')->with('public')->andReturnSelf();
        Storage::shouldReceive('url')->andReturn('http://example.com/export.xlsx');

        // Ensure the actual store call is intercepted when the queued job runs
        Excel::shouldReceive('store')->once()->andReturnTrue();
        // When Excel::queue is called (the queued export), execute the store immediately (sync)
        Excel::shouldReceive('queue')->once()->andReturnUsing(function ($export, $path, $disk) {
            \Maatwebsite\Excel\Facades\Excel::store($export, $path, $disk);

            return true;
        });

        $user = User::factory()->create();

        $job = new ExportMartyrs($user, ['search' => 'x']);
        $job->handle();

        Notification::assertSentTo($user, MartyrsExportReady::class, function ($notification, $channels) use ($user) {
            $data = $notification->toArray($user);

            return isset($data['download_url']) && $data['download_url'] === 'http://example.com/export.xlsx';
        });
    }
}
