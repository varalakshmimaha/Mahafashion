<?php
require_once __DIR__.'/vendor/autoload.php';

use Illuminate\Support\Facades\Hash;
use App\Models\User;

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = User::where('email', 'admin123@gmail.com')->first();

if ($user) {
    $user->password = Hash::make('12345678');
    $user->save();
    echo "Password updated to 12345678 for admin123@gmail.com\n";
} else {
    echo "Admin user not found\n";
}
