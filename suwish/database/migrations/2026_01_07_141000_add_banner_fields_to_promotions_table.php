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
        Schema::table('promotions', function (Blueprint $table) {
            $table->string('title')->nullable()->after('id');
            $table->string('subtitle')->nullable()->after('title');
            $table->text('description')->nullable()->after('subtitle');
            $table->string('image')->nullable()->after('description');
            $table->string('button_text')->default('Shop Now')->after('image');
            $table->string('button_link')->default('/products')->after('button_text');
            $table->string('discount_text')->nullable()->after('button_link');
            $table->enum('type', ['coupon', 'banner'])->default('coupon')->after('discount_text');
            $table->integer('sort_order')->default(0)->after('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('promotions', function (Blueprint $table) {
            $table->dropColumn(['title', 'subtitle', 'description', 'image', 'button_text', 'button_link', 'discount_text', 'type', 'sort_order']);
        });
    }
};
