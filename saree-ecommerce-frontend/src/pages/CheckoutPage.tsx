import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { paymentAPI, orderAPI } from '../services/api';
import { 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  ChevronRight, 
  CheckCircle, 
  ShieldCheck, 
  Truck, 
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  Lock,
  Phone,
  Mail,
  User,
  Home
} from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotification();

  const [currentStep, setCurrentStep] = useState(1);
  const [isGuestCheckout, setIsGuestCheckout] = useState(!isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home'
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0 && currentStep === 1) {
      const timer = setTimeout(() => {
        if (cartItems.length === 0) navigate('/cart');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [cartItems, navigate, currentStep]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const calculateShipping = () => {
    const total = getCartTotal();
    return total > 1000 ? 0 : 99;
  };

  const calculateTotal = () => {
    return getCartTotal() + calculateShipping();
  };

  const handlePayment = async () => {
    console.log('=== CHECKOUT DEBUG ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);
    console.log('cartItems:', cartItems);
    console.log('authToken:', localStorage.getItem('authToken'));
    
    if (!isAuthenticated) {
      addNotification('Please login to place your order', 'error');
      navigate('/login?redirect=checkout');
      return;
    }

    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.pincode) {
      addNotification('Please fill in all required shipping details (Name, Phone, Address, Pincode)', 'error');
      return;
    }
    
    if (cartItems.length === 0) {
      addNotification('Your cart is empty', 'error');
      return;
    }

    const formattedAddress = {
      name: shippingAddress.fullName,
      email: shippingAddress.email,
      street: shippingAddress.address,
      city: shippingAddress.city,
      state: shippingAddress.state,
      zip: shippingAddress.pincode,
      phone: shippingAddress.phone
    };

    setLoading(true);

    try {
      if (paymentMethod === 'cod') {
        const orderData: any = {
          shipping_address: formattedAddress,
          payment_method: 'cod',
          // Always send cart_items as fallback in case cart_item_ids don't match
          cart_items: cartItems.map(item => ({
            product_id: Number(item.product.id),
            quantity: item.quantity,
            selected_color: item.selectedColor || null,
            blouse_option: item.blouseOption || null
          }))
        };
        
        // Also send cart_item_ids if authenticated user with valid IDs
        if (isAuthenticated && cartItems.length > 0 && cartItems[0].id) {
          const cartItemIds = cartItems.map(item => Number(item.id)).filter(id => !isNaN(id) && id > 0);
          if (cartItemIds.length > 0) {
            orderData.cart_item_ids = cartItemIds;
          }
        }
        
        console.log('✓ COD Order Payload:', JSON.stringify(orderData, null, 2));
        const response = await orderAPI.createOrder(orderData);
        console.log('✓ COD Order Response:', response);
        
        addNotification('Order placed successfully via COD!', 'success');
        clearCart();
        navigate('/orders');
      } else if (paymentMethod === 'razorpay') {
        if (!razorpayLoaded) {
          addNotification('Razorpay SDK failed to load. Please refresh.', 'error');
          setLoading(false);
          return;
        }

        const orderData = await paymentAPI.createOrder(calculateTotal(), 'INR', formattedAddress);

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_placeholder',
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Maha Fashion',
          description: 'Fashion Purchase',
          image: '/logo.png',
          order_id: orderData.razorpay_order_id,
          handler: async function (response: any) {
            try {
              const verifyData = {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              };
              await paymentAPI.verifyPayment(verifyData);
              addNotification('Payment successful!', 'success');
              clearCart();
              navigate('/orders');
            } catch (error) {
              addNotification('Payment verification failed', 'error');
            }
          },
          prefill: {
            name: shippingAddress.fullName,
            email: user?.email,
            contact: shippingAddress.phone
          },
          theme: { color: '#800000' }
        };

        const rzp = (window as any).Razorpay(options);
        rzp.open();
      } else if (paymentMethod === 'upi') {
        const upiId = 'mahafashion@upi';
        const name = 'Maha%20Fashion';
        const amount = calculateTotal();
        const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;
        window.location.href = upiUrl;
        addNotification('Please complete payment in your UPI app', 'info');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      const errorMessage = error.message || 'An error occurred during checkout. Please try again.';
      addNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
              {currentStep > 1 ? <CheckCircle size={20} /> : 1}
            </div>
            <span className={`font-medium ${currentStep >= 1 ? 'text-primary' : 'text-gray-500'}`}>Order Summary</span>
            <div className={`h-1 w-12 sm:w-20 rounded ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
            <span className={`font-medium ${currentStep >= 2 ? 'text-primary' : 'text-gray-500'}`}>Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <ShoppingBag className="text-maroon-600" size={24} />
                      Review Your Items ({cartItems.length})
                    </h2>
                    <Link to="/products" className="text-maroon-600 font-medium text-sm hover:underline">
                      Continue Shopping
                    </Link>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={item.product?.imageUrl || '/placeholder-saree.jpg'}
                            alt={item.product?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between">
                            <h3 className="font-semibold text-gray-900">{item.product?.name}</h3>
                            <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <div className="text-sm text-gray-500">
                             <p className="font-medium text-maroon-600">₹{item.product?.price?.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-2 hover:bg-gray-50 text-gray-600"><Minus size={14} /></button>
                              <span className="w-10 text-center font-medium">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-50 text-gray-600"><Plus size={14} /></button>
                            </div>
                            <span className="font-bold text-gray-900">₹{(item.product?.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-gray-600">Subtotal: <span className="text-xl font-bold text-gray-900 ml-2">₹{getCartTotal().toLocaleString()}</span></div>
                  <button onClick={nextStep} className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg">
                    Proceed to Payment <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <button onClick={prevStep} className="flex items-center text-gray-600 hover:text-maroon-600 font-medium mb-2 group transition-colors">
                  <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Summary
                </button>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-50"><h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><MapPin className="text-maroon-600" size={24} />Shipping Details</h2></div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><User size={14} className="text-gray-400" /> Full Name</label>
                       <input type="text" name="fullName" value={shippingAddress.fullName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-maroon-500" placeholder="Recipient's Name"/>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Mail size={14} className="text-gray-400" /> Email</label>
                       <input type="email" name="email" value={shippingAddress.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-maroon-500" placeholder="your@email.com" required/>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Phone size={14} className="text-gray-400" /> Mobile Number</label>
                       <input type="tel" name="phone" value={shippingAddress.phone} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-maroon-500" placeholder="10-digit number"/>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Home size={14} className="text-gray-400" /> Complete Address</label>
                       <textarea name="address" value={shippingAddress.address} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-maroon-500" placeholder="House No, Building, Street, Area"/>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-700">Pincode</label>
                       <input type="text" name="pincode" value={shippingAddress.pincode} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-maroon-500" placeholder="6-digit code"/>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-700">City & State</label>
                       <div className="flex gap-2">
                         <input type="text" name="city" value={shippingAddress.city} onChange={handleInputChange} className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-maroon-500" placeholder="City"/>
                         <input type="text" name="state" value={shippingAddress.state} onChange={handleInputChange} className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-maroon-500" placeholder="State"/>
                       </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-50"><h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><CreditCard className="text-maroon-600" size={24} />Payment Method</h2></div>
                  <div className="p-6 space-y-4">
                    {['razorpay', 'upi', 'cod'].map((method) => (
                      <label key={method} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method ? 'border-maroon-600 bg-maroon-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                        <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method ? 'border-maroon-600' : 'border-gray-300'}`}>
                          {paymentMethod === method && <div className="w-2.5 h-2.5 bg-maroon-600 rounded-full" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 capitalize">{method === 'razorpay' ? 'Cards & Netbanking' : method === 'upi' ? 'UPI' : 'Cash on Delivery'}</p>
                          <p className="text-sm text-gray-500">{method === 'razorpay' ? 'Secure payment via Razorpay' : method === 'upi' ? 'GPay, PhonePe, Paytm' : 'Pay when order arrives'}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <div><p className="text-white/80 text-sm">Total Amount to Pay</p><p className="text-3xl font-bold">₹{calculateTotal().toLocaleString()}</p></div>
                    <Lock className="text-white/60" size={32} />
                  </div>
                  <button 
                    onClick={handlePayment} 
                    disabled={loading} 
                    className="w-full bg-white text-primary py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck size={20} />
                        Place Order & Pay ₹{calculateTotal().toLocaleString()}
                      </>
                    )}
                  </button>
                  <p className="text-center text-white/60 text-xs mt-3">🔒 Secure Payment Gateway</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
              <h3 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-50">Price Breakdown</h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex justify-between"><span>Price ({cartItems.length} items)</span><span>₹{getCartTotal().toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Shipping Fee</span><span className={calculateShipping() === 0 ? 'text-green-600 font-medium' : ''}>{calculateShipping() === 0 ? 'FREE' : `₹${calculateShipping()}`}</span></div>
                <div className="pt-4 border-t border-gray-50 flex justify-between"><span className="text-lg font-bold text-gray-900">Total Payable</span><span className="text-lg font-bold text-maroon-600">₹{calculateTotal().toLocaleString()}</span></div>
              </div>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"><Truck className="text-maroon-600 mt-1" size={20} /><div><p className="text-sm font-bold text-gray-900">Express Delivery</p><p className="text-xs text-gray-500">Ships in 24-48 hours</p></div></div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"><ShieldCheck className="text-maroon-600 mt-1" size={20} /><div><p className="text-sm font-bold text-gray-900">Direct from weavers</p><p className="text-xs text-gray-500">100% Authentic Sarees</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
