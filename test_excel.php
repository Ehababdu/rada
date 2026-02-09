<?php
require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Maatwebsite\Excel\Facades\Excel;

$export = new App\Exports\MartyrsExport([], ['full_name', 'national_id'], []);
Excel::store($export, 'test_export.xlsx', 'public');

echo "Excel file created\n";
