import type { CountryCode, DealType } from "./markets";

/**
 * Data access boundary for live marketplace feeds.
 * Today: curated sample offers for broker workflow demos.
 * Tomorrow: swap `searchOffers` to call AutoScout24 / Mobile.de / Autobiz /
 * Arval / DiscoverCars (or a aggregator like Autobiz / carVertical B2B).
 */
export interface Offer {
  id: string;
  title: string;
  brand: string;
  model: string;
  dealType: DealType;
  country: CountryCode;
  city: string;
  year: number;
  km: number;
  fuel: string;
  transmission: string;
  price: number;
  priceUnit: "once" | "month" | "day";
  currency: "EUR" | "PLN" | "SEK";
  dealer: string;
  source: string;
  sourceUrl: string;
  highlights: string[];
  score: number;
}

export const SAMPLE_OFFERS: Offer[] = [
  {
    id: "de-golf-1",
    title: "Volkswagen Golf 1.5 TSI Life",
    brand: "Volkswagen",
    model: "Golf",
    dealType: "acquisto",
    country: "DE",
    city: "Monaco di Baviera",
    year: 2022,
    km: 38400,
    fuel: "Benzina",
    transmission: "Manuale",
    price: 21490,
    priceUnit: "once",
    currency: "EUR",
    dealer: "Autohaus Süd GmbH",
    source: "Mobile.de",
    sourceUrl: "https://suchen.mobile.de/",
    highlights: ["Unico proprietario", "Tagliandi VW", "IVA esposta"],
    score: 92,
  },
  {
    id: "it-golf-2",
    title: "Volkswagen Golf 1.5 TSI Life",
    brand: "Volkswagen",
    model: "Golf",
    dealType: "acquisto",
    country: "IT",
    city: "Brescia",
    year: 2022,
    km: 41200,
    fuel: "Benzina",
    transmission: "Manuale",
    price: 23900,
    priceUnit: "once",
    currency: "EUR",
    dealer: "Auto Lombarda SpA",
    source: "AutoScout24",
    sourceUrl: "https://www.autoscout24.it/",
    highlights: ["Garanzia 12 mesi", "Pronto passaggio"],
    score: 78,
  },
  {
    id: "es-cupra-1",
    title: "Cupra Formentor 1.5 TSI",
    brand: "Cupra",
    model: "Formentor",
    dealType: "acquisto",
    country: "ES",
    city: "Valencia",
    year: 2023,
    km: 22100,
    fuel: "Benzina",
    transmission: "DSG",
    price: 26990,
    priceUnit: "once",
    currency: "EUR",
    dealer: "Motor Levante",
    source: "Coches.net",
    sourceUrl: "https://www.coches.net/",
    highlights: ["Pack Winter", "Sensori 360"],
    score: 88,
  },
  {
    id: "fr-308-1",
    title: "Peugeot 308 PureTech 130",
    brand: "Peugeot",
    model: "308",
    dealType: "acquisto",
    country: "FR",
    city: "Lione",
    year: 2021,
    km: 55600,
    fuel: "Benzina",
    transmission: "Manuale",
    price: 17950,
    priceUnit: "once",
    currency: "EUR",
    dealer: "Garage Rhône",
    source: "Leboncoin",
    sourceUrl: "https://www.leboncoin.fr/",
    highlights: ["Prezzo sotto media FR", "Controllo tecnico OK"],
    score: 85,
  },
  {
    id: "nl-id3-1",
    title: "Volkswagen ID.3 Pro",
    brand: "Volkswagen",
    model: "ID.3",
    dealType: "acquisto",
    country: "NL",
    city: "Utrecht",
    year: 2023,
    km: 18900,
    fuel: "Elettrico",
    transmission: "Automatico",
    price: 27900,
    priceUnit: "once",
    currency: "EUR",
    dealer: "EV Hub NL",
    source: "AutoScout24",
    sourceUrl: "https://www.autoscout24.nl/",
    highlights: ["Batteria 58 kWh", "Incentivi locali verificabili"],
    score: 90,
  },
  {
    id: "pl-octavia-1",
    title: "Skoda Octavia 2.0 TDI Style",
    brand: "Skoda",
    model: "Octavia",
    dealType: "acquisto",
    country: "PL",
    city: "Cracovia",
    year: 2022,
    km: 61000,
    fuel: "Diesel",
    transmission: "DSG",
    price: 89000,
    priceUnit: "once",
    currency: "PLN",
    dealer: "Auto Galeria Kraków",
    source: "Otomoto",
    sourceUrl: "https://www.otomoto.pl/",
    highlights: ["Conversione ~€20.7k", "Storico chiaro"],
    score: 87,
  },
  {
    id: "at-a4-1",
    title: "Audi A4 Avant 40 TDI",
    brand: "Audi",
    model: "A4",
    dealType: "acquisto",
    country: "AT",
    city: "Salisburgo",
    year: 2021,
    km: 72000,
    fuel: "Diesel",
    transmission: "S tronic",
    price: 29800,
    priceUnit: "once",
    currency: "EUR",
    dealer: "Audi Zentrum Salzburg",
    source: "AutoScout24",
    sourceUrl: "https://www.autoscout24.at/",
    highlights: ["Virtual cockpit", "Traino preparato"],
    score: 81,
  },
  {
    id: "be-troc-1",
    title: "Volkswagen T-Roc 1.5 TSI Style",
    brand: "Volkswagen",
    model: "T-Roc",
    dealType: "acquisto",
    country: "BE",
    city: "Anversa",
    year: 2022,
    km: 33500,
    fuel: "Benzina",
    transmission: "DSG",
    price: 25450,
    priceUnit: "once",
    currency: "EUR",
    dealer: "Port Cars BE",
    source: "AutoScout24",
    sourceUrl: "https://www.autoscout24.be/",
    highlights: ["Export-friendly", "IVA detraibile"],
    score: 84,
  },
  {
    id: "it-lease-ypsilon",
    title: "Lancia Ypsilon Hybrid",
    brand: "Lancia",
    model: "Ypsilon",
    dealType: "leasing",
    country: "IT",
    city: "Milano",
    year: 2025,
    km: 0,
    fuel: "Ibrido",
    transmission: "Manuale",
    price: 199,
    priceUnit: "month",
    currency: "EUR",
    dealer: "Leasys",
    source: "Leasys",
    sourceUrl: "https://www.leasys.com/",
    highlights: ["36 mesi / 10.000 km", "Anticipo €2.500"],
    score: 80,
  },
  {
    id: "de-lease-id4",
    title: "Volkswagen ID.4 Pro",
    brand: "Volkswagen",
    model: "ID.4",
    dealType: "leasing",
    country: "DE",
    city: "Francoforte",
    year: 2025,
    km: 0,
    fuel: "Elettrico",
    transmission: "Automatico",
    price: 389,
    priceUnit: "month",
    currency: "EUR",
    dealer: "Ayvens Deutschland",
    source: "Ayvens",
    sourceUrl: "https://www.ayvens.com/",
    highlights: ["48 mesi / 15.000 km", "Full service"],
    score: 89,
  },
  {
    id: "fr-lease-3008",
    title: "Peugeot 3008 Hybrid",
    brand: "Peugeot",
    model: "3008",
    dealType: "leasing",
    country: "FR",
    city: "Parigi",
    year: 2025,
    km: 0,
    fuel: "Ibrido",
    transmission: "Automatico",
    price: 429,
    priceUnit: "month",
    currency: "EUR",
    dealer: "Arval France",
    source: "Arval",
    sourceUrl: "https://www.arval.fr/",
    highlights: ["LOA 37 mesi", "Manutenzione inclusa"],
    score: 83,
  },
  {
    id: "nl-lease-model3",
    title: "Tesla Model 3 RWD",
    brand: "Tesla",
    model: "Model 3",
    dealType: "leasing",
    country: "NL",
    city: "Amsterdam",
    year: 2025,
    km: 0,
    fuel: "Elettrico",
    transmission: "Automatico",
    price: 499,
    priceUnit: "month",
    currency: "EUR",
    dealer: "Alphabet NL",
    source: "Alphabet",
    sourceUrl: "https://www.alphabet.com/",
    highlights: ["Private lease", "Assicurazione opzionale"],
    score: 86,
  },
  {
    id: "es-rent-ibiza",
    title: "Seat Ibiza 1.0 TSI",
    brand: "Seat",
    model: "Ibiza",
    dealType: "noleggio",
    country: "ES",
    city: "Barcellona",
    year: 2024,
    km: 12000,
    fuel: "Benzina",
    transmission: "Manuale",
    price: 28,
    priceUnit: "day",
    currency: "EUR",
    dealer: "DiscoverCars partner",
    source: "DiscoverCars",
    sourceUrl: "https://www.discovercars.com/",
    highlights: ["7 giorni min.", "Chilometraggio illimitato"],
    score: 82,
  },
  {
    id: "it-rent-500e",
    title: "Fiat 500e",
    brand: "Fiat",
    model: "500e",
    dealType: "noleggio",
    country: "IT",
    city: "Roma Fiumicino",
    year: 2024,
    km: 8000,
    fuel: "Elettrico",
    transmission: "Automatico",
    price: 39,
    priceUnit: "day",
    currency: "EUR",
    dealer: "Sixt Italia",
    source: "Sixt",
    sourceUrl: "https://www.sixt.it/",
    highlights: ["Aeroporto FCO", "Full-to-full"],
    score: 84,
  },
  {
    id: "de-rent-octavia",
    title: "Skoda Octavia Wagon",
    brand: "Skoda",
    model: "Octavia",
    dealType: "noleggio",
    country: "DE",
    city: "Berlino TXL area",
    year: 2024,
    km: 15000,
    fuel: "Diesel",
    transmission: "Automatico",
    price: 45,
    priceUnit: "day",
    currency: "EUR",
    dealer: "Sixt Deutschland",
    source: "Sixt",
    sourceUrl: "https://www.sixt.de/",
    highlights: ["Ideale trasferte", "GPS incluso"],
    score: 88,
  },
  {
    id: "pt-rent-corolla",
    title: "Toyota Corolla Hybrid",
    brand: "Toyota",
    model: "Corolla",
    dealType: "noleggio",
    country: "PT",
    city: "Lisbona",
    year: 2023,
    km: 22000,
    fuel: "Ibrido",
    transmission: "Automatico",
    price: 33,
    priceUnit: "day",
    currency: "EUR",
    dealer: "Local partner",
    source: "DiscoverCars",
    sourceUrl: "https://www.discovercars.com/",
    highlights: ["Basso consumo", "Assicurazione base"],
    score: 79,
  },
  {
    id: "se-acquisto-xc40",
    title: "Volvo XC40 B3",
    brand: "Volvo",
    model: "XC40",
    dealType: "acquisto",
    country: "SE",
    city: "Göteborg",
    year: 2022,
    km: 40500,
    fuel: "Benzina",
    transmission: "Automatico",
    price: 289000,
    priceUnit: "once",
    currency: "SEK",
    dealer: "Volvo Studio West",
    source: "Blocket",
    sourceUrl: "https://www.blocket.se/",
    highlights: ["≈ €25.6k", "Pacchetto inverno"],
    score: 83,
  },
  {
    id: "it-acquisto-renegade",
    title: "Jeep Renegade 1.6 Mjt",
    brand: "Jeep",
    model: "Renegade",
    dealType: "acquisto",
    country: "IT",
    city: "Torino",
    year: 2020,
    km: 78000,
    fuel: "Diesel",
    transmission: "Manuale",
    price: 16900,
    priceUnit: "once",
    currency: "EUR",
    dealer: "Privato verificato",
    source: "Subito",
    sourceUrl: "https://www.subito.it/",
    highlights: ["Prezzo aggressivo", "Verificare carrozzeria"],
    score: 74,
  },
];

