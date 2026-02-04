<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class PaymentSettingsController extends Controller
{
    /**
     * Get payment settings for admin panel
     */
    public function getAdminSettings(): JsonResponse
    {
        try {
            $settings = PaymentSetting::getInstance();
            
            return response()->json([
                'success' => true,
                'data' => $settings->getAdminSettings(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch payment settings: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update payment settings from admin panel
     */
    public function updateSettings(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                // Razorpay
                'razorpay.enabled' => 'boolean',
                'razorpay.key_id' => 'nullable|string|max:255',
                'razorpay.key_secret' => 'nullable|string|max:500',
                'razorpay.test_mode' => 'boolean',
                
                // PhonePe
                'phonepe.enabled' => 'boolean',
                'phonepe.merchant_id' => 'nullable|string|max:255',
                'phonepe.salt_key' => 'nullable|string|max:500',
                'phonepe.salt_index' => 'nullable|string|max:10',
                'phonepe.test_mode' => 'boolean',
                
                // Paytm
                'paytm.enabled' => 'boolean',
                'paytm.merchant_id' => 'nullable|string|max:255',
                'paytm.merchant_key' => 'nullable|string|max:500',
                'paytm.website' => 'nullable|string|max:50',
                'paytm.industry_type' => 'nullable|string|max:50',
                'paytm.test_mode' => 'boolean',
                
                // COD
                'cod.enabled' => 'boolean',
                'cod.min_amount' => 'nullable|numeric|min:0',
                'cod.max_amount' => 'nullable|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $settings = PaymentSetting::getInstance();
            
            // Update Razorpay settings
            if ($request->has('razorpay')) {
                $razorpay = $request->input('razorpay');
                $settings->razorpay_enabled = $razorpay['enabled'] ?? $settings->razorpay_enabled;
                $settings->razorpay_key_id = $razorpay['key_id'] ?? $settings->razorpay_key_id;
                $settings->razorpay_test_mode = $razorpay['test_mode'] ?? $settings->razorpay_test_mode;
                
                // Only update secret if not masked
                if (isset($razorpay['key_secret']) && $razorpay['key_secret'] !== '******') {
                    $settings->razorpay_key_secret = $razorpay['key_secret'];
                }
            }
            
            // Update PhonePe settings
            if ($request->has('phonepe')) {
                $phonepe = $request->input('phonepe');
                $settings->phonepe_enabled = $phonepe['enabled'] ?? $settings->phonepe_enabled;
                $settings->phonepe_merchant_id = $phonepe['merchant_id'] ?? $settings->phonepe_merchant_id;
                $settings->phonepe_salt_index = $phonepe['salt_index'] ?? $settings->phonepe_salt_index;
                $settings->phonepe_test_mode = $phonepe['test_mode'] ?? $settings->phonepe_test_mode;
                
                if (isset($phonepe['salt_key']) && $phonepe['salt_key'] !== '******') {
                    $settings->phonepe_salt_key = $phonepe['salt_key'];
                }
            }
            
            // Update Paytm settings
            if ($request->has('paytm')) {
                $paytm = $request->input('paytm');
                $settings->paytm_enabled = $paytm['enabled'] ?? $settings->paytm_enabled;
                $settings->paytm_merchant_id = $paytm['merchant_id'] ?? $settings->paytm_merchant_id;
                $settings->paytm_website = $paytm['website'] ?? $settings->paytm_website;
                $settings->paytm_industry_type = $paytm['industry_type'] ?? $settings->paytm_industry_type;
                $settings->paytm_test_mode = $paytm['test_mode'] ?? $settings->paytm_test_mode;
                
                if (isset($paytm['merchant_key']) && $paytm['merchant_key'] !== '******') {
                    $settings->paytm_merchant_key = $paytm['merchant_key'];
                }
            }
            
            // Update COD settings
            if ($request->has('cod')) {
                $cod = $request->input('cod');
                $settings->cod_enabled = $cod['enabled'] ?? $settings->cod_enabled;
                $settings->cod_min_amount = $cod['min_amount'] ?? $settings->cod_min_amount;
                $settings->cod_max_amount = $cod['max_amount'] ?? $settings->cod_max_amount;
            }
            
            $settings->save();

            return response()->json([
                'success' => true,
                'message' => 'Payment settings updated successfully',
                'data' => $settings->getAdminSettings(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to update payment settings: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment settings: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get available payment methods for checkout (public)
     */
    public function getAvailableMethods(): JsonResponse
    {
        try {
            $settings = PaymentSetting::getInstance();
            
            return response()->json([
                'success' => true,
                'methods' => $settings->getEnabledMethods(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch payment methods',
                'methods' => [
                    [
                        'id' => 'cod',
                        'name' => 'Cash on Delivery',
                        'description' => 'Pay when you receive your order',
                    ]
                ],
            ]);
        }
    }

    /**
     * Get Razorpay key ID for frontend (public - no secret exposed)
     */
    public function getRazorpayKey(): JsonResponse
    {
        try {
            $settings = PaymentSetting::getInstance();
            
            if (!$settings->razorpay_enabled || !$settings->razorpay_key_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Razorpay is not configured',
                ], 400);
            }
            
            return response()->json([
                'success' => true,
                'key_id' => $settings->razorpay_key_id,
                'test_mode' => $settings->razorpay_test_mode,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch Razorpay key',
            ], 500);
        }
    }
}
