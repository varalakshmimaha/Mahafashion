<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$banners = App\Models\Banner::all();

foreach ($banners as $banner) {
    $path = $banner->getRawOriginal('image_path');
    
    // If it's an absolute URL, extract just the relative path
    if (strpos($path, 'http://') === 0 || strpos($path, 'https://') === 0) {
        // Extract everything after the domain
        $relativePath = preg_replace('/^https?:\/\/[^\/]+\//', '', $path);
        
        // If it starts with 'banners/', it should be 'banners/filename.jpg'
        // The storage path should be 'banners/filename.jpg' not '/banners/filename.jpg'
        if (strpos($relativePath, 'banners/') === 0) {
            echo "Updating banner {$banner->id}: {$path} -> {$relativePath}\n";
            $banner->timestamps = false;
            $banner->image_path = $relativePath;
            $banner->save();
        }
    }
}

echo "Done! Updated " . count($banners) . " banners.\n";
