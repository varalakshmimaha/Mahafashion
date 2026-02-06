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
        Schema::table('static_pages', function (Blueprint $table) {
            $table->string('category')->default('quick_link')->after('slug'); // quick_link, policy
        });

        // Update existing pages
        DB::table('static_pages')->whereIn('slug', ['privacy-policy', 'terms-and-conditions', 'shipping-and-returns'])->update(['category' => 'policy']);
        DB::table('static_pages')->whereIn('slug', ['about-us', 'contact-us'])->update(['category' => 'quick_link']);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('static_pages', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }
};
