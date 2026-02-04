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
        $orders = Order::with('orderItems.product')
                       ->where('user_id', Auth::id())
                       ->orderBy('created_at', 'desc')
                       ->get();
        
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
$userId = $user ? $user->id : null;
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
            
            // Calculate subtotal (sum of item prices * quantities)
            $subtotal = 0;
            foreach ($cartItems as $item) {
                if ($item->product) {
                    $subtotal += $item->product->price * $item->quantity;
                }
            }
            
            if ($subtotal <= 0) {
                return response()->json(['message' => 'Invalid order total'], 400);
            }
            
            // Calculate discount (if any - can be extended later for coupons)
            $discount = $request->input('discount', 0);
            
            // Calculate shipping (free for orders above certain amount, or flat rate)
            $shippingThreshold = 999; // Free shipping above ₹999
            $shippingRate = 50; // ₹50 flat shipping
            $shipping = $subtotal >= $shippingThreshold ? 0 : $shippingRate;
            
            // Calculate tax (e.g., 18% GST - adjust as needed)
            $taxRate = 0.00; // 0% for now, adjust per requirements
            $tax = ($subtotal - $discount) * $taxRate;
            
            // Calculate final total
            $total = $subtotal - $discount + $shipping + $tax;
            
            // Create order with price breakdown
            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'user_id' => $userId,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'shipping' => $shipping,
                'tax' => $tax,
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

            // ✅ CRITICAL VALIDATION: Verify order items were actually saved
            $itemsSavedCount = OrderItem::where('order_id', $order->id)->count();
            if ($itemsSavedCount === 0) {
                // Rollback order if no items were saved
                $order->delete();
                \Log::error('Order creation failed: No order items were saved', [
                    'order_id' => $order->id,
                    'cart_items_count' => $cartItems->count(),
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Order creation failed: Unable to save order items. Please try again.'
                ], 500);
            }

            \Log::info('Order created successfully', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'items_count' => $itemsSavedCount,
            ]);

            // Auto-save shipping address to user profile
            if ($user && is_array($request->shipping_address)) {
                $addr = $request->shipping_address;
                $user->update([
                    'shipping_name' => $addr['name'] ?? $user->shipping_name,
                    'shipping_phone' => $addr['phone'] ?? $user->shipping_phone,
                    'shipping_address' => $addr['street'] ?? $user->shipping_address,
                    'shipping_city' => $addr['city'] ?? $user->shipping_city,
                    'shipping_state' => $addr['state'] ?? $user->shipping_state,
                    'shipping_pincode' => $addr['zip'] ?? $user->shipping_pincode,
                ]);
            }
            
            // Clear user's cart ONLY after confirming items were saved
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
        // Allow viewing order if: belongs to authenticated user OR is a guest order (user_id null) being viewed by any authenticated user
        // For production, you might want stricter guest order access (e.g., by email verification or order token)
        $order = Order::with(['orderItems.product', 'user'])
            ->where('id', $id)
            ->where(function($query) {
                $query->where('user_id', Auth::id())
                      ->orWhereNull('user_id'); // Allow viewing guest orders (temporary - should add proper authorization)
            })
            ->firstOrFail();

        // Build items array according to frontend contract
        $items = [];
        $calculatedSubtotal = 0;

        foreach ($order->orderItems as $oi) {
            $product = $oi->product;
            $productName = $product ? ($product->name ?? null) : null;
            // Prefer product accessor for main image if available
            $productImage = null;
            if ($product) {
                if (method_exists($product, 'getMainImageUrlAttribute')) {
                    $productImage = $product->main_image_url ?? null;
                }
                // fallback to image_url field
                if (!$productImage && !empty($product->image_url)) {
                    $productImage = asset('storage/' . ltrim($product->image_url, '/'));
                }
            }

            $lineTotal = (float)$oi->price * (int)$oi->quantity;
            $calculatedSubtotal += $lineTotal;

            $items[] = [
                'id' => $oi->id,
                'product_id' => $oi->product_id,
                'product_name' => $productName ?? $oi->product_name ?? null,
                'product_image' => $productImage,
                'price' => (float)$oi->price,
                'quantity' => (int)$oi->quantity,
                'selected_color' => $oi->selected_color ?? null,
                'blouse_option' => $oi->blouse_option ?? null,
            ];
        }

        // Use stored price breakdown values, fallback to calculated/defaults
        $subtotal = $order->subtotal ?? $calculatedSubtotal;
        $tax = $order->tax ?? 0;
        $shipping = $order->shipping ?? 0;
        $discount = $order->discount ?? 0;

        $total = $order->total ?? ($subtotal + $tax + $shipping - $discount);

        // Normalize existing stored status_history (could be associative or array of entries)
        $storedHistory = $order->status_history;
        $normalized = [];
        if ($storedHistory && is_array($storedHistory)) {
            $first = reset($storedHistory);
            if (is_array($first) && isset($first['status']) && isset($first['timestamp'])) {
                foreach ($storedHistory as $h) {
                    if (isset($h['status'])) {
                        $normalized[strtolower($h['status'])] = $h['timestamp'] ?? null;
                    }
                }
            } else {
                foreach ($storedHistory as $k => $v) {
                    $normalized[strtolower($k)] = $v;
                }
            }
        }

        // Canonical status flow
        $STATUS_FLOW = ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
        $statusHistory = [];
        foreach ($STATUS_FLOW as $s) {
            $statusHistory[$s] = $normalized[$s] ?? null;
        }

        // Merge any known timestamps from order model (do not guess beyond what's present)
        if ($order->created_at && !$statusHistory['placed']) {
            $statusHistory['placed'] = $order->created_at->toDateTimeString();
        }
        if ($order->shipped_at && !$statusHistory['shipped']) {
            $statusHistory['shipped'] = $order->shipped_at->toDateTimeString();
        }
        if ($order->delivered_at && !$statusHistory['delivered']) {
            $statusHistory['delivered'] = $order->delivered_at->toDateTimeString();
        }

        // ✅ COD Invoice Rules: Invoice only available after delivery
        $invoiceEnabled = class_exists('\\Dompdf\\Dompdf');
        $invoiceUrl = null;
        $currentStatus = strtolower($order->status ?? 'placed');
        $paymentMethod = strtolower($order->payment_method ?? '');
        
        // For COD orders, invoice is ONLY available after delivery
        if ($invoiceEnabled) {
            if ($paymentMethod === 'cod') {
                // COD: Invoice only if delivered
                if ($currentStatus === 'delivered') {
                    $invoiceUrl = url('/api/orders/' . $order->id . '/invoice');
                }
            } else {
                // Online payment: Invoice available once shipped or delivered
                if (in_array($currentStatus, ['shipped', 'delivered'])) {
                    $invoiceUrl = url('/api/orders/' . $order->id . '/invoice');
                }
            }
        }

        $response = [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => strtoupper($order->status ?? 'PLACED'),
            'payment_method' => $order->payment_method ?? null,
            'payment_status' => $order->payment_status ?? 'pending',
            'placed_at' => $order->created_at ? $order->created_at->toDateTimeString() : null,
            'subtotal' => $subtotal,
            'tax' => (float)$tax,
            'shipping' => (float)$shipping,
            'discount' => (float)$discount,
            'total' => $total,
            'items' => $items,
            'items_count' => count($items),
            // Keep legacy shipping_address for backward compatibility
            'address' => $order->shipping_address ?? null,
            // Provide a canonical primary_address accessor for clients
            'primary_address' => $order->primary_address ?? ($order->shipping_address ?? $order->billing_address ?? null),
            'shipping_info' => [
                'courier' => $order->tracking_number ? $order->tracking_number : null,
            ],
            'status_history' => $statusHistory,
            'cancel_reason' => $order->cancel_reason ?? null,
            'return_reason' => $order->return_reason ?? null,
            'cancelled_at' => $order->cancelled_at ? $order->cancelled_at->toDateTimeString() : null,
            'invoice_url' => $invoiceUrl,
        ];

        // Debug logging
        \Log::info("Order #{$order->id} API Response", [
            'items_count' => count($items),
            'items_array_length' => count($response['items']),
            'first_item' => $items[0] ?? null,
        ]);

        return response()->json($response);
    }

    /**
     * Download invoice PDF for the order.
     */
    public function invoice(Request $request, $id)
    {
        // Check if user is authenticated via admin session
        $adminUser = Auth::guard('admin')->user();
        
        // Check if token is provided in query parameter (for direct browser access)
        $tokenFromQuery = $request->query('token');
        
        // Check for Sanctum token in Authorization header
        $authHeader = $request->header('Authorization');
        $tokenFromHeader = null;
        if ($authHeader && preg_match('/Bearer\s+(.+)/i', $authHeader, $matches)) {
            $tokenFromHeader = $matches[1];
        }
        
        if ($adminUser) {
            // Admin can view any invoice
            $order = Order::findOrFail($id);
        } elseif ($tokenFromQuery || $tokenFromHeader) {
            // Validate token and get user
            $token = $tokenFromQuery ?: $tokenFromHeader;
            $user = \Laravel\Sanctum\PersonalAccessToken::findToken($token)?->tokenable;
            if (!$user) {
                return response()->json(['message' => 'Invalid or expired token.'], 401);
            }
            
            $query = Order::where('id', $id);
            
            // If the user is not an admin, they can only view their own invoices
            if (!$user->is_admin) {
                $query->where('user_id', $user->id);
            }
            
            $order = $query->firstOrFail();
        } else {
            // No authentication found
            return response()->json(['message' => 'Unauthenticated. Please use the download button from your order details page, or log in to the admin panel first.'], 401);
        }

        // If Dompdf is available, generate and stream PDF; otherwise return 501
        if (!class_exists('\Dompdf\Dompdf')) {
            return response()->json(['message' => 'Invoice generation not configured on server.'], 501);
        }

        try {
            // Get customer address
            $address = $order->shipping_address ?? $order->primary_address ?? [];
            $customerName = $address['name'] ?? $order->user->name ?? 'Customer';
            $customerPhone = $address['phone'] ?? $order->user->phone ?? '';
            $customerEmail = $order->user->email ?? '';
            $shippingAddress = ($address['address'] ?? '') . ', ' . 
                              ($address['city'] ?? '') . ', ' . 
                              ($address['state'] ?? '') . ' - ' . 
                              ($address['pincode'] ?? '');
            
            // Calculate pricing breakdown
            $subtotal = (float)$order->subtotal;
            $discount = (float)$order->discount;
            $shipping = (float)$order->shipping;
            $tax = (float)$order->tax;
            $total = (float)$order->total;
            
            // GST calculation (assuming 18% GST split into CGST 9% + SGST 9%)
            $cgst = $tax / 2;
            $sgst = $tax / 2;
            
            // Build HTML for invoice
            $html = '
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Tax Invoice - ' . e($order->order_number) . '</title>
                <style>
                    @page { margin: 20px; }
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; 
                        font-size: 11px; 
                        color: #333;
                        line-height: 1.4;
                    }
                    .container { width: 100%; max-width: 800px; margin: 0 auto; }
                    .header { 
                        background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%);
                        color: white; 
                        padding: 20px; 
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .header h1 { font-size: 28px; margin-bottom: 5px; letter-spacing: 2px; }
                    .header p { font-size: 10px; opacity: 0.9; }
                    .invoice-title { 
                        text-align: center; 
                        font-size: 20px; 
                        font-weight: bold; 
                        margin: 15px 0;
                        color: #8B0000;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    .info-section { 
                        display: table; 
                        width: 100%; 
                        margin-bottom: 20px;
                        border: 1px solid #ddd;
                    }
                    .info-row { display: table-row; }
                    .info-cell { 
                        display: table-cell; 
                        padding: 12px; 
                        border-bottom: 1px solid #eee;
                        vertical-align: top;
                    }
                    .info-cell:first-child { 
                        width: 50%; 
                        border-right: 1px solid #eee;
                    }
                    .info-label { 
                        font-weight: bold; 
                        color: #8B0000; 
                        margin-bottom: 8px;
                        font-size: 12px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .info-value { color: #555; line-height: 1.6; }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin: 20px 0;
                        border: 1px solid #ddd;
                    }
                    th { 
                        background: #8B0000; 
                        color: white; 
                        padding: 10px 8px; 
                        text-align: left;
                        font-size: 10px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    td { 
                        padding: 10px 8px; 
                        border-bottom: 1px solid #eee;
                    }
                    tr:last-child td { border-bottom: none; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .summary { 
                        margin-top: 20px; 
                        float: right; 
                        width: 300px;
                        border: 1px solid #ddd;
                    }
                    .summary-row { 
                        display: flex; 
                        justify-content: space-between; 
                        padding: 8px 15px;
                        border-bottom: 1px solid #eee;
                    }
                    .summary-row:last-child { border-bottom: none; }
                    .summary-label { font-weight: 500; }
                    .summary-value { font-weight: 600; }
                    .total-row { 
                        background: #f8f8f8; 
                        font-size: 14px;
                        font-weight: bold;
                        color: #8B0000;
                    }
                    .footer { 
                        clear: both; 
                        margin-top: 40px; 
                        padding-top: 20px; 
                        border-top: 2px solid #8B0000;
                        text-align: center;
                    }
                    .footer h3 { 
                        color: #8B0000; 
                        margin-bottom: 10px;
                        font-size: 14px;
                    }
                    .footer p { 
                        margin: 5px 0; 
                        font-size: 10px;
                        color: #666;
                    }
                    .policy { 
                        background: #f9f9f9; 
                        padding: 12px; 
                        margin: 15px 0;
                        border-left: 3px solid #8B0000;
                        font-size: 9px;
                        line-height: 1.5;
                    }
                    .badge { 
                        display: inline-block;
                        padding: 4px 10px;
                        background: #28a745;
                        color: white;
                        border-radius: 3px;
                        font-size: 9px;
                        font-weight: bold;
                        text-transform: uppercase;
                    }
                    .badge.cod { background: #ff9800; }
                    .badge.online { background: #2196F3; }
                </style>
            </head>
            <body>
                <div class="container">
                    <!-- Header -->
                    <div class="header">
                        <h1>MAHA FASHION</h1>
                        <p>Your Destination for Elegant Fashion & Lifestyle</p>
                    </div>
                    
                    <!-- Invoice Title -->
                    <div class="invoice-title">Tax Invoice</div>
                    
                    <!-- Invoice & Order Info -->
                    <div class="info-section">
                        <div class="info-row">
                            <div class="info-cell">
                                <div class="info-label">Invoice Details</div>
                                <div class="info-value">
                                    <strong>Invoice No:</strong> INV-' . e($order->order_number) . '<br>
                                    <strong>Order ID:</strong> ' . e($order->order_number) . '<br>
                                    <strong>Invoice Date:</strong> ' . date('d-M-Y', strtotime($order->created_at)) . '<br>
                                    <strong>Payment Method:</strong> 
                                    <span class="badge ' . (strtolower($order->payment_method) === 'cod' ? 'cod' : 'online') . '">
                                        ' . strtoupper($order->payment_method ?? 'COD') . '
                                    </span>
                                </div>
                            </div>
                            <div class="info-cell">
                                <div class="info-label">Seller Details</div>
                                <div class="info-value">
                                    <strong>Maha Fashion</strong><br>
                                    123, Fashion Street, MG Road<br>
                                    Bangalore, Karnataka - 560001<br>
                                    <strong>Phone:</strong> +91 80 1234 5678<br>
                                    <strong>Email:</strong> support@mahafashion.com<br>
                                    <strong>GSTIN:</strong> 29XXXXX1234X1ZX
                                </div>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-cell" colspan="2" style="display: table-cell; width: 100%;">
                                <div class="info-label">Customer & Shipping Details</div>
                                <div class="info-value">
                                    <strong>Name:</strong> ' . e($customerName) . '<br>
                                    <strong>Address:</strong> ' . e($shippingAddress) . '<br>
                                    <strong>Phone:</strong> ' . e($customerPhone) . '<br>
                                    <strong>Email:</strong> ' . e($customerEmail) . '
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Order Items Table -->
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 5%;">#</th>
                                <th style="width: 35%;">Product Details</th>
                                <th style="width: 10%;" class="text-center">Qty</th>
                                <th style="width: 12%;" class="text-right">MRP</th>
                                <th style="width: 10%;" class="text-center">Disc %</th>
                                <th style="width: 14%;" class="text-right">Price</th>
                                <th style="width: 14%;" class="text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>';
            
            $itemNumber = 1;
            foreach ($order->orderItems as $item) {
                $productName = $item->product ? $item->product->name : 'Product';
                $variant = $item->variant_details ?? [];
                $color = $variant['color'] ?? '';
                $size = $variant['size'] ?? '';
                $variantText = '';
                if ($color || $size) {
                    $variantText = '<br><small style="color: #888;">Color: ' . e($color) . ($size ? ' | Size: ' . e($size) : '') . '</small>';
                }
                
                $mrp = (float)($item->mrp ?? $item->price);
                $price = (float)$item->price;
                $quantity = (int)$item->quantity;
                $discountPercent = $mrp > 0 ? round((($mrp - $price) / $mrp) * 100) : 0;
                $itemTotal = $price * $quantity;
                
                $html .= '
                            <tr>
                                <td class="text-center">' . $itemNumber . '</td>
                                <td><strong>' . e($productName) . '</strong>' . $variantText . '</td>
                                <td class="text-center">' . $quantity . '</td>
                                <td class="text-right">₹' . number_format($mrp, 2) . '</td>
                                <td class="text-center">' . $discountPercent . '%</td>
                                <td class="text-right">₹' . number_format($price, 2) . '</td>
                                <td class="text-right"><strong>₹' . number_format($itemTotal, 2) . '</strong></td>
                            </tr>';
                $itemNumber++;
            }
            
            $html .= '
                        </tbody>
                    </table>
                    
                    <!-- Pricing Summary -->
                    <div class="summary">
                        <div class="summary-row">
                            <span class="summary-label">Subtotal:</span>
                            <span class="summary-value">₹' . number_format($subtotal, 2) . '</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Discount:</span>
                            <span class="summary-value" style="color: #28a745;">- ₹' . number_format($discount, 2) . '</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">CGST (9%):</span>
                            <span class="summary-value">₹' . number_format($cgst, 2) . '</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">SGST (9%):</span>
                            <span class="summary-value">₹' . number_format($sgst, 2) . '</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Shipping Charges:</span>
                            <span class="summary-value">₹' . number_format($shipping, 2) . '</span>
                        </div>
                        <div class="summary-row total-row">
                            <span class="summary-label">Total Payable:</span>
                            <span class="summary-value">₹' . number_format($total, 2) . '</span>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="footer">
                        <h3>Thank You for Shopping with Maha Fashion!</h3>
                        <p>We appreciate your business and hope you love your purchase.</p>
                        
                        <div class="policy">
                            <strong>Return & Exchange Policy:</strong> Items can be returned or exchanged within 7 days of delivery. 
                            Products must be unused, unwashed, and in original packaging with tags intact. 
                            For assistance, contact our customer support.
                        </div>
                        
                        <p><strong>Customer Support:</strong> +91 80 1234 5678 | support@mahafashion.com</p>
                        <p><strong>Website:</strong> www.mahafashion.com</p>
                        <p style="margin-top: 10px; font-size: 9px; color: #999;">
                            This is a computer-generated invoice and does not require a signature.
                        </p>
                    </div>
                </div>
            </body>
            </html>';

            $dompdf = new \Dompdf\Dompdf();
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            $pdfOutput = $dompdf->output();

            return response($pdfOutput, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="invoice-' . $order->order_number . '.pdf"',
            ]);
        } catch (\Exception $e) {
            \Log::error('Invoice generation failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to generate invoice'], 500);
        }
    }

    /**
     * Cancel an order if allowed.
     */
    public function cancel($id)
    {
        $order = Order::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        if (in_array($order->status, ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'])) {
            return response()->json(['message' => 'Order cannot be cancelled at this stage'], 400);
        }

        $order->status = 'CANCELLED';
        $order->cancelled_at = now();

        // optional reason from client
        $order->cancel_reason = request()->input('reason') ?? $order->cancel_reason ?? null;

        // Normalize existing history into associative map and keep only entries up to the current status
        $stored = $order->status_history;
        $normalized = [];
        if ($stored && is_array($stored)) {
            $first = reset($stored);
            if (is_array($first) && isset($first['status']) && isset($first['timestamp'])) {
                foreach ($stored as $h) {
                    if (isset($h['status'])) {
                        $normalized[strtolower($h['status'])] = $h['timestamp'] ?? null;
                    }
                }
            } else {
                foreach ($stored as $k => $v) {
                    $normalized[strtolower($k)] = $v;
                }
            }
        }

        // Canonical flow
        $STATUS_FLOW = ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
        $newHistory = [];
        foreach ($STATUS_FLOW as $s) {
            if (isset($normalized[$s])) {
                $newHistory[$s] = $normalized[$s];
            }
        }

        // Save as associative mapping (JSON)
        $order->status_history = $newHistory;

        $order->save();

        return response()->json([
            'id' => $order->id,
            'status' => strtoupper($order->status),
            'status_history' => $order->status_history,
            'cancel_reason' => $order->cancel_reason,
            'cancelled_at' => $order->cancelled_at ? $order->cancelled_at->toDateTimeString() : null,
        ]);
    }

    /**
     * Build a simple status history array from known timestamp fields.
     */
    protected function buildStatusHistory(Order $order)
    {
        $history = [];

        if ($order->created_at) {
            $history[] = ['status' => 'PLACED', 'timestamp' => $order->created_at->toDateTimeString()];
        }
        if (!empty($order->status) && strtoupper($order->status) === 'CONFIRMED' && $order->created_at) {
            // If the app uses a confirmed stage, include it only if status indicates
            $history[] = ['status' => 'CONFIRMED', 'timestamp' => $order->created_at->toDateTimeString()];
        }
        if ($order->shipped_at) {
            $history[] = ['status' => 'SHIPPED', 'timestamp' => $order->shipped_at->toDateTimeString()];
        }
        if ($order->delivered_at) {
            $history[] = ['status' => 'DELIVERED', 'timestamp' => $order->delivered_at->toDateTimeString()];
        }
        if ($order->cancelled_at) {
            $history[] = ['status' => 'CANCELLED', 'timestamp' => $order->cancelled_at->toDateTimeString()];
        }

        return $history;
    }

    /**
     * Initiate a return on a delivered order.
     */
    public function returnOrder(Request $request, $id)
    {
        $order = Order::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        if (strtoupper($order->status) !== 'DELIVERED') {
            return response()->json(['message' => 'Return can only be initiated after delivery'], 400);
        }

        $order->status = 'RETURN_REQUESTED';
        $order->return_reason = $request->input('reason');
        $order->save();

        return response()->json($order);
    }

    /**
     * Track an order by order number (public)
     */
    public function track($orderNumber)
    {
        $order = Order::with(['orderItems.product', 'user'])
                    ->where('order_number', $orderNumber)
                    ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json($order);
    }

    /**
     * Admin: list all orders with pagination and filters
     */
    public function adminIndex(Request $request)
    {
        $query = Order::with(['user', 'orderItems.product'])->orderBy('created_at', 'desc');

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }
        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->input('payment_status'));
        }

        $perPage = intval($request->input('per_page', 20));
        $orders = $query->paginate($perPage);

        // Ensure each order in the paginated result includes a canonical `primary_address`
        $collection = $orders->getCollection()->transform(function ($order) {
            $data = $order->toArray();
            $data['primary_address'] = $order->primary_address ?? ($order->shipping_address ?? $order->billing_address ?? null);
            return $data;
        });
        $orders->setCollection($collection);

        return response()->json($orders);
    }

    /**
     * Admin: show order by id
     */
    public function adminShow($id)
    {
        $order = Order::with(['orderItems.product', 'user'])->findOrFail($id);

        $data = $order->toArray();
        $data['primary_address'] = $order->primary_address ?? ($order->shipping_address ?? $order->billing_address ?? null);

        return response()->json($data);
    }

    /**
     * Admin: update order general fields
     */
    public function adminUpdate(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $data = $request->only(['shipping_address', 'billing_address', 'notes']);
        foreach ($data as $k => $v) {
            if ($v !== null) $order->{$k} = $v;
        }
        $order->save();

        return response()->json(['success' => true, 'order' => $order]);
    }

    /**
     * Admin: update order status (with history normalization)
     */
    public function adminUpdateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $newStatus = strtoupper(trim($request->input('status')));

        $flow = ['PLACED','CONFIRMED','PACKED','SHIPPED','OUT_FOR_DELIVERY','DELIVERED'];
        $terminal = ['CANCELLED','RETURNED','DELIVERED'];
        $allowed = array_merge($flow, $terminal);

        if (!in_array($newStatus, $allowed)) {
            return response()->json(['message' => 'Invalid status'], 422);
        }

        $currentStatus = strtoupper($order->status ?? 'PLACED');

        // if current is terminal, block changes
        if (in_array($currentStatus, $terminal)) {
            return response()->json(['message' => 'Cannot change status once order is ' . strtolower($currentStatus)], 422);
        }

        // If updating to CANCELLED or RETURNED, allow only if not yet DELIVERED
        if (in_array($newStatus, ['CANCELLED','RETURNED']) && $currentStatus === 'DELIVERED') {
            return response()->json(['message' => 'Cannot cancel/return an already delivered order'], 422);
        }

        // Enforce canonical flow: prevent skipping forward or moving backwards
        $currentIndex = array_search($currentStatus, $flow);
        $newIndex = array_search($newStatus, $flow);

        if ($newIndex !== false && $currentIndex !== false) {
            if ($newIndex < $currentIndex) {
                return response()->json(['message' => 'Cannot move order status backwards'], 422);
            }
            if ($newIndex > $currentIndex + 1) {
                return response()->json(['message' => 'Cannot skip statuses in canonical flow'], 422);
            }
        }

        // Append timestamp to status_history map
        $history = $order->status_history ?? [];
        if (!is_array($history)) $history = [];
        $history[strtolower($newStatus)] = now()->toDateTimeString();
        $order->status_history = $history;

        // Update timestamps for common fields
        if ($newStatus === 'SHIPPED') $order->shipped_at = now();
        if ($newStatus === 'DELIVERED') $order->delivered_at = now();
        if ($newStatus === 'CANCELLED') $order->cancelled_at = now();

        $order->status = $newStatus;
        $order->save();

        // Broadcast order update for frontend listeners
        try {
            event(new \App\Events\OrderUpdated($order, 'status'));
        } catch (\Throwable $e) {
            // Don't block the response on broadcasting errors
            \Log::warning('OrderUpdated broadcast failed: ' . $e->getMessage());
        }

        return response()->json(['success' => true, 'order' => $order]);
    }

    /**
     * Admin: update payment status
     */
    public function adminUpdatePaymentStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $newPaymentStatus = strtolower($request->input('payment_status'));
        $allowed = ['pending','paid','failed','refunded'];
        if (!in_array($newPaymentStatus, $allowed)) {
            return response()->json(['message' => 'Invalid payment status'], 422);
        }

        $order->payment_status = $newPaymentStatus;
        $order->save();

        // Update overall order status if necessary (e.g., mark confirmed when paid)
        if ($newPaymentStatus === 'paid' && strtoupper($order->status) === 'PENDING') {
            $order->status = 'CONFIRMED';
            $order->save();
        }

        // Broadcast payment update
        try {
            event(new \App\Events\OrderUpdated($order, 'payment'));
        } catch (\Throwable $e) {
            \Log::warning('Order payment broadcast failed: ' . $e->getMessage());
        }

        return response()->json(['success' => true, 'order' => $order]);
    }

    /**
     * Admin: delete order
     */
    public function adminDestroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        return response()->json(['success' => true]);
    }
}