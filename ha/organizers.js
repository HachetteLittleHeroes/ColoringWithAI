// js/organizers.js

function openOrganizer(id) {

    const org = organizers.find(o => o.id === id);

    if (!org) return;

    currentOrgId = id;

    renderOrganizer(org);
}

function renderOrganizer(org) {

    const container = document.getElementById("organizerGrid");

    if (!container) return;

    container.innerHTML = org.cells.map((cell, i) => `
        <div class="cell">
            ${cell ? cell.name : ""}
        </div>
    `).join("");
}
