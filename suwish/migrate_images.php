<?php

require __DIR__.'/bootstrap/app.php';

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\DB;

DB::transaction(function () {
    Product::all()->each(function (Product $product) {
        $images = [];

        // Handle single image_url
        if (!empty($product->image_url)) {
            $images[] = $product->image_url;
        }

        // Handle multiple image_urls (JSON)
        if (!empty($product->image_urls)) {
            $decoded = json_decode($product->image_urls, true);
            if (is_array($decoded)) {
                foreach ($decoded as $item) {
                    if (is_string($item)) {
                        $images[] = $item;
                    } elseif (is_array($item) && !empty($item['url'])) {
                        $images[] = $item['url'];
                    }
                }
            }
        }

        $images = array_unique($images);

        foreach ($images as $imageUrl) {
            ProductImage::create([
                'product_id' => $product->id,
                'image_url' => $imageUrl,
            ]);
        }

        // Clean up old columns
        $product->image_url = null;
        $product->image_urls = null;
        $product->save();
    });
});

echo "Image migration completed.\n";

