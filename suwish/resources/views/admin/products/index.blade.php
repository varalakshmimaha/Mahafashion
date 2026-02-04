@extends('admin.layouts.app')

@section('title', 'Products')

@section('content')
<div class="mb-6">
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Products Management</h1>
        <div class="flex gap-2">
            <a href="{{ route('admin.products.create') }}" class="bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded-md">
                <i class="fas fa-plus mr-2"></i> Add Product
            </a>
            <a href="{{ route('admin.products.export') }}" class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md">
                <i class="fas fa-file-excel mr-2"></i> Export Excel
            </a>
            <button onclick="document.getElementById('import-modal').classList.remove('hidden')" class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
                <i class="fas fa-file-import mr-2"></i> Import Excel
            </button>
        </div>
    </div>
    <p class="text-gray-600">Manage your products and inventory</p>
</div>

<!-- Success/Error Messages -->
@if(session('success'))
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        {{ session('success') }}
    </div>
@endif

@if(session('error'))
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ session('error') }}
    </div>
@endif

<!-- Bulk Actions Bar -->
<div id="bulk-actions-bar" class="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow mb-4 hidden">
    <div class="flex justify-between items-center">
        <span class="text-blue-800 font-medium">
            <span id="selected-count">0</span> product(s) selected
        </span>
        <div class="flex gap-2">
            <button onclick="bulkDelete()" class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md">
                <i class="fas fa-trash mr-2"></i> Delete Selected
            </button>
            <button onclick="deselectAll()" class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md">
                <i class="fas fa-times mr-2"></i> Deselect All
            </button>
        </div>
    </div>
</div>

<!-- Search and Filters -->
<div class="bg-white p-4 rounded-lg shadow mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
            <input type="text" placeholder="Search products..." class="w-full px-3 py-2 border border-gray-300 rounded-md">
        </div>
        <div>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">All Categories</option>
                @foreach(\App\Models\Category::all() as $category)
                    <option value="{{ $category->id }}">{{ $category->name }}</option>
                @endforeach
            </select>
        </div>
        <div>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
            </select>
        </div>
        <div>
            <button class="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md">
                Filter
            </button>
        </div>
    </div>
</div>

<!-- Products Table -->
<div class="bg-white rounded-lg shadow overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left">
                    <input type="checkbox" id="select-all" onchange="toggleSelectAll(this)" class="rounded">
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            @foreach($products as $product)
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" class="product-checkbox rounded" value="{{ $product->id }}" onchange="updateBulkActionsBar()">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <img class="h-10 w-10 rounded-md object-cover" src="{{ $product->main_image_url ?: 'https://placehold.co/100x100' }}" alt="{{ $product->name }}">
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ $product->name }}</div>
                            <div class="text-sm text-gray-500">{{ $product->sku }}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ $product->category->name ?? 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{{ number_format($product->price, 2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ $product->stock_quantity }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        {{ $product->is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                        {{ $product->is_active ? 'Active' : 'Inactive' }}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="{{ route('admin.products.edit', $product) }}" class="text-amber-600 hover:text-amber-900 mr-3" title="Edit">
                        <i class="fas fa-edit"></i>
                    </a>
                    <a href="{{ route('admin.products.show', $product) }}" class="text-blue-600 hover:text-blue-900 mr-3" title="View">
                        <i class="fas fa-eye"></i>
                    </a>
                    <form action="{{ route('admin.products.destroy', $product) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this product?')">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="text-red-600 hover:text-red-900" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    
    <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        {{ $products->links() }}
    </div>
</div>

<!-- Import Modal -->
<div id="import-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Import Products from Excel</h3>
            <button onclick="document.getElementById('import-modal').classList.add('hidden')" class="text-gray-500 hover:text-gray-700">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <form action="{{ route('admin.products.import') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Select Excel File</label>
                <input type="file" name="file" accept=".xlsx,.xls,.csv" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                <p class="text-xs text-gray-500 mt-1">Accepted formats: .xlsx, .xls, .csv</p>
            </div>
            
            <div class="bg-blue-50 border border-blue-200 p-3 rounded mb-4">
                <p class="text-sm text-blue-800">
                    <i class="fas fa-info-circle mr-1"></i>
                    Download the template by clicking "Export Excel" first to see the required format.
                </p>
            </div>
            
            <div class="flex gap-2">
                <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
                    <i class="fas fa-upload mr-2"></i> Import
                </button>
                <button type="button" onclick="document.getElementById('import-modal').classList.add('hidden')" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md">
                    Cancel
                </button>
            </div>
        </form>
    </div>
</div>

<script>
function toggleSelectAll(checkbox) {
    const checkboxes = document.querySelectorAll('.product-checkbox');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
    updateBulkActionsBar();
}

function updateBulkActionsBar() {
    const checkboxes = document.querySelectorAll('.product-checkbox:checked');
    const count = checkboxes.length;
    const bulkActionsBar = document.getElementById('bulk-actions-bar');
    const selectedCount = document.getElementById('selected-count');
    
    selectedCount.textContent = count;
    
    if (count > 0) {
        bulkActionsBar.classList.remove('hidden');
    } else {
        bulkActionsBar.classList.add('hidden');
    }
    
    // Update select-all checkbox
    const allCheckboxes = document.querySelectorAll('.product-checkbox');
    const selectAllCheckbox = document.getElementById('select-all');
    selectAllCheckbox.checked = count === allCheckboxes.length && count > 0;
}

function deselectAll() {
    const checkboxes = document.querySelectorAll('.product-checkbox');
    checkboxes.forEach(cb => cb.checked = false);
    document.getElementById('select-all').checked = false;
    updateBulkActionsBar();
}

function bulkDelete() {
    const checkboxes = document.querySelectorAll('.product-checkbox:checked');
    const ids = Array.from(checkboxes).map(cb => cb.value);
    
    if (ids.length === 0) {
        alert('Please select at least one product to delete.');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete ${ids.length} product(s)? This action cannot be undone.`)) {
        return;
    }
    
    fetch('{{ route("admin.products.bulk-delete") }}', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': '{{ csrf_token() }}'
        },
        body: JSON.stringify({ ids: ids })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            location.reload();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while deleting products.');
    });
}
</script>

@endsection