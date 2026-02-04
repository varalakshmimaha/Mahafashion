import React, { useState, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { SareeProduct } from '../../types';
import { API_STORAGE_URL } from '../../services/api';
import { ZoomIn, X, ChevronLeft, ChevronRight, Share2, Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

interface ProductGalleryProps {
  product: SareeProduct;
  selectedColorCode?: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ product, selectedColorCode }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setIsZoomed(false);
    document.body.style.overflow = '';
  };

  const goToPrevious = useCallback(() => {
    setLightboxIndex(prev => (prev === 0 ? currentImages.length - 1 : prev - 1));
  }, [currentImages.length]);

  const goToNext = useCallback(() => {
    setLightboxIndex(prev => (prev === currentImages.length - 1 ? 0 : prev + 1));
  }, [currentImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomOpen) {
        if (e.key === 'Escape') closeZoom();
        return;
      }
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, isZoomOpen, goToPrevious, goToNext]);

  // Toggle body class to prevent background scroll when zoom modal is open
  useEffect(() => {
    document.body.classList.toggle('zoom-open', isZoomOpen);
    if (isZoomOpen) {
      document.body.style.overflow = 'hidden';
    } else if (!isLightboxOpen) {
      document.body.style.overflow = '';
    }
  }, [isZoomOpen, isLightboxOpen]);

  const openZoom = (imageUrl: string) => {
    setZoomImage(imageUrl);
    setIsZoomOpen(true);
  };

  const closeZoom = () => {
    setIsZoomOpen(false);
    setZoomImage(null);
    document.body.classList.remove('zoom-open');
    if (!isLightboxOpen) document.body.style.overflow = '';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this beautiful ${product.name}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  useEffect(() => {
    // Priority 1: Check if product.variants has images for selected color
    if (selectedColorCode && product.variants && product.variants.length > 0) {
      const colorVariant = product.variants.find(
        v => v.color_code === selectedColorCode || (v as any).color === selectedColorCode
      );

      // Check if variant has 'images' array (as per User Request mock data)
      if (colorVariant && (colorVariant as any).images && Array.isArray((colorVariant as any).images) && (colorVariant as any).images.length > 0) {
        console.log('🖼️ Found variant images:', (colorVariant as any).images);
        const variantImages = (colorVariant as any).images.map((img: string) =>
          img.startsWith('http') ? img : `${API_STORAGE_URL}/${img}`
        );
        setCurrentImages(variantImages);
        return;
      }
    }

    // Priority 2: Database images with color variants (existing logic)
    if (product.images && product.images.length > 0) {
      let imagesToShow = product.images;

      // Filter by selected color if provided
      if (selectedColorCode) {
        console.log('🎨 Filtering by color:', selectedColorCode);
        const colorImages = product.images.filter(
          img => img.color_code?.toLowerCase() === selectedColorCode.toLowerCase()
        );
        console.log('🖼️ Found color images:', colorImages);

        // Use color-specific images if available, otherwise fall back to defaults
        if (colorImages.length > 0) {
          imagesToShow = colorImages;
        } else {
          // Fall back to default images (color_code is null)
          imagesToShow = product.images.filter(img => img.color_code === null);
          console.log('⚠️ No match found, falling back to defaults:', imagesToShow);
        }
      } else {
        // No color selected, show default images
        imagesToShow = product.images.filter(img => img.color_code === null || img.is_default);
      }

      // Sort by sort_order and map to URLs
      const imageUrls = imagesToShow
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(img => `${API_STORAGE_URL}/${img.image_url}`);

      if (imageUrls.length > 0) {
        setCurrentImages(imageUrls);
        return;
      }
    }

    // Fallback to legacy color-based images
    if (selectedColorCode && product.colors && product.colors.length > 0) {
      const selectedColor = product.colors.find(
        color => color.hexCode === selectedColorCode || color.id === selectedColorCode
      );

      if (selectedColor && selectedColor.images) {
        const images = selectedColor.images.gallery && selectedColor.images.gallery.length > 0
          ? selectedColor.images.gallery
          : [selectedColor.images.main || product.imageUrl || '/placeholder-saree.jpg'];

        setCurrentImages(images.map(img => img.startsWith('http') ? img : `${API_STORAGE_URL}/${img}`));
        return;
      }
    }

    // Fallback to default product images
    const defaultImages = product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : [product.imageUrl || '/placeholder-saree.jpg'];

    setCurrentImages(defaultImages.map(img => img.startsWith('http') ? img : `${API_STORAGE_URL}/${img}`));
  }, [selectedColorCode, product]);

  return (
    <div className="relative">
      {/* Action Buttons (hide in lightbox/zoom) */}
      {!isLightboxOpen && (
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={handleWishlistToggle}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${isInWishlist(product.id)
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-red-500'
              }`}
            title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white text-gray-600 hover:bg-gray-50 hover:text-maroon-600 flex items-center justify-center shadow-lg transition-all"
            title="Share"
          >
            <Share2 size={18} />
          </button>
        </div>
      )}

      {/* Main Swiper */}
      <Swiper
        modules={[Thumbs, Navigation, Pagination]}
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        navigation
        pagination={{ clickable: true }}
        className="mb-4 rounded-xl overflow-hidden product-gallery-swiper"
      >
        {currentImages.map((image, index) => (
          <SwiperSlide key={`main-${index}`}>
            <div
              className="relative cursor-zoom-in group"
              onClick={(e) => { e.stopPropagation(); openZoom(image); }}
            >
              <img
                src={image}
                alt={`${product.name} - Image ${index + 1}`}
                className="w-full h-auto object-cover rounded-lg aspect-[3/4]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-saree.jpg';
                }}
              />
              {/* Zoom Icon Overlay (hide in lightbox/zoom) */}
              {!isLightboxOpen && !isZoomOpen && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <ZoomIn size={24} className="text-gray-700" />
                  </div>
                </div>
              )}
              {/* Image Counter (hide in lightbox/zoom) */}
              {!isLightboxOpen && !isZoomOpen && (
                <div className="absolute bottom-4 left-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                  {index + 1} / {currentImages.length}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      <Swiper
        modules={[Thumbs]}
        onSwiper={setThumbsSwiper}
        spaceBetween={12}
        slidesPerView={5}
        watchSlidesProgress
        className="cursor-pointer thumbnail-swiper"
        breakpoints={{
          320: { slidesPerView: 4 },
          640: { slidesPerView: 5 },
          1024: { slidesPerView: 5 },
        }}
      >
        {currentImages.map((image, index) => (
          <SwiperSlide key={`thumb-${index}`}>
            <div className="aspect-square overflow-hidden rounded-lg border-2 border-transparent hover:border-maroon-400 transition-colors">
              <img
                src={image}
                alt={`${product.name} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-saree.jpg';
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Lightbox Modal (Image Only) */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          style={{ background: 'black' }}
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close zoomed image"
          >
            <X size={28} />
          </button>

          {/* Navigation Arrows */}
          {currentImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {/* Clean, centered image with object-contain and no overlays */}
          <div
            className={`max-w-[90vw] max-h-[90vh] flex items-center justify-center ${isZoomed ? 'cursor-zoom-out overflow-auto' : 'cursor-zoom-in'}`}
            style={{ background: 'transparent' }}
            onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
            onMouseMove={handleMouseMove}
          >
            <img
              src={currentImages[lightboxIndex]}
              alt={`${product.name} - Full view`}
              className={`transition-transform duration-300 object-contain ${isZoomed ? 'scale-200' : 'max-h-[90vh] max-w-[90vw]'}`}
              style={isZoomed ? { transformOrigin: `${mousePosition.x}% ${mousePosition.y}%` } : undefined}
              onError={e => { (e.target as HTMLImageElement).src = '/placeholder-saree.jpg'; }}
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white text-sm px-4 py-2 rounded-full">
            {lightboxIndex + 1} / {currentImages.length}
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
            {currentImages.map((image, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(index); }}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === lightboxIndex ? 'border-white opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                aria-label={`Show image ${index + 1}`}
              >
                <img
                  src={image}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = '/placeholder-saree.jpg'; }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TRUE Image-only Zoom Modal (separate, higher z-index) */}
      {isZoomOpen && zoomImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          onClick={closeZoom}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeZoom(); }}
            className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close zoom"
          >
            <X size={28} />
          </button>

          <img
            src={zoomImage}
            alt={`${product.name} - Zoom`}
            className="max-w-[90vw] max-h-[90vh] object-contain z-10"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-saree.jpg'; }}
          />
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        .product-gallery-swiper .swiper-button-next,
        .product-gallery-swiper .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.5);
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        .product-gallery-swiper .swiper-button-next::after,
        .product-gallery-swiper .swiper-button-prev::after {
          font-size: 18px;
        }
        .product-gallery-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
        }
        .product-gallery-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #881337;
        }
        .thumbnail-swiper .swiper-slide-thumb-active > div {
          border-color: #881337 !important;
        }
        body.zoom-open { overflow: hidden; }
        /* Hide page UI when image-only zoom is open */
        body.zoom-open header,
        body.zoom-open .product-side,
        body.zoom-open .product-tabs,
        body.zoom-open .recently-viewed,
        body.zoom-open .product-actions {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default ProductGallery;