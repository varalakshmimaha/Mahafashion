<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

$admin = Admin::where('email', 'admin@gmail.com')->first();
if ($admin) {
    $admin->password = Hash::make('12345678');
    $admin->save();
    echo "SUCCESS: Password updated for admin@gmail.com\n";
} else {
    echo "ERROR: Admin user not found\n";
}
