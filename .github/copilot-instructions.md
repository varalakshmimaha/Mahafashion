# AI Coding Agent Instructions for Suwish Saree E-Commerce Platform

## Project Overview
A full-stack saree e-commerce application with a **React/TypeScript/Tailwind CSS frontend** (Vite) and **Laravel backend**. The architecture uses Context API for state management, REST API for communication, and focuses on user workflows: browsing products, cart management, checkout, and admin features.

## Architecture

### Frontend (`saree-ecommerce-frontend/`)
- **Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, React Router v6
- **Build**: `npm run build` (TypeScript compilation + Vite bundling)
- **Dev Server**: `npm run dev` (runs on port 5173)
- **State Management**: React Context (not Redux) - separate contexts for Auth, Cart, Wishlist, Notifications, Theme
- **Key Files**:
  - `saree-ecommerce-frontend/src/App.tsx` - routing setup with nested contexts
  - `saree-ecommerce-frontend/src/services/api.ts` - centralized API layer (1000+ LOC with all endpoints)
  - `saree-ecommerce-frontend/src/context/` - global state (CartContext, AuthContext, WishlistContext, etc.)

### Backend (`suwish/`)
- **Tech Stack**: Laravel, PHP, SQLite/MySQL, Eloquent ORM
- **Key Endpoints**: All `/api` routes defined in `suwish/routes/api.php`
- **Controllers**: `suwish/app/Http/Controllers/Api/` (ProductController, CartController, OrderController, AuthController, etc.)
- **Models**: `suwish/app/Models/` (Product, Order, User, Cart, Wishlist, etc.)
- **Base URL**: `http://127.0.0.1:8000/api` (configured in frontend api.ts)

### Data Flow Pattern
1. **Frontend** → calls `productAPI.getProducts()` or `cartAPI.addToCart()` from `saree-ecommerce-frontend/src/services/api.ts`
2. **API Layer** → sends HTTP request to Laravel endpoint with auth token (stored in localStorage as `authToken`)
3. **Controller** → validates input, queries Eloquent models, returns JSON resource
4. **Frontend** → updates React Context state, re-renders components

## Critical Conventions

### Frontend Context Usage (State Management)
- **Always** use context hooks (`useCart()`, `useAuth()`, `useWishlist()`) rather than props drilling
- **Never** create Redux stores - use Context for all global state
- Example: `const { cartItems, addToCart } = useCart();`
- Contexts sync with backend on authentication changes and provide local state fallback

### API Integration Pattern
- All API calls go through `saree-ecommerce-frontend/src/services/api.ts` using object-based API modules: `productAPI`, `cartAPI`, `authAPI`, etc.
- Auth token passed via `Authorization` header (retrieved from localStorage)
- **Never** call fetch directly in components - use API service
- Response format: typically `{ data: ... }` (unwrap in components)

### Component Organization
```
components/
├── cart/          # Cart-specific UI (CartItem, CartSummary)
├── checkout/      # Multi-step checkout form
├── home/          # Home page sections (HeroBanner, FeaturedProducts)
├── layout/        # Header, Footer, Layout wrapper
├── product/       # ProductCard, ProductGallery, ProductFilters
└── ui/            # Generic reusable components (Button)
```
- Keep components focused on single responsibility
- Use composition over prop drilling

### Product Model & Filtering
- **Frontend Filter**: `saree-ecommerce-frontend/src/pages/ProductsPage.tsx` - handles UI for category, price, fabric, color, occasion
- **Backend Filter**: `suwish/app/Http/Controllers/Api/ProductController.php` - implements query filtering
- **Flags for Homepage**: Products marked with `is_trending`, `is_new_arrival`, `is_ethnic_wear`, `is_suwish_collection` boolean fields

### Authentication Flow
1. `AuthContext` manages `isAuthenticated`, `user`, `token`
2. Login endpoint returns token → stored in localStorage
3. All subsequent requests include token in Authorization header
4. On logout, token removed and contexts reset

## Development Workflows

### Starting Development
```bash
cd saree-ecommerce-frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

### Building Frontend
```bash
npm run build  # Outputs to dist/
```

### Backend Setup (Laravel)
```bash
cd suwish
composer install
php artisan migrate  # Runs migrations
php artisan serve    # Runs on http://localhost:8000
```

### Key Scripts in Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - TypeScript + Vite production build
- `npm run preview` - Preview production build locally

## Project-Specific Patterns

### Image Asset Handling
- Product images stored in `public/sarees/` (e.g., `saree1.jpg`, `saree1_1.jpg`)
- Blog images in `public/blog/`, banners in `public/banners/`
- Product model has `image_url` (primary) and `image_urls` array (gallery)
- Frontend may use either field - handle missing images gracefully

### Cart & Checkout Flow
1. Add to cart with options: color, blouse option, size
2. Cart stored in both **localStorage** (offline) and **database** (authenticated users)
3. On login, cart synced from database
4. Checkout is multi-step: shipping → payment → order review
5. Payment via Razorpay (not yet integrated - placeholder exists)

### Admin Features
- Admin endpoints in `suwish/routes/api.php` (routes starting with `admin/`)
- Admin pages: Banner management, Static page editor, Theme settings, Product editing, Promotions
- Routing protected by middleware (check `AuthMiddleware` in `suwish/app/Http/Middleware/`)

### Theme & Settings Management
- `saree-ecommerce-frontend/src/pages/AdminThemeManagement.tsx` page for theme customization
- Settings API endpoint returns both public and admin settings
- Theme stored in `Theme` model, settings in `Setting` model

## Common Tasks

### Adding a New Product Filter
1. Add filter field to `saree-ecommerce-frontend/src/pages/ProductsPage.tsx` UI state
2. Add parameter to `productAPI.getProducts()` call in `saree-ecommerce-frontend/src/services/api.ts`
3. Add WHERE clause in `suwish/app/Http/Controllers/Api/ProductController.php` index method
4. Test in browser and check backend logs

### Adding a New Page
1. Create page component in `saree-ecommerce-frontend/src/pages/`
2. Add route in `saree-ecommerce-frontend/src/App.tsx`
3. Add navigation link in `saree-ecommerce-frontend/src/components/layout/Header.tsx`
4. If requires backend data, create API service method

### Adding an Admin Endpoint
1. Create method in appropriate controller (e.g., `suwish/app/Http/Controllers/Api/ProductController.php`)
2. Register route in `suwish/routes/api.php` under admin middleware group
3. Add API service method in `saree-ecommerce-frontend/src/services/api.ts`
4. Create or update admin page component

## Debugging Tips

### Frontend
- Check browser console for fetch errors (API_BASE_URL must match running backend)
- Verify localStorage contains `authToken` when testing authenticated features
- React DevTools to inspect Context state values

### Backend
- Check `storage/logs/laravel.log` for errors
- Use `dd()` or `Log::info()` in controllers for debugging
- Verify migrations ran: `php artisan migrate:status`

### API Communication
- Frontend sends to `http://127.0.0.1:8000/api/*`
- Ensure Laravel backend running on port 8000
- CORS must be configured in `suwish/config/cors.php`

## Important Notes

- **No test suite exists yet** - testing is listed as future development
- **Payment gateway (Razorpay)** is referenced but not fully integrated
- **Mock data** in `saree-ecommerce-frontend/src/data/mock.ts` used for development - replace with API calls in production
- **Accessibility features** are incomplete - improvements listed as future work
- **Environment configuration**: Frontend hardcodes `API_BASE_URL` - consider moving to `.env` file
