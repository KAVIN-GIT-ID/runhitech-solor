import { useState } from "react";
import { 
  Calculator, 
  Home, 
  Building2, 
  Factory, 
  ShieldCheck, 
  ArrowRight
} from "lucide-react";

// ── Helper Functions for Tamil Nadu Electricity Tariffs ──

/**
 * Calculates bi-monthly domestic consumption (units / kWh) from the TNEB bill
 * based on official TANGEDCO / TNPDCL LT-1A telescopic slab order:
 * 0 - 100 units: Free (₹0)
 * 101 - 200 units: ₹2.35 / unit
 * 201 - 400 units: ₹4.70 / unit
 * 401 - 500 units: ₹6.30 / unit
 * 501 - 600 units: ₹8.40 / unit
 * 601 - 800 units: ₹9.45 / unit
 * 801 - 1000 units: ₹10.50 / unit
 * Above 1000 units: ₹11.55 / unit
 */
function getBiMonthlyUnitsFromBill(bill: number): number {
  if (bill <= 0) return 0;
  if (bill <= 235) return Math.round(100 + bill / 2.35);
  if (bill <= 1175) return Math.round(200 + (bill - 235) / 4.70);
  if (bill <= 1805) return Math.round(400 + (bill - 1175) / 6.30);
  if (bill <= 2645) return Math.round(500 + (bill - 1805) / 8.40);
  if (bill <= 4535) return Math.round(600 + (bill - 2645) / 9.45);
  if (bill <= 6635) return Math.round(800 + (bill - 4535) / 10.50);
  return Math.round(1000 + (bill - 6635) / 11.55);
}

function calculateTnebBillFromUnits(units: number): number {
  if (units <= 100) return 0;
  let bill = 0;
  if (units > 100) bill += (Math.min(units, 200) - 100) * 2.35;
  if (units > 200) bill += (Math.min(units, 400) - 200) * 4.70;
  if (units > 400) bill += (Math.min(units, 500) - 400) * 6.30;
  if (units > 500) bill += (Math.min(units, 600) - 500) * 8.40;
  if (units > 600) bill += (Math.min(units, 800) - 600) * 9.45;
  if (units > 800) bill += (Math.min(units, 1000) - 800) * 10.50;
  if (units > 1000) bill += (units - 1000) * 11.55;
  return Math.round(bill);
}

function getResidentialSystemCost(kw: number): number {
  if (kw <= 1) return 65000;
  if (kw === 2) return 125000;
  if (kw === 3) return 180000;
  return Math.round(180000 + (kw - 3) * 51400);
}

export type CalcCategory = "residential" | "commercial" | "bulk";

