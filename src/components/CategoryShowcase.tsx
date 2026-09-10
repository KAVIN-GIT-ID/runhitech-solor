import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  PhoneCall
} from "lucide-react";

export type CategoryKey = "residential" | "commercial" | "bulk";

interface CategoryShowcaseProps {
  initialCategory?: CategoryKey;
}

export default function CategoryShowcase({ initialCategory = "residential" }: CategoryShowcaseProps) {
  const [activeTab, setActiveTab] = useState<CategoryKey>(initialCategory);

  const categories = [
    {
      id: "residential" as CategoryKey,
      title: "Residential Solar",
      shortTitle: "Residential Homes",
      tagline: "Turn your roof into an asset. We install premium home systems and process your PM Surya Ghar subsidy smoothly, with zero headache for you.",
      payback: "3 to 4 Years",
      warranty: "30 Years",
      statHighlight: "Up to ₹78,000",
      statLabel: "Direct Bank Subsidy",
      highlights: [
        { label: "Hybrid Solar (Solar + Battery)", value: "Never lose power again. Enjoy 24/7 uninterrupted power backup during grid cuts and nighttime." },
        { label: "Central Subsidy", value: "Direct credit into your bank account under PM Surya Ghar Muft Bijli Yojana." },
        { label: "100% Bill Offset", value: "Bi-directional smart net-metering synchronization with TANGEDCO LT-1A grid." },
        { label: "Elevated Roof Mounting", value: "Custom non-penetrative structures that protect your terrace waterproofing." }
      ],
      image: "/solar_home_hero.jpg",
      ctaText: "Check Subsidy & Get Free Survey",
      ctaHref: "/subsidy"
    },
    {
      id: "commercial" as CategoryKey,
      title: "Commercial Solar",
      shortTitle: "Commercial & Petrol Bunks",
      tagline: "Boost your bottom line. We design custom, high-ROI solar solutions for hospitals, hotels, retail shops, and petrol bunks.",
      payback: "2.5 to 3.5 Years",
      warranty: "30 Years",
      statHighlight: "40% Write-Off",
      statLabel: "Year 1 Tax Depreciation",
      highlights: [
        { label: "Section 32 Tax Benefit", value: "Claim 40% accelerated depreciation in Year 1 for significant corporate tax savings." },
        { label: "Diesel Generator Offset", value: "Automatic zero-export inverter synchronization to eliminate costly daytime DG runs." },
        { label: "Fuel Canopy Engineering", value: "Elevated high-tensile structural steel mounts without roof drilling or leaks." },
        { label: "Rapid Investment Payback", value: "100% CAPEX recovery in under 3.5 years based on commercial LT-V tariffs." }
      ],
      image: "/solar_petrol_bunk.jpg",
      ctaText: "Request Commercial Feasibility Survey",
      ctaHref: "#contact"
    },
    {
      id: "bulk" as CategoryKey,
      title: "MW Solar Projects",
      shortTitle: "Industrial & Solar Farms",
      tagline: "Captive, Group Captive, and PPA installations engineered for massive, long-term industrial energy savings.",
      payback: "3 to 4 Years",
      warranty: "30 Years",
      statHighlight: "~₹3.80 / unit",
      statLabel: "Captive Solar LCOE",
      highlights: [
        { label: "Massive Cost Arbitrage", value: "Lock in clean captive solar power at ~₹3.80/unit vs ₹8.50+ escalating grid rates." },
        { label: "End-to-End Clearances", value: "Complete statutory liaison for CEIG approvals, HT substations, and TANGEDCO synchronization." },
        { label: "Flexible Financing Models", value: "Choose between direct CAPEX ownership or Zero-Capex OPEX / PPA power purchase agreements." },
        { label: "Industrial SCADA Monitoring", value: "Real-time generation telemetry, meteorological stations, and comprehensive annual O&M." }
      ],
      image: "/solar_industrial_factory.jpg",
      ctaText: "Consult Industrial Solar Engineer",
      ctaHref: "#contact"
    }
  ];

  const current = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <section id="categories" className="py-20 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Powerful Energy Solutions for Homes and Businesses
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            Turnkey solar EPC services engineered for residential rooftops, commercial establishments, and heavy industrial facilities across Tamil Nadu.
          </p>
        </div>

        {/* 2020s Segmented Pill Switcher */}
        <div className="inline-flex flex-wrap p-1.5 bg-slate-200/80 rounded-2xl gap-1.5 mb-8 sm:mb-10">
          {categories.map((cat) => {
            const isSelected = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-300/40"
                }`}
              >
                {cat.shortTitle}
              </button>
            );
          })}
        </div>

        {/* Main 2020s Showcase Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-10 lg:p-12">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            
            {/* Left Details Column */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {current.title}
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base mt-2.5 leading-relaxed">
                    {current.tagline}
                  </p>
                </div>

                {/* Key Metrics Row (Apple / Linear style) */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 py-4 border-y border-slate-200/80">
                  <div>
                    <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{current.payback}</div>
                    <div className="text-xs font-semibold text-slate-500 mt-0.5">Payback Period</div>
                  </div>
                  <div className="border-l border-slate-200 pl-3 sm:pl-4">
                    <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{current.warranty}</div>
                    <div className="text-xs font-semibold text-slate-500 mt-0.5">Warranty Yield</div>
                  </div>
                  <div className="border-l border-slate-200 pl-3 sm:pl-4">
                    <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">{current.statHighlight}</div>
                    <div className="text-xs font-semibold text-slate-500 mt-0.5">{current.statLabel}</div>
                  </div>
                </div>

                {/* Clean Value Highlights (Normal Bullet Points) */}
                <ul className="space-y-3 pt-1">
                  {current.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-2" />
                      <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <span className="font-bold text-slate-900">{h.label}: </span>
                        <span>{h.value}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3.5">
                {current.ctaHref.startsWith("/") ? (
                  <Link
                    to={current.ctaHref}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base transition-all shadow-sm active:scale-98 cursor-pointer"
                  >
                    <span>{current.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <a
                    href={current.ctaHref}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base transition-all shadow-sm active:scale-98 cursor-pointer"
                  >
                    <span>{current.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}

                {activeTab === "residential" && (
                  <Link
                    to="/subsidy"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm sm:text-base transition-colors"
                  >
                    <span>View Subsidy Matrix</span>
                  </Link>
                )}

                <a
                  href="tel:+919080557472"
                  className="inline-flex items-center gap-2 px-3 py-3.5 text-slate-700 hover:text-slate-950 font-semibold text-sm transition-colors ml-auto sm:ml-0"
                >
                  <PhoneCall className="w-4 h-4 text-slate-500" />
                  <span>+91 90805 57472</span>
                </a>
              </div>
            </div>

            {/* Right Photo Column - Absolute cover to eliminate blank gaps */}
            <div className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 min-h-[340px] sm:min-h-[420px] lg:min-h-full w-full bg-slate-100">
              <img
                src={current.image}
                alt={current.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
