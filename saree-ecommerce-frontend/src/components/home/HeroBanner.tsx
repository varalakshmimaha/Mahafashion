import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { bannerAPI } from '../../services/api';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Banner {
  id: number;
  image_path: string;
  title: string | null;
  link: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Fallback banners when API is unavailable
const fallbackBanners: Banner[] = [
    {
        id: 1,
        image_path: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1920&h=1080&fit=crop',
        title: 'Elegant Saree Collection',
        link: '/products',
        order: 1,
        is_active: true,
        created_at: '',
        updated_at: ''
    },
    {
        id: 2,
        image_path: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1920&h=1080&fit=crop',
        title: 'New Arrivals',
        link: '/products?sort=newest',
        order: 2,
        is_active: true,
        created_at: '',
        updated_at: ''
    },
    {
        id: 3,
        image_path: 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=1920&h=1080&fit=crop',
        title: 'Premium Silk Collection',
        link: '/products?category=silk',
        order: 3,
        is_active: true,
        created_at: '',
        updated_at: ''
    }
];

const HeroBanner: React.FC = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setLoading(true);
                const data = await bannerAPI.getAllPublic();
                // Filter only active banners and sort by order
                // Note: The API might already filter/sort, but this is a safety measure
                const activeBanners = data.filter((banner: Banner) => banner.is_active)
                                          .sort((a: Banner, b: Banner) => a.order - b.order);
                if (activeBanners.length > 0) {
                    setBanners(activeBanners);
                } else {
                    setBanners(fallbackBanners);
                }
                setLoading(false);
            } catch (err: any) {
                console.error('Failed to fetch banners, using fallback:', err.message);
                setBanners(fallbackBanners);
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    if (loading) return <div className="h-[500px] md:h-[650px] lg:h-[750px] bg-gray-100 animate-pulse flex items-center justify-center"><span className="text-gray-400">Loading...</span></div>;
    if (banners.length === 0) return null; // Or display a fallback if no banners are active

    return (
        <section className="relative group">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={{
                    nextEl: '.swiper-button-next-hero',
                    prevEl: '.swiper-button-prev-hero',
                }}
                pagination={{ 
                    clickable: true,
                    bulletActiveClass: 'swiper-pagination-bullet-active !bg-maroon-600',
                }}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                loop={true}
                className="h-[500px] md:h-[650px] lg:h-[750px] overflow-hidden"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        <div className="relative w-full h-full overflow-hidden">
                            {/* Background Image with Zoom Effect */}
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] hover:scale-110"
                                style={{ backgroundImage: `url(${banner.image_path})` }}
                            />
                            
                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                            
                            {/* Content */}
                            <div className="container mx-auto h-full flex flex-col justify-center items-start text-white px-6 md:px-12 relative z-10">
                                <div className="max-w-2xl animate-in slide-in-from-left duration-1000">
                                    <span className="inline-block text-maroon-200 uppercase tracking-[0.3em] font-medium mb-4 text-sm md:text-base">
                                        New Collection 2024
                                    </span>
                                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium mb-6 leading-tight">
                                        {banner.title || 'Maha Fashion'}
                                    </h1>
                                    <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-lg font-light leading-relaxed">
                                        Exquisite designs crafted with passion. Discover the fusion of traditional elegance and modern style.
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-4">
                                        <a 
                                            href="/products?category=women" 
                                            className="px-8 py-4 bg-maroon-600 hover:bg-maroon-700 text-white font-bold rounded-none transition-all duration-300 transform hover:-translate-y-1 shadow-xl flex items-center gap-2"
                                        >
                                            Shop Women
                                        </a>
                                        <a 
                                            href="/products?category=men" 
                                            className="px-8 py-4 bg-white hover:bg-gray-100 text-maroon-900 font-bold rounded-none transition-all duration-300 transform hover:-translate-y-1 shadow-xl"
                                        >
                                            Shop Men
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                
                {/* Custom Navigation Buttons */}
                <div className="swiper-button-prev-hero absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-maroon-900 transition-all cursor-pointer hidden md:flex">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </div>
                <div className="swiper-button-next-hero absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-maroon-900 transition-all cursor-pointer hidden md:flex">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </Swiper>
        </section>
    );
};

export default HeroBanner;