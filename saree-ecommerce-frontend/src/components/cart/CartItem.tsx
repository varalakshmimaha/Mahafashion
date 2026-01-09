import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
    const [isUpdating, setIsLoading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    
    const { removeFromCart, updateQuantity } = useCart();
    const { addNotification } = useNotification();

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

    const itemSubtotal = item.product.price * item.quantity;
    const stockAvailable = item.product.stockQuantity || 999;
    const isAtMaxStock = item.quantity >= stockAvailable;

  return (
    <div className="flex gap-4 sm:gap-6 group relative">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-xl w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-40 flex-shrink-0 bg-gray-100">
        <Link to={`/product/${item.product.id}`}>
            <img 
            src={item.product.imageUrl || '/placeholder-saree.jpg'}
            alt={item.product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-saree.jpg';
            }}
            />
        </Link>
      </div>
      
      {/* Product Details */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Header: Name + Remove Button */}
        <div className="flex justify-between items-start gap-2">
            <Link to={`/product/${item.product.id}`} className="block min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 hover:text-maroon-700 transition-colors line-clamp-2">
                    {item.product.name}
                </h3>
            </Link>
            <button 
                onClick={handleRemoveItem}
                disabled={isRemoving}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all p-1.5 rounded-full flex-shrink-0"
                title="Remove Item"
            >
                <X size={18} />
            </button>
        </div>
        
        {/* Options: Color, Size & Blouse */}
        <div className="mt-1 sm:mt-2">
            <p className="text-sm text-gray-500 flex flex-wrap gap-x-2">
                {item.selectedColor && (
                    <span>Color: <span className="text-gray-700">{item.selectedColor}</span></span>
                )}
                {item.selectedSize && (
                    <>
                        {item.selectedColor && <span>|</span>}
                        <span>Size: <span className="text-gray-700">{item.selectedSize}</span></span>
                    </>
                )}
                {item.blouseOption && (
                    <>
                        {(item.selectedColor || item.selectedSize) && <span>|</span>}
                        <span>Blouse: <span className="text-gray-700 capitalize">{item.blouseOption}</span></span>
                    </>
                )}
                {!item.selectedColor && !item.selectedSize && !item.blouseOption && item.product.fabric && (
                    <span>Fabric: <span className="text-gray-700">{item.product.fabric}</span></span>
                )}
            </p>
            {stockAvailable < 10 && (
                <p className="text-xs text-orange-600 mt-1">Only {stockAvailable} left in stock</p>
            )}
        </div>

        {/* Price, Quantity & Subtotal */}
        <div className="mt-auto pt-3 sm:pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Price per unit */}
                <span className="text-base sm:text-lg font-bold text-gray-900">
                    ₹{item.product.price.toLocaleString()}
                </span>
                
                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button 
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-maroon-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1 || isUpdating}
                        title={item.quantity <= 1 ? 'Minimum quantity is 1' : 'Decrease quantity'}
                    >
                        <Minus size={14} />
                    </button>
                    <span className="w-8 sm:w-10 text-center font-semibold text-gray-900 text-sm">
                        {item.quantity}
                    </span>
                    <button 
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-maroon-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={isUpdating || isAtMaxStock}
                        title={isAtMaxStock ? `Maximum stock (${stockAvailable}) reached` : 'Increase quantity'}
                    >
                        <Plus size={14} />
                    </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                    <p className="text-xs text-gray-400">Subtotal</p>
                    <p className="text-base sm:text-lg font-bold text-maroon-700">
                        ₹{itemSubtotal.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;