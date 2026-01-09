import React, { useState, useEffect } from 'react';
import { promotionAPI } from '../services/api';
import { Plus, Edit2, Trash2, Power, Calendar, Image as ImageIcon } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface Promotion {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  button_text?: string;
  button_link?: string;
  discount_text?: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  sort_order?: number;
  type: string;
  code?: string;
  discount_type?: string;
  discount_value?: number;
  minimum_amount?: number;
  usage_limit?: number;
}

const AdminPromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const { addNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    button_text: 'Shop Now',
    button_link: '/products',
    discount_text: '',
    start_date: '',
    end_date: '',
    sort_order: 0,
    is_active: true,
    type: 'banner',
    code: '',
    discount_type: 'percentage',
    discount_value: 0,
    minimum_amount: 0,
    usage_limit: 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setIsLoading(true);
    try {
      const data = await promotionAPI.getAll();
      // The API returns pagination object, we need access to the data array
      setPromotions(data.data || data); 
    } catch (error) {
      console.error('Error fetching promotions:', error);
      addNotification('Failed to load promotions', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title || '');
      formDataToSend.append('subtitle', formData.subtitle || '');
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('button_text', formData.button_text || '');
      formDataToSend.append('button_link', formData.button_link || '');
      formDataToSend.append('discount_text', formData.discount_text || '');
      formDataToSend.append('start_date', formData.start_date);
      formDataToSend.append('end_date', formData.end_date);
      formDataToSend.append('sort_order', formData.sort_order.toString());
      formDataToSend.append('is_active', formData.is_active ? '1' : '0');
      formDataToSend.append('type', formData.type);
      
      // Coupon fields
      formDataToSend.append('code', formData.code || '');
      formDataToSend.append('discount_type', formData.discount_type || 'percentage');
      formDataToSend.append('discount_value', formData.discount_value?.toString() || '0');
      if (formData.minimum_amount) formDataToSend.append('minimum_amount', formData.minimum_amount.toString());
      if (formData.usage_limit) formDataToSend.append('usage_limit', formData.usage_limit.toString());
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingPromotion) {
        await promotionAPI.update(editingPromotion.id, formDataToSend);
        addNotification('Promotion updated successfully', 'success');
      } else {
        await promotionAPI.create(formDataToSend);
        addNotification('Promotion created successfully', 'success');
      }
      
      setShowModal(false);
      resetForm();
      fetchPromotions();
    } catch (error: any) {
      console.error('Error saving promotion:', error);
      addNotification(error.message || 'Failed to save promotion', 'error');
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      title: promotion.title || '',
      subtitle: promotion.subtitle || '',
      description: promotion.description || '',
      button_text: promotion.button_text || '',
      button_link: promotion.button_link || '',
      discount_text: promotion.discount_text || '',
      start_date: promotion.start_date ? new Date(promotion.start_date).toISOString().slice(0, 16) : '',
      end_date: promotion.end_date ? new Date(promotion.end_date).toISOString().slice(0, 16) : '',
      sort_order: promotion.sort_order || 0,
      is_active: promotion.is_active,
      type: promotion.type || 'banner',
      code: promotion.code || '',
      discount_type: promotion.discount_type || 'percentage',
      discount_value: promotion.discount_value || 0,
      minimum_amount: promotion.minimum_amount || 0,
      usage_limit: promotion.usage_limit || 0,
    });
    setImagePreview(promotion.image || null);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this promotion?')) return;
    
    try {
      await promotionAPI.delete(id);
      addNotification('Promotion deleted successfully', 'success');
      fetchPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
      addNotification('Failed to delete promotion', 'error');
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await promotionAPI.toggleStatus(id);
      addNotification('Promotion status updated', 'success');
      fetchPromotions();
    } catch (error) {
      console.error('Error toggling promotion status:', error);
      addNotification('Failed to update status', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      button_text: 'Shop Now',
      button_link: '/products',
      discount_text: '',
      start_date: '',
      end_date: '',
      sort_order: 0,
      is_active: true,
      type: 'banner',
      code: '',
      discount_type: 'percentage',
      discount_value: 0,
      minimum_amount: 0,
      usage_limit: 0,
    });
    setEditingPromotion(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  if (isLoading && promotions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Promotions & Banners</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Promotion
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {promotions.map((promotion) => (
          <div key={promotion.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              {promotion.image && (
                <div className="md:w-1/3 h-48 md:h-auto">
                  <img
                    src={promotion.image}
                    alt={promotion.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className={`p-6 ${promotion.image ? 'md:w-2/3' : 'w-full'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`inline-block px-2 py-1 text-xs rounded mb-2 ${
                      promotion.type === 'banner' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {promotion.type.toUpperCase()}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900">{promotion.title || promotion.code}</h3>
                    {promotion.subtitle && (
                      <p className="text-lg text-gray-600 mt-1">{promotion.subtitle}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    promotion.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {promotion.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {promotion.discount_text && (
                  <p className="text-amber-600 font-bold text-xl mb-2">{promotion.discount_text}</p>
                )}
                
                {promotion.description && (
                  <p className="text-gray-700 mb-4">{promotion.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  {(promotion.start_date || promotion.end_date) && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {promotion.start_date && <span>{new Date(promotion.start_date).toLocaleDateString()}</span>}
                      {promotion.start_date && promotion.end_date && <span> - </span>}
                      {promotion.end_date && <span>{new Date(promotion.end_date).toLocaleDateString()}</span>}
                    </div>
                  )}
                  {promotion.code && (
                    <div className="bg-gray-100 px-2 py-1 rounded font-mono">
                      Code: {promotion.code}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleEdit(promotion)}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(promotion.id)}
                    className="flex items-center gap-1 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors"
                  >
                    <Power className="w-4 h-4" />
                    {promotion.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(promotion.id)}
                    className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {promotions.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No promotions found</p>
            <p className="text-gray-500">Click "Add Promotion" to create one</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingPromotion ? 'Edit Promotion' : 'Create Promotion'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 font-bold text-xl"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    >
                      <option value="banner">Banner Promotion</option>
                      <option value="coupon">Coupon Code</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      placeholder={formData.type === 'banner' ? "End of Season Sale" : "Promotion Title"}
                    />
                  </div>

                  {formData.type === 'banner' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                        <input
                          type="text"
                          value={formData.subtitle}
                          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                          placeholder="Up to 60% Off"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        />
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mt-4 w-full h-48 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    </>
                  )}

                  {formData.type === 'coupon' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code *</label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary font-mono uppercase"
                        placeholder="SALE50"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      placeholder="Promotion details..."
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                      <input
                        type="datetime-local"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                      <input
                        type="datetime-local"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                    <select
                      value={formData.discount_type}
                      onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value</label>
                    <input
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Text</label>
                    <input
                      type="text"
                      value={formData.discount_text}
                      onChange={(e) => setFormData({ ...formData, discount_text: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      placeholder="e.g. Flat 30% Off"
                    />
                  </div>

                  {formData.type === 'banner' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                        <input
                          type="text"
                          value={formData.button_text}
                          onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                          placeholder="Shop Now"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                        <input
                          type="text"
                          value={formData.button_link}
                          onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                          placeholder="/products"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center pt-4">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                      Active
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  {editingPromotion ? 'Update Promotion' : 'Create Promotion'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromotionsPage;
