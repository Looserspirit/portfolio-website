// ---------------------------------------------------------------
// Market Watch dashboard — rendering logic.
// Data loading, sample data, and formatters live in data.js
// (loaded before this file), shared with trade.js on the other page.
// ---------------------------------------------------------------

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function renderHero(data) {
  const move = data.aggregate_move_pct;
  const isUp = move > 0;
  const isDown = move < 0;

  const arrowEl = document.getElementById("heroArrow");
  arrowEl.textContent = isUp ? "▲" : isDown ? "▼" : "—";
  arrowEl.className = "hero__arrow " + (isUp ? "is-up" : isDown ? "is-down" : "");

  const valueEl = document.getElementById("heroValue");
  valueEl.textContent = formatPct(move);
  valueEl.className = "hero__value " + (isUp ? "is-up" : isDown ? "is-down" : "");

  document.getElementById("heroCaption").textContent =
    `aggregate move across ${data.tickers.length} names` +
    (data.market_open ? "" : " · market closed");

  const tierEl = document.getElementById("heroTier");
  if (data.tier_alert) {
    tierEl.hidden = false;
    tierEl.textContent = `tier ${data.tier_alert} alert sent today`;
  } else {
    tierEl.hidden = true;
  }
}

function renderFlapGrid(data) {
  const grid = document.getElementById("flapGrid");
  grid.innerHTML = "";
  data.tickers.forEach((t, i) => {
    const isUp = t.change_pct > 0;
    const isDown = t.change_pct < 0;
    const card = document.createElement("div");
    card.className = "flap-card";
    card.setAttribute("role", "listitem");
    card.style.animationDelay = `${i * 40}ms`;
    card.innerHTML = `
      <div class="flap-card__symbol">${t.symbol}</div>
      <div class="flap-card__price">$${t.price.toFixed(2)}</div>
      <div class="flap-card__change ${isUp ? "is-up" : isDown ? "is-down" : ""}">${formatPct(t.change_pct)}</div>
    `;
    grid.appendChild(card);
  });
}

function renderLedger(data) {
  const ledger = document.getElementById("ledger");
  ledger.innerHTML = "";
  data.log.forEach((entry) => {
    const isUp = entry.aggregate_move_pct > 0;
    const isDown = entry.aggregate_move_pct < 0;
    const movers = entry.top_movers
      .map((m) => `${m.symbol} ${formatPct(m.change_pct)}`)
      .join("  ·  ");

    const li = document.createElement("li");
    li.className = "ledger__row";
    li.innerHTML = `
      <span class="ledger__date">${entry.date}</span>
      <span class="ledger__move ${isUp ? "is-up" : isDown ? "is-down" : ""}">${formatPct(entry.aggregate_move_pct)}</span>
      <span class="ledger__movers">${movers}</span>
    `;
    ledger.appendChild(li);
  });
}

let firstLoad = true;

async function refresh() {
  const data = await loadData();
  document.getElementById("tickerCount").textContent = `${data.tickers.length} names tracked`;
  document.getElementById("updatedAt").textContent = "updated " + formatTime(data.updated_at);
  renderHero(data);
  renderFlapGrid(data);
  renderLedger(data);
  if (firstLoad) { hideLoader(); firstLoad = false; }
}

document.getElementById("refreshBtn").addEventListener("click", refresh);

refresh();
setInterval(refresh, REFRESH_INTERVAL_MS);
