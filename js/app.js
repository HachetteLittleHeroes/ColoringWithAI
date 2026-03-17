<script>
// =========================================================
// --- БАЗОВЫЕ НАСТРОЙКИ, ПРОФИЛЬ И АВАТАРЫ ---
// =========================================================

// Настройки аватарок
let isEditingAvatar = false;
const avatarBaseURL = "https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/avatars/";
const avatarPresets = [
    "av1.png", "av2.png", "av3.png", "av4.png", 
    "av5.png", "av6.png", "av7.png", "av8.png"
];

// Инициализация глобального профиля пользователя
if (typeof window.userProfileData === "undefined") {
    window.userProfileData = {
        name: "Без имени",
        status: "Без статуса",
        styleChangesCount: 0,
        avatar: { seed: "av2.png", customImage: null },
        stats: { pokemonPics: 0, aiCorrections: 0, authorPics: 0, alcoholPics: 0, supported: 0, nameChanged: 0 },
        unlockedAchievements: [],
        topAchievements: [null, null, null]
    };
}
function toggleEarnAchetiki() {
    const block = document.getElementById('real-loyalty-info');

    if (block.style.display === 'none' || block.style.display === '') {
        block.style.display = 'block';
    } else {
        block.style.display = 'none';
    }
}

function saveProfileData() {
    try { localStorage.setItem('hlh_user_profile', JSON.stringify(window.userProfileData)); } 
    catch (e) { console.error("Ошибка сохранения профиля:", e); }
}

function loadProfileData() {
    try {
        const saved = localStorage.getItem('hlh_user_profile');
        if (saved) {
            const parsed = JSON.parse(saved);
            window.userProfileData = { ...window.userProfileData, ...parsed };
            if (parsed.avatar) window.userProfileData.avatar = { ...window.userProfileData.avatar, ...parsed.avatar };
            if (parsed.stats) window.userProfileData.stats = { ...window.userProfileData.stats, ...parsed.stats };
        }
    } catch (e) { console.error("Ошибка загрузки профиля:", e); }
    
    if (typeof updateAvatarImage === "function") updateAvatarImage();
    renderAvatarPresets();
    
    const nameEl = document.getElementById('displayUsername');
    if (nameEl) nameEl.innerText = window.userProfileData.name;
    const nameProfileEl = document.getElementById('userName'); 
    if (nameProfileEl) nameProfileEl.innerText = window.userProfileData.name;
    
    const statusEl = document.getElementById('currentStatus');
if (statusEl) statusEl.innerText = window.userProfileData.status;
}

function toggleAvatarEditor() {
    isEditingAvatar = !isEditingAvatar;
    const editor = document.getElementById('avatarEditorBlock');
    if(editor) editor.style.display = isEditingAvatar ? 'block' : 'none';
    if (window.tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
}

function handleCustomAvatar(event) {
    const file = event.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        window.userProfileData.avatar.customImage = e.target.result;
        window.userProfileData.styleChangesCount++;
        saveProfileData();
        if (typeof updateAvatarImage === "function") updateAvatarImage();
        document.querySelectorAll('.avatar-preset-btn').forEach(b => b.classList.remove('active'));
    };
    reader.readAsDataURL(file);
}

function renderAvatarPresets() {
    const grid = document.getElementById('avatarPresetsGrid');
    if(!grid) return;
    grid.innerHTML = avatarPresets.map(file => {
        const isActive = (window.userProfileData.avatar.seed === file && !window.userProfileData.avatar.customImage) ? 'active' : '';
        return `
        <div class="avatar-preset-btn ${isActive}" onclick="setPresetAvatar('${file}', this)">
            <img src="${avatarBaseURL}${file}" onerror="this.src='https://placehold.co/100x100/333333/ff9500?text=?'">
        </div>`;
    }).join('');
}

