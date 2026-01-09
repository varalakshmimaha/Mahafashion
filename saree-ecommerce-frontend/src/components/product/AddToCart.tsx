import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Zap, Plus, Minus, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { SareeProduct } from '../../types';

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

    const handleAddToCart = async () => {
        if (isAddingToCart) return;
        
        if (!canAddToCart()) {
            addNotification('Please select a color and size, or insufficient stock', 'error');
            return;
        }
        
        setIsAddingToCart(true);
        try {
            const message = await addToCart(product, quantity, selectedColor, blouseOption, selectedSize);
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
            await addToCart(product, quantity, selectedColor, blouseOption, selectedSize);
            navigate('/checkout');
        } catch (error) {
            addNotification('Failed to process. Please try again.', 'error');
        } finally {
            setIsBuyingNow(false);
        }
    };

    return (
        <div className="mt-10 space-y-8">
            {/* Quantity Selector */}
            <div className="flex items-center gap-6">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Quantity</span>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl p-1 shadow-sm">
                    <button 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-white hover:text-maroon-600 rounded-xl transition-all disabled:opacity-30"
                        disabled={quantity <= 1}
                    >
                        <Minus size={18} />
                    </button>
                    <span className="w-14 text-center text-lg font-bold text-gray-900">{quantity}</span>
                    <button 
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-white hover:text-maroon-600 rounded-xl transition-all"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button 
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex-1 flex items-center justify-center gap-3 py-5 bg-white border-2 border-maroon-900 text-maroon-900 rounded-2xl font-bold hover:bg-maroon-50 transition-all disabled:opacity-50"
                >
                    {isAddingToCart ? (
                        <div className="w-5 h-5 border-2 border-maroon-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <ShoppingBag size={20} />
                            Add to Bag
                        </>
                    )}
                </button>
                <button 
                    onClick={handleBuyNow}
                    disabled={isBuyingNow}
                    className="flex-1 flex items-center justify-center gap-3 py-5 bg-maroon-900 text-white rounded-2xl font-bold hover:bg-maroon-950 transition-all shadow-lg shadow-maroon-200 disabled:opacity-50 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    {isBuyingNow ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <Zap size={20} fill="currentColor" />
                            Buy It Now
                        </>
                    )}
                </button>
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
