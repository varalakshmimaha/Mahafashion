@extends('admin.layouts.app')

@section('title', 'Edit Order #' . $order->id)

@section('content')
<form action="{{ route('admin.orders.update-status-payment', $order->id) }}" method="POST">
    @csrf
    @method('PUT')

    <!-- Header & Order Info -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <h1 class="text-3xl font-bold text-gray-800">Edit Order #{{ $order->id }}</h1>
            <p class="text-gray-500 mt-1 flex items-center gap-2">
                <i class="far fa-calendar-alt"></i> {{ $order->created_at->format('M d, Y h:i A') }}
            </p>
        </div>
        <div class="flex items-center gap-3">
            <a href="{{ route('admin.orders.show', $order) }}" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
            </a>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                Save Changes
            </button>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Main Content Column (Read Only) -->
        <div class="lg:col-span-2 space-y-8 opacity-75 pointer-events-none filter grayscale-[0.1]">
            <!-- Customer & Shipping Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-user-circle text-gray-400 mr-2"></i> Customer & Shipping Details
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Customer Details -->
                        <div class="space-y-3">
                            <div class="flex items-start gap-3">
                                <i class="fas fa-user text-gray-400 mt-1 w-5"></i>
                                <div>
                                    <p class="text-xs text-gray-500 uppercase tracking-wide">Customer</p>
                                    <p class="font-medium text-gray-900">{{ $order->user->name ?? 'Guest User' }}</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3">
                                <i class="fas fa-envelope text-gray-400 mt-1 w-5"></i>
                                <div>
                                    <p class="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                                    <p class="text-gray-900">{{ $order->user->email ?? $order->email ?? '--' }}</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3">
                                <i class="fas fa-phone text-gray-400 mt-1 w-5"></i>
                                <div>
                                    <p class="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                                    <p class="text-gray-900">{{ $order->user->phone ?? $order->phone ?? '--' }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Shipping Address -->
                        <div class="space-y-3 border-l md:border-l-0 md:border-l-gray-100 pl-0 md:pl-8">
                            <div class="flex items-start gap-3">
                                <i class="fas fa-map-marker-alt text-gray-400 mt-1 w-5"></i>
                                <div>
                                    <p class="text-xs text-gray-500 uppercase tracking-wide">Shipping Address</p>
                                    @if($order->primary_address)
                                        <p class="text-gray-900">{{ $order->primary_address['address'] ?? $order->primary_address['line1'] ?? '' }}</p>
                                        <p class="text-gray-900">
                                            {{ $order->primary_address['city'] ?? $order->primary_address['town'] ?? '' }}, 
                                            {{ $order->primary_address['state'] ?? $order->primary_address['region'] ?? '' }}
                                        </p>
                                        <p class="text-gray-900">
                                            {{ $order->primary_address['zip_code'] ?? $order->primary_address['postcode'] ?? '' }}
                                        </p>
                                        <p class="text-gray-900">{{ $order->primary_address['country'] ?? '' }}</p>
                                    @else
                                        <p class="text-gray-400 italic">No shipping address provided</p>
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Order Items Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-6 border-b border-gray-50">
                    <h3 class="text-lg font-semibold text-gray-800">Order Items</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <th class="px-6 py-4 font-medium">Product</th>
                                <th class="px-6 py-4 font-medium text-right">Price</th>
                                <th class="px-6 py-4 font-medium text-center">Qty</th>
                                <th class="px-6 py-4 font-medium text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            @foreach($order->orderItems as $item)
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-4">
                                        <img src="{{ $item->product->main_image_url ?? $item->product->image_url ?? 'https://placehold.co/80x80' }}" alt="" class="w-12 h-12 rounded-lg object-cover border border-gray-200">
                                        <div>
                                            <p class="font-medium text-gray-900">{{ $item->product->name }}</p>
                                            <p class="text-xs text-gray-500">SKU: {{ $item->product->sku ?? 'N/A' }}</p>
                                            @if($item->selected_color || $item->blouse_option)
                                            <div class="text-xs text-gray-500 mt-1">
                                                {{ $item->selected_color ? 'Color: '.$item->selected_color : '' }}
                                                {{ $item->blouse_option ? '| Blouse: '.$item->blouse_option : '' }}
                                            </div>
                                            @endif
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-right text-gray-700 font-medium">
                                    ₹{{ number_format($item->price, 2) }}
                                </td>
                                <td class="px-6 py-4 text-center text-gray-700">
                                    {{ $item->quantity }}
                                </td>
                                <td class="px-6 py-4 text-right text-gray-900 font-bold">
                                    ₹{{ number_format($item->price * $item->quantity, 2) }}
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Right Sidebar - Edit Controls -->
        <div class="space-y-6">
            
            <!-- Edit Status Card -->
            <div class="bg-white rounded-xl shadow-lg border border-indigo-100 p-6 ring-2 ring-indigo-50 relative">
                <span class="absolute top-0 right-0 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-bl-lg text-xs font-bold uppercase">Editing Mode</span>
                
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Update Status</h3>
                
                <div class="space-y-5">
                    <!-- Fulfillment Status -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Fulfillment Status <span class="text-red-500">*</span></label>
                        <select name="status" class="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5">
                            @php
                                // Flow: Placed -> Confirmed -> Packed -> Shipped -> Out for Delivery -> Delivered
                                $statuses = ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'pending']; 
                            @endphp
                            @foreach($statuses as $status)
                                <option value="{{ $status }}" {{ $order->status == $status ? 'selected' : '' }}>
                                    {{ ucfirst(str_replace('_', ' ', $status)) }}
                                </option>
                            @endforeach
                        </select>
                        <p class="mt-1 text-xs text-gray-500">
                            Flow: Placed → Confirmed → Packed → Shipped → Out for Delivery → Delivered
                        </p>
                    </div>

                    <!-- Payment Status -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Payment Status <span class="text-red-500">*</span></label>
                        <select name="payment_status" class="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5">
                            @foreach(['pending', 'paid', 'failed', 'refunded'] as $status)
                                <option value="{{ $status }}" {{ $order->payment_status == $status ? 'selected' : '' }}>
                                    {{ ucfirst($status) }}
                                </option>
                            @endforeach
                        </select>
                        @if($order->payment_status == 'paid')
                            <p class="mt-1 text-xs text-green-600 font-medium">
                                <i class="fas fa-check-circle"></i> Payment verified
                            </p>
                        @endif
                    </div>

                    <!-- Internal Note -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Change Reason / Note</label>
                        <textarea name="comments" rows="3" class="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5" placeholder="Optional note for this status change..."></textarea>
                    </div>
                </div>

                <div class="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3">
                     <button type="submit" class="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-md">
                        <i class="fas fa-save"></i> Save Updates
                    </button>
                </div>
            </div>

            <!-- Warning Card -->
            <div class="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
                <div class="flex gap-3">
                    <i class="fas fa-exclamation-triangle text-yellow-600 mt-1"></i>
                    <div>
                        <h4 class="text-sm font-semibold text-yellow-800">Important</h4>
                        <p class="text-xs text-yellow-700 mt-1">
                            Status updates create a permanent history log. Ensure the physical state of the package matches the status selected.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</form>
@endsection
