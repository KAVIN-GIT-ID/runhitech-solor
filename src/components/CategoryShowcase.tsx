import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  Building2, 
  Factory, 
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
      tagline: "Reduce bi-monthly TNEB electricity bills to near-zero with the PM Surya Ghar government subsidy.",
      icon: Home,
      capacity: "1 kW – 10 kW",
      payback: "3 to 4 Years",
      warranty: "30-Year Performance Warranty",
      idealFor: "Individual houses, villas, row houses, and residential communities",
      highlights: [
        { label: "Government Subsidy", value: "Direct ₹30,000 to ₹78,000 credit into your bank account" },
        { label: "Bill Reduction", value: "Up to 90% reduction in bi-monthly electricity bills" },
        { label: "TNEB Net-Metering", value: "Turnkey liaison, drawings, and bi-directional meter setup" },
        { label: "Battery Backup", value: "Optional LiFePO4 battery storage for uninterrupted power" }
      ],
      features: [
        "Tier-1 Mono-PERC / TopCon Half-Cut high-efficiency panels",
        "Complete TNEB application, feasibility, and meter synchronization",
        "Non-penetrative rooftop structure mounting with weatherproofing",
        "Dedicated smartphone app for daily generation tracking"
      ],
      image: "/solar_home_hero.jpg",
      badge: "PM Surya Ghar Eligible",
      ctaText: "Check Subsidy & Get Survey",
      ctaHref: "/subsidy"
    },
    {
      id: "commercial" as CategoryKey,
      title: "Commercial Solar",
      shortTitle: "Commercial & Retail",
      tagline: "Eliminate peak daytime commercial tariff and costly diesel generator operation.",
      icon: Building2,
      capacity: "10 kW – 100 kW",
      payback: "2.5 to 3.5 Years",
      warranty: "30-Year Modules • 5-Year Inverter",
      idealFor: "Petrol stations (HPCL/IOCL/BPCL), hospitals, hotels, schools, and retail outlets",
      highlights: [
        { label: "Tax Benefits", value: "40% Accelerated Depreciation tax deduction (Section 32)" },
        { label: "Proven Experience", value: "350+ operational petrol stations across Tamil Nadu" },
        { label: "Cost Recovery", value: "Complete investment payback in under 3.5 years" },
        { label: "Structure Engineering", value: "Custom elevated canopy and shed mounting" }
      ],
      features: [
        "High-tensile galvanized structural steel for fuel canopy structures",
        "Automatic synchronized inverter switching with grid and DG backup",
        "Significant reduction in daytime diesel fuel expenses",
        "Long-term protection against commercial tariff increases"
      ],
      image: "/solar_petrol_bunk.jpg",
      badge: "350+ Stations Operational",
      ctaText: "Schedule Commercial Site Survey",
      ctaHref: "#contact"
    },
    {
      id: "bulk" as CategoryKey,
      title: "Industrial & Solar Farms",
      shortTitle: "Industrial & Utility MW",
      tagline: "Megawatt-scale captive power plants, high-tension synchronization, and zero-capex PPA models.",
      icon: Factory,
      capacity: "100 kW – 10+ MW",
      payback: "3 to 4 Years / Zero-Capex PPA",
      warranty: "30-Year Performance • Full O&M",
      idealFor: "Spinning mills, textile processing, foundries, cold storage, and solar parks",
      highlights: [
        { label: "Commercial Models", value: "Direct CAPEX investment or Zero-Capex OPEX / PPA" },
        { label: "Approvals & Clearances", value: "CEIG drawings, HT substation synchronization, and Open Access" },
        { label: "Levelized Power Cost", value: "₹3.50 – ₹4.20 / unit vs ₹8.50+ grid tariff" },
        { label: "Telemetry & SCADA", value: "Industrial-grade monitoring and weather instrumentation" }
      ],
      features: [
        "High-voltage evacuation design (11kV / 22kV / 33kV substations)",
        "End-to-end statutory clearances from CEIG, TANGEDCO, and TANTRANSCO",
        "Engineered shed mounts, standing seam clamps, and pile-driven ground foundations",
        "Comprehensive annual Operation & Maintenance (O&M) programs"
      ],
      image: "/solar_industrial_factory.jpg",
      badge: "10+ MW EPC Track Record",
      ctaText: "Consult Industrial Solar Engineer",
      ctaHref: "#contact"
    }
  ];

  const current = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <section id="categories" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Tailored Engineering for Every Application
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-2.5 leading-relaxed">
            From residential rooftops benefiting from central subsidies to high-tension captive power plants for heavy manufacturing, we deliver end-to-end turnkey solar EPC services.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-col sm:flex-row border-b border-slate-200 mb-8 sm:mb-10 gap-2 sm:gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2.5 pb-3.5 px-1 text-base font-semibold transition-all border-b-2 cursor-pointer ${
                  isSelected
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                <span>{cat.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Content Showcase Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-0">
            
            {/* Left Details */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {current.title}
                </h3>
                <p className="text-slate-600 text-base sm:text-lg mt-2 leading-relaxed">
                  {current.tagline}
                </p>

                {/* Sizing & Payback Specs */}
                <div className="grid sm:grid-cols-3 gap-4 my-6 p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-600">Typical Payback</div>
                    <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">{current.payback}</div>
                  </div>
                  <div className="sm:border-l sm:border-slate-200/80 sm:pl-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-600">Warranty</div>
                    <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">{current.warranty}</div>
                  </div>
                  <div className="sm:border-l sm:border-slate-200/80 sm:pl-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-600">Ideal For</div>
                    <div className="text-sm font-semibold text-slate-800 mt-1 leading-snug">
                      {current.idealFor}
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600">
                    Key Financial & Technical Specifications
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    {current.highlights.map((h, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                        <div className="text-sm font-bold text-slate-900">{h.label}</div>
                        <div className="text-sm text-slate-600 mt-1 leading-relaxed">{h.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-sm"
                >
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                {activeTab === "residential" && (
                  <Link
                    to="/subsidy"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors"
                  >
                    View Subsidy Breakdown
                  </Link>
                )}

                <a
                  href="tel:+919080557472"
                  className="inline-flex items-center gap-2 px-4 py-3 text-slate-700 hover:text-slate-900 font-semibold text-sm"
                >
                  <PhoneCall className="w-4 h-4 text-slate-500" />
                  <span>+91 90805 57472</span>
                </a>
              </div>
            </div>

            {/* Right Photo Column */}
            <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full bg-slate-900 flex flex-col justify-end p-8 text-white">
              <img
                src={current.image}
                alt={current.title}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

              <div className="relative z-10 space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  Track Record Across Tamil Nadu
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {activeTab === "residential"
                    ? "2,500+ Homes Powered by Solar"
                    : activeTab === "commercial"
                    ? "350+ HPCL & Retail Petrol Stations"
                    : "10+ MW High-Tension Solar Plants"}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {activeTab === "residential"
                    ? "End-to-end liaison with TNEB distribution circles in Namakkal, Salem, Karur, Erode, Tirupur, and Coimbatore."
                    : activeTab === "commercial"
                    ? "Engineered canopy mounting, zero structural drilling leakages, and rapid DG generator offset."
                    : "Substation connectivity, CEIG regulatory approvals, PPA execution, and 30-year linear performance."}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
