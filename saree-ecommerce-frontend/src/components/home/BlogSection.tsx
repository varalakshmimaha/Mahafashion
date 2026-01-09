import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SareeProduct } from '../../types';
import { productAPI } from '../../services/api';

const BlogSection = () => {
    const [products, setProducts] = useState<SareeProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMahaCollection = async () => {
            try {
                const data = await productAPI.getMahaCollection();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching Maha Collection:', error);
                setLoading(false);
            }
        };

        fetchMahaCollection();
    }, []);

    if (loading || products.length === 0) {
        return null; // Don't render if no products or still loading
    }

    return (
        <div className="bg-cream">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-serif font-bold text-center mb-8">Maha Collection</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                        <Link to={`/product/${product.id}`} key={product.id} className="group">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <img src={product.imageUrl} alt={product.name} className="h-48 w-full object-cover" />
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-maroon-500">{product.name}</h3>
                                    <p className="text-gray-600">₹{product.price}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BlogSection;
