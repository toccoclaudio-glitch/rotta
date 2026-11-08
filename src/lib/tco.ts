/** Stima costo di possesso per acquisto (ramo unico attuale). */
export interface PurchaseCostInput {
  purchasePrice: number;
  ownershipYears: number;
  residualPercent: number;
  annualKm: number;
  fuelCostPerKm: number;
  insuranceYear: number;
  taxYear: number;
  maintenanceYear: number;
  importCost: number;
  paperwork: number;
}

export interface PurchaseCostResult {
  depreciation: number;
  running: number;
  extras: number;
  total: number;
  monthly: number;
  costPerKm: number;
  notes: string[];
}

export const DEFAULT_PURCHASE_COST: PurchaseCostInput = {
  purchasePrice: 25000,
  ownershipYears: 3,
  residualPercent: 55,
  annualKm: 12000,
  fuelCostPerKm: 0.12,
  insuranceYear: 650,
  taxYear: 280,
  maintenanceYear: 450,
  importCost: 0,
  paperwork: 450,
};

export function computePurchaseCost(i: PurchaseCostInput): PurchaseCostResult {
  const years = Math.max(i.ownershipYears, 0.25);
  const residual = i.purchasePrice * (i.residualPercent / 100);
  const depreciation = i.purchasePrice - residual;
  const running =
    years *
    (i.annualKm * i.fuelCostPerKm + i.insuranceYear + i.taxYear + i.maintenanceYear);
  const extras = i.importCost + i.paperwork;
  const total = depreciation + running + extras;
  const monthly = total / (years * 12);
  const totalKm = years * i.annualKm;
  const costPerKm = totalKm > 0 ? total / totalKm : 0;

  const notes = [
    "Il residuo è una stima: verifica listini usati del paese di rivendita.",
    "Import/pratiche servono soprattutto per auto estere (DE, BE, NL…).",
  ];
  if (i.importCost > 0) {
    notes.push("Hai incluso costi di import: confrontali sempre con il risparmio sul prezzo.");
  }

  return { depreciation, running, extras, total, monthly, costPerKm, notes };
}

export function eur(n: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}
