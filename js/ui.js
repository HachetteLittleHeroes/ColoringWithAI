// ==========================================
// ui.js — визуальные функции и интерфейс
// ==========================================

// ---------------- Переключение вкладок ----------------
function tab(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    const btns = document.querySelectorAll('.nav-btn');
    btns.forEach(b => b.classList.remove('active'));

    const page = document.getElementById(pageId);
    if (page) page.classList.add('active');

    const btn = document.getElementById('btn-' + pageId);
    if (btn) btn.classList.add('active');
}

// ---------------- Фильтры ----------------
function filterBooks() {
    const search = document.getElementById('bookSearch').value.toLowerCase();
    const booksGrid = document.getElementById('booksGrid');
    const books = booksGrid.querySelectorAll('.book-card');
    books.forEach(b => {
        const text = b.innerText.toLowerCase();
        b.style.display = text.includes(search) ? 'block' : 'none';
    });
}

function filterMarkers() {
    const search = document.getElementById('markerSearch').value.toLowerCase();
    const markers = document.getElementById('markersList').querySelectorAll('.marker-item');
    markers.forEach(m => {
        const text = m.innerText.toLowerCase();
        m.style.display = text.includes(search) ? 'block' : 'none';
    });
}

function filterBrandInventory() {
    const search = document.getElementById('brandSearchInput').value.toLowerCase();
    const items = document.getElementById('brandInventoryList').querySelectorAll('.inventory-item');
    items.forEach(i => {
        const text = i.innerText.toLowerCase();
        i.style.display = text.includes(search) ? 'flex' : 'none';
    });
}

// ---------------- Аватар ----------------
function toggleAvatarEditor() {
    const editor = document.getElementById('avatarEditorBlock');
    editor.style.display = editor.style.display === 'none' ? 'block' : 'none';
}

function handleCustomAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        document.getElementById('user-avatar').src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ---------------- Никнейм ----------------
function changeNickname() {
    document.getElementById('nameInputModal').style.display = 'flex';
}

function saveNewNickname() {
    const input = document.getElementById('newNameInput');
    const value = input.value.trim();
    if (!value) return alert('Введите никнейм');
    document.getElementById('displayUsername').innerText = value;
    input.value = '';
    document.getElementById('nameInputModal').style.display = 'none';
}

// ---------------- Программа лояльности ----------------
function toggleRewards() {
    const section = document.getElementById('rewards-section');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

function toggleEarnAchetiki() {
    const info = document.getElementById('real-loyalty-info');
    info.style.display = info.style.display === 'none' ? 'block' : 'none';
}

// ---------------- Достижения ----------------
function openAchievementPicker(slotIndex) {
    const list = document.getElementById('fullAchievementsList');
    list.style.display = 'block';
    list.dataset.slotIndex = slotIndex;
}

function closePicker() {
    document.getElementById('fullAchievementsList').style.display = 'none';
}

function handleAchievementPhotos(event) {
    const files = Array.from(event.target.files);
    const container = document.getElementById('achievementsGrid');
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            const div = document.createElement('div');
            div.className = 'achievement-item';
            div.innerHTML = `<img src="${e.target.result}" style="width:100%; border-radius:12px;">`;
            container.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

// ---------------- Профиль — Статусы ----------------
function openStatusSelectModal() {
    const modal = document.getElementById('statusSelectModal');
    modal.style.display = 'flex';
}

function closeStatusSelect() {
    document.getElementById('statusSelectModal').style.display = 'none';
}

// ---------------- Кнопки «Назад» ----------------
function closeBrandView() {
    document.getElementById('brandDetailView').style.display = 'none';
}

// ---------------- Модальные ----------------
function openTasks() {
    const container = document.getElementById('questsListContainer');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
}

// ---------------- ИИ Палитра ----------------
function processAI(event) {
    const files = Array.from(event.target.files);
    const container = document.getElementById('aiMultipleResultsContainer');
    container.innerHTML = '';
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            const div = document.createElement('div');
            div.className = 'ai-result-item';
            div.innerHTML = `<img src="${e.target.result}" style="width:100px;height:100px;border-radius:12px;">`;
            container.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

// ---------------- Общие UI функции ----------------
function showAlert(msg) {
    alert(msg);
}

function updateCartBadge(count) {
    const badge = document.getElementById('cartBadge');
    if (count > 0) {
        badge.style.display = 'inline-block';
        badge.innerText = count;
    } else {
        badge.style.display = 'none';
    }
}

// ---------------- Инициализация ----------------
document.addEventListener('DOMContentLoaded', () => {
    tab('profile'); // по умолчанию открываем Профиль
});
function updateUserProfile(data) {
    if (data.username) {
        document.getElementById('displayUsername').innerText = data.username;
    }
    if (data.balance !== undefined) {
        document.getElementById('userBalance').innerText = data.balance;
    }
    if (data.photo_url) {
        document.getElementById('user-avatar').src = data.photo_url;
    }
}
// Не забудьте сделать её глобальной, чтобы app.js её увидел
window.updateUserProfile = updateUserProfile;
