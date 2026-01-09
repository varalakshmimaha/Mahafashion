<?php
require_once __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$p = App\Models\Product::first();
if (!$p) {
    echo "No products found\n";
    exit;
}
echo "Product found: " . $p->name . "\n";
echo "Category via relation: " . ($p->category ? $p->category->name : 'NULL') . "\n";
echo "Primary subcategory via relation: " . ($p->primary_subcategory ? $p->primary_subcategory->name : 'NULL') . "\n";
