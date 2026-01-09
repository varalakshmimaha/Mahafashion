@extends('admin.layouts.app')

@section('title', 'Edit Product')

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
    <form method="POST" action="{{ route('admin.products.update', $product) }}" enctype="multipart/form-data">
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
                    <select name="category_id" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
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
                @if($product->colors && is_array($product->colors) && count($product->colors) > 0)
                    @foreach($product->colors as $index => $colorData)
                    <div class="color-variant mb-6 p-4 bg-white rounded-lg border border-gray-200">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="text-md font-medium text-gray-800">Color Variant {{ $index + 1 }}</h3>
                            <button type="button" class="remove-color-variant text-red-600 hover:text-red-800 text-sm">Remove</button>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Color Name *</label>
                                <input type="text" name="color_variants[{{ $index }}][name]" required value="{{ $colorData['name'] ?? old('color_variants.'.$index.'.name') }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., Ruby Red">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Color Code *</label>
                                <input type="text" name="color_variants[{{ $index }}][hex_code]" required value="{{ $colorData['hexCode'] ?? old('color_variants.'.$index.'.hex_code') }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., #C41E3A">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Color ID *</label>
                                <input type="text" name="color_variants[{{ $index }}][id]" required value="{{ $colorData['id'] ?? old('color_variants.'.$index.'.id') }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., red">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                                <input type="number" name="color_variants[{{ $index }}][stock]" required min="0" value="{{ $colorData['stock'] ?? old('color_variants.'.$index.'.stock') ?? 0 }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., 10">
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Upload New Images for this Color</label>
                            <input type="file" name="color_variants[{{ $index }}][images][]" multiple accept="image/*" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                            <p class="text-sm text-gray-500 mt-1">Upload new images specific to this color variant (existing images will be preserved)</p>
                        </div>
                        
                        @if(isset($colorData['images']) && isset($colorData['images']['gallery']))
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Current Images for {{ $colorData['name'] ?? 'this color' }}</label>
                            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                @foreach($colorData['images']['gallery'] as $imgIndex => $image)
                                <div class="relative">
                                    <img src="{{ $image }}" alt="Color Image {{ $imgIndex + 1 }}" class="w-full h-24 object-contain rounded border">
                                    <button type="button" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs" onclick="removeColorImage(this, '{{ $image }}')">X</button>
                                </div>
                                @endforeach
                            </div>
                        </div>
                        @endif
                    </div>
                    @endforeach
                    @php
                        $nextIndex = count($product->colors);
                    @endphp
                @else
                    @php
                        $nextIndex = 0;
                    @endphp
                @endif
                
                <!-- Empty template for new color variants -->
                <div id="color-variant-template" class="hidden">
                    <div class="color-variant mb-6 p-4 bg-white rounded-lg border border-gray-200">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="text-md font-medium text-gray-800">Color Variant</h3>
                            <button type="button" class="remove-color-variant text-red-600 hover:text-red-800 text-sm">Remove</button>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Color Name *</label>
                                <input type="text" name="color_variants[INDEX][name]" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., Ruby Red">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Color Code *</label>
                                <input type="text" name="color_variants[INDEX][hex_code]" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., #C41E3A">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Color ID *</label>
                                <input type="text" name="color_variants[INDEX][id]" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., red">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                                <input type="number" name="color_variants[INDEX][stock]" required min="0" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., 10">
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Upload Images for this Color</label>
                            <input type="file" name="color_variants[INDEX][images][]" multiple accept="image/*" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                            <p class="text-sm text-gray-500 mt-1">Upload images specific to this color variant</p>
                        </div>
                    </div>
                </div>
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
                
                <!-- Empty template for new sizes -->
                <div id="size-template" class="hidden">
                    <div class="size-item mb-4 p-3 bg-white rounded border border-gray-200">
                        <div class="flex justify-between items-center mb-2">
                            <h3 class="text-md font-medium text-gray-800">Size</h3>
                            <button type="button" class="remove-size text-red-600 hover:text-red-800 text-sm">Remove</button>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Size *</label>
                                <input type="text" name="sizes[INDEX][size]" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., S, M, L, XL or 36, 38, 40">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                                <input type="number" name="sizes[INDEX][stock]" required min="0" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., 10">
                            </div>
                        </div>
                    </div>
                </div>
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
let colorVariantIndex = <?php echo $nextIndex ?? 0; ?>;

document.getElementById('add-color-variant').addEventListener('click', function() {
    const container = document.getElementById('color-variants-container');
    const template = document.getElementById('color-variant-template');
    const newVariant = template.innerHTML.replace(/INDEX/g, colorVariantIndex);
    
    const newVariantElement = document.createElement('div');
    newVariantElement.innerHTML = newVariant;
    newVariantElement.className = 'color-variant mb-6 p-4 bg-white rounded-lg border border-gray-200';
    
    container.appendChild(newVariantElement.firstElementChild);
    colorVariantIndex++;
    
    // Add event listener to the new remove button
    document.querySelector('.color-variant:last-child .remove-color-variant').addEventListener('click', function() {
        this.closest('.color-variant').remove();
    });
});

// Add event listeners to existing remove buttons
document.querySelectorAll('.remove-color-variant').forEach(button => {
    button.addEventListener('click', function() {
        this.closest('.color-variant').remove();
    });
});

// Size management
let sizeIndex = <?php echo $nextSizeIndex ?? 0; ?>;

document.getElementById('add-size').addEventListener('click', function() {
    const container = document.getElementById('sizes-container');
    const template = document.getElementById('size-template');
    const newSize = template.innerHTML.replace(/INDEX/g, sizeIndex);
    
    const newSizeElement = document.createElement('div');
    newSizeElement.innerHTML = newSize;
    newSizeElement.className = 'size-item mb-4 p-3 bg-white rounded border border-gray-200';
    
    container.appendChild(newSizeElement.firstElementChild);
    sizeIndex++;
    
    // Add event listener to the new remove button
    document.querySelector('.size-item:last-child .remove-size').addEventListener('click', function() {
        this.closest('.size-item').remove();
    });
});

// Add event listeners to existing remove size buttons
document.querySelectorAll('.remove-size').forEach(button => {
    button.addEventListener('click', function() {
        this.closest('.size-item').remove();
    });
});

function removeCurrentImage(button) {
    // This function would handle removing current images
    // Implementation would depend on how you want to handle image deletion
    // For now, we'll just remove the image element visually
    if (confirm('Are you sure you want to remove this image?')) {
        var imageDiv = button.parentElement;
        imageDiv.style.opacity = '0.5';
        imageDiv.style.pointerEvents = 'none';
        
        // You can add a hidden input to mark this image for deletion
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'remove_images[]';
        input.value = imageDiv.querySelector('img').src; // This would need to be the actual image path
        document.querySelector('form').appendChild(input);
    }
}

function removeColorImage(button, imageUrl) {
    if (confirm('Are you sure you want to remove this color image?')) {
        var imageDiv = button.parentElement;
        imageDiv.style.opacity = '0.5';
        imageDiv.style.pointerEvents = 'none';
        
        // Add hidden input to mark this color image for deletion
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'remove_color_images[]';
        input.value = imageUrl;
        document.querySelector('form').appendChild(input);
    }
}
</script>
@endsection