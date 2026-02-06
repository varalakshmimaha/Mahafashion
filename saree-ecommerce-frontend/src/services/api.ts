// API service for the saree e-commerce application
export const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Update this to your Laravel backend URL
export const API_STORAGE_URL = 'http://127.0.0.1:8000/storage';

// Utility function to get auth token from localStorage and normalize it to 'Bearer ...'
const getAuthToken = () => {
  const raw = localStorage.getItem('authToken');
  if (!raw) return null;
  // If it already contains 'Bearer ' prefix, return as-is
  if (/^Bearer\s+/i.test(raw)) return raw;
  // Otherwise prefix with 'Bearer '
  return `Bearer ${raw}`;
};

// Utility function to set auth token (exported for external use)
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

// Utility function to remove auth token (exported for external use)
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Utility function to include auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': token })
  };
};

// API functions for products
export const productAPI = {
  // Get all products with optional filters
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/products?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get admin products (all status)
  getAdminProducts: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/admin/products?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get a specific product by ID
  getProductById: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  },

  // Get new arrivals
  getNewArrivals: async () => {
    const response = await fetch(`${API_BASE_URL}/products/new-arrivals`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result.data || result;
  },

  // Get trending products
  getTrendingProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products/trending`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result.data || result;
  },

  // Get ethnic wear products
  getEthnicWear: async () => {
    const response = await fetch(`${API_BASE_URL}/products/ethnic-wear`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result.data || result;
  },

  // Get maha fashion collection products
  getMahaCollection: async () => {
    const response = await fetch(`${API_BASE_URL}/products/maha-collection`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result.data || result;
  },

  // Create product (admin)
  createProduct: async (productData: FormData) => {
    // Get token directly to ensure it matches
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': token })
      },
      body: productData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Update product variants (batch)
  updateVariants: async (id: string | number, variants: any[]) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/products/${id}/variants`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': token })
      },
      body: JSON.stringify({ variants }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || JSON.stringify(errorData.errors) || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Update product (admin)
  updateProduct: async (id: string | number, productData: FormData) => {
    // Laravel needs _method: 'PUT' or 'PATCH' in FormData for file uploads to work with POST
    productData.append('_method', 'PUT');
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'POST', // Use POST with _method=PUT for FormData
      headers: {
        ...(token && { 'Authorization': token })
      },
      body: productData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Delete product (admin)
  deleteProduct: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};


// API functions for categories
export const categoryAPI = {
  // Get all categories
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get subcategories for a specific category
  getSubcategories: async (categorySlug: string) => {
    const response = await fetch(`${API_BASE_URL}/categories/${categorySlug}/subcategories`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get products by subcategory
  getProductsBySubcategory: async (categorySlug: string, subcategorySlug: string) => {
    const response = await fetch(`${API_BASE_URL}/categories/${categorySlug}/subcategories/${subcategorySlug}/products`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get menu structure with categories and subcategories
  getMenuStructure: async () => {
    const response = await fetch(`${API_BASE_URL}/categories-with-subcategories`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get products by category
  getProductsByCategory: async (categorySlug: string, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/categories/${categorySlug}/products?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get products by category and subcategory
  getProductsByCategoryAndSubcategory: async (categorySlug: string, subcategorySlug: string, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/categories/${categorySlug}/subcategories/${subcategorySlug}/products?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

// API functions for cart
export const cartAPI = {
  // Get user's cart items
  getCartItems: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Add item to cart
  addToCart: async (productData: any) => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Update cart item quantity
  updateCartItem: async (id: string | number, quantity: number) => {
    const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Remove item from cart
  removeFromCart: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get cart total
  total: async () => {
    const response = await fetch(`${API_BASE_URL}/cart/total`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

// API functions for wishlist
export const wishlistAPI = {
  // Get user's wishlist items
  getWishlistItems: async () => {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Add item to wishlist
  addToWishlist: async (productData: any) => {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Remove item from wishlist
  removeFromWishlist: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/wishlist/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

// API functions for orders

// API functions for offers
export const offerAPI = {
  // Get active offers for public display
  getOffers: async () => {
    const response = await fetch(`${API_BASE_URL}/offers`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get all offers (admin)
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/offers`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Create offer (admin)
  create: async (data: FormData) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/admin/offers`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': token })
      },
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || JSON.stringify(errorData.errors) || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Update offer (admin)
  update: async (id: string | number, data: FormData) => {
    data.append('_method', 'POST'); // Use POST for FormData updates
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/admin/offers/${id}`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': token })
      },
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || JSON.stringify(errorData.errors) || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Delete offer (admin)
  delete: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/admin/offers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Toggle status (admin)
  toggleStatus: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/admin/offers/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

export const orderAPI = {
  // Get user's orders
  getOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const text = await response.text().catch(() => '');
    let body: any = null;
    try { body = text ? JSON.parse(text) : null; } catch (e) { body = text; }

    if (!response.ok) {
      const msg = body?.message || body?.error || `HTTP error! status: ${response.status}`;
      const err: any = new Error(msg);
      err.status = response.status;
      err.body = body;
      throw err;
    }

    return body || {};
  },

  // Get a specific order by ID
  getOrderById: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res = await response.json();
    return res?.data || res;
  },

  // Track order by order number (public endpoint)
  trackByNumber: async (orderNumber: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/track/${encodeURIComponent(orderNumber)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const res = await response.json();
    return res?.data || res;
  },

  // Create a new order
  createOrder: async (orderData: any) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || JSON.stringify(errorData.errors) || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Download invoice PDF
  downloadInvoice: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/invoice`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    return blob;
  },

  // Cancel order
  cancelOrder: async (id: string | number, payload: any = {}) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Initiate return
  returnOrder: async (id: string | number, payload: any = {}) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/return`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Admin: list orders with optional filters/pagination
  adminList: async (filters: any = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/admin/orders?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Admin: show order by id
  adminShow: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || `HTTP error! status: ${response.status}`);
    }

    const res = await response.json();
    return res?.data || res;
  },

  // Admin: update order fields
  adminUpdate: async (id: string | number, payload: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Admin: update order status
  adminUpdateStatus: async (id: string | number, status: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Admin: update payment status
  adminUpdatePayment: async (id: string | number, payment_status: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/payment`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ payment_status }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Admin: delete order
  adminDelete: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

export const reviewAPI = {
  getReviews: async (productId: string | number) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  submitReview: async (reviewData: FormData) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': token })
      },
      body: reviewData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
};



// API functions for promotions (banners/coupons)


// API functions for addresses
export const addressAPI = {
  // Get user's addresses
  getAddresses: async () => {
    const response = await fetch(`${API_BASE_URL}/addresses`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Add a new address
  addAddress: async (addressData: any) => {
    const response = await fetch(`${API_BASE_URL}/addresses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Update an existing address
  updateAddress: async (id: string | number, addressData: any) => {
    const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Delete an address
  deleteAddress: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

// API functions for authentication
export const authAPI = {
  // Login user
  login: async (phone: string, password: string) => { // Keep param name as phone for compatibility but it can be email
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email_or_phone: phone, // Keep this as email_or_phone for backend compatibility
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData?.message || errorData?.errors?.email_or_phone?.[0] || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Store user data and token
    const { user, token, token_type } = data;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('authToken', `${token_type} ${token}`);

    return data;
  },

  // Register user
  register: async ({ name, email, phone, password, password_confirmation }: any) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
        password_confirmation: password_confirmation || password, // Support both named and automatic
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData?.message || errorData?.errors?.email?.[0] || errorData?.errors?.phone?.[0] || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Store user data and token
    const { user, token, token_type } = data;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('authToken', `${token_type} ${token}`);

    return data;
  },

  // Logout user
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Clear stored data
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');

    return data;
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Reset password
  resetPassword: async ({ token, email, password, password_confirmation }: any) => {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        email,
        password,
        password_confirmation,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Update profile
  updateProfile: async (profileData: any) => {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Change password
  changePassword: async (payload: { current_password: string; new_password: string; new_password_confirmation?: string }) => {
    const response = await fetch(`${API_BASE_URL}/user/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

// API functions for payments
export const paymentAPI = {
  // Get available payment methods (public)
  getAvailableMethods: async () => {
    const response = await fetch(`${API_BASE_URL}/checkout/payment-methods`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get Razorpay key (public - no secret exposed)
  getRazorpayKey: async () => {
    const response = await fetch(`${API_BASE_URL}/payment/razorpay-key`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Create Razorpay order
  createRazorpayOrder: async (amount: number, currency = 'INR', shippingAddress: any = null, cartItems: any[] = []) => {
    const response = await fetch(`${API_BASE_URL}/payment/razorpay/create-order`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        amount,
        currency,
        shipping_address: shippingAddress,
        cart_items: cartItems
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Verify Razorpay payment
  verifyRazorpayPayment: async (paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/payment/razorpay/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Initiate PhonePe payment
  initiatePhonePePayment: async (amount: number, shippingAddress: any) => {
    const response = await fetch(`${API_BASE_URL}/payment/phonepe/initiate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        amount,
        shipping_address: shippingAddress
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Check PhonePe payment status
  checkPhonePeStatus: async (transactionId: string) => {
    const response = await fetch(`${API_BASE_URL}/payment/phonepe/status?transaction_id=${transactionId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Initiate Paytm payment
  initiatePaytmPayment: async (amount: number, shippingAddress: any) => {
    const response = await fetch(`${API_BASE_URL}/payment/paytm/initiate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        amount,
        shipping_address: shippingAddress
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Legacy: Create a payment order (backward compatibility)
  createOrder: async (amount: number, currency = 'INR', shippingAddress: any = null) => {
    const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        amount,
        currency,
        shipping_address: shippingAddress
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Legacy: Verify payment after completion (backward compatibility)
  verifyPayment: async (paymentData: any) => {
    const response = await fetch(`${API_BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

// API functions for admin payment settings
export const paymentSettingsAPI = {
  // Get payment settings for admin
  getSettings: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/payment-settings`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Update payment settings (admin)
  updateSettings: async (settings: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/payment-settings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

// API functions for sales report
export const salesReportAPI = {
  // Get sales report data
  getReport: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/sales-report?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};


// API functions for settings
export const settingsAPI = {
  // Get public settings
  getSettings: async () => {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Update settings (admin only)
  updateSettings: async (settings: any) => {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

// API functions for banners
export const bannerAPI = {
  // Get all banners (requires auth)
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/banners/all`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get all active banners (public)
  getAllPublic: async () => {
    const response = await fetch(`${API_BASE_URL}/banners`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Create a new banner (with file upload)
  create: async (formData: FormData) => {
    // For file uploads, don't set Content-Type header manually for FormData
    const token = getAuthToken();
    const headers: HeadersInit = {
      ...(token && { 'Authorization': token })
    };

    const response = await fetch(`${API_BASE_URL}/banners`, {
      method: 'POST',
      headers: headers,
      body: formData, // FormData object, no JSON.stringify
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Update an existing banner (with optional file upload)
  update: async (id: number | string, formData: FormData) => {
    const token = getAuthToken();
    const headers: HeadersInit = {
      ...(token && { 'Authorization': token })
    };

    // For PUT/PATCH with FormData, some servers might expect a specific header.
    // However, fetch generally handles FormData correctly without explicit Content-Type.
    // Laravel expects _method field for PUT/PATCH with FormData
    formData.append('_method', 'PUT');

    const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
      method: 'POST', // Use POST method with _method=PUT for file uploads in Laravel
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Delete a banner
  delete: async (id: number | string) => {
    const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

// API functions for static pages
export const staticPageAPI = {
  // Get content for a specific static page
  get: async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/static-pages/${name}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get content for a specific static page (admin)
  getAdmin: async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/static-pages/${name}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // List all static pages (admin)
  list: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/static-pages`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // List published static pages (public)
  listPublic: async () => {
    const response = await fetch(`${API_BASE_URL}/static-pages`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Update a specific static page. `payload` can be a string (content) or an object with fields.
  update: async (name: string, payload: string | any) => {
    const body = typeof payload === 'string' ? { content: payload } : payload;
    const response = await fetch(`${API_BASE_URL}/static-pages/${name}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
  // Create a new static page (admin)
  create: async (payload: any) => {
    const response = await fetch(`${API_BASE_URL}/static-pages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Delete a static page (admin)
  delete: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/static-pages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

// API functions for promotions
export const promotionAPI = {
  // Get all promotions (admin)
  getAll: async (type?: string) => {
    const url = type ? `${API_BASE_URL}/promotions?type=${type}` : `${API_BASE_URL}/promotions`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get active banner promotions (public)
  getBanners: async () => {
    const response = await fetch(`${API_BASE_URL}/promotions/banners`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Create a new promotion (with file upload)
  create: async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/promotions`, {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem('authToken') || '',
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get a single promotion
  get: async (id: number | string) => {
    const response = await fetch(`${API_BASE_URL}/promotions/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Update a promotion
  update: async (id: number | string, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/promotions/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem('authToken') || '',
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Delete a promotion
  delete: async (id: number | string) => {
    const response = await fetch(`${API_BASE_URL}/promotions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Toggle promotion status
  toggleStatus: async (id: number | string) => {
    const response = await fetch(`${API_BASE_URL}/promotions/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

// API functions for theme management
export const themeAPI = {
  // Get all themes
  getThemes: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/themes`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get a single theme
  getTheme: async (id: number | string) => {
    const response = await fetch(`${API_BASE_URL}/admin/themes/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get active theme
  getActiveTheme: async () => {
    const response = await fetch(`${API_BASE_URL}/themes/active`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Create a new theme
  createTheme: async (themeData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/themes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(themeData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Update a theme
  updateTheme: async (id: number | string, themeData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/themes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(themeData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Activate a theme
  activateTheme: async (id: number | string) => {
    const response = await fetch(`${API_BASE_URL}/admin/themes/${id}/activate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Delete a theme
  deleteTheme: async (id: number | string) => {
    const response = await fetch(`${API_BASE_URL}/admin/themes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

// API functions for customers (admin)
export const customerAPI = {
  // List customers
  list: async (filters: any = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/admin/customers?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get customer details with stats
  getDetails: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/admin/customers/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Toggle status
  toggleStatus: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/admin/customers/${id}/toggle-status`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Update customer
  update: async (id: string | number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/customers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};



export const socialMediaAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/social-media-links`);
    if (!response.ok) throw new Error('Failed to fetch social media links');
    return await response.json();
  },

  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/social-media-links`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create link');
    return await response.json();
  },

  update: async (id: number | string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/social-media-links/${id}`, {
      method: 'POST', // Using POST for update to mimic the route definition if it wasn't a PUT/PATCH with resource
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update link');
    return await response.json();
  },

  delete: async (id: number | string) => {
    const response = await fetch(`${API_BASE_URL}/social-media-links/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete link');
    return await response.json();
  },

  reorder: async (orders: { id: number | string; sort_order: number }[]) => {
    const response = await fetch(`${API_BASE_URL}/social-media-links/reorder`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orders }),
    });
    if (!response.ok) throw new Error('Failed to reorder links');
    return await response.json();
  }
};

export const shippingSettingsAPI = {
  get: async () => {
    const response = await fetch(`${API_BASE_URL}/shipping-settings`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch shipping settings');
    return await response.json();
  },

  update: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/shipping-settings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update shipping settings');
    return await response.json();
  }
};

