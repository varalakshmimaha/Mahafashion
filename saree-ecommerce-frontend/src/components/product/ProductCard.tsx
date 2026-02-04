import React from 'react';
import { Heart, Share2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SareeProduct } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { API_STORAGE_URL } from '../../services/api';

interface ProductCardProps {
  product: SareeProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart, isProductInCart } = useCart();
  const { addNotification } = useNotification();

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this beautiful ${product.name}!`,
          url: window.location.origin + `/product/${product.id}`,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.origin + `/product/${product.id}`);
      alert('Link copied to clipboard!');
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const result = await addToCart(product, 1); // Add 1 quantity by default
      addNotification(result, 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      addNotification('Failed to add product to cart', 'error');
    }
  };

  // Compute image source with sensible fallbacks
  const getImageSrc = () => {
    // Prefer images array from API
    if (product.images && product.images.length > 0) {
      const img: any = product.images[0];
      const path = img.image_url || img.url || img.path || (img as any).imageUrl;
      if (path) return `${API_STORAGE_URL}/${path}`;
    }

    // Fallback to single image fields
    if ((product as any).image_url) return `${API_STORAGE_URL}/${(product as any).image_url}`;
    if ((product as any).imageUrl) {
      // If imageUrl is already an absolute URL, use it directly
      return (product as any).imageUrl.startsWith('http')
        ? (product as any).imageUrl
        : `${API_STORAGE_URL}/${(product as any).imageUrl}`;
    }

    return '/placeholder-saree.jpg';
  };

  // Normalize category name and avoid rendering meaningless zero values
  const categoryName = (() => {
    if (!product.category) return null;
    const name = typeof product.category === 'object' ? product.category.name : product.category;
    if (name === null || name === undefined) return null;
    // hide numeric zero or empty string values
    if (name === 0 || name === '0' || String(name).trim() === '') return null;
    return name;
  })();

  return (
    <div className="relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={getImageSrc()}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-saree.jpg';
            }}
          />
        </Link>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleWishlistToggle}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${isInWishlist(product.id)
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-red-500'
              }`}
            title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white text-gray-600 hover:bg-gray-50 hover:text-maroon-600 flex items-center justify-center shadow-lg transition-all"
            title="Share"
          >
            <Share2 size={16} />
          </button>
        </div>

        {/* Discount Badge */}
        {product.discount && product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-dark transition-colors">
            {product.name}
          </h3>

          <div className="mt-2 flex items-center gap-2">
            {product.discount && product.discount > 0 ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  ₹{(product.final_price || Math.round(product.price * (1 - product.discount / 100))).toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.price?.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
            )}
          </div>

          {categoryName && (
            <p className="text-sm text-gray-500 mt-1">
              {categoryName}
            </p>
          )}

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating!) ? 'fill-current' : 'text-gray-300'}`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              {product.reviewCount > 0 && (
                <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
              )}
            </div>
          )}
        </Link>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          style={{ backgroundColor: 'var(--color-button)', color: '#ffffff' }}
          className="mt-4 w-full rounded-lg flex items-center justify-center gap-2 transition-colors hover:opacity-90 py-2 px-4 shadow-sm"
        >
          <ShoppingCart size={18} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;