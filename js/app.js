// ==========================================
// app.js — основной функционал приложения
// ==========================================

// ---------------- Вкладки ----------------
function tab(tabId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(`btn-${tabId}`);
    if (btn) btn.classList.add('active');
}

// ---------------- Поиск книг ----------------
function filterBooks() {
    const query = document.getElementById('bookSearch').value.toLowerCase();
    const booksGrid = document.getElementById('booksGrid');
    booksGrid.querySelectorAll('.book-card').forEach(card => {
        const title = card.dataset.title.toLowerCase();
        card.style.display = title.includes(query) ? 'block' : 'none';
    });
}

// ---------------- Поиск маркеров ----------------
function filterMarkers() {
    const query = document.getElementById('markerSearch').value.toLowerCase();
    const list = document.getElementById('markersList');
    list.querySelectorAll('.marker-card').forEach(card => {
        const number = card.dataset.number.toLowerCase();
        card.style.display = number.includes(query) ? 'flex' : 'none';
    });
}

// ---------------- Профиль ----------------
async function loadProfile(userId) {
    try {
        const user = await getUserData(userId);
        document.getElementById('displayUsername').innerText = user.name || "Без имени";
        document.getElementById('userBalance').innerText = user.balance || 0;
        document.getElementById('user-avatar').src = user.avatar || 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/avatars/av2.png';
    } catch (e) {
        console.error(e);
    }
}

function changeNickname() {
    document.getElementById('nameInputModal').style.display = 'flex';
}

async function saveNewNickname() {
    const newName = document.getElementById('newNameInput').value.trim();
    if (!newName) return;
    const userId = document.getElementById('userIdDisplay').innerText;
    try {
        await updateUserProfile(userId, { name: newName });
        document.getElementById('displayUsername').innerText = newName;
        document.getElementById('nameInputModal').style.display = 'none';
    } catch (e) {
        console.error(e);
    }
}

// ---------------- Аватар ----------------
function toggleAvatarEditor() {
    const block = document.getElementById('avatarEditorBlock');
    block.style.display = block.style.display === 'none' ? 'block' : 'none';
}

async function handleCustomAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;
    const userId = document.getElementById('userIdDisplay').innerText;
    try {
        const res = await uploadAvatar(userId, file);
        document.getElementById('user-avatar').src = res.avatar;
    } catch (e) {
        console.error(e);
    }
}

// ---------------- Баланс и Ашетики ----------------
function toggleRewards() {
    const section = document.getElementById('rewards-section');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

function toggleEarnAchetiki() {
    const section = document.getElementById('real-loyalty-info');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

// ---------------- Достижения ----------------
let selectedAchievementSlot = null;

function openAchievementPicker(slotIndex) {
    selectedAchievementSlot = slotIndex;
    document.getElementById('fullAchievementsList').style.display = 'block';
    loadAchievements();
}

function closePicker() {
    document.getElementById('fullAchievementsList').style.display = 'none';
}

async function loadAchievements() {
    const userId = document.getElementById('userIdDisplay').innerText;
    const achievements = await getAchievements(userId);
    const grid = document.getElementById('achievementsGrid');
    grid.innerHTML = '';
    achievements.forEach(a => {
        const div = document.createElement('div');
        div.className = 'achievement-card';
        div.innerHTML = `<img src="${a.icon}" style="width:50px; height:50px; border-radius:12px;"><div style="text-align:center; font-size:12px;">${a.title}</div>`;
        div.onclick = async () => {
            await updateAchievement(userId, selectedAchievementSlot, a.id);
            closePicker();
            loadProfile(userId);
        };
        grid.appendChild(div);
    });
}

// ---------------- Корзина ----------------
async function updateCart() {
    const userId = document.getElementById('userIdDisplay').innerText;
    const cart = await getCart(userId);
    const list = document.getElementById('cartList');
    list.innerHTML = '';
    let total = 0;
    cart.items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `${item.name} × ${item.quantity} — ${item.price * item.quantity} ₽`;
        list.appendChild(div);
        total += item.price * item.quantity;
    });
    document.getElementById('mainOrderBtn').style.display = cart.items.length ? 'block' : 'none';
}

// ---------------- Оформление заказа ----------------
async function checkout() {
    const userId = document.getElementById('userIdDisplay').innerText;
    try {
        await checkoutCart(userId);
        await updateCart();
        alert('Заказ оформлен!');
    } catch (e) {
        console.error(e);
    }
}

// ---------------- ИИ Палитра ----------------
async function processAI(event) {
    const files = event.target.files;
    if (!files.length) return;
    const userId = document.getElementById('userIdDisplay').innerText;
    const brand = document.getElementById('aiSearchBrand').value;
    const inventoryOnly = document.getElementById('aiUseInventoryOnly').checked;
    
    const container = document.getElementById('aiMultipleResultsContainer');
    container.innerHTML = 'Обработка...';
    
    try {
        const results = [];
        for (const file of files) {
            const res = await processAIImage(userId, file, brand, inventoryOnly);
            results.push(res);
        }
        container.innerHTML = '';
        results.forEach(r => {
            const div = document.createElement('div');
            div.style.marginBottom = '10px';
            div.innerHTML = `<div>Рекомендованный маркер: ${r.recommendedMarker}</div>`;
            container.appendChild(div);
        });
    } catch (e) {
        console.error(e);
        container.innerHTML = 'Ошибка обработки';
    }
}

// ---------------- Инициализация ----------------
document.addEventListener('DOMContentLoaded', async () => {
    const userId = '496779756'; // заменить на реальный userId
    document.getElementById('userIdDisplay').innerText = userId;
    
    await loadProfile(userId);
    await updateCart();
    tab('profile'); // открыть профиль по умолчанию
});
