<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentGateway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AdminPaymentGatewayController extends Controller
{
    /**
     * Display a listing of the payment gateways.
     */
    public function index()
    {
        $gateways = PaymentGateway::all();
        // Mask sensitive config keys for display
        $gateways->each(function ($gateway) {
            if ($gateway->config && is_array($gateway->config)) {
                $maskedConfig = [];
                foreach ($gateway->config as $key => $value) {
                    if (str_contains(strtolower($key), 'key') || str_contains(strtolower($key), 'secret')) {
                        $maskedConfig[$key] = '********' . substr($value, -4); // Mask all but last 4
                    } else {
                        $maskedConfig[$key] = $value;
                    }
                }
                $gateway->masked_config = $maskedConfig;
            } else {
                $gateway->masked_config = [];
            }
        });

        return view('admin.payment-gateways.index', compact('gateways'));
    }

    /**
     * Enable a specific payment gateway.
     */
    public function enable(Request $request, PaymentGateway $paymentGateway)
    {
        // Check if config is valid before enabling (except for COD)
        if ($paymentGateway->name !== 'cod' && empty($paymentGateway->config)) {
            return response()->json(['message' => 'Cannot enable gateway without valid configuration.'], 400);
        }

        $paymentGateway->is_enabled = true;
        $paymentGateway->save();

        return response()->json(['message' => "{$paymentGateway->display_name} enabled successfully."]);
    }

    /**
     * Disable a specific payment gateway.
     */
    public function disable(Request $request, PaymentGateway $paymentGateway)
    {
        // Ensure at least one payment method remains enabled
        $enabledGatewaysCount = PaymentGateway::where('is_enabled', true)->count();

        if ($paymentGateway->is_enabled && $enabledGatewaysCount <= 1) {
            return response()->json(['message' => 'At least one payment method must remain enabled.'], 400);
        }

        $paymentGateway->is_enabled = false;
        $paymentGateway->save();

        return response()->json(['message' => "{$paymentGateway->display_name} disabled successfully."]);
    }

    /**
     * Update the configuration for a specific payment gateway.
     */
    public function updateConfig(Request $request, PaymentGateway $paymentGateway)
    {
        $rules = $this->getValidationRules($paymentGateway->name);

        // Log request data for debugging
        \Illuminate\Support\Facades\Log::info("Updating config for {$paymentGateway->name} (ID: {$paymentGateway->id})");
        \Illuminate\Support\Facades\Log::info('Request payload:', $request->all());

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            \Illuminate\Support\Facades\Log::error('Validation failed:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $newConfig = $request->except(['_method']);
        $currentConfig = $paymentGateway->config ?? [];

        foreach ($newConfig as $key => $value) {
            // If the value sent from frontend is masked (starts with 8 asterisks),
            // we should not overwrite the existing secret with this masked string.
            // We reuse the existing value from the database.
            if (is_string($value) && substr($value, 0, 8) === '********') {
                $newConfig[$key] = $currentConfig[$key] ?? $value;
            }
        }

        $paymentGateway->config = $newConfig;
        $paymentGateway->save();

        return response()->json(['message' => "{$paymentGateway->display_name} configuration updated successfully."]);
    }

    /**
     * Get validation rules for different payment gateways.
     */
    protected function getValidationRules(string $gatewayName): array
    {
        switch ($gatewayName) {
            case 'razorpay':
                return [
                    'key_id' => 'required|string',
                    'key_secret' => 'required|string',
                    'webhook_secret' => 'nullable|string',
                    'mode' => ['required', Rule::in(['test', 'live'])],
                ];
            case 'phonepe':
                return [
                    'merchant_id' => 'required|string',
                    'salt_key' => 'required|string',
                    'salt_index' => 'required|integer',
                    'environment' => ['required', Rule::in(['uat', 'production'])],
                    // 'callback_url' is auto-generated, not user input
                ];
            case 'paytm':
                return [
                    'merchant_id' => 'required|string',
                    'merchant_key' => 'required|string',
                    'website_name' => 'required|string',
                    'industry_type' => 'required|string',
                    'environment' => ['required', Rule::in(['staging', 'production'])],
                ];
            case 'cod':
                return [
                    'enable_cod' => 'boolean',
                    'max_order_amount' => 'nullable|numeric|min:0',
                    'min_order_amount' => 'nullable|numeric|min:0',
                    'cod_charges' => 'nullable|numeric|min:0',
                    'allow_cod_for_pincodes' => 'nullable|string', // comma separated pincodes
                ];
            default:
                return [];
        }
    }
}
