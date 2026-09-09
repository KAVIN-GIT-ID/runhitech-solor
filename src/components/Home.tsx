import React, { useState, lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";
const RooftopSolarAnimation3D = lazy(() => import("./3d/RooftopSolarAnimation3D"));
import CategoryShowcase from "./CategoryShowcase";
import CategoryCalculator from "./CategoryCalculator";
import { triggerLeadNotification } from "../services/notificationService";
import {
  Sun,
  Zap,
  ShieldCheck,
  Home as HomeIcon,
  Building2,
  Battery,
  ArrowRight,
  Calculator,
  Play,
  Quote,
  Plus,
  Layers,
  Sparkles,
  Factory,
  BatteryCharging,
  CheckCircle2,
  ChevronRight,
  X
} from "lucide-react";

const districts = ["Namakkal", "Karur", "Salem", "Erode", "Tirupur", "Coimbatore"];

const testimonials = [
  {
    name: "R. Karthik",
    role: "Homeowner, Namakkal",
    text: "Our electric bill went from ₹3,400/month to ₹180. The installation team was professional and finished in just one day. Best investment we've ever made!",
    initials: "RK"
  },
  {
    name: "M. Selvan",
    role: "HPCL Station, Karur",
    text: "Run Hi Tech Solar made going solar completely hassle-free. The 30-year warranty gives us peace of mind, and the monitoring app is so easy to use.",
    initials: "MS"
  },
  {
    name: "S. Meenakshi",
    role: "Hotel Owner, Salem",
    text: "We added battery storage with our solar system. During the last grid cut, we were the only hotel on the block with canopy lights on. Incredible!",
    initials: "SM"
  }
];

const faqList = [
  {
    q: "How much does solar installation cost in Tamil Nadu?",
    a: "The cost depends on system sizing (typically 3 kW to 10 kW). For residential systems, the PM Surya Ghar Yojana provides a direct subsidy of up to ₹78,000, reducing the initial setup cost significantly. We offer flexible payment options."
  },
  {
    q: "How long does TNEB net-metering approval take?",
    a: "Grid connectivity registry and bi-directional net-meter provisioning usually take between 15 to 30 days. Our liaison team handles all structural approvals, CEIG electrical drawings, and TNEB paperwork for you."
  },
  {
    q: "What happens on cloudy days or grid cuts?",
    a: "Solar panels still generate electricity on overcast days (usually 10-25% capacity). For grid outages, you can pair your panels with LiFePO4 battery storage (Hybrid system) to enjoy uninterrupted power backup."
  },
  {
    q: "Do you offer panel performance warranties?",
    a: "Yes! We provide a 30-year manufacturer product warranty on Tier-1 panels, a 30-year linear performance output guarantee, and a 10-year engineering workmanship warranty on structures."
  }
];

export default function Home() {
  useScrollReveal();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [surveyName, setSurveyName] = useState("");
  const [surveyPhone, setSurveyPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [surveySuccess, setSurveySuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Full Name Field: Make it only accept text/letters (no numbers allowed)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^a-zA-Z\s.-]/g, "");
    setSurveyName(cleaned);
  };

  // Phone Number Field: Make it only accept numbers (no text allowed), min and max value of 10 digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
    setSurveyPhone(cleaned);
    if (cleaned.length > 0 && cleaned.length < 10) {
      setPhoneError("Mobile number must be exactly 10 digits");
    } else {
      setPhoneError("");
    }
  };

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = surveyName.trim();
    const cleanPhone = surveyPhone.replace(/\D/g, "");

    if (!cleanName) {
      return;
    }

    if (cleanPhone.length !== 10) {
      setPhoneError("Please enter a valid 10-digit mobile number");
      return;
    }

    setPhoneError("");
    triggerLeadNotification({
      name: cleanName,
      phone: cleanPhone,
      category: "residential",
      location: "Tamil Nadu"
    });

    setSurveySuccess(true);
    setShowPopup(true);
    setSurveyName("");
    setSurveyPhone("");
    setTimeout(() => setSurveySuccess(false), 8000);
  };

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="bg-[#f8fafc] text-slate-800 antialiased min-h-screen">

      <style>{`
        /* ── Hero Background Image ── */
        .hero-bg { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position: right center; }
        .hero-overlay { 
          position:absolute; 
          inset:0; 
          background: 
            linear-gradient(to bottom, rgba(248,250,252,0.85) 0%, rgba(248,250,252,0.5) 40%, rgba(248,250,252,0.1) 70%, transparent 100%),
            linear-gradient(to right, rgba(248,250,252,0.95) 0%, rgba(248,250,252,0.7) 40%, rgba(248,250,252,0.2) 65%, transparent 85%); 
          pointer-events:none; 
        }

        /* ── Light Glassmorphism ── */
        .glass { background:rgba(255,255,255,0.72); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:1px solid rgba(15, 61, 117, 0.08); box-shadow:0 4px 30px rgba(0,0,0,0.03); }
        .glass-light { background:rgba(255,255,255,0.85); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); border:1px solid rgba(15, 61, 117, 0.1); box-shadow:0 10px 40px rgba(0,0,0,0.05); }

        /* ── Animations ── */
        @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)} }
        @keyframes spin-slow { to{transform:rotate(360deg)} }
        @keyframes marquee { 0%{transform:translateX(0)}100%{transform:translateX(-50%)} }

        .float { animation:float 4s ease-in-out infinite; }
        .spin-slow { animation:spin-slow 30s linear infinite; }

        /* ── Marquee ── */
        .marquee-track { animation:marquee 30s linear infinite; }
        .marquee-track:hover { animation-play-state:paused; }

        /* ── Button ── */
        .btn-primary { background:linear-gradient(135deg,#fbbf24,#f59e0b); color:#0a0a12; font-weight:700; transition:all 0.3s ease; position:relative; overflow:hidden; }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(251,191,36,0.4); }
        .btn-primary::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.2),transparent); opacity:0; transition:opacity 0.3s; }
        .btn-primary:hover::after { opacity:1; }

        .btn-outline { border:2px solid rgba(15, 61, 117, 0.2); color:#0f3d75; font-weight:600; transition:all 0.3s ease; background:rgba(255,255,255,0.6); backdrop-filter:blur(8px); }
        .btn-outline:hover { border-color:#0f3d75; color:#0f3d75; background:rgba(15, 61, 117, 0.05); }

        /* ── Card Hover ── */
        .card-hover { transition:all 0.4s cubic-bezier(0.4,0,0.2,1); }
        .card-hover:hover { transform:translateY(-8px); box-shadow:0 20px 40px rgba(0,0,0,0.06); }
        .card-hover:hover .card-img { transform:scale(1.08); }
        .card-img { transition:transform 0.6s cubic-bezier(0.4,0,0.2,1); }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:#f1f5f9}
        ::-webkit-scrollbar-thumb{background:rgba(15, 61, 117, 0.2);border-radius:3px}
      `}</style>

      {/* ══════════════════════════════════════════════════ */}
      {/*                     HERO                          */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] sm:min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <img src="/hero-house.jpg" alt="Rooftop solar panel installation on modern home" className="hero-bg" fetchPriority="high" decoding="async" />
        <div className="hero-overlay"></div>

        {/* Decorative glow blobs */}
        <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-amber-400/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-[38px] sm:pt-28 pb-8 sm:pb-16 w-full">
          <div className="max-w-3xl bg-white/70 sm:bg-white/35 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-3.5 sm:p-7 md:p-0 rounded-3xl border border-white/50 md:border-0 shadow-sm md:shadow-none">

            {/* Badge */}
            <div data-animate="fade-up" data-delay="0" className="inline-flex items-center gap-2 bg-white/90 border border-slate-200/80 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full mb-2 sm:mb-8 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800">MNRE Approved Integrator — Tamil Nadu</span>
            </div>

            {/* Heading */}
            <h1 data-animate="fade-up" data-delay="100" className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.22] sm:leading-[1.18] mb-3 sm:mb-6">
              <span className="gradient-text-shine text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
                Power Your Home With
                <br />
                Sunlight
              </span>
            </h1>

            {/* Subtitle */}
            <p data-animate="fade-up" data-delay="200" className="text-sm sm:text-base md:text-lg text-slate-800 font-medium max-w-xl leading-relaxed mb-6 sm:mb-10">
              Save up to <span className="text-amber-600 font-bold">90% on bi-monthly TNEB bills</span> under PM Surya Ghar Yojana. Direct MNRE subsidies handled.
            </p>

            {/* CTAs */}
            <div data-animate="fade-up" data-delay="300" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-14">
              <a href="#calculator" className="btn-primary px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20">
                <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
                Calculate Savings
              </a>
              <a href="#contact" className="btn-outline px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-[#0f3d75]" />
                Request Survey
              </a>
            </div>

            {/* Trust Stats */}
            <div data-animate="fade-up" data-delay="420" className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-8 md:gap-12 bg-white/60 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none p-3 sm:p-0 rounded-2xl border border-slate-200/50 sm:border-0">
              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-3xl md:text-4xl font-black gradient-text-cool">3.2 MW+</div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 sm:mt-1">Solar Installed</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-slate-300/60" />
              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-3xl md:text-4xl font-black gradient-text-cool">550+</div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 sm:mt-1">Homes Powered</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-slate-300/60" />
              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-3xl md:text-4xl font-black gradient-text-cool">30yr</div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 sm:mt-1">Linear Warranty</div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-slate-300 flex justify-center pt-1.5 bg-white/50 backdrop-blur-sm">
            <div className="w-1 h-2 rounded-full bg-[#0f3d75] animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*  WHY TN FAMILIES CHOOSE SOLAR & BEFORE/AFTER BILL */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-slate-50 border-b border-slate-200/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 items-center">

            {/* Left Content & Bullets */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0f3d75] font-mono block">
                Run Hi Tech Solar
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                Why Tamil Nadu Families Are Choosing Solar in 2025!
              </h2>

              <ul className="space-y-3 text-slate-700 text-xs sm:text-sm md:text-base pt-1">
                <li className="flex items-center gap-2.5 sm:gap-3">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0">✓</span>
                  <span><strong>₹30,000–₹78,000 Govt Subsidy</strong> (PM Surya Ghar)</span>
                </li>
                <li className="flex items-center gap-2.5 sm:gap-3">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0">✓</span>
                  <span><strong>Up to 90% reduction</strong> in electricity (EB) bills</span>
                </li>
                <li className="flex items-center gap-2.5 sm:gap-3">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0">✓</span>
                  <span><strong>One-time investment</strong> for 30+ years of free power</span>
                </li>
                <li className="flex items-center gap-2.5 sm:gap-3">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0">✓</span>
                  <span><strong>Hybrid & Grid systems</strong> with battery backup</span>
                </li>
                <li className="flex items-center gap-2.5 sm:gap-3">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0">✓</span>
                  <span><strong>Fast installation</strong> within 7 to 10 days</span>
                </li>
              </ul>

              <div className="pt-2 sm:pt-4 flex flex-wrap gap-2.5 sm:gap-4">
                <Link
                  to="/subsidy"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl shadow-sm transition-all text-center flex-1 sm:flex-none"
                >
                  Check Subsidy
                </Link>
                <Link
                  to="/about"
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl transition-all shadow-sm text-center flex-1 sm:flex-none"
                >
                  About Us
                </Link>
              </div>
            </div>

            {/* Right: Before vs After EB Bill Card */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-slate-100 mb-4 sm:mb-6">
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">REAL SAVINGS BENCHMARK</span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">Bi-Monthly EB Bill</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] sm:text-xs border border-emerald-200">
                    Save ~93%
                  </span>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {/* Before */}
                  <div>
                    <div className="flex justify-between text-[11px] sm:text-xs font-bold text-slate-600 mb-1.5 sm:mb-2">
                      <span>BEFORE SOLAR</span>
                      <span className="text-red-600">₹3,000 / bill</span>
                    </div>
                    <div className="w-full h-3.5 sm:h-4 bg-slate-100 rounded-full overflow-hidden p-0.5">
                      <div className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full w-[85%] flex items-center justify-end pr-2 text-[8px] sm:text-[9px] font-bold text-white">
                        85%
                      </div>
                    </div>
                  </div>

                  {/* After */}
                  <div>
                    <div className="flex justify-between text-[11px] sm:text-xs font-bold text-slate-600 mb-1.5 sm:mb-2">
                      <span>AFTER SOLAR (Run Hi Tech)</span>
                      <span className="text-emerald-600">₹200 / bill</span>
                    </div>
                    <div className="w-full h-3.5 sm:h-4 bg-slate-100 rounded-full overflow-hidden p-0.5">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full w-[12%] flex items-center justify-end pr-1 text-[8px] sm:text-[9px] font-bold text-white">
                        ₹200
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-8 pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
                  <span>Average family savings:</span>
                  <span className="font-bold text-emerald-700 text-xs sm:text-sm">₹16,800 / year</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*   3 USER CATEGORIES: HOME, COMMERCIAL & INDUSTRIAL */}
      {/* ══════════════════════════════════════════════════ */}
      <CategoryShowcase />

      {/* ══════════════════════════════════════════════════ */}
      {/*        TYPES OF SOLAR PANELS WE INSTALL           */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-24 border-y border-slate-200 bg-slate-50/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-14">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Tier-1 Approved PV Technology</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                Types of Solar Panels We Install
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Precision-engineered solar modules tested for Tamil Nadu's high ambient heat. Every installation includes CEIG & TNEB net-metering approvals with a 30-year linear performance guarantee.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold bg-white border border-slate-200/90 px-4 py-2.5 rounded-2xl shadow-sm">
              <span className="flex items-center gap-1.5 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>30-Yr Performance</span>
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>MNRE Approved</span>
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>CEIG Compliant</span>
              </span>
            </div>
          </div>

          {/* 4 Technology Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">

            {/* 1. Mono Solar Panels (For Homes) */}
            <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between group overflow-hidden">
              <div>
                {/* Visual Module Blueprint Header */}
                <div className="relative p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white overflow-hidden">
                  <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:16px_16px]" />
                  <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10 flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold uppercase tracking-wide shadow-sm">
                      <Sparkles className="w-3 h-3 text-slate-950" />
                      Popular for Homes
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300">
                      Mono PERC
                    </span>
                  </div>

                  <div className="relative z-10 mt-4 flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">540W – 580W</div>
                      <div className="text-[11px] text-blue-200 font-medium">Half-Cut Cell Tech</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400">21.8%</div>
                      <div className="text-[9px] text-slate-400 uppercase tracking-wider">Peak Efficiency</div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors">
                      Mono Solar Panels (For Homes)
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      High-power monocrystalline cells engineered for maximum yield on home rooftops. Delivers steady electricity even during Tamil Nadu's peak summer heat.
                    </p>
                  </div>

                  {/* Curated Spec Highlights */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 font-medium">Subsidy Eligibility</span>
                      <span className="font-bold text-emerald-700">₹78,000 PM Surya Ghar</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 font-medium">Space Efficiency</span>
                      <span className="font-semibold text-slate-800">Compact Roof Layout</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 font-medium">EB Bill Reduction</span>
                      <span className="font-bold text-blue-600">Up to 90% Savings</span>
                    </div>
                  </div>

                  {/* Ideal Location */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <HomeIcon className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Villas, Individual Houses & Apartments</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0 sm:p-6 sm:pt-0">
                <a
                  href="#calculator"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 group/btn"
                >
                  <span>Calculate Home Subsidy</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* 2. Double-Sided Solar Panels */}
            <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between group overflow-hidden">
              <div>
                {/* Visual Module Blueprint Header */}
                <div className="relative p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white overflow-hidden">
                  <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:16px_16px]" />
                  <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10 flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-[10px] font-bold uppercase tracking-wide">
                      <Layers className="w-3 h-3 text-indigo-300" />
                      +25% Rear Gain
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300">
                      Dual-Glass
                    </span>
                  </div>

                  <div className="relative z-10 mt-4 flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">550W – 600W</div>
                      <div className="text-[11px] text-indigo-200 font-medium">Dual-Sided Absorption</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-indigo-400">22.5%</div>
                      <div className="text-[9px] text-slate-400 uppercase tracking-wider">Bifacial Yield</div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors">
                      Double-Sided Solar Panels
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Generates power from both the top and underside using ground reflection. Encased in dual tempered glass for 30+ year industrial life.
                    </p>
                  </div>

                  {/* Curated Spec Highlights */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 font-medium">Rear Energy Boost</span>
                      <span className="font-bold text-indigo-700">+10% to +25% Extra kWh</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 font-medium">Glass Build</span>
                      <span className="font-semibold text-slate-800">2.0mm Dual Tempered</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 font-medium">Degradation Rate</span>
                      <span className="font-bold text-blue-600">0.4% Ultra-Low / Year</span>
                    </div>
                  </div>

                  {/* Ideal Location */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Petrol Bunks, Flat Terraces & Showrooms</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0 sm:p-6 sm:pt-0">
                <a
                  href="#calculator"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 group/btn"
                >
                  <span>Estimate Commercial ROI</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* 3. Factory High-Yield Panels */}
            <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between group overflow-hidden">
              <div>
                {/* Visual Module Blueprint Header */}
                <div className="relative p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white overflow-hidden">
                  <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:16px_16px]" />
                  <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10 flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-[10px] font-bold uppercase tracking-wide">
                      <Factory className="w-3 h-3 text-emerald-300" />
                      Industrial Duty
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300">
                      TOPCon N-Type
                    </span>
                  </div>

                  <div className="relative z-10 mt-4 flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">570W – 620W</div>
                      <div className="text-[11px] text-emerald-200 font-medium">Ultra High Power</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400">Max Yield</div>
                      <div className="text-[9px] text-slate-400 uppercase tracking-wider">Heat Tolerant</div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors">
                      High-Power Factory Panels
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Next-generation N-type TOPCon panels built for spinning mills and commercial sheds. Maintains heavy power generation during cloudy days and high heat.
                    </p>
                  </div>

                  {/* Curated Spec Highlights */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 font-medium">Module Capacity</span>
                      <span className="font-bold text-emerald-700">570W to 620W Output</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 font-medium">Low-Light Yield</span>
                      <span className="font-semibold text-slate-800">Superior on Overcast Days</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 font-medium">Mechanical Rating</span>
                      <span className="font-bold text-blue-600">5400 Pa Wind/Storm Proof</span>
                    </div>
                  </div>

                  {/* Ideal Location */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <Factory className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Spinning Mills, Factories & Warehouses</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0 sm:p-6 sm:pt-0">
                <a
                  href="#contact"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 group/btn"
                >
                  <span>Request Industrial Audit</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* 4. Solar with Battery Backup */}
            <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between group overflow-hidden">
              <div>
                {/* Visual Module Blueprint Header */}
                <div className="relative p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950 text-white overflow-hidden">
                  <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:16px_16px]" />
                  <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10 flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/30 border border-amber-400/40 text-amber-200 text-[10px] font-bold uppercase tracking-wide">
                      <BatteryCharging className="w-3 h-3 text-amber-300" />
                      Zero Diesel Genset
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300">
                      Hybrid Storage
                    </span>
                  </div>

                  <div className="relative z-10 mt-4 flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">3.6kW – 15kW+</div>
                      <div className="text-[11px] text-amber-200 font-medium">Smart LiFePO4 Hub</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-amber-400">&lt;10ms</div>
                      <div className="text-[9px] text-slate-400 uppercase tracking-wider">Instant Cutover</div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors">
                      Solar with Battery Backup
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Powers your lights, motors, fans, and critical equipment non-stop 24/7. When EB power cuts occur, instant switching eliminates expensive diesel generators.
                    </p>
                  </div>

                  {/* Curated Spec Highlights */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 font-medium">Cutover Speed</span>
                      <span className="font-bold text-amber-700">&lt;10ms Seamless Transfer</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 font-medium">Battery Chemistry</span>
                      <span className="font-semibold text-slate-800">LiFePO4 6,000+ Cycles</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 font-medium">Fuel Elimination</span>
                      <span className="font-bold text-emerald-600">100% Diesel Free</span>
                    </div>
                  </div>

                  {/* Ideal Location */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <BatteryCharging className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Hospitals, CNC Units, Villas & Offices</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0 sm:p-6 sm:pt-0">
                <a
                  href="#contact"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 group/btn"
                >
                  <span>Design Battery Backup</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*               SERVICES                            */}
      {/* ══════════════════════════════════════════════════ */}
      <section id="services" className="py-12 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-8 sm:mb-16">
            <div data-animate="fade-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0f3d75] mb-2 block">What We Do</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-900">
                Complete Solar Services
              </h2>
            </div>
            <p data-animate="fade-right" className="text-slate-500 max-w-md text-xs sm:text-sm md:text-base leading-relaxed">
              From roof inspection to government subsidy and TNEB meter connection — we take care of everything so you start saving money from day one.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

            {/* Service 1 */}
            <div data-animate="fade-up" data-delay="0" className="card-hover group bg-white border border-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
              <div className="relative h-44 sm:h-52 overflow-hidden">
                <img src="https://runhitechsolar.com/wp-content/uploads/2025/08/Residential-Solar.jpg" alt="Residential Solar" loading="lazy" decoding="async" className="card-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-md border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-600">PM Surya Ghar</span>
                </div>
              </div>
              <div className="p-5 sm:p-7">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-amber-500/20 transition">
                  <HomeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 text-slate-900">Home Rooftop Solar</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5">
                  Built for your house. Get up to ₹78,000 direct government subsidy into your bank account and reduce your EB bill up to 90%.
                </p>
                <Link to="/services" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0f3d75] hover:gap-2.5 transition-all">
                  See Details <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>

            {/* Service 2 */}
            <div data-animate="fade-up" data-delay="120" className="card-hover group bg-white border border-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
              <div className="relative h-44 sm:h-52 overflow-hidden">
                <img src="https://runhitechsolar.com/wp-content/uploads/2025/08/🏢-Commercial-Solar-copy.jpg" alt="Commercial Solar" loading="lazy" decoding="async" className="card-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-md border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-blue-600">350+ Bunks</span>
                </div>
              </div>
              <div className="p-5 sm:p-7">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-blue-500/20 transition">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 text-slate-900">Commercial & Petrol Bunks</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5">
                  Custom solar setups for petrol bunks, hotels, schools, and shops. Recover full cost in 3 to 4 years and reduce monthly electricity expenses.
                </p>
                <Link to="/services" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:gap-2.5 transition-all">
                  See Details <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>

            {/* Service 3 */}
            <div data-animate="fade-up" data-delay="240" className="card-hover group bg-white border border-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
              <div className="relative h-44 sm:h-52 overflow-hidden">
                <img src="https://runhitechsolar.com/wp-content/uploads/2025/08/🌗-Hybrid-Solar-copy.jpg" alt="Battery Storage" loading="lazy" decoding="async" className="card-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-md border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-600">24/7 Backup</span>
                </div>
              </div>
              <div className="p-5 sm:p-7">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-green-500/20 transition">
                  <Battery className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 text-slate-900">Solar with Battery Backup</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5">
                  Stores daytime solar power in strong batteries to run your lights, fans, and appliances during night and TNEB power cuts without diesel.
                </p>
                <Link to="/services" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-green-600 hover:gap-2.5 transition-all">
                  See Details <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*        SMART 3-CATEGORY SAVINGS CALCULATOR        */}
      {/* ══════════════════════════════════════════════════ */}
      <CategoryCalculator />

      {/* ══════════════════════════════════════════════════ */}
      {/*              PROCESS                               */}
      {/* ══════════════════════════════════════════════════ */}
      <section id="process" className="py-12 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div data-animate="fade-up" className="text-center mb-8 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0f3d75] mb-2 sm:mb-3 block">How It Works</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">4 Simple Steps</h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto mt-2 sm:mt-4">From initial call to first kilowatt — we make solar integrations effortless.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-slate-200"></div>

            {/* Step 1 */}
            <div data-animate="fade-up" data-delay="0" className="text-center group p-4 sm:p-0">
              <div className="relative mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[#0f3d75] group-hover:text-white transition-all duration-300">
                <span className="text-base sm:text-lg font-black text-amber-600 group-hover:text-white">1</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2 text-slate-900">Free Consultation</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">We assess your roof structure, shadow factors, and monthly bill patterns.</p>
            </div>

            {/* Step 2 */}
            <div data-animate="fade-up" data-delay="120" className="text-center group p-4 sm:p-0">
              <div className="relative mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[#0f3d75] group-hover:text-white transition-all duration-300">
                <span className="text-base sm:text-lg font-black text-amber-600 group-hover:text-white">2</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2 text-slate-900">Custom Design</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">3D engineering models mapped to maximize panel performance efficiency.</p>
            </div>

            {/* Step 3 */}
            <div data-animate="fade-up" data-delay="240" className="text-center group p-4 sm:p-0">
              <div className="relative mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[#0f3d75] group-hover:text-white transition-all duration-300">
                <span className="text-base sm:text-lg font-black text-amber-600 group-hover:text-white">3</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2 text-slate-900">Expert Install</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">Certified local technicians deploy the panels and configure structures in 1-2 days.</p>
            </div>

            {/* Step 4 */}
            <div data-animate="fade-up" data-delay="360" className="text-center group p-4 sm:p-0">
              <div className="relative mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[#0f3d75] group-hover:text-white transition-all duration-300">
                <span className="text-base sm:text-lg font-black text-amber-600 group-hover:text-white">4</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2 text-slate-900">Start Saving</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">Connect to the grid! Net metering goes live and your electricity bills zero out.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*        3D SOLAR HARDWARE INSPECTION                */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="pt-16 pb-12 sm:py-20 md:py-28 px-4 sm:px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div data-animate="fade-right" className="lg:col-span-5 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] sm:text-xs font-semibold tracking-wide uppercase">
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                Live 3D Rooftop Solar Simulation
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                How Sunlight Powers Your Home with Solar
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                Watch high-intensity sunlight photon beams hit the rooftop solar panels, converting solar energy into clean electricity that directly powers your home and feeds excess power into the TNEB grid.
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center sm:text-left">
                  <div className="text-xl sm:text-2xl font-black text-amber-400">100%</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Clean Solar Power</div>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center sm:text-left">
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">₹0 Bills</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Under PM Surya Ghar</div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <a
                  href="#calculator"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs px-5 sm:px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 text-center"
                >
                  Calculate Yield
                </a>
                <Link
                  to="/subsidy"
                  className="border border-slate-700 hover:border-blue-500 bg-slate-800/40 text-slate-300 hover:text-white font-bold text-xs px-5 sm:px-6 py-3.5 rounded-xl transition-all text-center"
                >
                  Subsidy Scheme
                </Link>
              </div>
            </div>

            {/* Right 3D Canvas Seamless */}
            <div data-animate="zoom" className="lg:col-span-7 flex justify-center items-center w-full mt-4 lg:mt-0 min-h-[340px]">
              <Suspense
                fallback={
                  <div className="w-full h-[340px] flex items-center justify-center rounded-3xl bg-slate-900/10 border border-slate-200/50">
                    <div className="w-7 h-7 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                  </div>
                }
              >
                <RooftopSolarAnimation3D height="340px" />
              </Suspense>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*            PROJECTS GALLERY                        */}
      {/* ══════════════════════════════════════════════════ */}
      <section id="projects" className="py-12 sm:py-24 px-4 sm:px-6 content-visibility-auto">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <div data-animate="fade-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0f3d75] mb-2 block">Our Work</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">Recent Installations</h2>
            </div>
            <Link to="/services" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0f3d75] hover:gap-2.5 transition-all">
              View All Projects <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 auto-rows-auto sm:auto-rows-[200px] lg:auto-rows-[240px]">

            {/* Big Card */}
            <div data-animate="fade-up" data-delay="0" className="card-hover relative rounded-2xl overflow-hidden sm:col-span-2 sm:row-span-2 group cursor-pointer border border-slate-100 shadow-sm min-h-[240px]">
              <img src="https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Solar installation" loading="lazy" decoding="async" className="card-img w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Residential</span>
                <h3 className="text-sm sm:text-base font-semibold mt-1 text-white">Modern Home — 8.2 kWp Rooftop System</h3>
                <p className="text-white/70 text-xs sm:text-sm mt-0.5">Salem, TN</p>
              </div>
            </div>

            {/* Small Card 1 */}
            <div data-animate="fade-up" data-delay="100" className="card-hover relative rounded-2xl overflow-hidden group cursor-pointer border border-slate-100 shadow-sm min-h-[160px]">
              <img src="https://images.pexels.com/photos/8853512/pexels-photo-8853512.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Battery storage" loading="lazy" decoding="async" className="card-img w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4">
                <span className="text-[10px] font-semibold text-green-400 uppercase tracking-wider">Battery</span>
                <h3 className="text-xs sm:text-sm font-medium mt-0.5 text-white">Hybrid LiFePO4 Install</h3>
              </div>
            </div>

            {/* Small Card 2 */}
            <div data-animate="fade-up" data-delay="200" className="card-hover relative rounded-2xl overflow-hidden group cursor-pointer border border-slate-100 shadow-sm min-h-[160px]">
              <img src="https://images.pexels.com/photos/9875414/pexels-photo-9875414.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Commercial solar" loading="lazy" decoding="async" className="card-img w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4">
                <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">Commercial</span>
                <h3 className="text-xs sm:text-sm font-medium mt-0.5 text-white">Retail Canopy Solar</h3>
              </div>
            </div>

            {/* Small Card 3 */}
            <div data-animate="fade-up" data-delay="300" className="card-hover relative rounded-2xl overflow-hidden group cursor-pointer border border-slate-100 shadow-sm min-h-[160px]">
              <img src="https://images.pexels.com/photos/9875421/pexels-photo-9875421.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Industrial rooftop" loading="lazy" decoding="async" className="card-img w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4">
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Industrial</span>
                <h3 className="text-xs sm:text-sm font-medium mt-0.5 text-white">Factory Rooftop System</h3>
              </div>
            </div>

            {/* Small Card 4 */}
            <div data-animate="fade-up" data-delay="400" className="card-hover relative rounded-2xl overflow-hidden group cursor-pointer border border-slate-100 shadow-sm min-h-[160px]">
              <img src="https://images.pexels.com/photos/9875416/pexels-photo-9875416.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Petrol bunk solar" loading="lazy" decoding="async" className="card-img w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4">
                <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">Commercial Bunk</span>
                <h3 className="text-xs sm:text-sm font-medium mt-0.5 text-white">HPCL Net-Metered Setup</h3>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*             TESTIMONIALS                           */}
      {/* ══════════════════════════════════════════════════ */}
      <section id="testimonials" className="py-12 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">

          <div data-animate="fade-up" className="text-center mb-8 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0f3d75] mb-2 sm:mb-3 block">Testimonials</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">What Homeowners Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} data-animate="fade-up" data-delay={`${idx * 130}`} className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative shadow-sm backdrop-blur-md">
                <div className="absolute top-5 right-5 sm:top-6 sm:right-6">
                  <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500/10" />
                </div>
                <div className="flex items-center gap-1 mb-3 sm:mb-4">
                  <span className="text-amber-500 text-xs sm:text-sm">★★★★★</span>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-400 to-[#0f3d75] flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-900">{t.name}</div>
                    <div className="text-[11px] sm:text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*        LATEST SOLAR GUIDES & BLOG (MIGRATED)       */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-14">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0f3d75] mb-1 sm:mb-2 block">
                Knowledge Base & District Guides
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                Latest Solar Insights & Case Studies
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm max-w-xl mt-1 sm:mt-2">
                Official guides on PM Surya Ghar subsidies, net-metering rules, and industrial MW solar execution in Tamil Nadu.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Request Custom Case Study →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

            {/* Blog Post 1: Salem */}
            <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="h-44 sm:h-48 overflow-hidden relative">
                  <img
                    src="https://runhitechsolar.com/wp-content/uploads/2026/02/Salem-Blog-Poster-840x1050.jpg"
                    alt="Best Solar Company in Salem"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-blue-600/90 text-white font-bold text-[10px] tracking-wide uppercase shadow-sm">
                    PM Surya Ghar
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <div className="text-[11px] font-medium text-slate-400 mb-1.5">February 23, 2026</div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors leading-snug">
                    Best Solar Company in Salem – PM Surya Ghar Subsidy Rooftop Installation
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 sm:mt-2 leading-relaxed line-clamp-2">
                    Step-by-step roadmap for Salem homeowners to claim ₹78,000 government subsidy and eliminate high summer bi-monthly TNEB bills.
                  </p>
                </div>
              </div>
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <Link to="/subsidy" className="hover:underline">Read Scheme Details →</Link>
              </div>
            </div>

            {/* Blog Post 2: Karur */}
            <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="h-44 sm:h-48 overflow-hidden relative">
                  <img
                    src="https://runhitechsolar.com/wp-content/uploads/2026/02/karur-ads-poster-1-840x1050.jpg"
                    alt="Best Solar Company in Karur"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-emerald-600/90 text-white font-bold text-[10px] tracking-wide uppercase shadow-sm">
                    Textile Solar
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <div className="text-[11px] font-medium text-slate-400 mb-1.5">February 14, 2026</div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors leading-snug">
                    Best Solar Company in Karur – PM Surya Ghar Subsidy Solar Installation
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 sm:mt-2 leading-relaxed line-clamp-2">
                    Detailed guide on rooftop feasibility, load increase, and net-metering approvals across Karur textile hubs.
                  </p>
                </div>
              </div>
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <Link to="/subsidy" className="hover:underline">Read Scheme Details →</Link>
              </div>
            </div>

            {/* Blog Post 3: Namakkal */}
            <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="h-44 sm:h-48 overflow-hidden relative">
                  <img
                    src="https://runhitechsolar.com/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-21-at-17.54.23-840x857.jpeg"
                    alt="Best Solar Company in Namakkal"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-amber-600/90 text-white font-bold text-[10px] tracking-wide uppercase shadow-sm">
                    Regional HQ
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <div className="text-[11px] font-medium text-slate-400 mb-1.5">August 21, 2025</div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors leading-snug">
                    Best Solar Company in Namakkal – Run Hi Tech Solar | PM Suryaghar Yojana
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 sm:mt-2 leading-relaxed line-clamp-2">
                    How Run Hi Tech Solar became the trusted solar provider in Velur & Namakkal with 550+ commissioned rooftop installations.
                  </p>
                </div>
              </div>
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <Link to="/about" className="hover:underline">Our Story →</Link>
              </div>
            </div>

            {/* Blog Post 4: MW Scale Tamil Nadu */}
            <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="h-44 sm:h-48 overflow-hidden relative">
                  <img
                    src="https://runhitechsolar.com/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-21-at-16.50.27-840x857.jpeg"
                    alt="MW Solar Power Plant in Tamil Nadu"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-purple-600/90 text-white font-bold text-[10px] tracking-wide uppercase shadow-sm">
                    Industrial Solar
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <div className="text-[11px] font-medium text-slate-400 mb-1.5">August 21, 2025</div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors leading-snug">
                    MW Solar Power Plant in Tamil Nadu – Captive & PPA Explained
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 sm:mt-2 leading-relaxed line-clamp-2">
                    Financial savings for spinning mills, foundries, and heavy manufacturing units across Tamil Nadu.
                  </p>
                </div>
              </div>
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <Link to="/services" className="hover:underline">Industrial Solar →</Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*                  FAQ                               */}
      {/* ══════════════════════════════════════════════════ */}
      <section id="faq" className="py-12 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">

          <div data-animate="fade-up" className="text-center mb-8 sm:mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0f3d75] mb-2 sm:mb-3 block">FAQ</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">Common Questions</h2>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {faqList.map((faq, idx) => (
              <div key={idx} data-animate="fade-up" data-delay={`${idx * 80}`} className="bg-slate-50 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 text-left focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-semibold pr-3 text-slate-900">{faq.q}</span>
                  <Plus
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-[#0f3d75] flex-shrink-0 transition-transform duration-300 ${activeFaq === idx ? "rotate-45" : ""
                      }`}
                  />
                </button>
                <div
                  className="transition-all duration-300 ease-in-out overflow-hidden"
                  style={{ maxHeight: activeFaq === idx ? "200px" : "0px" }}
                >
                  <p className="px-4 pb-4 sm:px-6 sm:pb-6 text-slate-500 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-3 sm:pt-4">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*                FINAL CTA                           */}
      {/* ══════════════════════════════════════════════════ */}
      <section id="contact" className="py-12 sm:py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden bg-slate-50/55">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div data-animate="zoom" className="glass rounded-2xl sm:rounded-[2rem] p-6 sm:p-12 md:p-16 text-center relative overflow-hidden border border-slate-200/60 shadow-sm">

            {/* Decorative sun ring */}
            <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full border border-blue-500/10 spin-slow pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full border border-blue-500/10 spin-slow pointer-events-none" style={{ animationDirection: "reverse" }} />

            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-sm">
                <Sun className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-slate-950 mb-2 sm:mb-4">Ready to Go Solar?</h2>
              <p className="text-slate-500 max-w-md mx-auto mb-6 sm:mb-10 text-xs sm:text-base md:text-lg">Request a free site assessment in Namakkal, Karur, Salem & Erode. No commitment.</p>

              {/* Form */}
              <form onSubmit={handleSurveySubmit} className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-2.5 shadow-md space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:gap-2 text-left mb-3">
                <div className="flex-1">
                  <input
                    type="text"
                    inputMode="text"
                    pattern="[a-zA-Z\s.-]+"
                    title="Please enter only letters (no numbers allowed)"
                    placeholder="Your Full Name"
                    value={surveyName}
                    onChange={handleNameChange}
                    onKeyDown={(e) => {
                      if (e.key >= "0" && e.key <= "9") {
                        e.preventDefault();
                      }
                    }}
                    className="w-full bg-slate-50 sm:bg-transparent border border-slate-200 sm:border-0 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none rounded-xl"
                    required
                  />
                </div>
                <div className="flex-1 sm:border-l border-slate-200 sm:pl-2">
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    title="Please enter a 10-digit mobile number (no letters allowed)"
                    placeholder="Mobile Number (10 digits)"
                    value={surveyPhone}
                    onChange={handlePhoneChange}
                    onKeyDown={(e) => {
                      if (
                        !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key) &&
                        !/^[0-9]$/.test(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full bg-slate-50 sm:bg-transparent border border-slate-200 sm:border-0 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none rounded-xl font-mono"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={surveySuccess}
                  className="w-full sm:w-auto bg-amber-500 text-slate-950 hover:bg-amber-600 px-6 py-3 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md active:scale-95 text-center flex items-center justify-center gap-1.5"
                >
                  {surveySuccess ? "Requested ✓" : "Request Free Call"}
                </button>
              </form>

              {/* Validation Warning */}
              {phoneError && (
                <p className="text-xs text-red-500 font-semibold mb-3">
                  ⚠ {phoneError}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 mt-8 font-semibold">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-green-600" /> PM Surya Ghar Subsidy</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-green-600" /> ₹0 EB Bills Guarantee</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-green-600" /> 30-Year Linear Warranty</span>
              </div>
            </div>

          </div>
        </div>

        {/* ── Interactive Pop-Up Message for Confirmation ── */}
        {showPopup && typeof document !== "undefined" && createPortal(
          <div
            className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setShowPopup(false)}
          >
            <div
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-emerald-100 text-center relative animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Status Checkmark */}
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-3.5 shadow-sm">
                <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Success! Request Logged
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Our engineering liaison will call you shortly to plan the survey.
              </p>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="w-full py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer"
                >
                  OK, Got It
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*             COVERAGE DISTRICTS                     */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col items-center text-center">
          <span data-animate="fade-up" className="text-xs font-bold uppercase tracking-wider text-[#0f3d75] mb-3 block">
            Regional Operations
          </span>
          <h2 data-animate="fade-up" data-delay="80" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Actively Servicing Six Major Districts in Tamil Nadu
          </h2>
          <p data-animate="fade-up" data-delay="160" className="mt-3 text-sm text-slate-500 max-w-xl">
            Our engineers are stationed locally to complete structural validations and net-metering approvals rapidly.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3.5 max-w-3xl">
            {districts.map((d, i) => (
              <span
                key={d}
                data-animate="zoom"
                data-delay={`${i * 60}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-6 py-2.5 text-xs font-semibold text-slate-700 tracking-wide shadow-sm hover:border-[#0f3d75] transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
