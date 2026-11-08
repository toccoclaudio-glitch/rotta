export type DealType = "acquisto" | "noleggio" | "leasing";

export type CountryCode =
  | "IT"
  | "DE"
  | "FR"
  | "ES"
  | "NL"
  | "BE"
  | "AT"
  | "PL"
  | "PT"
  | "SE";

export interface Country {
  code: CountryCode;
  name: string;
  currency: "EUR" | "SEK" | "PLN";
  flag: string;
}

export interface Marketplace {
  id: string;
  name: string;
  countries: CountryCode[];
  dealTypes: DealType[];
  buildUrl: (q: SearchQuery) => string;
}

export interface SearchQuery {
  dealType: DealType;
  countries: CountryCode[];
  brand: string;
  model: string;
  budgetMax: number;
  yearMin: number;
  fuel: string;
  maxKm: number;
}

export const COUNTRIES: Country[] = [
  { code: "IT", name: "Italia", currency: "EUR", flag: "IT" },
  { code: "DE", name: "Germania", currency: "EUR", flag: "DE" },
  { code: "FR", name: "Francia", currency: "EUR", flag: "FR" },
  { code: "ES", name: "Spagna", currency: "EUR", flag: "ES" },
  { code: "NL", name: "Paesi Bassi", currency: "EUR", flag: "NL" },
  { code: "BE", name: "Belgio", currency: "EUR", flag: "BE" },
  { code: "AT", name: "Austria", currency: "EUR", flag: "AT" },
  { code: "PL", name: "Polonia", currency: "PLN", flag: "PL" },
  { code: "PT", name: "Portogallo", currency: "EUR", flag: "PT" },
  { code: "SE", name: "Svezia", currency: "SEK", flag: "SE" },
];

export const BRANDS = [
  "Audi",
  "BMW",
  "Cupra",
  "Fiat",
  "Ford",
  "Hyundai",
  "Kia",
  "Mercedes-Benz",
  "Peugeot",
  "Renault",
  "Seat",
  "Skoda",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
] as const;

export const FUELS = ["Tutti", "Benzina", "Diesel", "Ibrido", "Elettrico", "GPL"] as const;

const enc = encodeURIComponent;

function brandQuery(q: SearchQuery) {
  return [q.brand, q.model].filter(Boolean).join(" ").trim();
}

