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
