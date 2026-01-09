<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

// Create or update admin user
$admin = Admin::updateOrCreate(
    ['email' => 'admin@sareeecommerce.com'],
    [
        'name' => 'Super Admin',
        'password' => Hash::make('admin123'),
        'is_active' => true,
    ]
);

echo "Admin user created/updated successfully!\n";
echo "Email: admin@sareeecommerce.com\n";
echo "Password: admin123\n";
echo "Login URL: http://127.0.0.1:8000/admin/login\n";
