import { Link } from "react-router-dom";
import Faq from "./Faq";

export default function SubsidyPage() {
  const steps = [
    {
      title: "1. Site Feasibility",
      desc: "Our engineers inspect your roof space, shadow obstacles, and sanctioned load capacity."
    },
    {
      title: "2. Registration & Design",
      desc: "We submit your load increase (if needed) and register your application on the PM Surya Ghar portal."
    },
    {
      title: "3. Installation & Net-Metering",
      desc: "We install the solar arrays and coordinate with TANGEDCO/TNEB for net-metering solar meter installation."
    },
    {
      title: "4. Inspection & Subsidy",
      desc: "The officials verify the installation, submit the joint commissioning report, and release the subsidy (up to ₹78,000) directly to your bank account."
    }
  ];

  return (
    <div className="bg-dark-950 text-ink min-h-screen pt-32 pb-10 relative z-10 font-sans antialiased" style={{ fontFamily: "var(--font-sans)" }}>
      
      {/* Introduction with High-Resolution Image */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              <span className="gradient-text-shine">PM Surya Ghar Muft Bijli Yojana Subsidy</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate leading-relaxed">
              The national solar subsidy program offers substantial financial assistance to households switching to clean solar power. Run Hi Tech Solar handles the complete registration, engineering, and net-metering liaisoning process.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-sm transition-all"
              >
                Apply for Subsidy
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
          Subsidy Matrix & Estimated Yields
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          
          {/* 1 kW */}
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between font-sans">
            <div>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 block">1 kW System</span>
              <span className="block text-3xl sm:text-4xl font-extrabold text-slate-950 mt-2 tracking-tight tabular-nums">₹30,000</span>
              <span className="block text-xs sm:text-sm text-slate-600 font-medium mt-1">Direct Govt Subsidy</span>
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
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 block">2 kW System</span>
              <span className="block text-3xl sm:text-4xl font-extrabold text-slate-950 mt-2 tracking-tight tabular-nums">₹60,000</span>
              <span className="block text-xs sm:text-sm text-slate-600 font-medium mt-1">Direct Govt Subsidy</span>
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
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 block">3 kW to 10 kW System</span>
              <span className="block text-3xl sm:text-4xl font-extrabold text-slate-950 mt-2 tracking-tight tabular-nums">₹78,000</span>
              <span className="block text-xs sm:text-sm text-slate-600 font-medium mt-1">Direct Govt Subsidy (Max)</span>
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
      </section>

      {/* Subsidy Process Workflow */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mt-14 sm:mt-16">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
            How We Handle the Process
          </h2>
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
