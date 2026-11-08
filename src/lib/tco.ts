export interface TcoInput {
  purchasePrice: number;
  ownershipYears: number;
  residualPercent: number;
  annualKm: number;
  fuelCostPerKm: number;
  insuranceYear: number;
  taxYear: number;
  maintenanceYear: number;
  leaseMonthly: number;
  leaseMonths: number;
  leaseUpfront: number;
  leaseIncludedKm: number;
  leaseExtraKmCost: number;
  rentDaily: number;
  rentDays: number;
  rentExtrasDay: number;
}

export interface TcoResult {
  purchaseTotal: number;
  purchaseMonthly: number;
  leaseTotal: number;
  leaseMonthlyEffective: number;
  rentTotal: number;
  rentDailyEffective: number;
  best: "acquisto" | "leasing" | "noleggio";
  notes: string[];
}

export const DEFAULT_TCO: TcoInput = {
  purchasePrice: 25000,
  ownershipYears: 3,
  residualPercent: 55,
  annualKm: 12000,
  fuelCostPerKm: 0.12,
  insuranceYear: 650,
  taxYear: 280,
  maintenanceYear: 450,
  leaseMonthly: 389,
  leaseMonths: 36,
  leaseUpfront: 2500,
  leaseIncludedKm: 15000,
  leaseExtraKmCost: 0.12,
  rentDaily: 42,
  rentDays: 90,
  rentExtrasDay: 8,
};

export function computeTco(i: TcoInput): TcoResult {
  const years = Math.max(i.ownershipYears, 0.25);
  const residual = i.purchasePrice * (i.residualPercent / 100);
  const depreciation = i.purchasePrice - residual;
  const running =
    years *
    (i.annualKm * i.fuelCostPerKm + i.insuranceYear + i.taxYear + i.maintenanceYear);
  const purchaseTotal = depreciation + running;
  const purchaseMonthly = purchaseTotal / (years * 12);

  const leaseKmNeeded = (i.leaseMonths / 12) * i.annualKm;
  const leaseIncluded = (i.leaseMonths / 12) * i.leaseIncludedKm;
  const extraKm = Math.max(0, leaseKmNeeded - leaseIncluded) * i.leaseExtraKmCost;
  const leaseTotal = i.leaseUpfront + i.leaseMonthly * i.leaseMonths + extraKm;
  const leaseMonthlyEffective = leaseTotal / i.leaseMonths;

  const rentTotal = i.rentDays * (i.rentDaily + i.rentExtrasDay);
  const rentDailyEffective = i.rentDays ? rentTotal / i.rentDays : 0;

  // Normalize to same horizon for ranking: ownershipYears
  const horizonDays = years * 365;
  const rentNormalized = (rentTotal / Math.max(i.rentDays, 1)) * horizonDays;
  const leaseNormalized =
    (leaseTotal / Math.max(i.leaseMonths, 1)) * (years * 12);

  const ranked = (
    [
      { key: "acquisto", value: purchaseTotal },
      { key: "leasing", value: leaseNormalized },
      { key: "noleggio", value: rentNormalized },
    ] as Array<{ key: TcoResult["best"]; value: number }>
  ).sort((a, b) => a.value - b.value);

  const notes: string[] = [
    "Il confronto normalizza leasing e noleggio sull’orizzonte di possesso scelto.",
    "Residuo auto stimato: verifica listini locali e stato del mercato usato.",
  ];
  if (ranked[0].key === "acquisto") {
    notes.push("Su questo scenario l’acquisto risulta più conveniente a parità di km.");
  } else if (ranked[0].key === "leasing") {
    notes.push("Il leasing vince se vuoi rata fissa e servizi inclusi senza capitale bloccato.");
  } else {
    notes.push("Il noleggio è sensato per usi brevi o esigenze flessibili, non come possesso lungo.");
  }

  return {
    purchaseTotal,
    purchaseMonthly,
    leaseTotal,
    leaseMonthlyEffective,
    rentTotal,
    rentDailyEffective,
    best: ranked[0].key,
    notes,
  };
}

export function eur(n: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}
