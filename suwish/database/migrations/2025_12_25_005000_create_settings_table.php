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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->enum('type', ['string', 'text', 'image', 'boolean', 'json'])->default('string');
            $table->timestamps();
        });

        // Insert default settings
        \Illuminate\Support\Facades\DB::table('settings')->insert([
            ['key' => 'website_name', 'value' => 'Suwish', 'type' => 'string'],
            ['key' => 'website_title', 'value' => 'Suwish - Premium Sarees', 'type' => 'string'],
            ['key' => 'website_description', 'value' => 'Premium sarees and traditional wear', 'type' => 'text'],
            ['key' => 'contact_email', 'value' => 'info@suwish.com', 'type' => 'string'],
            ['key' => 'contact_phone', 'value' => '+91 9876543210', 'type' => 'string'],
            ['key' => 'facebook', 'value' => '', 'type' => 'string'],
            ['key' => 'instagram', 'value' => '', 'type' => 'string'],
            ['key' => 'twitter', 'value' => '', 'type' => 'string'],
            ['key' => 'whatsapp', 'value' => '', 'type' => 'string'],
            ['key' => 'footer_content', 'value' => '© 2025 Suwish. All rights reserved.', 'type' => 'text'],
            ['key' => 'maintenance_mode', 'value' => '0', 'type' => 'boolean'],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('settings');
    }
};