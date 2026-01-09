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
        Schema::create('cart', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->string('selected_color')->nullable()->default('');
            $table->string('selected_size')->nullable()->default('');
            $table->string('blouse_option')->nullable()->default('');
            $table->timestamps();
            
            // Unique constraint: same user can't have duplicate product+color+size combinations
            $table->unique(['user_id', 'product_id', 'selected_color', 'selected_size'], 'cart_variant_unique');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cart');
    }
};
