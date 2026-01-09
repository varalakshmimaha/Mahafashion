import { useEffect } from 'react';
import { settingsAPI } from '../services/api';

const SettingsUpdater = () => {
  useEffect(() => {
    const updateSettings = async () => {
      try {
        const data = await settingsAPI.getSettings();
        
        // Update document title
        if (data.website_title) {
          document.title = data.website_title;
        } else if (data.website_name) {
          document.title = data.website_name;
        }
        
        // Update meta description if it exists
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && data.website_description) {
          metaDescription.setAttribute('content', data.website_description);
        } else if (!metaDescription && data.website_description) {
          // Create meta description if it doesn't exist
          const newMeta = document.createElement('meta');
          newMeta.name = 'description';
          newMeta.content = data.website_description;
          document.head.appendChild(newMeta);
        }

        // Theme optimization: theme is now handled by ThemeProvider/ThemeContext
      } catch (error) {
        console.error('Error fetching settings for document update:', error);
      }
    };

    updateSettings();
  }, []);

  // This component doesn't render anything
  return null;
};

export default SettingsUpdater;
