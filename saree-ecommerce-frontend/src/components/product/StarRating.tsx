import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    onRate?: (rating: number) => void;
    size?: number;
    className?: string;
    readonly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    maxRating = 5,
    onRate,
    size = 20,
    className = '',
    readonly = false
}) => {
    const [hoverRating, setHoverRating] = React.useState<number | null>(null);

    const handleMouseEnter = (index: number) => {
        if (!readonly && onRate) {
            setHoverRating(index);
        }
    };

    const handleMouseLeave = () => {
        if (!readonly && onRate) {
            setHoverRating(null);
        }
    };

    const handleClick = (index: number) => {
        if (!readonly && onRate) {
            onRate(index);
        }
    };

    const renderStars = () => {
        const stars = [];
        const currentRating = hoverRating !== null ? hoverRating : rating;

        for (let i = 1; i <= maxRating; i++) {
            const isFull = i <= currentRating;
            const isHalf = !isFull && i - 0.5 <= currentRating; // Simple logic, mostly full stars used for input

            stars.push(
                <div
                    key={i}
                    className={`cursor-${readonly ? 'default' : 'pointer'} ${className}`}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(i)}
                >
                    {isFull ? (
                        <Star
                            size={size}
                            className={`${readonly ? 'text-yellow-400' : 'text-yellow-400 hover:scale-110 transition-transform'} fill-current`}
                        />
                    ) : isHalf ? (
                        // Only showing half stars for display, not input
                        <StarHalf
                            size={size}
                            className="text-yellow-400 fill-current"
                        />
                    ) : (
                        <Star
                            size={size}
                            className={`${readonly ? 'text-gray-300' : 'text-gray-300 hover:text-yellow-200'} `}
                        />
                    )}
                </div>
            );
        }
        return stars;
    };

    return (
        <div className="flex items-center space-x-1">
            {renderStars()}
        </div>
    );
};

export default StarRating;
