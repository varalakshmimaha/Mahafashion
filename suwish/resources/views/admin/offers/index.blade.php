@extends('admin.layouts.app')

@section('title', 'Offers')

@section('content')
<div class="mb-6">
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Offers Management</h1>
        <a href="{{ route('admin.offers.create') }}" class="bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded-md">
            <i class="fas fa-plus mr-2"></i> Add Offer
        </a>
    </div>
    <p class="text-gray-600">Manage promotional offers and discounts</p>
</div>

<!-- Search and Filters -->
<div class="bg-white p-4 rounded-lg shadow mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
            <input type="text" placeholder="Search offers..." class="w-full px-3 py-2 border border-gray-300 rounded-md">
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
                <option>Banner</option>
                <option>Discount</option>
            </select>
        </div>
        <div>
            <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">Filter</button>
        </div>
    </div>
</div>

<!-- Offers Table -->
<div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                @forelse($offers as $offer)
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                        @if($offer->image)
                            <img src="{{ asset('storage/' . $offer->image) }}" alt="{{ $offer->title }}" class="w-16 h-16 object-cover rounded">
                        @else
                            <div class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                <span class="text-gray-500 text-xs">No Image</span>
                            </div>
                        @endif
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">{{ $offer->title }}</div>
                        <div class="text-sm text-gray-500">{{ $offer->subtitle }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Offer
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="status-toggle" data-id="{{ $offer->id }}">
                            <button class="toggle-status-btn {{ $offer->is_active ? 'bg-green-500' : 'bg-red-500' }} text-white px-3 py-1 rounded-full text-xs transition-colors duration-200">
                                {{ $offer->is_active ? 'Active' : 'Inactive' }}
                            </button>
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        @if($offer->start_date)
                            {{ $offer->start_date->format('d M Y') }}
                        @endif
                        @if($offer->end_date)
                            - {{ $offer->end_date->format('d M Y') }}
                        @else
                            <span class="text-gray-400">No end date</span>
                        @endif
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href="{{ route('admin.offers.edit', $offer) }}" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</a>
                        <form action="{{ route('admin.offers.destroy', $offer) }}" method="POST" class="inline-block" onsubmit="return confirm('Are you sure you want to delete this offer?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="text-red-600 hover:text-red-900">Delete</button>
                        </form>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                        No offers found.
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    
    <!-- Pagination -->
    <div class="px-6 py-4 bg-white border-t border-gray-200">
        {{ $offers->links() }}
    </div>
</div>

<!-- JavaScript for status toggle -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Handle status toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-status-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const offerId = this.closest('.status-toggle').dataset.id;
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            fetch(`/admin/offers/${offerId}/toggle-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update button text and class
                    if (data.is_active) {
                        this.textContent = 'Active';
                        this.className = 'toggle-status-btn bg-green-500 text-white px-3 py-1 rounded-full text-xs transition-colors duration-200';
                    } else {
                        this.textContent = 'Inactive';
                        this.className = 'toggle-status-btn bg-red-500 text-white px-3 py-1 rounded-full text-xs transition-colors duration-200';
                    }
                }
            })
            .catch(error => console.error('Error:', error));
        });
    });
});
</script>
@endsection