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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->string('sku')->unique();
            $table->string('fabric')->nullable();
            $table->string('color')->nullable();
            $table->string('occasion')->nullable();
            $table->string('work_type')->nullable();
            $table->string('image_url');
            $table->json('image_urls')->nullable();
            $table->text('care_instructions')->nullable();
            $table->boolean('blouse_included')->default(false);
            $table->decimal('drape_length', 5, 2)->nullable();
            $table->decimal('rating', 3, 2)->default(0.00);
            $table->integer('review_count')->default(0);
            $table->integer('stock_quantity')->default(0);
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
