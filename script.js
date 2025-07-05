const API_URL = "https://interveiw-mock-api.vercel.app/api/getProducts";
const container = document.getElementById("productContainer");
const sortSelect = document.getElementById("sortSelect");
const productCount = document.getElementById("productCount");

let products = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    container.innerHTML = "<p>Loading...</p>";
    const res = await fetch(API_URL);
    const json = await res.json();

    // Accessing the correct data structure
    if (json.status === "success" && Array.isArray(json.data)) {
      products = json.data.map(item => {
        const product = item.product;
        return {
          name: product.title,
          image: product.image?.src,
          price: parseFloat(product.variants[0]?.price || "0.00"),
          description: product.image?.alt || "No description"
        };
      });

      renderProducts(products);
      productCount.textContent = `${products.length} Products`;
    } else {
      container.innerHTML = "<p>No products found.</p>";
    }
  } catch (err) {
    container.innerHTML = `<p style="color:red;">Failed to load products.</p>`;
    console.error(err);
  }
});

sortSelect.addEventListener("change", () => {
  let sorted = [...products];
  if (sortSelect.value === "asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortSelect.value === "desc") {
    sorted.sort((a, b) => b.price - a.price);
  }
  renderProducts(sorted);
});

function renderProducts(products) {
  container.innerHTML = "";

  products.forEach((product, index) => {
    const fullDesc = product.description || "No description available";
    const words = fullDesc.split(" ");
    const isLong = words.length > 50;
    const shortDesc = isLong ? words.slice(0, 10).join(" ") + "..." : fullDesc;

    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = `${index * 100}ms`;

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <div class="price">Rs. ${product.price.toFixed(2)}</div>
      <p class="desc">${shortDesc}</p>
      ${isLong ? `<button class="toggle-desc">Read More</button>` : ""}
      <button>ADD TO CART</button>
    `;

    container.appendChild(card);

    // Handle toggle logic
    const toggleBtn = card.querySelector(".toggle-desc");
    const descEl = card.querySelector(".desc");

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const expanded = toggleBtn.textContent === "Read Less";
        descEl.textContent = expanded ? shortDesc : fullDesc;
        toggleBtn.textContent = expanded ? "Read More" : "Read Less";
      });
    }
  });
}
