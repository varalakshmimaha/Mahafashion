<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

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
        $query = Product::with(['category', 'pattern', 'images', 'variants'])->where('status', 'active');
        
        // Apply filters if provided
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        
        if ($request->has('min_price') || $request->has('max_price')) {
            if ($request->has('min_price')) {
                $query->where('price', '>=', $request->min_price);
            }
            if ($request->has('max_price')) {
                $query->where('price', '<=', $request->max_price);
            }
        }
        
        if ($request->has('fabric')) {
            $query->where('fabric', $request->fabric);
        }
        
        if ($request->has('color')) {
            $query->where('color', $request->color);
        }
        
        if ($request->has('occasion')) {
            $query->where('occasion', $request->occasion);
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
        
        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
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
        $query = Product::with(['category', 'images', 'variants'])->orderBy('created_at', 'desc');
        
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
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $data = $request->except(['image', 'images']);

        // Handle is_active to status conversion
        if ($request->has('is_active')) {
            $data['status'] = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN) ? 'active' : 'inactive';
            unset($data['is_active']);
        }

        if ($request->hasFile('image')) {
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('products'), $imageName);
            $data['image_url'] = 'products/' . $imageName;
        }

        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $file) {
                $imageName = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('products'), $imageName);
                $imagePaths[] = 'products/' . $imageName;
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
        $product = Product::with(['category', 'images', 'variants'])->findOrFail($id);
        
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'color_images' => 'nullable|array',
            'color_images.*' => 'array',
            'color_images.*.*' => 'string',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $data = $request->except(['image', 'images']);

        // Handle is_active to status conversion
        if ($request->has('is_active')) {
            $data['status'] = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN) ? 'active' : 'inactive';
            unset($data['is_active']);
        }

        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($product->image_url && file_exists(public_path($product->image_url))) {
                unlink(public_path($product->image_url));
            }

            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('products'), $imageName);
            $data['image_url'] = 'products/' . $imageName;
        }

        if ($request->hasFile('images')) {
            // Merge with existing images if they exist
            $existingImages = is_array($product->image_urls) ? $product->image_urls : [];
            
            $imagePaths = [];
            foreach ($request->file('images') as $file) {
                $imageName = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('products'), $imageName);
                $imagePaths[] = 'products/' . $imageName;
            }
            
            $allImages = array_merge($existingImages, $imagePaths);
            $data['image_urls'] = $allImages;
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
            ->limit(10)
            ->get();
            
        return ProductResource::collection($products);
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
            $imageName = time() . '_' . uniqid() . '.' . $file->extension();
            $file->move(public_path('products'), $imageName);
            
            $imageData = [
                'product_id' => $product->id,
                'image_url' => 'products/' . $imageName,
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
        
        // Delete physical file
        if (file_exists(public_path($image->image_url))) {
            unlink(public_path($image->image_url));
        }
        
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