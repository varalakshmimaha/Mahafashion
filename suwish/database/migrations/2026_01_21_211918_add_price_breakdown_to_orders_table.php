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
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('subtotal', 10, 2)->default(0)->after('total');
            $table->decimal('discount', 10, 2)->default(0)->after('subtotal');
            $table->decimal('shipping', 10, 2)->default(0)->after('discount');
            $table->decimal('tax', 10, 2)->default(0)->after('shipping');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['subtotal', 'discount', 'shipping', 'tax']);
        });
    }
};
