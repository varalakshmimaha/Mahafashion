import React from 'react';
import {
  Facebook, Instagram, Twitter, Linkedin, Youtube,
  Globe, Link as LinkIcon
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useSettings } from '../../hooks/useSettings';

// Map of available icons
const ICON_MAP: Record<string, React.ElementType> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  whatsapp: FaWhatsapp,
  globe: Globe,
  link: LinkIcon
};

const Footer: React.FC = () => {
  const { settings, socialLinks } = useSettings();

  return (
    <footer className="bg-gray-800 text-white mt-8">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">{settings?.website_name || 'Suwish'}</h3>
            <p>{settings?.website_description || 'Your one-stop shop for beautiful sarees.'}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul>
              <li><a href="/" className="hover:text-pink-500">Home</a></li>
              <li><a href="/about-us" className="hover:text-pink-500">About Us</a></li>
              <li><a href="/contact-us" className="hover:text-pink-500">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex flex-wrap gap-4">
              {/* Dynamic Social Links */}
              {socialLinks.map((link) => {
                const Icon = ICON_MAP[link.icon] || Globe;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-500 flex items-center gap-2 transition-transform hover:scale-110"
                    title={link.platform}
                    aria-label={link.platform}
                  >
                    <Icon size={24} />
                  </a>
                );
              })}

              {/* Fallback for legacy settings if no dynamic links exist yet and settings are present */}
              {socialLinks.length === 0 && (
                <>
                  {settings?.facebook && (
                    <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 flex items-center gap-2 transition-transform hover:scale-110" aria-label="Facebook">
                      <Facebook size={24} />
                    </a>
                  )}
                  {settings?.instagram && (
                    <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 flex items-center gap-2 transition-transform hover:scale-110" aria-label="Instagram">
                      <Instagram size={24} />
                    </a>
                  )}
                  {settings?.twitter && (
                    <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 flex items-center gap-2 transition-transform hover:scale-110" aria-label="Twitter">
                      <Twitter size={24} />
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="text-center mt-8 border-t border-gray-700 pt-4">
          <p>&copy; {new Date().getFullYear()} {settings?.website_name || 'Suwish'}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;