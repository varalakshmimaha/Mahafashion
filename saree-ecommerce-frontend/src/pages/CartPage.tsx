
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft, Package } from 'lucide-react';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';

const CartPage = () => {
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="bg-gray-50 min-h-screen pb-24 md:pb-12">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10 md:relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    {/* Breadcrumb - hidden on mobile */}
                    <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Link to="/" className="hover:text-maroon-700 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-maroon-900 font-medium">Shopping Bag</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <ShoppingBag className="text-maroon-600 hidden sm:block" size={28} />
                                SHOPPING BAG
                                <span className="text-maroon-600">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                            </h1>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/products')}
                            className="hidden sm:inline-flex gap-2 text-sm pl-0 hover:bg-transparent"
                        >
                            <ArrowLeft size={16} />
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto">
                        <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package size={40} />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Your bag is empty</h2>
                        <p className="text-gray-500 mb-8 text-sm sm:text-base">
                            Looks like you haven't added any sarees yet.
                            Explore our beautiful collections!
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => navigate('/products')}
                            className="gap-2"
                        >
                            Start Shopping
                            <ArrowRight size={18} />
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* Cart Items List */}
                        <div className="lg:w-2/3">
                            <div className="bg-white rounded-2xl overflow-hidden">
                                <div className="divide-y divide-gray-100">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="p-4 sm:p-5 lg:p-6">
                                            <CartItem item={item} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Continue Shopping - Mobile */}
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/products')}
                                className="mt-4 flex sm:hidden w-full justify-center gap-2 py-3 text-sm hover:bg-gray-50"
                            >
                                <ArrowLeft size={16} />
                                Continue Shopping
                            </Button>

                            {/* Why Shop With Us - Desktop */}
                            <div className="hidden lg:block mt-6 bg-white rounded-2xl p-6">
                                <h4 className="font-bold text-gray-900 mb-4">Why Shop With Suwish?</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-3">
                                        <span className="text-2xl mb-2 block">✨</span>
                                        <p className="text-xs text-gray-600 font-medium">Authentic Handcrafted</p>
                                    </div>
                                    <div className="text-center p-3">
                                        <span className="text-2xl mb-2 block">🔒</span>
                                        <p className="text-xs text-gray-600 font-medium">Secure Payments</p>
                                    </div>
                                    <div className="text-center p-3">
                                        <span className="text-2xl mb-2 block">🚚</span>
                                        <p className="text-xs text-gray-600 font-medium">Free Shipping ₹999+</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary - Sticky on Desktop */}
                        <div className="lg:w-1/3">
                            <div className="lg:sticky lg:top-24">
                                <CartSummary />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;