export default function CategoryCalculator() {
  const [activeTab, setActiveTab] = useState<CalcCategory>("residential");

  // 1. Residential States (Bi-monthly TNEB Bill in INR)
  const [resBill, setResBill] = useState<number>(3500);

  // 2. Commercial States (Monthly Electricity Bill in INR)
  const [commBill, setCommBill] = useState<number>(45000);

  // 3. Bulk Industrial States (Sanctioned kVA / kW)
  const [sanctionedKva, setSanctionedKva] = useState<number>(250);

  // ── 1. Residential Calculations (Tamil Nadu TNEB LT-1A & PM Surya Ghar) ──
  // Bi-monthly units consumed based on current bill
  const resUnits = getBiMonthlyUnitsFromBill(resBill);

  // Sizing: In Tamil Nadu, 1 kW produces ~4.2 units/day -> ~252 units per 60-day bi-monthly cycle
  // Recommended size offsets ~100% of consumption (capped between 1 kW and 10 kW)
  const idealKw = Math.ceil((resUnits * 0.95) / 252);
  const resKw = Math.min(10, Math.max(1, idealKw));

  // Bi-monthly solar generation (In TN: 4.2 units/kW/day * 60 days = 252 units/cycle)
  const resSolarBiMonthlyUnits = Math.round(resKw * 4.2 * 60);

  // PM Surya Ghar Central Government Subsidy (Direct Benefit Transfer to Bank)
  let resSubsidy = 30000;
  if (resKw === 2) resSubsidy = 60000;
  if (resKw >= 3) resSubsidy = 78000;

  // Turnkey System Cost & Net Customer Outlay
  const resGrossCost = getResidentialSystemCost(resKw);
  const resNetInvestment = Math.max(0, resGrossCost - resSubsidy);

  // TNEB Bi-directional Net-Metering: Net units billed per cycle
  const netUnitsBilled = Math.max(0, resUnits - resSolarBiMonthlyUnits);
  const newBiMonthlyBill = calculateTnebBillFromUnits(netUnitsBilled);

  // Annual Electricity Savings (Tamil Nadu has 6 bi-monthly cycles/year)
  const currentAnnualBill = resBill * 6;
  const newAnnualBill = newBiMonthlyBill * 6;
  const resAnnualSavings = Math.max(0, currentAnnualBill - newAnnualBill);

  // Payback Period: Factoring standard ~4% annual TNEB tariff indexation
  const simplePayback = resNetInvestment / (resAnnualSavings || 1);
  const resPaybackYears = (simplePayback * 0.88).toFixed(1);

  // 30-Year Lifetime Savings (Tier-1 30-year linear performance warranty with 3.5% historic tariff indexation)
  const resLifetimeSavings = Math.round(resAnnualSavings * 51.6);

  // ── 2. Commercial Calculations ──
  const commKw = Math.min(100, Math.max(5, Math.round(commBill / 1200)));
  const commEstCost = commKw * 52000;
  const commTaxBenefit = Math.round(commEstCost * 0.40 * 0.25);
  const commAnnualSavings = Math.round(commBill * 12 * 0.75);
  const commPaybackYears = ((commEstCost - commTaxBenefit) / (commAnnualSavings || 1)).toFixed(1);
  const commDieselSavedLiters = Math.round(commKw * 28 * 12);

  // ── 3. Bulk Industrial Calculations ──
  const indKw = sanctionedKva;
  const indUnitsPerDay = Math.round(indKw * 4.4);
  const indAnnualUnits = Math.round(indUnitsPerDay * 330);
  const indUnitRateDiff = 4.60;
  const indAnnualSavings = Math.round(indAnnualUnits * indUnitRateDiff);
  const indLifetimeSavingsCrores = ((indAnnualSavings * 25) / 10000000).toFixed(2);

  return (
    <section id="calculator" className="py-20 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-blue-700" />
            <span>Solar Financial Estimator</span>
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Estimate Your System Sizing & Return on Investment
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Calculate your estimated savings, central government subsidies, or accelerated depreciation benefits based on your current tariff.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTab("residential")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "residential"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Residential (PM Surya Ghar)</span>
          </button>

          <button
            onClick={() => setActiveTab("commercial")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "commercial"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Commercial & Petrol Bunks</span>
          </button>

          <button
            onClick={() => setActiveTab("bulk")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "bulk"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <Factory className="w-4 h-4" />
            <span>Industrial & Solar Farms</span>
          </button>
        </div>

        {/* Calculator Main Box */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
          
          {/* TAB 1: RESIDENTIAL */}
          {activeTab === "residential" && (
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Home Rooftop Solar & Subsidy Calculation
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Based on standard TNEB domestic tariff rates (LT-1A) and PM Surya Ghar central subsidies.
                  </p>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block">
                        Average Bi-Monthly TNEB Bill
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        TANGEDCO Domestic (LT-1A) • 6 cycles / yr
                      </span>
                    </div>
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      ₹{resBill.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1000"
                    max="20000"
                    step="250"
                    value={resBill}
                    onChange={(e) => setResBill(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                  />

                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>₹1,000 (1–2 kW)</span>
                    <span>₹10,000 (5 kW)</span>
                    <span>₹20,000 (9–10 kW)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                    <div className="text-slate-500">Recommended Size</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">{resKw} kW Rooftop</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                    <div className="text-slate-500">Bi-Monthly Units</div>
                    <div className="text-base font-bold text-blue-700 mt-0.5">~{resUnits} Units</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                    <div className="text-slate-500">Govt Subsidy</div>
                    <div className="text-base font-bold text-emerald-700 mt-0.5">₹{resSubsidy.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                    <div className="text-slate-500">Solar Generation</div>
                    <div className="text-base font-bold text-amber-600 mt-0.5">~{resSolarBiMonthlyUnits} Units/cycle</div>
                  </div>
                </div>
              </div>

              {/* Result Summary */}
              <div className="lg:col-span-6 bg-slate-900 text-white p-6 sm:p-8 rounded-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">Estimated Financial Benefit</span>
                    <span className="text-[10px] text-slate-500">TNEB Net-Metering • PM Surya Ghar Subsidy</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800/40">
                    Payback: ~{resPaybackYears} Years
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-400">Annual Electricity Savings</div>
                    <div className="text-2xl font-bold text-white mt-1">
                      ₹{resAnnualSavings.toLocaleString("en-IN")} <span className="text-xs font-normal text-slate-400">/ yr</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-1">
                      100% of all 6 bi-monthly TNEB bills eliminated
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">30-Year Lifetime Savings</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">
                      ₹{(resLifetimeSavings / 100000).toFixed(1)} Lakhs
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Includes 30-year Tier-1 panel warranty yield
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span>Total Cost: ₹{resGrossCost.toLocaleString("en-IN")}</span> • <span className="text-white font-semibold">Net Outlay: ₹{resNetInvestment.toLocaleString("en-IN")}</span> <span className="text-slate-500">(after ₹{resSubsidy.toLocaleString("en-IN")} subsidy)</span>
                  </div>
                  <span className="flex items-center gap-1 text-slate-300 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    30-Yr Warranty
                  </span>
                </div>

                <a
                  href="#contact"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-lg text-sm transition-all"
                >
                  <span>Book Free Roof Inspection & Subsidy Claim</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: COMMERCIAL */}
          {activeTab === "commercial" && (
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Commercial Establishment & Petrol Bunk ROI
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Incorporating commercial energy consumption patterns, peak tariff offsets, and tax benefits.
                  </p>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700">
                      Average Monthly Electricity Bill
                    </label>
                    <span className="text-xl font-bold text-slate-900">
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
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                  />

                  <div className="flex justify-between text-xs text-slate-400">
                    <span>₹15,000 (10 kW)</span>
                    <span>₹1,50,000 (50 kW)</span>
                    <span>₹3,00,000 (100 kW)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                    <div className="text-slate-500">Recommended System</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">{commKw} kW Commercial</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                    <div className="text-slate-500">40% Tax Write-Off Benefit</div>
                    <div className="text-base font-bold text-emerald-700 mt-0.5">₹{(commTaxBenefit / 1000).toFixed(0)}k Saved</div>
                  </div>
                </div>
              </div>

              {/* Result Summary */}
              <div className="lg:col-span-6 bg-slate-900 text-white p-6 sm:p-8 rounded-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-semibold text-slate-400">Commercial Return Breakdown</span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800/40">
                    Payback: ~{commPaybackYears} Years
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-400">Annual Power Savings</div>
                    <div className="text-2xl font-bold text-white mt-1">
                      ₹{(commAnnualSavings / 100000).toFixed(2)} Lakhs / yr
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Annual Diesel Offset</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">
                      {commDieselSavedLiters.toLocaleString("en-IN")} Liters
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>350+ HPCL & Retail Stations Powered</span>
                  <span>40% Section 32 IT Benefit</span>
                </div>

                <a
                  href="#contact"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-lg text-sm transition-all"
                >
                  <span>Request Commercial Site Feasibility Report</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: BULK INDUSTRIAL */}
          {activeTab === "bulk" && (
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Industrial HT & Megawatt Solar Plant Feasibility
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Calculated for High-Tension (HT) industrial consumers with CEIG and grid synchronization.
                  </p>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700">
                      Sanctioned Load / Plant Sizing
                    </label>
                    <span className="text-xl font-bold text-slate-900">
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
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                  />

                  <div className="flex justify-between text-xs text-slate-400">
                    <span>100 kW (Shed Mount)</span>
                    <span>1,000 kW (1 MW Captive)</span>
                    <span>2,000 kW (2 MW Farm)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                    <div className="text-slate-500">Daily Generation Yield</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">{indUnitsPerDay.toLocaleString("en-IN")} Units / day</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                    <div className="text-slate-500">Annual Generation</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">{(indAnnualUnits / 100000).toFixed(1)} Lakh Units</div>
                  </div>
                </div>
              </div>

              {/* Result Summary */}
              <div className="lg:col-span-6 bg-slate-900 text-white p-6 sm:p-8 rounded-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-semibold text-slate-400">Industrial Financial Impact</span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800/40">
                    Levelized Tariff: ~₹3.80 / unit
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-400">Annual Tariff Savings</div>
                    <div className="text-2xl font-bold text-white mt-1">
                      ₹{(indAnnualSavings / 100000).toFixed(2)} Lakhs / yr
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">25-Year Hedged Savings</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">
                      ₹{indLifetimeSavingsCrores} Crores
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>CEIG & HT Substation Clearance</span>
                  <span>CAPEX & PPA Options</span>
                </div>

                <a
                  href="#contact"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-lg text-sm transition-all"
                >
                  <span>Connect with High-Tension Solar Specialist</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
