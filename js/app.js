// app.js — главный контроллер
const state = {
    userId: '496779756', // В будущем: window.Telegram.WebApp.initDataUnsafe.user.id
    currentTab: 'profile'
};

/* ===================== НАВИГАЦИЯ ===================== */
function tab(tabId) {
    console.log("Переход на вкладку:", tabId);

    const pages = document.querySelectorAll('.page');
    const buttons = document.querySelectorAll('.nav-btn');

    pages.forEach(p => {
        p.style.setProperty('display', 'none', 'important');
        p.classList.remove('active');
    });

    buttons.forEach(b => b.classList.remove('active'));

    const targetPage = document.getElementById(tabId);
    
    if (targetPage) {
        targetPage.style.setProperty('display', 'block', 'important');
        targetPage.classList.add('active');
        
        const targetBtn = document.getElementById('btn-' + tabId);
        if (targetBtn) targetBtn.classList.add('active');
        
        window.scrollTo(0, 0);
    } else {
        console.error(`Ошибка: Страница с id="${tabId}" не найдена`);
        alert(`Ошибка: страница "${tabId}" отсутствует`);
    }
}

/* ===================== ПОИСК ===================== */
function filterBooks() {
    const q = document.getElementById('bookSearch').value.toLowerCase();
    document.querySelectorAll('.book-card').forEach(c => {
        c.style.display = c.innerText.toLowerCase().includes(q) ? 'block' : 'none';
    });
}

function filterMarkers() {
    const q = document.getElementById('markerSearch').value.toLowerCase();
    document.querySelectorAll('.marker-item, .marker-card').forEach(c => {
        c.style.display = c.innerText.toLowerCase().includes(q) ? 'flex' : 'none';
    });
}

/* ===================== ДОСТИЖЕНИЯ ===================== */
const achievements = [
    {
        id: "alcohol_markers",
        title: "Спиртесса",
        levels: [
            { level: 1, count: 5, color: "#8e8e93" },
            { level: 2, count: 10, color: "#5ac8fa" },
            { level: 3, count: 10, color: "#34c759" },
            { level: 4, count: 15, color: "#af52de" },
            { level: 5, count: 20, color: "#ffcc00" }
        ]
    }
];

/* ===================== ПРОФИЛЬ ===================== */
async function initApp() {
    const user = await window.api.getUserData(state.userId);

    syncProfileUI(user);

    document.getElementById('userIdDisplay').innerText = state.userId;

    loadOrganizers();

    renderAchievements();
    loadSavedStatus();
}

async function saveNewNickname() {
    const name = document.getElementById('newNameInput').value.trim();
    if (!name) return;

    await window.api.updateUserProfile(state.userId, { name });

    document.getElementById('displayUsername').innerText = name;
    document.getElementById('nameInputModal').style.display = 'none';
}

function changeNickname() {
    document.getElementById('nameInputModal').style.display = 'flex';
}

function toggleAvatarEditor() {
    const el = document.getElementById('avatarEditorBlock');
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

/* ===================== АШЕТИКИ ===================== */
function toggleRewards() {
    const el = document.getElementById('rewards-section');
    if (!el) return;

    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function toggleEarnAchetiki() {
    const el = document.getElementById('earn-section');
    if (!el) return;

    if (el.style.display === 'none' || el.style.display === '') {
        el.style.display = 'block';

        el.innerHTML = `
            <div class="category-title">💰 Заработать ашетики</div>

            <div class="card">
                <p>📸 Загрузить фото</p>
                <span>+10</span>
            </div>

            <div class="card">
                <p>🎯 Выполнить задание</p>
                <span>+20</span>
            </div>

            <div class="card">
                <p>⭐ Достижение</p>
                <span>+50</span>
            </div>
        `;
    } else {
        el.style.display = 'none';
    }
}

/* ===================== ДОСТИЖЕНИЯ UI ===================== */
function renderAchievements() {
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;

    const progress = JSON.parse(localStorage.getItem('ach_progress') || '{}');

    grid.innerHTML = '';

    achievements.forEach(a => {
        const userLevel = progress[a.id] || 0;

        const card = document.createElement('div');
        card.className = 'achieve-card ' + (userLevel > 0 ? 'unlocked' : '');

        const current = a.levels[userLevel - 1];

        card.innerHTML = `
            <div class="achieve-title">${a.title}</div>
            <small>Уровень: ${userLevel}/5</small>
        `;

        if (current) {
            card.style.borderColor = current.color;
        }

        card.onclick = () => openAchievement(a);

        grid.appendChild(card);
    });
}

function openAchievement(a) {
    const progress = JSON.parse(localStorage.getItem('ach_progress') || '{}');
    const level = progress[a.id] || 0;

    const nextLevel = a.levels[level];

    if (!nextLevel) {
        alert("Максимальный уровень!");
        return;
    }

    alert(`Задание:\nРаскрасить ${nextLevel.count} картинок\n(загрузка фото будет дальше)`);
}

function completeAchievement(id) {
    let progress = JSON.parse(localStorage.getItem('ach_progress') || '{}');

    if (!progress[id]) progress[id] = 0;

    progress[id]++;

    localStorage.setItem('ach_progress', JSON.stringify(progress));

    if (progress[id] === 5) {
        const status = "Спиртесса";

        document.getElementById('currentStatus').innerText = status;
        localStorage.setItem('status', status);
    }

    renderAchievements();
}

/* ===================== СТАТУС ===================== */
function loadSavedStatus() {
    const saved = localStorage.getItem('status');
    if (saved) {
        document.getElementById('currentStatus').innerText = saved;
    }
}

/* ===================== МОДАЛКА СТАТУСА ===================== */
function closeStatusSelect() {
    document.getElementById('statusSelectModal').style.display = 'none';
}

function closeStatusSelectOutside(event) {
    if (event.target.id === 'statusSelectModal') {
        closeStatusSelect();
    }
}

/* ===================== СТАРТ ===================== */
document.addEventListener('DOMContentLoaded', initApp);
