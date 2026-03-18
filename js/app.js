/**
 * app.js — Полный контроллер
 */

const State = {
    user: null,
    markers: [],
    cart: [],
    currentTab: 'profile',
    userId: '496779756'
};

const GITHUB_AVATAR_PATH = 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/';
let pendingAvatarUrl = '';

async function init() {
    console.log("Запуск...");
    
    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.expand(); tg.ready();
        State.userId = tg.initDataUnsafe?.user?.id?.toString() || '496779756';
    }

    const localName = localStorage.getItem('user_name');
    const localAvatar = localStorage.getItem('user_avatar');
    const localStatus = localStorage.getItem('user_status');
    
    if (localName) document.getElementById('displayUsername').innerText = localName;
    if (localAvatar) document.getElementById('user-avatar').src = localAvatar;
    if (localStatus) document.getElementById('currentStatus').innerText = localStatus;

    State.user = await window.api.getUser(State.userId);
    State.markers = await window.api.fetchMarkers();
    State.cart = window.api.getCart();

    renderProfile();
    renderMarkers();
    renderTasks();
    updateCartBadge();
    
    tab('profile');
}

// НАВИГАЦИЯ
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

// ПРОФИЛЬ И АВАТАРКИ
function renderProfile() {
    if (!State.user) return;

    document.getElementById('user-avatar').src = State.user.avatar;
    document.getElementById('displayUsername').innerText = State.user.name;
    document.getElementById('userBalance').innerText = State.user.balance;
    document.getElementById('currentStatus').innerText = State.user.status;

    const presetGrid = document.getElementById('avatarPresets');
    if (presetGrid) {
        presetGrid.innerHTML = ''; 
        for (let i = 1; i <= 8; i++) {
            const img = document.createElement('img');
            img.src = `${GITHUB_AVATAR_PATH}av${i}.png`; 
            img.className = 'preset-avatar-item';
            img.onerror = function() { this.style.display = 'none'; };
            img.onclick = () => promptAvatarConfirm(img.src);
            presetGrid.appendChild(img);
        }
    }
}

function toggleAvatarEditor() {
    const el = document.getElementById('avatarEditorBlock');
    if (!el) return;
    const isHidden = el.style.display === 'none' || el.style.display === '';
    el.style.display = isHidden ? 'block' : 'none';
    if (isHidden) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function openStatusInfo() {
    document.getElementById('statusInfoModal').style.display = 'flex';
}

// ЛОГИКА ОКНА ПОДТВЕРЖДЕНИЯ АВАТАРА
function promptAvatarConfirm(url) {
    pendingAvatarUrl = url;
    document.getElementById('avatarPreview').src = url;
    document.getElementById('avatarConfirmModal').style.display = 'flex';
}

function closeAvatarConfirm() {
    document.getElementById('avatarConfirmModal').style.display = 'none';
    pendingAvatarUrl = '';
}

async function applyAvatar() {
    if (!pendingAvatarUrl) return;
    
    State.user.avatar = pendingAvatarUrl;
    document.getElementById('user-avatar').src = pendingAvatarUrl;
    await window.api.updateProfile(State.userId, 'avatar', pendingAvatarUrl);
    
    closeAvatarConfirm();
    document.getElementById('avatarEditorBlock').style.display = 'none';
}

// СВОЕ ФОТО
async function handleCustomAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
        promptAvatarConfirm(e.target.result);
    };
    reader.readAsDataURL(file);
}

// ИМЯ
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

// КНОПКИ БАЛАНСА
function toggleSection(id) {
    const el = document.getElementById(id);
    const isVisible = el.style.display === 'block';
    
    document.getElementById('rewards-section').style.display = 'none';
    document.getElementById('earn-section').style.display = 'none';
    
    if (!isVisible) {
        el.style.display = 'block';
    }
}

// ЗАДАНИЯ С ПРОГРЕССИЕЙ
function toggleTasks() {
    const content = document.getElementById('tasksList');
    const arrow = document.getElementById('tasksArrow');
    const isHidden = content.style.display === 'none';
    
    content.style.display = isHidden ? 'block' : 'none';
    arrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
}

