<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'payment_gateway',
        'transaction_id',
        'amount',
        'status',
        'response',
    ];

    protected $casts = [
        'response' => 'array', // Automatically cast response to array/json
    ];

    /**
     * Get the order that owns the payment.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
