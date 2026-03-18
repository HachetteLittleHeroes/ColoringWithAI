// ui.js — только визуальные хелперы

/* ===================== КОРЗИНА ===================== */
function updateCartBadge(count) {
    const badge = document.getElementById('cartBadge');

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

/* ===================== ПРОФИЛЬ ===================== */
function syncProfileUI(user) {
    document.getElementById('displayUsername').innerText = user.name || "Без имени";
    document.getElementById('userBalance').innerText = user.balance || 0;

    if (user.avatar) {
        document.getElementById('user-avatar').src = user.avatar;
    }
}

/* ===================== ПОТРАТИТЬ АШЕТИКИ ===================== */
function toggleRewards() {
    const el = document.getElementById('rewards-section');
    if (!el) return;

    if (el.style.display === 'none' || el.style.display === '') {
        el.style.display = 'block';

        el.innerHTML = `
            <div class="category-title">🎁 Потратить ашетики</div>

            <div class="card">
                <p>🎁 Стикеры</p>
                <button class="buy-btn">100 ашетиков</button>
            </div>

            <div class="card">
                <p>🎨 Палитра</p>
                <button class="buy-btn">200 ашетиков</button>
            </div>

            <div class="card">
                <p>🎁 Бонус</p>
                <button class="buy-btn">300 ашетиков</button>
            </div>
        `;
    } else {
        el.style.display = 'none';
    }
}

/* ===================== ЗАРАБОТАТЬ АШЕТИКИ ===================== */
function toggleEarnAchetiki() {
    const el = document.getElementById('earn-section');
    if (!el) return;

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

/* ===================== BOTTOM SHEET (если пригодится позже) ===================== */
function openSheet(contentHTML) {
    const sheet = document.getElementById('bottomSheet');
    const overlay = document.getElementById('sheetOverlay');
    const content = document.getElementById('sheetContent');

    if (!sheet || !overlay || !content) return;

    content.innerHTML = contentHTML;

    sheet.classList.add('active');
    overlay.classList.add('active');
}

function closeSheet() {
    const sheet = document.getElementById('bottomSheet');
    const overlay = document.getElementById('sheetOverlay');

    if (!sheet || !overlay) return;

    sheet.classList.remove('active');
    overlay.classList.remove('active');
}
