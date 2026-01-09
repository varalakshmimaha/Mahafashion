<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

// Update category images to use existing saree images
$updates = [
    ['slug' => 'banarasi', 'image' => '/sarees/saree1.jpg'],
    ['slug' => 'kanjeevaram', 'image' => '/sarees/saree2.jpg'],
    ['slug' => 'silk', 'image' => '/sarees/saree3.jpg'],
    ['slug' => 'chiffon', 'image' => '/sarees/saree4.jpg'],
    ['slug' => 'cotton', 'image' => '/sarees/saree1.jpg'],
    ['slug' => 'georgette', 'image' => '/sarees/saree2.jpg'],
];

foreach ($updates as $update) {
    $affected = DB::table('categories')
        ->where('slug', $update['slug'])
        ->update(['image' => $update['image']]);
    
    if ($affected) {
        echo "Updated {$update['slug']} -> {$update['image']}\n";
    }
}

echo "\n✅ Category images updated!\n";
