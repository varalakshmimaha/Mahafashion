import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../services/api';
const settingsAPI = (api as any).settingsAPI;

const Footer: React.FC = () => {
  const [websiteName, setWebsiteName] = useState<string>('');
  const [websiteTagline, setWebsiteTagline] = useState<string>('');
  const [facebook, setFacebook] = useState<string>('');
  const [twitter, setTwitter] = useState<string>('');
  const [instagram, setInstagram] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [youtube, setYoutube] = useState<string>('');
  const [linkedin, setLinkedin] = useState<string>('');
  const [pinterest, setPinterest] = useState<string>('');
  const [footerContent, setFooterContent] = useState<string>('');
  const [copyrightText, setCopyrightText] = useState<string>('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await settingsAPI.getSettings();
        setWebsiteName(settings.website_name);
        setWebsiteTagline(settings.website_tagline);
        setFacebook(settings.facebook);
        setTwitter(settings.twitter);
        setInstagram(settings.instagram);
        setWhatsapp(settings.whatsapp);
        setYoutube(settings.youtube);
        setLinkedin(settings.linkedin);
        setPinterest(settings.pinterest);
        setFooterContent(settings.footer_content);
        setCopyrightText(settings.copyright_text);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-light">{websiteName || 'Suwish'}</h3>
            <p className="text-gray-300">{websiteTagline || 'Your one-stop shop for beautiful sarees and ethnic wear.'}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 text-accent-light">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about-us" className="text-gray-300 hover:text-primary-light transition-colors">About Us</Link></li>
              <li><Link to="/contact-us" className="text-gray-300 hover:text-primary-light transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping-and-returns" className="text-gray-300 hover:text-primary-light transition-colors">Shipping & Returns</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 text-accent-light">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms-and-conditions" className="text-gray-300 hover:text-primary-light transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-300 hover:text-primary-light transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 text-accent-light">Follow Us</h3>
            <div className="flex flex-wrap gap-3">
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light hover:bg-primary hover:text-white transition-all">
                  <i className="fab fa-facebook-f"></i>
                </a>
              )}
              {twitter && (
                <a href={twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light hover:bg-primary hover:text-white transition-all">
                  <i className="fab fa-twitter"></i>
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent-light hover:bg-accent hover:text-white transition-all">
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {youtube && (
                <a href={youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all">
                  <i className="fab fa-youtube"></i>
                </a>
              )}
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white transition-all">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              )}
              {pinterest && (
                <a href={pinterest} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center text-red-400 hover:bg-red-600 hover:text-white transition-all">
                  <i className="fab fa-pinterest-p"></i>
                </a>
              )}
              {whatsapp && (
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success hover:bg-success hover:text-white transition-all">
                  <i className="fab fa-whatsapp"></i>
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="border-t border-gray-700 mt-10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm mr-3">We Accept:</span>
              <div className="flex gap-3">
                <div className="bg-white rounded px-3 py-1.5 flex items-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Razorpay_logo.svg/100px-Razorpay_logo.svg.png" alt="Razorpay" className="h-5 object-contain" />
                </div>
                <div className="bg-white rounded px-3 py-1.5 flex items-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/100px-PhonePe_Logo.svg.png" alt="PhonePe" className="h-5 object-contain" />
                </div>
                <div className="bg-white rounded px-3 py-1.5 flex items-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/100px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-5 object-contain" />
                </div>
                <div className="bg-gray-700 rounded px-3 py-1.5">
                  <span className="text-xs text-white font-medium">Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>
          {footerContent && (
            <div className="mt-4 text-sm text-gray-500 text-center" dangerouslySetInnerHTML={{__html: footerContent}} />
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
