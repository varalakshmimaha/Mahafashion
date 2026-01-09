<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'order_number',
        'total',
        'sub_total',
        'status',
        'payment_method',
        'payment_status',
        'razorpay_order_id',
        'razorpay_payment_id',
        'razorpay_signature',
        'shipping_address',
        'billing_address',
        'tracking_number',
        'shipped_at',
        'delivered_at',
    ];
    
    protected $casts = [
        'shipping_address' => 'array',
        'billing_address' => 'array',
        'total' => 'decimal:2',
        'sub_total' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
    
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }
    
    public function cartItems()
    {
        return $this->hasMany(Cart::class);
    }
}
