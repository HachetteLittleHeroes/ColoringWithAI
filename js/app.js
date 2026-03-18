/**
 * app.js — Главный контроллер приложения
 */

// Состояние приложения
const State = {
    user: null,
    markers: [],
    cart: [],
    currentTab: 'profile',
    isAdmin: false, // Установится после загрузки данных
    adminId: '496779756' // Ваш ID для доступа к обучению ИИ
};

// ===================== ИНИЦИАЛИЗАЦИЯ =====================

async function init() {
    console.log("Приложение запускается...");
    
    // 1. Получаем ID из Telegram или ставим тестовый
    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.expand();
        tg.ready();
        State.userId = tg.initDataUnsafe?.user?.id?.toString() || '496779756';
    } else {
        State.userId = '496779756';
    }

    State.isAdmin = (State.userId === State.adminId);

    // 2. Загружаем данные
    State.user = await window.api.getUser(State.userId);
    State.markers = await window.api.fetchMarkers();
    State.cart = window.api.getCart();

    // 3. Первичный рендер
    renderProfile();
    renderMarkers();
    renderTasks();
    updateCartBadge();
    
    if (State.isAdmin) {
        document.getElementById('adminAIBlock').style.display = 'block';
    }

    // Показываем профиль по умолчанию
    tab('profile');
}

// ===================== НАВИГАЦИЯ =====================

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

// ===================== ЛОГИКА ПРОФИЛЯ =====================

function renderProfile() {
    document.getElementById('user-avatar').src = State.user.avatar;
    document.getElementById('displayUsername').innerText = State.user.name;
    document.getElementById('userBalance').innerText = State.user.balance;
    document.getElementById('currentStatus').innerText = State.user.status;

    // Рендер пресетов аватарок (8 штук)
    const presetGrid = document.getElementById('avatarPresets');
    presetGrid.innerHTML = '';
    for (let i = 1; i <= 8; i++) {
        const img = document.createElement('img');
        img.src = `https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/avatars/av${i}.png`;
        img.onclick = () => selectAvatar(img.src);
        presetGrid.appendChild(img);
    }
}

function toggleAvatarEditor() {
    const el = document.getElementById('avatarEditorBlock');
    const isHidden = el.style.display === 'none';
    el.style.display = isHidden ? 'block' : 'none';
}

async function selectAvatar(url) {
    State.user.avatar = url;
    document.getElementById('user-avatar').src = url;
    await window.api.updateProfile(State.userId, 'avatar', url);
    toggleAvatarEditor();
}

async function handleCustomAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;
    // В реальности тут была бы загрузка на сервер, пока имитируем:
    const reader = new FileReader();
    reader.onload = async (e) => {
        const url = e.target.result;
        selectAvatar(url);
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

// Управление под-секциями (Магазин, Заработок)
function toggleSection(id) {
    const el = document.getElementById(id);
    const isVisible = el.style.display === 'block';
    
    // Скрываем другие, если открываем новую
    document.getElementById('rewards-section').style.display = 'none';
    document.getElementById('earn-section').style.display = 'none';
    
    el.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible && id === 'earn-section') renderEarnInstructions();
}

function renderEarnInstructions() {
    const container = document.getElementById('earnInstructions');
    container.innerHTML = `
        <div class="earn-card">
            <p>Подписка на канал</p>
            <span class="earn-bonus">+50 <i class="fas fa-book-open"></i></span>
        </div>
        <div class="earn-card">
            <p>Отзыв о наборе</p>
            <span class="earn-bonus">+100 <i class="fas fa-book-open"></i></span>
        </div>
    `;
}

// ===================== ЗАДАНИЯ И ДОСТИЖЕНИЯ =====================

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
    
    container.innerHTML = branches.map(branch => `
        <div class="task-branch">
            <h4 style="margin-bottom:10px; color:var(--accent);">${branch.title}</h4>
            ${branch.levels.map(lv => `
                <div class="task-level ${lv.glow}">
                    <div style="display:flex; justify-content:space-between;">
                        <span>Уровень ${lv.lv}: ${lv.text}</span>
                        <span style="color:#FFD700">+${lv.reward} <i class="fas fa-book-open"></i></span>
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');
}

// ===================== МАРКЕРЫ И КОРЗИНА =====================

function renderMarkers() {
    const container = document.getElementById('markersList');
    if (!State.markers.length) {
        container.innerHTML = '<p style="padding:20px; text-align:center;">Загрузка маркеров...</p>';
        return;
    }

    container.innerHTML = State.markers.map(m => {
        let stockClass = 'stock-high';
        let stockText = `${m.stock} шт. в наличии`;
        
        if (m.stock <= 1) stockClass = 'stock-low';
        if (m.stock === 0) {
            stockClass = 'stock-none';
            stockText = 'Нет в наличии';
        }

        const cartItem = State.cart.find(item => item.id === m.id);
        const count = cartItem ? cartItem.count : 0;

        return `
            <div class="marker-item">
                <div class="marker-info">
                    <div style="font-weight:bold; font-size:18px;">№ ${m.number}</div>
                    <div class="${stockClass}" style="font-size:12px;">${stockText}</div>
                </div>
                <div class="marker-controls">
                    <button class="btn-circle ${count === 0 ? 'disabled' : ''}" onclick="changeCart('${m.id}', -1)">-</button>
                    <span style="min-width:20px; text-align:center; font-weight:bold;">${count}</span>
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
        if (!cartItem) {
            State.cart.push({ ...marker, count: 1 });
        } else if (cartItem.count < marker.stock) {
            cartItem.count++;
        }
    } else {
        if (cartItem) {
            cartItem.count--;
            if (cartItem.count <= 0) {
                State.cart = State.cart.filter(item => item.id !== id);
            }
        }
    }

    window.api.saveCart(State.cart);
    renderMarkers();
    updateCartBadge();
    if (State.currentTab === 'cart') renderCart();
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const totalCount = State.cart.reduce((sum, item) => sum + item.count, 0);
    
    if (totalCount > 0) {
        badge.innerText = totalCount;
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

function renderCart() {
    const container = document.getElementById('cartItemsList');
    const totalSumEl = document.getElementById('cartTotalSum');
    
    if (State.cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:50px; opacity:0.5;">Корзина пуста</p>';
        totalSumEl.innerText = '0';
        return;
    }

    let total = 0;
    container.innerHTML = State.cart.map(item => {
        total += item.price * item.count;
        return `
            <div class="marker-item">
                <div>
                    <b>№ ${item.number}</b><br>
                    <small>${item.price} ₽ x ${item.count}</small>
                </div>
                <div>${item.price * item.count} ₽</div>
            </div>
        `;
    }).join('');
    totalSumEl.innerText = total;
}

// ===================== ИИ ПАЛИТРА =====================

async function processAI(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Показываем загрузку
    const resultBox = document.getElementById('aiResult');
    resultBox.style.display = 'block';
    resultBox.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Анализируем цвет...</p>';

    // Имитация работы ИИ
    setTimeout(() => {
        resultBox.innerHTML = `
            <div style="background:var(--accent-soft); padding:15px; border-radius:12px; border:1px solid var(--accent);">
                <h4 style="color:var(--accent)">Результат анализа:</h4>
                <p style="margin-top:10px;">Ближайший маркер: <b>№ 102 (GuangNa)</b></p>
                <p>Точность соответствия: <b>98.4%</b></p>
            </div>
        `;
    }, 2000);
}

function startAITraining() {
    if (!State.isAdmin) return;
    alert("Запущен процесс создания 25 вариаций освещения для текущей партии маркеров. Данные будут обновлены на сервере.");
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', init);