function setPresetAvatar(file, btnElem) {
    window.userProfileData.avatar.seed = file;
    window.userProfileData.avatar.customImage = null;
    document.querySelectorAll('.avatar-preset-btn').forEach(b => b.classList.remove('active'));
    if (btnElem) btnElem.classList.add('active');
    if (typeof updateAvatarImage === "function") updateAvatarImage();
    saveProfileData();
    if (window.tg && tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
}
function updateAvatarImage() {
    const avatarImg = document.getElementById('user-avatar');
    if (!avatarImg) return;

    if (window.userProfileData.avatar.customImage) {
        avatarImg.src = window.userProfileData.avatar.customImage;
    } else {
        avatarImg.src = avatarBaseURL + window.userProfileData.avatar.seed;
    }
}
// ---------------------------------------------------------
// ИСПРАВЛЕНИЕ: Вызов статического окна смены имени
// ---------------------------------------------------------
function changeNickname() {
    initUserStats();
    let currentName = window.userProfileData.name !== "Без имени" ? window.userProfileData.name : "";
    let modal = document.getElementById('nameInputModal');
    if (modal) {
        document.getElementById('newNameInput').value = currentName;
        modal.style.display = 'flex';
    }
}

function saveNewNickname() {
    let newName = document.getElementById('newNameInput').value.trim();
    if(!newName || newName.length < 2) {
        if(window.tg && tg.showAlert) tg.showAlert("Никнейм должен содержать минимум 2 символа");
        else alert("Слишком короткий никнейм");
        return;
    }
    
    window.userProfileData.name = newName;
    window.userProfileData.stats.nameChanged = 1;
    
    const nameEl = document.getElementById('userName');
    if(nameEl) nameEl.innerText = newName;
    const displayEl = document.getElementById('displayUsername');
    if(displayEl) displayEl.innerText = newName;
    
    saveProfileData();
    renderStatusQuests();
    
    let modal = document.getElementById('nameInputModal');
    if(modal) modal.style.display = 'none';
    
    if(window.tg && tg.showAlert) tg.showAlert("Никнейм успешно изменён!");
    if(window.tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
}

// ---------------------------------------------------------
// ИСПРАВЛЕНИЕ: Вызов статического окна смены статуса
// ---------------------------------------------------------
function changeCustomStatus() {
    const unlocked = window.userProfileData.unlockedAchievements || [];
    let modal = document.getElementById('statusSelectModal');
    if (!modal) return;
    
    let listHtml = '';
    listHtml += `<button class="buy-btn" style="background:#ff3b30; color:white; padding:10px; border-radius:10px; margin-bottom:5px;" onclick="setNewStatus('Без статуса')">Сбросить статус</button>`;
    
    if (unlocked.length > 0) {
        unlocked.forEach(achId => {
            let ach = achievementsConfig.find(a => a.id === achId);
            if (ach) {
                let statusText = ach.desc.replace('Статус: ', '').replace('Достижение: ', '').trim();
                listHtml += `<button class="buy-btn" style="background:var(--accent); color:white; padding:10px; border-radius:10px; margin-bottom:5px;" onclick="setNewStatus('${statusText}')">${statusText}</button>`;
            }
        });
    } else {
        listHtml += `<div style="text-align:center; color:var(--gray); font-size:14px; margin-top:10px; margin-bottom:10px;">У вас пока нет разблокированных статусов. Выполняйте задания, чтобы получить их!</div>`;
    }
    
    document.getElementById('statusSelectList').innerHTML = listHtml;
    modal.style.display = 'flex';
}
function openStatusSelect(){
    changeCustomStatus();
}

function setNewStatus(newStatus) {
    window.userProfileData.status = newStatus;

    const statusEl = document.getElementById('currentStatus');
    if (statusEl) statusEl.innerText = newStatus;

    saveProfileData();
    document.getElementById('statusSelectModal').style.display = 'none';

    if(window.tg && tg.HapticFeedback) 
        tg.HapticFeedback.notificationOccurred('success');
}

// =========================================================
// --- ДОСТИЖЕНИЯ И СТАТУСЫ ---
// =========================================================

const achievementsConfig = [

{
id:'pokemon_master',
title:'Великий мастер',
desc:'Статус: Мастер Покемонов',
req:'Раскрасить картинки с покемонами',
levels:[5,10,15,20,30],
type:'admin_check',
statKey:'pokemonPics',
icon:'img/ach_poke.png'
},

{
id:'ai_teacher',
title:'Училка',
desc:'Статус: Эксперт ИИ',
req:'Внести правки в ИИ палитру',
levels:[50,100,200,350,500],
type:'admin_check',
statKey:'aiCorrections',
icon:'img/ach_teacher.png'
},

{
id:'scrooge',
title:'Скрудж',
desc:'Статус: Богатей',
req:'Накопить 2500 ашетиков',
target:2500,
type:'auto_balance',
icon:'img/ach_gold.png'
},

{
id:'not_like_others',
title:'Нетакуся',
desc:'Статус: Творец',
req:'Раскрасить авторские картинки',
levels:[5,10,15,20,30],
type:'admin_check',
statKey:'authorPics',
icon:'img/ach_art.png'
},

{
id:'alcohol_queen',
title:'Спиртесса',
desc:'Статус: Мастер спирта',
req:'Раскрасить картинки спиртовыми маркерами',
levels:[10,25,50,75,100],
type:'admin_check',
statKey:'alcoholPics',
icon:'img/ach_spirit.png'
},

{
id:'benefactor',
title:'Благодетель',
desc:'Статус: Меценат',
req:'Поддержать наш проект',
levels:[1,2,3,4,5],
type:'admin_check',
statKey:'supported',
icon:'img/ach_heart.png'
},

{
id:'name_changer',
title:'My name is',
desc:'Достижение: Маскировка',
req:'Сменить никнейм',
target:1,
type:'auto_name',
icon:'img/ach_id.png'
}

];
const levelColors = [
"#9e9e9e",
"#2196f3",
"#4caf50",
"#9c27b0",
"#ffc107"
];

function initUserStats() {
    if(typeof window.userProfileData === "undefined") {
        window.userProfileData = {};
    }
    if(!window.userProfileData.stats) {
        window.userProfileData.stats = { pokemonPics:0, aiCorrections:0, authorPics:0, alcoholPics:0, supported:0, nameChanged:0 };
    }
}

function getAchievementProgress(ach) {
    let balance = 0;
    const balanceEl = document.getElementById('userBalance');
    if(balanceEl) balance = parseInt(balanceEl.innerText) || 0;
    
    if(ach.type === 'admin_check') return window.userProfileData.stats?.[ach.statKey] || 0;
    if(ach.type === 'auto_balance') return balance;
    if(ach.type === 'auto_name') return window.userProfileData.stats?.nameChanged || 0;
    return 0;
}

function renderStatusQuests() {
    initUserStats();
    const container = document.getElementById('questsListContainer');
    if(!container) return;
    
    container.innerHTML = achievementsConfig.map(ach => {
        let current = getAchievementProgress(ach);

// определяем цель (для уровней или обычных достижений)
let target = ach.target || (ach.levels ? ach.levels[ach.levels.length-1] : 1);

let percent = Math.min(100, (current / target) * 100);

// определяем уровень
let level = 0;
if(ach.levels){
    for(let i=0;i<ach.levels.length;i++){
        if(current >= ach.levels[i]) level = i+1;
    }
}

let isDone = current >= target;

let wasDone = window.userProfileData.unlockedAchievements?.includes(ach.id);
        
        if(isDone && !wasDone) {
            if(!window.userProfileData.unlockedAchievements) window.userProfileData.unlockedAchievements = [];
            window.userProfileData.unlockedAchievements.push(ach.id);
            setTimeout(() => {
                if(window.tg && tg.showAlert) tg.showAlert(`🏆 Новое достижение!\n${ach.title}`);
            }, 300);
            saveProfileData();
        }
        
        return `
        <div class="quest-card" style="${isDone ? 'border:1px solid var(--accent);opacity:0.9;' : ''}">
            <div class="quest-header">
                <span class="quest-status-badge">${isDone ? '🏆 Выполнено' : '🔥 В процессе'}</span>
               <span class="quest-xp">${current} / ${target}</span>
            </div>
            <div class="quest-title">${ach.title}</div>
            ${ach.levels ? `
<div style="display:flex;gap:4px;margin-bottom:8px;">
${ach.levels.map((lvl,i)=>`
<div style="
flex:1;
height:6px;
border-radius:3px;
background:${i < level ? levelColors[i] : 'rgba(255,255,255,0.1)'};
"></div>
`).join('')}
</div>
` : ``}
            <div style="font-size:12px;color:var(--gray);margin-bottom:10px;">${ach.req}</div>
            <div style="width:100%;height:6px;background:var(--secondary);border-radius:3px;margin-bottom:10px;overflow:hidden;">
                <div style="width:${percent}%;height:100%;background:var(--accent);transition:0.5s;"></div>
            </div>
            ${!isDone && ach.type === 'admin_check'
                ? `<button class="buy-btn" style="padding:8px;font-size:12px;" onclick="sendAchievementRequest('${ach.id}','${ach.title}')">Отправить фото на проверку</button>`
                : ''}
            ${isDone
                ? `<div style="color:var(--accent);font-size:11px;font-weight:bold;">Достижение разблокировано!</div>`
                : ''}
        </div>`;
    }).join('');
}
// Используем window, чтобы переменная была доступна из любой части кода
window.currentAchievementRequest = null;

window.sendAchievementRequest = function(id, title) {
    console.log("Вызов sendAchievementRequest:", id, title);
    
    window.currentAchievementRequest = {
        id: id,
        title: title
    };

    const input = document.getElementById("achievementPhotoInput");
    if (input) {
        input.value = ""; // Сброс, чтобы можно было выбрать те же фото
        input.click();
    } else {
        if (window.tg) tg.showAlert("Ошибка: Инпут не найден в DOM");
    }
};

window.handleAchievementPhotos = async function(event) {
    console.log("Файлы выбраны");
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (!window.currentAchievementRequest) {
        if (window.tg) tg.showAlert("Ошибка: Данные задания не найдены. Попробуйте нажать еще раз.");
        return;
    }

    // Подтверждение через Telegram
    if (window.tg && window.tg.showConfirm) {
        window.tg.showConfirm(`Отправить ${files.length} фото для задания "${window.currentAchievementRequest.title}"?`, async (confirm) => {
            if (confirm) {
                await uploadAchievementData(files);
            }
        });
    } else {
        // Резервный вариант для браузера
        if (confirm(`Отправить ${files.length} фото?`)) {
            await uploadAchievementData(files);
        }
    }
};
// =========================================================
// --- ОТПРАВКА ФОТО НА ПРОВЕРКУ ---
// =========================================================

async function uploadAchievementData(files) {
    if (!files || files.length === 0) {
        alert("Выберите хотя бы одно фото");
        return;
    }

    if (window.tg) {
        tg.MainButton.setText("ОТПРАВКА ФОТО...").show();
    }

    try {
        const formData = new FormData();
        
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id') || "0";
        const title = window.currentAchievementRequest ? window.currentAchievementRequest.title : "Задание";
        const level = window.currentAchievementRequest ? window.currentAchievementRequest.level : 1;

        formData.append('user', userId);
        formData.append('title', title);
        formData.append('level', level);

        for (let i = 0; i < files.length; i++) {
            formData.append('photos', files[i]);
        }

        console.log("Отправка на:", `${API_URL}/check_achievement`);

        const response = await fetch(`${API_URL}/check_achievement`, {
            method: 'POST',
            body: formData,
            mode: 'cors' 
        });

        if (response.ok) {
            const result = await response.json();
            if (window.tg) {
                tg.showAlert("✅ Фото успешно отправлено на проверку!");
                tg.MainButton.hide();
            }
            const input = document.getElementById('achievementPhotoInput');
            if (input) input.value = "";
        } else {
            const errorText = await response.text();
            throw new Error(`Сервер ответил ${response.status}: ${errorText}`);
        }

    } catch (err) {
        console.error("Ошибка отправки:", err);
        if (window.tg) {
            tg.showAlert("❌ Ошибка при отправке: " + err.message);
            tg.MainButton.hide();
        } else {
            alert("Ошибка: " + err.message);
        }
    }
}
// Функция-прослойка для обработки выбора файлов
function handleAchievementPhotos(event) {
    if (event.target.files && event.target.files.length > 0) {
        uploadAchievementData(event.target.files);
    }
}

// ---------------------------------------------------------
// ИСПРАВЛЕНИЕ: Функция для открытия квестов (статусов)
// ---------------------------------------------------------
function openTasks() {
    const container = document.getElementById('questsListContainer');
    if(!container) return;

    if(container.style.display === 'block'){
        container.style.display = 'none';
    }else{
        container.style.display = 'block';
        renderStatusQuests();
    }

    if (window.tg && tg.HapticFeedback){
        tg.HapticFeedback.impactOccurred('light');
    }
}
// Добавляем алиасы на случай опечаток в HTML
window.showTasks = openTasks;
window.goToTasks = openTasks;

// =========================================================
// --- ЛОГИКА АДМИНКИ ЗАДАНИЙ (ОБНОВЛЕННАЯ) ---
// =========================================================

async function loadAdminTasks() {
    try {
        let res = await fetch(`${API_URL}/pending_tasks`);
        let tasks = await res.json();
        let container = document.getElementById('adminTaskRequests');
        if(!container) return;

        if(tasks.length === 0) {
            container.innerHTML = '<div style="color:var(--gray); font-size:12px; text-align:center;">Нет новых заданий на проверку</div>';
            return;
        }

        container.innerHTML = tasks.map(t => `
            <div class="row-item" style="flex-direction:column; align-items:flex-start; background: rgba(255,255,255,0.05); padding:12px; border-radius:12px; margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; width:100%; margin-bottom:8px;">
                    <b style="font-size:14px; color:var(--accent);">@${t.username || 'unknown'}</b>
                    <span style="font-size:12px; color:var(--gray);">ID: ${t.user_id}</span>
                </div>
                
                <div style="font-size:13px; margin-bottom:10px;">
                    📌 Задание: <b>${t.statusName}</b> <br>
                    📈 Текущий уровень: <span style="color:var(--gold); font-weight:bold;">${t.userLevel || 1}</span>
                </div>

                <div style="display:flex; align-items:center; gap:10px; width:100%; margin-top:5px;">
                    <span style="font-size:12px; color:var(--gray);">Очков прогресса:</span>
                    <select id="points_${t.id}" style="background:var(--secondary); color:var(--text); border:1px solid var(--accent); border-radius:5px; padding:4px;">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>

                <div style="display:flex; gap:10px; margin-top:12px; width:100%;">
                    <button class="buy-btn" style="flex:2; background:#34c759; padding:10px; border-radius:8px;" 
                        onclick="approveTask(${t.id}, '${t.user_id}', '${t.statusName}', document.getElementById('points_${t.id}').value)">
                        Одобрить
                    </button>
                    <button class="buy-btn" style="flex:1; background:#ff3b30; padding:10px; border-radius:8px;" 
                        onclick="rejectTask(${t.id})">
                        Откл.
                    </button>
                </div>
            </div>
        `).join('');
    } catch(e) {
        let container = document.getElementById('adminTaskRequests');
        if(container) container.innerHTML = '<div style="color:var(--gray); font-size:12px; text-align:center;">Ошибка загрузки или нет заявок</div>';
    }
}

async function approveTask(taskId, userId, statusName, points) {
    try {
        const response = await fetch(`${API_URL}/approve_task`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                taskId: taskId, 
                userId: userId, 
                statusName: statusName, 
                points: parseInt(points) // Передаем количество добавленных очков
            }) 
        });

        if(response.ok) {
            if(window.tg && tg.showAlert) tg.showAlert(`✅ Успешно! Добавлено очков: ${points}`);
            loadAdminTasks(); // Обновляем список у админа
            
            // Если это делает сам админ для себя, обновляем его прогресс-бары сразу
            if (typeof renderStatusQuests === "function") renderStatusQuests();
        } else {
            throw new Error("Ошибка сервера");
        }
    } catch(e) { 
        console.error("Ошибка при одобрении задания:", e);
        if(window.tg && tg.showAlert) tg.showAlert("❌ Ошибка при отправке одобрения");
    }
}


