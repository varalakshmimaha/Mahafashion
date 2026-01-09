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
            $table->integer('sort_order')->default(0)->after('content');
        });
        
        // Set default sort_order values based on ID for existing pages
        $pages = \Illuminate\Support\Facades\DB::table('static_pages')->orderBy('id')->get();
        $order = 0;
        foreach ($pages as $page) {
            \Illuminate\Support\Facades\DB::table('static_pages')
                ->where('id', $page->id)
                ->update(['sort_order' => $order]);
            $order++;
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('static_pages', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });
    }
};