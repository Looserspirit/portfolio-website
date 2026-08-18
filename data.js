// ---------------------------------------------------------------
// Shared data layer for Market Watch + Paper Trading.
// Both pages read live prices from the same source so a price on
// one screen always matches the other.
// ---------------------------------------------------------------

const DATA_URL = "data/latest.json";

const SAMPLE_DATA = {
  updated_at: new Date().toISOString(),
  market_open: true,
  aggregate_move_pct: 1.8,
  tier_alert: 2,
  tickers: [
    { symbol: "AAPL", price: 231.42, change_pct: 1.2 },
    { symbol: "MSFT", price: 512.10, change_pct: 0.6 },
    { symbol: "NVDA", price: 178.55, change_pct: 4.1 },
    { symbol: "TSLA", price: 244.30, change_pct: -2.0 },
    { symbol: "GOOGL", price: 196.80, change_pct: 0.9 },
    { symbol: "AMZN", price: 228.15, change_pct: 1.5 },
    { symbol: "META", price: 612.40, change_pct: -0.4 },
    { symbol: "AMD", price: 168.90, change_pct: 2.8 }
  ],
  log: [
    { date: "2026-08-18", aggregate_move_pct: 1.8, top_movers: [{ symbol: "NVDA", change_pct: 4.1 }, { symbol: "TSLA", change_pct: -2.0 }] },
    { date: "2026-08-17", aggregate_move_pct: -0.6, top_movers: [{ symbol: "AMD", change_pct: -3.1 }, { symbol: "META", change_pct: 1.9 }] },
    { date: "2026-08-14", aggregate_move_pct: 0.4, top_movers: [{ symbol: "AAPL", change_pct: 1.7 }, { symbol: "TSLA", change_pct: -1.2 }] }
  ]
};

async function loadData() {
  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("no data file yet");
    return await res.json();
  } catch (err) {
    console.warn("Using sample data —", err.message);
    return SAMPLE_DATA;
  }
}

function formatPct(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function formatMoney(value) {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) +
    " ET · " + d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function hideLoader() {
  const loader = document.getElementById("pageLoader");
  if (loader) loader.classList.add("loader-overlay--hidden");
}
