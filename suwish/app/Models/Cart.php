<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;
    
    protected $table = 'cart';
    
    protected $fillable = [
        'user_id',
        'product_id',
        'variant_id',
        'quantity',
        'price',
        'variant_price',
        'variant_mrp',
        'variant_discount',
        'selected_color',
        'selected_size',
        'blouse_option',
    ];
    
    protected $casts = [
        'quantity' => 'integer',
        'price' => 'decimal:2',
        'variant_price' => 'decimal:2',
        'variant_mrp' => 'decimal:2',
        'variant_discount' => 'decimal:2',
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }
}
