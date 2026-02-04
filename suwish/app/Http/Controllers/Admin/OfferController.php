<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Offer;
use Illuminate\Support\Facades\Storage;

class OfferController extends Controller
{
    public function index()
    {
        $offers = Offer::orderBy('sort_order')->paginate(10);
        return view('admin.offers.index', compact('offers'));
    }

    public function create()
    {
        return view('admin.offers.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|url',
            'discount_text' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $data = $request->all();
        $data['is_active'] = $request->has('is_active') && $request->get('is_active') ? 1 : 0;

        // Handle Image Upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('offers', 'public');
            $data['image'] = $imagePath;
        }

        Offer::create($data);

        return redirect()->route('admin.offers.index')->with('success', 'Offer created successfully.');
    }

    public function show(Offer $offer)
    {
        return view('admin.offers.show', compact('offer'));
    }

    public function edit(Offer $offer)
    {
        return view('admin.offers.edit', compact('offer'));
    }

    public function update(Request $request, Offer $offer)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|url',
            'discount_text' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $data = $request->all();
        $data['is_active'] = $request->has('is_active') && $request->get('is_active') ? 1 : 0;

        // Handle Image Upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($offer->image) {
                Storage::disk('public')->delete($offer->image);
            }
            
            $imagePath = $request->file('image')->store('offers', 'public');
            $data['image'] = $imagePath;
        } elseif ($request->has('remove_image') && $request->remove_image) {
            // Remove image if requested
            if ($offer->image) {
                Storage::disk('public')->delete($offer->image);
                $data['image'] = null;
            }
        }

        $offer->update($data);

        return redirect()->route('admin.offers.index')->with('success', 'Offer updated successfully.');
    }

    public function destroy(Offer $offer)
    {
        // Delete image if exists
        if ($offer->image) {
            Storage::disk('public')->delete($offer->image);
        }

        $offer->delete();

        return redirect()->route('admin.offers.index')->with('success', 'Offer deleted successfully.');
    }

    public function toggleStatus(Offer $offer)
    {
        $offer->update(['is_active' => !$offer->is_active]);

        return response()->json(['success' => true, 'is_active' => $offer->is_active]);
    }
}