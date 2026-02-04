<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('themes', function (Blueprint $table) {
            $table->string('button_color')->nullable()->after('secondary_color');
            $table->string('text_color')->default('#000000')->after('button_color');
            $table->string('background_color')->default('#ffffff')->after('text_color');
            $table->string('font_family')->default('Inter, sans-serif')->after('background_color');
            $table->string('border_radius')->default('0.375rem')->after('font_family');
            $table->string('header_style')->default('default')->after('border_radius');
            $table->string('footer_style')->default('default')->after('header_style');
        });
    }

    public function down()
    {
        Schema::table('themes', function (Blueprint $table) {
            $table->dropColumn([
                'button_color',
                'text_color',
                'background_color',
                'font_family',
                'border_radius',
                'header_style',
                'footer_style'
            ]);
        });
    }
};
