import React, { useState, useEffect } from 'react';
import { staticPageAPI } from '../services/api'; // Assuming api.js is in ../services

interface AdminStaticPageEditorProps {
  pageName: string; // e.g., 'about-us', 'contact-us'
  title: string;    // e.g., 'Edit About Us Content', 'Edit Contact Us Content'
}

const AdminStaticPageEditor: React.FC<AdminStaticPageEditorProps> = ({ pageName, title }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await staticPageAPI.get(pageName);
        setContent(data.content);
      } catch (err: any) {
        setError(err.message || `Failed to fetch ${pageName} content.`);
        setContent(''); // Clear content on error
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, [pageName]);

  const handleUpdateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null); // Clear previous success messages
    setError(null); // Clear previous error messages
    try {
      setLoading(true);
      await staticPageAPI.update(pageName, content);
      setSuccessMessage(`${title} updated successfully!`);
    } catch (err: any) {
      setError(err.message || `Failed to update ${pageName} content.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      {loading && <div>Loading content...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      {!loading && (
        <form onSubmit={handleUpdateContent} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label htmlFor="pageContent" className="block text-gray-700 text-sm font-bold mb-2">
              Page Content:
            </label>
            <textarea
              id="pageContent"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-64"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Content'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminStaticPageEditor;
