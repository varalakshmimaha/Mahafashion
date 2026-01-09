<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
    ];

    /**
     * Get a setting value by key
     */
    public static function get($key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        if (!$setting) {
            return $default;
        }

        // If it's an image type, return the asset URL
        if ($setting->type === 'image' && $setting->value) {
            // Check if the value is already an absolute URL
            if (filter_var($setting->value, FILTER_VALIDATE_URL)) {
                return $setting->value;
            }
            // If it starts with '/', use asset() to generate full URL
            elseif (str_starts_with($setting->value, '/')) {
                return asset($setting->value);
            }
            // Otherwise, it's in the storage directory, use asset() with storage prefix
            else {
                return asset('storage/' . $setting->value);
            }
        }

        return $setting->value ?: $default;
    }

    /**
     * Set a setting value by key
     */
    public static function set($key, $value)
    {
        $setting = static::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );

        return $setting;
    }

    /**
     * Check if a setting exists
     */
    public static function has($key)
    {
        return static::where('key', $key)->exists();
    }

    /**
     * Get multiple settings at once
     */
    public static function getMultiple($keys, $default = null)
    {
        $settings = static::whereIn('key', $keys)->get();
        $result = [];

        foreach ($keys as $key) {
            $setting = $settings->firstWhere('key', $key);
            $result[$key] = $setting ? $setting->value : $default;
        }

        return $result;
    }

    /**
     * Remove a setting by key
     */
    public static function remove($key)
    {
        return static::where('key', $key)->delete();
    }
}