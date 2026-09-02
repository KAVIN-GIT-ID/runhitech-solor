import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import AboutPage from "./components/AboutPage";
import ServicesPage from "./components/ServicesPage";
import SubsidyPage from "./components/SubsidyPage";
import ContactPage from "./components/ContactPage";
import MediaPage from "./components/MediaPage";
import AIChatbot from "./components/AIChatbot";
import SocialAdPopup from "./components/SocialAdPopup";
import FloatingContact from "./components/FloatingContact";
import { useLenis } from "./hooks/useLenis";

// Helper component to scroll window to top on route navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  useLenis(); // 🌊 Lenis smooth scroll — active on all pages
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="font-body min-h-screen bg-dark-950 text-ink flex flex-col justify-between relative z-10">
        
        <div className="relative z-10 flex flex-col min-h-screen justify-between">
          <div>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/subsidy" element={<SubsidyPage />} />
                <Route path="/media" element={<MediaPage />} />
                <Route path="/blog" element={<MediaPage />} />
                <Route path="/blog-2" element={<MediaPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>

        {/* ── Global Floating Contact Bar, AI Chat & Social Ad Popups ── */}
        <FloatingContact />
        <AIChatbot />
        <SocialAdPopup />

      </div>
    </BrowserRouter>
  );
}
