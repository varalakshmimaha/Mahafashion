<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Check and create admin in admins table
$admin = \App\Models\Admin::where('email', 'admin@suwish.com')->first();

if (!$admin) {
    $admin = \App\Models\Admin::create([
        'name' => 'Super Admin',
        'email' => 'admin@suwish.com',
        'password' => bcrypt('Admin@123'),
        'role' => 'super_admin',
        'is_active' => true,
    ]);
    echo "Admin created successfully!\n";
} else {
    $admin->password = bcrypt('Admin@123');
    $admin->save();
    echo "Admin password reset successfully!\n";
}

echo "Email: admin@suwish.com\n";
echo "Password: Admin@123\n";
