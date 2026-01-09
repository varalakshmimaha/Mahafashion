<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subcategory extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'image',
        'sort_order',
        'is_active',
        'meta_title',
        'meta_description',
    ];
    
    protected $casts = [
        'category_id' => 'integer',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    // Explicit table name to match migrations
    protected $table = 'subcategories';
    
    // Relationship with parent category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    
    // Relationship with products through product_subcategories pivot table
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_subcategories', 'subcategory_id', 'product_id')
            ->withPivot('is_primary')
            ->withTimestamps();
    }
    
    // Accessor for image URL
    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }

        if (str_starts_with($this->image, 'http')) {
            return $this->image;
        }

        return asset('storage/' . $this->image);
    }
}
