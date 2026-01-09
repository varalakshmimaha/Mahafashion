<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Checking and Fixing Data ===\n\n";

// 1. Fix footer_content (remove duplicate copyright)
echo "1. Fixing footer content...\n";
DB::table('settings')->where('key', 'footer_content')->update(['value' => '']);
echo "   - footer_content cleared\n";

// 2. Check banners
echo "\n2. Checking banners...\n";
$banners = DB::table('banners')->get();
if ($banners->count() > 0) {
    foreach ($banners as $banner) {
        echo "   - Banner #{$banner->id}: {$banner->image_path} (Active: " . ($banner->is_active ? 'Yes' : 'No') . ")\n";
    }
} else {
    echo "   - No banners found! Creating sample banners...\n";
    
    // Create sample banners using existing saree images
    DB::table('banners')->insert([
        [
            'image_path' => '/sarees/saree1.jpg',
            'title' => 'New Collection',
            'link' => '/products',
            'order' => 1,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'image_path' => '/sarees/saree2.jpg',
            'title' => 'Best Sellers',
            'link' => '/products?sort=popular',
            'order' => 2,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'image_path' => '/sarees/saree3.jpg',
            'title' => 'Festive Collection',
            'link' => '/products?occasion=festive',
            'order' => 3,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ],
    ]);
    echo "   - Created 3 sample banners\n";
}

// 3. Check products with flags
echo "\n3. Checking products...\n";
$newArrivals = DB::table('products')->where('is_new_arrival', true)->count();
$trending = DB::table('products')->where('is_trending', true)->count();
$allProducts = DB::table('products')->count();

echo "   - Total products: $allProducts\n";
echo "   - New Arrivals: $newArrivals\n";
echo "   - Trending: $trending\n";

if ($newArrivals == 0 && $allProducts > 0) {
    echo "   - Setting some products as new arrivals...\n";
    DB::table('products')->limit(4)->update(['is_new_arrival' => true]);
}

if ($trending == 0 && $allProducts > 0) {
    echo "   - Setting some products as trending...\n";
    DB::table('products')->limit(4)->update(['is_trending' => true]);
}

echo "\n✅ All fixes applied!\n";
