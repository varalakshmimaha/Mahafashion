
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';

const CollectionsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEthnicWear = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getEthnicWear();
        setProducts(response.data || response || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching ethnic wear:', err);
        setError(err.message || 'Failed to load ethnic wear products');
      } finally {
        setLoading(false);
      }
    };

    fetchEthnicWear();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-center mb-4">Ethnic Wear</h1>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Explore our exquisite collection of traditional ethnic wear,
        handpicked for every occasion.
      </p>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading ethnic wear...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Error Loading Products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/products"
            className="inline-block bg-maroon-600 hover:bg-maroon-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
          >
            Browse All Products
          </Link>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No Ethnic Wear Products Available</h2>
          <p className="text-gray-600 mb-6">Please check back later or browse our other products.</p>
          <Link
            to="/products"
            className="inline-block bg-maroon-600 hover:bg-maroon-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
