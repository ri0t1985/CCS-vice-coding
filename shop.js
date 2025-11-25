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

(function initVibes() {
  if (window.__fruitVibesInitialized) return;
  window.__fruitVibesInitialized = true;

  const midiBase64 =
    "TVRoZAAAAAYAAAABAGBNVHJrAAAAFgD/UQMHoSAAwAUAkDxkYIA8ZAD/LwA=";

  function start() {
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", start, { once: true });
      return;
    }

    const midiAudio = new Audio(`data:audio/midi;base64,${midiBase64}`);
    midiAudio.loop = true;
    midiAudio.volume = 0.35;
    let didAutoplay = false;

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "vibes-toggle";
    toggleBtn.type = "button";
    toggleBtn.textContent = "🔊 Play Vibes";
    toggleBtn.setAttribute("aria-pressed", "false");

    const fireworksLayer = document.createElement("div");
    fireworksLayer.className = "fireworks-layer";

    document.body.appendChild(toggleBtn);
    document.body.appendChild(fireworksLayer);

    function updateToggleState() {
      const playing = !midiAudio.paused;
      toggleBtn.textContent = playing ? "🔇 Pause Vibes" : "🔊 Play Vibes";
      toggleBtn.setAttribute("aria-pressed", String(playing));
      document.body.classList.toggle("vibes-on", playing);
    }

    async function playVibes() {
      try {
        await midiAudio.play();
        didAutoplay = true;
      } catch (err) {
        console.warn("Audio playback blocked until user interaction.", err);
      } finally {
        updateToggleState();
      }
    }

    function pauseVibes() {
      midiAudio.pause();
      updateToggleState();
    }

    toggleBtn.addEventListener("click", () => {
      if (midiAudio.paused) {
        playVibes();
      } else {
        pauseVibes();
      }
    });

    const unlockOnce = () => {
      if (!didAutoplay) {
        playVibes();
      }
    };

    window.addEventListener("pointerdown", unlockOnce, { once: true });
    window.addEventListener("keydown", unlockOnce, { once: true });

    function launchFireworks() {
      const originX = Math.random() * 80 + 10;
      const originY = Math.random() * 60 + 10;
      const particles = 24;

      for (let i = 0; i < particles; i++) {
        const particle = document.createElement("span");
        particle.className = "firework-particle";
        particle.style.left = `${originX}%`;
        particle.style.top = `${originY}%`;
        const angle = (Math.PI * 2 * i) / particles + Math.random() * 0.4;
        const distance = 70 + Math.random() * 80;
        particle.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
        particle.style.setProperty("--ty", `${Math.sin(angle) * distance}px`);
        particle.style.setProperty("--hue", `${Math.floor(Math.random() * 360)}`);

        fireworksLayer.appendChild(particle);
        setTimeout(() => particle.remove(), 1300);
      }
    }

    window.addEventListener("keydown", (event) => {
      if (event.key && event.key.toLowerCase() === "o") {
        launchFireworks();
        playVibes();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
