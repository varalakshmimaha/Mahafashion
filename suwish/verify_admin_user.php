<?php
// Script to verify and fix admin user
require_once __DIR__.'/vendor/autoload.php';

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Verifying admin user...\n";

try {
    // Check if database connection works
    DB::connection()->getPdo();
    echo "✓ Database connection successful\n";
    
    // Check if the users table exists
    $tableExists = DB::select("SHOW TABLES LIKE 'users'");
    
    if (empty($tableExists)) {
        echo "✗ Users table does not exist. Please run migrations first.\n";
        exit(1);
    }
    
    echo "✓ Users table exists\n";
    
    // Check all users in the database
    $allUsers = DB::table('users')->get();
    echo "Found " . count($allUsers) . " user(s) in the database:\n";
    
    foreach ($allUsers as $user) {
        echo "- ID: $user->id, Email: $user->email, Is Admin: " . ($user->is_admin ? 'Yes' : 'No') . "\n";
    }
    
    // Check specifically for admin users
    $adminUsers = DB::table('users')->where('is_admin', 1)->get();
    echo "Found " . count($adminUsers) . " admin user(s):\n";
    
    foreach ($adminUsers as $admin) {
        echo "- Admin ID: $admin->id, Email: $admin->email\n";
    }
    
    // Look for our specific admin email
    $targetEmail = 'admin123@gmail.com';
    $targetUser = DB::table('users')->where('email', $targetEmail)->first();
    
    if ($targetUser) {
        echo "✓ Found user with email $targetEmail\n";
        echo "  Current is_admin value: " . ($targetUser->is_admin ? 'Yes' : 'No') . "\n";
        
        // Update to ensure it's an admin with correct password
        DB::table('users')
          ->where('email', $targetEmail)
          ->update([
              'is_admin' => 1,
              'password' => Hash::make('Admin@123'),
              'name' => 'Admin User'
          ]);
        
        echo "✓ Updated user $targetEmail to be an admin with correct password\n";
    } else {
        // Create the admin user
        DB::table('users')->insert([
            'name' => 'Admin User',
            'email' => $targetEmail,
            'password' => Hash::make('Admin@123'),
            'is_admin' => 1,
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now()
        ]);
        
        echo "✓ Created new admin user: $targetEmail\n";
    }
    
    // Verify the user exists and is an admin
    $verification = DB::table('users')
                     ->where('email', $targetEmail)
                     ->where('is_admin', 1)
                     ->first();
    
    if ($verification) {
        echo "✓ Admin user verification successful!\n";
        echo "Email: $targetEmail\n";
        echo "Password: Admin@123\n";
        echo "You can now log in at http://127.0.0.1:8000/admin\n";
    } else {
        echo "✗ Admin user verification failed\n";
    }
    
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}