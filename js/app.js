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

    State.user = await window.api.getUser(State.userId);
    State.markers = await window.api.fetchMarkers();
    State.cart = window.api.getCart();

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

// ===================== НАВИГАЦИЯ =====================

function tab(tabId) {
    const pages = document.querySelectorAll('.page');
    const buttons = document.querySelectorAll('.nav-btn');

    pages.forEach(p => {
        p.style.setProperty('display', 'none', 'important');
        p.classList.remove('active');
    });
    buttons.forEach(b => b.classList.remove('active'));

    const targetPage = document.getElementById(tabId);
    const targetBtn = document.getElementById('btn-' + tabId);

    if (targetPage && targetBtn) {
        targetPage.style.setProperty('display', 'block', 'important');
        targetPage.classList.add('active');
        targetBtn.classList.add('active');
        State.currentTab = tabId;
        window.scrollTo(0, 0);
    }
}

// ===================== ПРОФИЛЬ И АВАТАРКИ =====================

function renderProfile() {
    if (!State.user) return;

    const avatarImg = document.getElementById('user-avatar');
    const nameEl = document.getElementById('displayUsername');
    const balanceEl = document.getElementById('userBalance');
    const statusEl = document.getElementById('currentStatus');

    if (avatarImg) avatarImg.src = State.user.avatar;
    if (nameEl) nameEl.innerText = State.user.name;
    if (balanceEl) balanceEl.innerText = State.user.balance;
    if (statusEl) statusEl.innerText = State.user.status;

    const presetGrid = document.getElementById('avatarPresets');
    if (presetGrid) {
        presetGrid.innerHTML = ''; 
        for (let i = 1; i <= 8; i++) {
            const img = document.createElement('img');
            img.src = `${GITHUB_AVATAR_PATH}av${i}.png`; 
            img.alt = `Avatar ${i}`;
            img.className = 'preset-avatar-item';
            
            // Если картинка не найдена (404), скрываем ее, чтобы не было битых иконок
            img.onerror = function() { this.style.display = 'none'; };
            
            img.onclick = () => selectAvatar(img.src);
            presetGrid.appendChild(img);
        }
    }
}

function toggleAvatarEditor() {
    const el = document.getElementById('avatarEditorBlock');
    if (!el) return;
    
    const isHidden = el.style.display === 'none' || el.style.display === '';
    el.style.display = isHidden ? 'block' : 'none';
    
    if (isHidden) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

async function selectAvatar(url) {
    State.user.avatar = url;
    const mainAvatar = document.getElementById('user-avatar');
    if (mainAvatar) mainAvatar.src = url;
    
    await window.api.updateProfile(State.userId, 'avatar', url);
    toggleAvatarEditor();
}

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

function toggleSection(id) {
    const el = document.getElementById(id);
    const isVisible = el.style.display === 'block';
    
    const rewards = document.getElementById('rewards-section');
    const earn = document.getElementById('earn-section');
    if(rewards) rewards.style.display = 'none';
    if(earn) earn.style.display = 'none';
    
    el.style.display = isVisible ? 'none' : 'block';
}

// ===================== ЗАДАНИЯ И КОРЗИНА (ЗАГЛУШКИ ДЛЯ ИНИЦИАЛИЗАЦИИ) =====================

function toggleTasks() {
    const content = document.getElementById('tasksList');
    const arrow = document.getElementById('tasksArrow');
    const isHidden = content.style.display === 'none';
    content.style.display = isHidden ? 'block' : 'none';
    arrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
}

function renderTasks() {
    const container = document.getElementById('tasksList');
    if(container) container.innerHTML = '<p style="padding:15px; color:#888;">Задания загружаются...</p>';
}

function renderMarkers() {
    const container = document.getElementById('markersList');
    if(container) container.innerHTML = '<p style="padding:15px; color:#888;">Загрузка маркеров...</p>';
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const totalCount = State.cart.reduce((sum, item) => sum + item.count, 0);
    badge.innerText = totalCount;
    badge.style.display = totalCount > 0 ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', init);
