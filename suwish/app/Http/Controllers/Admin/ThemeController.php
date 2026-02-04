<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Theme;
use Illuminate\Http\Request;

class ThemeController extends Controller
{
    public function index()
    {
        $themes = Theme::all();
        return view('admin.themes.index', compact('themes'));
    }

    public function create()
    {
        return view('admin.themes.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:themes,name',
            'primary_color' => 'required|string',
            'secondary_color' => 'required|string',
            'accent_color' => 'nullable|string',
            'success_color' => 'nullable|string',
            'warning_color' => 'nullable|string',
            'danger_color' => 'nullable|string',
            'button_color' => 'nullable|string',
            'button_hover_color' => 'nullable|string',
            'button_text_color' => 'nullable|string',
            'text_color' => 'required|string',
            'background_color' => 'required|string',
            'font_family' => 'required|string',
            'border_radius' => 'required|string',
            'button_font_size' => 'nullable|string',
            'button_font_weight' => 'nullable|string',
            'header_style' => 'required|string',
            'footer_style' => 'required|string',
            'is_active' => 'boolean'
        ]);
        
        // Provide default values for required columns not in form
        $validated['accent_color'] = $validated['accent_color'] ?? $validated['secondary_color'];
        $validated['success_color'] = $validated['success_color'] ?? '#10b981';
        $validated['warning_color'] = $validated['warning_color'] ?? '#f59e0b';
        $validated['danger_color'] = $validated['danger_color'] ?? '#ef4444';
        
        // Button Defaults
        $validated['button_color'] = $validated['button_color'] ?? $validated['primary_color'];
        $validated['button_hover_color'] = $validated['button_hover_color'] ?? $validated['secondary_color'];
        $validated['button_text_color'] = $validated['button_text_color'] ?? '#ffffff';

        Theme::create($validated);

        return redirect()->route('admin.themes.index')->with('success', 'Theme created successfully.');
    }

    public function edit(Theme $theme)
    {
        return view('admin.themes.edit', compact('theme'));
    }

    public function update(Request $request, Theme $theme)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:themes,name,' . $theme->id,
            'primary_color' => 'required|string',
            'secondary_color' => 'required|string',
            'accent_color' => 'nullable|string',
            'success_color' => 'nullable|string',
            'warning_color' => 'nullable|string',
            'danger_color' => 'nullable|string',
            'button_color' => 'nullable|string',
            'button_hover_color' => 'nullable|string',
            'button_text_color' => 'nullable|string',
            'text_color' => 'required|string',
            'background_color' => 'required|string',
            'font_family' => 'required|string',
            'border_radius' => 'required|string',
            'button_font_size' => 'nullable|string',
            'button_font_weight' => 'nullable|string',
            'header_style' => 'required|string',
            'footer_style' => 'required|string',
        ]);
        
        // Explicitly handle is_active as it might be missing if unchecked
        $validated['is_active'] = $request->has('is_active');
        
        // Default fallbacks for updates if fields are cleared/missing
        if (!$request->has('accent_color')) $validated['accent_color'] = $validated['secondary_color'];
        
        $theme->update($validated);

        return redirect()->route('admin.themes.index')->with('success', 'Theme updated successfully.');
    }

    public function destroy(Theme $theme)
    {
        if ($theme->is_active) {
             return back()->with('error', 'Cannot delete the active theme.');
        }
        $theme->delete();
        return redirect()->route('admin.themes.index')->with('success', 'Theme deleted successfully.');
    }

    public function activate(Theme $theme)
    {
        $theme->update(['is_active' => true]);
        return redirect()->route('admin.themes.index')->with('success', 'Theme activated successfully.');
    }
}
