import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SareeProduct } from '../../types';
import { productAPI } from '../../services/api';

// Fallback products when API is unavailable
const fallbackProducts: SareeProduct[] = [
    {
        id: '1',
        name: 'Maha Special Saree',
        price: 4999,
        fabric: 'Silk',
        color: '#800000',
        occasion: 'Special',
        workType: 'Exclusive',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop'],
        description: 'Exclusive Maha collection',
        careInstructions: 'Dry clean only',
        blouseIncluded: true,
        drapeLength: 5.5,
        rating: 4.8,
        reviewCount: 52
    },
    {
        id: '2',
        name: 'Designer Collection',
        price: 6999,
        fabric: 'Georgette',
        color: '#FF1493',
        occasion: 'Party',
        workType: 'Designer',
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=500&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=500&fit=crop'],
        description: 'Designer saree collection',
        careInstructions: 'Dry clean only',
        blouseIncluded: true,
        drapeLength: 5.5,
        rating: 4.7,
        reviewCount: 38
    },
    {
        id: '3',
        name: 'Premium Handloom',
        price: 8499,
        fabric: 'Handloom',
        color: '#4169E1',
        occasion: 'Festive',
        workType: 'Handwoven',
        imageUrl: 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=400&h=500&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=400&h=500&fit=crop'],
        description: 'Premium handloom saree',
        careInstructions: 'Dry clean only',
        blouseIncluded: true,
        drapeLength: 5.5,
        rating: 4.9,
        reviewCount: 64
    }
];

const BlogSection = () => {
    const [products, setProducts] = useState<SareeProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMahaCollection = async () => {
            try {
                const data = await productAPI.getMahaCollection();
                if (data && data.length > 0) {
                    setProducts(data);
                } else {
                    setProducts(fallbackProducts);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching Maha Collection, using fallback:', error);
                setProducts(fallbackProducts);
                setLoading(false);
            }
        };

        fetchMahaCollection();
    }, []);

    if (loading) {
        return null;
    }

    return (
        <div className="bg-cream">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-serif font-bold text-center mb-8">Maha Collection</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.map((product) => (
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