export const MARKETPLACES: Marketplace[] = [
  {
    id: "autoscout24",
    name: "AutoScout24",
    countries: ["IT", "DE", "FR", "ES", "NL", "BE", "AT"],
    dealTypes: ["acquisto"],
    buildUrl: (q) => {
      const cyMap: Partial<Record<CountryCode, string>> = {
        IT: "I",
        DE: "D",
        FR: "F",
        ES: "E",
        NL: "NL",
        BE: "B",
        AT: "A",
      };
      const cy = q.countries.map((c) => cyMap[c]).filter(Boolean).join("%2C") || "D%2CI%2CF%2CE";
      const host =
        q.countries[0] === "IT"
          ? "www.autoscout24.it"
          : q.countries[0] === "DE"
            ? "www.autoscout24.de"
            : "www.autoscout24.com";
      const params = new URLSearchParams({
        atype: "C",
        cy: cy.replace(/%2C/g, ","),
        desc: "0",
        sort: "price",
        ustate: "N,U",
      });
      if (q.brand) params.set("make", q.brand);
      if (q.model) params.set("model", q.model);
      if (q.budgetMax) params.set("priceto", String(q.budgetMax));
      if (q.yearMin) params.set("fregfrom", String(q.yearMin));
      if (q.maxKm) params.set("kmto", String(q.maxKm));
      return `https://${host}/lst?${params.toString()}`;
    },
  },
  {
    id: "mobilede",
    name: "Mobile.de",
    countries: ["DE", "AT"],
    dealTypes: ["acquisto"],
    buildUrl: (q) => {
      const params = new URLSearchParams({
        dam: "0",
        isSearchRequest: "true",
        s: "Car",
        ref: "srp",
      });
      if (q.brand) params.set("ms", q.brand);
      if (q.budgetMax) params.set("p", `:${q.budgetMax}`);
      if (q.yearMin) params.set("fr", `${q.yearMin}:`);
      if (q.maxKm) params.set("ml", `:${q.maxKm}`);
      const qtext = brandQuery(q);
      if (qtext) params.set("q", qtext);
      return `https://suchen.mobile.de/fahrzeuge/search.html?${params.toString()}`;
    },
  },
  {
    id: "subito",
    name: "Subito Auto",
    countries: ["IT"],
    dealTypes: ["acquisto"],
    buildUrl: (q) => {
      const qtext = brandQuery(q) || "auto";
      return `https://www.subito.it/annunci-italia/vendita/auto/?q=${enc(qtext)}&order=priceasc`;
    },
  },
  {
    id: "leboncoin",
    name: "Leboncoin",
    countries: ["FR", "BE"],
    dealTypes: ["acquisto"],
    buildUrl: (q) => {
      const qtext = brandQuery(q) || "voiture";
      const params = new URLSearchParams({
        category: "2",
        text: qtext,
        sort: "price",
        order: "asc",
      });
      if (q.budgetMax) params.set("price", `min-max-${q.budgetMax}`);
      return `https://www.leboncoin.fr/recherche?${params.toString()}`;
    },
  },
  {
    id: "coches",
    name: "Coches.net",
    countries: ["ES"],
    dealTypes: ["acquisto"],
    buildUrl: (q) => {
      const qtext = brandQuery(q);
      return `https://www.coches.net/segunda-mano/?Texto=${enc(qtext)}&PrecioHasta=${q.budgetMax || ""}`;
    },
  },
  {
    id: "olxpl",
    name: "OLX / Otomoto",
    countries: ["PL"],
    dealTypes: ["acquisto"],
    buildUrl: (q) => {
      const qtext = brandQuery(q) || "samochod";
      return `https://www.otomoto.pl/osobowe/q-${enc(qtext)}/?search%5Border%5D=filter_float_price%3Aasc`;
    },
  },
  {
    id: "blocket",
    name: "Blocket Bilar",
    countries: ["SE"],
    dealTypes: ["acquisto"],
    buildUrl: (q) => {
      const qtext = brandQuery(q) || "bil";
      return `https://www.blocket.se/annonser/hela_sverige/fordon/bilar?q=${enc(qtext)}&sort=priceasc`;
    },
  },
  {
    id: "standvirtual",
    name: "Standvirtual",
    countries: ["PT"],
    dealTypes: ["acquisto"],
    buildUrl: (q) => {
      const qtext = brandQuery(q) || "carro";
      return `https://www.standvirtual.com/carros/?q=${enc(qtext)}&search%5Border%5D=filter_float_price%3Aasc`;
    },
  },
  {
    id: "discovercars",
    name: "DiscoverCars",
    countries: ["IT", "DE", "FR", "ES", "NL", "BE", "AT", "PL", "PT", "SE"],
    dealTypes: ["noleggio"],
    buildUrl: (q) => {
      const cityHint: Partial<Record<CountryCode, string>> = {
        IT: "Milan",
        DE: "Berlin",
        FR: "Paris",
        ES: "Madrid",
        NL: "Amsterdam",
        BE: "Brussels",
        AT: "Vienna",
        PL: "Warsaw",
        PT: "Lisbon",
        SE: "Stockholm",
      };
      const city = cityHint[q.countries[0] ?? "IT"] ?? "Milan";
      return `https://www.discovercars.com/search?a_loc=${enc(city)}&q=${enc(brandQuery(q))}`;
    },
  },
  {
    id: "sixt",
    name: "Sixt",
    countries: ["IT", "DE", "FR", "ES", "NL", "BE", "AT", "PT", "SE"],
    dealTypes: ["noleggio"],
    buildUrl: (q) =>
      `https://www.sixt.com/php/reservation?pos=it&car_brand=${enc(q.brand)}&car_model=${enc(q.model)}`,
  },
  {
    id: "ayvens",
    name: "Ayvens (LeasePlan)",
    countries: ["IT", "DE", "FR", "ES", "NL", "BE", "AT", "PT", "SE", "PL"],
    dealTypes: ["leasing"],
    buildUrl: (q) =>
      `https://www.ayvens.com/en-be/private-lease/?make=${enc(q.brand)}&model=${enc(q.model)}`,
  },
  {
    id: "arval",
    name: "Arval",
    countries: ["IT", "DE", "FR", "ES", "NL", "BE", "AT", "PT", "PL"],
    dealTypes: ["leasing"],
    buildUrl: () => "https://www.arval.com/",
  },
  {
    id: "alphabet",
    name: "Alphabet Leasing",
    countries: ["IT", "DE", "FR", "ES", "NL", "BE", "AT", "PT", "SE"],
    dealTypes: ["leasing"],
    buildUrl: () => "https://www.alphabet.com/",
  },
  {
    id: "leasys",
    name: "Leasys",
    countries: ["IT", "FR", "ES", "DE", "BE", "NL", "PT"],
    dealTypes: ["leasing", "noleggio"],
    buildUrl: (q) =>
      `https://www.leasys.com/it/privati?marca=${enc(q.brand)}&modello=${enc(q.model)}`,
  },
];

export function matchingMarketplaces(q: SearchQuery): Marketplace[] {
  return MARKETPLACES.filter(
    (m) =>
      m.dealTypes.includes(q.dealType) &&
      m.countries.some((c) => q.countries.includes(c) || q.countries.length === 0),
  );
}
