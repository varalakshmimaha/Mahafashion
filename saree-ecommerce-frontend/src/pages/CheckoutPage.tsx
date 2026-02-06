import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { paymentAPI, orderAPI, shippingSettingsAPI, API_STORAGE_URL } from '../services/api';
import getImageUrl, { PLACEHOLDER_DATA_URI } from '../utils/getImageUrl';
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
  Home,
  Wallet,
  Banknote,
  Loader2
} from 'lucide-react';
import Button from '../components/ui/Button';

interface PaymentGatewayPublic {
  name: string;
  display_name: string;
  is_enabled: boolean;
  config?: {
    max_order_amount?: number;
    min_order_amount?: number;
    cod_charges?: number;
    allow_pincodes?: string;
    key_id?: string; // For Razorpay
    mode?: string; // For Razorpay
    // Add other gateway specific config fields if needed for frontend logic
  };
}

const getPaymentMethodIcon = (name: string): React.ReactNode => {
  switch (name) {
    case 'razorpay': return <CreditCard className="text-blue-600" size={24} />;
    case 'phonepe': return <Wallet className="text-purple-600" size={24} />;
    case 'paytm': return <Wallet className="text-blue-500" size={24} />;
    case 'cod': return <Banknote className="text-green-600" size={24} />;
    default: return <CreditCard size={24} />; // Default icon
  }
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotalSellingPrice, getCartTotalMRP, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotification();

  const [currentStep, setCurrentStep] = useState(1);
  const [_isGuestCheckout, _setIsGuestCheckout] = useState(!isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<PaymentGatewayPublic[]>([]);
  const [shippingSettings, setShippingSettings] = useState<any>(null);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.shipping_name || user?.name || '',
    email: user?.email || '',
    phone: user?.shipping_phone || user?.phone || '',
    address: user?.shipping_address || '',
    city: user?.shipping_city || '',
    state: user?.shipping_state || '',
    pincode: user?.shipping_pincode || '',
    type: 'home'
  });
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  const [selectedPaymentMethodName, setSelectedPaymentMethodName] = useState(''); // Stores the 'name' string of the selected method
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  // razorpayKey will now be extracted from availablePaymentMethods

  // Fetch saved addresses for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      // Import addressAPI dynamically to avoid circular dependencies if any, or just use it if available
      const fetchSavedAddresses = async () => {
        try {
          const { addressAPI } = await import('../services/api');
          const addresses = await addressAPI.getAddresses();
          setSavedAddresses(addresses);
        } catch (error) {
          console.error("Failed to fetch saved addresses:", error);
        }
      };
      fetchSavedAddresses();
    } else {
      // For guests, try to load from local storage
      const savedGuestAddress = localStorage.getItem('guestShippingAddress');
      if (savedGuestAddress) {
        try {
          const parsed = JSON.parse(savedGuestAddress);
          setShippingAddress(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          // ignore invalid json
        }
      }
    }
  }, [isAuthenticated]);

  // Auto-fill address when user profile updates (e.g. on initial load if not immediately available)
  // ONLY if not already filled (to prevent overwriting manual edits)
  useEffect(() => {
    if (user && !shippingAddress.fullName) {
      setShippingAddress(prev => ({
        ...prev,
        fullName: user.shipping_name || user.name || prev.fullName,
        phone: user.shipping_phone || user.phone || prev.phone,
        address: user.shipping_address || prev.address,
        city: user.shipping_city || prev.city,
        state: user.shipping_state || prev.state,
        pincode: user.shipping_pincode || prev.pincode,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  // Persist guest address to local storage on change
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('guestShippingAddress', JSON.stringify(shippingAddress));
    }
  }, [shippingAddress, isAuthenticated]);

  // Handle saved address selection
  const handleAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const addressId = e.target.value;
    if (addressId === 'new') {
      // Clear fields for new address
      setShippingAddress({
        fullName: '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        type: 'home'
      });
    } else {
      const selected = savedAddresses.find(addr => addr.id.toString() === addressId);
      if (selected) {
        setShippingAddress({
          fullName: selected.name,
          email: user?.email || '',
          phone: selected.phone,
          address: selected.street,
          city: selected.city,
          state: selected.state,
          pincode: selected.zip,
          type: selected.type || 'home'
        });
      }
    }
  };

  // Fetch available payment methods from backend
  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoadingMethods(true);
      const response = await paymentAPI.getAvailableMethods();
      // API now returns PaymentGatewayPublic[] directly
      const methods: PaymentGatewayPublic[] = response;
      setAvailablePaymentMethods(methods);
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      addNotification('Failed to load payment options. Please try again.', 'error');
      // Fallback: set empty
      setAvailablePaymentMethods([]);
    } finally {
      setLoadingMethods(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchPaymentMethods();
    // Fetch shipping settings
    shippingSettingsAPI.get()
      .then(data => setShippingSettings(data))
      .catch(err => console.error('Failed to load shipping settings', err));
  }, [fetchPaymentMethods]);

  // Set default payment method when methods are loaded
  useEffect(() => {
    if (availablePaymentMethods.length > 0 && !selectedPaymentMethodName) {
      setSelectedPaymentMethodName(availablePaymentMethods[0].name);
    }
  }, [availablePaymentMethods, selectedPaymentMethodName]);

  // Load Razorpay SDK only if Razorpay is among available and not yet loaded
  useEffect(() => {
    const razorpayGateway = availablePaymentMethods.find(method => method.name === 'razorpay');
    if (razorpayGateway && !razorpayLoaded) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
    }
  }, [availablePaymentMethods, razorpayLoaded]);

  useEffect(() => {
    if (cartItems.length === 0 && currentStep === 1) {
      const timer = setTimeout(() => {
        if (cartItems.length === 0) navigate('/cart');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [cartItems, navigate, currentStep]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const calculateShipping = () => {
    const total = getCartTotalSellingPrice();
    const threshold = shippingSettings ? Number(shippingSettings.free_shipping_threshold) : 1000;
    const fee = shippingSettings ? Number(shippingSettings.shipping_fee) : 99;
    return total > threshold ? 0 : fee;
  };

  const calculateTotal = () => {
    return getCartTotalSellingPrice() + calculateShipping();
  };

  const handlePayment = async () => {
    console.log('=== CHECKOUT DEBUG ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);
    console.log('cartItems:', cartItems);
    console.log('selectedPaymentMethodName:', selectedPaymentMethodName);
    console.log('authToken:', localStorage.getItem('authToken'));

    if (!isAuthenticated) {
      // Guest checkout allowed
      // Ensure we have contact details
      if (!shippingAddress.email) {
        addNotification('Please provide an email address for guest checkout', 'error');
        return;
      }
    }

    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.pincode) {
      addNotification('Please fill in all required shipping details (Name, Phone, Address, Pincode)', 'error');
      return;
    }

    if (cartItems.length === 0) {
      addNotification('Your cart is empty', 'error');
      return;
    }

    if (!selectedPaymentMethodName) {
      addNotification('Please select a payment method', 'error');
      return;
    }

    const selectedGateway = availablePaymentMethods.find(method => method.name === selectedPaymentMethodName);
    if (!selectedGateway) {
      addNotification('Selected payment method not found or unavailable.', 'error');
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

    // Prepare items for API
    const apiCartItems = cartItems.map(item => ({
      product_id: Number(item.product.id),
      quantity: item.quantity,
      selected_color: item.selectedColor || null,
      blouse_option: item.blouseOption || null
    }));

    const orderData: any = {
      shipping_address: formattedAddress,
      payment_method: selectedPaymentMethodName,
      cart_items: apiCartItems
    };

    // Also send cart_item_ids if authenticated user with valid IDs (optimization for server to clear cart)
    if (isAuthenticated && cartItems.length > 0 && cartItems[0].id) {
      const cartItemIds = cartItems.map(item => Number(item.id)).filter(id => !isNaN(id) && id > 0);
      if (cartItemIds.length > 0) {
        orderData.cart_item_ids = cartItemIds;
      }
    }

    setLoading(true);

    try {
      if (selectedPaymentMethodName === 'cod') {
        // Cash on Delivery flow
        console.log('✓ COD Order Payload:', JSON.stringify(orderData, null, 2));
        const response = await orderAPI.createOrder(orderData);
        console.log('✓ COD Order Response:', response);

        addNotification('Order placed successfully! Pay on delivery.', 'success');
        clearCart();
        navigate(`/order-success?order_id=${response.data?.order?.id || response.order?.id || ''}&order_number=${response.data?.order?.order_number || response.order?.order_number || ''}&method=cod`);

      } else if (selectedPaymentMethodName === 'razorpay') {
        // Razorpay flow
        if (!razorpayLoaded) {
          addNotification('Razorpay is loading. Please wait and try again.', 'error');
          setLoading(false);
          return;
        }

        const razorpayKey = selectedGateway.config?.key_id;
        if (!razorpayKey) {
          addNotification('Payment gateway configuration error. Please contact support.', 'error');
          setLoading(false);
          return;
        }

        // Create Razorpay order via our backend
        // Pass apiCartItems for guest checkout support
        const razorpayOrderResponse = await paymentAPI.createRazorpayOrder(calculateTotal(), 'INR', formattedAddress, apiCartItems);
        const razorpayOrderData = razorpayOrderResponse.data || razorpayOrderResponse;

        const options = {
          key: razorpayKey,
          amount: razorpayOrderData.amount,
          currency: razorpayOrderData.currency || 'INR',
          name: 'Suwish Sarees',
          description: 'Fashion Purchase',
          image: '/logo.png',
          order_id: razorpayOrderData.razorpay_order_id,
          handler: async function (response: any) {
            try {
              const verifyData = {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                order_id: razorpayOrderData.order_id
              };
              const verifyResponse = await paymentAPI.verifyRazorpayPayment(verifyData);
              addNotification('Payment successful!', 'success');
              clearCart();
              navigate(`/order-success?order_id=${verifyResponse.data?.order?.id || razorpayOrderData.order_id}&order_number=${verifyResponse.data?.order?.order_number || verifyResponse.order?.order_number || ''}&method=razorpay`);
            } catch (error) {
              console.error('Razorpay verification error:', error);
              addNotification('Payment verification failed. Please contact support.', 'error');
            }
          },
          prefill: {
            name: shippingAddress.fullName,
            email: shippingAddress.email || user?.email,
            contact: shippingAddress.phone
          },
          theme: { color: '#800000' },
          modal: {
            ondismiss: function () {
              addNotification('Payment cancelled', 'info');
              setLoading(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          console.error('Razorpay payment failed:', response.error);
          addNotification(`Payment failed: ${response.error.description}`, 'error');
          setLoading(false);
        });
        rzp.open();

      } else if (selectedPaymentMethodName === 'phonepe') {
        // PhonePe flow - redirect to PhonePe payment page
        console.log('✓ PhonePe Payment Initiation');
        const phonePeResponse = await paymentAPI.initiatePhonePePayment(calculateTotal(), formattedAddress);
        const phonePeData = phonePeResponse.data || phonePeResponse;

        if (phonePeData.redirect_url) {
          // Redirect to PhonePe payment page
          window.location.href = phonePeData.redirect_url;
        } else {
          throw new Error('Failed to get PhonePe payment URL');
        }

      } else if (selectedPaymentMethodName === 'paytm') {
        // Paytm flow - redirect to Paytm payment page
        console.log('✓ Paytm Payment Initiation');
        const paytmResponse = await paymentAPI.initiatePaytmPayment(calculateTotal(), formattedAddress);
        const paytmData = paytmResponse.data || paytmResponse;

        if (paytmData.redirect_url) {
          // For Paytm, we might need to submit a form
          if (paytmData.txnToken && paytmData.mid && paytmData.order_id) {
            // Create and submit form to Paytm
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = paytmData.redirect_url;

            const fields = {
              'MID': paytmData.mid,
              'ORDER_ID': paytmData.order_id,
              'TXN_TOKEN': paytmData.txnToken,
              'CHANNEL_ID': 'WEB',
              'WEBSITE': 'DEFAULT'
            };

            Object.entries(fields).forEach(([key, value]) => {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = value;
              form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
          } else {
            // Simple redirect
            window.location.href = paytmData.redirect_url;
          }
        } else {
          throw new Error('Failed to get Paytm payment URL');
        }
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred during checkout. Please try again.';
      addNotification(errorMessage, 'error');
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
                        <div className="w-full sm:w-24 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={getImageUrl(item)}
                            alt={item.product?.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_DATA_URI; }} />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between">
                            <h3 className="font-semibold text-gray-900">{item.product?.name}</h3>
                            <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <div className="flex flex-col gap-1">
                            {/* Logic to determine if there is a discount */}
                            {(() => {
                              // Calculate display values
                              let displayPrice = item.price || item.product.final_price || item.product.price;
                              let displayMrp = item.product.price;

                              // Use variant info if available
                              if (item.variantMrp && item.variantMrp > 0) {
                                displayMrp = item.variantMrp;
                              } else if (item.product.discount && item.product.discount > 0) {
                                // Fallback: If no variant MRP but we have product discount, calculate base price
                                // This handles cases where we might have price but no MRP
                              }

                              const hasDiscount = displayMrp > displayPrice;

                              return hasDiscount ? (
                                <>
                                  <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-gray-900">
                                      ₹{displayPrice.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-gray-400 line-through">
                                      ₹{displayMrp.toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-xs text-green-600 font-medium">
                                    {/* Show discount amount */}
                                    Discount: –₹{(displayMrp - displayPrice).toLocaleString()}
                                  </p>
                                </>
                              ) : (
                                <p className="font-bold text-gray-900">₹{displayPrice.toLocaleString()}</p>
                              );
                            })()}
                          </div>
                          <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-2 hover:bg-gray-50 text-gray-600"><Minus size={14} /></button>
                              <span className="w-10 text-center font-medium">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-50 text-gray-600"><Plus size={14} /></button>
                            </div>
                            <span className="font-bold text-gray-900">
                              ₹{((item.price || item.product.final_price || item.product.price) * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-gray-600">Subtotal: <span className="text-xl font-bold text-gray-900 ml-2">₹{getCartTotalSellingPrice().toLocaleString()}</span></div>
                  <Button
                    onClick={nextStep}
                    variant="primary"
                    className="w-full sm:w-auto shadow-lg"
                  >
                    Proceed to Payment <ChevronRight size={20} />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <Button
                  onClick={prevStep}
                  variant="ghost"
                  className="flex items-center text-gray-600 hover:opacity-80 font-medium mb-2 group transition-colors pl-0 hover:bg-transparent justify-start"
                >
                  <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Summary
                </Button>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-50"><h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><MapPin style={{ color: 'var(--color-primary)' }} size={24} />Shipping Details</h2></div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isAuthenticated && savedAddresses.length > 0 && (
                      <div className="md:col-span-2 space-y-2 mb-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                          <MapPin size={16} className="text-maroon-600" />
                          Select from Saved Addresses
                        </label>
                        <select
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 appearance-none cursor-pointer"
                          style={{ '--tw-ring-color': 'var(--color-primary)', borderColor: 'var(--color-primary)' } as any}
                          onChange={handleAddressSelect}
                          defaultValue=""
                        >
                          <option value="" disabled>-- Choose a saved address --</option>
                          <option value="new">+ Add New Address</option>
                          {savedAddresses.map(addr => (
                            <option key={addr.id} value={addr.id}>
                              {addr.type ? `[${addr.type.toUpperCase()}] ` : ''}{addr.name}, {addr.city} - {addr.zip}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><User size={14} className="text-gray-400" /> Full Name</label>
                      <input type="text" name="fullName" value={shippingAddress.fullName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2" style={{ '--tw-ring-color': 'var(--color-primary)', borderColor: 'var(--color-primary)' } as any} placeholder="Recipient's Name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Mail size={14} className="text-gray-400" /> Email</label>
                      <input type="email" name="email" value={shippingAddress.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2" style={{ '--tw-ring-color': 'var(--color-primary)', borderColor: 'var(--color-primary)' } as any} placeholder="your@email.com" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Phone size={14} className="text-gray-400" /> Mobile Number</label>
                      <input type="tel" name="phone" value={shippingAddress.phone} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2" style={{ '--tw-ring-color': 'var(--color-primary)', borderColor: 'var(--color-primary)' } as any} placeholder="10-digit number" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Home size={14} className="text-gray-400" /> Complete Address</label>
                      <textarea name="address" value={shippingAddress.address} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2" style={{ '--tw-ring-color': 'var(--color-primary)', borderColor: 'var(--color-primary)' } as any} placeholder="House No, Building, Street, Area" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Pincode</label>
                      <input type="text" name="pincode" value={shippingAddress.pincode} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2" style={{ '--tw-ring-color': 'var(--color-primary)', borderColor: 'var(--color-primary)' } as any} placeholder="6-digit code" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">City & State</label>
                      <div className="flex gap-2">
                        <input type="text" name="city" value={shippingAddress.city} onChange={handleInputChange} className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2" style={{ '--tw-ring-color': 'var(--color-primary)', borderColor: 'var(--color-primary)' } as any} placeholder="City" />
                        <input type="text" name="state" value={shippingAddress.state} onChange={handleInputChange} className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2" style={{ '--tw-ring-color': 'var(--color-primary)', borderColor: 'var(--color-primary)' } as any} placeholder="State" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-50"><h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><CreditCard style={{ color: 'var(--color-primary)' }} size={24} />Payment Method</h2></div>
                  <div className="p-6 space-y-4">
                    {loadingMethods ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin" style={{ color: 'var(--color-primary)' }} size={32} />
                        <span className="ml-3 text-gray-600">Loading payment options...</span>
                      </div>
                    ) : availablePaymentMethods.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No payment methods available. Please contact support.</p>
                      </div>
                    ) : (
                      availablePaymentMethods.map((method) => (
                        <label
                          key={method.name}
                          className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-gray-200 overflow-hidden`}
                          style={selectedPaymentMethodName === method.name ? { borderColor: 'var(--color-primary)' } : {}}
                        >
                          {/* Background highlight */}
                          {selectedPaymentMethodName === method.name && (
                            <div className="absolute inset-0 z-0" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.05 }}></div>
                          )}

                          <input
                            type="radio"
                            name="payment_method"
                            value={method.name}
                            checked={selectedPaymentMethodName === method.name}
                            onChange={(e) => setSelectedPaymentMethodName(e.target.value)}
                            className="hidden"
                          />
                          <div className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center`} style={{ borderColor: selectedPaymentMethodName === method.name ? 'var(--color-primary)' : '#d1d5db' }}>
                            {selectedPaymentMethodName === method.name && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />}
                          </div>
                          <div className="relative z-10 flex-shrink-0">
                            {getPaymentMethodIcon(method.name)}
                          </div>
                          <div className="relative z-10 flex-1">
                            <p className="font-bold text-gray-900">{method.display_name}</p>
                            {/* You can add more details here from method.config if needed */}
                            {method.name === 'cod' && method.config?.min_order_amount && (
                              <p className="text-sm text-gray-500">Min Order: ₹{method.config.min_order_amount}</p>
                            )}
                            {method.name === 'cod' && method.config?.max_order_amount && (
                              <p className="text-sm text-gray-500">Max Order: ₹{method.config.max_order_amount}</p>
                            )}
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>
                <div
                  className="rounded-2xl p-6 text-white shadow-xl"
                  style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <div><p className="text-white/80 text-sm">Total Amount to Pay</p><p className="text-3xl font-bold">₹{calculateTotal().toLocaleString()}</p></div>
                    <Lock className="text-white/60" size={32} />
                  </div>
                  <Button
                    onClick={handlePayment}
                    disabled={loading}
                    type="button"
                    variant="primary"
                    fullWidth
                    className="shadow-lg"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck size={20} />
                        Place Order & Pay ₹{calculateTotal().toLocaleString()}
                      </>
                    )}
                  </Button>
                  <p className="text-center text-white/60 text-xs mt-3">🔒 Secure Payment Gateway</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
              <h3 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-50">Price Breakdown</h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex justify-between">
                  <span>Total MRP ({cartItems.length} items)</span>
                  <span>₹{Math.round(getCartTotalMRP()).toLocaleString()}</span>
                </div>

                {(getCartTotalMRP() - getCartTotalSellingPrice()) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount on MRP</span>
                    <span>-₹{Math.round(getCartTotalMRP() - getCartTotalSellingPrice()).toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-800 font-medium pt-2 border-t border-dashed border-gray-100">
                  <span>Items Total</span>
                  <span>₹{Math.round(getCartTotalSellingPrice()).toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className={calculateShipping() === 0 ? 'text-green-600 font-medium' : ''}>
                    {calculateShipping() === 0 ? 'FREE' : `₹${calculateShipping()}`}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-between items-baseline">
                  <span className="text-lg font-bold text-gray-900">Order Total</span>
                  <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>₹{Math.round(calculateTotal()).toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"><Truck className="text-maroon-600 mt-1" size={20} /><div><p className="text-sm font-bold text-gray-900">{shippingSettings?.express_delivery_label || 'Express Delivery'}</p><p className="text-xs text-gray-500">{shippingSettings?.express_delivery_subtitle || 'Ships in 24-48 hours'}</p></div></div>
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
