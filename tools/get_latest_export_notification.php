<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$notif = DB::table('notifications')
    ->where('type', 'App\\Notifications\\MartyrsExportReady')
    ->orderBy('created_at', 'desc')
    ->first();

if (! $notif) {
    echo json_encode(null);
    exit;
}

// decode data JSON
$data = json_decode($notif->data, true);
$download = $data['download_url'] ?? null;

$result = [
    'id' => $notif->id,
    'type' => $notif->type,
    'created_at' => $notif->created_at,
    'download_url' => $download,
];

echo json_encode($result);
