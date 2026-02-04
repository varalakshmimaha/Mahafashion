import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Grid3X3, List, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductFiltersAdvanced from '../components/product/ProductFiltersAdvanced';
import ProductCard from '../components/product/ProductCard';
import Breadcrumb from '../components/ui/Breadcrumb';
import { SareeProduct, Category as CategoryType } from '../types';
import { productAPI, categoryAPI } from '../services/api';

const PRODUCTS_PER_PAGE = 12;

const ProductsPage = () => {
  // State
  const [products, setProducts] = useState<SareeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // URL params
  const [searchParams, setSearchParams] = useSearchParams();
  const { slug } = useParams<{ slug: string }>();
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || slug || '';
  const subcategoryParam = searchParams.get('subcategory') || '';

  // Filters state
  const [filters, setFilters] = useState({
    categories: categoryParam ? categoryParam.split(',') : [] as string[],
    subcategories: subcategoryParam ? subcategoryParam.split(',') : [] as string[],
    priceRange: '',
    colors: [] as string[],
    fabrics: [] as string[],
    occasions: [] as string[],
  });

  // Available filter options
  const [availableFilters, setAvailableFilters] = useState({
    categories: [] as { slug: string; name: string; count?: number }[],
    subcategories: [] as { slug: string; name: string; category_slug: string }[],
    colors: [] as string[],
    fabrics: [] as string[],
    occasions: [] as string[],
  });

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await categoryAPI.getCategories().catch(() => []);
        setCategories(categoriesResponse || []);
        
        // Build category filter options
        const categoryOptions = (categoriesResponse || []).map((cat: CategoryType) => ({
          slug: cat.slug,
          name: cat.name,
          count: 0, // Will be updated after product fetch
        }));
        
        // Prepare query parameters for unified product API
        const params: any = { page: currentPage };
        
        if (filters.categories.length > 0) params.category = filters.categories;
        if (filters.subcategories.length > 0) params.sub_category = filters.subcategories;
        if (filters.priceRange) params.price = filters.priceRange;
        if (filters.colors.length > 0) params.color = filters.colors;
        if (filters.fabrics.length > 0) params.fabric = filters.fabrics;
        if (filters.occasions.length > 0) params.occasion = filters.occasions;
        if (searchQuery) params.search = searchQuery;
        if (sortBy) params.sort = sortBy;

        // Fetch products
        const productsResponse = await productAPI.getProducts(params);
        
        const productData = productsResponse.data || productsResponse;
        setProducts(productData.data || productData);
        setTotalPages(productData.last_page || 1);
        setTotalProducts(productData.total || (productData.data ? productData.data.length : productData.length));
        
        // Fetch subcategories for the selected category
        if (categoryParam) {
          try {
            const subcats = await categoryAPI.getSubcategories(categoryParam);
            setSubcategories(subcats || []);
            
            // Build subcategory filter options
            const subcategoryOptions = (subcats || []).map((sub: any) => ({
              slug: sub.slug,
              name: sub.name,
              category_slug: categoryParam,
            }));
            
            setAvailableFilters(prev => ({
              ...prev,
              subcategories: subcategoryOptions,
            }));
          } catch (error) {
            console.error('Error fetching subcategories:', error);
            setSubcategories([]);
            setAvailableFilters(prev => ({
              ...prev,
              subcategories: [],
            }));
          }
        } else {
          setSubcategories([]);
          setAvailableFilters(prev => ({
            ...prev,
            subcategories: [],
          }));
        }
        
        // Extract other filter options from products
        const colors = new Set<string>();
        const fabrics = new Set<string>();
        const occasions = new Set<string>();

        const productItems = productData.data || productData;
        productItems.forEach((product: SareeProduct) => {
          if (product.color) colors.add(product.color);
          if (product.fabric) fabrics.add(product.fabric);
          if (product.occasion) occasions.add(product.occasion);
        });
        
        setAvailableFilters(prev => ({
          ...prev,
          categories: categoryOptions,
          colors: Array.from(colors),
          fabrics: Array.from(fabrics),
          occasions: Array.from(occasions),
        }));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryParam, subcategoryParam, searchQuery, sortBy, currentPage]);

  // Update filters when URL changes
  useEffect(() => {
    const newFilters = {
      categories: categoryParam ? categoryParam.split(',') : [],
      subcategories: subcategoryParam ? subcategoryParam.split(',') : [],
      priceRange: filters.priceRange,
      colors: filters.colors,
      fabrics: filters.fabrics,
      occasions: filters.occasions,
    };
    
    setFilters(newFilters);
  }, [categoryParam, subcategoryParam]);

  // Pagination - using the state variables we defined
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return products.slice(start, start + PRODUCTS_PER_PAGE);
  }, [products, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, sortBy]);

  // Handle filter change
  const handleFilterChange = (filterType: string, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
    
    // Update URL parameters based on filter type
    const newParams = new URLSearchParams(searchParams);
    
    switch (filterType) {
      case 'categories':
        if (Array.isArray(value) && value.length > 0) {
          newParams.set('category', value.join(','));
        } else {
          newParams.delete('category');
        }
        // When changing category, also clear subcategory
        newParams.delete('subcategory');
        break;
      case 'subcategories':
        if (Array.isArray(value) && value.length > 0) {
          newParams.set('subcategory', value.join(','));
        } else {
          newParams.delete('subcategory');
        }
        break;
      case 'priceRange':
        if (value) {
          newParams.set('price', value as string);
        } else {
          newParams.delete('price');
        }
        break;
      case 'colors':
      case 'fabrics':
      case 'occasions':
        // For other filters, we'll just update the state
        // and let the API handle them
        break;
      default:
        break;
    }
    
    setSearchParams(newParams);
  };

  // Clear all filters
  const handleClearAll = () => {
    setFilters({
      categories: [],
      subcategories: [],
      priceRange: '',
      colors: [],
      fabrics: [],
      occasions: [],
    });
    
    // Preserve search parameter but clear filters
    const newParams = new URLSearchParams();
    if (searchParams.get('search')) {
      newParams.set('search', searchParams.get('search')!);
    }
    setSearchParams(newParams);
  };

  // Get page title
  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    if (filters.categories.length === 1) {
      const cat = categories.find(c => c.slug === filters.categories[0]);
      return cat?.name || filters.categories[0].charAt(0).toUpperCase() + filters.categories[0].slice(1);
    }
    return 'All Products';
  };

  // Build breadcrumb items
  const breadcrumbItems = useMemo(() => {
    const items: { label: string; href?: string }[] = [{ label: 'Products', href: '/products' }];
    
    if (filters.categories.length === 1) {
      const cat = categories.find(c => c.slug === filters.categories[0]);
      if (cat) {
        items.push({ label: cat.name });
      }
    } else if (searchQuery) {
      items.push({ label: `Search: "${searchQuery}"` });
    }
    
    return items;
  }, [filters.categories, categories, searchQuery]);

  // Pagination component
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-12">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
          </>
        )}

        {pages.map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
              currentPage === page
                ? 'bg-primary text-white'
                : 'border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
            {getPageTitle()}
          </h1>
          <p className="mt-2 text-gray-600">
            {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <ProductFiltersAdvanced
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
              availableFilters={availableFilters}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal size={18} />
                <span>Filters</span>
                {(filters.categories.length + filters.subcategories.length + filters.colors.length + filters.fabrics.length + filters.occasions.length + (filters.priceRange ? 1 : 0)) > 0 && (
                  <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                    {filters.categories.length + filters.subcategories.length + filters.colors.length + filters.fabrics.length + filters.occasions.length + (filters.priceRange ? 1 : 0)}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-gray-600 hidden sm:block">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="popularity">Popularity</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Grid view"
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="List view"
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Active Filters Tags */}
            {(filters.categories.length > 0 || filters.subcategories.length > 0 || filters.colors.length > 0 || filters.fabrics.length > 0 || filters.occasions.length > 0 || filters.priceRange) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.categories.map(cat => {
                  const category = categories.find(c => c.slug === cat);
                  return (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {category?.name || cat}
                      <button
                        onClick={() => handleFilterChange('categories', filters.categories.filter(c => c !== cat))}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  );
                })}
                {filters.subcategories.map(sub => {
                  const subcategory = availableFilters.subcategories.find(s => s.slug === sub);
                  return (
                    <span
                      key={sub}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {subcategory?.name || sub}
                      <button
                        onClick={() => handleFilterChange('subcategories', filters.subcategories.filter(s => s !== sub))}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  );
                })}
                {filters.priceRange && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                    {filters.priceRange === 'under-1000' && 'Under ₹1,000'}
                    {filters.priceRange === '1000-5000' && '₹1,000 - ₹5,000'}
                    {filters.priceRange === '5000-10000' && '₹5,000 - ₹10,000'}
                    {filters.priceRange === 'above-10000' && 'Above ₹10,000'}
                    <button
                      onClick={() => handleFilterChange('priceRange', '')}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {filters.colors.map(color => (
                  <span
                    key={color}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {color}
                    <button
                      onClick={() => handleFilterChange('colors', filters.colors.filter(c => c !== color))}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {filters.fabrics.map(fabric => (
                  <span
                    key={fabric}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {fabric}
                    <button
                      onClick={() => handleFilterChange('fabrics', filters.fabrics.filter(f => f !== fabric))}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {filters.occasions.map(occasion => (
                  <span
                    key={occasion}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {occasion}
                    <button
                      onClick={() => handleFilterChange('occasions', filters.occasions.filter(o => o !== occasion))}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <button
                  onClick={handleClearAll}
                  className="text-sm text-gray-500 hover:text-primary transition-colors underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Products Grid/List */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <SlidersHorizontal size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  {searchQuery
                    ? `No products match "${searchQuery}". Try different keywords.`
                    : 'No products match your current filters. Try adjusting your filters.'}
                </p>
                <button
                  onClick={handleClearAll}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=500&auto=format&fit=crop'}
                      alt={product.name}
                      className="w-full sm:w-48 h-56 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center gap-2 mb-2">
                        {product.fabric && (
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded">{product.fabric}</span>
                        )}
                        {product.occasion && (
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded">{product.occasion}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">₹{product.price?.toLocaleString()}</span>
                        {product.discount && product.discount > 0 && (
                          <>
                            <span className="text-sm text-gray-400 line-through">
                              ₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
                            </span>
                            <span className="text-xs text-green-600 font-medium">
                              {product.discount}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {renderPagination()}
          </main>
        </div>
      </div>

      {/* Mobile Filter Slide-out Panel */}
      {showMobileFilters && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          />
          
          {/* Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 lg:hidden transform transition-transform">
            <ProductFiltersAdvanced
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
              availableFilters={availableFilters}
              isMobile={true}
              onClose={() => setShowMobileFilters(false)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsPage;