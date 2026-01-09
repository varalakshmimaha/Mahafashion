import React, { useState, useEffect } from 'react';
import { staticPageAPI } from '../services/api';

const TermsAndConditionsPage: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTermsAndConditionsContent = async () => {
      try {
        setLoading(true);
        setError(null);
        // Using centralized API service
        const data = await staticPageAPI.get('terms-and-conditions');
        setContent(data.content);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Terms and Conditions content.');
        // Optionally, set default content if API fails
        setContent('<p>Please read these terms and conditions carefully before using our website.</p><h2>1. Introduction</h2><p>These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, Saree Ecommerce accessible at www.sareeecommerce.com.</p><h2>2. Intellectual Property Rights</h2><p>Other than the content you own, under these Terms, Saree Ecommerce and/or its licensors own all the intellectual property rights and materials contained in this Website.</p><h2>3. Restrictions</h2><p>You are specifically restricted from all of the following:<ul class="list-disc list-inside"><li>publishing any Website material in any other media;</li><li>selling, sublicensing and/or otherwise commercializing any Website material;</li><li>publicly performing and/or showing any Website material;</li><li>using this Website in any way that is or may be damaging to this Website;</li><li>using this Website in any way that impacts user access to this Website;</li></ul></p>');
      } finally {
        setLoading(false);
      }
    };

    fetchTermsAndConditionsContent();
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-8">Loading Terms and Conditions...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
      <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
};

export default TermsAndConditionsPage;