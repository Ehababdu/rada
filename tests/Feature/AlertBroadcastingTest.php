<?php

use App\Events\AlertCreated;
use App\Models\Alert;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;

uses(RefreshDatabase::class);

it('broadcasts alert creation', function () {
    Event::fake();

    $user = User::factory()->create();
    $alert = Alert::create([
        'title' => 'Test Alert',
        'message' => 'This is a test alert',
        'type' => 'info',
        'user_id' => $user->id,
    ]);

    Event::assertDispatched(AlertCreated::class, function ($event) use ($alert) {
        return $event->alert->id === $alert->id;
    });
});

it('alert creation event broadcasts to correct channel', function () {
    $user = User::factory()->create();

    $alert = Alert::create([
        'title' => 'Broadcast Test',
        'message' => 'Testing broadcast functionality',
        'type' => 'success',
        'user_id' => $user->id,
    ]);

    $event = new AlertCreated($alert);

    expect($event->broadcastOn())->toBe([
        "Illuminate\Broadcasting\PrivateChannel" => "alerts.{$user->id}"
    ]);

    expect($event->broadcastAs())->toBe('alert.created');
});