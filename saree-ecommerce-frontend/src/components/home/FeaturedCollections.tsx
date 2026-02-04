import { useState, useEffect } from 'react';
import ProductCard from '../product/ProductCard';
import { productAPI } from '../../services/api';
import { SareeProduct } from '../../types';

// Fallback products when API is unavailable
const fallbackProducts: SareeProduct[] = [
    {
        id: '1',
        name: 'Traditional Ethnic Saree',
        price: 6499,
        fabric: 'Silk',
        color: '#800000',
        occasion: 'Ethnic',
        workType: 'Traditional',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop'],
        description: 'Beautiful ethnic saree',
        careInstructions: 'Dry clean only',
        blouseIncluded: true,
        drapeLength: 5.5,
        rating: 4.6,
        reviewCount: 34
    },
    {
        id: '2',
        name: 'Festive Wear Collection',
        price: 7499,
        fabric: 'Banarasi',
        color: '#FFD700',
        occasion: 'Festive',
        workType: 'Zari',
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=500&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=500&fit=crop'],
        description: 'Premium festive saree',
        careInstructions: 'Dry clean only',
        blouseIncluded: true,
        drapeLength: 5.5,
        rating: 4.8,
        reviewCount: 42
    },
    {
        id: '3',
        name: 'Heritage Silk Saree',
        price: 8999,
        fabric: 'Kanjivaram',
        color: '#228B22',
        occasion: 'Wedding',
        workType: 'Handwoven',
        imageUrl: 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=400&h=500&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=400&h=500&fit=crop'],
        description: 'Heritage collection',
        careInstructions: 'Dry clean only',
        blouseIncluded: true,
        drapeLength: 5.5,
        rating: 4.9,
        reviewCount: 56
    },
    {
        id: '4',
        name: 'Royal Pattu Saree',
        price: 9999,
        fabric: 'Pattu',
        color: '#4B0082',
        occasion: 'Wedding',
        workType: 'Zari',
        imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=500&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=500&fit=crop'],
        description: 'Royal pattu saree',
        careInstructions: 'Dry clean only',
        blouseIncluded: true,
        drapeLength: 5.5,
        rating: 4.7,
        reviewCount: 38
    }
];

const FeaturedCollections = () => {
    const [products, setProducts] = useState<SareeProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch products designated for ethnic wear
                const response = await productAPI.getEthnicWear();
                if (response && response.length > 0) {
                    setProducts(response.slice(0, 4));
                } else {
                    setProducts(fallbackProducts);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching ethnic wear products, using fallback:', error);
                setProducts(fallbackProducts);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 text-center">
                    <p>Loading Collections...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-serif font-bold text-center mb-8">Collections</h2>
                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FeaturedCollections;
