<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Create a Laravel migration for themes table
     * Fields: id, name, primary_color, secondary_color, accent_color, success_color, warning_color, danger_color, is_active, timestamps
     *
     * @return void
     */
    public function up()
    {
        Schema::create('themes', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('primary_color', 7);
            $table->string('secondary_color', 7);
            $table->string('accent_color', 7);
            $table->string('success_color', 7)->default('#10b981');
            $table->string('warning_color', 7)->default('#f59e0b');
            $table->string('danger_color', 7)->default('#ef4444');
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });

        // Insert default themes
        DB::table('themes')->insert([
            [
                'name' => 'Maroon Classic',
                'primary_color' => '#800020',
                'secondary_color' => '#A52A2A',
                'accent_color' => '#FFD700',
                'success_color' => '#10b981',
                'warning_color' => '#f59e0b',
                'danger_color' => '#ef4444',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Royal Blue',
                'primary_color' => '#1e40af',
                'secondary_color' => '#3b82f6',
                'accent_color' => '#fbbf24',
                'success_color' => '#10b981',
                'warning_color' => '#f59e0b',
                'danger_color' => '#ef4444',
                'is_active' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Emerald Green',
                'primary_color' => '#059669',
                'secondary_color' => '#10b981',
                'accent_color' => '#fbbf24',
                'success_color' => '#10b981',
                'warning_color' => '#f59e0b',
                'danger_color' => '#ef4444',
                'is_active' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('themes');
    }
};
