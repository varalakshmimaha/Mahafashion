<?php
// Simple script to check users in database
require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Checking users in database...\n";

try {
    // Check if users table exists and get all users
    $users = DB::select("SELECT id, name, email, is_admin FROM users");
    
    echo "Found " . count($users) . " user(s):\n";
    
    foreach ($users as $user) {
        echo "ID: $user->id, Name: $user->name, Email: $user->email, Is Admin: $user->is_admin\n";
    }
    
    // Check for admins specifically
    $admins = DB::select("SELECT id, name, email FROM users WHERE is_admin = 1");
    echo "\nFound " . count($admins) . " admin user(s):\n";
    
    foreach ($admins as $admin) {
        echo "Admin - ID: $admin->id, Name: $admin->name, Email: $admin->email\n";
    }
    
    // Check for our specific user
    $targetUser = DB::select("SELECT id, name, email, is_admin FROM users WHERE email = 'admin123@gmail.com'");
    if (!empty($targetUser)) {
        $user = $targetUser[0];
        echo "\nFound target user:\n";
        echo "ID: $user->id, Name: $user->name, Email: $user->email, Is Admin: $user->is_admin\n";
    } else {
        echo "\nTarget user admin123@gmail.com not found\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}