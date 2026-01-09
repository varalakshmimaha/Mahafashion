<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Product Variants - Color + Size combinations with stock
     * Stock is based on selected color
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('color_code', 7); // HEX color code
            $table->string('color_name');
            $table->string('size');
            $table->integer('stock')->default(0);
            $table->decimal('price_adjustment', 10, 2)->default(0);
            $table->string('sku')->nullable();
            $table->timestamps();

            $table->index('product_id');
            $table->index('color_code');
            $table->unique(['product_id', 'color_code', 'size']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_variants');
    }
};
