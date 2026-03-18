/**
 * app.js — Полный контроллер
 */

const State = {
    user: null,
    markers: [],
    cart: [],
    currentTab: 'profile',
    userId: '496779756',
    activeUploadBranchId: null // для хранения ID ветки, в которую грузим фото
};

let pendingAvatarUrl = '';
let activeShowcaseSlot = null; // Индекс слота, который сейчас редактируется

async function init() {
    console.log("Запуск...");
    
    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.expand(); tg.ready();
        State.userId = tg.initDataUnsafe?.user?.id?.toString() || '496779756';
    }

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

    // Генерация пресетов
    const presetGrid = document.getElementById('avatarPresets');
    if (presetGrid && presetGrid.children.length === 0) {
        for (let i = 1; i <= 8; i++) {
            const img = document.createElement('img');
            img.src = `${window.CONFIG.GITHUB_BASE}avatars/av${i}.png`; 
            img.className = 'preset-avatar-item';
            img.onerror = function() { this.style.display = 'none'; };
            img.onclick = () => promptAvatarConfirm(img.src);
            presetGrid.appendChild(img);
        }
    }

    // Отрисовка витрины
    for (let i = 0; i < 3; i++) {
        const slotEl = document.getElementById(`slot-${i}`);
        const achId = State.user.showcase[i];
        if (achId) {
            slotEl.innerHTML = `<img src="${window.CONFIG.GITHUB_BASE}achievements/${achId}.png" alt="Achievement">`;
        } else {
            slotEl.innerHTML = '<i class="fas fa-lock"></i>';
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
    localStorage.setItem('user_avatar', pendingAvatarUrl);
    document.getElementById('user-avatar').src = pendingAvatarUrl;
    
    closeAvatarConfirm();
    document.getElementById('avatarEditorBlock').style.display = 'none';

    // Тест: Выдаем достижение 1 за смену аватарки
    grantAchievement('ach1', 'Смена имиджа!');
}

async function handleCustomAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => promptAvatarConfirm(e.target.result);
    reader.readAsDataURL(file);
}

function changeNickname() { document.getElementById('nameModal').style.display = 'flex'; }
async function saveNewNickname() {
    const input = document.getElementById('newNameInput');
    const newName = input.value.trim();
    if (newName) {
        State.user.name = newName;
        localStorage.setItem('user_name', newName);
        document.getElementById('displayUsername').innerText = newName;
    }
    document.getElementById('nameModal').style.display = 'none';
}

function toggleSection(id) {
    const el = document.getElementById(id);
    const isVisible = el.style.display === 'block';
    document.getElementById('rewards-section').style.display = 'none';
    document.getElementById('earn-section').style.display = 'none';
    if (!isVisible) el.style.display = 'block';
}

// ДОСТИЖЕНИЯ И ВИТРИНА
function grantAchievement(achId, text) {
    if (!State.user.unlockedAchievements.includes(achId)) {
        State.user.unlockedAchievements.push(achId);
        window.api.saveUserState(State.user);
        
        // Показываем алерт
        document.getElementById('alertAchImg').src = `${window.CONFIG.GITHUB_BASE}achievements/${achId}.png`;
        document.getElementById('alertAchText').innerText = text;
        document.getElementById('achievementAlert').style.display = 'flex';
    }
}

function openShowcaseModal(slotIndex) {
    activeShowcaseSlot = slotIndex;
    const list = document.getElementById('availableAchievementsList');
    list.innerHTML = '';
    
    if (State.user.unlockedAchievements.length === 0) {
        list.innerHTML = '<p style="grid-column: 1 / -1; color: var(--text-gray); font-size: 14px;">У вас пока нет достижений.</p>';
    } else {
        State.user.unlockedAchievements.forEach(achId => {
            const div = document.createElement('div');
            div.className = 'ach-list-item';
            div.innerHTML = `<img src="${window.CONFIG.GITHUB_BASE}achievements/${achId}.png">`;
            div.onclick = () => pinAchievement(achId);
            list.appendChild(div);
        });
    }
    
    document.getElementById('showcaseModal').style.display = 'flex';
}

