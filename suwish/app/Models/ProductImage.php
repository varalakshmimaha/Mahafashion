<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Product Image Model
 * Default images (color_code = null) or Variant images (color_code = specific color)
 */
class ProductImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'image_url',
        'color_code',
        'sort_order',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get images for a specific color or default images
     */
    public static function getImagesForColor($productId, $colorCode = null)
    {
        return self::where('product_id', $productId)
            ->where('color_code', $colorCode)
            ->orderBy('sort_order')
            ->get();
    }
}
