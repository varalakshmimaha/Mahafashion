<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class OfferController extends Controller
{
    /**
     * Get all active offers for public display
     */
    public function index()
    {
        $offers = Offer::active()
            ->orderBy('sort_order')
            ->get()
            ->map(function ($offer) {
                return [
                    'id' => $offer->id,
                    'title' => $offer->title,
                    'subtitle' => $offer->subtitle,
                    'description' => $offer->description,
                    'image' => $offer->image_url,
                    'button_text' => $offer->button_text,
                    'button_link' => $offer->button_link,
                    'discount_text' => $offer->discount_text,
                    'end_date' => $offer->end_date ? $offer->end_date->toISOString() : null,
                ];
            });

        return response()->json($offers);
    }

    /**
     * Get all offers for admin
     */
    public function adminIndex()
    {
        $offers = Offer::orderBy('sort_order')->get()->map(function ($offer) {
            return [
                'id' => $offer->id,
                'title' => $offer->title,
                'subtitle' => $offer->subtitle,
                'description' => $offer->description,
                'image' => $offer->image_url,
                'button_text' => $offer->button_text,
                'button_link' => $offer->button_link,
                'discount_text' => $offer->discount_text,
                'start_date' => $offer->start_date,
                'end_date' => $offer->end_date,
                'is_active' => $offer->is_active,
                'sort_order' => $offer->sort_order,
                'created_at' => $offer->created_at,
                'updated_at' => $offer->updated_at,
            ];
        });

        return response()->json($offers);
    }

    /**
     * Store a new offer
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:255',
            'discount_text' => 'nullable|string|max:100',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('offers', 'public');
        }

        $offer = Offer::create($data);

        return response()->json([
            'message' => 'Offer created successfully',
            'offer' => [
                'id' => $offer->id,
                'title' => $offer->title,
                'subtitle' => $offer->subtitle,
                'description' => $offer->description,
                'image' => $offer->image_url,
                'button_text' => $offer->button_text,
                'button_link' => $offer->button_link,
                'discount_text' => $offer->discount_text,
                'start_date' => $offer->start_date,
                'end_date' => $offer->end_date,
                'is_active' => $offer->is_active,
                'sort_order' => $offer->sort_order,
            ]
        ], 201);
    }

    /**
     * Get a single offer
     */
    public function show($id)
    {
        $offer = Offer::findOrFail($id);

        return response()->json([
            'id' => $offer->id,
            'title' => $offer->title,
            'subtitle' => $offer->subtitle,
            'description' => $offer->description,
            'image' => $offer->image_url,
            'button_text' => $offer->button_text,
            'button_link' => $offer->button_link,
            'discount_text' => $offer->discount_text,
            'start_date' => $offer->start_date,
            'end_date' => $offer->end_date,
            'is_active' => $offer->is_active,
            'sort_order' => $offer->sort_order,
        ]);
    }

    /**
     * Update an offer
     */
    public function update(Request $request, $id)
    {
        $offer = Offer::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:255',
            'discount_text' => 'nullable|string|max:100',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('image')) {
            // Delete old image
            if ($offer->image) {
                Storage::disk('public')->delete($offer->image);
            }
            $data['image'] = $request->file('image')->store('offers', 'public');
        }

        $offer->update($data);

        return response()->json([
            'message' => 'Offer updated successfully',
            'offer' => [
                'id' => $offer->id,
                'title' => $offer->title,
                'subtitle' => $offer->subtitle,
                'description' => $offer->description,
                'image' => $offer->image_url,
                'button_text' => $offer->button_text,
                'button_link' => $offer->button_link,
                'discount_text' => $offer->discount_text,
                'start_date' => $offer->start_date,
                'end_date' => $offer->end_date,
                'is_active' => $offer->is_active,
                'sort_order' => $offer->sort_order,
            ]
        ]);
    }

    /**
     * Delete an offer
     */
    public function destroy($id)
    {
        $offer = Offer::findOrFail($id);

        if ($offer->image) {
            Storage::disk('public')->delete($offer->image);
        }

        $offer->delete();

        return response()->json(['message' => 'Offer deleted successfully']);
    }

    /**
     * Toggle offer status
     */
    public function toggleStatus($id)
    {
        $offer = Offer::findOrFail($id);
        $offer->is_active = !$offer->is_active;
        $offer->save();

        return response()->json([
            'message' => 'Offer status updated successfully',
            'is_active' => $offer->is_active
        ]);
    }
}
