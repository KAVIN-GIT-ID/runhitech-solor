import { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
const Solar3DAbout = lazy(() => import("./3d/Solar3DAbout"));
import LazyCanvasInView from "./3d/LazyCanvasInView";
import { Plus } from "lucide-react";

export default function AboutPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const stats = [
    { value: "550+", label: "Projects Powered", desc: "Proven authority across Western and Central Tamil Nadu since 2019." },
    { value: "350+", label: "HPCL Retail Petrol Bunks", desc: "Solarized for maximum efficiency across Tamil Nadu." },
    { value: "200+", label: "Residential Rooftops", desc: "Commissioned under government subsidy schemes." },
    { value: "10+ MW", label: "Industrial & Commercial", desc: "Utility-scale solar plants deployed." }
  ];

  const aboutFaqs = [
    {
      q: "1. How can I apply for solar subsidy in Tamil Nadu?",
      a: "You can apply through the PM Surya Ghar Muft Bijli Yojana portal. At Run Hi Tech Solar, our dedicated local team assists you with the complete end-to-end subsidy application, document verification, inspection, and installation process so your subsidy gets credited directly into your bank account."
    },
    {
      q: "2. What is the benefit of solar for petrol bunks?",
      a: "Petrol bunks run 24/7 and consume high electricity with dispensers, lighting, and coolers. By installing solar, you can cut power costs by 50% to 70% and get fast ROI in just 3 to 4 years. That is why 350+ HPCL bunks already trust Run Hi Tech Solar across Tamil Nadu."
    },
    {
      q: "3. How much subsidy will I get for a home solar system?",
      a: "Under the PM Surya Ghar Muft Bijli Yojana scheme, you receive ₹30,000 for 1 kW, ₹60,000 for 2 kW, and up to ₹78,000 for 3 kW and higher rooftop solar systems."
    },
    {
      q: "4. Do industries get solar benefits?",
      a: "Yes. With our 10+ MW portfolio across Tamil Nadu, we help textile mills, spinning units, factories, and warehouses reduce huge monthly EB bills, claim accelerated depreciation tax benefits, and transition to sustainable green power."
    },
    {
      q: "5. Why choose Run Hi Tech Solar over others?",
      a: "Because we combine 5+ years of trusted experience (550+ commissioned projects), dedicated direct government subsidy support, tier-1 high quality hardware with 30-year warranty, and strong local service presence across Namakkal, Karur, Salem, Erode, Tirupur & Coimbatore."
    }
  ];

  return (
    <div className="bg-dark-950 text-ink min-h-screen pt-28 sm:pt-32 pb-20 relative z-10">
      
      {/* ══════════════════════════════════════════════════ */}
      {/*  HERO / INTRO SECTION                              */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute -left-10 top-0 w-80 h-80 rounded-full bg-neon-cyan/5 blur-3xl" />
        
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          
          {/* Left Text */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              <span className="gradient-text-shine">Stop Renting Your Power. Claim Your Energy Independence Today.</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed">
              You shouldn't have to deal with endless EB bill hikes, unpredictable power cuts, or confusing government paperwork just to keep your lights on. At Run Hi Tech Solar, we believe clean, affordable, and reliable energy should be completely stress-free.
            </p>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed">
              Since 2019, we have served as the trusted EPC (Engineering, Procurement, and Construction) solar guide for families and industries across Tamil Nadu. As a government-approved vendor under the PM Surya Ghar: Muft Bijli Yojana, we provide 100% end-to-end solar deployment. From the first site survey to securing your net-metering approvals and maintaining your panels for decades, we handle the heavy lifting so you don't have to.
            </p>
            
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                to="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-sm transition-all text-center flex-1 sm:flex-none"
              >
                Get Your Free Feasibility Survey & Quote Today
              </Link>
              <Link
                to="/services"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-6 py-3.5 rounded-xl transition-all text-center flex-1 sm:flex-none"
              >
                Explore Services
              </Link>
            </div>
          </div>

          {/* Right 3D Solar Panel (Deferred until near viewport) */}
          <div className="flex justify-center items-center min-h-[380px] w-full">
            <LazyCanvasInView height="380px">
              <Suspense
                fallback={
                  <div className="w-full h-[380px] flex items-center justify-center rounded-3xl bg-slate-900/10 border border-slate-200/50">
                    <div className="w-7 h-7 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                  </div>
                }
              >
                <Solar3DAbout height="380px" />
              </Suspense>
            </LazyCanvasInView>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*  METRICS DASHBOARD                                 */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-16 sm:mt-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => (
            <div 
              key={idx}
              className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white relative overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md hover:border-slate-300"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-tr-2xl" />
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-600 block tracking-tight">
                {s.value}
              </span>
              <h3 className="mt-3 text-base sm:text-lg font-bold text-slate-900">
                {s.label}
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*  OUR SUCCESS: JOURNEY & ACHIEVEMENTS               */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-16 sm:mt-24">
        <div className="bg-slate-50/80 border border-slate-200/90 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-sm">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0f3d75] block">
                OUR SUCCESS
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                Proven Authority: 550+ Projects Powered Since 2019
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                We don't just promise results; we engineer them. Our track record across Western and Central Tamil Nadu speaks for itself:
              </p>
              
              <ul className="space-y-3.5 text-slate-700 text-xs sm:text-sm md:text-base pt-2 list-disc list-outside pl-5">
                <li>
                  <strong>350+ HPCL Retail Petrol Bunks</strong> solarized for maximum efficiency.
                </li>
                <li>
                  <strong>200+ Residential Rooftops</strong> commissioned under government subsidy schemes.
                </li>
                <li>
                  <strong>10+ MW of Industrial and Commercial</strong> utility-scale solar plants deployed.
                </li>
                <li>
                  <strong>Our Local Support Network Covers:</strong> Namakkal | Karur | Salem | Erode | Tirupur | Coimbatore
                </li>
              </ul>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-[4/3]">
                <img
                  src="https://runhitechsolar.com/wp-content/uploads/2025/08/beautiful-alternative-energy-plant-with-solar-panels-scaled.jpg"
                  alt="Solar alternative energy plant"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*  WHY CUSTOMERS TRUST US & OFFICIAL VIDEO           */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-16 sm:mt-24">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Video Embed */}
          <div className="lg:col-span-6 space-y-3">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-black aspect-video relative">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/itS7dt9OEmI?controls=1&rel=0"
                title="Run Hi Tech Solar — Official Solar Maintenance & Installation Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <div className="flex items-center justify-end px-2 text-xs">
              <a
                href="https://youtube.com/@runhitechsolar6700?si=MRND1Y3BAhokuwYg"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-red-600 hover:text-red-700 transition-colors inline-flex items-center gap-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Subscribe on YouTube →
              </a>
            </div>
          </div>

          {/* Right Checklist */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              Why Choose Us? (The Run Hi Tech Advantage)
            </h2>
            
            <ul className="space-y-3 pt-2 text-xs sm:text-sm md:text-base text-slate-700 list-disc list-outside pl-5">
              <li>
                <strong>Zero-Hassle Execution:</strong> A single-window experience covering 3D design, component supply, TANGEDCO/EB approvals, and direct subsidy disbursements.
              </li>
              <li>
                <strong>Guaranteed Subsidy Support:</strong> We provide dedicated, step-by-step assistance to secure your central government subsidy of up to ₹78,000.
              </li>
              <li>
                <strong>Tier-1 Equipment for Lifetime ROI:</strong> We install only high-efficiency Mono PERC and TOPCon modules, backed by a 25+ year performance warranty.
              </li>
              <li>
                <strong>Lightning-Fast Turnaround:</strong> Your residential rooftop system is fully installed and operational within 7 to 10 days.
              </li>
              <li>
                <strong>Localized, Rapid-Response Maintenance:</strong> Our regional technicians provide panel cleaning, inverter diagnostics, and Annual Maintenance Contracts (AMC) to ensure your system runs at peak capacity.
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*  VISION & MISSION                                  */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-16 sm:mt-24 grid md:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Our Vision */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">Our Vision</h3>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            To become Tamil Nadu’s most trusted solar company, powering <strong>10,000+ homes</strong> and <strong>100+ MW solar projects</strong> by 2030.
          </p>
        </div>

        {/* Our Mission */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">Our Mission</h3>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            To deliver clean, affordable, and government-subsidized solar energy to every Tamil Nadu home and industry by building <strong>trust, transparency, and quality service</strong>.
          </p>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*  FREQUENTLY ASKED QUESTIONS (ABOUT US)             */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 mt-16 sm:mt-24">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0f3d75] mb-2 block">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {aboutFaqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none"
              >
                <span className="text-sm sm:text-base font-bold text-slate-900 pr-3">{faq.q}</span>
                <Plus
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 transition-transform duration-300 ${
                    activeFaq === idx ? "rotate-45" : ""
                  }`}
                />
              </button>
              <div
                className="transition-all duration-300 ease-in-out overflow-hidden"
                style={{ maxHeight: activeFaq === idx ? "260px" : "0px" }}
              >
                <p className="px-5 pb-5 sm:px-6 sm:pb-6 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-3 sm:pt-4">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>



    </div>
  );
}
