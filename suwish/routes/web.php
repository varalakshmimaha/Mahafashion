<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ReportController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Payment success and failure routes
Route::get('/payment/success/{orderId}', [App\Http\Controllers\PaymentController::class, 'paymentSuccess'])->name('payment.success');
Route::get('/payment/failure/{orderId}', [App\Http\Controllers\PaymentController::class, 'paymentFailure'])->name('payment.failure');

// Test route to verify server is working
Route::get('/test', function () {
    return 'Server is working! Session ID: ' . session()->getId();
});

// Temporary route to directly login as admin for testing
Route::get('/login-as-admin', function () {
    \Illuminate\Support\Facades\Log::info('Attempting to log in as admin via /login-as-admin route.');
    
    // First try the Admin model
    $admin = App\Models\Admin::where('email', 'admin@sareeecommerce.com')->first();
    if ($admin) {
        \Illuminate\Support\Facades\Log::info('Admin user found in Admin model.', ['admin_id' => $admin->id, 'is_active' => $admin->is_active]);
        auth()->guard('admin')->login($admin);
        if(auth()->guard('admin')->check()){
            \Illuminate\Support\Facades\Log::info('Admin user successfully authenticated via Admin model.');
        } else {
            \Illuminate\Support\Facades\Log::error('Admin user authentication failed via Admin model.');
        }
        session(['admin_logged_in' => true]);
        return redirect()->route('admin.dashboard');
    }
    
    // Then try the User model with is_admin = 1
    $user = App\Models\User::where('email', 'admin123@gmail.com')->first();
    if ($user && $user->is_admin) {
        \Illuminate\Support\Facades\Log::info('Admin user found in User model.', ['user_id' => $user->id, 'is_admin' => $user->is_admin]);
        auth()->login($user);
        if(auth()->check()) {
            \Illuminate\Support\Facades\Log::info('Admin user successfully authenticated via User model.');
        } else {
            \Illuminate\Support\Facades\Log::error('Admin user authentication failed via User model.');
        }
        session(['admin_logged_in' => true]);
        return redirect()->route('admin.dashboard');
    }
    
    // Also try to find admin with email admin@gmail.com
    $user2 = App\Models\User::where('email', 'admin@gmail.com')->first();
    if ($user2 && $user2->is_admin) {
        \Illuminate\Support\Facades\Log::info('Admin user found in User model with admin@gmail.com.', ['user_id' => $user2->id, 'is_admin' => $user2->is_admin]);
        auth()->login($user2);
        if(auth()->check()) {
            \Illuminate\Support\Facades\Log::info('Admin user successfully authenticated via User model with admin@gmail.com.');
        } else {
            \Illuminate\Support\Facades\Log::error('Admin user authentication failed via User model with admin@gmail.com.');
        }
        session(['admin_logged_in' => true]);
        return redirect()->route('admin.dashboard');
    }
    
    \Illuminate\Support\Facades\Log::warning('No admin user found with email admin@sareeecommerce.com, admin123@gmail.com, or admin@gmail.com with is_admin = 1.');
    return 'Admin user not found. Please create an admin user first.';
});

// Route to create an admin user directly
Route::get('/create-admin-user', function () {
    $user = App\Models\User::updateOrCreate(
        ['email' => 'admin123@gmail.com'],
        [
            'name' => 'Admin User',
            'password' => \Illuminate\Support\Facades\Hash::make('Admin@123'),
            'is_admin' => 1,
            'email_verified_at' => now(),
        ]
    );
    
    return 'Admin user created/updated successfully. Email: admin123@gmail.com, Password: Admin@123';
});

// Another temporary login route with more debugging
Route::post('/force-login', function () {
    $credentials = request()->only(['email', 'password']);
    
    $admin = App\Models\Admin::where('email', $credentials['email'])->first();
    
    if ($admin && \Illuminate\Support\Facades\Hash::check($credentials['password'], $admin->password)) {
        auth()->guard('admin')->login($admin);
        return redirect('/admin/dashboard');
    }
    
    return 'Login failed';
})->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);

