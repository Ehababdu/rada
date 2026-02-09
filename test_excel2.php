<?php
require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Maatwebsite\Excel\Facades\Excel;

$export = new App\Exports\MartyrsExport([], [], []);
Excel::store($export, 'test_export_full.xlsx', 'public');

echo "Full Excel file created\n";
