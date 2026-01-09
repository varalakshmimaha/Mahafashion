<?php
// Script to force create an admin user
require_once __DIR__.'/vendor/autoload.php';

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    // Check if user already exists
    $existingUser = DB::table('users')->where('email', 'admin123@gmail.com')->first();
    
    if ($existingUser) {
        // Update the existing user to be an admin with the correct password
        DB::table('users')
          ->where('email', 'admin123@gmail.com')
          ->update([
              'is_admin' => 1,
              'password' => Hash::make('Admin@123'),
              'name' => 'Admin User'
          ]);
        echo "Updated existing user to admin: admin123@gmail.com\n";
    } else {
        // Create a new admin user
        DB::table('users')->insert([
            'name' => 'Admin User',
            'email' => 'admin123@gmail.com',
            'password' => Hash::make('Admin@123'),
            'is_admin' => 1,
            'email_verified_at' => date('Y-m-d H:i:s'),
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ]);
        echo "Created new admin user: admin123@gmail.com\n";
    }
    
    echo "Admin user operation completed successfully!\n";
    echo "Email: admin123@gmail.com\n";
    echo "Password: Admin@123\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}