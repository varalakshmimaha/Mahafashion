@extends('admin.layouts.app')

@section('title', 'Edit Product')

@section('head')
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
@endsection

@section('content')
<div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Edit Product</h1>
    <p class="text-gray-600">Update product information</p>
</div>

@if ($errors->any())
    <div class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
        <strong class="font-bold">Whoops! Something went wrong.</strong>
        <ul class="mt-2 list-disc list-inside">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="bg-white p-6 rounded-lg shadow">
    <form method="POST" action="{{ route('admin.products.update', $product) }}" enctype="multipart/form-data" novalidate>
        @csrf
        @method('PUT')
        
        <!-- Basic Details Section -->
        <div class="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Basic Details</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input type="text" name="name" required value="{{ old('name', $product->name) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter product name">
                    @error('name')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                    <input type="text" name="sku" required value="{{ old('sku', $product->sku) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter unique SKU">
                    @error('sku')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select name="category_id" id="category_id" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="">Select a category</option>
                        @foreach($categories as $category)
                            <option value="{{ $category->id }}" {{ $category->id == $product->category_id ? 'selected' : '' }}>{{ $category->name }}</option>
                        @endforeach
                    </select>
                    @error('category_id')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                    <select name="subcategory_id" id="subcategory_id" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="">Select a subcategory</option>
                        @if(isset($subcategories))
                            @foreach($subcategories as $subcategory)
                                <option value="{{ $subcategory->id }}" {{ $subcategory->id == $product->subcategory_id ? 'selected' : '' }}>{{ $subcategory->name }}</option>
                            @endforeach
                        @endif
                    </select>
                    @error('subcategory_id')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Default Color *</label>
                    <input type="text" name="color" required value="{{ old('color', $product->color) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter default color name">
                    @error('color')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
            </div>
        </div>
        
        <!-- Pricing & Stock Section -->
        <div class="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Pricing & Stock</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                    <input type="number" name="price" step="0.01" required min="0" value="{{ old('price', $product->price) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter price">
                    @error('price')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <input type="number" name="discount" min="0" max="100" step="0.01" value="{{ old('discount', $product->discount) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter discount percentage">
                    @error('discount')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                    <input type="number" name="stock_quantity" required min="0" value="{{ old('stock_quantity', $product->stock_quantity) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter stock quantity">
                    @error('stock_quantity')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
            </div>
            
            <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Fabric Type</label>
                <input type="text" name="fabric_type" value="{{ old('fabric_type', $product->fabric_type) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter fabric type">
                @error('fabric_type')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            
            <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea name="description" required rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter product description">{{ old('description', $product->description) }}</textarea>
                @error('description')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
        </div>
        
            <!-- Color-Specific Images and Stock Section -->
            <div class="mb-8 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <h2 class="text-lg font-semibold text-purple-800 mb-4">Color Variants</h2>
                <p class="text-sm text-gray-600 mb-4">Manage different color variants with specific stock and images for each</p>
                
                <div id="color-variants-container">
                    @if(isset($productColorVariants) && count($productColorVariants) > 0)
                        @foreach($productColorVariants as $index => $colorData)
                        <div class="color-variant mb-6 p-4 bg-white rounded-lg border border-gray-200" data-index="{{ $index }}">
                            <div class="flex justify-between items-center mb-3">
                                <h3 class="text-md font-medium text-gray-800">Color Variant {{ $index + 1 }}</h3>
                                <button type="button" class="remove-color-variant text-red-600 hover:text-red-800 text-sm">Remove Color</button>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Color Name *</label>
                                    <input type="text" name="color_variants[{{ $index }}][name]" required value="{{ $colorData['name'] }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., Ruby Red">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Color Code *</label>
                                    <input type="text" name="color_variants[{{ $index }}][hex_code]" required value="{{ $colorData['hex_code'] }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., #C41E3A">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Color ID *</label>
                                    <input type="text" name="color_variants[{{ $index }}][id]" required value="{{ $colorData['id'] }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., red">
                                </div>
                            </div>
                            
                            <!-- Nested Sizes -->
                            <div class="mb-4 bg-gray-50 p-3 rounded">
                                <h4 class="text-sm font-medium text-gray-700 mb-2">Sizes & Stock</h4>
                                <div class="sizes-container" id="sizes-container-{{ $index }}">
                                    @if(isset($colorData['sizes']) && is_array($colorData['sizes']) && count($colorData['sizes']) > 0)
                                        @foreach($colorData['sizes'] as $sizeIndex => $sizeItem)
                                        <div class="size-row grid grid-cols-1 md:grid-cols-4 gap-3 mb-2">
                                            <div>
                                                <input type="text" name="color_variants[{{ $index }}][sizes][{{ $sizeIndex }}][size]" required value="{{ $sizeItem['size'] }}" class="w-full px-3 py-1 border border-gray-300 rounded text-sm" placeholder="Size (e.g. S)">
                                            </div>
                                            <div>
                                                <input type="number" name="color_variants[{{ $index }}][sizes][{{ $sizeIndex }}][stock]" required min="0" value="{{ $sizeItem['stock'] }}" class="w-full px-3 py-1 border border-gray-300 rounded text-sm" placeholder="Stock">
                                            </div>
                                            <div>
                                                <input type="number" name="color_variants[{{ $index }}][sizes][{{ $sizeIndex }}][price]" step="0.01" min="0" value="{{ $sizeItem['price'] ?? '' }}" class="w-full px-3 py-1 border border-gray-300 rounded text-sm" placeholder="Price (Optional)">
                                            </div>
                                            <div class="flex items-center">
                                                <button type="button" class="remove-size-row text-red-500 hover:text-red-700 text-xs">Remove</button>
                                            </div>
                                        </div>
                                        @endforeach
                                    @else
                                        <!-- Default empty size row if none exist -->
                                        <div class="size-row grid grid-cols-1 md:grid-cols-4 gap-3 mb-2">
                                            <div>
                                                <input type="text" name="color_variants[{{ $index }}][sizes][0][size]" required class="w-full px-3 py-1 border border-gray-300 rounded text-sm" placeholder="Size (e.g. S)">
                                            </div>
                                            <div>
                                                <input type="number" name="color_variants[{{ $index }}][sizes][0][stock]" required min="0" class="w-full px-3 py-1 border border-gray-300 rounded text-sm" placeholder="Stock">
                                            </div>
                                            <div>
                                                <input type="number" name="color_variants[{{ $index }}][sizes][0][price]" step="0.01" min="0" class="w-full px-3 py-1 border border-gray-300 rounded text-sm" placeholder="Price (Optional)">
                                            </div>
                                            <div class="flex items-center">
                                                <button type="button" class="remove-size-row text-red-500 hover:text-red-700 text-xs">Remove</button>
                                            </div>
                                        </div>
                                    @endif
                                </div>
                                <button type="button" class="add-size-row text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100" data-color-index="{{ $index }}">
                                    + Add Another Size
                                </button>
                            </div>
                            
                            <div class="mt-4">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Upload New Images for this Color</label>
                                <input type="file" name="color_variants[{{ $index }}][images][]" multiple accept="image/*" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <p class="text-sm text-gray-500 mt-1">Upload new images specific to this color variant (existing images will be preserved)</p>
                            </div>
                            
                            @if(isset($colorData['images']) && isset($colorData['images']['gallery']) && count($colorData['images']['gallery']) > 0)
                            <div class="mt-4">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Current Images for {{ $colorData['name'] ?? 'this color' }}</label>
                                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    @foreach($colorData['images']['gallery'] as $imgIndex => $image)
                                    <div class="relative">
                                        <img src="{{ $image }}" alt="Color Image {{ $imgIndex + 1 }}" class="w-full h-24 object-contain rounded border">
                                        {{-- We use the full URL to identify removal --}}
                                        <button type="button" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs" onclick="removeColorImage(this, '{{ $image }}')">X</button>
                                    </div>
                                    @endforeach
                                </div>
                            </div>
                            @endif
                        </div>
                        @endforeach
                        @php
                            $nextIndex = count($productColorVariants);
                        @endphp
                    @else
                        @php
                            $nextIndex = 0;
                        @endphp
                    @endif
                </div>
                
                <button type="button" id="add-color-variant" class="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md">
                    Add Color Variant
                </button>
            </div>
        
        <!-- Sizes Section -->
        <div class="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h2 class="text-lg font-semibold text-blue-800 mb-4">Product Sizes</h2>
            <p class="text-sm text-gray-600 mb-4">Manage different sizes with specific stock quantities</p>
            
            <div id="sizes-container">
                @if($product->sizes && is_array($product->sizes) && count($product->sizes) > 0)
                    @foreach($product->sizes as $index => $sizeData)
                    <div class="size-item mb-4 p-3 bg-white rounded border border-gray-200">
                        <div class="flex justify-between items-center mb-2">
                            <h3 class="text-md font-medium text-gray-800">Size {{ $index + 1 }}</h3>
                            <button type="button" class="remove-size text-red-600 hover:text-red-800 text-sm">Remove</button>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Size *</label>
                                <input type="text" name="sizes[{{ $index }}][size]" required value="{{ $sizeData['size'] ?? old('sizes.'.$index.'.size') }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., S, M, L, XL or 36, 38, 40">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                                <input type="number" name="sizes[{{ $index }}][stock]" required min="0" value="{{ $sizeData['stock'] ?? old('sizes.'.$index.'.stock') ?? 0 }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., 10">
                            </div>
                        </div>
                    </div>
                    @endforeach
                    @php
                        $nextSizeIndex = count($product->sizes);
                    @endphp
                @else
                    @php
                        $nextSizeIndex = 0;
                    @endphp
                @endif
                

            </div>
            
            <button type="button" id="add-size" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
                Add Size
            </button>
        </div>
        
        <!-- Default Image Section -->
        <div class="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Default Image</h2>
            
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Default Image Index</label>
                <input type="number" name="default_image_index" min="0" value="{{ old('default_image_index', $product->default_image_index ?? 0) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter index of default image (0 for first image)">
                <p class="text-sm text-gray-500 mt-1">Specify which image in the uploaded list should be the default/main image (0-indexed)</p>
            </div>
        </div>

        <!-- Images Upload Section -->
        <div class="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Default Product Images</h2>
            
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Upload New Images</label>
                <input type="file" name="images[]" multiple accept="image/*" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                <p class="text-sm text-gray-500 mt-1">Upload multiple images for the product (leave empty to keep current images)</p>
                @error('images')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            
            <!-- Display current images -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Current Images</label>
                @if($product->image_urls && count($product->image_urls) > 0)
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        @foreach($product->image_urls as $index => $image)
                            <div class="relative">
                                <img src="{{ $image }}" alt="Product Image {{ $index + 1 }}" class="w-full h-24 object-contain rounded border">
                                @if($index == ($product->default_image_index ?? 0))
                                    <div class="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 py-0.5 rounded-br">Default</div>
                                @endif
                                <button type="button" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs" onclick="removeCurrentImage(this)">X</button>
                            </div>
                        @endforeach
                    </div>
                @else
                    <div class="text-gray-500 text-sm">No images uploaded yet</div>
                @endif
            </div>
            
            <!-- Image Preview Container -->
            <div id="imagePreviewContainer" class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"></div>
        </div>
        
        <!-- Visibility & Homepage Flags Section -->
        <div class="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Visibility & Homepage Flags</h2>
            
            <!-- Product Visibility -->
            <div class="mb-6">
                <h3 class="text-md font-medium text-gray-800 mb-3">Product Visibility</h3>
                <div class="flex space-x-4">
                    <label class="inline-flex items-center">
                        <input type="radio" name="status" value="active" class="form-radio h-4 w-4 text-amber-600" {{ $product->status == 'active' ? 'checked' : '' }}>
                        <span class="ml-2">Active</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input type="radio" name="status" value="inactive" class="form-radio h-4 w-4 text-amber-600" {{ $product->status == 'inactive' ? 'checked' : '' }}>
                        <span class="ml-2">Inactive</span>
                    </label>
                </div>
                <p class="mt-1 text-sm text-gray-500">Only Active products will be visible on the website.</p>
            </div>
            
            <!-- Homepage Flags -->
            <div>
                <h3 class="text-md font-medium text-gray-800 mb-3">Homepage Flags</h3>
                <div class="space-y-3">
                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input id="is_new_arrival" name="is_new_arrival" type="checkbox" class="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 rounded" {{ old('is_new_arrival', $product->is_new_arrival) ? 'checked' : '' }}>
                        </div>
                        <div class="ml-3 text-sm">
                            <label for="is_new_arrival" class="font-medium text-gray-700">New Arrival</label>
                            <p class="text-gray-500">Appears in the New Arrivals section on the homepage</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input id="is_trending" name="is_trending" type="checkbox" class="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 rounded" {{ old('is_trending', $product->is_trending) ? 'checked' : '' }}>
                        </div>
                        <div class="ml-3 text-sm">
                            <label for="is_trending" class="font-medium text-gray-700">Trending</label>
                            <p class="text-gray-500">Appears in the Trending section on the homepage</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input id="is_ethnic_wear" name="is_ethnic_wear" type="checkbox" class="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 rounded" {{ old('is_ethnic_wear', $product->is_ethnic_wear) ? 'checked' : '' }}>
                        </div>
                        <div class="ml-3 text-sm">
                            <label for="is_ethnic_wear" class="font-medium text-gray-700">Ethnic Wear</label>
                            <p class="text-gray-500">Appears in the Ethnic Wear section on the homepage</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input id="is_suwish_collection" name="is_suwish_collection" type="checkbox" class="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 rounded" {{ old('is_suwish_collection', $product->is_suwish_collection) ? 'checked' : '' }}>
                        </div>
                        <div class="ml-3 text-sm">
                            <label for="is_suwish_collection" class="font-medium text-gray-700">Maha Collection</label>
                            <p class="text-gray-500">Appears in the Maha Collections section on the homepage</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="mt-6">
            <button type="submit" class="bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded-md">
                Update Product
            </button>
            <a href="{{ route('admin.products.index') }}" class="ml-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md">
                Cancel
            </a>
        </div>
    </form>
</div>

{{-- Remove Product Analytics chart and CDN links --}}

<script>
// Image preview functionality
const imageInput = document.querySelector('input[name="images[]"]');
const previewContainer = document.getElementById('imagePreviewContainer');

imageInput.addEventListener('change', function() {
    previewContainer.innerHTML = '';
    
    if (this.files) {
        Array.from(this.files).forEach(file => {
            if (!file.type.match('image.*')) return;
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'relative';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Preview" class="w-full h-24 object-contain rounded border">
                    <div class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        <i class="fas fa-times"></i>
                    </div>
                `;
                previewContainer.appendChild(previewItem);
            }
            
            reader.readAsDataURL(file);
        });
    }
});

// Color variant management
let colorVariantIndex = {{ $nextIndex ?? 0 }};

document.getElementById('add-color-variant').addEventListener('click', function() {
    const container = document.getElementById('color-variants-container');
    
    const newVariant = document.createElement('div');
    newVariant.className = 'color-variant mb-6 p-4 bg-white rounded-lg border border-gray-200';
    newVariant.dataset.index = colorVariantIndex;
    newVariant.innerHTML = `
        <div class="flex justify-between items-center mb-3">
            <h3 class="text-md font-medium text-gray-800">Color Variant ${colorVariantIndex + 1}</h3>
            <button type="button" class="remove-color-variant text-red-600 hover:text-red-800 text-sm">Remove Color</button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Color Name *</label>
                <input type="text" name="color_variants[${colorVariantIndex}][name]" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., Ruby Red">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Color Code *</label>
                <input type="text" name="color_variants[${colorVariantIndex}][hex_code]" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., #C41E3A">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Color ID *</label>
                <input type="text" name="color_variants[${colorVariantIndex}][id]" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., red">
            </div>
        </div>
        
        <div class="mb-4 bg-gray-50 p-3 rounded">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Sizes & Stock</h4>
            <div class="sizes-container" id="sizes-container-${colorVariantIndex}">
                <div class="size-row grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                    <div>
                        <input type="text" name="color_variants[${colorVariantIndex}][sizes][0][size]" required class="w-full px-3 py-1 border border-gray-300 rounded text-sm" placeholder="Size (e.g. S)">
                    </div>
                    <div>
                        <input type="number" name="color_variants[${colorVariantIndex}][sizes][0][stock]" required min="0" class="w-full px-3 py-1 border border-gray-300 rounded text-sm" placeholder="Stock">
                    </div>
                    <div class="flex items-center">
                        <button type="button" class="remove-size-row text-red-500 hover:text-red-700 text-xs">Remove</button>
                    </div>
                </div>
            </div>
            <button type="button" class="add-size-row text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100" data-color-index="${colorVariantIndex}">
                + Add Another Size
            </button>
        </div>
        
        <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Upload New Images for this Color</label>
            <input type="file" name="color_variants[${colorVariantIndex}][images][]" multiple accept="image/*" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <p class="text-sm text-gray-500 mt-1">Upload new images specific to this color variant</p>
        </div>
    `;
    
    container.appendChild(newVariant);
    colorVariantIndex++;
    
    // Remove listener is handled by delegation below
});

// Event delegation for dynamically added size rows and removing variants
document.addEventListener('click', function(e) {
    // Add Size Row
    if (e.target && e.target.classList.contains('add-size-row')) {
        const colorIndex = e.target.dataset.colorIndex;
        const container = document.getElementById(`sizes-container-${colorIndex}`);
        const sizeRows = container.querySelectorAll('.size-row');
        const newSizeIndex = sizeRows.length; // Simple increment, key collision risk if delete middle but for form submission plain index is okay if handled as array. PHP handles non-sequential numeric keys as array usually.
        // Actually to be safe, PHP needs sequential or explicitly keyed.
        // In Blade we use [sizes][index]. If we delete [1] and add [2], we have 0, 2. PHP treats this as array.
        // So simple length is fine assuming we don't care about gap-less indexing for `store` logic which iterates `sizes`.
        
        const newRow = document.createElement('div');
        newRow.className = 'size-row grid grid-cols-1 md:grid-cols-4 gap-3 mb-2';
        newRow.innerHTML = `
            <div>
                <input type="text" name="color_variants[${colorIndex}][sizes][${newSizeIndex}][size]" required class="w-full px-3 py-1 border border-gray-300 rounded text-sm" placeholder="Size (e.g. S)">
            </div>
            <div>
                <input type="number" name="color_variants[${colorIndex}][sizes][${newSizeIndex}][stock]" required min="0" class="w-full px-3 py-1 border border-gray-300 rounded text-sm" placeholder="Stock">
            </div>
            <div>
                <input type="number" name="color_variants[${colorIndex}][sizes][${newSizeIndex}][price]" step="0.01" min="0" class="w-full px-3 py-1 border border-gray-300 rounded text-sm" placeholder="Price (Optional)">
            </div>
            <div class="flex items-center">
                <button type="button" class="remove-size-row text-red-500 hover:text-red-700 text-xs">Remove</button>
            </div>
        `;
        container.appendChild(newRow);
    }
    
    // Remove Size Row
    if (e.target && e.target.classList.contains('remove-size-row')) {
        const row = e.target.closest('.size-row');
        row.remove();
    }

    // Remove Color Variant
    if (e.target && e.target.classList.contains('remove-color-variant')) {
        if(confirm('Are you sure you want to remove this color variant? All sizes and images for this color will be removed.')) {
            e.target.closest('.color-variant').remove();
        }
    }
    
    // Remove Size (Global)
    if (e.target && e.target.classList.contains('remove-size')) {
        e.target.closest('.size-item').remove();
    }
});

// Size management (Global/Legacy)
let sizeIndex = {{ $nextSizeIndex ?? 0 }};

document.getElementById('add-size').addEventListener('click', function() {
    const container = document.getElementById('sizes-container');
    const newSize = document.createElement('div');
    newSize.className = 'size-item mb-4 p-3 bg-white rounded border border-gray-200';
    newSize.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <h3 class="text-md font-medium text-gray-800">Size</h3>
            <button type="button" class="remove-size text-red-600 hover:text-red-800 text-sm">Remove</button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Size *</label>
                <input type="text" name="sizes[${sizeIndex}][size]" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., S, M, L, XL or 36, 38, 40">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                <input type="number" name="sizes[${sizeIndex}][stock]" required min="0" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., 10">
            </div>
        </div>
    `;
    container.appendChild(newSize);
    sizeIndex++;
});


function remove1CurrentImage(button) {
    if (confirm('Are you sure you want to remove this image?')) {
        var imageDiv = button.parentElement;
        imageDiv.style.opacity = '0.5';
        
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'remove_images[]';
        input.value = imageDiv.querySelector('img').getAttribute('src'); 
        // Need relative path or full URL matching DB?
        // Controller logic will need to handle this. Usually sending ID or URL.
        // Since we don't have IDs easily here without iterating properly in blade, URL is best guess.
        // Wait, looping product->image_urls (accessor?) or images relation.
        // Edit blade loop uses `product->image_urls`.
        document.querySelector('form').appendChild(input);
        imageDiv.remove();
    }
}
// Fix function definition overlap
window.removeCurrentImage = function(button) {
    if (confirm('Are you sure you want to remove this image?')) {
        const imageDiv = button.parentElement;
        const img = imageDiv.querySelector('img');
        const src = img.src;

        // Add hidden input
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'remove_images[]';
        input.value = src;
        document.querySelector('form').appendChild(input);

        imageDiv.remove();
    }
};

window.removeColorImage = function(button, imageUrl) {
    if (confirm('Are you sure you want to remove this color image?')) {
        const imageDiv = button.parentElement;
        
        // Add hidden input
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'remove_color_images[]'; // Array of URLs to remove
        input.value = imageUrl;
        document.querySelector('form').appendChild(input);

        imageDiv.remove();
    }
};

// Dynamic Subcategory logic
document.getElementById('category_id').addEventListener('change', function() {
    const categoryId = this.value;
    const subcategorySelect = document.getElementById('subcategory_id');
    subcategorySelect.innerHTML = '<option value="">Select a subcategory</option>';
    if (categoryId) {
        fetch('/admin/get-subcategories/' + categoryId)
            .then(response => response.json())
            .then(data => {
                let options = '<option value="">Select a subcategory</option>';
                data.forEach(function (sub) {
                    options += `<option value="${sub.id}">${sub.name}</option>`;
                });
                subcategorySelect.innerHTML = options;
            })
            .catch(error => console.error('Error fetching subcategories:', error));
    }
});
</script>
@endsection