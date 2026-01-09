<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Product;

echo "--- Ethnic Wear Products ---\n";
$ethnic = Product::where('is_ethnic_wear', 1)->get();
echo "Count: " . $ethnic->count() . "\n";
foreach($ethnic as $p) {
    echo "- {$p->name} (ID: {$p->id}, Image: {$p->image_url})\n";
}

// Update some products to populate collections if they are nearly empty
if ($ethnic->count() < 4) {
    echo "Updating products to populate Ethnic Wear...\n";
    Product::where('is_ethnic_wear', 0)->take(4)->update(['is_ethnic_wear' => 1]);
}

echo "\n--- Suwish Collection Products ---\n";
$suwish = Product::where('is_suwish_collection', 1)->get();
echo "Count: " . $suwish->count() . "\n";
foreach($suwish as $p) {
    echo "- {$p->name} (ID: {$p->id}, Image: {$p->image_url})\n";
}

if ($suwish->count() < 3) {
    echo "Updating products to populate Suwish Collection...\n";
    Product::where('is_suwish_collection', 0)->skip(4)->take(3)->update(['is_suwish_collection' => 1]);
}
