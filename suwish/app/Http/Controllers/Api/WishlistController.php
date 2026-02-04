<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        try {
            $wishlistItems = Wishlist::with('product')->where('user_id', Auth::id())->get();
            
            return response()->json($wishlistItems);
        } catch (\Exception $e) {
            \Log::error('Wishlist index error: ' . $e->getMessage());
            // Return empty array instead of failing
            return response()->json([]);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // Check if product exists and is active
        $product = Product::where('id', $request->product_id)->where('status', 'active')->firstOrFail();
        
        // Check if item already exists in wishlist for this user
        $existingWishlistItem = Wishlist::where('user_id', Auth::id())
                                        ->where('product_id', $request->product_id)
                                        ->first();
        
        if ($existingWishlistItem) {
            return response()->json(['message' => 'Product already in wishlist'], 409);
        } else {
            // Create new wishlist item
            $wishlistItem = Wishlist::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
            ]);
            
            return response()->json($wishlistItem->load('product'), 201);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $wishlistItem = Wishlist::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $wishlistItem->delete();
        
        return response()->json(['message' => 'Removed from Wishlist'], 200);
    }

    /**
     * Toggle wishlist item (add if not exists, remove if exists)
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function toggle(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $existingItem = Wishlist::where('user_id', Auth::id())
                                ->where('product_id', $request->product_id)
                                ->first();
        
        if ($existingItem) {
            $existingItem->delete();
            return response()->json([
                'action' => 'removed',
                'message' => 'Removed from Wishlist',
                'in_wishlist' => false
            ], 200);
        } else {
            // Check if product is active before adding
            $product = Product::where('id', $request->product_id)->where('status', 'active')->first();
            if (!$product) {
                return response()->json(['message' => 'Product not found or inactive'], 404);
            }

            $wishlistItem = Wishlist::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
            ]);
            
            return response()->json([
                'action' => 'added',
                'message' => 'Added to Wishlist',
                'in_wishlist' => true,
                'item' => $wishlistItem->load('product')
            ], 200);
        }
    }

    /**
     * Remove item by product_id
     *
     * @param  int  $productId
     * @return \Illuminate\Http\Response
     */
    public function removeByProduct($productId)
    {
        $wishlistItem = Wishlist::where('product_id', $productId)
                                ->where('user_id', Auth::id())
                                ->first();
        
        if ($wishlistItem) {
            $wishlistItem->delete();
            return response()->json(['message' => 'Removed from Wishlist'], 200);
        }
        
        return response()->json(['message' => 'Item not found in wishlist'], 404);
    }

    /**
     * Get wishlist count
     *
     * @return \Illuminate\Http\Response
     */
    public function count()
    {
        $count = Wishlist::where('user_id', Auth::id())->count();
        return response()->json(['count' => $count]);
    }
}