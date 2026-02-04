<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory, \Illuminate\Database\Eloquent\SoftDeletes;
    
    public function statusHistory()
    {
        return $this->hasMany(OrderStatusHistory::class)->orderBy('created_at', 'desc');
    }
    
    protected $fillable = [
        'user_id',
        'order_number',
        'total',
        'sub_total',
        'subtotal',
        'discount',
        'shipping',
        'tax',
        'currency',
        'status',
        'payment_method',
        'payment_status',
        'transaction_id',
        'razorpay_order_id',
        'razorpay_payment_id',
        'razorpay_signature',
        'phonepe_transaction_id',
        'paytm_transaction_id',
        'gateway_order_id',
        'gateway_response',
        'shipping_address',
        'billing_address',
        'tracking_number',
        'shipped_at',
        'delivered_at',
        'status_history',
        'tracking_url',
        'internal_notes',
        'cancel_reason',
        'return_reason',
        'cancelled_at',
    ];
    
    protected $casts = [
        'shipping_address' => 'array',
        'billing_address' => 'array',
        'gateway_response' => 'array',
        'total' => 'decimal:2',
        'sub_total' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'shipping' => 'decimal:2',
        'tax' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
        'status_history' => 'array',
        'cancelled_at' => 'datetime',
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
        // Addresses are related to the user who placed the order, not the order record itself.
        // Query addresses where `addresses.user_id = orders.user_id`.
        return $this->hasMany(Address::class, 'user_id', 'user_id');
    }

    /**
     * Return the primary address for the order.
     * Prefers structured `shipping_address` array, then `billing_address`, then related `addresses` relation.
     */
    public function primaryAddress()
    {
        if (!empty($this->shipping_address)) {
            return $this->shipping_address;
        }

        if (!empty($this->billing_address)) {
            return $this->billing_address;
        }

        // If related addresses exist, return the first
        try {
            if ($this->relationLoaded('addresses')) {
                $first = $this->addresses->first();
                return $first ? $first->toArray() : null;
            }

            $first = $this->addresses()->first();
            return $first ? $first->toArray() : null;
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Accessor for `$order->primary_address` in views
     */
    public function getPrimaryAddressAttribute()
    {
        return $this->primaryAddress();
    }
    
    public function cartItems()
    {
        return $this->hasMany(Cart::class);
    }
}
