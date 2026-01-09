@extends('admin.layouts.app')

@section('title', 'Promotions')

@section('content')
<div class="mb-6">
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Promotions Management</h1>
        <a href="{{ route('admin.promotions.create') }}" class="bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded-md">
            <i class="fas fa-plus mr-2"></i> Add Promotion
        </a>
    </div>
    <p class="text-gray-600">Manage discount codes and offers</p>
</div>

<!-- Search and Filters -->
<div class="bg-white p-4 rounded-lg shadow mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
            <input type="text" placeholder="Search promotions..." class="w-full px-3 py-2 border border-gray-300 rounded-md">
        </div>
        <div>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
            </select>
        </div>
        <div>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option>All Types</option>
                <option>Percentage</option>
                <option>Fixed</option>
            </select>
        </div>
        <div>
            <button class="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md">
                Filter
            </button>
        </div>
    </div>
</div>

<!-- Promotions Table -->
<div class="bg-white rounded-lg shadow overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            @foreach($promotions as $promotion)
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ $promotion->code }}</div>
                    <div class="text-sm text-gray-500">Min: ₹{{ number_format($promotion->minimum_amount, 2) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ ucfirst($promotion->discount_type) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    @if($promotion->discount_type === 'percentage')
                        {{ $promotion->discount_value }}%
                    @else
                        ₹{{ number_format($promotion->discount_value, 2) }}
                    @endif
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ $promotion->used_count }} / {{ $promotion->usage_limit ?: '∞' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{{ $promotion->start_date->format('M d, Y') }}</div>
                    <div>{{ $promotion->end_date->format('M d, Y') }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        {{ $promotion->is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                        {{ $promotion->is_active ? 'Active' : 'Inactive' }}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="{{ route('admin.promotions.edit', $promotion) }}" class="text-amber-600 hover:text-amber-900 mr-3">
                        <i class="fas fa-edit"></i>
                    </a>
                    <a href="{{ route('admin.promotions.show', $promotion) }}" class="text-blue-600 hover:text-blue-900 mr-3">
                        <i class="fas fa-eye"></i>
                    </a>
                    <button onclick="togglePromotionStatus({{ $promotion->id }})" class="text-{{ $promotion->is_active ? 'red' : 'green' }}-600 hover:text-{{ $promotion->is_active ? 'red' : 'green' }}-900 mr-3">
                        <i class="fas fa-{{ $promotion->is_active ? 'times' : 'check' }}"></i>
                    </button>
                    <form action="{{ route('admin.promotions.destroy', $promotion) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this promotion?')">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="text-red-600 hover:text-red-900">
                            <i class="fas fa-trash"></i>
                        </button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    
    <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        {{ $promotions->links() }}
    </div>
</div>

<script>
function togglePromotionStatus(promotionId) {
    fetch(`/admin/promotions/${promotionId}/toggle-status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Refresh the page or update the UI
            location.reload();
        }
    })
    .catch(error => console.error('Error:', error));
}
</script>
@endsection