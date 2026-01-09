import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, Tag, X, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';

interface AppliedCoupon {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
}

// Mock coupon validation (in real app, this would be an API call)
const validateCoupon = async (code: string): Promise<AppliedCoupon | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const coupons: { [key: string]: AppliedCoupon } = {
        'WELCOME10': { code: 'WELCOME10', discount: 10, type: 'percentage' },
        'FLAT500': { code: 'FLAT500', discount: 500, type: 'fixed' },
        'SUWISH15': { code: 'SUWISH15', discount: 15, type: 'percentage' },
        'FIRST1000': { code: 'FIRST1000', discount: 1000, type: 'fixed' },
    };
    
    return coupons[code.toUpperCase()] || null;
};

const CartSummary = () => {
    const { getCartTotal, cartItems } = useCart();
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    
    const subtotal = getCartTotal();
    const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
    
    // Calculate discount
    const discountAmount = appliedCoupon
        ? appliedCoupon.type === 'percentage'
            ? Math.round(subtotal * (appliedCoupon.discount / 100))
            : appliedCoupon.discount
        : 0;
    
    const grandTotal = subtotal + shipping - discountAmount;

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            addNotification('Please enter a coupon code', 'error');
            return;
        }
        
        setIsApplyingCoupon(true);
        try {
            const coupon = await validateCoupon(couponCode);
            if (coupon) {
                setAppliedCoupon(coupon);
                setCouponCode('');
                addNotification(`Coupon "${coupon.code}" applied successfully!`, 'success');
            } else {
                addNotification('Invalid coupon code', 'error');
            }
        } catch (error) {
            addNotification('Failed to apply coupon', 'error');
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        addNotification('Coupon removed', 'info');
    };

    const handleProceedToCheckout = () => {
        if (cartItems.length > 0) {
            navigate('/checkout');
        }
    };

    return (
        <div className="space-y-4">
            {/* Coupon Code Section */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Tag size={16} className="text-maroon-600" />
                    Have a coupon?
                </h3>
                
                {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                        <div>
                            <span className="font-bold text-green-700">{appliedCoupon.code}</span>
                            <span className="text-sm text-green-600 ml-2">
                                ({appliedCoupon.type === 'percentage' ? `${appliedCoupon.discount}% off` : `₹${appliedCoupon.discount} off`})
                            </span>
                        </div>
                        <button 
                            onClick={handleRemoveCoupon}
                            className="text-green-600 hover:text-red-500 p-1 hover:bg-white rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                            placeholder="Enter code"
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-100 uppercase placeholder:normal-case"
                        />
                        <button
                            onClick={handleApplyCoupon}
                            disabled={isApplyingCoupon || !couponCode.trim()}
                            className="px-5 py-2.5 bg-maroon-600 text-white font-semibold rounded-xl hover:bg-maroon-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                        >
                            {isApplyingCoupon ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                'APPLY'
                            )}
                        </button>
                    </div>
                )}
                
                {/* Available coupons hint */}
                <p className="mt-3 text-xs text-gray-400">
                    Try: WELCOME10, FLAT500, SUWISH15
                </p>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">
                    ORDER SUMMARY
                </h2>
                
                <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Shipping</span>
                        <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            {shipping === 0 ? 'FREE' : `₹${shipping}`}
                        </span>
                    </div>

                    {discountAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span className="font-medium">-₹{discountAmount.toLocaleString()}</span>
                        </div>
                    )}
                    
                    {/* Free shipping threshold message */}
                    {subtotal > 0 && subtotal < 999 && (
                        <div className="py-2 px-3 bg-amber-50 rounded-lg text-xs text-amber-700">
                            Add <span className="font-bold">₹{(999 - subtotal).toLocaleString()}</span> more for FREE shipping!
                        </div>
                    )}
                    
                    <div className="border-t border-dashed border-gray-200 pt-4 mt-4">
                        <div className="flex justify-between items-baseline">
                            <span className="text-base font-semibold text-gray-900">TOTAL</span>
                            <span className="text-2xl font-bold text-maroon-700">₹{grandTotal.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 text-right">Inclusive of all taxes</p>
                    </div>
                </div>

                <button 
                    onClick={handleProceedToCheckout}
                    disabled={cartItems.length === 0}
                    className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-maroon-600 text-white rounded-xl font-bold hover:bg-maroon-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                    <ShoppingBag size={18} />
                    PROCEED TO CHECKOUT
                </button>

                {/* Trust badges */}
                <div className="grid grid-cols-2 gap-3 mt-5">
                    <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                        <ShieldCheck size={18} className="text-green-600" />
                        <span className="text-xs font-medium text-gray-600">Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                        <Truck size={18} className="text-blue-600" />
                        <span className="text-xs font-medium text-gray-600">Fast Delivery</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;
