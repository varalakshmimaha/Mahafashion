<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

echo "\n=== Product Images and Colors ===\n\n";

$products = \App\Models\Product::with(['images', 'variants'])->get();

foreach ($products as $product) {
    echo "Product: {$product->name} (ID: {$product->id})\n";
    echo "---\n";
    
    // Show variants
    if ($product->variants && $product->variants->count() > 0) {
        echo "Variants:\n";
        foreach ($product->variants as $variant) {
            echo "  - Color: {$variant->color_name} ({$variant->color_code}), Size: {$variant->size}, Stock: {$variant->stock}\n";
        }
    } else {
        echo "No variants found\n";
    }
    
    echo "\nImages:\n";
    if ($product->images && $product->images->count() > 0) {
        foreach ($product->images as $image) {
            echo "  - Image: {$image->image_url}\n";
            echo "    Color Code: " . ($image->color_code ?? 'NULL') . "\n";
            echo "    Sort Order: {$image->sort_order}\n";
            echo "    Is Default: " . ($image->is_default ? 'Yes' : 'No') . "\n";
        }
    } else {
        echo "  No images found\n";
    }
    
    echo "\n" . str_repeat('=', 60) . "\n\n";
}
