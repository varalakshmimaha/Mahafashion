@extends('admin.layouts.app')

@section('title', 'Order Details')

@section('content')
<div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Order Details</h1>
    <p class="text-gray-600">View details for order #{{ $order->id }}</p>
</div>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Order Information -->
    <div class="lg:col-span-2 space-y-6">
        <!-- Order Summary -->
        <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p class="text-sm text-gray-600">Order ID</p>
                    <p class="font-medium">#{{ $order->id }}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Order Number</p>
                    <p class="font-medium">{{ $order->order_number }}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Order Date</p>
                    <p class="font-medium">{{ $order->created_at->format('M d, Y h:i A') }}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Status</p>
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        {{ $order->status == 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                           ($order->status == 'processing' ? 'bg-blue-100 text-blue-800' : 
                           ($order->status == 'completed' ? 'bg-green-100 text-green-800' : 
                           'bg-red-100 text-red-800')) }}">
                        {{ ucfirst($order->status) }}
                    </span>
                </div>
            </div>
            
            <div class="mb-4">
                <p class="text-sm text-gray-600">Payment Status</p>
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    {{ $order->payment_status == 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                       ($order->payment_status == 'paid' ? 'bg-green-100 text-green-800' : 
                       ($order->payment_status == 'failed' ? 'bg-red-100 text-red-800' : 
                       'bg-purple-100 text-purple-800')) }}">
                    {{ ucfirst($order->payment_status) }}
                </span>
            </div>
        </div>
        
        <!-- Order Items -->
        <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Order Items</h2>
            
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @foreach($order->orderItems as $item)
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-10 w-10">
                                        <img class="h-10 w-10 rounded-md" src="{{ $item->product->image_url ?? 'https://placehold.co/100x100' }}" alt="{{ $item->product->name }}">
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900">{{ $item->product->name }}</div>
                                        <div class="text-sm text-gray-500">{{ $item->product->sku }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ₹{{ number_format($item->price, 2) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ $item->quantity }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ₹{{ number_format($item->total_price, 2) }}
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <!-- Order Actions & Customer Info -->
    <div class="space-y-6">
        <!-- Customer Information -->
        <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Customer Information</h2>
            
            <div class="mb-4">
                <p class="text-sm text-gray-600">Name</p>
                <p class="font-medium">{{ $order->user->name ?? 'N/A' }}</p>
            </div>
            
            <div class="mb-4">
                <p class="text-sm text-gray-600">Email</p>
                <p class="font-medium">{{ $order->user->email ?? $order->email ?? 'N/A' }}</p>
            </div>
            
            <div class="mb-4">
                <p class="text-sm text-gray-600">Phone</p>
                <p class="font-medium">{{ $order->user->phone ?? $order->phone ?? 'N/A' }}</p>
            </div>
        </div>
        
        <!-- Shipping Address -->
        <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Shipping Address</h2>
            
            <div class="mb-4">
                <p class="text-sm text-gray-600">Address</p>
                <p class="font-medium">{{ $order->address->address ?? 'N/A' }}</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p class="text-sm text-gray-600">City</p>
                    <p class="font-medium">{{ $order->address->city ?? 'N/A' }}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">State</p>
                    <p class="font-medium">{{ $order->address->state ?? 'N/A' }}</p>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-sm text-gray-600">Country</p>
                    <p class="font-medium">{{ $order->address->country ?? 'N/A' }}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">ZIP Code</p>
                    <p class="font-medium">{{ $order->address->zip_code ?? 'N/A' }}</p>
                </div>
            </div>
        </div>
        
        <!-- Order Actions -->
        <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Order Actions</h2>
            
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                    <select onchange="updateOrderStatus({{ $order->id }}, this.value)" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="pending" {{ $order->status == 'pending' ? 'selected' : '' }}>Pending</option>
                        <option value="processing" {{ $order->status == 'processing' ? 'selected' : '' }}>Processing</option>
                        <option value="completed" {{ $order->status == 'completed' ? 'selected' : '' }}>Completed</option>
                        <option value="cancelled" {{ $order->status == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Update Payment Status</label>
                    <select onchange="updatePaymentStatus({{ $order->id }}, this.value)" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="pending" {{ $order->payment_status == 'pending' ? 'selected' : '' }}>Pending</option>
                        <option value="paid" {{ $order->payment_status == 'paid' ? 'selected' : '' }}>Paid</option>
                        <option value="failed" {{ $order->payment_status == 'failed' ? 'selected' : '' }}>Failed</option>
                        <option value="refunded" {{ $order->payment_status == 'refunded' ? 'selected' : '' }}>Refunded</option>
                    </select>
                </div>
                
                <button class="w-full bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded-md">
                    <i class="fas fa-truck mr-2"></i> Add Tracking Info
                </button>
                
                <button class="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md">
                    <i class="fas fa-print mr-2"></i> Print Invoice
                </button>
            </div>
        </div>
        
        <!-- Order Total -->
        <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Order Total</h2>
            
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{{ number_format($order->sub_total, 2) }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{{ number_format($order->shipping_fee, 2) }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Tax</span>
                    <span>₹{{ number_format($order->tax_amount ?? 0, 2) }}</span>
                </div>
                <div class="flex justify-between pt-2 border-t border-gray-200">
                    <span class="font-semibold">Total</span>
                    <span class="font-semibold">₹{{ number_format($order->total_amount, 2) }}</span>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function updateOrderStatus(orderId, status) {
    fetch(`/admin/orders/${orderId}/update-status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({ status: status })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Reload the page to reflect changes
            location.reload();
        }
    })
    .catch(error => console.error('Error:', error));
}

function updatePaymentStatus(orderId, paymentStatus) {
    fetch(`/admin/orders/${orderId}/update-payment-status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({ payment_status: paymentStatus })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Reload the page to reflect changes
            location.reload();
        }
    })
    .catch(error => console.error('Error:', error));
}
</script>
@endsection