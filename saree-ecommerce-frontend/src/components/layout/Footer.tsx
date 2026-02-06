import React, { useEffect, useState } from 'react';
import {
  Facebook, Instagram, Twitter, Linkedin, Youtube,
  Globe, Link as LinkIcon
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useSettings } from '../../hooks/useSettings';
import { staticPageAPI } from '../../services/api';

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

interface StaticPageLink {
  title: string;
  slug: string;
  category: string;
}

const Footer: React.FC = () => {
  const { settings, socialLinks } = useSettings();
  const [staticPages, setStaticPages] = useState<StaticPageLink[]>([]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const pages = await staticPageAPI.listPublic();
        setStaticPages(pages);
      } catch (error) {
        console.error('Error fetching static pages for footer:', error);
      }
    };
    fetchPages();
  }, []);

  const quickLinks = staticPages.filter(page => page.category === 'quick_link');
  const policies = staticPages.filter(page => page.category === 'policy');

  // Using high-reliability logo URLs for PhonePe, Google Pay, and Paytm
  const paymentMethods = [
    {
      name: 'PhonePe',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png'
    },
    {
      name: 'Google Pay',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png'
    },
    {
      name: 'Paytm',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png'
    }
  ];

  return (
    <footer className="mt-12">
      {/* Primary Dark Footer */}
      <div className="bg-[#111111] text-gray-400 pt-16 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {settings?.website_name || 'Suwish'}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
                {settings?.website_description || 'Step into elegance with our curated collection of premium sarees. Celebrating tradition with a modern touch.'}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base font-semibold text-white mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="/" className="hover:text-pink-500 transition-colors">Home</a></li>
                {quickLinks.map(page => (
                  <li key={page.slug}>
                    <a href={`/pages/${page.slug}`} className="hover:text-pink-500 transition-colors">
                      {page.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="text-base font-semibold text-white mb-6">Policies</h4>
              <ul className="space-y-4 text-sm font-medium">
                {policies.map(page => (
                  <li key={page.slug}>
                    <a href={`/pages/${page.slug}`} className="hover:text-pink-500 transition-colors">
                      {page.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social / Follow Us */}
            <div className="space-y-6">
              <h4 className="text-base font-semibold text-white mb-6">Follow Us</h4>
              <div className="flex flex-wrap gap-4 pt-2">
                {socialLinks.map((link) => {
                  const Icon = ICON_MAP[link.icon] || Globe;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-pink-500 hover:bg-pink-500 transition-all duration-300"
                      title={link.platform}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
                {socialLinks.length === 0 && (
                  <>
                    {settings?.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white border border-gray-800 p-2 rounded-full hover:bg-pink-500 hover:border-pink-500 transition-all duration-300"><Facebook size={20} /></a>}
                    {settings?.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white border border-gray-800 p-2 rounded-full hover:bg-pink-500 hover:border-pink-500 transition-all duration-300"><Instagram size={20} /></a>}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Strip (Light) */}
      <div className="bg-white py-8 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Accepted Payment On</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {paymentMethods.map(method => (
                <img
                  key={method.name}
                  src={method.logo}
                  alt={method.name}
                  className="h-6 md:h-7 w-auto object-contain hover:scale-105 transition-transform duration-300"
                />
              ))}
              <div className="flex items-center justify-center bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wider uppercase border border-gray-300 shadow-sm">
                Cash On Delivery
              </div>
            </div>

            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center md:text-right">
              &copy; {new Date().getFullYear()} {settings?.website_name || 'Suwish'}. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;