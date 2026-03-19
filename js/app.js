// ==========================================
// ИНИЦИАЛИЗАЦИЯ TELEGRAM WEB APP
// ==========================================
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Настройка основной темы под Telegram
document.documentElement.style.setProperty('--bg', tg.themeParams.bg_color || '#1e1e1e');
document.documentElement.style.setProperty('--text', tg.themeParams.text_color || '#ffffff');
document.documentElement.style.setProperty('--accent', tg.themeParams.button_color || '#007aff');

// ==========================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И ДАННЫЕ
// ==========================================

// Конфигурация уровней
const levelConfig = [
    { level: 1, name: "Новичок", xpReq: 0, color: "gray" },
    { level: 2, name: "Любитель", xpReq: 100, color: "blue" },
    { level: 3, name: "Художник", xpReq: 300, color: "purple" },
    { level: 4, name: "Мастер", xpReq: 600, color: "red" },
    { level: 5, name: "Легенда", xpReq: 1000, color: "gold" }
];

// База данных достижений
const achievementsDB = {
    'first_task': { id: 'first_task', name: 'Первый шаг', img: 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/achievements/ach1.png', desc: 'Выполнено первое задание.' },
    'rich_boy': { id: 'rich_boy', name: 'Копилка', img: 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/achievements/ach2.png', desc: 'Накоплено 1000 ашетиков.' },
    'ai_master': { id: 'ai_master', name: 'Техно-маг', img: 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/achievements/ach3.png', desc: 'ИИ Палитра использована 5 раз.' },
    'shopaholic': { id: 'shopaholic', name: 'Шопоголик', img: 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/achievements/ach4.png', desc: 'Сделан первый заказ в корзине.' },
    'collector': { id: 'collector', name: 'Коллекционер', img: 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/achievements/ach5.png', desc: 'Разблокировано 3 статуса.' }
};

// Задания для проверки админом (фото)
const tasksList = [
    { id: 'task_1', title: 'Раскрась 1 страницу Hachette', reward: 50, xp: 20 },
    { id: 'task_2', title: 'Раскрась 3 страницы', reward: 150, xp: 50 },
    { id: 'task_3', title: 'Сделай градиент маркерами', reward: 100, xp: 40 },
    { id: 'task_4', title: 'Оставь отзыв с фото', reward: 200, xp: 100 },
    { id: 'task_5', title: 'Купи любую книгу', reward: 300, xp: 150 }
];

// Маркеры (Бренд GUANGNA)
const markersDB = [
    { id: 'g1', num: '1', color: '#800000', name: 'Wine Red' },
    { id: 'g2', num: '2', color: '#A52A2A', name: 'Old Red' },
    { id: 'g3', num: '3', color: '#FF0000', name: 'Rose Red' },
    { id: 'g4', num: '4', color: '#FF69B4', name: 'Vivid Pink' },
    { id: 'g5', num: '5', color: '#FF1493', name: 'Cherry Pink' },
    { id: 'g6', num: '6', color: '#FFC0CB', name: 'Pale Pink' },
    { id: 'g10', num: '10', color: '#8B0000', name: 'Deep Red' },
    { id: 'g11', num: '11', color: '#DC143C', name: 'Carmine' },
    { id: 'g14', num: '14', color: '#FF4500', name: 'Vermilion' },
    { id: 'g23', num: '23', color: '#FFA500', name: 'Orange' },
    { id: 'g35', num: '35', color: '#FFFF00', name: 'Lemon Yellow' },
    { id: 'g43', num: '43', color: '#556B2F', name: 'Deep Olive Green' },
    { id: 'g48', num: '48', color: '#00FF00', name: 'Yellow Green' },
    { id: 'g53', num: '53', color: '#008080', name: 'Turquoise Green' },
    { id: 'g63', num: '63', color: '#4682B4', name: 'Cerulean Blue' },
    { id: 'g71', num: '71', color: '#00008B', name: 'Cobalt Blue' },
    { id: 'g81', num: '81', color: '#8A2BE2', name: 'Deep Violet' },
    { id: 'g91', num: '91', color: '#8B4513', name: 'Natural Oak' },
    { id: 'g120', num: '120', color: '#000000', name: 'Black' }
];

// Товары
const products = {
    'tome1': { name: 'Том 1', price: 1500, img: 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/bonusi/b4.png' },
    'tome2': { name: 'Том 2', price: 1500, img: 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/bonusi/b4.png' }
};

// ==========================================
// СОСТОЯНИЕ ПОЛЬЗОВАТЕЛЯ (LOCAL STORAGE)
// ==========================================

let user = JSON.parse(localStorage.getItem('coloring_user')) || {
    name: tg.initDataUnsafe?.user?.first_name || 'Без имени',
    balance: 0,
    xp: 0,
    level: 1,
    avatar: 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av2.png',
    status: 'Новичок',
    unlockedStatuses: ['Новичок'],
    achievements: [],
    showcase: [null, null, null],
    tasksProgress: {}, 
    aiUsageCount: 0
};

let cart = JSON.parse(localStorage.getItem('coloring_cart')) || {};

function saveData() {
    localStorage.setItem('coloring_user', JSON.stringify(user));
    localStorage.setItem('coloring_cart', JSON.stringify(cart));
    updateProfileUI();
}

// ==========================================
// ОБНОВЛЕНИЕ ИНТЕРФЕЙСА (UI)
// ==========================================

function updateProfileUI() {
    // 1. Имя и аватар
    document.getElementById('displayUsername').innerText = user.name;
    document.getElementById('user-avatar').src = user.avatar;
    
    // 2. Баланс
    document.getElementById('userBalance').innerText = user.balance;

    // 3. Вычисление уровня по XP
    let currentLevelObj = levelConfig[0];
    for (let i = 0; i < levelConfig.length; i++) {
        if (user.xp >= levelConfig[i].xpReq) {
            currentLevelObj = levelConfig[i];
        }
    }
    
    user.level = currentLevelObj.level;
    
    // 4. Статус и цвет бейджа
    const statusBadge = document.getElementById('currentStatus');
    statusBadge.innerText = user.status;
    
    // Применяем цветовую схему уровня
    statusBadge.className = 'status-badge'; // Сброс классов
    if (currentLevelObj.color === 'gray') statusBadge.style.background = '#808080';
    if (currentLevelObj.color === 'blue') statusBadge.style.background = '#007AFF';
    if (currentLevelObj.color === 'purple') statusBadge.style.background = '#8A2BE2';
    if (currentLevelObj.color === 'red') statusBadge.style.background = '#FF3B30';
    if (currentLevelObj.color === 'gold') statusBadge.style.background = '#FFD700';
    statusBadge.style.color = currentLevelObj.color === 'gold' ? '#000' : '#FFF';

    // 5. Витрина достижений
    renderShowcase();
    
    // 6. Корзина
    updateCartBadge();
}

// ==========================================
// НАВИГАЦИЯ (ВКЛАДКИ И СЕКЦИИ)
// ==========================================

function tab(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.getElementById('btn-' + pageId).classList.add('active');
    window.scrollTo(0, 0);
}

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section.style.display === 'none' || section.style.display === '') {
        // Скрываем все остальные sub-page-block
        document.querySelectorAll('.sub-page-block').forEach(el => el.style.display = 'none');
        section.style.display = 'block';
    } else {
        section.style.display = 'none';
    }
}

// ==========================================
// НАСТРОЙКИ ПРОФИЛЯ (ИМЯ И АВАТАР)
// ==========================================

function changeNickname() {
    document.getElementById('newNameInput').value = user.name;
    document.getElementById('nameModal').style.display = 'flex';
}

function saveNewNickname() {
    const newName = document.getElementById('newNameInput').value.trim();
    if (newName.length > 0 && newName.length <= 20) {
        user.name = newName;
        saveData();
        document.getElementById('nameModal').style.display = 'none';
    } else {
        tg.showAlert("Имя должно быть от 1 до 20 символов");
    }
}

function toggleAvatarEditor() {
    const editor = document.getElementById('avatarEditorBlock');
    if (editor.style.display === 'none' || editor.style.display === '') {
        editor.style.display = 'block';
        renderAvatarPresets();
    } else {
        editor.style.display = 'none';
    }
}

function renderAvatarPresets() {
    const container = document.getElementById('avatarPresets');
    container.innerHTML = '';
    for (let i = 1; i <= 6; i++) {
        const url = `https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av${i}.png`;
        const img = document.createElement('img');
        img.src = url;
        img.onclick = () => showAvatarConfirm(url);
        container.appendChild(img);
    }
}

let tempAvatarUrl = '';

function handleCustomAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            showAvatarConfirm(e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function showAvatarConfirm(url) {
    tempAvatarUrl = url;
    document.getElementById('avatarPreview').src = url;
    document.getElementById('avatarConfirmModal').style.display = 'flex';
}

function closeAvatarConfirm() {
    document.getElementById('avatarConfirmModal').style.display = 'none';
    tempAvatarUrl = '';
}

function applyAvatar() {
    if (tempAvatarUrl) {
        user.avatar = tempAvatarUrl;
        saveData();
    }
    closeAvatarConfirm();
    document.getElementById('avatarEditorBlock').style.display = 'none';
}

function resetAllData() {
    tg.showConfirm("Вы уверены, что хотите сбросить ВЕСЬ прогресс? Это действие необратимо.", function(confirm) {
        if (confirm) {
            localStorage.removeItem('coloring_user');
            localStorage.removeItem('coloring_cart');
            window.location.reload();
        }
    });
}

// ==========================================
// ВИТРИНА ДОСТИЖЕНИЙ
// ==========================================

let currentSlotIndex = null;
let currentViewingAchId = null;

function renderShowcase() {
    for (let i = 0; i < 3; i++) {
        const slot = document.getElementById(`slot-${i}`);
        const achId = user.showcase[i];
        
        slot.innerHTML = ''; // очистка
        
        if (achId && achievementsDB[achId]) {
            const img = document.createElement('img');
            img.src = achievementsDB[achId].img;
            img.onclick = () => openAchievementInfo(i, achId);
            slot.appendChild(img);
            slot.classList.add('filled');
        } else {
            const icon = document.createElement('i');
            icon.className = 'fas fa-plus';
            icon.style.color = 'var(--text-gray)';
            slot.appendChild(icon);
            slot.classList.remove('filled');
            slot.onclick = () => openShowcaseModal(i);
        }
    }
}

function openShowcaseModal(slotIndex) {
    currentSlotIndex = slotIndex;
    const list = document.getElementById('availableAchievementsList');
    list.innerHTML = '';
    
    if (user.achievements.length === 0) {
        list.innerHTML = '<p style="grid-column: 1 / -1; color: var(--text-gray); font-size: 14px;">У вас пока нет достижений.</p>';
    } else {
        user.achievements.forEach(achId => {
            const ach = achievementsDB[achId];
            if (!ach) return;
            
            const div = document.createElement('div');
            div.style.textAlign = 'center';
            div.style.background = 'var(--bg)';
            div.style.padding = '10px';
            div.style.borderRadius = '12px';
            div.style.cursor = 'pointer';
            
            // Если достижение уже стоит в другом слоте, делаем его полупрозрачным
            const isAlreadyEquipped = user.showcase.includes(achId);
            if (isAlreadyEquipped) {
                div.style.opacity = '0.4';
            }
            
            div.innerHTML = `<img src="${ach.img}" style="width: 50px; height: 50px; object-fit: contain;">`;
            div.onclick = () => selectAchievementForSlot(achId);
            list.appendChild(div);
        });
    }

    const clearContainer = document.getElementById('clearSlotBtnContainer');
    clearContainer.innerHTML = '';
    if (user.showcase[slotIndex] !== null) {
        const clearBtn = document.createElement('button');
        clearBtn.className = 'balance-btn';
        clearBtn.style.background = 'var(--status-red)';
        clearBtn.style.border = 'none';
        clearBtn.style.marginTop = '15px';
        clearBtn.style.width = '100%';
        clearBtn.innerText = 'Очистить слот';
        clearBtn.onclick = () => {
            user.showcase[slotIndex] = null;
            saveData();
            document.getElementById('showcaseModal').style.display = 'none';
        };
        clearContainer.appendChild(clearBtn);
    }

    document.getElementById('showcaseModal').style.display = 'flex';
}

function selectAchievementForSlot(achId) {
    // ЖЕСТКАЯ ПРОВЕРКА НА ДУБЛИКАТЫ (Запрет занимать несколько слотов одним достижением)
    for (let i = 0; i < 3; i++) {
        if (i !== currentSlotIndex && user.showcase[i] === achId) {
            tg.showAlert("Это достижение уже установлено в другом слоте! Выберите другое.");
            return;
        }
    }

    user.showcase[currentSlotIndex] = achId;
    saveData();
    document.getElementById('showcaseModal').style.display = 'none';
}

function openAchievementInfo(slotIndex, achId) {
    currentSlotIndex = slotIndex;
    currentViewingAchId = achId;
    const ach = achievementsDB[achId];
    
    document.getElementById('achInfoTitle').innerText = ach.name;
    document.getElementById('achInfoImg').src = ach.img;
    document.getElementById('achInfoDesc').innerText = ach.desc;
    
    document.getElementById('achInfoModal').style.display = 'flex';
}

function replaceShowcaseSlot() {
    document.getElementById('achInfoModal').style.display = 'none';
    openShowcaseModal(currentSlotIndex);
}

function awardAchievement(achId) {
    if (!user.achievements.includes(achId) && achievementsDB[achId]) {
        user.achievements.push(achId);
        saveData();
        
        const ach = achievementsDB[achId];
        document.getElementById('alertAchImg').src = ach.img;
        document.getElementById('alertAchImg').style.display = 'block';
        document.getElementById('alertTitle').innerText = '🏆 Новое достижение!';
        document.getElementById('alertAchText').innerText = ach.name;
        document.getElementById('achievementAlert').style.display = 'flex';
    }
}

// ==========================================
// ЗАДАНИЯ И ОТПРАВКА ФОТО АДМИНУ
// ==========================================

let activeTaskId = null;

function toggleTasks() {
    const list = document.getElementById('tasksList');
    const arrow = document.getElementById('tasksArrow');
    if (list.style.display === 'none' || list.style.display === '') {
        renderTasks();
        list.style.display = 'block';
        arrow.style.transform = 'rotate(180deg)';
    } else {
        list.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)';
    }
}

function renderTasks() {
    const list = document.getElementById('tasksList');
    list.innerHTML = '';
    
    tasksList.forEach(task => {
        const status = user.tasksProgress[task.id] || 'available'; // available, pending, completed
        
        const div = document.createElement('div');
        div.className = 'task-card';
        
        let actionHtml = '';
        if (status === 'available') {
            actionHtml = `<button class="balance-btn" onclick="openTaskUpload('${task.id}')">Сдать фото</button>`;
        } else if (status === 'pending') {
            actionHtml = `<span style="color:var(--status-yellow); font-size: 14px;"><i class="fas fa-clock"></i> На проверке</span>`;
        } else if (status === 'completed') {
            actionHtml = `<span style="color:var(--status-green); font-size: 14px;"><i class="fas fa-check-circle"></i> Выполнено</span>`;
        }
        
        div.innerHTML = `
            <div style="flex:1;">
                <h4 style="margin:0 0 5px 0;">${task.title}</h4>
                <p style="margin:0; font-size:12px; color:var(--text-gray);">Награда: ${task.reward} 📖 | ${task.xp} XP</p>
            </div>
            <div>${actionHtml}</div>
        `;
        list.appendChild(div);
    });
}

function openTaskUpload(taskId) {
    activeTaskId = taskId;
    document.getElementById('taskFileInput').click();
}

let tempTaskPhotos = [];

function handleTaskFile(event) {
    const files = event.target.files;
    tempTaskPhotos = [];
    const container = document.getElementById('taskPhotoPreviewContainer');
    container.innerHTML = '';
    
    if (files.length > 0) {
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                tempTaskPhotos.push(e.target.result);
                const img = document.createElement('img');
                img.src = e.target.result;
                container.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
        document.getElementById('taskUploadModal').style.display = 'flex';
    }
}

function closeTaskUploadModal() {
    document.getElementById('taskUploadModal').style.display = 'none';
    tempTaskPhotos = [];
    activeTaskId = null;
}

function submitTaskPhoto() {
    if (tempTaskPhotos.length > 0 && activeTaskId) {
        // Симуляция отправки админу
        user.tasksProgress[activeTaskId] = 'pending';
        saveData();
        
        // Мокаем одобрение админом через 3 секунды для демонстрации
        setTimeout(() => adminApproveTask(activeTaskId), 3000);
        
        closeTaskUploadModal();
        renderTasks();
        tg.showAlert("Фото отправлены на проверку администратору!");
        
        // Даем ачивку за первое задание
        if (Object.keys(user.tasksProgress).length === 1) {
            awardAchievement('first_task');
        }
    }
}

function adminApproveTask(taskId) {
    if (user.tasksProgress[taskId] === 'pending') {
        user.tasksProgress[taskId] = 'completed';
        const task = tasksList.find(t => t.id === taskId);
        if (task) {
            user.balance += task.reward;
            user.xp += task.xp;
            saveData();
            
            // Если баланс >= 1000
            if (user.balance >= 1000) awardAchievement('rich_boy');
            
            tg.showAlert(`✅ Задание "${task.title}" проверено!\nНачислено: ${task.reward} ашетиков и ${task.xp} XP`);
        }
        if (document.getElementById('profile').classList.contains('active')) {
            renderTasks();
        }
    }
}

// ==========================================
// СТАТУСЫ
// ==========================================

function openStatusInfo() {
    const list = document.getElementById('availableStatusesList');
    list.innerHTML = '';
    
    levelConfig.forEach(lvl => {
        const isUnlocked = user.level >= lvl.level;
        const isActive = user.status === lvl.name;
        
        const div = document.createElement('div');
        div.style.padding = '12px';
        div.style.margin = '8px 0';
        div.style.borderRadius = '10px';
        div.style.background = isActive ? 'rgba(0, 122, 255, 0.2)' : 'var(--bg-header)';
        div.style.border = isActive ? '1px solid var(--accent)' : 'none';
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        
        let colorHex = '#808080';
        if (lvl.color === 'blue') colorHex = '#007AFF';
        if (lvl.color === 'purple') colorHex = '#8A2BE2';
        if (lvl.color === 'red') colorHex = '#FF3B30';
        if (lvl.color === 'gold') colorHex = '#FFD700';

        let actionHtml = '';
        if (isActive) {
            actionHtml = `<span style="color: var(--status-green);"><i class="fas fa-check"></i> Выбран</span>`;
        } else if (isUnlocked) {
            actionHtml = `<button class="balance-btn" onclick="selectStatus('${lvl.name}')">Выбрать</button>`;
        } else {
            actionHtml = `<span style="color: var(--text-gray); font-size: 12px;"><i class="fas fa-lock"></i> С ${lvl.xpReq} XP</span>`;
        }
        
        div.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <div style="width:15px; height:15px; border-radius:50%; background:${colorHex};"></div>
                <span style="font-weight:bold; color: ${isUnlocked ? 'white' : 'gray'}">${lvl.name}</span>
            </div>
            <div>${actionHtml}</div>
        `;
        list.appendChild(div);
    });
    
    document.getElementById('statusSelectModal').style.display = 'flex';
}

function selectStatus(statusName) {
    user.status = statusName;
    saveData();
    document.getElementById('statusSelectModal').style.display = 'none';
}

// ==========================================
// МАРКЕРЫ (GUANGNA)
// ==========================================

function renderMarkers() {
    const container = document.getElementById('markersList');
    container.innerHTML = '';
    markersDB.forEach(m => {
        const div = document.createElement('div');
        div.className = 'marker-item';
        div.innerHTML = `
            <div class="color-circle" style="background-color: ${m.color}; border: 1px solid rgba(255,255,255,0.2);"></div>
            <div class="marker-info">
                <div class="marker-number">№${m.num}</div>
                <div class="marker-name">${m.name}</div>
            </div>
        `;
        container.appendChild(div);
    });
}

// ==========================================
// ГАЛЕРЕЯ ОТВЕТОВ (ТОМА)
// ==========================================

let currentTome = 1;
let currentGalleryPage = 1;
let totalGalleryPages = 50;
const githubPagesPath = "https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/pages/";

function openBook(tome, total) {
    currentTome = tome;
    totalGalleryPages = total;
    currentGalleryPage = 1;
    updateGalleryImage();
    document.getElementById('answersGalleryModal').style.display = 'flex';
}

function updateGalleryImage() {
    const img = document.getElementById('galleryMainImage');
    const indicator = document.getElementById('galleryPageIndicator');
    
    img.style.display = 'none';
    indicator.innerText = `Загрузка...`;
    
    // Формируем путь. Например: assets/pages/tome1/page1.jpg
    const imgUrl = `${githubPagesPath}tome${currentTome}/page${currentGalleryPage}.jpg`;
    
    // Для демо-целей, если файлов нет на гитхабе, показываем заглушку
    // В реальном проекте убрать fallback
    img.onload = () => {
        img.style.display = 'block';
        indicator.innerText = `Страница ${currentGalleryPage} из ${totalGalleryPages}`;
    };
    img.onerror = () => {
        // Fallback если картинки нет на сервере
        img.src = "https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/bonusi/b4.png";
    }
    
    img.src = imgUrl;
}

function nextGalleryPage() {
    if (currentGalleryPage < totalGalleryPages) {
        currentGalleryPage++;
        updateGalleryImage();
    }
}

function prevGalleryPage() {
    if (currentGalleryPage > 1) {
        currentGalleryPage--;
        updateGalleryImage();
    }
}

function closeBook() {
    document.getElementById('answersGalleryModal').style.display = 'none';
}

// Свайпы для галереи
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        nextGalleryPage(); // Свайп влево
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        prevGalleryPage(); // Свайп вправо
    }
}

// ==========================================
// ИИ ПАЛИТРА
// ==========================================

function processAI(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Симуляция работы ИИ
            tg.MainButton.show();
            tg.MainButton.text = "Анализирую цвета...";
            tg.MainButton.showProgress();
            
            setTimeout(() => {
                tg.MainButton.hideProgress();
                tg.MainButton.hide();
                
                const resultDiv = document.getElementById('aiResult');
                resultDiv.style.display = 'block';
                
                // Берем случайные 3 маркера из базы для демо
                const shuffled = markersDB.sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 3);
                
                let html = '<h4 style="margin-bottom:15px;">Распознанные маркеры:</h4>';
                selected.forEach(m => {
                    html += `
                        <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px; background:var(--bg); padding:10px; border-radius:8px;">
                            <div style="width:30px; height:30px; border-radius:5px; background:${m.color};"></div>
                            <div>
                                <div style="font-weight:bold;">GUANGNA №${m.num}</div>
                                <div style="font-size:12px; color:var(--text-gray);">${m.name}</div>
                            </div>
                        </div>
                    `;
                });
                resultDiv.innerHTML = html;
                
                // Ачивка
                user.aiUsageCount = (user.aiUsageCount || 0) + 1;
                if (user.aiUsageCount >= 5) {
                    awardAchievement('ai_master');
                }
                saveData();
                
            }, 2000);
        };
        reader.readAsDataURL(file);
    }
}

// Админ-панель обучения ИИ
// Включается если имя пользователя "Admin"
if (user.name.toLowerCase() === 'admin' || user.name.toLowerCase() === 'админ') {
    document.getElementById('adminAiBlock').style.display = 'block';
}

function submitAdminAiTrain() {
    const file = document.getElementById('adminAiInput').files[0];
    const brand = document.getElementById('adminAiBrand').value;
    const num = document.getElementById('adminAiNumber').value;
    
    if (file && brand && num) {
        tg.showAlert("Данные отправлены на сервер обучения ИИ!");
        document.getElementById('adminAiBrand').value = '';
        document.getElementById('adminAiNumber').value = '';
    } else {
        tg.showAlert("Заполните все поля для обучения.");
    }
}

// ==========================================
// КОРЗИНА
// ==========================================

function changeCart(itemId, delta) {
    if (!cart[itemId]) cart[itemId] = 0;
    cart[itemId] += delta;
    if (cart[itemId] <= 0) delete cart[itemId];
    
    saveData();
    renderCart();
    updateCartBadge();
    
    if (delta > 0) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

function updateCartBadge() {
    let totalItems = 0;
    for (let key in cart) totalItems += cart[key];
    
    const badge = document.getElementById('cartBadge');
    if (totalItems > 0) {
        badge.innerText = totalItems;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

function renderCart() {
    const list = document.getElementById('cartItemsList');
    list.innerHTML = '';
    let totalSum = 0;
    
    if (Object.keys(cart).length === 0) {
        list.innerHTML = '<p style="text-align:center; color:var(--text-gray); margin-top:50px;">Корзина пуста</p>';
        document.getElementById('cartTotalSum').innerText = '0';
        return;
    }
    
    for (let key in cart) {
        const item = products[key];
        const count = cart[key];
        if (!item) continue;
        
        totalSum += item.price * count;
        
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.img}" style="width:60px; height:60px; object-fit:contain; border-radius:8px;">
            <div style="flex:1;">
                <h4 style="margin:0 0 5px 0;">${item.name}</h4>
                <div style="color:var(--text-gray);">${item.price} ₽</div>
            </div>
            <div style="display:flex; align-items:center; gap:10px; background:var(--bg); padding:5px 10px; border-radius:20px;">
                <button onclick="changeCart('${key}', -1)" style="background:none; border:none; color:white; font-size:18px; padding:0 5px;">-</button>
                <span style="font-weight:bold; min-width:20px; text-align:center;">${count}</span>
                <button onclick="changeCart('${key}', 1)" style="background:none; border:none; color:white; font-size:18px; padding:0 5px;">+</button>
            </div>
        `;
        list.appendChild(div);
    }
    
    document.getElementById('cartTotalSum').innerText = totalSum;
}

function checkout() {
    if (Object.keys(cart).length === 0) {
        tg.showAlert("Ваша корзина пуста!");
        return;
    }
    
    tg.showConfirm("Оформить заказ и перейти к оплате?", function(confirm) {
        if (confirm) {
            // Здесь отправка данных боту через sendData
            tg.sendData(JSON.stringify({action: 'checkout', cart: cart}));
            cart = {};
            saveData();
            renderCart();
            updateCartBadge();
            awardAchievement('shopaholic');
            tg.showAlert("Заказ успешно оформлен! Возвращайтесь в чат.");
        }
    });
}

// ==========================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАПУСКЕ
// ==========================================

window.onload = () => {
    updateProfileUI();
    renderMarkers();
    renderCart();
    
    // Вызов анимации появления профиля
    document.getElementById('profile').classList.add('active');
    
    // Закрытие модалок по клику вне контента
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    }
};
