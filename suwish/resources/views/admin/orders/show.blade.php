@extends('admin.layouts.app')

@section('title', 'Order #' . $order->id)

@section('content')
<div class="max-w-7xl mx-auto py-8 text-gray-800 font-sans">
    
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <div>
            <h1 class="text-3xl font-bold mb-1">Order #{{ $order->id }}</h1>
            <p class="text-sm text-gray-500">
                {{ $order->created_at->format('M d, Y h:i A') }}
            </p>
        </div>
        <div>
            <button onclick="window.print()" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded transition-colors text-sm">
                View Invoice
            </button>
        </div>
    </div>

    @if(session('success'))
        <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <p class="text-green-700 font-medium">{{ session('success') }}</p>
        </div>
    @endif
    
    @if(session('error'))
        <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p class="text-red-700 font-medium">{{ session('error') }}</p>
        </div>
    @endif

    <!-- Customer & Order Information -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
        <!-- Left: Customer Info -->
        <div class="space-y-4">
            <h3 class="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Customer Information</h3>
            
            <div class="grid grid-cols-[140px_1fr] gap-2 text-sm">
                <span class="text-gray-500">Customer Name</span>
                <span class="font-medium font-mono">{{ $order->user->name ?? 'Guest User' }}</span>
                
                <span class="text-gray-500">Mobile Number</span>
                <span class="font-mono">{{ $order->user->phone ?? $order->phone ?? '--' }}</span>
                
                <span class="text-gray-500">Email</span>
                <span class="font-mono">{{ $order->user->email ?? $order->email ?? '--' }}</span>
                
                <span class="text-gray-500">Address</span>
                <div>
                    @if($order->primary_address)
                        <p>{{ $order->primary_address['address'] ?? $order->primary_address['line1'] ?? '' }}</p>
                        <p>{{ $order->primary_address['city'] ?? $order->primary_address['town'] ?? '' }}, {{ $order->primary_address['state'] ?? $order->primary_address['region'] ?? '' }}</p>
                        <p class="font-mono mt-1">PIN: {{ $order->primary_address['zip_code'] ?? $order->primary_address['postcode'] ?? '' }}</p>
                    @else
                        <p class="text-gray-400 italic">No shipping address provided</p>
                    @endif
                </div>
            </div>
        </div>

        <!-- Right: Order Info -->
        <div class="space-y-4">
            <h3 class="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Order Information</h3>
            
            <div class="grid grid-cols-[140px_1fr] gap-4 text-sm items-center">
                <span class="text-gray-500">Order Date</span>
                <span class="font-mono">{{ $order->created_at->format('d/m/Y') }}</span>
                
                <span class="text-gray-500">Payment Method</span>
                <span class="font-medium text-gray-700">{{ $order->payment_method ?? 'Online' }}</span>
                
                <span class="text-gray-500">Order Status</span>
                <span>
                    @php
                        $statusClass = match($order->status) {
                            'placed', 'pending' => 'bg-yellow-100 text-yellow-800',
                            'confirmed' => 'bg-blue-100 text-blue-800',
                            'packed' => 'bg-indigo-100 text-indigo-800',
                            'shipped' => 'bg-purple-100 text-purple-800',
                            'out_for_delivery' => 'bg-orange-100 text-orange-800',
                            'delivered', 'completed' => 'bg-green-100 text-green-800',
                            'cancelled' => 'bg-red-100 text-red-800',
                            default => 'bg-gray-100 text-gray-800'
                        };
                    @endphp
                    <span class="px-2 py-0.5 rounded text-xs font-bold uppercase {{ $statusClass }}">
                        {{ str_replace('_', ' ', $order->status) }}
                    </span>
                </span>

                <span class="text-gray-500">Payment Status</span>
                <span>
                    @php
                        $payClass = match($order->payment_status) {
                            'paid' => 'bg-green-100 text-green-800',
                            'pending' => 'bg-yellow-100 text-yellow-800',
                            'failed' => 'bg-red-100 text-red-800',
                            'refunded' => 'bg-purple-100 text-purple-800',
                            default => 'bg-gray-100 text-gray-800'
                        };
                    @endphp
                    <span class="px-2 py-0.5 rounded text-xs font-bold uppercase {{ $payClass }}">
                        {{ $order->payment_status }}
                    </span>
                </span>
            </div>
        </div>
    </div>

    <!-- Order Items -->
    <div class="mb-10">
        <h3 class="font-bold text-lg mb-4">Order Items</h3>
        <table class="w-full text-left text-sm">
            <thead>
                <tr class="border-b border-gray-300">
                    <th class="py-2 font-medium text-gray-500 w-1/2">Product</th>
                    <th class="py-2 font-medium text-gray-500 text-right">Price</th>
                    <th class="py-2 font-medium text-gray-500 text-center">Qty</th>
                    <th class="py-2 font-medium text-gray-500 text-right">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->orderItems as $item)
                <tr class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <td class="py-3 flex items-start gap-4">
                        <img src="{{ $item->product->main_image_url ?? $item->product->image_url ?? 'https://placehold.co/40x40' }}" class="w-10 h-10 object-cover rounded bg-gray-100">
                        <div>
                            <p class="font-medium text-gray-900">{{ $item->product->name }}</p>
                            @if($item->product->sku)<p class="text-xs text-gray-500 font-mono mt-0.5">SKU: {{ $item->product->sku }}</p>@endif
                            @if($item->selected_color || $item->blouse_option)
                            <p class="text-xs text-gray-400 mt-0.5">
                                {{ $item->selected_color ? $item->selected_color : '' }}
                                {{ $item->blouse_option ? ($item->selected_color ? ', ' : '') . 'Blouse: ' . $item->blouse_option : '' }}
                            </p>
                            @endif
                        </div>
                    </td>
                    <td class="py-3 text-right font-mono">₹{{ number_format($item->price, 2) }}</td>
                    <td class="py-3 text-center font-mono">{{ $item->quantity }}</td>
                    <td class="py-3 text-right font-mono font-medium">₹{{ number_format($item->price * $item->quantity, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <!-- Price Summary -->
    <div class="flex justify-end mb-12">
        <div class="w-64 space-y-2 text-sm text-right">
            @php
                $calcSubtotal = $order->orderItems->sum(fn($i) => $i->price * $i->quantity);
                $subtotal = $order->sub_total > 0 ? $order->sub_total : $calcSubtotal;
                $shipping = $order->shipping_fee ?? 0;
                $tax = $order->tax_amount ?? 0;
                $total = $order->total_amount ?? ($subtotal + $shipping + $tax);
            @endphp
            <div class="grid grid-cols-2 gap-4">
                <span class="text-gray-500">Subtotal:</span>
                <span class="font-mono">₹{{ number_format($subtotal, 2) }}</span>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <span class="text-gray-500">GST:</span>
                <span class="font-mono">₹{{ number_format($tax, 2) }}</span>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <span class="text-gray-500">Shipping:</span>
                <span class="font-mono">₹{{ number_format($shipping, 2) }}</span>
            </div>
            <div class="border-t border-gray-300 my-2"></div>
            <div class="grid grid-cols-2 gap-4 font-bold text-gray-900 text-base">
                <span>Total:</span>
                <span>₹{{ number_format($total, 2) }}</span>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-200 pt-8">
        
        <!-- Update Order Status Section -->
        <div class="space-y-6">
            <h3 class="font-bold text-lg">Update Order Status</h3>
            <form action="{{ route('admin.orders.update-status-payment', $order) }}" method="POST" class="space-y-4 max-w-md">
                @csrf
                @method('PUT')
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                    <select name="status" class="w-full border-gray-300 rounded shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2" {{ $order->status === 'delivered' ? 'disabled' : '' }}>
                        @foreach(['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'] as $st)
                            <option value="{{ $st }}" {{ $order->status == $st ? 'selected' : '' }}>
                                {{ ucfirst(str_replace('_', ' ', $st)) }}
                            </option>
                        @endforeach
                    </select>
                    <p class="text-xs text-gray-500 mt-1">Flow: Placed → Confirmed → Packed → Shipped → Out for Delivery → Delivered</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tracking ID</label>
                    <input type="text" name="tracking_number" value="{{ $order->tracking_number }}" class="w-full border-gray-300 rounded shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2" placeholder="Enter tracking code">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tracking URL</label>
                    <input type="url" name="tracking_url" value="{{ $order->tracking_url }}" class="w-full border-gray-300 rounded shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2" placeholder="https://...">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea name="internal_notes" rows="3" class="w-full border-gray-300 rounded shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2" placeholder="Internal notes...">{{ $order->internal_notes }}</textarea>
                </div>

                <div class="pt-2">
                    <button type="submit" class="bg-gray-900 hover:bg-black text-white px-6 py-2 rounded text-sm font-medium transition-colors" {{ $order->status === 'delivered' ? 'disabled opacity-50 cursor-not-allowed' : '' }}>
                        Update Status
                    </button>
                    @if($order->status === 'delivered')
                    <p class="text-xs text-red-500 mt-2">Status updates disabled for Delivered orders.</p>
                    @endif
                </div>
            </form>
        </div>

        <!-- Verify / Update Payment Section -->
        <div class="space-y-6">
            <h3 class="font-bold text-lg">Verify Payment</h3>
            <form action="{{ route('admin.orders.update-status-payment', $order) }}" method="POST" class="space-y-4 max-w-md">
                @csrf
                @method('PUT')
                
                <input type="hidden" name="status" value="{{ $order->status }}"> <!-- Maintain current order status -->

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                    <select name="payment_status" class="w-full border-gray-300 rounded shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2">
                        @foreach(['pending', 'paid', 'failed', 'refunded'] as $pst)
                            <option value="{{ $pst }}" {{ $order->payment_status == $pst ? 'selected' : '' }}>
                                {{ ucfirst($pst) }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="pt-2">
                    <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded text-sm font-medium transition-colors">
                        Update Payment Status
                    </button>
                </div>
            </form>
        </div>

    </div>

</div>
@endsection