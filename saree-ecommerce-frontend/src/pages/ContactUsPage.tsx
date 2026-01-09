import React, { useState, useEffect } from 'react';
import { staticPageAPI } from '../services/api'; // Adjust path as needed

const ContactUsPage: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactUsContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await staticPageAPI.get('contact-us');
        setContent(data.content);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Contact Us content.');
        // Optionally, set default content if API fails
        setContent('We would love to hear from you! If you have any questions, comments, or concerns, please don\'t hesitate to get in touch.<br/><br/><h2>Our Address</h2><p>123 Saree Street, Silk City, India</p><br/><h2>Email</h2><p>info@sareeecommerce.com</p><br/><h2>Phone</h2><p>+91 12345 67890</p>');
      } finally {
        setLoading(false);
      }
    };

    fetchContactUsContent();
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-8">Loading Contact Us content...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
};

export default ContactUsPage;