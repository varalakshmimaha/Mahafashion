import React, { useMemo } from 'react';
import { SareeProduct } from '../../types';
import { Award, ShieldCheck, Truck, Star } from 'lucide-react';

interface ProductInfoProps {
  product: SareeProduct;
  selectedSize?: string;
  selectedColor?: string;
  onScrollToReviews?: () => void;
}

// Star Rating Component
const StarRating: React.FC<{ rating: number; maxRating?: number; size?: number }> = ({ 
  rating, 
  maxRating = 5, 
  size = 16 
}) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(maxRating)].map((_, index) => {
        const fillPercentage = Math.min(100, Math.max(0, (rating - index) * 100));
        return (
          <div key={index} className="relative" style={{ width: size, height: size }}>
            {/* Empty star (background) */}
            <Star 
              size={size} 
              className="text-gray-300"
              fill="currentColor"
            />
            {/* Filled star (foreground with clip) */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star 
                size={size} 
                className="text-yellow-400"
                fill="currentColor"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ProductInfo: React.FC<ProductInfoProps> = ({ product, selectedSize, selectedColor, onScrollToReviews }) => {
  // Calculate discounted price
  const calculateDiscountedPrice = (price: number, discount: number) => {
    return Math.round(price - (price * discount / 100));
  };

  // Get price adjustment from selected variant
  const priceAdjustment = useMemo(() => {
    if (product.variants && selectedColor && selectedSize) {
      const variant = product.variants.find(
        v => v.color_code === selectedColor && v.size === selectedSize
      );
      return variant?.price_adjustment || 0;
    }
    return 0;
  }, [product.variants, selectedColor, selectedSize]);

  const basePrice = product.price + priceAdjustment;
  const discountedPrice = product.discount && product.discount > 0 
    ? calculateDiscountedPrice(basePrice, product.discount) 
    : basePrice;

  // Mock rating data (in real app, this would come from product API)
  const rating = product.rating || 4.5;
  const reviewCount = product.reviewCount || 124;

  return (
    <div className="product-info">
      {/* Brand */}
      <div className="mb-2">
        <span className="text-maroon-600 font-bold tracking-widest text-sm uppercase">Maha Signature</span>
      </div>

      {/* Product Name */}
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
      
      {/* Rating and Reviews */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <StarRating rating={rating} size={18} />
          <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
        </div>
        <span className="text-gray-300">|</span>
        <button 
          onClick={onScrollToReviews}
          className="text-sm text-maroon-600 hover:text-maroon-700 hover:underline transition-colors"
        >
          {reviewCount} Reviews
        </button>
        <span className="text-gray-300">|</span>
        <span className="text-sm text-green-600 font-medium">In Stock</span>
      </div>
      
      {/* Product Price Section */}
      <div className="bg-maroon-50/50 p-6 rounded-3xl mb-8 border border-maroon-100/50 relative overflow-hidden">
        {product.discount && product.discount > 0 ? (
          <div>
            <div className="flex items-end gap-3 mb-1">
              <p className="text-4xl font-bold text-maroon-950">
                ₹{discountedPrice.toLocaleString()}
              </p>
              <p className="text-xl text-gray-400 line-through pb-1">
                ₹{basePrice.toLocaleString()}
              </p>
              <span className="text-xs bg-maroon-600 text-white font-bold px-3 py-1 rounded-full mb-2 ml-2 tracking-wider">
                {product.discount}% OFF
              </span>
            </div>
            <p className="text-sm text-green-700 font-semibold flex items-center gap-1 mt-2">
              <span className="inline-block w-4 h-4 bg-green-100 rounded-full text-[10px] flex items-center justify-center">i</span>
              Special Promotional Offer: You save ₹{(product.price - discountedPrice).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-4xl font-bold text-maroon-950">
            ₹{product.price.toLocaleString()}
          </p>
        )}
      </div>
      
      {/* Short Features */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-maroon-50 flex items-center justify-center text-maroon-600">
                <Award size={20} />
            </div>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-tighter">Handcrafted Quality</span>
        </div>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-maroon-50 flex items-center justify-center text-maroon-600">
                <ShieldCheck size={20} />
            </div>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-tighter">Authentic Silk</span>
        </div>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-maroon-50 flex items-center justify-center text-maroon-600">
                <Truck size={20} />
            </div>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-tighter">Fast Delivery</span>
        </div>
      </div>

      {/* Product Description */}
      <div className="border-t border-maroon-100 pt-8 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-maroon-600 rounded-full"></span>
            About this Masterpiece
        </h3>
        <p className="text-gray-600 leading-relaxed italic">{product.description}</p>
      </div>

      {/* Fabric Tag */}
      {product.fabric && (
        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gray-50 rounded-2xl border border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fabric</span>
          <span className="h-4 w-px bg-gray-200"></span>
          <span className="text-sm font-bold text-maroon-900">{product.fabric}</span>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;