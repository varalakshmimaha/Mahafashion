<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoriesSubcategoriesController extends Controller
{
    public function getCategories(): JsonResponse
    {
        $categories = Category::where('is_active', true)
            ->with(['subcategories' => function($query) {
                $query->where('is_active', true)->orderBy('sort_order');
            }])
            ->orderBy('sort_order')
            ->get();

        return response()->json($categories);
    }

    public function getSubcategories(Request $request, string $categorySlug): JsonResponse
    {
        $category = Category::where('slug', $categorySlug)
            ->where('is_active', true)
            ->firstOrFail();

        $subcategories = $category->subcategories()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json($subcategories);
    }

    public function getProductsBySubcategory(Request $request, string $categorySlug, string $subcategorySlug): JsonResponse
    {
        $subcategory = SubCategory::whereHas('category', function($query) use ($categorySlug) {
                $query->where('slug', $categorySlug);
            })
            ->where('slug', $subcategorySlug)
            ->where('is_active', true)
            ->firstOrFail();

        $products = $subcategory->products()
            ->where('status', 'active')
            ->paginate(20);

        return response()->json($products);
    }

    public function getProductsByCategoryAndSubcategory(Request $request, string $categorySlug, string $subcategorySlug = null): JsonResponse
    {
        $query = Product::with(['category', 'subcategory', 'pattern', 'images', 'variants'])->where('status', 'active');
        
        // Find the category by slug
        $category = Category::where('slug', $categorySlug)->where('is_active', true)->firstOrFail();
        
        if ($subcategorySlug) {
            // Filter by specific subcategory
            $subcategory = SubCategory::where('slug', $subcategorySlug)
                ->where('category_id', $category->id)
                ->where('is_active', true)
                ->firstOrFail();
            
            $query->where('subcategory_id', $subcategory->id);
        } else {
            // Filter by category and its subcategories
            $subcategoryIds = $category->subcategories()->where('is_active', true)->pluck('id');
            $query->where(function($q) use ($category, $subcategoryIds) {
                $q->where('category_id', $category->id)
                  ->orWhereIn('subcategory_id', $subcategoryIds->toArray());
            });
        }
        
        // Apply any additional filters from the request
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
        
        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        $query->orderBy($sortBy, $sortOrder);
        
        $products = $query->paginate($request->get('per_page', 12));
        
        return response()->json($products);
    }

    public function getMenuStructure(): JsonResponse
    {
        $categories = Category::where('is_active', true)
            ->with(['subcategories' => function($query) {
                $query->where('is_active', true)->orderBy('sort_order');
            }])
            ->orderBy('sort_order')
            ->get();

        $menuStructure = [];

        foreach ($categories as $category) {
            $categoryData = [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'image' => $category->image_url,
                'subcategories' => []
            ];

            foreach ($category->subcategories as $subcategory) {
                $categoryData['subcategories'][] = [
                    'id' => $subcategory->id,
                    'name' => $subcategory->name,
                    'slug' => $subcategory->slug,
                    'image' => $subcategory->image_url,
                    'category_slug' => $category->slug
                ];
            }

            $menuStructure[] = $categoryData;
        }

        return response()->json($menuStructure);
    }

    /**
     * Get subcategories by category ID (for admin product edit)
     */
    public function getSubcategoriesByCategoryId(int $categoryId): JsonResponse
    {
        $subcategories = SubCategory::where('category_id', $categoryId)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug', 'category_id', 'is_active']);

        return response()->json($subcategories);
    }
}
