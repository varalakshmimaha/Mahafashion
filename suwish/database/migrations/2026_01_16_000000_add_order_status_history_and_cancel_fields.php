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
            if (!Schema::hasColumn('orders', 'status_history')) {
                $table->json('status_history')->nullable()->after('gateway_response');
            }
            if (!Schema::hasColumn('orders', 'cancel_reason')) {
                $table->string('cancel_reason')->nullable()->after('status_history');
            }
            if (!Schema::hasColumn('orders', 'cancelled_at')) {
                $table->timestamp('cancelled_at')->nullable()->after('cancel_reason');
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
            if (Schema::hasColumn('orders', 'status_history')) {
                $table->dropColumn('status_history');
            }
            if (Schema::hasColumn('orders', 'cancel_reason')) {
                $table->dropColumn('cancel_reason');
            }
            if (Schema::hasColumn('orders', 'cancelled_at')) {
                $table->dropColumn('cancelled_at');
            }
        });
    }
};
