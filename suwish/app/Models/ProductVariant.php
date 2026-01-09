<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Product Variant Model
 * Manages color + size combinations with individual stock levels
 */
class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'color_code',
        'color_name',
        'size',
        'stock',
        'price_adjustment',
        'sku',
    ];

    protected $casts = [
        'stock' => 'integer',
        'price_adjustment' => 'decimal:2',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get variants for a specific color
     */
    public static function getVariantsForColor($productId, $colorCode)
    {
        return self::where('product_id', $productId)
            ->where('color_code', $colorCode)
            ->get();
    }

    /**
     * Check if variant has stock
     */
    public function hasStock()
    {
        return $this->stock > 0;
    }
}
