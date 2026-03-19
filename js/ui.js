// ==========================================
// ui.js — Визуальные хелперы и Обработчики
// ==========================================

/* ---------------- 1. КОРЗИНА И СТАТУСЫ ---------------- */
function updateCartBadge(count) {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    if (count > 0) {
        badge.style.display = 'inline-block';
        badge.innerText = count;
    } else {
        badge.style.display = 'none';
    }
}

function showAlert(msg) {
    alert(msg);
}

/* ---------------- 2. ПРОФИЛЬ ---------------- */
function syncProfileUI(user) {
    const nameEl = document.getElementById('displayUsername');
    const balanceEl = document.getElementById('userBalance');
    const avatarEl = document.getElementById('user-avatar');

    if (nameEl) nameEl.innerText = user.name || "Без имени";
    if (balanceEl) balanceEl.innerText = user.balance || 0;
    if (avatarEl && user.avatar) avatarEl.src = user.avatar;
}

/* ---------------- 3. ДИНАМИЧЕСКИЕ СЕКЦИИ ---------------- */
function toggleRewards() {
    const el = document.getElementById('rewards-section');
    if (!el) return;
    if (el.style.display === 'none' || el.style.display === '') {
        el.style.display = 'block';
        el.innerHTML = `
            <div class="category-title">🎁 Потратить ашетики</div>
            <div class="card"><p>🎁 Стикеры</p><button class="buy-btn" onclick="alert('Скоро!')">100</button></div>
            <div class="card"><p>🎨 Палитра</p><button class="buy-btn" onclick="alert('Скоро!')">200</button></div>
        `;
    } else {
        el.style.display = 'none';
    }
}

function toggleEarnAchetiki() {
    const el = document.getElementById('earn-section');
    if (!el) return;
    if (el.style.display === 'none' || el.style.display === '') {
        el.style.display = 'block';
        el.innerHTML = `
            <div class="category-title">💰 Как заработать</div>
            <div class="loyalty-item"><p>📸 Фото</p><span>+10</span></div>
            <div class="loyalty-item"><p>🎯 Задание</p><span>+20</span></div>
        `;
    } else {
        el.style.display = 'none';
    }
}

/* ---------------- 4. ОРГАНАЙЗЕРЫ И ЯЧЕЙКИ ---------------- */
async function loadOrganizers() {
    const container = document.getElementById('organizersList');
    const userId = document.getElementById('userIdDisplay')?.innerText;
    if (!container || !userId || !window.api?.getOrganizers) return;

    const organizers = await window.api.getOrganizers(userId);
    container.innerHTML = '';
    organizers.forEach(org => {
        const div = document.createElement('div');
        div.className = 'organizer-card';
        div.innerText = org.name;
        div.onclick = () => openOrganizerView(org.id, org.name);
        container.appendChild(div);
    });
}

function openOrganizerView(orgId, title) {
    const view = document.getElementById('organizerDetailView');
    if (view) {
        view.style.display = 'block';
        document.getElementById('viewOrgTitle').innerText = title;
        loadOrganizerMarkers(orgId);
    }
}

async function loadOrganizerMarkers(orgId) {
    const grid = document.getElementById('gridContainer');
    if (!grid || !window.api?.getOrganizerMarkers) return;
    const markers = await window.api.getOrganizerMarkers(orgId);
    grid.innerHTML = '';
    markers.forEach(m => {
        const div = document.createElement('div');
        div.className = 'organizer-cell';
        div.innerText = m.name;
        div.onclick = () => openCellModal(m.id, m.name);
        grid.appendChild(div);
    });
}

/* ---------------- 5. ДОСТИЖЕНИЯ И ЗАДАНИЯ ---------------- */
function openTasks() {
    const container = document.getElementById('questsListContainer');
    if (container) {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    }
}

/* ---------------- 6. BOTTOM SHEET ---------------- */
function openSheet(contentHTML) {
    const sheet = document.getElementById('bottomSheet');
    const content = document.getElementById('sheetContent');
    const overlay = document.getElementById('sheetOverlay');
    if (sheet && content && overlay) {
        content.innerHTML = contentHTML;
        sheet.classList.add('active');
        overlay.classList.add('active');
    }
}

function closeSheet() {
    document.getElementById('bottomSheet')?.classList.remove('active');
    document.getElementById('sheetOverlay')?.classList.remove('active');
}
