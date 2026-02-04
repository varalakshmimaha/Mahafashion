<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SocialMediaLink;
use Illuminate\Http\Request;

class SocialMediaLinkController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $links = SocialMediaLink::orderBy('sort_order')->get();
        return response()->json($links);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'platform' => 'required|string|max:255',
            'url' => 'required|url|max:255',
            'icon' => 'required|string|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $link = SocialMediaLink::create($validated);

        return response()->json([
            'message' => 'Social media link created successfully',
            'link' => $link
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SocialMediaLink  $socialMediaLink
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SocialMediaLink $socialMediaLink)
    {
        $validated = $request->validate([
            'platform' => 'sometimes|string|max:255',
            'url' => 'sometimes|url|max:255',
            'icon' => 'sometimes|string|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $socialMediaLink->update($validated);

        return response()->json([
            'message' => 'Social media link updated successfully',
            'link' => $socialMediaLink
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SocialMediaLink  $socialMediaLink
     * @return \Illuminate\Http\Response
     */
    public function destroy(SocialMediaLink $socialMediaLink)
    {
        $socialMediaLink->delete();

        return response()->json([
            'message' => 'Social media link deleted successfully'
        ]);
    }

    /**
     * Update the order of links.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateOrder(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:social_media_links,id',
            'orders.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->orders as $order) {
            SocialMediaLink::where('id', $order['id'])->update(['sort_order' => $order['sort_order']]);
        }

        return response()->json([
            'message' => 'Order updated successfully'
        ]);
    }
}
