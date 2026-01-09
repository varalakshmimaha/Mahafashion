<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\RazorpayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    protected $razorpayService;

    public function __construct(RazorpayService $razorpayService)
    {
        $this->razorpayService = $razorpayService;
    }

    /**
     * Display the checkout page with Razorpay payment button
     */
    public function showCheckout()
    {
        // Get user's cart items to calculate total
        $cartItems = [];
        $totalAmount = 0;

        if (Auth::check()) {
            $cartItems = Cart::where('user_id', Auth::id())->with('product')->get();
            $totalAmount = $cartItems->sum(function ($item) {
                return $item->quantity * $item->product->price;
            });
        }

        return view('checkout', compact('cartItems', 'totalAmount'));
    }

    /**
     * Create a new order in Razorpay
     */
    public function createOrder(Request $request)
    {
        try {
            $request->validate([
                'amount' => 'required|numeric|min:1',
                'currency' => 'sometimes|string|size:3',
            ]);

            $amount = $request->amount;
            $currency = $request->currency ?? 'INR';
            $shippingAddress = $request->shipping_address;

            // Create order in Razorpay
            $razorpayOrder = $this->razorpayService->createOrder($amount, $currency);

            // Get cart items to create order items
            $cartItems = Cart::with('product')->where('user_id', Auth::id())->get();

            if ($cartItems->isEmpty()) {
                 return response()->json(['success' => false, 'message' => 'Cart is empty'], 400);
            }

            // Store order details in your database
            $order = Order::create([
                'user_id' => Auth::id(),
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'razorpay_order_id' => $razorpayOrder['id'],
                'total' => $amount,
                'sub_total' => $amount, // Simplified
                'currency' => $currency,
                'status' => 'created',
                'payment_method' => 'razorpay',
                'payment_status' => 'pending',
                'shipping_address' => $shippingAddress,
            ]);

            // Create order items
            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->price,
                    'selected_color' => $cartItem->selected_color,
                    'blouse_option' => $cartItem->blouse_option,
                ]);
            }

            return response()->json([
                'success' => true,
                'razorpay_order_id' => $razorpayOrder['id'],
                'amount' => $razorpayOrder['amount'],
                'currency' => $razorpayOrder['currency'],
                'order_id' => $order->id,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify payment and update order status
     */
    public function verifyPayment(Request $request)
    {
        try {
            $request->validate([
                'razorpay_payment_id' => 'required|string',
                'razorpay_order_id' => 'required|string',
                'razorpay_signature' => 'required|string',
            ]);

            $paymentId = $request->razorpay_payment_id;
            $orderId = $request->razorpay_order_id;
            $signature = $request->razorpay_signature;

            // Verify the payment signature
            $isValid = $this->razorpayService->verifyPaymentSignature($paymentId, $orderId, $signature);

            if (!$isValid) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment verification failed. Invalid signature.'
                ], 400);
            }

            // Find the order in your database
            $order = Order::where('razorpay_order_id', $orderId)->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found.'
                ], 404);
            }

            // Get payment details from Razorpay
            $paymentDetails = $this->razorpayService->getPayment($paymentId);

            // Update order status
            $order->update([
                'razorpay_payment_id' => $paymentId,
                'razorpay_signature' => $signature,
                'payment_status' => $paymentDetails['status'],
                'status' => $paymentDetails['status'] === 'captured' ? 'paid' : $paymentDetails['status'],
            ]);

            // If payment is successful, process the order (update stock, etc.)
            if ($paymentDetails['status'] === 'captured') {
                $this->processSuccessfulOrder($order);
            }

            return response()->json([
                'success' => true,
                'message' => 'Payment verified successfully.',
                'order_id' => $order->id,
                'payment_status' => $order->status,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process successful order (update stock, clear cart, etc.)
     */
    private function processSuccessfulOrder($order)
    {
        // Decrement stock for each item in the order
        foreach ($order->orderItems as $item) {
            if ($item->product) {
                $item->product->decrement('stock_quantity', $item->quantity);
            }
        }

        // Clear the user's cart
        Cart::where('user_id', $order->user_id)->delete();
    }

    /**
     * Show payment success page
     */
    public function paymentSuccess($orderId)
    {
        $order = Order::find($orderId);

        if (!$order || $order->user_id !== Auth::id()) {
            return redirect()->route('home')->with('error', 'Order not found.');
        }

        return view('payment-success', compact('order'));
    }

    /**
     * Show payment failure page
     */
    public function paymentFailure($orderId)
    {
        $order = Order::find($orderId);

        if (!$order || $order->user_id !== Auth::id()) {
            return redirect()->route('home')->with('error', 'Order not found.');
        }

        return view('payment-failure', compact('order'));
    }
}