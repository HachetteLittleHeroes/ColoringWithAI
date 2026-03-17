const MARKERS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1Yrsif-aQwbuT6fLPnP4MsM22UuwuUWz5FYegELPxzFU/gviz/tq?tqx=out:csv&cache=';
const AMVERA_URL = 'https://hlhbot-hachettelittleheroes.amvera.io';

async function fetchMarkersFromSheet() {
    try {
        const response = await fetch(`${MARKERS_CSV_URL}${new Date().getTime()}`);
        const csvText = await response.text();
        const rows = csvText.split('\n').map(row => row.split(',').map(cell => cell.replace(/"/g, '').trim()));
        let parsedMarkers = [];
        rows.forEach(row => {
            for (let i = 0; i < row.length; i++) {
                let num = row[i];
                if (num && !isNaN(num) && parseInt(num) > 10) {
                    let stock = parseInt(row[i+1] || row[i+2] || "0");
                    parsedMarkers.push({ number: num, stock: isNaN(stock) ? 0 : stock, price: 75 });
                    i++; 
                }
            }
        });
        return parsedMarkers.filter((v, i, a) => a.findIndex(t => t.number === v.number) === i);
    } catch (e) { return []; }
}

// Профиль
async function getUserData(userId) {
    try {
        const res = await fetch(`${AMVERA_URL}/get_user?id=${userId}`);
        return await res.json();
    } catch (e) {
        return { id: userId, name: localStorage.getItem('user_nickname') || "Герой", balance: 0, avatar: localStorage.getItem('user_avatar') || 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/avatars/av2.png' };
    }
}

async function updateUserProfile(userId, data) {
    try {
        const res = await fetch(`${AMVERA_URL}/update_user`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ user_id: userId, username: data.name })
        });
        if (data.name) localStorage.setItem('user_nickname', data.name);
        return await res.json();
    } catch (e) { return { success: false }; }
}

// Органайзеры (заглушки для работы интерфейса)
async function getOrganizers(userId) { return JSON.parse(localStorage.getItem(`orgs_${userId}`) || '[]'); }
async function addOrganizer(userId, name) {
    let orgs = await getOrganizers(userId);
    orgs.push({ id: Date.now(), name: name });
    localStorage.setItem(`orgs_${userId}`, JSON.stringify(orgs));
}
async function getOrganizerMarkers(orgId) { return []; }
async function getCellMarkers(cellId) { return []; }
async function addMarkerToCell(cellId, brand, number) { return { success: true }; }
async function getStatuses() { return [{id: 1, name: "Новичок"}, {id: 2, name: "Мастер"}]; }
async function setStatus(userId, statusId) { return { success: true }; }

// Экспорт
window.api = { fetchMarkersFromSheet, getUserData, updateUserProfile, getOrganizers, addOrganizer, getOrganizerMarkers, getCellMarkers, addMarkerToCell, getStatuses, setStatus };
