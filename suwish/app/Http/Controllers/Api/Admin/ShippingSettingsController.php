<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingSetting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ShippingSettingsController extends Controller
{
    /**
     * Get all shipping settings (Public accessible or Admin)
     */
    public function index(): JsonResponse
    {
        $settings = ShippingSetting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    /**
     * Update shipping settings (Admin only)
     */
    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'shipping_fee' => 'required|numeric',
            'free_shipping_threshold' => 'required|numeric',
            'express_delivery_label' => 'required|string',
            'express_delivery_subtitle' => 'required|string',
            'standard_delivery_label' => 'nullable|string',
            'standard_delivery_subtitle' => 'nullable|string',
        ]);

        foreach ($data as $key => $value) {
            ShippingSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return response()->json(['message' => 'Shipping settings updated successfully', 'settings' => $data]);
    }
}
