import { Link } from "react-router-dom";
import Faq from "./Faq";

export default function SubsidyPage() {
  const steps = [
    {
      title: "Lightning-Fast Execution",
      desc: "Your system will be fully installed and generating clean power within just 7 to 10 days."
    },
    {
      title: "100% Subsidy Assistance",
      desc: "We manage all national portal registrations and state DISCOM paperwork so you get your money faster."
    },
    {
      title: "Proven Track Record",
      desc: "Over 200+ successful subsidy-backed home installations completed across the state."
    },
    {
      title: "Local Support",
      desc: "Active, rapid-response service networks covering Namakkal, Karur, Salem, Erode, Tirupur, and Coimbatore."
    }
  ];

  return (
    <div className="bg-dark-950 text-ink min-h-screen pt-32 pb-10 relative z-10 font-sans antialiased" style={{ fontFamily: "var(--font-sans)" }}>
      
      {/* Introduction with High-Resolution Image */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              <span className="gradient-text-shine">Stop Overpaying for Electricity. Claim Your ₹78,000 PM Surya Ghar Subsidy Today.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate leading-relaxed">
              High EB bills are a constant monthly drain on your household budget. The central government’s PM Surya Ghar: Muft Bijli Yojana was created to fix exactly that, offering direct financial relief to Tamil Nadu homeowners.
            </p>
            <p className="mt-4 text-base sm:text-lg text-slate leading-relaxed">
              You can receive up to ₹78,000 deposited directly into your bank account when you switch to solar. At Run Hi Tech Solar, we handle the entire TANGEDCO approval process so you can secure your subsidy without the headache.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-sm transition-all"
              >
                Check My Subsidy Eligibility & Get a Free Quote
              </Link>
              <a
                href="#faq"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-6 py-3 rounded-xl transition-all"
              >
                Subsidy FAQ
              </a>
            </div>
          </div>

          {/* High-Resolution PM Surya Ghar Rooftop Photo Showcase */}
          <div className="relative group">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white aspect-[4/3]">
              <img
                src="/hero-house.jpg"
                alt="PM Surya Ghar Rooftop Solar Installation"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h4 className="text-sm font-bold tracking-tight text-white drop-shadow-sm">
                  Residential Rooftop Solar System — PM Surya Ghar Yojana
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subsidy Matrix Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mt-12 sm:mt-14 font-sans antialiased" style={{ fontFamily: "var(--font-sans)" }}>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans">
          💰 Your PM Surya Ghar Subsidy Breakdown
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          
          {/* 1 kW */}
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between font-sans">
            <div>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 block">Solar System Size</span>
              <span className="block text-xl sm:text-2xl font-bold text-slate-900 mt-1">1 kW</span>
              <span className="block text-3xl sm:text-4xl font-extrabold text-blue-600 mt-3 tracking-tight tabular-nums">₹30,000</span>
              <span className="block text-xs sm:text-sm text-slate-600 font-medium mt-1">Government Subsidy (Direct to Bank)</span>
            </div>
            
            <ul className="mt-6 space-y-3 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-6">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>Roof space needed: <strong className="text-slate-900 font-semibold">~100 sq.ft</strong></span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>Daily Generation: <strong className="text-slate-900 font-semibold">~4-5 Units</strong></span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>Ideal for: <strong className="text-slate-900 font-semibold">Small homes (EB ~₹1,000)</strong></span>
              </li>
            </ul>
          </div>

          {/* 2 kW */}
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between font-sans">
            <div>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 block">Solar System Size</span>
              <span className="block text-xl sm:text-2xl font-bold text-slate-900 mt-1">2 kW</span>
              <span className="block text-3xl sm:text-4xl font-extrabold text-blue-600 mt-3 tracking-tight tabular-nums">₹60,000</span>
              <span className="block text-xs sm:text-sm text-slate-600 font-medium mt-1">Government Subsidy (Direct to Bank)</span>
            </div>
            
            <ul className="mt-6 space-y-3 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-6">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>Roof space needed: <strong className="text-slate-900 font-semibold">~200 sq.ft</strong></span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>Daily Generation: <strong className="text-slate-900 font-semibold">~8-10 Units</strong></span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>Ideal for: <strong className="text-slate-900 font-semibold">Moderate homes (EB ~₹2,500)</strong></span>
              </li>
            </ul>
          </div>

          {/* 3 kW+ */}
          <div className="bg-white p-7 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-md hover:shadow-lg transition-all relative flex flex-col justify-between font-sans">
            <div className="absolute top-6 right-6">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white bg-slate-900 px-3 py-1 rounded-full shadow-xs">
                MAX SUBSIDY
              </span>
            </div>
            <div>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 block">Solar System Size</span>
              <span className="block text-xl sm:text-2xl font-bold text-slate-900 mt-1">3 kW and Above</span>
              <span className="block text-3xl sm:text-4xl font-extrabold text-blue-600 mt-3 tracking-tight tabular-nums">₹78,000</span>
              <span className="block text-xs sm:text-sm text-slate-600 font-medium mt-1">Government Subsidy (Direct to Bank - Maximum Cap)</span>
            </div>
            
            <ul className="mt-6 space-y-3 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-6">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5 shrink-0" />
                <span>Roof space needed: <strong className="text-slate-900 font-semibold">~300+ sq.ft</strong></span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5 shrink-0" />
                <span>Daily Generation: <strong className="text-slate-900 font-semibold">~12-15 Units (per 3kW)</strong></span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5 shrink-0" />
                <span>Ideal for: <strong className="text-slate-900 font-semibold">Large homes (EB ~₹4,000+)</strong></span>
              </li>
            </ul>
          </div>

        </div>

        {/* The Real Impact: A 90% Drop in Your EB Bill */}
        <div className="mt-8 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            📉 The Real Impact: A 90% Drop in Your EB Bill
          </h3>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Solar is a one-time investment that protects your wallet and pays you back for over 25 years. Here is what that looks like for a typical Tamil Nadu family:
          </p>
          <div className="mt-4 grid sm:grid-cols-2 gap-4 max-w-lg">
            <div className="bg-red-50/70 border border-red-200/80 rounded-2xl p-4 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700 block">Before Solar</span>
              <span className="text-xl sm:text-2xl font-extrabold text-red-900 block mt-1">Monthly EB Bill: ₹3,000</span>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">After Solar</span>
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-900 block mt-1">Monthly EB Bill: ₹200</span>
            </div>
          </div>
        </div>
      </section>

      {/* Subsidy Process Workflow */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mt-14 sm:mt-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            ⚙️ How Run Hi Tech Solar Makes It Frictionless
          </h2>
          <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
            We specialize in high-efficiency Hybrid and Grid-connected residential systems. Here is why over 200+ households have trusted us to handle their PM Surya Ghar installations:
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 sm:mt-10">
          {steps.map((s, idx) => (
            <div key={idx} className="bg-white border border-slate-200/90 p-6 sm:p-7 rounded-2xl flex flex-col justify-between shadow-xs hover:border-slate-300 hover:shadow-sm transition-all">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{s.title}</h3>
                <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
              <span className="text-xs font-bold text-slate-400 mt-6 block text-right">0{idx + 1}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Embedded FAQ Accordion */}
      <div className="mt-8 sm:mt-10">
        <Faq />
      </div>

    </div>
  );
}
