<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Product;
use App\Models\Category;

echo "--- Populating Flags ---\n";
// Set some products as new arrivals
Product::where('status', 'active')->offset(0)->limit(2)->update(['is_new_arrival' => 1]);
// Set some products as trending
Product::where('status', 'active')->offset(1)->limit(2)->update(['is_trending' => 1]);
// Set some products as featured/ethnic wear (already done for 4, but let's be sure)
Product::where('status', 'active')->update(['is_ethnic_wear' => 1]);
// Set some products as suwish collection
Product::where('status', 'active')->offset(2)->limit(2)->update(['is_suwish_collection' => 1]);

echo "Update complete.\n";

echo "\n--- Data Summary ---\n";
echo "Active Products: " . Product::where('status', 'active')->count() . "\n";
echo "New Arrival: " . Product::where('status', 'active')->where('is_new_arrival', 1)->count() . "\n";
echo "Trending: " . Product::where('status', 'active')->where('is_trending', 1)->count() . "\n";
echo "Ethnic Wear: " . Product::where('status', 'active')->where('is_ethnic_wear', 1)->count() . "\n";
echo "Suwish Collection: " . Product::where('status', 'active')->where('is_suwish_collection', 1)->count() . "\n";

echo "\n--- Category Check ---\n";
$categories = Category::all();
echo "Total Categories: " . $categories->count() . "\n";
foreach($categories as $cat) {
    echo "- {$cat->name} (Active: " . ($cat->is_active ? 'Yes' : 'No') . ", Sort Order: {$cat->sort_order})\n";
}
