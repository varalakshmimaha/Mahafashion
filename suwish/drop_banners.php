<?php
require_once __DIR__.'/vendor/autoload.php';

use Illuminate\Support\Facades\DB;

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    DB::statement('DROP TABLE IF EXISTS banners');
    echo "Dropped table 'banners' if it existed.\n";
} catch (Exception $e) {
    echo "Error dropping table: " . $e->getMessage() . "\n";
}
