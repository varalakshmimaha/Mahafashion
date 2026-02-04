import React, { useState } from 'react';
import StarRating from './StarRating';
import { reviewAPI } from '../../services/api';
import { Upload, X, Video } from 'lucide-react';

interface ReviewFormProps {
    productId: string;
    onSuccess: () => void;
    onCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSuccess, onCancel }) => {
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [videos, setVideos] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files);
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newVideos = Array.from(e.target.files);
            // Optional: Client-side validation for duration or size could go here
            setVideos(prev => [...prev, ...newVideos]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeVideo = (index: number) => {
        setVideos(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('product_id', productId);
            formData.append('rating', rating.toString());
            formData.append('review', review);

            images.forEach((image, index) => {
                formData.append(`images[${index}]`, image);
            });

            videos.forEach((video, index) => {
                formData.append(`videos[${index}]`, video);
            });

            await reviewAPI.submitReview(formData);
            setReview('');
            setImages([]);
            setVideos([]);
            setRating(5);
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to submit review. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-lg font-bold mb-4 font-playfair">Write a Review</h3>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <StarRating rating={rating} onRate={setRating} size={28} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-maroon-500 focus:border-maroon-500 p-2 border"
                        rows={4}
                        placeholder="What did you like or dislike?"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add Photos & Videos</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {images.map((img, idx) => (
                            <div key={`img-${idx}`} className="relative group">
                                <img
                                    src={URL.createObjectURL(img)}
                                    alt="preview"
                                    className="w-20 h-20 object-cover rounded border"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm hover:bg-red-600"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        {videos.map((vid, idx) => (
                            <div key={`vid-${idx}`} className="relative group">
                                <video
                                    src={URL.createObjectURL(vid)}
                                    className="w-20 h-20 object-cover rounded border bg-black"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeVideo(idx)}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm hover:bg-red-600 z-10"
                                >
                                    <X size={12} />
                                </button>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <Video size={16} className="text-white opacity-80" />
                                </div>
                            </div>
                        ))}

                        <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 text-gray-400 hover:bg-gray-50 transition-colors" title="Add Images">
                            <Upload size={20} />
                            <span className="text-[10px] mt-1">Images</span>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>

                        <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 text-gray-400 hover:bg-gray-50 transition-colors" title="Add Videos">
                            <Video size={20} />
                            <span className="text-[10px] mt-1">Videos</span>
                            <input
                                type="file"
                                multiple
                                accept="video/*"
                                className="hidden"
                                onChange={handleVideoChange}
                            />
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-2 space-x-3">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-maroon-600 text-white rounded-md hover:bg-maroon-700 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default ReviewForm;
