import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
// import WishlistItem from '../components/wishlist/WishlistItem'; // Assuming this component will be created

const WishlistPage: React.FC = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addNotification } = useNotification();

  const handleAddToCart = async (product: any) => {
    try {
      const message = await addToCart(product, 1);
      addNotification(message, 'success');
    } catch (error) {
      addNotification('Failed to add to cart', 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold mb-8">Your Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistItems.map(item => (
            <div key={item.id} className="relative bg-white rounded-lg shadow-md overflow-hidden">
              <img src={item.imageUrl || '/placeholder-saree.jpg'} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">₹{item.price?.toLocaleString()}</p>
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;