function pinAchievement(achId) {
    if (activeShowcaseSlot !== null) {
        State.user.showcase[activeShowcaseSlot] = achId;
        window.api.saveUserState(State.user);
        renderProfile(); // Обновит иконки в витрине
    }
    document.getElementById('showcaseModal').style.display = 'none';
}

// ЗАДАНИЯ С ОДНИМ УРОВНЕМ
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
    const progressData = State.user.taskProgress;

    container.innerHTML = branches.map(branch => {
        const userProg = progressData[branch.id] || { currentLevel: 1, currentScore: 0 };
        
        // Ищем текущий активный уровень
        const activeLevel = branch.levels.find(lv => lv.lv === userProg.currentLevel);

        if (!activeLevel) {
            // Если нет активного уровня, значит ветка пройдена полностью
            return `
            <div style="margin-bottom: 15px;">
                <h4 style="color:var(--accent); margin-bottom:10px; font-size:16px;">${branch.title}</h4>
                <div class="task-level" style="text-align:center; color:var(--status-green);">
                    <i class="fas fa-check-circle" style="font-size:24px; margin-bottom:10px;"></i>
                    <br>Все уровни пройдены!
                </div>
            </div>`;
        }

        const percent = Math.min(100, (userProg.currentScore / activeLevel.target) * 100);

        return `
            <div style="margin-bottom: 15px;">
                <h4 style="color:var(--accent); margin-bottom:10px; font-size:16px;">${branch.title}</h4>
                <div class="task-level">
                    <div style="display:flex; justify-content:space-between; margin-bottom: 8px;">
                        <span style="font-size:14px; font-weight:bold;">Уровень ${activeLevel.lv}: ${activeLevel.text}</span>
                        <span style="color:#FFD700; font-weight:bold;">+${activeLevel.reward} <i class="fas fa-book-open"></i></span>
                    </div>
                    
                    <div class="progress-bar-container">
                        <div class="progress-fill" style="width: ${percent}%;"></div>
                    </div>
                    
                    <div style="font-size:12px; color:var(--text-gray); text-align:right; margin-bottom: 12px;">
                        Прогресс: ${userProg.currentScore} / ${activeLevel.target}
                    </div>

                    <button class="blue-action-btn" style="padding: 10px; font-size: 14px;" onclick="initTaskUpload('${branch.id}')">
                        <i class="fas fa-camera"></i> Прикрепить фото
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ЛОГИКА ЗАГРУЗКИ ФОТО ДЛЯ ЗАДАНИЯ
function initTaskUpload(branchId) {
    State.activeUploadBranchId = branchId;
    document.getElementById('taskFileInput').click();
}

function handleTaskFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('taskPhotoPreview');
        preview.src = e.target.result;
        preview.style.display = 'block';
        document.getElementById('taskUploadModal').style.display = 'flex';
    };
    reader.readAsDataURL(file);
    event.target.value = ''; // Сброс инпута
}

function closeTaskUploadModal() {
    document.getElementById('taskUploadModal').style.display = 'none';
    State.activeUploadBranchId = null;
}

function submitTaskPhoto() {
    // В будущем тут будет отправка FormData на сервер.
    // Сейчас ДЛЯ ТЕСТА мы просто переводим пользователя на следующий уровень.
    const branchId = State.activeUploadBranchId;
    if (branchId && State.user.taskProgress[branchId]) {
        let prog = State.user.taskProgress[branchId];
        prog.currentLevel += 1; // Увеличиваем уровень
        prog.currentScore = 0;
        window.api.saveUserState(State.user);
        
        // Тест достижения 2 (выдаем за 5 уровней мастера штриховки)
        if (branchId === 'master_colorist' && prog.currentLevel > 5) {
            grantAchievement('ach2', 'Завершено 5 заданий!');
        }
        
        renderTasks();
    }
    
    closeTaskUploadModal();
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
