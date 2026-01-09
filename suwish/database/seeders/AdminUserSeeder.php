<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admin = [
            'name' => 'Admin User',
            'email' => 'admin123@gmail.com',
            'password' => bcrypt('Admin@123'),
            'is_admin' => true,
            'email_verified_at' => now(),
        ];
        
        // Check if admin user already exists
        if (!\App\Models\User::where('email', 'admin123@gmail.com')->exists()) {
            \App\Models\User::create($admin);
        }
    }
}
