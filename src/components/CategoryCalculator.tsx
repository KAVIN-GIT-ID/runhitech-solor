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

  // 1. Residential States (Bill in INR)
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

  // 2. Commercial States (Monthly Electricity Bill in INR)
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

  // 3. Bulk Industrial States (Sanctioned kVA / kW)
  const [sanctionedKva, setSanctionedKva] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("runhitech_calc_kva");
      if (saved) {
        const n = Number(saved);
        if (!isNaN(n) && n >= 50 && n <= 2000) return n;
      }
    } catch {}
    return 250;
  });

  // Industrial Model Constants
  const indGridTariff = REGULATORY_CONSTANTS.INDUSTRIAL_HT1A_GRID_TARIFF;
  const indCuf = REGULATORY_CONSTANTS.TAMIL_NADU_DEFAULT_CUF;
  const indCapex = REGULATORY_CONSTANTS.INDUSTRIAL_CAPEX_PER_KW;

  const handleTabChange = (t: CalcCategory) => {
    setActiveTab(t);
    try { localStorage.setItem("runhitech_calc_tab", t); } catch {}
  };

  const handleResBillChange = (val: number) => {
    setResBill(val);
    try { localStorage.setItem("runhitech_calc_res_bill", String(val)); } catch {}
  };

  const handleCycleChange = (cycle: ResBillingCycle) => {
    setResCycle(cycle);
    try { localStorage.setItem("runhitech_calc_res_cycle", cycle); } catch {}
    if (cycle === "monthly" && resBill > 10000) {
      handleResBillChange(Math.max(500, Math.round(resBill / 2)));
    } else if (cycle === "bimonthly" && resBill < 1000) {
      handleResBillChange(Math.min(20000, resBill * 2));
    }
  };

  // ── DYNAMIC ENGINE CALCULATIONS ────────────────────────────────

  // 1. Residential: TANGEDCO LT-1A + PM Surya Ghar Subsidy + 30-Year Cash Flow
  const res = calculateResidentialSolar(resBill, resCycle);

  // 2. Commercial: TANGEDCO LT-V + Section 32 40% Tax Benefit + DG Offset + 25-Year Cash Flow
  const comm = calculateCommercialSolar(commBill);

  // 3. Industrial: TANGEDCO HT-1A + Captive Solar + 25-Year Cash Flow Model
  const ind = calculateIndustrialSolar(sanctionedKva, {
    cufPercent: indCuf,
    gridTariffPerKwh: indGridTariff,
    capexPerKw: indCapex
  });

  return (
    <section id="calculator" className="py-20 sm:py-24 bg-slate-100/70 border-b border-slate-200 font-sans antialiased" style={{ fontFamily: "var(--font-sans)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="max-w-3xl mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Estimate Your System Sizing & Return on Investment
          </h2>
          <p className="text-slate-700 text-sm sm:text-base mt-2">
            Calculate your estimated savings, central government subsidies, or accelerated depreciation benefits based on verified Tamil Nadu electricity regulatory tariffs.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          <button
            onClick={() => handleTabChange("residential")}
            className={`px-5 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all cursor-pointer ${
              activeTab === "residential"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <span>Residential (PM Surya Ghar)</span>
          </button>

          <button
            onClick={() => handleTabChange("commercial")}
            className={`px-5 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all cursor-pointer ${
              activeTab === "commercial"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <span>Commercial & Petrol Bunks</span>
          </button>

          <button
            onClick={() => handleTabChange("bulk")}
            className={`px-5 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all cursor-pointer ${
              activeTab === "bulk"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <span>Industrial & Solar Farms</span>
          </button>
        </div>

        {/* Calculator Main Box */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 lg:p-12 space-y-8">
          
          {/* TAB 1: RESIDENTIAL */}
          {activeTab === "residential" && (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Home Rooftop Solar & Subsidy Calculation
                    </h3>
                    <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                      Based on standard TNEB domestic tariff rates (LT-1A) and PM Surya Ghar central subsidies.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                      <span className="text-sm font-bold text-slate-800">Billing Cycle</span>
                      <div className="inline-flex rounded-xl bg-slate-200 p-1 text-xs sm:text-sm">
                        <button
                          type="button"
                          onClick={() => handleCycleChange("monthly")}
                          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                            resCycle === "monthly"
                              ? "bg-white text-slate-900 shadow-sm font-bold"
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
                              ? "bg-white text-slate-900 shadow-sm font-bold"
                              : "text-slate-600 hover:text-slate-900 font-medium"
                          }`}
                        >
                          Bi-Monthly (EB Bill)
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline pt-1">
                      <div>
                        <label className="text-sm font-bold text-slate-800 block">
                          {resCycle === "monthly" ? "Average Monthly EB Bill" : "Average Bi-Monthly TNEB Bill"}
                        </label>
                        <span className="text-xs text-slate-600 font-medium mt-0.5 block">
                          {resCycle === "monthly"
                            ? "TNEB Domestic (LT-1A) • 12 months / yr"
                            : "TANGEDCO Domestic (LT-1A) • 6 cycles / yr"}
                        </span>
                      </div>
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        ₹{resBill.toLocaleString("en-IN")}
                        <span className="text-sm font-medium text-slate-600 ml-1.5">
                          {resCycle === "monthly" ? "/ mo" : "/ 2 months"}
                        </span>
                      </span>
                    </div>

                    <input
                      type="range"
                      min={resCycle === "monthly" ? 500 : 1000}
                      max={resCycle === "monthly" ? 10000 : 20000}
                      step={250}
                      value={resBill}
                      onChange={(e) => handleResBillChange(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />

                    <div className="flex justify-between text-xs sm:text-sm text-slate-600 font-semibold">
                      <span>{resCycle === "monthly" ? "₹500 (1–2 kW)" : "₹1,000 (2 kW)"}</span>
                      <span>{resCycle === "monthly" ? "₹5,000 (5–6 kW)" : "₹10,000 (6 kW)"}</span>
                      <span>{resCycle === "monthly" ? "₹10,000 (9–10 kW)" : "₹20,000 (9–10 kW)"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-xs font-semibold text-slate-600">Recommended Capacity</div>
                      <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                        {res.recommendedKw} kW System
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        ~{formatIndianUnits(res.solarBiMonthlyUnits)} / cycle
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-xs font-semibold text-slate-600">Central Bank Subsidy</div>
                      <div className="text-lg sm:text-xl font-extrabold text-emerald-600 mt-1">
                        {formatIndianCurrency(res.pmSuryaGharSubsidy)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Result Summary */}
              <div
                className="lg:col-span-6 text-white p-7 sm:p-9 rounded-3xl flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden border border-white/20 transition-all duration-300 font-sans"
                style={{
                  background: "radial-gradient(120% 120% at 85% 15%, rgba(56, 189, 248, 0.28) 0%, transparent 55%), radial-gradient(100% 100% at 10% 90%, rgba(56, 189, 248, 0.15) 0%, transparent 50%), linear-gradient(145deg, #0A2540 0%, #0F3D75 50%, #174E8C 100%)",
                  boxShadow: "0 25px 50px -12px rgba(15, 61, 117, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.12) inset",
                }}
              >
                <div>
                  <div className="border-b border-white/15 pb-4">
                    <span className="text-xs font-bold text-white uppercase tracking-widest block font-sans">
                      Estimated Financial Benefit
                    </span>
                    <span className="text-xs text-blue-100/80 mt-1 block font-medium">
                      TNEB Net-Metering • PM Surya Ghar Subsidy
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-blue-100/90">Annual Electricity Savings</div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
                        {formatIndianCurrency(res.annualBillSavings)} <span className="text-xs sm:text-sm font-semibold text-cyan-300">/ yr</span>
                      </div>
                      <div className="text-xs sm:text-sm text-cyan-200/90 font-medium mt-1.5">
                        Save ~{formatIndianCurrency(res.monthlySavings)} every month
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-blue-100/90">30-Year Projected Net Savings</div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight drop-shadow-[0_2px_12px_rgba(255,255,255,0.25)]">
                        {formatIndianCurrency(res.thirtyYearProjectedNetSavings, { compact: true })}
                      </div>
                      <div className="text-xs text-blue-200/70 font-medium mt-1.5">
                        Net after system cost & O&M
                      </div>
                    </div>
                  </div>

                  {/* Payback & Net Consumer Investment */}
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-white/15 text-xs sm:text-sm">
                    <div>
                      <span className="text-blue-200/75 block font-medium">Estimated Net Investment</span>
                      <span className="font-extrabold text-white text-base sm:text-xl mt-1 block">
                        {formatIndianCurrency(res.consumerNetInvestment)}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-200/75 block font-medium">Estimated Payback Period</span>
                      <span className="font-extrabold text-cyan-300 text-base sm:text-xl mt-1 block drop-shadow-[0_1px_8px_rgba(103,232,249,0.3)]">
                        {res.estimatedPaybackYears} Years
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href="#contact"
                  className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-slate-100 text-slate-900 font-extrabold py-4 px-6 rounded-full text-[15px] sm:text-base tracking-tight shadow-[0_10px_30px_-5px_rgba(0,0,0,0.35)] active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <span>Book Free Roof Inspection & Subsidy Claim</span>
                  <ArrowRight className="w-4 h-4 text-slate-900 stroke-[2.5] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: COMMERCIAL */}
          {activeTab === "commercial" && (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Commercial Establishment & Petrol Bunk ROI
                  </h3>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    Incorporating commercial energy consumption patterns, peak tariff offsets, and tax benefits.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-800">
                      Average Monthly Electricity Bill
                    </label>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      ₹{commBill.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="15000"
                    max="300000"
                    step="5000"
                    value={commBill}
                    onChange={(e) => setCommBill(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />

                  <div className="flex justify-between text-xs sm:text-sm text-slate-600 font-semibold">
                    <span>₹15,000 (10 kW)</span>
                    <span>₹1,50,000 (50 kW)</span>
                    <span>₹3,00,000 (100 kW)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs font-semibold text-slate-600">Recommended System</div>
                    <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">{comm.recommendedKw} kW Commercial</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-medium">~{formatIndianUnits(comm.solarDailyUnits)} / day generation</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs font-semibold text-slate-600">40% Tax Write-Off Benefit</div>
                    <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">{formatIndianCurrency(comm.section32TaxBenefit, { compact: true })} Saved</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Section 32 Accelerated Dep.</div>
                  </div>
                </div>
              </div>

              {/* Result Summary */}
              <div
                className="lg:col-span-5 text-white p-7 sm:p-9 rounded-3xl flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden border border-white/20 transition-all duration-300 font-sans"
                style={{
                  background: "radial-gradient(120% 120% at 85% 15%, rgba(56, 189, 248, 0.28) 0%, transparent 55%), radial-gradient(100% 100% at 10% 90%, rgba(56, 189, 248, 0.15) 0%, transparent 50%), linear-gradient(145deg, #0A2540 0%, #0F3D75 50%, #174E8C 100%)",
                  boxShadow: "0 25px 50px -12px rgba(15, 61, 117, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.12) inset",
                }}
              >
                <div>
                  <div className="border-b border-white/15 pb-4">
                    <span className="text-xs font-bold text-white uppercase tracking-widest block font-sans">
                      Commercial Return Breakdown
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-blue-100/90">Annual Power Savings</div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
                        {formatIndianCurrency(comm.annualBillSavings, { compact: true })} <span className="text-xs sm:text-sm font-semibold text-cyan-300">/ yr</span>
                      </div>
                      <div className="text-xs text-blue-200/75 font-medium mt-1">Based on LT-V ~₹10.45/unit</div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-blue-100/90">Annual Diesel Offset</div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight drop-shadow-[0_2px_12px_rgba(255,255,255,0.25)]">
                        {comm.annualDieselOffsetLiters.toLocaleString("en-IN")} Liters
                      </div>
                      <div className="text-xs text-blue-200/75 font-medium mt-1">Peak DG runs reduced</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-white/15 text-xs sm:text-sm">
                    <div>
                      <span className="text-blue-200/75 block font-medium">Estimated Payback</span>
                      <span className="font-extrabold text-white text-base sm:text-xl mt-1 block">
                        {comm.estimatedPaybackYears} Years
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-200/75 block font-medium">25-Yr Projected Savings</span>
                      <span className="font-extrabold text-white text-base sm:text-xl mt-1 block drop-shadow-[0_1px_8px_rgba(255,255,255,0.25)]">
                        {formatIndianCurrency(comm.twentyFiveYearProjectedNetSavings, { compact: true })}
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href="#contact"
                  className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-slate-100 text-slate-900 font-extrabold py-4 px-6 rounded-full text-[15px] sm:text-base tracking-tight shadow-[0_10px_30px_-5px_rgba(0,0,0,0.35)] active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <span>Request Commercial Site Feasibility Report</span>
                  <ArrowRight className="w-4 h-4 text-slate-900 stroke-[2.5] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: BULK INDUSTRIAL */}
          {activeTab === "bulk" && (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Industrial HT & Megawatt Solar Plant Feasibility
                  </h3>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    Calculated for High-Tension (HT) industrial consumers with CEIG and grid synchronization.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-800">
                      Sanctioned Load / Plant Sizing
                    </label>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {sanctionedKva >= 1000 ? `${(sanctionedKva / 1000).toFixed(1)} MW` : `${sanctionedKva} kW`}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={sanctionedKva}
                    onChange={(e) => setSanctionedKva(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />

                  <div className="flex justify-between text-xs sm:text-sm text-slate-600 font-semibold">
                    <span>100 kW (Shed Mount)</span>
                    <span>1,000 kW (1 MW Captive)</span>
                    <span>2,000 kW (2 MW Farm)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs font-semibold text-slate-600">Daily Generation Yield</div>
                    <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                      {formatIndianUnits(ind.solarDailyUnits)} / day
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                      At {ind.cufPercent}% CUF benchmark
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs font-semibold text-slate-600">Annual Generation</div>
                    <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                      {formatIndianUnits(ind.solarAnnualGenerationKwh, { compact: true })}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
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

              {/* Result Summary */}
              <div
                className="lg:col-span-5 text-white p-7 sm:p-9 rounded-3xl flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden border border-white/20 transition-all duration-300 font-sans"
                style={{
                  background: "radial-gradient(120% 120% at 85% 15%, rgba(56, 189, 248, 0.28) 0%, transparent 55%), radial-gradient(100% 100% at 10% 90%, rgba(56, 189, 248, 0.15) 0%, transparent 50%), linear-gradient(145deg, #0A2540 0%, #0F3D75 50%, #174E8C 100%)",
                  boxShadow: "0 25px 50px -12px rgba(15, 61, 117, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.12) inset",
                }}
              >
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/15 pb-4 gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-widest font-sans">
                      Industrial Financial Impact
                    </span>
                    <span className="text-xs font-bold text-cyan-200 bg-white/10 px-3.5 py-1 rounded-full border border-cyan-300/30 backdrop-blur-md shadow-xs self-start sm:self-auto flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      Solar LCOE: ~₹{ind.solarLcoePerKwh.toFixed(2)}/unit (vs ₹{ind.gridTariffPerKwh.toFixed(2)} Grid)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-blue-100/90">Annual Net Savings</div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
                        {formatIndianCurrency(ind.annualNetSavings, { compact: true })} <span className="text-xs sm:text-sm font-semibold text-cyan-300">/ yr</span>
                      </div>
                      <div className="text-xs text-blue-200/75 font-medium mt-1">
                        Gross Margin: ₹{ind.grossSavingPerKwh.toFixed(2)}/unit
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-blue-100/90">25-Year Projected Net Savings</div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight drop-shadow-[0_2px_12px_rgba(255,255,255,0.25)]">
                        {formatIndianCurrency(ind.twentyFiveYearProjectedNetSavings, { compact: true })}
                      </div>
                      <div className="text-xs text-blue-200/75 font-medium mt-1">
                        Accounts for degradation & O&M
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-white/15 text-xs sm:text-sm">
                    <div>
                      <span className="text-blue-200/75 block font-medium">Estimated Payback</span>
                      <span className="font-extrabold text-white text-base sm:text-xl mt-1 block">
                        {ind.estimatedPaybackYears} Years
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-200/75 block font-medium">Estimated Project ROI</span>
                      <span className="font-extrabold text-cyan-300 text-base sm:text-xl mt-1 block drop-shadow-[0_1px_8px_rgba(103,232,249,0.3)]">
                        {ind.projectRoiPercent}%
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href="#contact"
                  className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-slate-100 text-slate-900 font-extrabold py-4 px-6 rounded-full text-[15px] sm:text-base tracking-tight shadow-[0_10px_30px_-5px_rgba(0,0,0,0.35)] active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <span>Connect with High-Tension Solar Specialist</span>
                  <ArrowRight className="w-4 h-4 text-slate-900 stroke-[2.5] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
