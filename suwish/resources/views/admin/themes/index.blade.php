@extends('admin.layouts.app')

@section('title', 'Theme Management')

@section('content')
<div class="mb-6 flex justify-between items-center">
    <div>
        <h1 class="text-3xl font-bold text-gray-800">Theme Management</h1>
        <p class="text-gray-600">Manage and switch front-end themes.</p>
    </div>
    <a href="{{ route('admin.themes.create') }}" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition shadow">
        <i class="fas fa-plus mr-2"></i> Create New Theme
    </a>
</div>

@if(session('success'))
<div class="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
    <p>{{ session('success') }}</p>
</div>
@endif

@if(session('error'))
<div class="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
    <p>{{ session('error') }}</p>
</div>
@endif

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    @foreach($themes as $theme)
    <div class="bg-white rounded-lg shadow-md overflow-hidden relative border {{ $theme->is_active ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-200' }} transition-transform hover:-translate-y-1">
        @if($theme->is_active)
        <div class="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl shadow">Active</div>
        @endif
        
        <div class="p-5">
            <h3 class="font-bold text-xl mb-3 text-gray-800">{{ $theme->name }}</h3>
            
            <div class="flex items-center space-x-2 mb-4">
                <div class="w-8 h-8 rounded-full shadow-sm border border-gray-200" style="background-color: {{ $theme->primary_color }}" title="Primary: {{ $theme->primary_color }}"></div>
                <div class="w-8 h-8 rounded-full shadow-sm border border-gray-200" style="background-color: {{ $theme->secondary_color }}" title="Secondary: {{ $theme->secondary_color }}"></div>
                <div class="w-8 h-8 rounded-full shadow-sm border border-gray-200" style="background-color: {{ $theme->button_color ?: $theme->primary_color }}" title="Button: {{ $theme->button_color ?: $theme->primary_color }}"></div>
                <div class="w-8 h-8 rounded-full shadow-sm border border-gray-200" style="background-color: {{ $theme->background_color }}" title="Background: {{ $theme->background_color }}"></div>
                <div class="w-8 h-8 rounded-full shadow-sm border border-gray-200 flex items-center justify-center text-xs font-bold text-white" style="background-color: #333; color: {{ $theme->text_color }}" title="Text Color">T</div>
            </div>
            
            <div class="text-sm text-gray-600 space-y-1">
                <p><span class="font-semibold">Font:</span> {{ $theme->font_family }}</p>
                <p><span class="font-semibold">Border Radius:</span> {{ $theme->border_radius }}</p>
                <p><span class="font-semibold">Header:</span> {{ ucfirst($theme->header_style) }}</p>
            </div>
        </div>
        
        <div class="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between items-center">
            <div class="flex space-x-3">
                <a href="{{ route('admin.themes.edit', $theme) }}" class="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                    <i class="fas fa-edit mr-1"></i> Edit
                </a>
                @if(!$theme->is_active)
                    <form action="{{ route('admin.themes.destroy', $theme) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this theme?');" class="inline">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="text-red-600 hover:text-red-800 font-medium transition-colors">
                            <i class="fas fa-trash-alt mr-1"></i> Delete
                        </button>
                    </form>
                @endif
            </div>
            @if(!$theme->is_active)
                <form action="{{ route('admin.themes.activate', $theme) }}" method="POST">
                    @csrf
                    <button type="submit" class="px-4 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 shadow-sm transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-1">
                        Activate
                    </button>
                </form>
            @else
                <span class="text-green-600 font-medium text-sm flex items-center">
                    <i class="fas fa-check-circle mr-1"></i> Applied
                </span>
            @endif
        </div>
    </div>
    @endforeach
</div>
@endsection
