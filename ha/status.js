// js/status.js

const statusPaths = {
    collector: [1, 5, 10],
    trader: [5, 20, 50]
};

function renderStatusAwards() {

    const container = document.getElementById("statusAwardsContainer");

    if (!container) return;

    container.innerHTML = Object.keys(statusPaths).map(key => `
        <div class="statusCard">
            ${key}
        </div>
    `).join("");
}
