const PRODUCTS = {
  apple: { name: "Apple", emoji: "🍏" },
  banana: { name: "Banana", emoji: "🍌" },
  lemon: { name: "Lemon", emoji: "🍋" },
};

const PRODUCT_VISIBILITY_KEY = "productVisibility";
const DEFAULT_PRODUCT_VISIBILITY = Object.keys(PRODUCTS).reduce(
  (acc, productId) => {
    acc[productId] = true;
    return acc;
  },
  {}
);

const BUNDLES = {
  healthy_mix: {
    name: "Healthy Mix",
    products: ["apple", "banana"],
    emoji: "🍏🍌"
  },
  citrus_lovers: {
    name: "Citrus Lovers",
    products: ["lemon", "apple"],
    emoji: "🍋🍏"
  },
  tropical_party: {
    name: "Tropical Party",
    products: ["banana", "lemon"],
    emoji: "🍌🍋"
  },
  fruit_feast: {
    name: "Fruit Feast",
    products: ["apple", "banana", "lemon"],
    emoji: "🍏🍌🍋"
  }
};

function getBasket() {
  const basket = localStorage.getItem("basket");
  return basket ? JSON.parse(basket) : [];
}

function getProductVisibilityMap() {
  try {
    const stored = localStorage.getItem(PRODUCT_VISIBILITY_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    return { ...DEFAULT_PRODUCT_VISIBILITY, ...parsed };
  } catch (error) {
    console.warn("Unable to read product visibility. Falling back to defaults.", error);
    return { ...DEFAULT_PRODUCT_VISIBILITY };
  }
}

function saveProductVisibilityMap(map) {
  try {
    localStorage.setItem(PRODUCT_VISIBILITY_KEY, JSON.stringify(map));
    window.dispatchEvent(
      new CustomEvent("product-visibility-changed", { detail: map })
    );
  } catch (error) {
    console.error("Unable to persist product visibility.", error);
  }
}

function setProductEnabled(productId, enabled) {
  const map = getProductVisibilityMap();
  map[productId] = !!enabled;
  saveProductVisibilityMap(map);
  enforceProductVisibility();
}

function isProductEnabled(productId) {
  const map = getProductVisibilityMap();
  return map[productId] !== false;
}

function redirectIfProductDisabled(productId) {
  if (!isProductEnabled(productId)) {
    window.location.replace("404.html");
  }
}

function enforceProductVisibility() {
  const visibility = getProductVisibilityMap();
  const elements = document.querySelectorAll("[data-product-id]");
  elements.forEach((element) => {
    const productId = element.getAttribute("data-product-id");
    if (!productId) return;
    if (visibility[productId] === false) {
      element.classList.add("product-hidden");
      element.setAttribute("aria-hidden", "true");
    } else {
      element.classList.remove("product-hidden");
      element.removeAttribute("aria-hidden");
    }
  });
}

function addToBasket(product) {
  const basket = getBasket();
  basket.push(product);
  localStorage.setItem("basket", JSON.stringify(basket));
}

function clearBasket() {
  localStorage.removeItem("basket");
}

function addBundle(bundleId) {
  const bundle = BUNDLES[bundleId];
  if (bundle) {
    const basket = getBasket();
    basket.push(`bundle_${bundleId}`);
    localStorage.setItem("basket", JSON.stringify(basket));
    renderBasketIndicator();
  }
}

function renderBasket() {
  const basket = getBasket();
  const basketList = document.getElementById("basketList");
  const cartButtonsRow = document.querySelector(".cart-buttons-row");
  if (!basketList) return;
  basketList.innerHTML = "";
  if (basket.length === 0) {
    basketList.innerHTML = "<li>No products in basket.</li>";
    if (cartButtonsRow) cartButtonsRow.style.display = "none";
    return;
  }
  basket.forEach((item) => {
    if (item.startsWith("bundle_")) {
      const bundleId = item.replace("bundle_", "");
      const bundle = BUNDLES[bundleId];
      if (bundle) {
        const li = document.createElement("li");
        li.innerHTML = `<span class='basket-emoji'>${bundle.emoji}</span> <span>${bundle.name} Bundle</span>`;
        basketList.appendChild(li);
      }
    } else {
      const product = PRODUCTS[item];
      if (product) {
        const li = document.createElement("li");
        li.innerHTML = `<span class='basket-emoji'>${product.emoji}</span> <span>${product.name}</span>`;
        basketList.appendChild(li);
      }
    }
  });
  if (cartButtonsRow) cartButtonsRow.style.display = "flex";
}

function renderBasketIndicator() {
  const basket = getBasket();
  let indicator = document.querySelector(".basket-indicator");
  if (!indicator) {
    const basketLink = document.querySelector(".basket-link");
    if (!basketLink) return;
    indicator = document.createElement("span");
    indicator.className = "basket-indicator";
    basketLink.appendChild(indicator);
  }
  if (basket.length > 0) {
    indicator.textContent = basket.length;
    indicator.style.display = "flex";
  } else {
    indicator.style.display = "none";
  }
}

// Call this on page load and after basket changes
if (document.readyState !== "loading") {
  renderBasketIndicator();
} else {
  document.addEventListener("DOMContentLoaded", renderBasketIndicator);
}

// Patch basket functions to update indicator
const origAddToBasket = window.addToBasket;
window.addToBasket = function (product) {
  if (typeof isProductEnabled === "function" && !isProductEnabled(product)) {
    console.warn(`Attempted to add disabled product "${product}" to basket.`);
    return;
  }
  origAddToBasket(product);
  renderBasketIndicator();
};
const origClearBasket = window.clearBasket;
window.clearBasket = function () {
  origClearBasket();
  renderBasketIndicator();
};

if (document.readyState !== "loading") {
  enforceProductVisibility();
} else {
  document.addEventListener("DOMContentLoaded", enforceProductVisibility);
}

window.addEventListener("product-visibility-changed", enforceProductVisibility);
window.addEventListener("storage", (event) => {
  if (event.key === PRODUCT_VISIBILITY_KEY) {
    enforceProductVisibility();
  }
});
