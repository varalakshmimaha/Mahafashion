<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;

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
            'color_variants' => 'nullable|array',
            'color_variants.*.name' => 'required|string|max:255',
            'color_variants.*.hex_code' => 'required|string|max:7',
            'color_variants.*.id' => 'required|string|max:255',
            'color_variants.*.stock' => 'required|integer|min:0',
            'color_variants.*.images' => 'nullable|array',
            'color_variants.*.images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'sizes' => 'nullable|array',
            'sizes.*.size' => 'required|string|max:255',
            'sizes.*.stock' => 'required|integer|min:0',
            'default_image_index' => 'nullable|integer|min:0',
        ]);

        $data = $request->only(['name', 'description', 'category_id', 'price', 'discount', 'stock_quantity', 'sku', 'fabric_type', 'brand', 'color', 'sizes', 'default_image_index']);
        
        // Handle product status
        $data['status'] = $request->status;

        // Handle homepage flags
        $data['is_trending'] = $request->has('is_trending') ? 1 : 0;
        $data['is_new_arrival'] = $request->has('is_new_arrival') ? 1 : 0;
        $data['is_ethnic_wear'] = $request->has('is_ethnic_wear') ? 1 : 0;
        $data['is_suwish_collection'] = $request->has('is_suwish_collection') ? 1 : 0;

        // Handle image uploads
        if ($request->hasFile('images')) {
            $imageUrls = [];
            foreach ($request->file('images') as $image) {
                if ($image->isValid()) {
                    $path = $image->store('products', 'public');
                    $imageUrls[] = $path;
                }
            }
            
            if (!empty($imageUrls)) {
                $data['image_urls'] = $imageUrls;  // Laravel will handle the JSON encoding via casting
                // Set the first image as the main image
                $data['image_url'] = $imageUrls[0];
            }
        }
        
        // Handle default image index
        if ($request->has('default_image_index')) {
            $data['default_image_index'] = $request->input('default_image_index', 0);
        }

        // Handle color-specific images and stock
        if ($request->has('color_variants')) {
            $colorVariants = [];
            foreach ($request->color_variants as $colorIndex => $colorData) {
                if (isset($colorData['name']) && isset($colorData['hex_code']) && isset($colorData['id']) && isset($colorData['stock'])) {
                    $colorVariant = [
                        'id' => $colorData['id'],
                        'name' => $colorData['name'],
                        'hexCode' => $colorData['hex_code'],
                        'stock' => $colorData['stock'],
                        'images' => [
                            'main' => null,
                            'gallery' => [],
                            'thumbnails' => [],
                        ]
                    ];

                    // Handle color-specific image uploads
                    if (isset($colorData['images']) && is_array($colorData['images'])) {
                        $colorImageUrls = [];
                        foreach ($colorData['images'] as $colorImage) {
                            if ($colorImage->isValid()) {
                                $path = $colorImage->store('products', 'public');
                                $colorImageUrls[] = $path;
                            }
                        }
                        
                                if (!empty($colorImageUrls)) {
                                    $colorVariant['images']['gallery'] = $colorImageUrls;
                                    $colorVariant['images']['main'] = $colorImageUrls[0];
                                    $colorVariant['images']['thumbnails'] = $colorImageUrls;
                                }
                    }

                    $colorVariants[] = $colorVariant;
                }
            }
            
            if (!empty($colorVariants)) {
                $data['colors'] = $colorVariants;
            }
        }

        Product::create($data);

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function show(Product $product)
    {
        return view('admin.products.show', compact('product'));
    }

    public function edit(Product $product)
    {
        $categories = Category::all();
        $patterns = \App\Models\ProductPattern::all();
        return view('admin.products.edit', compact('product', 'categories', 'patterns'));
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
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
            'color_variants.*.name' => 'required|string|max:255',
            'color_variants.*.hex_code' => 'required|string|max:7',
            'color_variants.*.id' => 'required|string|max:255',
            'color_variants.*.stock' => 'required|integer|min:0',
            'color_variants.*.images' => 'nullable|array',
            'color_variants.*.images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'sizes' => 'nullable|array',
            'sizes.*.size' => 'required|string|max:255',
            'sizes.*.stock' => 'required|integer|min:0',
            'default_image_index' => 'nullable|integer|min:0',
        ]);

        $data = $request->only(['name', 'description', 'category_id', 'price', 'discount', 'stock_quantity', 'sku', 'fabric_type', 'brand', 'color', 'sizes', 'default_image_index']);
        
        // Handle product status
        $data['status'] = $request->status;

        // Handle homepage flags
        $data['is_trending'] = $request->has('is_trending') ? 1 : 0;
        $data['is_new_arrival'] = $request->has('is_new_arrival') ? 1 : 0;
        $data['is_ethnic_wear'] = $request->has('is_ethnic_wear') ? 1 : 0;
        $data['is_suwish_collection'] = $request->has('is_suwish_collection') ? 1 : 0;

        // Handle image uploads
        if ($request->hasFile('images')) {
            $imageUrls = [];
            foreach ($request->file('images') as $image) {
                if ($image->isValid()) {
                    $path = $image->store('products', 'public');
                    $imageUrls[] = $path;
                }
            }
            
            if (!empty($imageUrls)) {
                // Use the model accessor which guarantees array output
                $existingImages = $product->image_urls;
                if (!is_array($existingImages)) {
                    $existingImages = [];
                }

                $allImages = array_merge($existingImages, $imageUrls);
                $data['image_urls'] = $allImages;  // Laravel will handle the JSON encoding via casting

                // Set the first image as the main image if not already set
                if (empty($product->image_url) && !empty($allImages)) {
                    $data['image_url'] = $allImages[0];
                }
            }
        }
        
        // Handle default image index
        if ($request->has('default_image_index')) {
            $data['default_image_index'] = $request->input('default_image_index', 0);
        }

        // Handle color-specific images and stock
        if ($request->has('color_variants')) {
            $colorVariants = [];
            foreach ($request->color_variants as $colorIndex => $colorData) {
                if (isset($colorData['name']) && isset($colorData['hex_code']) && isset($colorData['id']) && isset($colorData['stock'])) {
                    $colorVariant = [
                        'id' => $colorData['id'],
                        'name' => $colorData['name'],
                        'hexCode' => $colorData['hex_code'],
                        'stock' => $colorData['stock'],
                        'images' => [
                            'main' => null,
                            'gallery' => [],
                            'thumbnails' => [],
                        ]
                    ];

                    // Handle color-specific image uploads
                    if (isset($colorData['images']) && is_array($colorData['images'])) {
                        $colorImageUrls = [];
                        foreach ($colorData['images'] as $colorImage) {
                            if ($colorImage->isValid()) {
                                $path = $colorImage->store('products', 'public');
                                $colorImageUrls[] = $path;
                            }
                        }
                        
                        if (!empty($colorImageUrls)) {
                            $colorVariant['images']['gallery'] = $colorImageUrls;
                            $colorVariant['images']['main'] = $colorImageUrls[0];
                            $colorVariant['images']['thumbnails'] = $colorImageUrls;
                        }
                    }

                    $colorVariants[] = $colorVariant;
                }
            }
            
            if (!empty($colorVariants)) {
                $data['colors'] = $colorVariants;
            }
        }

        $product->update($data);

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
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
}