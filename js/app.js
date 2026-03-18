/**
 * app.js — Полный контроллер (Исправленная версия)
 */

const State = {
    user: null,
    markers: [],
    cart: [],
    currentTab: 'profile',
    userId: '496779756', // Твой ID по умолчанию
    activeUploadBranchId: null
};

let pendingAvatarUrl = '';
let activeShowcaseSlot = null;
let currentInfoSlot = null;

// БАЗА ОПИСАНИЙ ДОСТИЖЕНИЙ
const ACH_DATA = {
    'ach1': { title: 'Смена имиджа!', desc: 'Вы успешно изменили свой аватар.' },
    'ach2': { title: 'Легенда штриховки', desc: 'Завершено 5 заданий в ветке мастера.' }
};

// ОБНОВЛЕННЫЕ ЦВЕТА ДЛЯ УРОВНЕЙ
const LEVEL_COLORS = {
    1: '#a3a3a3', // Серый
    2: '#34bdeb', // Голубой
    3: '#9b59b6', // Фиолетовый
    4: '#ff3b30', // Красный
    5: '#ffd700'  // Золотой
};

async function init() {
    console.log("Запуск приложения...");
    
    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.expand(); 
        tg.ready();
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

    const adminBlock = document.getElementById('adminAiBlock');
    if (adminBlock) adminBlock.style.display = 'none';

    const targetPage = document.getElementById(tabId);
    const targetBtn = document.getElementById('btn-' + tabId);

    if (targetPage && targetBtn) {
        targetPage.style.setProperty('display', 'block', 'important');
        targetPage.classList.add('active');
        targetBtn.classList.add('active');
        
        State.currentTab = tabId;
        
        // Логика показа админки
        if (tabId === 'aipalette' && adminBlock) {
            if (String(State.userId) === '496779756') {
                adminBlock.style.display = 'block';
            }
        }
        window.scrollTo(0, 0);
    }
}

