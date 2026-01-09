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
}
