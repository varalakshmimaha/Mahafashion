import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Zap, Plus, Minus, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { SareeProduct } from '../../types';
import Button from '../ui/Button';

interface AddToCartProps {
    product: SareeProduct;
    selectedColor?: string;
    selectedSize?: string;
    blouseOption?: string;
}

const AddToCart: React.FC<AddToCartProps> = ({
    product,
    selectedColor = '',
    selectedSize = '',
    blouseOption = ''
}) => {
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);

    const { addToCart } = useCart();
    const { addNotification } = useNotification();
    const navigate = useNavigate();

    // Check if the selected variant has sufficient stock
    const canAddToCart = () => {
        if (product.variants && product.variants.length > 0) {
            if (!selectedColor || !selectedSize) {
                return false;
            }

            const variant = product.variants.find(
                v => v.color_code === selectedColor && v.size === selectedSize
            );

            return variant && variant.stock >= quantity;
        }

        // Legacy product without variants
        return true;
    };

    // Helper to get the correct price based on selection
    const getPrice = (): number => {
        if (product.variants && product.variants.length > 0) {
            const variant = product.variants.find(
                v => v.color_code === selectedColor && v.size === selectedSize
            );
            return variant?.price || product.final_price || product.price;
        }
        return product.final_price || product.price;
    };

    const handleAddToCart = async () => {
        if (isAddingToCart) return;

        if (!canAddToCart()) {
            addNotification('Please select a color and size, or insufficient stock', 'error');
            return;
        }

        setIsAddingToCart(true);
        try {
            const price = getPrice();
            const message = await addToCart(product, quantity, selectedColor, blouseOption, selectedSize, price);
            addNotification(message, 'success');
        } catch (error) {
            addNotification('Failed to add to cart', 'error');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        if (isBuyingNow) return;

        if (!canAddToCart()) {
            addNotification('Please select a color and size, or insufficient stock', 'error');
            return;
        }

        setIsBuyingNow(true);
        try {
            const price = getPrice();
            await addToCart(product, quantity, selectedColor, blouseOption, selectedSize, price);
            navigate('/checkout');
        } catch (error) {
            addNotification('Failed to process. Please try again.', 'error');
        } finally {
            setIsBuyingNow(false);
        }
    };

    return (
        <div className="product-actions mt-10 space-y-8">
            {/* Quantity Selector */}
            <div className="flex items-center gap-6">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Quantity</span>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl p-1 shadow-sm">
                    <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-white hover:text-primary rounded-xl transition-all disabled:opacity-30"
                        disabled={quantity <= 1}
                    >
                        <Minus size={18} />
                    </button>
                    <span className="w-14 text-center text-lg font-bold text-gray-900">{quantity}</span>
                    <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-white hover:text-primary rounded-xl transition-all"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    variant="primary"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex-1"
                >
                    {isAddingToCart ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <ShoppingBag size={20} />
                            Add to Cart
                        </>
                    )}
                </Button>
                <Button
                    variant="primary"
                    onClick={handleBuyNow}
                    disabled={isBuyingNow}
                    className="flex-1 shadow-md relative overflow-hidden group"
                >
                    <div className="absolute inset-0 z-0 pointer-events-none bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative z-10 flex items-center gap-2 drop-shadow">
                        {isBuyingNow ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Zap size={20} fill="currentColor" />
                                Buy It Now
                            </>
                        )}
                    </span>
                </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 gap-3 pt-6 border-t border-maroon-50">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle size={18} className="text-green-600 shrink-0" />
                    <span>Free Pan-India shipping on all luxury orders above ₹5,000</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle size={18} className="text-green-600 shrink-0" />
                    <span>Hassle-free 7-day returns for unworn pieces</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle size={18} className="text-green-600 shrink-0" />
                    <span>Secure doorstep delivery & Cash on Delivery available</span>
                </div>
            </div>
        </div>
    );
};

export default AddToCart;
