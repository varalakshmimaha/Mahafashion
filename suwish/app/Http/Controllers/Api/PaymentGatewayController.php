<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentGateway;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PaymentGatewayController extends Controller
{
    /**
     * Get all payment gateways.
     */
    public function index(): JsonResponse
    {
        // Ensure default gateways exist
        $this->ensureDefaultGatewaysExist();

        $gateways = PaymentGateway::all();
        
        // Hide sensitive data if needed, but for admin, maybe we show keys but mask secrets?
        // The frontend currently expects the raw config. 
        // Note: The Model automatically handles encryption/decryption.
        
        return response()->json($gateways);
    }

    /**
     * Enable a payment gateway.
     */
    public function enable($id): JsonResponse
    {
        $gateway = PaymentGateway::findOrFail($id);
        $gateway->is_enabled = true;
        // Don't need to re-encrypt config as we are not touching it, 
        // BUT the model's saving event might double encrypt if we are not careful?
        // Let's check the model logic. It encrypts on 'saving'.
        // If retrieving decrypts it, then $gateway->config is array.
        // Saving will re-encrypt it. This should be fine.
        $gateway->save();

        return response()->json(['message' => 'Gateway enabled successfully']);
    }

    /**
     * Disable a payment gateway.
     */
    public function disable($id): JsonResponse
    {
        $gateway = PaymentGateway::findOrFail($id);
        $gateway->is_enabled = false;
        $gateway->save();

        return response()->json(['message' => 'Gateway disabled successfully']);
    }

    /**
     * Update configuration for a payment gateway.
     */
    public function updateConfig(Request $request, $id): JsonResponse
    {
        $gateway = PaymentGateway::findOrFail($id);
        
        $config = $request->all(); // Frontend sends the full config object

        // For Razorpay/Paytm/PhonePe logic to not overwrite secrets with masking characters if frontend handles masking...
        // But the frontend seems to send plain values.
        // If frontend sends masked '******' we should probably NOT overwrite the existing secret.
        
        $currentConfig = $gateway->config ?? [];
        
        foreach ($config as $key => $value) {
            // If value looks like a mask (and is a secret key), skip updating it
            if ($value === '******') {
                $config[$key] = $currentConfig[$key] ?? '';
            }
        }

        $gateway->config = $config;
        $gateway->save();

        return response()->json(['message' => 'Configuration updated successfully']);
    }

    /**
     * Helper to ensure basic gateways exist in DB.
     */
    private function ensureDefaultGatewaysExist()
    {
        $defaults = [
            'razorpay' => 'Razorpay',
            'phonepe' => 'PhonePe',
            'paytm' => 'Paytm',
            'cod' => 'Cash on Delivery'
        ];

        foreach ($defaults as $name => $displayName) {
            if (!PaymentGateway::where('name', $name)->exists()) {
                PaymentGateway::create([
                    'name' => $name,
                    'display_name' => $displayName,
                    'is_enabled' => false,
                    'config' => []
                ]);
            }
        }
    }
}
