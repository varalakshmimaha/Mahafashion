import React, { useMemo, useState } from 'react';
import { ProductVariant } from '../../types';
import { Ruler, X } from 'lucide-react';

interface SizeSelectorProps {
    variants?: ProductVariant[];
    selectedColor: string;
    selectedSize: string;
    onSelectSize: (size: string) => void;
}

interface SizeOption {
    size: string;
    stock: number;
    available: boolean;
    priceAdjustment: number;
}

// Size Guide Modal Component
const SizeGuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
            <div 
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900">Size Guide</h2>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Saree Length Info */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Saree Dimensions</h3>
                        <div className="bg-maroon-50 rounded-xl p-4">
                            <p className="text-gray-700 mb-2">
                                <strong>Standard Length:</strong> 5.5 meters (including blouse piece)
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Width:</strong> 1.1 - 1.2 meters
                            </p>
                            <p className="text-gray-700">
                                <strong>Blouse Piece:</strong> 0.8 - 1 meter (unstitched)
                            </p>
                        </div>
                    </div>

                    {/* Blouse Size Chart */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Blouse Size Chart</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-maroon-600 text-white">
                                        <th className="py-3 px-4 text-left font-semibold">Size</th>
                                        <th className="py-3 px-4 text-center font-semibold">Bust (inches)</th>
                                        <th className="py-3 px-4 text-center font-semibold">Waist (inches)</th>
                                        <th className="py-3 px-4 text-center font-semibold">Shoulder (inches)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { size: 'XS', bust: '32-34', waist: '26-28', shoulder: '13' },
                                        { size: 'S', bust: '34-36', waist: '28-30', shoulder: '13.5' },
                                        { size: 'M', bust: '36-38', waist: '30-32', shoulder: '14' },
                                        { size: 'L', bust: '38-40', waist: '32-34', shoulder: '14.5' },
                                        { size: 'XL', bust: '40-42', waist: '34-36', shoulder: '15' },
                                        { size: 'XXL', bust: '42-44', waist: '36-38', shoulder: '15.5' },
                                    ].map((row, index) => (
                                        <tr key={row.size} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="py-3 px-4 font-semibold text-maroon-700">{row.size}</td>
                                            <td className="py-3 px-4 text-center text-gray-700">{row.bust}</td>
                                            <td className="py-3 px-4 text-center text-gray-700">{row.waist}</td>
                                            <td className="py-3 px-4 text-center text-gray-700">{row.shoulder}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* How to Measure */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Measure</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="w-10 h-10 bg-maroon-100 rounded-full flex items-center justify-center mb-3">
                                    <span className="text-maroon-600 font-bold">1</span>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Bust</h4>
                                <p className="text-sm text-gray-600">Measure around the fullest part of your bust, keeping the tape horizontal.</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="w-10 h-10 bg-maroon-100 rounded-full flex items-center justify-center mb-3">
                                    <span className="text-maroon-600 font-bold">2</span>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Waist</h4>
                                <p className="text-sm text-gray-600">Measure around the narrowest part of your natural waistline.</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="w-10 h-10 bg-maroon-100 rounded-full flex items-center justify-center mb-3">
                                    <span className="text-maroon-600 font-bold">3</span>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Shoulder</h4>
                                <p className="text-sm text-gray-600">Measure from one shoulder point to the other across the back.</p>
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tips</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• If you're between sizes, we recommend choosing the larger size.</li>
                            <li>• For a more fitted look, you can always get the blouse tailored locally.</li>
                            <li>• Contact our support team for custom sizing options.</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100">
                    <button 
                        onClick={onClose}
                        className="w-full py-3 bg-maroon-600 text-white font-semibold rounded-xl hover:bg-maroon-700 transition-colors"
                    >
                        Got It
                    </button>
                </div>
            </div>
        </div>
    );
};

const SizeSelector: React.FC<SizeSelectorProps> = ({ 
    variants, 
    selectedColor, 
    selectedSize, 
    onSelectSize 
}) => {
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    // Get available sizes for the selected color
    const availableSizes = useMemo((): SizeOption[] => {
        if (!variants || variants.length === 0 || !selectedColor) {
            return [];
        }

        const colorVariants = variants.filter(v => v.color_code === selectedColor);
        
        return colorVariants.map(variant => ({
            size: variant.size,
            stock: variant.stock,
            available: variant.stock > 0,
            priceAdjustment: variant.price_adjustment
        }));
    }, [variants, selectedColor]);

    if (availableSizes.length === 0) {
        return null;
    }

    const selectedSizeInfo = availableSizes.find(s => s.size === selectedSize);

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">
                    Size: <span className="font-normal">{selectedSize || 'Select a size'}</span>
                </h3>
                <div className="flex items-center gap-4">
                    {selectedSizeInfo && (
                        <span className={`text-sm ${selectedSizeInfo.stock <= 5 ? 'text-red-600 font-semibold' : 'text-green-600'}`}>
                            {selectedSizeInfo.stock <= 5 
                                ? `Only ${selectedSizeInfo.stock} left!` 
                                : `${selectedSizeInfo.stock} in stock`
                            }
                        </span>
                    )}
                    <button
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="flex items-center gap-1.5 text-sm text-maroon-600 hover:text-maroon-700 font-medium transition-colors"
                    >
                        <Ruler size={16} />
                        Size Guide
                    </button>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
                {availableSizes.map((sizeOption) => (
                    <button
                        key={sizeOption.size}
                        onClick={() => sizeOption.available && onSelectSize(sizeOption.size)}
                        disabled={!sizeOption.available}
                        className={`relative px-4 py-2 min-w-[60px] border-2 rounded-lg font-medium transition-all ${
                            selectedSize === sizeOption.size
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : sizeOption.available
                                ? 'border-gray-300 hover:border-gray-400 text-gray-700'
                                : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                        title={
                            !sizeOption.available 
                                ? 'Out of stock' 
                                : sizeOption.priceAdjustment !== 0 
                                ? `Additional ₹${sizeOption.priceAdjustment.toFixed(2)}` 
                                : sizeOption.size
                        }
                    >
                        {sizeOption.size}
                        
                        {/* Out of stock indicator */}
                        {!sizeOption.available && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-0.5 bg-red-500 rotate-12"></div>
                            </div>
                        )}

                        {/* Price adjustment badge */}
                        {sizeOption.priceAdjustment !== 0 && selectedSize === sizeOption.size && (
                            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                +₹{sizeOption.priceAdjustment.toFixed(0)}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Stock warning */}
            {selectedSizeInfo && selectedSizeInfo.stock > 0 && selectedSizeInfo.stock <= 3 && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Hurry! Limited stock available for this size.
                </p>
            )}

            {/* Size Guide Modal */}
            <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
        </div>
    );
};

export default SizeSelector;
