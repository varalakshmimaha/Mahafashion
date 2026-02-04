import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from '../product/ProductCard';
import { productAPI } from '../../services/api';
import { SareeProduct } from '../../types';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TrendingProducts = () => {
    const [products, setProducts] = useState<SareeProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productAPI.getTrendingProducts();
                if (response && response.length > 0) {
                    setProducts(response);
                } else {
                    setProducts([]); // No fallback, display nothing if API returns empty
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching trending products:', error);
                setProducts([]); // No fallback, display nothing on error
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return null;
    if (products.length === 0) return null; // Don't render section if no products

    return (
        <section className="mt-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Heading Section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Trending Products</h2>
                    <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
                </div>

                <div className="relative group">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation={{
                            nextEl: '.swiper-button-next-trending',
                            prevEl: '.swiper-button-prev-trending',
                        }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 4 }
                        }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        className="!pb-12"
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id}>
                                <div className="h-full border border-gray-100">
                                    <ProductCard product={product} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    
                    {/* Navigation Buttons */}
                    <button className="swiper-button-prev-trending absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-primary border border-gray-100 opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all duration-300 hover:bg-primary hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button className="swiper-button-next-trending absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-primary border border-gray-100 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 hover:bg-primary hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>

                <div className="mt-12 text-center">
                    <Link 
                        to="/products?sort=trending" 
                        className="inline-block text-secondary font-bold border-b-2 border-secondary pb-1 hover:text-secondary-dark hover:border-secondary-dark transition-all uppercase tracking-widest text-sm"
                    >
                        View All Trending
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TrendingProducts;
