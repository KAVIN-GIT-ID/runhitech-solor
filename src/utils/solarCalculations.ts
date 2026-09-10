/**
 * Solar Calculation & Financial Modeling Engine
 * =============================================
 * Pure, testable calculation functions for Indian Solar Projects:
 * - Residential Rooftop (PM Surya Ghar Muft Bijli Yojana & TANGEDCO LT-1A)
 * - Commercial & Petrol Bunks (TANGEDCO LT-V & Section 32 IT Act)
 * - Industrial & Solar Farms (TANGEDCO HT-1A & Captive Megawatt Plants)
 *
 * Official Regulatory Standards & Guidelines Grounding:
 * - MNRE / PM Surya Ghar Operational Guidelines (Feb 2024)
 * - TNERC Multi-Year Tariff Orders for LT-1A, LT-V, and HT-1A
 * - Section 32 of Indian Income Tax Act 1961 (40% Accelerated Depreciation)
 */

// ── TYPES & INTERFACES ──────────────────────────────────────────

export interface GenerationModelInput {
  capacityKw: number;
  cufPercent?: number; // Capacity Utilization Factor (default 17.5% in Tamil Nadu)
}

export interface ResidentialCalcResult {
  biMonthlyUnits: number;
  annualUnits: number;
  recommendedKw: number;
  solarAnnualGenerationKwh: number;
  solarBiMonthlyUnits: number;
  solarDailyUnits: number;
  currentAnnualBill: number;
  newAnnualBill: number;
  annualBillSavings: number;
  monthlySavings: number;
  grossSystemCost: number;
  pmSuryaGharSubsidy: number;
  consumerNetInvestment: number;
  estimatedPaybackYears: number;
  thirtyYearGrossSavings: number;
  thirtyYearProjectedNetSavings: number;
  projectRoiPercent: number;
}

export interface CommercialCalcResult {
  recommendedKw: number;
  solarAnnualGenerationKwh: number;
  solarDailyUnits: number;
  annualBillSavings: number;
  grossSystemCost: number;
  section32TaxBenefit: number;
  annualDieselOffsetLiters: number;
  estimatedPaybackYears: number;
  twentyFiveYearProjectedNetSavings: number;
  projectRoiPercent: number;
}

export interface IndustrialCalcResult {
  capacityKw: number;
  cufPercent: number;
  solarAnnualGenerationKwh: number;
  solarDailyUnits: number;
  gridTariffPerKwh: number;
  solarLcoePerKwh: number;
  grossSavingPerKwh: number;
  isLcoeGreaterThanTariff: boolean;
  grossSystemCost: number;
  annualGrossSavings: number;
  annualOmCost: number;
  annualNetSavings: number;
  twentyFiveYearGrossSavings: number;
  twentyFiveYearProjectedNetSavings: number;
  estimatedPaybackYears: number;
  projectRoiPercent: number;
}

export interface LcoeParams {
  capacityKw: number;
  capexPerKw: number;
  cufPercent: number;
  projectLifeYears?: number;
  omPercentOfCapex?: number;
  omEscalationPercent?: number;
  annualDegradationPercent?: number;
  discountRatePercent?: number;
}

export interface LifetimeCashFlowParams {
  initialInvestment: number;
  year1GenerationKwh: number;
  year1GridTariff: number;
  year1OmCost: number;
  projectLifeYears: number;
  annualDegradationPercent: number;
  tariffEscalationPercent: number;
  omEscalationPercent: number;
  discountRatePercent?: number;
}

export interface YearlyCashFlowRow {
  year: number;
  generationKwh: number;
  gridTariff: number;
  grossSavings: number;
  omCost: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
  discountedCashFlow: number;
}

export interface LifetimeFinancialResult {
  rows: YearlyCashFlowRow[];
  totalLifetimeGenerationKwh: number;
  totalLifetimeGrossSavings: number;
  totalLifetimeOmCost: number;
  totalLifetimeNetSavings: number;
  paybackPeriodYears: number | null; // null if investment never recovers
  roiPercent: number;
  npv: number;
}

// ── REGULATORY CONSTANTS & BENCHMARKS ──────────────────────────

