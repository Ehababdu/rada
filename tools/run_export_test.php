<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Exports\MartyrsExport;
use Maatwebsite\Excel\Facades\Excel;

$filters = [
    // example filter: search => '',
];
$columns = ['full_name', 'national_id', 'military_rank', 'bank', 'death_date'];

$filename = 'martyrs_test_' . date('Y-m-d_H-i-s') . '.xlsx';
$path = 'exports/' . $filename;

try {
    Excel::store(new MartyrsExport($filters, $columns), $path, 'public');
    $full = storage_path('app/public/' . $path);
    if (file_exists($full)) {
        echo json_encode(['ok' => true, 'file' => $full, 'size' => filesize($full)]);
    } else {
        echo json_encode(['ok' => false, 'error' => 'file_not_found', 'path' => $full]);
    }
} catch (Exception $e) {
    echo json_encode(['ok' => false, 'exception' => $e->getMessage()]);
}
