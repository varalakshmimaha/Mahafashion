<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())->orderBy('created_at', 'desc')->get();
        
        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'shipping_address' => 'required|array',
                'shipping_address.name' => 'required|string|max:255',
                'shipping_address.email' => 'nullable|email',
                'shipping_address.street' => 'required|string|max:255',
                'shipping_address.city' => 'nullable|string|max:255',
                'shipping_address.state' => 'nullable|string|max:255',
                'shipping_address.zip' => 'required|string|max:20',
                'shipping_address.phone' => 'nullable|string|max:20',
                'payment_method' => 'required|string',
                'cart_item_ids' => 'nullable|array',
                'cart_item_ids.*' => 'nullable|integer',
                'cart_items' => 'nullable|array',
                'cart_items.*.product_id' => 'required_with:cart_items|integer|exists:products,id',
                'cart_items.*.quantity' => 'required_with:cart_items|integer|min:1',
                'cart_items.*.selected_color' => 'nullable|string',
                'cart_items.*.blouse_option' => 'nullable|string',
            ]);
            
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            
            $user = Auth::user();
            $cartItems = collect();
            $total = 0;
            
            // If user is authenticated, try to get cart items from database
            if ($user) {
                // If cart_item_ids provided, use them
                if ($request->has('cart_item_ids') && !empty($request->cart_item_ids)) {
                    $cartItems = Cart::with('product')
                                    ->where('user_id', $user->id)
                                    ->whereIn('id', $request->cart_item_ids)
                                    ->get();
                }
                
                // If no items found by IDs, get all user's cart items
                if ($cartItems->isEmpty()) {
                    $cartItems = Cart::with('product')
                                    ->where('user_id', $user->id)
                                    ->get();
                }
            }
            
            // If still no cart items and guest checkout data provided, use that
            if ($cartItems->isEmpty() && $request->has('cart_items') && !empty($request->cart_items)) {
                $tempItems = [];
                foreach ($request->cart_items as $item) {
                    $product = Product::find($item['product_id']);
                    if ($product) {
                        $tempItems[] = (object)[
                            'product' => $product,
                            'quantity' => $item['quantity'],
                            'selected_color' => $item['selected_color'] ?? null,
                            'blouse_option' => $item['blouse_option'] ?? null,
                        ];
                    }
                }
                $cartItems = collect($tempItems);
            }
            
            if ($cartItems->isEmpty()) {
                return response()->json(['message' => 'Cart is empty. Please add items to your cart before checkout.'], 400);
            }
            
            // Calculate total
            foreach ($cartItems as $item) {
                if ($item->product) {
                    $total += $item->product->price * $item->quantity;
                }
            }
            
            if ($total <= 0) {
                return response()->json(['message' => 'Invalid order total'], 400);
            }
            
            // Create order
            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'user_id' => $user->id,
                'total' => $total,
                'status' => $request->payment_method === 'cod' ? 'confirmed' : 'pending',
                'payment_method' => $request->payment_method,
                'payment_status' => $request->payment_method === 'cod' ? 'pending' : 'pending',
                'shipping_address' => $request->shipping_address,
                'billing_address' => $request->billing_address ?? $request->shipping_address,
            ]);
            
            // Create order items and update product stock
            foreach ($cartItems as $cartItem) {
                if ($cartItem->product) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $cartItem->product->id,
                        'quantity' => $cartItem->quantity,
                        'price' => $cartItem->product->price,
                        'selected_color' => $cartItem->selected_color ?? null,
                        'blouse_option' => $cartItem->blouse_option ?? null,
                    ]);
                    
                    // Update product stock
                    if ($cartItem->product->stock_quantity !== null) {
                        $cartItem->product->decrement('stock_quantity', $cartItem->quantity);
                    }
                }
            }
            
            // Clear user's cart
            if ($user) {
                Cart::where('user_id', $user->id)->delete();
            }
            
            // Load relationships for response
            $order->load('orderItems.product');
            
            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'order' => $order
            ], 201);
            
        } catch (\Exception $e) {
            \Log::error('Order creation failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $order = Order::with(['orderItems.product', 'user'])->where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        
        return response()->json($order);
    }
}