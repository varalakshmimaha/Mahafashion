import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SareeProduct } from '../../types';
import { productAPI } from '../../services/api';
import { Heart, Eye } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

const RECENTLY_VIEWED_KEY = 'recently_viewed_products';
const MAX_RECENTLY_VIEWED = 8;

// Helper functions to manage recently viewed products in localStorage
export const addToRecentlyViewed = (productId: string) => {
    try {
        const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
        let viewedIds: string[] = stored ? JSON.parse(stored) : [];
        
        // Remove if already exists (to move to front)
        viewedIds = viewedIds.filter(id => id !== productId);
        
        // Add to front
        viewedIds.unshift(productId);
        
        // Keep only last N items
        viewedIds = viewedIds.slice(0, MAX_RECENTLY_VIEWED);
        
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(viewedIds));
    } catch (error) {
        console.error('Error saving recently viewed:', error);
    }
};

export const getRecentlyViewedIds = (): string[] => {
    try {
        const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

interface RecentlyViewedProps {
    currentProductId?: string;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ currentProductId }) => {
    const [products, setProducts] = useState<SareeProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const { isProductInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

    useEffect(() => {
        const fetchRecentlyViewed = async () => {
            try {
                const viewedIds = getRecentlyViewedIds()
                    .filter(id => id !== currentProductId) // Exclude current product
                    .slice(0, 6); // Show max 6 items
                
                if (viewedIds.length === 0) {
                    setLoading(false);
                    return;
                }

                // Fetch product details for each ID
                const productPromises = viewedIds.map(id => 
                    productAPI.getProductById(id).catch(() => null)
                );
                
                const fetchedProducts = await Promise.all(productPromises);
                const validProducts = fetchedProducts.filter((p): p is SareeProduct => p !== null);
                
                setProducts(validProducts);
            } catch (error) {
                console.error('Error fetching recently viewed products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentlyViewed();
    }, [currentProductId]);

    const handleWishlistToggle = (product: SareeProduct, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isProductInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const calculateDiscount = (_originalPrice: number, discountPercent?: number) => {
        if (!discountPercent || discountPercent <= 0) return 0;
        return discountPercent;
    };

    if (loading) {
        return (
            <section className="mt-16 pt-12 border-t border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <Eye className="text-maroon-600" size={24} />
                    Recently Viewed
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null; // Don't show section if no recently viewed products
    }

    return (
        <section className="mt-16 pt-12 border-t border-gray-100 recently-viewed">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Eye className="text-maroon-600" size={24} />
                    Recently Viewed
                </h2>
                <Link 
                    to="/products" 
                    className="text-maroon-600 hover:text-maroon-700 font-medium text-sm flex items-center gap-1"
                >
                    View All Products →
                </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {products.map((product) => {
                    const discount = calculateDiscount(product.price, product.discount);
                    const displayPrice = discount > 0 
                        ? Math.round(product.price - (product.price * discount / 100))
                        : product.price;
                    
                    return (
                        <Link 
                            key={product.id} 
                            to={`/product/${product.id}`}
                            className="group"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                                <img 
                                    src={product.imageUrl || '/sarees/placeholder.jpg'} 
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                
                                {/* Discount Badge */}
                                {discount > 0 && (
                                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                        {discount}% OFF
                                    </span>
                                )}
                                
                                {/* Wishlist Button */}
                                <button
                                    onClick={(e) => handleWishlistToggle(product, e)}
                                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                        isProductInWishlist(product.id)
                                            ? 'bg-red-500 text-white'
                                            : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                                    }`}
                                >
                                    <Heart size={16} fill={isProductInWishlist(product.id) ? 'currentColor' : 'none'} />
                                </button>
                                
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            
                            <div className="mt-3">
                                <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-maroon-600 transition-colors">
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm font-bold text-gray-900">
                                        ₹{displayPrice.toLocaleString()}
                                    </span>
                                    {discount > 0 && (
                                        <span className="text-xs text-gray-400 line-through">
                                            ₹{product.price.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default RecentlyViewed;