// =========================================================
// --- ЛОГИКА ОРГАНАЙЗЕРОВ ---
// =========================================================

let organizers = JSON.parse(localStorage.getItem('marker_organizers')) || [];
let currentOrgId = null;
let currentCellIndex = null;
let modalSelectedBrand = null;

function getAutoCellName(index, cols) {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const letter = String.fromCharCode(65 + row);
    return `${letter}${col + 1}`;
}

function saveOrganizers() {
    localStorage.setItem('marker_organizers', JSON.stringify(organizers));
}

function showAddOrganizer() {
    const name = prompt("Название органайзера (например, 'Кейс 1'):", "Мой Органайзер");
    if (!name) return;
    const rows = parseInt(prompt("Сколько рядов ячеек (A, B, C...)?", "3"));
    const cols = parseInt(prompt("Сколько ячеек в каждом ряду?", "10"));
    if (isNaN(rows) || isNaN(cols)) return;

    const newOrg = { id: Date.now(), name: name, rows: rows, cols: cols, cells: [] };
    for (let i = 0; i < rows * cols; i++) {
        newOrg.cells.push({ defaultName: getAutoCellName(i, cols), customName: null, markers: [] });
    }
    organizers.push(newOrg);
    saveOrganizers();
    renderOrganizers();
}

function renderOrganizers() {
    const list = document.getElementById('organizersList');
    if (!list) return;
    if (organizers.length === 0) {
        list.innerHTML = '<div style="color:var(--gray); font-size:12px; padding:10px;">У вас пока нет цифровых органайзеров</div>';
        return;
    }
    list.innerHTML = organizers.map(org => {
        let totalMarkers = org.cells.reduce((sum, cell) => sum + cell.markers.length, 0);
        return `
        <div class="organizer-card" onclick="viewOrganizer(${org.id})">
            <b>${org.name}</b>
            <span>${totalMarkers} шт.</span>
        </div>`;
    }).join('');
}

function viewOrganizer(id) {
    const org = organizers.find(o => o.id === id);
    if (!org) return;
    currentOrgId = id;
    document.getElementById('organizerDetailView').style.display = 'block';
    document.getElementById('viewOrgTitle').innerText = org.name;
    
    const container = document.getElementById('gridContainer');
    container.style.gridTemplateColumns = `repeat(${org.cols}, 1fr)`;
    container.innerHTML = org.cells.map((cell, index) => {
        const dots = cell.markers.map(() => '<div class="marker-dot"></div>').join('');
        return `
            <div class="cell" onclick="manageCell(${index})">
                <span class="cell-name">${cell.customName || cell.defaultName}</span>
                <span class="cell-count">${cell.markers.length}</span>
                <div class="marker-dot-container">${dots}</div>
            </div>`;
    }).join('');
}

function closeOrganizerView() {
    document.getElementById('organizerDetailView').style.display = 'none';
    renderOrganizers();
}

