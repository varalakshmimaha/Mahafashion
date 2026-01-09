<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Product;
use App\Models\Category;

echo "--- Data Verification ---\n";
echo "Total Products: " . Product::count() . "\n";
foreach(Product::all() as $p) {
    echo "- Name: {$p->name}, Status: {$p->status}, NewArrival: {$p->is_new_arrival}, Trending: {$p->is_trending}, Ethnic: {$p->is_ethnic_wear}, Suwish: {$p->is_suwish_collection}\n";
}
echo "Active Products count: " . Product::where('status', 'active')->count() . "\n";
echo "New Arrival (Active): " . Product::where('status', 'active')->where('is_new_arrival', 1)->count() . "\n";
echo "Trending (Active): " . Product::where('status', 'active')->where('is_trending', 1)->count() . "\n";
echo "Ethnic Wear (Active): " . Product::where('status', 'active')->where('is_ethnic_wear', 1)->count() . "\n";
echo "Suwish Collection (Active): " . Product::where('status', 'active')->where('is_suwish_collection', 1)->count() . "\n";

echo "\n--- Categories ---\n";
echo "Total Categories: " . Category::count() . "\n";
foreach(Category::all() as $cat) {
    echo "- Name: {$cat->name}, Slug: {$cat->slug}, Active: " . ($cat->is_active ? 'Yes' : 'No') . ", Image: {$cat->image}\n";
}
