<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

$columns = Schema::getColumnListing('banners');
echo "Columns in 'banners' table:\n";
print_r($columns);

$migrations = DB::table('migrations')->get();
echo "\nMigrations run:\n";
foreach ($migrations as $m) {
    echo $m->migration . "\n";
}
