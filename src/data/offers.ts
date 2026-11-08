import type { CountryCode, DealType } from "./markets";

/**
 * Catalogo operativo per simulazioni broker.
 * Le foto e i link puntano ad annunci AutoScout24 reali (snapshot di mercato).
 */
export interface Offer {
  id: string;
  title: string;
  brand: string;
  model: string;
  version: string;
  dealType: DealType;
  country: CountryCode;
  city: string;
  year: number;
  km: number;
  fuel: string;
  transmission: string;
  color: string;
  sunroof: boolean;
  price: number;
  priceUnit: "once" | "month" | "day";
  currency: "EUR" | "PLN" | "SEK";
  dealer: string;
  source: string;
  sourceUrl: string;
  image: string;
  gallery: string[];
  highlights: string[];
  score: number;
  matchNote?: string;
}

export const SAMPLE_OFFERS: Offer[] = [
  {
    id: "grecale-portogruaro",
    title: "Maserati Grecale Modena 2.0 MHEV 330 CV",
    brand: "Maserati",
    model: "Grecale",
    version: "Modena",
    dealType: "acquisto",
    country: "IT",
    city: "Portogruaro",
    year: 2022,
    km: 51000,
    fuel: "Ibrido",
    transmission: "Automatico",
    color: "Grigio",
    sunroof: true,
    price: 49000,
    priceUnit: "once",
    currency: "EUR",
    dealer: "Privato / rivenditore Portogruaro",
    source: "AutoScout24",
    sourceUrl:
      "https://www.autoscout24.it/annunci/maserati-grecale-grecale-2-0-mhev-modena-330cv-auto-elettrica-benzina-grigio-cat_ma45mo76196-e455488b-7958-4ba2-8841-4889d3cf85a7",
    image:
      "https://prod.pictures.autoscout24.net/listing-images/e455488b-7958-4ba2-8841-4889d3cf85a7_b5203c74-418d-469a-9c14-c37ac99a50af.jpg/800x600.webp",
    gallery: [
      "https://prod.pictures.autoscout24.net/listing-images/e455488b-7958-4ba2-8841-4889d3cf85a7_b5203c74-418d-469a-9c14-c37ac99a50af.jpg/800x600.webp",
      "https://prod.pictures.autoscout24.net/listing-images/e455488b-7958-4ba2-8841-4889d3cf85a7_7a21e278-85dd-4fe4-9f4d-47077dfeff24.jpg/800x600.webp",
      "https://prod.pictures.autoscout24.net/listing-images/e455488b-7958-4ba2-8841-4889d3cf85a7_2b639008-cc83-4084-ae86-098462ed9cac.jpg/800x600.webp",
      "https://prod.pictures.autoscout24.net/listing-images/e455488b-7958-4ba2-8841-4889d3cf85a7_72338962-5c1c-4c1c-a9f4-babdd7290ab3.jpg/800x600.webp",
      "https://prod.pictures.autoscout24.net/listing-images/e455488b-7958-4ba2-8841-4889d3cf85a7_1a329349-8e71-442c-9bc7-96408532ac5f.jpg/800x600.webp",
    ],
    highlights: ["Tetto apribile", "Grigio", "Match brief"],
    score: 96,
    matchNote: "Allinea budget, km, colore e tetto.",
  },
  {
    id: "grecale-calenzano",
    title: "Maserati Grecale Modena MHEV 330 CV AWD",
    brand: "Maserati",
    model: "Grecale",
    version: "Modena",
    dealType: "acquisto",
    country: "IT",
    city: "Calenzano (FI)",
    year: 2023,
    km: 71615,
    fuel: "Ibrido",
    transmission: "Automatico",
    color: "Grigio",
    sunroof: true,
    price: 49700,
    priceUnit: "once",
    currency: "EUR",
    dealer: "Ammg Firenze Srl",
    source: "AutoScout24",
    sourceUrl:
      "https://www.autoscout24.it/annunci/maserati-grecale-grecale-mhev-330-cv-awd-modena-278-elettrica-benzina-grigio-cat_ma45mo76196-21451fb1-822d-49f9-bfff-fbbbea7e301c",
    image:
      "https://prod.pictures.autoscout24.net/listing-images/21451fb1-822d-49f9-bfff-fbbbea7e301c_1edba056-02a7-41ff-bc6f-a7634999485b.jpg/800x600.webp",
    gallery: [
      "https://prod.pictures.autoscout24.net/listing-images/21451fb1-822d-49f9-bfff-fbbbea7e301c_1edba056-02a7-41ff-bc6f-a7634999485b.jpg/800x600.webp",
      "https://prod.pictures.autoscout24.net/listing-images/21451fb1-822d-49f9-bfff-fbbbea7e301c_f6843bb1-231c-44c1-b937-2d24bb942561.jpg/800x600.webp",
      "https://prod.pictures.autoscout24.net/listing-images/21451fb1-822d-49f9-bfff-fbbbea7e301c_2746c8e4-4524-43f8-8020-94385a9bbd3d.jpg/800x600.webp",
      "https://prod.pictures.autoscout24.net/listing-images/21451fb1-822d-49f9-bfff-fbbbea7e301c_4b5a4193-d9b3-4cd9-a34a-4e362b25d9fc.jpg/800x600.webp",
      "https://prod.pictures.autoscout24.net/listing-images/21451fb1-822d-49f9-bfff-fbbbea7e301c_209685fb-e1c8-4841-bb34-0b6e421dc0ac.jpg/800x600.webp",
    ],
    highlights: ["Tetto apribile", "Grigio", "2023"],
    score: 93,
    matchNote: "Dentro budget e km; colore e tetto ok.",
  },
  {
    id: "grecale-modena-nero",
    title: "Maserati Grecale Modena MHEV 330 CV AWD",
    brand: "Maserati",
    model: "Grecale",
    version: "Modena",
    dealType: "acquisto",
    country: "IT",
    city: "Modena",
    year: 2022,
    km: 49450,
    fuel: "Ibrido",
    transmission: "Automatico",
    color: "Nero",
    sunroof: false,
    price: 47800,
    priceUnit: "once",
    currency: "EUR",
    dealer: "Gruppo Autorama spa",
    source: "AutoScout24",
    sourceUrl:
      "https://www.autoscout24.it/annunci/maserati-grecale-grecale-mhev-330-cv-awd-modena-elettrica-benzina-nero-cat_ma45mo76196-8d715906-b6b9-4c1e-93b6-d29027864c25",
    image:
      "https://prod.pictures.autoscout24.net/listing-images/8d715906-b6b9-4c1e-93b6-d29027864c25_37da8b05-0b0d-4216-92fc-51b7c8e9939b.jpg/800x600.webp",
    gallery: [
      "https://prod.pictures.autoscout24.net/listing-images/8d715906-b6b9-4c1e-93b6-d29027864c25_37da8b05-0b0d-4216-92fc-51b7c8e9939b.jpg/800x600.webp",
      "https://prod.pictures.autoscout24.net/listing-images/8d715906-b6b9-4c1e-93b6-d29027864c25_957329bf-fe0d-4542-ba53-471cc9f16ec1.jpg/800x600.webp",
      "https://prod.pictures.autoscout24.net/listing-images/8d715906-b6b9-4c1e-93b6-d29027864c25_9741c6af-4938-4062-8a41-63d60f534f44.jpg/800x600.webp",
      "https://prod.pictures.autoscout24.net/listing-images/8d715906-b6b9-4c1e-93b6-d29027864c25_565b3430-8012-455d-8457-4c1cd9644a3b.jpg/800x600.webp",
    ],
    highlights: ["Nero", "Km ok", "Senza tetto in annuncio"],
    score: 78,
    matchNote: "Colore e budget ok; tetto non dichiarato.",
  },
  {
    id: "grecale-alessandria-nero",
    title: "Maserati Grecale Modena 2.0 MHEV 330 CV",
    brand: "Maserati",
    model: "Grecale",
    version: "Modena",
    dealType: "acquisto",
    country: "IT",
    city: "Alessandria",
    year: 2023,
    km: 56000,
    fuel: "Ibrido",
    transmission: "Automatico",
    color: "Nero",
    sunroof: false,
    price: 47500,
    priceUnit: "once",
    currency: "EUR",
    dealer: "Unicar Spa",
    source: "AutoScout24",
    sourceUrl:
      "https://www.autoscout24.it/annunci/maserati-grecale-2-0-mhev-benzina-ibrida-4x4-modena-330cv-km-56-000-tagliandi-ufficiali-maserati-elettrica-benzina-nero-cat_ma45mo76196-499b9f56-c7a6-4c04-8179-2fc842936f7f",
    image:
      "https://prod.pictures.autoscout24.net/listing-images/499b9f56-c7a6-4c04-8179-2fc842936f7f_4c2eda2c-19a9-4129-9762-3a23327ce692.jpg/800x600.webp",
    gallery: [
      "https://prod.pictures.autoscout24.net/listing-images/499b9f56-c7a6-4c04-8179-2fc842936f7f_4c2eda2c-19a9-4129-9762-3a23327ce692.jpg/800x600.webp",
      "https://prod.pictures.autoscout24.net/listing-images/499b9f56-c7a6-4c04-8179-2fc842936f7f_29205d1e-27de-4546-bdac-0bcb96346f10.jpg/800x600.webp",
      "https://prod.pictures.autoscout24.net/listing-images/499b9f56-c7a6-4c04-8179-2fc842936f7f_9eb37fe0-2ea9-4849-af3c-f12e474e3477.jpg/800x600.webp",
      "https://prod.pictures.autoscout24.net/listing-images/499b9f56-c7a6-4c04-8179-2fc842936f7f_cee3a749-aaa2-44ba-82c3-930d17bc8537.jpg/800x600.webp",
    ],
    highlights: ["Nero", "Tagliandi ufficiali", "Senza tetto in annuncio"],
    score: 76,
    matchNote: "Nero e km ok; manca tetto dichiarato.",
  },
  {
    id: "grecale-castagnaro",
    title: "Maserati Grecale Modena MHEV 330 CV AWD",
    brand: "Maserati",
    model: "Grecale",
    version: "Modena",
    dealType: "acquisto",
    country: "IT",
    city: "Castagnaro (VR)",
    year: 2023,
    km: 72518,
    fuel: "Ibrido",
    transmission: "Automatico",
    color: "Grigio",
    sunroof: false,
    price: 45800,
    priceUnit: "once",
    currency: "EUR",
    dealer: "Sordo Auto Srl",
    source: "AutoScout24",
    sourceUrl:
      "https://www.autoscout24.it/annunci/maserati-grecale-mhev-330-cv-awd-modena-elettrica-benzina-grigio-cat_ma45mo76196-9a3050ce-ef63-400d-87a9-0dbfe45e4824",
    image:
      "https://prod.pictures.autoscout24.net/listing-images/9a3050ce-ef63-400d-87a9-0dbfe45e4824_cec2c3ab-b4f0-48ac-9f83-b15798cd48d0.jpg/800x600.webp",
    gallery: [
      "https://prod.pictures.autoscout24.net/listing-images/9a3050ce-ef63-400d-87a9-0dbfe45e4824_cec2c3ab-b4f0-48ac-9f83-b15798cd48d0.jpg/800x600.webp",
    ],
    highlights: ["Grigio", "Prezzo aggressivo", "Verificare tetto"],
    score: 74,
    matchNote: "Grigio e budget ok; tetto da confermare col venditore.",
  },
  {
    id: "grecale-roma-nero-lowkm",
    title: "Maserati Grecale Modena 2.0 MHEV 330 CV",
    brand: "Maserati",
    model: "Grecale",
    version: "Modena",
    dealType: "acquisto",
    country: "IT",
    city: "Roma",
    year: 2022,
    km: 11780,
    fuel: "Ibrido",
    transmission: "Automatico",
    color: "Nero",
    sunroof: false,
    price: 49900,
    priceUnit: "once",
    currency: "EUR",
    dealer: "Auto In Roma Srl",
    source: "AutoScout24",
    sourceUrl:
      "https://www.autoscout24.it/annunci/maserati-grecale-2-0-mhev-modena-330cv-auto-elettrica-benzina-nero-cat_ma45mo76196-eedc1020-89e5-4ccd-b364-8b64a5f38146",
    image:
      "https://prod.pictures.autoscout24.net/listing-images/eedc1020-89e5-4ccd-b364-8b64a5f38146_01b57985-c1c1-4ed3-9c45-c90cbc6a8b74.jpg/800x600.webp",
    gallery: [
      "https://prod.pictures.autoscout24.net/listing-images/eedc1020-89e5-4ccd-b364-8b64a5f38146_01b57985-c1c1-4ed3-9c45-c90cbc6a8b74.jpg/800x600.webp",
    ],
    highlights: ["Nero", "Pochissimi km", "Senza tetto in annuncio"],
    score: 80,
    matchNote: "Km eccellenti e nero; tetto non in scheda.",
  },
];

