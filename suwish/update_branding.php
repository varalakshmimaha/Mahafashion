<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

// Update settings to Maha Fashion
$updates = [
    'website_name' => 'Maha Fashion',
    'website_title' => 'Maha Fashion - Premium Sarees',
    'website_description' => 'Premium sarees and traditional wear from Maha Fashion',
    'contact_email' => 'info@mahafashion.com',
    'footer_content' => '© ' . date('Y') . ' Maha Fashion. All rights reserved.',
];

foreach ($updates as $key => $value) {
    $updated = DB::table('settings')->where('key', $key)->update(['value' => $value]);
    if ($updated) {
        echo "Updated: $key = $value\n";
    } else {
        // Insert if doesn't exist
        DB::table('settings')->insert(['key' => $key, 'value' => $value, 'type' => 'string']);
        echo "Inserted: $key = $value\n";
    }
}

echo "\n✅ Website is now: Maha Fashion\n";
