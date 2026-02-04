import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import dynamic from 'next/dynamic';
import { staticPageAPI } from '../services/api'; // Assuming api.js is in ../services
import 'react-quill/dist/quill.snow.css';
// Importing react-quill dynamically avoids SSR/type issues if any
let ReactQuill: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ReactQuill = require('react-quill');
} catch (e) {
  ReactQuill = null;
}

interface AdminStaticPageEditorProps {
  pageName?: string; // optional; if not provided will read from route param
  title?: string;    // optional title
}

const AdminStaticPageEditor: React.FC<AdminStaticPageEditorProps> = ({ pageName, title }) => {
  const params = useParams();
  const resolvedSlug = pageName || (params as any).slug || '';
  const [content, setContent] = useState<string>('');
  const [name, setName] = useState<string>(resolvedSlug || '');
  const [pageTitle, setPageTitle] = useState<string>(title || '');
  const [slug, setSlug] = useState<string>(resolvedSlug || '');
  const [metaTitle, setMetaTitle] = useState<string>('');
  const [metaDescription, setMetaDescription] = useState<string>('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isNew, setIsNew] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!resolvedSlug) {
          // No slug provided -> creating new page
          setIsNew(true);
          setContent('');
          setName('');
          setPageTitle(title || '');
          setSlug('');
          setMetaTitle('');
          setMetaDescription('');
          setStatus('draft');
          setLoading(false);
          return;
        }

        const data = await staticPageAPI.get(resolvedSlug);
        setContent(data.content || '');
        setName(data.name || resolvedSlug);
        setPageTitle(data.title || title);
        setSlug(data.slug || resolvedSlug);
        setMetaTitle(data.meta_title || '');
        setMetaDescription(data.meta_description || '');
        setStatus(data.status || 'draft');
        setIsNew(false);
      } catch (err: any) {
        // If page not found (404) allow creating new page
        if (err?.message && /404/.test(err.message)) {
          setIsNew(true);
          setContent('');
          setName('');
          setPageTitle(title || '');
          setSlug('');
          setMetaTitle('');
          setMetaDescription('');
          setStatus('draft');
        } else {
          setError(err.message || `Failed to fetch ${pageName} content.`);
          setContent(''); // Clear content on error
        }
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
      if (isNew) {
        await staticPageAPI.create({
          name: name || slug,
          slug,
          title: pageTitle,
          content,
          meta_title: metaTitle,
          meta_description: metaDescription,
          status,
        });
        setSuccessMessage(`${title || 'Page'} created successfully!`);
        setIsNew(false);
      } else {
        await staticPageAPI.update(resolvedSlug, {
          name,
          title: pageTitle,
          slug,
          content,
          meta_title: metaTitle,
          meta_description: metaDescription,
          status,
        });
        setSuccessMessage(`${title || 'Page'} updated successfully!`);
      }
    } catch (err: any) {
      setError(err.message || `Failed to update ${resolvedSlug} content.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{title || (isNew ? 'Create Static Page' : `Edit: ${pageTitle}`)}</h1>

      {loading && <div>Loading content...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      {!loading && (
        <form onSubmit={handleUpdateContent} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Internal Name:</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="border rounded w-full py-2 px-3" required />
          </div>
 
          <div>
            <label htmlFor="pageTitle" className="block text-gray-700 text-sm font-bold mb-2">
              Page Title:
            </label>
            <input id="pageTitle" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} className="border rounded w-full py-2 px-3" required />
          </div>

          <div>
            <label htmlFor="slug" className="block text-gray-700 text-sm font-bold mb-2">Slug:</label>
            <input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="border rounded w-full py-2 px-3" required />
          </div>

          <div>
            <label htmlFor="metaTitle" className="block text-gray-700 text-sm font-bold mb-2">Meta Title:</label>
            <input id="metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="border rounded w-full py-2 px-3" />
          </div>

          <div>
            <label htmlFor="metaDescription" className="block text-gray-700 text-sm font-bold mb-2">Meta Description:</label>
            <textarea id="metaDescription" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className="border rounded w-full py-2 px-3" />
          </div>

          <div>
            <label htmlFor="pageContent" className="block text-gray-700 text-sm font-bold mb-2">Page Content:</label>
            {ReactQuill ? (
              <ReactQuill value={content} onChange={(val: string) => setContent(val)} theme="snow" />
            ) : (
              <textarea
                id="pageContent"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-64"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value as any)} className="border rounded w-full py-2 px-3">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={loading}>
            {loading ? (isNew ? 'Creating...' : 'Updating...') : (isNew ? 'Create Page' : 'Update Page')}
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminStaticPageEditor;
