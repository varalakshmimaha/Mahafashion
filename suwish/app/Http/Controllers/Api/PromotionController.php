<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Promotion;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PromotionController extends Controller
{
    /**
     * Get all active banner promotions for public display
     */
    public function banners()
    {
        $promotions = Promotion::banners()
            ->active()
            ->orderBy('sort_order')
            ->get()
            ->map(function ($promo) {
                return [
                    'id' => $promo->id,
                    'title' => $promo->title,
                    'subtitle' => $promo->subtitle,
                    'description' => $promo->description,
                    'image' => $promo->image_url,
                    'button_text' => $promo->button_text,
                    'button_link' => $promo->button_link,
                    'discount_text' => $promo->discount_text,
                    'end_date' => $promo->end_date ? $promo->end_date->toISOString() : null,
                ];
            });

        return response()->json($promotions);
    }

    /**
     * Get all promotions for admin (both coupons and banners)
     */
    public function index(Request $request)
    {
        $type = $request->query('type');
        $query = Promotion::orderBy('sort_order');
        
        if ($type) {
            $query->where('type', $type);
        }
        
        $promotions = $query->get()->map(function ($promo) {
            return [
                'id' => $promo->id,
                'code' => $promo->code,
                'title' => $promo->title,
                'subtitle' => $promo->subtitle,
                'description' => $promo->description,
                'image' => $promo->image_url,
                'button_text' => $promo->button_text,
                'button_link' => $promo->button_link,
                'discount_text' => $promo->discount_text,
                'discount_type' => $promo->discount_type,
                'discount_value' => $promo->discount_value,
                'start_date' => $promo->start_date,
                'end_date' => $promo->end_date,
                'usage_limit' => $promo->usage_limit,
                'used_count' => $promo->used_count,
                'minimum_amount' => $promo->minimum_amount,
                'is_active' => $promo->is_active,
                'type' => $promo->type,
                'sort_order' => $promo->sort_order,
                'created_at' => $promo->created_at,
                'updated_at' => $promo->updated_at,
            ];
        });

        return response()->json($promotions);
    }

    /**
     * Store a new promotion (banner type)
     */
    public function store(Request $request)
    {
        $type = $request->input('type', 'banner');
        
        $rules = [
            'type' => 'in:coupon,banner',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ];
        
        if ($type === 'banner') {
            $rules = array_merge($rules, [
                'title' => 'required|string|max:255',
                'subtitle' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
                'button_text' => 'nullable|string|max:100',
                'button_link' => 'nullable|string|max:255',
                'discount_text' => 'nullable|string|max:100',
            ]);
        } else {
            $rules = array_merge($rules, [
                'code' => 'required|string|unique:promotions,code',
                'discount_type' => 'required|in:percentage,fixed',
                'discount_value' => 'required|numeric|min:0',
                'usage_limit' => 'nullable|integer|min:1',
                'minimum_amount' => 'nullable|numeric|min:0',
            ]);
        }
        
        $validator = Validator::make($request->all(), $rules);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $data = $validator->validated();
        $data['type'] = $type;
        
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('promotions', 'public');
        }
        
        $promotion = Promotion::create($data);

        return response()->json([
            'message' => 'Promotion created successfully',
            'promotion' => $this->formatPromotion($promotion)
        ], 201);
    }

    /**
     * Get a single promotion
     */
    public function show($id)
    {
        $promotion = Promotion::findOrFail($id);
        return response()->json($this->formatPromotion($promotion));
    }

    /**
     * Update a promotion
     */
    public function update(Request $request, $id)
    {
        $promotion = Promotion::findOrFail($id);
        $type = $request->input('type', $promotion->type);
        
        $rules = [
            'type' => 'in:coupon,banner',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ];
        
        if ($type === 'banner') {
            $rules = array_merge($rules, [
                'title' => 'sometimes|required|string|max:255',
                'subtitle' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
                'button_text' => 'nullable|string|max:100',
                'button_link' => 'nullable|string|max:255',
                'discount_text' => 'nullable|string|max:100',
            ]);
        } else {
            $rules = array_merge($rules, [
                'code' => 'sometimes|required|string|unique:promotions,code,' . $id,
                'discount_type' => 'sometimes|required|in:percentage,fixed',
                'discount_value' => 'sometimes|required|numeric|min:0',
                'usage_limit' => 'nullable|integer|min:1',
                'minimum_amount' => 'nullable|numeric|min:0',
            ]);
        }
        
        $validator = Validator::make($request->all(), $rules);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $data = $validator->validated();
        
        if ($request->hasFile('image')) {
            // Delete old image
            if ($promotion->image) {
                Storage::disk('public')->delete($promotion->image);
            }
            $data['image'] = $request->file('image')->store('promotions', 'public');
        }
        
        $promotion->update($data);

        return response()->json([
            'message' => 'Promotion updated successfully',
            'promotion' => $this->formatPromotion($promotion)
        ]);
    }

    /**
     * Delete a promotion
     */
    public function destroy($id)
    {
        $promotion = Promotion::findOrFail($id);
        
        if ($promotion->image) {
            Storage::disk('public')->delete($promotion->image);
        }
        
        $promotion->delete();

        return response()->json(['message' => 'Promotion deleted successfully']);
    }

    /**
     * Toggle promotion status
     */
    public function toggleStatus($id)
    {
        $promotion = Promotion::findOrFail($id);
        $promotion->is_active = !$promotion->is_active;
        $promotion->save();

        return response()->json([
            'message' => 'Promotion status updated successfully',
            'is_active' => $promotion->is_active
        ]);
    }

    /**
     * Format promotion for response
     */
    private function formatPromotion($promo)
    {
        return [
            'id' => $promo->id,
            'code' => $promo->code,
            'title' => $promo->title,
            'subtitle' => $promo->subtitle,
            'description' => $promo->description,
            'image' => $promo->image_url,
            'button_text' => $promo->button_text,
            'button_link' => $promo->button_link,
            'discount_text' => $promo->discount_text,
            'discount_type' => $promo->discount_type,
            'discount_value' => $promo->discount_value,
            'start_date' => $promo->start_date,
            'end_date' => $promo->end_date,
            'usage_limit' => $promo->usage_limit,
            'used_count' => $promo->used_count,
            'minimum_amount' => $promo->minimum_amount,
            'is_active' => $promo->is_active,
            'type' => $promo->type,
            'sort_order' => $promo->sort_order,
        ];
    }
}
