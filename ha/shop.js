// js/shop.js

function addToCart(id) {

    const item = markersData.find(m => m.id === id);
    if (!item) return;

    cart.push(item);

    renderCart();
}

function renderCart() {

    const container = document.getElementById("cart");

    if (!container) return;

    container.innerHTML = cart.map(item => `
        <div class="cartItem">
            ${item.name}
        </div>
    `).join("");
}
