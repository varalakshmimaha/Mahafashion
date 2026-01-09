import React, { useState, useEffect } from 'react';

interface ProductVariant {
  id?: number;
  color_code: string;
  color_name: string;
  size: string;
  stock: number;
  price_adjustment: number;
  sku: string;
}

interface ProductVariantManagerProps {
  productId: number;
  existingVariants?: ProductVariant[];
  onUpdateSuccess?: () => void;
}

const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const PREDEFINED_COLORS = [
  { name: 'Red', code: '#FF0000' },
  { name: 'Maroon', code: '#800000' },
  { name: 'Pink', code: '#FFC0CB' },
  { name: 'Orange', code: '#FFA500' },
  { name: 'Yellow', code: '#FFFF00' },
  { name: 'Green', code: '#008000' },
  { name: 'Blue', code: '#0000FF' },
  { name: 'Navy', code: '#000080' },
  { name: 'Purple', code: '#800080' },
  { name: 'Brown', code: '#964B00' },
  { name: 'Black', code: '#000000' },
  { name: 'White', code: '#FFFFFF' },
  { name: 'Gray', code: '#808080' },
  { name: 'Beige', code: '#F5F5DC' },
  { name: 'Gold', code: '#FFD700' },
  { name: 'Silver', code: '#C0C0C0' },
];

