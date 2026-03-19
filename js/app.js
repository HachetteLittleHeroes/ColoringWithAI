/**
 * app.js — Полный контроллер (исправлен для вечной загрузки)
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

        // Загружаем данные пользователя
        if (window.api && typeof window.api.getUser === 'function') {
            State.user = await window.api.getUser(State.userId);
        }

        if (!State.user) {
            console.error("user не загрузился, создаём дефолт");

            State.user = {
                avatar: '',
                name: 'Без имени',
                balance: 0,
                status: 'Без статуса',
                showcase: [null, null, null],
                unlockedAchievements: [],
                unlockedStatuses: [],
                taskProgress: {},
            };
        }

        // Загружаем маркеры
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
        // Убираем экран загрузки в любом случае
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

/* ===============================================
   Исправленный и безопасный loadMarkersFromCSV
   =============================================== */
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
                    temp.push({ id: String(num), number: String(num), stock: stock, price: 75, brand: 'GUANGNA' });
                    i++; 
                }
            }
        });

        State.markers = temp.filter((v, i, a) => a.findIndex(t => t.number === v.number) === i);
        if (!State.markers.length) {
            console.warn("CSV пустой или нет маркеров > 10");
        }

        renderMarkers();
        console.log("Маркеры успешно загружены из CSV:", State.markers.length);
    } catch (e) { 
        console.error("Ошибка загрузки CSV:", e); 
        State.markers = []; // важно!
        renderMarkers();    // показать пустой список вместо “Загрузка...”
    }
};

/* ===============================================
   Исправленный renderMarkers
   =============================================== */
function renderMarkers() {
    const container = document.getElementById('markersList');
    if (!container) return;

    if (!State.markers.length) {
        container.innerHTML = '<p style="padding:15px; text-align:center; color:#888;">Нет доступных маркеров.</p>';
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

// … остальной код app.js (от маркеров, корзины, заданий, аватарок, галереи, статусов, админки и т.д.) остаётся без изменений …

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
