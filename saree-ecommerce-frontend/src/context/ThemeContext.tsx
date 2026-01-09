import React, { createContext, useContext, useEffect, useState } from 'react';
import { settingsAPI } from '../services/api';
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
      const settings = await settingsAPI.getSettings();
      // The API returns 'theme' object or strict fields? 
      // Based on Api code: 'theme' => [ 'primary_color' => ... ]
      
      let loadedColors: ThemeColors;

      if (settings.theme) {
         loadedColors = {
            primary: settings.theme.primary_color || defaultTheme.colors.primary,
            secondary: settings.theme.secondary_color || defaultTheme.colors.secondary,
            accent: settings.theme.accent_color || defaultTheme.colors.accent,
            success: settings.theme.success_color || defaultTheme.colors.success,
            warning: settings.theme.warning_color || defaultTheme.colors.warning,
            danger: settings.theme.danger_color || defaultTheme.colors.danger,
         };
      } else {
         loadedColors = defaultTheme.colors;
      }

      setCustomColors(loadedColors);
      applyColorsToDocument(loadedColors);

      // Match preset
      const match = themes.find(t => 
        t.colors.primary.toLowerCase() === loadedColors.primary.toLowerCase() &&
        t.colors.secondary.toLowerCase() === loadedColors.secondary.toLowerCase()
      );
      setCurrentTheme(match || null);

    } catch (error) {
      console.error('Failed to load theme:', error);
      applyColorsToDocument(defaultTheme.colors);
      setCustomColors(defaultTheme.colors);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTheme();
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
    const newColors = { ...customColors, ...colors };
    
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
