<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'image_path',
        'title',
        'link',
        'order',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the full URL of the banner image.
     *
     * @param  string  $value
     * @return string
     */
    public function getImagePathAttribute($value)
    {
        if (!$value) {
            return null;
        }
        
        // Check if the value is already an absolute URL
        if (preg_match('/^https?:\/\//', $value)) {
            return $value;
        }
        
        // If it starts with /sarees/ or /banners/, it's a public asset (not in storage)
        if (str_starts_with($value, '/sarees/') || str_starts_with($value, '/banners/') || str_starts_with($value, 'sarees/') || str_starts_with($value, 'banners/')) {
            return asset(ltrim($value, '/'));
        }
        
        // If it already starts with storage/, don't prepend it again
        if (str_starts_with($value, 'storage/')) {
            return asset($value);
        }
        
        // Otherwise, prepend storage/ (for uploaded files)
        return asset('storage/' . ltrim($value, '/'));
    }
}

