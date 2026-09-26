import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { OrderProvider, useOrders } from './context/OrderContext';
import { Navbar, NavTab } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { MenuView } from './components/MenuView';
import { OffersView } from './components/OffersView';
import { CheckoutView } from './components/CheckoutView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { ProfileView } from './components/ProfileView';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { FloatingMobileCart } from './components/FloatingMobileCart';
import { Product, Order } from './types';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Product modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [startInCustomizeMode, setStartInCustomizeMode] = useState(false);

  const { setIsCartOpen } = useCart();
  const { setActiveTrackingOrderId } = useOrders();

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  const handleOpenProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setStartInCustomizeMode(false);
    setIsProductModalOpen(true);
  };

  const handleCustomizeProduct = (product: Product) => {
    setSelectedProduct(product);
    setStartInCustomizeMode(true);
    setIsProductModalOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setActiveTrackingOrderId(order.id);
    setCurrentTab('track');
  };

  const handleTrackOrderFromProfile = (orderId: string) => {
    setActiveTrackingOrderId(orderId);
    setCurrentTab('track');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0e12] text-slate-100 font-sans selection:bg-orange-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={setCurrentTab}
            onOpenProductDetails={handleOpenProductDetails}
            onCustomizeProduct={handleCustomizeProduct}
          />
        )}

        {currentTab === 'menu' && (
          <MenuView
            onOpenProductDetails={handleOpenProductDetails}
            onCustomizeProduct={handleCustomizeProduct}
          />
        )}

        {currentTab === 'offers' && (
          <OffersView onExploreMenu={() => setCurrentTab('menu')} />
        )}

        {currentTab === 'checkout' && (
          <CheckoutView
            onOrderSuccess={handleOrderSuccess}
            onExploreMenu={() => setCurrentTab('menu')}
          />
        )}

        {currentTab === 'track' && (
          <OrderTrackingView onExploreMenu={() => setCurrentTab('menu')} />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            onTrackOrder={handleTrackOrderFromProfile}
            onExploreMenu={() => setCurrentTab('menu')}
            onOpenProductDetails={handleOpenProductDetails}
          />
        )}

        {currentTab === 'admin' && <AdminDashboard />}

        {currentTab === 'about' && (
          <AboutView onExploreMenu={() => setCurrentTab('menu')} />
        )}

        {currentTab === 'contact' && <ContactView />}
      </main>

      {/* Floating Mobile Cart Bar */}
      {currentTab !== 'checkout' && (
        <FloatingMobileCart onOpenCart={() => setIsCartOpen(true)} />
      )}

      {/* Shopping Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setCurrentTab('checkout')}
        onExploreMenu={() => setCurrentTab('menu')}
      />

      {/* Global Product Details & Customization Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        startInCustomizeMode={startInCustomizeMode}
      />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectProduct={handleOpenProductDetails}
      />

      {/* Auth Modal (Login / Sign Up / Forgot Password) */}
      <AuthModal />

      {/* Comprehensive Brand Footer */}
      <Footer onNavigate={setCurrentTab} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <MainApp />
          </CartProvider>
        </OrderProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
