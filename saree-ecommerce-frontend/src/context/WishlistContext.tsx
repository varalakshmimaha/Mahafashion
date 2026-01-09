import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SareeProduct } from '../types';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistItems: SareeProduct[];
  wishlistCount: number;
  addToWishlist: (product: SareeProduct) => Promise<string>;
  removeFromWishlist: (productId: string) => Promise<string>;
  toggleWishlist: (product: SareeProduct) => Promise<{ action: string; message: string }>;
  isProductInWishlist: (productId: string) => boolean;
  loadWishlistItems: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

const WISHLIST_STORAGE_KEY = 'maha_fashion_wishlist';

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<SareeProduct[]>([]);
  const { isAuthenticated } = useAuth();

  // Load wishlist items on initial load
  useEffect(() => {
    loadWishlistItems();
  }, [isAuthenticated]);

  const loadWishlistItems = async () => {
    if (isAuthenticated) {
      try {
        const apiWishlistItems = await wishlistAPI.getWishlistItems();
        const transformedItems: SareeProduct[] = apiWishlistItems.map((item: any) => item.product);
        setWishlistItems(transformedItems);
      } catch (error) {
        console.error('Error loading wishlist items:', error);
        // Fallback to localStorage
        loadFromLocalStorage();
      }
    } else {
      loadFromLocalStorage();
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        setWishlistItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  const saveToLocalStorage = (items: SareeProduct[]) => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const addToWishlist = async (product: SareeProduct): Promise<string> => {
    if (isAuthenticated) {
      try {
        await wishlistAPI.addToWishlist({ product_id: product.id });
      } catch (error: any) {
        if (error?.response?.status !== 409) {
          console.error('Error adding to wishlist:', error);
        }
      }
    }

    setWishlistItems(prevItems => {
      if (!prevItems.find(item => item.id === product.id)) {
        const newItems = [...prevItems, product];
        if (!isAuthenticated) saveToLocalStorage(newItems);
        return newItems;
      }
      return prevItems;
    });

    return 'Added to Wishlist';
  };

  const removeFromWishlist = async (productId: string): Promise<string> => {
    if (isAuthenticated) {
      try {
        const allWishlistItems = await wishlistAPI.getWishlistItems();
        const wishlistItemToRemove = allWishlistItems.find((item: any) => 
          item.product.id?.toString() === productId?.toString()
        );
        if (wishlistItemToRemove) {
          await wishlistAPI.removeFromWishlist(wishlistItemToRemove.id);
        }
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      }
    }

    setWishlistItems(prevItems => {
      const newItems = prevItems.filter(item => item.id?.toString() !== productId?.toString());
      if (!isAuthenticated) saveToLocalStorage(newItems);
      return newItems;
    });

    return 'Removed from Wishlist';
  };

  const toggleWishlist = async (product: SareeProduct): Promise<{ action: string; message: string }> => {
    const inWishlist = isProductInWishlist(product.id);
    
    if (inWishlist) {
      const message = await removeFromWishlist(product.id);
      return { action: 'removed', message };
    } else {
      const message = await addToWishlist(product);
      return { action: 'added', message };
    }
  };

  const isProductInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id?.toString() === productId?.toString());
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isProductInWishlist,
        loadWishlistItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
