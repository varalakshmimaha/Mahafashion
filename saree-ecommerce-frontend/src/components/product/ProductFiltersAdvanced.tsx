import React from 'react';
import { X, ChevronDown } from 'lucide-react';

interface ProductFiltersAdvancedProps {
  filters: {
    categories: string[];
    subcategories: string[];
    priceRange: string;
    colors: string[];
    fabrics: string[];
    occasions: string[];
  };
  onFilterChange: (filterType: string, value: string | string[]) => void;
  onClearAll: () => void;
  availableFilters: {
    categories: { slug: string; name: string; count?: number }[];
    subcategories: { slug: string; name: string; category_slug: string }[];
    colors: string[];
    fabrics: string[];
    occasions: string[];
  };
  isMobile?: boolean;
  onClose?: () => void;
}

const ProductFiltersAdvanced: React.FC<ProductFiltersAdvancedProps> = ({
  filters,
  onFilterChange,
  onClearAll,
  availableFilters,
  isMobile = false,
  onClose
}) => {
  const handleCategoryChange = (category: string) => {
    // Toggle category selection - if it's already selected, remove it; otherwise, add it
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(cat => cat !== category)
      : [category]; // Only allow one category at a time
    
    onFilterChange('categories', newCategories);
  };

  const handleSubcategoryChange = (subcategory: string) => {
    // Toggle subcategory selection
    const newSubcategories = filters.subcategories.includes(subcategory)
      ? filters.subcategories.filter(sub => sub !== subcategory)
      : [subcategory]; // Only allow one subcategory at a time
    
    onFilterChange('subcategories', newSubcategories);
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

  const handlePriceRangeChange = (range: string) => {
    // Toggle price range - if same range is selected, clear it; otherwise select new range
    onFilterChange('priceRange', filters.priceRange === range ? '' : range);
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  const renderFilterOptions = (options: string[], selectedValues: string[], handleChange: (value: string) => void) => {
    if (!options || options.length === 0) return null;
    
    return (
      <div className="space-y-2">
        {options.map(option => (
          <label key={option} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={() => handleChange(option)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20 focus:ring-2"
            />
            <span className="text-sm text-gray-700">{option}</span>
            <span className="ml-auto text-sm text-gray-500">
              {availableFilters.categories.find(c => c.name === option)?.count || ''}
            </span>
          </label>
        ))}
      </div>
    );
  };

  return (
    <div className={`${isMobile ? 'h-full overflow-y-auto' : 'h-fit'} bg-white rounded-xl border border-gray-200 p-6`}>
      {/* Header for mobile */}
      {isMobile && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Categories Filter */}
      {availableFilters.categories.length > 0 && renderSection('Categories', (
        <div className="space-y-2">
          {availableFilters.categories.map(category => (
            <label key={category.slug} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(category.slug)}
                onChange={() => handleCategoryChange(category.slug)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20 focus:ring-2"
              />
              <span className="text-sm text-gray-700">{category.name}</span>
              <span className="ml-auto text-sm text-gray-500">
                {category.count ? `(${category.count})` : ''}
              </span>
            </label>
          ))}
        </div>
      ))}

      {/* Subcategories Filter */}
      {availableFilters.subcategories.length > 0 && renderSection('Subcategories', (
        <div className="space-y-2">
          {availableFilters.subcategories.map(subcategory => (
            <label key={subcategory.slug} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.subcategories.includes(subcategory.slug)}
                onChange={() => handleSubcategoryChange(subcategory.slug)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20 focus:ring-2"
              />
              <span className="text-sm text-gray-700">{subcategory.name}</span>
            </label>
          ))}
        </div>
      ))}

      {/* Price Range Filter */}
      {renderSection('Price Range', (
        <div className="space-y-2">
          {[
            { value: 'under-1000', label: 'Under ₹1,000' },
            { value: '1000-5000', label: '₹1,000 - ₹5,000' },
            { value: '5000-10000', label: '₹5,000 - ₹10,000' },
            { value: 'above-10000', label: 'Above ₹10,000' },
          ].map(range => (
            <label key={range.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.priceRange === range.value}
                onChange={() => handlePriceRangeChange(range.value)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20 focus:ring-2"
              />
              <span className="text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      ))}

      {/* Colors Filter */}
      {availableFilters.colors.length > 0 && renderSection('Colors', (
        renderFilterOptions(availableFilters.colors, filters.colors, handleColorChange)
      ))}

      {/* Fabrics Filter */}
      {availableFilters.fabrics.length > 0 && renderSection('Fabrics', (
        renderFilterOptions(availableFilters.fabrics, filters.fabrics, handleFabricChange)
      ))}

      {/* Occasions Filter */}
      {availableFilters.occasions.length > 0 && renderSection('Occasions', (
        renderFilterOptions(availableFilters.occasions, filters.occasions, handleOccasionChange)
      ))}

      {/* Clear All Button */}
      {(filters.categories.length > 0 || 
        filters.subcategories.length > 0 || 
        filters.colors.length > 0 || 
        filters.fabrics.length > 0 || 
        filters.occasions.length > 0 || 
        filters.priceRange) && (
        <div className="pt-6">
          <button
            onClick={onClearAll}
            className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Apply button for mobile */}
      {isMobile && (
        <div className="pt-4 sticky bottom-0 bg-white pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductFiltersAdvanced;