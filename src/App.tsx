import React, { useState, useLayoutEffect, useRef } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StoreAndAppBanner } from './components/StoreAndAppBanner';
import { MenuCatalog } from './components/MenuCatalog';
import { Testimonials } from './components/Testimonials';
import { InstagramSection } from './components/InstagramSection';
import { CartPage } from './components/CartPage';
import { StripeCheckoutPage } from './components/StripeCheckoutPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { MenuPage } from './components/MenuPage';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { StoreInfoModal } from './components/StoreInfoModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OwnerPortalPage } from './components/OwnerPortalPage';
import { SuperAdminPage } from './components/SuperAdminPage';
import { RoleSwitcherPill } from './components/RoleSwitcherPill';
import { PortalAuthGate } from './components/PortalAuthGate';

export function MainLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const { currentView, productDetailSource, pendingScrollCategory } = useCart();

  // The underlying page that stays mounted even when the mobile product bottom sheet is open
  const baseView = currentView === 'product' ? (productDetailSource || 'home') : currentView;
  const prevBaseViewRef = useRef(baseView);
  const prevCurrentViewRef = useRef(currentView);

  useLayoutEffect(() => {
    const baseViewChanged = prevBaseViewRef.current !== baseView;
    const returnedFromProductDesktop =
      prevCurrentViewRef.current === 'product' &&
      currentView !== 'product' &&
      typeof window !== 'undefined' &&
      window.innerWidth >= 768;

    prevBaseViewRef.current = baseView;
    prevCurrentViewRef.current = currentView;

    if ((baseViewChanged || returnedFromProductDesktop) && currentView !== 'product' && !pendingScrollCategory) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [baseView, currentView, pendingScrollCategory]);

  const renderHomeContent = () => (
    <>
      <Hero />
      <div className="relative z-10 bg-white rounded-t-[32px] md:rounded-none -mt-[32px] md:mt-0 shadow-[0_-12px_32px_rgba(0,0,0,0.12)] md:shadow-none min-h-screen">
        <StoreAndAppBanner />
        <MenuCatalog />
        <Testimonials />
        <InstagramSection />
      </div>
    </>
  );

  if (currentView === 'owner') {
    return (
      <>
        <PortalAuthGate role="owner">
          {onLogout => <OwnerPortalPage onLogout={onLogout} />}
        </PortalAuthGate>
        <RoleSwitcherPill />
      </>
    );
  }

  if (currentView === 'super-admin') {
    return (
      <>
        <PortalAuthGate role="super-admin">
          {onLogout => <SuperAdminPage onLogout={onLogout} />}
        </PortalAuthGate>
        <RoleSwitcherPill />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-[#ff5500] selection:text-white w-full max-w-full overflow-x-clip">
      {/* Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 pb-0 w-full max-w-full overflow-visible md:overflow-x-clip">
        <div className={currentView === 'product' ? 'md:hidden' : ''}>
          {baseView === 'cart' ? (
            <CartPage />
          ) : baseView === 'checkout' ? (
            <StripeCheckoutPage />
          ) : baseView === 'chi-siamo' ? (
            <AboutPage />
          ) : baseView === 'contatti' ? (
            <ContactPage />
          ) : baseView === 'menu' ? (
            <MenuPage />
          ) : (
            renderHomeContent()
          )}
        </div>
        {currentView === 'product' && <ProductDetailPage />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Overlays & Modals */}
      <CartDrawer />
      <ProductModal />
      <CheckoutModal />
      <OrderTrackerModal />
      <StoreInfoModal />
      <MobileBottomNav />
      <RoleSwitcherPill />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainLayout />
    </CartProvider>
  );
}
