// ==========================================
// api.js — работа с внешними данными
// ==========================================

const MARKERS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1Yrsif-aQwbuT6fLPnP4MsM22UuwuUWz5FYegELPxzFU/gviz/tq?tqx=out:csv&cache=';
const AMVERA_URL = 'https://hlhbot-hachettelittleheroes.amvera.io'; // Ваш бэкенд

// ---------------- МАРКЕРЫ (Google Таблица) ----------------
async function fetchMarkersFromSheet() {
    try {
        const response = await fetch(`${MARKERS_CSV_URL}${new Date().getTime()}`);
        const csvText = await response.text();
        
        const rows = csvText.split('\n').map(row => 
            row.split(',').map(cell => cell.replace(/"/g, '').trim())
        );

        let parsedMarkers = [];
        rows.forEach(row => {
            for (let i = 0; i < row.length; i++) {
                let num = row[i];
                if (num && !isNaN(num) && parseInt(num) > 10) {
                    let stock = parseInt(row[i+1] || row[i+2] || "0");
                    parsedMarkers.push({
                        number: num,
                        stock: isNaN(stock) ? 0 : stock,
                        price: 75 
                    });
                    i++; 
                }
            }
        });
        return parsedMarkers.filter((v, i, a) => a.findIndex(t => t.number === v.number) === i);
    } catch (error) {
        console.error("Ошибка загрузки маркеров:", error);
        return [];
    }
}

// ---------------- ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ (Amvera) ----------------
async function getUserData(userId) {
    try {
        const response = await fetch(`${AMVERA_URL}/get_user?id=${userId}`);
        if (!response.ok) throw new Error('Ошибка сети при запросе к Amvera');
        return await response.json();
    } catch (error) {
        console.error("Ошибка при получении профиля с Amvera:", error);
        // Фоллбек, чтобы интерфейс не ломался, если бэкенд не отвечает
        return {
            id: userId,
            name: localStorage.getItem('user_nickname') || "Пользователь",
            balance: 0, 
            avatar: localStorage.getItem('user_avatar') || 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/avatars/av2.png'
        };
    }
}

async function updateUserProfile(userId, data) {
    try {
        const response = await fetch(`${AMVERA_URL}/update_user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                username: data.name,
            }),
        });

        const result = await response.json();
        if (result.success) {
            console.log("Данные успешно сохранены на сервере Amvera");
            if (data.name) localStorage.setItem('user_nickname', data.name);
            return { success: true };
        } else {
            throw new Error(result.error || 'Сервер вернул ошибку');
        }
    } catch (error) {
        console.error("Не удалось сохранить данные на Amvera:", error);
        // Временное сохранение локально при ошибке сервера
        if (data.name) localStorage.setItem('user_nickname', data.name);
        return { success: false, error: error.message };
    }
}

// ---------------- КОРЗИНА И ЗАКАЗЫ ----------------
async function getCart(userId) {
    // Пока храним локально для теста
    const savedCart = localStorage.getItem(`cart_${userId}`);
    return { items: savedCart ? JSON.parse(savedCart) : [] };
}

async function checkoutCart(userId) {
    console.log(`Оформление заказа для ${userId}`);
    localStorage.removeItem(`cart_${userId}`);
    return { success: true };
}

// ---------------- ДОСТИЖЕНИЯ ----------------
async function getAchievements(userId) {
    return [
        { id: 1, title: "Первый шаг", icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png" },
        { id: 2, title: "Коллекционер", icon: "https://cdn-icons-png.flaticon.com/512/3135/3135783.png" }
    ];
}

async function updateAchievement(userId, slot, achievementId) {
    console.log(`Слот ${slot} обновлен на достижение ${achievementId}`);
    return { success: true };
}

// ---------------- ИИ ПАЛИТРА ----------------
async function processAIImage(userId, file, brand, inventoryOnly) {
    console.log(`Обработка ИИ: ${brand}, только мой инвентарь: ${inventoryOnly}`);
    // Имитация задержки сервера
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
        recommendedMarker: Math.floor(Math.random() * 300) + 10,
        confidence: 0.95
    };
}

// ---------------- ГЛОБАЛЬНЫЙ ЭКСПОРТ ----------------
window.fetchMarkersFromSheet = fetchMarkersFromSheet;
window.getUserData = getUserData;
window.updateUserProfile = updateUserProfile;
window.getCart = getCart;
window.checkoutCart = checkoutCart;
window.getAchievements = getAchievements;
window.updateAchievement = updateAchievement;
window.processAIImage = processAIImage;
