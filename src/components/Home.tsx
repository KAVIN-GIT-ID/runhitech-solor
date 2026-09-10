import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";
import CategoryShowcase from "./CategoryShowcase";
import CategoryCalculator from "./CategoryCalculator";
import { triggerLeadNotification } from "../services/notificationService";
import {
  ArrowRight,
  Calculator,
  Play,
  Plus,
  CheckCircle2,
  X
} from "lucide-react";

const districts = ["Namakkal", "Karur", "Salem", "Erode", "Tirupur", "Coimbatore"];

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

// Dedicated memoized assessment form to isolate typing re-renders from the parent Home page
function HomeAssessmentForm() {
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

  return (
    <>
      <form onSubmit={handleSurveySubmit} className="max-w-2xl mx-auto mb-4 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              inputMode="text"
              pattern="[a-zA-Z\s.-]+"
              title="Please enter only letters (no numbers allowed)"
              placeholder="Your Full Name"
              value={surveyName}
              onChange={handleNameChange}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs transition-colors duration-150"
              required
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mobile Number
            </label>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              title="Please enter a 10-digit mobile number (no letters allowed)"
              placeholder="10-digit number"
              value={surveyPhone}
              onChange={handlePhoneChange}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs transition-colors duration-150"
              required
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={surveySuccess}
              className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-sm px-4 py-3 rounded-xl transition-colors duration-150 shadow-sm active:scale-95 text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {surveySuccess ? "Requested ✓" : "Request Free Call"}
            </button>
          </div>
        </div>
      </form>

      {phoneError && (
        <p className="text-xs text-red-500 font-semibold mb-3">
          ⚠ {phoneError}
        </p>
      )}

      {showPopup && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-emerald-100 text-center relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

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
    </>
  );
}

export default function Home() {
  useScrollReveal();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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


            {/* Heading */}
            <h1 data-animate="fade-up" data-delay="100" className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.22] sm:leading-[1.18] mb-3 sm:mb-6">
              <span className="gradient-text-shine text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
                Power Your Home
                <br />
                <span className="whitespace-nowrap">With Sunlight</span>
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
                <div className="text-xl sm:text-3xl md:text-4xl font-black gradient-text-cool">350+</div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 sm:mt-1">HPCL Bunks Solarized</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-slate-300/60" />
              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-3xl md:text-4xl font-black gradient-text-cool">200+</div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 sm:mt-1">PM Surya Ghar Homes</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-slate-300/60" />
              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-3xl md:text-4xl font-black gradient-text-cool">10+ MW</div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 sm:mt-1">Industrial Solar</div>
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                Why Tamil Nadu Families Are Switching to Solar in 2025
              </h2>

              <ul className="space-y-2.5 text-slate-700 text-xs sm:text-sm md:text-base pt-1 list-disc pl-5">
                <li>
                  <strong>Claim Free Money:</strong> We process the PM Surya Ghar Yojana paperwork so you can easily secure your ₹30,000 – ₹78,000 government subsidy.
                </li>
                <li>
                  <strong>Massive Savings:</strong> Watch your EB bills drop by up to 90% from day one.
                </li>
                <li>
                  <strong>Fast Installation:</strong> Your system is professionally installed and running in just 7–10 days.
                </li>
                <li>
                  <strong>Lifetime ROI:</strong> Make a one-time investment that pays you back for over 25 years.
                </li>
              </ul>

              <div className="pt-2 sm:pt-4 flex flex-wrap gap-2.5 sm:gap-4">
                <Link
                  to="/subsidy"
                  className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl shadow-sm transition-all text-center flex-1 sm:flex-none"
                >
                  Check Subsidy
                </Link>
                <Link
                  to="/about"
                  className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl transition-all shadow-sm text-center flex-1 sm:flex-none"
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
                    <span className="text-xs font-semibold text-slate-500 block">Real Savings Benchmark</span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">The Run Hi Tech Difference</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-900 font-bold text-[11px] sm:text-xs border border-slate-200">
                    Save ~93%
                  </span>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {/* Before */}
                  <div>
                    <div className="flex justify-between text-[11px] sm:text-xs font-bold text-slate-600 mb-1.5 sm:mb-2">
                      <span>Before: Average EB Bill</span>
                      <span className="text-slate-900 font-bold">₹3,000/month</span>
                    </div>
                    <div className="w-full h-3.5 sm:h-4 bg-slate-100 rounded-full overflow-hidden p-0.5">
                      <div className="h-full bg-slate-800 rounded-full w-[85%] flex items-center justify-end pr-2 text-[8px] sm:text-[9px] font-bold text-white">
                        85%
                      </div>
                    </div>
                  </div>

                  {/* After */}
                  <div>
                    <div className="flex justify-between text-[11px] sm:text-xs font-bold text-slate-600 mb-1.5 sm:mb-2">
                      <span>After: Average EB Bill</span>
                      <span className="text-slate-900 font-bold">₹200/month</span>
                    </div>
                    <div className="w-full h-3.5 sm:h-4 bg-slate-100 rounded-full overflow-hidden p-0.5">
                      <div className="h-full bg-slate-400 rounded-full w-[12%] flex items-center justify-end pr-1 text-[8px] sm:text-[9px] font-bold text-slate-900">
                        ₹200
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-8 pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
                  <span>Average family savings:</span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">₹16,800 / year</span>
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
      {/*        SMART 3-CATEGORY SAVINGS CALCULATOR        */}
      {/* ══════════════════════════════════════════════════ */}
      <CategoryCalculator />

      {/* ══════════════════════════════════════════════════ */}
      {/*              PROCESS                               */}
      {/* ══════════════════════════════════════════════════ */}
      <section id="process" className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div data-animate="fade-up" className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">4 Simple Steps</h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto mt-2.5">From initial call to first kilowatt — we make solar integrations effortless.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div
              data-animate="fade-up"
              data-delay="0"
              className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center mb-5 shadow-xs">
                  01
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Free Consultation</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We assess your roof structure, shadow factors, and monthly bill patterns.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div
              data-animate="fade-up"
              data-delay="120"
              className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center mb-5 shadow-xs">
                  02
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Custom Design</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  3D engineering models mapped to maximize panel performance efficiency.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div
              data-animate="fade-up"
              data-delay="240"
              className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center mb-5 shadow-xs">
                  03
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Expert Install</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Certified local technicians deploy the panels and configure structures in 1-2 days.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div
              data-animate="fade-up"
              data-delay="360"
              className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center mb-5 shadow-xs">
                  04
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Start Saving</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Connect to the grid! Net metering goes live and your electricity bills zero out.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*            PROJECTS GALLERY                        */}
      {/* ══════════════════════════════════════════════════ */}
      <section id="projects" className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-50/50 content-visibility-auto border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
            <div data-animate="fade-left">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Recent Installations</h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Real rooftop and commercial solar installations delivered across Tamil Nadu.
              </p>
            </div>
            <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 hover:text-blue-600 hover:gap-2.5 transition-all shrink-0">
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Clean 2020s Project Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Project 1: Residential */}
            <div
              data-animate="fade-up"
              data-delay="0"
              className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col"
            >
              <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                <img
                  src="https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Modern Home Rooftop Solar"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3.5 left-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-xs border border-slate-200/80">
                    Residential
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    Modern Home 8.2 kWp Rooftop System
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                    Salem, TN • Net-Metered
                  </p>
                </div>
              </div>
            </div>

            {/* Project 2: Commercial Bunk */}
            <div
              data-animate="fade-up"
              data-delay="100"
              className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col"
            >
              <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                <img
                  src="https://images.pexels.com/photos/9875416/pexels-photo-9875416.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="HPCL Petrol Bunk Solar"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3.5 left-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-xs border border-slate-200/80">
                    Commercial Bunk
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    HPCL Retail Outlet Net-Metered Solar
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                    Karur, TN • 20 kW Canopy
                  </p>
                </div>
              </div>
            </div>

            {/* Project 3: Industrial */}
            <div
              data-animate="fade-up"
              data-delay="200"
              className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col"
            >
              <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                <img
                  src="https://images.pexels.com/photos/9875421/pexels-photo-9875421.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Industrial Factory Rooftop"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3.5 left-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-xs border border-slate-200/80">
                    Industrial
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    Textile Mill High-Tension Solar Array
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                    Erode, TN • 150 kW Shed Mount
                  </p>
                </div>
              </div>
            </div>

            {/* Project 4: Retail Canopy */}
            <div
              data-animate="fade-up"
              data-delay="300"
              className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col"
            >
              <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                <img
                  src="https://images.pexels.com/photos/9875414/pexels-photo-9875414.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Retail Canopy Solar"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3.5 left-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-xs border border-slate-200/80">
                    Commercial
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    Retail Commercial Complex Solar Roof
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                    Namakkal, TN • 40 kW Grid-Tied
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* ══════════════════════════════════════════════════ */}
      {/*        LATEST SOLAR GUIDES & BLOG (MIGRATED)       */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto">

          <div className="mb-8 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Learn More About Your Solar Options
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mt-1 sm:mt-2">
              Official guides on PM Surya Ghar subsidies, net-metering rules, and industrial MW solar execution in Tamil Nadu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

            {/* Blog Post 1: Salem */}
            <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col group">
              <div>
                <div className="h-44 sm:h-48 overflow-hidden relative">
                  <img
                    src="https://runhitechsolar.com/wp-content/uploads/2026/02/Salem-Blog-Poster-840x1050.jpg"
                    alt="Best Solar Company in Salem"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <div className="text-[11px] font-medium text-slate-400 mb-1.5">February 23, 2026</div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors leading-snug">
                    How to Claim Your PM Surya Ghar Subsidy: Expert Installation Guides for Salem, Karur & Namakkal.
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 sm:mt-2 leading-relaxed line-clamp-2">
                    Step-by-step roadmap for Salem homeowners to claim ₹78,000 government subsidy and eliminate high summer bi-monthly TNEB bills.
                  </p>
                </div>
              </div>
            </div>

            {/* Blog Post 2: Karur */}
            <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col group">
              <div>
                <div className="h-44 sm:h-48 overflow-hidden relative">
                  <img
                    src="https://runhitechsolar.com/wp-content/uploads/2026/02/karur-ads-poster-1-840x1050.jpg"
                    alt="Best Solar Company in Karur"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <div className="text-[11px] font-medium text-slate-400 mb-1.5">February 14, 2026</div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors leading-snug">
                    Why 2025 is the Best Time to Switch to Solar: Breaking Down the Government Subsidies.
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 sm:mt-2 leading-relaxed line-clamp-2">
                    Detailed guide on rooftop feasibility, load increase, and net-metering approvals across Karur textile hubs.
                  </p>
                </div>
              </div>
            </div>

            {/* Blog Post 3: Namakkal */}
            <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col group">
              <div>
                <div className="h-44 sm:h-48 overflow-hidden relative">
                  <img
                    src="https://runhitechsolar.com/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-21-at-17.54.23-840x857.jpeg"
                    alt="Best Solar Company in Namakkal"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
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
            </div>

            {/* Blog Post 4: MW Scale Tamil Nadu */}
            <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col group">
              <div>
                <div className="h-44 sm:h-48 overflow-hidden relative">
                  <img
                    src="https://runhitechsolar.com/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-21-at-16.50.27-840x857.jpeg"
                    alt="MW Solar Power Plant in Tamil Nadu"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <div className="text-[11px] font-medium text-slate-400 mb-1.5">August 21, 2025</div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors leading-snug">
                    MW Solar Power Plants in Tamil Nadu: The 2025 Guide to Captive, Group Captive & PPA.
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 sm:mt-2 leading-relaxed line-clamp-2">
                    Financial savings for spinning mills, foundries, and heavy manufacturing units across Tamil Nadu.
                  </p>
                </div>
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
          <div data-animate="zoom" className="bg-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-12 md:p-16 text-center relative overflow-hidden border border-slate-200/80 shadow-xl">

            {/* Static decorative corner rings (zero GPU repaint) */}
            <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full border border-blue-500/10 pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full border border-amber-500/10 pointer-events-none" />

            <div className="relative z-10">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-sm p-2 sm:p-2.5">
                <img src="/logo-icon.png" alt="Run Hi Tech Solar" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-slate-950 mb-2 sm:mb-4">Ready to Go Solar?</h2>
              <p className="text-slate-500 max-w-md mx-auto mb-6 sm:mb-10 text-xs sm:text-base md:text-lg">Request a free site assessment in Namakkal, Karur, Salem & Erode. No commitment.</p>

              {/* Form isolated to subcomponent for zero-latency instant typing */}
              <HomeAssessmentForm />
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*             COVERAGE DISTRICTS                     */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col items-center text-center">
          <span data-animate="fade-up" className="text-xs font-bold uppercase tracking-wider text-[#0f3d75] mb-3 block">
            Why Run Hi Tech Solar?
          </span>
          <h2 data-animate="fade-up" data-delay="80" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Powered 550+ Customers Since 2019. Here is Why They Trust Us.
          </h2>
          <p data-animate="fade-up" data-delay="160" className="mt-3 text-sm text-slate-500 max-w-xl">
            We don't just install solar panels; we build long-term energy independence. We are proud to be the trusted solar partner across Namakkal, Karur, Salem, Erode, Tirupur, and Coimbatore.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3.5 max-w-3xl">
            {districts.map((d, i) => (
              <span
                key={d}
                data-animate="zoom"
                data-delay={`${i * 60}`}
                className="inline-flex items-center justify-center rounded-full border border-slate-100 bg-slate-50 px-6 py-2.5 text-xs font-semibold text-slate-700 tracking-wide shadow-sm hover:border-[#0f3d75] transition-colors"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
