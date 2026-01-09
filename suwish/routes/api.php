<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SalesReportController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes



Route::get('products', [App\Http\Controllers\Api\ProductController::class, 'index']);
Route::get('products/new-arrivals', [App\Http\Controllers\Api\ProductController::class, 'newArrivals']);
Route::get('products/trending', [App\Http\Controllers\Api\ProductController::class, 'trending']);
Route::get('products/ethnic-wear', [App\Http\Controllers\Api\ProductController::class, 'ethnicWear']);
Route::get('products/maha-collection', [App\Http\Controllers\Api\ProductController::class, 'mahaCollection']);
Route::get('products/{id}', [App\Http\Controllers\Api\ProductController::class, 'show']);
// Product homepage sections

// Categories and Subcategories routes
Route::get('categories', [App\Http\Controllers\Api\CategoriesSubcategoriesController::class, 'getCategories']);
Route::get('categories-list', [App\Http\Controllers\Api\CategoriesSubcategoriesController::class, 'getCategories']);
Route::get('categories/{categorySlug}/subcategories', [App\Http\Controllers\Api\CategoriesSubcategoriesController::class, 'getSubcategories']);
Route::get('categories/{categorySlug}/subcategories/{subcategorySlug}/products', [App\Http\Controllers\Api\CategoriesSubcategoriesController::class, 'getProductsBySubcategory']);
Route::get('categories-with-subcategories', [App\Http\Controllers\Api\CategoriesSubcategoriesController::class, 'getMenuStructure']);

// Static pages public show route
Route::get('static-pages/{name}', [App\Http\Controllers\Api\StaticPageController::class, 'show']);
// Banners public route
Route::get('banners', [App\Http\Controllers\Api\BannerController::class, 'indexPublic']);

// Offers public route
Route::get('offers', [App\Http\Controllers\Api\OfferController::class, 'index']);

// Promotions public route (banner type)
Route::get('promotions/banners', [App\Http\Controllers\Api\PromotionController::class, 'banners']);

// Settings public route
Route::get('settings', [App\Http\Controllers\Api\SettingsController::class, 'getPublicSettings']);
Route::get('settings/theme', [App\Http\Controllers\Api\SettingsController::class, 'getTheme']);

// Theme routes (public - get active theme)
Route::get('themes/active', [App\Http\Controllers\Api\ThemeController::class, 'getActive']);

// Auth routes
Route::post('login', [App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('register', [App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('logout', [App\Http\Controllers\Api\AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('forgot-password', [App\Http\Controllers\Api\AuthController::class, 'forgotPassword']);
Route::post('reset-password', [App\Http\Controllers\Api\AuthController::class, 'resetPassword']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('admin/products', [App\Http\Controllers\Api\ProductController::class, 'adminIndex']);
    Route::apiResource('products', App\Http\Controllers\Api\ProductController::class)->except(['index', 'show']);
    
    // Product Images Management
    Route::post('products/{id}/images', [App\Http\Controllers\Api\ProductController::class, 'uploadImages']);
    Route::delete('products/{id}/images/{imageId}', [App\Http\Controllers\Api\ProductController::class, 'deleteImage']);
    Route::put('products/{id}/images/reorder', [App\Http\Controllers\Api\ProductController::class, 'reorderImages']);
    
    // Product Variants Management
    Route::put('products/{id}/variants', [App\Http\Controllers\Api\ProductController::class, 'updateVariants']);
    Route::delete('products/{id}/variants/{variantId}', [App\Http\Controllers\Api\ProductController::class, 'deleteVariant']);
    Route::post('products/{id}/check-stock', [App\Http\Controllers\Api\ProductController::class, 'checkStock']);
    
    // Theme Management (Admin only)
    Route::apiResource('themes', App\Http\Controllers\Api\ThemeController::class);
    Route::post('themes/{id}/activate', [App\Http\Controllers\Api\ThemeController::class, 'activate']);
    
    // Cart routes
    Route::apiResource('cart', App\Http\Controllers\Api\CartController::class);
    Route::delete('cart/clear', [App\Http\Controllers\Api\CartController::class, 'clear']);
    Route::get('cart/count', [App\Http\Controllers\Api\CartController::class, 'count']);
    Route::get('cart/total', [App\Http\Controllers\Api\CartController::class, 'total']);
    
    // Wishlist routes
    Route::apiResource('wishlist', App\Http\Controllers\Api\WishlistController::class);
    Route::post('wishlist/toggle', [App\Http\Controllers\Api\WishlistController::class, 'toggle']);
    Route::delete('wishlist/product/{productId}', [App\Http\Controllers\Api\WishlistController::class, 'removeByProduct']);
    Route::get('wishlist/count', [App\Http\Controllers\Api\WishlistController::class, 'count']);
    
    Route::apiResource('orders', App\Http\Controllers\Api\OrderController::class)->except(['update', 'destroy']);
    Route::post('orders', [App\Http\Controllers\Api\OrderController::class, 'store']);
    
    Route::apiResource('addresses', App\Http\Controllers\Api\AddressController::class);
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('sales-report', [SalesReportController::class, 'index']);

    Route::get('banners/all', [App\Http\Controllers\Api\BannerController::class, 'index']);
    Route::apiResource('banners', App\Http\Controllers\Api\BannerController::class)->except(['index']);
    
    // Promotions admin routes
    Route::get('promotions', [App\Http\Controllers\Api\PromotionController::class, 'index']);
    Route::post('promotions', [App\Http\Controllers\Api\PromotionController::class, 'store']);
    Route::get('promotions/{id}', [App\Http\Controllers\Api\PromotionController::class, 'show']);
    Route::post('promotions/{id}', [App\Http\Controllers\Api\PromotionController::class, 'update']);
    Route::delete('promotions/{id}', [App\Http\Controllers\Api\PromotionController::class, 'destroy']);
    Route::patch('promotions/{id}/toggle', [App\Http\Controllers\Api\PromotionController::class, 'toggleStatus']);
    
    // Add authenticated index separately if needed
    // Route::get('banners/authenticated', [App\Http\Controllers\Api\BannerController::class, 'index']);

    // Settings admin routes
    Route::put('settings', [App\Http\Controllers\Api\SettingsController::class, 'updateSettings']);
    Route::post('settings', [App\Http\Controllers\Api\SettingsController::class, 'updateSettings']);
    
    // Static pages protected update route
    Route::put('static-pages/{name}', [App\Http\Controllers\Api\StaticPageController::class, 'update']);
});

// Payment routes (outside the auth middleware since they need to be accessible during payment flow)
Route::post('payment/create-order', [App\Http\Controllers\PaymentController::class, 'createOrder'])->middleware('auth:sanctum');
Route::post('payment/verify', [App\Http\Controllers\PaymentController::class, 'verifyPayment'])->middleware('auth:sanctum');
Route::get('payment/success/{orderId}', [App\Http\Controllers\PaymentController::class, 'paymentSuccess'])->middleware('auth:sanctum');
Route::get('payment/failure/{orderId}', [App\Http\Controllers\PaymentController::class, 'paymentFailure'])->middleware('auth:sanctum');