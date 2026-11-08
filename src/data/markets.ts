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
  version: string;
  budgetMax: number;
  yearMin: number;
  fuel: string;
  maxKm: number;
  colors: string[];
  sunroof: boolean;
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
  "Alfa Romeo",
  "Audi",
  "BMW",
  "Citroën",
  "Cupra",
  "Dacia",
  "Fiat",
  "Ford",
  "Honda",
  "Hyundai",
  "Jeep",
  "Kia",
  "Lancia",
  "Maserati",
  "Mazda",
  "Mercedes-Benz",
  "Mini",
  "Nissan",
  "Opel",
  "Peugeot",
  "Porsche",
  "Renault",
  "Seat",
  "Skoda",
  "Suzuki",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
] as const;

export const FUELS = ["Tutti", "Benzina", "Diesel", "Ibrido", "Elettrico", "GPL"] as const;

export const COLOR_OPTIONS = [
  "Nero",
  "Grigio",
  "Grigio opaco",
  "Bianco",
  "Blu",
  "Argento",
  "Rosso",
] as const;

const enc = encodeURIComponent;

function brandQuery(q: SearchQuery) {
  return [q.brand, q.model, q.version].filter(Boolean).join(" ").trim();
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
      const cy = q.countries.map((c) => cyMap[c]).filter(Boolean).join(",") || "I,D,F,E";
      const host =
        q.countries[0] === "DE"
          ? "www.autoscout24.de"
          : q.countries.includes("IT") || !q.countries.length
            ? "www.autoscout24.it"
            : "www.autoscout24.com";

      // Path-style when brand/model known (better Modena filter)
      const brandSlug = q.brand ? enc(q.brand.toLowerCase()) : "";
      const modelSlug = q.model ? enc(q.model.toLowerCase()) : "";
      const basePath =
        brandSlug && modelSlug
          ? `https://${host}/lst/${brandSlug}/${modelSlug}`
          : `https://${host}/lst`;

      const params = new URLSearchParams({
        atype: "C",
        cy,
        desc: "0",
        sort: "price",
        ustate: "N,U",
      });
      if (q.version) params.set("search_text", q.version);
      if (q.budgetMax) params.set("priceto", String(q.budgetMax));
      if (q.yearMin) params.set("fregfrom", String(q.yearMin));
      if (q.maxKm) params.set("kmto", String(q.maxKm));
      if (q.sunroof) params.set("eq", "42"); // panoramic/sunroof equipment id often used
      if (q.colors.includes("Nero")) params.append("bcol", "1");
      if (q.colors.some((c) => c.startsWith("Grigio"))) params.append("bcol", "11");
      if (q.version.toLowerCase().includes("modena") && brandSlug && modelSlug) {
        return `${basePath}/ve_modena?${params.toString()}`;
      }
      return `${basePath}?${params.toString()}`;
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
      if (q.brand) params.set("ms", `${q.brand};${q.model || ""}`);
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
];

export function matchingMarketplaces(q: SearchQuery): Marketplace[] {
  return MARKETPLACES.filter(
    (m) =>
      m.dealTypes.includes(q.dealType) &&
      m.countries.some((c) => q.countries.includes(c) || q.countries.length === 0),
  );
}
