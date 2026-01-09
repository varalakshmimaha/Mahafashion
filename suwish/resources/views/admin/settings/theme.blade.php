@extends('admin.layouts.app')

@section('title', 'Theme Settings - Maha Fashion Admin')

@section('content')
<div class="max-w-5xl mx-auto">
    <!-- Header -->
    <div class="mb-8 animate-slideInDown bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 shadow-2xl">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-4xl font-bold text-white mb-2">
                    <i class="fas fa-palette mr-3"></i>Theme Customization
                </h1>
                <p class="text-indigo-100 text-lg">Customize the admin panel colors and branding</p>
            </div>
            <div class="hidden md:flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl">
                <i class="fas fa-brush text-white text-3xl"></i>
            </div>
        </div>
    </div>

    @if(session('success'))
    <div class="mb-6 p-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl shadow-lg flex items-center animate-fadeInUp">
        <div class="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
            <i class="fas fa-check-circle text-2xl"></i>
        </div>
        <div class="flex-1">
            <p class="font-semibold">{{ session('success') }}</p>
        </div>
        <button onclick="this.parentElement.remove()" class="ml-4 text-white hover:text-gray-200 transition-colors">
            <i class="fas fa-times text-xl"></i>
        </button>
    </div>
    @endif

    @if($errors->any())
    <div class="mb-6 p-4 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-xl shadow-lg animate-fadeInUp">
        <div class="flex items-start">
            <div class="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-exclamation-circle text-2xl"></i>
            </div>
            <div class="flex-1">
                <p class="font-semibold mb-2">Please fix the following errors:</p>
                <ul class="list-disc list-inside space-y-1">
                    @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200 transition-colors">
                <i class="fas fa-times text-xl"></i>
            </button>
        </div>
    </div>
    @endif

    <!-- Theme Settings Form -->
    <form action="{{ route('admin.settings.theme.update') }}" method="POST" class="bg-white rounded-2xl shadow-xl overflow-hidden animate-scaleIn">
        @csrf
        @method('PUT')

        <div class="p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <!-- Primary Color -->
                <div class="space-y-3">
                    <label class="block text-sm font-bold text-gray-900">
                        <i class="fas fa-circle text-indigo-500 mr-2"></i>Primary Color
                    </label>
                    <div class="flex gap-3">
                        <input type="color" name="theme_primary_color" value="{{ $settings['theme_primary_color'] ?? '#6366f1' }}" 
                               class="h-14 w-20 rounded-lg border-2 border-gray-200 cursor-pointer transition-all hover:border-indigo-500 hover:scale-105">
                        <input type="text" name="theme_primary_color_hex" value="{{ $settings['theme_primary_color'] ?? '#6366f1' }}" 
                               class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                               placeholder="#6366f1" pattern="^#[0-9A-Fa-f]{6}$">
                    </div>
                    <p class="text-xs text-gray-600">Used for main UI elements and buttons</p>
                </div>

                <!-- Secondary Color -->
                <div class="space-y-3">
                    <label class="block text-sm font-bold text-gray-900">
                        <i class="fas fa-circle text-purple-500 mr-2"></i>Secondary Color
                    </label>
                    <div class="flex gap-3">
                        <input type="color" name="theme_secondary_color" value="{{ $settings['theme_secondary_color'] ?? '#8b5cf6' }}" 
                               class="h-14 w-20 rounded-lg border-2 border-gray-200 cursor-pointer transition-all hover:border-purple-500 hover:scale-105">
                        <input type="text" name="theme_secondary_color_hex" value="{{ $settings['theme_secondary_color'] ?? '#8b5cf6' }}" 
                               class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                               placeholder="#8b5cf6" pattern="^#[0-9A-Fa-f]{6}$">
                    </div>
                    <p class="text-xs text-gray-600">Used for secondary actions and highlights</p>
                </div>

                <!-- Accent Color -->
                <div class="space-y-3">
                    <label class="block text-sm font-bold text-gray-900">
                        <i class="fas fa-circle text-pink-500 mr-2"></i>Accent Color
                    </label>
                    <div class="flex gap-3">
                        <input type="color" name="theme_accent_color" value="{{ $settings['theme_accent_color'] ?? '#ec4899' }}" 
                               class="h-14 w-20 rounded-lg border-2 border-gray-200 cursor-pointer transition-all hover:border-pink-500 hover:scale-105">
                        <input type="text" name="theme_accent_color_hex" value="{{ $settings['theme_accent_color'] ?? '#ec4899' }}" 
                               class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-mono text-sm"
                               placeholder="#ec4899" pattern="^#[0-9A-Fa-f]{6}$">
                    </div>
                    <p class="text-xs text-gray-600">Used for special emphasis and links</p>
                </div>

                <!-- Success Color -->
                <div class="space-y-3">
                    <label class="block text-sm font-bold text-gray-900">
                        <i class="fas fa-circle text-green-500 mr-2"></i>Success Color
                    </label>
                    <div class="flex gap-3">
                        <input type="color" name="theme_success_color" value="{{ $settings['theme_success_color'] ?? '#10b981' }}" 
                               class="h-14 w-20 rounded-lg border-2 border-gray-200 cursor-pointer transition-all hover:border-green-500 hover:scale-105">
                        <input type="text" name="theme_success_color_hex" value="{{ $settings['theme_success_color'] ?? '#10b981' }}" 
                               class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
                               placeholder="#10b981" pattern="^#[0-9A-Fa-f]{6}$">
                    </div>
                    <p class="text-xs text-gray-600">Used for success messages and confirmations</p>
                </div>

                <!-- Warning Color -->
                <div class="space-y-3">
                    <label class="block text-sm font-bold text-gray-900">
                        <i class="fas fa-circle text-amber-500 mr-2"></i>Warning Color
                    </label>
                    <div class="flex gap-3">
                        <input type="color" name="theme_warning_color" value="{{ $settings['theme_warning_color'] ?? '#f59e0b' }}" 
                               class="h-14 w-20 rounded-lg border-2 border-gray-200 cursor-pointer transition-all hover:border-amber-500 hover:scale-105">
                        <input type="text" name="theme_warning_color_hex" value="{{ $settings['theme_warning_color'] ?? '#f59e0b' }}" 
                               class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-sm"
                               placeholder="#f59e0b" pattern="^#[0-9A-Fa-f]{6}$">
                    </div>
                    <p class="text-xs text-gray-600">Used for warning messages and cautions</p>
                </div>

                <!-- Danger Color -->
                <div class="space-y-3">
                    <label class="block text-sm font-bold text-gray-900">
                        <i class="fas fa-circle text-red-500 mr-2"></i>Danger Color
                    </label>
                    <div class="flex gap-3">
                        <input type="color" name="theme_danger_color" value="{{ $settings['theme_danger_color'] ?? '#ef4444' }}" 
                               class="h-14 w-20 rounded-lg border-2 border-gray-200 cursor-pointer transition-all hover:border-red-500 hover:scale-105">
                        <input type="text" name="theme_danger_color_hex" value="{{ $settings['theme_danger_color'] ?? '#ef4444' }}" 
                               class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono text-sm"
                               placeholder="#ef4444" pattern="^#[0-9A-Fa-f]{6}$">
                    </div>
                    <p class="text-xs text-gray-600">Used for error messages and delete actions</p>
                </div>

            </div>

            <!-- Preview Section -->
            <div class="mt-10 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
                <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <i class="fas fa-eye mr-2 text-indigo-600"></i>Live Preview
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div id="preview-primary" class="p-4 rounded-lg text-white text-center font-semibold shadow-md" style="background-color: {{ $settings['theme_primary_color'] ?? '#6366f1' }}">
                        Primary
                    </div>
                    <div id="preview-secondary" class="p-4 rounded-lg text-white text-center font-semibold shadow-md" style="background-color: {{ $settings['theme_secondary_color'] ?? '#8b5cf6' }}">
                        Secondary
                    </div>
                    <div id="preview-accent" class="p-4 rounded-lg text-white text-center font-semibold shadow-md" style="background-color: {{ $settings['theme_accent_color'] ?? '#ec4899' }}">
                        Accent
                    </div>
                    <div id="preview-success" class="p-4 rounded-lg text-white text-center font-semibold shadow-md" style="background-color: {{ $settings['theme_success_color'] ?? '#10b981' }}">
                        Success
                    </div>
                    <div id="preview-warning" class="p-4 rounded-lg text-white text-center font-semibold shadow-md" style="background-color: {{ $settings['theme_warning_color'] ?? '#f59e0b' }}">
                        Warning
                    </div>
                    <div id="preview-danger" class="p-4 rounded-lg text-white text-center font-semibold shadow-md" style="background-color: {{ $settings['theme_danger_color'] ?? '#ef4444' }}">
                        Danger
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Actions -->
        <div class="px-8 py-6 bg-gray-50 border-t-2 border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <button type="button" onclick="resetToDefaults()" class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-md">
                <i class="fas fa-undo mr-2"></i>Reset to Defaults
            </button>
            <div class="flex gap-3">
                <a href="{{ route('admin.dashboard') }}" class="px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-lg border-2 border-gray-300 transition-all duration-300 hover:scale-105">
                    <i class="fas fa-times mr-2"></i>Cancel
                </a>
                <button type="submit" class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <i class="fas fa-save mr-2"></i>Save Theme
                </button>
            </div>
        </div>
    </form>
