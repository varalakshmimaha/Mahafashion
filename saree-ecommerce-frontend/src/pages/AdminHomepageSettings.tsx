import React, { useState, useEffect } from 'react';
import { Save, Eye, Bell, Mail, Settings, Palette, Image } from 'lucide-react';
import { settingsAPI } from '../services/api';

interface HomepageSettings {
  // Announcement Bar
  announcement_text: string;
  announcement_bg_color: string;
  announcement_text_color: string;
  announcement_link: string;
  announcement_enabled: boolean;
  // Newsletter
  newsletter_title: string;
  newsletter_subtitle: string;
  newsletter_bg_image: string;
  // Why Choose Us
  why_choose_us_title: string;
  // General
  free_shipping_threshold: string;
}

const AdminHomepageSettings: React.FC = () => {
  const [settings, setSettings] = useState<HomepageSettings>({
    announcement_text: '',
    announcement_bg_color: '#7c3aed',
    announcement_text_color: '#ffffff',
    announcement_link: '',
    announcement_enabled: true,
    newsletter_title: 'Stay Updated',
    newsletter_subtitle: 'Subscribe to our newsletter for exclusive offers, new arrivals & styling tips!',
    newsletter_bg_image: '',
    why_choose_us_title: 'Why Choose Us',
    free_shipping_threshold: '999',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'announcement' | 'newsletter' | 'trust' | 'general'>('announcement');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await settingsAPI.getSettings();
      setSettings({
        announcement_text: data.announcement_text || '',
        announcement_bg_color: data.announcement_bg_color || '#7c3aed',
        announcement_text_color: data.announcement_text_color || '#ffffff',
        announcement_link: data.announcement_link || '',
        announcement_enabled: data.announcement_enabled !== false,
        newsletter_title: data.newsletter_title || 'Stay Updated',
        newsletter_subtitle: data.newsletter_subtitle || 'Subscribe to our newsletter for exclusive offers, new arrivals & styling tips!',
        newsletter_bg_image: data.newsletter_bg_image || '',
        why_choose_us_title: data.why_choose_us_title || 'Why Choose Us',
        free_shipping_threshold: data.free_shipping_threshold || '999',
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      await settingsAPI.updateSettings(settings);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof HomepageSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'announcement', label: 'Announcement Bar', icon: Bell },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'trust', label: 'Trust Badges', icon: Settings },
    { id: 'general', label: 'General', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Homepage Settings</h1>
          <p className="text-gray-600">Manage your homepage content and appearance</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-t-xl border border-b-0 border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-xl border border-gray-200 p-6">
          {/* Announcement Bar Tab */}
          {activeTab === 'announcement' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Enable Announcement Bar</h3>
                  <p className="text-sm text-gray-500">Show the announcement bar at the top of your website</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.announcement_enabled}
                    onChange={(e) => handleChange('announcement_enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Announcement Text
                </label>
                <input
                  type="text"
                  value={settings.announcement_text}
                  onChange={(e) => handleChange('announcement_text', e.target.value)}
                  placeholder="🎉 Free Shipping on orders above ₹999 | Use code WELCOME10 for 10% off!"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link URL (optional)
                </label>
                <input
                  type="text"
                  value={settings.announcement_link}
                  onChange={(e) => handleChange('announcement_link', e.target.value)}
                  placeholder="/products?on_sale=true"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={settings.announcement_bg_color}
                      onChange={(e) => handleChange('announcement_bg_color', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.announcement_bg_color}
                      onChange={(e) => handleChange('announcement_bg_color', e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={settings.announcement_text_color}
                      onChange={(e) => handleChange('announcement_text_color', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.announcement_text_color}
                      onChange={(e) => handleChange('announcement_text_color', e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Eye size={16} className="inline mr-1" />
                  Preview
                </label>
                <div
                  className="py-2.5 px-4 text-center text-sm font-medium rounded-lg"
                  style={{
                    backgroundColor: settings.announcement_bg_color,
                    color: settings.announcement_text_color,
                  }}
                >
                  {settings.announcement_text || 'Your announcement text will appear here'}
                </div>
              </div>
            </div>
          )}

          {/* Newsletter Tab */}
          {activeTab === 'newsletter' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Newsletter Title
                </label>
                <input
                  type="text"
                  value={settings.newsletter_title}
                  onChange={(e) => handleChange('newsletter_title', e.target.value)}
                  placeholder="Stay Updated"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Newsletter Subtitle
                </label>
                <textarea
                  value={settings.newsletter_subtitle}
                  onChange={(e) => handleChange('newsletter_subtitle', e.target.value)}
                  placeholder="Subscribe to our newsletter for exclusive offers, new arrivals & styling tips!"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image size={16} className="inline mr-1" />
                  Background Image URL
                </label>
                <input
                  type="text"
                  value={settings.newsletter_bg_image}
                  onChange={(e) => handleChange('newsletter_bg_image', e.target.value)}
                  placeholder="https://example.com/newsletter-bg.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Leave empty to use the default gradient background
                </p>
              </div>
            </div>
          )}

          {/* Trust Badges Tab */}
          {activeTab === 'trust' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={settings.why_choose_us_title}
                  onChange={(e) => handleChange('why_choose_us_title', e.target.value)}
                  placeholder="Why Choose Us"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="p-4 bg-blue-50 text-blue-800 rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> Trust badges are currently using default values. In a future update, you'll be able to customize individual trust badges with custom icons and text.
                </p>
              </div>

              {/* Default Trust Badges Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Trust Badges</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { title: 'Free Shipping', description: 'On orders above ₹999' },
                    { title: '100% Secure', description: 'Safe & secure checkout' },
                    { title: 'Easy Returns', description: '7-day return policy' },
                    { title: 'COD Available', description: 'Pay on delivery' },
                    { title: '24/7 Support', description: 'Dedicated support team' },
                    { title: 'Quality Assured', description: 'Premium quality products' },
                  ].map((badge, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="font-medium text-gray-900">{badge.title}</p>
                      <p className="text-sm text-gray-500">{badge.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Free Shipping Threshold (₹)
                </label>
                <input
                  type="text"
                  value={settings.free_shipping_threshold}
                  onChange={(e) => handleChange('free_shipping_threshold', e.target.value)}
                  placeholder="999"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Customers get free shipping on orders above this amount
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHomepageSettings;
