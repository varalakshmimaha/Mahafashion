<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentGateway;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    /**
     * Get available payment methods for checkout.
     */
    public function getAvailablePaymentMethods()
    {
        $enabledGateways = PaymentGateway::where('is_enabled', true)->get();

        $availableMethods = $enabledGateways->map(function ($gateway) {
            // Only return necessary information for the frontend
            $data = [
                'id' => $gateway->id,
                'name' => $gateway->name,
                'display_name' => $gateway->display_name,
                'is_enabled' => $gateway->is_enabled,
                'config' => [], // Initialize config
            ];

            // For COD, send specific config needed for frontend logic (e.g., min/max amount, charges)
            if ($gateway->name === 'cod') {
                $data['config'] = [
                    'max_order_amount' => $gateway->config['max_order_amount'] ?? null,
                    'min_order_amount' => $gateway->config['min_order_amount'] ?? null,
                    'cod_charges' => $gateway->config['cod_charges'] ?? null,
                    // Note: 'allow_cod_for_pincodes' should probably be checked backend,
                    // or sent only if relevant for frontend display/validation.
                    // For now, we omit sensitive or backend-specific details.
                ];
            } elseif ($gateway->name === 'razorpay') {
                // For Razorpay, frontend needs Key ID for SDK initialization
                $data['config']['key_id'] = $gateway->config['key_id'] ?? null;
                $data['config']['mode'] = $gateway->config['mode'] ?? null;
                // DO NOT send key_secret or webhook_secret
            }
            // For other gateways, decide what minimal public config is needed by the frontend.
            // Generally, API keys/secrets should NEVER leave the backend.
            // Environment (UAT/Production), Merchant ID might be needed for some SDKs.
            // PhonePe: Merchant ID, Salt Key/Index might be needed for client-side SDK.
            // Paytm: Merchant ID, Website Name, Industry Type, Environment for client-side SDK.

            // As per requirement 8: Never expose secrets to frontend.
            // I'm assuming for PhonePe and Paytm, only environment and merchant ID might be needed by client-side SDKs.
            // Salt Key, Merchant Key should remain backend.

            if ($gateway->name === 'phonepe') {
                $data['config']['merchant_id'] = $gateway->config['merchant_id'] ?? null;
                $data['config']['environment'] = $gateway->config['environment'] ?? null;
                // Callback URL is for backend only
            }

            if ($gateway->name === 'paytm') {
                $data['config']['merchant_id'] = $gateway->config['merchant_id'] ?? null;
                $data['config']['website_name'] = $gateway->config['website_name'] ?? null;
                $data['config']['industry_type'] = $gateway->config['industry_type'] ?? null;
                $data['config']['environment'] = $gateway->config['environment'] ?? null;
            }


            return $data;
        });

        return response()->json($availableMethods);
    }
}