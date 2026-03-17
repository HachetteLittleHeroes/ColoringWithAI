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
