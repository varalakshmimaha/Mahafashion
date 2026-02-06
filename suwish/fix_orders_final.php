<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

echo "Disabling foreign key checks...\n";
DB::statement('SET FOREIGN_KEY_CHECKS=0;');

echo "Dropping corrupted orders table...\n";
try {
    Schema::dropIfExists('orders');
    echo "SUCCESS: Dropped 'orders'\n";
    
    echo "Creating comprehensive orders table...\n";
    Schema::create('orders', function (Blueprint $table) {
        $table->id();
        $table->string('order_number')->unique();
        $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
        $table->decimal('total', 10, 2);
        $table->decimal('subtotal', 10, 2)->default(0);
        $table->decimal('sub_total', 10, 2)->default(0);
        $table->decimal('discount', 10, 2)->default(0);
        $table->decimal('shipping', 10, 2)->default(0);
        $table->decimal('tax', 10, 2)->default(0);
        $table->string('currency', 3)->default('INR')->nullable();
        $table->string('status')->default('pending');
        $table->string('payment_method')->nullable();
        $table->string('payment_status')->default('pending');
        $table->string('transaction_id')->nullable();
        $table->string('razorpay_order_id')->nullable();
        $table->string('razorpay_payment_id')->nullable();
        $table->string('razorpay_signature')->nullable();
        $table->string('phonepe_transaction_id')->nullable();
        $table->string('paytm_transaction_id')->nullable();
        $table->string('gateway_order_id')->nullable();
        $table->json('gateway_response')->nullable();
        $table->json('shipping_address')->nullable();
        $table->json('billing_address')->nullable();
        $table->string('tracking_number')->nullable();
        $table->string('tracking_url')->nullable();
        $table->text('internal_notes')->nullable();
        $table->text('cancel_reason')->nullable();
        $table->text('return_reason')->nullable();
        $table->timestamp('shipped_at')->nullable();
        $table->timestamp('delivered_at')->nullable();
        $table->timestamp('cancelled_at')->nullable();
        $table->json('status_history')->nullable();
        $table->timestamps();
        $table->softDeletes();
    });
    echo "SUCCESS: Recreated 'orders' with all columns including SoftDeletes\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "Enabling foreign key checks...\n";
DB::statement('SET FOREIGN_KEY_CHECKS=1;');
