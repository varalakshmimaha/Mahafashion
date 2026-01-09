# Saree Ecommerce Frontend

This project is a React-based frontend for a saree e-commerce application, built with Vite and styled using Tailwind CSS. It features a responsive design, product listing, product detail pages, a shopping cart, a wishlist, and a multi-step checkout process, leveraging React Context for state management.

## Setup

To get this project up and running, follow these steps:

1.  **Navigate to the project directory:**
    ```bash
    cd saree-ecommerce-frontend
    ```

2.  **Install Dependencies:**
    First, install the standard project dependencies:
    ```bash
    npm install
    ```
    Next, due to limitations in automated installation during development, you will need to manually install a few additional packages:
    ```bash
    npm install @tailwindcss/forms swiper react-router-dom react-icons
    ```

3.  **Create Asset Directories (Manual Step):**
    The application expects certain image assets to be present. Please create the following directories inside the `public/` folder and place appropriate image files within them. You can use placeholder images initially.

    *   `public/banners/` (e.g., `banner1.jpg`, `banner2.jpg`, `banner3.jpg` as referenced in `HeroBanner.tsx`)
    *   `public/blog/` (e.g., `draping.jpg`, `fabrics.jpg`, `styling.jpg` as referenced in `BlogSection.tsx`)
    *   `public/sarees/` (e.g., `saree1.jpg`, `saree1_1.jpg`, etc., as referenced in `mock.ts` and `ProductCard.tsx`)

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

    The application should now be running on `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

The project is organized as follows:

*   `src/`: Contains all the React source code.
    *   `App.tsx`: Main application component with routing.
    *   `main.tsx`: Entry point for the React application.
    *   `index.css`: Tailwind CSS imports and global styles.
    *   `components/`: Reusable UI components.
        *   `cart/`: Components related to the shopping cart.
        *   `checkout/`: Components for the checkout process.
        *   `home/`: Components specific to the home page (e.g., HeroBanner, CategoryGrid).
        *   `layout/`: Layout components (Header, Footer, Layout wrapper).
        *   `product/`: Components for product display (ProductCard, ProductFilters, ProductGallery, etc.).
        *   `ui/`: Generic UI components (Button).
    *   `context/`: React Context providers for global state management.
        *   `AuthContext.tsx`: Manages user authentication state.
        *   `CartContext.tsx`: Manages shopping cart state.
        *   `NotificationContext.tsx`: Manages in-app notifications.
        *   `WishlistContext.tsx`: Manages wishlist state.
    *   `data/`: Mock data for development purposes (`mock.ts`).
    *   `pages/`: Top-level page components.
        *   `HomePage.tsx`
        *   `ProductsPage.tsx`
        *   `ProductDetailPage.tsx`
        *   `CartPage.tsx`
        *   `CheckoutPage.tsx`
        *   `WishlistPage.tsx`
    *   `types/`: TypeScript type definitions.
    *   `utils/`: Utility functions.

## Features Implemented

*   **Responsive Layout:** Built with Tailwind CSS.
*   **Routing:** Using `react-router-dom` for navigation between pages.
*   **Home Page:** Features hero banners, category grids, featured collections, testimonials, and a blog section.
*   **Product Listing:** Displays a grid of sarees with filtering and sorting options.
*   **Product Detail Page:** Shows detailed product information, image gallery, color/blouse options, and add-to-cart functionality.
*   **Shopping Cart:** Allows users to add, remove, and update quantities of products in their cart.
*   **Wishlist:** Users can add and remove products from their wishlist.
*   **Checkout Process:** A multi-step form for shipping, payment, and order review.
*   **Global State Management:** Using React Context for authentication, cart, wishlist, and notifications.
*   **Mock Data:** Utilizes `mock.ts` for product and category data during development.

## Further Development

*   **Backend Integration:** Connect the frontend to a real API for product data, authentication, order processing, etc.
*   **Form Validation:** Implement comprehensive validation for all forms.
*   **User Profiles:** Expand authentication to include user profiles and order history.
*   **Search Functionality:** Add a robust search bar for products.
*   **Payment Gateway Integration:** Integrate with a secure payment gateway for actual transactions.
*   **Error Handling:** More sophisticated error handling and display for API calls.
*   **Accessibility:** Improve accessibility features for all users.
*   **Testing:** Add unit, integration, and end-to-end tests.
