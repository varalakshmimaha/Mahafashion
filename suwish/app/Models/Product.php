<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ProductPattern;
use App\Models\Subcategory;

class Product extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'category_id',
        'subcategory_id',
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
        'package_contains',
        'fit',
        'origin',
    ];

    protected $appends = ['main_image_url', 'final_price', 'discounted_price'];
    
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
    

    
    
    public function pattern()
    {
        return $this->belongsTo(ProductPattern::class, 'pattern_id');
    }

    // Optional category relation for legacy code expecting product->category
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    // Subcategory relation
    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class, 'subcategory_id');
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

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
    
    
    
    
    
    
    
    public function getAvailableSizesAttribute()
    {
        $sizes = $this->attributes['sizes'] ?? null;
        
        if ($sizes && is_array($sizes)) {
            return $sizes;
        }
        
        return [];
    }
    
    // Accessor for is_active status
    public function getIsActiveAttribute()
    {
        return $this->status === 'active';
    }

    // Accessor for main_image_url
    public function getMainImageUrlAttribute()
    {
        // Eager load images if not already loaded to prevent N+1 issues
        if (!$this->relationLoaded('images')) {
            $this->load('images');
        }

        if ($this->images->isNotEmpty()) {
            // Try to find a default image
            $defaultImage = $this->images->where('is_default', true)->first();

            // If no default, take the first image
            $image = $defaultImage ?? $this->images->first();

            // Ensure the image exists and has an image_url
            if ($image && $image->image_url) {
                return asset('storage/' . $image->image_url);
            }
        }
        return null; // Or a placeholder image path
    }

    /**
     * Calculate the final price after applying discount
     * This is the price customer actually pays
     */
    public function getFinalPriceAttribute()
    {
        $basePrice = $this->attributes['price'] ?? 0;
        $discount = $this->attributes['discount'] ?? 0;
        
        if ($discount > 0) {
            return round($basePrice - ($basePrice * $discount / 100), 2);
        }
        
        return $basePrice;
    }

    /**
     * Alias for final_price (for backwards compatibility)
     */
    public function getDiscountedPriceAttribute()
    {
        return $this->final_price;
    }
}