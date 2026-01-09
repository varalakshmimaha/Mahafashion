<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class BannerController extends Controller
{
    /**
     * Display a listing of the banners.
     */
    public function index()
    {
        $banners = Banner::orderBy('order')->get();
        return response()->json($banners);
    }

    /**
     * Display a listing of the active banners for public use.
     */
    public function indexPublic()
    {
        $banners = Banner::where('is_active', true)->orderBy('order')->get();
        return response()->json($banners);
    }

    /**
     * Store a newly created banner in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'title' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('banners', 'public');
        }

        $banner = Banner::create([
            'image_path' => $imagePath,
            'title' => $request->title,
            'link' => $request->link,
            'order' => $request->order ?? 0,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : true,
        ]);

        return response()->json($banner, 201);
    }

    /**
     * Display the specified banner.
     */
    public function show(Banner $banner)
    {
        return response()->json($banner);
    }

    /**
     * Update the specified banner in storage.
     */
    public function update(Request $request, Banner $banner)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'title' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('image')) {
            // Delete old image if it exists
            $oldPath = $banner->getRawOriginal('image_path');
            if ($oldPath && \Illuminate\Support\Facades\Storage::disk('public')->exists($oldPath)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }

            $banner->image_path = $request->file('image')->store('banners', 'public');
        }

        $banner->title = $request->has('title') ? $request->title : $banner->title;
        $banner->link = $request->has('link') ? $request->link : $banner->link;
        $banner->order = $request->has('order') ? $request->order : $banner->order;
        if ($request->has('is_active')) {
            $banner->is_active = $request->boolean('is_active');
        }
        $banner->save();

        return response()->json($banner);
    }

    /**
     * Remove the specified banner from storage.
     */
    public function destroy(Banner $banner)
    {
        $oldPath = $banner->getRawOriginal('image_path');
        if ($oldPath && \Illuminate\Support\Facades\Storage::disk('public')->exists($oldPath)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
        }
        $banner->delete();

        return response()->json(null, 204);
    }
}

