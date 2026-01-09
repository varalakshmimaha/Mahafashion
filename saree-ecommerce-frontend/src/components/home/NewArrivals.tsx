import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../product/ProductCard';
import { productAPI } from '../../services/api';
import { SareeProduct } from '../../types';
import { ArrowRight } from 'lucide-react';

const NewArrivals = () => {
    const [products, setProducts] = useState<SareeProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productAPI.getNewArrivals();
                setProducts(response.slice(0, 4));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching new arrivals:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return null;
    if (products.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50/50">
            <div className="container mx-auto px-4">
                {/* Heading Section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">New Arrivals</h2>
                    <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Explore our freshest additions meticulously crafted for the modern individual who values timeless style and quality.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, index) => (
                        <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link 
                        to="/products?sort=newest" 
                        className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-primary-dark transition-colors shadow-lg rounded-lg"
                    >
                        Explore More
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;
