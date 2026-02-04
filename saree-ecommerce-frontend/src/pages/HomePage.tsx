import CategoryGrid from "../components/home/CategoryGrid";
import FeaturedCollections from "../components/home/FeaturedCollections";
import HeroBanner from "../components/home/HeroBanner";
import NewArrivals from "../components/home/NewArrivals";
import TrendingProducts from "../components/home/TrendingProducts";
import OffersSection from "../components/home/OffersSection";
import WhyChooseUs from "../components/home/WhyChooseUs";
const HomePage = () => {
    return (
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Hero Banner Carousel */}
                    <HeroBanner />
                    
                    {/* Category Grid - 6 columns */}
                    <CategoryGrid />
                    
                    {/* New Arrivals - Horizontal scroll */}
                    <NewArrivals />
                    
                    {/* Offer Banners */}
                    <OffersSection />
                    
                    {/* Trending Products */}
                    <TrendingProducts />
                    
                    {/* Collections */}
                    <FeaturedCollections />
                    
                    {/* Why Choose Us - Trust Badges */}
                    <WhyChooseUs />
                </div>
            </div>    )
}

export default HomePage;

