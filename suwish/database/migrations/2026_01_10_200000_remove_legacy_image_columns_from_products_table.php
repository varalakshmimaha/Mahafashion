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
        if (Schema::hasColumn('products', 'image_url')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('image_url');
            });
        }
        
        if (Schema::hasColumn('products', 'image_urls')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('image_urls');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('image_url')->nullable();
            $table->json('image_urls')->nullable();
        });
    }
};
