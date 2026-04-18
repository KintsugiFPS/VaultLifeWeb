import { Category, ProcessedTransaction, Transaction } from './types';

const MERCHANT_ALIASES: Record<string, string> = {
  'walmart supercenter': 'Walmart',
  'walmart.com': 'Walmart',
  'wal-mart': 'Walmart',
  'amzn mktp': 'Amazon',
  'amzn mktpl': 'Amazon',
  'amazon.com': 'Amazon',
  'amazon prime': 'Amazon',
  'tst* starbucks': 'Starbucks',
  'sbux': 'Starbucks',
  'starbucks store': 'Starbucks',
  'mcdonalds #': "McDonald's",
  'mcd ': "McDonald's",
  "mcdonald's": "McDonald's",
  'chick-fil-a': 'Chick-fil-A',
  'chipotle ': 'Chipotle',
  'trader joe': 'Trader Joes',
  'whole foods': 'Whole Foods',
  'safeway store': 'Safeway',
  'cvs/pharmacy': 'CVS',
  'walgreens #': 'Walgreens',
  'target t-': 'Target',
  'target.com': 'Target',
  'costco whse': 'Costco',
  'costco gas': 'Costco',
  'shell oil': 'Shell',
  'chevron #': 'Chevron',
  '76 - ': '76',
  'uber *trip': 'Uber',
  'uber trip': 'Uber',
  'uber eats': 'Uber Eats',
  'lyft *ride': 'Lyft',
  'lyft ride': 'Lyft',
  'doordash*': 'DoorDash',
  'netflix.com': 'Netflix',
  'spotify usa': 'Spotify',
  'apple.com/bill': 'Apple',
  'hulu *': 'Hulu',
  'disney plus': 'Disney+',
  'google *youtube': 'YouTube',
  'pg&e': 'PG&E',
  'comcast cable': 'Comcast',
  'xfinity mobile': 'Xfinity',
  'at&t ': 'AT&T',
  'verizon wrl': 'Verizon',
  't-mobile': 'T-Mobile',
  'venmo *': 'Venmo',
};

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  Food: [
    'starbucks', 'mcdonald', 'chipotle', 'chick-fil-a', 'doordash',
    'uber eats', 'pizza', 'grubhub', 'trader joe', 'whole foods',
    'safeway', 'kroger', 'coffee', 'cafe', 'restaurant', 'grill',
    'taco', 'burger', 'subway', 'panera',
  ],
  Transport: [
    'uber', 'lyft', 'shell', 'chevron', 'exxon', '76', 'gas',
    'bart', 'muni', 'amtrak', 'parking', 'caltrain', 'metro', 'dmv',
  ],
  Rent: ['rent', 'apartment', 'landlord', 'lease', 'property mgmt', 'zillow rent'],
  Shopping: [
    'amazon', 'walmart', 'target', 'costco', 'best buy', 'macys',
    'nike', 'adidas', 'ebay', 'etsy', 'apparel',
  ],
  Utilities: [
    'pg&e', 'comcast', 'xfinity', 'at&t', 'verizon', 't-mobile',
    'water', 'electric', 'internet', 'utility',
  ],
  Subscriptions: [
    'netflix', 'spotify', 'hulu', 'disney+', 'youtube', 'apple.com/bill',
    'icloud', 'adobe', 'github', 'chatgpt', 'openai', 'notion', 'gym',
    'planet fitness',
  ],
  Education: [
    'tuition', 'university', 'college', 'coursera', 'udemy', 'textbook',
    'bookstore', 'school', 'student', 'edu ',
  ],
  Other: [],
};

export function normalizeMerchant(raw: string): string {
  const lower = raw.toLowerCase().trim();
  for (const [alias, canonical] of Object.entries(MERCHANT_ALIASES)) {
    if (lower.includes(alias)) return canonical;
  }
  const cleaned = raw
    .replace(/^(sq \*|tst\* |pos\s+)/i, '')
    .replace(/\s+#\d+.*$/i, '')
    .replace(/\s+\d{5,}.*$/i, '')
    .trim();
  return cleaned
    .split(/\s+/)
    .map((w) => (w.length > 2 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w.toUpperCase()))
    .join(' ');
}

export function inferCategory(merchantRaw: string, providedCategory?: Category): Category {
  if (providedCategory) return providedCategory;
  const hay = merchantRaw.toLowerCase();
  for (const category of Object.keys(CATEGORY_KEYWORDS) as Category[]) {
    const keywords = CATEGORY_KEYWORDS[category];
    for (const kw of keywords) {
      if (hay.includes(kw)) return category;
    }
  }
  return 'Other';
}

export function processTransactions(transactions: Transaction[]): ProcessedTransaction[] {
  if (transactions.length === 0) return [];

  const enriched = transactions.map<ProcessedTransaction>((t) => ({
    ...t,
    normalized_merchant: normalizeMerchant(t.merchant),
    category: inferCategory(t.merchant, t.category),
    is_anomaly: false,
  }));

  const amounts = enriched.map((t) => t.amount);
  const overallMean = amounts.reduce((a, b) => a + b, 0) / (amounts.length || 1);

  const byCatSum: Record<string, { sum: number; count: number }> = {};
  for (const t of enriched) {
    byCatSum[t.category] ||= { sum: 0, count: 0 };
    byCatSum[t.category].sum += t.amount;
    byCatSum[t.category].count += 1;
  }
  const catMeans: Record<string, number> = {};
  for (const [cat, { sum, count }] of Object.entries(byCatSum)) {
    catMeans[cat] = sum / (count || 1);
  }

  for (const t of enriched) {
    const catMean = catMeans[t.category] ?? overallMean;
    if (t.amount > 3 * catMean || t.amount > 3 * overallMean) {
      t.is_anomaly = true;
    }
  }

  return enriched;
}
