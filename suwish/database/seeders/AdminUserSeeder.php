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
            'email' => 'admin@gmail.com',
            'password' => bcrypt('12345678'),
            'is_admin' => true,
            'is_active' => true,
            'email_verified_at' => now(),
        ];
        
        // Check if admin user already exists
        if (!\App\Models\User::where('email', 'admin@gmail.com')->exists()) {
            \App\Models\User::create($admin);
        }
    }
}
