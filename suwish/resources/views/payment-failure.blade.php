<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Failed - Suwish</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="bg-gray-50">
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
            <div class="text-center">
                <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                    <i class="fas fa-times text-red-600 text-3xl"></i>
                </div>
                <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
                    Payment Failed
                </h2>
                <p class="mt-2 text-gray-600">
                    Your payment could not be processed. Please try again or contact support.
                </p>
                
                <div class="mt-6 bg-gray-50 p-4 rounded-md">
                    <p class="text-sm font-medium text-gray-700">Order ID: #{{ $order->order_number ?? 'N/A' }}</p>
                    <p class="text-sm text-gray-600 mt-1">Amount: ₹{{ number_format($order->total ?? 0, 2) }}</p>
                    <p class="text-sm text-gray-600 mt-1">Payment Status: <span class="text-red-600 font-medium">{{ $order->payment_status ?? 'N/A' }}</span></p>
                </div>
                
                <div class="mt-6">
                    <a href="{{ route('home') }}" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                        Continue Shopping
                    </a>
                    
                    <a href="{{ route('orders.index') }}" class="mt-3 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-amber-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                        View Order Details
                    </a>
                    
                    <a href="{{ route('checkout') }}" class="mt-3 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        Try Again
                    </a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>