export const REGULATORY_CONSTANTS = {
  HOURS_PER_YEAR: 8760,
  DAYS_PER_YEAR: 365,
  TAMIL_NADU_DEFAULT_CUF: 17.5, // 17.5% CUF yields 1,533 kWh/kWp/year (~4.2 kWh/kW/day)
  DEFAULT_PANEL_DEGRADATION: 0.7, // 0.7%/year (Standard Tier-1 Mono PERC/TOPCon warranty)
  DEFAULT_GRID_ESCALATION: 3.0, // 3.0%/year conservative planning escalation
  DEFAULT_OM_PERCENT: 1.0, // 1.0% of CAPEX/year
  DEFAULT_OM_ESCALATION: 4.0, // 4.0%/year inflation in labor/consumables
  DEFAULT_DISCOUNT_RATE: 10.0, // 10.0% standard WACC / discount rate

  // Residential CAPEX Benchmark (Tamil Nadu DCR Mono PERC turnkey grid-tied)
  RESIDENTIAL_CAPEX_PER_KW: 60000,

  // Commercial Rooftop Turnkey CAPEX Benchmark
  COMMERCIAL_CAPEX_PER_KW: 50000,
  COMMERCIAL_GRID_TARIFF: 10.45, // TNERC LT-V Commercial energy charge

  // Industrial Megawatt / HT Turnkey CAPEX Benchmark
  INDUSTRIAL_CAPEX_PER_KW: 40000,
  INDUSTRIAL_HT1A_GRID_TARIFF: 8.50, // TNERC HT-1A blended effective energy charge (₹7.50 base + demand + duty)
  INDUSTRIAL_DEFAULT_LCOE: 3.80, // Benchmark Levelized Cost of Electricity for ~250kW-1MW captive solar

  // PM Surya Ghar Muft Bijli Yojana Central Subsidy Matrix (MNRE Order Feb 2024)
  PM_SURYA_GHAR_SUBSIDY: {
    TIER_1_KW: 30000, // 1 kW = ₹30,000
    TIER_2_KW: 60000, // 2 kW = ₹60,000
    TIER_3_KW_PLUS: 78000, // 3 kW and above = ₹78,000 max cap
  },

  // Section 32 Income Tax Act 1961
  SECTION_32_ACCELERATED_DEPRECIATION: 0.40, // 40% Year 1 write-off
  CORPORATE_TAX_RATE: 0.25, // 25% corporate tax shield

  // TANGEDCO / TNPDCL LT-1A Telescopic Slab Tariff (Current TNERC Order)
  TNEB_LT1A_SLABS: [
    { upToUnits: 100, rate: 0.00 },
    { upToUnits: 200, rate: 2.35 },
    { upToUnits: 400, rate: 4.70 },
    { upToUnits: 500, rate: 6.30 },
    { upToUnits: 600, rate: 8.40 },
    { upToUnits: 800, rate: 9.45 },
    { upToUnits: 1000, rate: 10.50 },
    { upToUnits: Infinity, rate: 11.55 }
  ]
};

// ── CORE GENERATION FUNCTIONS ───────────────────────────────────

/**
 * Calculates annual solar electricity generation in kWh/year:
 * Capacity (kW) × 8760 hours × CUF (%)
 */
export function calculateAnnualGeneration(capacityKw: number, cufPercent = REGULATORY_CONSTANTS.TAMIL_NADU_DEFAULT_CUF): number {
  if (capacityKw <= 0 || cufPercent <= 0) return 0;
  return capacityKw * REGULATORY_CONSTANTS.HOURS_PER_YEAR * (cufPercent / 100);
}

/**
 * Calculates average daily generation in kWh/day from annual generation.
 */
export function calculateDailyGeneration(annualGenerationKwh: number): number {
  if (annualGenerationKwh <= 0) return 0;
  return annualGenerationKwh / REGULATORY_CONSTANTS.DAYS_PER_YEAR;
}

// ── RESIDENTIAL (PM SURYA GHAR & TANGEDCO LT-1A) ───────────────

/**
 * Inverts official TANGEDCO LT-1A telescopic slabs to estimate bi-monthly consumption from an EB bill amount.
 */
