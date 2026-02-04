<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

echo "=== Testing Admin Login ===\n\n";

// Check if admin exists
$admin = Admin::where('email', 'admin@gmail.com')->first();

if ($admin) {
    echo "✓ Admin found in database\n";
    echo "Name: " . $admin->name . "\n";
    echo "Email: " . $admin->email . "\n";
    echo "Is Active: " . ($admin->is_active ? 'Yes' : 'No') . "\n";
    echo "\n";
    
    // Test password
    $passwordMatch = Hash::check('12345678', $admin->password);
    echo "Password '12345678' matches: " . ($passwordMatch ? '✓ YES' : '✗ NO') . "\n";
    
    // Test authentication
    if ($passwordMatch && $admin->is_active) {
        echo "✓ Login would be SUCCESSFUL\n";
        echo "\nYou can now log in with:\n";
        echo "Email: admin@gmail.com\n";
        echo "Password: 12345678\n";
    } else {
        if (!$passwordMatch) {
            echo "✗ Login would FAIL - Password doesn't match\n";
        }
        if (!$admin->is_active) {
            echo "✗ Login would FAIL - Admin is not active\n";
        }
    }
} else {
    echo "✗ Admin not found in database\n";
}
