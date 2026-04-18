export interface CityEntry {
  city: string;
  country: string;
  rent1br: number;       // 1BR city center $/mo
  roommateRent: number;  // 3BR split $/mo
  monthlyTransit: number;
  mealCheap: number;
  groceriesEstimate: number; // /mo
  utilities: number;
  internet: number;
  coffeePrice: number;
  gymPrice: number;
}

// Data sourced from Numbeo averages (2024-2025)
export const CITY_DATA: CityEntry[] = [
  // USA
  { city: "New York",        country: "US", rent1br: 3800, roommateRent: 1800, monthlyTransit: 132, mealCheap: 25,  groceriesEstimate: 420, utilities: 175, internet: 70,  coffeePrice: 6,  gymPrice: 100 },
  { city: "San Francisco",   country: "US", rent1br: 3400, roommateRent: 1600, monthlyTransit: 105, mealCheap: 22,  groceriesEstimate: 400, utilities: 160, internet: 65,  coffeePrice: 6,  gymPrice: 90  },
  { city: "Los Angeles",     country: "US", rent1br: 2800, roommateRent: 1300, monthlyTransit: 100, mealCheap: 18,  groceriesEstimate: 350, utilities: 145, internet: 65,  coffeePrice: 6,  gymPrice: 80  },
  { city: "Chicago",         country: "US", rent1br: 2400, roommateRent: 1100, monthlyTransit: 105, mealCheap: 18,  groceriesEstimate: 330, utilities: 155, internet: 60,  coffeePrice: 5,  gymPrice: 75  },
  { city: "Austin",          country: "US", rent1br: 2050, roommateRent: 960,  monthlyTransit: 41,  mealCheap: 20,  groceriesEstimate: 300, utilities: 175, internet: 60,  coffeePrice: 5,  gymPrice: 50  },
  { city: "Seattle",         country: "US", rent1br: 2500, roommateRent: 1200, monthlyTransit: 99,  mealCheap: 20,  groceriesEstimate: 360, utilities: 130, internet: 65,  coffeePrice: 5,  gymPrice: 80  },
  { city: "Boston",          country: "US", rent1br: 3200, roommateRent: 1500, monthlyTransit: 90,  mealCheap: 22,  groceriesEstimate: 380, utilities: 165, internet: 70,  coffeePrice: 5,  gymPrice: 85  },
  { city: "Miami",           country: "US", rent1br: 2800, roommateRent: 1300, monthlyTransit: 113, mealCheap: 18,  groceriesEstimate: 320, utilities: 160, internet: 65,  coffeePrice: 5,  gymPrice: 60  },
  { city: "Denver",          country: "US", rent1br: 2100, roommateRent: 1000, monthlyTransit: 114, mealCheap: 18,  groceriesEstimate: 310, utilities: 120, internet: 60,  coffeePrice: 5,  gymPrice: 55  },
  { city: "Atlanta",         country: "US", rent1br: 2000, roommateRent: 950,  monthlyTransit: 95,  mealCheap: 16,  groceriesEstimate: 290, utilities: 145, internet: 60,  coffeePrice: 5,  gymPrice: 50  },
  { city: "Houston",         country: "US", rent1br: 1800, roommateRent: 850,  monthlyTransit: 70,  mealCheap: 16,  groceriesEstimate: 280, utilities: 165, internet: 60,  coffeePrice: 4,  gymPrice: 45  },
  { city: "Dallas",          country: "US", rent1br: 1900, roommateRent: 900,  monthlyTransit: 96,  mealCheap: 16,  groceriesEstimate: 290, utilities: 160, internet: 60,  coffeePrice: 4,  gymPrice: 45  },
  { city: "Phoenix",         country: "US", rent1br: 1700, roommateRent: 800,  monthlyTransit: 64,  mealCheap: 15,  groceriesEstimate: 270, utilities: 155, internet: 55,  coffeePrice: 4,  gymPrice: 40  },
  { city: "Nashville",       country: "US", rent1br: 2200, roommateRent: 1050, monthlyTransit: 70,  mealCheap: 17,  groceriesEstimate: 300, utilities: 145, internet: 60,  coffeePrice: 5,  gymPrice: 50  },
  { city: "Portland",        country: "US", rent1br: 2100, roommateRent: 1000, monthlyTransit: 100, mealCheap: 18,  groceriesEstimate: 330, utilities: 100, internet: 60,  coffeePrice: 5,  gymPrice: 55  },
  { city: "Washington DC",   country: "US", rent1br: 2900, roommateRent: 1400, monthlyTransit: 100, mealCheap: 20,  groceriesEstimate: 360, utilities: 155, internet: 65,  coffeePrice: 5,  gymPrice: 80  },
  { city: "Philadelphia",    country: "US", rent1br: 2200, roommateRent: 1050, monthlyTransit: 96,  mealCheap: 18,  groceriesEstimate: 320, utilities: 145, internet: 65,  coffeePrice: 5,  gymPrice: 55  },
  { city: "San Diego",       country: "US", rent1br: 2800, roommateRent: 1300, monthlyTransit: 72,  mealCheap: 18,  groceriesEstimate: 340, utilities: 130, internet: 65,  coffeePrice: 5,  gymPrice: 70  },
  { city: "Minneapolis",     country: "US", rent1br: 1900, roommateRent: 900,  monthlyTransit: 113, mealCheap: 16,  groceriesEstimate: 300, utilities: 140, internet: 60,  coffeePrice: 5,  gymPrice: 50  },
  { city: "Columbus",        country: "US", rent1br: 1400, roommateRent: 650,  monthlyTransit: 62,  mealCheap: 14,  groceriesEstimate: 260, utilities: 130, internet: 55,  coffeePrice: 4,  gymPrice: 35  },
  { city: "Pittsburgh",      country: "US", rent1br: 1500, roommateRent: 700,  monthlyTransit: 100, mealCheap: 14,  groceriesEstimate: 260, utilities: 130, internet: 55,  coffeePrice: 4,  gymPrice: 35  },
  { city: "Detroit",         country: "US", rent1br: 1400, roommateRent: 650,  monthlyTransit: 70,  mealCheap: 14,  groceriesEstimate: 260, utilities: 145, internet: 55,  coffeePrice: 4,  gymPrice: 35  },
  { city: "Charlotte",       country: "US", rent1br: 1900, roommateRent: 900,  monthlyTransit: 88,  mealCheap: 15,  groceriesEstimate: 280, utilities: 140, internet: 60,  coffeePrice: 4,  gymPrice: 45  },
  { city: "San Antonio",     country: "US", rent1br: 1500, roommateRent: 700,  monthlyTransit: 38,  mealCheap: 14,  groceriesEstimate: 260, utilities: 150, internet: 55,  coffeePrice: 4,  gymPrice: 35  },
  { city: "Las Vegas",       country: "US", rent1br: 1800, roommateRent: 850,  monthlyTransit: 65,  mealCheap: 16,  groceriesEstimate: 280, utilities: 150, internet: 60,  coffeePrice: 5,  gymPrice: 45  },
  { city: "Baltimore",       country: "US", rent1br: 2000, roommateRent: 950,  monthlyTransit: 74,  mealCheap: 17,  groceriesEstimate: 310, utilities: 145, internet: 65,  coffeePrice: 5,  gymPrice: 55  },
  // Canada
  { city: "Toronto",         country: "CA", rent1br: 2400, roommateRent: 1100, monthlyTransit: 156, mealCheap: 20,  groceriesEstimate: 350, utilities: 130, internet: 70,  coffeePrice: 5,  gymPrice: 60  },
  { city: "Vancouver",       country: "CA", rent1br: 2700, roommateRent: 1300, monthlyTransit: 110, mealCheap: 20,  groceriesEstimate: 360, utilities: 80,  internet: 75,  coffeePrice: 5,  gymPrice: 65  },
  { city: "Montreal",        country: "CA", rent1br: 1600, roommateRent: 750,  monthlyTransit: 97,  mealCheap: 16,  groceriesEstimate: 290, utilities: 95,  internet: 65,  coffeePrice: 4,  gymPrice: 50  },
  { city: "Calgary",         country: "CA", rent1br: 2000, roommateRent: 950,  monthlyTransit: 115, mealCheap: 18,  groceriesEstimate: 320, utilities: 140, internet: 70,  coffeePrice: 5,  gymPrice: 55  },
  { city: "Ottawa",          country: "CA", rent1br: 2100, roommateRent: 1000, monthlyTransit: 125, mealCheap: 18,  groceriesEstimate: 310, utilities: 130, internet: 70,  coffeePrice: 5,  gymPrice: 55  },
  // UK
  { city: "London",          country: "UK", rent1br: 2800, roommateRent: 1300, monthlyTransit: 185, mealCheap: 18,  groceriesEstimate: 380, utilities: 210, internet: 45,  coffeePrice: 5,  gymPrice: 60  },
  { city: "Manchester",      country: "UK", rent1br: 1600, roommateRent: 750,  monthlyTransit: 100, mealCheap: 14,  groceriesEstimate: 300, utilities: 180, internet: 40,  coffeePrice: 4,  gymPrice: 40  },
  { city: "Edinburgh",       country: "UK", rent1br: 1800, roommateRent: 850,  monthlyTransit: 75,  mealCheap: 15,  groceriesEstimate: 310, utilities: 185, internet: 40,  coffeePrice: 4,  gymPrice: 45  },
  { city: "Birmingham",      country: "UK", rent1br: 1400, roommateRent: 650,  monthlyTransit: 90,  mealCheap: 13,  groceriesEstimate: 280, utilities: 175, internet: 38,  coffeePrice: 4,  gymPrice: 35  },
  { city: "Bristol",         country: "UK", rent1br: 1700, roommateRent: 800,  monthlyTransit: 80,  mealCheap: 14,  groceriesEstimate: 290, utilities: 180, internet: 38,  coffeePrice: 4,  gymPrice: 40  },
  // Europe
  { city: "Berlin",          country: "DE", rent1br: 1600, roommateRent: 750,  monthlyTransit: 90,  mealCheap: 12,  groceriesEstimate: 300, utilities: 240, internet: 35,  coffeePrice: 3,  gymPrice: 30  },
  { city: "Munich",          country: "DE", rent1br: 2100, roommateRent: 1000, monthlyTransit: 110, mealCheap: 15,  groceriesEstimate: 330, utilities: 230, internet: 40,  coffeePrice: 4,  gymPrice: 40  },
  { city: "Paris",           country: "FR", rent1br: 1900, roommateRent: 900,  monthlyTransit: 90,  mealCheap: 16,  groceriesEstimate: 340, utilities: 175, internet: 30,  coffeePrice: 4,  gymPrice: 40  },
  { city: "Amsterdam",       country: "NL", rent1br: 2200, roommateRent: 1050, monthlyTransit: 100, mealCheap: 16,  groceriesEstimate: 320, utilities: 180, internet: 45,  coffeePrice: 4,  gymPrice: 40  },
  { city: "Barcelona",       country: "ES", rent1br: 1500, roommateRent: 700,  monthlyTransit: 55,  mealCheap: 13,  groceriesEstimate: 280, utilities: 130, internet: 30,  coffeePrice: 2,  gymPrice: 35  },
  { city: "Madrid",          country: "ES", rent1br: 1600, roommateRent: 750,  monthlyTransit: 55,  mealCheap: 12,  groceriesEstimate: 270, utilities: 130, internet: 30,  coffeePrice: 2,  gymPrice: 35  },
  { city: "Rome",            country: "IT", rent1br: 1400, roommateRent: 650,  monthlyTransit: 50,  mealCheap: 12,  groceriesEstimate: 280, utilities: 175, internet: 28,  coffeePrice: 2,  gymPrice: 35  },
  { city: "Lisbon",          country: "PT", rent1br: 1600, roommateRent: 750,  monthlyTransit: 45,  mealCheap: 11,  groceriesEstimate: 260, utilities: 110, internet: 25,  coffeePrice: 2,  gymPrice: 30  },
  { city: "Vienna",          country: "AT", rent1br: 1600, roommateRent: 750,  monthlyTransit: 55,  mealCheap: 13,  groceriesEstimate: 290, utilities: 200, internet: 35,  coffeePrice: 4,  gymPrice: 35  },
  { city: "Prague",          country: "CZ", rent1br: 1100, roommateRent: 500,  monthlyTransit: 25,  mealCheap: 9,   groceriesEstimate: 230, utilities: 160, internet: 18,  coffeePrice: 3,  gymPrice: 25  },
  { city: "Warsaw",          country: "PL", rent1br: 1100, roommateRent: 500,  monthlyTransit: 25,  mealCheap: 8,   groceriesEstimate: 210, utilities: 160, internet: 15,  coffeePrice: 3,  gymPrice: 25  },
  { city: "Stockholm",       country: "SE", rent1br: 1800, roommateRent: 850,  monthlyTransit: 115, mealCheap: 18,  groceriesEstimate: 340, utilities: 90,  internet: 30,  coffeePrice: 5,  gymPrice: 45  },
  { city: "Copenhagen",      country: "DK", rent1br: 2000, roommateRent: 950,  monthlyTransit: 110, mealCheap: 20,  groceriesEstimate: 350, utilities: 165, internet: 35,  coffeePrice: 6,  gymPrice: 50  },
  { city: "Dublin",          country: "IE", rent1br: 2600, roommateRent: 1200, monthlyTransit: 135, mealCheap: 17,  groceriesEstimate: 350, utilities: 165, internet: 45,  coffeePrice: 5,  gymPrice: 60  },
  { city: "Zurich",          country: "CH", rent1br: 2900, roommateRent: 1400, monthlyTransit: 90,  mealCheap: 25,  groceriesEstimate: 450, utilities: 200, internet: 55,  coffeePrice: 6,  gymPrice: 80  },
  // Asia-Pacific
  { city: "Tokyo",           country: "JP", rent1br: 1400, roommateRent: 650,  monthlyTransit: 90,  mealCheap: 10,  groceriesEstimate: 280, utilities: 100, internet: 30,  coffeePrice: 4,  gymPrice: 40  },
  { city: "Singapore",       country: "SG", rent1br: 2800, roommateRent: 1300, monthlyTransit: 95,  mealCheap: 8,   groceriesEstimate: 340, utilities: 150, internet: 40,  coffeePrice: 5,  gymPrice: 70  },
  { city: "Sydney",          country: "AU", rent1br: 2600, roommateRent: 1200, monthlyTransit: 160, mealCheap: 20,  groceriesEstimate: 370, utilities: 170, internet: 60,  coffeePrice: 5,  gymPrice: 65  },
  { city: "Melbourne",       country: "AU", rent1br: 2300, roommateRent: 1100, monthlyTransit: 145, mealCheap: 18,  groceriesEstimate: 350, utilities: 155, internet: 55,  coffeePrice: 5,  gymPrice: 60  },
  { city: "Hong Kong",       country: "HK", rent1br: 3000, roommateRent: 1400, monthlyTransit: 60,  mealCheap: 8,   groceriesEstimate: 380, utilities: 180, internet: 30,  coffeePrice: 5,  gymPrice: 70  },
  { city: "Seoul",           country: "KR", rent1br: 1500, roommateRent: 700,  monthlyTransit: 40,  mealCheap: 8,   groceriesEstimate: 300, utilities: 130, internet: 20,  coffeePrice: 4,  gymPrice: 35  },
  { city: "Bangkok",         country: "TH", rent1br: 800,  roommateRent: 380,  monthlyTransit: 35,  mealCheap: 4,   groceriesEstimate: 200, utilities: 80,  internet: 20,  coffeePrice: 2,  gymPrice: 25  },
  { city: "Mumbai",          country: "IN", rent1br: 900,  roommateRent: 420,  monthlyTransit: 15,  mealCheap: 4,   groceriesEstimate: 180, utilities: 55,  internet: 10,  coffeePrice: 2,  gymPrice: 25  },
  { city: "Bangalore",       country: "IN", rent1br: 800,  roommateRent: 380,  monthlyTransit: 20,  mealCheap: 4,   groceriesEstimate: 170, utilities: 50,  internet: 12,  coffeePrice: 2,  gymPrice: 25  },
];

const ALIASES: Record<string, string> = {
  "nyc": "New York",
  "new york city": "New York",
  "sf": "San Francisco",
  "san fran": "San Francisco",
  "la": "Los Angeles",
  "dc": "Washington DC",
  "washington": "Washington DC",
  "philly": "Philadelphia",
  "pdx": "Portland",
};

export function findCity(query: string): CityEntry | null {
  const q = query.trim().toLowerCase();
  const resolved = ALIASES[q] ?? query;
  const rq = resolved.trim().toLowerCase();

  // Exact match first
  const exact = CITY_DATA.find((c) => c.city.toLowerCase() === rq);
  if (exact) return exact;

  // Starts-with match
  const starts = CITY_DATA.find((c) => c.city.toLowerCase().startsWith(rq) || rq.startsWith(c.city.toLowerCase()));
  if (starts) return starts;

  // Contains match
  const contains = CITY_DATA.find(
    (c) => c.city.toLowerCase().includes(rq) || rq.includes(c.city.toLowerCase())
  );
  return contains ?? null;
}
