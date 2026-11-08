import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BRANDS,
  COUNTRIES,
  FUELS,
  matchingMarketplaces,
  type CountryCode,
  type DealType,
  type SearchQuery,
} from "./data/markets";
import {
  formatMoney,
  priceLabel,
  searchOffers,
  toEuro,
  type Offer,
} from "./data/offers";
import { DEFAULT_TCO, computeTco, eur, type TcoInput } from "./lib/tco";

const DEFAULT_QUERY: SearchQuery = {
  dealType: "acquisto",
  countries: ["IT", "DE", "FR", "ES"],
  brand: "Volkswagen",
  model: "Golf",
  budgetMax: 30000,
  yearMin: 2020,
  fuel: "Tutti",
  maxKm: 100000,
};

const DEAL_LABEL: Record<DealType, string> = {
  acquisto: "Acquisto",
  noleggio: "Noleggio",
  leasing: "Leasing",
};

const UNIT_HINT: Record<DealType, string> = {
  acquisto: "Budget max (€)",
  noleggio: "Tariffa max (€/giorno)",
  leasing: "Rata max (€/mese)",
};

function loadShortlist(): Offer[] {
  try {
    const raw = localStorage.getItem("rotta-shortlist");
    return raw ? (JSON.parse(raw) as Offer[]) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [query, setQuery] = useState<SearchQuery>(DEFAULT_QUERY);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [providers, setProviders] = useState<string[]>([]);
  const [shortlist, setShortlist] = useState<Offer[]>(() => loadShortlist());
  const [tco, setTco] = useState<TcoInput>(DEFAULT_TCO);

  const markets = useMemo(() => matchingMarketplaces(query), [query]);
  const tcoResult = useMemo(() => computeTco(tco), [tco]);

  useEffect(() => {
    localStorage.setItem("rotta-shortlist", JSON.stringify(shortlist));
  }, [shortlist]);

  async function runSearch() {
    setLoading(true);
    setSearched(true);
    const result = await searchOffers(query);
    setOffers(result.offers);
    setProviders(result.providerHint);
    setLoading(false);
    document.getElementById("risultati")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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

  function applyOfferToTco(offer: Offer) {
    if (offer.dealType === "acquisto") {
      setTco((t) => ({ ...t, purchasePrice: Math.round(toEuro(offer.price, offer.currency)) }));
    } else if (offer.dealType === "leasing") {
      setTco((t) => ({ ...t, leaseMonthly: offer.price }));
    } else {
      setTco((t) => ({ ...t, rentDaily: offer.price }));
    }
    document.getElementById("confronto")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top">
          <span className="brand-mark">Rotta</span>
          <span className="brand-tag">desk auto Europa</span>
        </a>
        <nav className="nav-links">
          <a href="#ricerca">Ricerca</a>
          <a href="#mercati">Mercati</a>
          <a href="#confronto">Confronto costi</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <motion.p
          className="hero-kicker"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          Broker desk
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
          Trova e confronta le migliori offerte europee di acquisto, noleggio e leasing
          in un solo desk operativo.
        </motion.p>
        <motion.div
          className="cta-row"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
        >
          <a className="btn btn-primary" href="#ricerca">
            Avvia ricerca
          </a>
          <a className="btn btn-ghost" href="#confronto">
            Confronta i costi
          </a>
        </motion.div>
      </section>

      <section className="section" id="ricerca">
        <div className="section-head">
          <div>
            <h2>Ricerca multi-mercato</h2>
            <p>
              Filtra per formula commerciale e paesi, poi apri i marketplace europei già
              precompilati o lavora sulle offerte campione.
            </p>
          </div>
        </div>

        <div className="search-panel">
          <div className="deal-tabs">
            {(Object.keys(DEAL_LABEL) as DealType[]).map((type) => (
              <button
                key={type}
                type="button"
                className={`deal-tab${query.dealType === type ? " active" : ""}`}
                onClick={() => setQuery((q) => ({ ...q, dealType: type }))}
              >
                {DEAL_LABEL[type]}
              </button>
            ))}
          </div>

          <div className="grid-fields">
            <div className="field">
              <label htmlFor="brand">Marca</label>
              <select
                id="brand"
                value={query.brand}
                onChange={(e) => setQuery((q) => ({ ...q, brand: e.target.value }))}
              >
                <option value="">Tutte</option>
                {BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="model">Modello</label>
              <input
                id="model"
                value={query.model}
                onChange={(e) => setQuery((q) => ({ ...q, model: e.target.value }))}
                placeholder="es. Golf, 308, ID.3"
              />
            </div>
            <div className="field">
              <label htmlFor="budget">{UNIT_HINT[query.dealType]}</label>
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
                min={2000}
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
              <label htmlFor="km">Km max (acquisto)</label>
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

          <div className="countries" aria-label="Paesi">
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
              {markets.length} marketplace pronti · {query.countries.length || "tutti i"} paesi
              selezionati
            </p>
            <button type="button" className="btn btn-primary" onClick={runSearch} disabled={loading}>
              {loading ? "Cerco…" : "Cerca offerte"}
            </button>
          </div>

          <div className="banner-sample">
            <strong>Dati campione.</strong> Le schede sotto sono sample per il workflow broker.
            Per feed live collegheremo un provider: {providers.length ? providers.join(", ") : "AutoScout24, Mobile.de, Autobiz, DiscoverCars, Ayvens/Arval/Leasys"}.
          </div>
        </div>
      </section>

      <section className="section" id="risultati">
        <div className="section-head">
          <div>
            <h2>Offerte</h2>
            <p>Ordinate per score Rotta (prezzo, km, completezza annuncio, competitività paese).</p>
          </div>
        </div>

        {searched && (
          <div className="results-meta">
            <span>{loading ? "Aggiornamento…" : `${offers.length} risultati`}</span>
            <span>Formula: {DEAL_LABEL[query.dealType]}</span>
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
                        {offer.km ? `${offer.km.toLocaleString("it-IT")} km` : "nuovo"} ·{" "}
                        {offer.fuel} · {offer.transmission}
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
                        {saved ? "In shortlist" : "Salva"}
                      </button>
                      <button type="button" className="btn btn-primary" onClick={() => applyOfferToTco(offer)}>
                        Usa nel TCO
                      </button>
                    </div>
                  </motion.article>
                );
              })}
          </AnimatePresence>
          {searched && !loading && offers.length === 0 && (
            <p className="empty-inline">
              Nessuna offerta campione con questi filtri. Allarga budget, anni o paesi, oppure apri i
              marketplace sotto.
            </p>
          )}
          {!searched && (
            <p className="empty-inline">Imposta i filtri e avvia la ricerca per vedere le offerte.</p>
          )}
        </div>
      </section>

      <section className="section" id="mercati">
        <div className="section-head">
          <div>
            <h2>Marketplace europei</h2>
            <p>Deep-link pronti con i tuoi filtri: aprili in parallelo mentre tratti l’affare.</p>
          </div>
        </div>
        <div className="markets-grid">
          {markets.map((m) => (
            <a
              key={m.id}
              className="market-link"
              href={m.buildUrl(query)}
              target="_blank"
              rel="noreferrer"
            >
              <strong>{m.name}</strong>
              <span>
                {m.countries.filter((c) => query.countries.includes(c) || !query.countries.length).join(", ") ||
                  m.countries.join(", ")}{" "}
                · {m.dealTypes.map((d) => DEAL_LABEL[d]).join(" / ")}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="confronto">
        <div className="section-head">
          <div>
            <h2>Confronto costi</h2>
            <p>Stima rapida acquisto vs leasing vs noleggio sullo stesso orizzonte di utilizzo.</p>
          </div>
        </div>

        <div className="split-2">
          <div className="panel">
            <h3>Parametri</h3>
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
                  ["leaseMonthly", "Leasing €/mese"],
                  ["leaseMonths", "Mesi leasing"],
                  ["leaseUpfront", "Anticipo leasing"],
                  ["leaseIncludedKm", "Km inclusi / anno"],
                  ["rentDaily", "Noleggio €/giorno"],
                  ["rentDays", "Giorni noleggio"],
                  ["rentExtrasDay", "Extra €/giorno"],
                ] as Array<[keyof TcoInput, string]>
              ).map(([key, label]) => (
                <div className="field" key={key}>
                  <label htmlFor={key}>{label}</label>
                  <input
                    id={key}
                    type="number"
                    value={tco[key]}
                    onChange={(e) =>
                      setTco((prev) => ({ ...prev, [key]: Number(e.target.value) || 0 }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3>Esito sul tuo scenario</h3>
            <div className="tco-result">
              <div className={`metric${tcoResult.best === "acquisto" ? " best" : ""}`}>
                <div className="label">Acquisto (costo netto periodo)</div>
                <div className="value">{eur(tcoResult.purchaseTotal)}</div>
                <div className="label">≈ {eur(tcoResult.purchaseMonthly)}/mese</div>
              </div>
              <div className={`metric${tcoResult.best === "leasing" ? " best" : ""}`}>
                <div className="label">Leasing (totale contratto)</div>
                <div className="value">{eur(tcoResult.leaseTotal)}</div>
                <div className="label">≈ {eur(tcoResult.leaseMonthlyEffective)}/mese effettivi</div>
              </div>
              <div className={`metric${tcoResult.best === "noleggio" ? " best" : ""}`}>
                <div className="label">Noleggio (periodo scelto)</div>
                <div className="value">{eur(tcoResult.rentTotal)}</div>
                <div className="label">≈ {eur(tcoResult.rentDailyEffective)}/giorno</div>
              </div>
              <div className="banner-sample">
                <strong>Preferibile: {DEAL_LABEL[tcoResult.best]}.</strong>{" "}
                {tcoResult.notes.join(" ")}
              </div>
            </div>

            <h3 style={{ marginTop: "1.25rem" }}>Shortlist</h3>
            <div className="shortlist">
              {shortlist.length === 0 && (
                <p className="empty-inline">Salva offerte dalla lista per confrontarle qui.</p>
              )}
              {shortlist.map((o) => (
                <div className="short-item" key={o.id}>
                  <div>
                    <strong>{o.title}</strong>
                    <div className="offer-meta">
                      {o.country} · {priceLabel(o)} · {DEAL_LABEL[o.dealType]}
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
        <span>Rotta — desk operativo per broker auto in Europa.</span>
        <span>Sample data oggi · provider live quando scegli l’API.</span>
      </footer>
    </div>
  );
}
