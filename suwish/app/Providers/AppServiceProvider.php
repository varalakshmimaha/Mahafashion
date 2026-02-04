<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('themes')) {
                 $activeTheme = \App\Models\Theme::where('is_active', true)->first();
                 
                 // Fallback if no active theme found
                 if (!$activeTheme) {
                    $activeTheme = new \App\Models\Theme([
                        'primary_color' => '#ef3b2d',
                        'secondary_color' => '#333333',
                        'button_color' => '#ef3b2d',
                        'text_color' => '#1f2937',
                        'background_color' => '#f3f4f6',
                        'font_family' => 'Nunito, sans-serif',
                        'border_radius' => '0.375rem',
                        'header_style' => 'default',
                        'footer_style' => 'default'
                    ]);
                 }
                 
                 \Illuminate\Support\Facades\View::share('theme', $activeTheme);
            }
        } catch (\Exception $e) {
            // Quietly fail if issues (e.g. valid during migration)
        }
    }
}
