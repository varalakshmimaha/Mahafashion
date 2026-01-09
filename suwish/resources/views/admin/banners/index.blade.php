@extends('admin.layouts.app')

@section('title', 'Banners')

@section('content')
<div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Banners</h1>
    <p class="text-gray-600">Manage website banners and promotions</p>
</div>

<div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-medium text-gray-800">Banners List</h2>
        <a href="{{ route('admin.banners.create') }}" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300">
            <i class="fas fa-plus mr-2"></i> Add Banner
        </a>
    </div>

    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                @forelse($banners as $banner)
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                        @if($banner->image_path)
                            <img src="{{ $banner->image_path }}" alt="{{ $banner->title }}" class="h-12 w-16 object-cover rounded">
                        @else
                            <span class="text-gray-500">No image</span>
                        @endif
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">{{ $banner->title }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-500">{{ $banner->link ?? 'No link' }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ $banner->order }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            {{ $banner->is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                            {{ $banner->is_active ? 'Active' : 'Inactive' }}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="{{ route('admin.banners.edit', $banner) }}" class="text-amber-600 hover:text-amber-900 mr-3">
                            <i class="fas fa-edit"></i>
                        </a>
                        <a href="{{ route('admin.banners.show', $banner) }}" class="text-blue-600 hover:text-blue-900 mr-3">
                            <i class="fas fa-eye"></i>
                        </a>
                        <button data-banner-id="{{ $banner->id }}" data-current-status="{{ $banner->is_active }}" class="toggle-status-btn text-{{ $banner->is_active ? 'red' : 'green' }}-600 hover:text-{{ $banner->is_active ? 'red' : 'green' }}-900 mr-3">
                            <i class="fas fa-{{ $banner->is_active ? 'times' : 'check' }}"></i>
                        </button>
                        <form action="{{ route('admin.banners.destroy', $banner) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this banner?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="text-red-600 hover:text-red-900">
                                <i class="fas fa-trash"></i>
                            </button>
                        </form>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                        No banners found.
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to all toggle buttons
    document.querySelectorAll('.toggle-status-btn').forEach(button => {
        button.addEventListener('click', function() {
            const bannerId = this.getAttribute('data-banner-id');
            toggleBannerStatus(bannerId);
        });
    });
});

function toggleBannerStatus(bannerId) {
    fetch(`/admin/banners/${bannerId}/toggle-status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update the UI without refreshing the page
            const button = document.querySelector(`button[data-banner-id="${bannerId}"]`);
            if (button) {
                const icon = button.querySelector('i');
                if (data.is_active) {
                    button.className = 'toggle-status-btn text-green-600 hover:text-green-900 mr-3';
                    icon.className = 'fas fa-check';
                    // Find the status span in the same row and update it
                    const statusCell = button.closest('tr').querySelector('td:nth-child(5) span');
                    if (statusCell) {
                        statusCell.className = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800';
                        statusCell.textContent = 'Active';
                    }
                } else {
                    button.className = 'toggle-status-btn text-red-600 hover:text-red-900 mr-3';
                    icon.className = 'fas fa-times';
                    // Find the status span in the same row and update it
                    const statusCell = button.closest('tr').querySelector('td:nth-child(5) span');
                    if (statusCell) {
                        statusCell.className = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800';
                        statusCell.textContent = 'Inactive';
                    }
                }
                // Update data attribute
                button.setAttribute('data-current-status', data.is_active);
            } else {
                // If the button wasn't updated via DOM, refresh the page as fallback
                location.reload();
            }
        }
    })
    .catch(error => console.error('Error:', error));
}
</script>
@endsection