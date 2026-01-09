<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'sort_order',
        'is_active',
        'meta_title',
        'meta_description',
    ];

    protected $appends = ['image_url'];
    
    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];
    
    // Relationship to get subcategories
    public function subcategories()
    {
        return $this->hasMany(Subcategory::class)->orderBy('sort_order');
    }
    
    // Relationship to get products through subcategories
    public function products()
    {
        return $this->hasManyThrough(Product::class, Subcategory::class);
    }
    
    public function getImageUrlAttribute()
    {
        if ($this->image) {
            // Check if the image path is already an absolute path (starts with /)
            if (str_starts_with($this->image, '/')) {
                return asset($this->image);
            } else {
                // It's a storage path, prepend storage/
                return asset('storage/' . $this->image);
            }
        }
        
        return null;
    }
}
