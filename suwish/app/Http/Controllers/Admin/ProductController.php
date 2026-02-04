<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Log;
use App\Models\ProductImage;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ProductExport;
use App\Imports\ProductImport;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->paginate(10);
        return view('admin.products.index', compact('products'));
    }

    public function create()
    {
        $categories = Category::all();
        // Since we're hiding pattern information, we can still pass patterns for internal use if needed
        // but we won't be using them in the form anymore
        $patterns = \App\Models\ProductPattern::all();
        return view('admin.products.create', compact('categories', 'patterns'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'nullable|exists:subcategories,id',
            'price' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:100',
            'stock_quantity' => 'required|integer|min:0',
            'sku' => 'required|string|max:255|unique:products',
            'fabric_type' => 'nullable|string|max:255',
            'brand' => 'nullable|string|max:255',
            'color' => 'required|string|max:255',
            'status' => 'required|in:active,inactive',
            'images' => 'required|array|min:1',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_trending' => 'nullable|in:1,0,true,false,on,off,1.0,0.0',
            'is_new_arrival' => 'nullable|in:1,0,true,false,on,off,1.0,0.0',
            'is_ethnic_wear' => 'nullable|in:1,0,true,false,on,off,1.0,0.0',
            'is_suwish_collection' => 'nullable|in:1,0,true,false,on,off,1.0,0.0',
            
            // New Basic Specs
            'package_contains' => 'nullable|string|max:255',
            'fit' => 'nullable|string|max:100',
            'origin' => 'nullable|string|max:100',
            
            // Validate nested structure
            'color_variants' => 'nullable|array',
            'color_variants.*.name' => 'required_with:color_variants.*|string|max:255',
            'color_variants.*.hex_code' => 'required_with:color_variants.*|string|max:7',
            'color_variants.*.id' => 'required_with:color_variants.*|string|max:255',
            'color_variants.*.sizes' => 'required_with:color_variants.*|array',
            'color_variants.*.sizes.*.size' => 'required|string|max:255',
            'color_variants.*.sizes.*.stock' => 'required|integer|min:0',
            'color_variants.*.sizes.*.price' => 'nullable|numeric|min:0',
            'color_variants.*.images' => 'nullable|array',
            'color_variants.*.images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            
            'sizes' => 'nullable|array',
            'sizes.*.size' => 'required_with:sizes.*|string|max:255',
            'sizes.*.stock' => 'required_with:sizes.*|integer|min:0',
            'default_image_index' => 'nullable|integer|min:0',
        ]);

        $data = $request->only([
            'name', 'description', 'category_id', 'subcategory_id', 'price', 
            'discount', 'stock_quantity', 'sku', 'fabric_type', 'brand', 
            'color', 'sizes', 'default_image_index',
            'package_contains', 'fit', 'origin'
        ]);
        
        // Handle product status
        $data['status'] = $request->status;

        // Handle homepage flags
        $data['is_trending'] = $request->has('is_trending') ? 1 : 0;
        $data['is_new_arrival'] = $request->has('is_new_arrival') ? 1 : 0;
        $data['is_ethnic_wear'] = $request->has('is_ethnic_wear') ? 1 : 0;
        $data['is_suwish_collection'] = $request->has('is_suwish_collection') ? 1 : 0;

        // Populate deprecated color fields
        if ($request->has('color_variants') && is_array($request->color_variants) && count($request->color_variants) > 0) {
            $legacyColors = [];
            foreach ($request->color_variants as $cv) {
                if (isset($cv['id'])) {
                    $legacyColors[] = [
                        'id' => $cv['id'],
                        'name' => $cv['name'],
                        'hexCode' => $cv['hex_code'],
                        'images' => [] 
                    ];
                }
            }
            $data['colors'] = $legacyColors;
        }

        $product = Product::create($data);
        
        // 1. Handle Main/Default Images Upload (For generic display)
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $image) {
                if ($image->isValid()) {
                    $path = $image->store('products', 'public');
                    
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => $path,
                        'sort_order' => $i,
                        'is_default' => $i === (int)$request->input('default_image_index', 0),
                        'color_code' => null
                    ]);
                }
            }
        }

        // 2. Handle Color Variants with Direct Image Uploads
        if ($request->has('color_variants')) {
            foreach ($request->color_variants as $index => $variantData) {
                if (!isset($variantData['id'])) continue;

                $colorId = $variantData['id']; 
                $colorCode = $variantData['hex_code'];
                $colorName = $variantData['name'];
                
                // 2a. Create Variant Stock/Sizes
                if (isset($variantData['sizes']) && is_array($variantData['sizes'])) {
                    foreach ($variantData['sizes'] as $sizeData) {
                        \App\Models\ProductVariant::create([
                            'product_id' => $product->id,
                            'color_code' => $colorCode, // Use Hex or ID? Should match logic. Frontend variants usually use Hex or ID.
                            // The model expects color_code to serve as the key.
                            'color_name' => $colorName,
                            'size' => $sizeData['size'],
                            'stock' => $sizeData['stock'],
                            'price' => $sizeData['price'] ?? $product->price,
                            'sku' => $product->sku . '-' . $colorId . '-' . $sizeData['size']
                        ]);
                    }
                }

                // 2b. Upload and Associate Images for this Variant
                if (isset($variantData['images']) && is_array($variantData['images'])) {
                    foreach ($variantData['images'] as $vIndex => $vImage) {
                         if ($vImage->isValid()) {
                            $path = $vImage->store('products', 'public');
                            ProductImage::create([
                                'product_id' => $product->id,
                                'image_url' => $path,
                                'sort_order' => $vIndex,
                                'is_default' => false,
                                'color_code' => $colorCode
                            ]);
                        }
                    }
                }
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $categories = Category::all();
        $patterns = \App\Models\ProductPattern::all();
        // Load subcategories for the product's category
        $subcategories = [];
        if ($product->category_id) {
            $subcategories = \App\Models\Subcategory::where('category_id', $product->category_id)->get();
        }

        // Eager load variants and images
        $product->load(['variants', 'images']);

        // Group variants by HEX CODE to ensure Images (linked by Hex) and Variants (linked by Hex) merge correctly.
        $groupedVariants = [];

        // 1. Initialize from legacy 'colors' JSON to get Metadata (Name, Hex, ID)
        if ($product->colors && is_array($product->colors)) {
            foreach ($product->colors as $color) {
                // $color structure: ['id' => 'red', 'name' => 'Red', 'hexCode' => '#F00', ...]
                // Use Hex as key if available, else ID
                $key = isset($color['hexCode']) ? strtolower($color['hexCode']) : (isset($color['id']) ? $color['id'] : 'default');
                
                $groupedVariants[$key] = [
                    'id' => $color['id'] ?? 'unknown',
                    'name' => $color['name'],
                    'hex_code' => $color['hexCode'] ?? '',
                    'sizes' => [], 
                    'images' => [
                        'gallery' => []
                    ]
                ];
                
                // Keep legacy stock/size if DB variants are empty (backward compatibility)
                if ($product->variants->isEmpty()) {
                    $legacyStock = isset($color['stock']) ? $color['stock'] : 0;
                    $legacySize = isset($color['size']) ? $color['size'] : null;
                    if ($legacySize || $legacyStock > 0) {
                        $groupedVariants[$key]['sizes'][] = [
                            'size' => $legacySize,
                            'stock' => $legacyStock
                        ];
                    }
                }
            }
        }

        // 2. Process database variants (Overrides legacy sizes)
        if ($product->variants && $product->variants->count() > 0) {
            foreach ($product->variants as $variant) {
                $hex = strtolower($variant->color_code); 
                
                // If this variant exists in DB but not in JSON (or key mismatch), create or merge
                if (!isset($groupedVariants[$hex])) {
                    $groupedVariants[$hex] = [
                        'id' => $hex, // Fallback ID
                        'name' => $variant->color_name,
                        'hex_code' => $variant->color_code,
                        'sizes' => [],
                        'images' => ['gallery' => []]
                    ];
                }

                $groupedVariants[$hex]['sizes'][] = [
                    'size' => $variant->size,
                    'stock' => $variant->stock,
                    'price' => $variant->price 
                ];
            }
        } 

        // 3. Attach Images to grouped variants
        if ($product->images && $product->images->count() > 0) {
            foreach ($product->images as $img) {
                // Image color_code is Hex
                if ($img->color_code) {
                    $imgHex = strtolower($img->color_code);
                    if (isset($groupedVariants[$imgHex])) {
                        $groupedVariants[$imgHex]['images']['gallery'][] = asset('storage/' . $img->image_url);
                    }
                }
            }
        }
        
        // Convert keyed array to indexed array for view
        $productColorVariants = array_values($groupedVariants);

        return view('admin.products.edit', compact('product', 'categories', 'patterns', 'subcategories', 'productColorVariants'));
    }

    public function update(Request $request, Product $product)
    {
        // Clean empty color_variants and sizes before validation
        $data = $request->all();
        // ... (existing cleaning logic optional or can be improved)

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'nullable|exists:subcategories,id',
            'price' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:100',
            'stock_quantity' => 'required|integer|min:0',
            'sku' => 'required|string|max:255|unique:products,sku,' . $product->id,
            'fabric_type' => 'nullable|string|max:255',
            'brand' => 'nullable|string|max:255',
            'color' => 'required|string|max:255',
            'status' => 'required|in:active,inactive',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_trending' => 'nullable|in:1,0,true,false,on,off,1.0,0.0',
            'is_new_arrival' => 'nullable|in:1,0,true,false,on,off,1.0,0.0',
            'is_ethnic_wear' => 'nullable|in:1,0,true,false,on,off,1.0,0.0',
            'is_suwish_collection' => 'nullable|in:1,0,true,false,on,off,1.0,0.0',
            
            'color_variants' => 'nullable|array',
            'color_variants.*.name' => 'required_with:color_variants.*|string|max:255',
            'color_variants.*.hex_code' => 'required_with:color_variants.*|string|max:7',
            'color_variants.*.id' => 'required_with:color_variants.*|string|max:255',
            'color_variants.*.sizes' => 'required_with:color_variants.*|array',
            'color_variants.*.sizes.*.size' => 'required|string|max:255',
            'color_variants.*.sizes.*.stock' => 'required|integer|min:0',
            'color_variants.*.images' => 'nullable|array',
            'color_variants.*.images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            
            'sizes' => 'nullable|array',
            'sizes.*.size' => 'required_with:sizes.*|string|max:255',
            'sizes.*.stock' => 'required_with:sizes.*|integer|min:0',
            'default_image_index' => 'nullable|integer|min:0',
        ]);

        $data = $request->only(['name', 'description', 'category_id', 'subcategory_id', 'price', 'discount', 'stock_quantity', 'sku', 'fabric_type', 'brand', 'color', 'sizes', 'default_image_index']);
        
        // Handle product status
        $data['status'] = $request->status;

        // Handle homepage flags
        $data['is_trending'] = $request->has('is_trending') ? 1 : 0;
        $data['is_new_arrival'] = $request->has('is_new_arrival') ? 1 : 0;
        $data['is_ethnic_wear'] = $request->has('is_ethnic_wear') ? 1 : 0;
        $data['is_suwish_collection'] = $request->has('is_suwish_collection') ? 1 : 0;

        // 1. Update Product Details
        // Update deprecated/legacy colors JSON using first variant
        if ($request->has('color_variants') && is_array($request->color_variants)) {
            $legacyColors = [];
            foreach ($request->color_variants as $cv) {
                if (isset($cv['id'])) {
                    $legacyColors[] = [
                        'id' => $cv['id'],
                        'name' => $cv['name'],
                        'hexCode' => $cv['hex_code'],
                        'images' => [] // Images handled via relation
                    ];
                }
            }
            $data['colors'] = $legacyColors;
        }

        $product->update($data);

        // 2. Handle Image Deletions
        $imagesToRemove = array_merge(
            $request->input('remove_images', []),
            $request->input('remove_color_images', [])
        );
        
        if (!empty($imagesToRemove)) {
            foreach ($imagesToRemove as $url) {
                // Extract relative path from URL
                // URL: http://host/storage/products/foo.jpg -> products/foo.jpg
                $relativePath = str_replace(asset('storage/'), '', $url);
                // Also handle simplified case if asset() returns different host
                $relativePath = ltrim(parse_url($url, PHP_URL_PATH), '/storage/'); // basic attempt
                // Robust match:
                // Find image by strict URL matching might fail if domain differs slightly. 
                // Let's try matching the end of the string.
                // Or just assume standard storage path.
                
                // Let's use a broader query to find the image record
                // Since we don't have the ID, we search by path suffix?
                // Or better: $relativePath = str_replace(url('/storage') . '/', '', $url);
                
                // For now, let's try the direct replace logic which works for standard setups
                $path = str_replace(asset('storage') . '/', '', $url);
                
                $img = ProductImage::where('product_id', $product->id)->where('image_url', $path)->first();
                if ($img) {
                    // Delete file from storage
                    \Storage::disk('public')->delete($img->image_url);
                    $img->delete();
                }
            }
        }

        // 3. Handle Main Image Uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                if ($image->isValid()) {
                    $path = $image->store('products', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => $path,
                        'sort_order' => $product->images()->count(),
                        'is_default' => $product->images()->where('is_default', true)->doesntExist(),
                        'color_code' => null
                    ]);
                }
            }
        }
        
        // 4. Sync Variants
        // Delete existing variants
        \App\Models\ProductVariant::where('product_id', $product->id)->delete();

        // Recreate variants
        $colorVariants = [];
        if ($request->has('color_variants')) {
            foreach ($request->color_variants as $index => $variantData) {
                if (!isset($variantData['hex_code'])) continue;

                $colorCode = $variantData['hex_code'];
                $colorName = $variantData['name'];
                
                // 4a. Create Variant Records (Size + Stock + Price)
                if (isset($variantData['sizes']) && is_array($variantData['sizes'])) {
                    foreach ($variantData['sizes'] as $sizeData) {
                        \App\Models\ProductVariant::create([
                            'product_id' => $product->id,
                            'color_code' => $colorCode,
                            'color_name' => $colorName,
                            'size' => $sizeData['size'],
                            'stock' => $sizeData['stock'],
                            'price' => isset($sizeData['price']) && $sizeData['price'] > 0 ? $sizeData['price'] : null,
                            'price_adjustment' => 0,
                            'sku' => $product->sku . '-' . $variantData['id'] . '-' . $sizeData['size']
                        ]);
                    }
                }

                // 4b. Handle New Color-Specific Images
                if ($request->hasFile("color_variants.$index.images")) {
                    foreach ($request->file("color_variants.$index.images") as $imgIndex => $image) {
                        if ($image->isValid()) {
                            $path = $image->store('products', 'public');
                            ProductImage::create([
                                'product_id' => $product->id,
                                'image_url' => $path,
                                'sort_order' => $product->images()->count(), // Append to end
                                'is_default' => false,
                                'color_code' => $colorCode
                            ]);
                        }
                    }
                }
                
                // Build array for JSON structure if needed (already handled by $data['colors'] above)
                $colorVariants[] = [
                    'id' => $variantData['id'],
                    'name' => $colorName,
                    'hexCode' => $colorCode,
                    'stock' => 0, // aggregated? Not vital for JSON if variants table used
                ];
            }
        }
        
        // Optional: Update default image from index if provided?
        // Logic for default index is usually for Create. For Update, user manages images directly.

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function show(Product $product)
    {
        // Eager load relationships for the product details page
        $product->load(['category', 'subcategory', 'images', 'variants']);
        return view('admin.products.show', compact('product'));
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }

    public function toggleStatus(Product $product)
    {
        $newStatus = $product->status === 'active' ? 'inactive' : 'active';
        $product->update(['status' => $newStatus]);

        return response()->json(['success' => true, 'status' => $product->status]);
    }

    public function toggleTrending(Product $product)
    {
        $product->update(['is_trending' => !$product->is_trending]);

        return response()->json(['success' => true, 'is_trending' => $product->is_trending]);
    }

    public function toggleNewArrival(Product $product)
    {
        $product->update(['is_new_arrival' => !$product->is_new_arrival]);

        return response()->json(['success' => true, 'is_new_arrival' => $product->is_new_arrival]);
    }

    public function getSubcategories($category_id)
    {
        $subcategories = \App\Models\Subcategory::where('category_id', $category_id)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'is_active']);
            
        return response()->json($subcategories);
    }

    /**
     * Export products to Excel
     */
    public function export()
    {
        return Excel::download(new ProductExport, 'products_' . date('Y-m-d_H-i-s') . '.xlsx');
    }

    /**
     * Import products from Excel
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240'
        ]);

        try {
            Excel::import(new ProductImport, $request->file('file'));

            return redirect()->route('admin.products.index')
                ->with('success', 'Products imported successfully!');
        } catch (\Exception $e) {
            Log::error('Product import failed: ' . $e->getMessage());
            return redirect()->route('admin.products.index')
                ->with('error', 'Import failed: ' . $e->getMessage());
        }
    }

    /**
     * Bulk delete products
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:products,id'
        ]);

        try {
            $deletedCount = Product::whereIn('id', $request->ids)->delete();

            return response()->json([
                'success' => true,
                'message' => "{$deletedCount} product(s) deleted successfully!"
            ]);
        } catch (\Exception $e) {
            Log::error('Bulk delete failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete products: ' . $e->getMessage()
            ], 500);
        }
    }
}