export function getBiMonthlyUnitsFromBill(bill: number): number {
  if (bill <= 0) return 0;
  if (bill <= 235) return Math.round(100 + bill / 2.35);
  if (bill <= 1175) return Math.round(200 + (bill - 235) / 4.70);
  if (bill <= 1805) return Math.round(400 + (bill - 1175) / 6.30);
  if (bill <= 2645) return Math.round(500 + (bill - 1805) / 8.40);
  if (bill <= 4535) return Math.round(600 + (bill - 2645) / 9.45);
  if (bill <= 6635) return Math.round(800 + (bill - 4535) / 10.50);
  return Math.round(1000 + (bill - 6635) / 11.55);
}

/**
 * Calculates exact TNEB LT-1A bi-monthly domestic electricity bill from consumed units.
 */
export function calculateTnebBillFromUnits(units: number): number {
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

/**
 * Official PM Surya Ghar Muft Bijli Yojana Central Government Subsidy:
 * - 1 kW: ₹30,000
 * - 2 kW: ₹60,000
 * - 3 kW and above: ₹78,000 (Maximum cap for individual domestic rooftop)
 * Note: Only applicable to residential consumers. Commercial & Industrial receive 0 subsidy.
 */
export function calculatePmSuryaGharSubsidy(
  capacityKw: number,
  consumerType: "residential" | "commercial" | "industrial" = "residential"
): number {
  if (consumerType !== "residential" || capacityKw <= 0) return 0;
  if (capacityKw < 1) return Math.round(capacityKw * 30000);
  if (capacityKw < 2) return REGULATORY_CONSTANTS.PM_SURYA_GHAR_SUBSIDY.TIER_1_KW;
  if (capacityKw < 3) return REGULATORY_CONSTANTS.PM_SURYA_GHAR_SUBSIDY.TIER_2_KW;
  return REGULATORY_CONSTANTS.PM_SURYA_GHAR_SUBSIDY.TIER_3_KW_PLUS;
}

/**
 * Full Residential Solar Financial Engine
 */
export function calculateResidentialSolar(
  billAmount: number,
  billingCycle: "monthly" | "bimonthly" = "bimonthly",
  customCapacityKw?: number
): ResidentialCalcResult {
  const biMonthlyBill = billingCycle === "monthly" ? billAmount * 2 : billAmount;
  const biMonthlyUnits = getBiMonthlyUnitsFromBill(biMonthlyBill);
  const annualUnits = biMonthlyUnits * 6;

  // Sizing: In Tamil Nadu (17.5% CUF), 1 kW produces (8760 * 0.175) / 6 = ~255.5 units per 60-day cycle
  const unitsPerKwBiMonthly = (calculateAnnualGeneration(1, REGULATORY_CONSTANTS.TAMIL_NADU_DEFAULT_CUF)) / 6;
  const idealKw = Math.ceil(biMonthlyUnits / unitsPerKwBiMonthly);
  const recommendedKw = customCapacityKw ?? Math.min(10, Math.max(1, idealKw));

  const solarAnnualGenerationKwh = calculateAnnualGeneration(recommendedKw, REGULATORY_CONSTANTS.TAMIL_NADU_DEFAULT_CUF);
  const solarBiMonthlyUnits = Math.round(solarAnnualGenerationKwh / 6);
  const solarDailyUnits = calculateDailyGeneration(solarAnnualGenerationKwh);

  // Net Metering Offset (Min of consumption or generation)
  const netUnitsBilled = Math.max(0, biMonthlyUnits - solarBiMonthlyUnits);
  const currentAnnualBill = biMonthlyBill * 6;
  const newAnnualBill = calculateTnebBillFromUnits(netUnitsBilled) * 6;
  const annualBillSavings = Math.max(0, currentAnnualBill - newAnnualBill);
  const monthlySavings = Math.round(annualBillSavings / 12);

  // CAPEX & Subsidy
  const grossSystemCost = recommendedKw * REGULATORY_CONSTANTS.RESIDENTIAL_CAPEX_PER_KW;
  const pmSuryaGharSubsidy = Math.min(grossSystemCost, calculatePmSuryaGharSubsidy(recommendedKw, "residential"));
  const consumerNetInvestment = Math.max(0, grossSystemCost - pmSuryaGharSubsidy);

  // 30-Year Financial Simulation (with degradation, tariff escalation & maintenance)
  const financialResult = calculateLifetimeCashFlow({
    initialInvestment: consumerNetInvestment,
    year1GenerationKwh: solarAnnualGenerationKwh,
    year1GridTariff: currentAnnualBill > 0 && annualUnits > 0 ? (annualBillSavings / Math.min(annualUnits, solarAnnualGenerationKwh)) : 6.50,
    year1OmCost: recommendedKw * 800, // ~₹800/kW/year residential maintenance
    projectLifeYears: 30, // 30-year Tier-1 performance yield
    annualDegradationPercent: REGULATORY_CONSTANTS.DEFAULT_PANEL_DEGRADATION,
    tariffEscalationPercent: REGULATORY_CONSTANTS.DEFAULT_GRID_ESCALATION,
    omEscalationPercent: REGULATORY_CONSTANTS.DEFAULT_OM_ESCALATION,
    discountRatePercent: REGULATORY_CONSTANTS.DEFAULT_DISCOUNT_RATE
  });

  return {
    biMonthlyUnits,
    annualUnits,
    recommendedKw,
    solarAnnualGenerationKwh,
    solarBiMonthlyUnits,
    solarDailyUnits,
    currentAnnualBill,
    newAnnualBill,
    annualBillSavings,
    monthlySavings,
    grossSystemCost,
    pmSuryaGharSubsidy,
    consumerNetInvestment,
    estimatedPaybackYears: financialResult.paybackPeriodYears ?? (consumerNetInvestment > 0 && annualBillSavings > 0 ? Number((consumerNetInvestment / annualBillSavings).toFixed(1)) : 0),
    thirtyYearGrossSavings: financialResult.totalLifetimeGrossSavings,
    thirtyYearProjectedNetSavings: financialResult.totalLifetimeNetSavings,
    projectRoiPercent: financialResult.roiPercent
  };
}

// ── COMMERCIAL & PETROL BUNKS (LT-V & SECTION 32) ───────────────

export function calculateCommercialSolar(monthlyBill: number, customCapacityKw?: number): CommercialCalcResult {
  // Proportional sizing: ₹15,000 -> 10 kW, ₹1,50,000 -> 50 kW, ₹3,00,000 -> 100 kW
  const recommendedKw = customCapacityKw ?? Math.min(100, Math.max(10, Math.round(10 + ((monthlyBill - 15000) / (300000 - 15000)) * 90)));
  const solarAnnualGenerationKwh = calculateAnnualGeneration(recommendedKw, REGULATORY_CONSTANTS.TAMIL_NADU_DEFAULT_CUF);
  const solarDailyUnits = calculateDailyGeneration(solarAnnualGenerationKwh);

  const grossSystemCost = recommendedKw * REGULATORY_CONSTANTS.COMMERCIAL_CAPEX_PER_KW;
  // Section 32 of Indian Income Tax Act: 40% Accelerated Depreciation in Year 1 at 25% corporate tax rate
  const section32TaxBenefit = Math.round(
    grossSystemCost * REGULATORY_CONSTANTS.SECTION_32_ACCELERATED_DEPRECIATION * REGULATORY_CONSTANTS.CORPORATE_TAX_RATE
  );

  // Commercial bill savings: Offsets daytime peak consumption (~80-85% of grid charges)
  const annualBillSavings = Math.round(monthlyBill * 12 * 0.85);

  // Diesel Generator replacement: ~75-90 liters of diesel per month per 10 kW solar
  const annualDieselOffsetLiters = Math.round(recommendedKw * 75 * 12);

  const netEffectiveInitialCapex = grossSystemCost - section32TaxBenefit;

  const financialResult = calculateLifetimeCashFlow({
    initialInvestment: netEffectiveInitialCapex,
    year1GenerationKwh: solarAnnualGenerationKwh,
    year1GridTariff: REGULATORY_CONSTANTS.COMMERCIAL_GRID_TARIFF,
    year1OmCost: grossSystemCost * 0.01,
    projectLifeYears: 25,
    annualDegradationPercent: REGULATORY_CONSTANTS.DEFAULT_PANEL_DEGRADATION,
    tariffEscalationPercent: REGULATORY_CONSTANTS.DEFAULT_GRID_ESCALATION,
    omEscalationPercent: REGULATORY_CONSTANTS.DEFAULT_OM_ESCALATION,
    discountRatePercent: REGULATORY_CONSTANTS.DEFAULT_DISCOUNT_RATE
  });

  return {
    recommendedKw,
    solarAnnualGenerationKwh,
    solarDailyUnits,
    annualBillSavings,
    grossSystemCost,
    section32TaxBenefit,
    annualDieselOffsetLiters,
    estimatedPaybackYears: financialResult.paybackPeriodYears ?? (netEffectiveInitialCapex > 0 && annualBillSavings > 0 ? Number((netEffectiveInitialCapex / annualBillSavings).toFixed(1)) : 0),
    twentyFiveYearProjectedNetSavings: financialResult.totalLifetimeNetSavings,
    projectRoiPercent: financialResult.roiPercent
  };
}

// ── INDUSTRIAL & SOLAR FARMS (HT-1A & CAPTIVE SOLAR) ───────────

/**
 * Levelized Cost of Electricity (LCOE) Model:
 * LCOE = (Initial CAPEX + PV of Lifetime O&M) / (PV of Lifetime Generation)
 */
export function calculateSolarLCOE(params: LcoeParams): number {
  const {
    capacityKw,
    capexPerKw,
    cufPercent,
    projectLifeYears = 25,
    omPercentOfCapex = REGULATORY_CONSTANTS.DEFAULT_OM_PERCENT,
    omEscalationPercent = REGULATORY_CONSTANTS.DEFAULT_OM_ESCALATION,
    annualDegradationPercent = REGULATORY_CONSTANTS.DEFAULT_PANEL_DEGRADATION,
    discountRatePercent = REGULATORY_CONSTANTS.DEFAULT_DISCOUNT_RATE
  } = params;

  if (capacityKw <= 0 || capexPerKw <= 0 || cufPercent <= 0) return 0;

  const initialCapex = capacityKw * capexPerKw;
  const year1Generation = calculateAnnualGeneration(capacityKw, cufPercent);
  const year1Om = initialCapex * (omPercentOfCapex / 100);
  const r = discountRatePercent / 100;
  const d = annualDegradationPercent / 100;
  const eOm = omEscalationPercent / 100;

  let pvCosts = initialCapex;
  let pvGeneration = 0;

  for (let year = 1; year <= projectLifeYears; year++) {
    const genYear = year1Generation * Math.pow(1 - d, year - 1);
    const omYear = year1Om * Math.pow(1 + eOm, year - 1);
    const discountFactor = Math.pow(1 + r, year);

    pvCosts += omYear / discountFactor;
    pvGeneration += genYear / discountFactor;
  }

  if (pvGeneration <= 0) return 0;
  return Number((pvCosts / pvGeneration).toFixed(2));
}

/**
 * Full Industrial Solar Feasibility Engine
 */
export function calculateIndustrialSolar(
  capacityKw: number,
  options?: {
    cufPercent?: number;
    gridTariffPerKwh?: number;
    customSolarLcoe?: number;
    capexPerKw?: number;
    omPercent?: number;
    degradationPercent?: number;
    tariffEscalationPercent?: number;
  }
): IndustrialCalcResult {
  const cufPercent = options?.cufPercent ?? REGULATORY_CONSTANTS.TAMIL_NADU_DEFAULT_CUF;
  const gridTariffPerKwh = options?.gridTariffPerKwh ?? REGULATORY_CONSTANTS.INDUSTRIAL_HT1A_GRID_TARIFF;
  const capexPerKw = options?.capexPerKw ?? REGULATORY_CONSTANTS.INDUSTRIAL_CAPEX_PER_KW;
  const omPercent = options?.omPercent ?? REGULATORY_CONSTANTS.DEFAULT_OM_PERCENT;
  const degradationPercent = options?.degradationPercent ?? REGULATORY_CONSTANTS.DEFAULT_PANEL_DEGRADATION;
  const tariffEscalationPercent = options?.tariffEscalationPercent ?? REGULATORY_CONSTANTS.DEFAULT_GRID_ESCALATION;

  const solarAnnualGenerationKwh = calculateAnnualGeneration(capacityKw, cufPercent);
  const solarDailyUnits = calculateDailyGeneration(solarAnnualGenerationKwh);

  const calculatedLcoe = calculateSolarLCOE({
    capacityKw,
    capexPerKw,
    cufPercent,
    omPercentOfCapex: omPercent,
    annualDegradationPercent: degradationPercent,
    discountRatePercent: REGULATORY_CONSTANTS.DEFAULT_DISCOUNT_RATE
  });

  const solarLcoePerKwh = options?.customSolarLcoe ?? (calculatedLcoe > 0 ? calculatedLcoe : REGULATORY_CONSTANTS.INDUSTRIAL_DEFAULT_LCOE);

  const grossSavingPerKwh = gridTariffPerKwh - solarLcoePerKwh;
  const isLcoeGreaterThanTariff = grossSavingPerKwh <= 0;

  const grossSystemCost = capacityKw * capexPerKw;
  const annualOmCost = grossSystemCost * (omPercent / 100);

  // Exact Year-1 arithmetic matching benchmark:
  // 383,250 units × (₹8.50 - ₹3.80 = ₹4.70) = ₹18,01,275
  const annualGrossSavings = Math.max(0, Math.round(solarAnnualGenerationKwh * grossSavingPerKwh));
  const annualNetSavings = Math.max(0, Math.round(solarAnnualGenerationKwh * gridTariffPerKwh - annualOmCost));

  // 25-Year Financial Cash Flow Model
  const financialResult = calculateLifetimeCashFlow({
    initialInvestment: grossSystemCost,
    year1GenerationKwh: solarAnnualGenerationKwh,
    year1GridTariff: gridTariffPerKwh,
    year1OmCost: annualOmCost,
    projectLifeYears: 25,
    annualDegradationPercent: degradationPercent,
    tariffEscalationPercent: tariffEscalationPercent,
    omEscalationPercent: REGULATORY_CONSTANTS.DEFAULT_OM_ESCALATION,
    discountRatePercent: REGULATORY_CONSTANTS.DEFAULT_DISCOUNT_RATE
  });

  const twentyFiveYearGrossSavings = annualGrossSavings * 25; // Simple linear gross comparison benchmark
  const twentyFiveYearProjectedNetSavings = financialResult.totalLifetimeNetSavings;

  return {
    capacityKw,
    cufPercent,
    solarAnnualGenerationKwh,
    solarDailyUnits,
    gridTariffPerKwh,
    solarLcoePerKwh,
    grossSavingPerKwh,
    isLcoeGreaterThanTariff,
    grossSystemCost,
    annualGrossSavings,
    annualOmCost,
    annualNetSavings,
    twentyFiveYearGrossSavings,
    twentyFiveYearProjectedNetSavings,
    estimatedPaybackYears: financialResult.paybackPeriodYears ?? (grossSystemCost > 0 && annualNetSavings > 0 ? Number((grossSystemCost / annualNetSavings).toFixed(1)) : 0),
    projectRoiPercent: financialResult.roiPercent
  };
}

// ── 25 / 30-YEAR LIFETIME CASH FLOW SIMULATOR ──────────────────

export function calculateLifetimeCashFlow(params: LifetimeCashFlowParams): LifetimeFinancialResult {
  const {
    initialInvestment,
    year1GenerationKwh,
    year1GridTariff,
    year1OmCost,
    projectLifeYears,
    annualDegradationPercent,
    tariffEscalationPercent,
    omEscalationPercent,
    discountRatePercent = REGULATORY_CONSTANTS.DEFAULT_DISCOUNT_RATE
  } = params;

  const rows: YearlyCashFlowRow[] = [];
  let totalGeneration = 0;
  let totalGrossSavings = 0;
  let totalOm = 0;
  let cumulativeCashFlow = -initialInvestment;
  let paybackPeriodYears: number | null = null;
  let npv = -initialInvestment;

  const r = discountRatePercent / 100;
  const d = annualDegradationPercent / 100;
  const eTariff = tariffEscalationPercent / 100;
  const eOm = omEscalationPercent / 100;

  for (let year = 1; year <= projectLifeYears; year++) {
    const generationKwh = year1GenerationKwh * Math.pow(1 - d, year - 1);
    const gridTariff = year1GridTariff * Math.pow(1 + eTariff, year - 1);
    const grossSavings = generationKwh * gridTariff;
    const omCost = year1OmCost * Math.pow(1 + eOm, year - 1);
    const netCashFlow = grossSavings - omCost;

    const prevCumulative = cumulativeCashFlow;
    cumulativeCashFlow += netCashFlow;

    const discountFactor = Math.pow(1 + r, year);
    const discountedCashFlow = netCashFlow / discountFactor;
    npv += discountedCashFlow;

    // Detect payback year with fractional interpolation
    if (paybackPeriodYears === null && cumulativeCashFlow >= 0) {
      if (netCashFlow > 0) {
        const fraction = (-prevCumulative) / netCashFlow;
        paybackPeriodYears = Number(((year - 1) + Math.max(0, Math.min(1, fraction))).toFixed(1));
      } else {
        paybackPeriodYears = year;
      }
    }

    totalGeneration += generationKwh;
    totalGrossSavings += grossSavings;
    totalOm += omCost;

    rows.push({
      year,
      generationKwh,
      gridTariff,
      grossSavings,
      omCost,
      netCashFlow,
      cumulativeCashFlow,
      discountedCashFlow
    });
  }

  const totalLifetimeNetSavings = Math.max(0, cumulativeCashFlow);
  const roiPercent = initialInvestment > 0 ? Number(((totalLifetimeNetSavings / initialInvestment) * 100).toFixed(0)) : 0;

  return {
    rows,
    totalLifetimeGenerationKwh: Math.round(totalGeneration),
    totalLifetimeGrossSavings: Math.round(totalGrossSavings),
    totalLifetimeOmCost: Math.round(totalOm),
    totalLifetimeNetSavings: Math.round(totalLifetimeNetSavings),
    paybackPeriodYears,
    roiPercent,
    npv: Math.round(npv)
  };
}

// ── NUMBER & CURRENCY FORMATTERS (INDIAN SYSTEM) ───────────────

/**
 * Formats values into Indian Currency notation:
 * - ₹18,01,275
 * - ₹18.01 Lakhs
 * - ₹4.50 Crores
 */
export function formatIndianCurrency(amount: number, options?: { compact?: boolean; unitSuffix?: string }): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "₹0";
  const abs = Math.abs(amount);

  if (options?.compact) {
    if (abs >= 10000000) {
      const cr = (amount / 10000000).toFixed(2);
      return `₹${cr} Crores${options?.unitSuffix ? ` ${options.unitSuffix}` : ""}`;
    }
    if (abs >= 100000) {
      const lk = (amount / 100000).toFixed(2);
      return `₹${lk} Lakhs${options?.unitSuffix ? ` ${options.unitSuffix}` : ""}`;
    }
  }

  const formatted = Math.round(amount).toLocaleString("en-IN");
  return `₹${formatted}${options?.unitSuffix ? ` ${options.unitSuffix}` : ""}`;
}

/**
 * Formats units / kWh into Indian numbering notation:
 * - 1,050 Units / day
 * - 3.83 Lakh Units / yr
 */
export function formatIndianUnits(units: number, options?: { compact?: boolean; unitSuffix?: string }): string {
  if (isNaN(units) || units === null || units === undefined) return "0 Units";
  const abs = Math.abs(units);

  if (options?.compact && abs >= 100000) {
    const lk = (units / 100000).toFixed(2);
    return `${lk} Lakh Units${options?.unitSuffix ? ` ${options.unitSuffix}` : ""}`;
  }

  const formatted = Math.round(units).toLocaleString("en-IN");
  return `${formatted} Units${options?.unitSuffix ? ` ${options.unitSuffix}` : ""}`;
}
