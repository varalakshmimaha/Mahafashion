import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { staticPageAPI } from '../services/api';

const AdminStaticPagesList: React.FC = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        const res = await staticPageAPI.list();
        setPages(res || []);
      } catch (e: any) {
        setError(e.message || 'Failed to load pages');
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  const handleEdit = (page: any) => {
    // Navigate to editor route — AdminStaticPageEditor expects pageName prop path-based route
    navigate(`/admin/static-pages/${page.slug}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this page?')) return;
    try {
      setLoading(true);
      await staticPageAPI.delete(id);
      setPages((p) => p.filter((x) => x.id !== id));
    } catch (e: any) {
      setError(e.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Static Pages</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate('/admin/static-pages/create')}>
          Create Page
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {!loading && (
        <div className="bg-white shadow rounded">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{page.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{page.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${page.category === 'policy' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {page.category === 'policy' ? 'Policy' : 'Quick Link'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{page.sort_order}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{page.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => handleEdit(page)} className="mr-2 text-sm text-blue-600">Edit</button>
                    <button onClick={() => handleDelete(page.id)} className="text-sm text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminStaticPagesList;
