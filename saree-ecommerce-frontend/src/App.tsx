import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import SettingsUpdater from './components/SettingsUpdater'; // Create a new component to handle settings
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import CollectionsPage from './pages/CollectionsPage';
import TrackOrderPage from './pages/TrackOrderPage';
import QueriesPage from './pages/QueriesPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import AddressesPage from './pages/AddressesPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SalesReportPage from './pages/SalesReportPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ShippingAndReturnsPage from './pages/ShippingAndReturnsPage';
import ReturnAndRefundPage from './pages/ReturnAndRefundPage';
import AdminBannerPage from './pages/AdminBannerPage'; // Import the new component
import AdminStaticPageEditor from './pages/AdminStaticPageEditor'; // Import the new component
import AdminStaticPagesList from './pages/AdminStaticPagesList';
import AdminSettingsPage from './pages/AdminSettingsPage'; // Import admin settings
import AdminPromotionsPage from './pages/AdminPromotionsPage'; // Import admin promotions
import AdminProductsPage from './pages/AdminProductsPage'; // Import admin products
import AdminCatalogUpload from './pages/admin/AdminCatalogUpload'; // Import new Catalog Upload
import AdminThemeManagement from './pages/AdminThemeManagement'; // Import theme management
import AdminProductEditPage from './pages/AdminProductEditPage'; // Import product edit page
import AdminHomepageSettings from './pages/AdminHomepageSettings'; // Import homepage settings
import AdminPaymentSettings from './pages/AdminPaymentSettings'; // Import payment settings
import AdminPaymentGatewaysPage from './pages/AdminPaymentGatewaysPage'; // Import the new payment gateways page
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminOrderDetailPage from './pages/AdminOrderDetailPage';
import AdminCustomersPage from './pages/AdminCustomersPage';
import AdminCustomerDetailsPage from './pages/AdminCustomerDetailsPage';
import OrderSuccessPage from './pages/OrderSuccessPage'; // Import order success page
import ProductFiltersAdvanced from './components/product/ProductFiltersAdvanced'; // Import ProductFiltersAdvanced
import StaticPageViewer from './pages/StaticPageViewer';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <WishlistProvider>
            <NotificationProvider>
              <Router>
                <Layout>
                  <SettingsUpdater />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products-filter-test" element={<ProductFiltersAdvanced />} /> {/* New route for filter test */}
                    <Route path="/category/:slug" element={<ProductsPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/ethnic-wear" element={<CollectionsPage />} />
                    <Route path="/track-order" element={<TrackOrderPage />} />
                    <Route path="/queries" element={<QueriesPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/order/:id" element={<OrderDetailPage />} />
                    <Route path="/addresses" element={<AddressesPage />} />
                    <Route path="/change-password" element={<ChangePasswordPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/sales-report" element={<SalesReportPage />} />
                    <Route path="/about-us" element={<AboutUsPage />} />
                    <Route path="/contact-us" element={<ContactUsPage />} />
                    <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/shipping-and-returns" element={<ShippingAndReturnsPage />} />
                    <Route path="/return-and-refund-policy" element={<ReturnAndRefundPage />} />
                    <Route path="/admin/banners" element={<AdminBannerPage />} /> {/* Banner management */}
                    <Route path="/admin/static-pages" element={<AdminStaticPagesList />} />
                    <Route path="/admin/static-pages/create" element={<AdminStaticPageEditor title="Create Static Page" />} />
                    <Route path="/admin/static-pages/:slug/edit" element={<AdminStaticPageEditor />} />
                    <Route path="/admin/settings" element={<AdminSettingsPage />} /> {/* Admin settings */}
                    <Route path="/admin/homepage" element={<AdminHomepageSettings />} /> {/* Homepage settings */}
                    <Route path="/admin/promotions" element={<AdminPromotionsPage />} /> {/* Admin promotions */}
                    <Route path="/admin/products" element={<AdminProductsPage />} /> {/* Admin products */}
                    <Route path="/admin/products/create" element={<AdminCatalogUpload />} /> {/* Catalog Upload Wizard */}
                    <Route path="/admin/products/:id/edit" element={<AdminProductEditPage />} /> {/* Product edit */}
                    <Route path="/admin/themes" element={<AdminThemeManagement />} /> {/* Theme management */}
                    <Route path="/admin/payment-settings" element={<AdminPaymentSettings />} /> {/* Payment settings */}
                    <Route path="/admin/payment-gateways" element={<AdminPaymentGatewaysPage />} /> {/* New Payment Gateways Management */}
                    <Route path="/admin/orders" element={<AdminOrdersPage />} />
                    <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
                    <Route path="/admin/customers" element={<AdminCustomersPage />} />
                    <Route path="/admin/customers/:id" element={<AdminCustomerDetailsPage />} />
                    <Route path="/order-success" element={<OrderSuccessPage />} /> {/* Order success */}
                    {/* Admin routes for static pages */}
                    <Route
                      path="/admin/about-us-content"
                      element={<AdminStaticPageEditor pageName="about-us" title="Edit About Us Content" />}
                    />
                    <Route
                      path="/admin/contact-us-content"
                      element={<AdminStaticPageEditor pageName="contact-us" title="Edit Contact Us Content" />}
                    />
                    {/* Catch-all SEO-friendly static pages (render by slug) */}
                    <Route path="/:slug" element={<StaticPageViewer />} />
                  </Routes>
                </Layout>
              </Router>
            </NotificationProvider>
          </WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App