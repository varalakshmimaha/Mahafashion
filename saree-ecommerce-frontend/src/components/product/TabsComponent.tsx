import React, { useState, forwardRef } from 'react';
import { SareeProduct } from '../../types';
import { Star, ThumbsUp, CheckCircle, User, Truck, RotateCcw, Shield, Clock, Package } from 'lucide-react';

interface TabsComponentProps {
    product: SareeProduct;
}

// Star Rating Component for Reviews
const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 16 }) => {
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, index) => (
                <Star 
                    key={index}
                    size={size} 
                    className={index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}
                    fill={index < Math.floor(rating) ? 'currentColor' : 'none'}
                />
            ))}
        </div>
    );
};

// Rating Progress Bar
const RatingBar: React.FC<{ stars: number; count: number; total: number }> = ({ stars, count, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-12">{stars} stars</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="text-sm text-gray-500 w-10 text-right">{count}</span>
        </div>
    );
};

// Mock Review Data (in real app, this would come from API)
const mockReviews = [
    {
        id: 1,
        author: 'Priya Sharma',
        rating: 5,
        date: '2024-01-15',
        title: 'Absolutely Gorgeous!',
        content: 'The saree is even more beautiful in person. The fabric quality is excellent and the color is exactly as shown. Very happy with my purchase!',
        verified: true,
        helpful: 24
    },
    {
        id: 2,
        author: 'Anita Patel',
        rating: 4,
        date: '2024-01-10',
        title: 'Beautiful saree, great quality',
        content: 'Lovely saree with intricate work. The blouse piece is a nice addition. Only giving 4 stars because delivery took a bit longer than expected.',
        verified: true,
        helpful: 18
    },
    {
        id: 3,
        author: 'Meera Krishnan',
        rating: 5,
        date: '2024-01-05',
        title: 'Perfect for my wedding!',
        content: 'Wore this for my friend\'s wedding and received so many compliments. The silk is of premium quality and drapes beautifully.',
        verified: true,
        helpful: 32
    },
    {
        id: 4,
        author: 'Kavitha R',
        rating: 4,
        date: '2023-12-28',
        title: 'Good value for money',
        content: 'Nice saree at this price point. The packaging was good and delivery was on time. Would recommend.',
        verified: false,
        helpful: 12
    }
];

const ratingBreakdown = {
    5: 85,
    4: 28,
    3: 8,
    2: 2,
    1: 1
};

