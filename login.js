document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const input = document.getElementById("whoInput");
  const errorEl = document.getElementById("loginError");
  const value = input.value.trim().toLowerCase();

  if (value === "admin") {
    window.location.href = "index.html";
  } else {
    errorEl.hidden = false;
    input.focus();
    input.select();
  }
});