</div>

<script>
// Live preview updates
document.querySelectorAll('input[type="color"]').forEach(input => {
    input.addEventListener('input', function() {
        const colorType = this.name;
        const hexInput = document.querySelector(`input[name="${colorType}_hex"]`);
        const previewId = colorType.replace('theme_', 'preview-').replace('_color', '');
        const previewElement = document.getElementById(previewId);
        
        if (hexInput) hexInput.value = this.value;
        if (previewElement) previewElement.style.backgroundColor = this.value;
    });
});

document.querySelectorAll('input[type="text"][pattern]').forEach(input => {
    input.addEventListener('input', function() {
        const colorType = this.name.replace('_hex', '');
        const colorInput = document.querySelector(`input[name="${colorType}"]`);
        const previewId = colorType.replace('theme_', 'preview-').replace('_color', '');
        const previewElement = document.getElementById(previewId);
        
        if (this.value.match(/^#[0-9A-Fa-f]{6}$/)) {
            if (colorInput) colorInput.value = this.value;
            if (previewElement) previewElement.style.backgroundColor = this.value;
        }
    });
});

function resetToDefaults() {
    const defaults = {
        'theme_primary_color': '#6366f1',
        'theme_secondary_color': '#8b5cf6',
        'theme_accent_color': '#ec4899',
        'theme_success_color': '#10b981',
        'theme_warning_color': '#f59e0b',
        'theme_danger_color': '#ef4444'
    };
    
    if (confirm('Reset all theme colors to default values?')) {
        Object.entries(defaults).forEach(([key, value]) => {
            const colorInput = document.querySelector(`input[name="${key}"]`);
            const hexInput = document.querySelector(`input[name="${key}_hex"]`);
            const previewId = key.replace('theme_', 'preview-').replace('_color', '');
            const previewElement = document.getElementById(previewId);
            
            if (colorInput) colorInput.value = value;
            if (hexInput) hexInput.value = value;
            if (previewElement) previewElement.style.backgroundColor = value;
        });
    }
}
</script>
@endsection
