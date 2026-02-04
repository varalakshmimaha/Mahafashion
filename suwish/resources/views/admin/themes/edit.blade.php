@extends('admin.layouts.app')

@section('title', 'Edit Theme')

@section('content')
<div class="mb-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold text-gray-800">Edit Theme: {{ $theme->name }}</h1>
            <p class="text-gray-600">Modify the design of your store.</p>
        </div>
        <a href="{{ route('admin.themes.index') }}" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
            &larr; Back to Themes
        </a>
    </div>
</div>

<div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <form action="{{ route('admin.themes.update', $theme) }}" method="POST" class="p-6">
        @csrf
        @method('PUT')
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <!-- Basic Info -->
            <div class="col-span-full">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Global Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Theme Name</label>
                        <input type="text" name="name" id="name" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value="{{ old('name', $theme->name) }}" required>
                    </div>
                    <div class="flex items-center pt-6">
                        <label class="inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="is_active" value="1" class="sr-only peer" {{ $theme->is_active ? 'checked' : '' }}>
                            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            <span class="ms-3 text-sm font-medium text-gray-700">Active Theme</span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Colors -->
            <div class="col-span-full">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Color Palette</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                     <div>
                        <label for="primary_color" class="block text-sm font-medium text-gray-700 mb-1">Primary</label>
                        <div class="flex items-center space-x-2">
                            <input type="color" name="primary_color" id="primary_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="{{ old('primary_color', $theme->primary_color) }}" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" value="{{ old('primary_color', $theme->primary_color) }}" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                    <div>
                        <label for="secondary_color" class="block text-sm font-medium text-gray-700 mb-1">Secondary</label>
                        <div class="flex items-center space-x-2">
                            <input type="color" name="secondary_color" id="secondary_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="{{ old('secondary_color', $theme->secondary_color) }}" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" value="{{ old('secondary_color', $theme->secondary_color) }}" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                    <div>
                        <label for="accent_color" class="block text-sm font-medium text-gray-700 mb-1">Accent</label>
                        <div class="flex items-center space-x-2">
                            <input type="color" name="accent_color" id="accent_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="{{ old('accent_color', $theme->accent_color) }}" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" value="{{ old('accent_color', $theme->accent_color) }}" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                    <div>
                        <label for="background_color" class="block text-sm font-medium text-gray-700 mb-1">Background</label>
                        <div class="flex items-center space-x-2">
                            <input type="color" name="background_color" id="background_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="{{ old('background_color', $theme->background_color) }}" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" value="{{ old('background_color', $theme->background_color) }}" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                    <div>
                        <label for="text_color" class="block text-sm font-medium text-gray-700 mb-1">Text</label>
                        <div class="flex items-center space-x-2">
                            <input type="color" name="text_color" id="text_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="{{ old('text_color', $theme->text_color) }}" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" value="{{ old('text_color', $theme->text_color) }}" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                     <!-- Semantic Colors -->
                     <div>
                        <label for="success_color" class="block text-sm font-medium text-gray-700 mb-1">Success</label>
                        <div class="flex items-center space-x-2">
                            <input type="color" name="success_color" id="success_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="{{ old('success_color', $theme->success_color) }}" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" value="{{ old('success_color', $theme->success_color) }}" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                    <div>
                        <label for="warning_color" class="block text-sm font-medium text-gray-700 mb-1">Warning</label>
                        <div class="flex items-center space-x-2">
                            <input type="color" name="warning_color" id="warning_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="{{ old('warning_color', $theme->warning_color) }}" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" value="{{ old('warning_color', $theme->warning_color) }}" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                     <div>
                        <label for="danger_color" class="block text-sm font-medium text-gray-700 mb-1">Danger</label>
                        <div class="flex items-center space-x-2">
                            <input type="color" name="danger_color" id="danger_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="{{ old('danger_color', $theme->danger_color) }}" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" value="{{ old('danger_color', $theme->danger_color) }}" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Button Styling Matches React Frontend -->
            <div class="col-span-full bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Button Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label for="button_color" class="block text-sm font-medium text-gray-700 mb-1">Button Color</label>
                        <div class="flex items-center space-x-2">
                            <input type="color" name="button_color" id="button_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="{{ old('button_color', $theme->button_color) }}" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" value="{{ old('button_color', $theme->button_color) }}" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                    <div>
                        <label for="button_hover_color" class="block text-sm font-medium text-gray-700 mb-1">Hover Color</label>
                         <div class="flex items-center space-x-2">
                            <input type="color" name="button_hover_color" id="button_hover_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="{{ old('button_hover_color', $theme->button_hover_color) }}" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" value="{{ old('button_hover_color', $theme->button_hover_color) }}" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                    <div>
                        <label for="button_text_color" class="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                         <div class="flex items-center space-x-2">
                            <input type="color" name="button_text_color" id="button_text_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="{{ old('button_text_color', $theme->button_text_color) }}" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" value="{{ old('button_text_color', $theme->button_text_color) }}" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                    <div>
                        <label for="button_font_size" class="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                        <select name="button_font_size" id="button_font_size" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                              <option value="0.875rem" {{ old('button_font_size', $theme->button_font_size) == '0.875rem' ? 'selected' : '' }}>Small</option>
                              <option value="1rem" {{ old('button_font_size', $theme->button_font_size) == '1rem' ? 'selected' : '' }}>Medium</option>
                              <option value="1.125rem" {{ old('button_font_size', $theme->button_font_size) == '1.125rem' ? 'selected' : '' }}>Large</option>
                              <option value="1.25rem" {{ old('button_font_size', $theme->button_font_size) == '1.25rem' ? 'selected' : '' }}>Extra Large</option>
                        </select>
                    </div>
                     <div>
                        <label for="button_font_weight" class="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
                        <select name="button_font_weight" id="button_font_weight" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                              <option value="400" {{ old('button_font_weight', $theme->button_font_weight) == '400' ? 'selected' : '' }}>Regular (400)</option>
                              <option value="500" {{ old('button_font_weight', $theme->button_font_weight) == '500' ? 'selected' : '' }}>Medium (500)</option>
                              <option value="600" {{ old('button_font_weight', $theme->button_font_weight) == '600' ? 'selected' : '' }}>Semi Bold (600)</option>
                              <option value="700" {{ old('button_font_weight', $theme->button_font_weight) == '700' ? 'selected' : '' }}>Bold (700)</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- Typography & Styles -->
            <div class="col-span-full">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Typography & Layout</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label for="font_family" class="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                        <select name="font_family" id="font_family" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            @foreach(['Inter, sans-serif' => 'Inter', 'Roboto, sans-serif' => 'Roboto', 'Open Sans, sans-serif' => 'Open Sans', 'Lato, sans-serif' => 'Lato', 'Montserrat, sans-serif' => 'Montserrat', 'Poppins, sans-serif' => 'Poppins', 'serif' => 'Serif'] as $val => $txt)
                                <option value="{{ $val }}" {{ old('font_family', $theme->font_family) == $val ? 'selected' : '' }}>{{ $txt }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <label for="border_radius" class="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
                        <select name="border_radius" id="border_radius" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                             @foreach(['0px' => 'None', '0.25rem' => 'Small', '0.375rem' => 'Medium', '0.5rem' => 'Large', '1rem' => 'X-Large', '9999px' => 'Rounded'] as $val => $txt)
                                <option value="{{ $val }}" {{ old('border_radius', $theme->border_radius) == $val ? 'selected' : '' }}>{{ $txt }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                     <div>
                        <label for="header_style" class="block text-sm font-medium text-gray-700 mb-1">Header Style</label>
                        <select name="header_style" id="header_style" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                             @foreach(['default' => 'Default', 'minimal' => 'Minimal', 'centered' => 'Centered', 'full' => 'Full Width'] as $val => $txt)
                                <option value="{{ $val }}" {{ old('header_style', $theme->header_style) == $val ? 'selected' : '' }}>{{ $txt }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <label for="footer_style" class="block text-sm font-medium text-gray-700 mb-1">Footer Style</label>
                        <select name="footer_style" id="footer_style" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            @foreach(['default' => 'Default', 'simple' => 'Simple', 'columns' => 'Multiple Columns', 'dark' => 'Dark Theme'] as $val => $txt)
                                <option value="{{ $val }}" {{ old('footer_style', $theme->footer_style) == $val ? 'selected' : '' }}>{{ $txt }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" class="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md transition-colors focus:ring-4 focus:ring-indigo-300">
                Update Theme
            </button>
        </div>
    </form>
</div>
@endsection
