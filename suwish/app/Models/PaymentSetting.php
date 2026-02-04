<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class PaymentSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        // Razorpay
        'razorpay_enabled',
        'razorpay_key_id',
        'razorpay_key_secret',
        'razorpay_test_mode',
        
        // PhonePe
        'phonepe_enabled',
        'phonepe_merchant_id',
        'phonepe_salt_key',
        'phonepe_salt_index',
        'phonepe_test_mode',
        
        // Paytm
        'paytm_enabled',
        'paytm_merchant_id',
        'paytm_merchant_key',
        'paytm_website',
        'paytm_industry_type',
        'paytm_test_mode',
        
        // COD
        'cod_enabled',
        'cod_min_amount',
        'cod_max_amount',
    ];

    protected $casts = [
        'razorpay_enabled' => 'boolean',
        'razorpay_test_mode' => 'boolean',
        'phonepe_enabled' => 'boolean',
        'phonepe_test_mode' => 'boolean',
        'paytm_enabled' => 'boolean',
        'paytm_test_mode' => 'boolean',
        'cod_enabled' => 'boolean',
        'cod_min_amount' => 'decimal:2',
        'cod_max_amount' => 'decimal:2',
    ];

    // Hidden fields - never expose secrets in JSON
    protected $hidden = [
        'razorpay_key_secret',
        'phonepe_salt_key',
        'paytm_merchant_key',
    ];

    /**
     * Get the singleton instance of payment settings
     */
    public static function getInstance(): self
    {
        $settings = self::first();
        
        if (!$settings) {
            $settings = self::create([
                'razorpay_enabled' => false,
                'phonepe_enabled' => false,
                'paytm_enabled' => false,
                'cod_enabled' => true,
            ]);
        }
        
        return $settings;
    }

    /**
     * Encrypt secret before saving
     */
    public function setRazorpayKeySecretAttribute($value)
    {
        if ($value && $value !== '******') {
            $this->attributes['razorpay_key_secret'] = Crypt::encryptString($value);
        }
    }

    /**
     * Decrypt secret when accessing
     */
    public function getRazorpayKeySecretDecryptedAttribute()
    {
        try {
            return $this->attributes['razorpay_key_secret'] 
                ? Crypt::decryptString($this->attributes['razorpay_key_secret']) 
                : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Encrypt PhonePe salt key before saving
     */
    public function setPhonepeSaltKeyAttribute($value)
    {
        if ($value && $value !== '******') {
            $this->attributes['phonepe_salt_key'] = Crypt::encryptString($value);
        }
    }

    /**
     * Decrypt PhonePe salt key when accessing
     */
    public function getPhonepeSaltKeyDecryptedAttribute()
    {
        try {
            return $this->attributes['phonepe_salt_key'] 
                ? Crypt::decryptString($this->attributes['phonepe_salt_key']) 
                : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Encrypt Paytm merchant key before saving
     */
    public function setPaytmMerchantKeyAttribute($value)
    {
        if ($value && $value !== '******') {
            $this->attributes['paytm_merchant_key'] = Crypt::encryptString($value);
        }
    }

    /**
     * Decrypt Paytm merchant key when accessing
     */
    public function getPaytmMerchantKeyDecryptedAttribute()
    {
        try {
            return $this->attributes['paytm_merchant_key'] 
                ? Crypt::decryptString($this->attributes['paytm_merchant_key']) 
                : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get available (enabled) payment methods
     */
    public function getEnabledMethods(): array
    {
        $methods = [];
        
        if ($this->razorpay_enabled && $this->razorpay_key_id) {
            $methods[] = [
                'id' => 'razorpay',
                'name' => 'Razorpay',
                'description' => 'Pay securely with UPI, Cards, Netbanking',
                'icon' => '/icons/razorpay.svg',
            ];
        }
        
        if ($this->phonepe_enabled && $this->phonepe_merchant_id) {
            $methods[] = [
                'id' => 'phonepe',
                'name' => 'PhonePe',
                'description' => 'Pay using PhonePe UPI',
                'icon' => '/icons/phonepe.svg',
            ];
        }
        
        if ($this->paytm_enabled && $this->paytm_merchant_id) {
            $methods[] = [
                'id' => 'paytm',
                'name' => 'Paytm',
                'description' => 'Pay using Paytm Wallet or UPI',
                'icon' => '/icons/paytm.svg',
            ];
        }
        
        if ($this->cod_enabled) {
            $methods[] = [
                'id' => 'cod',
                'name' => 'Cash on Delivery',
                'description' => 'Pay when you receive your order',
                'icon' => '/icons/cod.svg',
                'min_amount' => $this->cod_min_amount,
                'max_amount' => $this->cod_max_amount,
            ];
        }
        
        return $methods;
    }

    /**
     * Get settings for admin (with masked secrets)
     */
    public function getAdminSettings(): array
    {
        return [
            'razorpay' => [
                'enabled' => $this->razorpay_enabled,
                'key_id' => $this->razorpay_key_id,
                'key_secret' => $this->attributes['razorpay_key_secret'] ? '******' : null,
                'test_mode' => $this->razorpay_test_mode,
            ],
            'phonepe' => [
                'enabled' => $this->phonepe_enabled,
                'merchant_id' => $this->phonepe_merchant_id,
                'salt_key' => $this->attributes['phonepe_salt_key'] ? '******' : null,
                'salt_index' => $this->phonepe_salt_index,
                'test_mode' => $this->phonepe_test_mode,
            ],
            'paytm' => [
                'enabled' => $this->paytm_enabled,
                'merchant_id' => $this->paytm_merchant_id,
                'merchant_key' => $this->attributes['paytm_merchant_key'] ? '******' : null,
                'website' => $this->paytm_website,
                'industry_type' => $this->paytm_industry_type,
                'test_mode' => $this->paytm_test_mode,
            ],
            'cod' => [
                'enabled' => $this->cod_enabled,
                'min_amount' => $this->cod_min_amount,
                'max_amount' => $this->cod_max_amount,
            ],
            'updated_at' => $this->updated_at,
        ];
    }
}