const ProductVariantManager: React.FC<ProductVariantManagerProps> = ({
  productId,
  existingVariants = [],
  onUpdateSuccess
}) => {
  const [variants, setVariants] = useState<ProductVariant[]>(existingVariants);
  const [newVariant, setNewVariant] = useState<Partial<ProductVariant>>({
    color_code: '#000000',
    color_name: '',
    size: 'M',
    stock: 0,
    price_adjustment: 0,
    sku: ''
  });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    setVariants(existingVariants);
  }, [existingVariants]);

  const handleAddVariant = () => {
    if (!newVariant.color_name || !newVariant.size) {
      alert('Please fill in color name and size');
      return;
    }

    // Check for duplicates
    const duplicate = variants.find(
      v => v.color_code === newVariant.color_code && v.size === newVariant.size
    );

    if (duplicate) {
      alert('A variant with this color and size combination already exists');
      return;
    }

    setVariants([...variants, newVariant as ProductVariant]);
    
    // Reset form
    setNewVariant({
      color_code: '#000000',
      color_name: '',
      size: 'M',
      stock: 0,
      price_adjustment: 0,
      sku: ''
    });
  };

  const handleRemoveVariant = (index: number) => {
    if (confirm('Are you sure you want to remove this variant?')) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const handleDeleteVariant = async (variantId: number) => {
    if (!confirm('Are you sure you want to delete this variant from the database?')) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/products/${productId}/variants/${variantId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete variant');
      }

      setVariants(variants.filter(v => v.id !== variantId));
      alert('Variant deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete variant');
    }
  };

  const handleUpdateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleSaveVariants = async () => {
    if (variants.length === 0) {
      alert('Please add at least one variant');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/products/${productId}/variants`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ variants })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save variants');
      }

      const result = await response.json();
      setVariants(result.variants);
      
      alert('Variants saved successfully!');
      onUpdateSuccess?.();
    } catch (error) {
      console.error('Save error:', error);
      alert(`Failed to save variants: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const selectPredefinedColor = (color: typeof PREDEFINED_COLORS[0]) => {
    setNewVariant({
      ...newVariant,
      color_code: color.code,
      color_name: color.name
    });
  };

  const getColorName = (colorCode: string): string => {
    const found = PREDEFINED_COLORS.find(c => c.code.toLowerCase() === colorCode.toLowerCase());
    return found ? found.name : colorCode;
  };

  return (
    <div className="space-y-6">
      {/* Add New Variant Form */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Add New Variant</h3>
        
        {/* Predefined Colors */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Select Color
          </label>
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_COLORS.map((color) => (
              <button
                key={color.code}
                type="button"
                onClick={() => selectPredefinedColor(color)}
                className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg hover:shadow transition ${
                  newVariant.color_code === color.code
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300'
                }`}
                title={color.name}
              >
                <div
                  className="w-5 h-5 rounded border border-gray-300"
                  style={{ backgroundColor: color.code }}
                />
                <span className="text-sm">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Color Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color Code
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={newVariant.color_code}
                onChange={(e) => setNewVariant({ ...newVariant, color_code: e.target.value })}
                className="w-12 h-10 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={newVariant.color_code}
                onChange={(e) => setNewVariant({ ...newVariant, color_code: e.target.value })}
                className="flex-1 px-3 py-2 border rounded"
                placeholder="#RRGGBB"
                maxLength={7}
              />
            </div>
          </div>

          {/* Color Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color Name *
            </label>
            <input
              type="text"
              value={newVariant.color_name}
              onChange={(e) => setNewVariant({ ...newVariant, color_name: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              placeholder="e.g., Maroon"
              required
            />
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size *
            </label>
            <select
              value={newVariant.size}
              onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            >
              {COMMON_SIZES.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              value={newVariant.stock}
              onChange={(e) => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border rounded"
              min="0"
            />
          </div>

          {/* Price Adjustment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Adjustment (₹)
            </label>
            <input
              type="number"
              value={newVariant.price_adjustment}
              onChange={(e) => setNewVariant({ ...newVariant, price_adjustment: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border rounded"
              step="0.01"
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU (Optional)
            </label>
            <input
              type="text"
              value={newVariant.sku}
              onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              placeholder="e.g., SAR-MAR-M-001"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleAddVariant}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Variant
          </button>
        </div>
      </div>

      {/* Variants Table */}
      {variants.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Current Variants ({variants.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Color</th>
                  <th className="border px-4 py-2 text-left">Size</th>
                  <th className="border px-4 py-2 text-right">Stock</th>
                  <th className="border px-4 py-2 text-right">Price Adj.</th>
                  <th className="border px-4 py-2 text-left">SKU</th>
                  <th className="border px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant, index) => (
                  <tr key={variant.id || index} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">
                      {editingId === variant.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={variant.color_code}
                            onChange={(e) => handleUpdateVariant(index, 'color_code', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={variant.color_name}
                            onChange={(e) => handleUpdateVariant(index, 'color_name', e.target.value)}
                            className="px-2 py-1 border rounded text-sm"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: variant.color_code }}
                          />
                          <span>{variant.color_name}</span>
                        </div>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {editingId === variant.id ? (
                        <select
                          value={variant.size}
                          onChange={(e) => handleUpdateVariant(index, 'size', e.target.value)}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          {COMMON_SIZES.map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      ) : (
                        variant.size
                      )}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {editingId === variant.id ? (
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => handleUpdateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border rounded text-sm text-right"
                          min="0"
                        />
                      ) : (
                        <span className={variant.stock === 0 ? 'text-red-600 font-semibold' : ''}>
                          {variant.stock}
                        </span>
                      )}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {editingId === variant.id ? (
                        <input
                          type="number"
                          value={variant.price_adjustment}
                          onChange={(e) => handleUpdateVariant(index, 'price_adjustment', parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 border rounded text-sm text-right"
                          step="0.01"
                        />
                      ) : (
                        `₹${variant.price_adjustment.toFixed(2)}`
                      )}
                    </td>
                    <td className="border px-4 py-2 text-sm text-gray-600">
                      {editingId === variant.id ? (
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) => handleUpdateVariant(index, 'sku', e.target.value)}
                          className="px-2 py-1 border rounded text-sm"
                        />
                      ) : (
                        variant.sku || '-'
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      <div className="flex justify-center gap-2">
                        {editingId === variant.id ? (
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-green-600 hover:text-green-800"
                            title="Done editing"
                          >
                            ✓
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingId(variant.id || null)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            ✎
                          </button>
                        )}
                        <button
                          onClick={() => variant.id ? handleDeleteVariant(variant.id) : handleRemoveVariant(index)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Save Button */}
      {variants.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleSaveVariants}
            disabled={saving}
            className={`px-6 py-2 rounded-lg font-medium text-white ${
              saving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {saving ? 'Saving...' : 'Save All Variants'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductVariantManager;
