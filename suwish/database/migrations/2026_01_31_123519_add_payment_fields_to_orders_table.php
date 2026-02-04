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
            if (!Schema::hasColumn('orders', 'razorpay_order_id')) {
                $table->string('razorpay_order_id')->nullable()->after('payment_method');
            }
            if (!Schema::hasColumn('orders', 'razorpay_payment_id')) {
                $table->string('razorpay_payment_id')->nullable()->after('payment_method');
            }
            if (!Schema::hasColumn('orders', 'razorpay_signature')) {
                $table->string('razorpay_signature')->nullable()->after('payment_method');
            }
            if (!Schema::hasColumn('orders', 'transaction_id')) {
                $table->string('transaction_id')->nullable()->after('payment_method');
            }
            if (!Schema::hasColumn('orders', 'phonepe_transaction_id')) {
                $table->string('phonepe_transaction_id')->nullable()->after('payment_method');
            }
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
            $table->dropColumn([
                'razorpay_order_id',
                'razorpay_payment_id',
                'razorpay_signature',
                'transaction_id',
                'phonepe_transaction_id'
            ]);
        });
    }
};
