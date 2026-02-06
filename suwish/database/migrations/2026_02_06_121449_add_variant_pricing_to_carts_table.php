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
        Schema::table('cart', function (Blueprint $table) {
            $table->unsignedBigInteger('variant_id')->nullable()->after('product_id');
            $table->decimal('variant_price', 10, 2)->nullable()->after('price');
            $table->decimal('variant_mrp', 10, 2)->nullable()->after('variant_price');
            $table->decimal('variant_discount', 5, 2)->nullable()->after('variant_mrp');
            
            $table->foreign('variant_id')->references('id')->on('product_variants')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cart', function (Blueprint $table) {
            $table->dropForeign(['variant_id']);
            $table->dropColumn(['variant_id', 'variant_price', 'variant_mrp', 'variant_discount']);
        });
    }
};
