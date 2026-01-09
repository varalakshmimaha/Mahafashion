<?php
require_once __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Category;

echo "=== Category Images Check ===\n\n";

$categories = Category::where('is_active', true)->get();

foreach ($categories as $cat) {
    echo "ID: {$cat->id}\n";
    echo "Name: {$cat->name}\n";
    echo "Slug: {$cat->slug}\n";
    echo "Image (raw): {$cat->image}\n";
    echo "Image URL (computed): {$cat->image_url}\n";
    echo "---\n";
}

echo "\nTotal: " . $categories->count() . " categories\n";
