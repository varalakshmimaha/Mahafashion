import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { settingsAPI } from '../../services/api';

const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [announcement, setAnnouncement] = useState<string>('');
  const [bgColor, setBgColor] = useState<string>('#7c3aed'); // Default purple
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [link, setLink] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const settings = await settingsAPI.getSettings();
        if (settings.announcement_text) {
          setAnnouncement(settings.announcement_text);
        } else {
          // Default announcement
          setAnnouncement('🎉 Free Shipping on orders above ₹999 | Use code WELCOME10 for 10% off on your first order!');
        }
        if (settings.announcement_bg_color) {
          setBgColor(settings.announcement_bg_color);
        }
        if (settings.announcement_text_color) {
          setTextColor(settings.announcement_text_color);
        }
        if (settings.announcement_link) {
          setLink(settings.announcement_link);
        }
      } catch (error) {
        // Use default announcement on error
        setAnnouncement('🎉 Free Shipping on orders above ₹999 | Use code WELCOME10 for 10% off!');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncement();
  }, []);

  if (!isVisible || isLoading || !announcement) return null;

  const content = (
    <span className="text-sm font-medium tracking-wide">
      {announcement}
    </span>
  );

  return (
    <div 
      className="relative py-2.5 px-4"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="container mx-auto flex items-center justify-center">
        {link ? (
          <a 
            href={link} 
            className="hover:underline transition-all"
            style={{ color: textColor }}
          >
            {content}
          </a>
        ) : (
          content
        )}
        
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
          aria-label="Close announcement"
          style={{ color: textColor }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
