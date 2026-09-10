import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateAnnualGeneration,
  calculateDailyGeneration,
  calculateSolarLCOE,
  calculateIndustrialSolar,
  calculateResidentialSolar,
  calculatePmSuryaGharSubsidy,
  calculateLifetimeCashFlow,
  formatIndianCurrency,
  formatIndianUnits
} from "./solarCalculations.ts";

test("Test 1: 250 kW plant at 17.5% CUF generates exactly 383,250 kWh/year and 1,050 kWh/day", () => {
  const annualGen = calculateAnnualGeneration(250, 17.5);
  assert.equal(annualGen, 383250);

  const dailyGen = calculateDailyGeneration(annualGen);
  assert.equal(dailyGen, 1050);
});

test("Test 2: 500 kW generation exactly doubles the 250 kW generation under identical assumptions", () => {
  const gen250 = calculateAnnualGeneration(250, 17.5);
  const gen500 = calculateAnnualGeneration(500, 17.5);
  assert.equal(gen500, gen250 * 2);
  assert.equal(gen500, 766500);
});

test("Test 3: 1 MW (1,000 kW) generation is exactly 4x the 250 kW generation under identical assumptions", () => {
  const gen250 = calculateAnnualGeneration(250, 17.5);
  const gen1000 = calculateAnnualGeneration(1000, 17.5);
  assert.equal(gen1000, gen250 * 4);
  assert.equal(gen1000, 1533000);
});

test("Test 4: 2 MW (2,000 kW) generation is exactly 8x the 250 kW generation under identical assumptions", () => {
  const gen250 = calculateAnnualGeneration(250, 17.5);
  const gen2000 = calculateAnnualGeneration(2000, 17.5);
  assert.equal(gen2000, gen250 * 8);
  assert.equal(gen2000, 3066000);
});

test("Test 5: Grid tariff ₹8.50 and Solar LCOE ₹3.80 yields ₹4.70/unit savings and ₹18,01,275 annual gross savings for 250 kW", () => {
  const result = calculateIndustrialSolar(250, {
    cufPercent: 17.5,
    gridTariffPerKwh: 8.50,
    customSolarLcoe: 3.80
  });

  assert.equal(Number(result.grossSavingPerKwh.toFixed(2)), 4.70);
  assert.equal(result.annualGrossSavings, 1801275);
  assert.equal(result.isLcoeGreaterThanTariff, false);
});

test("Test 6: LCOE > Grid tariff flags warning and prevents positive gross savings", () => {
  const result = calculateIndustrialSolar(250, {
    cufPercent: 17.5,
    gridTariffPerKwh: 3.50, // Less than LCOE
    customSolarLcoe: 4.00
  });

  assert.equal(result.isLcoeGreaterThanTariff, true);
  assert.equal(result.annualGrossSavings, 0); // No false positive
});

test("Test 7: 25-year panel degradation produces lifetime generation lower than 25 x Year-1 generation", () => {
  const sim = calculateLifetimeCashFlow({
    initialInvestment: 10000000,
    year1GenerationKwh: 383250,
    year1GridTariff: 8.50,
    year1OmCost: 100000,
    projectLifeYears: 25,
    annualDegradationPercent: 0.7,
    tariffEscalationPercent: 3.0,
    omEscalationPercent: 4.0
  });

  const constantLifetimeGen = 383250 * 25; // 9,581,250
  assert.ok(sim.totalLifetimeGenerationKwh < constantLifetimeGen);
  assert.ok(sim.rows[24].generationKwh < sim.rows[0].generationKwh);
});

test("Test 8: Tariff escalation increases grid tariff each year according to configured rate", () => {
  const sim = calculateLifetimeCashFlow({
    initialInvestment: 10000000,
    year1GenerationKwh: 383250,
    year1GridTariff: 8.50,
    year1OmCost: 100000,
    projectLifeYears: 25,
    annualDegradationPercent: 0.7,
    tariffEscalationPercent: 3.0,
    omEscalationPercent: 4.0
  });

  assert.equal(Number(sim.rows[0].gridTariff.toFixed(2)), 8.50);
  assert.equal(Number(sim.rows[1].gridTariff.toFixed(2)), Number((8.50 * 1.03).toFixed(2)));
  assert.ok(sim.rows[24].gridTariff > 8.50 * 1.8);
});

test("Test 9: Payback period is derived from cumulative yearly cash flow including O&M", () => {
  const sim = calculateLifetimeCashFlow({
    initialInvestment: 10000000, // ₹1.00 Cr
    year1GenerationKwh: 383250,
    year1GridTariff: 8.50,
    year1OmCost: 100000,
    projectLifeYears: 25,
    annualDegradationPercent: 0.7,
    tariffEscalationPercent: 3.0,
    omEscalationPercent: 4.0
  });

  assert.ok(sim.paybackPeriodYears !== null);
  assert.ok(sim.paybackPeriodYears > 2.5 && sim.paybackPeriodYears < 4.0);
});

test("Test 10: Residential PM Surya Ghar subsidy rules are strictly enforced and zero for commercial/industrial", () => {
  assert.equal(calculatePmSuryaGharSubsidy(1, "residential"), 30000);
  assert.equal(calculatePmSuryaGharSubsidy(2, "residential"), 60000);
  assert.equal(calculatePmSuryaGharSubsidy(3, "residential"), 78000);
  assert.equal(calculatePmSuryaGharSubsidy(5, "residential"), 78000);
  assert.equal(calculatePmSuryaGharSubsidy(10, "residential"), 78000);

  // Non-residential must be 0
  assert.equal(calculatePmSuryaGharSubsidy(100, "commercial"), 0);
  assert.equal(calculatePmSuryaGharSubsidy(250, "industrial"), 0);
});

test("Test 11: Indian Currency and Unit formatting", () => {
  assert.equal(formatIndianCurrency(1801275), "₹18,01,275");
  assert.equal(formatIndianCurrency(1801275, { compact: true }), "₹18.01 Lakhs");
  assert.equal(formatIndianCurrency(45031875, { compact: true }), "₹4.50 Crores");

  assert.equal(formatIndianUnits(1050), "1,050 Units");
  assert.equal(formatIndianUnits(383250, { compact: true }), "3.83 Lakh Units");
});
