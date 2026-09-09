import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIChatbot from "./components/AIChatbot";
import SocialAdPopup from "./components/SocialAdPopup";
import FloatingContact from "./components/FloatingContact";
import InstagramNotificationBanner from "./components/InstagramNotificationBanner";
import { PageSkeletonLoader } from "./components/SkeletonLoader";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ErrorBoundary from "./components/ErrorBoundary";
import { scrollToTop } from "./hooks/useLenis";
import { registerServiceWorker } from "./services/notificationService";

// Lazy-loaded pages with code-splitting for optimal Safari performance & seamless skeleton transitions
const Home = lazy(() => import("./components/Home"));
const AboutPage = lazy(() => import("./components/AboutPage"));
const ServicesPage = lazy(() => import("./components/ServicesPage"));
const SubsidyPage = lazy(() => import("./components/SubsidyPage"));
const ContactPage = lazy(() => import("./components/ContactPage"));
const MediaPage = lazy(() => import("./components/MediaPage"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const CustomerDashboard = lazy(() => import("./components/CustomerDashboard"));
const ProfilePage = lazy(() => import("./components/ProfilePage"));
const LoginPage = lazy(() => import("./components/LoginPage"));

// Helper component to scroll window to top on route navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    scrollToTop(false);
  }, [pathname]);
  return null;
}

function MainLayout() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="font-body min-h-screen bg-slate-50 text-ink flex flex-col justify-between relative z-10">
      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        <div>
          <Navbar />
          <main>
            <ErrorBoundary>
              <Suspense fallback={<PageSkeletonLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/subsidy" element={<SubsidyPage />} />
                  <Route path="/media" element={<MediaPage />} />
                  <Route path="/blog" element={<MediaPage />} />
                  <Route path="/blog-2" element={<MediaPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/dashboard" element={<CustomerDashboard />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
        {!isAdminPage && <Footer />}
      </div>

      {/* ── Global Floating Contact Bar, AI Chat & Back To Top ── */}
      {!isAdminPage && <FloatingContact />}
      {!isAdminPage && <AIChatbot />}
      <ScrollToTopButton />
      {!isAdminPage && <SocialAdPopup />}

      {/* ── Instagram-Style Admin Push Notification Toast ── */}
      <InstagramNotificationBanner />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    // Register Service Worker for PWA download and Push Notification Alerts
    registerServiceWorker();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <MainLayout />
    </BrowserRouter>
  );
}
