import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import ColorSelector from '../components/product/ColorSelector';
import SizeSelector from '../components/product/SizeSelector';
import BlouseOptions from '../components/product/BlouseOptions';
import AddToCart from '../components/product/AddToCart';
import TabsComponent from '../components/product/TabsComponent';
import Breadcrumb from '../components/ui/Breadcrumb';
import RecentlyViewed, { addToRecentlyViewed } from '../components/product/RecentlyViewed';
import { SareeProduct } from '../types';
import { productAPI } from '../services/api';
import { Truck, RotateCcw, CreditCard } from 'lucide-react';

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<SareeProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedColorCode, setSelectedColorCode] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const tabsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (id) {
                    const response = await productAPI.getProductById(id);
                    setProduct(response);
                    setLoading(false);
                    
                    // Add to recently viewed
                    addToRecentlyViewed(id);
                    
                    // Set default selected color from database variants
                    if (response.variants && response.variants.length > 0) {
                        // Get the first color with stock
                        const firstAvailableVariant = response.variants.find(v => v.stock > 0);
                        if (firstAvailableVariant) {
                            setSelectedColorCode(firstAvailableVariant.color_code);
                        } else {
                            // No stock, just use first color
                            setSelectedColorCode(response.variants[0].color_code);
                        }
                    }
                    // Fallback to legacy color system
                    else if (response.colors && response.colors.length > 0) {
                        const defaultColor = response.defaultColor || response.colors[0].id;
                        setSelectedColorCode(defaultColor);
                    } else {
                        setSelectedColorCode(response.color || '');
                    }
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };

        fetchProduct();
        // Scroll to top when product changes
        window.scrollTo(0, 0);
    }, [id]);

    // Auto-select first available size when color changes
    useEffect(() => {
        if (product?.variants && selectedColorCode) {
            const colorVariants = product.variants.filter(v => v.color_code === selectedColorCode);
            if (colorVariants.length > 0) {
                // Try to select first variant with stock
                const availableVariant = colorVariants.find(v => v.stock > 0);
                if (availableVariant) {
                    setSelectedSize(availableVariant.size);
                } else {
                    // No stock available, select first size anyway
                    setSelectedSize(colorVariants[0].size);
                }
            }
        }
    }, [selectedColorCode, product]);

    // Scroll to reviews tab
    const scrollToReviews = () => {
        if (tabsRef.current) {
            tabsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // After scrolling, we could also trigger the reviews tab
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Skeleton Loader */}
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-48 mb-8"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <div className="aspect-[3/4] bg-gray-200 rounded-xl"></div>
                                <div className="flex gap-3">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                <div className="h-20 bg-gray-200 rounded-xl"></div>
                                <div className="space-y-4">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    <div className="flex gap-3">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
                    <a href="/products" className="inline-flex items-center px-6 py-3 bg-maroon-600 text-white font-semibold rounded-xl hover:bg-maroon-700 transition-colors">
                        Browse Products
                    </a>
                </div>
            </div>
        );
    }

    // Breadcrumb items
    const breadcrumbItems = [
        { label: 'Products', href: '/products' },
        { label: product.category || 'Sarees', href: `/products?category=${product.category || 'sarees'}` },
        { label: product.name },
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbItems} />
                
                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-6">
                    {/* Left: Product Gallery */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <ProductGallery product={product} selectedColorCode={selectedColorCode} />
                    </div>
                    
                    {/* Right: Product Info */}
                    <div>
                        <ProductInfo 
                            product={product} 
                            selectedSize={selectedSize} 
                            selectedColor={selectedColorCode}
                            onScrollToReviews={scrollToReviews}
                        />
                        
                        <div className="mt-8 space-y-6">
                            {/* Color Selector */}
                            <ColorSelector 
                                colors={product.colors} 
                                variants={product.variants}
                                selectedColor={selectedColorCode} 
                                onSelectColor={setSelectedColorCode} 
                            />
                            
                            {/* Size Selector */}
                            {product.variants && product.variants.length > 0 && (
                                <SizeSelector
                                    variants={product.variants}
                                    selectedColor={selectedColorCode}
                                    selectedSize={selectedSize}
                                    onSelectSize={setSelectedSize}
                                />
                            )}
                            
                            {/* Blouse Options */}
                            <BlouseOptions />
                            
                            {/* Add to Cart / Buy Now */}
                            <AddToCart 
                                product={product} 
                                selectedColor={selectedColorCode}
                                selectedSize={selectedSize}
                            />
                            
                            {/* Delivery Info Badges */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                                <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                                    <Truck size={24} className="text-maroon-600 mb-2" />
                                    <span className="text-xs font-semibold text-gray-700">Free Delivery</span>
                                    <span className="text-xs text-gray-500">Above ₹999</span>
                                </div>
                                <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                                    <RotateCcw size={24} className="text-maroon-600 mb-2" />
                                    <span className="text-xs font-semibold text-gray-700">7 Day Returns</span>
                                    <span className="text-xs text-gray-500">Easy Returns</span>
                                </div>
                                <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                                    <CreditCard size={24} className="text-maroon-600 mb-2" />
                                    <span className="text-xs font-semibold text-gray-700">COD Available</span>
                                    <span className="text-xs text-gray-500">Pay on Delivery</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Tabs Section */}
                <TabsComponent product={product} ref={tabsRef} />
                
                {/* Recently Viewed Products */}
                <RecentlyViewed currentProductId={id} />
            </div>
        </div>
    );
};

export default ProductDetailPage;