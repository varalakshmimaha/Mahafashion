@extends('admin.layouts.app')

@section('title', 'Product Details')

@section('content')
<div class="mb-6">
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-bold text-gray-800">Product Details: {{ $product->name }}</h1>
            <p class="text-gray-600">View detailed information about this product</p>
        </div>
        <div class="flex space-x-2">
            <a href="{{ route('admin.products.edit', $product) }}" class="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md">
                <i class="fas fa-edit mr-2"></i> Edit Product
            </a>
            <a href="{{ route('admin.products.index') }}" class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md">
                <i class="fas fa-arrow-left mr-2"></i> Back to List
            </a>
        </div>
    </div>
</div>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Main Info -->
    <div class="lg:col-span-2 space-y-6">
        <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Basic Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p class="text-sm text-gray-500">Product Name</p>
                    <p class="font-medium">{{ $product->name }}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-500">SKU</p>
                    <p class="font-medium">{{ $product->sku }}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Category</p>
                    <p class="font-medium">{{ $product->category->name ?? 'N/A' }}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Status</p>
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        {{ $product->is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                        {{ $product->is_active ? 'Active' : 'Inactive' }}
                    </span>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Default Color</p>
                    <p class="font-medium">{{ $product->color }}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Fabric Type</p>
                    <p class="font-medium">{{ $product->fabric_type ?: 'N/A' }}</p>
                </div>
            </div>
            
            <div class="mt-6">
                <p class="text-sm text-gray-500">Description</p>
                <div class="mt-1 text-gray-700 whitespace-pre-line">
                    {{ $product->description }}
                </div>
            </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Pricing & Inventory</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <p class="text-sm text-gray-500">Base Price</p>
                    <p class="font-medium text-lg">₹{{ number_format($product->price, 2) }}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Discount</p>
                    <p class="font-medium">{{ $product->discount ?: 0 }}%</p>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Stock Quantity</p>
                    <p class="font-medium">{{ $product->stock_quantity }}</p>
                </div>
            </div>
        </div>

        @if($product->image_urls && count($product->image_urls) > 0)
        <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Product Images</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                @foreach($product->image_urls as $index => $image)
                    <div class="relative group">
                        <img src="{{ Str::startsWith($image, 'http') ? $image : asset('storage/' . $image) }}" class="w-full h-40 object-contain rounded border">
                        @if($index == ($product->default_image_index ?? 0))
                            <span class="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br">Default</span>
                        @endif
                    </div>
                @endforeach
            </div>
        </div>
        @endif
        
        @if($product->colors && is_array($product->colors) && count($product->colors) > 0)
        <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Color Variants</h2>
            <div class="space-y-4">
                @foreach($product->colors as $color)
                    <div class="flex items-start p-4 border rounded-lg">
                        <div class="w-16 h-16 rounded-md border mr-4 overflow-hidden flex-shrink-0">
                            @if(isset($color['images']['main']))
                                <img src="{{ Str::startsWith($color['images']['main'], 'http') ? $color['images']['main'] : asset('storage/' . $color['images']['main']) }}" class="w-full h-full object-cover">
                            @else
                                <div class="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">No Img</div>
                            @endif
                        </div>
                        <div class="flex-grow">
                            <div class="flex items-center">
                                <h3 class="font-medium text-gray-900">{{ $color['name'] }}</h3>
                                <span class="ml-2 w-4 h-4 rounded-full border" style="background-color: {{ $color['hexCode'] }}"></span>
                                <span class="ml-2 text-xs text-gray-500">({{ $color['hexCode'] }})</span>
                            </div>
                            <p class="text-sm text-gray-600 mt-1">Stock: {{ $color['stock'] }} | ID: {{ $color['id'] }}</p>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
        @endif
    </div>

    <!-- Sidebar Info -->
    <div class="space-y-6">
        <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Visibility Settings</h2>
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <span class="text-gray-600">New Arrival</span>
                    <span class="px-2 py-1 text-xs font-medium rounded-full {{ $product->is_new_arrival ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800' }}">
                        {{ $product->is_new_arrival ? 'Yes' : 'No' }}
                    </span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-600">Trending</span>
                    <span class="px-2 py-1 text-xs font-medium rounded-full {{ $product->is_trending ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800' }}">
                        {{ $product->is_trending ? 'Yes' : 'No' }}
                    </span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-600">Ethnic Wear</span>
                    <span class="px-2 py-1 text-xs font-medium rounded-full {{ $product->is_ethnic_wear ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800' }}">
                        {{ $product->is_ethnic_wear ? 'Yes' : 'No' }}
                    </span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-600">Maha Collection</span>
                    <span class="px-2 py-1 text-xs font-medium rounded-full {{ $product->is_suwish_collection ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800' }}">
                        {{ $product->is_suwish_collection ? 'Yes' : 'No' }}
                    </span>
                </div>
            </div>
        </div>

        @if($product->sizes && is_array($product->sizes) && count($product->sizes) > 0)
        <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Available Sizes</h2>
            <div class="grid grid-cols-2 gap-3">
                @foreach($product->sizes as $size)
                    <div class="p-2 border rounded text-center">
                        <div class="font-bold">{{ $size['size'] }}</div>
                        <div class="text-xs text-gray-500">{{ $size['stock'] }} in stock</div>
                    </div>
                @endforeach
            </div>
        </div>
        @endif
    </div>
</div>
@endsection
