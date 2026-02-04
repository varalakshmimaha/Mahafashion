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
        if (!Schema::hasTable('static_pages')) {
            Schema::create('static_pages', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique()->comment('Internal name/key e.g. about-us');
                $table->string('slug')->unique()->comment('SEO friendly slug');
                $table->string('title');
                $table->longText('content')->nullable();
                $table->string('meta_title')->nullable();
                $table->text('meta_description')->nullable();
                $table->enum('status', ['draft', 'published'])->default('draft');
                $table->integer('sort_order')->default(0);
                $table->timestamps();
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
        Schema::dropIfExists('static_pages');
    }
};
