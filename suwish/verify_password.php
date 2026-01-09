<?php
require_once __DIR__.'/vendor/autoload.php';

use Illuminate\Support\Facades\Hash;
use App\Models\User;

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = User::where('email', 'admin123@gmail.com')->first();

if ($user) {
    echo "User found: " . $user->email . "\n";
    echo "Is Admin: " . ($user->is_admin ? 'Yes' : 'No') . "\n";
    
    // Test password
    $testPass = 'Admin@123';
    $result = Hash::check($testPass, $user->password);
    echo "Password check ($testPass): " . ($result ? 'PASS' : 'FAIL') . "\n";
    
    if (!$result) {
        // Reset password to something simple
        $newPass = 'admin123';
        $user->password = Hash::make($newPass);
        $user->save();
        echo "\nPassword has been reset to: $newPass\n";
    }
} else {
    echo "User not found\n";
}
