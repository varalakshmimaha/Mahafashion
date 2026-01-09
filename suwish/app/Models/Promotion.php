<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'code',
        'discount_type',
        'discount_value',
        'start_date',
        'end_date',
        'usage_limit',
        'used_count',
        'minimum_amount',
        'is_active',
        'title',
        'subtitle',
        'description',
        'image',
        'button_text',
        'button_link',
        'discount_text',
        'type',
        'sort_order',
    ];
    
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
        'discount_value' => 'decimal:2',
        'minimum_amount' => 'decimal:2',
    ];

    /**
     * Scope for banner type promotions
     */
    public function scopeBanners($query)
    {
        return $query->where('type', 'banner');
    }

    /**
     * Scope for coupon type promotions
     */
    public function scopeCoupons($query)
    {
        return $query->where('type', 'coupon');
    }

    /**
     * Scope for active promotions
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('start_date')
                    ->orWhere('start_date', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', now());
            });
    }

    /**
     * Get image URL attribute
     */
    public function getImageUrlAttribute()
    {
        if ($this->image) {
            return url('storage/' . $this->image);
        }
        return null;
    }
}