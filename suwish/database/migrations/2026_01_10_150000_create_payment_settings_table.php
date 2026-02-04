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
        Schema::create('payment_settings', function (Blueprint $table) {
            $table->id();
            
            // Razorpay Settings
            $table->boolean('razorpay_enabled')->default(false);
            $table->string('razorpay_key_id')->nullable();
            $table->text('razorpay_key_secret')->nullable(); // Encrypted
            $table->boolean('razorpay_test_mode')->default(true);
            
            // PhonePe Settings
            $table->boolean('phonepe_enabled')->default(false);
            $table->string('phonepe_merchant_id')->nullable();
            $table->text('phonepe_salt_key')->nullable(); // Encrypted
            $table->string('phonepe_salt_index')->nullable();
            $table->boolean('phonepe_test_mode')->default(true);
            
            // Paytm Settings
            $table->boolean('paytm_enabled')->default(false);
            $table->string('paytm_merchant_id')->nullable();
            $table->text('paytm_merchant_key')->nullable(); // Encrypted
            $table->string('paytm_website')->default('WEBSTAGING');
            $table->string('paytm_industry_type')->default('Retail');
            $table->boolean('paytm_test_mode')->default(true);
            
            // COD Settings
            $table->boolean('cod_enabled')->default(true);
            $table->decimal('cod_min_amount', 10, 2)->default(0);
            $table->decimal('cod_max_amount', 10, 2)->default(50000);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_settings');
    }
};
