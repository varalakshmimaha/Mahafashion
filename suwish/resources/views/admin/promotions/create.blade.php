@extends('admin.layouts.app')

@section('title', 'Create Promotion')

@section('content')
<div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Create Promotion</h1>
    <p class="text-gray-600">Add a new discount code or offer</p>
</div>

<div class="bg-white p-6 rounded-lg shadow">
    <form method="POST" action="{{ route('admin.promotions.store') }}" enctype="multipart/form-data">
        @csrf
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Promotion Code *</label>
                    <input type="text" name="code" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter promotion code">
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Promotion Type</label>
                    <select name="type" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="coupon">Coupon</option>
                        <option value="banner">Banner</option>
                    </select>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Title (For Banner)</label>
                    <input type="text" name="title" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter title">
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Subtitle (For Banner)</label>
                    <input type="text" name="subtitle" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter subtitle">
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter description"></textarea>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                    <select name="discount_type" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                    </select>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Discount Value *</label>
                    <input type="number" name="discount_value" required step="0.01" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter discount value">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                    <input type="number" name="usage_limit" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter usage limit (leave empty for unlimited)">
                </div>
            </div>
            
            <div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <input type="datetime-local" name="start_date" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                    <input type="datetime-local" name="end_date" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                    <input type="file" name="image" accept="image/*" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input type="text" name="button_text" value="Shop Now" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                    <input type="text" name="button_link" value="/products" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. /products/ethnic-wear">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Discount Text</label>
                    <input type="text" name="discount_text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. Flat 30% Off">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Minimum Amount</label>
                    <input type="number" name="minimum_amount" step="0.01" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter minimum order amount">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div class="flex items-center">
                        <input id="is_active" name="is_active" type="checkbox" checked class="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded">
                        <label for="is_active" class="ml-2 block text-sm text-gray-900">
                            Active
                        </label>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="mt-6">
            <button type="submit" class="bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded-md">
                Create Promotion
            </button>
            <a href="{{ route('admin.promotions.index') }}" class="ml-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection