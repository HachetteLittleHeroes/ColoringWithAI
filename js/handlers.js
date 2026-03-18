// ==========================================
// handlers.js — обработчики событий
// ==========================================

// ---------------- Органайзеры ----------------
function showAddOrganizer() {
    const name = prompt('Введите название нового органайзера:');
    if (!name) return;
    addOrganizer(name).then(loadOrganizers);
}

async function loadOrganizers() {
    const userId = document.getElementById('userIdDisplay')?.innerText; // Добавлено ? для безопасности
    if(!userId) return; // Заглушка, чтобы не выдавало ошибку в консоли
    const organizers = await getOrganizers(userId);
    const container = document.getElementById('organizersList');
    container.innerHTML = '';
    organizers.forEach(org => {
        const div = document.createElement('div');
        div.className = 'organizer-card';
        div.innerText = org.name;
        div.onclick = () => openOrganizerView(org.id, org.name);
        container.appendChild(div);
    });
}

function openOrganizerView(orgId, title) {
    document.getElementById('organizerDetailView').style.display = 'block';
    document.getElementById('viewOrgTitle').innerText = title;
    loadOrganizerMarkers(orgId);
}

async function loadOrganizerMarkers(orgId) {
    const markers = await getOrganizerMarkers(orgId);
    const grid = document.getElementById('gridContainer');
    grid.innerHTML = '';
    markers.forEach(m => {
        const div = document.createElement('div');
        div.className = 'organizer-cell';
        div.innerText = m.name;
        div.onclick = () => openCellModal(m.id, m.name);
        grid.appendChild(div);
    });
}

function closeOrganizerView() {
    document.getElementById('organizerDetailView').style.display = 'none';
}

// ---------------- Ячейки ----------------
function openCellModal(cellId, title) {
    const modal = document.getElementById('cellManageModal');
    modal.style.display = 'flex';
    document.getElementById('cellModalTitle').innerText = title;
    loadCellMarkers(cellId);
    modal.dataset.cellId = cellId;
}

async function loadCellMarkers(cellId) {
    const markers = await getCellMarkers(cellId);
    const list = document.getElementById('cellMarkerList');
    list.innerHTML = '';
    markers.forEach(m => {
        const div = document.createElement('div');
        div.className = 'cell-marker';
        div.innerText = m.name;
        list.appendChild(div);
    });
}

function closeCellModal() {
    document.getElementById('cellManageModal').style.display = 'none';
}

// ---------------- Добавление маркера ----------------
function openAddMarkerModal() {
    document.getElementById('addMarkerModal').style.display = 'flex';
}

function closeAddMarkerModal() {
    document.getElementById('addMarkerModal').style.display = 'none';
}

async function confirmAddMarkerToCell() {
    const cellId = document.getElementById('cellManageModal').dataset.cellId;
    const brand = document.getElementById('modalBrandGrid').dataset.selectedBrand;
    const number = document.getElementById('modalMarkerSearch').value.trim();
    if (!brand || !number) return alert('Выберите бренд и введите номер');
    await addMarkerToCell(cellId, brand, number);
    closeAddMarkerModal();
    loadCellMarkers(cellId);
}

// ---------------- Статусы ----------------
function openStatusSelect() {
    document.getElementById('statusSelectModal').style.display = 'flex';
    loadStatuses();
}

async function loadStatuses() {
    const userId = document.getElementById('userIdDisplay')?.innerText;
    if(!userId) return;
    const statuses = await getStatuses();
    const container = document.getElementById('statusSelectList');
    container.innerHTML = '';
    statuses.forEach(s => {
        const div = document.createElement('div');
        div.className = 'status-item';
        div.innerText = s.name;
        div.onclick = async () => {
            await setStatus(userId, s.id);
            document.getElementById('currentStatus').innerText = s.name;
            document.getElementById('statusSelectModal').style.display = 'none';
        };
        container.appendChild(div);
    });
}

// ---------------- Достижения ----------------
function openTasks() {
    const container = document.getElementById('questsListContainer');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
}

// ---------------- Массовые действия ----------------
function massToggle(addAll) {
    const checkboxes = document.querySelectorAll('#brandInventoryList input[type=checkbox]');
    checkboxes.forEach(cb => cb.checked = addAll);
}

// ---------------- Кнопка «Назад» книги ----------------
function closeBook() {
    document.getElementById('viewer').style.display = 'none';
}

// ---------------- Вспомогательные ----------------
function handleTouchStart(e) {
    // заглушка для свайпов
}

function handleTouchEnd(e) {
    // заглушка для свайпов
}

// ---------------- Инициализация ----------------
document.addEventListener('DOMContentLoaded', () => {
    loadOrganizers();
});
