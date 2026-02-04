<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $cartItems = Cart::with(['product.variants', 'product.images'])->where('user_id', Auth::id())->get();
        
        // Transform the collection to include formatted product data
        $cartItems = $cartItems->map(function ($item) {
            $item->product = new \App\Http\Resources\ProductResource($item->product);
            return $item;
        });
        
        return response()->json($cartItems);
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
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'selected_color' => 'nullable|string',
            'selected_size' => 'nullable|string',
            'blouse_option' => 'nullable|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $product = Product::find($request->product_id);
        
        $existingCartItem = Cart::where('user_id', Auth::id())
                                ->where('product_id', $request->product_id)
                                ->where('selected_color', $request->selected_color)
                                ->where('selected_size', $request->selected_size)
                                ->first();
        
        if ($existingCartItem) {
            $existingCartItem->quantity += $request->quantity;
            $existingCartItem->save();
            
            return response()->json([
                'cart_item' => $existingCartItem->load('product'),
                'message' => 'Cart quantity updated',
                'is_update' => true
            ], 200);
        } else {
            $cartItem = Cart::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'price' => $request->price,
                'selected_color' => $request->selected_color ?? '',
                'selected_size' => $request->selected_size ?? '',
                'blouse_option' => $request->blouse_option ?? '',
            ]);
            
            return response()->json([
                'cart_item' => $cartItem->load('product'),
                'message' => 'Product added to cart',
                'is_update' => false
            ], 201);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $cartItem = Cart::with('product')->where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // Check if product is active
        if ($cartItem->product->status !== 'active') {
            return response()->json(['error' => 'Product is not active'], 400);
        }

        // Check stock availability
        $stockAvailable = $cartItem->product->stock_quantity ?? 999;
        
        if ($request->quantity > $stockAvailable) {
            return response()->json([
                'error' => 'Not enough stock available',
                'available_stock' => $stockAvailable
            ], 400);
        }

        $cartItem->update(['quantity' => $request->quantity]);
        
        return response()->json($cartItem);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $cartItem = Cart::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $cartItem->delete();
        
        return response()->json(null, 204);
    }
    
    /**
     * Remove all items from the cart
     *
     * @return \Illuminate\Http\Response
     */
    public function clear()
    {
        Cart::where('user_id', Auth::id())->delete();
        
        return response()->json(['message' => 'Cart cleared successfully']);
    }

    /**
     * Get cart count
     *
     * @return \Illuminate\Http\Response
     */
    public function count()
    {
        $count = Cart::where('user_id', Auth::id())->sum('quantity');
        return response()->json(['count' => $count]);
    }

    /**
     * Get cart total
     *
     * @return \Illuminate\Http\Response
     */
    public function total()
    {
        $cartItems = Cart::with('product')->where('user_id', Auth::id())->get();
        $total = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });
        
        return response()->json([
            'count' => $cartItems->sum('quantity'),
            'total' => $total,
            'items' => $cartItems
        ]);
    }
}