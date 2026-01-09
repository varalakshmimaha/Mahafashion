import React, { useState, useEffect } from 'react';
import { staticPageAPI } from '../services/api';

const ShippingAndReturnsPage: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShippingAndReturnsContent = async () => {
      try {
        setLoading(true);
        setError(null);
        // Using centralized API service
        const data = await staticPageAPI.get('return-and-refund-policy');
        setContent(data.content);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Return and Refund Policy content.');
        // Optionally, set default content if API fails
        setContent('<h2>Return and Refund Policy</h2><p>We want you to be completely satisfied with your purchase. If you are not satisfied with your order, you may return it for a full refund within 30 days of the purchase date. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p><p>To initiate a return, please contact us at returns@sareeecommerce.com with your order number and reason for return.</p>');
      } finally {
        setLoading(false);
      }
    };

    fetchShippingAndReturnsContent();
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-8">Loading Return and Refund Policy...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Shipping & Returns</h1>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Shipping Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="text-green-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
            <p className="text-gray-600">Free shipping on orders above ₹999</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="text-green-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Easy Returns</h3>
            <p className="text-gray-600">Easy 7-day returns</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="text-green-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Cash on Delivery</h3>
            <p className="text-gray-600">Cash on delivery available</p>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Return and Refund Policy</h2>
        <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    </div>
  );
};

export default ShippingAndReturnsPage;