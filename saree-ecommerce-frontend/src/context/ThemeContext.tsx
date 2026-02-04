import React, { createContext, useContext, useEffect, useState } from 'react';
import { settingsAPI, themeAPI } from '../services/api';
import { themes, defaultTheme, Theme, ThemeColors } from '../styles/themes';

interface ThemeContextType {
  currentTheme: Theme | null;
  customColors: ThemeColors | null;
  isLoading: boolean;
  refreshTheme: () => Promise<void>;
  applyThemePreset: (themeId: string) => Promise<void>;
  updateThemeColors: (colors: Partial<ThemeColors>) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [customColors, setCustomColors] = useState<ThemeColors | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const adjustColor = (hex: string, percent: number): string => {
    if (!hex) return '#000000';
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  const applyColorsToDocument = (colors: ThemeColors) => {
    const root = document.documentElement;

    // Base colors
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-warning', colors.warning);
    root.style.setProperty('--color-danger', colors.danger);

    // Variants (Light +40%, Dark -40%)
    root.style.setProperty('--color-primary-light', adjustColor(colors.primary, 40));
    root.style.setProperty('--color-primary-dark', adjustColor(colors.primary, -40));
    root.style.setProperty('--color-secondary-light', adjustColor(colors.secondary, 40));
    root.style.setProperty('--color-secondary-dark', adjustColor(colors.secondary, -40));
    root.style.setProperty('--color-accent-light', adjustColor(colors.accent, 40));
    root.style.setProperty('--color-accent-dark', adjustColor(colors.accent, -40));
  };


  const fetchTheme = async () => {
    setIsLoading(true);
    try {
      // Use the new dedicated theme API
      const themeData = await themeAPI.getActiveTheme();

      if (themeData) {
        const loadedColors: ThemeColors = {
          primary: themeData.primary_color || defaultTheme.colors.primary,
          secondary: themeData.secondary_color || defaultTheme.colors.secondary,
          accent: themeData.accent_color || defaultTheme.colors.accent,
          success: themeData.success_color || defaultTheme.colors.success,
          warning: themeData.warning_color || defaultTheme.colors.warning,
          danger: themeData.danger_color || defaultTheme.colors.danger,
        };

        setCustomColors(loadedColors);
        applyColorsToDocument(loadedColors);

        // Apply extended theme properties (fonts, border-radius, background)
        const root = document.documentElement;
        if (themeData.font_family) root.style.setProperty('--font-sans', themeData.font_family);
        if (themeData.border_radius) root.style.setProperty('--border-radius', themeData.border_radius);
        if (themeData.background_color) root.style.setProperty('--color-background', themeData.background_color);
        if (themeData.text_color) root.style.setProperty('--color-text', themeData.text_color);

        // Ensure --color-button is always set (legacy)
        root.style.setProperty('--color-button', themeData.button_color || loadedColors.primary);

        // New Button Theme Variables
        root.style.setProperty('--btn-bg', themeData.button_color || loadedColors.primary);
        root.style.setProperty('--btn-hover-bg', themeData.button_hover_color || adjustColor(loadedColors.primary, -10));

        // Ensure text color is valid, default to white if not set or invalid
        const btnTextColor = themeData.button_text_color || '#ffffff';
        root.style.setProperty('--btn-text-color', btnTextColor);

        root.style.setProperty('--btn-font-size', themeData.button_font_size || '1rem');
        root.style.setProperty('--btn-font-weight', themeData.button_font_weight || '600');
        root.style.setProperty('--btn-radius', themeData.border_radius || '0.375rem');

        // Helper for matching preset (optional)
        const match = themes.find(t =>
          t.colors.primary.toLowerCase() === loadedColors.primary.toLowerCase()
        );
        setCurrentTheme(match || null);
      } else {
        // Fallback to defaults
        applyColorsToDocument(defaultTheme.colors);
        setCustomColors(defaultTheme.colors);
        document.documentElement.style.setProperty('--color-button', defaultTheme.colors.primary);
      }

    } catch (error) {
      console.error('Failed to load theme:', error);
      applyColorsToDocument(defaultTheme.colors);
      setCustomColors(defaultTheme.colors);
      document.documentElement.style.setProperty('--color-button', defaultTheme.colors.primary);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTheme();

    // Refresh theme when user returns to the tab
    const handleFocus = () => {
      fetchTheme();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const refreshTheme = async () => {
    await fetchTheme();
  };

  const applyThemePreset = async (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    // Optimistic Update
    setCurrentTheme(theme);
    setCustomColors(theme.colors);
    applyColorsToDocument(theme.colors);

    // Save to backend
    try {
      await settingsAPI.updateSettings({
        theme_primary_color: theme.colors.primary,
        theme_secondary_color: theme.colors.secondary,
        theme_accent_color: theme.colors.accent,
        theme_success_color: theme.colors.success,
        theme_warning_color: theme.colors.warning,
        theme_danger_color: theme.colors.danger,
      });
    } catch (error) {
      console.error("Failed to save theme preset", error);
      fetchTheme(); // Revert on error
    }
  };

  const updateThemeColors = async (colors: Partial<ThemeColors>) => {
    if (!customColors) return;
    const newColors: ThemeColors = {
      primary: colors.primary ?? customColors.primary,
      secondary: colors.secondary ?? customColors.secondary,
      accent: colors.accent ?? customColors.accent,
      success: colors.success ?? customColors.success,
      warning: colors.warning ?? customColors.warning,
      danger: colors.danger ?? customColors.danger,
    };

    setCustomColors(newColors);
    applyColorsToDocument(newColors);
    setCurrentTheme(null); // Custom

    try {
      await settingsAPI.updateSettings({
        theme_primary_color: newColors.primary,
        theme_secondary_color: newColors.secondary,
        theme_accent_color: newColors.accent,
        theme_success_color: newColors.success,
        theme_warning_color: newColors.warning,
        theme_danger_color: newColors.danger,
      });
    } catch (error) {
      console.error("Failed to save custom colors", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, customColors, isLoading, refreshTheme, applyThemePreset, updateThemeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
