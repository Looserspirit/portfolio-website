// ---------------------------------------------------------------
// Paper Trading — simulated portfolio using live-feed prices.
// State lives only in memory for this tab: no localStorage, so it
// resets on reload. Wire this to Render's Key Value store (or any
// backend) if you want it to persist across sessions.
// ---------------------------------------------------------------

let marketData = null;
let portfolio = null; // { startingBalance, cash, holdings: { SYM: {qty, avgCost} }, trades: [] }

async function init() {
  marketData = await loadData();
  populateTickerSelect();
  document.getElementById("tickerSelect").addEventListener("change", updateSelectedPrice);
  updateSelectedPrice();
  hideLoader();
}

function populateTickerSelect() {
  const select = document.getElementById("tickerSelect");
  select.innerHTML = marketData.tickers
    .map((t) => `<option value="${t.symbol}">${t.symbol}</option>`)
    .join("");
}

function currentPrice(symbol) {
  const t = marketData.tickers.find((x) => x.symbol === symbol);
  return t ? t.price : 0;
}

function updateSelectedPrice() {
  const symbol = document.getElementById("tickerSelect").value;
  document.getElementById("selectedPrice").textContent = formatMoney(currentPrice(symbol));
}

function showError(message) {
  const el = document.getElementById("tradeError");
  el.textContent = message;
  el.hidden = false;
  setTimeout(() => { el.hidden = true; }, 3000);
}

// --- Starting the demo ---

document.getElementById("startBtn").addEventListener("click", () => {
  const raw = document.getElementById("startingBalanceInput").value;
  const amount = parseFloat(raw);
  if (!amount || amount <= 0) {
    document.getElementById("startingBalanceInput").focus();
    return;
  }
  portfolio = { startingBalance: amount, cash: amount, holdings: {}, trades: [] };
  document.getElementById("setupPanel").hidden = true;
  document.getElementById("portfolioView").hidden = false;
  document.getElementById("resetBtn").hidden = false;
  document.getElementById("statusLine").textContent = "trading with simulated money";
  renderPortfolio();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  portfolio = null;
  document.getElementById("setupPanel").hidden = false;
  document.getElementById("portfolioView").hidden = true;
  document.getElementById("resetBtn").hidden = true;
  document.getElementById("statusLine").textContent = "practice with fake money, real prices";
  document.getElementById("startingBalanceInput").value = "";
});

// --- Buy / sell ---

document.getElementById("buyBtn").addEventListener("click", () => {
  const symbol = document.getElementById("tickerSelect").value;
  const qty = parseInt(document.getElementById("qtyInput").value, 10);
  if (!qty || qty <= 0) return showError("Enter a quantity greater than 0.");

  const price = currentPrice(symbol);
  const cost = price * qty;
  if (cost > portfolio.cash) return showError(`Not enough cash — this trade costs ${formatMoney(cost)}.`);

  const existing = portfolio.holdings[symbol];
  if (existing) {
    const totalCost = existing.avgCost * existing.qty + cost;
    existing.qty += qty;
    existing.avgCost = totalCost / existing.qty;
  } else {
    portfolio.holdings[symbol] = { qty, avgCost: price };
  }
  portfolio.cash -= cost;
  logTrade("BUY", symbol, qty, price, cost);
  renderPortfolio();
});

document.getElementById("sellBtn").addEventListener("click", () => {
  const symbol = document.getElementById("tickerSelect").value;
  const qty = parseInt(document.getElementById("qtyInput").value, 10);
  if (!qty || qty <= 0) return showError("Enter a quantity greater than 0.");

  const holding = portfolio.holdings[symbol];
  if (!holding || holding.qty < qty) return showError(`You don't own ${qty} shares of ${symbol} to sell.`);

  const price = currentPrice(symbol);
  const proceeds = price * qty;
  holding.qty -= qty;
  if (holding.qty === 0) delete portfolio.holdings[symbol];
  portfolio.cash += proceeds;
  logTrade("SELL", symbol, qty, price, proceeds);
  renderPortfolio();
});

function logTrade(side, symbol, qty, price, total) {
  portfolio.trades.unshift({
    time: new Date(),
    side, symbol, qty, price, total
  });
}

// --- Rendering ---

function holdingsValue() {
  return Object.entries(portfolio.holdings).reduce(
    (sum, [symbol, h]) => sum + h.qty * currentPrice(symbol), 0
  );
}

function renderPortfolio() {
  const holdingsVal = holdingsValue();
  const totalVal = portfolio.cash + holdingsVal;
  const pnl = totalVal - portfolio.startingBalance;

  document.getElementById("statCash").textContent = formatMoney(portfolio.cash);
  document.getElementById("statHoldings").textContent = formatMoney(holdingsVal);
  document.getElementById("statTotal").textContent = formatMoney(totalVal);

  const pnlEl = document.getElementById("statPnl");
  pnlEl.textContent = formatMoney(pnl) + ` (${formatPct((pnl / portfolio.startingBalance) * 100)})`;
  pnlEl.className = "stat__value " + (pnl > 0 ? "is-up" : pnl < 0 ? "is-down" : "");

  renderHoldingsTable();
  renderTradeLog();
  updateSelectedPrice();
}

function renderHoldingsTable() {
  const body = document.getElementById("holdingsBody");
  const emptyNote = document.getElementById("holdingsEmpty");
  const rows = Object.entries(portfolio.holdings);

  if (rows.length === 0) {
    body.innerHTML = "";
    emptyNote.hidden = false;
    return;
  }
  emptyNote.hidden = true;

  body.innerHTML = rows.map(([symbol, h]) => {
    const price = currentPrice(symbol);
    const value = price * h.qty;
    const pnl = (price - h.avgCost) * h.qty;
    const pnlClass = pnl > 0 ? "is-up" : pnl < 0 ? "is-down" : "";
    return `
      <tr>
        <td>${symbol}</td>
        <td>${h.qty}</td>
        <td>${formatMoney(h.avgCost)}</td>
        <td>${formatMoney(price)}</td>
        <td>${formatMoney(value)}</td>
        <td class="${pnlClass}">${formatMoney(pnl)}</td>
      </tr>`;
  }).join("");
}

function renderTradeLog() {
  const log = document.getElementById("tradeLog");
  const emptyNote = document.getElementById("logEmpty");

  if (portfolio.trades.length === 0) {
    log.innerHTML = "";
    emptyNote.hidden = false;
    return;
  }
  emptyNote.hidden = true;

  log.innerHTML = portfolio.trades.map((t) => {
    const sideClass = t.side === "BUY" ? "is-up" : "is-down";
    const timeStr = t.time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    return `
      <li class="ledger__row">
        <span class="ledger__date">${timeStr}</span>
        <span class="ledger__move ${sideClass}">${t.side} ${t.qty} ${t.symbol}</span>
        <span class="ledger__movers">@ ${formatMoney(t.price)} · ${formatMoney(t.total)}</span>
      </li>`;
  }).join("");
}

init();
