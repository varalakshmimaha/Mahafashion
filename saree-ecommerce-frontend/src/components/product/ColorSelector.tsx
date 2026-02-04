import React, { useMemo } from 'react';
import { ProductColor, ProductVariant } from '../../types';

interface ColorSelectorProps {
    colors?: ProductColor[]; // Legacy colors
    variants?: ProductVariant[]; // Database variants
    selectedColor: string;
    onSelectColor: (colorCode: string) => void;
}

interface ColorOption {
    code: string;
    name: string;
    available: boolean;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ 
    colors, 
    variants, 
    selectedColor, 
    onSelectColor 
}) => {
    // Extract unique colors from variants or use legacy colors
    const availableColors = useMemo((): ColorOption[] => {
        if (variants && variants.length > 0) {
            // Group variants by color and check if any size has stock
            const colorMap = new Map<string, ColorOption>();
            
            variants.forEach(variant => {
                if (!colorMap.has(variant.color_code)) {
                    colorMap.set(variant.color_code, {
                        code: variant.color_code,
                        name: variant.color_name,
                        available: variant.stock > 0
                    });
                } else {
                    // If any variant has stock, mark color as available
                    const existing = colorMap.get(variant.color_code)!;
                    if (variant.stock > 0) {
                        existing.available = true;
                    }
                }
            });
            
            return Array.from(colorMap.values());
        }
        
        // Fallback to legacy colors
        if (colors && colors.length > 0) {
            return colors.map(color => ({
                code: color.hexCode,
                name: color.name,
                available: true // Legacy colors don't have stock info
            }));
        }
        
        return [];
    }, [variants, colors]);

    if (availableColors.length === 0) {
        return null;
    }

    const selectedColorName = availableColors.find(c => c.code === selectedColor)?.name || selectedColor;

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Available Colors</h3>
            <div className="mb-3 text-sm text-gray-600">
                {selectedColorName} ({selectedColor})
            </div>
            <div className="flex flex-wrap gap-3">
                {availableColors.map((color) => (
                    <button 
                        key={color.code} 
                        className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                            selectedColor === color.code 
                                ? 'border-blue-600 ring-2 ring-blue-200 scale-110' 
                                : 'border-gray-300 hover:border-gray-400'
                        } ${
                            !color.available ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                        }`} 
                        style={{ backgroundColor: color.code }} 
                        title={`${color.name}${!color.available ? ' (Out of stock)' : ''}`}
                        onClick={() => color.available && onSelectColor(color.code)}
                        disabled={!color.available}
                    >
                        {/* Out of stock indicator */}
                        {!color.available && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-0.5 bg-red-500 rotate-45"></div>
                            </div>
                        )}
                        
                        {/* Selected indicator */}
                        {selectedColor === color.code && color.available && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ColorSelector;