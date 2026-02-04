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
        if (Schema::hasTable('static_pages')) {
            Schema::table('static_pages', function (Blueprint $table) {
                if (!Schema::hasColumn('static_pages', 'slug')) {
                    $table->string('slug')->unique()->nullable()->after('name');
                }

                if (!Schema::hasColumn('static_pages', 'meta_title')) {
                    $table->string('meta_title')->nullable()->after('content');
                }

                if (!Schema::hasColumn('static_pages', 'meta_description')) {
                    $table->text('meta_description')->nullable()->after('meta_title');
                }

                if (!Schema::hasColumn('static_pages', 'status')) {
                    $table->enum('status', ['draft', 'published'])->default('draft')->after('meta_description');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('static_pages')) {
            Schema::table('static_pages', function (Blueprint $table) {
                if (Schema::hasColumn('static_pages', 'status')) {
                    $table->dropColumn('status');
                }
                if (Schema::hasColumn('static_pages', 'meta_description')) {
                    $table->dropColumn('meta_description');
                }
                if (Schema::hasColumn('static_pages', 'meta_title')) {
                    $table->dropColumn('meta_title');
                }
                if (Schema::hasColumn('static_pages', 'slug')) {
                    $table->dropColumn('slug');
                }
            });
        }
    }
};
