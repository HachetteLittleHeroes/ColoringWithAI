/**
 * app.js — Полный контроллер
 */

const State = {
    user: null,
    markers: [],
    cart: [],
    currentTab: 'profile',
    userId: '496779756',
    activeUploadBranchId: null
};
window.CONFIG = {
    GITHUB_BASE: 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/'
};


let pendingAvatarUrl = '';
let activeShowcaseSlot = null;
let currentInfoSlot = null; // Для модалки с описанием

// ОБЪЯВЛЯЕМ ПЕРЕМЕННЫЕ ГАЛЕРЕИ ОДИН РАЗ
let currentGalleryTome = 1;
let currentGalleryPage = 1;
let maxGalleryPages = 50;
let touchStartX = 0;
let touchStartY = 0;
let currentVol, currentPage, maxPages; // Для старых функций, если нужны

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
    5: '#ffd700'  // Золотой/Желтый
};

async function init() {
    console.log("Запуск системы...");
    const loader = document.getElementById('loading-screen');
    
    try {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.expand();
            tg.ready();
            State.userId = tg.initDataUnsafe?.user?.id?.toString() || '496779756';
        }

        // Загружаем данные
        if (window.api) {
            State.user = await window.api.getUser(State.userId);
        }
        if (typeof window.loadMarkersFromCSV === 'function') {
            await window.loadMarkersFromCSV();
        }

        // Загружаем органайзеры, если функция есть в ui.js
        if (typeof loadOrganizers === 'function') {
            await loadOrganizers();
        }

        // Отрисовываем интерфейс
        if (typeof renderProfile === 'function') renderProfile();
        if (typeof renderTasks === 'function') renderTasks();
        if (typeof updateCartBadge === 'function') updateCartBadge();

    } catch (error) {
        console.error("Ошибка при инициализации:", error);
        const loadeText = document.getElementById('loading-text');
        if (loadeText) loadeText.innerText = "Ошибка загрузки данных.";
    } finally {
        // Убираем экран загрузки
        setTimeout(() => {
            if (loader) {
                loader.style.transition = "opacity 0.5s ease";
                loader.style.opacity = "0";
                setTimeout(() => {
                    loader.style.display = "none";
                }, 500);
            }
        }, 500);
    }
}

