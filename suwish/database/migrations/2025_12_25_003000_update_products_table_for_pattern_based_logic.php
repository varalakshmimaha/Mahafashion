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
        // Create product_patterns table
        Schema::create('product_patterns', function (Blueprint $table) {
            $table->id();
            $table->string('pattern_name');
            $table->string('pattern_code')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });
        
        // Add pattern_id to products table
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('pattern_id')->nullable()->after('id');
            $table->foreign('pattern_id')->references('id')->on('product_patterns')->onDelete('set null');
            
            // Add new flags as per requirements
            $table->boolean('is_ethnic_wear')->default(false)->after('is_new_arrival');
            $table->boolean('is_suwish_collection')->default(false)->after('is_ethnic_wear');
            
            // Drop old flags that are no longer needed
            $table->dropColumn(['is_featured', 'is_top_rated']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_top_rated')->default(false);
            
            $table->dropColumn(['is_ethnic_wear', 'is_suwish_collection', 'pattern_id']);
            
            // Revert status back to boolean
            $table->boolean('status')->default(true)->change();
        });
        
        Schema::dropIfExists('product_patterns');
    }
};