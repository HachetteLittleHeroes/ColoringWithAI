// ui.js — только визуальные хелперы
function updateCartBadge(count) {
    const badge = document.getElementById('cartBadge');
    if (count > 0) {
        badge.style.display = 'inline-block';
        badge.innerText = count;
    } else {
        badge.style.display = 'none';
    }
}

function showAlert(msg) { alert(msg); }

// Универсальное обновление UI профиля
function syncProfileUI(user) {
    document.getElementById('displayUsername').innerText = user.name || "Без имени";
    document.getElementById('userBalance').innerText = user.balance || 0;
    document.getElementById('user-avatar').src = user.avatar;
}
function toggleRewards() {
    const el = document.getElementById('rewards-section');

    if (el.style.display === 'none') {
        el.style.display = 'block';

        el.innerHTML = `
            <div class="category-title">Товары за ашетики</div>

            <div class="card">
                <p>🎁 Стикеры</p>
                <button class="buy-btn">100 ашетиков</button>
            </div>

            <div class="card">
                <p>🎨 Палитра</p>
                <button class="buy-btn">200 ашетиков</button>
            </div>
        `;
    } else {
        el.style.display = 'none';
    }
}
function toggleEarnAchetiki() {
    openSheet(`
        <h3>💰 Заработать ашетики</h3>

        <div class="sheet-card">
            <p>📸 Загрузить фото — +10</p>
        </div>

        <div class="sheet-card">
            <p>🎯 Выполнить задание — +20</p>
        </div>

        <div class="sheet-card">
            <p>⭐ Достижение — +50</p>
        </div>
    `);
}
function toggleRewards() {
    openSheet(`
        <h3>🎁 Потратить ашетики</h3>

        <div class="sheet-card">
            <p>Стикеры — 100</p>
        </div>

        <div class="sheet-card">
            <p>Палитра — 200</p>
        </div>

        <div class="sheet-card">
            <p>Бонус — 300</p>
        </div>
    `);
}
function openSheet(contentHTML) {
    const sheet = document.getElementById('bottomSheet');
    const overlay = document.getElementById('sheetOverlay');
    const content = document.getElementById('sheetContent');

    content.innerHTML = contentHTML;

    sheet.classList.add('active');
    overlay.classList.add('active');
}

function closeSheet() {
    document.getElementById('bottomSheet').classList.remove('active');
    document.getElementById('sheetOverlay').classList.remove('active');
}
function toggleEarnAchetiki() {
    const el = document.getElementById('earn-section');

    if (el.style.display === 'none' || el.style.display === '') {
        el.style.display = 'block';

        el.innerHTML = `
            <div class="category-title">💰 Как заработать ашетики</div>

            <div class="loyalty-item">
                <p>📸 Загрузить фото</p>
                <span>+10</span>
            </div>

            <div class="loyalty-item">
                <p>🎯 Выполнить задание</p>
                <span>+20</span>
            </div>

            <div class="loyalty-item">
                <p>⭐ Получить достижение</p>
                <span>+50</span>
            </div>
        `;
    } else {
        el.style.display = 'none';
    }
}
