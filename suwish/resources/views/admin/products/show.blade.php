@extends('admin.layouts.app')

@section('title', 'Product Details: ' . $product->name)

@section('content')
<div class="mb-6">
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Product Details: {{ $product->name }}</h1>
        <a href="{{ route('admin.products.index') }}" class="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-md">
            <i class="fas fa-arrow-left mr-2"></i> Back to Products
        </a>
    </div>
    <p class="text-gray-600">Detailed view of {{ $product->name }}</p>
</div>

<div class="bg-white p-6 rounded-lg shadow-md">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Product Image Gallery (Main Image + others) -->
        <div class="md:col-span-1">
            <h2 class="text-xl font-semibold mb-4">Product Images</h2>
            <div class="mb-4">
                @if($product->main_image_url)
                    <img src="{{ $product->main_image_url }}" alt="{{ $product->name }}" class="w-full h-auto rounded-lg shadow-sm object-cover">
                @else
                    <img src="https://placehold.co/400x300" alt="Placeholder" class="w-full h-auto rounded-lg shadow-sm object-cover">
                @endif
            </div>
            <div class="grid grid-cols-3 gap-2">
                @forelse($product->images as $image)
                    @if($image->image_url && $image->image_url !== $product->main_image_url)
                        <img src="{{ asset('storage/' . $image->image_url) }}" alt="{{ $product->name }}" class="w-full h-24 object-cover rounded-md shadow-sm">
                    @endif
                @empty
                    <p class="text-gray-500 text-sm col-span-3">No additional images.</p>
                @endforelse
            </div>
        </div>

        <!-- Product Information -->
        <div class="md:col-span-2">
            <h2 class="text-xl font-semibold mb-4">Product Information</h2>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                <dt class="font-medium text-gray-700">Name:</dt>
                <dd class="text-gray-900">{{ $product->name }}</dd>

                <dt class="font-medium text-gray-700">SKU:</dt>
                <dd class="text-gray-900">{{ $product->sku }}</dd>

                <dt class="font-medium text-gray-700">Category:</dt>
                <dd class="text-gray-900">{{ $product->category->name ?? 'N/A' }}</dd>

                <dt class="font-medium text-gray-700">Subcategory:</dt>
                <dd class="text-gray-900">{{ $product->subcategory->name ?? 'N/A' }}</dd>

                <dt class="font-medium text-gray-700">Price:</dt>
                <dd class="text-gray-900">₹{{ number_format($product->price, 2) }}</dd>

                <dt class="font-medium text-gray-700">Discount:</dt>
                <dd class="text-gray-900">{{ $product->discount ? $product->discount . '%' : 'N/A' }}</dd>

                <dt class="font-medium text-gray-700">Stock Quantity:</dt>
                <dd class="text-gray-900">{{ $product->stock_quantity }}</dd>

                <dt class="font-medium text-gray-700">Status:</dt>
                <dd class="text-gray-900">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        {{ $product->is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                        {{ $product->is_active ? 'Active' : 'Inactive' }}
                    </span>
                </dd>

                <dt class="font-medium text-gray-700">Fabric Type:</dt>
                <dd class="text-gray-900">{{ $product->fabric_type ?? 'N/A' }}</dd>

                <dt class="font-medium text-gray-700">Brand:</dt>
                <dd class="text-gray-900">{{ $product->brand ?? 'N/A' }}</dd>

                <dt class="font-medium text-gray-700">Color:</dt>
                <dd class="text-gray-900">{{ $product->color ?? 'N/A' }}</dd>

                <dt class="font-medium text-gray-700">Blouse Included:</dt>
                <dd class="text-gray-900">{{ $product->blouse_included ? 'Yes' : 'No' }}</dd>

                <dt class="font-medium text-gray-700">Drape Length:</dt>
                <dd class="text-gray-900">{{ $product->drape_length ? $product->drape_length . ' meters' : 'N/A' }}</dd>

                <dt class="font-medium text-gray-700">Rating:</dt>
                <dd class="text-gray-900">{{ $product->rating ?? 'N/A' }} ({{ $product->review_count ?? 0 }} reviews)</dd>

                <dt class="font-medium text-gray-700">Trending:</dt>
                <dd class="text-gray-900">{{ $product->is_trending ? 'Yes' : 'No' }}</dd>

                <dt class="font-medium text-gray-700">New Arrival:</dt>
                <dd class="text-gray-900">{{ $product->is_new_arrival ? 'Yes' : 'No' }}</dd>

                <dt class="font-medium text-gray-700">Ethnic Wear:</dt>
                <dd class="text-gray-900">{{ $product->is_ethnic_wear ? 'Yes' : 'No' }}</dd>

                <dt class="font-medium text-gray-700">Suwish Collection:</dt>
                <dd class="text-gray-900">{{ $product->is_suwish_collection ? 'Yes' : 'No' }}</dd>
            </dl>

            <h3 class="text-lg font-semibold mt-6 mb-2">Description:</h3>
            <p class="text-gray-800">{{ $product->description }}</p>

            @if($product->care_instructions)
            <h3 class="text-lg font-semibold mt-6 mb-2">Care Instructions:</h3>
            <p class="text-gray-800">{{ $product->care_instructions }}</p>
            @endif

            @if($product->variants->isNotEmpty())
            <h3 class="text-lg font-semibold mt-6 mb-2">Variants:</h3>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Adjustment</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @foreach($product->variants as $variant)
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $variant->color_name }} ({{ $variant->color_code }})</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $variant->size }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $variant->stock }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $variant->price_adjustment ? '₹' . number_format($variant->price_adjustment, 2) : 'N/A' }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $variant->sku ?? 'N/A' }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            @endif
        </div>
    </div>
</div>
@endsection