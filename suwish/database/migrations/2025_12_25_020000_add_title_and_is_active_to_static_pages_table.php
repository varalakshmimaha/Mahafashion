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
            $table->string('title')->after('name')->nullable();
            $table->boolean('is_active')->default(true)->after('content');
        });
        
        // Update existing records to have titles based on their names
        \Illuminate\Support\Facades\DB::table('static_pages')->whereNull('title')->update([
            'title' => \Illuminate\Support\Facades\DB::raw('name')
        ]);
            
        // Set all pages to active by default
        \Illuminate\Support\Facades\DB::table('static_pages')->whereNull('is_active')->update([
            'is_active' => true
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('static_pages', function (Blueprint $table) {
            $table->dropColumn(['title', 'is_active']);
        });
    }
};