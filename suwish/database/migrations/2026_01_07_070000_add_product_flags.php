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
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'is_ethnic_wear')) {
                $table->boolean('is_ethnic_wear')->default(false)->after('is_new_arrival');
            }
            if (!Schema::hasColumn('products', 'is_suwish_collection')) {
                $table->boolean('is_suwish_collection')->default(false)->after('is_ethnic_wear');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'is_suwish_collection')) {
                $table->dropColumn('is_suwish_collection');
            }
            if (Schema::hasColumn('products', 'is_ethnic_wear')) {
                $table->dropColumn('is_ethnic_wear');
            }
        });
    }
};
