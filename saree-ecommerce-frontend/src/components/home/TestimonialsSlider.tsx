import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
    {
        quote: "The saree is absolutely beautiful! The quality is amazing and it looks even better in person. I received so many compliments.",
        author: "Priya Sharma",
        location: "Mumbai, India",
        rating: 5,
    },
    {
        quote: "I'm so happy with my purchase. The customer service was excellent and the delivery was fast. The saree is a piece of art.",
        author: "Ananya Gupta",
        location: "Delhi, India",
        rating: 5,
    },
    {
        quote: "A wonderful experience shopping with Suwish. The collection is unique and the quality is top-notch. I'll be back for more.",
        author: "Sneha Patel",
        location: "Ahmedabad, India",
        rating: 5,
    },
]

const TestimonialsSlider = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-serif font-bold text-center mb-8">What Our Customers Say</h2>
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 7000 }}
                loop={true}
            >
                {testimonials.map((testimonial, index) => (
                    <SwiperSlide key={index}>
                        <div className="text-center max-w-2xl mx-auto">
                            <div className="text-yellow-400 flex justify-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                                ))}
                            </div>
                            <p className="text-xl italic text-gray-700">"{testimonial.quote}"</p>
                            <p className="mt-4 font-semibold text-gray-800">{testimonial.author}</p>
                            <p className="text-gray-500">{testimonial.location}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default TestimonialsSlider;
