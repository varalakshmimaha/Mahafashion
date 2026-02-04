import React, { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { settingsAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../styles/themes';
import { Save, Globe, Mail, Facebook, Twitter, Instagram, MessageCircle, Youtube, Linkedin, Palette } from 'lucide-react';
import SocialMediaSettings from '../components/admin/SocialMediaSettings';

const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    website_name: '',
    website_tagline: '',
    footer_content: '',
    contact_email: '',
    contact_phone: '',
    facebook: '',
    instagram: '',
    twitter: '',
    whatsapp: '',
    youtube: '',
    linkedin: '',
    pinterest: '',
    copyright_text: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { addNotification } = useNotification();
  const { applyThemePreset, currentTheme } = useTheme();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await settingsAPI.getSettings();
      setSettings({
        website_name: data.website_name || '',
        website_tagline: data.website_tagline || '',
        footer_content: data.footer_content || '',
        contact_email: data.contact_email || '',
        contact_phone: data.contact_phone || '',
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        twitter: data.twitter || '',
        whatsapp: data.whatsapp || '',
        youtube: data.youtube || '',
        linkedin: data.linkedin || '',
        pinterest: data.pinterest || '',
        copyright_text: data.copyright_text || '',
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      addNotification('Failed to load settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await settingsAPI.updateSettings(settings);
      addNotification('Settings updated successfully', 'success');
    } catch (error) {
      console.error('Error updating settings:', error);
      addNotification('Failed to update settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Website Settings</h1>
          <Globe className="w-8 h-8 text-primary" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Theme Settings */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Website Appearance (Themes)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  onClick={() => applyThemePreset(theme.id)}
                  className={`
                    cursor-pointer p-4 rounded-lg border-2 transition-all
                    ${currentTheme?.id === theme.id ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: theme.colors.primary }}></div>
                    <span className="font-medium text-gray-900">{theme.name}</span>
                  </div>
                  <div className="flex gap-1 h-3 rounded overflow-hidden">
                    <div className="flex-1" style={{ backgroundColor: theme.colors.primary }}></div>
                    <div className="flex-1" style={{ backgroundColor: theme.colors.secondary }}></div>
                    <div className="flex-1" style={{ backgroundColor: theme.colors.accent }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* General Settings */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">General Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website Name
                </label>
                <input
                  type="text"
                  name="website_name"
                  value={settings.website_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Suwish"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website Tagline
                </label>
                <input
                  type="text"
                  name="website_tagline"
                  value={settings.website_tagline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Your one-stop shop for beautiful sarees and ethnic wear"
                />
                <p className="mt-1 text-sm text-gray-500">This appears in the footer under your website name</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Copyright Text
                </label>
                <input
                  type="text"
                  name="copyright_text"
                  value={settings.copyright_text}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="© 2026 Suwish. All Rights Reserved."
                />
                <p className="mt-1 text-sm text-gray-500">Custom copyright text (leave empty to use default)</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={settings.contact_email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="contact@suwish.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={settings.contact_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+91 1234567890"
                />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="border-b pb-6">
            <SocialMediaSettings />
          </div>

          {/* Additional Footer Content */}
          <div className="pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Footer Content</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Footer Content (HTML supported)
              </label>
              <textarea
                name="footer_content"
                value={settings.footer_content}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Additional text or HTML content to display in the footer"
              />
              <p className="mt-1 text-sm text-gray-500">This content appears at the bottom of the footer. HTML is supported.</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
