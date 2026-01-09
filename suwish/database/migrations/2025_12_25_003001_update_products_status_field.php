<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update status field from boolean to enum
        Schema::table('products', function (Blueprint $table) {
            // Add the new status column
            $table->enum('status', ['active', 'inactive'])->default('active')->after('id');
        });
        
        // Copy data from old status column
        \Illuminate\Support\Facades\DB::statement('UPDATE products SET status = CASE WHEN is_active = 1 THEN "active" ELSE "inactive" END');
        
        // Now drop the old is_active column
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
        // Add back the old is_active column
        $table->boolean('is_active')->default(true);
        
        // Copy data back
        \Illuminate\Support\Facades\DB::statement('UPDATE products SET is_active = CASE WHEN status = "active" THEN 1 ELSE 0 END');
        
        // Drop the status column
        $table->dropColumn('status');
        });
    }
};