import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import Faq from "./Faq";

export default function ServicesPage() {

  const shorts = [
    {
      id: "hjInXtXVP0g",
      title: "PM Surya Ghar Rooftop Solar Installation Live",
      category: "Residential",
      views: "1.8K",
      desc: "Fast on-site rooftop mounting and wiring for PM Surya Ghar homes in Namakkal."
    },
    {
      id: "i1A4IYwfjrM",
      title: "HPCL Petrol Bunk Commercial Solar Setup",
      category: "Commercial Bunk",
      views: "2.4K",
      desc: "Heavy-duty commercial canopy solar structure powering fuel dispensers 24/7."
    },
    {
      id: "AQcLj2AhHG4",
      title: "Industrial Solar Power Engineering in Tamil Nadu",
      category: "Industrial MW",
      views: "3.1K",
      desc: "High-voltage captive solar power plant for spinning mills and factories."
    },
    {
      id: "N2B3sJY4p1s",
      title: "TNEB Net-Metering Grid Synchronization",
      category: "Net-Metering",
      views: "1.5K",
      desc: "Bi-directional smart meter connection feeding excess solar units back to TNEB."
    },
    {
      id: "eXiGyR6QT0Q",
      title: "Tier-1 Mono-PERC High-Efficiency Solar Panels",
      category: "Hardware Testing",
      views: "2.9K",
      desc: "Inspection of anti-reflective multi-busbar panels built for 30-year peak yield."
    },
  ];

  const services = [
    {
      id: "residential",
      title: "Home Solar Installation",
      subtitle: "PM Surya Ghar Govt Subsidy Scheme",
      desc: "Installing solar on your home roof in Tamil Nadu is now very simple with the PM Surya Ghar government subsidy. Run Hi Tech Solar helps you get up to ₹78,000 subsidy directly into your bank account, and we take care of all TNEB paperwork for you.",
      bullets: [
        "Government subsidy up to ₹78,000 directly to your bank account",
        "1 kW to 10 kW rooftop solar with 30 years panel warranty",
        "Save ₹15,000 to ₹35,000 every year on electricity bills",
        "Our local team handles roof survey, installation & all subsidy papers"
      ],
      ideal: "💡 Best for: Individual houses, villas, and apartments.",
      image: "https://runhitechsolar.com/wp-content/uploads/2025/08/Residential-Solar.jpg",
      badge: "Govt Subsidy Eligible",
      cta: "Check Your Subsidy Amount"
    },
    {
      id: "commercial",
      title: "Solar for Petrol Bunks & Shops",
      subtitle: "Reduce EB Bills for Businesses",
      desc: "High electricity bills take away your business profits. Our commercial solar systems are proven on 350+ petrol bunks, hotels, schools, hospitals, and shopping stores across Tamil Nadu.",
      bullets: [
        "350+ HPCL and private petrol bunks running on our solar across Tamil Nadu",
        "Save 50% to 70% on monthly electricity bills",
        "Recover your full solar investment in just 3 to 4 years",
        "Income tax and depreciation benefits for business owners"
      ],
      ideal: "💡 Best for: Petrol bunks, hotels, schools, hospitals & grocery supermarkets.",
      image: "https://runhitechsolar.com/wp-content/uploads/2025/08/🏢-Commercial-Solar-copy.jpg",
      badge: "350+ Bunks Solarized",
      cta: "Request Free Site Survey"
    },
    {
      id: "industrial",
      title: "Solar for Spinning Mills & Factories",
      subtitle: "Big Solar Power Plants for Industries",
      desc: "Heavy industries and textile mills face huge electricity costs every month. Our large-scale solar power plants give you low-cost, reliable green electricity for 30+ years.",
      bullets: [
        "Over 10+ MW industrial solar projects successfully running in Tamil Nadu",
        "Own your own solar power plant (Captive Solar) and save maximum money",
        "Zero-investment solar plan available (PPA – pay only for units used)",
        "Save taxes with accelerated depreciation and GST benefits"
      ],
      ideal: "💡 Best for: Textile mills, foundries, poultry farms, paper mills & factories.",
      image: "https://runhitechsolar.com/wp-content/uploads/2025/08/MW-Solar-Projects-copy.jpg",
      badge: "10+ MW Installed",
      cta: "Talk to Solar Engineer"
    },
    {
      id: "hybrid",
      title: "Solar with Battery Backup",
      subtitle: "24-Hour Non-Stop Electricity",
      desc: "Stop power cut problems for your home or business. Our solar systems with strong Lithium batteries give you electricity non-stop even during TNEB power cuts. No diesel fuel needed.",
      bullets: [
        "Automatically switches on in seconds during power cuts",
        "Long-lasting Lithium (LiFePO4) battery with 15+ years lifespan",
        "Uses stored solar power at night to save extra electricity charges",
        "Easy mobile phone app to see your power generation daily"
      ],
      ideal: "💡 Best for: Homes, clinics, and businesses that need non-stop power.",
      image: "https://runhitechsolar.com/wp-content/uploads/2025/08/🌗-Hybrid-Solar-copy.jpg",
      badge: "Non-Stop Power",
      cta: "Get Battery Backup Quote"
    }
  ];

  return (
    <div className="bg-dark-950 text-ink min-h-screen pt-28 sm:pt-32 pb-24 relative z-10">
      
      {/* Page Header with High-Resolution Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              <span className="gradient-text-shine">Our Solar Services in Tamil Nadu</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed">
              At Run Hi Tech Solar, we believe in powering Tamil Nadu with clean, affordable, and reliable solar energy. Since 2019, we have completed 550+ successful solar installations covering homes, petrol bunks, commercial spaces, and industries.
            </p>
            
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
              <a
                href="#residential"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-sm transition-all text-center flex-1 sm:flex-none"
              >
                View Services
              </a>
              <Link
                to="/subsidy"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-6 py-3.5 rounded-xl transition-all text-center flex-1 sm:flex-none"
              >
                PM Surya Ghar Subsidies
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center p-2 sm:p-4">
            <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900 group">
              <img
                src="https://runhitechsolar.com/wp-content/uploads/2021/01/solar-system-2939560-scaled.jpg"
                alt="Run Hi Tech Solar Rooftop Solar System"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h4 className="text-sm font-bold leading-tight drop-shadow-sm">
                  Run Hi Tech Solar Engineering
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-16 sm:mt-24 space-y-16 sm:space-y-24">
        {services.map((s, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={s.id}
              id={s.id}
              className={`grid lg:grid-cols-12 gap-8 lg:gap-16 items-center ${
                isEven ? "" : "lg:grid-flow-dense"
              }`}
            >
              {/* Image */}
              <div className={`lg:col-span-6 ${isEven ? "" : "lg:col-start-7"}`}>
                <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-100 group aspect-[4/3]">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                    <span className="text-xs font-semibold text-blue-700">
                      {s.badge}
                    </span>
                  </div>
                </div>
              </div>

              {/* Copy */}
              <div className={`lg:col-span-6 space-y-4 sm:space-y-6 ${isEven ? "" : "lg:col-start-1"}`}>
                <div>
                  <span className="text-sm font-semibold text-blue-600 block">
                    {s.subtitle}
                  </span>
                  <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    {s.title}
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
                
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 list-disc list-outside pl-5">
                  {s.bullets.map((b, idx) => (
                    <li key={idx}>
                      {b}
                    </li>
                  ))}
                </ul>


                <div className="pt-2">
                  <Link 
                    to="/contact"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-sm inline-flex items-center gap-2 transition-all active:scale-95"
                  >
                    <span>{s.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          );
        })}
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/*  YOUTUBE SHORTS REELS SHOWCASE (Real Project Videos)       */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-20 sm:mt-28">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Watch Our Live On-Site Solar Projects
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Authentic installation footage from our engineering team working on PM Surya Ghar homes, HPCL petrol bunks, and industrial plants.
            </p>
          </div>

          <a
            href="https://www.youtube.com/@runhitechsolar6700/shorts"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md transition-all shrink-0 active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>Visit YouTube Channel ↗</span>
          </a>
        </div>

        {/* 9:16 Vertical Reel Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mt-8">
          {shorts.map((short, idx) => (
            <div
              key={short.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Vertical 9:16 Player Container */}
              <div className="relative aspect-[9/16] bg-slate-900 overflow-hidden">
                <iframe
                  className="w-full h-full border-0"
                  src={`https://www.youtube.com/embed/${short.id}?controls=1&rel=0&loop=1&modestbranding=1`}
                  title={short.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Card Meta & YouTube Action */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5 bg-white">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-mono font-bold">
                      {short.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-medium">
                      Reel #{idx + 1}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {short.title}
                  </h4>
                </div>

                <a
                  href={`https://www.youtube.com/shorts/${short.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 text-[11px] font-bold transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open in YouTube</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Embedded FAQ Accordion */}
      <section className="mt-20 sm:mt-28">
        <Faq />
      </section>

    </div>
  );
}
