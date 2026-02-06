export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  status: string;
  parent_id: number | null;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  is_active: boolean;
  category_slug: string;
}

export interface ProductColor {
  id: string;
  name: string;
  hexCode: string;
  images: {
    main: string;
    gallery: string[];
    thumbnails: string[];
  };
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  color_code: string | null;
  sort_order: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  color_code: string;
  color_name: string;
  size: string;
  stock: number;
  price?: number;
  mrp?: number;
  discount?: number;
  price_adjustment: number;
  sku: string | null;
  images?: string[]; // Images for this color variant
  created_at: string;
  updated_at: string;
}

export interface SareeProduct {
  id: string;
  name: string;
  price: number;
  fabric: string;
  color: string;  // Default/main color
  occasion: string;
  workType: string;
  imageUrl: string;
  imageUrls: string[];
  description: string;
  careInstructions: string;
  blouseIncluded: boolean;
  drapeLength: number;
  rating: number;
  reviewCount: number;
  sku?: string;
  stockQuantity?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isTopRated?: boolean;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
  fabricType?: string | null;
  brand?: string | null;
  discount?: number;
  final_price?: number; // Price after discount (what customer pays)
  discounted_price?: number; // Alias for final_price
  colors?: ProductColor[]; // Array of color variants with their images (legacy)
  images?: ProductImage[]; // New: Database product images
  variants?: ProductVariant[]; // New: Database product variants
  category?: Category;
  primarySubcategory?: SubCategory;
  defaultColor?: string;
}

export interface CartItem {
  id: string;
  product: SareeProduct;
  quantity: number;
  selectedColor: string;
  selectedSize?: string;
  blouseOption: string;
  price?: number;
  variantId?: number;
  variantPrice?: number;
  variantMrp?: number;
  variantDiscount?: number;
}

export interface FilterState {
  priceRange: [number, number];
  fabrics: string[];
  colors: string[];
  occasions: string[];
  sortBy: 'price-low-high' | 'price-high-low' | 'newest';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  is_admin?: boolean;
  addresses: Address[];
  shipping_name?: string;
  shipping_phone?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_pincode?: string;
  receive_email_notifications?: boolean;
  receive_sms_notifications?: boolean;
  date_of_birth?: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  orderDate: string;
  trackingNumber?: string;
}
