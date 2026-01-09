<?php
require_once __DIR__.'/vendor/autoload.php';

use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use Illuminate\Support\Facades\Auth;

// Create Laravel application instance
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Find the admin user
$admin = Admin::where('email', 'admin@gmail.com')->first();

if (!$admin) {
    echo "Admin user not found\n";
    exit;
}

echo "Admin found: " . $admin->name . " (" . $admin->email . ")\n";
echo "Is active: " . ($admin->is_active ? 'Yes' : 'No') . "\n";

// Test password verification
$passwordMatch = Hash::check('password123', $admin->password);
echo "Password match for 'password123': " . ($passwordMatch ? 'Yes' : 'No') . "\n";

if ($passwordMatch) {
    echo "Password verification successful!\n";
} else {
    echo "Password verification failed. Current hash: " . $admin->password . "\n";
}

// Try to authenticate
$attempt = Auth::guard('admin')->attempt([
    'email' => 'admin@gmail.com',
    'password' => 'password123'
]);

echo "Auth attempt result: " . ($attempt ? 'Success' : 'Failed') . "\n";

if ($attempt) {
    echo "Successfully authenticated as admin\n";
    $user = Auth::guard('admin')->user();
    echo "Current admin user: " . $user->name . "\n";
} else {
    echo "Authentication failed\n";
}