// НАВИГАЦИЯ
function tab(tabId) {
    const pages = document.querySelectorAll('.page');
    const buttons = document.querySelectorAll('.nav-btn');

    // Скрываем всё
    pages.forEach(p => {
        p.style.setProperty('display', 'none', 'important');
        p.classList.remove('active');
    });
    buttons.forEach(b => b.classList.remove('active'));

    // Скрываем админку по умолчанию
    const adminBlock = document.getElementById('adminAiBlock');
    if (adminBlock) adminBlock.style.display = 'none';

    const targetPage = document.getElementById(tabId);
    const targetBtn = document.getElementById('btn-' + tabId);

    if (targetPage && targetBtn) {
        targetPage.style.setProperty('display', 'block', 'important');
        targetPage.classList.add('active');
        targetBtn.classList.add('active');
        
        // Защита: State может быть не инициализирован
        if (window.State) {
            State.currentTab = tabId;
            // Проверка админа
            if (tabId === 'aipalette' && adminBlock) {
                if (String(State.userId) === '496779756' || State.userId === 'твой_настоящий_tg_id') {
                    adminBlock.style.display = 'block';
                }
            }
        }
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

window.loadMarkersFromCSV = async function() {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/1Yrsif-aQwbuT6fLPnP4MsM22UuwuUWz5FYegELPxzFU/gviz/tq?tqx=out:csv&cache=' + new Date().getTime();
    try {
        const res = await fetch(csvUrl);
        const text = await res.text();
        const rows = text.split('\n').map(r => r.split(',').map(c => c.replace(/"/g, '').trim()));
        
        let temp = [];
        rows.forEach(row => {
            for (let i = 0; i < row.length; i++) {
                let num = row[i];
                if (num && !isNaN(num) && parseInt(num) > 10) {
                    let stock = parseInt(row[i+1] || row[i+2] || "0");
                    temp.push({ id: String(num), number: String(num), stock: stock });
                    i++; 
                }
            }
        });
        
        const uniqueMarkers = temp.filter((v, i, a) => 
            a.findIndex(t => t.number === v.number) === i
        );

        State.markers = uniqueMarkers;
        renderMarkers();
        console.log("Маркеры успешно загружены из CSV:", State.markers.length);
    } catch (e) { 
        console.error("Ошибка загрузки CSV:", e); 
    }
};

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

function showStatusAlert(statusName) {
    document.getElementById('alertTitle').innerText = '✨ Новый статус!';
    document.getElementById('alertAchImg').style.display = 'none'; 
    document.getElementById('alertAchText').innerText = statusName;
    document.getElementById('achievementAlert').style.display = 'flex';
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
            if (isEquipped && !isCurrentSlot) return; // Запрещаем установку одного достижения в несколько слотов
            const div = document.createElement('div');
            div.className = 'ach-list-item';
            if (isCurrentSlot) div.style.borderColor = 'var(--status-green)';
            div.innerHTML = `<img src="${window.CONFIG.GITHUB_BASE}achievements/${achId}.png">`;
            div.onclick = () => pinAchievement(achId);
            list.appendChild(div);
        });
        if (list.innerHTML === '') {
            list.innerHTML = '<p style="grid-column: 1 / -1; color: var(--text-gray); font-size: 14px;">Все доступные достижения уже установлены.</p>';
        }
    }
    const clearBtnContainer = document.getElementById('clearSlotBtnContainer');
    if (State.user.showcase[slotIndex]) {
        clearBtnContainer.innerHTML = `<button class="balance-btn" style="background:var(--status-red); border:none; margin-top:10px; width: 100%;" onclick="clearAchievementSlot()">Снять достижение</button>`;
    } else {
        clearBtnContainer.innerHTML = '';
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

// ЗАДАНИЯ И ПРОГРЕССИЯ
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

        if (!activeLevel) {
            return `
            <div style="margin-bottom: 15px;">
                <h4 style="color:var(--status-green); margin-bottom:10px; font-size:16px;">${branch.title}</h4>
                <div class="task-level" style="text-align:center; color:var(--status-green); border-color: var(--status-green);">
                    <i class="fas fa-check-circle" style="font-size:24px; margin-bottom:10px;"></i>
                    <br>Все уровни пройдены!
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
                        <i class="fas fa-wrench"></i> Тест: админ дал +1 очко
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function initTaskUpload(branchId) {
    State.activeUploadBranchId = branchId;
    document.getElementById('taskFileInput').click();
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
            document.getElementById('alertAchText').innerText = `Уровень ${nextLevel.lv}\n${nextLevel.text}\nЦель: ${nextLevel.target}`;
            document.getElementById('achievementAlert').style.display = 'flex';
            
        } else if (prog.currentLevel === 5) {
            prog.currentLevel = 6; 
            prog.currentScore = target;
            
            if (branch.statusReward && !State.user.unlockedStatuses.includes(branch.statusReward)) {
                State.user.unlockedStatuses.push(branch.statusReward);
                State.user.status = branch.statusReward; 
                document.getElementById('currentStatus').innerText = branch.statusReward;
                
                setTimeout(() => {
                    document.getElementById('alertTitle').innerText = '👑 Достигнут новый статус!';
                    document.getElementById('alertAchImg').style.display = 'none';
                    document.getElementById('alertAchText').innerText = branch.statusReward;
                    document.getElementById('achievementAlert').style.display = 'flex';
                }, 500);
            }
            
            if (branch.achReward) {
                setTimeout(() => { 
                    grantAchievement(branch.achReward, 'Задание полностью выполнено!'); 
                }, 2000); 
            }
        }
    }
    window.api.saveUserState(State.user);
    renderTasks();
};

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

function submitTaskPhoto() {
    closeTaskUploadModal();
    alert("Фотографии отправлены!");
}

// МАРКЕРЫ И КОРЗИНА
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

// --- ВЫБОР СТАТУСА ---
window.openStatusInfo = function() {
    const list = document.getElementById('availableStatusesList');
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

// --- ГАЛЕРЕЯ ОТВЕТОВ ---
window.startBook = function(v, m) { 
    currentVol = v; 
    maxPages = m; 
    currentPage = 1; 
    document.getElementById('viewer').style.display = 'block'; 
    window.updatePage(); 
};

window.updatePage = function() {
    const img = document.getElementById('galleryMainImage');
    const counter = document.getElementById('galleryPageIndicator');
    
    if (!img || !counter) return;

    img.style.display = 'block';
    
    const currentSrc = `${window.CONFIG.GITHUB_BASE}otveti/tome${currentGalleryTome}/page${currentGalleryPage}.png`;
    
    img.src = currentSrc;
    counter.innerText = `${currentGalleryPage} / ${maxGalleryPages}`;

    img.onerror = () => {
        img.onerror = null; 
        alert('Больше страниц нет!');
        if (currentGalleryPage > 1) {
            currentGalleryPage--;
            window.updatePage();
        }
    };
};

window.handleTouchStart = function(e) { 
    touchStartX = e.touches[0].screenX; 
    touchStartY = e.touches[0].screenY; 
};

window.handleTouchEnd = function(e) {
    let dx = touchStartX - e.changedTouches[0].screenX;
    let dy = touchStartY - e.changedTouches[0].screenY;
    
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0) { 
            currentGalleryPage++; 
            window.updatePage(); 
        } else if (dx < 0 && currentGalleryPage > 1) { 
            currentGalleryPage--; 
            window.updatePage(); 
        }
    }
};

window.openBook = function(tome, max) {
    currentGalleryTome = tome;
    maxGalleryPages = max;
    currentGalleryPage = 1;
    const modal = document.getElementById('answersGalleryModal'); // Исправленный ID
    if (modal) modal.style.display = 'flex'; 
    window.updatePage();
};

window.closeBook = function() {
    const modal = document.getElementById('answersGalleryModal'); // Исправленный ID
    if (modal) modal.style.display = 'none';
};

window.closeAnswersGallery = window.closeBook; // Чтобы работала кнопка из HTML


window.checkout = function() {
    const cart = window.State.cart;
    if (cart.length === 0) return;
    
    let markersCount = 0;
    cart.forEach(item => { 
        if (!item.type || item.type === 'Маркер') markersCount += item.count; 
    });
    
    if (markersCount > 0 && markersCount < 3) {
        window.Telegram.WebApp.showAlert("⚠️ Минимальный заказ маркеров — от 3 штук.");
        return;
    }
    
    let totalSum = 0;
    let details = `🛍 **ДЕТАЛИ ЗАКАЗА:**\n`;
    
    cart.forEach(item => {
        const price = item.price || 75; 
        const sum = price * item.count; 
        totalSum += sum;
        details += `▪️ Маркер №${item.number}\n   - ${item.count} шт. x ${price} = ${sum} руб.\n`;
    });

    let bonusToEarn = 0;
    if (totalSum >= 3000 && totalSum < 5000) bonusToEarn = 20;
    else if (totalSum >= 5000 && totalSum < 7500) bonusToEarn = 30;
    else if (totalSum >= 7500 && totalSum < 10000) bonusToEarn = 40;
    else if (totalSum >= 10000) bonusToEarn = 50;
    
    details += `\n💰 **ИТОГО: ${totalSum} руб.**`;
    details += `\n📖 **БОНУС К НАЧИСЛЕНИЮ: ${bonusToEarn}**`;
    
    window.Telegram.WebApp.sendData(JSON.stringify({ details: details })); 
    window.Telegram.WebApp.close(); 
};

// --- АДМИН-ПАНЕЛЬ ИИ ---
window.submitAdminAiTrain = function() {
    const file = document.getElementById('adminAiInput').files[0];
    const brand = document.getElementById('adminAiBrand').value.trim();
    const number = document.getElementById('adminAiNumber').value.trim();
    
    if (!file || !brand || !number) {
        alert("Пожалуйста, заполните все поля и выберите фото!");
        return;
    }
    
    alert(`Данные успешно отправлены в базу!\nБренд: ${brand}\nМаркер: ${number}`);
    
    document.getElementById('adminAiInput').value = '';
    document.getElementById('adminAiBrand').value = '';
    document.getElementById('adminAiNumber').value = '';
}

// ФУНКЦИЯ ПОЛНОГО СБРОСА
window.resetAllData = function() {
    if(confirm("Вы уверены, что хотите полностью сбросить прогресс? Все данные будут удалены.")) {
        localStorage.clear();
        location.reload();
    }
};

window.updateCartBadge = updateCartBadge;

// Инициализация при старте
if (document.readyState === "complete" || document.readyState === "interactive") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}
window.State = State;
// Функции для кнопок-стрелок в модалке ответов
window.nextGalleryPage = function() {
    currentGalleryPage++;
    window.updatePage();
};

window.prevGalleryPage = function() {
    if (currentGalleryPage > 1) {
        currentGalleryPage--;
        window.updatePage();
    }
};

// Заглушка для старого названия, чтобы не летели ошибки
window.openAnswersGallery = function(tome) {
    // Вызываем новую функцию, ставим 50 страниц по умолчанию
    window.openBook(tome, 50);
};
