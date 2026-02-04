<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Theme extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'primary_color',
        'secondary_color',
        'accent_color',
        'success_color',
        'warning_color',
        'danger_color',
        'button_color',
        'button_hover_color',
        'button_text_color',
        'border_radius',
        'button_font_size',
        'button_font_weight',
        'text_color',
        'background_color',
        'font_family',
        'header_style',
        'footer_style',
        'is_active',
    ];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::saving(function ($theme) {
            if ($theme->is_active) {
                // Deactivate all other themes
                static::where('id', '!=', $theme->id)->update(['is_active' => false]);
            }
        });
    }
}
