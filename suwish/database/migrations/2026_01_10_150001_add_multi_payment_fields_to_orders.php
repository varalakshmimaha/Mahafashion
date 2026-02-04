<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'currency')) {
                $table->string('currency', 3)->default('INR')->nullable();
            }
            if (!Schema::hasColumn('orders', 'transaction_id')) {
                $table->string('transaction_id')->nullable();
            }
            if (!Schema::hasColumn('orders', 'phonepe_transaction_id')) {
                $table->string('phonepe_transaction_id')->nullable();
            }
            if (!Schema::hasColumn('orders', 'paytm_transaction_id')) {
                $table->string('paytm_transaction_id')->nullable();
            }
            if (!Schema::hasColumn('orders', 'gateway_order_id')) {
                $table->string('gateway_order_id')->nullable();
            }
            if (!Schema::hasColumn('orders', 'gateway_response')) {
                $table->json('gateway_response')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $columns = ['currency', 'transaction_id', 'phonepe_transaction_id', 'paytm_transaction_id', 'gateway_order_id', 'gateway_response'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('orders', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
