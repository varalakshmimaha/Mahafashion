<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function getPublicSettings()
    {
        $settings = [
            'website_name' => Setting::get('website_name'),
            'website_title' => Setting::get('website_title'),
            'website_description' => Setting::get('website_description'),
            'website_tagline' => Setting::get('website_tagline'),
            'logo' => Setting::get('logo'),
            'favicon' => Setting::get('favicon'),
            'contact_email' => Setting::get('contact_email'),
            'contact_phone' => Setting::get('contact_phone'),
            'facebook' => Setting::get('facebook'),
            'instagram' => Setting::get('instagram'),
            'twitter' => Setting::get('twitter'),
            'whatsapp' => Setting::get('whatsapp'),
            'youtube' => Setting::get('youtube'),
            'linkedin' => Setting::get('linkedin'),
            'pinterest' => Setting::get('pinterest'),
            'footer_content' => Setting::get('footer_content'),
            'copyright_text' => Setting::get('copyright_text'),
            'maintenance_mode' => Setting::get('maintenance_mode') === '1',
            // Announcement Bar Settings
            'announcement_text' => Setting::get('announcement_text'),
            'announcement_bg_color' => Setting::get('announcement_bg_color', '#7c3aed'),
            'announcement_text_color' => Setting::get('announcement_text_color', '#ffffff'),
            'announcement_link' => Setting::get('announcement_link'),
            'announcement_enabled' => Setting::get('announcement_enabled', '1') === '1',
            // Newsletter Settings
            'newsletter_title' => Setting::get('newsletter_title', 'Stay Updated'),
            'newsletter_subtitle' => Setting::get('newsletter_subtitle', 'Subscribe to our newsletter for exclusive offers, new arrivals & styling tips!'),
            'newsletter_bg_image' => Setting::get('newsletter_bg_image'),
            // Why Choose Us Settings
            'why_choose_us_title' => Setting::get('why_choose_us_title', 'Why Choose Us'),
            // Free Shipping Threshold
            'free_shipping_threshold' => Setting::get('free_shipping_threshold', '999'),
            // Theme colors
            'theme' => [
                'primary_color' => Setting::get('theme_primary_color', '#6366f1'),
                'secondary_color' => Setting::get('theme_secondary_color', '#8b5cf6'),
                'accent_color' => Setting::get('theme_accent_color', '#ec4899'),
                'success_color' => Setting::get('theme_success_color', '#10b981'),
                'warning_color' => Setting::get('theme_warning_color', '#f59e0b'),
                'danger_color' => Setting::get('theme_danger_color', '#ef4444'),
            ],
        ];

        return response()->json($settings);
    }

    public function getTheme()
    {
        $theme = [
            'primary_color' => Setting::get('theme_primary_color', '#6366f1'),
            'secondary_color' => Setting::get('theme_secondary_color', '#8b5cf6'),
            'accent_color' => Setting::get('theme_accent_color', '#ec4899'),
            'success_color' => Setting::get('theme_success_color', '#10b981'),
            'warning_color' => Setting::get('theme_warning_color', '#f59e0b'),
            'danger_color' => Setting::get('theme_danger_color', '#ef4444'),
        ];

        return response()->json($theme);
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'website_name' => 'nullable|string|max:255',
            'website_tagline' => 'nullable|string|max:500',
            'footer_content' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string',
            'facebook' => 'nullable|url',
            'instagram' => 'nullable|url',
            'twitter' => 'nullable|url',
            'whatsapp' => 'nullable|string',
            'youtube' => 'nullable|url',
            'linkedin' => 'nullable|url',
            'pinterest' => 'nullable|url',
            'copyright_text' => 'nullable|string|max:255',
            // Announcement Bar Settings
            'announcement_text' => 'nullable|string|max:500',
            'announcement_bg_color' => 'nullable|string|max:20',
            'announcement_text_color' => 'nullable|string|max:20',
            'announcement_link' => 'nullable|string|max:255',
            'announcement_enabled' => 'nullable|boolean',
            // Newsletter Settings
            'newsletter_title' => 'nullable|string|max:255',
            'newsletter_subtitle' => 'nullable|string|max:500',
            'newsletter_bg_image' => 'nullable|string',
            // Why Choose Us Settings
            'why_choose_us_title' => 'nullable|string|max:255',
            // Free Shipping Threshold
            'free_shipping_threshold' => 'nullable|string|max:10',
            // Theme colors
            'theme_primary_color' => 'nullable|string',
            'theme_secondary_color' => 'nullable|string',
            'theme_accent_color' => 'nullable|string',
            'theme_success_color' => 'nullable|string',
            'theme_warning_color' => 'nullable|string',
            'theme_danger_color' => 'nullable|string',
        ]);

        foreach ($validated as $key => $value) {
            if ($value !== null) {
                // Convert boolean to string for storage
                if (is_bool($value)) {
                    $value = $value ? '1' : '0';
                }
                Setting::set($key, $value);
            }
        }

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => $this->getPublicSettings()->getData(),
        ]);
    }
}