import React, { useState } from 'react';
import { Plus, Trash2, Save, Wand2 } from 'lucide-react';
import { productAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';

const PREDEFINED_COLORS = [
    { name: 'Red', code: '#EF4444' },
    { name: 'Blue', code: '#3B82F6' },
    { name: 'Green', code: '#10B981' },
    { name: 'Yellow', code: '#F59E0B' },
    { name: 'Black', code: '#000000' },
    { name: 'White', code: '#FFFFFF' },
    { name: 'Pink', code: '#EC4899' },
    { name: 'Purple', code: '#8B5CF6' },
    { name: 'Orange', code: '#F97316' },
    { name: 'Grey', code: '#6B7280' },
    { name: 'Gold', code: '#FFD700' },
    { name: 'Silver', code: '#C0C0C0' },
    { name: 'Maroon', code: '#800000' },
    { name: 'Navy', code: '#000080' },
];

// Allow checking "custom" color?
// For now let's just add a way to ADD a color.

const PREDEFINED_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

interface VariantBulkGeneratorProps {
    productId: number;
    onSuccess?: () => void;
}

interface VariantRow {
    color_name: string;
    color_code: string;
    size: string;
    price_adjustment: number;
    price?: number; // Explicit price override
    stock: number;
    sku: string;
}

const VariantBulkGenerator: React.FC<VariantBulkGeneratorProps> = ({ productId, onSuccess }) => {
    const { addNotification } = useNotification();

    // Selection State
    const [selectedColors, setSelectedColors] = useState<{ name: string, code: string }[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    // Table State
    const [generatedVariants, setGeneratedVariants] = useState<VariantRow[]>([]);

    // Bulk Edit State
    const [bulkStock, setBulkStock] = useState('10');
    const [bulkPrice, setBulkPrice] = useState('0');

    const toggleColor = (color: { name: string, code: string }) => {
        if (selectedColors.some(c => c.code === color.code)) {
            setSelectedColors(selectedColors.filter(c => c.code !== color.code));
        } else {
            setSelectedColors([...selectedColors, color]);
        }
    };

    const toggleSize = (size: string) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter(s => s !== size));
        } else {
            setSelectedSizes([...selectedSizes, size]);
        }
    };

    const generateTable = () => {
        if (selectedColors.length === 0 || selectedSizes.length === 0) {
            addNotification('Please select at least one color and one size', 'error');
            return;
        }

        const newVariants: VariantRow[] = [];
        selectedColors.forEach(color => {
            selectedSizes.forEach(size => {
                newVariants.push({
                    color_name: color.name,
                    color_code: color.code,
                    size: size,
                    stock: parseInt(bulkStock) || 0,
                    price_adjustment: 0,
                    price: 0, // Default to 0, implying base price usage unless changed
                    sku: `SKU-${color.name.substring(0, 3).toUpperCase()}-${size}`,
                });
            });
        });
        setGeneratedVariants(newVariants);
    };

    const updateVariant = (index: number, field: keyof VariantRow, value: any) => {
        const updated = [...generatedVariants];
        updated[index] = { ...updated[index], [field]: value };
        setGeneratedVariants(updated);
    };

    const applyBulkStock = () => {
        setGeneratedVariants(prev => prev.map(v => ({ ...v, stock: parseInt(bulkStock) || 0 })));
    };

    // Changing this to apply BULK PRICE override
    const applyBulkPrice = () => {
        setGeneratedVariants(prev => prev.map(v => ({ ...v, price: parseFloat(bulkPrice) || 0 })));
    };

    const handleSave = async () => {
        if (generatedVariants.length === 0) return;

        try {
            const payload = generatedVariants.map(v => ({
                color_code: v.color_code,
                color_name: v.color_name,
                size: v.size,
                stock: v.stock,
                price_adjustment: 0, // Deprecated in favor of explicit price, but keeping for safety
                price: v.price || 0, // Sending explicit price
                sku: v.sku
            }));

            await productAPI.updateVariants(productId, payload);
            addNotification('Variants generated and saved successfully!', 'success');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error saving variants:', error);
            addNotification('Failed to save variants', 'error');
        }
    };

    return (
        <div className="space-y-8">
            {/* 1. Select Colors */}
            <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-medium mb-4">1. Select Colors</h3>
                <div className="flex flex-wrap gap-3">
                    {PREDEFINED_COLORS.map(color => {
                        const isSelected = selectedColors.some(c => c.code === color.code);
                        return (
                            <button
                                key={color.code}
                                onClick={() => toggleColor(color)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isSelected ? 'ring-2 ring-primary border-primary bg-primary-50' : 'hover:border-gray-300'
                                    }`}
                            >
                                <span
                                    className="w-4 h-4 rounded-full border border-gray-200"
                                    style={{ backgroundColor: color.code }}
                                />
                                <span className="text-sm">{color.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Custom Color Input */}
                <div className="mt-4 flex items-end gap-3 border-t pt-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Custom Color Name</label>
                        <input
                            type="text"
                            id="customColorName"
                            className="px-3 py-1.5 border rounded text-sm w-32"
                            placeholder="e.g. Teal"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Hex Code</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                id="customColorPicker"
                                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                            />
                            <input
                                type="text"
                                id="customColorHex"
                                className="px-3 py-1.5 border rounded text-sm w-24"
                                placeholder="#008080"
                                onChange={(e) => {
                                    // Sync color picker with text input
                                    const val = e.target.value;
                                    if (val.match(/^#[0-9A-Fa-f]{6}$/)) {
                                        (document.getElementById('customColorPicker') as HTMLInputElement).value = val;
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const nameInput = document.getElementById('customColorName') as HTMLInputElement;
                            const hexInput = document.getElementById('customColorHex') as HTMLInputElement;
                            const pickerInput = document.getElementById('customColorPicker') as HTMLInputElement;

                            // Use picker value if hex input is empty
                            const code = hexInput.value || pickerInput.value;
                            const name = nameInput.value || 'Custom';

                            if (code) {
                                toggleColor({ name, code });
                                nameInput.value = '';
                                hexInput.value = '';
                            }
                        }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                    >
                        Add Custom
                    </button>
                </div>
            </div>

            {/* 2. Select Sizes */}
            <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-medium mb-4">2. Select Sizes</h3>
                <div className="flex flex-wrap gap-4">
                    {PREDEFINED_SIZES.map(size => (
                        <label key={size} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border hover:bg-gray-100">
                            <input
                                type="checkbox"
                                checked={selectedSizes.includes(size)}
                                onChange={() => toggleSize(size)}
                                className="w-4 h-4 text-primary rounded focus:ring-primary"
                            />
                            <span className="font-medium text-gray-700">{size}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* 3. Generate & Edit */}
            <div className="bg-white p-6 rounded-lg border">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium">3. Edit Variants</h3>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={bulkStock}
                                onChange={(e) => setBulkStock(e.target.value)}
                                className="w-20 px-2 py-1 border rounded text-sm"
                                placeholder="Stock"
                            />
                            <button onClick={applyBulkStock} className="text-xs text-primary underline">Apply content to all</button>
                        </div>

                        <button
                            onClick={generateTable}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                        >
                            <Wand2 size={18} />
                            Generate Table
                        </button>
                    </div>
                </div>

                {generatedVariants.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (₹)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {generatedVariants.map((variant, index) => (
                                    <tr key={`${variant.color_code}-${variant.size}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="w-4 h-4 rounded-full border"
                                                    style={{ backgroundColor: variant.color_code }}
                                                />
                                                <span className="text-sm font-medium text-gray-900">{variant.color_name} - {variant.size}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="text"
                                                value={variant.sku}
                                                onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                                className="w-full px-2 py-1 border rounded text-sm"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="number"
                                                value={variant.price || 0}
                                                onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value))}
                                                className="w-24 px-2 py-1 border rounded text-sm"
                                                placeholder="Override Base"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="number"
                                                value={variant.stock}
                                                onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value))}
                                                className="w-24 px-2 py-1 border rounded text-sm"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => {
                                                    const newVars = [...generatedVariants];
                                                    newVars.splice(index, 1);
                                                    setGeneratedVariants(newVars);
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                            >
                                <Save size={18} />
                                Save All Variants
                            </button>
                        </div>

                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                        Select colors and sizes above, then click "Generate Table"
                    </div>
                )}
            </div>
        </div>
    );
};

export default VariantBulkGenerator;
