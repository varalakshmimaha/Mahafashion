import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { API_STORAGE_URL } from '../../services/api';
import getImageUrl, { PLACEHOLDER_DATA_URI } from '../../utils/getImageUrl';

interface CartItemProps {
    item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
    const [isUpdating, setIsLoading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const { removeFromCart, updateQuantity } = useCart();
    const { addNotification } = useNotification();

    // Safety check: if product is missing, render nothing or a placeholder
    // This prevents "Cannot read properties of undefined (reading 'name')" crashes
    if (!item || !item.product) {
        return null;
    }

    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity < 1) return;

        if (isUpdating) return;

        setIsLoading(true);
        try {
            await updateQuantity(item.id, newQuantity);
        } catch (error) {
            addNotification('Failed to update quantity', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveItem = async () => {
        if (isRemoving) return;

        setIsRemoving(true);
        try {
            await removeFromCart(item.id);
            addNotification('Item removed from cart', 'success');
        } catch (error) {
            addNotification('Failed to remove item', 'error');
            setIsRemoving(false);
        }
    };

    function calculateDiscountedPrice(price: number, discount: number) {
        return Math.round((price || 0) * (1 - (discount || 0) / 100));
    }

    // Determine the effective price based on selected size/variant
    // 1. Prefer stored price (from cart DB/storage) if available - fixes discount/variant pricing issues
    // 2. Fallback to calculating from product price + variants
    let basePrice = item.price || item.product.price;
    let finalPrice = item.price
        ? item.price
        : (item.product.final_price || calculateDiscountedPrice(item.product.price, item.product.discount || 0));

    // If NO stored price, and size is selected, check for size-specific price in variants
    if (!item.price && item.selectedSize && item.product.variants && item.product.variants.length > 0) {
        // Find variant matching size AND color (if color is selected), or just size (for standalone sizes)
        const relevantVariant = item.product.variants.find(v =>
            v.size === item.selectedSize &&
            (!item.selectedColor || !v.color_code || v.color_code === '#' || v.color_code === item.selectedColor || v.color_name === item.selectedColor)
        );

        if (relevantVariant && relevantVariant.price && relevantVariant.price > 0) {
            basePrice = relevantVariant.price;
            // Recalculate final price with discount applied to the VARIANT price
            finalPrice = calculateDiscountedPrice(basePrice, item.product.discount || 0);
        }
    }

    const itemPrice = finalPrice;
    const itemSubtotal = itemPrice * item.quantity;
    const stockAvailable = item.product.stockQuantity || 999;
    const isAtMaxStock = item.quantity >= stockAvailable;



    // Determine correct image based on selected color variant
    let displayImageUrl = getImageUrl(item);
    if (item.selectedColor && item.product.variants && item.product.variants.length > 0) {
        // Find variant matching specific color
        const colorVariant = item.product.variants.find(v =>
            v.color_code === item.selectedColor || v.color_name === item.selectedColor
        );

        if (colorVariant && colorVariant.images && colorVariant.images.length > 0) {
            // Use the first image from the variant
            displayImageUrl = colorVariant.images[0];
        }
    }

    return (
        <div className="flex gap-4 md:gap-5 p-4 md:p-5 border border-gray-200 rounded-xl items-center bg-white shadow-sm hover:shadow-md transition-shadow">
            {/* Image Column */}
            <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] flex-shrink-0">
                <Link to={`/product/${item.product.id}`}>
                    <img
                        src={displayImageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg border border-gray-100"
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_DATA_URI; }}
                    />
                </Link>
            </div>

            {/* Info Column */}
            <div className="flex-1 min-w-0 pr-2">
                <Link to={`/product/${item.product.id}`} className="block mb-2">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 truncate hover:text-maroon-700 transition-colors" title={item.product.name}>
                        {item.product.name}
                    </h3>
                </Link>

                {/* Variant Info */}
                {(item.selectedColor || item.selectedSize || item.blouseOption) && (
                    <div className="text-xs text-gray-500 mb-3 flex flex-wrap gap-2">
                        {item.selectedColor && <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">Size: {item.selectedSize}</span>}
                        {item.blouseOption && <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">Blouse: {item.blouseOption}</span>}
                    </div>
                )}

                {/* Price Row */}
                <div className="flex items-baseline gap-2 md:gap-3 flex-wrap">
                    <span className="text-lg md:text-xl font-extrabold text-gray-900">
                        ₹{itemPrice.toLocaleString()}
                    </span>
                    {(item.product.discount && item.product.discount > 0) || (item.product.price > itemPrice) ? (
                        <>
                            <span className="text-sm text-gray-400 line-through">
                                ₹{item.product.price.toLocaleString()}
                            </span>
                            <span className="text-xs md:text-sm text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">
                                Save ₹{(item.product.price - itemPrice).toLocaleString()}
                                {item.product.discount ? ` (${item.product.discount}%)` : ''}
                            </span>
                        </>
                    ) : null}
                </div>

                {stockAvailable < 10 && (
                    <p className="text-[10px] sm:text-xs text-orange-600 font-medium mt-1">Only {stockAvailable} left</p>
                )}
            </div>

            {/* Actions Column */}
            <div className="flex flex-col items-end gap-3 md:gap-4 flex-shrink-0">
                <button
                    onClick={handleRemoveItem}
                    disabled={isRemoving}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Remove Item"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 border border-gray-200 px-3 py-1.5 rounded-lg bg-gray-50">
                    <button
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                        className="text-gray-500 hover:text-maroon-700 disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1 || isUpdating}
                    >
                        <Minus size={16} />
                    </button>
                    <span className="text-sm font-bold text-gray-900 w-4 text-center">{item.quantity}</span>
                    <button
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                        className="text-gray-500 hover:text-maroon-700 disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={isUpdating || isAtMaxStock}
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">Item Total</p>
                    <p className="text-sm md:text-base font-bold text-gray-900">
                        ₹{(itemPrice * item.quantity).toFixed(0)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartItem;