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
  // Dynamic Pricing Logic based on Variant or Size
  const priceData = useMemo(() => {
    let basePrice = product.price; // Start with base price (MRP)
    let finalPrice = product.discounted_price || product.final_price || product.price;
    let discountPercentage = product.discount || 0;

    // If a variant is selected, adjust values
    if (product.variants && selectedColor && selectedSize) {
      const variant = product.variants.find(
        v => v.color_code === selectedColor && v.size === selectedSize
      );

      if (variant) {
        // Priority 1: Use variant-specific MRP, price, and discount if available
        if (variant.mrp && variant.mrp > 0) {
          basePrice = variant.mrp;

          // Check if variant has its own price (final price after discount)
          if (variant.price && variant.price > 0) {
            finalPrice = variant.price;
          }

          // Use variant-specific discount if available
          if (variant.discount !== undefined && variant.discount !== null) {
            discountPercentage = variant.discount;
            // Recalculate final price based on variant discount
            if (discountPercentage > 0 && (!variant.price || variant.price === 0)) {
              finalPrice = basePrice - (basePrice * discountPercentage / 100);
            }
          }
        }
        // Priority 2: Check if variant has size-specific price override (from admin panel)
        else if (variant.price && variant.price > 0) {
          // Variant has its own price - this is the final price for this size
          finalPrice = variant.price;
          // Calculate base price based on product's discount percentage
          if (discountPercentage > 0) {
            basePrice = finalPrice / (1 - (discountPercentage / 100));
          } else {
            basePrice = finalPrice;
          }
        }
        // Priority 3: Check for price adjustment (alternative pricing method)
        else if (variant.price_adjustment) {
          const adjustment = Number(variant.price_adjustment) || 0;
          finalPrice = (product.discounted_price || product.price) + adjustment;
          basePrice = (product.price) + adjustment;
        }
      }
    }
    // Check standalone sizes (no color variants)
    else if (product.sizes && selectedSize) {
      const productAny = product as any;
      const sizeItem = productAny.sizes.find((s: any) => s.size === selectedSize);

      if (sizeItem && sizeItem.price && sizeItem.price > 0) {
        finalPrice = sizeItem.price;
        // Calculate base price based on product's discount percentage
        if (discountPercentage > 0) {
          basePrice = finalPrice / (1 - (discountPercentage / 100));
        } else {
          basePrice = finalPrice;
        }
      }
    }

    // CRITICAL FIX: If MRP equals Selling Price but there is a discount, 
    // it means 'basePrice' is actually the Selling Price. We must REVERSE calculate the true MRP.
    // Example: Price 3499, Discount 40%. MRP should be 3499 / 0.6 = 5831.
    // Use a small epsilon for float comparison safety
    if (discountPercentage > 0 && Math.abs(basePrice - finalPrice) < 1) {
      basePrice = finalPrice / (1 - (discountPercentage / 100));
    }

    return {
      basePrice,
      finalPrice,
      discountPercentage
    };
  }, [product, selectedColor, selectedSize]);

  // Calculate stock for selected variant
  const selectedStock = useMemo(() => {
    if (product.variants && selectedColor && selectedSize) {
      const variant = product.variants.find(
        v => v.color_code === selectedColor && v.size === selectedSize
      );
      return variant?.stock ?? 0;
    }
    return product.stockQuantity || (product as any).stock_quantity || 0;
  }, [product.variants, selectedColor, selectedSize, product.stockQuantity, (product as any).stock_quantity]);

  // Only show rating/review if > 0
  const rating = product.rating && product.rating > 0 ? product.rating : null;
  const reviewCount = product.reviewCount && product.reviewCount > 0 ? product.reviewCount : null;

  return (
    <div className="product-info">
      {/* Product Name */}
      <h1 className="text-3xl md:text-3xl font-serif font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>

      {/* Short Description (Using line-clamped description as fallback) */}
      <p className="text-gray-500 text-sm md:text-base mb-4 line-clamp-2">
        {product.description}
      </p>

      {/* Rating and Reviews */}
      {(rating || reviewCount) && (
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {rating && (
            <div className="flex items-center gap-2">
              <StarRating rating={rating} size={18} />
              <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
            </div>
          )}
          {rating && reviewCount && <span className="text-gray-300">|</span>}
          {reviewCount && (
            <button
              onClick={onScrollToReviews}
              className="text-sm text-maroon-600 hover:text-maroon-700 hover:underline transition-colors"
            >
              {reviewCount} Reviews
            </button>
          )}
        </div>
      )}

      {/* Product Price Section */}
      <div className="mb-8">
        <div className="space-y-1">
          {priceData.discountPercentage > 0 ? (
            <>
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold text-gray-900">
                  ₹{Math.round(priceData.finalPrice).toLocaleString()}
                </p>
                <p className="text-lg font-medium text-gray-400 line-through">
                  MRP ₹{Math.round(priceData.basePrice).toLocaleString()}
                </p>
                <span className="text-lg font-bold text-orange-500">
                  ({priceData.discountPercentage}% OFF)
                </span>
              </div>
              <p className="text-sm text-green-700 font-semibold">
                You Save: ₹{Math.round(priceData.basePrice - priceData.finalPrice).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Price inclusive of all taxes</p>
            </>
          ) : (
            <div className="flex items-baseline gap-4">
              <p className="text-3xl font-bold text-gray-900">
                ₹{Math.round(priceData.finalPrice).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 self-end">Price inclusive of all taxes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;