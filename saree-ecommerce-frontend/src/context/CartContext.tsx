import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, SareeProduct } from '../types';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: SareeProduct, quantity?: number, selectedColor?: string, blouseOption?: string, selectedSize?: string) => Promise<string>;
  removeFromCart: (cartItemId: string, selectedColor?: string, selectedSize?: string) => void;
  updateQuantity: (cartItemId: string, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  loadCartItems: () => void;
  isProductInCart: (productId: string, selectedColor?: string, selectedSize?: string) => boolean;
  getCartCount: () => number;
  findCartItem: (productId: string, selectedColor?: string, selectedSize?: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

const CART_STORAGE_KEY = 'suwish_cart';

// Helper function to generate unique cart item ID for local storage
const generateCartItemId = (productId: string, color: string, size: string) => {
  return `cart-${productId}-${color || 'default'}-${size || 'default'}-${Date.now()}`;
};

// Helper function to match cart items by product variant
const matchCartItem = (item: CartItem, productId: string, color?: string, size?: string): boolean => {
  const itemProductId = item.product.id?.toString();
  const itemColor = (item.selectedColor || '').toLowerCase().trim();
  const itemSize = (item.selectedSize || '').toLowerCase().trim();
  const targetColor = (color || '').toLowerCase().trim();
  const targetSize = (size || '').toLowerCase().trim();
  
  return itemProductId === productId?.toString() && 
         itemColor === targetColor && 
         itemSize === targetSize;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { isAuthenticated } = useAuth();

  // Load cart items on initial load
  useEffect(() => {
    loadCartItems();
  }, [isAuthenticated]);

  const loadCartItems = async () => {
    if (isAuthenticated) {
      try {
        const apiCartItems = await cartAPI.getCartItems();
        const transformedItems: CartItem[] = apiCartItems.map((item: any) => ({
          id: item.id?.toString(),
          product: {
            ...item.product,
            id: item.product?.id?.toString(),
            imageUrl: item.product?.image_url || item.product?.imageUrl,
            imageUrls: item.product?.image_urls || item.product?.imageUrls || [],
            stockQuantity: item.product?.stock_quantity || item.product?.stockQuantity || 999,
          },
          quantity: item.quantity,
          selectedColor: item.selected_color || '',
          selectedSize: item.selected_size || '',
          blouseOption: item.blouse_option || '',
        }));
        setCartItems(transformedItems);
      } catch (error) {
        console.error('Error loading cart items:', error);
        loadFromLocalStorage();
      }
    } else {
      loadFromLocalStorage();
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  const saveToLocalStorage = (items: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const addToCart = async (
    product: SareeProduct, 
    quantity: number = 1, 
    selectedColor: string = '', 
    blouseOption: string = '',
    selectedSize: string = ''
  ): Promise<string> => {
    const stockAvailable = product.stockQuantity || 999;
    
    if (isAuthenticated) {
      try {
        const cartData = {
          product_id: product.id,
          quantity,
          selected_color: selectedColor,
          selected_size: selectedSize,
          blouse_option: blouseOption,
        };
        
        const response = await cartAPI.addToCart(cartData);
        
        // Check for stock error
        if (response.error) {
          return response.error;
        }
        
        // Reload cart items to get the updated cart with correct IDs from the server
        await loadCartItems();
        
        return response.is_update ? 'Cart quantity updated' : 'Added to cart';
      } catch (error: any) {
        console.error('Error adding to cart:', error);
        return error.message || 'Failed to add to cart';
      }
    } else {
      // Guest user - use localStorage
      let resultMessage = 'Added to cart';
      
      setCartItems(prevItems => {
        // Find existing item matching product + color + size
        const existingItem = prevItems.find(item => 
          matchCartItem(item, product.id?.toString() || '', selectedColor, selectedSize)
        );
        
        let newItems: CartItem[];
        
        if (existingItem) {
          // Check stock limit
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > stockAvailable) {
            resultMessage = `Only ${stockAvailable} items available in stock`;
            return prevItems; // Don't update
          }
          
          // Update quantity of existing item
          newItems = prevItems.map(item =>
            matchCartItem(item, product.id?.toString() || '', selectedColor, selectedSize)
              ? { ...item, quantity: newQuantity }
              : item
          );
          resultMessage = 'Cart quantity updated';
        } else {
          // Check stock for new item
          if (quantity > stockAvailable) {
            resultMessage = `Only ${stockAvailable} items available in stock`;
            return prevItems; // Don't update
          }
          
          // Add new cart item
          const newCartItem: CartItem = {
            id: generateCartItemId(product.id?.toString() || '', selectedColor, selectedSize),
            product,
            quantity,
            selectedColor,
            selectedSize,
            blouseOption,
          };
          newItems = [...prevItems, newCartItem];
        }
        
        saveToLocalStorage(newItems);
        return newItems;
      });
      
      return resultMessage;
    }
  };

  const removeFromCart = async (cartItemId: string, selectedColor?: string, selectedSize?: string) => {
    if (isAuthenticated) {
      try {
        // Find by ID first, fallback to variant matching
        let cartItem = cartItems.find(item => item.id?.toString() === cartItemId?.toString());
        
        if (!cartItem && selectedColor !== undefined) {
          // Try matching by product variant
          cartItem = cartItems.find(item => 
            matchCartItem(item, cartItemId, selectedColor, selectedSize)
          );
        }
        
        if (cartItem) {
          await cartAPI.removeFromCart(cartItem.id);
          // Reload cart items to get the updated cart from the server
          await loadCartItems();
          return;
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    }

    setCartItems(prevItems => {
      let newItems: CartItem[];
      
      // Try by cart item ID first
      if (prevItems.some(item => item.id?.toString() === cartItemId?.toString())) {
        newItems = prevItems.filter(item => item.id?.toString() !== cartItemId?.toString());
      } else {
        // Try by product variant
        newItems = prevItems.filter(item => 
          !matchCartItem(item, cartItemId, selectedColor, selectedSize)
        );
      }
      
      saveToLocalStorage(newItems);
      return newItems;
    });
  };

  const updateQuantity = async (cartItemId: string, quantity: number, selectedColor?: string, selectedSize?: string) => {
    if (quantity < 1) return;
    
    if (isAuthenticated) {
      try {
        // Find by ID first, fallback to variant matching
        let cartItem = cartItems.find(item => item.id?.toString() === cartItemId?.toString());
        
        if (!cartItem && selectedColor !== undefined) {
          cartItem = cartItems.find(item => 
            matchCartItem(item, cartItemId, selectedColor, selectedSize)
          );
        }
        
        if (cartItem) {
          // Check stock limit
          const stockAvailable = cartItem.product.stockQuantity || 999;
          if (quantity > stockAvailable) {
            console.warn(`Quantity ${quantity} exceeds stock ${stockAvailable}`);
            return;
          }
          
          await cartAPI.updateCartItem(cartItem.id, quantity);
          await loadCartItems();
          return;
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    }

    setCartItems(prevItems => {
      const newItems = prevItems.map(item => {
        const isMatch = item.id?.toString() === cartItemId?.toString() || 
                        matchCartItem(item, cartItemId, selectedColor, selectedSize);
        
        if (isMatch) {
          // Check stock limit
          const stockAvailable = item.product.stockQuantity || 999;
          const validQuantity = Math.min(quantity, stockAvailable);
          return { ...item, quantity: validQuantity };
        }
        return item;
      });
      
      saveToLocalStorage(newItems);
      return newItems;
    });
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartAPI.clearCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }

    setCartItems([]);
    saveToLocalStorage([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
  };

  // Check if a specific product variant is in cart
  const isProductInCart = (productId: string, selectedColor?: string, selectedSize?: string) => {
    if (selectedColor !== undefined || selectedSize !== undefined) {
      // Check for specific variant
      return cartItems.some(item => matchCartItem(item, productId, selectedColor, selectedSize));
    }
    // Check for any variant of the product
    return cartItems.some(item => item.product.id?.toString() === productId?.toString());
  };

  // Find a specific cart item by product variant
  const findCartItem = (productId: string, selectedColor?: string, selectedSize?: string): CartItem | undefined => {
    return cartItems.find(item => matchCartItem(item, productId, selectedColor, selectedSize));
  };

  // Get total quantity count (not product count)
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const cartCount = getCartCount();

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        loadCartItems,
        isProductInCart,
        getCartCount,
        findCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
