import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Tag } from 'lucide-react';

const OffersSection: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        // Set an arbitrary end date 3 days from now for demonstration
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary rounded-3xl">
                    {/* Background Patterns */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-8 md:p-16 gap-12">
                        <div className="text-center lg:text-center w-full lg:w-auto text-white max-w-xl mx-auto lg:mx-0">
                            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6 border border-white/30">
                                <Tag size={18} className="text-white" />
                                <span className="text-sm font-bold tracking-wider uppercase">End of Season Sale</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">Up to 60% Off</h2>
                            <p className="text-white/90 text-lg md:text-xl mb-8 font-light">
                                Experience the finest collection of luxury sarees and ethnic wear at unbeatable prices. LIMITED PERIOD OFFER.
                            </p>
                            <Link 
                                to="/products?on_sale=true" 
                                className="inline-block bg-white text-primary px-10 py-4 font-bold rounded-full hover:bg-gray-100 transition-colors shadow-2xl"
                            >
                                Shop the Sale
                            </Link>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/20 text-white w-full max-w-md">
                            <div className="flex items-center gap-3 mb-8 justify-center">
                                <Timer className="animate-pulse" />
                                <span className="text-xl font-medium uppercase tracking-widest">Ending Soon</span>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-4 text-center">
                                <div className="flex flex-col">
                                    <span className="text-3xl md:text-4xl font-bold font-serif">{timeLeft.days}</span>
                                    <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/80 mt-2">Days</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-3xl md:text-4xl font-bold font-serif">{timeLeft.hours}</span>
                                    <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/80 mt-2">Hours</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-3xl md:text-4xl font-bold font-serif">{timeLeft.minutes}</span>
                                    <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/80 mt-2">Mins</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-3xl md:text-4xl font-bold font-serif">{timeLeft.seconds}</span>
                                    <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/80 mt-2">Secs</span>
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-8 border-t border-white/10 text-center">
                                <p className="text-white/80 italic text-sm">
                                    "Elegance is the only beauty that never fades."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OffersSection;
