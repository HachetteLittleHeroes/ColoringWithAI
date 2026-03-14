// js/inventory.js

function toggleInventory() {
    const inv = document.getElementById("inventory");

    if (!inv) return;

    inv.classList.toggle("open");

    if (typeof tg !== "undefined" && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred("light");
    }
}
