<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Alert;

Alert::create([
    'user_id' => 1,
    'title' => 'Real-time Test Alert',
    'message' => 'This alert should appear in real-time via WebSocket',
    'type' => 'success',
    'read_at' => null
]);

echo "Real-time alert created successfully!\n";