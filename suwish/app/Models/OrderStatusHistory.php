<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderStatusHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'old_status',
        'new_status',
        'old_payment_status',
        'new_payment_status',
        'updated_by',
        'comments'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
