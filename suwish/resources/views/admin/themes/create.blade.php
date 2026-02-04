@extends('admin.layouts.app')

@section('title', 'Create Theme')

@section('content')
<div class="mb-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold text-gray-800">Create New Theme</h1>
            <p class="text-gray-600">Design a new look for your store.</p>
        </div>
        <a href="{{ route('admin.themes.index') }}" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
            &larr; Back to Themes
        </a>
    </div>
</div>

<div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <form action="{{ route('admin.themes.store') }}" method="POST" class="p-6">
        @csrf
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <!-- Basic Info -->
            <div class="col-span-full">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Global Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Theme Name</label>
                        <input type="text" name="name" id="name" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="e.g. Summer Sale" required>
                    </div>
                    <div class="flex items-center pt-6">
                        <label class="inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="is_active" value="1" class="sr-only peer">
                            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            <span class="ms-3 text-sm font-medium text-gray-700">Activate Immediately</span>
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
                            <input type="color" name="primary_color" id="primary_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="#4f46e5" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" placeholder="#4f46e5" value="#4f46e5" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                    <div>
                        <label for="secondary_color" class="block text-sm font-medium text-gray-700 mb-1">Secondary</label>
                        <div class="flex items-center space-x-2">
                            <input type="color" name="secondary_color" id="secondary_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="#ec4899" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" placeholder="#ec4899" value="#ec4899" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                    <div>
                        <label for="accent_color" class="block text-sm font-medium text-gray-700 mb-1">Accent</label>
                        <div class="flex items-center space-x-2">
                            <input type="color" name="accent_color" id="accent_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="#f59e0b" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" placeholder="#f59e0b" value="#f59e0b" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                    <div>
                        <label for="background_color" class="block text-sm font-medium text-gray-700 mb-1">Background</label>
                        <div class="flex items-center space-x-2">
                            <input type="color" name="background_color" id="background_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="#ffffff" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" placeholder="#ffffff" value="#ffffff" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                    <div>
                        <label for="text_color" class="block text-sm font-medium text-gray-700 mb-1">Text</label>
                        <div class="flex items-center space-x-2">
                            <input type="color" name="text_color" id="text_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="#1f2937" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" placeholder="#1f2937" value="#1f2937" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                     <!-- Semantic Colors -->
                     <div>
                        <label for="success_color" class="block text-sm font-medium text-gray-700 mb-1">Success</label>
                        <div class="flex items-center space-x-2">
                            <input type="color" name="success_color" id="success_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="#10b981" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" placeholder="#10b981" value="#10b981" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                    <div>
                        <label for="warning_color" class="block text-sm font-medium text-gray-700 mb-1">Warning</label>
                        <div class="flex items-center space-x-2">
                            <input type="color" name="warning_color" id="warning_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="#f59e0b" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" placeholder="#f59e0b" value="#f59e0b" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                    <div>
                        <label for="danger_color" class="block text-sm font-medium text-gray-700 mb-1">Danger</label>
                        <div class="flex items-center space-x-2">
                            <input type="color" name="danger_color" id="danger_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="#ef4444" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" placeholder="#ef4444" value="#ef4444" maxlength="7" oninput="this.previousElementSibling.value = this.value">
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
                            <input type="color" name="button_color" id="button_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="#4f46e5" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" placeholder="#4f46e5" value="#4f46e5" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                    <div>
                        <label for="button_hover_color" class="block text-sm font-medium text-gray-700 mb-1">Hover Color</label>
                         <div class="flex items-center space-x-2">
                            <input type="color" name="button_hover_color" id="button_hover_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="#4338ca" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" placeholder="#4338ca" value="#4338ca" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                    <div>
                        <label for="button_text_color" class="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                         <div class="flex items-center space-x-2">
                            <input type="color" name="button_text_color" id="button_text_color" class="h-10 w-12 border border-gray-300 p-0 rounded shadow-sm cursor-pointer" value="#ffffff" oninput="this.nextElementSibling.value = this.value">
                            <input type="text" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm uppercase" placeholder="#ffffff" value="#ffffff" maxlength="7" oninput="this.previousElementSibling.value = this.value">
                        </div>
                    </div>
                    <div>
                        <label for="button_font_size" class="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                        <select name="button_font_size" id="button_font_size" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                              <option value="0.875rem">Small</option>
                              <option value="1rem" selected>Medium</option>
                              <option value="1.125rem">Large</option>
                              <option value="1.25rem">Extra Large</option>
                        </select>
                    </div>
                     <div>
                        <label for="button_font_weight" class="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
                        <select name="button_font_weight" id="button_font_weight" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                              <option value="400">Regular (400)</option>
                              <option value="500">Medium (500)</option>
                              <option value="600" selected>Semi Bold (600)</option>
                              <option value="700">Bold (700)</option>
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
                            <option value="Inter, sans-serif">Inter</option>
                            <option value="Roboto, sans-serif">Roboto</option>
                            <option value="Open Sans, sans-serif">Open Sans</option>
                            <option value="Lato, sans-serif">Lato</option>
                            <option value="Montserrat, sans-serif">Montserrat</option>
                            <option value="Poppins, sans-serif">Poppins</option>
                            <option value="serif">Serif (Times New Roman)</option>
                        </select>
                    </div>
                    <div>
                        <label for="border_radius" class="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
                        <select name="border_radius" id="border_radius" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            <option value="0px">None (Square)</option>
                            <option value="0.25rem">Small (4px)</option>
                            <option value="0.375rem" selected>Medium (6px)</option>
                            <option value="0.5rem">Large (8px)</option>
                            <option value="1rem">X-Large (16px)</option>
                            <option value="9999px">Rounded (Pill)</option>
                        </select>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                     <div>
                        <label for="header_style" class="block text-sm font-medium text-gray-700 mb-1">Header Style</label>
                        <select name="header_style" id="header_style" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            <option value="default">Default</option>
                            <option value="minimal">Minimal (Logo + Menu only)</option>
                            <option value="centered">Centered (Logo above Menu)</option>
                            <option value="full">Full Width</option>
                        </select>
                    </div>
                    <div>
                        <label for="footer_style" class="block text-sm font-medium text-gray-700 mb-1">Footer Style</label>
                        <select name="footer_style" id="footer_style" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            <option value="default">Default</option>
                            <option value="simple">Simple (Copyright only)</option>
                            <option value="columns">Multiple Columns</option>
                            <option value="dark">Dark Theme Footer</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" class="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md transition-colors focus:ring-4 focus:ring-indigo-300">
                Create Theme
            </button>
        </div>
    </form>
</div>
@endsection
