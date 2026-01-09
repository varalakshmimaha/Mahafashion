<?php
require_once __DIR__.'/vendor/autoload.php';

use Illuminate\Support\Facades\Hash;
use App\Models\Admin;

// Create Laravel application instance
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Find the admin user and update the password
$admin = Admin::where('email', 'admin@gmail.com')->first();

if ($admin) {
    $admin->password = Hash::make('password123');
    $admin->save();
    echo "Password updated successfully for admin@gmail.com\n";
    echo "New password hash: " . $admin->password . "\n";
} else {
    echo "Admin user not found\n";
}