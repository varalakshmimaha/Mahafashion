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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->string('payment_gateway'); // e.g., 'razorpay', 'cod'
            $table->string('transaction_id')->nullable()->unique();
            $table->decimal('amount', 10, 2);
            $table->string('status'); // e.g., 'pending', 'success', 'failed', 'cod_pending'
            $table->json('response')->nullable(); // Stores gateway response
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
