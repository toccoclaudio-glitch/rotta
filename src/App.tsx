import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BRANDS,
  COLOR_OPTIONS,
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

/** Simulazione attiva: brief cliente Grecale Modena. */
const ACTIVE_BRIEF: SearchQuery = {
  dealType: "acquisto",
  countries: ["IT", "DE", "FR", "ES", "BE", "NL"],
  brand: "Maserati",
  model: "Grecale",
  version: "Modena",
  budgetMax: 50000,
  yearMin: 2022,
  fuel: "Tutti",
  maxKm: 80000,
  colors: ["Nero", "Grigio", "Grigio opaco"],
  sunroof: true,
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
  const [clientName, setClientName] = useState("Simulazione Grecale");
  const [clientNote, setClientNote] = useState(
    "Nero o grigio opaco, tetto apribile, max 80.000 km, budget 50.000 €",
  );
  const [query, setQuery] = useState<SearchQuery>(ACTIVE_BRIEF);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [providers, setProviders] = useState<string[]>([]);
  const [shortlist, setShortlist] = useState<Offer[]>(() => loadShortlist());
  const [cost, setCost] = useState<PurchaseCostInput>({
    ...DEFAULT_PURCHASE_COST,
    purchasePrice: 49000,
  });
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

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
    setProviders(result.providerHint);
    setLoading(false);
    if (opts?.scroll !== false) {
      document.getElementById("risultati")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  useEffect(() => {
    void runSearch({ scroll: false, override: ACTIVE_BRIEF });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleCountry(code: CountryCode) {
    setQuery((q) => {
      const has = q.countries.includes(code);
      const countries = has ? q.countries.filter((c) => c !== code) : [...q.countries, code];
      return { ...q, countries };
    });
  }

  function toggleColor(color: string) {
    setQuery((q) => {
      const has = q.colors.includes(color);
      return {
        ...q,
        colors: has ? q.colors.filter((c) => c !== color) : [...q.colors, color],
      };
    });
  }

  function toggleShortlist(offer: Offer) {
    setShortlist((list) => {
      if (list.some((o) => o.id === offer.id)) return list.filter((o) => o.id !== offer.id);
      return [...list, offer];
    });
  }

  function openPhotos(offer: Offer) {
    setActiveOffer(offer);
    setGalleryIndex(0);
  }

  function applyOfferToCost(offer: Offer) {
    setCost((t) => ({
      ...t,
      purchasePrice: Math.round(toEuro(offer.price, offer.currency)),
      importCost:
        offer.country === "IT"
          ? 0
          : Math.max(800, Math.round(toEuro(offer.price, offer.currency) * 0.04)),
    }));
    document.getElementById("costi")?.scrollIntoView({ behavior: "smooth" });
  }

  const requestLabel =
    [query.brand, query.model, query.version].filter(Boolean).join(" ") || "qualsiasi auto";

  const gallery = activeOffer?.gallery?.length ? activeOffer.gallery : activeOffer ? [activeOffer.image] : [];

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
        <motion.p className="hero-kicker" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          Simulazione attiva
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          Rotta
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          Brief pronto: Maserati Grecale Modena, max €50.000, nero/grigio opaco, tetto apribile,
          max 80.000 km — con foto annuncio.
        </motion.p>
        <motion.div className="cta-row" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <a className="btn btn-primary" href="#risultati">
            Vedi offerte con foto
          </a>
          <a className="btn btn-ghost" href="#brief">
            Modifica brief
          </a>
        </motion.div>
      </section>

      <section className="section" id="brief">
        <div className="section-head">
          <div>
            <h2>Brief cliente</h2>
            <p>Richiesta già impostata per la simulazione. Puoi cambiarla e rilanciare la ricerca.</p>
          </div>
        </div>

        <div className="search-panel">
          <div className="grid-fields">
            <div className="field">
              <label htmlFor="client">Cliente</label>
              <input id="client" value={clientName} onChange={(e) => setClientName(e.target.value)} />
            </div>
            <div className="field" style={{ gridColumn: "span 3" }}>
              <label htmlFor="note">Note richiesta</label>
              <input id="note" value={clientNote} onChange={(e) => setClientNote(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="brand">Marca</label>
              <input
                id="brand"
                list="brand-list"
                value={query.brand}
                onChange={(e) => setQuery((q) => ({ ...q, brand: e.target.value }))}
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
              />
            </div>
            <div className="field">
              <label htmlFor="version">Allestimento</label>
              <input
                id="version"
                value={query.version}
                onChange={(e) => setQuery((q) => ({ ...q, version: e.target.value }))}
                placeholder="es. Modena"
              />
            </div>
            <div className="field">
              <label htmlFor="budget">Budget max (€)</label>
              <input
                id="budget"
                type="number"
                value={query.budgetMax || ""}
                onChange={(e) => setQuery((q) => ({ ...q, budgetMax: Number(e.target.value) || 0 }))}
              />
            </div>
            <div className="field">
              <label htmlFor="year">Anno da</label>
              <input
                id="year"
                type="number"
                value={query.yearMin || ""}
                onChange={(e) => setQuery((q) => ({ ...q, yearMin: Number(e.target.value) || 0 }))}
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
                step={5000}
                value={query.maxKm || ""}
                onChange={(e) => setQuery((q) => ({ ...q, maxKm: Number(e.target.value) || 0 }))}
              />
            </div>
            <div className="field">
              <label htmlFor="sunroof">Tetto apribile</label>
              <select
                id="sunroof"
                value={query.sunroof ? "si" : "no"}
                onChange={(e) => setQuery((q) => ({ ...q, sunroof: e.target.value === "si" }))}
              >
                <option value="si">Obbligatorio</option>
                <option value="no">Non richiesto</option>
              </select>
            </div>
          </div>

          <div className="countries" aria-label="Colori">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                className={`chip${query.colors.includes(c) ? " active" : ""}`}
                onClick={() => toggleColor(c)}
              >
                {c}
              </button>
            ))}
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
              {clientName ? ` · ${clientName}` : ""} · tetto {query.sunroof ? "obbligatorio" : "libero"} ·{" "}
              {markets.length} marketplace
            </p>
            <button type="button" className="btn btn-primary" onClick={() => void runSearch()} disabled={loading}>
              {loading ? "Cerco…" : "Cerca in Europa"}
            </button>
          </div>

          <div className="banner-sample">
            <strong>Simulazione operativa.</strong> Offerte con foto da annunci reali AutoScout24
            (snapshot). Marketplace sotto aprono la ricerca live. Fonti:{" "}
            {providers.join(", ") || "AutoScout24, Mobile.de, Subito"}.
          </div>
        </div>
      </section>

      <section className="section" id="risultati">
        <div className="section-head">
          <div>
            <h2>Offerte in vendita</h2>
            <p>Clicca la foto o “Vedi foto” per aprire la galleria dell’annuncio.</p>
          </div>
        </div>

        {searched && (
          <div className="results-meta">
            <span>{loading ? "Aggiornamento…" : `${offers.length} risultati`}</span>
            <span>
              {requestLabel} · max {query.budgetMax.toLocaleString("it-IT")} € · max{" "}
              {query.maxKm.toLocaleString("it-IT")} km
            </span>
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
                    className="offer-row offer-row-photo"
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28, delay: index * 0.03 }}
                  >
                    <button type="button" className="offer-photo" onClick={() => openPhotos(offer)}>
                      <img src={offer.image} alt={offer.title} loading="lazy" />
                      <span>{offer.gallery.length || 1} foto</span>
                    </button>
                    <div>
                      <h3 className="offer-title">{offer.title}</h3>
                      <p className="offer-meta">
                        {offer.city}, {offer.country} · {offer.year} · {offer.km.toLocaleString("it-IT")} km ·{" "}
                        {offer.color}
                        {offer.sunroof ? " · Tetto apribile" : ""} · {offer.fuel}
                      </p>
                      {offer.matchNote && <p className="match-note">{offer.matchNote}</p>}
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
                      <button type="button" className="btn btn-primary" onClick={() => openPhotos(offer)}>
                        Vedi foto
                      </button>
                      <a className="btn btn-ghost" href={offer.sourceUrl} target="_blank" rel="noreferrer">
                        Apri annuncio
                      </a>
                      <button type="button" className="btn btn-ghost" onClick={() => toggleShortlist(offer)}>
                        {saved ? "In shortlist" : "Salva"}
                      </button>
                      <button type="button" className="btn btn-ghost" onClick={() => applyOfferToCost(offer)}>
                        Stima costi
                      </button>
                    </div>
                  </motion.article>
                );
              })}
          </AnimatePresence>
          {searched && !loading && offers.length === 0 && (
            <p className="empty-inline">
              Nessuna offerta nel catalogo con tetto + colore richiesti. Togli “tetto obbligatorio”
              per vedere i near-miss, oppure apri i marketplace sotto.
            </p>
          )}
        </div>
      </section>

      <section className="section" id="mercati">
        <div className="section-head">
          <div>
            <h2>Marketplace di vendita</h2>
            <p>Link filtrati sulla Grecale Modena del brief — ricerca live sui portali.</p>
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
                · {requestLabel}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="costi">
        <div className="section-head">
          <div>
            <h2>Costo di possesso</h2>
            <p>Stima per presentare al cliente il costo reale dell’acquisto.</p>
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
            <h3>Sintesi per {clientName || "il cliente"}</h3>
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
                <div className="label">Gestione</div>
                <div className="value">{eur(costResult.running)}</div>
              </div>
            </div>
            <h3 style={{ marginTop: "1.25rem" }}>Shortlist</h3>
            <div className="shortlist">
              {shortlist.length === 0 && (
                <p className="empty-inline">Salva le proposte da mostrare al cliente.</p>
              )}
              {shortlist.map((o) => (
                <div className="short-item" key={o.id}>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <img
                      src={o.image}
                      alt=""
                      width={64}
                      height={48}
                      style={{ objectFit: "cover", borderRadius: 8 }}
                    />
                    <div>
                      <strong>{o.title}</strong>
                      <div className="offer-meta">
                        {o.color} · {priceLabel(o)}
                      </div>
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
        <span>Rotta — desk acquisto auto Europa · simulazione Grecale Modena</span>
        <span>https://toccoclaudio-glitch.github.io/rotta/</span>
      </footer>

      <AnimatePresence>
        {activeOffer && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveOffer(null)}
          >
            <motion.div
              className="lightbox-card"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="lightbox-head">
                <div>
                  <strong>{activeOffer.title}</strong>
                  <div className="offer-meta">
                    {activeOffer.city} · {activeOffer.color}
                    {activeOffer.sunroof ? " · Tetto" : ""} · {priceLabel(activeOffer)}
                  </div>
                </div>
                <button type="button" className="btn btn-ghost" onClick={() => setActiveOffer(null)}>
                  Chiudi
                </button>
              </div>
              <img className="lightbox-main" src={gallery[galleryIndex]} alt={activeOffer.title} />
              <div className="lightbox-thumbs">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    className={i === galleryIndex ? "active" : ""}
                    onClick={() => setGalleryIndex(i)}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
              <div className="lightbox-actions">
                <a className="btn btn-primary" href={activeOffer.sourceUrl} target="_blank" rel="noreferrer">
                  Apri annuncio originale
                </a>
                <button type="button" className="btn btn-ghost" onClick={() => toggleShortlist(activeOffer)}>
                  Salva in shortlist
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
