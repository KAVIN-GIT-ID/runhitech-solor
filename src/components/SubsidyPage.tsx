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
    <div className="bg-dark-950 text-ink min-h-screen pt-32 pb-20 relative z-10">
      
      {/* Introduction with High-Resolution Image */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-neon-cyan font-mono">GOVERNMENT SCHEME</p>
            <h1 className="font-display mt-4 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
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
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider">
                    Govt Subsidy: Up to ₹78,000
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-600/90 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider">
                    MNRE Empanelled
                  </span>
                </div>
                <h4 className="text-sm font-bold tracking-tight text-white drop-shadow-sm">
                  Residential Rooftop Solar System — PM Surya Ghar Yojana
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subsidy Matrix Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mt-20">
        <h2 className="font-display text-2xl font-semibold text-ink tracking-tight">
          Subsidy Matrix & Estimated Yields
        </h2>
        <p className="text-xs text-slate mt-1 max-w-xl">
          *Exact figures depend on panel brand choices, structural elevations, and net-metering processing approvals.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          
          {/* 1 kW */}
          <div className="card-3d glow-border p-8 rounded-3xl border border-slate-200 bg-white relative overflow-hidden transition-all duration-300 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-neon-blue font-mono">1 kW System</span>
            <span className="block font-display text-4xl font-bold text-ink mt-3 font-mono">₹30,000</span>
            <span className="block text-xs text-neon-cyan font-semibold mt-1">Direct Govt Subsidy</span>
            
            <ul className="mt-6 space-y-2 text-xs text-slate border-t border-slate-100 pt-6">
              <li>• Roof space needed: ~100 sq.ft</li>
              <li>• Daily Generation: ~4-5 Units</li>
              <li>• Ideal for: Small homes (monthly EB bill ~₹1,000)</li>
            </ul>
          </div>

          {/* 2 kW */}
          <div className="card-3d glow-border p-8 rounded-3xl border border-slate-200 bg-white relative overflow-hidden transition-all duration-300 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-neon-blue font-mono">2 kW System</span>
            <span className="block font-display text-4xl font-bold text-ink mt-3 font-mono">₹60,000</span>
            <span className="block text-xs text-neon-cyan font-semibold mt-1">Direct Govt Subsidy</span>
            
            <ul className="mt-6 space-y-2 text-xs text-slate border-t border-slate-100 pt-6">
              <li>• Roof space needed: ~200 sq.ft</li>
              <li>• Daily Generation: ~8-10 Units</li>
              <li>• Ideal for: Moderate homes (monthly EB bill ~₹2,500)</li>
            </ul>
          </div>

          {/* 3 kW+ */}
          <div className="card-3d glow-border p-8 rounded-3xl border border-neon-cyan/20 bg-gradient-to-tr from-neon-cyan/10 to-transparent relative overflow-hidden transition-all duration-300 shadow-sm">
            <div className="absolute top-4 right-4 z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-neon-cyan to-neon-blue px-2.5 py-1 rounded shadow-sm font-mono">
                MAX SUBSIDY
              </span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-neon-cyan font-mono">3 kW to 10 kW System</span>
            <span className="block font-display text-4xl font-bold text-ink mt-3 font-mono">₹78,000</span>
            <span className="block text-xs text-neon-cyan font-semibold mt-1">Direct Govt Subsidy (Max)</span>
            
            <ul className="mt-6 space-y-2 text-xs text-slate border-t border-slate-100 pt-6">
              <li>• Roof space needed: ~300+ sq.ft</li>
              <li>• Daily Generation: ~12-15 Units (per 3kW)</li>
              <li>• Ideal for: Large homes (monthly EB bill ~₹4,000+)</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Subsidy Process Workflow */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mt-28">
        <div className="text-center max-w-xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-neon-cyan font-mono">STEP-BY-STEP FLOW</p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink">
            How We Handle the Process
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {steps.map((s, idx) => (
            <div key={idx} className="card-3d bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="font-display font-semibold text-ink text-base">{s.title}</h3>
                <p className="mt-3 text-xs text-slate leading-relaxed">{s.desc}</p>
              </div>
              <span className="text-xs font-display font-bold text-neon-cyan/30 mt-6 block text-right font-mono">0{idx + 1}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Embedded FAQ Accordion */}
      <section className="mt-28">
        <Faq />
      </section>

      {/* Check Eligibility Callout */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mt-20">
        <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <h3 className="font-display text-2xl font-bold text-ink">
            Check your roof size and subsidy potential
          </h3>
          <p className="text-xs text-slate max-w-lg mx-auto">
            Our engineering team will assess your roof dimensions and guide you on the exact TNEB/TANGEDCO subsidy requirements.
          </p>
          <div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded bg-gradient-to-r from-neon-cyan to-neon-blue text-white font-bold px-8 py-4 hover:shadow-lg transition-all duration-300"
            >
              Get Free Survey Consultation
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 5h12M9 1l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