const TabsComponent = forwardRef<HTMLDivElement, TabsComponentProps>(({ product }, ref) => {
    const [activeTab, setActiveTab] = useState('description');
    const [helpfulReviews, setHelpfulReviews] = useState<number[]>([]);

    const totalReviews = Object.values(ratingBreakdown).reduce((a, b) => a + b, 0);
    const averageRating = product.rating || 4.5;

    const handleHelpful = (reviewId: number) => {
        if (!helpfulReviews.includes(reviewId)) {
            setHelpfulReviews([...helpfulReviews, reviewId]);
        }
    };

    const tabs = [
        { id: 'description', label: 'Description' },
        { id: 'specifications', label: 'Specifications' },
        { id: 'reviews', label: `Reviews (${totalReviews})` },
    ];

    return (
        <div className="mt-16" ref={ref}>
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                activeTab === tab.id
                                    ? 'border-maroon-600 text-maroon-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-8">
                {/* Description Tab */}
                {activeTab === 'description' && (
                    <div className="prose max-w-none">
                        <div className="bg-maroon-50/30 rounded-2xl p-6 mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Package className="text-maroon-600" size={24} />
                                Product Description
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                        </div>
                        
                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white border border-gray-100 rounded-xl p-6">
                                <h4 className="font-semibold text-gray-900 mb-4">Why You'll Love It</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle size={20} className="text-green-500 mt-0.5 shrink-0" />
                                        <span className="text-gray-600">Premium quality fabric with excellent drape</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle size={20} className="text-green-500 mt-0.5 shrink-0" />
                                        <span className="text-gray-600">Handcrafted with traditional techniques</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle size={20} className="text-green-500 mt-0.5 shrink-0" />
                                        <span className="text-gray-600">Perfect for weddings and special occasions</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle size={20} className="text-green-500 mt-0.5 shrink-0" />
                                        <span className="text-gray-600">Includes matching blouse piece (unstitched)</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-xl p-6">
                                <h4 className="font-semibold text-gray-900 mb-4">Care Instructions</h4>
                                <ul className="space-y-3 text-gray-600">
                                    <li>• Dry clean only for best results</li>
                                    <li>• Store in a cool, dry place away from direct sunlight</li>
                                    <li>• Iron on low heat with a cotton cloth barrier</li>
                                    <li>• Avoid contact with perfumes and deodorants</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Specifications Tab */}
                {activeTab === 'specifications' && (
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Product Specifications</h3>
                        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                            <table className="w-full">
                                <tbody>
                                    {[
                                        { label: 'Fabric', value: product.fabric || 'Silk' },
                                        { label: 'Color', value: product.color || 'Multi' },
                                        { label: 'Saree Length', value: '5.5 meters' },
                                        { label: 'Saree Width', value: '1.1 meters' },
                                        { label: 'Blouse Piece', value: 'Included (0.8 meters, Unstitched)' },
                                        { label: 'Occasion', value: product.occasion || 'Wedding, Festival, Party' },
                                        { label: 'Work Type', value: 'Zari, Embroidery' },
                                        { label: 'Border Style', value: 'Contrast Border' },
                                        { label: 'Pallu Design', value: 'Rich Pallu with Zari Work' },
                                        { label: 'Weight', value: '600-800 grams (approx)' },
                                        { label: 'Origin', value: 'India' },
                                        { label: 'SKU', value: `SKU-${product.id}` },
                                    ].map((row, index) => (
                                        <tr key={row.label} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="py-4 px-6 text-gray-600 font-medium w-1/3">{row.label}</td>
                                            <td className="py-4 px-6 text-gray-900">{row.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                    <div>
                        {/* Rating Summary */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Overall Rating */}
                                <div className="text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                                        <span className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                                        <div>
                                            <StarRating rating={averageRating} size={24} />
                                            <p className="text-sm text-gray-500 mt-1">Based on {totalReviews} reviews</p>
                                        </div>
                                    </div>
                                    <button className="mt-4 px-6 py-3 bg-maroon-600 text-white font-semibold rounded-xl hover:bg-maroon-700 transition-colors">
                                        Write a Review
                                    </button>
                                </div>

                                {/* Rating Breakdown */}
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map(stars => (
                                        <RatingBar 
                                            key={stars} 
                                            stars={stars} 
                                            count={ratingBreakdown[stars as keyof typeof ratingBreakdown]} 
                                            total={totalReviews} 
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Reviews List */}
                        <div className="space-y-6">
                            {mockReviews.map(review => (
                                <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-maroon-100 rounded-full flex items-center justify-center">
                                                <User size={20} className="text-maroon-600" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-900">{review.author}</span>
                                                    {review.verified && (
                                                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                            <CheckCircle size={12} />
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                        <StarRating rating={review.rating} size={14} />
                                    </div>
                                    <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                                    <p className="text-gray-600 mb-4">{review.content}</p>
                                    <button 
                                        onClick={() => handleHelpful(review.id)}
                                        disabled={helpfulReviews.includes(review.id)}
                                        className={`flex items-center gap-2 text-sm ${
                                            helpfulReviews.includes(review.id) 
                                                ? 'text-maroon-600' 
                                                : 'text-gray-500 hover:text-maroon-600'
                                        } transition-colors`}
                                    >
                                        <ThumbsUp size={16} fill={helpfulReviews.includes(review.id) ? 'currentColor' : 'none'} />
                                        Helpful ({review.helpful + (helpfulReviews.includes(review.id) ? 1 : 0)})
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Load More */}
                        <div className="text-center mt-8">
                            <button className="px-8 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-maroon-600 hover:text-maroon-600 transition-colors">
                                Load More Reviews
                            </button>
                        </div>
                    </div>
                )}

                {/* Shipping Tab (hidden but accessible via old ID for backwards compatibility) */}
                {activeTab === 'shipping' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white border border-gray-100 rounded-xl p-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                <Truck size={24} className="text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Free Shipping</h4>
                            <p className="text-gray-600 text-sm">Free shipping on all orders above ₹999. Standard delivery in 5-7 business days.</p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-xl p-6">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                                <RotateCcw size={24} className="text-green-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Easy Returns</h4>
                            <p className="text-gray-600 text-sm">7-day hassle-free returns on unworn items with original tags and packaging.</p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-xl p-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                <Shield size={24} className="text-purple-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Secure Payments</h4>
                            <p className="text-gray-600 text-sm">100% secure payments. Cash on Delivery available across India.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

TabsComponent.displayName = 'TabsComponent';

export default TabsComponent;