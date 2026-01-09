@extends('admin.layouts.app')

@section('title', 'Orders')

@section('content')
<div class="mb-6">
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Orders Management</h1>
        <button class="bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded-md">
            <i class="fas fa-file-export mr-2"></i> Export Orders
        </button>
    </div>
    <p class="text-gray-600">Manage and track customer orders</p>
</div>

<!-- Search and Filters -->
<div class="bg-white p-4 rounded-lg shadow mb-6">
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
            <input type="text" placeholder="Search orders..." class="w-full px-3 py-2 border border-gray-300 rounded-md">
        </div>
        <div>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option>All Status</option>
                <option>Pending</option>
                <option>Processing</option>
                <option>Completed</option>
                <option>Cancelled</option>
            </select>
        </div>
        <div>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option>All Payment Status</option>
                <option>Pending</option>
                <option>Paid</option>
                <option>Failed</option>
                <option>Refunded</option>
            </select>
        </div>
        <div>
            <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md">
        </div>
        <div>
            <button class="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md">
                Filter
            </button>
        </div>
    </div>
</div>

<!-- Orders Table -->
<div class="bg-white rounded-lg shadow overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            @foreach($orders as $order)
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">#{{ $order->id }}</div>
                    <div class="text-sm text-gray-500">{{ $order->order_number }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ $order->user->name ?? 'Guest' }}</div>
                    <div class="text-sm text-gray-500">{{ $order->user->email ?? $order->email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ $order->created_at->format('M d, Y') }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{{ number_format($order->total_amount, 2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <select onchange="updateOrderStatus({{ $order->id }}, this.value)" class="text-xs leading-5 font-semibold rounded-full px-2 py-1 border border-gray-300">
                        <option value="pending" {{ $order->status == 'pending' ? 'selected' : '' }}>Pending</option>
                        <option value="processing" {{ $order->status == 'processing' ? 'selected' : '' }}>Processing</option>
                        <option value="completed" {{ $order->status == 'completed' ? 'selected' : '' }}>Completed</option>
                        <option value="cancelled" {{ $order->status == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                    </select>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <select onchange="updatePaymentStatus({{ $order->id }}, this.value)" class="text-xs leading-5 font-semibold rounded-full px-2 py-1 border border-gray-300">
                        <option value="pending" {{ $order->payment_status == 'pending' ? 'selected' : '' }}>Pending</option>
                        <option value="paid" {{ $order->payment_status == 'paid' ? 'selected' : '' }}>Paid</option>
                        <option value="failed" {{ $order->payment_status == 'failed' ? 'selected' : '' }}>Failed</option>
                        <option value="refunded" {{ $order->payment_status == 'refunded' ? 'selected' : '' }}>Refunded</option>
                    </select>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="{{ route('admin.orders.show', $order) }}" class="text-blue-600 hover:text-blue-900 mr-3">
                        <i class="fas fa-eye"></i>
                    </a>
                    <button class="text-green-600 hover:text-green-900 mr-3">
                        <i class="fas fa-truck"></i>
                    </button>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    
    <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        {{ $orders->links() }}
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
            // Show success notification
            alert('Order status updated successfully');
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
            // Show success notification
            alert('Payment status updated successfully');
        }
    })
    .catch(error => console.error('Error:', error));
}
</script>
@endsection