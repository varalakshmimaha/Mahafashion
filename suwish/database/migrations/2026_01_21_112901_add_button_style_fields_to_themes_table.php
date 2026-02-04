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
        Schema::table('themes', function (Blueprint $table) {
            $table->string('button_hover_color')->nullable()->after('button_color')->default('#4338ca'); // Default darker indigo
            $table->string('button_text_color')->nullable()->after('button_hover_color')->default('#ffffff');
            $table->string('button_font_size')->nullable()->after('border_radius')->default('1rem');
            $table->string('button_font_weight')->nullable()->after('button_font_size')->default('600');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('themes', function (Blueprint $table) {
            $table->dropColumn([
                'button_hover_color',
                'button_text_color',
                'button_font_size',
                'button_font_weight',
            ]);
        });
    }
};
