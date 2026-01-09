<?php
require_once __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use App\Models\Category;
use App\Models\Product;

echo "Categories count: " . Category::count() . "\n";
foreach (Category::all() as $cat) {
    echo "- {$cat->id}: {$cat->name}\n";
}

echo "Products count: " . Product::count() . "\n";
$p = Product::first();
if ($p) {
    echo "First product category_id: " . $p->category_id . "\n";
}
