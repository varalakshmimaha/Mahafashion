<?php
require_once __DIR__.'/vendor/autoload.php';
use Illuminate\Support\Facades\DB;
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
try {
    $cols = DB::select("PRAGMA table_info('product_subcategories')");
    echo "product_subcategories table columns:\n";
    foreach ($cols as $c) {
        echo "- $c->name ($c->type)\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
