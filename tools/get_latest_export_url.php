<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Storage;

$dir = storage_path('app/public/exports');
if (!is_dir($dir)) {
    echo json_encode(['error' => 'no_export_dir']);
    exit;
}

$files = array_values(array_filter(scandir($dir), function ($f) use ($dir) {
    return is_file($dir . DIRECTORY_SEPARATOR . $f);
}));

if (empty($files)) {
    echo json_encode(['error' => 'no_files']);
    exit;
}

// sort by filemtime desc
usort($files, function ($a, $b) use ($dir) {
    return filemtime($dir . DIRECTORY_SEPARATOR . $b) <=> filemtime($dir . DIRECTORY_SEPARATOR . $a);
});

$latest = $files[0];
$path = 'exports/' . $latest;
try {
    $url = Storage::disk('public')->temporaryUrl($path, now()->addMinutes(60));
    echo json_encode(['file' => $latest, 'path' => $path, 'url' => $url]);
} catch (Exception $e) {
    // fallback to public storage URL if temporaryUrl isn't supported (local disk)
    try {
        $appUrl = config('app.url') ?? env('APP_URL') ?? 'http://127.0.0.1:8000';
        $publicUrl = rtrim($appUrl, '/') . '/storage/' . $path;
        echo json_encode(['file' => $latest, 'path' => $path, 'url' => $publicUrl, 'note' => 'fallback_public_storage']);
    } catch (Exception $e2) {
        echo json_encode(['file' => $latest, 'path' => $path, 'error' => $e->getMessage()]);
    }
}
