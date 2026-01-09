<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            // Add sizes column as JSON to store multiple sizes with stock
            $table->json('sizes')->nullable()->after('stock_quantity');
            
            // Add default_image_index to specify which image in image_urls is the default
            $table->integer('default_image_index')->default(0)->after('image_urls');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['sizes', 'default_image_index']);
        });
    }
};
