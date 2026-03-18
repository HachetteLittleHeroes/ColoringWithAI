/**
 * api.js — Логика данных и запросов
 */

const CONFIG = {
    MARKERS_CSV: 'https://docs.google.com/spreadsheets/d/1Yrsif-aQwbuT6fLPnP4MsM22UuwuUWz5FYegELPxzFU/gviz/tq?tqx=out:csv',
    SERVER_URL: 'https://hlhbot-hachettelittleheroes.amvera.io',
    STOCK_COLORS: {
        MANY: '#34c759',   
        LOW: '#ff9500',    
        EMPTY: '#ff3b30'   
    }
};

const Api = {
    async fetchMarkers() {
        try {
            const response = await fetch(`${CONFIG.MARKERS_CSV}&cache=${Date.now()}`);
            const csvText = await response.text();
            
            const rows = csvText.split('\n').map(row => 
                row.split(',').map(cell => cell.replace(/"/g, '').trim())
            );

            let markers = [];
            rows.forEach(row => {
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
            return markers.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        } catch (error) {
            console.error("Ошибка загрузки маркеров:", error);
            return [];
        }
    },

    async getUser(userId) {
        try {
            const res = await fetch(`${CONFIG.SERVER_URL}/get_user?id=${userId}`);
            const data = await res.json();
            
            if (data.username) localStorage.setItem('user_name', data.username);
            if (data.avatar) localStorage.setItem('user_avatar', data.avatar);
            
            return {
                id: userId,
                name: data.username || localStorage.getItem('user_name') || "Без имени",
                balance: data.balance || 0,
                avatar: data.avatar || localStorage.getItem('user_avatar') || 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av2.png',
                status: data.status || "Без статуса", // Изменено по умолчанию
                achievements: data.achievements || []
            };
        } catch (e) {
            return {
                id: userId,
                name: localStorage.getItem('user_name') || "Без имени",
                balance: 0,
                avatar: localStorage.getItem('user_avatar') || 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av2.png',
                status: "Без статуса", // Изменено по умолчанию
                achievements: []
            };
        }
    },

    async updateProfile(userId, field, value) {
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

    getCart() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    },

    saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        if (window.updateCartBadge) window.updateCartBadge();
    }
};

window.api = Api;
