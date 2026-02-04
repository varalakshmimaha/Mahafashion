<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$email = 'admin123@gmail.com';
$password = 'Admin@123';

try {
    $user = User::where('email', $email)->first();
    
    if (!$user) {
        echo "USER_NOT_FOUND\n";
    } else {
        echo "User found: " . $user->email . "\n";
        echo "Is Admin: " . ($user->is_admin ? 'YES' : 'NO') . "\n";
        echo "Is Active: " . ($user->is_active ? 'YES' : 'NO') . "\n";
        echo "Hash check for '$password': " . (Hash::check($password, $user->password) ? 'MATCH' : 'FAIL') . "\n";
        
        // Let's create a temporary user to test login logic
        $testEmail = 'test_login@example.com';
        $testPass = 'password123';
        User::where('email', $testEmail)->delete();
        $test = User::create([
            'name' => 'Test',
            'email' => $testEmail,
            'password' => Hash::make($testPass),
            'is_admin' => true,
            'is_active' => true,
            'phone' => '1234567890'
        ]);
        echo "Test user created: $testEmail / $testPass\n";
        echo "Test hash check: " . (Hash::check($testPass, $test->password) ? 'MATCH' : 'FAIL') . "\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
