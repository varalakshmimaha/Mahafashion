@extends('admin.layouts.app')

@section('title', 'Edit Banner')

@section('content')
<div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Edit Banner</h1>
    <p class="text-gray-600">Update banner details</p>
</div>

<div class="bg-white rounded-lg shadow p-6">
    <form action="{{ route('admin.banners.update', $banner) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" name="title" id="title" value="{{ old('title', $banner->title) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                @error('title')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label for="link" class="block text-sm font-medium text-gray-700 mb-1">Link (optional)</label>
                <input type="text" name="link" id="link" value="{{ old('link', $banner->link) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                @error('link')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label for="order" class="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input type="number" name="order" id="order" value="{{ old('order', $banner->order) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                @error('order')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div class="flex items-start">
                <div class="flex items-center h-5">
                    <input id="is_active" name="is_active" type="checkbox" class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" value="1" {{ old('is_active', $banner->is_active) ? 'checked' : '' }}>
                </div>
                <div class="ml-3 text-sm">
                    <label for="is_active" class="font-medium text-gray-700">Active</label>
                    <p class="text-gray-500">Check to make this banner visible on the website</p>
                </div>
            </div>
            @error('is_active')
                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
            @enderror

            <div class="md:col-span-2">
                <label for="image" class="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input type="file" name="image" id="image" accept="image/*" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                @error('image')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
                <p class="mt-1 text-sm text-gray-500">Upload a new image for the banner (max 2MB, formats: jpeg, png, jpg, gif, svg)</p>
                
                @if($banner->image_path)
                    <div class="mt-2">
                        <p class="text-sm text-gray-600">Current image:</p>
                        <img src="{{ $banner->image_path }}" alt="{{ $banner->title }}" class="mt-1 h-32 object-contain">
                    </div>
                @endif
            </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
            <a href="{{ route('admin.banners.index') }}" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Cancel
            </a>
            <button type="submit" class="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Update Banner
            </button>
        </div>
    </form>
</div>
@endsection