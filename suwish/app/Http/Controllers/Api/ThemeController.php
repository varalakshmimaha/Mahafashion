<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ThemeController extends Controller
{
    /**
     * Display a listing of themes.
     */
    public function index()
    {
        // Return active theme first, then others by date
        $themes = Theme::orderByRaw("FIELD(status, 'active') DESC")
                       ->orderBy('created_at', 'desc')
                       ->get();
        return response()->json($themes);
    }

    /**
     * Get the currently active theme for frontend application.
     */
    public function getActiveTheme()
    {
        $theme = Theme::where('status', 'active')->first();
        
        if (!$theme) {
            return response()->json(['message' => 'No active theme found'], 404);
        }
        
        return response()->json($theme);
    }

    /**
     * Store a newly created theme.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'primary_color' => 'required|regex:/^#[0-9A-Fa-f]{6}$/',
            'secondary_color' => 'required|regex:/^#[0-9A-Fa-f]{6}$/',
            'accent_color' => 'required|regex:/^#[0-9A-Fa-f]{6}$/',
            'danger_color' => 'required|regex:/^#[0-9A-Fa-f]{6}$/',
            'status' => 'in:active,inactive'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        $data['status'] = $request->status ?? 'inactive';

        $theme = DB::transaction(function () use ($data) {
            // If setting as active, deactivate all others first
            if ($data['status'] === 'active') {
                Theme::where('status', 'active')->update(['status' => 'inactive']);
            }
            
            return Theme::create($data);
        });

        return response()->json($theme, 201);
    }

    /**
     * Update the specified theme.
     */
    public function update(Request $request, $id)
    {
        $theme = Theme::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'primary_color' => 'sometimes|regex:/^#[0-9A-Fa-f]{6}$/',
            'secondary_color' => 'sometimes|regex:/^#[0-9A-Fa-f]{6}$/',
            'accent_color' => 'sometimes|regex:/^#[0-9A-Fa-f]{6}$/',
            'danger_color' => 'sometimes|regex:/^#[0-9A-Fa-f]{6}$/',
            'status' => 'in:active,inactive'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();

        DB::transaction(function () use ($theme, $data) {
            // If activating this theme, deactivate others
            if (isset($data['status']) && $data['status'] === 'active' && $theme->status !== 'active') {
                Theme::where('status', 'active')->update(['status' => 'inactive']);
            }
            
            $theme->update($data);
        });

        return response()->json($theme);
    }

    /**
     * Activate a specific theme.
     */
    public function activate($id)
    {
        $theme = Theme::findOrFail($id);

        DB::transaction(function () use ($theme) {
            Theme::where('status', 'active')->update(['status' => 'inactive']);
            $theme->update(['status' => 'active']);
        });

        return response()->json(['message' => 'Theme activated successfully', 'theme' => $theme]);
    }

    /**
     * Remove the specified theme.
     */
    public function destroy($id)
    {
        $theme = Theme::findOrFail($id);

        if ($theme->status === 'active') {
            return response()->json(['error' => 'Cannot delete the active theme. Please activate another theme first.'], 400);
        }

        $theme->delete();

        return response()->json(['message' => 'Theme deleted successfully']);
    }
}