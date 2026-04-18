"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { runFafsaModule, runTaxModule } from "@/engine";
import type { FilingStatus } from "@/engine/types";

type ToolView = "menu" | "fafsa" | "tax" | "col";

interface CityData {
  city: string;
  country: string;
  rent1br: number;
  roommateRent: number;
  monthlyTransit: number;
  mealCheap: number;
  utilities: number;
  internet: number;
  coffeePrice: number;
  gymPrice: number;
  groceriesEstimate: number;
  studentMonthly: number;
  studentRoommateMonthly: number;
  scraped?: boolean;
}

export default function ToolsPage() {
  const [view, setView] = useState<ToolView>("menu");

  // FAFSA State
  const [fafsaCoa, setFafsaCoa] = useState(35000);
  const [fafsaEfc, setFafsaEfc] = useState(10000);

  // Tax State
  const [taxIncome, setTaxIncome] = useState(55000);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");

  // Cost of Living State
  const [colCityA, setColCityA] = useState("");
  const [colCityB, setColCityB] = useState("");
  const [colResult, setColResult] = useState<{ cityA: CityData | null; cityB: CityData | null } | null>(null);
  const [colLoading, setColLoading] = useState(false);
  const [colError, setColError] = useState<string | null>(null);

  // FAFSA Calculation
  const fafsaResult = useMemo(() => {
    return runFafsaModule(
      { user_type: "student", monthly_income: 2500 },
      { cost_of_attendance: fafsaCoa, expected_family_contribution: fafsaEfc }
    );
  }, [fafsaCoa, fafsaEfc]);

  // Tax Calculation
  const taxResult = useMemo(() => {
    return runTaxModule(
      { user_type: "professional", monthly_income: taxIncome / 12, filing_status: filingStatus },
      true
    );
  }, [taxIncome, filingStatus]);

  const fetchColData = async () => {
    if (!colCityA.trim() || !colCityB.trim()) return;
    setColLoading(true);
    setColError(null);
    try {
      const res = await fetch(
        `/api/cost-of-living?cityA=${encodeURIComponent(colCityA)}&cityB=${encodeURIComponent(colCityB)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to fetch data");
      setColResult(data);
    } catch (err) {
      setColError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setColLoading(false);
    }
  };

  if (view === "fafsa") {
    return (
      <>
        <Navbar />
        <main className="w-full pb-12">
          <div className="p-8 max-w-3xl mx-auto space-y-8">
            <button
              onClick={() => setView("menu")}
              className="text-accent-light hover:text-accent-purple transition-smooth"
            >
              ← Back
            </button>

            <div>
              <SectionHeader title="FAFSA Estimator" />
            </div>

            <Card className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Cost of Attendance (per year)
                </label>
                <input
                  type="number"
                  value={fafsaCoa}
                  onChange={(e) => setFafsaCoa(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg bg-dark-border border border-dark-border/50 text-white focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Expected Family Contribution (EFC)
                </label>
                <input
                  type="number"
                  value={fafsaEfc}
                  onChange={(e) => setFafsaEfc(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg bg-dark-border border border-dark-border/50 text-white focus:outline-none focus:border-accent-purple"
                />
              </div>

              {fafsaResult && (
                <Card className="bg-green-500/10 border-green-500/30">
                  <h4 className="font-semibold text-green-400 mb-3">Estimated Results</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Financial Need:</span>
                      <span className="font-semibold">
                        ${fafsaResult.need.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Aid Estimate (Low):</span>
                      <span className="font-semibold text-green-400">
                        ${fafsaResult.aid_estimate_low.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Aid Estimate (High):</span>
                      <span className="font-semibold text-green-300">
                        ${fafsaResult.aid_estimate_high.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-green-500/30 pt-2 mt-2">
                      <p className="text-xs text-gray-500 mb-2">Monthly Surplus/Deficit:</p>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Low Estimate:</span>
                        <span className={fafsaResult.monthly_surplus_or_deficit_low >= 0 ? "text-green-400" : "text-red-400"}>
                          ${fafsaResult.monthly_surplus_or_deficit_low.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">High Estimate:</span>
                        <span className={fafsaResult.monthly_surplus_or_deficit_high >= 0 ? "text-green-400" : "text-red-400"}>
                          ${fafsaResult.monthly_surplus_or_deficit_high.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </Card>
          </div>
        </main>
      </>
    );
  }

  if (view === "tax") {
    return (
      <>
        <Navbar />
        <main className="w-full pb-12">
          <div className="p-8 max-w-3xl mx-auto space-y-8">
            <button
              onClick={() => setView("menu")}
              className="text-accent-light hover:text-accent-purple transition-smooth"
            >
              ← Back
            </button>

            <div>
              <SectionHeader title="Tax Calculator" />
            </div>

            <Card className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Annual Income
                </label>
                <input
                  type="number"
                  value={taxIncome}
                  onChange={(e) => setTaxIncome(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg bg-dark-border border border-dark-border/50 text-white focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Filing Status
                </label>
                <select
                  value={filingStatus}
                  onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
                  className="w-full px-4 py-2 rounded-lg bg-dark-border border border-dark-border/50 text-white focus:outline-none focus:border-accent-purple"
                >
                  <option value="single">Single</option>
                  <option value="married">Married Filing Jointly</option>
                  <option value="head_of_household">Head of Household</option>
                </select>
              </div>

              {taxResult && taxResult.enabled && (
                <Card className="bg-blue-500/10 border-blue-500/30">
                  <h4 className="font-semibold text-blue-400 mb-3">Tax Estimate</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Federal Tax (est.):</p>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Range:</span>
                        <span className="font-semibold">
                          ${taxResult.federal_low.toLocaleString()} - ${taxResult.federal_high.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">California State Tax (est.):</p>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Range:</span>
                        <span className="font-semibold">
                          ${taxResult.state_low.toLocaleString()} - ${taxResult.state_high.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-blue-500/30 pt-2 mt-2">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Total Tax:</span>
                        <span className="font-semibold text-yellow-400">
                          ${taxResult.total_low.toLocaleString()} - ${taxResult.total_high.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-blue-500/30 pt-2 mt-2">
                      <p className="text-xs text-gray-500 mb-2">Net Income (Annual):</p>
                      <div className="flex justify-between">
                        <span className="text-gray-400">After Tax:</span>
                        <span className="font-semibold text-green-400">
                          ${taxResult.net_annual_low.toLocaleString()} - ${taxResult.net_annual_high.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-2">Net Income (Monthly):</p>
                      <div className="flex justify-between">
                        <span className="text-gray-400">After Tax:</span>
                        <span className="font-semibold text-green-400">
                          ${taxResult.net_monthly_low.toLocaleString()} - ${taxResult.net_monthly_high.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </Card>
          </div>
        </main>
      </>
    );
  }

  if (view === "col") {

    return (
      <>
        <Navbar />
        <main className="w-full pb-12">
          <div className="p-8 max-w-4xl mx-auto space-y-8">
            <button
              onClick={() => { setView("menu"); setColResult(null); setColError(null); }}
              className="text-accent-light hover:text-accent-purple transition-smooth"
            >
              ← Back
            </button>

            <SectionHeader
              title="Cost of Living Comparison"
              subtitle="Enter two cities to compare real student-relevant costs"
            />

            <Card className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    📍 Location A
                  </label>
                  <input
                    type="text"
                    value={colCityA}
                    onChange={(e) => setColCityA(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchColData()}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-4 py-3 rounded-lg bg-dark-border border border-dark-border/50 text-white placeholder-gray-500 focus:outline-none focus:border-accent-purple text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    📍 Location B
                  </label>
                  <input
                    type="text"
                    value={colCityB}
                    onChange={(e) => setColCityB(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchColData()}
                    placeholder="e.g. Austin, TX"
                    className="w-full px-4 py-3 rounded-lg bg-dark-border border border-dark-border/50 text-white placeholder-gray-500 focus:outline-none focus:border-accent-purple text-sm"
                  />
                </div>
              </div>

              <button
                onClick={fetchColData}
                disabled={colLoading || !colCityA.trim() || !colCityB.trim()}
                className="w-full py-3 bg-accent-purple hover:bg-accent-light text-white rounded-lg font-medium transition-smooth disabled:opacity-50"
              >
                {colLoading ? "Fetching data..." : "Compare Cities"}
              </button>

              {colError && (
                <p className="text-red-400 text-sm text-center">{colError}. Try a major city name like "New York" or "London".</p>
              )}
            </Card>

            {colResult && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {([colResult.cityA, colResult.cityB] as (CityData | null)[]).map((city, i) => (
                    <Card
                      key={i}
                      className={city?.studentMonthly === Math.min(colResult.cityA?.studentMonthly ?? Infinity, colResult.cityB?.studentMonthly ?? Infinity) ? "border-green-500/40 bg-green-500/5" : ""}
                    >
                      {!city ? (
                        <p className="text-gray-400 text-sm">No data found for Location {i === 0 ? "A" : "B"}. Try a different city name.</p>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-5">
                            <div>
                              <h3 className="font-bold text-lg capitalize">{city.city}</h3>
                              {city.scraped && (
                                <span className="text-xs text-blue-400">● Live from Numbeo</span>
                              )}
                            </div>
                            {city.studentMonthly === Math.min(colResult.cityA?.studentMonthly ?? Infinity, colResult.cityB?.studentMonthly ?? Infinity) && (
                              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-medium">More affordable</span>
                            )}
                          </div>

                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">Housing</p>
                          <div className="space-y-2 text-sm mb-4">
                            <div className="flex justify-between">
                              <span className="text-gray-400">🏠 1BR (own place)</span>
                              <span className="font-semibold">${city.rent1br.toLocaleString()}/mo</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">🛏️ Room (3BR split)</span>
                              <span className="font-semibold text-green-400">${city.roommateRent.toLocaleString()}/mo</span>
                            </div>
                          </div>

                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">Daily Life</p>
                          <div className="space-y-2 text-sm mb-4">
                            <div className="flex justify-between">
                              <span className="text-gray-400">🚌 Monthly Transit</span>
                              <span className="font-semibold">{city.monthlyTransit > 0 ? `$${city.monthlyTransit}` : "–"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">🍽️ Cheap meal out</span>
                              <span className="font-semibold">${city.mealCheap}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">🛒 Groceries est.</span>
                              <span className="font-semibold">${city.groceriesEstimate.toLocaleString()}/mo</span>
                            </div>
                            {city.utilities > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">💡 Utilities</span>
                                <span className="font-semibold">${city.utilities}/mo</span>
                              </div>
                            )}
                            {city.internet > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">📶 Internet</span>
                                <span className="font-semibold">${city.internet}/mo</span>
                              </div>
                            )}
                            {city.coffeePrice > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">☕ Coffee</span>
                                <span className="font-semibold">${city.coffeePrice}</span>
                              </div>
                            )}
                            {city.gymPrice > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">🏋️ Gym</span>
                                <span className="font-semibold">${city.gymPrice}/mo</span>
                              </div>
                            )}
                          </div>

                          <div className="border-t border-dark-border/50 pt-3 space-y-2">
                            <div className="flex justify-between font-semibold">
                              <span className="text-gray-300">Solo student est.</span>
                              <span className="text-accent-light">${city.studentMonthly.toLocaleString()}/mo</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                              <span className="text-gray-300">With roommates est.</span>
                              <span className="text-green-400">${city.studentRoommateMonthly.toLocaleString()}/mo</span>
                            </div>
                          </div>

                          <p className="mt-3 text-xs text-gray-600">Data: Numbeo 2024–2025 averages</p>
                        </>
                      )}
                    </Card>
                  ))}
                </div>

                {colResult.cityA && colResult.cityB && (() => {
                  const a = colResult.cityA!;
                  const b = colResult.cityB!;
                  const cheaper = a.studentMonthly <= b.studentMonthly ? a : b;
                  const pricier = a.studentMonthly <= b.studentMonthly ? b : a;
                  const diff = pricier.studentMonthly - cheaper.studentMonthly;
                  return (
                    <Card className="bg-accent-purple/10 border-accent-purple/30">
                      <h4 className="font-semibold text-accent-light mb-3">📊 Student Insight</h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <p>
                          Living solo in <strong className="text-white capitalize">{cheaper.city}</strong> saves you{" "}
                          <strong className="text-green-400">${diff.toLocaleString()}/month</strong> vs{" "}
                          <strong className="text-white capitalize">{pricier.city}</strong> — that's{" "}
                          <strong className="text-green-400">${(diff * 12).toLocaleString()}/year</strong> more you could put toward tuition or savings.
                        </p>
                        <p>
                          With roommates, you'd spend roughly{" "}
                          <strong className="text-white">${a.studentRoommateMonthly.toLocaleString()}/mo</strong> in {a.city} vs{" "}
                          <strong className="text-white">${b.studentRoommateMonthly.toLocaleString()}/mo</strong> in {b.city}.
                        </p>
                        {Math.abs(a.mealCheap - b.mealCheap) > 3 && (
                          <p>
                            Even eating out is{" "}
                            <strong className="text-white">${Math.abs(a.mealCheap - b.mealCheap).toFixed(0)} cheaper</strong> per meal in{" "}
                            <strong className="text-white capitalize">{a.mealCheap < b.mealCheap ? a.city : b.city}</strong>.
                          </p>
                        )}
                      </div>
                    </Card>
                  );
                })()}
              </div>
            )}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="w-full pb-12">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div>
            <SectionHeader
              title="Financial Tools"
              subtitle="Specialized calculators and estimators"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              onClick={() => setView("fafsa")}
              className="cursor-pointer hover:border-accent-purple"
            >
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold mb-2">FAFSA Estimator</h3>
              <p className="text-gray-400 text-sm mb-4">
                Estimate your expected family contribution and financial aid
              </p>
              <div className="text-accent-light text-sm font-medium">
                Calculate now →
              </div>
            </Card>

            <Card
              onClick={() => setView("tax")}
              className="cursor-pointer hover:border-accent-purple"
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Tax Calculator</h3>
              <p className="text-gray-400 text-sm mb-4">
                Estimate your federal and California state taxes
              </p>
              <div className="text-accent-light text-sm font-medium">
                Calculate now →
              </div>
            </Card>

            <Card
              onClick={() => setView("col")}
              className="cursor-pointer hover:border-accent-purple"
            >
              <div className="text-4xl mb-4">🏘️</div>
              <h3 className="text-xl font-semibold mb-2">Cost of Living</h3>
              <p className="text-gray-400 text-sm mb-4">
                Compare living costs between different locations
              </p>
              <div className="text-accent-light text-sm font-medium">
                Compare now →
              </div>
            </Card>

            <Card className="cursor-pointer hover:border-accent-purple">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">Budget Templates</h3>
              <p className="text-gray-400 text-sm mb-4">
                Get started with pre-made budget templates
              </p>
              <div className="text-accent-light text-sm font-medium">
                Browse templates →
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