// Admin routes
Route::prefix('admin')->name('admin.')->group(function () {
    // Redirect /admin to login if not authenticated
    Route::redirect('/', '/admin/login', 307);
    
    // Authentication routes
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    
    // Protected routes
    Route::middleware('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        
        // Product management
        Route::resource('products', \App\Http\Controllers\Admin\ProductController::class);
        Route::post('products/{product}/toggle-status', [\App\Http\Controllers\Admin\ProductController::class, 'toggleStatus'])->name('products.toggle-status');
        Route::post('products/{product}/toggle-featured', [\App\Http\Controllers\Admin\ProductController::class, 'toggleFeatured'])->name('products.toggle-featured');
        Route::post('products/{product}/toggle-trending', [\App\Http\Controllers\Admin\ProductController::class, 'toggleTrending'])->name('products.toggle-trending');
        Route::post('products/{product}/toggle-top-rated', [\App\Http\Controllers\Admin\ProductController::class, 'toggleTopRated'])->name('products.toggle-top-rated');
        Route::post('products/{product}/toggle-new-arrival', [\App\Http\Controllers\Admin\ProductController::class, 'toggleNewArrival'])->name('products.toggle-new-arrival');
                
        // Category management
        Route::resource('categories', \App\Http\Controllers\Admin\CategoriesController::class);
                
        // Subcategory management
        Route::get('subcategories/create', [\App\Http\Controllers\Admin\CategoriesController::class, 'createSubCategory'])->name('subcategories.create');
        Route::post('subcategories', [\App\Http\Controllers\Admin\CategoriesController::class, 'storeSubCategory'])->name('subcategories.store');
        Route::get('subcategories/{subcategory}/edit', [\App\Http\Controllers\Admin\CategoriesController::class, 'editSubCategory'])->name('subcategories.edit');
        Route::put('subcategories/{subcategory}', [\App\Http\Controllers\Admin\CategoriesController::class, 'updateSubCategory'])->name('subcategories.update');
        Route::delete('subcategories/{subcategory}', [\App\Http\Controllers\Admin\CategoriesController::class, 'destroySubCategory'])->name('subcategories.destroy');
                
        // Order management
        Route::resource('orders', \App\Http\Controllers\Admin\OrderController::class);
        Route::post('orders/{order}/update-status', [\App\Http\Controllers\Admin\OrderController::class, 'updateStatus'])->name('orders.update-status');
        Route::post('orders/{order}/update-payment-status', [\App\Http\Controllers\Admin\OrderController::class, 'updatePaymentStatus'])->name('orders.update-payment-status');
        Route::get('orders/export', [\App\Http\Controllers\Admin\OrderController::class, 'export'])->name('orders.export');
        
        // User management
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
        Route::post('users/{user}/toggle-status', [\App\Http\Controllers\Admin\UserController::class, 'toggleStatus'])->name('users.toggle-status');
        Route::post('users/{user}/reset-password', [\App\Http\Controllers\Admin\UserController::class, 'resetPassword'])->name('users.reset-password');
        
        // Promotions management
        Route::resource('promotions', \App\Http\Controllers\Admin\PromotionController::class);
        Route::post('promotions/{promotion}/toggle-status', [\App\Http\Controllers\Admin\PromotionController::class, 'toggleStatus'])->name('promotions.toggle-status');
        
        // Reports
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        
        // Settings
        Route::get('settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('settings.index');
        Route::put('settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('settings.update');
        
        // Theme Settings
        Route::get('settings/theme', [\App\Http\Controllers\Admin\SettingsController::class, 'theme'])->name('settings.theme');
        Route::put('settings/theme', [\App\Http\Controllers\Admin\SettingsController::class, 'updateTheme'])->name('settings.theme.update');
        
        // Banner management
        Route::resource('banners', \App\Http\Controllers\Admin\BannerController::class);
        Route::post('banners/{banner}/toggle-status', [\App\Http\Controllers\Admin\BannerController::class, 'toggleStatus'])->name('banners.toggle-status');
        
        // Static pages management
        Route::resource('static-pages', \App\Http\Controllers\Admin\StaticPageController::class)->parameters(['static-pages' => 'staticPage']);
        Route::get('static-pages/{name}/edit', [\App\Http\Controllers\Admin\StaticPageController::class, 'edit'])->name('static-pages.edit');
        Route::put('static-pages/{name}', [\App\Http\Controllers\Admin\StaticPageController::class, 'update'])->name('static-pages.update');
    });
});