import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { productAPI } from '../services/api';
import { SareeProduct } from '../types';
import { useNotification } from '../context/NotificationContext';
import ProductImageUpload from '../components/ProductImageUpload';
import ProductVariantManager from '../components/ProductVariantManager';

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  category_id: number;
}

const AdminProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [product, setProduct] = useState<SareeProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'images' | 'variants'>('basic');
  const [preselectedColor, setPreselectedColor] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sku: '',
    category_id: '',
    subcategory_id: '',
    stock_quantity: '0',
    fabric: '',
    color: '',
    occasion: '',
    care_instructions: '',
    blouse_included: false,
    drape_length: '5.5',
    status: 'active',
    package_contains: '',
    fit: '',
    origin: ''
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (formData.category_id) {
      fetchSubcategories(formData.category_id);
    } else {
      setSubcategories([]);
    }
  }, [formData.category_id]);

  const fetchProduct = async () => {
    if (!id) return;

    try {
      const data = await productAPI.getProductById(id);
      console.log('Fetched product data:', data);
      setProduct(data);

      // Populate form data
      setFormData({
        name: data.name || '',
        description: data.description || '',
        price: data.price?.toString() || '',
        sku: data.sku || '',
        category_id: data.categoryId || data.category_id || '',
        subcategory_id: data.subcategoryId || data.subcategory_id || '',
        stock_quantity: data.stockQuantity?.toString() || data.stock_quantity?.toString() || '0',
        fabric: data.fabric || '',
        color: data.color || '',
        occasion: data.occasion || '',
        care_instructions: data.careInstructions || data.care_instructions || '',
        blouse_included: data.blouseIncluded || data.blouse_included || false,
        drape_length: data.drapeLength?.toString() || data.drape_length?.toString() || '5.5',
        status: data.isActive !== undefined ? (data.isActive ? 'active' : 'inactive') : (data.status || 'active'),
        package_contains: data.package_contains || '',
        fit: data.fit || '',
        origin: data.origin || ''
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      addNotification('Failed to load product', 'error');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/categories');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }

    setLoadingSubcategories(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/subcategories/by-category/${categoryId}`);
      const data = await response.json();
      setSubcategories(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      // If category changes, reset subcategory
      if (name === 'category_id') {
        setFormData(prev => ({ ...prev, [name]: value, subcategory_id: '' }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleSaveBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    setSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('sku', formData.sku);
      formDataToSend.append('category_id', formData.category_id);
      if (formData.subcategory_id) {
        formDataToSend.append('subcategory_id', formData.subcategory_id);
      }
      formDataToSend.append('stock_quantity', formData.stock_quantity);
      formDataToSend.append('fabric', formData.fabric);
      formDataToSend.append('color', formData.color);
      formDataToSend.append('occasion', formData.occasion);
      formDataToSend.append('care_instructions', formData.care_instructions);
      formDataToSend.append('blouse_included', formData.blouse_included ? '1' : '0');
      formDataToSend.append('drape_length', formData.drape_length);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('package_contains', formData.package_contains);
      formDataToSend.append('fit', formData.fit);
      formDataToSend.append('origin', formData.origin);

      console.log('Sending form data:', Object.fromEntries(formDataToSend.entries()));

      await productAPI.updateProduct(id, formDataToSend);

      addNotification('Product updated successfully!', 'success');
      fetchProduct(); // Refresh data
    } catch (error: any) {
      console.error('Error updating product:', error);
      addNotification(error.message || 'Failed to update product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImagesUploaded = () => {
    // Refresh product data to show new images
    fetchProduct();
  };

  const handleVariantsUpdated = () => {
    // Refresh product data to show new variants
    fetchProduct();
  };

  const handleUploadImagesForColor = (colorCode: string) => {
    setPreselectedColor(colorCode);
    setActiveTab('images');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/admin/products')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600 mt-1">{product.name}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition ${activeTab === 'basic'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Basic Information
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition ${activeTab === 'images'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Images ({product.images?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('variants')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition ${activeTab === 'variants'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Variants & Stock ({product.variants?.length || 0})
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === 'basic' && (
          <form onSubmit={handleSaveBasicInfo} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory - Dynamic based on category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <select
                  name="subcategory_id"
                  value={formData.subcategory_id}
                  onChange={handleInputChange}
                  disabled={!formData.category_id || loadingSubcategories}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingSubcategories
                      ? 'Loading subcategories...'
                      : !formData.category_id
                        ? 'Select a category first'
                        : subcategories.length === 0
                          ? 'No subcategories available'
                          : 'Select Subcategory'}
                  </option>
                  {subcategories.map(sub => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} {(sub as any).is_active === 0 || (sub as any).is_active === false ? '(Inactive)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Fabric */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fabric
                </label>
                <input
                  type="text"
                  name="fabric"
                  value={formData.fabric}
                  onChange={handleInputChange}
                  placeholder="e.g., Silk, Cotton"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="e.g., Maroon, Blue"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Occasion */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occasion
                </label>
                <input
                  type="text"
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleInputChange}
                  placeholder="e.g., Wedding, Party"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Drape Length */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Drape Length (meters)
                </label>
                <input
                  type="number"
                  name="drape_length"
                  value={formData.drape_length}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Blouse Included */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="blouse_included"
                    checked={formData.blouse_included}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Blouse Included
                  </span>
                </label>
              </div>

              {/* Care Instructions */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Care Instructions
                </label>
                <textarea
                  name="care_instructions"
                  value={formData.care_instructions}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Dry clean only, Hand wash..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Package Contains */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Contains
                </label>
                <input
                  type="text"
                  name="package_contains"
                  value={formData.package_contains}
                  onChange={handleInputChange}
                  placeholder="e.g., 1 Saree with Unstitched Blouse Piece"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Fit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fit
                </label>
                <input
                  type="text"
                  name="fit"
                  value={formData.fit}
                  onChange={handleInputChange}
                  placeholder="e.g., Regular"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Origin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origin
                </label>
                <input
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  placeholder="e.g., India"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-2 rounded-lg text-white flex items-center gap-2 transition ${saving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {saving ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'images' && (
          <ProductImageUpload
            productId={Number(id)}
            existingImages={product.images}
            variants={product.variants}
            initialColorCode={preselectedColor}
            onUploadSuccess={handleImagesUploaded}
          // Add a hook here if we want to force the selected color, 
          // but for now, we'll just use the variants to populate the quick select.
          />
        )}

        {activeTab === 'variants' && (
          <ProductVariantManager
            productId={Number(id)}
            existingVariants={product.variants}
            onUpdateSuccess={handleVariantsUpdated}
            onUploadImages={handleUploadImagesForColor}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProductEditPage;
