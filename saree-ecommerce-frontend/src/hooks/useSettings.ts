import { useEffect, useState } from 'react';
import { settingsAPI, socialMediaAPI } from '../services/api';

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

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  sort_order: number;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [settingsData, socialData] = await Promise.all([
          settingsAPI.getSettings().catch(err => {
            console.error('Error fetching settings:', err);
            return null;
          }),
          socialMediaAPI.getAll().catch(err => {
            console.error('Error fetching social links:', err);
            return [];
          })
        ]);

        if (settingsData) {
          setSettings(settingsData);

          // Update document title and meta description
          if (settingsData.website_title) {
            document.title = settingsData.website_title;
          } else if (settingsData.website_name) {
            document.title = settingsData.website_name;
          }

          // Update meta description if it exists
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription && settingsData.website_description) {
            metaDescription.setAttribute('content', settingsData.website_description);
          } else if (!metaDescription && settingsData.website_description) {
            // Create meta description if it doesn't exist
            const newMeta = document.createElement('meta');
            newMeta.name = 'description';
            newMeta.content = settingsData.website_description;
            document.head.appendChild(newMeta);
          }
        }

        if (socialData) {
          setSocialLinks(socialData);
        }

      } catch (error) {
        console.error('Error fetching app data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, socialLinks, loading };
};