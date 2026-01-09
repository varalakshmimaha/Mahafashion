<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Insert theme color settings
        DB::table('settings')->insert([
            ['key' => 'theme_primary_color', 'value' => '#6366f1', 'type' => 'string', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'theme_secondary_color', 'value' => '#8b5cf6', 'type' => 'string', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'theme_accent_color', 'value' => '#ec4899', 'type' => 'string', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'theme_success_color', 'value' => '#10b981', 'type' => 'string', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'theme_warning_color', 'value' => '#f59e0b', 'type' => 'string', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'theme_danger_color', 'value' => '#ef4444', 'type' => 'string', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('settings')->whereIn('key', [
            'theme_primary_color',
            'theme_secondary_color',
            'theme_accent_color',
            'theme_success_color',
            'theme_warning_color',
            'theme_danger_color',
        ])->delete();
    }
};
