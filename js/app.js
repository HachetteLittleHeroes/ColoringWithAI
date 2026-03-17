// app.js — главный контроллер
const state = {
    userId: '496779756', // В будущем: window.Telegram.WebApp.initDataUnsafe.user.id
    currentTab: 'profile'
};

function tab(tabId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(`btn-${tabId}`);
    if (btn) btn.classList.add('active');
    state.currentTab = tabId;
}

// Поиск
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

// Профиль
async function initApp() {
    const user = await window.api.getUserData(state.userId);
    syncProfileUI(user);
    document.getElementById('userIdDisplay').innerText = state.userId;
    // Загрузка остальных данных
    loadOrganizers(); 
}

async function saveNewNickname() {
    const name = document.getElementById('newNameInput').value.trim();
    if (!name) return;
    await window.api.updateUserProfile(state.userId, { name });
    document.getElementById('displayUsername').innerText = name;
    document.getElementById('nameInputModal').style.display = 'none';
}

function changeNickname() { document.getElementById('nameInputModal').style.display = 'flex'; }
function toggleAvatarEditor() {
    const el = document.getElementById('avatarEditorBlock');
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function toggleRewards() {
    const el = document.getElementById('rewards-section');
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

// Инициализация при старте
document.addEventListener('DOMContentLoaded', initApp);
//закрытие окна выбора статуса
function closeStatusSelect() {
    document.getElementById('statusSelectModal').style.display = 'none';
}

// Функция для закрытия при клике на темный фон
function closeStatusSelectOutside(event) {
    if (event.target.id === 'statusSelectModal') {
        closeStatusSelect();
    }
}

