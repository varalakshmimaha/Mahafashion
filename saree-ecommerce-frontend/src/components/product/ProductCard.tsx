import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SareeProduct } from '../../types';
import { FiHeart, FiShoppingCart, FiEye, FiX } from 'react-icons/fi';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';

interface ProductCardProps {
  product: SareeProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  
  const { toggleWishlist, isProductInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addNotification } = useNotification();

  const inWishlist = isProductInWishlist(product.id);

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlistLoading) return;
    
    setIsWishlistLoading(true);
    try {
      const result = await toggleWishlist(product);
      addNotification(result.message, 'success');
    } catch (error) {
      addNotification('Failed to update wishlist', 'error');
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCartLoading) return;
    
    setIsCartLoading(true);
    try {
      const message = await addToCart(product, 1);
      addNotification(message, 'success');
    } catch (error) {
      addNotification('Failed to add to cart', 'error');
    } finally {
      setIsCartLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const getImageUrl = () => {
    return product.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=500&auto=format&fit=crop';
  };

  // Handle double click to navigate to product details
  const handleDoubleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const calculateOriginalPrice = () => {
    if (product.discount && product.discount > 0) {
      return Math.round(product.price / (1 - product.discount / 100));
    }
    return null;
  };

  const originalPrice = calculateOriginalPrice();

  return (
    <>
      <div 
        className="group relative bg-white overflow-hidden transition-all duration-300 flex flex-col h-full"
        onDoubleClick={handleDoubleClick}
      >
        {/* Product Image Wrapper */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          <img
            src={getImageUrl()}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=500&auto=format&fit=crop';
            }}
          />
          
          {/* Badge (Optional: if new or sale) */}
          {product.discount && product.discount > 0 && (
            <div className="absolute top-3 left-3 bg-accent text-white text-[10px] font-bold px-2 py-1 uppercase tracking-tight z-10 rounded">
              {product.discount}% OFF
            </div>
          )}

          {/* Wishlist Button (Always visible on hover, but nicely styled) */}
          <button
            onClick={handleWishlistClick}
            disabled={isWishlistLoading}
            className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg transition-all duration-300 z-10 translate-x-12 group-hover:translate-x-0 ${
              inWishlist 
                ? 'bg-accent text-white' 
                : 'bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-accent hover:text-white'
            } ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FiHeart 
              size={18} 
              className={inWishlist ? 'fill-current' : ''} 
            />
          </button>

          {/* Quick View Button - appears on hover from below */}
          <button
            onClick={handleQuickView}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-widest shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10 hover:bg-primary hover:text-white flex items-center gap-2 whitespace-nowrap rounded"
          >
            <FiEye size={14} />
            Quick View
          </button>

          {/* Add to Cart - Full width button at bottom of image on hover */}
          <button
            onClick={handleAddToCart}
            disabled={isCartLoading}
            className={`absolute bottom-0 left-0 right-0 w-full py-4 bg-primary text-white font-bold uppercase tracking-widest text-xs opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10 flex items-center justify-center gap-2 hover:bg-primary-dark ${
              isCartLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <FiShoppingCart size={16} />
            {isCartLoading ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          <Link to={`/product/${product.id}`} className="mb-2">
            <h3 className="text-sm font-bold text-gray-800 line-clamp-2 hover:text-primary transition-colors duration-200 min-h-[40px]">
              {product.name}
            </h3>
          </Link>
          
          <div className="mt-auto">
            {/* Price section */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-primary">₹{product.price?.toLocaleString()}</span>
              {originalPrice && (
                <span className="text-sm text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
              )}
            </div>

            {/* Stars and Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-sm ${i < (product.rating || 5) ? 'fill-current' : 'text-gray-200'}`}>⭐</span>
                ))}
              </div>
              {product.reviewCount !== undefined && (
                <span className="text-[10px] text-gray-400 font-medium">({product.reviewCount} Reviews)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
};

interface QuickViewModalProps {
  product: SareeProduct;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isProductInWishlist } = useWishlist();
  const { addNotification } = useNotification();
  
  const inWishlist = isProductInWishlist(product.id);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const message = await addToCart(product, quantity);
      addNotification(message, 'success');
      onClose();
    } catch (error) {
      addNotification('Failed to add to cart', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    try {
      const result = await toggleWishlist(product);
      addNotification(result.message, 'success');
    } catch (error) {
      addNotification('Failed to update wishlist', 'error');
    }
  };

  const getImageUrl = () => {
    return product.imageUrl || '/placeholder-saree.jpg';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div 
        className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10"
        >
          <FiX size={24} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Product Image */}
          <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={getImageUrl()}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-saree.jpg';
              }}
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 uppercase tracking-wide mb-2">
              {product.fabric || 'Silk'}
            </span>
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">
              {product.name}
            </h2>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-semibold text-gray-900">
                ₹{product.price?.toLocaleString()}
              </span>
              {product.rating && (
                <div className="flex items-center text-sm">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span>{product.rating}</span>
                  {product.reviewCount && (
                    <span className="text-gray-400 ml-1">({product.reviewCount} reviews)</span>
                  )}
                </div>
              )}
            </div>

            <p className="text-gray-600 mb-6 line-clamp-3">
              {product.description || 'A beautiful handcrafted saree perfect for any occasion.'}
            </p>

            {/* Color */}
            {product.color && (
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">Color: </span>
                <span className="text-sm text-gray-600">{product.color}</span>
              </div>
            )}

            {/* Occasion */}
            {product.occasion && (
              <div className="mb-6">
                <span className="text-sm font-medium text-gray-700">Occasion: </span>
                <span className="text-sm text-gray-600">{product.occasion}</span>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FiShoppingCart size={18} />
                {isLoading ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`p-3 rounded-md transition-colors ${
                  inWishlist 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-red-300 hover:text-red-500'
                }`}
              >
                <FiHeart size={18} className={inWishlist ? 'fill-current' : ''} />
              </button>
            </div>

            {/* View Full Details Link */}
            <Link
              to={`/product/${product.id}`}
              className="text-center text-sm text-gray-500 hover:text-gray-700 mt-4 underline"
              onClick={onClose}
            >
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
