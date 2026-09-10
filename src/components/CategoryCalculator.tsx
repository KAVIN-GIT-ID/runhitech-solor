import { useState } from "react";
import { 
  ArrowRight,
  AlertCircle
} from "lucide-react";
import {
  calculateResidentialSolar,
  calculateCommercialSolar,
  calculateIndustrialSolar,
  formatIndianCurrency,
  formatIndianUnits,
  REGULATORY_CONSTANTS
} from "../utils/solarCalculations";

export type CalcCategory = "residential" | "commercial" | "bulk";
export type ResBillingCycle = "monthly" | "bimonthly";

export default function CategoryCalculator() {
  const [activeTab, setActiveTab] = useState<CalcCategory>(() => {
    try {
      const saved = localStorage.getItem("runhitech_calc_tab");
      if (saved === "residential" || saved === "commercial" || saved === "bulk") return saved;
    } catch {}
    return "residential";
  });

  const [resCycle, setResCycle] = useState<ResBillingCycle>(() => {
    try {
      const saved = localStorage.getItem("runhitech_calc_res_cycle");
      if (saved === "monthly" || saved === "bimonthly") return saved;
    } catch {}
    return "bimonthly";
  });

  const [resBill, setResBill] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("runhitech_calc_res_bill");
      if (saved) {
        const n = Number(saved);
        if (!isNaN(n) && n >= 500 && n <= 20000) return n;
      }
    } catch {}
    return 3000;
  });

  const [commBill, setCommBill] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("runhitech_calc_comm_bill");
      if (saved) {
        const n = Number(saved);
        if (!isNaN(n) && n >= 5000 && n <= 500000) return n;
      }
    } catch {}
    return 45000;
  });

  const [sanctionedKva, setSanctionedKva] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("runhitech_calc_sanctioned_kva");
      if (saved) {
        const n = Number(saved);
        if (!isNaN(n) && n >= 50 && n <= 5000) return n;
      }
    } catch {}
    return 250;
  });

  // Fixed regulatory benchmarks
  const indCuf = REGULATORY_CONSTANTS.TAMIL_NADU_DEFAULT_CUF;
  const indGridTariff = REGULATORY_CONSTANTS.INDUSTRIAL_HT1A_GRID_TARIFF;
  const indCapex = REGULATORY_CONSTANTS.INDUSTRIAL_CAPEX_PER_KW;

  const handleTabChange = (tab: CalcCategory) => {
    setActiveTab(tab);
    try {
      localStorage.setItem("runhitech_calc_tab", tab);
    } catch {}
  };

  const handleResBillChange = (val: number) => {
    setResBill(val);
    try {
      localStorage.setItem("runhitech_calc_res_bill", String(val));
    } catch {}
  };

  const handleCycleChange = (cycle: ResBillingCycle) => {
    setResCycle(cycle);
    try {
      localStorage.setItem("runhitech_calc_res_cycle", cycle);
    } catch {}

    if (cycle === "monthly" && resBill > 10000) {
      handleResBillChange(Math.max(500, Math.round(resBill / 2)));
    } else if (cycle === "bimonthly" && resBill < 1000) {
      handleResBillChange(Math.min(20000, resBill * 2));
    }
  };

  const res = calculateResidentialSolar(resBill, resCycle);
  const comm = calculateCommercialSolar(commBill);
  const ind = calculateIndustrialSolar(sanctionedKva, {
    cufPercent: indCuf,
    gridTariffPerKwh: indGridTariff,
    capexPerKw: indCapex
  });

  const resMin = resCycle === "monthly" ? 500 : 1000;
  const resMax = resCycle === "monthly" ? 10000 : 20000;
  const resPercent = Math.min(100, Math.max(0, ((resBill - resMin) / (resMax - resMin)) * 100));

  const commMin = 15000;
  const commMax = 300000;
  const commPercent = Math.min(100, Math.max(0, ((commBill - commMin) / (commMax - commMin)) * 100));

  const indMin = 100;
  const indMax = 2000;
  const indPercent = Math.min(100, Math.max(0, ((sanctionedKva - indMin) / (indMax - indMin)) * 100));

  return (
    <section id="calculator" className="py-10 sm:py-14 bg-white border-b border-slate-200 font-sans antialiased" style={{ fontFamily: "var(--font-sans)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="max-w-3xl mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Estimate Your System Sizing & <span className="text-[#f97316]">Return on Investment</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            Calculate your estimated savings, central government subsidies, or accelerated depreciation benefits based on verified Tamil Nadu electricity regulatory tariffs.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="inline-flex flex-wrap p-1.5 bg-slate-100 rounded-2xl gap-2 mb-6 sm:mb-8 border border-slate-200/90 shadow-xs">
          <button
            onClick={() => handleTabChange("residential")}
            className={`px-5 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all cursor-pointer ${
              activeTab === "residential"
                ? "bg-[#f97316] text-white shadow-md shadow-orange-500/25 font-bold"
                : "text-slate-700 hover:text-slate-900 hover:bg-white/60 font-medium"
            }`}
          >
            <span>Residential (PM Surya Ghar)</span>
          </button>

          <button
            onClick={() => handleTabChange("commercial")}
            className={`px-5 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all cursor-pointer ${
              activeTab === "commercial"
                ? "bg-[#f97316] text-white shadow-md shadow-orange-500/25 font-bold"
                : "text-slate-700 hover:text-slate-900 hover:bg-white/60 font-medium"
            }`}
          >
            <span>Commercial & Petrol Bunks</span>
          </button>

          <button
            onClick={() => handleTabChange("bulk")}
            className={`px-5 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all cursor-pointer ${
              activeTab === "bulk"
                ? "bg-[#f97316] text-white shadow-md shadow-orange-500/25 font-bold"
                : "text-slate-700 hover:text-slate-900 hover:bg-white/60 font-medium"
            }`}
          >
            <span>Industrial & Solar Farms</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 lg:p-12 space-y-8">
          
          {activeTab === "residential" && (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                      Home Rooftop Solar & Subsidy Calculation
                    </h3>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                      <span className="text-sm font-bold text-slate-900">Billing Cycle</span>
                      <div className="inline-flex rounded-xl bg-slate-200/70 p-1 text-xs sm:text-sm">
                        <button
                          type="button"
                          onClick={() => handleCycleChange("monthly")}
                          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                            resCycle === "monthly"
                              ? "bg-white text-slate-900 font-bold shadow-xs"
                              : "text-slate-600 hover:text-slate-900 font-medium"
                          }`}
                        >
                          Monthly (₹/mo)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCycleChange("bimonthly")}
                          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                            resCycle === "bimonthly"
                              ? "bg-white text-slate-900 font-bold shadow-xs"
                              : "text-slate-600 hover:text-slate-900 font-medium"
                          }`}
                        >
                          Bi-Monthly (EB Bill)
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline pt-1">
                      <div>
                        <label className="text-sm font-bold text-slate-900 block">
                          {resCycle === "monthly" ? "Average Monthly EB Bill" : "Average Bi-Monthly TNEB Bill"}
                        </label>
                        <span className="text-xs text-slate-500 font-medium mt-0.5 block">
                          {resCycle === "monthly"
                            ? "TNEB Domestic (LT-1A) • 12 months / yr"
                            : "TANGEDCO Domestic (LT-1A) • 6 cycles / yr"}
                        </span>
                      </div>
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        ₹{resBill.toLocaleString("en-IN")}
                        <span className="text-sm font-medium text-slate-500 ml-1.5">
                          {resCycle === "monthly" ? "/ mo" : "/ 2 months"}
                        </span>
                      </span>
                    </div>

                    <input
                      type="range"
                      min={resMin}
                      max={resMax}
                      step={250}
                      value={resBill}
                      onChange={(e) => handleResBillChange(Number(e.target.value))}
                      style={{
                        background: `linear-gradient(to right, #ea580c 0%, #f97316 ${resPercent}%, #e2e8f0 ${resPercent}%, #e2e8f0 100%)`
                      }}
                      className="w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-[#ea580c]"
                    />

                    <div className="flex justify-between text-xs sm:text-sm text-slate-500 font-semibold">
                      <span>{resCycle === "monthly" ? "₹500 (1–2 kW)" : "₹1,000 (2 kW)"}</span>
                      <span>{resCycle === "monthly" ? "₹5,000 (5–6 kW)" : "₹10,000 (6 kW)"}</span>
                      <span>{resCycle === "monthly" ? "₹10,000 (9–10 kW)" : "₹20,000 (9–10 kW)"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-xs">
                      <div className="text-xs font-semibold text-slate-500">Recommended Capacity</div>
                      <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                        {res.recommendedKw} kW System
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        ~{formatIndianUnits(res.solarBiMonthlyUnits)} / cycle
                      </div>
                    </div>
                    <div className="p-4 bg-[#f0fdf4] rounded-2xl border border-emerald-200 shadow-xs">
                      <div className="text-xs font-bold text-emerald-800">Central Bank Subsidy</div>
                      <div className="text-lg sm:text-xl font-black text-emerald-600 mt-1">
                        {formatIndianCurrency(res.pmSuryaGharSubsidy)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="lg:col-span-6 text-white p-7 sm:p-9 rounded-3xl flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden transition-all duration-300 font-sans"
                style={{
                  background: "radial-gradient(120% 120% at 85% 15%, rgba(254, 215, 170, 0.25) 0%, transparent 55%), linear-gradient(145deg, #c2410c 0%, #ea580c 40%, #f97316 100%)",
                  boxShadow: "0 25px 60px -15px rgba(234, 88, 12, 0.45), 0 0 35px -5px rgba(249, 115, 22, 0.25)",
                }}
              >
                <div>
                  <div className="border-b border-white/20 pb-4">
                    <span className="text-xs font-bold text-white uppercase tracking-widest block font-sans">
                      Estimated Financial Benefit
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-white/95">Annual Electricity Savings</div>
                      <div className="text-2xl sm:text-3xl font-black text-white mt-1.5 tracking-tight">
                        {formatIndianCurrency(res.annualBillSavings)} <span className="text-xs sm:text-sm font-bold text-white/90">/ yr</span>
                      </div>
                      <div className="text-xs sm:text-sm text-white/90 font-medium mt-1.5">
                        Save ~{formatIndianCurrency(res.monthlySavings)} every month
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-white/95">30-Year Projected Net Savings</div>
                      <div className="text-2xl sm:text-3xl font-black text-white mt-1.5 tracking-tight">
                        {formatIndianCurrency(res.thirtyYearProjectedNetSavings, { compact: true })}
                      </div>
                      <div className="text-xs text-white/80 font-medium mt-1.5">
                        Net after system cost & O&M
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-white/20 text-xs sm:text-sm">
                    <div>
                      <span className="text-white/90 block font-medium">Estimated Net Investment</span>
                      <span className="font-black text-white text-base sm:text-xl mt-1 block">
                        {formatIndianCurrency(res.consumerNetInvestment)}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/90 block font-medium">Estimated Payback Period</span>
                      <span className="font-black text-amber-200 text-base sm:text-xl mt-1 block">
                        {res.estimatedPaybackYears} Years
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href="#contact"
                  className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-950 font-bold py-4 px-6 rounded-full text-[15px] sm:text-base tracking-tight shadow-[0_12px_35px_-5px_rgba(0,0,0,0.35)] active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <span>Book Free Roof Inspection & Subsidy Claim</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          )}

          {activeTab === "commercial" && (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                      Commercial Establishment & Petrol Bunk ROI
                    </h3>
                    <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                      Incorporating commercial energy consumption patterns, peak tariff offsets, and tax benefits.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-5">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-slate-900">
                        Average Monthly Electricity Bill
                      </label>
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        ₹{commBill.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <input
                      type="range"
                      min={commMin}
                      max={commMax}
                      step="5000"
                      value={commBill}
                      onChange={(e) => setCommBill(Number(e.target.value))}
                      style={{
                        background: `linear-gradient(to right, #ea580c 0%, #f97316 ${commPercent}%, #e2e8f0 ${commPercent}%, #e2e8f0 100%)`
                      }}
                      className="w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-[#ea580c]"
                    />

                    <div className="flex justify-between text-xs sm:text-sm text-slate-500 font-semibold">
                      <span>₹15,000 (10 kW)</span>
                      <span>₹1,50,000 (50 kW)</span>
                      <span>₹3,00,000 (100 kW)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-xs">
                      <div className="text-xs font-semibold text-slate-500">Recommended System</div>
                      <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">{comm.recommendedKw} kW Commercial</div>
                      <div className="text-[11px] text-orange-600 mt-0.5 font-medium">~{formatIndianUnits(comm.solarDailyUnits)} / day generation</div>
                    </div>
                    <div className="p-4 bg-[#f0fdf4] rounded-2xl border border-emerald-200 shadow-xs">
                      <div className="text-xs font-bold text-emerald-800">40% Tax Write-Off Benefit</div>
                      <div className="text-lg sm:text-xl font-black text-emerald-600 mt-1">{formatIndianCurrency(comm.section32TaxBenefit, { compact: true })} Saved</div>
                      <div className="text-[11px] text-emerald-700/80 mt-0.5 font-medium">Section 32 Accelerated Dep.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="lg:col-span-5 text-white p-7 sm:p-9 rounded-3xl flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden transition-all duration-300 font-sans"
                style={{
                  background: "radial-gradient(120% 120% at 85% 15%, rgba(254, 215, 170, 0.25) 0%, transparent 55%), linear-gradient(145deg, #c2410c 0%, #ea580c 40%, #f97316 100%)",
                  boxShadow: "0 25px 60px -15px rgba(234, 88, 12, 0.45), 0 0 35px -5px rgba(249, 115, 22, 0.25)",
                }}
              >
                <div>
                  <div className="border-b border-white/20 pb-4">
                    <span className="text-xs font-bold text-white uppercase tracking-widest block font-sans">
                      Commercial Return Breakdown
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-white/95">Annual Power Savings</div>
                      <div className="text-2xl sm:text-3xl font-black text-white mt-1.5 tracking-tight">
                        {formatIndianCurrency(comm.annualBillSavings, { compact: true })} <span className="text-xs sm:text-sm font-bold text-white/90">/ yr</span>
                      </div>
                      <div className="text-xs text-white/80 font-medium mt-1">Based on LT-V ~₹10.45/unit</div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-white/95">Annual Diesel Offset</div>
                      <div className="text-2xl sm:text-3xl font-black text-white mt-1.5 tracking-tight">
                        {comm.annualDieselOffsetLiters.toLocaleString("en-IN")} Liters
                      </div>
                      <div className="text-xs text-white/80 font-medium mt-1">Peak DG runs reduced</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-white/20 text-xs sm:text-sm">
                    <div>
                      <span className="text-white/90 block font-medium">Estimated Payback</span>
                      <span className="font-black text-white text-base sm:text-xl mt-1 block">
                        {comm.estimatedPaybackYears} Years
                      </span>
                    </div>
                    <div>
                      <span className="text-white/90 block font-medium">25-Yr Projected Savings</span>
                      <span className="font-black text-amber-200 text-base sm:text-xl mt-1 block">
                        {formatIndianCurrency(comm.twentyFiveYearProjectedNetSavings, { compact: true })}
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href="#contact"
                  className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-950 font-bold py-4 px-6 rounded-full text-[15px] sm:text-base tracking-tight shadow-[0_12px_35px_-5px_rgba(0,0,0,0.35)] active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <span>Request Commercial Site Feasibility Report</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          )}

          {activeTab === "bulk" && (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                      Industrial HT & Megawatt Solar Plant Feasibility
                    </h3>
                    <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                      Calculated for High-Tension (HT) industrial consumers with CEIG and grid synchronization.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-5">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-slate-900">
                        Sanctioned Load / Plant Sizing
                      </label>
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {sanctionedKva >= 1000 ? `${(sanctionedKva / 1000).toFixed(1)} MW` : `${sanctionedKva} kW`}
                      </span>
                    </div>

                    <input
                      type="range"
                      min={indMin}
                      max={indMax}
                      step="50"
                      value={sanctionedKva}
                      onChange={(e) => setSanctionedKva(Number(e.target.value))}
                      style={{
                        background: `linear-gradient(to right, #ea580c 0%, #f97316 ${indPercent}%, #e2e8f0 ${indPercent}%, #e2e8f0 100%)`
                      }}
                      className="w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-[#ea580c]"
                    />

                    <div className="flex justify-between text-xs sm:text-sm text-slate-500 font-semibold">
                      <span>100 kW (Shed Mount)</span>
                      <span>1,000 kW (1 MW Captive)</span>
                      <span>2,000 kW (2 MW Farm)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-xs">
                      <div className="text-xs font-semibold text-slate-500">Daily Generation Yield</div>
                      <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                        {formatIndianUnits(ind.solarDailyUnits)} / day
                      </div>
                      <div className="text-[11px] text-orange-600 mt-0.5 font-medium">
                        At {ind.cufPercent}% CUF benchmark
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-xs">
                      <div className="text-xs font-semibold text-slate-500">Annual Generation</div>
                      <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                        {formatIndianUnits(ind.solarAnnualGenerationKwh, { compact: true })}
                      </div>
                      <div className="text-[11px] text-orange-600 mt-0.5 font-medium">
                        365-day cumulative yield
                      </div>
                    </div>
                  </div>

                  {ind.isLcoeGreaterThanTariff && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>Solar generation is currently estimated to cost more than or equal to the assumed grid energy cost.</span>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="lg:col-span-5 text-white p-7 sm:p-9 rounded-3xl flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden transition-all duration-300 font-sans"
                style={{
                  background: "radial-gradient(120% 120% at 85% 15%, rgba(254, 215, 170, 0.25) 0%, transparent 55%), linear-gradient(145deg, #c2410c 0%, #ea580c 40%, #f97316 100%)",
                  boxShadow: "0 25px 60px -15px rgba(234, 88, 12, 0.45), 0 0 35px -5px rgba(249, 115, 22, 0.25)",
                }}
              >
                <div>
                  <div className="border-b border-white/20 pb-4">
                    <span className="text-xs font-bold text-white uppercase tracking-widest block font-sans">
                      Industrial Financial Impact
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-white/95">Annual Net Savings</div>
                      <div className="text-2xl sm:text-3xl font-black text-white mt-1.5 tracking-tight">
                        {formatIndianCurrency(ind.annualNetSavings, { compact: true })} <span className="text-xs sm:text-sm font-bold text-white/90">/ yr</span>
                      </div>
                      <div className="text-xs text-white/80 font-medium mt-1">
                        Gross Margin: ₹{ind.grossSavingPerKwh.toFixed(2)}/unit
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-white/95">25-Year Projected Net Savings</div>
                      <div className="text-2xl sm:text-3xl font-black text-white mt-1.5 tracking-tight">
                        {formatIndianCurrency(ind.twentyFiveYearProjectedNetSavings, { compact: true })}
                      </div>
                      <div className="text-xs text-white/80 font-medium mt-1">
                        Accounts for degradation & O&M
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-white/20 text-xs sm:text-sm">
                    <div>
                      <span className="text-white/90 block font-medium">Estimated Payback</span>
                      <span className="font-black text-white text-base sm:text-xl mt-1 block">
                        {ind.estimatedPaybackYears} Years
                      </span>
                    </div>
                    <div>
                      <span className="text-white/90 block font-medium">Estimated Project ROI</span>
                      <span className="font-black text-amber-200 text-base sm:text-xl mt-1 block">
                        {ind.projectRoiPercent}%
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href="#contact"
                  className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-950 font-bold py-4 px-6 rounded-full text-[15px] sm:text-base tracking-tight shadow-[0_12px_35px_-5px_rgba(0,0,0,0.35)] active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <span>Connect with High-Tension Solar Specialist</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
