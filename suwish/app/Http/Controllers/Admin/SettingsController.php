<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = [
            'website_name' => Setting::get('website_name'),
            'website_title' => Setting::get('website_title'),
            'website_description' => Setting::get('website_description'),
            'logo' => Setting::get('logo'),
            'favicon' => Setting::get('favicon'),
            'contact_email' => Setting::get('contact_email'),
            'contact_phone' => Setting::get('contact_phone'),
            'facebook' => Setting::get('facebook'),
            'instagram' => Setting::get('instagram'),
            'twitter' => Setting::get('twitter'),
            'whatsapp' => Setting::get('whatsapp'),
            'footer_content' => Setting::get('footer_content'),
            'maintenance_mode' => Setting::get('maintenance_mode') === '1',
        ];

        $socialLinks = \App\Models\SocialMediaLink::orderBy('sort_order')->get();

        return view('admin.settings.index', compact('settings', 'socialLinks'));
    }

    public function update(Request $request)
    {
        $request->validate([
            'website_name' => 'required|string|max:255',
            'website_title' => 'required|string|max:255',
            'website_description' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'favicon' => 'nullable|image|mimes:jpeg,png,jpg,ico,gif|max:2048',
            'contact_email' => 'required|email|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'facebook' => 'nullable|url|max:255',
            'instagram' => 'nullable|url|max:255',
            'twitter' => 'nullable|url|max:255',
            'whatsapp' => 'nullable|regex:/^[0-9\-\+\s\(\)]+$/|max:20',
            'footer_content' => 'nullable|string',
            'maintenance_mode' => 'nullable|boolean',
        ]);

        // Update basic settings
        Setting::set('website_name', $request->website_name);
        Setting::set('website_title', $request->website_title);
        Setting::set('website_description', $request->website_description);
        Setting::set('contact_email', $request->contact_email);
        Setting::set('contact_phone', $request->contact_phone);
        Setting::set('facebook', $request->facebook);
        Setting::set('instagram', $request->instagram);
        Setting::set('twitter', $request->twitter);
        Setting::set('whatsapp', $request->whatsapp);
        Setting::set('footer_content', $request->footer_content);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            $oldLogo = Setting::get('logo');
            if ($oldLogo && Storage::exists(str_replace(Storage::url(''), '', $oldLogo))) {
                Storage::delete(str_replace(Storage::url(''), '', $oldLogo));
            }

            $logoPath = $request->file('logo')->store('settings', 'public');
            $setting = Setting::updateOrCreate(['key' => 'logo'], ['value' => $logoPath, 'type' => 'image']);
        }

        // Handle favicon upload
        if ($request->hasFile('favicon')) {
            // Delete old favicon if exists
            $oldFavicon = Setting::get('favicon');
            if ($oldFavicon && Storage::exists(str_replace(Storage::url(''), '', $oldFavicon))) {
                Storage::delete(str_replace(Storage::url(''), '', $oldFavicon));
            }

            $faviconPath = $request->file('favicon')->store('settings', 'public');
            $setting = Setting::updateOrCreate(['key' => 'favicon'], ['value' => $faviconPath, 'type' => 'image']);
        }

        // Handle maintenance mode
        $maintenanceMode = $request->has('maintenance_mode') ? '1' : '0';
        Setting::set('maintenance_mode', $maintenanceMode);

        // Execute artisan commands for maintenance mode
        if ($maintenanceMode === '1') {
            Artisan::call('down');
        } else {
            Artisan::call('up');
        }

        return redirect()->route('admin.settings.index')->with('success', 'Settings updated successfully!');
    }

    public function theme()
    {
        $settings = [
            'theme_primary_color' => Setting::get('theme_primary_color', '#6366f1'),
            'theme_secondary_color' => Setting::get('theme_secondary_color', '#8b5cf6'),
            'theme_accent_color' => Setting::get('theme_accent_color', '#ec4899'),
            'theme_success_color' => Setting::get('theme_success_color', '#10b981'),
            'theme_warning_color' => Setting::get('theme_warning_color', '#f59e0b'),
            'theme_danger_color' => Setting::get('theme_danger_color', '#ef4444'),
        ];

        return view('admin.settings.theme', compact('settings'));
    }

    public function updateTheme(Request $request)
    {
        $request->validate([
            'theme_primary_color' => 'required|regex:/^#[0-9A-Fa-f]{6}$/',
            'theme_secondary_color' => 'required|regex:/^#[0-9A-Fa-f]{6}$/',
            'theme_accent_color' => 'required|regex:/^#[0-9A-Fa-f]{6}$/',
            'theme_success_color' => 'required|regex:/^#[0-9A-Fa-f]{6}$/',
            'theme_warning_color' => 'required|regex:/^#[0-9A-Fa-f]{6}$/',
            'theme_danger_color' => 'required|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        // Use hex input if provided, otherwise use color picker value
        Setting::set('theme_primary_color', $request->input('theme_primary_color_hex', $request->theme_primary_color));
        Setting::set('theme_secondary_color', $request->input('theme_secondary_color_hex', $request->theme_secondary_color));
        Setting::set('theme_accent_color', $request->input('theme_accent_color_hex', $request->theme_accent_color));
        Setting::set('theme_success_color', $request->input('theme_success_color_hex', $request->theme_success_color));
        Setting::set('theme_warning_color', $request->input('theme_warning_color_hex', $request->theme_warning_color));
        Setting::set('theme_danger_color', $request->input('theme_danger_color_hex', $request->theme_danger_color));

        return redirect()->route('admin.settings.theme')->with('success', 'Theme colors updated successfully!');
    }
}