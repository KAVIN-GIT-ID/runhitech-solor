import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser, refreshUserSessionFromDB, AppUser } from "../services/authService";
import { scrollToTop } from "../hooks/useLenis";
import GoogleAuthModal from "./GoogleAuthModal";
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
  User,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  ArrowRight
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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState<AppUser | null>(getCurrentUser());
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleAuthChange = () => setUser(getCurrentUser());
    window.addEventListener("runhitech_auth_state_changed", handleAuthChange);
    refreshUserSessionFromDB();
    return () => window.removeEventListener("runhitech_auth_state_changed", handleAuthChange);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Track scroll for frosted glass depth with rAF throttling (zero redundant re-renders)
  useEffect(() => {
    let ticking = false;
    let lastScrolled = window.scrollY > 15;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const isScrolled = window.scrollY > 15;
        if (isScrolled !== lastScrolled) {
          lastScrolled = isScrolled;
          setScrolled(isScrolled);
        }
        ticking = false;
      });
    };
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
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen, profileDropdownOpen]);

  const handleLogout = () => {
    logoutUser();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    if (location.pathname === "/") {
      e.preventDefault();
      scrollToTop(true);
    } else {
      scrollToTop(true);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-4 md:px-6 pt-2.5 sm:pt-3 md:pt-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto" ref={dropdownRef}>
          
          {/* Main Floating Navbar Header Pill */}
          <header
            className={`w-full rounded-full transition-all duration-300 flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 ${
              scrolled
                ? "bg-white/98 shadow-lg shadow-slate-900/8 border border-slate-200/90"
                : "bg-white/95 shadow-md shadow-slate-900/5 border border-slate-200/70"
            }`}
          >
            {/* Left: Brand Logo */}
            <Link
              to="/"
              onClick={handleLogoClick}
              className="flex items-center gap-2 group transition-transform active:scale-98 cursor-pointer"
              aria-label="Run Hi Tech Solar Home - Back to Top"
            >
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
                    onClick={(e) => {
                      if (item.to === "/" && location.pathname === "/") {
                        e.preventDefault();
                        scrollToTop(true);
                      }
                    }}
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

            {/* Right Action: Admin Dashboard Button / User Profile Menu / Call CTA */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              
              {/* 1. ADMIN USER: Show Admin Dashboard Button on Header */}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="h-9 sm:h-10 px-3 sm:px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-amber-400 flex items-center gap-1.5 text-xs font-bold transition-all border border-amber-400/30 shadow-md"
                  title="Admin CRM Dashboard"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden lg:inline">Admin Dashboard</span>
                  <span className="lg:hidden">Admin</span>
                </Link>
              )}

              {/* 2. AUTHENTICATED USER (Admin or Customer) -> Profile Dropdown Menu */}
              {user ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setProfileDropdownOpen((prev) => !prev)}
                    className="h-9 sm:h-10 px-2 sm:px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 text-xs font-bold transition-all border border-slate-200 cursor-pointer shadow-xs"
                    aria-label="User Account Menu"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold overflow-hidden shrink-0">
                      {user.picture ? (
                        <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name.slice(0, 1)
                      )}
                    </div>
                    <span className="hidden sm:inline max-w-[90px] truncate">{user.name.split(" ")[0]}</span>
                  </button>

                  {/* iOS User Dropdown Menu Card */}
                  {profileDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-64 bg-white rounded-3xl p-3 shadow-2xl border border-slate-200/90 space-y-2 animate-in fade-in zoom-in-95 duration-150 z-50 text-left"
                      style={{ boxShadow: "0 20px 50px -10px rgba(0,0,0,0.15)" }}
                    >
                      {/* User Info Header */}
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="font-bold text-xs text-slate-900 truncate">{user.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                        <div className="pt-1">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            user.role === "admin"
                              ? "bg-amber-50 border-amber-300 text-amber-800"
                              : "bg-blue-50 border-blue-200 text-blue-700"
                          }`}>
                            {user.role === "admin" ? "⭐ Super Admin" : "👤 Verified Customer"}
                          </span>
                        </div>
                      </div>

                      {/* Menu Links */}
                      <div className="space-y-1">
                        {user.role === "admin" ? (
                          <Link
                            to="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-amber-500" />
                            <span>Admin CRM</span>
                          </Link>
                        ) : (
                          <Link
                            to="/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors"
                          >
                            <Sun className="w-4 h-4 text-amber-500" />
                            <span>My Solar Subsidy</span>
                          </Link>
                        )}

                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors"
                        >
                          <User className="w-4 h-4 text-blue-600" />
                          <span>My Account Profile</span>
                        </Link>
                      </div>

                      {/* Log Out Action */}
                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-red-50 text-red-600 text-xs font-bold transition-colors cursor-pointer text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              ) : (
                /* 3. LOGGED OUT: Clean iOS Glass Modal Sign In Trigger */
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="h-9 sm:h-10 px-3 sm:px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 text-xs font-bold transition-all border border-slate-200 cursor-pointer shadow-xs"
                  title="Sign In with Google"
                >
                  <User className="w-3.5 h-3.5 text-slate-700" />
                  <span className="inline">Sign In</span>
                </button>
              )}

              {/* Quick 1-Tap Direct Call */}
              <a
                href="tel:+919080557472"
                style={{ backgroundColor: "oklch(0.55 0.24 267.88 / 1)" }}
                className="h-9 sm:h-10 px-3.5 sm:px-5 rounded-full hover:brightness-110 active:scale-95 text-white flex items-center gap-1.5 text-xs sm:text-sm font-bold shadow-sm transition-all font-sans"
                aria-label="Call Run Hi Tech Solar"
              >
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-white" />
                <span className="hidden sm:inline tracking-normal">Call Now</span>
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
            className={`md:hidden mt-2 rounded-3xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden transition-all duration-300 ease-out origin-top ${
              mobileMenuOpen
                ? "opacity-100 scale-100 translate-y-0 max-h-[580px] pointer-events-auto"
                : "opacity-0 scale-95 -translate-y-4 max-h-0 pointer-events-none"
            }`}
          >
            {/* Top Gradient Accent Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-blue-600 to-amber-500" />

            <div className="p-4 space-y-1.5">
              
              {/* If Logged in, show User Card in mobile drawer */}
              {user && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden">
                      {user.picture ? <img src={user.picture} alt={user.name} className="w-full h-full object-cover" /> : user.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-tight">{user.name}</div>
                      <div className="text-[10px] text-slate-400">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-bold"
                    title="Log Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* If Admin, show Admin CRM shortcut inside mobile menu */}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 text-amber-400 font-bold border border-amber-400/30 mb-2"
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 text-amber-400" />
                    <span>Admin Dashboard</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              {/* Links List */}
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      if (item.to === "/" && location.pathname === "/") {
                        e.preventDefault();
                        scrollToTop(true);
                      }
                    }}
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

              {/* Profile Page Link in Mobile */}
              {user && (
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl text-slate-800 hover:bg-slate-100 font-semibold"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm leading-snug">My Account Profile</div>
                      <div className="text-[10px] text-slate-400">View activity & credentials</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              )}

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

      {/* ── iOS White Glassmorphic Google Sign In Modal ── */}
      <GoogleAuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
}
