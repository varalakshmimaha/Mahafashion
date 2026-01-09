@extends('admin.layouts.app')

@section('title', 'Create Product')

@section('content')
<div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Create Product</h1>
    <p class="text-gray-600">Add a new product to your inventory</p>
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
    <form method="POST" action="{{ route('admin.products.store') }}" enctype="multipart/form-data">
        @csrf
        
        <!-- Basic Details Section -->
        <div class="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Basic Details</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input type="text" name="name" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter product name">
                    @error('name')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                    <input type="text" name="sku" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter unique SKU">
                    @error('sku')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select name="category_id" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="">Select a category</option>
                        @foreach($categories as $category)
                            <option value="{{ $category->id }}">{{ $category->name }}</option>
                        @endforeach
                    </select>
                    @error('category_id')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Default Color *</label>
                    <input type="text" name="color" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter default color name">
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
                    <input type="number" name="price" step="0.01" required min="0" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter price">
                    @error('price')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <input type="number" name="discount" min="0" max="100" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter discount percentage">
                    @error('discount')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                    <input type="number" name="stock_quantity" required min="0" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter stock quantity">
                    @error('stock_quantity')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
            </div>
            
            <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Fabric Type</label>
                <input type="text" name="fabric_type" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter fabric type">
                @error('fabric_type')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            
            <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea name="description" required rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter product description"></textarea>
                @error('description')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
        </div>
        
        <!-- Color-Specific Images and Stock Section -->
        <div class="mb-8 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <h2 class="text-lg font-semibold text-purple-800 mb-4">Color Variants</h2>
            <p class="text-sm text-gray-600 mb-4">Add different color variants with specific stock and images for each</p>
            
            <div id="color-variants-container">
                <div class="color-variant mb-6 p-4 bg-white rounded-lg border border-gray-200">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-md font-medium text-gray-800">Color Variant</h3>
                        <button type="button" class="remove-color-variant text-red-600 hover:text-red-800 text-sm">Remove</button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Color Name *</label>
                            <input type="text" name="color_variants[0][name]" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., Ruby Red">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Color Code *</label>
                            <input type="text" name="color_variants[0][hex_code]" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., #C41E3A">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Color ID *</label>
                            <input type="text" name="color_variants[0][id]" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., red">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                            <input type="number" name="color_variants[0][stock]" required min="0" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., 10">
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Upload Images for this Color</label>
                        <input type="file" name="color_variants[0][images][]" multiple accept="image/*" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <p class="text-sm text-gray-500 mt-1">Upload multiple images specific to this color variant</p>
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
            <p class="text-sm text-gray-600 mb-4">Add different sizes with specific stock quantities</p>
            
            <div id="sizes-container">
                <div class="size-item mb-4 p-3 bg-white rounded border border-gray-200">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="text-md font-medium text-gray-800">Size</h3>
                        <button type="button" class="remove-size text-red-600 hover:text-red-800 text-sm">Remove</button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Size *</label>
                            <input type="text" name="sizes[0][size]" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., S, M, L, XL or 36, 38, 40">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                            <input type="number" name="sizes[0][stock]" required min="0" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., 10">
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
                <input type="number" name="default_image_index" min="0" value="0" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter index of default image (0 for first image)">
                <p class="text-sm text-gray-500 mt-1">Specify which image in the uploaded list should be the default/main image (0-indexed)</p>
            </div>
        </div>

        <!-- Images Upload Section -->
        <div class="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Default Product Images</h2>
            
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Upload Images *</label>
                <input type="file" name="images[]" multiple accept="image/*" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                <p class="text-sm text-gray-500 mt-1">Upload multiple images for the product. At least one image is required.</p>
                @error('images')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
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
                        <input type="radio" name="status" value="active" class="form-radio h-4 w-4 text-amber-600" checked>
                        <span class="ml-2">Active</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input type="radio" name="status" value="inactive" class="form-radio h-4 w-4 text-amber-600">
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
                            <input id="is_new_arrival" name="is_new_arrival" type="checkbox" class="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 rounded">
                        </div>
                        <div class="ml-3 text-sm">
                            <label for="is_new_arrival" class="font-medium text-gray-700">New Arrival</label>
                            <p class="text-gray-500">Appears in the New Arrivals section on the homepage</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input id="is_trending" name="is_trending" type="checkbox" class="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 rounded">
                        </div>
                        <div class="ml-3 text-sm">
                            <label for="is_trending" class="font-medium text-gray-700">Trending</label>
                            <p class="text-gray-500">Appears in the Trending section on the homepage</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input id="is_ethnic_wear" name="is_ethnic_wear" type="checkbox" class="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 rounded">
                        </div>
                        <div class="ml-3 text-sm">
                            <label for="is_ethnic_wear" class="font-medium text-gray-700">Ethnic Wear</label>
                            <p class="text-gray-500">Appears in the Ethnic Wear section on the homepage</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input id="is_suwish_collection" name="is_suwish_collection" type="checkbox" class="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 rounded">
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
                Create Product
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
                    <img src="${e.target.result}" alt="Preview" class="w-full h-32 object-contain rounded border">
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
let colorVariantIndex = 1;

document.getElementById('add-color-variant').addEventListener('click', function() {
    const container = document.getElementById('color-variants-container');
    
    const newVariant = document.createElement('div');
    newVariant.className = 'color-variant mb-6 p-4 bg-white rounded-lg border border-gray-200';
    newVariant.innerHTML = `
        <div class="flex justify-between items-center mb-3">
            <h3 class="text-md font-medium text-gray-800">Color Variant</h3>
            <button type="button" class="remove-color-variant text-red-600 hover:text-red-800 text-sm">Remove</button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                <input type="number" name="color_variants[${colorVariantIndex}][stock]" required min="0" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., 10">
            </div>
        </div>
        
        <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Upload Images for this Color</label>
            <input type="file" name="color_variants[${colorVariantIndex}][images][]" multiple accept="image/*" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <p class="text-sm text-gray-500 mt-1">Upload multiple images specific to this color variant</p>
        </div>
    `;
    
    container.appendChild(newVariant);
    colorVariantIndex++;
    
    // Add event listener to the new remove button
    newVariant.querySelector('.remove-color-variant').addEventListener('click', function() {
        newVariant.remove();
    });
});

// Add event listeners to existing remove buttons
document.querySelectorAll('.remove-color-variant').forEach(button => {
    button.addEventListener('click', function() {
        this.closest('.color-variant').remove();
    });
});

// Size management
let sizeIndex = 1;

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
    
    // Add event listener to the new remove button
    newSize.querySelector('.remove-size').addEventListener('click', function() {
        newSize.remove();
    });
});

// Add event listeners to existing remove size buttons
document.querySelectorAll('.remove-size').forEach(button => {
    button.addEventListener('click', function() {
        this.closest('.size-item').remove();
    });
});
</script>
@endsection