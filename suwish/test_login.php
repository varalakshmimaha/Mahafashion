<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$user = User::where('email', 'admin@gmail.com')->first();

if ($user) {
    echo "✓ User Found\n";
    echo "Name: " . $user->name . "\n";
    echo "Email: " . $user->email . "\n";
    echo "Is Admin: " . ($user->is_admin ? 'Yes' : 'No') . "\n";
    echo "Email Verified: " . ($user->email_verified_at ? 'Yes' : 'No') . "\n";
    echo "\nPassword Test:\n";
    echo "Password '12345678' matches: " . (Hash::check('12345678', $user->password) ? '✓ YES' : '✗ NO') . "\n";
    
    // Test login attempt
    echo "\nAttempting Auth::attempt()...\n";
    if (Auth::attempt(['email' => 'admin@gmail.com', 'password' => '12345678'])) {
        echo "✓ Authentication successful!\n";
    } else {
        echo "✗ Authentication failed!\n";
    }
} else {
    echo "✗ User not found!\n";
}