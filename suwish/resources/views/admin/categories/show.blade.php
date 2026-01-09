@extends('admin.layouts.app')

@section('title', $category->name)

@section('content')
<div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ $category->name }}</h1>
                <p class="text-gray-600">{{ $category->description ?: 'No description' }}</p>
            </div>
            <div class="flex gap-2">
                <a href="{{ route('admin.categories.edit', $category) }}" class="px-3 py-2 bg-blue-600 text-white rounded">Edit</a>
                <form action="{{ route('admin.categories.destroy', $category) }}" method="POST" onsubmit="return confirm('Delete this category?');">
                    @csrf
                    @method('DELETE')
                    <button class="px-3 py-2 bg-red-600 text-white rounded">Delete</button>
                </form>
            </div>
        </div>

        <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p><strong>Sort order:</strong> {{ $category->sort_order }}</p>
                    <p><strong>Status:</strong> {{ $category->is_active ? 'Active' : 'Inactive' }}</p>
                </div>
                <div>
                    @if($category->image_url)
                        <img src="{{ $category->image_url }}" alt="{{ $category->name }}" class="w-full h-48 object-cover rounded">
                    @endif
                </div>
            </div>

            <hr class="my-6">

            <h3 class="text-lg font-semibold mb-3">Sub-Categories</h3>
            @if($category->subcategories->count())
                <div class="space-y-3">
                    @foreach($category->subcategories as $sub)
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded border">
                            <div>
                                <div class="font-medium">{{ $sub->name }}</div>
                                <div class="text-sm text-gray-600">{{ $sub->description ?: 'No description' }}</div>
                            </div>
                            <div class="flex gap-2">
                                <a href="{{ route('admin.subcategories.edit', $sub) }}" class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Edit</a>
                                <form action="{{ route('admin.subcategories.destroy', $sub) }}" method="POST" onsubmit="return confirm('Delete this subcategory?');">
                                    @csrf
                                    @method('DELETE')
                                    <button class="px-2 py-1 bg-red-100 text-red-800 rounded">Delete</button>
                                </form>
                            </div>
                        </div>
                    @endforeach
                </div>
            @else
                <p class="text-gray-500">No sub-categories found.</p>
            @endif
        </div>
    </div>
</div>
@endsection
