import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

// Color map for display
const colorMap: { [key: string]: string } = {
  'red': '#dc2626',
  'maroon': '#7f1d1d',
  'gold': '#fbbf24',
  'green': '#16a34a',
  'blue': '#2563eb',
  'navy': '#1e3a8a',
  'pink': '#ec4899',
  'purple': '#9333ea',
  'orange': '#ea580c',
  'yellow': '#eab308',
  'white': '#ffffff',
  'black': '#171717',
  'cream': '#fef3c7',
  'beige': '#d4a574',
  'brown': '#92400e',
  'grey': '#6b7280',
  'gray': '#6b7280',
  'silver': '#c0c0c0',
  'multi': 'linear-gradient(45deg, #dc2626, #fbbf24, #16a34a, #2563eb)',
};

interface FilterSection {
  id: string;
  title: string;
  isOpen: boolean;
}

interface ProductFiltersAdvancedProps {
  filters: {
    categories: string[];
    priceRange: string;
    colors: string[];
    fabrics: string[];
    occasions: string[];
  };
  onFilterChange: (filterType: string, value: string | string[]) => void;
  onClearAll: () => void;
  availableFilters: {
    categories: { slug: string; name: string; count?: number }[];
    colors: string[];
    fabrics: string[];
    occasions: string[];
  };
  isMobile?: boolean;
  onClose?: () => void;
}

const priceRanges = [
  { id: 'under-1000', label: 'Under ₹1,000', min: 0, max: 1000 },
  { id: '1000-5000', label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
  { id: '5000-10000', label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { id: 'above-10000', label: 'Above ₹10,000', min: 10000, max: Infinity },
];

const ProductFiltersAdvanced: React.FC<ProductFiltersAdvancedProps> = ({
  filters,
  onFilterChange,
  onClearAll,
  availableFilters,
  isMobile = false,
  onClose,
}) => {
  const [sections, setSections] = useState<FilterSection[]>([
    { id: 'categories', title: 'Categories', isOpen: true },
    { id: 'price', title: 'Price', isOpen: true },
    { id: 'colors', title: 'Color', isOpen: true },
    { id: 'fabrics', title: 'Fabric', isOpen: false },
    { id: 'occasions', title: 'Occasion', isOpen: false },
  ]);

  const toggleSection = (sectionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, isOpen: !section.isOpen }
          : section
      )
    );
  };

  const handleCategoryChange = (categorySlug: string) => {
    const newCategories = filters.categories.includes(categorySlug)
      ? filters.categories.filter(c => c !== categorySlug)
      : [...filters.categories, categorySlug];
    onFilterChange('categories', newCategories);
  };

  const handleColorChange = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    onFilterChange('colors', newColors);
  };

  const handleFabricChange = (fabric: string) => {
    const newFabrics = filters.fabrics.includes(fabric)
      ? filters.fabrics.filter(f => f !== fabric)
      : [...filters.fabrics, fabric];
    onFilterChange('fabrics', newFabrics);
  };

  const handleOccasionChange = (occasion: string) => {
    const newOccasions = filters.occasions.includes(occasion)
      ? filters.occasions.filter(o => o !== occasion)
      : [...filters.occasions, occasion];
    onFilterChange('occasions', newOccasions);
  };

  const getActiveFilterCount = () => {
    return (
      filters.categories.length +
      (filters.priceRange ? 1 : 0) +
      filters.colors.length +
      filters.fabrics.length +
      filters.occasions.length
    );
  };

  const activeCount = getActiveFilterCount();

  return (
    <div className={`bg-white ${isMobile ? 'h-full flex flex-col' : 'rounded-xl border border-gray-200 sticky top-24'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {activeCount > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {isMobile && onClose ? (
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        ) : activeCount > 0 ? (
          <button
            onClick={onClearAll}
            className="text-sm text-primary hover:text-primary-dark transition-colors"
          >
            Clear All
          </button>
        ) : null}
      </div>

      {/* Filter Sections */}
      <div className={`${isMobile ? 'flex-1 overflow-y-auto' : ''} divide-y divide-gray-100`}>
        {/* Categories */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-medium text-gray-900">Categories</span>
            {sections.find(s => s.id === 'categories')?.isOpen ? (
              <ChevronUp size={18} className="text-gray-500" />
            ) : (
              <ChevronDown size={18} className="text-gray-500" />
            )}
          </button>
          {sections.find(s => s.id === 'categories')?.isOpen && (
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
              {availableFilters.categories.map((category) => (
                <label key={category.slug} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.slug)}
                    onChange={() => handleCategoryChange(category.slug)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 flex-1">
                    {category.name}
                  </span>
                  {category.count !== undefined && (
                    <span className="text-xs text-gray-400">({category.count})</span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-medium text-gray-900">Price</span>
            {sections.find(s => s.id === 'price')?.isOpen ? (
              <ChevronUp size={18} className="text-gray-500" />
            ) : (
              <ChevronDown size={18} className="text-gray-500" />
            )}
          </button>
          {sections.find(s => s.id === 'price')?.isOpen && (
            <div className="mt-3 space-y-2">
              {priceRanges.map((range) => (
                <label key={range.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === range.id}
                    onChange={() => onFilterChange('priceRange', range.id)}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Colors */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('colors')}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-medium text-gray-900">Color</span>
            {sections.find(s => s.id === 'colors')?.isOpen ? (
              <ChevronUp size={18} className="text-gray-500" />
            ) : (
              <ChevronDown size={18} className="text-gray-500" />
            )}
          </button>
          {sections.find(s => s.id === 'colors')?.isOpen && (
            <div className="mt-3 flex flex-wrap gap-2">
              {availableFilters.colors.map((color) => {
                const colorCode = colorMap[color.toLowerCase()] || color;
                const isSelected = filters.colors.includes(color);
                const isMulti = color.toLowerCase() === 'multi';
                
                return (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/30 scale-110'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    style={{
                      background: isMulti ? colorCode : colorCode,
                    }}
                    title={color}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className={`w-4 h-4 ${
                            ['white', 'cream', 'yellow', 'gold'].includes(color.toLowerCase())
                              ? 'text-gray-800'
                              : 'text-white'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Fabric */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('fabrics')}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-medium text-gray-900">Fabric</span>
            {sections.find(s => s.id === 'fabrics')?.isOpen ? (
              <ChevronUp size={18} className="text-gray-500" />
            ) : (
              <ChevronDown size={18} className="text-gray-500" />
            )}
          </button>
          {sections.find(s => s.id === 'fabrics')?.isOpen && (
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
              {availableFilters.fabrics.map((fabric) => (
                <label key={fabric} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.fabrics.includes(fabric)}
                    onChange={() => handleFabricChange(fabric)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">
                    {fabric}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Occasion */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('occasions')}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-medium text-gray-900">Occasion</span>
            {sections.find(s => s.id === 'occasions')?.isOpen ? (
              <ChevronUp size={18} className="text-gray-500" />
            ) : (
              <ChevronDown size={18} className="text-gray-500" />
            )}
          </button>
          {sections.find(s => s.id === 'occasions')?.isOpen && (
            <div className="mt-3 space-y-2">
              {availableFilters.occasions.map((occasion) => (
                <label key={occasion} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.occasions.includes(occasion)}
                    onChange={() => handleOccasionChange(occasion)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">
                    {occasion}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Footer */}
      {isMobile && (
        <div className="border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={onClearAll}
            className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductFiltersAdvanced;
