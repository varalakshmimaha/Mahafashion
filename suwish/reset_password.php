<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$user = \App\Models\User::where('email', 'admin123@gmail.com')->first();

if ($user) {
    $user->password = bcrypt('Admin@123');
    $user->save();
    echo "Password reset successfully for: " . $user->email . "\n";
    echo "New password: Admin@123\n";
} else {
    echo "User not found\n";
}
