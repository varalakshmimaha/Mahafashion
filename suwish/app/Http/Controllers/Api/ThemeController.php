<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Theme;
use Illuminate\Http\Request;

class ThemeController extends Controller
{
    public function index()
    {
        return Theme::all();
    }

    public function show($id)
    {
        return Theme::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'primary_color' => 'required|string',
            'secondary_color' => 'required|string',
            'accent_color' => 'required|string',
            'success_color' => 'required|string',
            'warning_color' => 'required|string',
            'danger_color' => 'required|string',
            'button_color' => 'nullable|string',
            'button_hover_color' => 'nullable|string',
            'button_text_color' => 'nullable|string',
            'border_radius' => 'nullable|string',
            'button_font_size' => 'nullable|string',
            'button_font_weight' => 'nullable|string',
        ]);

        $theme = Theme::create($request->all());

        return response()->json($theme, 201);
    }

    public function update(Request $request, $id)
    {
        $theme = Theme::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'primary_color' => 'sometimes|required|string',
            // Allow loose validation for updates
        ]);

        $theme->update($request->all());

        return response()->json($theme);
    }

    public function destroy($id)
    {
        $theme = Theme::findOrFail($id);
        
        if ($theme->is_active) {
            return response()->json(['message' => 'Cannot delete active theme'], 400);
        }

        $theme->delete();

        return response()->json(['message' => 'Theme deleted successfully']);
    }

    public function getActive(Request $request)
    {
        $theme = Theme::where('is_active', true)->first();

        // If no active theme found, return a default structure
        if (!$theme) {
            return response()->json([
                'id' => null,
                'name' => 'Default',
                'primary_color' => '#6366f1',
                'secondary_color' => '#8b5cf6',
                'accent_color' => '#ec4899',
                'success_color' => '#10b981',
                'warning_color' => '#f59e0b',
                'danger_color' => '#ef4444',
                'button_color' => '#6366f1',
                'text_color' => '#1f2937',
                'background_color' => '#ffffff',
                'font_family' => 'Inter, sans-serif',
                'border_radius' => '0.375rem',
            ]);
        }

        return response()->json($theme);
    }

    public function activate(Request $request, $id)
    {
        $theme = Theme::findOrFail($id);

        // The model observer handles deactivating others, but let's be explicit
        // Theme::where('is_active', true)->update(['is_active' => false]);

        $theme->is_active = true;
        $theme->save();

        return response()->json($theme);
    }
}
