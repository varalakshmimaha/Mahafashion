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
            if (!Schema::hasColumn('products', 'subcategory_id')) {
                $table->foreignId('subcategory_id')->nullable()->after('category_id')->constrained('subcategories')->nullOnDelete();
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
            if (Schema::hasColumn('products', 'subcategory_id')) {
                $table->dropForeign(['subcategory_id']);
                $table->dropColumn('subcategory_id');
            }
        });
    }
};
