import React, { useState, useEffect } from 'react';
import { staticPageAPI } from '../services/api';

const ReturnAndRefundPage: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReturnAndRefundContent = async () => {
      try {
        setLoading(true);
        setError(null);
        // Using centralized API service
        const data = await staticPageAPI.get('return-and-refund-policy');
        setContent(data.content);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Return and Refund Policy content.');
        // Optionally, set default content if API fails
        setContent('<h2>Return and Refund Policy</h2><p>We want you to be completely satisfied with your purchase. If you are not satisfied with your order, you may return it for a full refund within 30 days of the purchase date. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p><p>To initiate a return, please contact us with your order number and reason for return.</p>');
      } finally {
        setLoading(false);
      }
    };

    fetchReturnAndRefundContent();
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-8">Loading Return and Refund Policy...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500">Error: {error}</div>;

  // Function to check if content looks like HTML
  const isHtml = (text: string) => {
    const trimmed = text.trim();
    return trimmed.startsWith('<') && trimmed.endsWith('>');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Return and Refund Policy</h1>
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

export default ReturnAndRefundPage;