import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../product/ProductCard';
import { productAPI } from '../../services/api';
import { SareeProduct } from '../../types';
import { ArrowRight } from 'lucide-react';

// Fallback products when API is unavailable
const fallbackProducts: SareeProduct[] = [
    {
        id: '1',
        name: 'Elegant Silk Saree',
        price: 4999,
        fabric: 'Silk',
        color: '#800000',
        occasion: 'Wedding',
        workType: 'Zari',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop'],
        description: 'Beautiful silk saree',
        careInstructions: 'Dry clean only',
        blouseIncluded: true,
        drapeLength: 5.5,
        rating: 4.5,
        reviewCount: 12,
        isNewArrival: true
    },
    {
        id: '2',
        name: 'Banarasi Wedding Saree',
        price: 7999,
        fabric: 'Banarasi',
        color: '#FFD700',
        occasion: 'Wedding',
        workType: 'Zari',
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=500&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=500&fit=crop'],
        description: 'Premium Banarasi saree',
        careInstructions: 'Dry clean only',
        blouseIncluded: true,
        drapeLength: 5.5,
        rating: 4.8,
        reviewCount: 25,
        isNewArrival: true
    },
    {
        id: '3',
        name: 'Cotton Casual Saree',
        price: 1999,
        fabric: 'Cotton',
        color: '#228B22',
        occasion: 'Casual',
        workType: 'Print',
        imageUrl: 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=400&h=500&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=400&h=500&fit=crop'],
        description: 'Comfortable cotton saree',
        careInstructions: 'Machine wash',
        blouseIncluded: false,
        drapeLength: 5.5,
        rating: 4.2,
        reviewCount: 8,
        isNewArrival: true
    },
    {
        id: '4',
        name: 'Designer Party Saree',
        price: 5499,
        fabric: 'Georgette',
        color: '#FF1493',
        occasion: 'Party',
        workType: 'Embroidery',
        imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=500&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=500&fit=crop'],
        description: 'Stunning party wear saree',
        careInstructions: 'Dry clean only',
        blouseIncluded: true,
        drapeLength: 5.5,
        rating: 4.6,
        reviewCount: 18,
        isNewArrival: true
    }
];

const NewArrivals = () => {
    const [products, setProducts] = useState<SareeProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productAPI.getNewArrivals();
                if (response && response.length > 0) {
                    setProducts(response.slice(0, 4));
                } else {
                    setProducts(fallbackProducts);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching new arrivals, using fallback:', error);
                setProducts(fallbackProducts);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return null;

    return (
        <section className="mt-16 bg-gray-50/50">
            <div className="container mx-auto px-4">
                {/* Heading Section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">New Arrivals</h2>
                    <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Explore our freshest additions meticulously crafted for the modern individual who values timeless style and quality.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>


            </div>
        </section>
    );
};

export default NewArrivals;
