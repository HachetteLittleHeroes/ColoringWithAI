// ====================================================
// ====== Полный расширенный JS для Mini App Hachette ========
// ====================================================

// --- Глобальные переменные ---
let currentTab = 'answers';
let userProfile = {
    nickname: 'Без имени',
    balance: 0,
    avatar: 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/avatars/av2.png',
    status: 'Без статуса',
    achievements: []
};
let cart = [];
let markersInventory = []; // массив маркеров
let organizers = []; // органайзеры
let books = []; // массив книг для вкладки Answers
let aiResults = [];
let achievementPhotos = [];

// --- Навигация и вкладки ---
function tab(tabName) {
    currentTab = tabName;
    document.querySelectorAll('.page').forEach(p => p.style.display = (p.id === tabName) ? 'block' : 'none');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.id === 'btn-' + tabName));
}

// --- Фильтры ---
function filterBooks() {
    const query = document.getElementById('bookSearch').value.toLowerCase();
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = '';
    books.filter(b => b.title.toLowerCase().includes(query)).forEach(book => {
        const div = document.createElement('div');
        div.textContent = book.title;
        grid.appendChild(div);
    });
}

function filterMarkers() {
    const query = document.getElementById('markerSearch').value.toLowerCase();
    const list = document.getElementById('markersList');
    list.innerHTML = '';
    markersInventory.filter(m => m.number.toLowerCase().includes(query)).forEach(marker => {
        const div = document.createElement('div');
        div.textContent = marker.number;
        list.appendChild(div);
    });
}

// --- Корзина ---
function addToCart(item) {
    cart.push(item);
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    const cartList = document.getElementById('cartList');
    cartList.innerHTML = '';
    cart.forEach((item, i) => {
        const div = document.createElement('div');
        div.textContent = `${item.name} - ${item.price} руб.`;
        const btn = document.createElement('button');
        btn.textContent = 'Удалить';
        btn.onclick = () => removeFromCart(i);
        div.appendChild(btn);
        cartList.appendChild(div);
    });
    document.getElementById('mainOrderBtn').style.display = cart.length > 0 ? 'block' : 'none';
}

function checkout() {
    if (cart.length === 0) return;
    alert('Заказ оформлен!');
    cart = [];
    updateCartUI();
}

// --- Профиль ---
function changeNickname() {
    const modal = document.getElementById('nameInputModal');
    document.getElementById('newNameInput').value = userProfile.nickname;
    modal.style.display = 'block';
}

function saveNewNickname() {
    const input = document.getElementById('newNameInput');
    userProfile.nickname = input.value || 'Без имени';
    document.getElementById('displayUsername').textContent = userProfile.nickname;
    document.getElementById('nameInputModal').style.display = 'none';
}

function toggleAvatarEditor() {
    const block = document.getElementById('avatarEditorBlock');
    block.style.display = block.style.display === 'none' ? 'block' : 'none';
}

function handleCustomAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        userProfile.avatar = e.target.result;
        document.getElementById('user-avatar').src = userProfile.avatar;
    };
    reader.readAsDataURL(file);
}

// --- Достижения ---
function openAchievementPicker(slot) {
    document.getElementById('fullAchievementsList').style.display = 'block';
    // Здесь можно динамически заполнять grid достижениями
}

function closePicker() {
    document.getElementById('fullAchievementsList').style.display = 'none';
}

function handleAchievementPhotos(event) {
    achievementPhotos = Array.from(event.target.files);
}

// --- Программа лояльности и награды ---
function toggleRewards() {
    const section = document.getElementById('rewards-section');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

function toggleEarnAchetiki() {
    const section = document.getElementById('real-loyalty-info');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

function buyReward(name, cost) {
    if (userProfile.balance >= cost) {
        userProfile.balance -= cost;
        document.getElementById('userBalance').textContent = userProfile.balance;
        alert(`Вы купили ${name}!`);
    } else {
        alert('Недостаточно ашетиков!');
    }
}

// --- AI Палитра ---
function processAI(event) {
    const files = Array.from(event.target.files);
    aiResults = files.map(f => URL.createObjectURL(f));
    const container = document.getElementById('aiMultipleResultsContainer');
    container.innerHTML = '';
    aiResults.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.style.width = '100px';
        img.style.margin = '5px';
        container.appendChild(img);
    });
}

// --- Органайзеры ---
function showAddOrganizer() {
    const name = prompt('Название органайзера?');
    if (!name) return;
    organizers.push({ name, markers: [] });
    updateOrganizerUI();
}

function updateOrganizerUI() {
    const list = document.getElementById('organizersList');
    list.innerHTML = '';
    organizers.forEach((org, i) => {
        const div = document.createElement('div');
        div.textContent = org.name;
        list.appendChild(div);
    });
}

function closeOrganizerView() {
    document.getElementById('organizerDetailView').style.display = 'none';
}

// --- Управление ячейками ---
let currentCell = null;

function openCellModal(cell) {
    currentCell = cell;
    const modal = document.getElementById('cellManageModal');
    document.getElementById('cellModalTitle').textContent = cell.name;
    updateCellMarkerList();
    modal.style.display = 'flex';
}

function closeCellModal() {
    document.getElementById('cellManageModal').style.display = 'none';
    currentCell = null;
}

function updateCellMarkerList() {
    if (!currentCell) return;
    const list = document.getElementById('cellMarkerList');
    list.innerHTML = '';
    currentCell.markers.forEach((m, i) => {
        const div = document.createElement('div');
        div.textContent = m.number;
        const btn = document.createElement('button');
        btn.textContent = 'Удалить';
        btn.onclick = () => {
            currentCell.markers.splice(i, 1);
            updateCellMarkerList();
        };
        div.appendChild(btn);
        list.appendChild(div);
    });
}

function openAddMarkerModal() {
    document.getElementById('addMarkerModal').style.display = 'flex';
    document.getElementById('modalMarkerSearch').value = '';
}

function closeAddMarkerModal() {
    document.getElementById('addMarkerModal').style.display = 'none';
}

function confirmAddMarkerToCell() {
    if (!currentCell) return;
    const number = document.getElementById('modalMarkerSearch').value.trim();
    if (!number) return;
    currentCell.markers.push({ number });
    updateCellMarkerList();
    closeAddMarkerModal();
}

// --- Статусы ---
function openStatusSelect() {
    document.getElementById('statusSelectModal').style.display = 'flex';
}

function selectStatus(status) {
    userProfile.status = status;
    document.getElementById('currentStatus').textContent = status;
    document.getElementById('statusSelectModal').style.display = 'none';
}

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
    tab(currentTab);
    document.getElementById('user-avatar').src = userProfile.avatar;
    document.getElementById('displayUsername').textContent = userProfile.nickname;
    document.getElementById('userBalance').textContent = userProfile.balance;
});
