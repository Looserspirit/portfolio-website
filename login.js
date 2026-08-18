document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const input = document.getElementById("whoInput");
    const errorEl = document.getElementById("loginError");
    const value = input.value.trim();
  
    if (value) {
      localStorage.setItem("activeUser", value);
      window.location.href = "index.html";
    } else {
      errorEl.hidden = false;
      input.focus();
    }
  });