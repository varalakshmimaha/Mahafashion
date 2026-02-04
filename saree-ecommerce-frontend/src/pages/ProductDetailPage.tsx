import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import ColorSelector from '../components/product/ColorSelector';
import SizeSelector from '../components/product/SizeSelector';

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
                        const firstAvailableVariant = response.variants.find((v: any) => v.stock > 0);
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

    // Explicit Color Click Handler
    const handleColorSelect = (colorCode: string) => {
        setSelectedColorCode(colorCode);

        // Instant Size Update Logic
        if (product?.variants) {
            const colorVariants = product.variants.filter(v => v.color_code === colorCode);

            // 1. Try to find the first size with STOCK > 0
            const firstAvailableVariant = colorVariants.find(v => v.stock > 0);

            if (firstAvailableVariant) {
                setSelectedSize(firstAvailableVariant.size);
            } else {
                // 2. If all out of stock, just pick the first one (disabled in UI anyway)
                if (colorVariants.length > 0) {
                    setSelectedSize(colorVariants[0].size);
                } else {
                    setSelectedSize('');
                }
            }
        }
    };

    // Scroll to reviews tab
    const scrollToReviews = () => {
        if (tabsRef.current) {
            tabsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                    <a href="/products" className="text-maroon-600 hover:underline">Return to Products</a>
                </div>
            </div>
        );
    }

    // Breadcrumb items
    const getCategoryName = (): string => {
        if (typeof product.category === 'object' && product.category?.name) return product.category.name;
        if (typeof product.category === 'string') return product.category;
        return 'Sarees';
    };

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: getCategoryName(), href: `/products?category=${typeof product.category === 'object' ? product.category?.slug : 'sarees'}` },
        { label: product.name }
    ];

    // Get selected variant stock for mobile sticky bar
    const selectedVariantStock = product?.variants?.find(
        v => v.color_code === selectedColorCode && v.size === selectedSize
    )?.stock ?? 0;

    return (
        <div className="min-h-screen bg-white pb-20 md:pb-0">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Breadcrumb items={navItems} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-6">
                    {/* Left: Product Gallery */}
                    <div className="max-w-sm mx-auto lg:max-w-none w-full lg:col-span-6 lg:sticky lg:top-24 lg:self-start">
                        <ProductGallery product={product} selectedColorCode={selectedColorCode} />
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:col-span-6 product-side">
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
                                onSelectColor={handleColorSelect} // Use new handler
                            />

                            {/* Size Selector */}
                            {((product.variants && product.variants.length > 0) || (product.sizes && product.sizes.length > 0)) && (
                                <SizeSelector
                                    variants={product.variants}
                                    sizes={product.sizes}
                                    selectedColor={selectedColorCode}
                                    selectedSize={selectedSize}
                                    onSelectSize={setSelectedSize}
                                />
                            )}



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

                            {/* Tabs Section (Description, Details, Reviews) */}
                            <TabsComponent product={product} ref={tabsRef} />
                        </div>
                    </div>
                </div>

                {/* Recently Viewed Products */}

                {/* Recently Viewed Products */}
                <RecentlyViewed currentProductId={id} />
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                            <div className="text-xs text-gray-500">Price</div>
                            <div className="text-xl font-bold text-maroon-600">
                                ₹{product.price.toLocaleString()}
                            </div>
                            {selectedVariantStock > 0 && selectedVariantStock < 10 && (
                                <div className="text-xs text-red-600 font-semibold">
                                    Only {selectedVariantStock} left
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <AddToCart
                                product={product}
                                selectedColor={selectedColorCode}
                                selectedSize={selectedSize}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;