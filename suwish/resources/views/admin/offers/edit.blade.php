@extends('admin.layouts.app')

@section('title', 'Edit Offer')

@section('content')
<div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Edit Offer</h1>
    <p class="text-gray-600">Update the promotional offer</p>
</div>

<div class="bg-white p-6 rounded-lg shadow">
    <form method="POST" action="{{ route('admin.offers.update', $offer) }}" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input type="text" name="title" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter offer title" value="{{ old('title', $offer->title) }}">
                    @error('title')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <input type="text" name="subtitle" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter offer subtitle" value="{{ old('subtitle', $offer->subtitle) }}">
                    @error('subtitle')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter offer description">{{ old('description', $offer->description) }}</textarea>
                    @error('description')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Discount Text</label>
                    <input type="text" name="discount_text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter discount text (e.g., 'Upto 50% Off')" value="{{ old('discount_text', $offer->discount_text) }}">
                    @error('discount_text')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input type="text" name="button_text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter button text (e.g., 'Shop Now')" value="{{ old('button_text', $offer->button_text) }}">
                    @error('button_text')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                    <input type="url" name="button_link" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter button link (e.g., https://example.com)" value="{{ old('button_link', $offer->button_link) }}">
                    @error('button_link')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                    @enderror
                </div>
            </div>

            <div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Offer Image</label>
                    @if($offer->image)
                        <div class="mb-2">
                            <img src="{{ asset('storage/' . $offer->image) }}" alt="{{ $offer->title }}" class="w-32 h-32 object-cover rounded">
                        </div>
                        <div class="flex items-center">
                            <label class="flex items-center">
                                <input type="checkbox" name="remove_image" class="rounded border-gray-300 text-amber-600 shadow-sm focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50">
                                <span class="ml-2 text-sm text-gray-700">Remove Image</span>
                            </label>
                        </div>
                    @endif
                    <div class="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div class="space-y-1 text-center">
                            <div class="flex text-sm text-gray-600">
                                <label for="image" class="relative cursor-pointer bg-white rounded-md font-medium text-amber-700 hover:text-amber-500">
                                    <span>Change image</span>
                                    <input id="image" name="image" type="file" class="sr-only">
                                </label>
                                <p class="pl-1">or drag and drop</p>
                            </div>
                            <p class="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        </div>
                    </div>
                    @error('image')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input type="date" name="start_date" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="{{ old('start_date', $offer->start_date ? $offer->start_date->format('Y-m-d') : '') }}">
                    @error('start_date')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input type="date" name="end_date" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="{{ old('end_date', $offer->end_date ? $offer->end_date->format('Y-m-d') : '') }}">
                    @error('end_date')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                    <input type="number" name="sort_order" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter sort order" value="{{ old('sort_order', $offer->sort_order) }}">
                    @error('sort_order')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div class="mb-4">
                    <label class="flex items-center">
                        <input type="checkbox" name="is_active" class="rounded border-gray-300 text-amber-600 shadow-sm focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50" {{ old('is_active', $offer->is_active) ? 'checked' : '' }}>
                        <span class="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                </div>
            </div>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-amber-700 hover:bg-amber-800 text-white py-2 px-6 rounded-md">
                Update Offer
            </button>
            <a href="{{ route('admin.offers.index') }}" class="ml-3 bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-md">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection