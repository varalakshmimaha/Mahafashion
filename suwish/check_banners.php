<?php
require_once __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use App\Models\Banner;

$banners = Banner::all();
echo "Banners count: " . $banners->count() . "\n";
foreach ($banners as $banner) {
    echo "- ID: {$banner->id}, Image: {$banner->image_path}, Active: " . ($banner->is_active ? 'Yes' : 'No') . "\n";
}
