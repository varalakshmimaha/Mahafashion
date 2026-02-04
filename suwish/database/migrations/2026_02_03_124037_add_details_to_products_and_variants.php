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
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('package_contains')->nullable();
            $table->string('fit')->nullable();
            $table->string('origin')->nullable();
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->decimal('price', 10, 2)->nullable();
            // Adding MRP and discount too for completeness if user wants specific overrides
            $table->decimal('mrp', 10, 2)->nullable();
            $table->decimal('discount', 5, 2)->nullable();
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
            $table->dropColumn(['package_contains', 'fit', 'origin']);
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropColumn(['price', 'mrp', 'discount']);
        });
    }
};