function renderTasks() {
    const container = document.getElementById('tasksList');
    const branches = window.api.getTaskData();
    const progressData = State.user.taskProgress || {};

    container.innerHTML = branches.map(branch => {
        // Достаем прогресс пользователя или ставим 1 уровень по умолчанию
        const userProg = progressData[branch.id] || { currentLevel: 1, currentScore: 0 };

        return `
            <div style="margin-bottom: 15px;">
                <h4 style="color:var(--accent); margin-bottom:15px; font-size:16px;">${branch.title}</h4>
                ${branch.levels.map(lv => {
                    const isCompleted = lv.lv < userProg.currentLevel;
                    const isActive = lv.lv === userProg.currentLevel;
                    const isLocked = lv.lv > userProg.currentLevel;

                    const currentScore = isCompleted ? lv.target : (isActive ? userProg.currentScore : 0);
                    const percent = Math.min(100, (currentScore / lv.target) * 100);

                    return `
                    <div class="task-level ${isLocked ? 'locked' : ''}">
                        <div style="display:flex; justify-content:space-between; margin-bottom: 8px;">
                            <span style="font-size:14px; font-weight:bold;">Уровень ${lv.lv}: ${lv.text}</span>
                            <span style="color:#FFD700; font-weight:bold;">+${lv.reward} <i class="fas fa-book-open"></i></span>
                        </div>
                        
                        <div class="progress-bar-container">
                            <div class="progress-fill" style="width: ${percent}%;"></div>
                        </div>
                        
                        <div style="font-size:12px; color:var(--text-gray); text-align:right; margin-bottom: 12px;">
                            Прогресс: ${currentScore} / ${lv.target}
                        </div>

                        ${isActive ? `
                            <button class="blue-action-btn" style="padding: 10px; font-size: 14px;" onclick="sendTaskProof()">
                                <i class="fas fa-camera"></i> Отправить задание на проверку
                            </button>
                        ` : ''}
                        
                        ${isCompleted ? `
                            <div style="color:var(--status-green); font-size:14px; text-align:center; font-weight:bold;">
                                <i class="fas fa-check-circle"></i> Уровень пройден
                            </div>
                        ` : ''}

                        ${isLocked ? `
                            <div style="color:var(--text-gray); font-size:14px; text-align:center;">
                                <i class="fas fa-lock"></i> Откроется после ${lv.lv - 1} уровня
                            </div>
                        ` : ''}
                    </div>
                    `;
                }).join('')}
            </div>
        `;
    }).join('');
}

// Отправка задания (закрытие окна или показ подсказки)
function sendTaskProof() {
    alert("Пожалуйста, сделайте фото вашей работы и отправьте его прямо в чат с ботом! Администратор проверит работу и начислит очки задания.");
    // Раскомментируй строку ниже, если хочешь, чтобы WebApp автоматически закрывался
    // if (window.Telegram?.WebApp) window.Telegram.WebApp.close();
}

// МАРКЕРЫ И КОРЗИНА
function renderMarkers() {
    const container = document.getElementById('markersList');
    if (!State.markers.length) {
        container.innerHTML = '<p style="padding:15px; text-align:center; color:#888;">Загрузка...</p>';
        return;
    }
    container.innerHTML = State.markers.map(m => {
        const cartItem = State.cart.find(item => item.id === m.id);
        const count = cartItem ? cartItem.count : 0;
        return `
            <div class="marker-item">
                <div>
                    <div style="font-weight:bold; font-size:18px;">№ ${m.number}</div>
                    <div style="font-size:12px; color:${m.stock > 0 ? '#34c759' : '#ff3b30'}">${m.stock} шт.</div>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <button class="btn-circle ${count === 0 ? 'disabled' : ''}" onclick="changeCart('${m.id}', -1)">-</button>
                    <span style="font-weight:bold; width:20px; text-align:center;">${count}</span>
                    <button class="btn-circle ${count >= m.stock ? 'disabled' : ''}" onclick="changeCart('${m.id}', 1)">+</button>
                </div>
            </div>
        `;
    }).join('');
}

function changeCart(id, delta) {
    const marker = State.markers.find(m => m.id === id);
    let cartItem = State.cart.find(item => item.id === id);

    if (delta > 0) {
        if (!cartItem) State.cart.push({ ...marker, count: 1 });
        else if (cartItem.count < marker.stock) cartItem.count++;
    } else {
        if (cartItem) {
            cartItem.count--;
            if (cartItem.count <= 0) State.cart = State.cart.filter(item => item.id !== id);
        }
    }
    window.api.saveCart(State.cart);
    renderMarkers(); updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const totalCount = State.cart.reduce((sum, item) => sum + item.count, 0);
    badge.innerText = totalCount;
    badge.style.display = totalCount > 0 ? 'block' : 'none';
}

window.updateCartBadge = updateCartBadge;
document.addEventListener('DOMContentLoaded', init);
