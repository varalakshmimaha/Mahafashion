# General Settings Functionality

## Overview
The General Settings functionality allows administrators to manage website-wide settings including website information, contact details, social media links, branding assets, and maintenance mode.

## Features Implemented

### 1. Website Information
- **Website Name**: Required field for the site name
- **Website Title**: Required field for the site title
- **Website Description**: Optional description field

### 2. Branding Assets
- **Logo Upload**: Admin can upload logo images (jpeg, png, jpg, gif) up to 2MB
- **Favicon Upload**: Admin can upload favicon images (jpeg, png, jpg, ico, gif) up to 2MB
- **Automatic Cleanup**: Old images are automatically deleted when replaced
- **Storage Location**: Images are stored in `storage/app/public/settings/`
- **Frontend Display**: Uses Laravel's `Storage::url()` for proper URL generation

### 3. Contact Information
- **Contact Email**: Required email field with validation
- **Contact Phone**: Optional phone number field

### 4. Social Media Links CRUD
- **Facebook URL**: Optional URL field with validation
- **Instagram URL**: Optional URL field with validation
- **Twitter URL**: Optional URL field with validation
- **WhatsApp Number**: Optional field with phone number format validation

### 5. Footer Content
- **Footer Text**: Editable text field for footer content

### 6. Maintenance Mode
- **Toggle Checkbox**: Enable/disable maintenance mode
- **Automatic Commands**: Triggers `php artisan down` or `php artisan up` automatically
- **Type Safety**: Boolean handling with proper value conversion

## Technical Implementation

### Database Schema
- **Table**: `settings`
- **Fields**:
  - `id`: Primary key
  - `key`: Unique setting identifier
  - `value`: Setting value (text field to accommodate long values)
  - `type`: Setting type (string, text, image, boolean, json)
  - `timestamps`: Created and updated timestamps

### Models
- **Setting Model**: Provides static methods for settings management
  - `get($key, $default)`: Retrieve setting value
  - `set($key, $value)`: Set setting value
  - `has($key)`: Check if setting exists
  - `getMultiple($keys, $default)`: Get multiple settings at once
  - `remove($key)`: Remove a setting

### Helper Function
- **setting($key, $default)**: Global helper function for easy settings access
- Usage: `setting('website_name')` in views and controllers

### Controllers
- **SettingsController**: Handles settings management
  - `index()`: Display settings form
  - `update()`: Process settings updates with validation

### Views
- **admin.settings.index**: Complete settings form with all fields
- Proper validation error display
- Current image previews

### Routes
- `GET /admin/settings`: Display settings form
- `PUT /admin/settings`: Update settings

## Frontend Integration

### Logo Display
```html
<img src="{{ setting('logo') }}" alt="Logo">
```

### Favicon Display
```html
<link rel="icon" href="{{ setting('favicon') }}">
```

### Social Media Links
```html
<a href="{{ setting('facebook') }}"><i class="fab fa-facebook"></i></a>
<a href="{{ setting('instagram') }}"><i class="fab fa-instagram"></i></a>
<a href="{{ setting('twitter') }}"><i class="fab fa-twitter"></i></a>
<a href="https://wa.me/{{ setting('whatsapp') }}"><i class="fab fa-whatsapp"></i></a>
```

### Footer Content
```html
{{ setting('footer_content') }}
```

## Validation Rules
- Website Name: Required, string, max:255
- Website Title: Required, string, max:255
- Website Description: Optional, string
- Logo: Optional, image (jpeg,png,jpg,gif), max:2048KB
- Favicon: Optional, image (jpeg,png,jpg,ico,gif), max:2048KB
- Contact Email: Required, email, max:255
- Contact Phone: Optional, string, max:20
- Facebook: Optional, URL, max:255
- Instagram: Optional, URL, max:255
- Twitter: Optional, URL, max:255
- WhatsApp: Optional, phone format regex, max:20
- Footer Content: Optional, string
- Maintenance Mode: Boolean

## File Management
- Uploaded images are stored in `storage/app/public/settings/`
- Old files are automatically deleted when replaced
- Image URLs are generated using `Storage::url()` for proper access
- Type field in database ensures proper handling of different setting types

## Maintenance Mode
- When enabled, automatically runs `php artisan down`
- When disabled, automatically runs `php artisan up`
- Provides immediate maintenance mode toggle functionality