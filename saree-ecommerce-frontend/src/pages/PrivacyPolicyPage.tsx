import React, { useState, useEffect } from 'react';
import { staticPageAPI } from '../services/api';

const PrivacyPolicyPage: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivacyPolicyContent = async () => {
      try {
        setLoading(true);
        setError(null);
        // Using centralized API service
        const data = await staticPageAPI.get('privacy-policy');
        setContent(data.content);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Privacy Policy content.');
        // Optionally, set default content if API fails
        setContent('<p>Your privacy is important to us. It is Saree Ecommerce\'s policy to respect your privacy regarding any information we may collect from you across our website.</p><h2>1. Information we collect</h2><p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p><h2>2. How we use your information</h2><p>We use the information we collect in various ways, including to:<ul class="list-disc list-inside"><li>Provide, operate, and maintain our website</li><li>Improve, personalize, and expand our website</li><li>Understand and analyze how you use our website</li><li>Develop new products, services, features, and functionality</li><li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li><li>Send you emails</li><li>Find and prevent fraud</li></ul></p>');
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicyContent();
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-8">Loading Privacy Policy...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
};

export default PrivacyPolicyPage;