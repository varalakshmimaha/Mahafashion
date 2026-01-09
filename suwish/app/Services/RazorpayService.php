<?php

namespace App\Services;

use Razorpay\Api\Api;

class RazorpayService
{
    protected $api;
    protected $key;
    protected $secret;

    public function __construct()
    {
        $this->key = env('RAZORPAY_KEY');
        $this->secret = env('RAZORPAY_SECRET');
        
        $this->api = new Api($this->key, $this->secret);
    }

    /**
     * Create a new order in Razorpay
     * 
     * @param float $amount Amount in paise (100 paise = 1 rupee)
     * @param string $currency Currency code (default: INR)
     * @param array $options Additional options
     * @return array Order details
     */
    public function createOrder($amount, $currency = 'INR', $options = [])
    {
        $data = [
            'amount' => $amount * 100, // Convert to paise
            'currency' => $currency,
            'receipt' => uniqid(),
            'payment_capture' => 1 // Auto-capture payment
        ];

        // Merge any additional options
        $data = array_merge($data, $options);

        return $this->api->order->create($data);
    }

    /**
     * Verify payment signature
     * 
     * @param string $paymentId Payment ID from Razorpay
     * @param string $orderId Order ID from Razorpay
     * @param string $signature Signature from Razorpay
     * @return bool Whether signature is valid
     */
    public function verifyPaymentSignature($paymentId, $orderId, $signature)
    {
        try {
            $this->api->utility->verifyPaymentSignature([
                'razorpay_payment_id' => $paymentId,
                'razorpay_order_id' => $orderId,
                'razorpay_signature' => $signature
            ]);

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get payment details by payment ID
     * 
     * @param string $paymentId Payment ID from Razorpay
     * @return array Payment details
     */
    public function getPayment($paymentId)
    {
        return $this->api->payment->fetch($paymentId);
    }
    
    /**
     * Capture a payment (for orders with manual capture)
     * 
     * @param string $paymentId Payment ID from Razorpay
     * @param int $amount Amount to capture in paise
     * @return array Payment capture details
     */
    public function capturePayment($paymentId, $amount = null)
    {
        $data = [];
        if ($amount) {
            $data['amount'] = $amount;
        }
        
        return $this->api->payment->capture($paymentId, $data);
    }
    
    /**
     * Refund a payment
     * 
     * @param string $paymentId Payment ID from Razorpay
     * @param int $amount Amount to refund in paise
     * @param array $options Additional options for refund
     * @return array Refund details
     */
    public function refundPayment($paymentId, $amount = null, $options = [])
    {
        $data = [];
        if ($amount) {
            $data['amount'] = $amount;
        }
        $data = array_merge($data, $options);
        
        return $this->api->payment->refund($paymentId, $data);
    }
    
    /**
     * Get order details by order ID
     * 
     * @param string $orderId Order ID from Razorpay
     * @return array Order details
     */
    public function getOrder($orderId)
    {
        return $this->api->order->fetch($orderId);
    }
}