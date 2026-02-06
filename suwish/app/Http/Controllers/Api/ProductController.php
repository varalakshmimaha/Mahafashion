<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'subcategory', 'pattern', 'images', 'variants'])->where('status', 'active');
        
        // Apply filters if provided
        // Category Filter (Supports array of IDs or Slugs)
        if ($request->filled('category')) {
            $categories = is_array($request->category) ? $request->category : explode(',', $request->category);
            $query->where(function($q) use ($categories) {
                $q->whereIn('category_id', $categories)
                  ->orWhereHas('category', function($sq) use ($categories) {
                      $sq->whereIn('slug', $categories);
                  });
            });
        }
        
        // Sub Category Filter
        if ($request->filled('sub_category')) {
            $subCategories = is_array($request->sub_category) ? $request->sub_category : explode(',', $request->sub_category);
            $query->where(function($q) use ($subCategories) {
                $q->whereIn('subcategory_id', $subCategories)
                  ->orWhereHas('subcategory', function($sq) use ($subCategories) {
                      $sq->whereIn('slug', $subCategories);
                  });
            });
        }

        // Price Range Filter
        if ($request->filled('price')) {
            $price = $request->price;
            if ($price === 'under_1000') {
                $query->where('price', '<=', 1000);
            } elseif ($price === '1000_5000') {
                $query->whereBetween('price', [1000, 5000]);
            } elseif ($price === '5000_10000') {
                $query->whereBetween('price', [5000, 10000]);
            } elseif ($price === 'above_10000') {
                $query->where('price', '>=', 10000);
            }
        }
        
        // Color Filter (No 0 or empty values)
        if ($request->filled('color')) {
            $colors = is_array($request->color) ? $request->color : explode(',', $request->color);
            $colors = array_filter($colors, function($c) {
                return !empty($c) && $c !== '0' && $c !== 0;
            });
            
            if (!empty($colors)) {
                $query->whereIn('color', $colors);
            }
        }
        
        // Fabric Filter
        if ($request->has('fabric')) {
            $fabrics = is_array($request->fabric) ? $request->fabric : explode(',', $request->fabric);
            $query->whereIn('fabric', $fabrics);
        }
        
        // Occasion Filter
        if ($request->has('occasion')) {
            $occasions = is_array($request->occasion) ? $request->occasion : explode(',', $request->occasion);
            $query->whereIn('occasion', $occasions);
        }
        
        // New filters based on homepage flags
        if ($request->has('is_new_arrival')) {
            $query->where('is_new_arrival', true);
        }
        
        if ($request->has('is_trending')) {
            $query->where('is_trending', true);
        }
        
        if ($request->has('is_ethnic_wear')) {
            $query->where('is_ethnic_wear', true);
        }
        
        if ($request->has('is_suwish_collection')) {
            $query->where('is_suwish_collection', true);
        }
        
        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        if ($request->filled('sort')) {
            switch($request->sort) {
                case 'price-low-high':
                    $sortBy = 'price'; $sortOrder = 'asc'; break;
                case 'price-high-low':
                    $sortBy = 'price'; $sortOrder = 'desc'; break;
                case 'name-asc':
                    $sortBy = 'name'; $sortOrder = 'asc'; break;
                case 'popularity':
                    $sortBy = 'created_at'; $sortOrder = 'desc'; break; // Fallback
                default:
                    $sortBy = 'created_at'; $sortOrder = 'desc';
            }
        }

        $query->orderBy($sortBy, $sortOrder);
        
        $products = $query->paginate($request->get('per_page', 12));
        
        return ProductResource::collection($products);
    }

    /**
     * Display a listing of the resource for admin (includes inactive).
     *
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function adminIndex(Request $request)
    {
        $query = Product::with(['category', 'subcategory', 'images', 'variants'])->orderBy('created_at', 'desc');
        
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }
        
        $products = $query->paginate($request->get('per_page', 20));
        
        return ProductResource::collection($products);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'sku' => 'required|unique:products,sku',
            'category_id' => 'required|exists:categories,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'color_images' => 'nullable|array',
            'color_images.*' => 'array',
            'color_images.*.*' => 'string',
            'is_new_arrival' => 'nullable|boolean',
            'is_trending' => 'nullable|boolean',
            'is_ethnic_wear' => 'nullable|boolean',
            'is_suwish_collection' => 'nullable|boolean',
            'package_contains' => 'nullable|string',
            'fit' => 'nullable|string',
            'origin' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $data = $request->except(['image', 'images']);

        // Handle boolean flags
        $data['status'] = $request->input('is_active', false) ? 'active' : 'inactive';
        $data['is_new_arrival'] = filter_var($request->input('is_new_arrival', false), FILTER_VALIDATE_BOOLEAN);
        $data['is_trending'] = filter_var($request->input('is_trending', false), FILTER_VALIDATE_BOOLEAN);
        $data['is_ethnic_wear'] = filter_var($request->input('is_ethnic_wear', false), FILTER_VALIDATE_BOOLEAN);
        $data['is_suwish_collection'] = filter_var($request->input('is_suwish_collection', false), FILTER_VALIDATE_BOOLEAN);

        if ($request->hasFile('image')) {
            $path = Storage::disk('public')->putFile('products', $request->file('image'));
            $data['image_url'] = $path;
        }

        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $file) {
                $path = Storage::disk('public')->putFile('products', $file);
                $imagePaths[] = $path;
            }
            $data['image_urls'] = $imagePaths;
        }
        
        // Handle color-specific images if provided
        if ($request->has('color_images')) {
            $colorImages = $request->input('color_images');
            if (is_array($colorImages)) {
                $colors = [];
                foreach ($colorImages as $colorId => $images) {
                    $colors[] = [
                        'id' => $colorId,
                        'name' => ucfirst(str_replace('-', ' ', $colorId)),
                        'hexCode' => '#808080', // Default color
                        'images' => $images
                    ];
                }
                $data['colors'] = $colors;
            }
        }
        
        $product = Product::create($data);
        
        return new ProductResource($product);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $product = Product::with(['category', 'subcategory', 'images', 'variants'])->findOrFail($id);
        
        return new ProductResource($product);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'sku' => 'sometimes|unique:products,sku,' . $id,
            'category_id' => 'sometimes|exists:categories,id',
            'subcategory_id' => 'nullable|exists:subcategories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'color_images' => 'nullable|array',
            'color_images.*' => 'array',
            'color_images.*.*' => 'string',
            'is_new_arrival' => 'nullable|boolean',
            'is_trending' => 'nullable|boolean',
            'is_ethnic_wear' => 'nullable|boolean',
            'is_suwish_collection' => 'nullable|boolean',
            'package_contains' => 'nullable|string',
            'fit' => 'nullable|string',
            'origin' => 'nullable|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $data = $request->except(['image', 'images']);

        // Handle boolean flags if present in the request
        if ($request->has('is_active')) {
            $data['status'] = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN) ? 'active' : 'inactive';
        }
        if ($request->has('is_new_arrival')) {
            $data['is_new_arrival'] = filter_var($request->input('is_new_arrival'), FILTER_VALIDATE_BOOLEAN);
        }
        if ($request->has('is_trending')) {
            $data['is_trending'] = filter_var($request->input('is_trending'), FILTER_VALIDATE_BOOLEAN);
        }
        if ($request->has('is_ethnic_wear')) {
            $data['is_ethnic_wear'] = filter_var($request->input('is_ethnic_wear'), FILTER_VALIDATE_BOOLEAN);
        }
        if ($request->has('is_suwish_collection')) {
            $data['is_suwish_collection'] = filter_var($request->input('is_suwish_collection'), FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($product->image_url) {
                Storage::disk('public')->delete($product->image_url);
            }

            $path = Storage::disk('public')->putFile('products', $request->file('image'));
            $data['image_url'] = $path;
        }

        if ($request->hasFile('images')) {
            // For simplicity, this example replaces existing gallery images.
            // You might want to add logic to merge or selectively delete images.
            $imagePaths = [];
            foreach ($request->file('images') as $file) {
                $path = Storage::disk('public')->putFile('products', $file);
                $imagePaths[] = $path;
            }
            
            // Assuming 'image_urls' is a casted array on the Product model.
            $existingImages = $product->image_urls ?? [];
            $data['image_urls'] = array_merge($existingImages, $imagePaths);
        }

        // Handle color-specific images if provided
        if ($request->has('color_images')) {
            $colorImages = $request->input('color_images');
            if (is_array($colorImages)) {
                $existingColors = is_array($product->colors) ? $product->colors : [];
                
                foreach ($colorImages as $colorId => $images) {
                    // Find the color in existing colors
                    $colorIndex = null;
                    foreach ($existingColors as $index => $existingColor) {
                        if ((is_string($existingColor) && $existingColor === $colorId) || 
                            (is_array($existingColor) && isset($existingColor['id']) && $existingColor['id'] === $colorId)) {
                            $colorIndex = $index;
                            break;
                        }
                    }
                    
                    if ($colorIndex !== null) {
                        // Update existing color with images
                        if (is_array($existingColors[$colorIndex])) {
                            $existingColors[$colorIndex]['images'] = array_merge(
                                $existingColors[$colorIndex]['images'] ?? [],
                                $images
                            );
                        }
                    } else {
                        // Add new color with images
                        $existingColors[] = [
                            'id' => $colorId,
                            'name' => ucfirst(str_replace('-', ' ', $colorId)),
                            'hexCode' => '#808080', // Default color
                            'images' => $images
                        ];
                    }
                }
                
                $data['colors'] = $existingColors;
            }
        }

        $product->update($data);
        
        return new ProductResource($product);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        
        return response()->json(null, 204);
    }
    
    /**
     * Get new arrival products
     */
    public function newArrivals()
    {
        $products = Product::with(['category', 'pattern'])
            ->where('status', 'active')
            ->where('is_new_arrival', true)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
            
        return ProductResource::collection($products);
    }
    
    /**
     * Get trending products
     */
    public function trending()
    {
        $products = Product::with(['category', 'pattern'])
            ->where('status', 'active')
            ->where('is_trending', true)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
            
        return ProductResource::collection($products);
    }
    
    /**
     * Get ethnic wear products
     */
    public function ethnicWear()
    {
        $products = Product::with(['category', 'pattern'])
            ->where('status', 'active')
            ->where('is_ethnic_wear', true)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json([
            'data' => ProductResource::collection($products)
        ]);
    }
    
    /**
     * Get Maha collection products
     */
    public function mahaCollection()
    {
        $products = Product::with(['category', 'pattern'])
            ->where('status', 'active')
            ->where('is_suwish_collection', true)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
            
        return ProductResource::collection($products);
    }
    
    /**
     * Upload product images
     */
    public function uploadImages(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'color_code' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_default' => 'nullable|boolean',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $uploadedImages = [];
        $colorCode = $request->input('color_code');
        $isDefault = $request->input('is_default', false);
        
        // Get the current max sort_order
        $maxSort = $product->images()->max('sort_order') ?? 0;
        
        foreach ($request->file('images') as $index => $file) {
            $path = Storage::disk('public')->putFile('products', $file);
            
            $imageData = [
                'product_id' => $product->id,
                'image_url' => $path,
                'color_code' => $colorCode,
                'sort_order' => $maxSort + $index + 1,
                'is_default' => $isDefault && $index === 0, // Only first image can be default
            ];
            
            $uploadedImages[] = $product->images()->create($imageData);
        }
        
        return response()->json([
            'message' => 'Images uploaded successfully',
            'images' => $uploadedImages
        ], 201);
    }
    
    /**
     * Delete a product image
     */
    public function deleteImage($id, $imageId)
    {
        $product = Product::findOrFail($id);
        $image = $product->images()->findOrFail($imageId);
        
        // Delete physical file from storage
        Storage::disk('public')->delete($image->image_url);
        
        $image->delete();
        
        return response()->json(['message' => 'Image deleted successfully']);
    }
    
    /**
     * Reorder product images
     */
    public function reorderImages(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'images' => 'required|array',
            'images.*.id' => 'required|integer|exists:product_images,id',
            'images.*.sort_order' => 'required|integer',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        foreach ($request->input('images') as $imageData) {
            $product->images()
                ->where('id', $imageData['id'])
                ->update(['sort_order' => $imageData['sort_order']]);
        }
        
        return response()->json(['message' => 'Images reordered successfully']);
    }
    
    /**
     * Create or update product variants
     */
    public function updateVariants(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'variants' => 'required|array',
            'variants.*.color_code' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'variants.*.color_name' => 'required|string|max:100',
            'variants.*.size' => 'required|string|max:20',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.price' => 'nullable|numeric|min:0',
            'variants.*.mrp' => 'nullable|numeric|min:0',
            'variants.*.discount' => 'nullable|numeric|min:0|max:100',
            'variants.*.price_adjustment' => 'nullable|numeric',
            'variants.*.sku' => 'nullable|string|max:100|unique:product_variants,sku',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $savedVariants = [];
        
        foreach ($request->input('variants') as $variantData) {
            $variant = $product->variants()->updateOrCreate(
                [
                    'product_id' => $product->id,
                    'color_code' => $variantData['color_code'],
                    'size' => $variantData['size'],
                ],
                [
                    'color_name' => $variantData['color_name'],
                    'stock' => $variantData['stock'],
                    'price' => $variantData['price'] ?? 0,
                    'mrp' => $variantData['mrp'] ?? 0,
                    'discount' => $variantData['discount'] ?? 0,
                    'price_adjustment' => $variantData['price_adjustment'] ?? 0,
                    'sku' => $variantData['sku'] ?? null,
                ]
            );
            
            $savedVariants[] = $variant;
        }
        
        return response()->json([
            'message' => 'Variants updated successfully',
            'variants' => $savedVariants
        ]);
    }
    
    /**
     * Delete a product variant
     */
    public function deleteVariant($id, $variantId)
    {
        $product = Product::findOrFail($id);
        $variant = $product->variants()->findOrFail($variantId);
        
        $variant->delete();
        
        return response()->json(['message' => 'Variant deleted successfully']);
    }
    
    /**
     * Check stock availability for a variant
     */
    public function checkStock(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'color_code' => 'required|string',
            'size' => 'required|string',
            'quantity' => 'required|integer|min:1',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $variant = $product->variants()
            ->where('color_code', $request->input('color_code'))
            ->where('size', $request->input('size'))
            ->first();
        
        if (!$variant) {
            return response()->json([
                'available' => false,
                'message' => 'Variant not found'
            ], 404);
        }
        
        $available = $variant->stock >= $request->input('quantity');
        
        return response()->json([
            'available' => $available,
            'stock' => $variant->stock,
            'message' => $available ? 'In stock' : 'Insufficient stock'
        ]);
    }
}