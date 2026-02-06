import React, { useState, useEffect } from 'react';
import { staticPageAPI } from '../services/api'; // Adjust path as needed

const AboutUsPage: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutUsContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await staticPageAPI.get('about-us');
        setContent(data.content);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch About Us content.');
        // Optionally, set default content if API fails
        setContent('Welcome to our saree ecommerce store! We are passionate about bringing you the most beautiful and authentic sarees from all over India. Our mission is to provide you with a curated collection of high-quality sarees, from traditional handloom classics to modern designer creations. We work directly with weavers and artisans to ensure that every saree we sell is a masterpiece of craftsmanship. Thank you for choosing us for your saree shopping needs. We hope you find the perfect saree that makes you look and feel your best.');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUsContent();
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-8">Loading About Us content...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500">Error: {error}</div>;

  // Function to check if content looks like HTML
  const isHtml = (text: string) => {
    const trimmed = text.trim();
    return trimmed.startsWith('<') && trimmed.endsWith('>');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      {content && (
        isHtml(content) ? (
          <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: content }}></div>
        ) : (
          <div className="prose lg:prose-xl whitespace-pre-wrap text-gray-700 leading-relaxed">
            {content}
          </div>
        )
      )}
    </div>
  );
};

export default AboutUsPage;