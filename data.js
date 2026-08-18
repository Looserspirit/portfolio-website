// Central Data Layer
const SAMPLE_DATA = {
    updated_at: new Date().toISOString(),
    market_open: true,
    aggregate_move_pct: 1.4,
    categories: [
      {
        name: "US Stocks (Stocks to Buy)",
        tickers: [
          { symbol: "NVDA", name: "Nvidia", price: 178.55, change_pct: 4.1 },
          { symbol: "QQC", name: "QQC", price: 112.40, change_pct: 0.8 },
          { symbol: "GOOGL", name: "Google", price: 196.80, change_pct: 0.9 },
          { symbol: "AMZN", name: "Amazon (robotics)", price: 228.15, change_pct: 1.5 },
          { symbol: "MU", name: "Micron (robotics)", price: 98.40, change_pct: 2.1 },
          { symbol: "AMD", name: "AMD", price: 168.90, change_pct: 2.8 },
          { symbol: "MSFT", name: "Microsoft", price: 512.10, change_pct: 0.6 },
          { symbol: "META", name: "Meta", price: 612.40, change_pct: -0.4 },
          { symbol: "QCOM", name: "Qualcomm (robotics)", price: 172.30, change_pct: 1.1 },
          { symbol: "IBM", name: "IBM", price: 215.60, change_pct: -0.2 }
        ]
      },
      {
        name: "Canadian Stocks",
        tickers: [
          { symbol: "SHOP.TO", name: "Shopify", price: 105.20, change_pct: 3.2 },
          { symbol: "T.TO", name: "Telus", price: 21.80, change_pct: -0.5 },
          { symbol: "TD.TO", name: "TD Bank", price: 81.50, change_pct: 0.4 },
          { symbol: "RY.TO", name: "Royal Bank", price: 162.10, change_pct: 0.7 }
        ]
      },
      {
        name: "ETFs",
        tickers: [
          { symbol: "QQC.TO", name: "QQC ETF", price: 31.40, change_pct: 0.9 },
          { symbol: "XEQT.TO", name: "XEQT", price: 32.10, change_pct: 0.5 },
          { symbol: "VDY.TO", name: "VDY", price: 44.80, change_pct: 0.2 },
          { symbol: "TDB.TO", name: "TD ETF", price: 25.60, change_pct: 0.1 },
          { symbol: "XIC.TO", name: "XIC", price: 38.90, change_pct: 0.4 },
          { symbol: "XEI.TO", name: "XEI", price: 27.30, change_pct: -0.1 }
        ]
      }
    ]
  };
  
  function getAllTickers() {
    let list = [];
    SAMPLE_DATA.categories.forEach(cat => {
      list = list.concat(cat.tickers);
    });
    return list;
  }
  
  function formatPct(value) {
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  }
  
  function formatMoney(value) {
    const sign = value < 0 ? "-" : "";
    return `${sign}$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  
  function hideLoader() {
    const loader = document.getElementById("pageLoader");
    if (loader) loader.classList.add("loader-overlay--hidden");
  }