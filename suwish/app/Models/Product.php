<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ProductPattern;

class Product extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'category_id',
        'pattern_id',
        'name',
        'description',
        'price',
        'discount',
        'sku',
        'fabric_type',
        'color',
        'colors',
        'occasion',
        'work_type',
        'image_url',
        'image_urls',
        'care_instructions',
        'blouse_included',
        'drape_length',
        'rating',
        'review_count',
        'stock_quantity',
        'status',
        'is_trending',
        'is_new_arrival',
        'is_ethnic_wear',
        'is_suwish_collection',

        'brand',
        'sizes',
        'default_image_index',
    ];
    
    protected $casts = [
        'image_urls' => 'array',
        'colors' => 'array',
        'price' => 'decimal:2',
        'discount' => 'decimal:2',
        'rating' => 'decimal:2',
        'drape_length' => 'decimal:2',
        'status' => 'string',
        'is_trending' => 'boolean',
        'is_new_arrival' => 'boolean',
        'is_ethnic_wear' => 'boolean',
        'is_suwish_collection' => 'boolean',
        'sizes' => 'array',
        'default_image_index' => 'integer',
    ];
    
    // Scope to get only active products
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
    
    
    // Accessor for image_urls to ensure it's always an array
    public function getImageUrlsAttribute($value)
    {
        if (is_array($value)) {
            return $value;
        }
        
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : [];
        }
        
        return [];
    }
    
    public function pattern()
    {
        return $this->belongsTo(ProductPattern::class, 'pattern_id');
    }

    // Optional category relation for legacy code expecting product->category
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Product Images Relationship
     * Multiple images can be uploaded at once
     */
    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    /**
     * Product Variants Relationship
     * Color + Size combinations with stock
     */
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    /**
     * Get default images (shown when no color selected)
     */
    public function defaultImages()
    {
        return $this->images()->whereNull('color_code');
    }

    /**
     * Get images for a specific color
     */
    public function colorImages($colorCode)
    {
        return $this->images()->where('color_code', $colorCode);
    }

    /**
     * Get available colors with images
     */
    public function getAvailableColorsAttribute()
    {
        return $this->variants()
            ->select('color_code', 'color_name')
            ->distinct()
            ->get();
    }
    
    // Relationship with subcategories through product_subcategories pivot table
    public function subcategories()
    {
        return $this->belongsToMany(Subcategory::class, 'product_subcategories', 'product_id', 'subcategory_id')
            ->withPivot('is_primary')
            ->withTimestamps();
    }
    
    // Get primary subcategory for this product
    public function getPrimarySubcategoryAttribute()
    {
        return $this->subcategories()->wherePivot('is_primary', true)->first();
    }
    

    
    public function cartItems()
    {
        return $this->hasMany(Cart::class);
    }
    
    public function wishlistItems()
    {
        return $this->hasMany(Wishlist::class);
    }
    
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
    
    public function getProcessedImageUrlsAttribute()
    {
        $imageUrls = $this->attributes['image_urls'] ?? null;
        
        if ($imageUrls && is_array($imageUrls)) {
            return array_map(function($url) {
                // Check if the image path is already an absolute path (starts with /)
                if (str_starts_with($url, '/')) {
                    return asset($url);
                } else {
                    // It's a storage path, prepend storage/
                    return asset('storage/' . $url);
                }
            }, $imageUrls);
        }
        
        return [];
    }
    
    public function getMainImageUrlAttribute()
    {
        $rawImageUrl = $this->attributes['image_url'] ?? null;
        
        if ($rawImageUrl) {
            // Check if the image path is already an absolute path (starts with /)
            if (str_starts_with($rawImageUrl, '/')) {
                return asset($rawImageUrl);
            } else {
                // It's a storage path, prepend storage/
                return asset('storage/' . $rawImageUrl);
            }
        }
        
        return null;
    }
    
    public function getDefaultImageUrlAttribute()
    {
        $imageUrls = $this->processedImageUrls;
        
        if (!empty($imageUrls) && isset($imageUrls[$this->default_image_index])) {
            return $imageUrls[$this->default_image_index];
        }
        
        // Fallback to the first image if default index is out of bounds
        if (!empty($imageUrls) && isset($imageUrls[0])) {
            return $imageUrls[0];
        }
        
        // Fallback to main image
        return $this->main_image_url;
    }
    
    public function getAvailableSizesAttribute()
    {
        $sizes = $this->attributes['sizes'] ?? null;
        
        if ($sizes && is_array($sizes)) {
            return $sizes;
        }
        
        return [];
    }
    

}