const CONFIG = {
    MARKERS_CSV: 'https://docs.google.com/spreadsheets/d/1Yrsif-aQwbuT6fLPnP4MsM22UuwuUWz5FYegELPxzFU/gviz/tq?tqx=out:csv',
    SERVER_URL: 'https://hlhbot-hachettelittleheroes.amvera.io',
    GITHUB_BASE: 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/'
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
                        // Очищаем строку от всего, кроме цифр, чтобы избежать NaN
                        let stockStr = row[i+1] || "0";
                        let stock = parseInt(stockStr.replace(/[^0-9]/g, ''));
                        
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
            return {
                id: userId,
                name: localStorage.getItem('user_name') || "Без имени",
                balance: 0,
                avatar: localStorage.getItem('user_avatar') || `${CONFIG.GITHUB_BASE}avatars/av2.png`,
                status: localStorage.getItem('user_status') || "Новичок",
                unlockedStatuses: JSON.parse(localStorage.getItem('unlocked_statuses')) || ["Новичок"],
                unlockedAchievements: JSON.parse(localStorage.getItem('unlocked_achievements')) || [],
                showcase: JSON.parse(localStorage.getItem('showcase_slots')) || [null, null, null],
                taskProgress: JSON.parse(localStorage.getItem('task_progress')) || {
                    'status_progression': { currentLevel: 1, currentScore: 0 },
                    'master_colorist': { currentLevel: 1, currentScore: 0 }
                }
            };
        } catch (e) {
            return null;
        }
    },

    saveUserState(user) {
        localStorage.setItem('user_status', user.status);
        localStorage.setItem('unlocked_statuses', JSON.stringify(user.unlockedStatuses));
        localStorage.setItem('unlocked_achievements', JSON.stringify(user.unlockedAchievements));
        localStorage.setItem('showcase_slots', JSON.stringify(user.showcase));
        localStorage.setItem('task_progress', JSON.stringify(user.taskProgress));
    },

    getCart() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    },

    saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        if (window.updateCartBadge) window.updateCartBadge();
    },

    getTaskData() {
        return [
            {
                id: 'status_progression',
                title: 'Путь художника',
                statusReward: 'Мастер', // Выдается после 5 уровня
                achReward: 'ach1',      // Достижение после 5 уровня
                levels: [
                    { lv: 1, target: 5, text: "Раскрасить 5 картинок", reward: 50 },
                    { lv: 2, target: 10, text: "Раскрасить 10 картинок", reward: 100 },
                    { lv: 3, target: 20, text: "Раскрасить 20 картинок", reward: 200 },
                    { lv: 4, target: 35, text: "Раскрасить 35 картинок", reward: 350 },
                    { lv: 5, target: 50, text: "Раскрасить 50 картинок", reward: 500 }
                ]
            },
            {
                id: 'master_colorist',
                title: 'Мастер штриховки',
                statusReward: 'Легенда',
                achReward: 'ach2',
                levels: [
                    { lv: 1, target: 3, text: "Применить 3 разных цвета на 1 фото", reward: 10 },
                    { lv: 2, target: 5, text: "Использовать ИИ Палитру 5 раз", reward: 20 },
                    { lv: 3, target: 1, text: "Написать 1 отзыв", reward: 30 },
                    { lv: 4, target: 1, text: "Поделиться с другом", reward: 50 },
                    { lv: 5, target: 1, text: "Сделать заказ с маркерами", reward: 100 }
                ]
            }
        ];
    }
};

window.api = Api;
window.CONFIG = CONFIG;
