import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { staticPageAPI } from '../services/api';
import 'react-quill/dist/quill.snow.css';

interface AdminStaticPageEditorProps {
  pageName?: string; // optional; if not provided will read from route param
  title?: string;    // optional title
}

const AdminStaticPageEditor: React.FC<AdminStaticPageEditorProps> = ({ pageName, title }) => {
  const params = useParams();
  const navigate = useNavigate();
  const resolvedSlug = pageName || (params as any).slug || '';
  const [content, setContent] = useState<string>('');
  const [name, setName] = useState<string>(resolvedSlug || '');
  const [pageTitle, setPageTitle] = useState<string>(title || '');
  const [slug, setSlug] = useState<string>(resolvedSlug || '');
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [metaTitle, setMetaTitle] = useState<string>('');
  const [metaDescription, setMetaDescription] = useState<string>('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [category, setCategory] = useState<'quick_link' | 'policy'>('quick_link');
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
          setIsNew(true);
          setContent('');
          setName('');
          setPageTitle(title || '');
          setSlug('');
          setSortOrder(0);
          setMetaTitle('');
          setMetaDescription('');
          setStatus('draft');
          setCategory('quick_link');
          setLoading(false);
          return;
        }

        const data = await staticPageAPI.getAdmin(resolvedSlug);
        setContent(data.content || '');
        setName(data.name || resolvedSlug);
        setPageTitle(data.title || title);
        setSlug(data.slug || resolvedSlug);
        setSortOrder(data.sort_order || 0);
        setMetaTitle(data.meta_title || '');
        setMetaDescription(data.meta_description || '');
        setStatus(data.status || 'draft');
        setCategory(data.category || 'quick_link');
        setIsNew(false);
      } catch (err: any) {
        if (err?.message && /404/.test(err.message)) {
          setIsNew(true);
          setContent('');
          setName('');
          setPageTitle(title || '');
          setSlug('');
          setSortOrder(0);
          setMetaTitle('');
          setMetaDescription('');
          setStatus('draft');
          setCategory('quick_link');
        } else {
          setError(err.message || `Failed to fetch ${pageName} content.`);
          setContent('');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, [resolvedSlug, pageName, title]);

  const handleUpdateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setError(null);
    try {
      setLoading(true);
      const payload = {
        name: name || slug,
        slug,
        title: pageTitle,
        content,
        sort_order: sortOrder,
        meta_title: metaTitle,
        meta_description: metaDescription,
        status,
        category,
      };

      if (isNew) {
        await staticPageAPI.create(payload);
        setSuccessMessage(`${pageTitle || 'Page'} created successfully!`);
        setTimeout(() => navigate('/admin/static-pages'), 1500);
      } else {
        await staticPageAPI.update(resolvedSlug, payload);
        setSuccessMessage(`${pageTitle || 'Page'} updated successfully!`);
      }
    } catch (err: any) {
      setError(err.message || `Failed to update ${resolvedSlug} content.`);
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{title || (isNew ? 'Create Static Page' : `Edit: ${pageTitle}`)}</h1>
        <button
          type="button"
          onClick={() => navigate('/admin/static-pages')}
          className="text-blue-600 hover:underline"
        >
          &larr; Back to List
        </button>
      </div>

      {loading && !isNew && <div className="p-4 bg-gray-50 rounded">Loading content...</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{successMessage}</div>}

      {(isNew || !loading) && (
        <form onSubmit={handleUpdateContent} className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="pageTitle" className="block text-gray-700 text-sm font-bold mb-1">Page Title:</label>
              <p className="text-xs text-gray-500 mb-2">Title for the page (used for SEO and display)</p>
              <input
                id="pageTitle"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                className="border rounded w-full py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-gray-700 text-sm font-bold mb-1">Page Names (Slug):</label>
              <p className="text-xs text-gray-500 mb-2">Use lowercase letters, numbers, and hyphens only (e.g., about-us)</p>
              <input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                className="border rounded w-full py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
                required
                placeholder="e.g. about-us"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-1">Category:</label>
              <p className="text-xs text-gray-500 mb-2">Where should this page appear?</p>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value as any)} className="border rounded w-full py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="quick_link">Quick Link (e.g. About Us, Contact)</option>
                <option value="policy">Policy (e.g. Terms, Privacy)</option>
              </select>
            </div>

            <div>
              <label htmlFor="sortOrder" className="block text-gray-700 text-sm font-bold mb-1">Sort Order:</label>
              <p className="text-xs text-gray-500 mb-2">Number used to order pages (lower numbers appear first)</p>
              <input
                id="sortOrder"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                className="border rounded w-full py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-1">Status:</label>
              <p className="text-xs text-gray-500 mb-2">Draft pages are hidden from the website.</p>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value as any)} className="border rounded w-full py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Page Content:</label>
            <div className="bg-white rounded border overflow-hidden">
              <ReactQuill
                value={content}
                onChange={setContent}
                theme="snow"
                modules={quillModules}
                className="h-64 mb-12"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">SEO Settings (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="metaTitle" className="block text-gray-700 text-sm font-bold mb-2">SEO Meta Title:</label>
                <input id="metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="border rounded w-full py-2 px-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Defaults to Page Title" />
              </div>

              <div>
                <label htmlFor="metaDescription" className="block text-gray-700 text-sm font-bold mb-2">SEO Meta Description:</label>
                <textarea id="metaDescription" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className="border rounded w-full py-2 px-3 outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t pt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/static-pages')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-md shadow transition-all active:scale-95 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isNew ? 'Create Page' : 'Save Changes')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminStaticPageEditor;
