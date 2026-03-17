// ================================
// api.js — все серверные запросы
// ================================

const API_URL = "https://hlhbot-hachettelittleheroes.amvera.io"; // твой сервер

// ---------------- User / Профиль ----------------
async function getUserData(userId) {
    const res = await fetch(`${API_URL}/user/${userId}`);
    if (!res.ok) throw new Error("Не удалось получить данные пользователя");
    return res.json();
}

async function updateUserProfile(userId, profileData) {
    const res = await fetch(`${API_URL}/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
    });
    if (!res.ok) throw new Error("Не удалось обновить профиль");
    return res.json();
}

// ---------------- Баланс / Аштеты ----------------
async function getUserBalance(userId) {
    const res = await fetch(`${API_URL}/balance/${userId}`);
    if (!res.ok) throw new Error("Не удалось получить баланс");
    return res.json();
}

async function addBalance(userId, amount) {
    const res = await fetch(`${API_URL}/balance/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
    });
    if (!res.ok) throw new Error("Не удалось добавить очки");
    return res.json();
}

// ---------------- Маркеры / Магазин ----------------
async function getMarkers() {
    const res = await fetch(`${API_URL}/markers`);
    if (!res.ok) throw new Error("Не удалось получить маркеры");
    return res.json();
}

async function buyMarker(userId, markerId) {
    const res = await fetch(`${API_URL}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, markerId })
    });
    if (!res.ok) throw new Error("Не удалось купить маркер");
    return res.json();
}

// ---------------- Корзина ----------------
async function getCart(userId) {
    const res = await fetch(`${API_URL}/cart/${userId}`);
    if (!res.ok) throw new Error("Не удалось получить корзину");
    return res.json();
}

async function addToCart(userId, itemId, quantity = 1) {
    const res = await fetch(`${API_URL}/cart/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity })
    });
    if (!res.ok) throw new Error("Не удалось добавить в корзину");
    return res.json();
}

async function checkoutCart(userId) {
    const res = await fetch(`${API_URL}/cart/${userId}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error("Не удалось оформить заказ");
    return res.json();
}

// ---------------- Достижения ----------------
async function getAchievements(userId) {
    const res = await fetch(`${API_URL}/achievements/${userId}`);
    if (!res.ok) throw new Error("Не удалось получить достижения");
    return res.json();
}

async function updateAchievement(userId, slotIndex, achievementId) {
    const res = await fetch(`${API_URL}/achievements/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotIndex, achievementId })
    });
    if (!res.ok) throw new Error("Не удалось обновить достижение");
    return res.json();
}

// ---------------- Аватар ----------------
async function uploadAvatar(userId, file) {
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await fetch(`${API_URL}/user/${userId}/avatar`, {
        method: "POST",
        body: formData
    });
    if (!res.ok) throw new Error("Не удалось загрузить аватар");
    return res.json();
}

// ---------------- ИИ Палитра ----------------
async function processAIImage(userId, file, brand = "All", inventoryOnly = false) {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("brand", brand);
    formData.append("inventoryOnly", inventoryOnly);
    
    const res = await fetch(`${API_URL}/ai/process/${userId}`, {
        method: "POST",
        body: formData
    });
    if (!res.ok) throw new Error("Ошибка обработки изображения ИИ");
    return res.json();
}

async function trainAIColor(userId, brand, set, markerNumber, file) {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("brand", brand);
    formData.append("set", set);
    formData.append("markerNumber", markerNumber);
    
    const res = await fetch(`${API_URL}/ai/train/${userId}`, {
        method: "POST",
        body: formData
    });
    if (!res.ok) throw new Error("Ошибка обучения ИИ");
    return res.json();
}

// ---------------- Общая функция fetch ----------------
async function fetchJSON(url, options = {}) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Ошибка запроса: ${res.status}`);
    return res.json();
}
