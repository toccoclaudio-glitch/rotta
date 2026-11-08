import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BRANDS,
  COUNTRIES,
  FUELS,
  matchingMarketplaces,
  type CountryCode,
  type SearchQuery,
} from "./data/markets";
import {
  formatMoney,
  priceLabel,
  searchOffers,
  toEuro,
  type Offer,
} from "./data/offers";
import {
  DEFAULT_PURCHASE_COST,
  computePurchaseCost,
  eur,
  type PurchaseCostInput,
} from "./lib/tco";

const DEFAULT_QUERY: SearchQuery = {
  dealType: "acquisto",
  countries: ["IT", "DE", "FR", "ES", "BE", "NL"],
  brand: "",
  model: "",
  budgetMax: 30000,
  yearMin: 2020,
  fuel: "Tutti",
  maxKm: 100000,
};

function loadShortlist(): Offer[] {
  try {
    const raw = localStorage.getItem("rotta-shortlist-acquisto");
    return raw ? (JSON.parse(raw) as Offer[]) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [clientName, setClientName] = useState("");
  const [clientNote, setClientNote] = useState("");
  const [query, setQuery] = useState<SearchQuery>(DEFAULT_QUERY);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [providers, setProviders] = useState<string[]>([]);
  const [shortlist, setShortlist] = useState<Offer[]>(() => loadShortlist());
  const [cost, setCost] = useState<PurchaseCostInput>(DEFAULT_PURCHASE_COST);

  const markets = useMemo(
    () => matchingMarketplaces({ ...query, dealType: "acquisto" }),
    [query],
  );
  const costResult = useMemo(() => computePurchaseCost(cost), [cost]);

  useEffect(() => {
    localStorage.setItem("rotta-shortlist-acquisto", JSON.stringify(shortlist));
  }, [shortlist]);

  async function runSearch(opts?: { scroll?: boolean; override?: SearchQuery }) {
    const active = opts?.override ?? query;
    setLoading(true);
    setSearched(true);
    const result = await searchOffers({ ...active, dealType: "acquisto" });
    setOffers(result.offers.filter((o) => o.dealType === "acquisto"));
    setProviders(result.providerHint.filter((p) => !/DiscoverCars|Ayvens|Arval|Leasys/i.test(p)));
    setLoading(false);
    if (opts?.scroll !== false) {
      document.getElementById("risultati")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  useEffect(() => {
    void runSearch({ scroll: false, override: DEFAULT_QUERY });
    // Prima apertura: mostra subito offerte campione sul brief di default.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleCountry(code: CountryCode) {
    setQuery((q) => {
      const has = q.countries.includes(code);
      const countries = has ? q.countries.filter((c) => c !== code) : [...q.countries, code];
      return { ...q, countries };
    });
  }

  function toggleShortlist(offer: Offer) {
    setShortlist((list) => {
      if (list.some((o) => o.id === offer.id)) return list.filter((o) => o.id !== offer.id);
      return [...list, offer];
    });
  }

  function applyOfferToCost(offer: Offer) {
    setCost((t) => ({
      ...t,
      purchasePrice: Math.round(toEuro(offer.price, offer.currency)),
      importCost: offer.country === "IT" ? 0 : Math.max(800, Math.round(toEuro(offer.price, offer.currency) * 0.04)),
    }));
    document.getElementById("costi")?.scrollIntoView({ behavior: "smooth" });
  }

  const requestLabel = [query.brand, query.model].filter(Boolean).join(" ") || "qualsiasi auto";

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top">
          <span className="brand-mark">Rotta</span>
          <span className="brand-tag">acquisto Europa</span>
        </a>
        <nav className="nav-links">
          <a href="#brief">Brief cliente</a>
          <a href="#risultati">Offerte</a>
          <a href="#mercati">Mercati</a>
          <a href="#costi">Costo possesso</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <motion.p
          className="hero-kicker"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          Solo acquisto
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
        >
          Rotta
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          Desk per trovare le migliori auto in vendita in Europa, partendo dalle richieste
          del cliente: qualsiasi marca e modello, confrontati tra più mercati.
        </motion.p>
        <motion.div
          className="cta-row"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
        >
          <a className="btn btn-primary" href="#brief">
            Inserisci richiesta cliente
          </a>
          <a className="btn btn-ghost" href="#mercati">
            Apri i marketplace
          </a>
        </motion.div>
      </section>

      <section className="section" id="brief">
        <div className="section-head">
          <div>
            <h2>Brief cliente</h2>
            <p>
              Inserisci cosa cerca il cliente. Rotta prepara i filtri e i link ai marketplace
              europei per quella macchina.
            </p>
          </div>
        </div>

        <div className="search-panel">
          <div className="grid-fields">
            <div className="field">
              <label htmlFor="client">Cliente</label>
              <input
                id="client"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Nome o riferimento pratica"
              />
            </div>
            <div className="field" style={{ gridColumn: "span 3" }}>
              <label htmlFor="note">Note richiesta</label>
              <input
                id="note"
                value={clientNote}
                onChange={(e) => setClientNote(e.target.value)}
                placeholder="es. automatica, tetto panoramico, un solo proprietario, consegna entro 30 gg"
              />
            </div>
            <div className="field">
              <label htmlFor="brand">Marca</label>
              <input
                id="brand"
                list="brand-list"
                value={query.brand}
                onChange={(e) => setQuery((q) => ({ ...q, brand: e.target.value }))}
                placeholder="Qualsiasi — digita la marca"
              />
              <datalist id="brand-list">
                {BRANDS.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </div>
            <div className="field">
              <label htmlFor="model">Modello</label>
              <input
                id="model"
                value={query.model}
                onChange={(e) => setQuery((q) => ({ ...q, model: e.target.value }))}
                placeholder="Qualsiasi — es. Golf, CX-5, Model Y"
              />
            </div>
            <div className="field">
              <label htmlFor="budget">Budget max (€)</label>
              <input
                id="budget"
                type="number"
                min={0}
                value={query.budgetMax || ""}
                onChange={(e) =>
                  setQuery((q) => ({ ...q, budgetMax: Number(e.target.value) || 0 }))
                }
              />
            </div>
            <div className="field">
              <label htmlFor="year">Anno da</label>
              <input
                id="year"
                type="number"
                min={1995}
                max={2026}
                value={query.yearMin || ""}
                onChange={(e) =>
                  setQuery((q) => ({ ...q, yearMin: Number(e.target.value) || 0 }))
                }
              />
            </div>
            <div className="field">
              <label htmlFor="fuel">Alimentazione</label>
              <select
                id="fuel"
                value={query.fuel}
                onChange={(e) => setQuery((q) => ({ ...q, fuel: e.target.value }))}
              >
                {FUELS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="km">Km max</label>
              <input
                id="km"
                type="number"
                min={0}
                step={5000}
                value={query.maxKm || ""}
                onChange={(e) =>
                  setQuery((q) => ({ ...q, maxKm: Number(e.target.value) || 0 }))
                }
              />
            </div>
          </div>

          <div className="countries" aria-label="Paesi di ricerca">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                type="button"
                className={`chip${query.countries.includes(c.code) ? " active" : ""}`}
                onClick={() => toggleCountry(c.code)}
              >
                {c.code} · {c.name}
              </button>
            ))}
          </div>

          <div className="search-actions">
            <p className="hint">
              Richiesta: <strong style={{ color: "var(--ink)" }}>{requestLabel}</strong>
              {clientName ? ` · ${clientName}` : ""} · {markets.length} marketplace ·{" "}
              {query.countries.length || "tutti i"} paesi
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => void runSearch()}
              disabled={loading}
            >
              {loading ? "Cerco…" : "Cerca in Europa"}
            </button>
          </div>

          <div className="banner-sample">
            <strong>Anteprima con dati campione.</strong> Oggi le schede sono sample per il
            workflow. I marketplace sotto aprono ricerche reali. Feed live possibili con:{" "}
            {providers.length
              ? providers.join(", ")
              : "AutoScout24 API, Mobile.de, Autobiz, Otomoto / aggregatori B2B"}.
          </div>
        </div>
      </section>

      <section className="section" id="risultati">
        <div className="section-head">
          <div>
            <h2>Offerte in vendita</h2>
            <p>
              Confronta prezzi tra paesi. Per auto non presenti nei sample, usa i marketplace:
              funzionano su qualsiasi marca/modello digitato.
            </p>
          </div>
        </div>

        {searched && (
          <div className="results-meta">
            <span>{loading ? "Aggiornamento…" : `${offers.length} risultati campione`}</span>
            <span>Solo acquisto · {requestLabel}</span>
            {clientNote && <span>Note: {clientNote}</span>}
          </div>
        )}

        <div className="results-list">
          <AnimatePresence mode="popLayout">
            {!loading &&
              offers.map((offer, index) => {
                const saved = shortlist.some((o) => o.id === offer.id);
                return (
                  <motion.article
                    key={offer.id}
                    className="offer-row"
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28, delay: index * 0.03 }}
                  >
                    <div>
                      <h3 className="offer-title">{offer.title}</h3>
                      <p className="offer-meta">
                        {offer.city}, {offer.country} · {offer.year} ·{" "}
                        {offer.km.toLocaleString("it-IT")} km · {offer.fuel} · {offer.transmission}
                      </p>
                      <div className="tags">
                        <span className="tag">{offer.source}</span>
                        <span className="tag">{offer.dealer}</span>
                        {offer.highlights.map((h) => (
                          <span className="tag" key={h}>
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="offer-price">
                      {priceLabel(offer)}
                      {offer.currency !== "EUR" && (
                        <small>≈ {formatMoney(toEuro(offer.price, offer.currency), "EUR")}</small>
                      )}
                    </div>
                    <div className="score">Score {offer.score}</div>
                    <div className="offer-actions">
                      <a className="btn btn-ghost" href={offer.sourceUrl} target="_blank" rel="noreferrer">
                        Apri fonte
                      </a>
                      <button type="button" className="btn btn-ghost" onClick={() => toggleShortlist(offer)}>
                        {saved ? "In shortlist" : "Salva per cliente"}
                      </button>
                      <button type="button" className="btn btn-primary" onClick={() => applyOfferToCost(offer)}>
                        Stima costi
                      </button>
                    </div>
                  </motion.article>
                );
              })}
          </AnimatePresence>
          {searched && !loading && offers.length === 0 && (
            <p className="empty-inline">
              Nessun sample per questa richiesta. Digita marca/modello e apri i marketplace sotto:
              lì la copertura è su tutto il parco auto europeo.
            </p>
          )}
          {!searched && (
            <p className="empty-inline">Compila il brief e cerca per vedere le offerte campione.</p>
          )}
        </div>
      </section>

      <section className="section" id="mercati">
        <div className="section-head">
          <div>
            <h2>Marketplace di vendita</h2>
            <p>
              Qui c’è la copertura reale: link già filtrati sulla richiesta del cliente, aperti
              sui portali europei di auto usate/nuove.
            </p>
          </div>
        </div>
        <div className="markets-grid">
          {markets.map((m) => (
            <a
              key={m.id}
              className="market-link"
              href={m.buildUrl({ ...query, dealType: "acquisto" })}
              target="_blank"
              rel="noreferrer"
            >
              <strong>{m.name}</strong>
              <span>
                {m.countries
                  .filter((c) => query.countries.includes(c) || !query.countries.length)
                  .join(", ") || m.countries.join(", ")}{" "}
                · ricerca vendita
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="costi">
        <div className="section-head">
          <div>
            <h2>Costo di possesso</h2>
            <p>
              Stima deprezzamento, gestione e (se serve) import dall’estero, per presentare al
              cliente il costo vero dell’acquisto.
            </p>
          </div>
        </div>

        <div className="split-2">
          <div className="panel">
            <h3>Parametri acquisto</h3>
            <div className="tco-grid">
              {(
                [
                  ["purchasePrice", "Prezzo acquisto (€)"],
                  ["ownershipYears", "Anni di possesso"],
                  ["residualPercent", "Residuo stimato (%)"],
                  ["annualKm", "Km annui"],
                  ["fuelCostPerKm", "Costo €/km"],
                  ["insuranceYear", "Assicurazione / anno"],
                  ["taxYear", "Bollo / anno"],
                  ["maintenanceYear", "Manutenzione / anno"],
                  ["importCost", "Import / trasporto"],
                  ["paperwork", "Pratiche / passaggio"],
                ] as Array<[keyof PurchaseCostInput, string]>
              ).map(([key, label]) => (
                <div className="field" key={key}>
                  <label htmlFor={key}>{label}</label>
                  <input
                    id={key}
                    type="number"
                    value={cost[key]}
                    onChange={(e) =>
                      setCost((prev) => ({ ...prev, [key]: Number(e.target.value) || 0 }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3>Sintesi per il cliente</h3>
            <div className="tco-result">
              <div className="metric best">
                <div className="label">Costo netto sul periodo</div>
                <div className="value">{eur(costResult.total)}</div>
                <div className="label">
                  ≈ {eur(costResult.monthly)}/mese · {eur(costResult.costPerKm)}/km
                </div>
              </div>
              <div className="metric">
                <div className="label">Deprezzamento</div>
                <div className="value">{eur(costResult.depreciation)}</div>
              </div>
              <div className="metric">
                <div className="label">Gestione (carburante, bollo, ecc.)</div>
                <div className="value">{eur(costResult.running)}</div>
              </div>
              <div className="metric">
                <div className="label">Import + pratiche</div>
                <div className="value">{eur(costResult.extras)}</div>
              </div>
              <div className="banner-sample">{costResult.notes.join(" ")}</div>
            </div>

            <h3 style={{ marginTop: "1.25rem" }}>
              Shortlist{clientName ? ` · ${clientName}` : ""}
            </h3>
            <div className="shortlist">
              {shortlist.length === 0 && (
                <p className="empty-inline">Salva le migliori proposte da mostrare al cliente.</p>
              )}
              {shortlist.map((o) => (
                <div className="short-item" key={o.id}>
                  <div>
                    <strong>{o.title}</strong>
                    <div className="offer-meta">
                      {o.country} · {priceLabel(o)}
                    </div>
                  </div>
                  <button type="button" onClick={() => toggleShortlist(o)}>
                    Rimuovi
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>Rotta — desk acquisto auto in Europa, guidato dalle richieste del cliente.</span>
        <span>Noleggio e leasing esclusi in questa versione.</span>
      </footer>
    </div>
  );
}
