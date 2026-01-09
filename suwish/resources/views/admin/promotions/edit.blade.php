@extends('admin.layouts.app')

@section('title', 'Edit Promotion')

@section('content')
<div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Edit Promotion</h1>
    <p class="text-gray-600">Update promotion details</p>
</div>

<div class="bg-white p-6 rounded-lg shadow">
    <form method="POST" action="{{ route('admin.promotions.update', $promotion) }}">
        @csrf
        @method('PUT')
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Promotion Code *</label>
                    <input type="text" name="code" required value="{{ old('code', $promotion->code) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter promotion code">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                    <select name="discount_type" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="percentage" {{ $promotion->discount_type === 'percentage' ? 'selected' : '' }}>Percentage</option>
                        <option value="fixed" {{ $promotion->discount_type === 'fixed' ? 'selected' : '' }}>Fixed Amount</option>
                    </select>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Discount Value *</label>
                    <input type="number" name="discount_value" required step="0.01" min="0" value="{{ old('discount_value', $promotion->discount_value) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter discount value">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                    <input type="number" name="usage_limit" min="0" value="{{ old('usage_limit', $promotion->usage_limit) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter usage limit (leave empty for unlimited)">
                </div>
            </div>
            
            <div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <input type="datetime-local" name="start_date" required value="{{ old('start_date', $promotion->start_date->format('Y-m-d\TH:i')) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                    <input type="datetime-local" name="end_date" required value="{{ old('end_date', $promotion->end_date->format('Y-m-d\TH:i')) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Minimum Amount</label>
                    <input type="number" name="minimum_amount" step="0.01" min="0" value="{{ old('minimum_amount', $promotion->minimum_amount) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter minimum order amount">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div class="flex items-center">
                        <input id="is_active" name="is_active" type="checkbox" {{ $promotion->is_active ? 'checked' : '' }} class="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded">
                        <label for="is_active" class="ml-2 block text-sm text-gray-900">
                            Active
                        </label>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="mt-6">
            <button type="submit" class="bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded-md">
                Update Promotion
            </button>
            <a href="{{ route('admin.promotions.index') }}" class="ml-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection