<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PaymentGateway;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class PaymentGatewayController extends Controller
{
    /**
     * Display a listing of the payment gateways.
     */
    public function index(): \Illuminate\Http\JsonResponse
    {
        $gateways = PaymentGateway::all()->map(function ($gateway) {
            // Return masked config for security
            $gateway->config = $gateway->getMaskedConfig();
            return $gateway;
        });

        return response()->json($gateways);
    }

    /**
     * Enable a specific payment gateway.
     */
    public function enable(Request $request, PaymentGateway $paymentGateway): \Illuminate\Http\JsonResponse
    {
        // For COD, no config is strictly required
        if ($paymentGateway->name !== 'cod' && empty($paymentGateway->config)) {
            return response()->json(['message' => 'Configuration is required to enable this gateway.'], 422);
        }

        $paymentGateway->is_enabled = true;
        $paymentGateway->save();

        return response()->json(['message' => "{$paymentGateway->display_name} enabled successfully.", 'gateway' => $paymentGateway]);
    }

    /**
     * Disable a specific payment gateway.
     */
    public function disable(PaymentGateway $paymentGateway): \Illuminate\Http\JsonResponse
    {
        // Ensure at least one payment method remains enabled
        $enabledGatewaysCount = PaymentGateway::where('is_enabled', true)->count();
        if ($paymentGateway->is_enabled && $enabledGatewaysCount <= 1) {
            return response()->json(['message' => 'At least one payment gateway must remain enabled.'], 422);
        }

        $paymentGateway->is_enabled = false;
        $paymentGateway->save();

        return response()->json(['message' => "{$paymentGateway->display_name} disabled successfully.", 'gateway' => $paymentGateway]);
    }

    /**
     * Update the configuration for a specific payment gateway.
     */
    public function updateConfig(Request $request, PaymentGateway $paymentGateway): \Illuminate\Http\JsonResponse
    {
        $rules = $this->getValidationRules($paymentGateway->name);
        
        try {
            $validatedData = $request->validate($rules);
        } catch (ValidationException $e) {
            Log::error("Validation failed for {$paymentGateway->name} config update: " . json_encode($e->errors()));
            return response()->json(['errors' => $e->errors()], 422);
        }

        $config = $paymentGateway->config ?? [];
        foreach ($validatedData as $key => $value) {
            // Only update keys that were actually validated and sent in the request
            $config[$key] = $value;
        }

        $paymentGateway->config = $config;
        $paymentGateway->save();

        // Return masked config for security
        $paymentGateway->config = $paymentGateway->getMaskedConfig();

        return response()->json(['message' => "{$paymentGateway->display_name} configuration updated successfully.", 'gateway' => $paymentGateway]);
    }

    /**
     * Get validation rules based on gateway name.
     */
    protected function getValidationRules(string $gatewayName): array
    {
        switch ($gatewayName) {
            case 'razorpay':
                return [
                    'key_id' => 'required|string|max:255',
                    'key_secret' => 'required|string|max:255',
                    'webhook_secret' => 'nullable|string|max:255',
                    'mode' => 'required|in:test,live',
                ];
            case 'phonepe':
                return [
                    'merchant_id' => 'required|string|max:255',
                    'salt_key' => 'required|string|max:255',
                    'salt_index' => 'required|integer',
                    'environment' => 'required|in:UAT,PRODUCTION',
                ];
            case 'paytm':
                return [
                    'merchant_id' => 'required|string|max:255',
                    'merchant_key' => 'required|string|max:255',
                    'website_name' => 'required|string|max:255',
                    'industry_type' => 'required|string|max:255',
                    'environment' => 'required|in:Staging,Production',
                ];
            case 'cod':
                return [
                    'is_enabled' => 'boolean', // This is handled by enable/disable methods primarily
                    'max_order_amount' => 'nullable|numeric|min:0',
                    'min_order_amount' => 'nullable|numeric|min:0',
                    'cod_charges' => 'nullable|numeric|min:0',
                    'allow_pincodes' => 'nullable|string', // comma-separated pincodes
                ];
            default:
                return [];
        }
    }
}
