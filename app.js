document.addEventListener("DOMContentLoaded", () => {
    // Check Login Session
    const currentUser = localStorage.getItem("activeUser");
    if (!currentUser) {
      window.location.href = "login.html";
      return;
    }
    document.getElementById("profileUserDisplay").textContent = `User: ${currentUser}`;
  
    // Notification Dropdown Toggle & Red Dot Clear
    const notifBtn = document.getElementById("notifBtn");
    const notifDropdown = document.getElementById("notifDropdown");
    const unreadDot = document.getElementById("unreadDot");
  
    notifBtn.addEventListener("click", () => {
      notifDropdown.hidden = !notifDropdown.hidden;
      if (!notifDropdown.hidden) {
        unreadDot.style.display = "none"; // Hide red dot once opened
      }
    });
  
    // Profile Dropdown Toggle
    const profileBtn = document.getElementById("profileBtn");
    const profileDropdown = document.getElementById("profileDropdown");
  
    profileBtn.addEventListener("click", () => {
      profileDropdown.hidden = !profileDropdown.hidden;
    });
  
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("activeUser");
      window.location.href = "login.html";
    });
  
    document.getElementById("switchUserBtn").addEventListener("click", () => {
      window.location.href = "login.html";
    });
  
    // Render Categorized Market Data
    renderCategories();
    hideLoader();
  });
  
  function renderCategories() {
    const container = document.getElementById("categoryContainer");
    container.innerHTML = "";
  
    SAMPLE_DATA.categories.forEach(cat => {
      const sec = document.createElement("section");
      sec.className = "section";
  
      const label = document.createElement("div");
      label.className = "section__label";
      label.innerHTML = `<span>${cat.name}</span>`;
      sec.appendChild(label);
  
      const grid = document.createElement("div");
      grid.className = "flap-grid";
  
      cat.tickers.forEach(t => {
        const isUp = t.change_pct > 0;
        const card = document.createElement("div");
        card.className = "flap-card";
        card.innerHTML = `
          <div class="flap-card__symbol">${t.symbol}</div>
          <div style="font-size: 0.75rem; color: var(--ink-dim);">${t.name}</div>
          <div class="flap-card__price">$${t.price.toFixed(2)}</div>
          <div class="flap-card__change ${isUp ? "is-up" : "is-down"}">${formatPct(t.change_pct)}</div>
        `;
        grid.appendChild(card);
      });
  
      sec.appendChild(grid);
      container.appendChild(sec);
    });
  }