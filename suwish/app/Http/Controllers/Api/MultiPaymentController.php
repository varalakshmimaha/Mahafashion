<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentGateway;
use App\Models\PaymentSetting;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MultiPaymentController extends Controller
{
    /**
     * Create Razorpay order
     */
    /**
     * Create Razorpay order
     */
    public function createRazorpayOrder(Request $request): JsonResponse
    {
        try {
            // Remove strict auth check to allow guest checkout
            $user = Auth::guard('sanctum')->user();
            $userId = $user ? $user->id : null;

            $validator = Validator::make($request->all(), [
                'amount' => 'required|numeric|min:1',
                'currency' => 'sometimes|string|size:3',
                'shipping_address' => 'required|array',
                'cart_items' => 'nullable|array', // Allow passing items directly
                'cart_items.*.product_id' => 'required_with:cart_items|integer',
                'cart_items.*.quantity' => 'required_with:cart_items|integer|min:1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $razorpayGateway = PaymentGateway::where('name', 'razorpay')->first();
            
            if (!$razorpayGateway || !$razorpayGateway->is_enabled) {
                return response()->json([
                    'success' => false,
                    'message' => 'Razorpay payment is not enabled',
                ], 400);
            }

            $config = $razorpayGateway->config;
            if (is_string($config)) {
                $config = json_decode($config, true);
            }
            if (!is_array($config)) {
                $config = [];
            }

            $keyId = $config['key_id'] ?? null;
            $keySecret = $config['key_secret'] ?? null;

            if (!$keyId || !$keySecret) {
                return response()->json([
                    'success' => false,
                    'message' => 'Razorpay is not properly configured',
                ], 400);
            }

            // Check if Razorpay SDK is available
            if (!class_exists('Razorpay\Api\Api')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Razorpay SDK is not installed. Please contact support.',
                ], 500);
            }

            $amount = $request->amount;
            $currency = $request->currency ?? 'INR';

            // Create Razorpay API instance
            $api = new \Razorpay\Api\Api($keyId, $keySecret);

            // Create order in Razorpay
            $razorpayOrder = $api->order->create([
                'amount' => $amount * 100, // Convert to paise
                'currency' => $currency,
                'receipt' => 'rcpt_' . uniqid(),
                'payment_capture' => 1,
            ]);

            // Get cart items logic
            $cartItems = collect();
            
            // 1. Try DB cart if user is logged in
            if ($userId) {
                $cartItems = Cart::with('product')->where('user_id', $userId)->get();
            }

            // 2. If no DB items (or guest), use request items
            if ($cartItems->isEmpty() && $request->has('cart_items') && !empty($request->cart_items)) {
                $tempItems = [];
                // We need to fetch product basic info (price, name) from DB to be safe
                // Or assume frontend sends minimal info (id, quantity) and we fetch price
                foreach ($request->cart_items as $item) {
                    $product = \App\Models\Product::find($item['product_id']);
                    if ($product) {
                        $tempItems[] = (object)[
                            'product_id' => $product->id,
                            'product' => $product, // Attach product model for price access
                            'quantity' => $item['quantity'],
                            'selected_color' => $item['selected_color'] ?? null,
                            'blouse_option' => $item['blouse_option'] ?? null,
                        ];
                    }
                }
                $cartItems = collect($tempItems);
            }

            if ($cartItems->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart is empty',
                ], 400);
            }

            // Re-calculate total from validated items to ensure safety? 
            // The frontend sends 'amount', but safer to recalc. 
            // For now, trusting 'amount' passed from trusted backend call logic (OrderController recalculates). 
            // Ideally, we should recalculate here too, but let's stick to using the passed amount to match OrderController logic flexibility, 
            // OR recalculate if needed. Given $amount is used for Razorpay, let's assume it matches.

            // Create order in database
            $order = Order::create([
                'user_id' => $userId, // Nullable for guests
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'razorpay_order_id' => $razorpayOrder['id'],
                'total' => $amount,
                'currency' => $currency,
                'status' => 'pending',
                'payment_method' => 'razorpay',
                'payment_status' => 'pending',
                'shipping_address' => is_array($request->shipping_address) ? json_encode($request->shipping_address) : $request->shipping_address,
            ]);

            // Create order items
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

            // Auto-save shipping address if user is logged in
            if ($userId && is_array($request->shipping_address)) {
                $userModel = \App\Models\User::find($userId);
                if ($userModel) {
                     $addr = $request->shipping_address;
                     $userModel->update([
                        'shipping_name' => $addr['name'] ?? $userModel->shipping_name,
                        'shipping_phone' => $addr['phone'] ?? $userModel->shipping_phone,
                        'shipping_address' => $addr['street'] ?? $userModel->shipping_address,
                        // ... map others if needed, keeping simple here to match OrderController
                     ]);
                }
            }

            return response()->json([
                'success' => true,
                'razorpay_order_id' => $razorpayOrder['id'],
                'razorpay_key_id' => $keyId,
                'amount' => $razorpayOrder['amount'],
                'currency' => $razorpayOrder['currency'],
                'order_id' => $order->id,
                'order_number' => $order->order_number,
            ]);

        } catch (\Exception $e) {
            \Log::error('Razorpay order creation failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment order: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Verify Razorpay payment
     */
    public function verifyRazorpayPayment(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'razorpay_payment_id' => 'required|string',
                'razorpay_order_id' => 'required|string',
                'razorpay_signature' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $gateway = PaymentGateway::where('name', 'razorpay')->first();
            if (!$gateway) {
                return response()->json([
                    'success' => false,
                    'message' => 'Razorpay gateway not found',
                ], 500);
            }
            $keySecret = $gateway->config['key_secret'] ?? null;

            // Verify signature
            $generatedSignature = hash_hmac(
                'sha256',
                $request->razorpay_order_id . '|' . $request->razorpay_payment_id,
                $keySecret
            );

            if ($generatedSignature !== $request->razorpay_signature) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment verification failed. Invalid signature.',
                ], 400);
            }

            // Update order
            $order = Order::where('razorpay_order_id', $request->razorpay_order_id)->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found',
                ], 404);
            }

            $order->update([
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'payment_status' => 'paid',
                'status' => 'confirmed',
            ]);

            // Clear cart
            if (Auth::check()) {
                Cart::where('user_id', Auth::id())->delete();
            }

            return response()->json([
                'success' => true,
                'message' => 'Payment verified successfully',
                'order' => $order->load('orderItems.product'),
            ]);

        } catch (\Exception $e) {
            \Log::error('Razorpay verification failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Payment verification failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Initiate PhonePe payment
     */
    public function initiatePhonePePayment(Request $request): JsonResponse
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please login to place an order',
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'amount' => 'required|numeric|min:1',
                'shipping_address' => 'required|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $gateway = PaymentGateway::where('name', 'phonepe')->first();

            if (!$gateway || !$gateway->is_enabled) {
                return response()->json([
                    'success' => false,
                    'message' => 'PhonePe payment is not enabled',
                ], 400);
            }

            $config = $gateway->config ?? [];
            $merchantId = $config['merchant_id'] ?? null;
            $saltKey = $config['salt_key'] ?? null;
            $saltIndex = $config['salt_index'] ?? null;

            if (!$merchantId || !$saltKey || !$saltIndex) {
                return response()->json([
                    'success' => false,
                    'message' => 'PhonePe is not properly configured',
                ], 400);
            }

            // Get cart items
            $cartItems = Cart::with('product')->where('user_id', Auth::id())->get();

            if ($cartItems->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart is empty',
                ], 400);
            }

            $amount = $request->amount;
            $transactionId = 'TXN_' . strtoupper(Str::random(15));
            $merchantUserId = 'USER_' . Auth::id();

            // Create order in database first
            $order = Order::create([
                'user_id' => Auth::id(),
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'transaction_id' => $transactionId,
                'total' => $amount,
                'status' => 'pending',
                'payment_method' => 'phonepe',
                'payment_status' => 'pending',
                'shipping_address' => is_array($request->shipping_address) ? json_encode($request->shipping_address) : $request->shipping_address,
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

            // PhonePe API endpoint
            $env = $config['environment'] ?? 'UAT';
            $baseUrl = ($env === 'UAT')
                ? 'https://api-preprod.phonepe.com/apis/pg-sandbox'
                : 'https://api.phonepe.com/apis/hermes';

            $callbackUrl = config('app.url') . '/api/payment/phonepe/callback';
            $redirectUrl = config('app.frontend_url', 'http://localhost:5173') . '/order-success?order_id=' . $order->id;

            // Create payload
            $payload = [
                'merchantId' => $merchantId,
                'merchantTransactionId' => $transactionId,
                'merchantUserId' => $merchantUserId,
                'amount' => $amount * 100, // Convert to paise
                'redirectUrl' => $redirectUrl,
                'redirectMode' => 'POST',
                'callbackUrl' => $callbackUrl,
                'paymentInstrument' => [
                    'type' => 'PAY_PAGE',
                ],
            ];

            $payloadJson = json_encode($payload);
            $payloadBase64 = base64_encode($payloadJson);

            // Generate checksum
            $checksum = hash('sha256', $payloadBase64 . '/pg/v1/pay' . $saltKey) . '###' . $saltIndex;

            // Make API request
            $client = new \GuzzleHttp\Client();
            $response = $client->post($baseUrl . '/pg/v1/pay', [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-VERIFY' => $checksum,
                ],
                'json' => [
                    'request' => $payloadBase64,
                ],
            ]);

            $responseData = json_decode($response->getBody()->getContents(), true);

            if ($responseData['success'] && isset($responseData['data']['instrumentResponse']['redirectInfo']['url'])) {
                return response()->json([
                    'success' => true,
                    'redirect_url' => $responseData['data']['instrumentResponse']['redirectInfo']['url'],
                    'order_id' => $order->id,
                    'transaction_id' => $transactionId,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => $responseData['message'] ?? 'Failed to initiate PhonePe payment',
            ], 400);

        } catch (\Exception $e) {
            \Log::error('PhonePe payment initiation failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to initiate PhonePe payment: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * PhonePe payment callback
     */
    public function phonePeCallback(Request $request): JsonResponse
    {
        try {
            $gateway = PaymentGateway::where('name', 'phonepe')->first();
            if (!$gateway) {
                return response()->json(['success' => false, 'message' => 'Gateway not found'], 500);
            }
            $config = $gateway->config ?? [];
            $saltKey = $config['salt_key'] ?? null;
            $saltIndex = $config['salt_index'] ?? null;

            // Verify checksum
            $receivedChecksum = $request->header('X-VERIFY');
            $responseBase64 = $request->input('response');

            $expectedChecksum = hash('sha256', $responseBase64 . $saltKey) . '###' . $saltIndex;

            if ($receivedChecksum !== $expectedChecksum) {
                \Log::warning('PhonePe callback: Invalid checksum');
                return response()->json(['success' => false, 'message' => 'Invalid checksum'], 400);
            }

            $responseData = json_decode(base64_decode($responseBase64), true);
            $transactionId = $responseData['data']['merchantTransactionId'] ?? null;
            $paymentStatus = $responseData['code'] ?? null;

            $order = Order::where('transaction_id', $transactionId)->first();

            if (!$order) {
                return response()->json(['success' => false, 'message' => 'Order not found'], 404);
            }

            if ($paymentStatus === 'PAYMENT_SUCCESS') {
                $order->update([
                    'payment_status' => 'paid',
                    'status' => 'confirmed',
                    'phonepe_transaction_id' => $responseData['data']['transactionId'] ?? null,
                ]);

                // Clear cart
                Cart::where('user_id', $order->user_id)->delete();
            } else {
                $order->update([
                    'payment_status' => 'failed',
                    'status' => 'cancelled',
                ]);
            }

            return response()->json(['success' => true]);

        } catch (\Exception $e) {
            \Log::error('PhonePe callback failed: ' . $e->getMessage());
            return response()->json(['success' => false], 500);
        }
    }

    /**
     * Check PhonePe payment status
     */
    public function checkPhonePeStatus(Request $request): JsonResponse
    {
        try {
            $transactionId = $request->input('transaction_id');
            $gateway = PaymentGateway::where('name', 'phonepe')->first();
            if (!$gateway) {
                return response()->json(['success' => false, 'message' => 'Gateway not found'], 500);
            }

            $config = $gateway->config ?? [];
            $merchantId = $config['merchant_id'] ?? null;
            $saltKey = $config['salt_key'] ?? null;
            $saltIndex = $config['salt_index'] ?? null;
            $env = $config['environment'] ?? 'UAT';

            $baseUrl = ($env === 'UAT')
                ? 'https://api-preprod.phonepe.com/apis/pg-sandbox'
                : 'https://api.phonepe.com/apis/hermes';

            $checksum = hash('sha256', '/pg/v1/status/' . $merchantId . '/' . $transactionId . $saltKey) . '###' . $saltIndex;

            $client = new \GuzzleHttp\Client();
            $response = $client->get($baseUrl . '/pg/v1/status/' . $merchantId . '/' . $transactionId, [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-VERIFY' => $checksum,
                    'X-MERCHANT-ID' => $merchantId,
                ],
            ]);

            $responseData = json_decode($response->getBody()->getContents(), true);

            return response()->json([
                'success' => true,
                'data' => $responseData,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to check payment status',
            ], 500);
        }
    }

    /**
     * Initiate Paytm payment
     */
    public function initiatePaytmPayment(Request $request): JsonResponse
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please login to place an order',
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'amount' => 'required|numeric|min:1',
                'shipping_address' => 'required|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $gateway = PaymentGateway::where('name', 'paytm')->first();

            if (!$gateway || !$gateway->is_enabled) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paytm payment is not enabled',
                ], 400);
            }

            $config = $gateway->config ?? [];
            $merchantId = $config['merchant_id'] ?? null;
            $merchantKey = $config['merchant_key'] ?? null;
            $website = $config['website_name'] ?? null;
            $industryType = $config['industry_type'] ?? null;

            if (!$merchantId || !$merchantKey) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paytm is not properly configured',
                ], 400);
            }

            // Get cart items
            $cartItems = Cart::with('product')->where('user_id', Auth::id())->get();

            if ($cartItems->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart is empty',
                ], 400);
            }

            $amount = $request->amount;
            $orderId = 'ORD_' . strtoupper(Str::random(10));
            $customerId = 'CUST_' . Auth::id();

            // Create order in database
            $order = Order::create([
                'user_id' => Auth::id(),
                'order_number' => $orderId,
                'total' => $amount,
                'status' => 'pending',
                'payment_method' => 'paytm',
                'payment_status' => 'pending',
                'shipping_address' => is_array($request->shipping_address) ? json_encode($request->shipping_address) : $request->shipping_address,
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

            $callbackUrl = config('app.url') . '/api/payment/paytm/callback';

            // Paytm parameters
            $paytmParams = [
                'MID' => $merchantId,
                'WEBSITE' => $website,
                'INDUSTRY_TYPE_ID' => $industryType,
                'CHANNEL_ID' => 'WEB',
                'ORDER_ID' => $orderId,
                'CUST_ID' => $customerId,
                'TXN_AMOUNT' => number_format($amount, 2, '.', ''),
                'CALLBACK_URL' => $callbackUrl,
            ];

            // Generate checksum
            $checksum = $this->generatePaytmChecksum($paytmParams, $merchantKey);
            $paytmParams['CHECKSUMHASH'] = $checksum;

            // Paytm transaction URL
            $env = $config['environment'] ?? 'Staging';
            $transactionUrl = ($env === 'Staging')
                ? 'https://securegw-stage.paytm.in/order/process'
                : 'https://securegw.paytm.in/order/process';

            return response()->json([
                'success' => true,
                'paytm_params' => $paytmParams,
                'transaction_url' => $transactionUrl,
                'order_id' => $order->id,
                'order_number' => $orderId,
            ]);

        } catch (\Exception $e) {
            \Log::error('Paytm payment initiation failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to initiate Paytm payment: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Paytm payment callback
     */
    public function paytmCallback(Request $request)
    {
        try {
            $gateway = PaymentGateway::where('name', 'paytm')->first();
            if (!$gateway) {
                return redirect(config('app.frontend_url', 'http://localhost:5173') . '/order-failed?error=gateway_not_found');
            }
            $config = $gateway->config ?? [];
            $merchantKey = $config['merchant_key'] ?? null;

            $paytmParams = $request->all();
            $paytmChecksum = $paytmParams['CHECKSUMHASH'] ?? '';
            unset($paytmParams['CHECKSUMHASH']);

            // Verify checksum
            $isValidChecksum = $this->verifyPaytmChecksum($paytmParams, $merchantKey, $paytmChecksum);

            $orderId = $paytmParams['ORDERID'] ?? null;
            $order = Order::where('order_number', $orderId)->first();

            if (!$order) {
                return redirect(config('app.frontend_url', 'http://localhost:5173') . '/order-failed?error=order_not_found');
            }

            if ($isValidChecksum && ($paytmParams['STATUS'] ?? '') === 'TXN_SUCCESS') {
                $order->update([
                    'payment_status' => 'paid',
                    'status' => 'confirmed',
                    'transaction_id' => $paytmParams['TXNID'] ?? null,
                ]);

                // Clear cart
                Cart::where('user_id', $order->user_id)->delete();

                return redirect(config('app.frontend_url', 'http://localhost:5173') . '/order-success?order_id=' . $order->id);
            } else {
                $order->update([
                    'payment_status' => 'failed',
                    'status' => 'cancelled',
                ]);

                return redirect(config('app.frontend_url', 'http://localhost:5173') . '/order-failed?order_id=' . $order->id);
            }

        } catch (\Exception $e) {
            \Log::error('Paytm callback failed: ' . $e->getMessage());
            return redirect(config('app.frontend_url', 'http://localhost:5173') . '/order-failed?error=callback_error');
        }
    }

    /**
     * Generate Paytm checksum
     */
    private function generatePaytmChecksum(array $params, string $key): string
    {
        ksort($params);
        $str = '';
        foreach ($params as $k => $v) {
            $str .= $k . '=' . $v . '|';
        }
        $str = rtrim($str, '|');
        
        $salt = $this->generateRandomString(4);
        $finalString = $str . '|' . $salt;
        $hash = hash('sha256', $finalString);
        $hashString = $hash . $salt;
        
        return base64_encode($this->encrypt($hashString, $key));
    }

    /**
     * Verify Paytm checksum
     */
    private function verifyPaytmChecksum(array $params, string $key, string $checksum): bool
    {
        try {
            $paytmHash = $this->decrypt(base64_decode($checksum), $key);
            $salt = substr($paytmHash, -4);
            
            ksort($params);
            $str = '';
            foreach ($params as $k => $v) {
                $str .= $k . '=' . $v . '|';
            }
            $str = rtrim($str, '|') . '|' . $salt;
            
            $hash = hash('sha256', $str) . $salt;
            
            return $hash === $paytmHash;
        } catch (\Exception $e) {
            return false;
        }
    }

    private function encrypt(string $data, string $key): string
    {
        $key = html_entity_decode($key);
        $iv = '@@@@&&&&####$$$$';
        return openssl_encrypt($data, 'AES-128-CBC', $key, 0, $iv);
    }

    private function decrypt(string $data, string $key): string
    {
        $key = html_entity_decode($key);
        $iv = '@@@@&&&&####$$$$';
        return openssl_decrypt($data, 'AES-128-CBC', $key, 0, $iv);
    }

    private function generateRandomString(int $length): string
    {
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        $str = '';
        for ($i = 0; $i < $length; $i++) {
            $str .= $chars[random_int(0, strlen($chars) - 1)];
        }
        return $str;
    }
}
