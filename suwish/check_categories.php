<?php
require_once __DIR__.'/vendor/autoload.php';

use Illuminate\Support\Facades\DB;

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    $dbPath = config('database.connections.sqlite.database');
    echo "Using SQLite DB path: $dbPath\n";

    if (!file_exists($dbPath)) {
        echo "ERROR: DB file not found.\n";
        exit(1);
    }

    $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    echo "Tables in DB:\n";
    foreach ($tables as $t) {
        echo "- " . $t->name . "\n";
    }

    $exists = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name='categories'");
    if (empty($exists)) {
        echo "\nTable 'categories' does NOT exist.\n";
    } else {
        $count = DB::table('categories')->count();
        echo "\nTable 'categories' exists. Row count: $count\n";

        $cols = DB::select("PRAGMA table_info('categories')");
        echo "Columns:\n";
        foreach ($cols as $c) {
            echo "- $c->name ($c->type)\n";
        }
    }

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
