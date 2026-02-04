<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class PaymentGateway extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'is_enabled',
        'config',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'config' => 'array', // Cast to array for easier handling
    ];

    /**
     * The "booting" method of the model.
     *
     * We'll use this to encrypt the 'config' attribute before saving
     * and decrypt it after retrieval.
     */
    protected static function boot()
    {
        parent::boot();
    }
}