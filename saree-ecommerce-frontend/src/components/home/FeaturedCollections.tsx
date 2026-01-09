import React, { useState, useEffect } from 'react';
import ProductCard from '../product/ProductCard';
import { productAPI } from '../../services/api';
import { SareeProduct } from '../../types';

const FeaturedCollections = () => {
    const [products, setProducts] = useState<SareeProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch products designated for ethnic wear
                const response = await productAPI.getEthnicWear();
                setProducts(response.slice(0, 4));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching ethnic wear products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 text-center">
                    <p>Loading Ethnic Wear...</p>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return null; // Don't show the section if no products
    }

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
