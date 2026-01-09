@extends('admin.layouts.app')

@section('title', 'Categories & Sub-Categories')

@section('content')
<style>
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .animate-slide-down {
        animation: slideInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .animate-fade-up {
        animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .animate-scale-in {
        animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .category-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.95));
        backdrop-filter: blur(10px);
    }
    
    .category-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(249, 250, 251, 1));
    }
    
    .subcategory-card {
        transition: all 0.3s ease;
        background: linear-gradient(135deg, #f9fafb, #f3f4f6);
    }
    
    .subcategory-card:hover {
        background: linear-gradient(135deg, #ffffff, #f9fafb);
        transform: translateX(8px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    
    .gradient-btn {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        transition: all 0.3s ease;
    }
    
    .gradient-btn:hover {
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
    }
    
    .gradient-btn-secondary {
        background: linear-gradient(135deg, #ec4899, #f43f5e);
    }
    
    .gradient-btn-secondary:hover {
        background: linear-gradient(135deg, #db2777, #e11d48);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(236, 72, 153, 0.4);
    }
</style>

<div class="mb-8 animate-slide-down">
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-2xl shadow-lg border border-white/50">
        <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <i class="fas fa-layer-group text-white text-xl"></i>
                </div>
                <div>
                    <h1 class="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Categories Management
                    </h1>
                    <p class="text-gray-600 mt-1 text-sm lg:text-base">Organize and manage your product categories hierarchy</p>
                </div>
            </div>
        </div>
        <div class="flex flex-wrap gap-3">
            <a href="{{ route('admin.categories.create') }}" class="gradient-btn inline-flex items-center px-6 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl">
                <i class="fas fa-plus-circle mr-2"></i> New Category
            </a>
            <a href="{{ route('admin.subcategories.create') }}" class="gradient-btn-secondary inline-flex items-center px-6 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl">
                <i class="fas fa-folder-plus mr-2"></i> New Sub-Category
            </a>
        </div>
    </div>
</div>

@if(session('success'))
    <div class="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-xl shadow-lg animate-fade-up flex items-start gap-4">
        <div class="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md">
            <i class="fas fa-check text-white text-lg"></i>
        </div>
        <div class="flex-1">
            <h4 class="font-bold text-green-800 text-lg">Success!</h4>
            <p class="text-green-700 mt-1">{{ session('success') }}</p>
        </div>
        <button onclick="this.parentElement.style.display='none'" class="text-green-600 hover:text-green-800 transition">
            <i class="fas fa-times text-xl"></i>
        </button>
    </div>
@endif

@if(session('error'))
    <div class="mb-6 p-5 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl shadow-lg animate-fade-up flex items-start gap-4">
        <div class="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-md">
            <i class="fas fa-exclamation-triangle text-white text-lg"></i>
        </div>
        <div class="flex-1">
            <h4 class="font-bold text-red-800 text-lg">Error!</h4>
            <p class="text-red-700 mt-1">{{ session('error') }}</p>
        </div>
        <button onclick="this.parentElement.style.display='none'" class="text-red-600 hover:text-red-800 transition">
            <i class="fas fa-times text-xl"></i>
        </button>
    </div>
@endif

<div class="space-y-6">
    @forelse($categories as $index => $category)
    <div class="category-card rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden animate-scale-in" style="animation-delay: {{ $index * 0.1 }}s">
        <!-- Category Header -->
        <div class="p-6 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 border-b border-gray-200/50">
            <div class="flex items-start gap-5">
                <div class="flex-shrink-0">
                    @if($category->image_url)
                        <div class="relative group">
                            <img src="{{ $category->image_url }}" alt="{{ $category->name }}" class="h-20 w-24 object-cover rounded-xl shadow-md border-2 border-white transition-transform duration-300 group-hover:scale-105">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    @else
                        <div class="h-20 w-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-2 border-white shadow-md">
                            <i class="fas fa-image text-gray-400 text-2xl"></i>
                        </div>
                    @endif
                </div>
                
                <div class="flex-1 min-w-0">
                    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div class="flex-1">
                            <div class="flex items-center gap-3 mb-2">
                                <h3 class="text-xl lg:text-2xl font-bold text-gray-900">{{ $category->name }}</h3>
                                <span class="px-3 py-1 rounded-full text-xs font-bold {{ $category->is_active ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md' : 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-md' }}">
                                    <i class="fas {{ $category->is_active ? 'fa-check-circle' : 'fa-times-circle' }} mr-1"></i>
                                    {{ $category->is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </div>
                            <p class="text-gray-600 text-sm lg:text-base leading-relaxed mb-3">{{ $category->description ?: 'No description available' }}</p>
                            <div class="flex flex-wrap gap-2">
                                <span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 border border-indigo-200">
                                    <i class="fas fa-layer-group mr-1.5"></i>{{ $category->subcategories->count() }} Subcategories
                                </span>
                                <span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200">
                                    <i class="fas fa-sort-numeric-down mr-1.5"></i>Sort Order: {{ $category->sort_order }}
                                </span>
                            </div>
                        </div>
                        
                        <div class="flex flex-wrap gap-2">
                            <a href="{{ route('admin.categories.edit', $category) }}" class="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                                <i class="fas fa-edit mr-2"></i> Edit
                            </a>
                            <form action="{{ route('admin.categories.destroy', $category) }}" method="POST" class="inline" onsubmit="return confirm('⚠️ Delete Category?\n\nThis will permanently delete:\n• Category: {{ $category->name }}\n• All {{ $category->subcategories->count() }} subcategories\n• All product relationships\n\nThis action cannot be undone!')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                                    <i class="fas fa-trash-alt mr-2"></i> Delete
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Subcategories Section -->
        @if($category->subcategories->count() > 0)
        <div class="p-6 bg-gray-50/50">
            <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
                    <i class="fas fa-folder-tree text-white text-lg"></i>
                </div>
                <h4 class="text-lg font-bold text-gray-800">Sub-Categories ({{ $category->subcategories->count() }})</h4>
            </div>
            <div class="space-y-3">
                @foreach($category->subcategories as $subIndex => $subcategory)
                <div class="subcategory-card flex items-center gap-4 p-4 rounded-xl border border-gray-200 shadow-sm" style="animation: fadeInUp 0.5s ease {{ ($subIndex * 0.1) }}s backwards">
                    <div class="flex-shrink-0">
                        @if($subcategory->image_url)
                            <img src="{{ $subcategory->image_url }}" alt="{{ $subcategory->name }}" class="h-14 w-18 object-cover rounded-lg border-2 border-white shadow-md">
                        @else
                            <div class="h-14 w-18 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center border-2 border-white shadow-md">
                                <i class="fas fa-image text-gray-400"></i>
                            </div>
                        @endif
                    </div>
                    
                    <div class="flex-1 min-w-0">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div class="flex-1">
                                <h5 class="text-base font-bold text-gray-900 mb-1">{{ $subcategory->name }}</h5>
                                <p class="text-sm text-gray-600 leading-relaxed">{{ $subcategory->description ?: 'No description available' }}</p>
                            </div>
                            
                            <div class="flex flex-wrap gap-2 items-center">
                                <span class="px-3 py-1 rounded-lg text-xs font-bold {{ $subcategory->is_active ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' : 'bg-gradient-to-r from-red-400 to-pink-500 text-white' }} shadow-sm">
                                    {{ $subcategory->is_active ? 'Active' : 'Inactive' }}
                                </span>
                                <span class="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                                    <i class="fas fa-sort mr-1"></i>{{ $subcategory->sort_order }}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex gap-2">
                        <a href="{{ route('admin.subcategories.edit', $subcategory) }}" class="p-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all duration-300 hover:scale-110 shadow-md" title="Edit Subcategory">
                            <i class="fas fa-edit"></i>
                        </a>
                        <form action="{{ route('admin.subcategories.destroy', $subcategory) }}" method="POST" class="inline" onsubmit="return confirm('Delete subcategory: {{ $subcategory->name }}?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 hover:scale-110 shadow-md" title="Delete Subcategory">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </form>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
        @else
        <div class="p-8 bg-gradient-to-br from-gray-50 to-gray-100 text-center border-t border-gray-200">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl mb-4 shadow-inner">
                <i class="fas fa-folder-open text-gray-400 text-2xl"></i>
            </div>
            <p class="text-gray-600 font-medium">No subcategories yet</p>
            <a href="{{ route('admin.subcategories.create') }}?category={{ $category->id }}" class="inline-flex items-center mt-3 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                <i class="fas fa-plus mr-2"></i> Add First Subcategory
            </a>
        </div>
        @endif
    </div>
    @empty
    <div class="p-16 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6 shadow-lg">
            <i class="fas fa-folder-open text-indigo-500 text-4xl"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No Categories Found</h3>
        <p class="text-gray-600 mb-6 max-w-md mx-auto">Start building your product catalog by creating your first category.</p>
        <a href="{{ route('admin.categories.create') }}" class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg">
            <i class="fas fa-plus-circle mr-3 text-xl"></i> Create Your First Category
        </a>
    </div>
    @endforelse
</div>
@endsection