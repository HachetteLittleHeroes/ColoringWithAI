/**
 * app.js — Главный контроллер приложения
 */

const State = {
    user: null,
    markers: [],
    cart: [],
    currentTab: 'profile',
    isAdmin: false,
    adminId: '496779756'
};

// Базовый путь к твоим аватаркам на GitHub
const GITHUB_AVATAR_PATH = 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/';

async function init() {
    console.log("Запуск приложения...");
    
    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.expand();
        tg.ready();
        State.userId = tg.initDataUnsafe?.user?.id?.toString() || '496779756';
    } else {
        State.userId = '496779756';
    }

    State.isAdmin = (State.userId === State.adminId);

    // Загрузка данных
    State.user = await window.api.getUser(State.userId);
    State.markers = await window.api.fetchMarkers();
    State.cart = window.api.getCart();

    // Рендерим всё
    renderProfile();
    renderMarkers();
    renderTasks();
    updateCartBadge();
    
    if (State.isAdmin) {
        const adminBlock = document.getElementById('adminAIBlock');
        if (adminBlock) adminBlock.style.display = 'block';
    }

    tab('profile');
}

// ===================== ПРОФИЛЬ И АВАТАРКИ =====================

function renderProfile() {
    if (!State.user) return;

    // Установка основных данных
    const avatarImg = document.getElementById('user-avatar');
    const nameEl = document.getElementById('displayUsername');
    const balanceEl = document.getElementById('userBalance');
    const statusEl = document.getElementById('currentStatus');

    if (avatarImg) avatarImg.src = State.user.avatar;
    if (nameEl) nameEl.innerText = State.user.name;
    if (balanceEl) balanceEl.innerText = State.user.balance;
    if (statusEl) statusEl.innerText = State.user.status;

    // Генерируем 8 предустановленных аватарок
    const presetGrid = document.getElementById('avatarPresets');
    if (presetGrid) {
        presetGrid.innerHTML = ''; // Очищаем старое
        for (let i = 1; i <= 8; i++) {
            const img = document.createElement('img');
            // Формируем путь: assets/avatars/av1.png и т.д.
            img.src = `${GITHUB_AVATAR_PATH}av${i}.png`; 
            img.alt = `Avatar ${i}`;
            img.className = 'preset-avatar-item';
            img.onclick = () => selectAvatar(img.src);
            presetGrid.appendChild(img);
        }
    }
}

// Открытие/закрытие окна выбора аватарок
function toggleAvatarEditor() {
    const el = document.getElementById('avatarEditorBlock');
    if (!el) return;
    
    const isHidden = el.style.display === 'none' || el.style.display === '';
    el.style.display = isHidden ? 'block' : 'none';
    
    // Плавный скролл к блоку, если открыли
    if (isHidden) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

async function selectAvatar(url) {
    State.user.avatar = url;
    const mainAvatar = document.getElementById('user-avatar');
    if (mainAvatar) mainAvatar.src = url;
    
    await window.api.updateProfile(State.userId, 'avatar', url);
    toggleAvatarEditor(); // Закрываем после выбора
}

// Установка своего фото
async function handleCustomAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const url = e.target.result;
        await selectAvatar(url);
    };
    reader.readAsDataURL(file);
}

// Остальная логика без изменений для краткости (но она должна быть в твоем файле)
function tab(tabId) {
    const pages = document.querySelectorAll('.page');
    const buttons = document.querySelectorAll('.nav-btn');
    pages.forEach(p => p.classList.remove('active'));
    buttons.forEach(b => b.classList.remove('active'));
    const targetPage = document.getElementById(tabId);
    const targetBtn = document.getElementById('btn-' + tabId);
    if (targetPage && targetBtn) {
        targetPage.classList.add('active');
        targetBtn.classList.add('active');
        State.currentTab = tabId;
        window.scrollTo(0, 0);
    }
}

function changeNickname() {
    document.getElementById('nameModal').style.display = 'flex';
}

async function saveNewNickname() {
    const input = document.getElementById('newNameInput');
    const newName = input.value.trim();
    if (newName) {
        State.user.name = newName;
        document.getElementById('displayUsername').innerText = newName;
        await window.api.updateProfile(State.userId, 'username', newName);
    }
    document.getElementById('nameModal').style.display = 'none';
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const totalCount = State.cart.reduce((sum, item) => sum + item.count, 0);
    badge.innerText = totalCount;
    badge.style.display = totalCount > 0 ? 'block' : 'none';
}

// Функции-заглушки для инициализации (чтобы не падало)
function renderMarkers() { console.log("Markers rendered"); }
function renderTasks() { console.log("Tasks rendered"); }

document.addEventListener('DOMContentLoaded', init);
