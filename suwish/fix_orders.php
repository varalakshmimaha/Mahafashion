<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;

echo "Disabling foreign key checks...\n";
DB::statement('SET FOREIGN_KEY_CHECKS=0;');

echo "Dropping corrupted orders table...\n";
try {
    Schema::dropIfExists('orders');
    echo "SUCCESS: Dropped 'orders'\n";
    
    echo "Creating healthy orders table...\n";
    Schema::create('orders', function (Blueprint $table) {
        $table->id();
        $table->string('order_number')->unique();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->decimal('total', 10, 2);
        $table->string('status')->default('pending');
        $table->string('payment_method');
        $table->string('payment_status')->default('pending');
        $table->json('shipping_address');
        $table->json('billing_address')->nullable();
        $table->string('tracking_number')->nullable();
        $table->timestamp('shipped_at')->nullable();
        $table->timestamp('delivered_at')->nullable();
        $table->timestamps();
    });
    echo "SUCCESS: Recreated 'orders'\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "Enabling foreign key checks...\n";
DB::statement('SET FOREIGN_KEY_CHECKS=1;');
