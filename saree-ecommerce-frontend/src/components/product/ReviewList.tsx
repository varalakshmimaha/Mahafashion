import React, { useEffect, useState } from 'react';
import StarRating from './StarRating';
import { reviewAPI } from '../../services/api';
import { User, Calendar, Video } from 'lucide-react';

interface Review {
    id: number;
    user: {
        id: number;
        name: string;
    };
    rating: number;
    review: string;
    images: string[];
    videos?: string[]; // Add videos
    created_at: string;
    is_verified_purchase: boolean;
}

interface ReviewListProps {
    productId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await reviewAPI.getReviews(productId);
            // Ensure videos is handled if API returns separate field or null
            const normalizedReviews = (data.data || []).map((r: any) => ({
                ...r,
                videos: r.videos || []
            }));
            setReviews(normalizedReviews);
        } catch (err) {
            console.error('Failed to load reviews', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    return (
        <div className="mt-12 space-y-8">
            <div className="flex justify-between items-center border-b pb-4">
                <div>
                    <h2 className="text-2xl font-playfair font-bold text-gray-900">Customer Reviews</h2>
                    <div className="flex items-center mt-2 space-x-2">
                        <StarRating rating={reviews.length > 0 ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 0} readonly />
                        <span className="text-sm text-gray-500">Based on {reviews.length} reviews</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8 text-gray-500">Loading reviews...</div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No reviews yet for this product.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{review.user.name}</div>
                                        {review.is_verified_purchase && (
                                            <span className="text-xs text-green-600 flex items-center">Verified Purchase</span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-400 flex items-center">
                                    <Calendar size={12} className="mr-1" />
                                    {new Date(review.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="mb-3">
                                <StarRating rating={review.rating} readonly size={16} />
                            </div>

                            {review.review && (
                                <p className="text-gray-700 leading-relaxed mb-4">{review.review}</p>
                            )}

                            {/* Images and Videos */}
                            <div className="flex flex-wrap gap-2">
                                {review.images && review.images.length > 0 && (
                                    review.images.map((img, idx) => (
                                        <img
                                            key={`img-${idx}`}
                                            src={img}
                                            alt={`Review by ${review.user.name}`}
                                            className="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-90"
                                            onClick={() => window.open(img, '_blank')}
                                        />
                                    ))
                                )}
                                {review.videos && review.videos.length > 0 && (
                                    review.videos.map((vid, idx) => (
                                        <div
                                            key={`vid-${idx}`}
                                            className="relative w-20 h-20 rounded border bg-black cursor-pointer group"
                                            onClick={() => window.open(vid, '_blank')}
                                        >
                                            <video
                                                src={vid}
                                                className="w-full h-full object-cover opacity-80"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Video size={20} className="text-white" />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default ReviewList;
