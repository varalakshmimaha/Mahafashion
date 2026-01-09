import { useEffect, useState } from 'react';
import * as api from '../services/api';
const settingsAPI = (api as any).settingsAPI;

interface Settings {
  website_name?: string;
  website_title?: string;
  website_description?: string;
  logo?: string;
  favicon?: string;
  contact_email?: string;
  contact_phone?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
  footer_content?: string;
  maintenance_mode?: boolean;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsAPI.getSettings();
        setSettings(data);
        
        // Update document title and meta description
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
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
};