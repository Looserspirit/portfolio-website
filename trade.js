let portfolio = null;

document.addEventListener("DOMContentLoaded", () => {
  populateTickerSelect();
  document.getElementById("tickerSelect").addEventListener("change", updateSelectedPrice);
  hideLoader();
});

function populateTickerSelect() {
  const select = document.getElementById("tickerSelect");
  const allTickers = getAllTickers();
  select.innerHTML = allTickers
    .map((t) => `<option value="${t.symbol}">${t.symbol} - ${t.name}</option>`)
    .join("");
  updateSelectedPrice();
}

function currentPrice(symbol) {
  const t = getAllTickers().find((x) => x.symbol === symbol);
  return t ? t.price : 0;
}

function updateSelectedPrice() {
  const symbol = document.getElementById("tickerSelect").value;
  document.getElementById("selectedPrice").textContent = formatMoney(currentPrice(symbol));
}

// Demo Start Logic
document.getElementById("startBtn").addEventListener("click", () => {
  const raw = document.getElementById("startingBalanceInput").value;
  const amount = parseFloat(raw);
  if (!amount || amount <= 0) return;

  portfolio = { startingBalance: amount, cash: amount, holdings: {}, trades: [] };
  document.getElementById("setupPanel").hidden = true;
  document.getElementById("portfolioView").hidden = false;
  document.getElementById("resetBtn").hidden = false;
  renderPortfolio();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  portfolio = null;
  document.getElementById("setupPanel").hidden = false;
  document.getElementById("portfolioView").hidden = true;
  document.getElementById("resetBtn").hidden = true;
  document.getElementById("startingBalanceInput").value = "";
});

// Buy Stock
document.getElementById("buyBtn").addEventListener("click", () => {
  const symbol = document.getElementById("tickerSelect").value;
  const qty = parseInt(document.getElementById("qtyInput").value, 10);
  if (!qty || qty <= 0 || !portfolio) return;

  const price = currentPrice(symbol);
  const cost = price * qty;
  if (cost > portfolio.cash) return alert("Insufficient cash!");

  const existing = portfolio.holdings[symbol];
  if (existing) {
    existing.avgCost = (existing.avgCost * existing.qty + cost) / (existing.qty + qty);
    existing.qty += qty;
  } else {
    portfolio.holdings[symbol] = { qty, avgCost: price };
  }
  portfolio.cash -= cost;
  renderPortfolio();
});

// Sell Stock
document.getElementById("sellBtn").addEventListener("click", () => {
  const symbol = document.getElementById("tickerSelect").value;
  const qty = parseInt(document.getElementById("qtyInput").value, 10);
  if (!qty || qty <= 0 || !portfolio) return;

  const holding = portfolio.holdings[symbol];
  if (!holding || holding.qty < qty) return alert("Not enough shares to sell!");

  const price = currentPrice(symbol);
  holding.qty -= qty;
  if (holding.qty === 0) delete portfolio.holdings[symbol];
  portfolio.cash += price * qty;
  renderPortfolio();
});

function renderPortfolio() {
  let holdingsVal = 0;
  const body = document.getElementById("holdingsBody");
  body.innerHTML = "";

  Object.entries(portfolio.holdings).forEach(([sym, h]) => {
    const val = currentPrice(sym) * h.qty;
    holdingsVal += val;
    body.innerHTML += `<tr><td>${sym}</td><td>${h.qty}</td><td>${formatMoney(h.avgCost)}</td><td>${formatMoney(currentPrice(sym))}</td><td>${formatMoney(val)}</td></tr>`;
  });

  const totalVal = portfolio.cash + holdingsVal;
  document.getElementById("statCash").textContent = formatMoney(portfolio.cash);
  document.getElementById("statHoldings").textContent = formatMoney(holdingsVal);
  document.getElementById("statTotal").textContent = formatMoney(totalVal);
  document.getElementById("statPnl").textContent = formatMoney(totalVal - portfolio.startingBalance);
}