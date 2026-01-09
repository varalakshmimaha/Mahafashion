<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSubcategory extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'product_id',
        'subcategory_id',
        'is_primary',
    ];
    
    protected $casts = [
        'is_primary' => 'boolean',
    ];
    
    // Relationship with subcategory
    public function subcategory()
    {
        return $this->belongsTo(SubCategory::class);
    }
    
    // Relationship with product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
