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
        echo "User not found, creating new admin...\n";
        $user = new User();
        $user->name = 'Admin';
        $user->email = $email;
    } else {
        echo "User found, updating password and admin status...\n";
    }
    
    $user->password = Hash::make($password);
    $user->is_admin = true;
    $user->is_active = true;
    $user->save();
    
    echo "Successfully updated/created admin: $email with password: $password\n";
    
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
