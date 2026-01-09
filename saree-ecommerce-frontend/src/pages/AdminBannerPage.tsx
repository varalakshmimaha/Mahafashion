import React, { useState, useEffect } from 'react';
import { bannerAPI } from '../services/api'; // Assuming api.js is in ../services

interface Banner {
  id: number;
  image_path: string;
  title: string | null;
  link: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminBannerPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form state for new banner
  const [newBannerImage, setNewBannerImage] = useState<File | null>(null);
  const [newBannerTitle, setNewBannerTitle] = useState<string>('');
  const [newBannerLink, setNewBannerLink] = useState<string>('');
  const [newBannerOrder, setNewBannerOrder] = useState<number>(0);
  const [newBannerIsActive, setNewBannerIsActive] = useState<boolean>(true);

  // State for editing existing banner
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editBannerImage, setEditBannerImage] = useState<File | null>(null);
  const [editBannerTitle, setEditBannerTitle] = useState<string>('');
  const [editBannerLink, setEditBannerLink] = useState<string>('');
  const [editBannerOrder, setEditBannerOrder] = useState<number>(0);
  const [editBannerIsActive, setEditBannerIsActive] = useState<boolean>(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await bannerAPI.getAll();
      setBanners(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch banners.');
      setLoading(false);
    }
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerImage) {
      alert('Please select an image for the new banner.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', newBannerImage);
      formData.append('title', newBannerTitle);
      formData.append('link', newBannerLink);
      formData.append('order', newBannerOrder.toString());
      formData.append('is_active', newBannerIsActive ? '1' : '0');

      await bannerAPI.create(formData);
      await fetchBanners(); // Refresh list
      // Clear form
      setNewBannerImage(null);
      setNewBannerTitle('');
      setNewBannerLink('');
      setNewBannerOrder(0);
      setNewBannerIsActive(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create banner.');
    }
  };

  const handleEditClick = (banner: Banner) => {
    setEditingBanner(banner);
    setEditBannerTitle(banner.title || '');
    setEditBannerLink(banner.link || '');
    setEditBannerOrder(banner.order);
    setEditBannerIsActive(banner.is_active);
    setEditBannerImage(null); // Clear image input when starting edit
  };

  const handleUpdateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    try {
      const formData = new FormData();
      if (editBannerImage) {
        formData.append('image', editBannerImage);
      }
      formData.append('title', editBannerTitle);
      formData.append('link', editBannerLink);
      formData.append('order', editBannerOrder.toString());
      formData.append('is_active', editBannerIsActive ? '1' : '0');
      
      await bannerAPI.update(editingBanner.id, formData);
      await fetchBanners(); // Refresh list
      setEditingBanner(null); // Exit edit mode
    } catch (err: any) {
      setError(err.message || 'Failed to update banner.');
    }
  };

  const handleDeleteBanner = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await bannerAPI.delete(id);
        await fetchBanners(); // Refresh list
      } catch (err: any) {
        setError(err.message || 'Failed to delete banner.');
      }
    }
  };

  if (loading) return <div>Loading banners...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Banner Management</h1>

      {/* Add New Banner Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Banner</h2>
        <form onSubmit={handleCreateBanner} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newBannerImage">
              Image:
            </label>
            <input
              type="file"
              id="newBannerImage"
              accept="image/*"
              onChange={(e) => setNewBannerImage(e.target.files ? e.target.files[0] : null)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newBannerTitle">
              Title (optional):
            </label>
            <input
              type="text"
              id="newBannerTitle"
              value={newBannerTitle}
              onChange={(e) => setNewBannerTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newBannerLink">
              Link (optional):
            </label>
            <input
              type="text"
              id="newBannerLink"
              value={newBannerLink}
              onChange={(e) => setNewBannerLink(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newBannerOrder">
              Order:
            </label>
            <input
              type="number"
              id="newBannerOrder"
              value={newBannerOrder}
              onChange={(e) => setNewBannerOrder(parseInt(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="newBannerIsActive"
              checked={newBannerIsActive}
              onChange={(e) => setNewBannerIsActive(e.target.checked)}
              className="mr-2 leading-tight"
            />
            <label className="text-gray-700 text-sm font-bold" htmlFor="newBannerIsActive">
              Is Active
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Banner
          </button>
        </form>
      </div>

      {/* Existing Banners List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Banners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="border p-4 rounded-lg shadow-sm">
              <img src={banner.image_path} alt={banner.title || 'Banner'} className="w-full h-48 object-cover mb-4 rounded" />
              <h3 className="font-bold text-lg">{banner.title || 'No Title'}</h3>
              <p className="text-gray-600">Link: <a href={banner.link || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-500">{banner.link || 'N/A'}</a></p>
              <p className="text-gray-600">Order: {banner.order}</p>
              <p className={`font-semibold ${banner.is_active ? 'text-green-600' : 'text-red-600'}`}>
                Status: {banner.is_active ? 'Active' : 'Inactive'}
              </p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEditClick(banner)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBanner(banner.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Banner Modal/Form */}
      {editingBanner && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl m-4 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Banner</h2>
            <form onSubmit={handleUpdateBanner} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editBannerImage">
                  Image (optional, leave blank to keep current):
                </label>
                <input
                  type="file"
                  id="editBannerImage"
                  accept="image/*"
                  onChange={(e) => setEditBannerImage(e.target.files ? e.target.files[0] : null)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {editingBanner.image_path && (
                  <p className="text-sm text-gray-500 mt-2">Current image: <img src={editingBanner.image_path} alt="current" className="h-16 w-16 object-cover inline-block ml-2" /></p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editBannerTitle">
                  Title:
                </label>
                <input
                  type="text"
                  id="editBannerTitle"
                  value={editBannerTitle}
                  onChange={(e) => setEditBannerTitle(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editBannerLink">
                  Link:
                </label>
                <input
                  type="text"
                  id="editBannerLink"
                  value={editBannerLink}
                  onChange={(e) => setEditBannerLink(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editBannerOrder">
                  Order:
                </label>
                <input
                  type="number"
                  id="editBannerOrder"
                  value={editBannerOrder}
                  onChange={(e) => setEditBannerOrder(parseInt(e.target.value))}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editBannerIsActive"
                  checked={editBannerIsActive}
                  onChange={(e) => setEditBannerIsActive(e.target.checked)}
                  className="mr-2 leading-tight"
                />
                <label className="text-gray-700 text-sm font-bold" htmlFor="editBannerIsActive">
                  Is Active
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBannerPage;