// ПРОФИЛЬ
function renderProfile() {
    if (!State.user) return;

    document.getElementById('user-avatar').src = State.user.avatar;
    document.getElementById('displayUsername').innerText = State.user.name;
    document.getElementById('userBalance').innerText = State.user.balance;
    document.getElementById('currentStatus').innerText = State.user.status;

    // Сетка пресетов аватарок
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

    // Слоты достижений (витрина)
    for (let i = 0; i < 3; i++) {
        const slotEl = document.getElementById(`slot-${i}`);
        if (!slotEl) continue;
        const achId = State.user.showcase[i];
        if (achId) {
            slotEl.innerHTML = `<img src="${window.CONFIG.GITHUB_BASE}achievements/${achId}.png" alt="Achievement">`;
            slotEl.onclick = () => showAchievementInfo(achId, i);
        } else {
            slotEl.innerHTML = '<i class="fas fa-lock"></i>';
            slotEl.onclick = () => openShowcaseModal(i);
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

// ДОСТИЖЕНИЯ И АЛЕРТЫ
function grantAchievement(achId, defaultText) {
    if (!State.user.unlockedAchievements.includes(achId)) {
        State.user.unlockedAchievements.push(achId);
        window.api.saveUserState(State.user);
        const data = ACH_DATA[achId] || { title: 'Новое достижение!', desc: defaultText };
        document.getElementById('alertTitle').innerText = '🏆 ' + data.title;
        const imgEl = document.getElementById('alertAchImg');
        imgEl.src = `${window.CONFIG.GITHUB_BASE}achievements/${achId}.png`;
        imgEl.style.display = 'block';
        document.getElementById('alertAchText').innerText = data.desc;
        document.getElementById('achievementAlert').style.display = 'flex';
    }
}

function showAchievementInfo(achId, slotIndex) {
    currentInfoSlot = slotIndex;
    const data = ACH_DATA[achId] || { title: 'Достижение', desc: 'Описание пока скрыто.' };
    document.getElementById('achInfoTitle').innerText = data.title;
    document.getElementById('achInfoImg').src = `${window.CONFIG.GITHUB_BASE}achievements/${achId}.png`;
    document.getElementById('achInfoDesc').innerText = data.desc;
    document.getElementById('achInfoModal').style.display = 'flex';
}

function replaceShowcaseSlot() {
    document.getElementById('achInfoModal').style.display = 'none';
    openShowcaseModal(currentInfoSlot);
}

function openShowcaseModal(slotIndex) {
    activeShowcaseSlot = slotIndex;
    const list = document.getElementById('availableAchievementsList');
    list.innerHTML = '';
    if (State.user.unlockedAchievements.length === 0) {
        list.innerHTML = '<p style="grid-column: 1 / -1; color: var(--text-gray); font-size: 14px;">У вас пока нет достижений.</p>';
    } else {
        State.user.unlockedAchievements.forEach(achId => {
            const isEquipped = State.user.showcase.includes(achId);
            const isCurrentSlot = State.user.showcase[slotIndex] === achId;
            if (isEquipped && !isCurrentSlot) return;
            const div = document.createElement('div');
            div.className = 'ach-list-item';
            if (isCurrentSlot) div.style.borderColor = 'var(--status-green)';
            div.innerHTML = `<img src="${window.CONFIG.GITHUB_BASE}achievements/${achId}.png">`;
            div.onclick = () => pinAchievement(achId);
            list.appendChild(div);
        });
    }
    document.getElementById('showcaseModal').style.display = 'flex';
}

function clearAchievementSlot() {
    if (activeShowcaseSlot !== null) {
        State.user.showcase[activeShowcaseSlot] = null;
        window.api.saveUserState(State.user);
        renderProfile();
    }
    document.getElementById('showcaseModal').style.display = 'none';
}

function pinAchievement(achId) {
    if (activeShowcaseSlot !== null) {
        State.user.showcase[activeShowcaseSlot] = achId;
        window.api.saveUserState(State.user);
        renderProfile();
    }
    document.getElementById('showcaseModal').style.display = 'none';
}

// ЗАДАНИЯ
function toggleTasks() {
    const content = document.getElementById('tasksList');
    const arrow = document.getElementById('tasksArrow');
    const isHidden = content.style.display === 'none';
    content.style.display = isHidden ? 'block' : 'none';
    arrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
}

function renderTasks() {
    const container = document.getElementById('tasksList');
    if (!container) return;
    const branches = window.api.getTaskData();
    const progressData = State.user.taskProgress;

    container.innerHTML = branches.map(branch => {
        const userProg = progressData[branch.id] || { currentLevel: 1, currentScore: 0 };
        const activeLevel = branch.levels.find(lv => lv.lv === userProg.currentLevel);

        if (userProg.currentLevel > 5) {
            return `
            <div style="margin-bottom: 15px;">
                <h4 style="color:var(--status-green); margin-bottom:10px; font-size:16px;">${branch.title}</h4>
                <div class="task-level" style="text-align:center; color:var(--status-green); border-color: var(--status-green);">
                    <i class="fas fa-check-circle" style="font-size:24px; margin-bottom:10px;"></i>
                    <br>Все 5 уровней пройдены!
                </div>
            </div>`;
        }

        const percent = Math.min(100, (userProg.currentScore / activeLevel.target) * 100);
        const levelColor = LEVEL_COLORS[activeLevel.lv] || 'var(--accent)';

        return `
            <div style="margin-bottom: 15px;">
                <h4 style="color:${levelColor}; margin-bottom:10px; font-size:16px;">${branch.title} (Уровень ${activeLevel.lv})</h4>
                <div class="task-level" style="border-color: ${levelColor};">
                    <div style="display:flex; justify-content:space-between; margin-bottom: 8px;">
                        <span style="font-size:14px; font-weight:bold;">${activeLevel.text}</span>
                        <span style="color:#FFD700; font-weight:bold;">+${activeLevel.reward} <i class="fas fa-book-open"></i></span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-fill" style="width: ${percent}%; background-color: ${levelColor};"></div>
                    </div>
                    <div style="font-size:12px; color:var(--text-gray); text-align:right; margin-bottom: 12px;">
                        Прогресс: ${userProg.currentScore} / ${activeLevel.target}
                    </div>
                    <button class="blue-action-btn" style="padding: 10px; font-size: 14px; background-color: ${levelColor}; color: #000;" onclick="initTaskUpload('${branch.id}')">
                        <i class="fas fa-camera"></i> Прикрепить фото
                    </button>
                    <button class="balance-btn" style="margin-top: 10px; padding: 6px; font-size: 12px; border: 1px dashed ${levelColor}; color: ${levelColor}; background: transparent;" onclick="testAdminAddPoint('${branch.id}', ${activeLevel.target})">
                        <i class="fas fa-wrench"></i> Тест: +1 очко
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

window.testAdminAddPoint = function(branchId, target) {
    let prog = State.user.taskProgress[branchId];
    prog.currentScore += 1;
    
    if (prog.currentScore >= target) {
        const branch = window.api.getTaskData().find(b => b.id === branchId);
        
        if (prog.currentLevel < 5) {
            prog.currentLevel += 1;
            prog.currentScore = 0;
            const nextLevel = branch.levels.find(l => l.lv === prog.currentLevel);
            
            document.getElementById('alertTitle').innerText = '🌟 Новый уровень!';
            document.getElementById('alertAchImg').style.display = 'none'; 
            document.getElementById('alertAchText').innerText = `Уровень ${nextLevel.lv}\n${nextLevel.text}`;
            document.getElementById('achievementAlert').style.display = 'flex';
        } else if (prog.currentLevel === 5) {
            prog.currentLevel = 6; 
            if (branch.statusReward && !State.user.unlockedStatuses.includes(branch.statusReward)) {
                State.user.unlockedStatuses.push(branch.statusReward);
                State.user.status = branch.statusReward;
                document.getElementById('currentStatus').innerText = branch.statusReward;
                
                setTimeout(() => {
                    document.getElementById('alertTitle').innerText = '👑 Новый статус!';
                    document.getElementById('alertAchText').innerText = branch.statusReward;
                    document.getElementById('achievementAlert').style.display = 'flex';
                }, 500);
            }
            if (branch.achReward) {
                setTimeout(() => { grantAchievement(branch.achReward, 'Задание выполнено!'); }, 2000);
            }
        }
    }
    window.api.saveUserState(State.user);
    renderTasks();
};

function initTaskUpload(branchId) {
    State.activeUploadBranchId = branchId;
    document.getElementById('taskFileInput').click();
}

function handleTaskFile(event) {
    const files = event.target.files;
    if (!files.length) return;
    const container = document.getElementById('taskPhotoPreviewContainer');
    container.innerHTML = '';
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            container.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
    document.getElementById('taskUploadModal').style.display = 'flex';
    event.target.value = '';
}

function closeTaskUploadModal() {
    document.getElementById('taskUploadModal').style.display = 'none';
    State.activeUploadBranchId = null;
}

// МАРКЕРЫ
function renderMarkers() {
    const container = document.getElementById('markersList');
    if (!container) return;
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
    if (!marker) return;
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
    renderMarkers(); 
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const totalCount = State.cart.reduce((sum, item) => sum + item.count, 0);
    badge.innerText = totalCount;
    badge.style.display = totalCount > 0 ? 'block' : 'none';
}

// СТАТУСЫ, ГАЛЕРЕЯ И АДМИНКА
window.openStatusInfo = function() {
    const list = document.getElementById('availableStatusesList');
    if (!list) return;
    list.innerHTML = State.user.unlockedStatuses.map(st => `
        <button class="balance-btn" style="width:100%; margin-bottom:10px; ${State.user.status === st ? 'border: 1px solid var(--status-green); color:var(--status-green);' : ''}" onclick="selectStatus('${st}')">${st}</button>
    `).join('');
    document.getElementById('statusSelectModal').style.display = 'flex';
}

window.selectStatus = function(st) {
    State.user.status = st;
    window.api.saveUserState(State.user);
    document.getElementById('currentStatus').innerText = st;
    document.getElementById('statusSelectModal').style.display = 'none';
}

let currentGalleryTome = 1;
let currentGalleryPage = 1;

// --- ГАЛЕРЕЯ ОТВЕТОВ (Версия без фантомных алертов) ---
let currentGalleryTome = 1;
let currentGalleryPage = 1;

window.openAnswersGallery = function(tomeNum) {
    currentGalleryTome = tomeNum;
    currentGalleryPage = 1;
    // Сначала показываем модалку, чтобы проверка внутри updateGalleryImage прошла успешно
    const modal = document.getElementById('answersGalleryModal');
    if (modal) modal.style.display = 'flex';
    updateGalleryImage();
}

window.updateGalleryImage = function() {
    const imgEl = document.getElementById('galleryMainImage');
    const indicator = document.getElementById('galleryPageIndicator');
    const modal = document.getElementById('answersGalleryModal');
    
    if (!imgEl) return;

    imgEl.onerror = function() {
        this.onerror = null;
        this.src = 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av2.png';
        
        // ПРОВЕРКА: Если модалка закрыта (none или пустая строка), вообще ничего не пишем
        const isVisible = modal && (modal.style.display === 'flex' || modal.style.display === 'block');
        
        if (isVisible && currentGalleryPage > 1) {
            alert('Больше страниц нет');
            // Откатываем страницу назад, так как текущая не загрузилась
            currentGalleryPage--;
            if (indicator) indicator.innerText = `Страница ${currentGalleryPage}`;
        }
    };

    imgEl.src = `${window.CONFIG.GITHUB_BASE}otveti/t${currentGalleryTome}/${currentGalleryPage}.png`;
    if (indicator) indicator.innerText = `Страница ${currentGalleryPage}`;
}

window.nextGalleryPage = function() {
    currentGalleryPage++;
    updateGalleryImage();
}

window.prevGalleryPage = function() {
    if (currentGalleryPage > 1) {
        currentGalleryPage--;
        updateGalleryImage();
    }
}

window.closeAnswersGallery = function() {
    const modal = document.getElementById('answersGalleryModal');
    if (modal) modal.style.display = 'none';
}


window.submitAdminAiTrain = function() {
    const file = document.getElementById('adminAiInput').files[0];
    const brand = document.getElementById('adminAiBrand').value.trim();
    const number = document.getElementById('adminAiNumber').value.trim();
    if (!file || !brand || !number) { alert("Заполните все поля!"); return; }
    alert(`Данные отправлены!\nБренд: ${brand}\nМаркер: ${number}`);
};

window.resetAllData = function() {
    if(confirm("Сбросить прогресс?")) { localStorage.clear(); location.reload(); }
};

document.addEventListener('DOMContentLoaded', init);
