import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Phone,
  Home as HomeIcon,
  Info,
  Zap,
  Sun,
  Newspaper,
  Mail,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: HomeIcon, desc: "Welcome & Solar Overview" },
  { to: "/about", label: "About", icon: Info, desc: "550+ Projects & Story" },
  { to: "/services", label: "Services", icon: Zap, desc: "Rooftop, Commercial & MW" },
  { to: "/subsidy", label: "Subsidy", icon: Sun, desc: "PM Surya Ghar ₹78,000" },
  { to: "/media", label: "Media", icon: Newspaper, desc: "Guides, Videos & Updates" },
  { to: "/contact", label: "Contact", icon: Mail, desc: "Free Survey & Office" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Track scroll for frosted glass depth
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Manage body class for floating widgets when dropdown is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }
    return () => document.body.classList.remove("mobile-menu-open");
  }, [mobileMenuOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <div className="fixed top-3 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none">
      <div className="max-w-7xl mx-auto relative pointer-events-auto" ref={dropdownRef}>
        
        {/* ── Main Floating Bar ── */}
        <header
          className={`w-full rounded-2xl sm:rounded-full bg-white/95 text-slate-900 border border-slate-200/90 shadow-xl backdrop-blur-2xl px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all duration-300 ${
            scrolled ? "shadow-2xl ring-1 ring-slate-900/5 bg-white/98" : ""
          }`}
        >
          {/* Left: Full Brand Logo with Icon & Name (Larger & More Prominent) */}
          <Link to="/" className="shrink-0 flex items-center group py-0.5" title="Run Hi Tech Solar">
            <img
              src="/logo.png"
              alt="Run Hi Tech Solar"
              className="h-9 sm:h-11 md:h-12 w-auto object-contain group-hover:scale-102 transition-transform"
            />
          </Link>

          {/* Center: Desktop Navigation Tabs (Hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60">
            {NAV_ITEMS.map((item) => {
              const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`px-4 lg:px-5 py-2 rounded-full text-xs lg:text-sm font-bold tracking-tight transition-all duration-200 ${
                    isActive
                      ? "bg-[#0B1E40] text-white shadow-xs"
                      : "text-[#0B1E40] hover:text-blue-600 hover:bg-white/80"
                  }`}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action: Call CTA & Mobile Dropdown Toggle Button */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick 1-Tap Direct Call */}
            <a
              href="tel:+919080557472"
              style={{ backgroundColor: "oklch(0.55 0.24 267.88 / 1)" }}
              className="h-9 sm:h-10 px-3.5 sm:px-5 rounded-full hover:brightness-110 active:scale-95 text-white flex items-center gap-1.5 text-xs sm:text-sm font-bold shadow-sm transition-all font-mono"
              aria-label="Call Run Hi Tech Solar"
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-white" />
              <span className="hidden sm:inline">Call Now</span>
            </a>

            {/* Mobile Dropdown Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className={`md:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border shadow-xs ${
                mobileMenuOpen
                  ? "bg-slate-900 text-white border-slate-900 rotate-90"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
              }`}
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </header>

        {/* ── Mobile Expandable Dropdown Menu Card ── */}
        <div
          className={`md:hidden mt-2 rounded-3xl bg-white/98 backdrop-blur-2xl border border-slate-200/90 shadow-2xl overflow-hidden transition-all duration-300 ease-out origin-top ${
            mobileMenuOpen
              ? "opacity-100 scale-100 translate-y-0 max-h-[520px] pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-4 max-h-0 pointer-events-none"
          }`}
        >
          {/* Top Gradient Accent Bar */}
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-blue-600 to-amber-500" />

          <div className="p-4 space-y-1.5">
            {/* Links List */}
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                    isActive
                      ? "bg-[#0B1E40] text-white font-bold shadow-sm"
                      : "text-slate-800 hover:bg-slate-100/80 active:bg-slate-200 font-semibold"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive ? "bg-white/15 text-amber-300" : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm leading-snug">{item.label}</div>
                      <div className={`text-[10px] ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? "text-amber-300 translate-x-0.5" : "text-slate-400"
                    }`}
                  />
                </NavLink>
              );
            })}

            {/* Bottom Quick Callout Card inside dropdown */}
            <div className="pt-2">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5 text-amber-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    30-Year Warranty
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">PM Surya Ghar Subsidy Up to ₹78,000</div>
                </div>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 text-[11px] font-black px-3.5 py-2 rounded-xl shadow-sm transition-all"
                >
                  Free Survey
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