export interface OfferSearchInput {
  dealType: DealType;
  countries: CountryCode[];
  brand: string;
  model: string;
  version?: string;
  budgetMax: number;
  yearMin: number;
  fuel: string;
  maxKm: number;
  colors?: string[];
  sunroof?: boolean;
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

function colorMatches(offerColor: string, wanted: string[]) {
  if (!wanted.length) return true;
  const oc = offerColor.toLowerCase();
  return wanted.some((w) => {
    const ww = w.toLowerCase();
    if (ww.includes("opaco")) return oc.includes("grigio") || oc.includes("opaco");
    return oc.includes(ww.split(" ")[0]);
  });
}

/** Motore ricerca locale (simulazione operativa). */
export async function searchOffers(input: OfferSearchInput): Promise<{
  offers: Offer[];
  mode: "catalog";
  providerHint: string[];
}> {
  await new Promise((r) => setTimeout(r, 380));

  const offers = SAMPLE_OFFERS.filter((o) => {
    if (o.dealType !== input.dealType) return false;
    if (input.countries.length && !input.countries.includes(o.country)) return false;
    if (input.brand && !o.brand.toLowerCase().includes(input.brand.toLowerCase())) return false;
    if (input.model && !o.model.toLowerCase().includes(input.model.toLowerCase())) return false;
    if (input.version && !o.version.toLowerCase().includes(input.version.toLowerCase())) return false;
    if (input.fuel && input.fuel !== "Tutti" && o.fuel !== input.fuel) return false;
    if (input.yearMin && o.year < input.yearMin) return false;
    if (input.maxKm && o.km > input.maxKm) return false;
    if (input.budgetMax) {
      const euro = toEuro(o.price, o.currency);
      if (o.priceUnit === "once" && euro > input.budgetMax) return false;
    }
    if (!colorMatches(o.color, input.colors ?? [])) return false;
    if (input.sunroof && !o.sunroof) return false;
    return true;
  }).sort((a, b) => b.score - a.score);

  return {
    offers,
    mode: "catalog",
    providerHint: ["AutoScout24", "Mobile.de", "Subito"],
  };
}
