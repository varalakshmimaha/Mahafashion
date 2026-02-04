export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  [key: string]: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export const defaultTheme: Theme = {
  id: 'default',
  name: 'Default (Indigo)',
  colors: {
    primary: '#FF5733',
    secondary: '#33FF57',
    accent: '#ec4899',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
};

export const themes: Theme[] = [
  defaultTheme,
  {
    id: 'ocean',
    name: 'Ocean (Blue & Teal)',
    colors: {
      primary: '#0ea5e9', // Sky 500
      secondary: '#14b8a6', // Teal 500
      accent: '#f59e0b', // Amber 500
      success: '#22c55e',
      warning: '#eab308',
      danger: '#ef4444',
    },
  },
  {
    id: 'forest',
    name: 'Forest (Green & Brown)',
    colors: {
      primary: '#2f855a', // Green 700
      secondary: '#9c4221', // Orange 800 (Brown-ish)
      accent: '#d69e2e', // Yellow 600
      success: '#38a169',
      warning: '#d69e2e',
      danger: '#e53e3e',
    },
  },
  {
    id: 'royal',
    name: 'Royal (Gold & Maroon)',
    colors: {
      primary: '#800000', // Maroon
      secondary: '#FFD700', // Gold
      accent: '#000080', // Navy
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset (Purple & Orange)',
    colors: {
      primary: '#9333ea', // Purple 600
      secondary: '#ea580c', // Orange 600
      accent: '#db2777', // Pink 600
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
    },
  },
  {
    id: 'crimson',
    name: 'Crimson (Red & Black)',
    colors: {
      primary: '#dc2626', // Red 600
      secondary: '#1f2937', // Gray 800
      accent: '#fbbf24', // Amber 400
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#991b1b', // Red 800
    },
  },
  {
    id: 'lavender',
    name: 'Lavender (Purple & Pink)',
    colors: {
      primary: '#a855f7', // Purple 500
      secondary: '#ec4899', // Pink 500
      accent: '#f0abfc', // Fuchsia 300
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
    },
  },
  {
    id: 'mint',
    name: 'Mint (Teal & Lime)',
    colors: {
      primary: '#14b8a6', // Teal 500
      secondary: '#84cc16', // Lime 500
      accent: '#06b6d4', // Cyan 500
      success: '#22c55e',
      warning: '#facc15',
      danger: '#ef4444',
    },
  },
  {
    id: 'navy',
    name: 'Navy (Navy & Gold)',
    colors: {
      primary: '#1e40af', // Blue 800
      secondary: '#eab308', // Yellow 500
      accent: '#0ea5e9', // Sky 500
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
    },
  },
  {
    id: 'rose',
    name: 'Rose (Rose & Coral)',
    colors: {
      primary: '#f43f5e', // Rose 500
      secondary: '#fb923c', // Orange 400
      accent: '#fda4af', // Rose 300
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#be123c', // Rose 700
    },
  },
  {
    id: 'emerald',
    name: 'Emerald (Green & Jade)',
    colors: {
      primary: '#059669', // Emerald 600
      secondary: '#0d9488', // Teal 600
      accent: '#84cc16', // Lime 500
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#ef4444',
    },
  },
  {
    id: 'plum',
    name: 'Plum (Violet & Magenta)',
    colors: {
      primary: '#7c3aed', // Violet 600
      secondary: '#c026d3', // Fuchsia 600
      accent: '#e879f9', // Fuchsia 400
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
    },
  },
  {
    id: 'autumn',
    name: 'Autumn (Orange & Brown)',
    colors: {
      primary: '#ea580c', // Orange 600
      secondary: '#92400e', // Amber 800
      accent: '#fbbf24', // Amber 400
      success: '#10b981',
      warning: '#d97706',
      danger: '#dc2626',
    },
  },
  {
    id: 'slate',
    name: 'Slate (Gray & Blue)',
    colors: {
      primary: '#475569', // Slate 600
      secondary: '#3b82f6', // Blue 500
      accent: '#94a3b8', // Slate 400
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
    },
  },
  {
    id: 'peach',
    name: 'Peach (Coral & Cream)',
    colors: {
      primary: '#fb923c', // Orange 400
      secondary: '#fbbf24', // Amber 400
      accent: '#fdba74', // Orange 300
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
    },
  },
];

export const applyTheme = (colors: ThemeColors) => {
  const root = document.documentElement;
  
  // Set the CSS variables
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-success', colors.success);
  root.style.setProperty('--color-warning', colors.warning);
  root.style.setProperty('--color-danger', colors.danger);

  // We might calculate simple light/dark variants here if needed, 
  // but for now we'll just use the base colors or a simple opacity hack if valid.
  // Ideally, valid hex codes should be passed.
};
