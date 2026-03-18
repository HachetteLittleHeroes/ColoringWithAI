/**
 * api.js — Логика данных и запросов
 */

const CONFIG = {
    // URL вашей Google Таблицы (экспорт в CSV)
    MARKERS_CSV: 'https://docs.google.com/spreadsheets/d/1Yrsif-aQwbuT6fLPnP4MsM22UuwuUWz5FYegELPxzFU/gviz/tq?tqx=out:csv',
    // Базовый URL сервера на Amvera
    SERVER_URL: 'https://hlhbot-hachettelittleheroes.amvera.io',
    // Цвета наличия согласно ТЗ
    STOCK_COLORS: {
        MANY: '#4cd964',   // Зеленый (2-3 шт)
        LOW: '#ff9500',    // Темно-оранжевый (1 шт)
        EMPTY: '#ff3b30'   // Красный (0 шт)
    }
};

const Api = {
    /**
     * Загрузка маркеров из Google Таблиц
     */
    async fetchMarkers() {
        try {
            const response = await fetch(`${CONFIG.MARKERS_CSV}&cache=${Date.now()}`);
            const csvText = await response.text();
            
            // Парсинг CSV (учитываем кавычки и запятые)
            const rows = csvText.split('\n').map(row => 
                row.split(',').map(cell => cell.replace(/"/g, '').trim())
            );

            let markers = [];
            rows.forEach(row => {
                // Логика поиска номера маркера и его остатка в строке
                for (let i = 0; i < row.length; i++) {
                    let num = row[i];
                    if (num && !isNaN(num) && parseInt(num) > 10) {
                        let stock = parseInt(row[i+1] || "0");
                        markers.push({
                            id: num,
                            number: num,
                            stock: isNaN(stock) ? 0 : stock,
                            price: 75,
                            brand: 'GUANGNA'
                        });
                        i++; 
                    }
                }
            });
            // Убираем дубликаты
            return markers.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        } catch (error) {
            console.error("Ошибка загрузки маркеров:", error);
            return [];
        }
    },

    /**
     * Работа с данными пользователя (Amvera + LocalStorage для мгновенного отклика)
     */
    async getUser(userId) {
        try {
            const res = await fetch(`${CONFIG.SERVER_URL}/get_user?id=${userId}`);
            const data = await res.json();
            
            // Синхронизируем локальные данные с серверными
            if (data.username) localStorage.setItem('user_name', data.username);
            if (data.avatar) localStorage.setItem('user_avatar', data.avatar);
            
            return {
                id: userId,
                name: data.username || localStorage.getItem('user_name') || "Без имени",
                balance: data.balance || 0,
                avatar: data.avatar || localStorage.getItem('user_avatar') || 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/avatars/av2.png',
                status: data.status || "Новичок",
                achievements: data.achievements || []
            };
        } catch (e) {
            // Если сервер недоступен, берем из локалки
            return {
                id: userId,
                name: localStorage.getItem('user_name') || "Без имени",
                balance: 0,
                avatar: localStorage.getItem('user_avatar') || 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/avatars/av2.png',
                status: "Новичок",
                achievements: []
            };
        }
    },

    async updateProfile(userId, field, value) {
        // Сохраняем в локалку сразу (чтобы не ждать ответа сервера)
        if (field === 'username') localStorage.setItem('user_name', value);
        if (field === 'avatar') localStorage.setItem('user_avatar', value);

        try {
            await fetch(`${CONFIG.SERVER_URL}/update_user`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    user_id: userId, 
                    [field === 'username' ? 'username' : 'avatar']: value 
                })
            });
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * Логика корзины (локальная)
     */
    getCart() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    },

    saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        // Обновляем бейдж в UI (через событие или прямой вызов в app.js)
        if (window.updateCartBadge) window.updateCartBadge(cart.length);
    },

    /**
     * Данные заданий и прогрессии
     */
    getTaskData() {
        return [
            {
                id: 'markers_progression',
                title: 'Мастер маркеров',
                levels: [
                    { lv: 1, target: 5, text: "Раскрасить 5 картинок", reward: 50, glow: 'level-1' },
                    { lv: 2, target: 10, text: "Раскрасить 10 картинок", reward: 100, glow: 'level-2' },
                    { lv: 3, target: 20, text: "Раскрасить 20 картинок", reward: 200, glow: 'level-3' },
                    { lv: 4, target: 35, text: "Раскрасить 35 картинок", reward: 500, glow: 'level-4' },
                    { lv: 5, target: 55, text: "Раскрасить 55 картинок", reward: 1000, glow: 'level-5', status: 'Легенда красок' }
                ]
            }
        ];
    },

    /**
     * ИИ Палитра (заглушка для серверной логики)
     */
    async analyzeColor(imageFile) {
        // Здесь будет FormData запрос к вашему ИИ на сервере
        const formData = new FormData();
        formData.append('file', imageFile);
        
        try {
            const res = await fetch(`${CONFIG.SERVER_URL}/analyze`, {
                method: 'POST',
                body: formData
            });
            return await res.json();
        } catch (e) {
            return { error: "Ошибка связи с ИИ" };
        }
    }
};

// Экспортируем объект для использования в других файлах
window.api = Api;
