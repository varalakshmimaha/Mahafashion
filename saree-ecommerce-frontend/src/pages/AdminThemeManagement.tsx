/**
 * Theme Colors Management Page
 *
 * Features:
 * - Display active theme in a hero card with 4 main colors
 * - Show all themes in a table format
 * - Create, edit, activate, and delete themes
 * - Toggle theme activation
 * - Real-time CSS variable updates
 */

import React, { useState, useEffect } from 'react';
import { themeAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Palette, Plus, Check, Eye, X } from 'lucide-react';

interface Theme {
  id: number;
  name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  success_color: string;
  warning_color: string;
  danger_color: string;
  is_active: boolean;
  created_at?: string;
}

const AdminThemeManagement: React.FC = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const { addNotification } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    primary_color: '#800020',
    secondary_color: '#A52A2A',
    accent_color: '#FFD700',
    success_color: '#10b981',
    warning_color: '#f59e0b',
    danger_color: '#ef4444',
  });

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      setIsLoading(true);
      const data = await themeAPI.getAll();
      setThemes(data);
    } catch (error) {
      console.error('Error loading themes:', error);
      addNotification('Failed to load themes', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTheme) {
        await themeAPI.update(editingTheme.id, formData);
        addNotification('Theme updated successfully', 'success');
      } else {
        await themeAPI.create(formData);
        addNotification('Theme created successfully', 'success');
      }
      
      setShowModal(false);
      resetForm();
      loadThemes();
    } catch (error: any) {
      console.error('Error saving theme:', error);
      addNotification(error.message || 'Failed to save theme', 'error');
    }
  };

  const handleEdit = (theme: Theme) => {
    setEditingTheme(theme);
    setFormData({
      name: theme.name,
      primary_color: theme.primary_color,
      secondary_color: theme.secondary_color,
      accent_color: theme.accent_color,
      success_color: theme.success_color,
      warning_color: theme.warning_color,
      danger_color: theme.danger_color,
    });
    setShowModal(true);
  };

  const handleActivate = async (id: number) => {
    try {
      await themeAPI.activate(id);
      addNotification('Theme activated successfully', 'success');
      loadThemes();
      
      // Apply theme to CSS variables
      const theme = themes.find(t => t.id === id);
      if (theme) {
        applyThemeColors(theme);
      }
    } catch (error) {
      console.error('Error activating theme:', error);
      addNotification('Failed to activate theme', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this theme?')) return;

    try {
      await themeAPI.delete(id);
      addNotification('Theme deleted successfully', 'success');
      loadThemes();
    } catch (error: any) {
      console.error('Error deleting theme:', error);
      addNotification(error.message || 'Failed to delete theme', 'error');
    }
  };

  const applyThemeColors = (theme: Theme) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary_color);
    root.style.setProperty('--color-secondary', theme.secondary_color);
    root.style.setProperty('--color-accent', theme.accent_color);
    root.style.setProperty('--color-success', theme.success_color);
    root.style.setProperty('--color-warning', theme.warning_color);
    root.style.setProperty('--color-danger', theme.danger_color);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      primary_color: '#800020',
      secondary_color: '#A52A2A',
      accent_color: '#FFD700',
      success_color: '#10b981',
      warning_color: '#f59e0b',
      danger_color: '#ef4444',
    });
    setEditingTheme(null);
  };

  const activeTheme = themes.find(t => t.is_active);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Theme Colors</h1>
          <p className="text-gray-600 text-lg">Theme Colors Management</p>
        </div>

        {/* Create Theme Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Create Theme
          </button>
        </div>

        {/* Active Theme Card Section */}
        {activeTheme && (
          <div className="mb-12">
            <div className="bg-white rounded-xl shadow-sm p-8">
              {/* Header with Badge */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Active Theme</h2>
                <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  Currently Active
                </span>
              </div>

              {/* Color Palette Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Primary', color: activeTheme.primary_color },
                  { label: 'Secondary', color: activeTheme.secondary_color },
                  { label: 'Accent', color: activeTheme.accent_color },
                  { label: 'Danger', color: activeTheme.danger_color },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div
                      className="w-full h-32 rounded-lg border-2 border-gray-200 shadow-md mb-4 hover:shadow-lg transition-shadow"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.label}</h3>
                    <p className="text-gray-600 font-mono text-sm">{item.color}</p>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(activeTheme)}
                  className="px-6 py-2 text-orange-600 font-medium hover:text-orange-700 transition-colors"
                >
                  Edit Theme
                </button>
                <button
                  onClick={() => handleEdit(activeTheme)}
                  className="px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-medium rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all"
                >
                  <Eye className="w-4 h-4 inline mr-2" />
                  Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* All Themes Table Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">All Themes</h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Preview</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
                  <th className="px-8 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {themes.map((theme) => (
                  <tr key={theme.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    {/* Name */}
                    <td className="px-8 py-4">
                      <span className="font-semibold text-gray-900">{theme.name}</span>
                    </td>

                    {/* Preview */}
                    <td className="px-8 py-4">
                      <div className="flex gap-2">
                        <div
                          className="w-8 h-8 rounded border border-gray-300"
                          style={{ backgroundColor: theme.primary_color }}
                          title={`Primary: ${theme.primary_color}`}
                        ></div>
                        <div
                          className="w-8 h-8 rounded border border-gray-300"
                          style={{ backgroundColor: theme.secondary_color }}
                          title={`Secondary: ${theme.secondary_color}`}
                        ></div>
                        <div
                          className="w-8 h-8 rounded border border-gray-300"
                          style={{ backgroundColor: theme.accent_color }}
                          title={`Accent: ${theme.accent_color}`}
                        ></div>
                        <div
                          className="w-8 h-8 rounded border border-gray-300"
                          style={{ backgroundColor: theme.danger_color }}
                          title={`Danger: ${theme.danger_color}`}
                        ></div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-8 py-4">
                      {theme.is_active ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full inline-flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Created */}
                    <td className="px-8 py-4 text-gray-600 text-sm">
                      {theme.created_at || 'N/A'}
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => handleEdit(theme)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleEdit(theme)}
                          className="text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                        >
                          Preview
                        </button>
                        {!theme.is_active && (
                          <>
                            <button
                              onClick={() => handleActivate(theme.id)}
                              className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                            >
                              Activate
                            </button>
                            <button
                              onClick={() => handleDelete(theme.id)}
                              className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {themes.length === 0 && (
            <div className="px-8 py-12 text-center">
              <Palette className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No themes found. Create one to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingTheme ? 'Edit Theme' : 'Create New Theme'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Theme Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Theme Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="e.g., Ocean Blue, Forest Green"
                />
              </div>

              {/* Color Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'primary_color', label: 'Primary Color' },
                  { key: 'secondary_color', label: 'Secondary Color' },
                  { key: 'accent_color', label: 'Accent Color' },
                  { key: 'success_color', label: 'Success Color' },
                  { key: 'warning_color', label: 'Warning Color' },
                  { key: 'danger_color', label: 'Danger Color' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      {field.label}
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-14 h-12 rounded-lg border border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                      />
                      <input
                        type="text"
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-mono text-sm"
                        placeholder="#000000"
                        pattern="^#[0-9A-Fa-f]{6}$"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
                >
                  {editingTheme ? 'Update Theme' : 'Create Theme'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminThemeManagement;
