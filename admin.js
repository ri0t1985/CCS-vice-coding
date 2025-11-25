const ADMIN_PASSPHRASE = "ADMIN";
const ADMIN_STORAGE_KEY = "adminToken";

const loginSection = document.getElementById("adminLoginSection");
const dashboardSection = document.getElementById("adminDashboardSection");
const loginForm = document.getElementById("adminLoginForm");
const passInput = document.getElementById("adminPass");
const loginError = document.getElementById("adminLoginError");
const logoutBtn = document.getElementById("adminLogoutBtn");
const productsBody = document.getElementById("adminProductsBody");

const PRODUCT_SUMMARIES = {
  apple: {
    sku: "APL-001",
    tagline: "Keeps the doctor away (unless you throw it at them).",
    status: "In stock",
  },
  banana: {
    sku: "BAN-002",
    tagline: "Nature's energy bar. Also, giraffes approve!",
    status: "Hot seller",
  },
  lemon: {
    sku: "LEM-003",
    tagline: "When life gives you lemons, make a website.",
    status: "In stock",
  },
};

function getProductCatalog() {
  if (typeof PRODUCTS !== "undefined") {
    return PRODUCTS;
  }
  // Fallback if shop.js is unavailable
  return {
    apple: { name: "Apple", emoji: "🍏" },
    banana: { name: "Banana", emoji: "🍌" },
    lemon: { name: "Lemon", emoji: "🍋" },
  };
}

function isAdminAuthenticated() {
  return localStorage.getItem(ADMIN_STORAGE_KEY) === ADMIN_PASSPHRASE;
}

function setAuthenticated(value) {
  if (value) {
    localStorage.setItem(ADMIN_STORAGE_KEY, ADMIN_PASSPHRASE);
  } else {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }
}

function toggleViews() {
  const authenticated = isAdminAuthenticated();
  loginSection.style.display = authenticated ? "none" : "block";
  dashboardSection.style.display = authenticated ? "block" : "none";
  if (authenticated) {
    renderProductOverview();
    passInput.value = "";
    loginError.textContent = "";
  }
}

function renderProductOverview() {
  const catalog = getProductCatalog();
  const rows = Object.entries(catalog)
    .map(([id, product]) => {
      const summary = PRODUCT_SUMMARIES[id] || {};
      const enabled =
        typeof isProductEnabled === "function" ? isProductEnabled(id) : true;
      return `
        <tr>
          <td class="admin-emoji">${product.emoji || "🍇"}</td>
          <td>${product.name || id}</td>
          <td>${summary.sku || id.toUpperCase()}</td>
          <td>${summary.tagline || "No description"}</td>
          <td>${summary.status || "TBD"}</td>
          <td>
            <label class="toggle-switch">
              <input
                type="checkbox"
                data-visibility-toggle="${id}"
                ${enabled ? "checked" : ""}
                aria-label="Toggle ${product.name || id} visibility"
              />
              <span>${enabled ? "Enabled" : "Disabled"}</span>
            </label>
          </td>
        </tr>
      `;
    })
    .join("");
  productsBody.innerHTML = rows;
  attachVisibilityHandlers();
}

function attachVisibilityHandlers() {
  const toggles = document.querySelectorAll("[data-visibility-toggle]");
  toggles.forEach((toggle) => {
    toggle.addEventListener("change", (event) => {
      const productId = event.target.dataset.visibilityToggle;
      if (typeof setProductEnabled === "function") {
        setProductEnabled(productId, event.target.checked);
      }
      renderProductOverview();
    });
  });
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const passphrase = passInput.value.trim();
  if (passphrase.toUpperCase() === ADMIN_PASSPHRASE) {
    setAuthenticated(true);
    toggleViews();
  } else {
    loginError.textContent = "Incorrect passphrase. Please try again.";
  }
});

logoutBtn.addEventListener("click", () => {
  setAuthenticated(false);
  toggleViews();
});

document.addEventListener("DOMContentLoaded", toggleViews);