function manageCell(cellIndex) {
    currentCellIndex = cellIndex;
    const org = organizers.find(o => o.id === currentOrgId);
    const cell = org.cells[currentCellIndex];
    document.getElementById('cellModalTitle').innerText = cell.customName || cell.defaultName;
    renderCellMarkerList();
    document.getElementById('cellManageModal').style.display = 'flex';
    if (window.tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
}

function closeCellModal() {
    document.getElementById('cellManageModal').style.display = 'none';
    viewOrganizer(currentOrgId); 
}

function renderCellMarkerList() {
    const org = organizers.find(o => o.id === currentOrgId);
    const cell = org.cells[currentCellIndex];
    const list = document.getElementById('cellMarkerList');
    if (cell.markers.length === 0) {
        list.innerHTML = '<div style="text-align:center; color:var(--gray); padding:30px 0; font-size:14px;">В этой ячейке пока нет маркеров</div>';
        return;
    }
    list.innerHTML = cell.markers.map(mId => {
        let parts = mId.split('_');
        let brand = parts[0];
        let num = parts.slice(1).join('_'); 
        return `
        <div class="marker-list-item">
            <span><b>${brand}</b> <span style="color:var(--accent);">№${num}</span></span>
            <button class="delete-btn" onclick="removeMarkerFromCell('${mId}')">Удалить</button>
        </div>`;
    }).join('');
}

function removeMarkerFromCell(mId) {
    const org = organizers.find(o => o.id === currentOrgId);
    const cell = org.cells[currentCellIndex];
    cell.markers = cell.markers.filter(id => id !== mId);
    saveOrganizers();
    renderCellMarkerList();
    if (window.tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function renameCurrentCell() {
    const org = organizers.find(o => o.id === currentOrgId);
    const cell = org.cells[currentCellIndex];
    const newName = prompt("Новое имя ячейки:", cell.customName || cell.defaultName);
    if (newName) {
        cell.customName = newName;
        saveOrganizers();
        document.getElementById('cellModalTitle').innerText = newName;
        viewOrganizer(currentOrgId);
    }
}

function openAddMarkerModal() {
    document.getElementById('cellManageModal').style.display = 'none';
    const grid = document.getElementById('modalBrandGrid');
    grid.innerHTML = markerBrandsList.map(b => `
        <button class="brand-btn" id="modalBtn_${b.name}" onclick="selectModalBrand('${b.name}')">${b.name}</button>
    `).join('');
    modalSelectedBrand = null;
    document.getElementById('modalMarkerSearch').value = '';
    document.getElementById('addMarkerModal').style.display = 'flex';
}

function closeAddMarkerModal() {
    document.getElementById('addMarkerModal').style.display = 'none';
    document.getElementById('cellManageModal').style.display = 'flex';
}

function selectModalBrand(brand) {
    modalSelectedBrand = brand;
    document.querySelectorAll('.brand-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`modalBtn_${brand}`).classList.add('active');
    if (window.tg && tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
}

function confirmAddMarkerToCell() {
    if (!modalSelectedBrand) {
        if(window.tg && tg.showAlert) tg.showAlert("Пожалуйста, выберите бренд (нажмите на кнопку).");
        return;
    }
    const num = document.getElementById('modalMarkerSearch').value.trim();
    if (!num) {
        if(window.tg && tg.showAlert) tg.showAlert("Пожалуйста, введите номер маркера.");
        return;
    }
    const mId = `${modalSelectedBrand}_${num}`;
    const org = organizers.find(o => o.id === currentOrgId);
    const cell = org.cells[currentCellIndex];
    
    if (!cell.markers.includes(mId)) {
        cell.markers.push(mId);
        saveOrganizers();
        if (window.tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    } else {
        if(window.tg && tg.showAlert) tg.showAlert("Этот маркер уже лежит в данной ячейке.");
        return;
    }
    closeAddMarkerModal();
    renderCellMarkerList();
}

function findMarkerLocation(markerId) {
    for (const org of organizers) {
        for (const cell of org.cells) {
            if (cell.markers.includes(markerId)) return `Органайзер «${org.name}», ячейка ${cell.customName || cell.defaultName}`;
        }
    }
    return null;
}

function locateAndFlash(markerId) {
    let foundOrg = null;
    let foundCellIndex = -1;
    for (const org of organizers) {
        const cellIndex = org.cells.findIndex(c => c.markers.includes(markerId));
        if (cellIndex !== -1) { foundOrg = org; foundCellIndex = cellIndex; break; }
    }
    if (foundOrg) {
        viewOrganizer(foundOrg.id);
        setTimeout(() => {
            const cells = document.querySelectorAll('.cell');
            const targetCell = cells[foundCellIndex];
            if (targetCell) {
                targetCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetCell.classList.add('highlight-flash');
                setTimeout(() => targetCell.classList.remove('highlight-flash'), 3000);
            }
        }, 300);
    } else {
        if(window.tg && tg.showAlert) tg.showAlert("Маркер не найден ни в одном органайзере.");
    }
}

// =========================================================
// --- МАГАЗИН И КОРЗИНА ---
// =========================================================

let markersData = [], cart = [], markersLoaded = false;

const markerBrandsList = [
    { name: 'GuangNa', total: 408 },
    { name: 'Languo', total: 288 },
    { name: 'Zibeef', total: 240 },
    { name: 'Grasp', total: 168 },
    { name: 'InfiArt', total: 288 },
    { name: 'Tooli-Art', total: 508, sets: {
        "Pastel": 24, "Jewel": 24, "Confetti": 24, "Metallic": 24, "Neon": 24, 
        "Glitter": 24, "Wildflower": 24, "Brown": 22, "Purple": 22, "Pink": 22, 
        "Skin": 22, "Green": 22, "Gray": 22, "Orange": 22, "Red & Pink": 22, 
        "Yellow & Brown": 22, "Blue & Purple": 22, "Southwest": 28, "Nocturnal": 28, 
        "Essential": 28, "Earth": 36
    }}
];

const bookNames = ["Les Grands Classiques tome 11", "Les Grands Classiques tome 3", "Vitraux tome 2", "Trompe L'oeil Babies", "Trompe L'oeil Grand Bloc", "Stitch Au numero", "Sous L'Ocean", "Saisons", "Romantasy", "Princesses tome 1", "Princesses tome 2", "Princes&Heros", "Portraits De Famille", "Pokemon", "Pixar", "Petites Princesses", "Petites Betes", "Mondes Fantastiques", "Mickey, Donald&Co", "Mechants", "Marsupilami", "Love Stories", "Looney Tunes tome 3", "Lilo Et Stitch", "Les Grands Classiques Special Debutants tome 1", "Les Grands Classiques Special Debutants tome 2", "Les Grands Classiques Au numero", "La Petite Sirene", "Les Schtroumpfs tome 1", "Les Schtroumpfs tome 2", "L'age Glace", "Hiver", "Heros&Mechants La Battle", "Grands Classiques Grand Bloc", "Les Grands Classiques Coliector", "Girl Power", "Fees, Sorciers Et Magiciens", "Famille", "Escapades Merveilleuses Douce France", "Chiots&Chiens", "Chevaux", "Bisounours tome 1", "Best Of Pixar", "Best Of Les Grands Classiques", "La Belle Et La Bete", "Bestiaire", "Best Of Heroines"];

function renderBooks(list = bookNames) {
    const grid = document.getElementById('booksGrid');
    if(!grid) return;
    grid.innerHTML = list.map((name) => {
        const originalId = bookNames.indexOf(name) + 1;
        const safeName = name.replace(/'/g, "\\'");
        const itemInCart = cart.find(c => c.key === 'Раскраска-' + originalId);
        const btnText = itemInCart ? `В корзине: ${itemInCart.qty}` : 'В корзину';
        return `
        <div class="card">
            <img src="img/t${originalId}.png" onclick="startBook(${originalId}, 26)">
            <div class="card-label">${name}<br><span style="color:var(--accent); font-weight:bold;">2890 руб.</span><br><small style="color:var(--gray);">📦 Под заказ</small></div>
            <button class="buy-btn" onclick="addToCart('Раскраска', '${safeName}', ${originalId}, 99, 2890)">${btnText}</button>
        </div>`;
    }).join('');
}

function filterBooks() {
    const query = document.getElementById('bookSearch').value.toLowerCase();
    renderBooks(bookNames.filter(name => name.toLowerCase().includes(query)));
}

async function loadMarkers() {
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
                    temp.push({ number: num, stock: stock });
                    i++;
                }
            }
        });
        markersData = temp.filter((v, i, a) => a.findIndex(t => (t.number === v.number)) === i);
        cart.forEach(item => {
            if (item.type === 'Маркер') {
                const m = markersData.find(md => md.number == item.id);
                if (m) { item.max = m.stock; if (item.qty > m.stock) item.qty = m.stock; }
            }
        });
        markersLoaded = true;
        renderMarkers(markersData);
        updateUI();
    } catch (e) { console.error(e); }
}

function renderMarkers(data) {
    const list = document.getElementById('markersList');
    if(!list) return;
    const q = document.getElementById('markerSearch').value.toLowerCase();
    const filtered = data.filter(m => m.number.includes(q)).sort((a, b) => a.number - b.number);
    list.innerHTML = filtered.map(m => {
        const cartIndex = cart.findIndex(c => c.key === 'Маркер-' + m.number);
        const currentQty = cartIndex > -1 ? cart[cartIndex].qty : 0;
        const canAdd = currentQty < m.stock;
        let color = m.stock >= 2 ? "#34c759" : (m.stock === 1 ? "#ff9500" : "#ff3b30");
        return `
        <div class="row-item">
            <div class="item-info">
                <span class="marker-num">№ ${m.number}</span>
                <span class="stock-badge" style="color:${color}">${m.stock >= 1 ? `В наличии: ${m.stock} шт.` : "Нет в наличии"}</span>
            </div>
            <div class="item-controls">
                ${m.stock > 0 ? (currentQty > 0 ? `
                    <button class="btn-qty-sm" onclick="changeQty(${cartIndex}, -1)">-</button>
                    <span class="marker-qty">${currentQty}</span>
                    <button class="btn-qty-sm" ${!canAdd ? 'disabled' : ''} onclick="changeQty(${cartIndex}, 1)">+</button>
                ` : `<button class="btn-qty-sm" onclick="addToCart('Маркер', '${m.number}', ${m.number}, ${m.stock}, 75)">+</button>`) : ''}
            </div>
        </div>`;
    }).join('');
}

function addToCart(type, name, id, max, price) {
    const key = type + '-' + id;
    const existing = cart.find(i => i.key === key);
    if (existing) { if (existing.qty < max) existing.qty++; else return; }
    else { cart.push({ key, type, name, id, qty: 1, max, price }); }
    updateUI();
    if(type === 'Маркер') renderMarkers(markersData);
    if(type === 'Раскраска') renderBooks();
    if(window.tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
}

function updateUI() {
    const total = cart.reduce((sum, i) => sum + i.qty, 0);
    const badge = document.getElementById('cartBadge');
    if(badge) {
        badge.innerText = total;
        badge.style.display = total > 0 ? 'block' : 'none';
    }
    const orderBtn = document.getElementById('mainOrderBtn');
    if(orderBtn) orderBtn.style.display = total > 0 ? 'block' : 'none';
}

function renderCart() {
    const list = document.getElementById('cartList');
    if(!list) return;
    if (cart.length === 0) { list.innerHTML = '<div style="text-align:center; padding:50px; color:var(--gray)">Корзина пуста</div>'; return; }
    const totalSum = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    let bonus = 0;
    if (totalSum >= 3000 && totalSum < 5000) bonus = 20;
    else if (totalSum >= 5000 && totalSum < 7500) bonus = 30;
    else if (totalSum >= 7500 && totalSum < 10000) bonus = 40;
    else if (totalSum >= 10000) bonus = 50;

    list.innerHTML = cart.map((item, index) => `
        <div class="row-item">
            <div class="item-info"><b>${item.type === 'Маркер' ? '№ ' : ''}${item.name}</b><div style="font-size:12px; color:var(--gray)">${item.price} руб./шт.</div></div>
            <div class="item-controls">
                <button class="btn-qty" onclick="changeQty(${index}, -1)">-</button>
                <span class="qty-num">${item.qty}</span>
                <button class="btn-qty" ${item.qty >= item.max ? 'disabled' : ''} onclick="changeQty(${index}, 1)">+</button>
            </div>
        </div>`).join('') + `
        <div style="margin-top:20px; padding:15px; background:var(--secondary); border-radius:15px; text-align:right;">
            <span style="color:var(--gray); font-size:14px;">Итого к оплате:</span>
            <div style="font-size:20px; font-weight:800; color:var(--accent);">${totalSum} руб.</div>
            <div class="bonus-badge" style="color:#E65100">Будет начислено: +${bonus} <i class="fas fa-book-open"></i></div>
        </div>`;
}

function changeQty(index, delta) {
    const item = cart[index];
    if (delta > 0 && item.qty >= item.max) return;
    item.qty += delta;
    if (item.qty <= 0) cart.splice(index, 1);
    updateUI();
    const cartEl = document.getElementById('cart');
    const shopEl = document.getElementById('shop');
    if (cartEl && cartEl.classList.contains('active')) renderCart();
    if (shopEl && shopEl.classList.contains('active')) renderMarkers(markersData);
}

// ---------------------------------------------------------
// ИСПРАВЛЕНИЕ: Кнопка оформления заказа (скрытая отправка деталей)
// ---------------------------------------------------------
async function checkout() {
    if (cart.length === 0) return;
    
    // Проверка минимального количества маркеров
    let markersCount = 0;
    cart.forEach(item => { if (item.type === 'Маркер') markersCount += item.qty; });
    
    if (markersCount > 0 && markersCount < 3) {
        if (window.tg && tg.showAlert) tg.showAlert("⚠️ Минимальный заказ маркеров — от 3 штук.");
        else alert("⚠️ Минимальный заказ маркеров — от 3 штук.");
        return;
    }
    
    let totalSum = 0;
    let hasPreorder = false;
    let userId = document.getElementById('userIdDisplay')?.innerText || "0";
    let currentBalance = document.getElementById('userBalance')?.innerText || "0";

    // Собираем текстовое описание для админа (как у тебя и было)
    let details = `🛍 **ДЕТАЛИ ЗАКАЗА:**\n`;
    cart.forEach(item => {
        const sum = item.price * item.qty; 
        totalSum += sum;
        if (item.type === 'Раскраска') hasPreorder = true;
        details += `▪️ ${item.type} ${item.type === 'Маркер' ? '№' : '"'}${item.name}${item.type === 'Маркер' ? '' : '"'}\n   - ${item.qty} шт. x ${item.price} = ${sum} руб.\n`;
    });

    // Расчет бонусов
    let bonusToEarn = 0;
    if (totalSum >= 3000 && totalSum < 5000) bonusToEarn = 20;
    else if (totalSum >= 5000 && totalSum < 7500) bonusToEarn = 30;
    else if (totalSum >= 7500 && totalSum < 10000) bonusToEarn = 40;
    else if (totalSum >= 10000) bonusToEarn = 50;
    
    details += `\n💰 **ИТОГО: ${totalSum} руб.**`;
    details += `\n📖 **БОНУС К НАЧИСЛЕНИЮ: ${bonusToEarn}**`;
    details += `\n👤 **ТЕКУЩИЙ БАЛАНС ЮЗЕРА: ${currentBalance}**`;

    // Функция отправки данных на сервер
    const triggerOrder = async () => {
        const orderPayload = {
            action: 'new_order',
            user_id: userId,
            total_sum: totalSum,
            bonus: bonusToEarn,
            cart_items: cart,
            text_details: details
        };

        try {
            // Отправляем запрос на сервер через fetch
            const response = await fetch(`${API_URL}/new_order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderPayload)
            });

            if (response.ok) {
                if (window.tg && tg.showAlert) {
                    // Показываем алерт и закрываем приложение только после клика пользователя
                    tg.showAlert("✅ Ваш заказ успешно отправлен!", () => {
                        tg.close(); 
                    });
                } else {
                    alert("✅ Ваш заказ успешно отправлен!");
                }
                
                // Очистка корзины
                cart = []; 
                updateUI(); 
                renderCart();
            } else {
                throw new Error("Ошибка сервера при оформлении заказа");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            if (window.tg && tg.showAlert) {
                tg.showAlert("❌ Ошибка соединения! Заказ не отправлен. Проверьте интернет.");
            } else {
                alert("❌ Ошибка соединения!");
            }
        }
    };
    
    // Проверка на наличие товаров "Под заказ"
    if (hasPreorder && window.tg && tg.showConfirm) {
        tg.showConfirm("В вашем заказе есть раскраски (ПОД ЗАКАЗ). Оформить?", (confirm) => { 
            if (confirm) triggerOrder();
        });
    } else {
        triggerOrder();
    }
}


// =========================================================
// --- СИСТЕМА НАГРАД И НАВИГАЦИЯ ---
// =========================================================

function toggleRewards() {
    const rewardsSection = document.getElementById('rewards-section');
    const loyaltyInfo = document.getElementById('loyalty-info');
    if(!rewardsSection || !loyaltyInfo) return;
    
    if (rewardsSection.style.display === 'block') {
        rewardsSection.style.display = 'none';
        loyaltyInfo.style.display = 'block';
    } else {
        rewardsSection.style.display = 'block';
        loyaltyInfo.style.display = 'none';
    }
    if(window.tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function buyReward(name, price) {
    const balEl = document.getElementById('userBalance');
    const currentBalance = balEl ? parseInt(balEl.innerText) : 0;
    
    if (currentBalance < price) {
        if(window.tg && tg.showAlert) tg.showAlert("❌ Недостаточно ашетиков для этого товара!");
        return;
    }
    if(window.tg && tg.showConfirm) {
        tg.showConfirm(`Вы действительно хотите обменять ${price} ашетиков на "${name}"?`, (confirm) => {
            if (confirm) {
                let userId = document.getElementById('userIdDisplay')?.innerText || "0";
                tg.sendData(JSON.stringify({ action: 'buy_reward', reward: name, price: price, user_id: userId }));
                tg.close();
            }
        });
    }
}

let currentViewingBrand = null;

function renderBrandsList() {
    const container = document.getElementById('brandsGridContainer');
    if(!container) return;
    container.innerHTML = markerBrandsList.map(brand => {
        const ownedCount = userInventory.filter(id => id.startsWith(brand.name + "_")).length;
        return `
        <div class="brand-button" onclick="openBrandView('${brand.name}')">
            <span>${brand.name}</span>
            <span class="brand-counter">${ownedCount} / ${brand.total}</span>
        </div>`;
    }).join('');
}

function openBrandView(brandName) {
    currentViewingBrand = markerBrandsList.find(b => b.name === brandName);
    document.getElementById('brandsMainView').style.display = 'none';
    document.getElementById('brandDetailView').style.display = 'block';
    document.getElementById('currentBrandTitle').innerText = brandName;
    document.getElementById('brandSearchInput').value = '';
    renderBrandInventory();
}

function closeBrandView() {
    currentViewingBrand = null;
    document.getElementById('brandsMainView').style.display = 'block';
    document.getElementById('brandDetailView').style.display = 'none';
    renderBrandsList();
}

function renderBrandInventory() {
    if (!currentViewingBrand) return;
    const container = document.getElementById('brandInventoryList');
    if(!container) return;
    const query = document.getElementById('brandSearchInput').value.toLowerCase();
    
    let trainedMarkersForBrand = aiDB.filter(item => item.brand === currentViewingBrand.name).map(item => item.marker); 
    let allMarkers = [...new Set(trainedMarkersForBrand)];
    let filtered = allMarkers.filter(m => m.toLowerCase().includes(query));

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: span 3; text-align:center; color:var(--gray); padding: 20px;">
                В этом бренде еще нет обученных цветов.<br>
                <small>Номера появятся после обучения в разделе ИИ.</small>
            </div>`;
        return;
    }
    container.innerHTML = filtered.map(markerNum => {
        let mId = `${currentViewingBrand.name}_${markerNum}`;
        let isOwned = userInventory.includes(mId);
        let locationHtml = '';

        if (isOwned) {
            let locationStr = findMarkerLocation(mId);
            if (locationStr) {
                locationHtml = `<div style="font-size:10px; color:#ff9500; margin-top:6px; line-height:1.2; word-wrap:break-word;">📍 ${locationStr}</div>`;
            }
        }

        return `
        <div class="inventory-item ${isOwned ? 'owned' : ''}" onclick="toggleInventory('${currentViewingBrand.name}', '${markerNum}', ${!isOwned})" style="display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:10px; min-height:60px;">
            <span style="font-size:15px; font-weight:bold;">${markerNum}</span>
            ${locationHtml}
        </div>`;
    }).join('');
}


function filterBrandInventory() { renderBrandInventory(); }

async function massToggle(isAdded) {
    if (!currentViewingBrand) return;
    const actionText = isAdded ? "Добавить все обученные маркеры?" : "Убрать все маркеры этого бренда?";
    
    if(window.tg && tg.showConfirm) {
        tg.showConfirm(actionText, async (confirm) => {
            if (confirm) {
                let trainedIds = aiDB.filter(item => item.brand === currentViewingBrand.name).map(item => `${currentViewingBrand.name}_${item.marker}`);
                if (isAdded) {
                    userInventory = Array.from(new Set([...userInventory, ...trainedIds]));
                } else {
                    userInventory = userInventory.filter(id => !id.startsWith(currentViewingBrand.name + "_"));
                    organizers.forEach(org => { org.cells.forEach(cell => { cell.markers = cell.markers.filter(id => !id.startsWith(currentViewingBrand.name + "_")); }); });
                    saveOrganizers();
                    renderOrganizers();
                }

                let userId = document.getElementById('userIdDisplay')?.innerText || "0";
                await fetch(`${API_URL}/inventory_mass`, {
                    method: 'POST', 
                    body: JSON.stringify({ user_id: userId, brand: currentViewingBrand.name, action: isAdded ? "add_all" : "remove_all" })
                });

                renderBrandInventory();
                if(window.tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
            }
        });
    }
}

// УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ВКЛАДОК
function tab(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    let pageEl = document.getElementById(id);
    if(pageEl) pageEl.classList.add('active');
    
    let btnEl = document.getElementById('btn-' + id);
    if(btnEl) btnEl.classList.add('active');
    
    if (id === 'shop') loadMarkers();
    if (id === 'cart') renderCart();
    if (id === 'mymarkers') { closeBrandView(); renderBrandsList(); renderOrganizers(); }
    if (id === 'profile' || id === 'tasks') renderStatusQuests(); 
    
    if(window.tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
}

let currentVol, currentPage, maxPages, touchStartX, touchStartY;
function startBook(v, m) { currentVol = v; maxPages = m; currentPage = 1; document.getElementById('viewer').style.display = 'block'; updatePage(); }
function closeBook() { document.getElementById('viewer').style.display = 'none'; }
function updatePage() {
    const img = document.getElementById('current-page'), counter = document.getElementById('page-counter'), formats = ['.jpg', '.png', '.jpeg', '.JPG', '.PNG'];
    let fIndex = 0;
    function tryLoad() { img.src = `otveti/t${currentVol}/${currentPage}${formats[fIndex]}`; }
    img.onerror = () => { 
        fIndex++; 
        if (fIndex < formats.length) {
            tryLoad(); 
        } else {
            img.onerror = null; // Предотвращаем бесконечный цикл, если ни один формат не подошел
        }
    };
    tryLoad(); counter.innerText = `${currentPage} / ${maxPages}`;
}

function handleTouchStart(e) { touchStartX = e.touches[0].screenX; touchStartY = e.touches[0].screenY; }
function handleTouchEnd(e) {
    let dx = touchStartX - e.changedTouches[0].screenX, dy = touchStartY - e.changedTouches[0].screenY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && currentPage < maxPages) { currentPage++; updatePage(); }
        else if (dx < 0 && currentPage > 1) { currentPage--; updatePage(); }
    }
}

async function toggleInventory(brand, marker, isAdded) {
    let mId = `${brand}_${marker}`;
    if(isAdded && !userInventory.includes(mId)) userInventory.push(mId);
    if(!isAdded) {
        userInventory = userInventory.filter(id => id !== mId);
        organizers.forEach(org => { org.cells.forEach(cell => { cell.markers = cell.markers.filter(id => id !== mId); }); });
        saveOrganizers();
        renderOrganizers(); 
    }
    renderBrandInventory();
    if(window.tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');

    let userId = document.getElementById('userIdDisplay')?.innerText || "0";
    fetch(`${API_URL}/inventory`, {
        method: 'POST', body: JSON.stringify({ user_id: userId, marker_id: mId, action: isAdded ? "add" : "remove" })
    }).catch(e => console.error("Ошибка сохранения инвентаря", e));
}

function filterMarkers() { renderMarkers(markersData); }

// =========================================================
// --- СИСТЕМА ИСКУССТВЕННОГО ИНТЕЛЛЕКТА (AI) ---
// =========================================================

const API_URL = "https://hlhbot-hachettelittleheroes.amvera.io/api";
let aiDB = [];
let userInventory = [];

async function initAI() {
    try {
        let res = await fetch(`${API_URL}/ai_db`);
        if (!res.ok) throw new Error("API error");
        let data = await res.json();

        if (Array.isArray(data)) {
            aiDB = data;
        } else if (data && Array.isArray(data.data)) {
            aiDB = data.data;
        } else if (data && Array.isArray(data.ai_db)) {
            aiDB = data.ai_db;
        } else {
            console.warn("AI DB unexpected format:", data);
            aiDB = [];
        }

        let userId = document.getElementById('userIdDisplay')?.innerText;
        if (userId && userId !== "---") {
            try {
                let invRes = await fetch(`${API_URL}/inventory?user_id=${userId}`);
                if (invRes.ok) {
                    let invData = await invRes.json();
                    userInventory = Array.isArray(invData) ? invData : [];
                } else {
                    userInventory = [];
                }
            } catch (invErr) {
                console.error("Ошибка загрузки инвентаря", invErr);
                userInventory = [];
            }
        }

    } catch (e) {
        console.error("Ошибка загрузки БД ИИ или инвентаря", e);
        aiDB = [];
        userInventory = [];
    }

    let userDisp = document.getElementById('userIdDisplay');

    if (userDisp && userDisp.innerText == "496779756") {
        let aiPan = document.getElementById('aiAdminPanel');
        if (aiPan) aiPan.style.display = "block";

        let taskPan = document.getElementById('adminTaskPanel');
        if (taskPan) taskPan.style.display = "block";

        if (typeof loadQuarantine === "function") {
            loadQuarantine();
        }

        if (typeof loadAdminTasks === "function") {
            loadAdminTasks();
        }
    }
}


function processAI(event) {
    const files = event.target.files;
    if(!files || files.length === 0) return;
    const container = document.getElementById('aiMultipleResultsContainer');
    if(!container) return;
    container.innerHTML = ''; 
    
    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
                const scale = Math.min(300 / img.width, 300 / img.height);
                canvas.width = img.width * scale; canvas.height = img.height * scale;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                const imgB64 = canvas.toDataURL('image/jpeg', 0.5);
                const sx = Math.max(0, (canvas.width/2)-25), sy = Math.max(0, (canvas.height/2)-25);
                const imgData = ctx.getImageData(sx, sy, 50, 50).data;
                let r=0, g=0, b=0, count=0;
                for(let i=0; i<imgData.length; i+=4) { r+=imgData[i]; g+=imgData[i+1]; b+=imgData[i+2]; count++; }
                let rgb = [Math.round(r/count), Math.round(g/count), Math.round(b/count)];
                
                let resDiv = document.createElement('div');
                resDiv.style.marginTop = "15px"; resDiv.style.background = "var(--secondary)";
                resDiv.style.padding = "15px"; resDiv.style.borderRadius = "12px";
                resDiv.id = `aiResBlock_${index}`;
                
                container.appendChild(canvas);
                canvas.style.maxWidth = "100%"; canvas.style.borderRadius = "12px";
                canvas.style.marginTop = "15px"; canvas.style.border = "1px solid rgba(128,128,128,0.2)";
                
                predictColorMultiple(rgb, imgB64, resDiv, index);
                container.appendChild(resDiv);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function predictColorMultiple(rgb, imgB64, resDiv, index) {
    if(aiDB.length === 0) { resDiv.innerHTML = "<p>База ИИ пуста.</p>"; return; }
    let searchBrand = document.getElementById('aiSearchBrand').value;
    let useInventory = document.getElementById('aiUseInventoryOnly').checked;
    
    let filteredDB = aiDB.filter(item => {
        if (searchBrand !== "All" && item.brand !== searchBrand) return false;
        if (useInventory && !userInventory.includes(`${item.brand}_${item.marker}`)) return false;
        return true;
    });

    if(filteredDB.length === 0) { resDiv.innerHTML = "<p style='color:var(--gray);'>Совпадений в вашей палитре не найдено.</p>"; return; }

    let bestMatch = null, minDist = Infinity;
    filteredDB.forEach(item => {
        let dist = Math.sqrt(Math.pow(item.rgb[0]-rgb[0], 2) + Math.pow(item.rgb[1]-rgb[1], 2) + Math.pow(item.rgb[2]-rgb[2], 2));
        if(dist < minDist) { minDist = dist; bestMatch = item; }
    });

    let confidence = Math.max(0, (1 - (minDist / 441.67)) * 100).toFixed(1);
    const mId = `${bestMatch.brand}_${bestMatch.marker}`;
    const locationInfo = typeof findMarkerLocation === "function" ? findMarkerLocation(mId) : null;

    const locationLabel = locationInfo 
        ? `<div style="margin-top:8px; color:#34c759; font-weight:bold; font-size:13px;">📍 Находится: ${locationInfo}</div>
           <button class="buy-btn" style="margin-top:10px; background:var(--secondary); color:var(--accent); font-size:12px; border:1px solid var(--accent); padding:8px; border-radius:8px;" 
            onclick="locateAndFlash('${mId}')">📍 Показать в органайзере</button>`
        : `<div style="margin-top:8px; color:var(--gray); font-size:12px;">📍 Местоположение в органайзере не указано</div>`;

    resDiv.innerHTML = `
        <h3 style="margin:0 0 5px 0;">Рекомендация: ${bestMatch.brand} <span style="color:var(--accent);">${bestMatch.marker}</span></h3>
        <p style="margin:0 0 5px 0; font-size:12px; color:var(--gray);">Это максимально подходящий цвет из имеющихся у вас в наличии.</p>
        <div style="background: rgba(241, 196, 15, 0.1); border: 1px solid var(--gold); border-radius: 8px; padding: 8px; margin-bottom: 10px; display: inline-block;">
            <span style="font-weight:bold; font-size:13px; color: var(--gold);">⚡ Точность совпадения: ${confidence}%</span>
        </div>
        ${locationLabel}
        <div id="aiFeedbackBlock_${index}" style="margin-top:10px;">
            <p style="margin:0 0 10px 0; font-weight:bold; font-size:14px;">Подошло?</p>
            <div style="display:flex; gap:10px;">
                <button class="buy-btn" style="background:#34c759; border-radius:8px;" onclick="document.getElementById('aiFeedbackBlock_${index}').style.display='none'">Да, отлично!</button>
                <button class="buy-btn" style="background:#ff3b30; border-radius:8px;" onclick="showCorrectionBlock(${index})">Нет, нужен другой</button>
            </div>
        </div>`;
}

function showCorrectionBlock(index) { document.getElementById(`aiFeedbackBlock_${index}`).style.display = 'none'; }
function toggleCorrectionSet(index) {
    const brand = document.getElementById(`aiBrandSelect_${index}`).value;
    document.getElementById(`aiCorrectionSet_${index}`).style.display = (brand === 'Tooli-Art') ? 'block' : 'none';
}
function toggleAdminSet() {
    const brand = document.getElementById('adminTrainBrand').value;
    const setElem = document.getElementById('adminTrainSet');
    if (setElem) setElem.style.display = (brand === 'Tooli-Art') ? 'block' : 'none';
}

// ИСПРАВЛЕННЫЙ БЛОК ОБУЧЕНИЯ ИИ (ОТОРВАННЫЕ КУСКИ ВЛОЖЕНЫ В ФУНКЦИЮ)
async function trainAI(event) {
    const brand = document.getElementById('adminTrainBrand').value;
    let num = document.getElementById('adminTrainNum').value.trim();

    if (!num) {
        if (window.tg && window.tg.showAlert) window.tg.showAlert("Введите номер маркера");
        return;
    }

    if (!event.target.files || !event.target.files[0]) {
        if (window.tg && window.tg.showAlert) window.tg.showAlert("Выберите фото маркера");
        return;
    }

    if (brand === 'Tooli-Art') {
        let setVal = document.getElementById('adminTrainSet').value;
        num = setVal + " " + num;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = async function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let r = 0, g = 0, b = 0, c = 0;
            for (let i = 0; i < imgData.length; i += 4) {
                r += imgData[i]; g += imgData[i + 1]; b += imgData[i + 2]; c++;
            }

            const rgb = [Math.round(r / c), Math.round(g / c), Math.round(b / c)];

            try {
                const res = await fetch(`${API_URL}/train`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ brand: brand, marker: num, rgb: rgb })
                });

                if (window.tg && window.tg.HapticFeedback) window.tg.HapticFeedback.notificationOccurred('success');
                if (window.tg && window.tg.showAlert) window.tg.showAlert("Маркер успешно добавлен в базу ИИ");
                
                if (typeof initAI === "function") initAI();
            } catch (err) {
                console.error("AI train error:", err);
                if (window.tg && window.tg.showAlert) window.tg.showAlert("Ошибка обучения ИИ");
            }
        };
        
        // Обработчик ошибки загрузки картинки теперь правильно привязан к img
        img.onerror = function(){
            if(window.tg && window.tg.showAlert){
                window.tg.showAlert("Ошибка загрузки изображения");
            }
        };

        img.src = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

async function loadQuarantine() {
    try{
        let res = await fetch(`${API_URL}/quarantine_list`);
        if(!res.ok){
            throw new Error("API error");
        }
        let data = await res.json();
        let html = data.length === 0 ? "<p>Пусто.</p>" : "";

        data.forEach(q => {
            html += `<div class="row-item" style="align-items:center;">
                <img src="${q.image}" style="width:50px; border-radius:8px; margin-right:10px; object-fit:cover;">
                <div style="flex:1;">
                    <b>${q.brand}</b><br>
                    <span style="font-size:14px; color:var(--accent);">№ ${q.correct_marker}</span>
                </div>
                <div style="display:flex; flex-direction:column; gap:5px;">
                    <button class="buy-btn" style="padding:6px 12px; border-radius:6px; font-size:12px; background:#34c759;" onclick="resolveQ(${q.id}, 'approve')">Одобрить</button>
                    <button class="buy-btn" style="padding:6px 12px; border-radius:6px; font-size:12px; background:#ff3b30;" onclick="resolveQ(${q.id}, 'reject')">Отвергнуть</button>
                </div>
            </div>`;
        });

        let qList = document.getElementById('adminQuarantineList');
        if(qList){
            qList.innerHTML = html;
        }
    }catch(err){
        console.error("Quarantine load error:", err);
        let qList = document.getElementById('adminQuarantineList');
        if(qList){
            qList.innerHTML = "<p>Ошибка загрузки карантина.</p>";
        }
    }
}

async function resolveQ(id, action) {
    try{
        const res = await fetch(`${API_URL}/quarantine_resolve`, {
            method: 'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                id: id,
                action: action
            })
        });
        const data = await res.json();
        console.log("Quarantine resolve:", data);

        if(window.tg && window.tg.HapticFeedback){
            window.tg.HapticFeedback.notificationOccurred('success');
        }

        if(typeof initAI === "function"){
            initAI();
        }

        loadQuarantine();

    }catch(err){
        console.error("Resolve quarantine error:", err);
        if(window.tg && window.tg.showAlert){
            window.tg.showAlert("Ошибка обработки карантина");
        }
    }
}

// =========================================================
// --- ЛОГИКА ДОСТИЖЕНИЙ В ПРОФИЛЕ ---
// =========================================================
let currentSlot = null;

function renderFullAchievementsList() {
    const listContainer = document.getElementById('fullAchievementsList');
    const balEl = document.getElementById('userBalance');
    const userBalance = balEl ? parseInt(balEl.innerText) : 0;
    
    if(!listContainer) return;
    
    listContainer.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:15px; border-bottom:1px solid var(--secondary);">
            <b style="color:var(--text);">Все достижения</b>
            <span onclick="closePicker()" style="color:var(--accent); font-weight:bold; cursor:pointer;">Закрыть</span>
        </div>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; padding:15px; max-height:400px; overflow-y:auto;">
            ${achievementsConfig.map(ach => {
                let current = 0;
                if (ach.type === 'admin_check') current = window.userProfileData.stats[ach.statKey] || 0;
                if (ach.type === 'auto_balance') current = userBalance;
                if (ach.type === 'auto_name') current = window.userProfileData.stats.nameChanged || 0;
                
                const isEarned = current >= ach.target;
                const filterStyle = isEarned ? '' : 'filter: grayscale(1) opacity(0.4);';
                const clickAction = isEarned 
                    ? `selectForTop('${ach.id}', '${ach.icon}', '${ach.title}', '${ach.desc}')`
                    : `showLockedAchievement('${ach.title}', '${ach.req}', '${ach.icon}')`;

                return `
                <div class="ach-item-picker" onclick="${clickAction}" style="text-align:center; background:var(--secondary); padding:10px; border-radius:15px; cursor:pointer;">
                    <div style="position:relative; width:50px; height:50px; margin: 0 auto 5px;">
                        <img src="${ach.icon}" style="width:100%; height:100%; border-radius:12px; object-fit:cover; ${filterStyle}">
                        ${!isEarned ? '<div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:white; font-size:18px;">🔒</div>' : ''}
                    </div>
                    <div style="font-size:10px; color:${isEarned ? 'var(--text)' : 'var(--gray)'}; font-weight:500;">${ach.title}</div>
                </div>`;
            }).join('')}
        </div>`;
}

function openAchievementPicker(slotIndex) {
    currentSlot = slotIndex;
    renderFullAchievementsList();
    let listEl = document.getElementById('fullAchievementsList');
    if(listEl) {
        listEl.style.display = 'block';
        listEl.scrollIntoView({ behavior: 'smooth' });
    }
}

function closePicker() { 
    let listEl = document.getElementById('fullAchievementsList');
    if(listEl) listEl.style.display = 'none'; 
}

function selectForTop(achId, achImg, achTitle, achDesc) {
    if (currentSlot !== null) {
        if (!window.userProfileData.topAchievements) window.userProfileData.topAchievements = [null, null, null];
        window.userProfileData.topAchievements[currentSlot] = { achId, achImg, achTitle, achDesc };
        updateSlotUI(currentSlot, achImg, achTitle, achDesc);
        
        if (typeof saveProfileData === "function") saveProfileData(); 
        closePicker();
        
        if(window.tg && window.tg.HapticFeedback) window.tg.HapticFeedback.notificationOccurred('success');
    }
}

function updateSlotUI(index, img, title, desc) {
    const slot = document.getElementById(`slot-${index}`);
    if(slot) {
        slot.innerHTML = `
        <div onclick="showAchDescription('${title}', '${desc}', '${img}')" style="cursor:pointer;text-align:center;">
        <img src="${img}" style="width:60px; height:60px; border-radius:18px; object-fit:cover; border:3px solid gold; box-shadow:0 0 10px rgba(255,215,0,0.6);">
        <div style="font-size:10px; color:white; margin-top:5px; font-weight:bold; overflow:hidden; text-overflow:ellipsis;">${title}</div>
        </div>
        <div onclick="openAchievementPicker(${index})" style="font-size:9px;color:var(--accent);margin-top:4px;cursor:pointer;">Изменить</div>`;
    }
}

function showLockedAchievement(title, req, icon) {
    const modal = document.getElementById('achievementModal');
    if(!modal) return;
    document.getElementById('achModalTitle').innerText = title;
    document.getElementById('achModalDesc').innerHTML = `<b style="color:var(--accent);">Условия получения:</b><br>${req}`;
    const img = document.getElementById('achModalIconImg');
    img.src = icon; img.style.filter = "grayscale(1) opacity(0.7)";
    modal.style.display = 'flex';
}

function showAchDescription(title, desc, img) {
    const modal = document.getElementById('achievementModal');
    if(!modal) return;
    document.getElementById('achModalTitle').innerText = title;
    document.getElementById('achModalDesc').innerText = desc;
    const imgEl = document.getElementById('achModalIconImg');
    imgEl.src = img; imgEl.style.filter = "none";
    modal.style.display = 'flex';
}

// =========================================================
// --- ИНИЦИАЛИЗАЦИЯ ПРИ ЗАПУСКЕ ---
// =========================================================
window.onload = () => {
    try {
        const params = new URLSearchParams(window.location.search);
        let balEl = document.getElementById('userBalance');
        if(balEl) balEl.innerText = params.get('balance') || 0;
        
        let userIdEl = document.getElementById('userIdDisplay');
        const userId = params.get('id') || (window.tg && window.tg.initDataUnsafe?.user?.id) || "---";
        if(userIdEl) userIdEl.innerText = userId;
        
        if (typeof loadProfileData === "function") loadProfileData(); 
        if (typeof initUserStats === "function") initUserStats(); 
        
        setTimeout(() => {
            if (typeof renderStatusQuests === "function") renderStatusQuests(); 
            if (window.userProfileData && window.userProfileData.topAchievements) {
                window.userProfileData.topAchievements.forEach((ach, index) => {
                    if (ach) updateSlotUI(index, ach.achImg, ach.achTitle, ach.achDesc);
                });
            }
        }, 100);

        initAI();
        if (typeof renderBooks === "function") renderBooks();
        if (typeof renderOrganizers === "function") renderOrganizers(); 
    } catch (e) {
        console.error("Ошибка при инициализации окна:", e);
    }
};
</script>