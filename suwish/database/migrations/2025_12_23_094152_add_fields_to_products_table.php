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
            $table->string('fabric_type')->nullable()->after('fabric');
            $table->string('brand')->nullable()->after('fabric_type');
            $table->decimal('discount', 5, 2)->default(0)->after('price');
            $table->json('colors')->nullable()->after('color');
            $table->boolean('is_featured')->default(false)->after('is_active');
            $table->boolean('is_trending')->default(false)->after('is_featured');
            $table->boolean('is_top_rated')->default(false)->after('is_trending');
            $table->boolean('is_new_arrival')->default(false)->after('is_top_rated');
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
            $table->dropColumn([
                'fabric_type',
                'brand',
                'discount',
                'colors',
                'is_featured',
                'is_trending',
                'is_top_rated',
                'is_new_arrival'
            ]);
        });
    }
};