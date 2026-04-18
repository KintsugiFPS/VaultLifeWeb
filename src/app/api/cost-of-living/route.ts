import { NextRequest, NextResponse } from "next/server";
import { findCity, CityEntry } from "@/data/cityData";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
};

function cityToSlug(city: string) {
  return city.trim().replace(/\s*,.*$/, "").trim().replace(/\s+/g, "-");
}

function extractPrice(html: string, ...labels: string[]): number {
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Numbeo HTML: <td>Label </td> <td ... class="priceValue ..."><span class="first_currency">1,234.56&nbsp;&#36;</span>
    const re = new RegExp(
      `${escaped}\\s*<\\/td>\\s*<td[^>]*class="priceValue[^"]*"[^>]*>\\s*<span[^>]*>([\\d,]+\\.?\\d*)`,
      "i"
    );
    const m = html.match(re);
    if (m) return parseFloat(m[1].replace(/,/g, ""));
  }
  return 0;
}

// Try to find an <h1> or <title> to confirm the city was found
function extractCityName(html: string, fallback: string): string {
  const m = html.match(/<h1[^>]*>Cost of Living in ([^<]+)<\/h1>/i)
    ?? html.match(/Cost of Living in ([A-Za-z\s,]+) - Numbeo/i);
  return m ? m[1].trim() : fallback;
}

async function scrapeNumbeo(city: string): Promise<Omit<CityEntry, "country"> & { country: string; scraped: true } | null> {
  const slug = cityToSlug(city);
  const url = `https://www.numbeo.com/cost-of-living/in/${slug}`;

  let html: string;
  try {
    const res = await fetch(url, { headers: BROWSER_HEADERS });
    if (!res.ok) return null;
    html = await res.text();
  } catch {
    return null;
  }

  if (!html.includes("Cost of Living") || html.includes("not found")) return null;

  // Exact Numbeo label names (verified from live HTML)
  const rent1br   = extractPrice(html, "1 Bedroom Apartment in City Centre");
  const rent3br   = extractPrice(html, "3 Bedroom Apartment in City Centre");
  const transit   = extractPrice(html, "Monthly Public Transport Pass (Regular Price)");
  const meal      = extractPrice(html, "Meal at an Inexpensive Restaurant");
  const utilities = extractPrice(html, "Basic Utilities for 915 Square Feet Apartment (Electricity, Heating, Cooling, Water, Garbage)");
  const internet  = extractPrice(html, "Broadband Internet (Unlimited Data, 60 Mbps or Higher)");
  const coffee    = extractPrice(html, "Cappuccino (Regular Size)");
  const gym       = extractPrice(html, "Monthly Fitness Club Membership");

  // Grocery basket estimate
  const milk    = extractPrice(html, "Milk (Regular, 1 Liter)");
  const bread   = extractPrice(html, "Fresh White Bread (1 lb Loaf)");
  const beef    = extractPrice(html, "Beef Round or Equivalent Back Leg Red Meat (1 lb)");
  const bananas = extractPrice(html, "Bananas (1 lb)");
  const tomatoes = extractPrice(html, "Tomatoes (1 lb)");
  const potatoes = extractPrice(html, "Potatoes (1 lb)");
  // Build a realistic monthly basket: ~30 items
  const groceries = Math.round(
    (milk * 8 + bread * 6 + beef * 4 + bananas * 4 + tomatoes * 4 + potatoes * 4) * 1.5
  ) || 0;

  if (rent1br === 0 && meal === 0) return null;

  const confirmedCity = extractCityName(html, city);
  const roommateRent  = rent3br > 0 ? Math.round(rent3br / 3) : Math.round(rent1br * 0.6);

  return {
    city: confirmedCity,
    country: "?",
    rent1br: Math.round(rent1br),
    roommateRent,
    monthlyTransit: Math.round(transit),
    mealCheap: Math.round(meal),
    groceriesEstimate: groceries,
    utilities: Math.round(utilities),
    internet: Math.round(internet),
    coffeePrice: Math.round(coffee * 10) / 10,
    gymPrice: Math.round(gym),
    scraped: true,
  };
}

function computeTotals(d: CityEntry | (Omit<CityEntry, "country"> & { country: string; scraped: true })) {
  const studentMonthly = d.rent1br + d.monthlyTransit + d.utilities + d.internet + d.groceriesEstimate + d.mealCheap * 15;
  const studentRoommateMonthly = d.roommateRent + d.monthlyTransit + Math.round(d.utilities / 3) + Math.round(d.internet / 3) + d.groceriesEstimate + d.mealCheap * 15;
  return {
    ...d,
    studentMonthly: Math.round(studentMonthly),
    studentRoommateMonthly: Math.round(studentRoommateMonthly),
  };
}

async function resolveCity(name: string) {
  const cached = findCity(name);
  if (cached) return computeTotals(cached);
  const scraped = await scrapeNumbeo(name);
  if (scraped) return computeTotals(scraped);
  return null;
}

export async function GET(req: NextRequest) {
  const cityA = req.nextUrl.searchParams.get("cityA") ?? "";
  const cityB = req.nextUrl.searchParams.get("cityB") ?? "";

  if (!cityA.trim() || !cityB.trim()) {
    return NextResponse.json({ error: "Both cityA and cityB are required" }, { status: 400 });
  }

  const [dataA, dataB] = await Promise.all([resolveCity(cityA), resolveCity(cityB)]);

  if (!dataA && !dataB) {
    return NextResponse.json(
      { error: `Could not find data for "${cityA}" or "${cityB}". Check the spelling or try a nearby major city.` },
      { status: 404 }
    );
  }

  return NextResponse.json({ cityA: dataA, cityB: dataB });
}
