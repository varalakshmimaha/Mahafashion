import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { offerAPI } from '../../services/api';

const OffersSection: React.FC = () => {
    const [banners, setBanners] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                // Fetch offers from API
                const response = await offerAPI.getOffers();
                console.log('Offers raw response:', response);

                // Handle both array and paginated/wrapped response
                const data = Array.isArray(response) ? response : (response?.data || []);

                if (Array.isArray(data) && data.length > 0) {
                    setBanners(data);
                } else {
                    console.warn('Offers data is empty or invalid format:', data);
                }
            } catch (error) {
                console.error("Failed to load banners", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    // Auto-advance carousel
    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [banners.length]);

    // Timer logic for CURRENT banner
    useEffect(() => {
        const currentBanner = banners[currentIndex];
        if (!currentBanner || !currentBanner.end_date) {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
        }

        const targetDate = new Date(currentBanner.end_date);

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [currentIndex, banners]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    if (loading || banners.length === 0) return null;

    const banner = banners[currentIndex];

    // Use banner image as background if available, otherwise default gradient
    const containerStyle = banner.image
        ? { backgroundImage: `url(${banner.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {};

    return (
        <section className="mt-16 px-4 sm:px-6 lg:px-8 group">
            <div className="container mx-auto">
                {/* Heading Section */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Offers</h2>
                    <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
                </div>
                <div
                    className={`relative overflow-hidden rounded-3xl transition-all duration-500 ease-in-out ${!banner.image ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-gray-900'}`}
                    style={containerStyle}
                >
                    {/* Dark overlay if image is present to ensure text readability */}
                    {banner.image && <div className="absolute inset-0 bg-black/50 z-0 transition-opacity duration-500" />}

                    {/* Background Patterns (only if no image) */}
                    {!banner.image && (
                        <>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48" />
                        </>
                    )}

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-8 md:p-16 gap-12 min-h-[400px]">

                        {/* Content */}
                        <div className="text-center lg:text-left w-full lg:w-1/2 text-white animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6 border border-white/30 backdrop-blur-sm">
                                <Tag size={18} className="text-white" />
                                <span className="text-sm font-bold tracking-wider uppercase">{banner.title}</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
                                {banner.subtitle || banner.discount_text || 'Special Offer'}
                            </h2>
                            <p className="text-white/90 text-lg md:text-xl mb-8 font-light max-w-xl mx-auto lg:mx-0">
                                {banner.description}
                            </p>
                            <Link
                                to={banner.button_link || "/products?on_sale=true"}
                                className="inline-block bg-white text-maroon-900 px-10 py-4 font-bold rounded-full hover:bg-gray-100 transition-transform hover:scale-105 shadow-2xl"
                            >
                                {banner.button_text || 'Shop Now'}
                            </Link>
                        </div>

                        {/* Timer / Right Side */}
                        {banner.end_date && (
                            <div className="w-full max-w-md lg:w-auto animate-fade-in-up delay-100">
                                <div className="bg-white/10 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/20 text-white shadow-lg">
                                    <div className="flex items-center gap-3 mb-8 justify-center">
                                        <Timer className="animate-pulse text-yellow-300" />
                                        <span className="text-xl font-medium uppercase tracking-widest text-yellow-300">Ending Soon</span>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4 text-center">
                                        <div className="flex flex-col">
                                            <span className="text-3xl md:text-4xl font-bold font-serif">{timeLeft.days}</span>
                                            <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/70 mt-2">Days</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-3xl md:text-4xl font-bold font-serif">{timeLeft.hours}</span>
                                            <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/70 mt-2">Hours</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-3xl md:text-4xl font-bold font-serif">{timeLeft.minutes}</span>
                                            <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/70 mt-2">Mins</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-3xl md:text-4xl font-bold font-serif">{timeLeft.seconds}</span>
                                            <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/70 mt-2">Secs</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                        <p className="text-white/80 italic text-sm font-serif">
                                            "Don't miss out on this exclusive deal."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Arrows */}
                    {banners.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-opacity z-20"
                                aria-label="Previous Offer"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-opacity z-20"
                                aria-label="Next Offer"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}

                    {/* Carousel Indicators */}
                    {banners.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                            {banners.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex
                                        ? 'bg-white w-8'
                                        : 'bg-white/40 hover:bg-white/60'
                                        }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default OffersSection;
