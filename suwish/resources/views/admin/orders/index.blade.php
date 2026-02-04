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
<!-- Search and Filters -->
<div class="bg-white p-4 rounded-lg shadow mb-6">
    <form action="{{ route('admin.orders.index') }}" method="GET">
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <!-- Retain sort params if present -->
            @if(request('sort')) <input type="hidden" name="sort" value="{{ request('sort') }}"> @endif
            @if(request('direction')) <input type="hidden" name="direction" value="{{ request('direction') }}"> @endif

            <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input type="text" name="search" value="{{ request('search') }}" placeholder="Order ID, Name, Email..." class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option value="">All Status</option>
                    @foreach(['Pending', 'Processing', 'Completed', 'Cancelled'] as $status)
                        <option value="{{ $status }}" {{ strtolower(request('status')) == strtolower($status) ? 'selected' : '' }}>{{ $status }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Payment</label>
                <select name="payment_status" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option value="">All Payment</option>
                    @foreach(['Pending', 'Paid', 'Failed', 'Refunded'] as $status)
                        <option value="{{ $status }}" {{ strtolower(request('payment_status')) == strtolower($status) ? 'selected' : '' }}>{{ $status }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" name="date_from" value="{{ request('date_from') }}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" title="From Date">
            </div>
            <div>
                <button type="submit" class="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out">
                    <i class="fas fa-filter mr-2"></i> Filter
                </button>
            </div>
        </div>
    </form>
</div>

<!-- Orders Table -->
<div class="bg-white rounded-lg shadow overflow-hidden" x-data="{ 
    selected: [], 
    allSelected: false,
    toggleAll(e) {
        this.allSelected = e.target.checked;
        if (this.allSelected) {
            this.selected = {{ $orders->pluck('id') }};
        } else {
            this.selected = [];
        }
    },
    performBulkAction() {
        const action = document.getElementById('bulk_action_select').value;
        if (!action) return;
        
        if (action === 'delete' && !confirm('Are you sure you want to delete ' + this.selected.length + ' orders?')) return;
        
        fetch('{{ route('admin.orders.bulk-action') }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name=\'csrf-token\']').getAttribute('content')
            },
            body: JSON.stringify({ ids: this.selected, action: action })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                location.reload();
            } else {
                alert(data.message || 'Error occurred');
            }
        })
        .catch(err => console.error(err));
    }
}">
    <!-- Bulk Actions Toolbar -->
    <div x-show="selected.length > 0" class="bg-blue-50 px-4 py-3 border-b border-blue-100 flex justify-between items-center transition" x-cloak>
        <span class="font-medium text-blue-700 text-sm" x-text="selected.length + ' orders selected'"></span>
        <div class="flex items-center space-x-2">
            <select id="bulk_action_select" class="border-gray-300 rounded text-sm py-1.5 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Bulk Actions</option>
                <option value="delete">Cancel Selected</option>
            </select>
            <button @click="performBulkAction()" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition shadow-sm">Apply</button>
        </div>
    </div>

    <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left">
                    <input type="checkbox" @change="toggleAll($event)" :checked="allSelected" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4">
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <a href="{{ request()->fullUrlWithQuery(['sort' => 'id', 'direction' => request('direction') === 'asc' ? 'desc' : 'asc']) }}" class="group inline-flex items-center cursor-pointer hover:text-gray-700">
                        Order ID
                        @if(request('sort') === 'id')
                            <i class="fas fa-sort-{{ request('direction') === 'asc' ? 'up' : 'down' }} ml-1 text-blue-500"></i>
                        @else
                            <i class="fas fa-sort ml-1 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        @endif
                    </a>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <a href="{{ request()->fullUrlWithQuery(['sort' => 'created_at', 'direction' => request('direction') === 'asc' ? 'desc' : 'asc']) }}" class="group inline-flex items-center cursor-pointer hover:text-gray-700">
                        Date
                        @if(request('sort') === 'created_at' || !request('sort'))
                            <i class="fas fa-sort-{{ request('direction') === 'asc' ? 'up' : 'down' }} ml-1 text-blue-500"></i>
                        @else
                            <i class="fas fa-sort ml-1 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        @endif
                    </a>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <a href="{{ request()->fullUrlWithQuery(['sort' => 'total', 'direction' => request('direction') === 'asc' ? 'desc' : 'asc']) }}" class="group inline-flex items-center cursor-pointer hover:text-gray-700">
                        Amount
                        @if(request('sort') === 'total')
                            <i class="fas fa-sort-{{ request('direction') === 'asc' ? 'up' : 'down' }} ml-1 text-blue-500"></i>
                        @else
                            <i class="fas fa-sort ml-1 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        @endif
                    </a>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <a href="{{ request()->fullUrlWithQuery(['sort' => 'status', 'direction' => request('direction') === 'asc' ? 'desc' : 'asc']) }}" class="group inline-flex items-center cursor-pointer hover:text-gray-700">
                        Status
                        @if(request('sort') === 'status')
                            <i class="fas fa-sort-{{ request('direction') === 'asc' ? 'up' : 'down' }} ml-1 text-blue-500"></i>
                        @else
                            <i class="fas fa-sort ml-1 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        @endif
                    </a>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <a href="{{ request()->fullUrlWithQuery(['sort' => 'payment_status', 'direction' => request('direction') === 'asc' ? 'desc' : 'asc']) }}" class="group inline-flex items-center cursor-pointer hover:text-gray-700">
                        Payment
                        @if(request('sort') === 'payment_status')
                            <i class="fas fa-sort-{{ request('direction') === 'asc' ? 'up' : 'down' }} ml-1 text-blue-500"></i>
                        @else
                            <i class="fas fa-sort ml-1 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        @endif
                    </a>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            @foreach($orders as $order)
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" value="{{ $order->id }}" x-model="selected" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4">
                </td>
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
                    ₹{{ number_format($order->total, 2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    @php
                        $statusColors = [
                            'pending' => 'bg-yellow-100 text-yellow-800',
                            'confirmed' => 'bg-blue-100 text-blue-800',
                            'packed' => 'bg-indigo-100 text-indigo-800',
                            'shipped' => 'bg-purple-100 text-purple-800',
                            'out_for_delivery' => 'bg-orange-100 text-orange-800',
                            'delivered' => 'bg-green-100 text-green-800',
                            'completed' => 'bg-green-100 text-green-800',
                            'cancelled' => 'bg-red-100 text-red-800',
                            'refunded' => 'bg-gray-100 text-gray-800',
                        ];
                        $statusClass = $statusColors[strtolower($order->status)] ?? 'bg-gray-100 text-gray-800';
                    @endphp
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {{ $statusClass }}">
                        {{ ucfirst(str_replace('_', ' ', $order->status)) }}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    @php
                        $paymentColors = [
                            'paid' => 'bg-green-100 text-green-800',
                            'pending' => 'bg-yellow-100 text-yellow-800',
                            'failed' => 'bg-red-100 text-red-800',
                            'refunded' => 'bg-purple-100 text-purple-800',
                        ];
                        $paymentClass = $paymentColors[strtolower($order->payment_status)] ?? 'bg-gray-100 text-gray-800';
                    @endphp
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {{ $paymentClass }}">
                        {{ ucfirst($order->payment_status) }}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="{{ route('admin.orders.show', $order) }}" class="text-blue-600 hover:text-blue-900 mr-3" title="View">
                        <i class="fas fa-eye"></i>
                    </a>
                    <a href="{{ route('admin.orders.edit', $order) }}" class="text-indigo-600 hover:text-indigo-900 mr-3" title="Edit">
                        <i class="fas fa-edit"></i>
                    </a>
                    <button onclick="deleteOrder({{ $order->id }})" class="text-red-600 hover:text-red-900 mr-3" title="Cancel Order">
                        <i class="fas fa-ban"></i>
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
function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;
    
    // Using the delete endpoint which fits "soft cancel" requirement if SoftDeletes is enabled
    fetch(`/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Accept': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(data => {
        if (data.success) {
            location.reload();
        } else {
            alert(data.message || 'Error occurred');
        }
    })
    .catch(err => console.error(err));
}
</script>
@endsection