export interface OfferSearchInput {
  dealType: DealType;
  countries: CountryCode[];
  brand: string;
  model: string;
  budgetMax: number;
  yearMin: number;
  fuel: string;
  maxKm: number;
}

const FX_TO_EUR: Record<Offer["currency"], number> = {
  EUR: 1,
  PLN: 0.233,
  SEK: 0.0885,
};

export function toEuro(amount: number, currency: Offer["currency"]) {
  return amount * FX_TO_EUR[currency];
}

export function formatMoney(amount: number, currency: Offer["currency"]) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function priceLabel(offer: Offer) {
  const base = formatMoney(offer.price, offer.currency);
  if (offer.priceUnit === "month") return `${base}/mese`;
  if (offer.priceUnit === "day") return `${base}/giorno`;
  return base;
}

/** Replace this function body when wiring a live provider. */
export async function searchOffers(input: OfferSearchInput): Promise<{
  offers: Offer[];
  mode: "sample";
  providerHint: string[];
}> {
  await new Promise((r) => setTimeout(r, 420));

  const offers = SAMPLE_OFFERS.filter((o) => {
    if (o.dealType !== input.dealType) return false;
    if (input.countries.length && !input.countries.includes(o.country)) return false;
    if (input.brand && !o.brand.toLowerCase().includes(input.brand.toLowerCase())) return false;
    if (input.model && !o.model.toLowerCase().includes(input.model.toLowerCase())) return false;
    if (input.fuel && input.fuel !== "Tutti" && o.fuel !== input.fuel) return false;
    if (input.yearMin && o.year < input.yearMin) return false;
    if (input.maxKm && o.km > input.maxKm && o.dealType === "acquisto") return false;
    if (input.budgetMax) {
      const euro = toEuro(o.price, o.currency);
      if (o.priceUnit === "once" && euro > input.budgetMax) return false;
      if (o.priceUnit === "month" && o.price > input.budgetMax) return false;
      if (o.priceUnit === "day" && o.price > input.budgetMax) return false;
    }
    return true;
  }).sort((a, b) => b.score - a.score);

  return {
    offers,
    mode: "sample",
    providerHint: [
      "AutoScout24 API",
      "Mobile.de",
      "Autobiz",
      "DiscoverCars",
      "Ayvens / Arval / Leasys",
    ],
  };
}
