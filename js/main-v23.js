// ========================================== 
// УНИВЕРСАЛЬНЫЙ  ИНДИКАТОР  ЗАГРУЗКИ  
// ==========================================
function showLoadingOverlay(containerId, message = 'Отправка фото...') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div style="text-align:center;padding:40px;">
                <i class="fas fa-spinner fa-spin" style="font-size:48px;color:var(--accent);"></i>
                <p style="margin-top:20px;color:var(--text);font-size:16px;">${message}</p>
                <p style="margin-top:10px;color:var(--text-gray);font-size:13px;">Пожалуйста, подождите</p>
            </div>
        `;
    }
}

function showUploadSuccess(message = '✅ Фото отправлено на проверку!') {
    if (window.Telegram?.WebApp) {
        tg.showAlert(message);
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    } else {
        alert(message);
    }
}

function showUploadError(message = '❌ Ошибка отправки') {
    if (window.Telegram?.WebApp) {
        tg.showAlert(message);
    } else {
        alert(message);
    }
}
    let currentDifficultyFilter = 'all';
       
        // ==========================================
        // КОНФИГУРАЦИЯ И ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
        // ==========================================
        
       const SERVER_URL = 'https://hlhbot-hachettelittleheroes.amvera.io';
        const MARKER_PRICE = 75;
        let currentGiftBundle = null;
let currentGiftPrice = null;
let selectedGiftUser = null;
        // Хранилище
let userBoosts = { active: false, remainingWorks: 0 };
let userSkips = 0;
        // ==========================================
// СЛОЖНОСТЬ ЗАДАНИЙ (звёзды)
// ==========================================

const TASK_DIFFICULTY = {
    // ⭐ ЛЁГКИЕ (1 звезда)
    'mystery': 1,
    'queen': 1,
    'lion': 1,
    'sirena': 1,
    'trainer': 1,
    
    // ⭐⭐ СРЕДНИЕ (2 звезды)
    'bear': 2,
    'alcohol': 2,
    
    // ⭐⭐⭐ СЛОЖНЫЕ (3 звезды)
    'anaconda': 3,
    'fauna': 3,
    'sea': 3,
    'dragons': 3,
    'krasavica': 3,
    'rapuncelprincessa': 3,
    'agraba': 3,
    'lubitelfentesi': 3,
    
    // ⭐⭐⭐⭐ ЭКСТРА-СЛОЖНЫЕ (4 звезды)
    'shock': 4,
    'pempudu': 4
};
        
        // Telegram WebApp
        const tg = window.Telegram?.WebApp || {
            showAlert: (msg) => alert(msg),
            showConfirm: (msg, callback) => callback(confirm(msg)),
            initDataUnsafe: { user: { id: 496779756, first_name: 'Без имени' } },
            HapticFeedback: { notificationOccurred: () => {} }
        };
        
        if (window.Telegram?.WebApp) {
            tg.expand();
            tg.ready();
        }
        
        // ==========================================
        // ПОЛУЧЕНИЕ ID ПОЛЬЗОВАТЕЛЯ (из URL или Telegram)
        // ==========================================
        
        let userId = 496779756;
        let userName = 'Без имени';
        
        const urlParams = new URLSearchParams(window.location.search);
        const urlUserId = urlParams.get('id');
        
        if (urlUserId) {
            userId = parseInt(urlUserId);
            console.log('✅ User ID from URL:', userId);
        } else if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
            userId = window.Telegram.WebApp.initDataUnsafe.user.id;
            console.log('✅ User ID from Telegram:', userId);
        } else {
            userId = 496779756;
            console.warn('⚠️ No user ID found, using default');
        }
        
        if (window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name) {
            userName = window.Telegram.WebApp.initDataUnsafe.user.first_name;
        } else if (urlParams.get('name')) {
            userName = urlParams.get('name');
        }
        
        const ADMIN_ID = 496779756;
        
        console.log('Final User ID:', userId);
        console.log('Final User Name:', userName);
        
        // Глобальные переменные для отправки фото
        var currentBossTaskIndex = 0;
        let currentUploadBranch = null;
        let currentUploadLevel = null;
        let currentSubtaskData = null;
        let tempPhotos = [];
        let isUploading = false;
        
        // Глобальные данные
        let user = {
            id: userId,
            name: userName,
            balance: 0,
            avatar: 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av2.png',
            status: 'Без статуса',
            unlockedStatuses: ['Без статуса'],
            achievements: [],
            showcase: [null, null, null],
            theme: localStorage.getItem('app_theme') || 'light'
        };
        let myFriends = [];
        let userCompletedPages = {};
        let cart = {};
        let inventory = { organizers: [], userMarkers: {} };
        let markersDB = [];
        let markersLoading = false;
        let userProgress = {};
        let claimedSeasonRewards = {
    free: [],
    premium: []
};
        
        // Переменные для томов
        let currentVolumeId = null;
        let currentPageIndex = 0;
        let currentVolumePages = 0;
        let touchStartX = 0;
        let touchEndX = 0;
        
        // ==========================================
        // API ВЫЗОВЫ
        // ==========================================
        
        async function fetchAPI(endpoint, data = null) {
            const options = {
                method: data ? 'POST' : 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'omit'
            };
            if (data) {
                options.body = JSON.stringify(data);
            }
            try {
                const response = await fetch(`${SERVER_URL}${endpoint}`, options);
                return await response.json();
            } catch (error) {
                console.error(`API Error ${endpoint}:`, error);
                return null;
            }
        }
        
        async function loadUserBalance() {
            try {
                const response = await fetch(`${SERVER_URL}/api/balance?user_id=${userId}`);
                const data = await response.json();
                if (data && typeof data.balance !== 'undefined') {
                    user.balance = data.balance;
                }
                return user.balance;
            } catch (error) {
                console.error('Ошибка загрузки баланса:', error);
                return 0;
            }
        }
        
      async function loadUserProgress() {
    try {
        const savedProgress = localStorage.getItem(`coloring_progress_${userId}`);
        if (savedProgress) {
            userProgress = JSON.parse(savedProgress);
        }
        
        const response = await fetch(`${SERVER_URL}/api/stats?user_id=${userId}`);
        const stats = await response.json();
        console.log('📊 Loaded stats from server:', stats);
        
        if (stats) {
            // Объединяем данные с сервера с локальными
            userProgress = { ...userProgress, ...stats };
            
            // ✅ Миграция старых ключей → branch_pempudu_level_
            for (const [key, value] of Object.entries(stats)) {
                if (typeof value !== 'number') continue;
                
                // friend_level_X_subtask_Y → branch_pempudu_level_X_subtask_Y
                if (key.startsWith('friend_level_')) {
                    const suffix = key.replace('friend_level_', '');
                    const newKey = `branch_pempudu_level_${suffix}`;
                    if (!userProgress[newKey] || userProgress[newKey] < value) {
                        userProgress[newKey] = value;
                    }
                }
                
                // status_level_X_subtask_Y → branch_pempudu_level_X_subtask_Y
                if (key.startsWith('status_level_')) {
                    const suffix = key.replace('status_level_', '');
                    const newKey = `branch_pempudu_level_${suffix}`;
                    if (!userProgress[newKey] || userProgress[newKey] < value) {
                        userProgress[newKey] = value;
                    }
                }
            }
            
            // Особенно важно для Season Pass — проверяем подзадания
            for (let level = 0; level < 5; level++) {
                for (let subtask = 0; subtask < 3; subtask++) {
                    const serverKey = `branch_season_pass_level_${level}_subtask_${subtask}`;
                    if (stats[serverKey] !== undefined) {
                        userProgress[serverKey] = stats[serverKey];
                        console.log(`📥 Загружено подзадание ${level+1}.${subtask+1}: ${stats[serverKey]}`);
                    }
                }
            }
            
            localStorage.setItem(`coloring_progress_${userId}`, JSON.stringify(userProgress));
        }
        return userProgress;
    } catch (error) {
        console.error('Ошибка загрузки прогресса:', error);
        return {};
    }
}
        
        async function loadUnlockedStatuses() {
            try {
                console.log('Loading unlocked statuses for user:', userId);
                const response = await fetch(`${SERVER_URL}/api/unlocked_statuses?user_id=${userId}`);
                const statuses = await response.json();
                console.log('Loaded statuses:', statuses);
                if (statuses && Array.isArray(statuses)) {
                    user.unlockedStatuses = statuses;
                    if (!user.unlockedStatuses.includes('Без статуса')) {
                        user.unlockedStatuses.unshift('Без статуса');
                    }
                }
                return user.unlockedStatuses;
            } catch (error) {
                console.error('Ошибка загрузки статусов:', error);
                if (!user.unlockedStatuses || user.unlockedStatuses.length === 0) {
                    user.unlockedStatuses = ['Без статуса'];
                }
                return user.unlockedStatuses;
            }
        }
        
        async function loadUserAchievements() {
            try {
                const response = await fetch(`${SERVER_URL}/api/achievements?user_id=${userId}`);
                const achievements = await response.json();
                if (achievements && Array.isArray(achievements)) {
                    user.achievements = achievements;
                }
                return user.achievements;
            } catch (error) {
                console.error('Ошибка загрузки достижений:', error);
                return [];
            }
        }
        // ==========================================
        // ФУНКЦИИ ДЛЯ РАБОТЫ С ПОДПУНКТАМИ ЗАДАНИЙ
        // ==========================================
        
      function getSubtaskProgress(branchKey, levelIndex, subtaskIndex) {
    const progress = userProgress || {};
    
    // Обычный ключ
    const subtaskKey = `branch_${branchKey}_level_${levelIndex}_subtask_${subtaskIndex}`;
    if (progress[subtaskKey] !== undefined) {
        return progress[subtaskKey] || 0;
    }
    
    // Для pempudu — проверяем friend_progress
    if (branchKey === 'pempudu' && progress.friend_progress) {
        const friendKey = `friend_level_${levelIndex}_subtask_${subtaskIndex}`;
        if (progress.friend_progress[friendKey] !== undefined) {
            return progress.friend_progress[friendKey] || 0;
        }
    }
    
    // Для Season Pass — логируем
    if (branchKey === 'season_pass') {
        console.log(`[getSubtaskProgress] Уровень ${levelIndex + 1}, подзадание ${subtaskIndex + 1}: ${progress[subtaskKey] || 0}`);
    }
    
    return progress[subtaskKey] || 0;
}
        
        function updateSubtaskProgress(branchKey, levelIndex, subtaskIndex, increment = 1) {
            const progress = userProgress || {};
            const subtaskKey = `branch_${branchKey}_level_${levelIndex}_subtask_${subtaskIndex}`;
            const current = progress[subtaskKey] || 0;
            const level = TASK_BRANCHES[branchKey]?.levels[levelIndex];
            const subtask = level?.subtasks[subtaskIndex];
            
            if (!subtask) return false;
            
            const newValue = Math.min(current + increment, subtask.required);
            progress[subtaskKey] = newValue;
            
            localStorage.setItem(`coloring_progress_${userId}`, JSON.stringify(progress));
            userProgress = progress;
            
            return true;
        }
        
        function getLevelProgress(branchKey, levelIndex) {
            const progress = userProgress || {};
            const level = TASK_BRANCHES[branchKey]?.levels[levelIndex];
            
            if (level && level.subtasks) {
                let totalCompleted = 0;
                let totalRequired = 0;
                
                level.subtasks.forEach((subtask, subtaskIndex) => {
                    const completed = getSubtaskProgress(branchKey, levelIndex, subtaskIndex);
                    totalCompleted += Math.min(completed, subtask.required);
                    totalRequired += subtask.required;
                });
                
                return totalCompleted;
            }
            
            const progressKey = `branch_${branchKey}_level_${levelIndex}`;
            return progress[progressKey] || 0;
        }
        
      function isLevelCompleted(branchKey, levelIndex) {
    const level = TASK_BRANCHES[branchKey]?.levels[levelIndex];
    if (!level) return false;
    
    // Для Pempudu — проверяем подзадания через friend_progress
    if (branchKey === 'pempudu') {
        if (level.subtasks && level.subtasks.length > 0) {
            let totalCompleted = 0;
            let totalRequired = 0;
            level.subtasks.forEach((subtask, subtaskIndex) => {
                const completed = getSubtaskProgress(branchKey, levelIndex, subtaskIndex);
                totalCompleted += Math.min(completed, subtask.required);
                totalRequired += subtask.required;
            });
            return totalCompleted >= totalRequired;
        }
        return false;
    }
    
    // Для Season Pass всегда проверяем подзадания
    if (branchKey === 'season_pass') {
        if (level.subtasks && level.subtasks.length > 0) {
            let totalCompleted = 0;
            let totalRequired = 0;
            
            level.subtasks.forEach((subtask, subtaskIndex) => {
                const completed = getSubtaskProgress(branchKey, levelIndex, subtaskIndex);
                totalCompleted += Math.min(completed, subtask.required);
                totalRequired += subtask.required;
            });
            
            const isCompleted = totalCompleted >= totalRequired;
            console.log(`[isLevelCompleted] Season Pass Уровень ${levelIndex + 1}: completed=${totalCompleted}, required=${totalRequired}, result=${isCompleted}`);
            return isCompleted;
        }
        return false;
    }
    
    // Для обычных веток
    if (level.subtasks && level.subtasks.length > 0) {
        let totalCompleted = 0;
        let totalRequired = 0;
        
        level.subtasks.forEach((subtask, subtaskIndex) => {
            const completed = getSubtaskProgress(branchKey, levelIndex, subtaskIndex);
            totalCompleted += Math.min(completed, subtask.required);
            totalRequired += subtask.required;
        });
        
        return totalCompleted >= totalRequired;
    }
    
    const currentProgress = getLevelProgress(branchKey, levelIndex);
    return currentProgress >= level.maxProgress;
}
        
       function getCurrentLevelIndex(branchKey) {
    if (branchKey === 'scrooge') {
        return user.balance >= 2500 ? 1 : 0;
    }
    if (branchKey === 'benefactor') {
        return user.unlockedStatuses.includes('Благодетель') ? 1 : 0;
    }
    
    const levels = TASK_BRANCHES[branchKey].levels;
    
    // Для Season Pass особая логика
    if (branchKey === 'season_pass') {
        // Ищем первый незавершенный уровень
        for (let i = 0; i < levels.length; i++) {
            if (!isLevelCompleted(branchKey, i)) {
                console.log(`[getCurrentLevelIndex] Season Pass - первый незавершенный уровень: ${i + 1}`);
                return i;
            }
        }
        // Если все уровни завершены
        console.log(`[getCurrentLevelIndex] Season Pass - все уровни завершены`);
        return levels.length;
    }
    
    // Для обычных веток
    for (let i = 0; i < levels.length; i++) {
        if (!isLevelCompleted(branchKey, i)) {
            return i;
        }
    }
    return levels.length;
}
        
        function isBranchCompleted(branchKey) {
            if (branchKey === 'scrooge') {
                return user.balance >= 2500;
            }
            if (branchKey === 'benefactor') {
                return user.unlockedStatuses.includes('Благодетель');
            }
            const levels = TASK_BRANCHES[branchKey].levels;
            for (let i = 0; i < levels.length; i++) {
                if (!isLevelCompleted(branchKey, i)) {
                    return false;
                }
            }
            return true;
        }
        
        // ==========================================
        // ПРОВЕРКА БАЛАНСА ДЛЯ СТАТУСА СКРУДЖ
        // ==========================================
        
        async function checkBalanceStatus() {
            console.log('💰 Checking balance for Scrooge status...');
            console.log('Current balance:', user.balance);
            console.log('Has Scrooge status:', user.unlockedStatuses.includes('Скрудж'));
            
            if (!user.unlockedStatuses.includes('Скрудж') && user.balance >= 2500) {
                console.log('🎉 Unlocking Scrooge status!');
                user.unlockedStatuses.push('Скрудж');
                if (!user.achievements.includes('scrooge')) {
                    user.achievements.push('scrooge');
                }
                saveUserData();
                try {
                    await fetchAPI('/api/sync_status', {
                        user_id: userId,
                        status: 'Скрудж',
                        action: 'unlock'
                    });
                } catch(e) {
                    console.error('Failed to sync with server:', e);
                }
                if (tg && tg.HapticFeedback) {
                    tg.HapticFeedback.notificationOccurred('success');
                }
                updateUI();
                renderBranchTasks();
                return true;
            }
            return false;
        }
        
        // ==========================================
        // ПРОВЕРКА РАЗБЛОКИРОВКИ СТАТУСОВ
        // ==========================================
        
     async function checkAndUnlockStatuses() {
    try {
        console.log('Checking status unlocks...');
        let statusUnlocked = false;
        
        for (const [branchKey, rewardStatus] of Object.entries(BRANCH_REWARDS)) {
            if (branchKey === 'scrooge' || branchKey === 'benefactor') continue;
            
            // ✅ Проверяем что ветка существует в TASK_BRANCHES
            if (!TASK_BRANCHES[branchKey]) {
                console.log(`⚠️ Ветка ${branchKey} не найдена в TASK_BRANCHES`);
                continue;
            }
            
            const isCompleted = isBranchCompleted(branchKey);
            const isUnlocked = user.unlockedStatuses.includes(rewardStatus);
            
            if (isCompleted && !isUnlocked) {
                console.log(`🎉 New status unlocked: ${rewardStatus}`);
                user.unlockedStatuses.push(rewardStatus);
                if (!user.achievements.includes(branchKey)) {
                    user.achievements.push(branchKey);
                }
                statusUnlocked = true;
            }
        }
        
        if (statusUnlocked) {
            saveUserData();
            updateUI();
            renderBranchTasks();
        }
    } catch (error) {
        console.error('Error checking status unlocks:', error);
    }
}
        // ==========================================
        // ОТПРАВКА ФОТО НА ПРОВЕРКУ (ОБЫЧНЫЕ ЗАДАНИЯ)
        // ==========================================
        
function openTaskUpload(branchKey, levelIndex) {
    console.log('📸 openTaskUpload called:', branchKey, levelIndex);
    
    currentSubtaskData = null;
    currentUploadBranch = branchKey;
    currentUploadLevel = levelIndex;
    currentCommunitySubtask = null;
    currentFriendTaskIdx = null;
    currentFriendLevelIdx = null;
    currentFriendSubtaskIdx = null;
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.style.position = 'absolute';
    fileInput.style.opacity = '0';
    fileInput.style.pointerEvents = 'none';
    document.body.appendChild(fileInput);
    
    fileInput.onchange = function(event) {
        handleTaskFilesSelected(event);
        document.body.removeChild(fileInput);
    };
    
    // ✅ Показываем модалку ДО выбора файла
    const modal = document.getElementById('taskUploadModal');
    if (modal) {
        modal.style.display = 'flex';
        const previewContainer = document.getElementById('taskPhotoPreviewContainer');
        if (previewContainer) {
            previewContainer.innerHTML = `
                <div style="text-align:center;padding:20px;width:100%;">
                    <i class="fas fa-cloud-upload-alt" style="font-size:40px;color:var(--text-gray);margin-bottom:10px;"></i>
                    <p style="color:var(--text);font-size:14px;">Выберите фото для отправки</p>
                    <p style="color:var(--text-gray);font-size:12px;">Поддерживается множественный выбор</p>
                </div>
            `;
        }
    }
    
    fileInput.click();
}
        
    function handleTaskFilesSelected(event) {
    const files = Array.from(event.target.files);
    console.log('📁 Выбрано файлов:', files.length);
    
    if (files.length === 0) return;
    
    const maxSize = 10 * 1024 * 1024;
    const oversizedFiles = files.filter(f => f.size > maxSize);
    
    if (oversizedFiles.length > 0) {
        if (tg) tg.showAlert(`❌ Файл(ы) слишком большие. Максимум 10MB на фото.`);
        return;
    }
    
    tempPhotos = files;
    
    const previewContainer = document.getElementById('taskPhotoPreviewContainer');
    if (previewContainer) {
        previewContainer.innerHTML = '';
        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.cssText = 'width: 70px; height: 70px; object-fit: cover; border-radius: 12px; margin: 5px; border: 2px solid var(--accent); cursor: pointer;';
                img.onclick = () => removePhoto(index);
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
        
        if (files.length > 1) {
            const clearBtn = document.createElement('button');
            clearBtn.innerHTML = '<i class="fas fa-trash"></i> Очистить все';
            clearBtn.style.cssText = 'width: 100%; margin-top: 10px; padding: 8px; background: var(--status-red); color: white; border: none; border-radius: 12px; cursor: pointer;';
            clearBtn.onclick = () => {
                tempPhotos = [];
                previewContainer.innerHTML = '';
                if (tg) tg.showAlert('Все фото удалены');
            };
            previewContainer.appendChild(clearBtn);
        }
    }
    
    const modal = document.getElementById('taskUploadModal');
    if (modal) {
        modal.style.display = 'flex';
        const titleEl = modal.querySelector('h3');
        if (titleEl) titleEl.innerText = 'Отправка на проверку';
        
        const submitBtn = modal.querySelector('.modal-action-btn');
        if (submitBtn) {
            const newBtn = submitBtn.cloneNode(true);
            submitBtn.parentNode.replaceChild(newBtn, submitBtn);
            newBtn.onclick = (e) => {
                e.preventDefault();
                submitTaskPhoto();
            };
        }
        console.log('✅ Модальное окно открыто, фото:', tempPhotos.length);
    }
}
        
        function removePhoto(index) {
            if (index >= 0 && index < tempPhotos.length) {
                tempPhotos.splice(index, 1);
                const previewContainer = document.getElementById('taskPhotoPreviewContainer');
                if (previewContainer) {
                    const files = tempPhotos;
                    previewContainer.innerHTML = '';
                    files.forEach((file, i) => {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            const img = document.createElement('img');
                            img.src = e.target.result;
                            img.style.cssText = 'width: 70px; height: 70px; object-fit: cover; border-radius: 12px; margin: 5px; border: 2px solid var(--accent); cursor: pointer;';
                            img.onclick = () => removePhoto(i);
                            previewContainer.appendChild(img);
                        };
                        reader.readAsDataURL(file);
                    });
                }
                if (tg) tg.showAlert(`Фото удалено. Осталось: ${tempPhotos.length}`);
            }
        }
        
      // ==========================================
// ОТПРАВКА ФОТО В ОБЫЧНЫЕ ЗАДАНИЯ (С СЖАТИЕМ)
// ==========================================

async function submitTaskPhoto(event) {
    if (event) event.preventDefault();
    
    console.log('=== SUBMIT TASK PHOTO ===');
    
    if (!tempPhotos || tempPhotos.length === 0) {
        showUploadError('❌ Выберите хотя бы одно фото');
        return;
    }
    
    if (isUploading) return;
    isUploading = true;
    
    // Блокируем кнопку
    const submitBtn = document.querySelector('#taskUploadModal .modal-action-btn');
    const originalText = submitBtn ? submitBtn.innerText : 'Отправить';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = '⏳ Отправка...';
        submitBtn.style.opacity = '0.7';
    }
    
    try {
        const compressedPhotos = await compressImages(tempPhotos, 1200, 0.7);
        
        const formData = new FormData();
        formData.append('user', userId.toString());
        
        if (currentSubtaskData) {
            formData.append('branchKey', currentSubtaskData.branchKey);
            formData.append('levelIndex', currentSubtaskData.levelIndex.toString());
            formData.append('subtaskIndex', currentSubtaskData.subtaskIndex.toString());
            formData.append('subtaskName', currentSubtaskData.subtaskName);
            formData.append('type', 'subtask');
        } else if (currentFriendTaskIdx !== null && currentFriendLevelIdx !== null && currentFriendSubtaskIdx !== null) {
            const task = FRIEND_TASKS[currentFriendTaskIdx];
            const level = task.levels[currentFriendLevelIdx];
            const subtask = level.subtasks[currentFriendSubtaskIdx];
            formData.append('taskId', task.id);
            formData.append('levelIdx', currentFriendLevelIdx.toString());
            formData.append('subtaskIdx', currentFriendSubtaskIdx.toString());
            formData.append('subtaskName', subtask.name);
            formData.append('type', 'friend_subtask');
        } else {
            formData.append('branchKey', currentUploadBranch);
            formData.append('levelIndex', currentUploadLevel.toString());
            formData.append('type', 'regular');
        }
        
        for (let i = 0; i < compressedPhotos.length; i++) {
            formData.append('photos', compressedPhotos[i]);
        }
        
        let endpoint;
        if (currentSubtaskData) endpoint = '/api/check_subtask';
        else if (currentFriendTaskIdx !== null) endpoint = '/api/check_friend_subtask';
        else endpoint = '/api/check_achievement';
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);
        
        const response = await fetch(`${SERVER_URL}${endpoint}`, {
            method: 'POST',
            body: formData,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
        
        const result = await response.json();
        
        if (result && result.status === 'ok') {
            showUploadSuccess('✅ Фото отправлено на проверку!');
            closeTaskUploadModal();
        } else {
            throw new Error(result?.message || 'Ошибка отправки');
        }
    } catch (error) {
        console.error('❌ Ошибка:', error);
        if (error.name === 'AbortError') {
            showUploadError('❌ Превышено время ожидания. Попробуйте отправить меньше фото.');
        } else {
            showUploadError(`❌ Ошибка: ${error.message}`);
        }
    } finally {
        isUploading = false;
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
            submitBtn.style.opacity = '1';
        }
    }
}
        
   function closeTaskUploadModal() {
    console.log('🔒 Закрытие модального окна');
    
    const modal = document.getElementById('taskUploadModal');
    const previewContainer = document.getElementById('taskPhotoPreviewContainer');
    
    if (modal) modal.style.display = 'none';
    if (previewContainer) previewContainer.innerHTML = '';
    
    // ✅ Сбрасываем ВСЕ глобальные переменные
    currentUploadBranch = null;
    currentUploadLevel = null;
    currentSubtaskData = null;
    currentFriendTaskIdx = null;
    currentFriendLevelIdx = null;
    currentFriendSubtaskIdx = null;
    currentCommunitySubtask = null;
    tempPhotos = [];
    isUploading = false;
    
    // ✅ Обновляем прогресс с сервера
    refreshUserProgress();
    loadFriendProgressFromServer();
    
    // ✅ Обновляем одобрения замка
    checkCastleApprovals();
}
        
        // ==========================================
        // ОТКРЫТИЕ ОТПРАВКИ ДЛЯ ПОДПУНКТА
        // ==========================================
        
        function openSubtaskUpload(branchKey, levelIndex, subtaskIndex, subtaskName) {
            console.log('📸 openSubtaskUpload called:', branchKey, levelIndex, subtaskIndex, subtaskName);
              // ✅ Сбрасываем глобальные переменные
    currentUploadBranch = null;
    currentUploadLevel = null;
            const branch = TASK_BRANCHES[branchKey];
            if (!branch) {
                console.error('Branch not found:', branchKey);
                if (tg) tg.showAlert('Ошибка: ветка задания не найдена');
                return;
            }
            
            const currentLevel = getCurrentLevelIndex(branchKey);
            if (currentLevel !== levelIndex) {
                console.warn('Wrong level! Current:', currentLevel, 'Attempted:', levelIndex);
                if (tg) tg.showAlert('Этот уровень уже пройден или заблокирован!');
                return;
            }
            
            const level = branch.levels[levelIndex];
            const subtask = level?.subtasks[subtaskIndex];
            
            if (!subtask) {
                console.error('Subtask not found');
                if (tg) tg.showAlert('Ошибка: подзадание не найдено');
                return;
            }
            
            const currentProgress = getSubtaskProgress(branchKey, levelIndex, subtaskIndex);
            
            if (currentProgress >= subtask.required) {
                if (tg) tg.showAlert(`✅ Подзадание "${subtaskName}" уже выполнено!`);
                return;
            }
            
            currentSubtaskData = {
                branchKey: branchKey,
                levelIndex: levelIndex,
                subtaskIndex: subtaskIndex,
                subtaskName: subtaskName,
                subtaskRequired: subtask.required,
                currentProgress: currentProgress
            };
            currentUploadBranch = null;
            currentUploadLevel = null;
            
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.multiple = true;
            fileInput.style.position = 'absolute';
            fileInput.style.opacity = '0';
            fileInput.style.pointerEvents = 'none';
            document.body.appendChild(fileInput);
            
            fileInput.onchange = function(event) {
                handleTaskFilesSelected(event);
                document.body.removeChild(fileInput);
            };
            
            fileInput.click();
        }
        // ==========================================
        // ОТОБРАЖЕНИЕ ЗАДАНИЙ (С ПОДПУНКТАМИ)
        // ==========================================
        
   // Категории статусов
const STATUS_CATEGORIES = {
    'princess': { name: '👑 Принцессы', keys: ['krasavica', 'sirena', 'rapuncelprincessa', 'agraba'] },
    'animals': { name: '🐾 Животные', keys: ['lion', 'fauna', 'bear', 'sea', 'anaconda', 'dragons'] },
    'villains': { name: '👿 Злодеи', keys: ['queen'] },
    'special': { name: '✨ Особые', keys: ['shock', 'pempudu', 'alcohol'] },
    'stories': { name: '📖 Истории', keys: ['trainer', 'mystery', 'lubitelfentesi'] }
};

let currentStatusFilter = 'all';
let currentCategoryFilter = 'all';

function getStatusCategory(branchKey) {
    for (const [catKey, cat] of Object.entries(STATUS_CATEGORIES)) {
        if (cat.keys.includes(branchKey)) return cat;
    }
    return null;
}

function renderStatusFilters() {
    let container = document.getElementById('statusFilters');
    if (!container) {
        container = document.createElement('div');
        container.id = 'statusFilters';
        const tasksContent = document.getElementById('tasksContent');
        if (tasksContent) {
            tasksContent.insertBefore(container, tasksContent.firstChild);
        }
    }
    
    // ✅ Устанавливаем минимальную высоту, чтобы дропдауны не обрезались
    const tasksContent = document.getElementById('tasksContent');
    if (tasksContent) {
        tasksContent.style.minHeight = '350px';
        tasksContent.style.overflow = 'visible';
    }
    
    container.innerHTML = `
        <div style="display: flex; gap: 8px; margin-bottom: 15px; overflow-x: auto; white-space: nowrap; padding: 0 15px;">
            <button class="filter-btn active" onclick="filterBranchTasks('all')" id="filterAll">Все</button>
            <button class="filter-btn" onclick="filterBranchTasks('started')" id="filterStarted">▶ Начатые</button>
            <button class="filter-btn" onclick="filterBranchTasks('notStarted')" id="filterNotStarted">○ Не начатые</button>
        </div>
    `;
}
function filterBranchTasks(filter) {
    currentStatusFilter = filter;
    
    // Обновляем активное состояние кнопок
    document.querySelectorAll('#statusFilters .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (filter === 'all') document.getElementById('filterAll')?.classList.add('active');
    if (filter === 'started') document.getElementById('filterStarted')?.classList.add('active');
    if (filter === 'notStarted') document.getElementById('filterNotStarted')?.classList.add('active');
    
    applyAllFilters();
}

function filterBranchCategory(category) {
    currentCategoryFilter = category;
    
    document.querySelectorAll('#statusFilters .filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(category === 'all' ? 'filterCatAll' : 'filterCat' + category)?.classList.add('active');
    
    const filterMap = { 'all': 'All', 'started': 'Started', 'notStarted': 'NotStarted' };
    document.getElementById('filter' + filterMap[currentStatusFilter])?.classList.add('active');
    
    applyAllFilters();
}

function applyAllFilters() {
    const cards = document.querySelectorAll('#branchTasksList .branch-task-card');
    
    cards.forEach(card => {
        const branchKey = card.getAttribute('data-branch-key');
        const isCompleted = card.classList.contains('completed');
        
        // 1. Фильтр по статусу (Все, Начатые, Не начатые)
        let showByStatus = true;
        if (currentStatusFilter === 'started') {
            const progressBar = card.querySelector('.progress-bar-fill');
            const hasProgress = progressBar && progressBar.style.width && progressBar.style.width !== '0%';
            const currentLevel = getCurrentLevelIndex(branchKey);
            showByStatus = !isCompleted && (hasProgress || currentLevel > 0);
        } else if (currentStatusFilter === 'notStarted') {
            const progressBar = card.querySelector('.progress-bar-fill');
            const hasProgress = progressBar && progressBar.style.width && progressBar.style.width !== '0%';
            const currentLevel = getCurrentLevelIndex(branchKey);
            showByStatus = !isCompleted && !hasProgress && currentLevel === 0;
        }
        
        // 2. Фильтр по категории (используем currentCategoryFilter)
        let showByCategory = currentCategoryFilter === 'all';
        if (!showByCategory && STATUS_CATEGORIES[currentCategoryFilter]) {
            showByCategory = STATUS_CATEGORIES[currentCategoryFilter].keys.includes(branchKey);
        }
        
        // 3. Фильтр по сложности (используем currentDifficultyFilter)
        let showByDifficulty = currentDifficultyFilter === 'all';
        if (!showByDifficulty) {
            const starsSpan = card.querySelector('.stars');
            if (starsSpan) {
                const cardDifficulty = parseInt(starsSpan.getAttribute('data-difficulty'));
                showByDifficulty = cardDifficulty === currentDifficultyFilter;
            }
        }
        
        // Применяем все фильтры
        card.style.display = (showByStatus && showByCategory && showByDifficulty) ? '' : 'none';
    });
}
        // ==========================================
// РАНДОМАЙЗЕР
// ==========================================

let randomizerCategory = 'all';
let excludedBooks = [];

function toggleRandomPage() {
    const content = document.getElementById('randomPageContent');
    const arrow = document.getElementById('randomPageArrow');
    if (!content) return;
    if (content.style.display === 'block') {
        content.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    } else {
        content.style.display = 'block';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    }
}

function setRandomFilter(filter, btn) {
    randomizerCategory = filter;
    document.querySelectorAll('#randomPageContent .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function randomUncoloredPage() {
    const availablePages = [];
    const categories = ['paint_by_number', 'alcohol', 'pencil', 'custom'];
    
    categories.forEach(category => {
        if (randomizerCategory === 'paint_by_number' && category !== 'paint_by_number') return;
        if (randomizerCategory === 'alcohol' && category !== 'alcohol') return;
        
        const userBooks = userColoringBooks[category] || [];
        
        userBooks.forEach(book => {
            const bookName = typeof book === 'string' ? book : book.name;
            
            if (excludedBooks.includes(bookName)) return;
            
            const bookKey = `${category}_${bookName}`;
            
            let config;
            if (typeof book === 'object' && book.custom) {
                config = {
                    totalPages: book.totalPages || DEFAULT_PAGES_CONFIG.totalPages,
                    spreads: book.spreads || []
                };
            } else {
                config = BOOK_PAGES_CONFIG[bookName] || DEFAULT_PAGES_CONFIG;
            }
            
            const completedPages = userCompletedPages[bookKey] || {};
            const { totalPages, spreads } = config;
            
            let page = 1;
            while (page <= totalPages) {
                const isSpread = spreads.includes(page);
                const pageLabel = isSpread ? `${page}-${page + 1}` : String(page);
                
                if (!completedPages[pageLabel]) {
                    availablePages.push({
                        bookName: bookName,
                        category: category,
                        bookKey: bookKey,
                        page: pageLabel,
                        isSpread: isSpread,
                        config: config
                    });
                }
                
                page += isSpread ? 2 : 1;
            }
        });
    });
    
    if (availablePages.length === 0) {
        const messages = {
            'all': '🎉 Все страницы в выбранных раскрасках раскрашены!',
            'paint_by_number': '🎉 Все страницы в раскрасках по номерам раскрашены!',
            'alcohol': '🎉 Все страницы в спиртовых раскрасках раскрашены!'
        };
        if (tg) tg.showAlert(messages[randomizerCategory] || 'Нет нераскрашенных страниц');
        else alert(messages[randomizerCategory] || 'Нет нераскрашенных страниц');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * availablePages.length);
    const chosen = availablePages[randomIndex];
    
    showRandomResult(chosen);
}

function showRandomResult(chosen) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.style.zIndex = '100005';
    
    const coverUrl = DEFAULT_COVERS[chosen.bookName] || '';
    const categoryNames = {
        'paint_by_number': 'Раскраска по номерам',
        'alcohol': 'Спиртовая раскраска',
        'pencil': 'Для карандашей',
        'custom': 'Другая раскраска'
    };
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px; text-align: center;">
            <h3 style="margin-bottom: 5px;">🎲 Случайная страница</h3>
            <p style="color: var(--text-gray); font-size: 12px; margin-bottom: 15px;">${categoryNames[chosen.category] || chosen.category}</p>
            
            ${coverUrl ? `<img src="${coverUrl}" style="width: 120px; border-radius: 12px; margin-bottom: 15px;" onerror="this.style.display='none'">` : ''}
            
            <div style="font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 8px;">
                ${chosen.bookName}
            </div>
            
            <div style="font-size: 24px; font-weight: 900; color: var(--accent); margin-bottom: 15px;">
                ${chosen.isSpread ? `Разворот ${chosen.page}` : `Страница ${chosen.page}`}
            </div>
            
            <p style="color: var(--text-gray); font-size: 13px; margin-bottom: 10px;">
                ${chosen.isSpread ? 'Это разворот — считается как 1 страница' : 'Обычная страница'}
            </p>
            
            <button class="modal-action-btn" onclick="goToBookPage('${chosen.category}', '${chosen.bookName.replace(/'/g, "\\'")}', '${chosen.page}')" style="margin-bottom: 8px;">
                <i class="fas fa-paint-brush"></i> Перейти к раскраске
            </button>
            
            <button class="modal-action-btn" onclick="this.closest('.modal-overlay').remove(); randomUncoloredPage();" style="background: #ff9800; margin-bottom: 8px;">
                <i class="fas fa-dice"></i> Ещё раз
            </button>
            
            <button class="modal-action-btn" onclick="excludeBook('${chosen.bookName.replace(/'/g, "\\'")}'); this.closest('.modal-overlay').remove(); randomUncoloredPage();" style="background: var(--status-red); margin-bottom: 8px;">
                <i class="fas fa-ban"></i> Исключить эту раскраску
            </button>
            
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">
                Закрыть
            </button>
        </div>
    `;
    
    modal.onclick = function(e) {
        if (e.target === modal) modal.remove();
    };
    
    document.body.appendChild(modal);
}

function excludeBook(bookName) {
    if (!excludedBooks.includes(bookName)) {
        excludedBooks.push(bookName);
        updateExcludedCount();
        if (tg) tg.showAlert(`❌ "${bookName}" исключена из рандомайзера`);
    }
}

function resetExcludedBooks() {
    excludedBooks = [];
    updateExcludedCount();
    if (tg) tg.showAlert('✅ Все раскраски снова доступны в рандомайзере');
}

function updateExcludedCount() {
    const countEl = document.getElementById('excludedBooksCount');
    if (countEl) countEl.textContent = excludedBooks.length;
}

function showExcludedBooks() {
    if (excludedBooks.length === 0) {
        if (tg) tg.showAlert('Нет исключённых раскрасок');
        else alert('Нет исключённых раскрасок');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.style.zIndex = '100005';
    
    let booksHtml = excludedBooks.map(book => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: var(--bg); border-radius: 10px; margin-bottom: 8px;">
            <span style="font-size: 14px; color: var(--text);">${book}</span>
            <button onclick="excludedBooks = excludedBooks.filter(b => b !== '${book.replace(/'/g, "\\'")}'); updateExcludedCount(); this.closest('.modal-overlay').remove(); showExcludedBooks();" 
                    style="background: var(--accent); color: white; border: none; padding: 5px 12px; border-radius: 15px; cursor: pointer; font-size: 12px;">
                Вернуть
            </button>
        </div>
    `).join('');
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <h3 style="margin-bottom: 15px;">🚫 Исключённые раскраски</h3>
            ${booksHtml}
            <button class="modal-action-btn" onclick="resetExcludedBooks(); this.closest('.modal-overlay').remove();" style="margin-bottom: 10px;">Сбросить все</button>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">Закрыть</button>
        </div>
    `;
    
    modal.onclick = function(e) {
        if (e.target === modal) modal.remove();
    };
    
    document.body.appendChild(modal);
}

function goToBookPage(category, bookName, page) {
    openBookPagesModal(category, bookName);
    
    document.querySelectorAll('.modal-overlay').forEach(m => {
        if (m.innerHTML.includes('Случайная страница')) m.remove();
    });
    
    setTimeout(() => {
        const pageBtns = document.querySelectorAll('.book-page-btn');
        pageBtns.forEach(btn => {
            const text = btn.textContent.trim();
            if (text === page || text.includes(page)) {
                btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                btn.style.animation = 'highlight 1s ease-in-out 3';
            }
        });
    }, 500);
}
// ==========================================
// ПРОПУСК ЗАДАНИЙ И БУСТЫ XP
// ==========================================

// Функция для добавления XP с учётом буста
async function addXPWithBoost(amount, reason) {
    // ✅ Буст тратится ТОЛЬКО на бекенде при одобрении админом
    // Здесь мы НЕ трогаем userBoosts
    
    console.log(`📊 addXPWithBoost: отправка XP = ${amount}, reason = ${reason}`);
    
    try {
        const response = await fetch(`${SERVER_URL}/api/add_xp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                amount: amount,
                reason: reason
            })
        });
        
        const result = await response.json();
        
        if (result.status === 'ok') {
            if (typeof renderUserLevel === 'function') {
                renderUserLevel();
            }
            console.log(`✅ XP добавлено: ${amount}`);
            return amount;
        } else {
            console.error('Ошибка сервера:', result);
            return amount;
        }
    } catch (error) {
        console.error('Ошибка добавления XP:', error);
        return amount;
    }
}
// Функция пропуска задания
async function addProgressWithoutPhoto(branchKey, levelIndex) {
    let skips = parseInt(localStorage.getItem(`user_skips_${userId}`) || '0');
    if (skips <= 0) {
        alert('❌ Нет пропусков! Купите в магазине.');
        return false;
    }
    
    try {
        const response = await fetch(`${SERVER_URL}/api/add_progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                branch_key: branchKey,
                level_index: levelIndex,
                amount: 1
            })
        });
        
        const result = await response.json();
        
        if (result.status === 'ok') {
            skips--;
            localStorage.setItem(`user_skips_${userId}`, skips);
            updateSkipCounter();
            
            // Добавляем XP с бустом
            await addXPWithBoost(5, `Пропуск задания в ветке ${branchKey}`);
            
            alert('✅ Задание пропущено! Прогресс и XP зачислены.');
            
            await refreshUserProgress();
            renderBranchTasks();
            
            return true;
        } else {
            alert('❌ Ошибка: ' + (result.message || 'Неизвестная ошибка'));
            return false;
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('❌ Ошибка при пропуске задания');
        return false;
    }
}

// Функция обновления счетчика пропусков
function updateSkipCounter() {
    const skips = parseInt(localStorage.getItem(`user_skips_${userId}`) || '0');
    const display = document.getElementById('skipCountDisplay');
    if (display) {
        display.innerText = skips;
    }
}

// Функция отображения статуса буста
function renderBoostStatus() {
    const container = document.getElementById('boostStatusContainer');
    if (!container) return;
    
    if (userBoosts && userBoosts.active && userBoosts.remainingWorks > 0) {
        container.innerHTML = `
            <div style="background: linear-gradient(135deg, rgba(255,149,0,0.2), rgba(255,149,0,0.05)); border-radius: 20px; padding: 8px 15px; display: flex; align-items: center; gap: 8px; border: 1px solid rgba(255,149,0,0.3);">
                <i class="fas fa-rocket" style="color: var(--accent);"></i>
                <span style="color: var(--accent); font-weight: 600;">x2 буст активен!</span>
            <span style="color: var(--text-gray);">Осталось: 0</span>
            </div>
        `;
    } else {
        container.innerHTML = '';
    }
}

// Функция проверки возможности пропуска (для кнопки в задании)
function canUseSkipForTask(branchKey) {
    if (branchKey === 'shock') {
        if (tg) tg.showAlert('⚠️ Шок контент нельзя пропускать!');
        return false;
    }
    
    let skips = parseInt(localStorage.getItem(`user_skips_${userId}`) || '0');
    if (skips <= 0) {
        if (tg) tg.showAlert('❌ Нет пропусков! Купите в магазине.');
        return false;
    }
    
    return confirm('Использовать пропуск для выполнения этого задания?');
}
         // ==========================================
// МАГАЗИН - ПРОПУСКИ И БУСТЫ
// ==========================================



// Загрузка данных
function loadBoostData() {
    const saved = localStorage.getItem(`user_boosts_${userId}`);
    if (saved) {
        try { userBoosts = JSON.parse(saved); } catch(e) {}
    }
    const savedSkips = localStorage.getItem(`user_skips_${userId}`);
    if (savedSkips) {
        userSkips = parseInt(savedSkips) || 0;
    }
}

// Сохранение буста
function saveBoostData() {
    localStorage.setItem(`user_boosts_${userId}`, JSON.stringify(userBoosts));
}

// Обновление отображения
function updateSkipDisplay() {
    const display = document.getElementById('skipCountDisplay');
    if (display) {
        display.innerText = userSkips;
    }
}

async function updateBoostDisplay() {
    try {
        const response = await fetch(`${SERVER_URL}/api/get_boost_status?user_id=${userId}`);
        const boost = await response.json();
        userBoosts = {
            active: boost.active || false,
            remainingWorks: boost.remaining || 0
        };
        localStorage.setItem(`user_boosts_${userId}`, JSON.stringify(userBoosts));
    } catch (error) {
        console.error('Ошибка загрузки буста:', error);
    }
    
    const container = document.getElementById('boostStatusContainer');
    if (!container) return;
    
    if (userBoosts.active && userBoosts.remainingWorks > 0) {
        container.innerHTML = `
            <div style="font-size: 11px; color: var(--text-gray);">Буст x2</div>
            <span style="font-weight: 700; color: var(--accent); font-size: 20px;">${userBoosts.remainingWorks}</span>
        `;
    } else {
        container.innerHTML = `
            <div style="font-size: 11px; color: var(--text-gray);">Буст x2</div>
            <span style="font-weight: 700; color: var(--text-gray); font-size: 20px;">—</span>
        `;
    }
}

// Функция применения буста (уже есть, но добавим логирование)
function applyBoost(xpAmount) {
    if (userBoosts.active && userBoosts.remainingWorks > 0) {
        userBoosts.remainingWorks--;
        if (userBoosts.remainingWorks === 0) {
            userBoosts.active = false;
            console.log('🔥 Буст закончился!');
        }
        localStorage.setItem(`user_boosts_${userId}`, JSON.stringify(userBoosts));
        
        // Обновляем отображение буста в магазине
        if (currentShopTab === 'boosts') {
            renderBoostShop();
        }
        
        return xpAmount * 2;
    }
    return xpAmount;
}

// Обновление отображения буста (добавить в профиль)
function renderBoostStatus() {
    const boostContainer = document.getElementById('boostStatusContainer');
    if (!boostContainer) return;
    
    if (userBoosts.active && userBoosts.remainingWorks > 0) {
        boostContainer.innerHTML = `
            <div style="background: rgba(255,149,0,0.2); border-radius: 12px; padding: 8px 12px; margin: 5px 15px; text-align: center;">
                <i class="fas fa-fire" style="color: var(--accent);"></i>
                <span style="color: var(--accent); font-weight: 600;">x2 буст активен! Осталось: ${userBoosts.remainingWorks} работ</span>
            </div>
        `;
    } else {
        boostContainer.innerHTML = '';
    }
}
function renderBranchTasks() {
    const container = document.getElementById('branchTasksList');
    if (!container) {
        console.error('Container branchTasksList not found');
        return;
    }
    
    container.innerHTML = '';
    
    for (const [branchKey, branch] of Object.entries(TASK_BRANCHES)) {
        if (branchKey === 'season_pass') continue;
        if (branchKey === 'scrooge' || branchKey === 'benefactor') continue;
        
        const isCompleted = isBranchCompleted(branchKey);
        const currentLevelIndex = getCurrentLevelIndex(branchKey);
        const levels = branch.levels;
        
        const difficulty = TASK_DIFFICULTY[branchKey] || 1;
        const starsHtml = '<span class="stars" data-difficulty="' + difficulty + '" style="display: inline-flex; align-items: center; gap: 2px; margin-left: 8px;">' + renderStars(difficulty) + '</span>';
        
        const branchCard = document.createElement('div');
        branchCard.className = `branch-task-card ${isCompleted ? 'completed' : ''}`;
        branchCard.setAttribute('data-branch-key', branchKey);
        
        branchCard.innerHTML = `
            <div class="branch-header">
                <h3>${branch.name} ${starsHtml}</h3>
                <p>${branch.desc}</p>
            </div>
        `;
        
        if (isCompleted) {
            const completedDiv = document.createElement('div');
            completedDiv.className = 'level-card';
            completedDiv.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div class="completed-badge" style="display: inline-block; margin-bottom: 10px;">✅ Задание выполнено</div>
                    <div style="color: var(--status-green);">
                        <i class="fas fa-trophy"></i> Получен статус: ${BRANCH_REWARDS[branchKey]}
                    </div>
                </div>
            `;
            branchCard.appendChild(completedDiv);
        } else if (currentLevelIndex < levels.length) {
            const level = levels[currentLevelIndex];
            
            if (level.subtasks && level.subtasks.length > 0) {
                const levelCard = document.createElement('div');
                levelCard.className = 'level-card';
                levelCard.setAttribute('data-level-index', currentLevelIndex);
                
                let totalCompleted = 0;
                let totalRequired = 0;
                
                level.subtasks.forEach((subtask, idx) => {
                    const prog = getSubtaskProgress(branchKey, currentLevelIndex, idx);
                    totalCompleted += Math.min(prog, subtask.required);
                    totalRequired += subtask.required;
                });
                
                const totalPercent = (totalCompleted / totalRequired) * 100;
                
                levelCard.innerHTML = `
                    <div class="level-header">
                        <span class="level-title">Уровень ${currentLevelIndex + 1}: ${level.title}</span>
                        <span class="level-progress">${totalCompleted}/${totalRequired}</span>
                    </div>
                    <div class="level-desc">${level.desc}</div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${totalPercent}%"></div>
                    </div>
                    <div style="margin-top: 15px;"></div>
                `;
                
                level.subtasks.forEach((subtask, idx) => {
                    const currentProgress = getSubtaskProgress(branchKey, currentLevelIndex, idx);
                    const isSubtaskCompleted = currentProgress >= subtask.required;
                    const subtaskPercent = (currentProgress / subtask.required) * 100;
                    const subtaskName = subtask.name;
                    
                    const subtaskDiv = document.createElement('div');
                    subtaskDiv.style.cssText = 'margin-bottom: 15px; padding: 10px; background: var(--bg); border-radius: 12px;';
                    
                    subtaskDiv.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <span style="font-weight: 600; font-size: 14px;">${subtask.name}</span>
                            <span style="font-size: 12px; color: var(--accent);">${currentProgress}/${subtask.required}</span>
                        </div>
                        <div class="progress-bar-container" style="height: 6px; margin: 0 0 8px 0;">
                            <div class="progress-bar-fill" style="width: ${subtaskPercent}%; height: 100%;"></div>
                        </div>
                    `;
                    
                    if (!isSubtaskCompleted) {
                        const buttonsRow = document.createElement('div');
                        buttonsRow.style.cssText = 'display: flex; gap: 6px; align-items: stretch; margin-top: 8px; width: 100%;';
                        
                        const uploadBtn = document.createElement('button');
                        uploadBtn.className = 'task-submit-btn';
                        uploadBtn.style.cssText = 'padding: 10px 8px; font-size: 13px; flex: 7; min-width: 0; display: flex; align-items: center; justify-content: center; gap: 4px;';
                        uploadBtn.innerHTML = '<i class="fas fa-camera"></i> Отправить фото';
                        uploadBtn.onclick = function() {
                            openSubtaskUpload(branchKey, currentLevelIndex, idx, subtaskName);
                        };
                        buttonsRow.appendChild(uploadBtn);
                        
                        if (branchKey !== 'shock') {
                            const skipBtn = document.createElement('button');
                            skipBtn.className = 'task-submit-btn';
                            skipBtn.style.cssText = 'background: linear-gradient(135deg, rgba(255,149,0,0.25), rgba(255,149,0,0.1)); border: 1px solid rgba(255,149,0,0.4); color: var(--accent); padding: 10px 4px; font-size: 12px; flex: 3; min-width: 0; white-space: nowrap; display: flex; align-items: center; justify-content: center;';
                            skipBtn.innerHTML = '<i class="fas fa-forward"></i> Скип';
                            skipBtn.onclick = (function(b, l, s, cp, req, sn) {
                                return async function() {
                                    await useSkipForSubtask(b, l, s, cp, req, sn);
                                };
                            })(branchKey, currentLevelIndex, idx, currentProgress, subtask.required, subtaskName);
                            buttonsRow.appendChild(skipBtn);
                        }
                        
                        subtaskDiv.appendChild(buttonsRow);
                    } else {
                        subtaskDiv.innerHTML += `
                            <div style="text-align: center; color: var(--status-green); font-size: 12px; margin-top: 5px;">
                                <i class="fas fa-check-circle"></i> Выполнено!
                            </div>
                        `;
                    }
                    
                    levelCard.appendChild(subtaskDiv);
                });
                
                branchCard.appendChild(levelCard);
            } else if (level.subtasks && level.subtasks.length === 1) {
                const subtask = level.subtasks[0];
                const currentProgress = getSubtaskProgress(branchKey, currentLevelIndex, 0);
                const isSubtaskCompleted = currentProgress >= subtask.required;
                const percent = (currentProgress / subtask.required) * 100;
                
                const levelCard = document.createElement('div');
                levelCard.className = 'level-card';
                levelCard.setAttribute('data-level-index', currentLevelIndex);
                levelCard.innerHTML = `
                    <div class="level-header">
                        <span class="level-title">${level.title}</span>
                        <span class="level-progress">${currentProgress}/${subtask.required}</span>
                    </div>
                    <div class="level-desc">${level.desc}</div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${percent}%"></div>
                    </div>
                `;
                
                if (!isSubtaskCompleted) {
                    const buttonsRow = document.createElement('div');
                    buttonsRow.style.cssText = 'display: flex; gap: 6px; align-items: stretch; margin-top: 10px; width: 100%;';
                    
                    const uploadBtn = document.createElement('button');
                    uploadBtn.className = 'task-submit-btn';
                    uploadBtn.style.cssText = 'padding: 10px 8px; font-size: 13px; flex: 7; min-width: 0; display: flex; align-items: center; justify-content: center; gap: 4px;';
                    uploadBtn.innerHTML = '<i class="fas fa-camera"></i> Отправить фото';
                    uploadBtn.onclick = function() {
                        openSubtaskUpload(branchKey, currentLevelIndex, 0, subtask.name);
                    };
                    buttonsRow.appendChild(uploadBtn);
                    
                    if (branchKey !== 'shock') {
                        const skipBtn = document.createElement('button');
                        skipBtn.className = 'task-submit-btn';
                        skipBtn.style.cssText = 'background: linear-gradient(135deg, rgba(255,149,0,0.25), rgba(255,149,0,0.1)); border: 1px solid rgba(255,149,0,0.4); color: var(--accent); padding: 10px 4px; font-size: 12px; flex: 3; min-width: 0; white-space: nowrap; display: flex; align-items: center; justify-content: center;';
                        skipBtn.innerHTML = '<i class="fas fa-forward"></i> Скип';
                        skipBtn.onclick = (function(b, l, s, cp, req, sn) {
                            return async function() {
                                await useSkipForSubtask(b, l, s, cp, req, sn);
                            };
                        })(branchKey, currentLevelIndex, 0, currentProgress, subtask.required, subtask.name);
                        buttonsRow.appendChild(skipBtn);
                    }
                    
                    levelCard.appendChild(buttonsRow);
                } else {
                    levelCard.innerHTML += `
                        <div style="text-align: center; padding: 12px; color: var(--status-green); margin-top: 10px;">
                            <i class="fas fa-check-circle"></i> Задание выполнено!
                        </div>
                    `;
                }
                
                branchCard.appendChild(levelCard);
            } else {
                const currentProgress = getLevelProgress(branchKey, currentLevelIndex);
                const percent = (currentProgress / level.maxProgress) * 100;
                const levelCard = document.createElement('div');
                levelCard.className = 'level-card';
                levelCard.setAttribute('data-level-index', currentLevelIndex);
                levelCard.innerHTML = `
                    <div class="level-header">
                        <span class="level-title">Уровень ${currentLevelIndex + 1}: ${level.title}</span>
                        <span class="level-progress">${currentProgress}/${level.maxProgress}</span>
                    </div>
                    <div class="level-desc">${level.desc}</div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${percent}%"></div>
                    </div>
                `;
                
                const buttonsRow = document.createElement('div');
                buttonsRow.style.cssText = 'display: flex; gap: 6px; align-items: stretch; margin-top: 10px; width: 100%;';
                
                const uploadBtn = document.createElement('button');
                uploadBtn.className = 'task-submit-btn';
                uploadBtn.style.cssText = 'padding: 10px 8px; font-size: 13px; flex: 7; min-width: 0; display: flex; align-items: center; justify-content: center; gap: 4px;';
                uploadBtn.innerHTML = '<i class="fas fa-camera"></i> Отправить фото';
                uploadBtn.onclick = function() {
                    openTaskUpload(branchKey, currentLevelIndex);
                };
                buttonsRow.appendChild(uploadBtn);
                
                if (branchKey !== 'shock' && currentProgress < level.maxProgress) {
                    const skipBtn = document.createElement('button');
                    skipBtn.className = 'task-submit-btn';
                    skipBtn.style.cssText = 'background: linear-gradient(135deg, rgba(255,149,0,0.25), rgba(255,149,0,0.1)); border: 1px solid rgba(255,149,0,0.4); color: var(--accent); padding: 10px 4px; font-size: 12px; flex: 3; min-width: 0; white-space: nowrap; display: flex; align-items: center; justify-content: center;';
                    skipBtn.innerHTML = '<i class="fas fa-forward"></i> Скип';
                    skipBtn.onclick = async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        let skips = parseInt(localStorage.getItem(`user_skips_${userId}`) || '0');
                        if (skips <= 0) {
                            alert('❌ Нет скипов! Купите в магазине.');
                            return;
                        }
                        
                        if (confirm(`Использовать скип для этого задания? Осталось скипов: ${skips}`)) {
                            await addProgressWithoutPhoto(branchKey, currentLevelIndex);
                        }
                    };
                    buttonsRow.appendChild(skipBtn);
                }
                
                levelCard.appendChild(buttonsRow);
                branchCard.appendChild(levelCard);
            }
        }
        
        container.appendChild(branchCard);
    }
    
    renderStatusFilters();
    applyAllFilters();
    console.log('✅ Задания отрисованы');
}
    async function useSkipForSubtask(branchKey, levelIndex, subtaskIndex, currentProgress, required, subtaskName) {
    // Проверка: Шок контент нельзя пропускать
    if (branchKey === 'shock') {
        alert('⚠️ Задания ветки "Шок контент" нельзя пропускать!');
        return false;
    }
    
    // Проверка наличия скипов
    if (userSkips <= 0) {
        alert('❌ Нет скипов! Купите в магазине.');
        return false;
    }
    
    // Проверка что подзадание ещё не выполнено
    if (currentProgress >= required) {
        alert('✅ Это подзадание уже выполнено!');
        return false;
    }
    
    if (!confirm(`Использовать скип для подзадания "${subtaskName}"? (1 скип = +1 очко). Осталось скипов: ${userSkips}`)) {
        return false;
    }
    
    try {
        const response = await fetch(`${SERVER_URL}/api/add_progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                branch_key: branchKey,
                level_index: levelIndex,
                subtask_index: subtaskIndex,
                amount: 1
            })
        });
        
        const result = await response.json();
        
        if (result.status === 'ok') {
            // ✅ Сервер сам списал скип и вернул skips_left
            userSkips = result.skips_left;
            updateSkipDisplay();
            
            // Добавляем XP за скип (2 XP, с бустом 4 XP)
            if (typeof addXPWithBoost === 'function') {
                await addXPWithBoost(2, `Скип подзадания "${subtaskName}" в ветке ${branchKey}`);
            }
            
            alert(`✅ Подзадание пропущено! +1 очко. Осталось скипов: ${userSkips}`);
            
            // Обновляем прогресс
            if (typeof refreshUserProgress === 'function') {
                await refreshUserProgress();
            }
            renderBranchTasks();
            
            return true;
        } else {
            alert('❌ Ошибка: ' + (result.message || 'Неизвестная ошибка'));
            return false;
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('❌ Ошибка при пропуске задания');
        return false;
    }
}
        // ==========================================
        // ОБНОВЛЕНИЕ ПРОГРЕССА
        // ==========================================
        
        async function refreshUserProgress() {
    console.log('🔄 Refreshing user progress...');
    
    try {
        await loadUserBalance();
        await loadUserProgress();
        await loadUnlockedStatuses();
        await loadUserAchievements();
        await checkBalanceStatus();
        await checkAndUnlockStatuses();
        
        renderBranchTasks();
       await renderTimeTasks();
        renderFriendTasks();
        renderSeasonPassTasks();  // ← обязательно
        updateUI();
        
        console.log('✅ Progress refreshed, current balance:', user.balance);
    } catch (error) {
        console.error('Error refreshing progress:', error);
    }
}
// ==========================================
// ВРЕМЕННЫЕ ЗАДАНИЯ (ИСПРАВЛЕНО — СМЕНА ПО ВОСКРЕСЕНЬЯМ)
// ==========================================

function getMoscowTime() {
    const now = new Date();
    const moscowOffset = 3 * 60 * 60 * 1000; // UTC+3
    return new Date(now.getTime() + moscowOffset);
}

function getWeeklyTask() {
    const moscowNow = getMoscowTime();
    
    // Получаем ВОСКРЕСЕНЬЕ как начало недели
    const dayOfWeek = moscowNow.getDay(); // 0=вс, 1=пн...6=сб
    const sunday = new Date(moscowNow);
    sunday.setDate(moscowNow.getDate() - dayOfWeek);
    sunday.setHours(0, 0, 0, 0);
    
    // Ключ недели = дата воскресенья
    const weekKey = `${sunday.getFullYear()}-${sunday.getMonth()+1}-${sunday.getDate()}`;
    
    // Выбор персонажа — на основе даты, а не миллисекунд
    const charIndex = (sunday.getFullYear() * 1000 + sunday.getMonth() * 50 + sunday.getDate() * 7) % BESTIARY.length;
    const char = BESTIARY[charIndex];
    
    let totalAppearances = 0;
    char.appearances.forEach(a => totalAppearances += a.pages.length);
    
    let reward = 5;
    if (totalAppearances === 2 || totalAppearances === 3) reward = 10;
    if (totalAppearances === 1) reward = 15;
    
    // Дедлайн — следующее воскресенье
    const deadline = new Date(sunday);
    deadline.setDate(sunday.getDate() + 7);
    const deadlineStr = `${String(deadline.getDate()).padStart(2, '0')}.${String(deadline.getMonth() + 1).padStart(2, '0')}.${deadline.getFullYear()}`;
    
    return {
        id: 'weekly_task',
        title: `Персонаж недели: ${char.name}`,
        description: `Раскрась картинку с ${char.name} из м/ф «${char.film}»`,
        reward: reward,
        deadline: deadlineStr,
        type: 'weekly',
        character: char,
        totalAppearances: totalAppearances,
        weekKey: weekKey
    };
}

function getMonthlyTask() {
    const moscowNow = getMoscowTime();
    const monthIndex = moscowNow.getFullYear() * 12 + moscowNow.getMonth();
    const seed = monthIndex * 12345;
    
    const chars = [];
    const usedFilms = new Set();
    
    for (let i = 0; i < 4; i++) {
        let idx = (seed + i * 7919) % BESTIARY.length;
        let attempts = 0;
        
        while (usedFilms.has(BESTIARY[idx].film) && attempts < 100) {
            idx = (idx + 1) % BESTIARY.length;
            attempts++;
        }
        usedFilms.add(BESTIARY[idx].film);
        chars.push(BESTIARY[idx]);
    }
    
    const lastDay = new Date(moscowNow.getFullYear(), moscowNow.getMonth() + 1, 0);
    const deadlineStr = `${String(lastDay.getDate()).padStart(2, '0')}.${String(lastDay.getMonth() + 1).padStart(2, '0')}.${lastDay.getFullYear()}`;
    
    const subtasks = chars.map((char, i) => {
        let totalAppearances = 0;
        char.appearances.forEach(a => totalAppearances += a.pages.length);
        
        let reward = 5;
        if (totalAppearances === 2 || totalAppearances === 3) reward = 10;
        if (totalAppearances === 1) reward = 15;
        
        return {
            name: `Раскрась картинку с ${char.name} из м/ф «${char.film}»`,
            required: 1,
            reward: reward,
            character: char,
            totalAppearances: totalAppearances
        };
    });
    
    const totalReward = subtasks.reduce((sum, s) => sum + s.reward, 0);
    
    return {
        id: 'monthly_task',
        title: 'Задания месяца',
        description: `Выполни 4 задания до ${deadlineStr}`,
        reward: totalReward,
        deadline: deadlineStr,
        type: 'monthly',
        subtasks: subtasks
    };
}

function checkTimeTasksReset() {
    return;
}

        function toggleAnswersBlock() {
    const content = document.getElementById('answersBlockContent');
    const arrow = document.getElementById('answersBlockArrow');
    
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        renderVolumesInCollection();
    } else {
        content.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
}

function renderVolumesInCollection() {
    const container = document.getElementById('volumesContainerInCollection');
    if (!container) return;
    
    container.innerHTML = '';
    
    VOLUMES_DATA.forEach(volume => {
        const cartKey = `volume_${volume.id}`;
        const cartCount = cart[cartKey] || 0;
        
        const card = document.createElement('div');
        card.className = 'book-card';
        card.onclick = () => openVolumeAnswers(volume.id, volume.pages);
        card.innerHTML = `
            <img src="${volume.img}" alt="${volume.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22%23ff9500%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2240%22%3E📘%3C/text%3E%3C/svg%3E'">
            <h4>${volume.name}</h4>
            <div class="book-price">${volume.price} ₽</div>
            <div style="font-size: 11px; color: var(--text-gray); margin-top: -8px; margin-bottom: 12px;">(под заказ)</div>
            <div id="book-controls-col-${volume.id}" class="cart-controls" style="display: ${cartCount > 0 ? 'flex' : 'none'}">
                <button class="minus" onclick="event.stopPropagation(); updateVolumeCart('${volume.id}', -1)">−</button>
                <span id="book-count-col-${volume.id}">${cartCount}</span>
                <button onclick="event.stopPropagation(); updateVolumeCart('${volume.id}', 1)">+</button>
            </div>
            <button id="book-add-col-${volume.id}" class="add-to-cart-btn" onclick="event.stopPropagation(); updateVolumeCart('${volume.id}', 1)" style="display: ${cartCount > 0 ? 'none' : 'block'}">
                <i class="fas fa-cart-plus"></i> В корзину
            </button>
        `;
        container.appendChild(card);
    });
}

function searchVolumesInCollection() {
    const query = document.getElementById('volumeSearchInCollection');
    if (!query) return;
    const searchQuery = query.value.toLowerCase();
    const volumeCards = document.querySelectorAll('#volumesContainerInCollection .book-card');
    volumeCards.forEach(card => {
        const titleEl = card.querySelector('h4');
        const title = titleEl ? titleEl.innerText.toLowerCase() : '';
        if (title.includes(searchQuery)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}
function loadTimeTasksStatus() {}

async function toggleTimeTasks() {
    const content = document.getElementById('timeTasksContent');
    const arrow = document.getElementById('timeTasksArrow');
    if (!content) return;
    if (content.style.display === 'block') {
        content.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    } else {
        content.style.display = 'block';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        await renderTimeTasks();
    }
}

async function renderTimeTasks() {
    const container = document.getElementById('timeTasksList');
    if (!container) return;
    container.innerHTML = '';

    const weeklyTask = getWeeklyTask();
    const monthlyTask = getMonthlyTask();
    
    // ✅ ВСЕГДА загружаем с сервера. Сервер — единственный источник правды
    let timeTasksStatus = {};
    try {
        const response = await fetch(`${SERVER_URL}/api/time_tasks_status?user_id=${userId}`);
        if (response.ok) {
            timeTasksStatus = await response.json();
        }
    } catch (error) {
        console.error('Ошибка загрузки статуса:', error);
        timeTasksStatus = {};
    }
    
    // Сохраняем в localStorage только для быстрого доступа (не как основной источник)
    localStorage.setItem('time_tasks_status', JSON.stringify(timeTasksStatus));
    
    // Проверяем сброс недели/месяца
    const savedWeeklyTitle = timeTasksStatus['_weekly_title'] || '';
    if (savedWeeklyTitle && savedWeeklyTitle !== weeklyTask.title) {
        delete timeTasksStatus['weekly_task'];
        timeTasksStatus['_weekly_title'] = weeklyTask.title;
        localStorage.setItem('time_tasks_status', JSON.stringify(timeTasksStatus));
    }
    
    const weeklyCompleted = timeTasksStatus['weekly_task'] === true;
    const monthlyProgress = timeTasksStatus['monthly_task'] || {};
    
    let html = '';
    
    // Еженедельное задание
    html += `
        <div class="time-task-card ${weeklyCompleted ? 'completed' : ''}">
            <div class="time-badge" style="font-size: 10px; padding: 3px 8px; top: 8px; right: 8px;">📅 до ${weeklyTask.deadline}</div>
            <div class="time-header" style="padding-right: 85px;">
                <h3 style="font-size: 14px; padding-right: 5px; margin-bottom: 2px;">Персонаж недели</h3>
                <h3 style="font-size: 18px; padding-right: 5px; margin-top: 0; margin-bottom: 8px;">${weeklyTask.character.name}</h3>
                <p style="font-size: 12px;">${weeklyTask.description}</p>
                <div class="time-reward" style="font-size: 13px;"><i class="fas fa-book-open gold-book"></i> +${weeklyTask.reward} ашетиков</div>
            </div>
            <div class="level-card">
                ${weeklyCompleted ? `
                    <div style="text-align: center; padding: 12px; color: var(--status-green);">
                        <i class="fas fa-check-circle"></i> Задание выполнено!
                    </div>
                ` : `
                    <button class="time-task-btn" onclick="openTimeTaskUpload('${weeklyTask.id}', ${weeklyTask.reward})" style="width: 100%;">
                        <i class="fas fa-camera"></i> Отправить фото на проверку
                    </button>
                `}
            </div>
        </div>
    `;
    
    // Ежемесячное задание
    html += `
        <div class="time-task-card">
            <div class="time-badge" style="font-size: 10px; padding: 3px 8px; top: 8px; right: 8px;">📆 до ${monthlyTask.deadline}</div>
            <div class="time-header" style="padding-right: 85px;">
                <h3 style="font-size: 16px; padding-right: 5px;">${monthlyTask.title}</h3>
                <p style="font-size: 12px;">${monthlyTask.description}</p>
                <div class="time-reward" style="font-size: 12px;"><i class="fas fa-book-open gold-book"></i> До +${monthlyTask.reward} ашетиков</div>
            </div>
            <div class="level-card">
    `;
    
    let allMonthlyDone = true;
    monthlyTask.subtasks.forEach((subtask, idx) => {
        const progress = monthlyProgress[String(idx)] || 0;
        const done = progress >= subtask.required;
        if (!done) allMonthlyDone = false;
        
        html += `
            <div class="subtask-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span style="font-weight: 600; font-size: 13px;">${subtask.name}</span>
                    <span style="font-size: 12px; color: var(--accent);">${progress}/${subtask.required}</span>
                </div>
                <div style="font-size: 11px; color: var(--text-gray); margin-bottom: 6px;">
                    <i class="fas fa-book-open gold-book"></i> +${subtask.reward} ашетиков
                </div>
                <div class="progress-bar-container" style="height: 6px; margin: 0 0 8px 0;">
                    <div class="progress-bar-fill" style="width: ${(progress / subtask.required) * 100}%;"></div>
                </div>
                ${!done ? `
                    <button class="task-submit-btn subtask-btn" onclick="openMonthlySubtaskUpload(${idx})" style="width: 100%;">
                        <i class="fas fa-camera"></i> Отправить фото
                    </button>
                ` : `
                    <div style="text-align: center; color: var(--status-green); font-size: 12px;">
                        <i class="fas fa-check-circle"></i> Выполнено!
                    </div>
                `}
            </div>
        `;
    });
    
    if (allMonthlyDone) {
        html += `
            <div style="text-align: center; padding: 12px; color: var(--status-green); margin-top: 10px;">
                <i class="fas fa-check-circle"></i> Все задания месяца выполнены!
            </div>
        `;
    }
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}
let currentTimeTaskId = null;
let currentTimeTaskReward = null;
let currentTimeTaskSubtask = 0;

function openTimeTaskUpload(taskId, reward) {
    currentTimeTaskId = taskId;
    currentTimeTaskReward = reward;
    currentTimeTaskSubtask = 0;
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.onchange = handleTimeTaskFilesSelected;
    fileInput.click();
}

function openMonthlySubtaskUpload(subtaskIdx) {
    currentTimeTaskId = 'monthly_task';
    currentTimeTaskSubtask = subtaskIdx;
    
    const monthlyTask = getMonthlyTask();
    currentTimeTaskReward = monthlyTask.subtasks[subtaskIdx].reward;
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.onchange = handleTimeTaskFilesSelected;
    fileInput.click();
}

function handleTimeTaskFilesSelected(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    tempPhotos = files;
    const previewContainer = document.getElementById('taskPhotoPreviewContainer');
    if (previewContainer) {
        previewContainer.innerHTML = '';
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.cssText = 'width: 70px; height: 70px; object-fit: cover; border-radius: 12px; margin: 5px; border: 2px solid var(--accent);';
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    }
    const modal = document.getElementById('taskUploadModal');
    if (modal) {
        modal.style.display = 'flex';
        const submitBtn = modal.querySelector('.modal-action-btn');
        if (submitBtn) {
            submitBtn.onclick = () => submitTimeTaskPhoto();
        }
    }
}

async function submitTimeTaskPhoto() {
    if (isUploading) return;
    if (!tempPhotos || tempPhotos.length === 0) {
        showUploadError('❌ Выберите хотя бы одно фото');
        return;
    }
    isUploading = true;
    
    try {
        const formData = new FormData();
        formData.append('user', userId.toString());
        formData.append('id', currentTimeTaskId);
        formData.append('type', 'time_task');
        
        if (currentTimeTaskId === 'monthly_task') {
            const monthlyTask = getMonthlyTask();
            formData.append('subtask', currentTimeTaskSubtask.toString());
            formData.append('reward', currentTimeTaskReward.toString());
            formData.append('title', `Ежемесячное: ${monthlyTask.subtasks[currentTimeTaskSubtask].name}`);
        } else {
            const weeklyTask = getWeeklyTask();
            formData.append('reward', currentTimeTaskReward.toString());
            formData.append('title', `Еженедельное: ${weeklyTask.title}`);
        }
        
        for (let i = 0; i < tempPhotos.length; i++) {
            formData.append('photos', tempPhotos[i]);
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);
        
        const response = await fetch(`${SERVER_URL}/api/check_time_task`, {
            method: 'POST',
            body: formData,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
        
        const result = await response.json();
        
        if (result && result.status === 'ok') {
            showUploadSuccess('✅ Фото отправлено на проверку! Ожидайте одобрения.');
            closeTaskUploadModal();
            
            // Принудительно загружаем статус с сервера
            [3000, 10000].forEach(delay => {
                setTimeout(async () => {
                    try {
                        const statusRes = await fetch(`${SERVER_URL}/api/time_tasks_status?user_id=${userId}`);
                        const serverStatus = await statusRes.json();
                        if (serverStatus && Object.keys(serverStatus).length > 0) {
                            localStorage.setItem('time_tasks_status', JSON.stringify(serverStatus));
                            if (typeof renderTimeTasks === 'function') renderTimeTasks();
                        }
                    } catch(e) {}
                }, delay);
            });
        } else {
            throw new Error(result?.message || 'Ошибка отправки');
        }
    } catch (error) {
        console.error('❌ Ошибка:', error);
        if (error.name === 'AbortError') {
            showUploadError('❌ Превышено время ожидания.');
        } else {
            showUploadError(`❌ Ошибка: ${error.message}`);
        }
    } finally {
        isUploading = false;
    }
}
     

// ==========================================
// ЗАДАНИЯ ОТ НАШИХ ДРУЗЕЙ 
// ==========================================

const FRIEND_TASKS = [
    {
        id: 'bebes_animaux_task',
        title: 'Крошка',
        description: 'Выполни все задания, чтобы получить билет на розыгрыш раскраски Bebes animaux!',
        reward: 'Билет на розыгрыш раскраски Bebes animaux + статус «Крошка»',
        tgLink: 'https://t.me/hachettelittleheroes',
        tgUsername: '@hachettelittleheroes',
        levels: [
            {
                title: 'Выполни все задания',
                subtasks: [
                    { id: 'bebes_1', name: 'Раскрась разворот с животным-малышом', required: 1 },
                    { id: 'bebes_2', name: 'Раскрась разворот с ребенком', required: 1 },
                    { id: 'bebes_3', name: 'Раскрась картинку с мамой и ребенком', required: 1 },
                    { id: 'bebes_4', name: 'Раскрась картинку с малышом-животным и его мамой', required: 1 }
                ]
            }
        ]
    }
];
let friendProgress = {};

function loadFriendTasksStatus() {
    const saved = localStorage.getItem(`friend_progress_${userId}`);
    if (saved) {
        try {
            friendProgress = JSON.parse(saved);
        } catch(e) {
            friendProgress = {};
        }
    }
}

function saveFriendProgress() {
    localStorage.setItem(`friend_progress_${userId}`, JSON.stringify(friendProgress));
}

function getFriendSubtaskProgress(taskIdx, levelIdx, subtaskIdx) {
    const task = FRIEND_TASKS[taskIdx];
    if (!task) return 0;
    
    let key;
    if (task.id === 'bebes_animaux_task') {
        key = 'bebes_level_' + levelIdx + '_subtask_' + subtaskIdx;
    } else if (task.id === 'nadya_task_1') {
        key = 'nadya_level_' + levelIdx + '_subtask_' + subtaskIdx;
    } else if (task.id === 'irina_task_1') {
        key = 'irina_level_' + levelIdx + '_subtask_' + subtaskIdx;
    } else {
        key = 'friend_level_' + levelIdx + '_subtask_' + subtaskIdx;
    }
    
    return friendProgress[key] || 0;
}

function isFriendLevelCompleted(taskIdx, levelIdx) {
    const task = FRIEND_TASKS[taskIdx];
    const level = task.levels[levelIdx];
    
    let totalCompleted = 0;
    let totalRequired = 0;
    
    level.subtasks.forEach((subtask, subtaskIdx) => {
        const completed = getFriendSubtaskProgress(taskIdx, levelIdx, subtaskIdx);
        totalCompleted += Math.min(completed, subtask.required);
        totalRequired += subtask.required;
    });
    
    return totalCompleted >= totalRequired;
}

function isFriendTaskCompleted(taskIdx) {
    const task = FRIEND_TASKS[taskIdx];
    for (let i = 0; i < task.levels.length; i++) {
        if (!isFriendLevelCompleted(taskIdx, i)) {
            return false;
        }
    }
    return true;
}

function getCurrentFriendLevelIndex(taskIdx) {
    const task = FRIEND_TASKS[taskIdx];
    for (let i = 0; i < task.levels.length; i++) {
        if (!isFriendLevelCompleted(taskIdx, i)) {
            return i;
        }
    }
    return task.levels.length;
}

async function loadFriendProgressFromServer() {
    try {
        const response = await fetch(`${SERVER_URL}/api/stats?user_id=${userId}`);
        const stats = await response.json();
        
        if (stats) {
            // ✅ Очищаем старый прогресс
            friendProgress = {};
            
            for (const [key, value] of Object.entries(stats)) {
                // Загружаем все ключи с nadya_, irina_, bebes_, friend_, status_
                if ((key.startsWith('nadya_') || 
                     key.startsWith('irina_') || 
                     key.startsWith('bebes_') || 
                     key.startsWith('friend_') || 
                     key.startsWith('status_')) && typeof value === 'number') {
                    friendProgress[key] = value;
                }
            }
            
            saveFriendProgress();
            
            // ✅ Обновляем отображение заданий
            renderFriendTasks();
            
            console.log('✅ Загружен прогресс заданий от друзей:', friendProgress);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
function toggleFriendTasks() {
    var content = document.getElementById('friendTasksContent');
    var arrow = document.getElementById('friendTasksArrow');
    if (!content) return;
    
    if (content.style.display === 'block') {
        content.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    } else {
        content.style.display = 'block';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        
        // ✅ При открытии вкладки синхронизируем прогресс
        forceSyncFriendProgress().then(() => {
            renderFriendTasks();
        });
    }
}
async function forceSyncFriendProgress() {
    console.log('🔄 Принудительная синхронизация прогресса...');
    
    try {
        const response = await fetch(`${SERVER_URL}/api/sync_friend_progress?user_id=${userId}`);
        const data = await response.json();
        
        if (data.status === 'ok' && data.progress) {
            // Обновляем friendProgress
            for (const [key, value] of Object.entries(data.progress)) {
                friendProgress[key] = value;
            }
            saveFriendProgress();
            
            console.log('✅ Синхронизировано:', friendProgress);
            
            // Перерисовываем задания
            renderFriendTasks();
            
            return true;
        }
    } catch (error) {
        console.error('❌ Ошибка синхронизации:', error);
    }
    
    return false;
}
async function renderFriendTasks() {
    console.log('=== RENDER FRIEND TASKS ===');
    const container = document.getElementById('friendTasksList');
    if (!container) return;
    
    // Проверяем, есть ли задания
    if (!FRIEND_TASKS || FRIEND_TASKS.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--text-gray);">
                <i class="fas fa-handshake" style="font-size: 40px; opacity: 0.5; margin-bottom: 16px;"></i>
                <p>Пока что заданий нет</p>
                <p style="font-size: 13px; margin-top: 8px;">Новые задания от наших друзей скоро появятся!</p>
            </div>
        `;
        return;
    }
    
    const task = FRIEND_TASKS[0];
    if (!task) return;
    
    // ✅ ПРИНУДИТЕЛЬНАЯ СИНХРОНИЗАЦИЯ ПРОГРЕССА С СЕРВЕРОМ
    try {
        const response = await fetch(`${SERVER_URL}/api/sync_friend_progress?user_id=${userId}`);
        const data = await response.json();
        
        if (data.status === 'ok' && data.progress) {
            for (const [key, value] of Object.entries(data.progress)) {
                friendProgress[key] = value;
            }
            saveFriendProgress();
            console.log('✅ Синхронизировано:', friendProgress);
        }
    } catch (error) {
        console.error('❌ Ошибка синхронизации:', error);
    }
    
    // Проверяем, все ли подзадания выполнены
    let allCompleted = true;
    let totalCompleted = 0;
    let totalRequired = 0;
    
    if (task.levels && task.levels[0] && task.levels[0].subtasks) {
        task.levels[0].subtasks.forEach((subtask, idx) => {
            const progress = getFriendSubtaskProgress(0, 0, idx);
            totalCompleted += Math.min(progress, subtask.required);
            totalRequired += subtask.required;
            if (progress < subtask.required) {
                allCompleted = false;
            }
        });
    }
    
    if (allCompleted && totalRequired > 0) {
        container.innerHTML = `
            <div class="friend-task-card completed">
                <div class="friend-header">
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <div class="friend-reward">🎁 ${task.reward}</div>
                </div>
                <div class="level-card">
                    <div style="text-align: center; padding: 12px; color: var(--status-green);">
                        <i class="fas fa-check-circle"></i> Задание выполнено! Билет и статус «Крошка» получены.
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    // Рендерим активное задание с подзаданиями
    let html = `
        <div class="friend-task-card">
            <div class="friend-header">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <div class="friend-reward">🎁 ${task.reward}</div>
            </div>
            <div class="level-card">
    `;
    
    if (task.levels && task.levels[0] && task.levels[0].subtasks) {
        task.levels[0].subtasks.forEach((subtask, idx) => {
            const progress = getFriendSubtaskProgress(0, 0, idx);
            const done = progress >= subtask.required;
            const percent = Math.min(100, (progress / subtask.required) * 100);
            
            html += `
                <div class="subtask-card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span style="font-weight: 600; font-size: 14px;">${subtask.name}</span>
                        <span style="font-size: 12px; color: var(--accent);">${progress}/${subtask.required}</span>
                    </div>
                    <div class="progress-bar-container" style="height: 6px; margin: 0 0 12px 0;">
                        <div class="progress-bar-fill" style="width: ${percent}%; height: 100%;"></div>
                    </div>
                    ${!done ? `
                        <button class="task-submit-btn" onclick="openFriendSubtaskUpload(0, 0, ${idx}, '${subtask.name.replace(/'/g, "\\'")}')" style="width: 100% !important; display: flex !important; justify-content: center !important; margin: 8px 0 0 0 !important;">
                            <i class="fas fa-camera"></i> Отправить фото
                        </button>
                    ` : `
                        <div style="text-align: center; color: var(--status-green); font-size: 12px;">
                            <i class="fas fa-check-circle"></i> Выполнено!
                        </div>
                    `}
                </div>
            `;
        });
    }
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}
let currentFriendTaskIdx = null;
let currentFriendLevelIdx = null;
let currentFriendSubtaskIdx = null;
let currentFriendSubtaskName = null;

function openFriendSubtaskUpload(taskIdx, levelIdx, subtaskIdx, subtaskName) {
    console.log('📸 openFriendSubtaskUpload called:', taskIdx, levelIdx, subtaskIdx, subtaskName);
    
    // Сбрасываем ВСЕ переменные
    currentSubtaskData = null;
    currentUploadBranch = null;
    currentUploadLevel = null;
    currentCommunitySubtask = null;
    currentFriendTaskIdx = taskIdx;
    currentFriendLevelIdx = levelIdx;
    currentFriendSubtaskIdx = subtaskIdx;
    currentFriendSubtaskName = subtaskName;
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.style.position = 'absolute';
    fileInput.style.opacity = '0';
    fileInput.style.pointerEvents = 'none';
    document.body.appendChild(fileInput);
    
    fileInput.onchange = function(event) {
        handleFriendSubtaskFilesSelected(event);
        document.body.removeChild(fileInput);
    };
    
    fileInput.click();
}
function handleFriendSubtaskFilesSelected(event) {
    handleTaskFilesSelected(event);
}

async function submitFriendSubtaskPhoto() {
    // Используем ту же функцию, что и для статусов
    const result = await submitTaskPhoto();
    
    // ✅ Принудительно загружаем прогресс с сервера после отправки
    if (result !== false) {
        [3000, 10000].forEach(delay => {
            setTimeout(async () => {
                try {
                    const response = await fetch(`${SERVER_URL}/api/sync_friend_progress?user_id=${userId}`);
                    const data = await response.json();
                    
                    if (data.status === 'ok' && data.progress) {
                        for (const [key, value] of Object.entries(data.progress)) {
                            friendProgress[key] = value;
                        }
                        saveFriendProgress();
                        renderFriendTasks();
                        console.log('🔄 Прогресс друзей обновлён после отправки');
                    }
                } catch(e) {
                    console.error('Ошибка загрузки прогресса:', e);
                }
            }, delay);
        });
    }
}

async function forceSyncFriendProgress() {
    console.log('🔄 Принудительная синхронизация прогресса...');
    
    try {
        const response = await fetch(`${SERVER_URL}/api/sync_friend_progress?user_id=${userId}`);
        const data = await response.json();
        
        if (data.status === 'ok' && data.progress) {
            for (const [key, value] of Object.entries(data.progress)) {
                friendProgress[key] = value;
            }
            saveFriendProgress();
            
            // ✅ Перерисовываем задания
            renderFriendTasks();
            
            console.log('✅ Синхронизировано:', friendProgress);
            return true;
        }
    } catch (error) {
        console.error('❌ Ошибка синхронизации:', error);
    }
    return false;
}
function approveNadyaTask() {
    localStorage.removeItem(`nadya_task_pending_${userId}`);
    localStorage.setItem(`nadya_task_approved_${userId}`, 'true');
    renderFriendTasks();
    
    if (tg) tg.showAlert('🎉 Задание выполнено! Вы получили билет!');
}
        // ==========================================
        // ПРОФИЛЬ И UI
        // ==========================================
        
   function updateUI() {
    const nameEl = document.getElementById('displayUsername');
    const avatarEl = document.getElementById('user-avatar');
    const balanceEl = document.getElementById('userBalance');
    const statusBadge = document.getElementById('currentStatus');
    
    if (nameEl) nameEl.innerText = user.name;
    if (avatarEl) avatarEl.src = user.avatar;
    if (balanceEl) balanceEl.innerText = user.balance;
    if (statusBadge) {
        statusBadge.innerText = user.status || 'Без статуса';
        statusBadge.setAttribute('data-status', user.status || 'Без статуса');
        // Не сбрасываем цвет и фон — их устанавливает applySponsorBackground
    }
    
    renderUserLevel();
    
    console.log('UI Updated - Current status:', user.status);
    console.log('UI Updated - Balance:', user.balance);
    
    updateCartBadge();
}
        
        function updateCartBadge() {
            let totalItems = 0;
            if (cart) {
                for (let key in cart) {
                    totalItems += cart[key];
                }
            }
            const badge = document.getElementById('cartBadge');
            if (badge) {
                if (totalItems > 0) {
                    badge.innerText = totalItems;
                    badge.style.display = 'block';
                } else {
                    badge.style.display = 'none';
                }
            }
        }
        
        
        function openAchievementsGallery() {
            const list = document.getElementById('allAchievementsList');
            if (!list) return;
            list.innerHTML = '';
            
            const allAchievements = Object.values(ACHIEVEMENTS_DB);
            
            allAchievements.forEach(ach => {
                const isUnlocked = user.achievements.includes(ach.id);
                const div = document.createElement('div');
                div.className = `achievement-item ${!isUnlocked ? 'locked' : ''}`;
                div.onclick = () => showAchievementInfo(ach);
                
                const img = document.createElement('img');
                img.src = ach.img;
                img.alt = ach.name;
                img.style.cssText = 'width: 60px; height: 60px; object-fit: cover; border-radius: 12px; background: #f0f0f0;';
                img.onerror = function() {
                    this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22%3E%3Crect width=%2260%22 height=%2260%22 fill=%22%23ff9500%22/%3E%3Ctext x=%2230%22 y=%2230%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2220%22%3E🏆%3C/text%3E%3C/svg%3E';
                };
                
                div.innerHTML = `
                    <div class="achievement-info">
                        <h4>${ach.name}</h4>
                        <p>${ach.desc}</p>
                        <div class="achievement-condition">${ach.condition}</div>
                        ${!isUnlocked ? '<div class="achievement-lock"><i class="fas fa-lock"></i> Заблокировано</div>' : ''}
                    </div>
                `;
                div.insertBefore(img, div.firstChild);
                list.appendChild(div);
            });
            
            const modal = document.getElementById('achievementsGalleryModal');
            if (modal) modal.style.display = 'flex';
        }
        
        function showAchievementInfo(ach) {
            const titleEl = document.getElementById('achInfoTitle');
            const imgEl = document.getElementById('achInfoImg');
            const descEl = document.getElementById('achInfoDesc');
            const conditionEl = document.getElementById('achInfoCondition');
            
            if (titleEl) titleEl.innerText = ach.name;
            if (imgEl) imgEl.src = ach.img;
            if (descEl) descEl.innerText = ach.desc;
            if (conditionEl) conditionEl.innerText = ach.condition;
            
            const galleryModal = document.getElementById('achievementsGalleryModal');
            if (galleryModal) galleryModal.style.display = 'none';
            
            const infoModal = document.getElementById('achInfoModal');
            if (infoModal) infoModal.style.display = 'flex';
        }
        
        function closeAchievementInfo() {
            const modal = document.getElementById('achInfoModal');
            if (modal) modal.style.display = 'none';
        }
        
        function toggleAvatarEditor() {
            const editor = document.getElementById('avatarEditor');
            if (editor) {
                if (editor.style.display === 'none' || editor.style.display === '') {
                    renderAvatarPresets();
                    editor.style.display = 'block';
                } else {
                    editor.style.display = 'none';
                }
            }
        }
        
        function renderAvatarPresets() {
    const container = document.getElementById('avatarPresets');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 1; i <= 8; i++) {
        const url = `https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av${i}.png`;
        const div = document.createElement('div');
        div.className = 'preset-avatar-item';
        div.onclick = () => {
            user.avatar = url;
            saveUserData();
            
            // ✅ Отправляем на сервер
            saveAvatarToServer(url);
            
            const editor = document.getElementById('avatarEditor');
            if (editor) editor.style.display = 'none';
            if (tg) tg.showAlert('Аватар изменен!');
        };
        div.innerHTML = `<img src="${url}">`;
        container.appendChild(div);
    }
}
        
        function handleCustomAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            user.avatar = e.target.result;
            saveUserData();
            
            // ✅ Отправляем на сервер
            saveAvatarToServer(user.avatar);
            
            const editor = document.getElementById('avatarEditor');
            if (editor) editor.style.display = 'none';
            if (tg) tg.showAlert('Аватар изменен!');
        };
        reader.readAsDataURL(file);
    }
}
async function saveAvatarToServer(avatarUrl) {
    try {
        await fetch(`${SERVER_URL}/api/save_avatar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                avatar: avatarUrl
            })
        });
        console.log('✅ Аватар сохранён на сервере');
    } catch (error) {
        console.error('❌ Ошибка сохранения аватара:', error);
    }
}
        
        function changeNickname() {
            const modal = document.getElementById('nameModal');
            const input = document.getElementById('newNameInput');
            if (input) input.value = user.name;
            if (modal) modal.style.display = 'flex';
        }
        
       async function saveNewNickname() {
    const input = document.getElementById('newNameInput');
    if (!input) return;
    const newName = input.value.trim();
    if (newName.length > 0 && newName.length <= 20) {
        user.name = newName;
        saveUserData();
        
        // Отправляем на сервер
        try {
            await fetch(`${SERVER_URL}/api/save_name`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, name: newName })
            });
        } catch(e) {
            console.error('Ошибка сохранения имени:', e);
        }
        
        const modal = document.getElementById('nameModal');
        if (modal) modal.style.display = 'none';
        updateUI();
        if (tg) tg.showAlert('Имя изменено!');
    } else {
        if (tg) tg.showAlert("Имя должно быть от 1 до 20 символов");
    }
}
        
        function closeNameModal() {
            const modal = document.getElementById('nameModal');
            if (modal) modal.style.display = 'none';
        }
        // ==========================================
        // ВЫБОР СТАТУСА
        // ==========================================
        
 function openStatusInfo() {
    console.log('openStatusInfo called');
    
    const list = document.getElementById('availableStatusesList');
    if (!list) {
        console.error('availableStatusesList not found');
        return;
    }
    
    list.innerHTML = '';
    
    const branchStatuses = Object.values(BRANCH_REWARDS);
    const shopStatuses = STATUS_SHOP.map(s => s.name);
    
    // Статусы из замка
    const castleStatuses = [
        'Герой Ашетвиля', 'Чемпион арены', 'Верный союзник',
        'Избранный замком', 'Король по праву',
        'Проклятый король', 'Призрачный слуга', 'Узник замка',
        'Павший воин', 'Возлюбленная', 'Друг мельника',
        'Глава Гильдии', 'Королева теней', 'Свободная душа',
        'Архимаг', 'Хранитель знаний', 'Познавший тайну'
    ];
    
    // Объединяем все статусы
    const allStatuses = ['Без статуса', ...branchStatuses, 'Феечка', ...shopStatuses, ...castleStatuses];
    
    console.log('allStatuses:', allStatuses);
    
    
    allStatuses.forEach(status => {
        const isUnlocked = user.unlockedStatuses.includes(status);
        const isActive = user.status === status;
        
        const div = document.createElement('div');
        div.style.cssText = `padding:14px 16px; margin:10px 0; border-radius:14px; background:var(--card-bg); display:flex; justify-content:space-between; align-items:center; border:1px solid var(--border-color);`;
        
        const leftSpan = document.createElement('span');
        leftSpan.style.cssText = `font-weight:500; font-size:15px; color:var(--text);`;
        leftSpan.innerText = status;
        
        const rightSpan = document.createElement('span');
        rightSpan.style.cssText = `display:inline-flex; align-items:center; gap:8px; white-space:nowrap;`;
        
        if (isUnlocked) {
            if (isActive) {
                rightSpan.innerHTML = `<span style="color:var(--status-green); font-size:13px;"><i class="fas fa-check-circle"></i> Активен</span>`;
            } else {
                const btn = document.createElement('button');
                btn.innerText = 'Выбрать';
                btn.style.cssText = `background:var(--accent); color:white; border:none; padding:6px 16px; border-radius:20px; font-size:13px; font-weight:500; cursor:pointer;`;
                btn.onclick = (function(s) {
                    return function() { selectStatus(s); };
                })(status);
                rightSpan.appendChild(btn);
            }
        } else {
            rightSpan.innerHTML = `<span style="color:var(--text-gray); font-size:16px;"><i class="fas fa-lock"></i></span>`;
        }
        
        div.appendChild(leftSpan);
        div.appendChild(rightSpan);
        list.appendChild(div);
    });
    
    const modal = document.getElementById('statusSelectModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function selectStatus(statusName) {
    console.log('selectStatus called with:', statusName);
    
    if (!user.unlockedStatuses.includes(statusName)) {
        const msg = `Статус "${statusName}" не разблокирован`;
        if (tg) tg.showAlert(msg);
        return;
    }
    
    user.status = statusName;
    saveUserData();
    
    // ✅ Сохраняем на сервер
    fetch(`${SERVER_URL}/api/save_status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: userId,
            status: statusName
        })
    });
    
    const modal = document.getElementById('statusSelectModal');
    if (modal) modal.style.display = 'none';
    
    updateUI();
    
    // ✅ Дополнительно обновляем стиль статус-бейджа
    const statusBadge = document.getElementById('currentStatus');
    if (statusBadge) {
        statusBadge.setAttribute('data-status', statusName);
        
        // Находим статус в магазине для применения градиента
        const shopStatus = STATUS_SHOP.find(s => s.name === statusName);
        if (shopStatus && shopStatus.gradient) {
            statusBadge.style.background = shopStatus.gradient;
            statusBadge.style.border = 'none';
        }
    }
    
    if (tg) tg.showAlert(`✅ Статус изменен на "${statusName}"`);
}

function openSupport() {
    // Оставляем для обратной совместимости
    openSupportDialog();
}
function openSupportDialog() {
    const username = 'SPB_Zakharin_Sergey';
    const message = encodeURIComponent('Здравствуйте! Хочу поддержать развитие приложения. Расскажите, как это сделать?');
    
    // Пробуем открыть через Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        try {
            window.Telegram.WebApp.openTelegramLink(`https://t.me/${username}?text=${message}`);
        } catch(e) {
            window.open(`https://t.me/${username}?text=${message}`, '_blank');
        }
    } else if (tg && tg.openTelegramLink) {
        tg.openTelegramLink(`https://t.me/${username}?text=${message}`);
    } else {
        window.open(`https://t.me/${username}?text=${message}`, '_blank');
    }
}
        
        function openSupportForStatus() {
    const username = 'SPB_Zakharin_Sergey';
    const message = encodeURIComponent('Здравствуйте! Хочу поддержать проект для получения статуса "Благодетель".');
    
    if (tg) {
        tg.showConfirm(
            'Вы будете перенаправлены в диалог с администратором.\n\nПосле поддержки вы получите статус "Благодетель".',
            (confirm) => {
                if (confirm) {
                    if (window.Telegram && window.Telegram.WebApp) {
                        window.Telegram.WebApp.openTelegramLink(`https://t.me/${username}?text=${message}`);
                    } else {
                        window.open(`https://t.me/${username}?text=${message}`, '_blank');
                    }
                    if (tg) tg.showAlert('Спасибо за поддержку! Напишите администратору для получения статуса.');
                }
            }
        );
    } else {
        if (confirm('Перейти в диалог с администратором?\n\nПосле поддержки вы получите статус "Благодетель".')) {
            window.open(`https://t.me/${username}?text=${message}`, '_blank');
        }
    }
}
        
        
        function saveUserData() {
            localStorage.setItem('coloring_user', JSON.stringify(user));
            localStorage.setItem('coloring_cart', JSON.stringify(cart));
            updateUI();
        }
        // ==========================================
        // МАРКЕРЫ
        // ==========================================
        
        async function loadMarkers() {
            if (markersLoading) return;
            markersLoading = true;
            
            const markersContainer = document.getElementById('markersList');
            if (markersContainer) {
                markersContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Загрузка маркеров...</div>';
            }
            
            const csvUrl = 'https://docs.google.com/spreadsheets/d/1Yrsif-aQwbuT6fLPnP4MsM22UuwuUWz5FYegELPxzFU/gviz/tq?tqx=out:csv&cache=' + new Date().getTime();
            
            try {
                const res = await fetch(csvUrl);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                
                const text = await res.text();
                const rows = text.split('\n').map(r => r.split(',').map(c => c.replace(/"/g, '').trim()));
                let temp = [];
                rows.forEach(row => {
                    for (let i = 0; i < row.length; i++) {
                        let num = row[i];
                        if (num && !isNaN(num) && parseInt(num) > 10) {
                            let stock = parseInt(row[i+1] || row[i+2] || "0");
                            temp.push({ num: num, stock: stock });
                            i++;
                        }
                    }
                });
                
                markersDB = temp.filter((v, i, a) => a.findIndex(t => (t.num === v.num)) === i);
                
                const activePage = document.querySelector('.page.active');
                if (activePage && activePage.id === 'markers') {
                    renderMarkers();
                }
            } catch (error) {
                console.error('Ошибка загрузки маркеров:', error);
                markersDB = [];
                if (markersContainer) {
                    markersContainer.innerHTML = '<div class="no-results">⚠️ Ошибка загрузки данных. Проверьте подключение к интернету.</div>';
                }
            } finally {
                markersLoading = false;
            }
        }
        
        function renderMarkers() {
            const container = document.getElementById('markersList');
            if (!container) return;
            
            if (markersLoading) {
                container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Загрузка маркеров...</div>';
                return;
            }
            
            if (!markersDB || markersDB.length === 0) {
                container.innerHTML = '<div class="no-results">📦 Нет данных о маркерах. Нажмите "Обновить"</div>';
                return;
            }
            
            container.innerHTML = '';
            markersDB.forEach(m => {
                const cartKey = `marker_${m.num}`;
                const cartCount = (cart && cart[cartKey]) ? cart[cartKey] : 0;
                const canAdd = cartCount < m.stock;
                const canRemove = cartCount > 0;
                const stockClass = getStockColor(m.stock);
                const div = document.createElement('div');
                div.className = 'marker-item';
                div.setAttribute('data-num', m.num);
                div.innerHTML = `
                    <div class="color-circle" style="background-color: var(--bg);"></div>
                    <div class="marker-info">
                        <div class="marker-header">
                            <span class="marker-number">№${m.num}</span>
                            <span class="marker-price">${MARKER_PRICE} ₽</span>
                        </div>
                        <div class="marker-stock ${stockClass}">${getStockText(m.stock)}</div>
                    </div>
                    <div class="marker-controls">
                        <button class="minus" onclick="updateMarkerCart('${m.num}', -1)" ${!canRemove ? 'disabled' : ''}>−</button>
                        <span id="marker-count-${m.num}">${cartCount}</span>
                        <button onclick="updateMarkerCart('${m.num}', 1)" ${!canAdd ? 'disabled' : ''}>+</button>
                    </div>
                `;
                container.appendChild(div);
            });
        }
        
        function getStockColor(stock) {
            if (stock === 0) return 'out-of-stock';
            if (stock === 1) return 'low-stock';
            if (stock <= 3) return 'medium-stock';
            return 'high-stock';
        }
        
        function getStockText(stock) {
            if (stock === 0) return 'Нет в наличии';
            if (stock === 1) return '1 шт.';
            return `${stock} шт.`;
        }
        
     function updateMarkerCart(num, delta) {
    const cartKey = `marker_${num}`;
    const currentCount = cart[cartKey] || 0;
    const newCount = currentCount + delta;
    const marker = markersDB.find(m => m.num === num);
    
    if (!marker) return;
    
    // Проверка на превышение остатка
    if (newCount > marker.stock) {
        if (tg) tg.showAlert(`Максимум доступно: ${marker.stock} шт.`);
        return;
    }
    
    // Проверка на отрицательное значение
    if (newCount < 0) return;
    
    // Обновляем корзину
    if (newCount === 0) {
        delete cart[cartKey];
    } else {
        cart[cartKey] = newCount;
    }
    
    // Обновляем отображение в маркерах
    const countSpan = document.getElementById(`marker-count-${num}`);
    if (countSpan) {
        countSpan.innerText = newCount;
    }
    
    // Обновляем кнопки (блокируем если достигли лимита)
    const markerItem = document.querySelector(`.marker-item[data-num="${num}"]`);
    if (markerItem) {
        const minusBtn = markerItem.querySelector('.minus');
        const plusBtn = markerItem.querySelector('button:last-child');
        
        if (minusBtn) minusBtn.disabled = newCount === 0;
        if (plusBtn) plusBtn.disabled = newCount >= marker.stock;
    }
    
    // Сохраняем и обновляем корзину
    saveUserData();
    renderCart();
    updateCartBadge();
}
        function searchMarkers() {
            const query = document.getElementById('markerSearch');
            if (!query) return;
            const searchQuery = query.value.toLowerCase();
            const items = document.querySelectorAll('.marker-item');
            items.forEach(item => {
                const num = item.getAttribute('data-num');
                if (num && num.includes(searchQuery)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        }
        
        // ==========================================
        // КОРЗИНА
        // ==========================================
        
        function renderCart() {
            const container = document.getElementById('cartItemsList');
            const totalSpan = document.getElementById('cartTotalSum');
            
            if (!container) return;
            
            let totalSum = 0;
            let itemsHtml = '';
            
            if (!cart || Object.keys(cart).length === 0) {
                container.innerHTML = '<div class="no-results" style="padding: 40px; text-align: center;">🛒 Корзина пуста</div>';
                if (totalSpan) totalSpan.innerText = '0';
                return;
            }
            
            for (let key in cart) {
                const count = cart[key];
                if (count <= 0) continue;
                
                if (key.startsWith('marker_')) {
                    const num = key.replace('marker_', '');
                    const marker = markersDB.find(m => m.num === num);
                    if (marker) {
                        const itemTotal = MARKER_PRICE * count;
                        totalSum += itemTotal;
                        itemsHtml += `
                            <div class="cart-item">
                                <div class="color-circle" style="background-color: var(--bg);"></div>
                                <div class="cart-item-info">
                                    <h4>Маркер №${num}</h4>
                                    <div class="cart-item-price">${MARKER_PRICE} ₽ / шт</div>
                                    <div class="cart-item-details">
                                        <div class="cart-item-controls">
                                            <button class="minus" onclick="updateMarkerCart('${num}', -1)">−</button>
                                            <span>${count}</span>
                                            <button onclick="updateMarkerCart('${num}', 1)">+</button>
                                        </div>
                                        <div class="cart-item-total">${itemTotal} ₽</div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                } else if (key.startsWith('volume_')) {
                    const volumeId = key.replace('volume_', '');
                    const volume = VOLUMES_DATA.find(v => v.id === volumeId);
                    if (volume) {
                        const itemTotal = volume.price * count;
                        totalSum += itemTotal;
                        itemsHtml += `
                            <div class="cart-item">
                                <img src="${volume.img}" alt="${volume.name}" style="width: 60px; height: 60px; object-fit: contain; border-radius: 12px; background: #f0f0f0;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22%3E%3Crect width=%2260%22 height=%2260%22 fill=%22%23ff9500%22/%3E%3Ctext x=%2230%22 y=%2230%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2220%22%3E📘%3C/text%3E%3C/svg%3E'">
                                <div class="cart-item-info">
                                    <h4>${volume.name}</h4>
                                    <div class="cart-item-price">${volume.price} ₽</div>
                                    <div style="font-size: 10px; color: var(--text-gray); margin-bottom: 4px;">(под заказ)</div>
                                    <div class="cart-item-details">
                                        <div class="cart-item-controls">
                                            <button class="minus" onclick="updateVolumeCart('${volumeId}', -1)">−</button>
                                            <span>${count}</span>
                                            <button onclick="updateVolumeCart('${volumeId}', 1)">+</button>
                                        </div>
                                        <div class="cart-item-total">${itemTotal} ₽</div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                }
            }
            
            let bonusAchetiki = 0;
            if (totalSum >= 10000) {
                bonusAchetiki = 50;
            } else if (totalSum >= 7500) {
                bonusAchetiki = 40;
            } else if (totalSum >= 5000) {
                bonusAchetiki = 30;
            } else if (totalSum >= 3000) {
                bonusAchetiki = 20;
            }
            
            let bonusHtml = '';
            if (bonusAchetiki > 0) {
                bonusHtml = `
                    <div style="background: rgba(255,215,0,0.1); padding: 12px; border-radius: 16px; margin-top: 15px; text-align: center; border: 1px dashed #FFD700;">
                        <i class="fas fa-gift" style="color: #FFD700;"></i> <strong>Бонус за заказ!</strong><br>
                        При подтверждении заказа вы получите <strong>+${bonusAchetiki} ашетиков</strong> на счет!
                    </div>
                `;
            } else if (totalSum > 0) {
                let nextBonus = 3000;
                if (totalSum < 3000) nextBonus = 3000;
                else if (totalSum < 5000) nextBonus = 5000;
                else if (totalSum < 7500) nextBonus = 7500;
                else if (totalSum < 10000) nextBonus = 10000;
                
                bonusHtml = `
                    <div style="background: rgba(0,0,0,0.05); padding: 12px; border-radius: 16px; margin-top: 15px; text-align: center;">
                        <i class="fas fa-info-circle"></i> Добавьте товаров на <strong>${nextBonus - totalSum} ₽</strong>, чтобы получить бонусные ашетики!
                    </div>
                `;
            }
            
            container.innerHTML = itemsHtml + bonusHtml;
            if (totalSpan) totalSpan.innerText = totalSum;
            updateCartBadge();
        }
        
      function checkout() {
    if (!cart || Object.keys(cart).length === 0) {
        if (tg) tg.showAlert('Корзина пуста');
        return;
    }
    
    // ✅ ПОДСЧИТЫВАЕМ КОЛИЧЕСТВО МАРКЕРОВ В КОРЗИНЕ
    let markersCount = 0;
    let hasBook = false;
    
    for (let key in cart) {
        if (key.startsWith('marker_')) {
            markersCount += cart[key];
        } else if (key.startsWith('volume_')) {
            hasBook = true;
        }
    }
    
    // ✅ ПРОВЕРКА: если есть маркеры, но нет раскрасок, то маркеров должно быть >= 3
    if (markersCount > 0 && !hasBook && markersCount < 3) {
        if (tg) {
            tg.showAlert('❌ При заказе только маркеров необходимо добавить минимум 3 маркера!\n\nДобавьте ещё маркеры или раскраску для оформления заказа.');
        }
        return;
    }
    
    // ✅ Если есть хотя бы одна раскраска, маркеры можно заказать в любом количестве (включая 1)
    if (tg) {
        tg.showConfirm('Оформить заказ?', async (confirm) => {
            if (confirm) {
                await sendOrderToServer();
            }
        });
    } else {
        if (confirm('Оформить заказ?')) {
            sendOrderToServer();
        }
    }
}
        
      async function sendOrderToServer() {
    let orderText = '🛍 ЗАКАЗ:\n\n';
    let total = 0;
    let bonusAchetiki = 0;
    let markersCount = 0;
    let hasBook = false;
    
    for (let key in cart) {
        const count = cart[key];
        if (key.startsWith('marker_')) {
            const num = key.replace('marker_', '');
            const marker = markersDB.find(m => m.num === num);
            if (marker) {
                orderText += `Маркер №${num} x${count} = ${MARKER_PRICE * count} ₽\n`;
                total += MARKER_PRICE * count;
                markersCount += count;
            }
        } else if (key.startsWith('volume_')) {
            const volumeId = key.replace('volume_', '');
            const volume = VOLUMES_DATA.find(v => v.id === volumeId);
            if (volume) {
                orderText += `${volume.name} x${count} = ${volume.price * count} ₽\n`;
                total += volume.price * count;
                hasBook = true;
            }
        }
    }
    
    // ✅ ДВОЙНАЯ ПРОВЕРКА ПЕРЕД ОТПРАВКОЙ
    if (markersCount > 0 && !hasBook && markersCount < 3) {
        if (tg) tg.showAlert('❌ При заказе только маркеров необходимо минимум 3 маркера!');
        return;
    }
    
    // Бонус за большую сумму
    if (total >= 10000) {
        bonusAchetiki = 50;
    } else if (total >= 7500) {
        bonusAchetiki = 40;
    } else if (total >= 5000) {
        bonusAchetiki = 30;
    } else if (total >= 3000) {
        bonusAchetiki = 20;
    }
    
    orderText += `\n💰 ИТОГО: ${total} ₽`;
    if (bonusAchetiki > 0) {
        orderText += `\n🎁 ПОТЕНЦИАЛЬНЫЙ БОНУС: +${bonusAchetiki} ашетиков (начисляется после подтверждения заказа)`;
    }
    
    const result = await fetchAPI('/api/new_order', {
        user_id: userId,
        text_details: orderText,
        total: total,
        potential_bonus: bonusAchetiki
    });
    
    if (result && result.status === 'ok') {
        if (tg) tg.showAlert('✅ Заказ отправлен администратору!');
        cart = {};
        saveUserData();
        renderCart();
        updateCartBadge();
        renderVolumes();
        renderMarkers(); // Обновляем маркеры, чтобы сбросить счётчики
    } else {
        if (tg) tg.showAlert('❌ Ошибка отправки заказа. Попробуйте позже.');
    }
}
        
        // ==========================================
        // ТОМА И ОТВЕТЫ (СВАЙПЫ)
        // ==========================================
        
        const VOLUME_NAMES = [
            "Les Grands Classiques tome 11", "Les Grands Classiques tome 3", "Vitraux tome 2",
            "Trompe L'oeil Babies", "Trompe L'oeil Grand Bloc", "Stitch Au numero",
            "Sous L'Ocean", "Saisons", "Romantasy", "Princesses tome 1", "Princesses tome 2",
            "Princes&Heros", "Portraits De Famille", "Pokemon", "Pixar", "Petites Princesses",
            "Petites Betes", "Mondes Fantastiques", "Mickey, Donald&Co", "Mechants",
            "Marsupilami", "Love Stories", "Looney Tunes tome 3", "Lilo Et Stitch",
            "Les Grands Classiques Special Debutants tome 1", "Les Grands Classiques Special Debutants tome 2",
            "Les Grands Classiques Au numero", "La Petite Sirene", "Les Schtroumpfs tome 1",
            "Les Schtroumpfs tome 2", "L'age Glace", "Hiver", "Heros&Mechants La Battle",
            "Grands Classiques Grand Bloc", "Les Grands Classiques Coliector", "Girl Power",
            "Fees, Sorciers Et Magiciens", "Famille", "Escapades Merveilleuses Douce France",
            "Chiots&Chiens", "Chevaux", "Bisounours tome 1", "Best Of Pixar",
            "Best Of Les Grands Classiques", "La Belle Et La Bete", "Bestiaire", "Best Of Heroines", "Les Grands Classiques tome 13", "Grand carre Mandalas", "Grand carre Portraits",
            "Les Grands Classiques tome 4", "Portraits", "Arbres du monde", "Les Grands Classiques tome 7",
            "Creatures Fantastiques", "Nature"
        ];
        
        const VOLUMES_DATA = [];
        for (let i = 0; i < 56; i++) {
            let price = 2890;
            if (i === 34) {
                price = 3800;
                }
            if (i === 48) {
                price = 2400;
                }
            if (i === 49) {
                price = 2400;
                }
            
            VOLUMES_DATA.push({
                id: `t${i + 1}`,
                name: VOLUME_NAMES[i],
                price: price,
                pages: 26,
                img: `https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/covers/t${i + 1}.jpg`
            });
        }
        
        function renderVolumes() {
            const container = document.getElementById('volumesContainer');
            if (!container) return;
            
            container.innerHTML = '';
            
            VOLUMES_DATA.forEach(volume => {
                const cartKey = `volume_${volume.id}`;
                const cartCount = cart[cartKey] || 0;
                
                const card = document.createElement('div');
                card.className = 'book-card';
                card.onclick = () => openVolumeAnswers(volume.id, volume.pages);
                card.innerHTML = `
                    <img src="${volume.img}" alt="${volume.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22%23ff9500%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2240%22%3E📘%3C/text%3E%3C/svg%3E'">
                    <h4>${volume.name}</h4>
                    <div class="book-price">${volume.price} ₽</div>
                    <div style="font-size: 11px; color: var(--text-gray); margin-top: -8px; margin-bottom: 12px;">(под заказ)</div>
                    <div id="book-controls-${volume.id}" class="cart-controls" style="display: ${cartCount > 0 ? 'flex' : 'none'}">
                        <button class="minus" onclick="event.stopPropagation(); updateVolumeCart('${volume.id}', -1)">−</button>
                        <span id="book-count-${volume.id}">${cartCount}</span>
                        <button onclick="event.stopPropagation(); updateVolumeCart('${volume.id}', 1)">+</button>
                    </div>
                    <button id="book-add-${volume.id}" class="add-to-cart-btn" onclick="event.stopPropagation(); updateVolumeCart('${volume.id}', 1)" style="display: ${cartCount > 0 ? 'none' : 'block'}">
                        <i class="fas fa-cart-plus"></i> В корзину
                    </button>
                `;
                container.appendChild(card);
            });
        }
        
       function updateVolumeCart(volumeId, delta) {
    const cartKey = `volume_${volumeId}`;
    const currentCount = cart[cartKey] || 0;
    const newCount = currentCount + delta;
    
    if (newCount < 0) return;
    if (newCount === 0) {
        delete cart[cartKey];
    } else {
        cart[cartKey] = newCount;
    }
    
    // Обновляем на основной странице (если открыта)
    const countSpan = document.getElementById(`book-count-${volumeId}`);
    const controlsDiv = document.getElementById(`book-controls-${volumeId}`);
    const addBtn = document.getElementById(`book-add-${volumeId}`);
    
    if (countSpan) countSpan.innerText = newCount;
    if (controlsDiv && addBtn) {
        if (newCount > 0) {
            controlsDiv.style.display = 'flex';
            addBtn.style.display = 'none';
        } else {
            controlsDiv.style.display = 'none';
            addBtn.style.display = 'block';
        }
    }
    
    // Обновляем также в коллекции
    const countSpanCol = document.getElementById(`book-count-col-${volumeId}`);
    const controlsDivCol = document.getElementById(`book-controls-col-${volumeId}`);
    const addBtnCol = document.getElementById(`book-add-col-${volumeId}`);
    
    if (countSpanCol) countSpanCol.innerText = newCount;
    if (controlsDivCol && addBtnCol) {
        if (newCount > 0) {
            controlsDivCol.style.display = 'flex';
            addBtnCol.style.display = 'none';
        } else {
            controlsDivCol.style.display = 'none';
            addBtnCol.style.display = 'block';
        }
    }
    
    saveUserData();
    renderCart();
    updateCartBadge();
}
        
        function openVolumeAnswers(volumeId, pagesCount) {
            console.log('📖 Opening volume:', volumeId, 'pages:', pagesCount);
            currentVolumeId = volumeId;
            currentVolumePages = pagesCount;
            currentPageIndex = 1;
            
            const modal = document.getElementById('answersViewerModal');
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                showAnswerPage();
            }
        }
        
        function showAnswerPage() {
            const pageInfo = document.getElementById('answersPageInfo');
            const prevBtn = document.getElementById('answersPrevBtn');
            const nextBtn = document.getElementById('answersNextBtn');
            const titleEl = document.getElementById('answersViewerTitle');
            const imgElement = document.getElementById('answersViewerImage');
            
            if (titleEl) titleEl.innerText = `${currentVolumeId.toUpperCase()} - Ответы`;
            
            if (imgElement) {
                const extensions = ['png', 'jpg', 'jpeg'];
                let currentExtIndex = 0;
                
                function tryLoadImage() {
                    if (currentExtIndex >= extensions.length) {
                        console.error('❌ Image not found in any format');
                        imgElement.src = 'data:image/svg+xml,' + encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
                                <rect width="600" height="800" fill="#f0f0f0"/>
                                <text x="300" y="100" font-size="20" text-anchor="middle" fill="#ff9500">📖 Ответ не найден</text>
                                <text x="300" y="150" font-size="14" text-anchor="middle" fill="#666">Файл: ${currentVolumeId}/${currentPageIndex}.{png,jpg}</text>
                                <text x="300" y="180" font-size="12" text-anchor="middle" fill="#999">Проверьте папку assets/otveti/${currentVolumeId}/</text>
                            </svg>
                        `);
                        imgElement.style.opacity = '1';
                        return;
                    }
                    
                    const ext = extensions[currentExtIndex];
                  const imageUrl = `https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/answers/${currentVolumeId}/${currentPageIndex}.${ext}`;
                    console.log(`📸 Trying to load: ${imageUrl}`);
                    imgElement.style.opacity = '0.5';
                    
                    const img = new Image();
                    img.onload = function() {
                        console.log(`✅ Image loaded: ${imageUrl}`);
                        imgElement.src = imageUrl;
                        imgElement.style.opacity = '1';
                    };
                    img.onerror = function() {
                        console.log(`❌ Not found: ${imageUrl}`);
                        currentExtIndex++;
                        tryLoadImage();
                    };
                    img.src = imageUrl;
                }
                tryLoadImage();
            }
            
            if (pageInfo) {
                pageInfo.innerText = `${currentPageIndex} / ${currentVolumePages}`;
            }
            if (prevBtn) {
                prevBtn.disabled = currentPageIndex <= 1;
            }
            if (nextBtn) {
                nextBtn.disabled = currentPageIndex >= currentVolumePages;
            }
        }
        
        function prevAnswerPage() {
            if (currentPageIndex > 1) {
                currentPageIndex--;
                showAnswerPage();
            }
        }
        
        function nextAnswerPage() {
            if (currentPageIndex < currentVolumePages) {
                currentPageIndex++;
                showAnswerPage();
            }
        }
        
        function closeAnswersViewer() {
            const modal = document.getElementById('answersViewerModal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
            currentVolumeId = null;
        }
        
        function initSwipeListeners() {
            const viewerImage = document.getElementById('answersViewerImage');
            if (!viewerImage) return;
            
            viewerImage.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            viewerImage.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const swipeThreshold = 50;
                const diff = touchEndX - touchStartX;
                if (Math.abs(diff) < swipeThreshold) return;
                if (diff > 0) {
                    prevAnswerPage();
                } else {
                    nextAnswerPage();
                }
            });
        }
        
        function searchVolumes() {
            const query = document.getElementById('volumeSearch');
            if (!query) return;
            const searchQuery = query.value.toLowerCase();
            const volumeCards = document.querySelectorAll('.book-card');
            volumeCards.forEach(card => {
                const titleEl = card.querySelector('h4');
                const title = titleEl ? titleEl.innerText.toLowerCase() : '';
                if (title.includes(searchQuery)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }
        
        
        function buyItem(itemId) {
            const prices = { bookmark: 750, petites: 950, tracker: 950, alcohol: 1250, coloriages: 1500 };
            const names = {
                bookmark: 'Книжную закладку Hachette',
                petites: 'Petites Poupees',
                tracker: 'Трекер от Hachette',
                alcohol: 'Спиртовую раскраску',
                coloriages: 'Hachette Coloriages (А4 том)'
            };
            const price = prices[itemId];
            const name = names[itemId];
            if (user.balance >= price) {
                if (tg) {
                    tg.showConfirm(`Купить ${name} за ${price} ашетиков?`, (confirm) => {
                        if (confirm) {
                            user.balance -= price;
                            saveUserData();
                            if (tg) tg.showAlert(`✅ Вы приобрели ${name}!`);
                            updateUI();
                        }
                    });
                } else {
                    if (confirm(`Купить ${name} за ${price} ашетиков?`)) {
                        user.balance -= price;
                        saveUserData();
                        alert(`✅ Вы приобрели ${name}!`);
                        updateUI();
                    }
                }
            } else {
                if (tg) tg.showAlert(`❌ Недостаточно ашетиков! Нужно ${price}, у вас ${user.balance}`);
            }
        }
        
       // ==========================================
// НАВИГАЦИЯ
// ==========================================

function tab(pageId) {
    const targetPage = document.getElementById(pageId);
    if (!targetPage) return;
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    targetPage.classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('btn-' + pageId);
    if (activeBtn) activeBtn.classList.add('active');
    
    window.scrollTo(0, 0);
    
    switch(pageId) {
        case 'collection':
            loadCollection();
            loadMarkersCollection();
            loadColoringBooks();
            loadInventory();
            renderBestiary();
            break;
        case 'markers':
            if (!markersDB || markersDB.length === 0) loadMarkers();
            else renderMarkers();
            break;
        case 'cart':
            renderCart();
            break;
        case 'stories':
            // Истории — статическая страница, ничего не загружаем
            break;
        case 'profile':
            updateUI();
            refreshUserProgress();
            break;
    }
}
        
      function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        if (section.style.display === 'none' || section.style.display === '') {
            document.querySelectorAll('.rewards-section').forEach(el => {
                if (el && el !== section) el.style.display = 'none';
            });
            section.style.display = 'block';
            if (sectionId === 'purchased-section') renderPurchasedItems();
        } else {
            section.style.display = 'none';
        }
    }
}
     
        function toggleTasks() {
            const content = document.getElementById('tasksContent');
            const arrow = document.getElementById('tasksArrow');
            if (!content) return;
            if (content.style.display === 'block') {
                content.style.display = 'none';
                if (arrow) arrow.style.transform = 'rotate(0deg)';
            } else {
                content.style.display = 'block';
                if (arrow) arrow.style.transform = 'rotate(180deg)';
                renderBranchTasks();
            }
        }
       function toggleWhereToPress() {
    const content = document.getElementById('whereToPressContent');
    const arrow = document.getElementById('whereToPressArrow');
    if (!content) return;
    if (content.style.display === 'block') {
        content.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    } else {
        content.style.display = 'block';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    }
}

function openTgGroup() {
    const groupUrl = 'https://t.me/hachettelittleheroes';
    
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.openTelegramLink(groupUrl);
    } else if (tg && tg.openTelegramLink) {
        tg.openTelegramLink(groupUrl);
    } else {
        window.open(groupUrl, '_blank');
    }
}
        
        function toggleInventoryBlock() {
            const content = document.getElementById('inventoryContent');
            const arrow = document.getElementById('inventoryArrow');
            if (!content) return;
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
                if (arrow) arrow.style.transform = 'rotate(180deg)';
            } else {
                content.style.display = 'none';
                if (arrow) arrow.style.transform = 'rotate(0deg)';
            }
        }
        
        // ==========================================
        // ТЕМЫ
        // ==========================================
        
        function setTheme(themeName) {
            const oldStyle = document.getElementById('custom-theme-style');
            if (oldStyle) oldStyle.remove();
            if (themeName === 'custom') {
                applyCustomTheme(true);
            } else {
                document.documentElement.setAttribute('data-theme', themeName);
                user.theme = themeName;
                localStorage.setItem('app_theme', themeName);
            }
            document.querySelectorAll('.theme-option').forEach(el => {
                el.classList.remove('active');
                if (el.dataset.theme === themeName) el.classList.add('active');
            });
        }
        
        function applyCustomTheme(loadFromCache = false) {
            let bgMode, accentColor;
            if (loadFromCache) {
                bgMode = localStorage.getItem('custom_theme_bg') || 'light';
                accentColor = localStorage.getItem('custom_theme_accent') || '#ff9500';
                const bgEl = document.getElementById('themeBgMode');
                const accEl = document.getElementById('themeAccentColor');
                if (bgEl) bgEl.value = bgMode;
                if (accEl) accEl.value = accentColor;
            } else {
                const bgEl = document.getElementById('themeBgMode');
                const accEl = document.getElementById('themeAccentColor');
                bgMode = bgEl ? bgEl.value : 'light';
                accentColor = accEl ? accEl.value : '#ff9500';
                localStorage.setItem('custom_theme_bg', bgMode);
                localStorage.setItem('custom_theme_accent', accentColor);
            }
            const oldStyle = document.getElementById('custom-theme-style');
            if (oldStyle) oldStyle.remove();
            const style = document.createElement('style');
            style.id = 'custom-theme-style';
            const commonStyles = `button, .nav-btn, .task-submit-btn { pointer-events: auto !important; cursor: pointer !important; } .modal-overlay { z-index: 10000 !important; }`;
            if (bgMode === 'light') {
                style.textContent = `:root { --bg: #f5f5f7; --bg-secondary: #ffffff; --bg-header: #ffffff; --text: #1c1c1e; --text-gray: #8e8e93; --accent: ${accentColor}; --accent-gradient: linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%); --border-color: rgba(0,0,0,0.1); --card-bg: #ffffff; --input-bg: #ffffff; } ${commonStyles}`;
            } else {
                style.textContent = `:root { --bg: #121212; --bg-secondary: #1e1e1e; --bg-header: #1c1c1e; --text: #ffffff; --text-gray: #8e8e93; --accent: ${accentColor}; --accent-gradient: linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%); --border-color: rgba(255,255,255,0.1); --card-bg: #1c1c1e; --input-bg: #2c2c2e; } ${commonStyles}`;
            }
            document.head.appendChild(style);
            document.documentElement.removeAttribute('data-theme');
            user.theme = 'custom';
            localStorage.setItem('app_theme', 'custom');
        }
 // ==========================================
// КОЛЛЕКЦИЯ ФИГУРОК
// ==========================================

const COLLECTION_FIGURES = [
    { id: 1, name: "Винни-Пух", desc: "Тот самый мишка, который любит мед", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/winnie.jpg" },
    { id: 2, name: "Реми", desc: "Микрошеф", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/remie.jpg" },
    { id: 3, name: "Бемби", desc: "Маленький принц", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/bembi.jpg" },
    { id: 4, name: "Багира", desc: "Верный друг Маугли", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/bagira.jpg" },
    { id: 5, name: "Леди", desc: "Спутница бродяги", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/ledi.jpg" },
    { id: 6, name: "Мегара", desc: "Ахилесова пята Геркулеса", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/megara.jpg" },
    { id: 7, name: "Тиана", desc: "Принцесса-лягушка", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/tiana.jpg" },
    { id: 8, name: "Рапунцель", desc: "Запутанная история",img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/rapunc.jpg" },
    { id: 9, name: "Далматинец", desc: "100 и 1 пятнышко", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/dolmat.jpg" },
    { id: 10, name: "Мулан", desc: "Отважная принцесса", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/mulan.jpg" },
    { id: 11, name: "Майло", desc: "По стопам деда", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/mailo.jpg" },
    { id: 12, name: "Карл", desc: "Ворчливый старик", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/karl.jpg" },
    { id: 13, name: "Джуди Хоппс", desc: "Глупый кролик", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/judi.jpg" },
    { id: 14, name: "Ник Уайлд", desc: "Хитрый лис", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/nik.jpg" },
    { id: 15, name: "Малефисента", desc: "Осторожно! Превращается в дракона", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/malefisenta.jpg" },
    { id: 16, name: "Джин", desc: "А какое у тебя 3 желание?", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/jin.jpg" },
    { id: 17, name: "Вуди", desc: "Ковбой с дикого запада", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/voodi.jpg" },
    { id: 18, name: "Булзай", desc: "Очаровательный конь", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/bulzai.jpg" },
    { id: 19, name: "Фея крестная", desc: "Превратит твою тыкву в карету", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/feya.jpg" },
    { id: 20, name: "Жасмин", desc: "Принцесса Аграбы", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/jasmin.jpg" },
    { id: 21, name: "Принц Навин", desc: "Принц, любитель джаза", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/navin.jpg" },
    { id: 22, name: "Плуто", desc: "Друг Микки", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/pluto.jpg" },
    { id: 23, name: "Гастон", desc: "Надменный охотник", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/gaston.jpg" },
    { id: 24, name: "Паскаль", desc: "Зеленый друг Рапунцель", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/pascal.jpg" },
    { id: 25, name: "Моана", desc: "Обладательница всех весел мира", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/moana.jpg" },
    { id: 26, name: "Капитан Крюк", desc: "Главный враг Питера Пена", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/kruk.jpg" },
    { id: 27, name: "Дамбо", desc: "Слоненок, который научился летать", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/dambo.jpg" },
    { id: 28, name: "Белль", desc: "Любительница библиотек", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/belle.jpg" },
    { id: 29, name: "Робин Гуд", desc: "Обворажительный лис", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/robin.jpg" },
    { id: 30, name: "Изма", desc: "Коварная женщина", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/izma.jpg" },
    { id: 31, name: "Стич", desc: "Маленький инопришеленец", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/stitch.jpg" },
    { id: 32, name: "Дональд Дак", desc: "Попробуй разобрать, чтотон говорит", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/donald.jpg" },
    { id: 33, name: "Симба", desc: "Король Саванны", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/simba.jpg" },
    { id: 34, name: "Олаф", desc: "Шашлычок", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/olaf.jpg" },
    { id: 35, name: "Покахонтас", desc: "Дождь вождя", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/pokahontas.jpg" },
    { id: 36, name: "Майк Вазовски", desc: "Круглик-Бублик", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/mikevazov.jpg" },
    { id: 37, name: "Ариэль", desc: "Дочь царя Тритона", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/ariel.jpg" },
    { id: 38, name: "Дори", desc: "Просто продолжай плыть", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/dori.jpg" },
    { id: 39, name: "Круэлла", desc: "Любительница пятен", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/kruella.jpg" },
    { id: 40, name: "Микки Маус", desc: "Самая знаменитая мышь", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/IMG_7022.jpg" },
    { id: 41, name: "Луи", desc: "Любитель джаза", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/lui.jpg" },
    { id: 42, name: "Эльза", desc: "Холодное сердце", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/elza.jpg" },
    { id: 43, name: "Флинн", desc: "Боится сковородок", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/flin.jpg" },
    { id: 44, name: "Тимон", desc: "Последователь Акуны-Мататы", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/timon.jpg" },
    { id: 45, name: "Белоснежка", desc: "Любительница яблок", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/belosnezhka.jpg" },
    { id: 46, name: "Геркулес", desc: "Полубог", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/gerkules.jpg" },
    { id: 47, name: "Балу", desc: "Мастер маскировки", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/balu.jpg" },
    { id: 48, name: "Шрам", desc: "Коварный дядя", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/shram.jpg" },
    { id: 49, name: "Рогатый Король", desc: "Повелитель армии мертвых", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/rog.jpg" },
    { id: 50, name: "Злая королева", desc: "Не прекрасней всех на свете", img: "https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/collection/evil.jpg" }
];

let userCollection = [];
let currentCollectionFigure = null;
let collectionPhotos = [];
// ==========================================
// КОЛЛЕКЦИЯ РАСКРАСОК
// ==========================================

const DEFAULT_COLORING_BOOKS = {
    paint_by_number: [
        "Les Grands Classiques tome 1",
        "Les Grands Classiques tome 2",
        "Les Grands Classiques tome 3",
        "Les Grands Classiques tome 4",
        "Les Grands Classiques tome 5",
        "Les Grands Classiques tome 6",
        "Les Grands Classiques tome 7",
        "Les Grands Classiques tome 8",
        "Les Grands Classiques tome 9",
        "Les Grands Classiques tome 10",
        "Les Grands Classiques tome 11",
        "Les Grands Classiques tome 12",
        "Les Grands Classiques tome 13",
        "Mondes Fantastiques",
        "Les Grands Classiques Spécial Débutants vol. 1",
        "Les Grands Classiques Spécial Débutants vol. 2",
        "Princesses tome 1",
        "Princesses tome 2",
        "Les Schtroumpfs tome 1",
        "Les Schtroumpfs tome 2",
        "Pixar tome 1",
        "Pixar tome 2",
        "Vitraux tome 1",
        "Vitraux tome 2",
        "Saisons",
        "Hiver",
        "MickeyDonald&Co",
        "Mickey&Friends",
        "Famille",
        "Portraits de famille",
        "Fees, Sorciers et Magiciens",
        "Creatures Fantastiques",
        "Petites princesses",
        "Chevaux",
        "Babies",
        "Trompe l'oeil babies",
        "Girl power",
        "Princes&Heros",
        "Love stories",
        "Sous L'Ocean",
        "Mechants",
        "Heros&Mechants la battle",
        "Bestiaire",
        "Bestiaire triangles",
        "Nature",
        "Marsupilami",
        "L'age de glacé",
        "Pokémon",
        "Les Grands Classiques au numero",
        "Les Grands Classiques Special portraits",
        "La petite Sirene",
        "Romantasy",
        "Scooby-Doo",
        "Portraits",
        "Petites Poupees",
        "Mandalas",
        "Portraits grand carre",
        "Bebes animaux",
        "Grands Classiques",
        "Trompe L'oeil grand bloc",
        "Trompe L'oeil grand bloc tome 2",
        "Petites Betes",
        "Best of nature",
        "Best of babies",
        "Best of bestiaire",
        "Best of Les Grands Classiques",
        "Best of love stories",
        "Best of heroines",
        "Best of mechants",
        "Best of Pixar",
        "Grands classiques colliector 10",
        "Princesses colliector",
        "La Belle et la Bete",
        "Raiponce",
        "Looney tunes tome 1",
        "Looney tunes tome 2",
        "Looney tunes tome 3",
        "Les grands classiques au numero tome 2",
        "Stitch au numero",
        "Lilo et Stitch",
        "Chats&Felins",
        "Chiots&Chiens",
        "Trompe L'oeil tome 1",
        "Trompe L'oeil tome 2",
        "Trompe L'oeil tome 3",
        "Trompe L'oeil heros vs mechants",
        "Mangas",
         "Mangas tome 2",
        "Totally Spies",
        "Winx club",
        "Vaiana",
        "Vaiana new edition",
        "Tres grands classiques",
         "Tres grands classiques tome 2",
        "Babies cercles",
        "Barbie",
        "Bisounours",
         "Bisounours tome 2",
        "Boule&Bill",
        "Star wars",
        "100% Simba",
        "100% Panpan",
        "100% Winnie", 
        "100% Stitch",
        "200% Stitch",
        "300% Stitch",
        "100% Angel",
        "100% Grogu",
        "Messages mysteres Disney",
        "Messages mysteres",
        "Harry Potter au numero",
        "Sorciers",
        "Fantasy",
        "Mythes du monde",
        "Coloriages au symbole tome 1",
        "Coloriages au symbole tom2 2",
        "Fleurs tome 1",
        "Fleurs tome 2",
        "Contes de fees",
        "Pensees positives",
        "Escapades merveilleuses autour du monde",
        "Escapades merveilleuses douce France",
        "Tour du monde",
        "Tresors du japon",
        "Voyages autour du monde Le Routard",
        "Tableaux de maitres",
        "Les grands classiques de la litterature",
        "Affiches de pub",
        "Affiches vintages",
        "50 coloriages mysteres",
        "Costumes du monde",
        "Ombres&Lumiers",
        "Animaux fantastiques",
        "Oceans",
        "Safari",
        "Nature mysteres",
        "Nature sauvage",
        "Japon",
        "Tropiques",
        "Jardins extraordinaires",
        "Triangles magiques",
        "Trompe L'oeil mysteres",
        "Chats",
        "Chats and Felins",
        "Arbres du monde",
        "Serenite",
        "Monde sauvage",
        "100 nouveaux coloriages mysteres",
        "Animaux adorables",
        "100 coloriages mysteres inedits",
        "100 nouveaux cercles magiques",
        "Animaux du monde special debutants",
        "Bebes animaux mysteres",
        "Hiver enchanteur",
        "Animaux extraordinaires"
        
    ],
    alcohol: [
        "Cozy days Coco Wyo",
        "Comfy corner Coco Wyo",
        "Little corner Coco Wyo",
        "Girl moments Coco Wyo",
        "Cozy corner Coco Wyo",
        "Girl moments vol. 2 Coco Wyo",
        "Cozy friends Coco Wyo",
        "Cozy cuties Coco Wyo",
        "Little cuddles Coco Wyo",
        "Cozy vibes Coco Wyo",
        "Stress relief Coco Wyo",
        "Into gardens Coc Wyo",
        "Comfy days Coco Wyo",
        "Cozy christmas Coco Wyo",
        "Little spooky Coco Wyo",
        "Hygge place Coco Wyo",
        "Spooky cutie Coco Wyo",
        "Lala friends Coco Wyo",
        "Spooky cutie vol. 2 Coco Wyo",
        "Cozy capybara Coco Wyo",
        "Ocean scene Coco Wyo",
        "The little cat Coco Wyo",
        "Glow cosmetics Coco Wyo",
        "Selfcare Coco Wyo",
        "Pocket world Coco Wyo",
        "Cozy spaces Coco Wyo",
        "Cozy season Coco Wyo",
        "Simple art Coco Wyo",
        "Silly crimes Coco Wyo",
        "Little friends Coco Wyo",
        "Food, drinks & sweets Coco Wyo",
        "Cozy&Cute Coco Wyo",
        "Cute&groovy Coco Wyo",
        "Fashion vibes Coco Wyo",
        "Cozy romantasy Jade Summer",
        "Cozy Japan Jade Summer",
        "Cozy France Jade Summer",
        "Cozy Europe Jade Summer",
        "Cozy moms Jade Summer",
        "Cozy fashion Jade Summer",
        "Cozy jobs Jade Summer",
        "Cozy hawaii Jade Summer",
        "Cozy places Jade Summer",
        "Cozy kingdom Jade Summer",
        "Cat crimes Jade Summer",
        "Retro rooms Jade Summer",
        "Cozy eras Jade Summer",
        "Cozy eras 2 Jade Summer",
        "Spooky life Jade Summer",
        "Cozy k-pop Jade Summer",
        "Comfy&cozy Jade Summer",
        "Spooky moments Jade Summer",
        "Cozy life Jade Summer",
        "Spooky Christmas Jade Summer",
        "Merry christmas Jade Summer",
        "Cozy animals Jade Summer",
        "Witchy vibes Jade Summer",
        "100 bold&easy Jade Summer",
        "Fall vibes Jade Summer",
        "Cute&sweet Jade Summer",
        "Christmas Jade Summer",
        "Cozy country Jade Summer",
        "Little friends Southern Lotus",
        "Fuzzy in love Southern Lotus",
        "Little fuzzy Southern Lotus",
        "Comfy vibes Southern Lotus",
        "Fuzzy fantasy Southern Lotus",
        "Fantasy land Southern Lotus",
        "Dreamy friends Southern Lotus",
        "Girl things Southern Lotus",
        "Breakfast club Southern Lotus",
        "Cozy times Southern Lotus",
        "Little cozy Southern Lotus",
        "Calm days Southern Lotus",
        "Fuzzy cuties Southern Lotus",
        "Little comfy Southern Lotus",
        "Girl spaces Southern Lotus",
        "Fuzzy hygge Vivi Tinta",
        "Animals Vivi Tinta",
        "Girl's day Vivi Tinta",
        "Fuzzy life Vivi Tinta",
        "Fuzzy tales Vivi Tinta",
        "Fuzzy friends Vivi Tinta",
        "Cat mom Vivi Tinta",
        "Cozy home Vivi Tinta",
        "Calmness Vivi Tinta",
        "Comfy girl Vivi Tinta",
        "Soft life Vivi Tinta",
        "Sweetheart Vivi Tinta",
        "Buzzy buddy Vivi Tinta",
        "Fuzzy hygge christmas Vivi Tinta",
        "Christmas Vivi Tinta",
        "Spooky ville Vivi Tinta",
        "Merry lights Vivi Tinta",
        "Relaxation Vivi Tinta",
        "Food&sweet Vivi Tinta",
        "Bulle de douceur Hachette",
        "Instants magiques Hachette",
        "Stitch&friends Hachette",
        "Amis pour la vie Hachette",
        "Tour du monde Hachette",
        "Instants secrets Hachette",
        "Capybaras calins Hachette",
        "Une vie de chat Hachette",
        "Infinie galaxie Hachette",
        "Contes&legendes Hachette",
        "Japon kawai Hachette",
        "Pause cocooning Hachette",
        "Enquete au poil Hachette",
        "Doux printemps Hachette",
        "Mon coin cozy Hachette",
        "Instants malicieux Hachette",
        "En famille Hachette",
        "Moments tout doux Hachette",
        "Gouters calins Hachette",
        "Contes de fees Hachette",
        "Noel enchante Hachette",
        "Bulle d'amour Hachette",
        "Tout petit monde Hachette",
        "Automne spooky Hachette",
        "Chatons trop mignons Hachette",
        "Quete enchantee Hachette",
        "Hiver douillet Hachette",
        "Reves tout doux Hachette",
        "Au bord de l'eau Hachette",
        "Petits bonheurs Hachette",
        "Chats spooky Hachette",
        "Reves kawai Hachette",
        "Boules de poils Hachette",
        "Douceurs d'ete Hachette",
        "Moments calins Hachette",
        "Soupcon d'amour Hachette",
        "Mes meilleures amies Hachette",
        "Jardins secrets Hachette",
        "Pause douceur Hachette Bisounours",
        "Pause douceur Hello Kitty Hachette",
         "Mini-mondes Hachette",
         "Pause detente Hachette",
         "Winnie l'Ourson Hachette",
        "Sunny cuties Bogiki",
        "Cozy crime scene Mira Luna and Jojo Weirdo"
    ],
    pencil: [
        "Adorables petites poupees",
        "Petites poupees for pencils",
        "4 Saisons",
        "Thomas Kinkade Celebrations",
        "Thomas Kinkade Disney princesses",
        "Thomas Kinkade Coloring book"
    ],
    custom: []
};

const DEFAULT_COVERS = {
    // Раскраски по номерам
    "Les Grands Classiques tome 1": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/tom1.png",
    "Les Grands Classiques tome 2": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/tom2.jpg",
    "Les Grands Classiques tome 3": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/tom3.jpg",
    "Les Grands Classiques tome 4": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/tom4.jpg",
    "Les Grands Classiques tome 5": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/tom5.jpg",
    "Les Grands Classiques tome 6": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/tom6.jpg",
    "Les Grands Classiques tome 7": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/tom7.jpg",
    "Les Grands Classiques tome 8": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/tom8.jpg",
    "Les Grands Classiques tome 9": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/tom9.jpg",
    "Les Grands Classiques tome 10": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/tom10.jpg",
    "Les Grands Classiques tome 11": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/tom11.jpg",
    "Les Grands Classiques tome 12": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/tom12.jpg",
    "Les Grands Classiques tome 13": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/tom13.jpg",
    "Mondes Fantastiques": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/mondesfantastiques.jpg",
    "Les Grands Classiques Spécial Débutants vol. 1": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/debutants.jpg",
    "Les Grands Classiques Spécial Débutants vol. 2": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/debutants2.jpg",
    "Princesses tome 1": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/princesses.jpg",
    "Princesses tome 2": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/princesses2.jpg",
    "Les Schtroumpfs tome 1": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/les1.jpg",
    "Les Schtroumpfs tome 2": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/les2.jpg",
    "Pixar tome 1": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/pixar.jpg",
    "Pixar tome 2": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/pixar2.jpg",
    "Vitraux tome 1": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/vitraux1.jpg",
    "Vitraux tome 2": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/vitraux2.jpg",
    "Saisons": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/saisons.jpg",
    "Hiver": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/hiver.jpg",
    "MickeyDonald&Co": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/mickey1.jpg",
    "Mickey&Friends": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/mickey2.jpg",
    "Famille": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/famille.jpg",
    "Portraits de famille": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/famille2.jpg",
    "Fees, Sorciers et Magiciens": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/feesmagicians.jpg",
    "Creatures Fantastiques": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/creaturesfantastiques.jpg",
    "Petites princesses":"https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/petitesprincesses.jpg",
    "Chevaux": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/hors.jpg",
    "Babies": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/babies.jpg",
    "Trompe l'oeil babies": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/trompebabies.jpg",
    "Girl power": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/girlpower.jpg",
    "Princes&Heros": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/princes.jpg",
    "Love stories": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/lovestories.jpg",
    "Sous L'Ocean": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/ocean.jpg",
    "Mechants": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/mechants.jpg",
    "Heros&Mechants la battle": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/herosmechants.jpg",
    "Bestiaire": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/bestiaire.jpg",
    "Bestiaire triangles": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/bestiairetriangles.jpg",
    "Nature": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/nature.jpg",
    "Marsupilami": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/marsupilami.jpg",
    "L'age de glacé": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/glace.jpg",
    "Pokémon": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/pokemon.jpg",
    "Les Grands Classiques au numero": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/classiquesau.jpg",
    "Les Grands Classiques Special portraits": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/grandsportraits.jpg",
    "La petite Sirene": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/lapetite.jpg",
    "Romantasy": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/romantasy.jpg",
    "Scooby-Doo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/scooby.jpg",
     "Portraits": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/portraits.jpg",
    "Petites Poupees": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/poupees.jpg",
    "Mandalas": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/mandalas.jpg",
    "Portraits grand carre": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/portraitsgrandcarre.jpg",
    "Bebes animaux": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/bebesanimaux.jpg",
    "Grands Classiques": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/grandsclassiques.jpg",
        "Trompe L'oeil grand bloc": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/trompegrand.jpg",
        "Trompe L'oeil grand bloc tome 2": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/IMG_7556.jpg",
        "Petites Betes": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/petitesbetes.jpg",
        "Best of nature": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/IMG_7557.jpg",
        "Best of babies": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/bestofbabies.jpg",
        "Best of bestiaire": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/bestofbestiaire.jpg",
        "Best of Les Grands Classiques": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/bestofclassiques.jpg",
        "Best of love stories": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/bestoflovestories.jpg",
        "Best of heroines": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/bestofheroines.jpg",
        "Best of mechants": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/bestofmechants.jpg",
        "Best of Pixar": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/bestofpixar.jpg",
        "Grands classiques colliector 10": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/colliector10.jpg",
        "Princesses colliector": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/princessescolliector.jpg",
        "La Belle et la Bete": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/labelleetlabete.jpg",
        "Raiponce": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/raiponce.jpg",
        "Looney tunes tome 1": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/looney.jpg",
        "Looney tunes tome 2": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/looney2.jpg",
        "Looney tunes tome 3": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/looney3.jpg",
        "Les grands classiques au numero tome 2": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/au2.jpg",
        "Stitch au numero": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/stitchau.jpg",
        "Lilo et Stitch": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/liloetstitch.jpg",
        "Chats&Felins": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/cats.jpg",
        "Chiots&Chiens": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/dogs.jpg",
        "Trompe L'oeil tome 1": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/trompe1.jpg",
        "Trompe L'oeil tome 2": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/trompe2.jpg",
        "Trompe L'oeil tome 3": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/trompe3.jpg",
        "Trompe L'oeil heros vs mechants": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/trompeheros.jpg",
        "Mangas": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/mangas.jpg",
     "Mangas tome 2": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/mangas2.png",
        "Totally Spies": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/totaly.jpg",
         "Winx club": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/winx.jpg",
        "Vaiana": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/vaiana.jpg",
     "Vaiana new edition": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/vaiana2.png",
        "Tres grands classiques": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/tresgrands.jpg",
     "Tres grands classiques tome 2": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/tresgrands2.png",
        "Babies cercles": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/babiescircles.jpg",
        "Barbie": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/barbie.jpg",
        "Bisounours": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/bears.jpg",
    "Bisounours tome 2": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/bears2.png",
        "Boule&Bill": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/boule.jpg",
 "Star wars": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/starwars.jpg",
        "100% Simba": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/100simba.jpg",
        "100% Panpan": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/100panpan.jpg",
        "100% Winnie": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/100winnie.jpg", 
        "100% Stitch": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/100stitch.jpg",
        "200% Stitch": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/200stitch.jpg",
        "300% Stitch": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/300stitch.jpg",
        "100% Angel": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/100angel.jpg",
        "100% Grogu": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/100grogu.png",
        "Messages mysteres Disney": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/messagesmysteres.jpg",
        "Messages mysteres": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/messages.jpg",
        "Harry Potter au numero": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/hp.jpg",
        "Sorciers": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/sorciers.jpg",
        "Fantasy": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/fantasy.jpg",
        "Mythes du monde": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/mythes.jpg",
        "Coloriages au symbole tome 1": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/symbole.jpg",
        "Coloriages au symbole tom2 2": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/symbole2.jpg",
        "Fleurs tome 1": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/fleursorange.jpg",
        "Fleurs tome 2": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/fleursred.jpg",
        "Contes de fees": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/contesdefees.jpg",
        "Pensees positives": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/positives.jpg",
        "Escapades merveilleuses autour du monde": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/escapades.jpg",
        "Escapades merveilleuses douce France": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/nice.jpg",
        "Tour du monde": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/tourdumonde.jpg",
        "Tresors du japon": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/tresorsdujapon.jpg",
        "Voyages autour du monde Le Routard": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/voyages.jpg",
        "Tableaux de maitres": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/maitres.jpg",
        "Les grands classiques de la litterature": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/litterature.jpg",
        "Affiches de pub": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/affichies.jpg",
        "Affiches vintages": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/vintage.jpg",
        "50 coloriages mysteres": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/50mysteres.jpg",
        "Costumes du monde": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/costumes.jpg",
        "Ombres&Lumiers": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/ombres.jpg",
        "Animaux fantastiques": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/animauxfantastiques.jpg",
        "Oceans": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/oceans.jpg",
        "Safari": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/safari.jpg",
        "Nature mysteres": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/natureflamingo.jpg",
        "Nature sauvage": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/naturesauvage.jpg",
        "Japon": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/japon.jpg",
        "Tropiques": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/tropiques.jpg",
        "Jardins extraordinaires": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/jardins.jpg",
        "Triangles magiques": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/trianglesmagiques.jpg",
        "Trompe L'oeil mysteres": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/trompeparakeet.jpg",
        "Chats": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/chats.jpg",
        "Chats and Felins": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/chatsfelins.jpg",
        "Arbres du monde": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/arbresdumonde.jpg",
        "Serenite": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/serenite.jpg",
        "Monde sauvage": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/mondesauvage.jpg",
        "100 nouveaux coloriages mysteres": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/100noveaux.jpg",
        "Animaux adorables": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/adorables.jpg",
        "100 coloriages mysteres inedits": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/100mysteres.jpg",
        "100 nouveaux cercles magiques": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/100cercles.jpg",
        "Animaux du monde special debutants": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/animauxdumonde.jpg",
        "Bebes animaux mysteres": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/bebesanimaux1.jpg",
        "Hiver enchanteur": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/enchanteur.jpg",
        "Animaux extraordinaires": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/extraordinaries.jpg",
    
    // Спиртовые раскраски (будут добавлены позже)
   "Cozy days Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c1.jpg",
        "Comfy corner Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c2.jpg",
        "Little corner Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c3.jpg",
        "Girl moments Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c4.jpg",
        "Cozy corner Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c5.jpg",
        "Girl moments vol. 2 Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c6.jpg",
        "Cozy friends Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c7.jpg",
        "Cozy cuties Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c8.jpg",
        "Little cuddles Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c9.jpg",
        "Cozy vibes Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c10.jpg",
        "Stress relief Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c11.jpg",
        "Into gardens Coc Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c12.jpg",
        "Comfy days Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c13.jpg",
        "Cozy christmas Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c14.jpg",
        "Little spooky Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c15.jpg",
        "Hygge place Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c16.jpg",
        "Spooky cutie Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c19.jpg",
        "Lala friends Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c18.jpg",
        "Spooky cutie vol. 2 Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c17.jpg",
        "Cozy capybara Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c20.jpg",
        "Ocean scene Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c21.jpg",
        "The little cat Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c22.jpg",
        "Glow cosmetics Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c23.jpg",
        "Selfcare Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c24.jpg",
        "Pocket world Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c25.jpg",
        "Cozy spaces Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c26.jpg",
        "Cozy season Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c27.jpg",
        "Simple art Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c28.jpg",
        "Silly crimes Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c30.jpg",
        "Little friends Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c31.jpg",
        "Food, drinks & sweets Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c32.jpg",
        "Cozy&Cute Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c33.jpg",
        "Cute&groovy Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c34.jpg",
        "Fashion vibes Coco Wyo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/c35.jpg",
        "Cozy romantasy Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j1.jpg",
        "Cozy Japan Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j2.jpg",
        "Cozy France Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j3.jpg",
        "Cozy Europe Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j4.jpg",
        "Cozy moms Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j5.jpg",
        "Cozy fashion Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j6.jpg",
        "Cozy jobs Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j7.jpg",
        "Cozy hawaii Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j8.jpg",
        "Cozy places Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j9.jpg",
        "Cozy kingdom Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j10.jpg",
        "Cat crimes Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j11.jpg",
        "Retro rooms Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j12.jpg",
        "Cozy eras Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j13.jpg",
        "Cozy eras 2 Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j14.jpg",
        "Spooky life Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j15.jpg",
        "Cozy k-pop Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j16.jpg",
        "Comfy&cozy Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j17.jpg",
        "Spooky moments Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j18.jpg",
        "Cozy life Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j19.jpg",
        "Spooky Christmas Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j20.jpg",
        "Merry christmas Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j21.jpg",
        "Cozy animals Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j22.jpg",
        "Witchy vibes Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j23.jpg",
        "100 bold&easy Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j24.jpg",
        "Fall vibes Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j25.jpg",
        "Cute&sweet Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j26.jpg",
        "Christmas Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j27.jpg",
        "Cozy country Jade Summer": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/j28.jpg",
        "Little friends Southern Lotus": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/l1.jpg",
        "Fuzzy in love Southern Lotus": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/l2.jpg",
        "Little fuzzy Southern Lotus": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/l3.jpg",
        "Comfy vibes Southern Lotus": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/l4.jpg",
        "Fuzzy fantasy Southern Lotus": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/l5.jpg",
        "Fantasy land Southern Lotus": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/l6.jpg",
        "Dreamy friends Southern Lotus": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/l7.jpg",
        "Girl things Southern Lotus": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/l8.jpg",
        "Breakfast club Southern Lotus": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/l9.jpg",
        "Cozy times Southern Lotus": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/l10.jpg",
        "Little cozy Southern Lotus": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/l11.jpg",
        "Calm days Southern Lotus": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/l12.jpg",
        "Fuzzy cuties Southern Lotus": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/l13.jpg",
        "Little comfy Southern Lotus": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/l14.jpg",
        "Girl spaces Southern Lotus": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/l15.jpg",
        "Fuzzy hygge Vivi Tinta": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/v1.jpg",
        "Animals Vivi Tinta": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/v2.jpg",
        "Girl's day Vivi Tinta": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/v3.jpg",
        "Fuzzy life Vivi Tinta": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/v4.jpg",
        "Fuzzy tales Vivi Tinta": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/v5.jpg",
        "Fuzzy friends Vivi Tinta": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/v6.jpg",
        "Cat mom Vivi Tinta": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/v7.jpg",
        "Cozy home Vivi Tinta": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/v8.jpg",
        "Calmness Vivi Tinta": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/v9.jpg",
        "Comfy girl Vivi Tinta": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/v10.jpg",
        "Soft life Vivi Tinta": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/v11.jpg",
        "Sweetheart Vivi Tinta": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/v12.jpg",
        "Buzzy buddy Vivi Tinta": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/v13.jpg",
        "Fuzzy hygge christmas Vivi Tinta": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/v14.jpg",
        "Christmas Vivi Tinta": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/v15.jpg",
        "Spooky ville Vivi Tinta": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/v16.jpg",
        "Merry lights Vivi Tinta": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/v17.jpg",
        "Relaxation Vivi Tinta": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/v18.jpg",
        "Food&sweet Vivi Tinta": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/v19.jpg",
        "Bulle de douceur Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h1.jpg",
        "Instants magiques Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h2.jpg",
        "Stitch&friends Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h3.jpg",
        "Amis pour la vie Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h4.jpg",
        "Tour du monde Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h5.jpg",
        "Instants secrets Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h6.jpg",
        "Capybaras calins Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h7.jpg",
        "Une vie de chat Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h8.jpg",
        "Infinie galaxie Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h9.jpg",
        "Contes&legendes Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h10.jpg",
        "Japon kawai Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h11.jpg",
        "Pause cocooning Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h12.jpg",
        "Enquete au poil Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h13.jpg",
        "Doux printemps Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h14.jpg",
        "Mon coin cozy Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h15.jpg",
        "Instants malicieux Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h16.jpg",
        "En famille Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h17.jpg",
        "Moments tout doux Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h18.jpg",
        "Gouters calins Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h19.jpg",
        "Contes de fees Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h20.jpg",
        "Noel enchante Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h21.jpg",
        "Bulle d'amour Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h22.jpg",
        "Tout petit monde Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h23.jpg",
        "Automne spooky Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h24.jpg",
        "Chatons trop mignons Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h25.jpg",
        "Quete enchantee Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h26.jpg",
        "Hiver douillet Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h27.jpg",
        "Reves tout doux Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h28.jpg",
        "Au bord de l'eau Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h29.jpg",
        "Petits bonheurs Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h30.jpg",
        "Chats spooky Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h31.jpg",
        "Reves kawai Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h32.jpg",
        "Boules de poils Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h33.jpg",
        "Douceurs d'ete Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h34.jpg",
        "Moments calins Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h35.jpg",
        "Soupcon d'amour Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h36.jpg",
        "Mes meilleures amies Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h37.jpg",
        "Jardins secrets Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h38.jpg",
        "Pause douceur Hachette Bisounours": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h39.jpg",
        "Pause douceur Hello Kitty Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h40.jpg",
     "Mini-mondes Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h41.jpg",
     "Pause detente Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h42.png",
     "Winnie l'Ourson Hachette": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/h43.png",
    "Sunny cuties Bogiki": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/bogiki1.png",
"Cozy crime scene Mira Luna and Jojo Weirdo": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/crime1.jpg",

    
    // Раскраски для карандашей (будут добавлены позже)
    
    "Adorables petites poupees": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/adorablespetitespoupees.jpg",
        "Petites poupees for pencils": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/petitespoupeespencil.jpg",
        "4 Saisons": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/4saisons.jpg",
        "Thomas Kinkade Celebrations": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/thomas3.jpg",
        "Thomas Kinkade Disney princesses": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/thomas.jpg",
        "Thomas Kinkade Coloring book": "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/covers/thomas2.jpg"
};

let userColoringBooks = {
    paint_by_number: [],
    alcohol: [],
    pencil: [],
    custom: []
};

let selectedCoverFile = null;
async function loadCollection() {
    console.log('📦 Loading collection...');
    
    // Сначала пробуем загрузить с сервера
    try {
        const response = await fetch(`${SERVER_URL}/api/get_collection?user_id=${userId}`);
        
        if (response.ok) {
            const serverCollection = await response.json();
            console.log('📡 Server collection:', serverCollection);
            
            if (serverCollection && Array.isArray(serverCollection)) {
                userCollection = COLLECTION_FIGURES.map(f => ({ 
                    id: f.id, 
                    unlocked: serverCollection.includes(f.id.toString()) || 
                              serverCollection.includes(f.id)
                }));
                localStorage.setItem(`collection_${userId}`, JSON.stringify(userCollection));
                console.log('✅ Loaded from server');
            } else {
                loadCollectionFromLocal();
            }
        } else {
            loadCollectionFromLocal();
        }
    } catch (error) {
        console.error('❌ Error loading from server:', error);
        loadCollectionFromLocal();
    }
    
    renderCollection();
}

function loadCollectionFromLocal() {
    const saved = localStorage.getItem(`collection_${userId}`);
    if (saved) {
        try {
            userCollection = JSON.parse(saved);
            console.log('✅ Loaded from localStorage');
        } catch(e) {
            userCollection = COLLECTION_FIGURES.map(f => ({ id: f.id, unlocked: false }));
        }
    } else {
        userCollection = COLLECTION_FIGURES.map(f => ({ id: f.id, unlocked: false }));
    }
    localStorage.setItem(`collection_${userId}`, JSON.stringify(userCollection));
}
async function checkCollectionUpdates() {
    try {
        const response = await fetch(`${SERVER_URL}/api/get_collection?user_id=${userId}`);
        
        if (!response.ok) return;
        
        const serverCollection = await response.json();
        
        if (serverCollection && Array.isArray(serverCollection)) {
            let hasChanges = false;
            
            // Проверяем каждую фигурку
            COLLECTION_FIGURES.forEach(figure => {
                const localFigure = userCollection.find(f => f.id === figure.id);
                const isUnlockedOnServer = serverCollection.includes(figure.id.toString()) || 
                                           serverCollection.includes(figure.id);
                
                // Если на сервере открыта, а локально нет — обновляем
                if (isUnlockedOnServer && localFigure && !localFigure.unlocked) {
                    localFigure.unlocked = true;
                    hasChanges = true;
                    console.log(`🎉 Figure ${figure.id} (${figure.name}) unlocked by admin!`);
                    
                    // Показываем уведомление
                    if (tg) {
                        tg.showAlert(`🎉 Фигурка "${figure.name}" открыта!`);
                    }
                }
            });
            
            if (hasChanges) {
                // Сохраняем обновлённую коллекцию
                localStorage.setItem(`collection_${userId}`, JSON.stringify(userCollection));
                
                // Перерисовываем если вкладка коллекции активна
                const activePage = document.querySelector('.page.active');
                if (activePage && activePage.id === 'collection') {
                    renderCollection();
                }
                
                // Обновляем счётчик в навигации если нужно
                updateCollectionBadge();
            }
        }
    } catch (error) {
        console.error('Error checking collection updates:', error);
    }
}

function updateCollectionBadge() {
    const unlockedCount = userCollection.filter(f => f.unlocked).length;
    const totalCount = COLLECTION_FIGURES.length;
    const statsEl = document.getElementById('collectionStats');
    if (statsEl) statsEl.innerText = `${unlockedCount}/${totalCount}`;
}

function renderCollection() {
    const container = document.getElementById('collectionGrid');
    if (!container) return;
    if (!userCollection.length) loadCollection();
    
    container.innerHTML = '';
    let unlockedCount = 0;
    
    COLLECTION_FIGURES.forEach(figure => {
        const figureData = userCollection.find(c => c.id === figure.id);
        const isUnlocked = figureData ? figureData.unlocked : false;
        if (isUnlocked) unlockedCount++;
        
        const card = document.createElement('div');
        card.className = 'collection-card';
        card.onclick = () => openFigureModal(figure, isUnlocked);
        
        card.innerHTML = `
            <div class="collection-card-image">
                <img src="${figure.img}" 
                     class="${!isUnlocked ? 'locked' : ''}" 
                     alt="${figure.name}"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23ff9500%22 rx=%2212%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2240%22%3E🎁%3C/text%3E%3C/svg%3E'">
                ${!isUnlocked ? `
                    <div class="lock-overlay">
                        <i class="fas fa-lock"></i>
                    </div>
                ` : ''}
            </div>
            <div class="collection-card-name">${figure.name}</div>
            <div class="collection-card-status ${isUnlocked ? 'unlocked' : 'locked'}">
                ${isUnlocked ? '✅ Открыта' : '🔒 Не открыта'}
            </div>
        `;
        
        container.appendChild(card);
    });
    
    const countSpan = document.getElementById('collectionCount');
    if (countSpan) countSpan.innerText = `${unlockedCount}/${COLLECTION_FIGURES.length}`;
    updateCollectionBadge();
}

function openFigureModal(figure, isUnlocked) {
    currentCollectionFigure = figure;
    
    const oldModal = document.getElementById('figureDetailModal');
    if (oldModal) oldModal.remove();
    
    const modalHtml = `
        <div id="figureDetailModal" class="modal-overlay" style="display: flex;">
            <div class="modal-content" style="max-width: 350px; text-align: center;">
                <h3 style="margin-bottom: 10px;">${figure.name}</h3>
                
                <div class="figure-modal-img-container">
                    <img src="${figure.img}" 
                         class="figure-modal-img ${!isUnlocked ? 'locked-img' : ''}" 
                         alt="${figure.name}"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect width=%22150%22 height=%22150%22 fill=%22%23ff9500%22/%3E%3Ctext x=%2275%22 y=%2275%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2240%22%3E🎁%3C/text%3E%3C/svg%3E'">
                    ${!isUnlocked ? `
                        <div class="figure-modal-lock">
                            <i class="fas fa-lock"></i>
                        </div>
                    ` : ''}
                </div>
                
                <p style="margin: 15px 0; color: var(--text-gray);">${figure.desc}</p>
                
                <div class="figure-status ${isUnlocked ? 'unlocked' : 'locked'}">
                    ${isUnlocked ? '✅ Открыта' : '🔒 Не открыта'}
                </div>
                
                ${!isUnlocked ? `
                    <input type="file" id="collectionFileInput" accept="image/*" multiple style="display: none;">
                    <button id="collectionUploadBtn" style="width: 100%; background: var(--accent); color: white; border: none; padding: 12px; border-radius: 30px; font-weight: 600; margin-top: 15px; cursor: pointer;">
                        <i class="fas fa-camera"></i> Выбрать фото
                    </button>
                    <div id="collectionPreviewArea" class="figure-preview-container" style="display: none;"></div>
                    <button id="collectionSendBtn" style="display: none; width: 100%; background: var(--status-green); color: white; border: none; padding: 12px; border-radius: 30px; font-weight: 600; margin-top: 10px; cursor: pointer;">
                        <i class="fas fa-paper-plane"></i> Отправить на проверку
                    </button>
                ` : ''}
                
                <button class="modal-close-btn" onclick="document.getElementById('figureDetailModal').remove()" style="width: 100%; margin-top: 15px;">Закрыть</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    if (!isUnlocked) {
        const fileInput = document.getElementById('collectionFileInput');
        const uploadBtn = document.getElementById('collectionUploadBtn');
        const previewArea = document.getElementById('collectionPreviewArea');
        const sendBtn = document.getElementById('collectionSendBtn');
        
        collectionPhotos = [];
        
        uploadBtn.onclick = () => fileInput.click();
        
        fileInput.onchange = (event) => {
            collectionPhotos = Array.from(event.target.files);
            previewArea.innerHTML = '';
            
            if (collectionPhotos.length > 0) {
                collectionPhotos.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        previewArea.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                });
                previewArea.style.display = 'flex';
                sendBtn.style.display = 'block';
            }
        };
        
        sendBtn.onclick = async () => {
            if (!collectionPhotos.length) {
                if (tg) tg.showAlert('❌ Выберите хотя бы одно фото');
                return;
            }
            
            sendBtn.disabled = true;
            sendBtn.innerText = '⏳ Отправка...';
            
            try {
                const formData = new FormData();
                formData.append('user', userId.toString());
                formData.append('figureId', figure.id.toString());
                formData.append('figureName', figure.name);
                formData.append('type', 'collection');
                
                for (let i = 0; i < collectionPhotos.length; i++) {
                    formData.append('photos', collectionPhotos[i]);
                }
                
                const response = await fetch(`${SERVER_URL}/api/check_collection`, {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) throw new Error(`Ошибка ${response.status}`);
                
                const result = await response.json();
                
                if (result && result.status === 'ok') {
                    if (tg) {
                        tg.showAlert('✅ Фото отправлено на проверку! Ожидайте подтверждения.');
                        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
                    }
                    document.getElementById('figureDetailModal').remove();
                    
                    // Запускаем проверку обновлений через 3 секунды
                    setTimeout(() => {
                        if (typeof checkCollectionUpdates === 'function') {
                            checkCollectionUpdates();
                        }
                    }, 3000);
                } else {
                    throw new Error(result?.message || 'Ошибка отправки');
                }
            } catch (error) {
                console.error('Ошибка:', error);
                if (tg) tg.showAlert(`❌ ${error.message}`);
            } finally {
                sendBtn.disabled = false;
                sendBtn.innerText = 'Отправить на проверку';
            }
        };
    }
}
        // ==========================================
        // ПОИСК МАРКЕРОВ В ОРГАНАЙЗЕРАХ
        // ==========================================
        
        function searchMarkerInOrganizers() {
    const searchInput = document.getElementById('markerSearchInOrganizers');
    const resultsDiv = document.getElementById('markerSearchResults');
    
    if (!searchInput || !resultsDiv) return;
    
    const query = searchInput.value.trim().toLowerCase();
    
    if (query.length === 0) {
        resultsDiv.style.display = 'none';
        return;
    }
    
    const results = [];
    
    if (inventory.organizers) {
        inventory.organizers.forEach(org => {
            if (org.cells) {
                for (let row = 0; row < org.rows; row++) {
                    for (let col = 0; col < org.cols; col++) {
                        const cell = org.cells[row]?.[col];
                        if (cell && cell.length > 0) {
                            cell.forEach(marker => {
                                const markerNumber = String(marker.number).toLowerCase();
                                const markerBrand = String(marker.brand).toLowerCase();
                                const markerSubcategory = marker.subcategory ? String(marker.subcategory).toLowerCase() : '';
                                
                                if (markerNumber.includes(query) || markerBrand.includes(query) || markerSubcategory.includes(query)) {
                                    results.push({
                                        orgId: org.id,
                                        orgName: org.name,
                                        brand: marker.brand,
                                        number: marker.number,
                                        subcategory: marker.subcategory || null,
                                        count: marker.count,
                                        row: row,
                                        col: col,
                                        cellLabel: String.fromCharCode(65 + row) + (col + 1)
                                    });
                                }
                            });
                        }
                    }
                }
            }
        });
    }
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results-found">🔍 Маркер не найден</div>';
        resultsDiv.style.display = 'block';
        return;
    }
    
    // Группируем по бренду, подкатегории и номеру
    const groupedResults = {};
    results.forEach(res => {
        const key = res.subcategory ? `${res.brand}_${res.subcategory}_${res.number}` : `${res.brand}_${res.number}`;
        if (!groupedResults[key]) {
            groupedResults[key] = {
                brand: res.brand,
                subcategory: res.subcategory,
                number: res.number,
                totalCount: 0,
                locations: []
            };
        }
        groupedResults[key].totalCount += res.count;
        groupedResults[key].locations.push({
            orgName: res.orgName,
            cellLabel: res.cellLabel,
            count: res.count,
            orgId: res.orgId,
            row: res.row,
            col: res.col
        });
    });
    
    let html = `<div style="margin-bottom: 10px;"><strong>🔍 Найдено маркеров: ${results.length}</strong></div>`;
    
    for (const [key, marker] of Object.entries(groupedResults)) {
        // ✅ Отображаем подкатегорию, если есть
        const subcategoryDisplay = marker.subcategory ? ` (${marker.subcategory})` : '';
        
        html += `
            <div class="marker-search-result">
                <div class="marker-search-result-header">
                    <span class="marker-search-result-brand">${marker.brand}${subcategoryDisplay}</span>
                    <span class="marker-search-result-number">№${marker.number}</span>
                    <span class="marker-search-result-count">${marker.totalCount} шт</span>
                </div>
                <div style="margin-top: 8px;">
        `;
        
        marker.locations.forEach(loc => {
            html += `
                <div class="marker-search-result-location" onclick="openOrganizerWithMarker('${loc.orgId}', ${loc.row}, ${loc.col})" style="cursor: pointer; padding: 5px; margin: 3px 0; background: var(--bg); border-radius: 8px;">
                    📦 ${loc.orgName} → ячейка ${loc.cellLabel} (${loc.count} шт)
                </div>
            `;
        });
        
        html += `</div></div>`;
    }
    
    resultsDiv.innerHTML = html;
    resultsDiv.style.display = 'block';
}
        
        function openOrganizerWithMarker(orgId, row, col) {
    const org = inventory.organizers.find(o => o.id === orgId);
    if (!org) return;
    
    // Закрываем поиск
    const resultsDiv = document.getElementById('markerSearchResults');
    if (resultsDiv) resultsDiv.style.display = 'none';
    
    // Открываем органайзер
    const nameEl = document.getElementById('selectedOrganizerName');
    const viewEl = document.getElementById('selectedOrganizerView');
    const listEl = document.getElementById('organizersList');
    
    if (nameEl) nameEl.innerHTML = `📦 ${org.name} (${org.rows}×${org.cols})`;
    if (viewEl) viewEl.style.display = 'block';
    if (listEl) listEl.style.display = 'none';
    
    renderOrganizerGrid(org);
    
    // Подсвечиваем нужную ячейку
    setTimeout(() => {
        const cells = document.querySelectorAll('.organizer-cell');
        const targetIndex = row * org.cols + col;
        if (cells[targetIndex]) {
            cells[targetIndex].style.animation = 'highlight 1s ease-in-out 3';
            cells[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
}
        // ==========================================
        // ИНВЕНТАРЬ И ОРГАНАЙЗЕРЫ
        // ==========================================
        
        async function loadInventory() {
    try {
        const response = await fetch(`${SERVER_URL}/api/organizers?user_id=${userId}`);
        const data = await response.json();
        
        if (data && Array.isArray(data) && data.length > 0) {
            inventory.organizers = data;
        } else {
            // Грузим из localStorage или создаём дефолтный
            const saved = localStorage.getItem('coloring_inventory');
            if (saved) {
                inventory = JSON.parse(saved);
            } else {
                const defaultCells = Array(5).fill().map(() => Array(5).fill().map(() => []));
                inventory = {
                    organizers: [{
                        id: 'default',
                        name: 'Мой органайзер',
                        cols: 5,
                        rows: 5,
                        cells: defaultCells
                    }],
                    userMarkers: {}
                };
            }
        }
        
        if (!inventory.userMarkers) inventory.userMarkers = {};
        
        renderOrganizers();
        renderBrands();
    } catch (error) {
        console.error('Ошибка загрузки органайзеров:', error);
        // Fallback to localStorage
        const saved = localStorage.getItem('coloring_inventory');
        if (saved) inventory = JSON.parse(saved);
        renderOrganizers();
        renderBrands();
    }
}
        async function saveInventory() {
    // Сохраняем в localStorage как кеш
    localStorage.setItem('coloring_inventory', JSON.stringify(inventory));
    
    // Отправляем на сервер
    try {
        await fetch(`${SERVER_URL}/api/organizers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                organizers: inventory.organizers
            })
        });
    } catch (error) {
        console.error('Ошибка сохранения на сервер:', error);
    }
}
        
        let currentOrganizerId = null;
        let currentCellRow = null;
        let currentCellCol = null;
        
        function renderOrganizers() {
            const container = document.getElementById('organizersList');
            if (!container) return;
            if (!inventory.organizers || inventory.organizers.length === 0) {
                container.innerHTML = '<div class="no-results" style="padding: 20px; text-align: center;">📦 Нет органайзеров. Нажмите "Создать органайзер"</div>';
                return;
            }
            container.innerHTML = '';
            inventory.organizers.forEach((org) => {
                const orgCard = document.createElement('div');
                orgCard.style.cssText = 'background: var(--bg); border-radius: 16px; padding: 12px 16px; margin-bottom: 10px; border: 1px solid var(--border-color); cursor: pointer; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center;';
                orgCard.onclick = () => openOrganizerView(org.id);
                orgCard.innerHTML = `
                    <div>
                        <strong style="font-size: 16px;">📦 ${org.name}</strong>
                        <div style="font-size: 12px; color: var(--text-gray); margin-top: 4px;">${org.rows}×${org.cols} | Маркеров: ${countMarkersInOrganizer(org)}</div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="photo-upload-btn" style="padding: 6px 12px; font-size: 12px;" onclick="event.stopPropagation(); addMarkersToOrganizer('${org.id}')">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="photo-upload-btn" style="padding: 6px 12px; font-size: 12px; background: var(--status-red); color: white;" onclick="event.stopPropagation(); deleteOrganizer('${org.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                container.appendChild(orgCard);
            });
        }
        
        function countMarkersInOrganizer(org) {
            let total = 0;
            if (org.cells) {
                for (let row = 0; row < org.rows; row++) {
                    if (org.cells[row]) {
                        for (let col = 0; col < org.cols; col++) {
                            if (org.cells[row][col]) {
                                org.cells[row][col].forEach(marker => total += marker.count);
                            }
                        }
                    }
                }
            }
            return total;
        }
        
        function openOrganizerView(orgId) {
            const org = inventory.organizers.find(o => o.id === orgId);
            if (!org) return;
            const nameEl = document.getElementById('selectedOrganizerName');
            const viewEl = document.getElementById('selectedOrganizerView');
            const listEl = document.getElementById('organizersList');
            if (nameEl) nameEl.innerHTML = `📦 ${org.name} (${org.rows}×${org.cols})`;
            if (viewEl) viewEl.style.display = 'block';
            if (listEl) listEl.style.display = 'none';
            renderOrganizerGrid(org);
        }
        
        function renderOrganizerGrid(org) {
    const container = document.getElementById('selectedOrganizerGrid');
    if (!container) return;
    
    const gridWrapper = document.createElement('div');
    gridWrapper.style.cssText = 'overflow-x: auto; width: 100%; -webkit-overflow-scrolling: touch;';
    
    const gridContainer = document.createElement('div');
    gridContainer.className = 'organizer-grid';
    gridContainer.style.cssText = `display: grid; grid-template-columns: repeat(${org.cols}, 1fr); gap: 6px; width: 100%;`;
    
    for (let row = 0; row < org.rows; row++) {
        for (let col = 0; col < org.cols; col++) {
            if (!org.cells[row]) org.cells[row] = [];
            if (!org.cells[row][col]) org.cells[row][col] = [];
            
            const cellMarkers = org.cells[row][col];
            const markerCount = cellMarkers.length;
            const cellLabel = String.fromCharCode(65 + row) + (col + 1);
            
            const cellDiv = document.createElement('div');
            cellDiv.className = `organizer-cell ${markerCount > 0 ? 'filled' : ''}`;
            cellDiv.onclick = (function(r, c) { 
                return function() { openCellModal(org.id, r, c); }; 
            })(row, col);
            
            cellDiv.innerHTML = `
                <div class="organizer-cell-label">${cellLabel}</div>
                <div class="organizer-cell-count">${markerCount}</div>
            `;
            
            gridContainer.appendChild(cellDiv);
        }
    }
    
    gridWrapper.appendChild(gridContainer);
    container.innerHTML = '';
    container.appendChild(gridWrapper);
}
        
        function closeOrganizerView() {
            const viewEl = document.getElementById('selectedOrganizerView');
            const listEl = document.getElementById('organizersList');
            if (viewEl) viewEl.style.display = 'none';
            if (listEl) listEl.style.display = 'block';
            renderOrganizers();
        }
        
        function openOrganizerCreator() {
            const modal = document.getElementById('organizerModal');
            if (modal) modal.style.display = 'flex';
        }
        
        function closeOrganizerModal() {
            const modal = document.getElementById('organizerModal');
            if (modal) modal.style.display = 'none';
            const nameInput = document.getElementById('organizerName');
            const colsInput = document.getElementById('organizerCols');
            const rowsInput = document.getElementById('organizerRows');
            if (nameInput) nameInput.value = '';
            if (colsInput) colsInput.value = '3';
            if (rowsInput) rowsInput.value = '3';
        }
        
        function createOrganizer() {
            const nameInput = document.getElementById('organizerName');
            const colsInput = document.getElementById('organizerCols');
            const rowsInput = document.getElementById('organizerRows');
            const name = nameInput ? nameInput.value.trim() : '';
            const cols = colsInput ? parseInt(colsInput.value) : 3;
            const rows = rowsInput ? parseInt(rowsInput.value) : 3;
            if (!name) { if (tg) tg.showAlert('Введите название'); return; }
            if (cols < 1 || rows < 1) { if (tg) tg.showAlert('Количество столбцов и строк должно быть не менее 1'); return; }
            const cells = Array(rows).fill().map(() => Array(cols).fill().map(() => []));
            inventory.organizers.push({ id: Date.now().toString(), name: name, cols: cols, rows: rows, cells: cells });
            saveInventory();
            renderOrganizers();
            closeOrganizerModal();
            if (tg) tg.showAlert('Органайзер создан!');
        }
        
        function openCellModal(orgId, row, col) {
            currentOrganizerId = orgId;
            currentCellRow = row;
            currentCellCol = col;
            const org = inventory.organizers.find(o => o.id === orgId);
            if (!org) return;
            if (!org.cells[row]) org.cells[row] = [];
            if (!org.cells[row][col]) org.cells[row][col] = [];
            const cellMarkers = org.cells[row][col];
            const cellLabel = String.fromCharCode(65 + row) + (col + 1);
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.style.display = 'flex';
            modal.innerHTML = `<div class="modal-content"><h3>Ячейка ${cellLabel}</h3><div id="cellMarkersList" style="max-height: 300px; overflow-y: auto; margin-bottom: 15px;"></div><button class="modal-action-btn" onclick="showAddMarkerToCell()" style="cursor:pointer;">+ Добавить маркер</button><button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()" style="cursor:pointer;">Закрыть</button></div>`;
            document.body.appendChild(modal);
            renderCellMarkers(cellMarkers);
        }
        
        
        function renderCellMarkers(markers) {
    const container = document.getElementById('cellMarkersList');
    if (!container) return;
    
    if (!markers || markers.length === 0) {
        container.innerHTML = '<div class="no-results">Нет маркеров</div>';
        return;
    }
    
    container.innerHTML = '';
    
    markers.forEach((marker, idx) => {
        const div = document.createElement('div');
        div.style.cssText = 'background: var(--bg); padding: 10px; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;';
        
        // ✅ Показываем подкатегорию для Tooli-Art
        const subcategoryText = marker.subcategory ? ` (${marker.subcategory})` : '';
        
        div.innerHTML = `
            <div>
                <strong>${marker.brand}${subcategoryText}</strong> №${marker.number} 
                <span style="margin-left: 8px; font-weight: bold; color: var(--accent);">×${marker.count}</span>
            </div>
            <div style="display: flex; gap: 5px;">
                <button class="photo-upload-btn" onclick="changeMarkerCount(${idx}, -1)" style="background: var(--accent); color: white; padding: 4px 10px; cursor:pointer; border-radius: 5px;">−</button>
                <button class="photo-upload-btn" onclick="changeMarkerCount(${idx}, 1)" style="background: var(--accent); color: white; padding: 4px 10px; cursor:pointer; border-radius: 5px;">+</button>
                <button class="photo-upload-btn" onclick="removeMarkerFromCell(${idx})" style="background: var(--status-red); color: white; padding: 4px 10px; cursor:pointer; border-radius: 5px;">🗑</button>
            </div>
        `;
        
        container.appendChild(div);
    });
}
        
        function showAddMarkerToCell() {
    // Закрываем модалку ячейки
    const cellModal = document.querySelector('.modal-overlay[style*="display: flex"]');
    if (cellModal && cellModal.innerHTML.includes('Ячейка')) {
        cellModal.remove();
    }
    
    // Сбрасываем подкатегорию
    document.getElementById('subcategoryGroup').style.display = 'none';
    document.getElementById('addMarkerBrand').value = 'GuangNa';
    
    // Открываем модалку
    const modal = document.getElementById('addMarkerModal');
    if (modal) modal.style.display = 'flex';
}
        
        function closeAddMarkerModal() {
    const modal = document.getElementById('addMarkerModal');
    if (modal) modal.style.display = 'none';
    
    const numInput = document.getElementById('addMarkerNumber');
    const countInput = document.getElementById('addMarkerCount');
    if (numInput) numInput.value = '';
    if (countInput) countInput.value = '1';
}
        
        function confirmAddMarker() {
    const brandSelect = document.getElementById('addMarkerBrand');
    const numberInput = document.getElementById('addMarkerNumber');
    const countInput = document.getElementById('addMarkerCount');
    const subcategorySelect = document.getElementById('addMarkerSubcategory');
    
    const brand = brandSelect ? brandSelect.value : 'GuangNa';
    const number = numberInput ? numberInput.value : '';
    const count = countInput ? parseInt(countInput.value) : 1;
    const subcategory = subcategorySelect ? subcategorySelect.value : '';
    
    if (!number) { 
        if (tg) tg.showAlert('Введите номер'); 
        return; 
    }
    
    const org = inventory.organizers.find(o => o.id === currentOrganizerId);
    if (org && currentCellRow !== null && currentCellCol !== null) {
        if (!org.cells[currentCellRow]) org.cells[currentCellRow] = [];
        if (!org.cells[currentCellRow][currentCellCol]) org.cells[currentCellRow][currentCellCol] = [];
        
        const cellMarkers = org.cells[currentCellRow][currentCellCol];
        
        // ✅ Формируем ключ с подкатегорией для Tooli-Art
        let markerKey;
        if (brand === 'Tooli-Art' && subcategory) {
            markerKey = `${brand}_${subcategory}_${number}`;
        } else {
            markerKey = `${brand}_${number}`;
        }
        
        const existing = cellMarkers.find(m => {
            const key = m.subcategory ? `${m.brand}_${m.subcategory}_${m.number}` : `${m.brand}_${m.number}`;
            return key === markerKey;
        });
        
        if (existing) {
            existing.count += count;
        } else {
            cellMarkers.push({ 
                brand, 
                number, 
                count,
                subcategory: brand === 'Tooli-Art' ? subcategory : null
            });
        }
        
        // Обновляем инвентарь
        const key = brand === 'Tooli-Art' && subcategory ? `${brand}_${subcategory}_${number}` : `${brand}_${number}`;
        if (!inventory.userMarkers) inventory.userMarkers = {};
        inventory.userMarkers[key] = (inventory.userMarkers[key] || 0) + count;
        
        saveInventory();
        renderOrganizers();
        renderBrands();
        
        if (tg) tg.showAlert(`Маркер ${brand} №${number} добавлен!`);
    }
    
    closeAddMarkerModal();
    openCellModal(currentOrganizerId, currentCellRow, currentCellCol);
}
        function removeMarkerFromCell(idx) {
    const org = inventory.organizers.find(o => o.id === currentOrganizerId);
    if (!org || currentCellRow === null || currentCellCol === null) return;
    
    if (!org.cells[currentCellRow]) org.cells[currentCellRow] = [];
    if (!org.cells[currentCellRow][currentCellCol]) org.cells[currentCellRow][currentCellCol] = [];
    
    const cellMarkers = org.cells[currentCellRow][currentCellCol];
    const marker = cellMarkers[idx];
    
    if (marker) {
        const key = `${marker.brand}_${marker.number}`;
        if (inventory.userMarkers) {
            inventory.userMarkers[key] = Math.max(0, (inventory.userMarkers[key] || 0) - marker.count);
            if (inventory.userMarkers[key] === 0) delete inventory.userMarkers[key];
        }
        cellMarkers.splice(idx, 1);
        
        saveInventory();
        renderCellMarkers(cellMarkers);
        renderOrganizers();
        renderBrands();
        
        if (tg) tg.showAlert('Маркер удалён');
    }
}
        
        function deleteOrganizer(orgId) {
            console.log('🗑 Deleting organizer:', orgId);
            if (tg) {
                tg.showConfirm('Удалить органайзер? Все маркеры будут потеряны!', (confirm) => {
                    if (confirm) {
                        const index = inventory.organizers.findIndex(o => o.id === orgId);
                        if (index !== -1) {
                            inventory.organizers.splice(index, 1);
                            saveInventory();
                            renderOrganizers();
                            const viewEl = document.getElementById('selectedOrganizerView');
                            if (viewEl && viewEl.style.display === 'block') {
                                closeOrganizerView();
                            }
                            if (tg) tg.showAlert('Органайзер удален');
                        }
                    }
                });
            } else {
                if (confirm('Удалить органайзер? Все маркеры будут потеряны!')) {
                    const index = inventory.organizers.findIndex(o => o.id === orgId);
                    if (index !== -1) {
                        inventory.organizers.splice(index, 1);
                        saveInventory();
                        renderOrganizers();
                        const viewEl = document.getElementById('selectedOrganizerView');
                        if (viewEl && viewEl.style.display === 'block') {
                            closeOrganizerView();
                        }
                        alert('Органайзер удален');
                    }
                }
            }
        }
        
        function addMarkersToOrganizer(orgId) {
            currentOrganizerId = orgId;
            currentCellRow = 0;
            currentCellCol = 0;
            showAddMarkerToCell();
        }
        
        function toggleOrganizersBlock() {
            const content = document.getElementById('organizersBlockContent');
            const arrow = document.getElementById('organizersArrow');
            if (!content) return;
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
                if (arrow) arrow.style.transform = 'rotate(180deg)';
                renderOrganizers();
            } else {
                content.style.display = 'none';
                if (arrow) arrow.style.transform = 'rotate(0deg)';
            }
        }
        
        function toggleMarkersBlock() {
            const content = document.getElementById('markersBlockContent');
            const arrow = document.getElementById('markersArrow');
            if (!content) return;
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
                if (arrow) arrow.style.transform = 'rotate(180deg)';
                renderBrands();
            } else {
                content.style.display = 'none';
                if (arrow) arrow.style.transform = 'rotate(0deg)';
            }
        }
        // ==========================================
        // БРЕНДЫ
        // ==========================================
        
        const BRANDS_DATA = [
            { name: 'GuangNa', total: 408 },
            { name: 'Languo', total: 288 },
            { name: 'Zibeef', total: 240 },
            { name: 'Grasp', total: 168 },
            { name: 'InfiArt', total: 288 },
            { name: 'Tooli-Art', total: 508 }
        ];
        
        function renderBrands() {
            const container = document.getElementById('brandsList');
            if (!container) return;
            container.innerHTML = '';
            BRANDS_DATA.forEach(brand => {
                const uniqueNumbersInInventory = new Set();
                if (inventory.organizers) {
                    inventory.organizers.forEach(org => {
                        if (org.cells) {
                            org.cells.forEach(row => {
                                if (row) {
                                    row.forEach(cell => {
                                        if (cell) {
                                            cell.forEach(marker => {
                                                if (marker.brand === brand.name) uniqueNumbersInInventory.add(marker.number);
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                const existingNumbers = markersDB.filter(m => m.num && parseInt(m.num) <= brand.total).map(m => m.num).slice(0, 50);
                const uniqueCount = uniqueNumbersInInventory.size;
                const div = document.createElement('div');
                div.style.cssText = 'background: var(--card-bg); border-radius: 16px; margin-bottom: 12px; border: 1px solid var(--border-color); overflow: hidden;';
                const headerDiv = document.createElement('div');
                headerDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; cursor: pointer; background: var(--bg);';
                headerDiv.onclick = () => {
                    const content = div.querySelector('.brand-content');
                    const arrow = headerDiv.querySelector('.brand-arrow');
                    if (content && content.style.display === 'none') {
                        content.style.display = 'block';
                        if (arrow) arrow.style.transform = 'rotate(180deg)';
                    } else if (content) {
                        content.style.display = 'none';
                        if (arrow) arrow.style.transform = 'rotate(0deg)';
                    }
                };
                headerDiv.innerHTML = `<div style="display: flex; align-items: center; gap: 10px;"><i class="fas fa-palette" style="color: var(--accent);"></i><strong style="font-size: 16px;">${brand.name}</strong><span style="background: var(--accent); color: white; padding: 2px 8px; border-radius: 20px; font-size: 11px;">${uniqueCount}/${existingNumbers.length}</span></div><i class="fas fa-chevron-down brand-arrow" style="color: var(--text-gray); transition: transform 0.2s;"></i>`;
                const contentDiv = document.createElement('div');
                contentDiv.className = 'brand-content';
                contentDiv.style.cssText = 'display: none; padding: 12px 15px; border-top: 1px solid var(--border-color); max-height: 200px; overflow-y: auto;';
                let numbersHtml = '<div style="display: flex; flex-wrap: wrap; gap: 8px;">';
                existingNumbers.forEach(num => {
                    const isCollected = uniqueNumbersInInventory.has(num);
                    numbersHtml += `<div onclick="toggleMarkerInBrand('${brand.name}', '${num}', ${isCollected})" style="width: 45px; padding: 6px 0; text-align: center; background: ${isCollected ? 'var(--accent)' : 'var(--bg)'}; color: ${isCollected ? 'white' : 'var(--text)'}; border-radius: 8px; border: 1px solid var(--border-color); font-size: 12px; font-weight: ${isCollected ? 'bold' : 'normal'}; cursor: pointer; transition: all 0.2s;">${num}</div>`;
                });
                numbersHtml += '</div>';
                contentDiv.innerHTML = numbersHtml;
                div.appendChild(headerDiv);
                div.appendChild(contentDiv);
                container.appendChild(div);
            });
        }
        
        function toggleMarkerInBrand(brandName, number, isCollected) {
            if (isCollected) {
                if (tg) {
                    tg.showConfirm(`Удалить маркер ${brandName} №${number} из инвентаря?`, (confirm) => {
                        if (confirm && inventory.organizers) {
                            let removed = false;
                            inventory.organizers.forEach(org => {
                                if (org.cells) {
                                    org.cells.forEach(row => {
                                        if (row) {
                                            row.forEach(cell => {
                                                if (cell) {
                                                    for (let i = cell.length - 1; i >= 0; i--) {
                                                        if (cell[i].brand === brandName && cell[i].number === number) {
                                                            cell.splice(i, 1);
                                                            removed = true;
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                            if (removed) {
                                saveInventory();
                                renderOrganizers();
                                renderBrands();
                                if (tg) tg.showAlert(`Маркер ${brandName} №${number} удален`);
                            }
                        }
                    });
                } else {
                    if (confirm(`Удалить маркер ${brandName} №${number} из инвентаря?`)) {
                        let removed = false;
                        inventory.organizers.forEach(org => {
                            if (org.cells) {
                                org.cells.forEach(row => {
                                    if (row) {
                                        row.forEach(cell => {
                                            if (cell) {
                                                for (let i = cell.length - 1; i >= 0; i--) {
                                                    if (cell[i].brand === brandName && cell[i].number === number) {
                                                        cell.splice(i, 1);
                                                        removed = true;
                                                    }
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                        if (removed) {
                            saveInventory();
                            renderOrganizers();
                            renderBrands();
                            alert(`Маркер ${brandName} №${number} удален`);
                        }
                    }
                }
            } else {
                if (inventory.organizers && inventory.organizers.length > 0) {
                    const org = inventory.organizers[0];
                    let targetCell = org.cells[0][0];
                    let targetRow = 0, targetCol = 0;
                    const existing = targetCell.find(m => m.brand === brandName && m.number === number);
                    if (existing) {
                        existing.count += 1;
                    } else {
                        targetCell.push({ brand: brandName, number: number, count: 1 });
                    }
                    const key = `${brandName}_${number}`;
                    if (!inventory.userMarkers) inventory.userMarkers = {};
                    inventory.userMarkers[key] = (inventory.userMarkers[key] || 0) + 1;
                    saveInventory();
                    renderOrganizers();
                    renderBrands();
                    if (tg) tg.showAlert(`Маркер ${brandName} №${number} добавлен в ячейку ${String.fromCharCode(65 + targetRow)}${targetCol + 1}`);
                } else {
                    if (tg) tg.showAlert('Сначала создайте органайзер!');
                }
            }
        }
        
        function openAnnaChannel() {
            const channelUrl = 'https://www.youtube.com/@colour_with_anna';
            
            if (window.Telegram && window.Telegram.WebApp) {
                window.Telegram.WebApp.openLink(channelUrl);
            } else {
                window.open(channelUrl, '_blank');
            }
        }
        
        // ==========================================
        // ДАННЫЕ ЗАДАНИЙ (ВЕТКИ) - С ПОДЗАДАНИЯМИ
        // ==========================================
        
        const BRANCH_REWARDS = {
    trainer: "Великий тренер",
    alcohol: "Спиртесса",
    shock: "Шок контент",
    lion: "Королева прайда",
    dragons: "Мать Драконов",
    bear: "Мишка",
    fauna: "Знаток фауны",
    sea: "Царица морей",
    queen: "Злая королева",
    scrooge: "Скрудж",
    benefactor: "Благодетель",
    mystery: "Загадка",
    anaconda: "Анаконда",
    molniya: "Молния",
    nezhnost: "Нежность",
    pempudu: "Абрикосик",
    collection_master: "Хранитель",
    'tsvetochek': 'Цветочек',
    'bembi': 'Бемби',
    'topotun': 'Топотун',
    krasavica: "Красавица",
    sirena: "Сирена",
    rapuncelprincesses: "Златовласка",
    'agraba': 'Принцесса Аграбы',
    lubitelfentesi: "Любитель фэнтези",
    'bebes_animaux': "Крошка",
};
        
        const TASK_BRANCHES = {
             krasavica: {
        name: "Красавица",
        desc: "Пройди всю историю от страха, ненависти к уважению и любви (ДО/ПОСЛЕ со стикером и кодовым словом)",
        levels: [
            { 
                title: "Знакомство с главными персонажами", 
                maxProgress: 5, 
                desc: "Раскрась 1 картинку с Белль, 1 картинку с Адамом (в образе чудовища), 1 картинку с Морисом, 1 картинку с Гастоном, 1 картинку с Лефу",
                subtasks: [
                    { id: 'bellraskrasstatus', name: 'Белль', required: 1 },
                     { id: 'chudovisheraskrasstatus', name: 'Адам', required: 1 },
                     { id: 'morisraskrasstatus', name: 'Морис', required: 1 },
                     { id: 'gastonraskrasstatus', name: 'Гастон', required: 1 },
                     { id: 'lefuraskrasstatus', name: 'Лефу', required: 1 }
                ]
            },
            { 
                title: "Начало пути", 
                maxProgress: 5, 
                desc: "Раскрась 1 картинку с витражом из мф Красавица и чудовище, 1 картинку с тройняшками, 1 картинку с Филиппом, 1 картинку с дождем",
                subtasks: [
                     { id: 'vitraxhnastatus', name: 'Витраж', required: 1 },
                    { id: 'troinyashki', name: 'Тройняшки', required: 1 },
                    { id: 'filippnastatus', name: 'Филипп', required: 1 },
                     { id: 'zamok', name: 'Замок', required: 1 },
                     { id: 'dozhdikkapkapkap', name: 'Дождь', required: 1 }
                ]
            },
            { 
                title: "Таинственный замок", 
                maxProgress: 5, 
                desc: "Раскрась 1 картинку с Люмьером, 1 каринку с Когсвортом, 1 картинку с Миссис Поттс, 1 картинку с Фифи, 1 картинку с Султаном (собака)",
                subtasks: [
                    { id: 'lumiernastatus', name: 'Люмьер', required: 1 },
                    { id: 'kogswortnastatus', name: 'Когсворт', required: 1 },
                    { id: 'missispottsnastatus', name: 'Миссис Поттс', required: 1 },
                    { id: 'fifinastatus', name: 'Фифи', required: 1 },
                     { id: 'sultannastatus', name: 'Султан', required: 1 }
                ]
            },
            { 
                title: "Искра", 
                maxProgress: 3, 
                desc: "Раскрась 1 картинку, где изображены Адам (в образе чудовища) и Белль, 1 картинку, где изображена Белль с книгой, 1 картинку, где изображена Белль с Адамом (в образе чудовища) в зимнее время года",
                subtasks: [
                    { id: 'adamandbell', name: 'Адам (в образе чудовища) и Белль', required: 1 },
                    { id: 'bellwithbook', name: 'Белль с книгой', required: 1 },
                    { id: 'bellandchudovishezimoi', name: 'Белль и Адам (в образе чудовища) в зимнее время года', required: 1 }
                ]
            },
            { 
                title: "Снятие заклятия", 
                maxProgress: 6, 
                desc: "Раскрась 1 картинку с заколдованной розой, 1 картинку, где изображена Белль в желтом платье, 1 картинку с Адамом (в образе человека), 1 картинку с Бельь с Адамом (в образе человека), 2 картинки с раскалдованными слугами",
                subtasks: [
                    { id: 'z1', name: 'Заколдованная роза', required: 1 },
                    { id: 'z2', name: 'Белль в желтом платье', required: 1 },
                    { id: 'z3', name: 'Адам (в образе человека)', required: 1 },
                    { id: 'z4', name: 'Белль с Адамом (в образе человека)', required: 1 },
                    { id: 'z5', name: 'Расколдованные слуги', required: 2 }
                ]
            }
        ]
    },
             sirena: {
        name: "Сирена",
        desc: "Готова ли ты отдать свой голос ради исполнения заветной мечты? (ДО/ПОСЛЕ со стикером и кодовым словом)",
        levels: [
            { 
                title: "Знакомство с подводным миром", 
                maxProgress: 5, 
                desc: "Раскрась 1 картинку, где изображен дворец царя Тритона, 1 картинку с Флаундером и Себастьяном, 1 картинку со Скаттлом, 1 картинку с царем Тритоном, 1 картинку, где изображена хотябы 1 из сестер Ариэль",
                subtasks: [
                    { id: 'qw1', name: 'Дворец царя Тритона', required: 1 },
                     { id: 'qw2', name: 'Флаундер и Себастьян', required: 1 },
                     { id: 'qw3', name: 'Скаттл', required: 1 },
                     { id: 'qw4', name: 'Царь Тритон', required: 1 },
                     { id: 'qw5', name: 'Сестра Ариэль', required: 1 }
                ]
            },
            { 
                title: "Основные антагонисты", 
                maxProgress: 5, 
                desc: "Раскрась 1 картинку с муренами, 1 картинку с Громилой, 1 картинка с Морганой, 1 картинка с Урсулой, 1 картинка с Урсулой (в образе Ванессы)",
                subtasks: [
                     { id: 'qwe1', name: 'Мурены', required: 1 },
                    { id: 'qwe2', name: 'Громила', required: 1 },
                    { id: 'qwe3', name: 'Моргана', required: 1 },
                     { id: 'qwe4', name: 'Урсула', required: 1 },
                     { id: 'qwe5', name: 'Урсула (в образе Ванессы)', required: 1 }
                ]
            },
            { 
                title: "Прекрасный принц", 
                maxProgress: 3, 
                desc: "Раскрась 1 картинку с замком из мф Русалочка, 1 картинку с Эриком, 1 картинку с Максом (собакой)",
                subtasks: [
                    { id: 'qwer1', name: 'Замок', required: 1 },
                    { id: 'qwer2', name: 'Эрик', required: 1 },
                    { id: 'qwer3', name: 'Макс', required: 1 }
                ]
            },
            { 
                title: "Магия", 
                maxProgress: 4, 
                desc: "Раскрась 1 картинку, где присутствует магия из мф Русалочка, 1 картинка с трезубцем, 1 картинку, где изображена Ариэль с ногами, 1 картинку с Урсулой и Ариэль",
                subtasks: [
                    { id: 'qwert1', name: 'Магия', required: 1 },
                    { id: 'qwert2', name: 'Трезубец', required: 1 },
                    { id: 'qwert3', name: 'Ариэль с ногами', required: 1 },
                     { id: 'qwert4', name: 'Урсула и Ариэль', required: 1 }
                ]
            },
            { 
                title: "Хеппи Энд", 
                maxProgress: 5, 
                desc: "Раскрась 1 картинку, где изображены Тритон и Ариэль, раскрась 1 картинку, где Ариэль танцует, 1 картинку со свадьбой Ариэль и Эрика, 1 картинку с Мелоди, 1 картинку, где изображены Мелоди, Ариэль и Эрик, 1 картинку, где изображены Тритон, Ариэль, Эрик и Мелоди",
                subtasks: [
                    { id: 'qwerty1', name: 'Тритон и Ариэль', required: 1 },
                    { id: 'qwerty2', name: 'Ариэль танцует', required: 1 },
                    { id: 'qwerty3', name: 'Свадьба Ариэль и Эрика', required: 1 },
                    { id: 'qwerty4', name: 'Мелоди', required: 1 },
                    { id: 'qwerty5', name: 'Мелоди, Ариэль, Эрик', required: 1 }
                ]
            }
        ]
    },
            rapuncelprincessa: {
        name: "Златовласка",
        desc: "Разберись с запутанной историей (ДО/ПОСЛЕ со стикером и кодовым словом)",
        levels: [
            { 
                title: "Мой дом - мое заточение?", 
                maxProgress: 5, 
                desc: "Раскрась 1 картинку с Паскалем, 1 картинку с Рапунцель, которая рисует, 1 картинку с Готель, 1 картинку башни из мф Рапунцель, 1 картинку с Рапуннцель и Готель",
                subtasks: [
                    { id: 'as1', name: 'Паскаль', required: 1 },
                     { id: 'as2', name: 'Рапунцель рисует', required: 1 },
                     { id: 'as3', name: 'Готель', required: 1 },
                     { id: 'as4', name: 'Башня', required: 1 },
                     { id: 'as5', name: 'Рапунцель и Готель', required: 1 }
                ]
            },
            { 
                title: "Чудесный незнакомец", 
                maxProgress: 4, 
                desc: "Раскрась 1 картинку с Флином, 1 картинку с Максимусом, 1 картинку с разбойниками из таверны, 1 картинку, где Рапунцель танцует с Флином",
                subtasks: [
                     { id: 'asd1', name: 'Флин', required: 1 },
                    { id: 'asd2', name: 'Максимус', required: 1 },
                    { id: 'asd3', name: 'Разбойники', required: 1 },
                     { id: 'asd4', name: 'Рапунцель танцует с Флином', required: 1 }
                ]
            },
            { 
                title: "Дорога в город", 
                maxProgress: 5, 
                desc: "Раскрась 1 картинку с Готель, 1 картинку с братья Граббингстонами, 1 картинку с побегом Рапунцель и Флинна, 1 картинку с Рапунцель и Флином в городе, 1 картинку с Рапунцель и фонариками",
                subtasks: [
                    { id: 'asdf1', name: 'Готель', required: 1 },
                    { id: 'asdf2', name: 'Братья Граббингстоны', required: 1 },
                    { id: 'asdf3', name: 'Побег Рапунцель и Флинна', required: 1 },
                     { id: 'asdf4', name: 'Рапунцель и Флинн в городе', required: 1 },
                     { id: 'asdf5', name: 'Рапунцель и фонарики', required: 1 }
                ]
            },
            { 
                title: "Распутанная история", 
                maxProgress: 4, 
                desc: "Раскрась 1 картинку с Рапунцель, у которой отрезаны волосы, 1 картинку с Рапунцель и Флинном, 1 картинку с Рапунцель и ее родителями, 1 картинку с любым зданием из мф Рапунцель",
                subtasks: [
                    { id: 'asdfg1', name: 'Рапунцель с отрезанными волосами', required: 1 },
                    { id: 'asdfg2', name: 'Рапунцель и Флинн', required: 1 },
                    { id: 'asdfg3', name: 'Рапунцель и родители', required: 1 },
                     { id: 'asdfg4', name: 'Здание', required: 1 }
                ]
            },
        ]
    },
            agraba: {
        name: "Принцесса Аграбы",
        desc: "Исследуй все уголки Аграбы (ДО/ПОСЛЕ со стикером и кодовым словом)",
        levels: [
                   { 
                title: "Чары и месть", 
                maxProgress: 7, 
                desc: "Раскрась 2 картинки с Джафаром, 1 картинку с Султаном, 2 картинки с Яго, 1 картинку с Ковром-самолетом, 1 картинку с Джафаром в образе джина",
                subtasks: [
                     { id: 'agr6', name: 'Джафар', required: 2 },
                    { id: 'agr7', name: 'Султан', required: 1 },
                    { id: 'agr8', name: 'Яго', required: 2 },
                     { id: 'agr9', name: 'Ковер-самолет', required: 1 },
                     { id: 'agr10', name: 'Джафар в образе джина', required: 1 }
                ]
            },
            { 
                title: "Отвага и честь", 
                maxProgress: 6, 
                desc: "Раскрась 2 картинки с Раджой, 1 картинку, где изображен Аладдин в одежде принца, 1 картинку, где изображен Аладдин с Абу, 2 картинки с Джинни",
                subtasks: [
                    { id: 'agr11', name: 'Раджа', required: 2 },
                    { id: 'agr12', name: 'Аладдин в одежде принца', required: 1 },
                    { id: 'agr13', name: 'Аладдин с Абу', required: 1 },
                    { id: 'agr14', name: 'Джинни', required: 2 }
                 ]
            },
            { 
                title: "Дворцы и песок", 
                maxProgress: 5, 
                desc: "Раскрась 1 картинку, где изображен дворец Султана, 1 картинку, где изображена пустыня, 1 картинку, где изображена Жасмин в детстве, 1 картинку, где изображен Аладдин в одежде простолюдина, 1 картинку с Абу",
                subtasks: [
                    { id: 'agr1', name: 'Дворец Султана', required: 1 },
                     { id: 'agr2', name: 'Пустыня', required: 1 },
                     { id: 'agr3', name: 'Жасмин в детстве', required: 1 },
                     { id: 'agr4', name: 'Аладдин в одежде простолюдина', required: 1 },
                     { id: 'agr5', name: 'Абу', required: 1 }
                ]
            },
            
            { 
                title: "О дивный восток", 
                maxProgress: 5, 
                desc: "Раскрась 1 разворот с Жасмин, 2 картинки, где изображены Жасмин и Аладдин, 1 картинку, где изображены Жасмин и Султан, 1 картинку, где изображена Аграба",
                subtasks: [
                    { id: 'agr16', name: 'Разворот с Жасмин', required: 1 },
                    { id: 'agr17', name: 'Жасмин и Аладдин', required: 2 },
                    { id: 'agr18', name: 'Жасмин и Слтан', required: 1 },
                    { id: 'agr19', name: 'Аграба', required: 1 }
                ]
            },
        ]
    },
               lubitelfentesi: {
        name: "Любитель Фэнтези",
        desc: "Открой для себя мир фэнтези (ДО/ПОСЛЕ со стикером и кодовым словом) *Примечание: принимаются работы ТОЛЬКО из томов Romantasy, Fantasy, Ombres and Lumieres, Mondes Fantastiques, Contes de fees, Animaux Fantastiques, Mythes du Monde",
        levels: [
            { 
                title: "Знакомство с тайным лесом", 
                maxProgress: 5, 
                desc: "Раскрась 1 картинку c лесом, 1 картинку с любым мифическим лесным животным, 1 картинку, где изображен хотябы 1 гриб, 1 картинку с феей, 1 картинку с птицей",
                subtasks: [
                    { id: 'zx1', name: 'Лес', required: 1 },
                     { id: 'zx2', name: 'Мифическое лесное животное', required: 1 },
                     { id: 'zx3', name: 'Гриб', required: 1 },
                     { id: 'zx4', name: 'Фея', required: 1 },
                     { id: 'zx5', name: 'Птица', required: 1 }
                ]
            },
            { 
                title: "Подводный Эдем", 
                maxProgress: 9, 
                desc: "Раскрась 2 картинки с русалкой, 2 картинки с водным мифическим существом, 2 картинки с морским млекопитающим, 2 картинки, где изображен морской пейзаж, 1 картинку с Посейдоном",
                subtasks: [
                     { id: 'zxc1', name: 'Русалка', required: 2 },
                    { id: 'zxc2', name: 'Водное мифическое существо', required: 2 },
                    { id: 'zxc3', name: 'Морское млекопитающее', required: 2 },
                     { id: 'zxc4', name: 'Картинка, где изображен морской пейзаж', required: 2 },
                     { id: 'zxc5', name: 'Посейдон', required: 1 }
                ]
            },
            { 
                title: "Секрет небес", 
                maxProgress: 10, 
                desc: "Раскрась 3 картинки с драконом, 3 картинки с ангелом, 1 картинку с мифической птицей, 3 картинки с летающим животным",
                subtasks: [
                    { id: 'zxcv1', name: 'Дракон', required: 3 },
                    { id: 'zxcv2', name: 'Ангел', required: 3 },
                    { id: 'zxcv3', name: 'Мифическая птица', required: 1 },
                     { id: 'zxcv4', name: 'Летающее животное', required: 3 }
                     
                ]
            },
            { 
                title: "Любитель огня", 
                maxProgress: 11, 
                desc: "Раскрась 4 картинки с мечом, 1 картинку, где преобладает красный цвет, 2 картинки с жителем ада, 3 картинки с рогатым персонажем, 1 картинку с драконом и огнем",
                subtasks: [
                    { id: 'zxcvb1', name: 'Меч', required: 4 },
                    { id: 'zxcvb2', name: 'Преобладает красный цвет', required: 1 },
                    { id: 'zxcvb3', name: 'Житель ада', required: 2 },
                     { id: 'zxcvb4', name: 'Рогатый персонаж', required: 3 },
                    { id: 'zxcvb5', name: 'Дракон и огонь', required: 1 }
                ]
            },
            { 
                title: "Романтик", 
                maxProgress: 12, 
                desc: "Раскрась 1 картинку, где преобладают розовые оттенки, 3 картинки с цветами, 3 картинки с единорогом, 2 картинки с влюбленной парой, 3 картинки с персонажем в платье",
                subtasks: [
                    { id: 'zxcvbn1', name: 'Розовые оттенки', required: 1 },
                    { id: 'zxcvbn2', name: 'Цветы', required: 3 },
                    { id: 'zxcvbn3', name: 'Единорог', required: 3 },
                    { id: 'zxcvbn4', name: 'Влюбленная пара', required: 2 },
                    { id: 'zxcvbn5', name: 'Персонаж в платье', required: 3 }
                ]
            }
        ]
    },
     pempudu: {
        name: 'Абрикосик',
        desc: 'Выполни все уровни и получи статус «Абрикосик»! (фото ДО/ПОСЛЕ со стикером и кодовым словом)',
        levels: [
            {
                title: 'Уровень 1 - Заготовка шашлыка',
                maxProgress: 9,
                desc: 'Раскрась 3 картинки с баранами/свиньями, 3 с петухом/курицей, 3 с едой',
                subtasks: [
                    { id: 'abr1_1', name: 'Бараны/свиньи', required: 3 },
                    { id: 'abr1_2', name: 'Петух/курица', required: 3 },
                    { id: 'abr1_3', name: 'Еда', required: 3 }
                ]
            },
            {
                title: 'Уровень 2 - Базовый минимум',
                maxProgress: 10,
                desc: 'Раскрась 1 разворот с танцующими, 2 картинки с короной, 2 со свадьбой, 2 разворота с застольем, 3 с козлами',
                subtasks: [
                    { id: 'abr2_1', name: 'Персонажи танцуют (разворот)', required: 1 },
                    { id: 'abr2_2', name: 'Корона', required: 2 },
                    { id: 'abr2_3', name: 'Свадьба', required: 2 },
                    { id: 'abr2_4', name: 'Застолье (развороты)', required: 2 },
                    { id: 'abr2_5', name: 'Козлы', required: 3 }
                ]
            },
            {
                title: 'Уровень 3 - Тысяча и 1 родственник',
                maxProgress: 8,
                desc: 'Раскрась 2 картинки с отцом и дочерью, 2 разворота с 5+ персонажами, 2 с пожилыми людьми, 2 с принцессой и мамой',
                subtasks: [
                    { id: 'abr3_1', name: 'Отец и дочь', required: 2 },
                    { id: 'abr3_2', name: '5+ персонажей (разворот)', required: 2 },
                    { id: 'abr3_3', name: 'Пожилые люди', required: 2 },
                    { id: 'abr3_4', name: 'Принцесса с мамой', required: 2 }
                ]
            },
            {
                title: 'Уровень 4 - Роскошный максимум',
                maxProgress: 7,
                desc: 'Раскрась 1 разворот со зданием, 3 картинки с хищными кошками, 1 разворот с принцессой, 1 с машиной, 1 с принцем',
                subtasks: [
                    { id: 'abr4_1', name: 'Здание (разворот)', required: 1 },
                    { id: 'abr4_2', name: 'Хищные кошки', required: 3 },
                    { id: 'abr4_3', name: 'Принцесса (разворот)', required: 1 },
                    { id: 'abr4_4', name: 'Машина', required: 1 },
                    { id: 'abr4_5', name: 'Только принц', required: 1 }
                ]
            }
        ]
    },
    trainer: {
        name: "Великий тренер",
        desc: "Пройди основные покемон-лиги и стань Великим тренером (ДО/ПОСЛЕ со стикером и кодовым словом)",
        levels: [
            { title: "Начинающий тренер", maxProgress: 1, desc: "Раскрась 1 картинку с Пикачу" },
            {
                title: "Лига Индиго",
                maxProgress: 3,
                desc: "Раскрась 1 огненного покемона, 1 водного покемона, 1 землянного покемона",
                subtasks: [
                    { id: 'fire_pokemon', name: 'Огненный покемон', required: 1 },
                    { id: 'water_pokemon', name: 'Водный покемон', required: 1 },
                    { id: 'ground_pokemon', name: 'Земляной покемон', required: 1 }
                ]
            },
            { title: "Лига Джото", maxProgress: 3, desc: "Раскрась ещё 3 эволюции разных покемонов" },
            {
                title: "Лига Калоса",
                maxProgress: 5,
                desc: "Раскрась 1 покемона в воде, 1 покемона с открытым ртом, 1 покемона с закрытыми глазами, 1 летающего покемона, 1 эволюцию Иви",
                subtasks: [
                    { id: 'water_pokemon_2', name: 'Покемон в воде', required: 1 },
                    { id: 'open_mouth', name: 'Покемон с открытым ртом', required: 1 },
                    { id: 'closed_eyes', name: 'Покемон с закрытыми глазами', required: 1 },
                    { id: 'flying_pokemon', name: 'Летающий покемон', required: 1 },
                    { id: 'eevee_evolution', name: 'Эволюция Иви', required: 1 }
                ]
            },
            {
                title: "Лига Галара",
                maxProgress: 8,
                desc: "Раскрась 1 картинку, где присутствует покемон и цветы, 1 картинку, где присутствует солнце, 1 электрического покемона, раскрась 2 разворота, 1 покемона-антигероя, 1 картинку, где присутствует пляжный песок, 1 картинку, где отсутствует солнце",
                subtasks: [
                    { id: 'pokemon_with_flowers', name: 'Покемон и цветы', required: 1 },
                    { id: 'pokemon_with_sun', name: 'Покемон с солнцем', required: 1 },
                    { id: 'electric_pokemon', name: 'Электрический покемон', required: 1 },
                    { id: 'double_spreads', name: 'Развороты (2 штуки)', required: 2 },
                    { id: 'antihero_pokemon', name: 'Покемон-антигерой', required: 1 },
                    { id: 'beach_sand', name: 'Пляжный песок', required: 1 },
                    { id: 'no_sun', name: 'Без солнца', required: 1 }
                ]
            }
        ]
    },
    alcohol: {
        name: "Спиртесса",
        desc: "Раскрасить картинки спиртовыми маркерами (ДО/ПОСЛЕ со стикером и кодовым словом)",
        levels: [
            { title: "Новичок спирта", maxProgress: 3, desc: "Раскрась 3 картинки спиртовыми маркерами" },
            {
                title: "Emo girl",
                maxProgress: 8,
                desc: "Раскрась 4 картинки спиртовыми маркерами в ч/б и 4 картинки в розовых оттенках",
                subtasks: [
                    { id: 'bw_spirit', name: 'Черно-белые картинки', required: 4 },
                    { id: 'pink_spirit', name: 'Розовые оттенки', required: 4 }
                ]
            },
            {
                title: "Звезда",
                maxProgress: 12,
                desc: "Раскрась 6 картинок спиртовыми маркерами со звёздным небом/северным сиянием и 6 картинок с солнцем",
                subtasks: [
                    { id: 'starry_sky', name: 'Звёздное небо/северное сияние', required: 6 },
                    { id: 'sun_pictures', name: 'Картинки с солнцем', required: 6 }
                ]
            },
            {
                title: "Чародейка",
                maxProgress: 17,
                desc: "Раскрась 5 картинок спиртовыми маркерами с текстурой льда, 6 картинок с текстурой воды, 6 картинок с текстурой огня/лавы",
                subtasks: [
                    { id: 'ice_texture', name: 'Текстура льда', required: 5 },
                    { id: 'water_texture', name: 'Текстура воды', required: 6 },
                    { id: 'fire_texture', name: 'Текстура огня/лавы', required: 6 }
                ]
            },
            {
                title: "Мастер спирта",
                maxProgress: 20,
                desc: "Выполните 10 специальных заданий",
                subtasks: [
                    { id: 'statue_characters', name: 'Адаптируй и раскрась 2 персонажей под статуи', required: 2 },
                    { id: 'neon_pictures', name: 'Раскрась 2 картинки в неоне', required: 2 },
                    { id: 'transparency_texture', name: 'Раскрась 2 картинки с текстурой прозрачности', required: 2 },
                    { id: 'room_without_character', name: 'Раскрась 3 картинки с комнатой без персонажа', required: 3 },
                    { id: 'roof_tiles', name: 'Раскрась 1 картинку с черепицей на крыше дома', required: 1 },
                    { id: 'bird_characters', name: 'Раскрась 3 персонажей-птиц', required: 3 },
                    { id: 'glow_effect', name: 'Раскрась 2 картинки с эффектом свечения какого-либо объекта', required: 2 },
                    { id: 'moss_texture', name: 'Раскрась 2 картинки с мхом', required: 2 },
                    { id: 'marble_texture', name: 'Раскрась 1 картинку с текстурой мрамора', required: 1 },
                    { id: 'human_characters_2', name: 'Раскрась 2 картинки с персонажами-людьми', required: 2 }
                ]
            }
        ]
    },
    
    lion: {
        name: "Королева прайда",
        desc: "Пройди путь от почитателя Симбы до Королевы прайда (ДО/ПОСЛЕ со стикером и кодовым словом)",
        levels: [
            { title: "Почитатель Симбы", maxProgress: 1, desc: "Раскрась 1 картинку с Симбой" },
            { title: "Приятель Симбы", maxProgress: 3, desc: "Раскрась 3 картинки с Налой" },
            {
                title: "Друг Симбы",
                maxProgress: 3,
                desc: "Раскрась 1 картинку с Рафики, 1 картинку с Тимоном и/или Пумбой, 1 картинку с Зазу",
                subtasks: [
                    { id: 'rafiki', name: 'Рафики', required: 1 },
                    { id: 'timon_pumbaa', name: 'Тимон и/или Пумба', required: 1 },
                    { id: 'zazu', name: 'Зазу', required: 1 }
                ]
            },
            {
                title: "Член прайда",
                maxProgress: 5,
                desc: "Раскрась 1 картинку с Муфасой, 1 картинку со Шрамом, 1 картинка с Киарой, 1 картинку с Кову, 1 картинку с Сараби",
                subtasks: [
                    { id: 'mufasa', name: 'Муфаса', required: 1 },
                    { id: 'scar', name: 'Шрам', required: 1 },
                    { id: 'kiara', name: 'Киара', required: 1 },
                    { id: 'kovu', name: 'Кову', required: 1 },
                    { id: 'sarabi', name: 'Сараби', required: 1 }
                ]
            },
            {
                title: "Королева прайда",
                maxProgress: 8,
                desc: "Раскрась 1 картинку, где изображены Симба, Тимон и Пумба вместе, 1 картинку Симбы с Налой, 1 картинку, где изображены Шрам и Симба вместе, 1 картинку, где изображены Рафики и Симба вместе, 1 картинку, где изображены Симба и Муфаса вместе, 1 картинку с любым животным из этого м/ф, 2 картинки с Симбой на свое усмотрение",
                subtasks: [
                    { id: 'simba_timon_pumbaa', name: 'Симба+Тимон+Пумба', required: 1 },
                    { id: 'simba_nala', name: 'Симба с Налой', required: 1 },
                    { id: 'scar_simba', name: 'Шрам и Симба', required: 1 },
                    { id: 'rafiki_simba', name: 'Рафики и Симба', required: 1 },
                    { id: 'simba_mufasa', name: 'Симба и Муфаса', required: 1 },
                    { id: 'any_animal', name: 'Любое животное из м/ф', required: 1 },
                    { id: 'simba_custom_1', name: 'Симба (на выбор) #1', required: 1 },
                    { id: 'simba_custom_2', name: 'Симба (на выбор) #2', required: 1 }
                ]
            }
        ]
    },
    dragons: {
        name: "Мать Драконов",
        desc: "Раскрасить картинки драконов (ДО/ПОСЛЕ со стикером и кодовым словом)",
        levels: [
            { 
                title: "Любитель мультфильмов", 
                maxProgress: 1, 
                desc: "Раскрась 1 дракона из м/ф",
                subtasks: [
                    { id: 'movie_dragon_1', name: 'Дракон из мультфильма', required: 1 }
                ]
            },
            { 
                title: "Любитель фэнтези", 
                maxProgress: 3, 
                desc: "Раскрась 1 дракона не из м/ф, 1 дракона в полете, 1 дракона с огнем",
                subtasks: [
                    { id: 'fantasy_dragon', name: 'Дракон не из мультфильма', required: 1 },
                    { id: 'flying_dragon', name: 'Дракон в полете', required: 1 },
                    { id: 'fire_dragon', name: 'Дракон с огнем', required: 1 }
                ]
            },
            { 
                title: "Знаток драконов", 
                maxProgress: 3, 
                desc: "Раскрась 1 картинку с Мушу, 1 картинку с драконом из м/ф Вперед, 1 картинку с драконом и мечом",
                subtasks: [
                    { id: 'mushu', name: 'Мушу (Мулан)', required: 1 },
                    { id: 'forward_dragon', name: 'Дракон из м/ф Вперед', required: 1 },
                    { id: 'dragon_with_sword', name: 'Дракон и меч', required: 1 }
                ]
            },
            { 
                title: "Охотник на драконов", 
                maxProgress: 5, 
                desc: "Раскрась 2 картинки с Сису в обличии дракона, 2 картинки с мадам Мим в обличии дракона, 1 картинку Малифесенты в обличии дракона",
                subtasks: [
                    { id: 'sisu_dragon', name: 'Сису в обличии дракона', required: 2 },
                    { id: 'madame_mim_dragon', name: 'Мадам Мим в обличии дракона', required: 2 },
                    { id: 'maleficent_dragon', name: 'Малифесента в обличии дракона', required: 1 }
                ]
            },
            { 
                title: "Мать Драконов", 
                maxProgress: 8, 
                desc: "Раскрась 4 картинки с истинными драконами из м/ф, раскрась 4 дракона не из м/ф",
                subtasks: [
                    { id: 'true_movie_dragons', name: 'Истинные драконы из мультфильмов', required: 4 },
                    { id: 'true_fantasy_dragons', name: 'Истинные драконы не из мультфильмов', required: 4 }
                ]
            }
        ]
    },
    bear: {
        name: "Мишка",
        desc: "Раскрасить картинки из м/ф Винни-Пух (ДО/ПОСЛЕ со стикером и кодовым словом)",
        levels: [
            { title: "Хрюня", maxProgress: 1, desc: "Раскрась 1 картинку с Хрюней" },
            { title: "Тигруля", maxProgress: 3, desc: "Раскрась 3 картинки с Тигрулей" },
            {
                title: "Ру и Ко",
                maxProgress: 3,
                desc: "Раскрась 1 картинку с Ру, 1 картинку с Топой и 1 картинку с Кенгой",
                subtasks: [
                    { id: 'roo', name: 'Ру', required: 1 },
                    { id: 'topa', name: 'Топа', required: 1 },
                    { id: 'kenga', name: 'Кенга', required: 1 }
                ]
            },
            {
                title: "Великолепное трио",
                maxProgress: 5,
                desc: "Раскрась 2 картинки с Кроликом, 2 картинки с Иа и 1 картинку с Филином",
                subtasks: [
                    { id: 'rabbit', name: 'Кролик', required: 2 },
                    { id: 'eeyore', name: 'Иа', required: 2 },
                    { id: 'owl', name: 'Филин', required: 1 }
                ]
            },
            { title: "Мишка", maxProgress: 8, desc: "Раскрась 8 картинок с Винни-Пухом" }
        ]
    },
    fauna: {
        name: "Знаток фауны",
         desc: "Раскрасить картинки с разными животными, работы с животными-игрушками не принимаются (ДО/ПОСЛЕ со стикером и кодовым словом)",
        levels: [
            { title: "Знакомство с фауной", maxProgress: 1, desc: "Раскрась 1 картинку с оленем", subtasks: [{ id: 'deer_1', name: 'Олень', required: 1 }] },
            { title: "Любитель животных", maxProgress: 2, desc: "Раскрась 1 картинку с мышью (Микки Маус, Минни Маус и подобные не подходят) и 1 с медведем", subtasks: [{ id: 'mouse_1', name: 'Мышь', required: 1 }, { id: 'bear_1', name: 'Медведь', required: 1 }] },
            { title: "Друг животных", maxProgress: 3, desc: "Раскрась 1 с лисом, 1 со слоном, 1 с енотом", subtasks: [{ id: 'fox_1', name: 'Лиса', required: 1 }, { id: 'bear_2', name: 'Слон', required: 1 }, { id: 'mouse_2', name: 'Енот', required: 1 }] },
            { title: "Зоолог", maxProgress: 5, desc: "Раскрась 2 со скунсом, 2 картинки с обезьяной, 1 картинку со львом", subtasks: [{ id: 'skunk', name: 'Скунс', required: 2 }, { id: 'hare', name: 'Обезьяна', required: 2 }, { id: 'lion', name: 'Лев', required: 1 }] },
            { title: "Знаток фауны", maxProgress: 9, desc: "Раскрась 2 картинки с коровой, 2 картинки с волком, 3 картинки с козлом, 2 картинки с лосём", subtasks: [{ id: 'cow', name: 'Корова', required: 2 }, { id: 'wolf', name: 'Волк', required: 2 }, { id: 'crocodile', name: 'Козел', required: 3 }, { id: 'moose', name: 'Лось', required: 2 }] }
        ]
    },
    sea: {
    name: "Царица морей",
    desc: "Раскрасить картинки с морскими обитателями (ДО/ПОСЛЕ со стикером и кодовым словом)",
    levels: [
        { title: "Знакомство с морем", maxProgress: 1, desc: "Раскрась 1 картинку с Дори" },
        { title: "Юнга", maxProgress: 3, desc: "Раскрась 3 картинки с морскими млекопитающими" },
        { title: "Боцман", maxProgress: 3, desc: "Раскрась 3 картинки с муренами" },
        { 
            title: "Морской волк", 
            maxProgress: 5, 
            desc: "Раскрась 2 картинки с дельфинами, 2 картинки с крабом, 1 картинку с полосатой рыбой", 
            subtasks: [
                { id: 'dolphin', name: 'Дельфин', required: 2 },
                { id: 'crab', name: 'Краб', required: 2 },
                { id: 'fishstrip', name: 'Рыба с полосками', required: 1 }
            ]
        },
        { 
            title: "Царица морей", 
            maxProgress: 8, 
            desc: "Раскрась 3 картинки с крокодилами, 1 картинку с осьминогом, 4 картинки с акулой",  // ← ВОТ ЗДЕСЬ НЕ БЫЛО ЗАПЯТОЙ!
            subtasks: [
                { id: 'croc', name: 'Крокодил', required: 3 },
                { id: 'octopus', name: 'Осьминог', required: 1 },
                { id: 'shark', name: 'Акула', required: 4 }
            ]
        }
    ]
},
    queen: {
        name: "Злая королева",
        desc: "Пройди все уровни и узнай, что нужно, чтобы стать злой королевой (ДО/ПОСЛЕ со стикером и кодовым словом)",
        levels: [
            { 
                title: "Коварство", 
                maxProgress: 1, 
                desc: "Раскрась 1 картинку с Джафаром",
                subtasks: [
                    { id: 'jafar', name: 'Джафар', required: 1 }
                ]
            },
            { 
                title: "Львиный оскал", 
                maxProgress: 3, 
                desc: "Раскрась 2 картинки со Шрамом, 1 картинку с гиенами",
                subtasks: [
                    { id: 'scar_2', name: 'Шрам (2 картинки)', required: 2 },
                    { id: 'hyenas', name: 'Гиены', required: 1 }
                ]
            },
            { 
                title: "Чарующий голос", 
                maxProgress: 3, 
                desc: "Раскрась 1 картинку с Урсулой, 1 картинку с муренами, 1 картинку с Урсулой в образе Ванессы",
                subtasks: [
                    { id: 'ursula', name: 'Урсула', required: 1 },
                    { id: 'moray_eels', name: 'Мурены', required: 1 },
                    { id: 'vanessa', name: 'Урсула в образе Ванессы', required: 1 }
                ]
            },
            { 
                title: "Любимый цвет красный", 
                maxProgress: 5, 
                desc: "Раскрась 2 картинки со злодеями и огнем, 3 картинки злодеек в красных платьях",
                subtasks: [
                    { id: 'villains_with_fire', name: 'Злодеи с огнем', required: 2 },
                    { id: 'villainess_red_dress', name: 'Злодейки в красных платьях', required: 3 }
                ]
            },
            { 
                title: "Злая королева", 
                maxProgress: 8, 
                desc: "Раскрась 1 картинку с Намаари, 1 картинку со злой королевой из Белоснежки, 1 картинку с мадам Мим, 1 картинку с Круэлой, 1 картинку с Малифесентной, 1 картинку с Измой, 1 картинку с Красной королевой, 1 картинку с Морганой",
                subtasks: [
                    { id: 'namaari', name: 'Намаари', required: 1 },
                    { id: 'evil_queen', name: 'Злая королева (Белоснежка)', required: 1 },
                    { id: 'madame_mim', name: 'Мадам Мим', required: 1 },
                    { id: 'cruella', name: 'Круэлла', required: 1 },
                    { id: 'maleficent', name: 'Малифесента', required: 1 },
                    { id: 'yzma', name: 'Изма', required: 1 },
                    { id: 'red_queen', name: 'Красная королева', required: 1 },
                    { id: 'morgana', name: 'Моргана', required: 1 }
                ]
            }
        ]
    },
   
    mystery: {
        name: "Загадка",
        desc: "Раскрасить картинки из м/ф Скуби-Ду (ДО/ПОСЛЕ со стикером и кодовым словом)",
        levels: [
            { title: "Начинающий детектив", maxProgress: 1, desc: "Раскрась 1 картинку с персонажами из Скуби-Ду" },
            { title: "Подсадная утка", maxProgress: 3, desc: "Раскрась 3 картинки с персонажами Скуби-Ду без самого Скуби-Ду" },
            { title: "Детектив", maxProgress: 3, desc: "Раскрась 3 картинки со срывом маски со злодея" },
            { title: "Корпорация Тайна", maxProgress: 5, desc: "Раскрась 5 картинок со Скуби-Ду" },
            { title: "Загадка", maxProgress: 8, desc: "Раскрась 8 картинок из тома Скуби-Ду на выбор" }
        ]
    },
       anaconda: {
        name: "Анаконда",
        desc: "Раскрасить картинки со змеей (ДО/ПОСЛЕ со стикером и кодовым словом)",
        levels: [
           { title: "Исследователь змей", maxProgress: 1, desc: "Раскрась 1 картинку со змеей" },
            { title: "Добытчик яда", maxProgress: 2, desc: "Раскрась 1 картинку с Каа, 1 с Сэром Хиссом", subtasks: [{ id: 'kaa_1', name: 'Каа', required: 1 }, { id: 'sirhiss_1', name: 'Сэр Хисс', required: 1 }] },
            { title: "Заклинатель змей", maxProgress: 3, desc: "Раскрась 1 картинку с жезлом Джафара, 1 картинку, где змея гипнотизирует (действие), 1 картинку с Антонио Мадригаль", subtasks: [{ id: 'djafarzmeya', name: 'Жзл Джафара', required: 1 }, { id: 'gipnozzmeya_1', name: 'Змея гипнотизирует', required: 1 }, { id: 'antoniomadrigalzmeya_1', name: 'Антони Мадригаль', required: 1 }] },
            { title: "Василиск", maxProgress: 5, desc: "Раскрась 2 картинки с драконом без крыльев, 2 картинки с муренами, 1 картинка злодея в образе змеи", subtasks: [{ id: 'kitdragon', name: 'Дракон без крыльев', required: 2 }, { id: 'merenizmeyi', name: 'Мурены', required: 2 }, { id: 'zlodeizmeya', name: 'Злодей в образе змеи', required: 1 }] },
            { title: "Анаконда", maxProgress: 5, desc: "Раскрась 5 картинок со змеями не из Disney/Pixar", subtasks: [{ id: 'zmeyanature', name: 'Змея не из Disney/Pixar', required: 5 }] }
            
        ]
    },
   
   
           shock: {
    name: "Шок контент",
    desc: "Только самые КРЕЙЗИ смогут пройти всё, но награда того стоит (ДО/ПОСЛЕ со стикером и кодовым словом)",
    levels: [
        { title: "Первые шаги", maxProgress: 5, desc: "Раскрась 5 разворотов" },
        {
            title: "Что происходит?",
            maxProgress: 5,
            desc: "Раскрась 1 разворот с Ариэль, 1 картинку с измененным фоном, 1 разворот с полным отсутствием черного цвета (допускается замена цветов), 1 разворот, где присутствует 7 или больше персонажей (у персонажа есть какая-то роль в м/ф), 1 картинку, где преобладает желтый цвет (более 50%)",
            subtasks: [
                { id: 'ariel_spread', name: 'Разворот с Ариэль', required: 1 },
                { id: 'changed_background', name: 'Измененный фон', required: 1 },
                { id: 'no_black', name: 'Без черного цвета', required: 1 },
                { id: 'seven_characters', name: '7+ персонажей', required: 1 },
                { id: 'yellow_dominant', name: 'Преобладает желтый', required: 1 }
            ]
        },
        {
            title: "Крейзи",
            maxProgress: 5,
            desc: "Раскрась 1 Радость из м/ф Головоломка, 1 разворот в сине-фиолетовых оттенках (можно заменять цвета), 1 разворот в ч/б (можно зменять цвета), объедени 2 соседние картинки в единый разворот, раскрась 1 картинку из нашего стикерпака",
            subtasks: [
                { id: 'joy_inside_out', name: 'Радость (Головоломка)', required: 1 },
                { id: 'negative_spread', name: 'Разворот в сине-фиолетовых оттенках', required: 1 },
                { id: 'bw_spread', name: 'Черно-белый разворот', required: 1 },
                { id: 'combined_spread', name: 'Объединенный разворот', required: 1 },
                { id: 'sticker_pack', name: 'Картинка из стикерпака', required: 1 }
            ]
        },
        {
            title: "Имба",
            maxProgress: 5,
            desc: "Раскрась 1 разворот карандашами, 1 разворот фломастерами, 2 картинки не из мультфильмов, 1 разворот акриловыми маркерами, 1 разворот с Рапунцель",
            subtasks: [
                { id: 'pencils', name: 'Карандаши (разворот)', required: 1 },
                { id: 'felt_tips', name: 'Фломастеры (разворот)', required: 1 },
                { id: 'paints', name: '2 картинки не из мультфильмов', required: 2 },
                { id: 'acrylic_markers', name: 'Акриловые маркеры (разворот)', required: 1 },
                { id: 'pens_only', name: 'Разворот с Рапунцель', required: 1 }
            ]
        },
        { 
            title: "Шок контент", 
            maxProgress: 20, 
            desc: "Раскрась 3 разворота, где цветовой код состоит из 60 и более цветов, раскрась 10 картинок-обложек своих томов, раскрась 1 картинку, используя не более 4 маркеров (маркеры должны быть на фото), раскрась 3 картинки (НЕ развороты), где цветовой код состоит из 30 и более цветов, раскраст 3 картинки, где-изображен портрет персонажа",
            subtasks: [
                { id: 'rty1', name: 'Цветовой код 60+', required: 3 },
                { id: 'rty2', name: 'Обложки томов', required: 10 },
                { id: 'rty3', name: 'Не более 4 маркеров', required: 1 },
                { id: 'rty4', name: 'Цветовой код 30+', required: 3 },
                { id: 'rty5', name: 'Портрет', required: 3 }
            ]
        }
    ]
},
             scrooge: {
        name: "Скрудж",
        desc: "Соберите 2500 ашетиков на счету",
        levels: [
            { title: "Скрудж", maxProgress: 2500, desc: "Накопите 2500 ашетиков", isBalance: true }
        ]
    },
    benefactor: {
        name: "Благодетель",
        desc: "Поддержите развитие проекта",
        levels: [
            { title: "Благодетель", maxProgress: 1, desc: "Поддержите нас", isDonation: true }
        ]
    },
            
            
    season_pass: {
        name: "🌸 Сезонный пропуск",
        desc: "Выполняйте задания и получайте награды! Доступно до 30.04.2026",
        levels: [
            {
                title: "Уровень 1 - Первые лучи солнца",
                maxProgress: 3,
                desc: "Весна - время, когда появляются первые лучи солнца",
                subtasks: [
                    { id: 'sp_1_1', name: 'Раскрась 1 картинку со снегом/подтаявшим снегом', required: 1 },
                    { id: 'sp_1_2', name: 'Раскрась 1 разворот, где изображено солнце', required: 1 },
                    { id: 'sp_1_3', name: 'Раскрась 1 картинку с Алисой', required: 1 }
                ],
                freeReward: { type: 'achetiki', amount: 10, name: '10 ашетиков' },
                premiumReward: { type: 'achetiki', amount: 10, name: '10 ашетиков' }
            },
            {
                title: "Уровень 2 - Букет цветов",
                maxProgress: 3,
                desc: "Собери букет цветов и получи уникальное достижение",
                subtasks: [
                    { id: 'sp_2_1', name: 'Раскрась 1 картинку с цветами', required: 1 },
                    { id: 'sp_2_2', name: 'Раскрась 1 картинку, на которой изображены цветы и животные', required: 1 },
                    { id: 'sp_2_3', name: 'Раскрась 1 картинку персонажа Цветочек из м/ф Бемби', required: 1 }
                ],
              freeReward: { type: 'status_with_achetiki', status: 'Цветочек', amount: 10, name: 'Статус "Цветочек" + 10 ашетиков' },
                premiumReward: { type: 'status_with_achetiki', status: 'Бемби', amount: 10, name: 'Статус "Бемби" + 10 ашетиков' }
            },
            {
                title: "Уровень 3 - Сочная травка",
                maxProgress: 3,
                desc: "Весна - это время, когда появляется первая сочная травка",
                subtasks: [
                    { id: 'sp_3_1', name: 'Раскрась 1 картинку с Бемби и его друзьями', required: 1 },
                    { id: 'sp_3_2', name: 'Раскрась 1 картинку, где изображен хотя бы 1 муравей или гусеница', required: 1 },
                    { id: 'sp_3_3', name: 'Раскрась 1 картинку с лесом', required: 1 }
                ],
                freeReward: { type: 'achetiki', amount: 15, name: '15 ашетиков' },
                premiumReward: { type: 'achetiki', amount: 15, name: '15 ашетиков' }
            },
            {
                title: "Уровень 4 - Трепет сердца",
                maxProgress: 3,
                desc: "Весной трепещет сердце",
                subtasks: [
                    { id: 'sp_4_1', name: 'Раскрась 1 картинку с влюбленной парой животных', required: 1 },
                    { id: 'sp_4_2', name: 'Раскрась 1 картинку с влюбленной парой людей', required: 1 },
                    { id: 'sp_4_3', name: 'Раскрась 1 картинку, где присутствует семья из птичек', required: 1 }
                ],
                freeReward: { type: 'lottery_with_achetiki', lottery: 'Билет на розыгрыш Funko Pop Винни-Пух', amount: 15, name: 'Билет на розыгрыш Funko Pop Винни-Пух + 15 ашетиков' },
              premiumReward: { type: 'status_with_achetiki', status: 'Топотун', amount: 15, name: 'Статус "Топотун" + 15 ашетиков' }
            },
            {
                title: "Уровень 5 - Нежность",
                maxProgress: 3,
                desc: "Весна - это нежность",
                subtasks: [
                    { id: 'sp_5_1', name: 'Раскрась 1 картинку с Авророй', required: 1 },
                    { id: 'sp_5_2', name: 'Раскрась 1 картинку с Белль', required: 1 },
                    { id: 'sp_5_3', name: 'Раскрась 1 картинку с Жасмин', required: 1 }
                ],
                freeReward: { type: 'status_with_lottery', status: 'Нежность', lottery: 'Билет на розыгрыш любого тома Hachette А4', name: 'Статус "Нежность" + Билет на розыгрыш тома Hachette А4' },
                premiumReward: { type: 'lottery', reward: 'Билет на доп. розыгрыш тома Hachette А4', name: 'Билет на доп. розыгрыш тома Hachette А4' }
            }
        ]
    }
};   // ← ВАЖНО: ЗАКРЫВАЕМ TASK_BRANCHES!
        
        // ==========================================
        // ДОСТИЖЕНИЯ
        // ==========================================
        
        const ACHIEVEMENTS_DB = {
            'trainer': { id: 'trainer', name: 'Великий тренер', img: 'assets/achievements/ach1.png', desc: 'Завершена ветка "Великий тренер"', condition: 'Выполните все задания ветки "Великий тренер"' },
            'alcohol': { id: 'alcohol', name: 'Спиртесса', img: 'assets/achievements/ach2.png', desc: 'Завершена ветка "Спиртесса"', condition: 'Выполните все задания ветки "Спиртесса"' },
            'shock': { id: 'shock', name: 'Шок контент', img: 'assets/achievements/ach3.png', desc: 'Завершена ветка "Шок контент"', condition: 'Выполните все задания ветки "Шок контент"' },
            'lion': { id: 'lion', name: 'Королева прайда', img: 'assets/achievements/ach4.png', desc: 'Завершена ветка "Королева прайда"', condition: 'Выполните все задания ветки "Королева прайда"' },
            'dragons': { id: 'dragons', name: 'Мать Драконов', img: 'assets/achievements/ach5.png', desc: 'Завершена ветка "Мать Драконов"', condition: 'Выполните все задания ветки "Мать Драконов"' },
            'bear': { id: 'bear', name: 'Мишка', img: 'assets/achievements/ach6.png', desc: 'Завершена ветка "Мишка"', condition: 'Выполните все задания ветки "Мишка"' },
            'fauna': { id: 'fauna', name: 'Знаток фауны', img: 'assets/achievements/ach7.png', desc: 'Завершена ветка "Знаток фауны"', condition: 'Выполните все задания ветки "Знаток фауны"' },
            'sea': { id: 'sea', name: 'Царица морей', img: 'assets/achievements/ach8.png', desc: 'Завершена ветка "Царица морей"', condition: 'Выполните все задания ветки "Царица морей"' },
            'queen': { id: 'queen', name: 'Злая королева', img: 'assets/achievements/ach9.png', desc: 'Завершена ветка "Злая королева"', condition: 'Выполните все задания ветки "Злая королева"' },
            'scrooge': { id: 'scrooge', name: 'Скрудж', img: 'assets/achievements/ach10.png', desc: 'Накоплено 2500 ашетиков', condition: 'Накопите 2500 ашетиков' },
            'benefactor': { id: 'benefactor', name: 'Благодетель', img: 'assets/achievements/ach11.png', desc: 'Поддержали проект', condition: 'Поддержите нас' },
            'mystery': { id: 'mystery', name: 'Загадка', img: 'assets/achievements/ach12.png', desc: 'Завершена ветка "Загадка"', condition: 'Раскрасьте 20 картинок с персонажами Скуби-Ду' },
            'anaconda': { id: 'anaconda', name: 'Анаконда', img: 'assets/achievements/ach13.png', desc: 'Завершена ветка "Анаконда"', condition: 'Раскрасьте 20 картинок со змеей' },
            'molniya': { id: 'molniya', name: 'Молния', img: 'assets/achievements/ach_molniya.png', desc: 'Первым выполнил любую ветку заданий для Anna', condition: 'Быть первым, кто выполнит любую ветку заданий (кроме "Благодетель")' },
// Новые достижения для Season Pass
    'Цветочек': { id: 'Цветочек', name: 'Цветочек', img: 'assets/achievements/tutochek.png', desc: 'Получено за прохождение 2 уровня Season Pass', condition: 'Выполните все задания 2 уровня Season Pass' },
    'Бемби': { id: 'Бемби', name: 'Бемби', img: 'assets/achievements/bembi.png', desc: 'Получено за прохождение 2 уровня Season Pass (Благодетель)', condition: 'Выполните все задания 2 уровня Season Pass (Благодетель)' },
    'Топотун': { id: 'Топотун', name: 'Топотун', img: 'assets/achievements/topotun.png', desc: 'Получено за прохождение 4 уровня Season Pass (Благодетель)', condition: 'Выполните все задания 4 уровня Season Pass (Благодетель)' }
};
        // ==========================================
        // SEASON PASS ФУНКЦИИ
        // ==========================================
        
        let userSeasonPremium = false;
        
        async function loadSeasonPremiumStatus() {
            try {
                const response = await fetch(`${SERVER_URL}/api/stats?user_id=${userId}`);
                const stats = await response.json();
                userSeasonPremium = stats.season_premium || false;
                updatePremiumStatusDisplay();
            } catch (error) {
                console.error('Error loading premium status:', error);
            }
        }
        
        function updatePremiumStatusDisplay() {
    const statusSpan = document.getElementById('premiumStatusText');
    if (statusSpan) {
        // Скрываем блок с премиум статусом полностью
        const premiumBlock = document.getElementById('seasonPassPremiumStatus');
        if (premiumBlock) {
            premiumBlock.style.display = 'none';
        }
    }
}
        
        function loadClaimedRewards() {
    const saved = localStorage.getItem(`season_rewards_${userId}`);
    if (saved) {
        try {
            claimedSeasonRewards = JSON.parse(saved);
        } catch(e) {}
    }
}

function saveClaimedRewards() {
    localStorage.setItem(`season_rewards_${userId}`, JSON.stringify(claimedSeasonRewards));
}

function toggleSeasonPass() {
    var content = document.getElementById('seasonPassContent');
    var arrow = document.getElementById('seasonPassArrow');
    if (!content) return;
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        // renderSeasonPassTasks(); — НЕ вызываем
    } else {
        content.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
}

function renderSeasonPassTasks() {
    const currentLevelIndex = getCurrentLevelIndex('season_pass');
    
    const container = document.getElementById('seasonPassTasksList');
    if (!container) return;
    
    const branch = TASK_BRANCHES.season_pass;
    if (!branch) return;
    
    container.innerHTML = '';
    const levels = branch.levels;
    
    const rewardsLoaded = window._seasonRewardsLoaded;
    
    for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        const levelNum = i + 1;
        
        let totalCompleted = 0;
        let totalRequired = 0;
        
        if (level.subtasks) {
            level.subtasks.forEach((subtask, idx) => {
                const prog = getSubtaskProgress('season_pass', i, idx);
                totalCompleted += Math.min(prog, subtask.required);
                totalRequired += subtask.required;
            });
        }
        
        const totalPercent = (totalCompleted / totalRequired) * 100;
        const allSubtasksDone = totalCompleted >= totalRequired;
        const isCompleted = allSubtasksDone;
        const isLocked = levelNum > 1 && currentLevelIndex < (levelNum - 1);
        const isCurrent = levelNum === currentLevelIndex;
        
        if (allSubtasksDone && !user.achievements.includes(`season_pass_${levelNum}`)) {
            user.achievements.push(`season_pass_${levelNum}`);
            saveUserData();
            if (typeof fetchAPI === 'function') {
                fetchAPI('/api/add_achievement', { user_id: userId, achievement: `season_pass_${levelNum}` });
            }
        }
        
        const levelCard = document.createElement('div');
        levelCard.className = `sp-level-card ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`;
        
        let levelHtml = `
            <div class="sp-level-header">
                <span class="sp-level-number">Уровень ${levelNum}</span>
                <span class="sp-level-xp">${totalCompleted}/${totalRequired}</span>
            </div>
            <div class="level-desc">${level.desc}</div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${totalPercent}%"></div>
            </div>
            <div style="margin-top: 15px;"></div>
        `;
        
        if (!isLocked) {
            level.subtasks.forEach((subtask, idx) => {
                const currentProgress = getSubtaskProgress('season_pass', i, idx);
                const isSubtaskCompleted = currentProgress >= subtask.required;
                const subtaskPercent = (currentProgress / subtask.required) * 100;
                const showSubmitButton = !isSubtaskCompleted && !isLocked;
                
                levelHtml += `
                    <div class="subtask-card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <span style="font-weight: 600; font-size: 14px;">${subtask.name}</span>
                            <span style="font-size: 12px; color: var(--accent);">${currentProgress}/${subtask.required}</span>
                        </div>
                        <div class="progress-bar-container" style="height: 6px; margin: 0 0 12px 0;">
                            <div class="progress-bar-fill" style="width: ${subtaskPercent}%; height: 100%;"></div>
                        </div>
                        ${showSubmitButton ? `
                            <button class="task-submit-btn" style="padding: 10px; font-size: 13px; margin-top: 8px;" onclick="openSubtaskUpload('season_pass', ${i}, ${idx}, '${subtask.name}')">
                                <i class="fas fa-camera"></i> Отправить фото: ${subtask.name}
                            </button>
                        ` : isSubtaskCompleted ? `
                            <div style="text-align: center; color: var(--status-green); font-size: 12px; margin-top: 8px;">
                                <i class="fas fa-check-circle"></i> Выполнено!
                            </div>
                        ` : !isCurrent && !isCompleted ? `
                            <div style="text-align: center; color: var(--text-gray); font-size: 12px; margin-top: 8px;">
                                <i class="fas fa-lock"></i> Выполните предыдущий уровень
                            </div>
                        ` : ''}
                    </div>
                `;
            });
        } else {
            levelHtml += `
                <div class="subtask-card" style="text-align: center; opacity: 0.5;">
                    <div style="padding: 15px;">
                        <i class="fas fa-lock" style="font-size: 24px; margin-bottom: 8px;"></i>
                        <div>Задания скрыты</div>
                        <div style="font-size: 12px; margin-top: 5px;">Выполните предыдущий уровень</div>
                    </div>
                </div>
            `;
        }
        
        const freeClaimed = claimedSeasonRewards ? claimedSeasonRewards.free.includes(levelNum) : false;
        const premiumClaimed = claimedSeasonRewards ? claimedSeasonRewards.premium.includes(levelNum) : false;
        
        // ✅ Блокировка до загрузки с сервера
        const canClaimFree = rewardsLoaded && allSubtasksDone && !freeClaimed && !isLocked;
        const canClaimPremium = rewardsLoaded && userSeasonPremium && allSubtasksDone && !premiumClaimed && !isLocked;
        
        levelHtml += `
            <div class="sp-level-rewards">
                <div class="sp-reward-item free">
                    <div>🎁 Награда</div>
                    <div><strong>${level.freeReward.name}</strong></div>
                    ${!rewardsLoaded ? '<div class="sp-reward-claimed">⏳ Загрузка...</div>' :
                        canClaimFree ? `<button class="sp-reward-btn" onclick="claimSeasonReward(${levelNum}, 'free')">Получить</button>` : 
                        (freeClaimed ? '<div class="sp-reward-claimed">✅ Получено</div>' : 
                            (isLocked ? '<div class="sp-reward-claimed">🔒 Уровень заблокирован</div>' : '<div class="sp-reward-claimed">🔒 Завершите уровень</div>'))
                    }
                </div>
                <div class="sp-reward-item premium ${userSeasonPremium && allSubtasksDone && !isLocked ? 'unlocked' : ''}">
                    <div>🎁 Награда для благодетелей</div>
                    <div><strong>${level.premiumReward.name}</strong></div>
                    ${!rewardsLoaded ? '<div class="sp-reward-claimed">⏳ Загрузка...</div>' :
                        canClaimPremium ? `<button class="sp-reward-btn" onclick="claimSeasonReward(${levelNum}, 'premium')">Получить</button>` : 
                        (premiumClaimed ? '<div class="sp-reward-claimed">✅ Получено</div>' : 
                            (!userSeasonPremium ? '<div class="sp-reward-claimed">🔒 Только для благодетелей</div>' : 
                                (isLocked ? '<div class="sp-reward-claimed">🔒 Уровень заблокирован</div>' : '<div class="sp-reward-claimed">🔒 Завершите уровень</div>')))
                    }
                </div>
            </div>
        `;
        
        levelCard.innerHTML = levelHtml;
        container.appendChild(levelCard);
    }
}
function checkAndFixSeasonPassProgress() {
    console.log('🔍 Проверка прогресса Season Pass...');
    
    let anyLevelUnlocked = false;
    
    for (let level = 0; level < 5; level++) {
        const levelData = TASK_BRANCHES.season_pass.levels[level];
        if (!levelData) continue;
        
        let allSubtasksDone = true;
        if (levelData.subtasks) {
            levelData.subtasks.forEach((subtask, idx) => {
                const prog = getSubtaskProgress('season_pass', level, idx);
                if (prog < subtask.required) {
                    allSubtasksDone = false;
                }
            });
        }
        
        if (allSubtasksDone && level < 4) {
            console.log(`✅ Уровень ${level+1} пройден, разблокируем уровень ${level+2}`);
            anyLevelUnlocked = true;
        }
    }
    
    if (anyLevelUnlocked) {
        renderSeasonPassTasks();
        console.log('🎉 Уровни разблокированы!');
    }
    
    return anyLevelUnlocked;
}

 function claimSeasonReward(levelNum, type) {
    const branch = TASK_BRANCHES.season_pass;
    const levelData = branch.levels[levelNum - 1];
    if (!levelData) return;
    
    let allSubtasksCompleted = true;
    levelData.subtasks.forEach((subtask, idx) => {
        const progress = getSubtaskProgress('season_pass', levelNum - 1, idx);
        if (progress < subtask.required) {
            allSubtasksCompleted = false;
        }
    });
    
    if (!allSubtasksCompleted) {
        if (tg) tg.showAlert('❌ Сначала выполните все задания уровня');
        return;
    }
    
    if (type === 'free') {
        if (claimedSeasonRewards.free.includes(levelNum)) {
            if (tg) tg.showAlert('❌ Награда уже получена');
            return;
        }
        
        const reward = levelData.freeReward;
        
        if (reward.type === 'achetiki') {
            fetch(`${SERVER_URL}/api/add_balance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, amount: reward.amount, reason: `Season Pass уровень ${levelNum} бесплатная награда` })
            }).then(async response => {
                const result = await response.json();
                if (result && result.status === 'ok') {
                    if (result.new_balance !== undefined) { user.balance = result.new_balance; }
                    else { user.balance += reward.amount; }
                    saveUserData();
                    updateUI();
                    if (tg) tg.showAlert(`✅ Получено ${reward.amount} ашетиков!`);
                } else {
                    user.balance += reward.amount;
                    saveUserData();
                    updateUI();
                }
            }).catch(error => {
                user.balance += reward.amount;
                saveUserData();
                updateUI();
            });
        }
        else if (reward.type === 'achievement') {
            if (!user.unlockedStatuses.includes(reward.reward)) {
                user.unlockedStatuses.push(reward.reward);
                saveUserData();
                fetch(`${SERVER_URL}/api/sync_status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, status: reward.reward, action: 'unlock' }) });
                if (tg) tg.showAlert(`✅ Получен статус "${reward.reward}"!`);
            }
        }
        else if (reward.type === 'achievement_with_achetiki') {
            if (!user.unlockedStatuses.includes(reward.achievement)) {
                user.unlockedStatuses.push(reward.achievement);
                saveUserData();
                fetch(`${SERVER_URL}/api/sync_status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, status: reward.achievement, action: 'unlock' }) });
            }
            fetch(`${SERVER_URL}/api/add_balance`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, amount: reward.amount, reason: `Season Pass уровень ${levelNum} награда` }) })
            .then(async response => {
                const result = await response.json();
                if (result && result.status === 'ok') { user.balance = result.new_balance; saveUserData(); updateUI(); }
            }).catch(error => { user.balance += reward.amount; saveUserData(); updateUI(); });
            if (tg) tg.showAlert(`✅ Получен статус "${reward.achievement}" и ${reward.amount} ашетиков!`);
        }
        else if (reward.type === 'status') {
            if (!user.unlockedStatuses.includes(reward.reward)) {
                user.unlockedStatuses.push(reward.reward);
                saveUserData();
                fetch(`${SERVER_URL}/api/sync_status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, status: reward.reward, action: 'unlock' }) });
                if (tg) tg.showAlert(`✅ Получен статус "${reward.reward}"!`);
            }
        }
        else if (reward.type === 'status_with_achetiki') {
            if (!user.unlockedStatuses.includes(reward.status)) {
                user.unlockedStatuses.push(reward.status);
                saveUserData();
                fetch(`${SERVER_URL}/api/sync_status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, status: reward.status, action: 'unlock' }) });
            }
            fetch(`${SERVER_URL}/api/add_balance`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, amount: reward.amount, reason: `Season Pass уровень ${levelNum} награда` }) })
            .then(async response => {
                const result = await response.json();
                if (result && result.status === 'ok') { user.balance = result.new_balance; saveUserData(); updateUI(); }
            }).catch(error => { user.balance += reward.amount; saveUserData(); updateUI(); });
           try {
   console.log('✅ Получен статус:', reward.status, 'и', reward.amount, 'ашетиков!');
} catch(e) {
    console.log('Получен статус:', reward.status);
}
        }
        else if (reward.type === 'status_with_lottery') {
            if (!user.unlockedStatuses.includes(reward.status)) {
                user.unlockedStatuses.push(reward.status);
                saveUserData();
                fetch(`${SERVER_URL}/api/sync_status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, status: reward.status, action: 'unlock' }) });
            }
            const lotteryTickets = JSON.parse(localStorage.getItem(`lottery_tickets_${userId}`) || '[]');
            lotteryTickets.push({ level: levelNum, type: type, reward: reward.lottery, date: new Date().toISOString() });
            localStorage.setItem(`lottery_tickets_${userId}`, JSON.stringify(lotteryTickets));
            fetch(`${SERVER_URL}/api/add_lottery_ticket`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, level: levelNum, type: type, reward: reward.lottery }) });
            if (tg) tg.showAlert(`✅ ${reward.name}!`);
        }
        else if (reward.type === 'lottery') {
            const lotteryTickets = JSON.parse(localStorage.getItem(`lottery_tickets_${userId}`) || '[]');
            lotteryTickets.push({ level: levelNum, type: type, reward: reward.reward, date: new Date().toISOString() });
            localStorage.setItem(`lottery_tickets_${userId}`, JSON.stringify(lotteryTickets));
            fetch(`${SERVER_URL}/api/add_lottery_ticket`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, level: levelNum, type: type, reward: reward.reward }) });
            if (tg) tg.showAlert(`✅ ${reward.name}!`);
        }
        else if (reward.type === 'lottery_with_achetiki') {
            fetch(`${SERVER_URL}/api/add_balance`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, amount: reward.amount, reason: `Season Pass уровень ${levelNum} награда` }) })
            .then(async response => {
                const result = await response.json();
                if (result && result.status === 'ok') { user.balance = result.new_balance; saveUserData(); updateUI(); }
            }).catch(error => { user.balance += reward.amount; saveUserData(); updateUI(); });
            const lotteryTickets = JSON.parse(localStorage.getItem(`lottery_tickets_${userId}`) || '[]');
            lotteryTickets.push({ level: levelNum, type: type, reward: reward.lottery, date: new Date().toISOString() });
            localStorage.setItem(`lottery_tickets_${userId}`, JSON.stringify(lotteryTickets));
            fetch(`${SERVER_URL}/api/add_lottery_ticket`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, level: levelNum, type: type, reward: reward.lottery }) });
            if (tg) tg.showAlert(`✅ ${reward.name}!`);
        }
        
        claimedSeasonRewards.free.push(levelNum);
        saveClaimedRewards();
        renderSeasonPassTasks();
        
        if (levelNum < 5) {
            const allCurrentSubtasksDone = levelData.subtasks.every((subtask, idx) => getSubtaskProgress('season_pass', levelNum - 1, idx) >= subtask.required);
            if (allCurrentSubtasksDone) {
                saveUserData();
                renderSeasonPassTasks();
                if (tg) tg.showAlert(`🎉 Уровень ${levelNum} пройден! Открыт уровень ${levelNum + 1}!`);
            }
        }
        
    } else if (type === 'premium') {
        if (!userSeasonPremium) { if (tg) tg.showAlert('❌ Премиум пропуск не активен'); return; }
        if (claimedSeasonRewards.premium.includes(levelNum)) { if (tg) tg.showAlert('❌ Награда уже получена'); return; }
        
        const reward = levelData.premiumReward;
        console.log('PREMIUM reward type:', reward.type, 'level:', levelNum);
        if (reward.type === 'achetiki') {
            fetch(`${SERVER_URL}/api/add_balance`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, amount: reward.amount, reason: `Season Pass уровень ${levelNum} премиум награда` }) })
            .then(async response => {
                const result = await response.json();
                if (result && result.status === 'ok') { user.balance = result.new_balance; saveUserData(); updateUI(); if (tg) tg.showAlert(`✅ Получено ${reward.amount} ашетиков!`); }
                else { user.balance += reward.amount; saveUserData(); updateUI(); }
            }).catch(error => { user.balance += reward.amount; saveUserData(); updateUI(); });
        }
        else if (reward.type === 'achievement') {
            if (!user.unlockedStatuses.includes(reward.reward)) {
                user.unlockedStatuses.push(reward.reward);
                saveUserData();
                fetch(`${SERVER_URL}/api/sync_status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, status: reward.reward, action: 'unlock' }) });
                if (tg) tg.showAlert(`✅ Получен статус "${reward.reward}"!`);
            }
        }
        else if (reward.type === 'achievement_with_achetiki') {
            if (!user.unlockedStatuses.includes(reward.achievement)) {
                user.unlockedStatuses.push(reward.achievement);
                saveUserData();
                fetch(`${SERVER_URL}/api/sync_status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, status: reward.achievement, action: 'unlock' }) });
            }
            fetch(`${SERVER_URL}/api/add_balance`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, amount: reward.amount, reason: `Season Pass уровень ${levelNum} премиум награда` }) })
            .then(async response => {
                const result = await response.json();
                if (result && result.status === 'ok') { user.balance = result.new_balance; saveUserData(); updateUI(); }
            }).catch(error => { user.balance += reward.amount; saveUserData(); updateUI(); });
            if (tg) tg.showAlert(`✅ Получен статус "${reward.achievement}" и ${reward.amount} ашетиков!`);
        }
        else if (reward.type === 'status') {
            if (!user.unlockedStatuses.includes(reward.reward)) {
                user.unlockedStatuses.push(reward.reward);
                saveUserData();
                fetch(`${SERVER_URL}/api/sync_status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, status: reward.reward, action: 'unlock' }) });
                if (tg) tg.showAlert(`✅ Получен статус "${reward.reward}"!`);
            }
        }
        else if (reward.type === 'status_with_achetiki') {
            if (!user.unlockedStatuses.includes(reward.status)) {
                user.unlockedStatuses.push(reward.status);
                saveUserData();
                fetch(`${SERVER_URL}/api/sync_status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, status: reward.status, action: 'unlock' }) });
            }
            fetch(`${SERVER_URL}/api/add_balance`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, amount: reward.amount, reason: `Season Pass уровень ${levelNum} премиум награда` }) })
            .then(async response => {
                const result = await response.json();
                if (result && result.status === 'ok') { user.balance = result.new_balance; saveUserData(); updateUI(); }
            }).catch(error => { user.balance += reward.amount; saveUserData(); updateUI(); });
            console.log('✅ Получен статус:', reward.status, 'и', reward.amount, 'ашетиков!');
        }
        else if (reward.type === 'status_with_lottery') {
            if (!user.unlockedStatuses.includes(reward.status)) {
                user.unlockedStatuses.push(reward.status);
                saveUserData();
                fetch(`${SERVER_URL}/api/sync_status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, status: reward.status, action: 'unlock' }) });
            }
            const lotteryTickets = JSON.parse(localStorage.getItem(`lottery_tickets_${userId}`) || '[]');
            lotteryTickets.push({ level: levelNum, type: type, reward: reward.lottery, date: new Date().toISOString() });
            localStorage.setItem(`lottery_tickets_${userId}`, JSON.stringify(lotteryTickets));
            fetch(`${SERVER_URL}/api/add_lottery_ticket`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, level: levelNum, type: type, reward: reward.lottery }) });
            if (tg) tg.showAlert(`✅ ${reward.name}!`);
        }
        else if (reward.type === 'lottery') {
            const lotteryTickets = JSON.parse(localStorage.getItem(`lottery_tickets_${userId}`) || '[]');
            lotteryTickets.push({ level: levelNum, type: type, reward: reward.reward, date: new Date().toISOString() });
            localStorage.setItem(`lottery_tickets_${userId}`, JSON.stringify(lotteryTickets));
            fetch(`${SERVER_URL}/api/add_lottery_ticket`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, level: levelNum, type: type, reward: reward.reward }) });
            if (tg) tg.showAlert(`✅ ${reward.name}!`);
        }
        
        claimedSeasonRewards.premium.push(levelNum);
        saveClaimedRewards();
        renderSeasonPassTasks();
        
        if (levelNum < 5) {
            const allCurrentSubtasksDone = levelData.subtasks.every((subtask, idx) => getSubtaskProgress('season_pass', levelNum - 1, idx) >= subtask.required);
            if (allCurrentSubtasksDone) {
                renderSeasonPassTasks();
                if (tg) tg.showAlert(`🎉 Уровень ${levelNum} пройден! Открыт уровень ${levelNum + 1}!`);
            }
        }
    }
}
function unlockNextLevel(currentLevel) {
    console.log(`🔓 Разблокировка уровня ${currentLevel + 1}`);
    
    // Проверяем, что текущий уровень действительно пройден
    const branch = TASK_BRANCHES.season_pass;
    const levelData = branch.levels[currentLevel - 1];
    
    if (levelData) {
        let allSubtasksDone = true;
        levelData.subtasks.forEach((subtask, idx) => {
            const prog = getSubtaskProgress('season_pass', currentLevel - 1, idx);
            if (prog < subtask.required) {
                allSubtasksDone = false;
            }
        });
        
        if (allSubtasksDone) {
            console.log(`✅ Уровень ${currentLevel} пройден, разблокируем уровень ${currentLevel + 1}`);
            
            // Принудительно обновляем локальный прогресс
            saveUserData();
            
            // Перерисовываем с новым currentLevelIndex
            renderSeasonPassTasks();
            
            if (tg) tg.showAlert(`🎉 Уровень ${currentLevel} пройден! Открыт уровень ${currentLevel + 1}!`);
        } else {
            console.log(`❌ Уровень ${currentLevel} еще не пройден полностью`);
            if (tg) tg.showAlert(`❌ Сначала выполните все задания уровня ${currentLevel}`);
        }
    }
}
async function loadFriendProgressFromServer() {
    try {
        const response = await fetch(`${SERVER_URL}/api/stats?user_id=${userId}`);
        const stats = await response.json();
        
        if (stats) {
            // Загружаем friend_progress
            if (stats.friend_progress) {
                for (const [key, value] of Object.entries(stats.friend_progress)) {
                    friendProgress[key] = value;
                }
            }
            
            // Проверяем ВСЕ ключи напрямую (friend_ и irina_)
            for (const [key, value] of Object.entries(stats)) {
                if ((key.startsWith('friend_') || key.startsWith('irina_')) && typeof value === 'number') {
                    friendProgress[key] = value;
                }
            }
            
            saveFriendProgress();
            renderFriendTasks();
            console.log('✅ Friend tasks rendered');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
async function loadColoringBooks() {
    try {
        const response = await fetch(`${SERVER_URL}/api/coloring_books?user_id=${userId}`);
        const data = await response.json();
        
        if (data && typeof data === 'object') {
            userColoringBooks = { paint_by_number: [], alcohol: [], pencil: [], custom: [] };
            
            for (const category in data) {
                userColoringBooks[category] = (data[category] || []).map(book => {
                    if (typeof book === 'string') {
                        const config = BOOK_PAGES_CONFIG[book] || DEFAULT_PAGES_CONFIG;
                        return {
                            name: book,
                            custom: false,
                            totalPages: config.totalPages,
                            spreads: config.spreads || []
                        };
                    }
                    // ✅ Обновляем totalPages из конфига для не-кастомных книг
                    if (!book.custom && BOOK_PAGES_CONFIG[book.name]) {
                        book.totalPages = BOOK_PAGES_CONFIG[book.name].totalPages;
                        book.spreads = BOOK_PAGES_CONFIG[book.name].spreads || [];
                    }
                    // ✅ Если в объекте нет spreads — добавляем из конфига
                    if (!book.spreads && BOOK_PAGES_CONFIG[book.name]) {
                        book.spreads = BOOK_PAGES_CONFIG[book.name].spreads || [];
                    }
                    // ✅ Преобразуем старые пути /custom_covers/ в полный URL
                    if (book.cover && book.cover.startsWith('/custom_covers')) {
                        book.cover = SERVER_URL + book.cover;
                    }
                    return book;
                });
            }
        }
        
        localStorage.setItem(`coloring_books_${userId}`, JSON.stringify(userColoringBooks));
        updateColoringBooksStats();
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        const saved = localStorage.getItem(`coloring_books_${userId}`);
        if (saved) userColoringBooks = JSON.parse(saved);
        updateColoringBooksStats();
    }
}
async function updateColoringBook(category, bookName, action) {
    try {
        const response = await fetch(`${SERVER_URL}/api/coloring_books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                category: category,
                book_name: bookName,
                action: action
            })
        });
        
        const result = await response.json();
        
        if (result.status === 'ok') {
            if (action === 'add') {
                if (!userColoringBooks[category]) userColoringBooks[category] = [];
                if (!userColoringBooks[category].includes(bookName)) {
                    userColoringBooks[category].push(bookName);
                }
            } else {
                userColoringBooks[category] = userColoringBooks[category].filter(b => {
                    if (typeof b === 'string') return b !== bookName;
                    return b.name !== bookName;
                });
            }
            updateColoringBooksStats();
            renderColoringBooks();
        }
    } catch (error) {
        console.error('Error updating coloring book:', error);
    }
}

function handleCoverSelect(category) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            selectedCoverFile = file;
            
            // Показываем превью
            const reader = new FileReader();
            reader.onload = (ev) => {
                const preview = document.getElementById(`cover-preview-${category}`);
                if (preview) {
                    preview.innerHTML = `<img src="${ev.target.result}" class="cover-preview">`;
                }
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

async function addCustomBook(category) {
    const input = document.getElementById(`custom-book-${category}`);
    const pagesInput = document.getElementById(`custom-book-pages-${category}`);
    const bookName = input?.value.trim();
    const totalPages = pagesInput ? parseInt(pagesInput.value) : 60;
    
    if (!bookName) {
        if (tg) tg.showAlert('❌ Введите название раскраски');
        return;
    }
    
    if (totalPages < 1 || totalPages > 500) {
        if (tg) tg.showAlert('❌ Количество страниц должно быть от 1 до 500');
        return;
    }
    
    try {
        const response = await fetch(`${SERVER_URL}/api/coloring_books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                category: category,
                book_name: bookName,
                action: 'add',
                total_pages: totalPages,
                custom: true
            })
        });
        
        const result = await response.json();
        
        if (result.status === 'ok') {
            if (!userColoringBooks[category]) userColoringBooks[category] = [];
            
            const existingIndex = userColoringBooks[category].findIndex(b => {
                const name = typeof b === 'string' ? b : b.name;
                return name === bookName;
            });
            
            const bookEntry = {
                name: bookName,
                custom: true,
                totalPages: totalPages
            };
            
            if (existingIndex !== -1) {
                userColoringBooks[category][existingIndex] = bookEntry;
            } else {
                userColoringBooks[category].push(bookEntry);
            }
            
            BOOK_PAGES_CONFIG[bookName] = {
                totalPages: totalPages,
                spreads: []
            };
            
            localStorage.setItem(`coloring_books_${userId}`, JSON.stringify(userColoringBooks));
            
            updateCategoryCounters();
            updateColoringBooksStats();
            updateAllCategoriesProgress();
            renderColoringBooks();
            
            input.value = '';
            if (pagesInput) pagesInput.value = '60';
            
            console.log(`✅ Кастомная раскраска добавлена: ${bookName}, ${totalPages} стр.`);
            
            if (tg) tg.showAlert(`✅ "${bookName}" добавлена (${totalPages} стр.)!`);
        } else {
            throw new Error(result.message || 'Ошибка сервера');
        }
    } catch (error) {
        console.error('Ошибка добавления кастомной раскраски:', error);
        if (tg) tg.showAlert('❌ Ошибка соединения');
    }
}
        function renderColoringBooks() {
    const categories = ['paint_by_number', 'alcohol', 'pencil', 'custom'];
    
    categories.forEach(category => {
        const container = document.getElementById(`category-${category}`);
        if (!container) return;
        
        const userBooks = userColoringBooks[category] || [];
        
        let defaultBooks = (DEFAULT_COLORING_BOOKS[category] || []).map(name => ({
            name: name,
            custom: false,
            cover: DEFAULT_COVERS[name] || 'assets/coloriages/default.jpg'
        }));
        
        let allBooks = [...defaultBooks];
        userBooks.forEach(book => {
            const bookName = typeof book === 'string' ? book : book.name;
            if (!allBooks.find(b => b.name === bookName)) {
                allBooks.push(typeof book === 'string' ? { name: book, custom: true, cover: null } : book);
            }
        });
        
        // Обновляем счётчик
        const collectedCount = userBooks.length;
        const totalCount = allBooks.length;
        const countEl = document.getElementById(`category-count-${category}`);
        if (countEl) countEl.textContent = `${collectedCount}/${totalCount}`;
        
        let html = '';
        
        // ✅ Форма добавления — вверху над томами
        html += `
            <div style="grid-column: span 2; margin-bottom: 10px;">
                <div class="add-book-form">
                    <input type="text" id="custom-book-${category}" placeholder="Название новой раскраски...">
                    <div style="display: flex; gap: 8px; margin-top: 8px;">
                        <input type="number" id="custom-book-pages-${category}" placeholder="Страниц" value="60" min="1" max="500" style="flex: 1; padding: 10px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text); font-size: 14px;">
                        <button class="add-custom-btn" onclick="addCustomBook('${category}')" style="flex: 1;">Добавить</button>
                    </div>
                </div>
            </div>
        `;
        
        allBooks.forEach(book => {
            const bookName = book.name;
            const collected = userBooks.some(b => (typeof b === 'string' ? b : b.name) === bookName);
            
            let totalPages = DEFAULT_PAGES_CONFIG.totalPages;
            const userBook = userBooks.find(b => (typeof b === 'string' ? b : b.name) === bookName);
            
            if (userBook && typeof userBook === 'object' && userBook.totalPages) {
                totalPages = userBook.totalPages;
            } else if (BOOK_PAGES_CONFIG[bookName]) {
                totalPages = BOOK_PAGES_CONFIG[bookName].totalPages;
            }
            
            const bookKey = `${category}_${bookName}`;
            const completedPages = userCompletedPages[bookKey] || {};
            let completedCount = 0;
            
            for (const page in completedPages) {
                if (page.includes('-')) {
                    completedCount += 2;
                } else {
                    completedCount += 1;
                }
            }
            
            const progressPercent = totalPages > 0 ? Math.round((completedCount / totalPages) * 100) : 0;
            
            let coverUrl = book.cover || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23ff9500' rx='12'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='40' font-family='Arial'%3E📚%3C/text%3E%3C/svg%3E";
            
            if (coverUrl && coverUrl.startsWith('/custom_covers')) {
                coverUrl = SERVER_URL + coverUrl;
            }
            
            if (coverUrl && !coverUrl.startsWith('data:') && !coverUrl.includes('/custom_covers')) {
                coverUrl = coverUrl + '?v=2';
            }
            
            html += `
                <div class="coloring-book-item ${collected ? 'collected' : ''}" data-book-name="${bookName.toLowerCase()}">
                    <img src="${coverUrl}" 
                         class="book-cover" 
                         loading="lazy"
                         decoding="async"
                         onclick="openBookPagesModal('${category}', '${bookName.replace(/'/g, "\\'")}')" 
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23ff9500%22 rx=%2212%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2240%22 font-family=%22Arial%22%3E📚%3C/text%3E%3C/svg%3E'">
                    <div class="book-info" onclick="openBookPagesModal('${category}', '${bookName.replace(/'/g, "\\'")}')">
                        <div class="book-name">${bookName}</div>
                        ${collected ? `
                            <div class="book-progress-container">
                                <div class="book-progress-bar">
                                    <div class="book-progress-fill" style="width: ${progressPercent}%;"></div>
                                </div>
                                <div class="book-progress-text">${completedCount}/${totalPages} (${progressPercent}%)</div>
                            </div>
                        ` : ''}
                        ${book.custom ? '<div class="book-category">Моя раскраска</div>' : ''}
                    </div>
                    ${book.custom ? `
                        <button class="add-cover-btn" onclick="event.stopPropagation(); uploadCustomCover('${category}', '${bookName.replace(/'/g, "\\'")}')">
                            <i class="fas fa-camera"></i> Обложка
                        </button>
                    ` : ''}
                    <div class="remove-btn" onclick="event.stopPropagation(); toggleColoringBook('${category}', '${bookName.replace(/'/g, "\\'")}')">
                        ${collected ? '✓' : '+'}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    });
    
    updateColoringBooksStats();
    updateAllCategoriesProgress();
    
    setTimeout(() => {
        document.querySelectorAll('.coloring-book-item').forEach(card => {
            const nameEl = card.querySelector('.book-name');
            if (nameEl && typeof addWishlistHeartToBookCard === 'function') {
                addWishlistHeartToBookCard(card, nameEl.innerText);
            }
        });
    }, 100);
}
async function toggleColoringBook(category, bookName) {
    if (!userColoringBooks[category]) userColoringBooks[category] = [];
    
    const collected = userColoringBooks[category].some(b => 
        (typeof b === 'string' ? b : b.name) === bookName
    );
    
    if (collected) {
        const doDelete = async () => {
            userColoringBooks[category] = userColoringBooks[category].filter(b => 
                (typeof b === 'string' ? b : b.name) !== bookName
            );
            
            localStorage.setItem(`coloring_books_${userId}`, JSON.stringify(userColoringBooks));
            
            try {
                await fetch(`${SERVER_URL}/api/coloring_books`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: userId,
                        category: category,
                        book_name: bookName,
                        action: 'remove'
                    })
                });
            } catch (error) {
                console.error('Ошибка сервера:', error);
            }
            
            updateCategoryCounters();
            updateColoringBooksStats();
            updateAllCategoriesProgress();
            renderColoringBooks();
            
            if (tg) tg.showAlert(`❌ "${bookName}" удалена`);
        };
        
        if (tg) {
            tg.showConfirm(`Удалить раскраску "${bookName}" из коллекции?`, (confirm) => {
                if (confirm) doDelete();
            });
        } else {
            if (confirm(`Удалить раскраску "${bookName}" из коллекции?`)) {
                doDelete();
            }
        }
    } else {
        const config = BOOK_PAGES_CONFIG[bookName] || DEFAULT_PAGES_CONFIG;
        
        const bookEntry = {
            name: bookName,
            custom: false,
            totalPages: config.totalPages,
            spreads: config.spreads || []
        };
        
        userColoringBooks[category].push(bookEntry);
        localStorage.setItem(`coloring_books_${userId}`, JSON.stringify(userColoringBooks));
        
        try {
            await fetch(`${SERVER_URL}/api/coloring_books`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    category: category,
                    book_name: bookName,
                    action: 'add',
                    total_pages: config.totalPages,
                    spreads: config.spreads || []
                })
            });
        } catch (error) {
            console.error('Ошибка сервера:', error);
        }
        
        // ✅ Авто-удаление из вишлиста
        Wishlist.remove(bookName);
        
        updateCategoryCounters();
        updateColoringBooksStats();
        updateAllCategoriesProgress();
        renderColoringBooks();
        
        if (tg) tg.showAlert(`✅ "${bookName}" добавлена!`);
    }
}

async function updateCustomBook(category, bookName, action) {
    try {
        const response = await fetch(`${SERVER_URL}/api/coloring_books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                category: category,
                book_name: bookName,
                action: action
            })
        });
        
        const result = await response.json();
        
        if (result.status === 'ok') {
            if (action === 'add') {
                if (!userColoringBooks[category]) userColoringBooks[category] = [];
                // Ищем, есть ли уже объект с таким именем
                const existing = userColoringBooks[category].find(b => 
                    typeof b === 'object' && b.name === bookName
                );
                if (!existing) {
                    userColoringBooks[category].push({ name: bookName, custom: true });
                }
            } else {
                userColoringBooks[category] = userColoringBooks[category].filter(b => 
                    (typeof b === 'string' ? b : b.name) !== bookName
                );
            }
            updateColoringBooksStats();
            renderColoringBooks();
        }
    } catch (error) {
        console.error('Error updating custom book:', error);
    }
}

function showAddCustomBook(category) {
    // Прокручиваем к форме
    const container = document.getElementById(`category-${category}`);
    if (container) {
        const form = container.querySelector('.add-book-form');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const input = document.getElementById(`custom-book-${category}`);
            if (input) input.focus();
        }
    }
}

function updateColoringBooksStats() {
    let total = 0;
    for (const cat in userColoringBooks) {
        total += userColoringBooks[cat]?.length || 0;
    }
    const statsEl = document.getElementById('coloringBooksStats');
    if (statsEl) statsEl.innerText = total;  // ← только число
}


        function toggleColoringBooksBlock() {
    const content = document.getElementById('coloringBooksContent');
    const arrow = document.getElementById('coloringBooksArrow');
    
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        
        // ✅ Обновляем счётчики категорий
        updateCategoryCounters();
        
        renderColoringBooks();
    } else {
        content.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
}
// ==========================================
// МОДАЛКА СТРАНИЦ РАСКРАСКИ
// ==========================================

// Конфигурация страниц для раскрасок
const BOOK_PAGES_CONFIG = {
    //раскраски по номерам
        "Les Grands Classiques tome 1": { totalPages: 100, spreads: [] },
        "Les Grands Classiques tome 2": { totalPages: 100, spreads: [] },
        "Les Grands Classiques tome 3": { totalPages: 100, spreads: [] },
        "Les Grands Classiques tome 4": { totalPages: 100, spreads: [] },
        "Les Grands Classiques tome 5": { totalPages: 100, spreads: [] },
        "Les Grands Classiques tome 6": { totalPages: 100, spreads: [] },
        "Les Grands Classiques tome 7": { totalPages: 100, spreads: [] },
        "Les Grands Classiques tome 8": { totalPages: 100, spreads: [] },
        "Les Grands Classiques tome 9": { totalPages: 100, spreads: [] },
        "Les Grands Classiques tome 10": { totalPages: 100, spreads: [] },
        "Les Grands Classiques tome 11": { totalPages: 100, spreads: [1, 5, 7, 11, 17, 21, 25, 31, 37, 41, 47, 53, 57, 63, 65, 69, 73, 75, 81, 85, 89, 95, 99] },
        "Les Grands Classiques tome 12": { totalPages: 100, spreads: [] },
        "Les Grands Classiques tome 13": { totalPages: 100, spreads: [1, 5, 9, 15, 17, 19, 23, 25, 27, 31, 35, 37, 39, 41, 47, 49, 51, 55, 57, 59, 63, 65, 67, 71, 73, 75, 79, 81, 83, 87, 91, 95, 97, 99] },
        "Mondes Fantastiques": { totalPages: 100, spreads: [1, 23, 37, 53, 69, 85, 97] },
        "Les Grands Classiques Spécial Débutants vol. 1": { totalPages: 100, spreads: [] },
        "Les Grands Classiques Spécial Débutants vol. 2": { totalPages: 100, spreads: [] },
        "Princesses tome 1": { totalPages: 100, spreads: [] },
        "Princesses tome 2": { totalPages: 100, spreads: [1, 5, 9, 15, 21, 25, 31, 35, 37, 39, 43, 47, 49, 53, 57, 63, 67, 69, 71, 75, 79, 83, 87, 91, 95, 99] },
        "Les Schtroumpfs tome 1": { totalPages: 100, spreads: [1, 11, 41, 51, 65, 77, 81, 85, 93, 97, 99] },
        "Les Schtroumpfs tome 2": { totalPages: 100, spreads: [3, 7, 11, 15, 17, 19, 21, 23, 27, 31, 33, 35, 47, 49, 51, 55, 57, 71, 73, 77, 91, 99] },
        "Pixar tome 1": { totalPages: 100, spreads: [] },
        "Pixar tome 2": { totalPages: 100, spreads: [] },
        "Vitraux tome 1": { totalPages: 100, spreads: [] },
        "Vitraux tome 2": { totalPages: 100, spreads: [5, 15, 33, 39, 59, 65, 67, 71, 73, 77, 89] },
        "Saisons": { totalPages: 100, spreads: [] },
        "Hiver": { totalPages: 100, spreads: [] },
        "MickeyDonald&Co": { totalPages: 100, spreads: [] },
        "Mickey&Friends": { totalPages: 100, spreads: [] },
        "Famille": { totalPages: 100, spreads: [] },
        "Portraits de famille": { totalPages: 50, spreads: [1, 3, 7, 9, 18, 23, 25, 35, 37, 39, 41, 45, 47, 49] },
        "Fees, Sorciers et Magiciens": { totalPages: 100, spreads: [] },
        "Creatures Fantastiques": { totalPages: 100, spreads: [] },
        "Petites princesses": { totalPages: 50, spreads: [9, 18, 28, 34, 44, 48] },
        "Chevaux": { totalPages: 50, spreads: [3, 11, 20, 29] },
        "Babies": { totalPages: 100, spreads: [] },
        "Trompe l'oeil babies": { totalPages: 100, spreads: [] },
        "Girl power": { totalPages: 100, spreads: [] },
        "Princes&Heros": { totalPages: 100, spreads: [] },
        "Love stories": { totalPages: 99, spreads: [] },
        "Sous L'Ocean": { totalPages: 100, spreads: [] },
        "Mechants": { totalPages: 100, spreads: [] },
        "Heros&Mechants la battle": { totalPages: 100, spreads: [1, 5, 15, 21, 39, 53, 59, 63, 65, 69, 71, 77, 81, 83] },
        "Bestiaire": { totalPages: 100, spreads: [] },
        "Bestiaire triangles": { totalPages: 98, spreads: [] },
        "Nature": { totalPages: 100, spreads: [] },
        "Marsupilami": { totalPages: 50, spreads: [] },
        "L'age de glacé": { totalPages: 100, spreads: [9, 15, 21, 27, 31, 37, 43, 47, 53, 55, 59, 71, 75, 79, 81, 85, 89, 91, 93, 95, 97] },
        "Pokémon": { totalPages: 50, spreads: [11, 13, 27, 31] },
        "Les Grands Classiques au numero": { totalPages: 100, spreads: [] },
        "Les Grands Classiques Special portraits": { totalPages: 100, spreads: [] },
        "La petite Sirene": { totalPages: 50, spreads: [] },
        "Romantasy": { totalPages: 50, spreads: [] },
        "Scooby-Doo": { totalPages: 50, spreads: [] },
        "Portraits": { totalPages: 100, spreads: [] },
        "Petites Poupees": { totalPages: 40, spreads: [] },
        "Mandalas": { totalPages: 40, spreads: [] },
        "Portraits grand carre": { totalPages: 36, spreads: [] },
        "Bebes animaux": { totalPages: 40, spreads: [] },
        "Grands Classiques": { totalPages: 36, spreads: [] },
        "Trompe L'oeil grand bloc": { totalPages: 37, spreads: [] },
        "Trompe L'oeil grand bloc tome 2": { totalPages: 36, spreads: [] },
        "Petites Betes": { totalPages: 100, spreads: [] },
        "Best of nature": { totalPages: 100, spreads: [] },
        "Best of babies": { totalPages: 100, spreads: [] },
        "Best of bestiaire": { totalPages: 100, spreads: [] },
        "Best of Les Grands Classiques": { totalPages: 100, spreads: [] },
        "Best of love stories": { totalPages: 100, spreads: [] },
        "Best of heroines": { totalPages: 100, spreads: [] },
        "Best of mechants": { totalPages: 100, spreads: [] },
        "Best of Pixar": { totalPages: 100, spreads: [] },
        "Grands classiques colliector 10": { totalPages: 100, spreads: [] },
        "Princesses colliector": { totalPages: 100, spreads: [] },
        "La Belle et la Bete": { totalPages: 50, spreads: [] },
        "Raiponce": { totalPages: 50, spreads: [] },
        "Looney tunes tome 1": { totalPages: 100, spreads: [] },
        "Looney tunes tome 2": { totalPages: 100, spreads: [] },
        "Looney tunes tome 3": { totalPages: 100, spreads: [] },
        "Les grands classiques au numero tome 2": { totalPages: 100, spreads: [] },
        "Stitch au numero": { totalPages: 50, spreads: [] },
        "Lilo et Stitch": { totalPages: 50, spreads: [] },
        "Chats&Felins": { totalPages: 100, spreads: [] },
        "Chiots&Chiens": { totalPages: 100, spreads: [] },
        "Trompe L'oeil tome 1": { totalPages: 100, spreads: [] },
        "Trompe L'oeil tome 2": { totalPages: 100, spreads: [] },
        "Trompe L'oeil tome 3": { totalPages: 100, spreads: [] },
        "Trompe L'oeil heros vs mechants": { totalPages: 100, spreads: [] },
        "Mangas": { totalPages: 100, spreads: [] },
    "Mangas tome 2": { totalPages: 100, spreads: [] },
        "Totaly spies": { totalPages: 50, spreads: [] },
        "Vaiana": { totalPages: 50, spreads: [] },
     "Vaiana new edition": { totalPages: 60, spreads: [] },
        "Tres grands classiques": { totalPages: 40, spreads: [] },
     "Tres grands classiques tome 2": { totalPages: 40, spreads: [] },
        "Babies cercles": { totalPages: 100, spreads: [] },
        "Barbie": { totalPages: 100, spreads: [] },
        "Bisounours": { totalPages: 50, spreads: [] },
     "Bisounours tome 2": { totalPages: 50, spreads: [] },
        "Boule&Bill": { totalPages: 50, spreads: [] },
        "100% Simba": { totalPages: 50, spreads: [] },
        "100% Panpan": { totalPages: 50, spreads: [] },
        "100% Winnie": { totalPages: 50, spreads: [] },
        "100% Stitch": { totalPages: 50, spreads: [] },
        "200% Stitch": { totalPages: 50, spreads: [] },
        "300% Stitch": { totalPages: 50, spreads: [] },
        "100% Angel": { totalPages: 50, spreads: [] },
        "100% Grogu": { totalPages: 50, spreads: [] },
        "Messages mysteres Disney": { totalPages: 100, spreads: [] },
        "Messages mysteres": { totalPages: 50, spreads: [] },
        "Harry Potter au numero": { totalPages: 50, spreads: [] },
        "Sorciers": { totalPages: 50, spreads: [] },
        "Fantasy": { totalPages: 50, spreads: [] },
        "Mythes du monde": { totalPages: 100, spreads: [] },
        "Coloriages au symbole tome 1": { totalPages: 50, spreads: [] },
        "Coloriages au symbole tom2 2": { totalPages: 50, spreads: [] },
        "Fleurs tome 1": { totalPages: 100, spreads: [] },
        "Fleurs tome 2": { totalPages: 100, spreads: [] },
        "Contes de fees": { totalPages: 100, spreads: [] },
        "Pensees positives": { totalPages: 50, spreads: [] },
        "Escapades merveilleuses autour du monde": { totalPages: 50, spreads: [9, 15, 25, 35, 45] },
        "Escapades merveilleuses douce France": { totalPages: 50, spreads: [] },
        "Tour du monde": { totalPages: 50, spreads: [] },
        "Tresors du japon": { totalPages: 100, spreads: [] },
        "Voyages autour du monde Le Routard": { totalPages: 50, spreads: [] },
        "Tableaux de maitres": { totalPages: 50, spreads: [] },
        "Les grands classiques de la litterature": { totalPages: 100, spreads: [] },
        "Affiches de pub": { totalPages: 50, spreads: [] },
        "Affiches vintages": { totalPages: 50, spreads: [] },
        "50 coloriages mysteres": { totalPages: 50, spreads: [] },
        "Costumes du monde": { totalPages: 50, spreads: [] },
        "Ombres&Lumiers": { totalPages: 100, spreads: [] },
        "Animaux fantastiques": { totalPages: 100, spreads: [] },
        "Oceans": { totalPages: 50, spreads: [] },
        "Safari": { totalPages: 50, spreads: [] },
        "Nature mysteres": { totalPages: 50, spreads: [] },
        "Nature sauvage": { totalPages: 50, spreads: [] },
        "Japon": { totalPages: 50, spreads: [] },
        "Tropiques": { totalPages: 50, spreads: [] },
        "Jardins extraordinaires": { totalPages: 50, spreads: [] },
        "Triangles magiques": { totalPages: 50, spreads: [] },
        "Trompe L'oeil mysteres": { totalPages: 50, spreads: [] },
        "Chats": { totalPages: 50, spreads: [] },
        "Chats and Felins": { totalPages: 100, spreads: [] },
        "Arbres du monde": { totalPages: 100, spreads: [] },
        "Serenite": { totalPages: 50, spreads: [] },
        "Monde sauvage": { totalPages: 100, spreads: [] },
        "100 nouveaux coloriages mysteres": { totalPages: 100, spreads: [] },
        "Animaux adorables": { totalPages: 50, spreads: [] },
        "100 coloriages mysteres inedits": { totalPages: 100, spreads: [] },
        "100 nouveaux cercles magiques": { totalPages: 100, spreads: [] },
        "Animaux du monde special debutants": { totalPages: 100, spreads: [] },
        "Bebes animaux mysteres": { totalPages: 50, spreads: [] },
        "Hiver enchanteur": { totalPages: 50, spreads: [] },
        "Animaux extraordinaires": { totalPages: 50, spreads: [] },
    //спиртовые раскраски
        "Cozy days Coco Wyo": { totalPages: 45, spreads: [] },
        "Comfy corner Coco Wyo": { totalPages: 50, spreads: [] },
        "Little corner Coco Wyo": { totalPages: 50, spreads: [] },
        "Girl moments Coco Wyo": { totalPages: 45, spreads: [] },
        "Cozy corner Coco Wyo": { totalPages: 45, spreads: [] },
        "Girl moments vol. 2 Coco Wyo": { totalPages: 50, spreads: [] },
        "Cozy friends Coco Wyo": { totalPages: 45, spreads: [] },
        "Cozy cuties Coco Wyo": { totalPages: 45, spreads: [] },
        "Little cuddles Coco Wyo": { totalPages: 40, spreads: [] },
        "Cozy vibes Coco Wyo": { totalPages: 45, spreads: [] },
        "Stress relief Coco Wyo": { totalPages: 50, spreads: [] },
        "Into gardens Coc Wyo": { totalPages: 50, spreads: [] },
        "Comfy days Coco Wyo": { totalPages: 50, spreads: [] },
        "Cozy christmas Coco Wyo": { totalPages: 45, spreads: [] },
        "Little spooky Coco Wyo": { totalPages: 50, spreads: [] },
        "Hygge place Coco Wyo": { totalPages: 50, spreads: [] },
        "Spooky cutie Coco Wyo": { totalPages: 50, spreads: [] },
        "Lala friends Coco Wyo": { totalPages: 50, spreads: [] },
        "Spooky cutie vol. 2 Coco Wyo": { totalPages: 50, spreads: [] },
        "Cozy capybara Coco Wyo": { totalPages: 50, spreads: [] },
        "Ocean scene Coco Wyo": { totalPages: 50, spreads: [] },
        "The little cat Coco Wyo": { totalPages: 50, spreads: [] },
        "Glow cosmetics Coco Wyo": { totalPages: 50, spreads: [] },
        "Selfcare Coco Wyo": { totalPages: 50, spreads: [] },
        "Pocket world Coco Wyo": { totalPages: 50, spreads: [] },
        "Cozy spaces Coco Wyo": { totalPages: 50, spreads: [] },
        "Cozy season Coco Wyo": { totalPages: 50, spreads: [] },
        "Simple art Coco Wyo": { totalPages: 50, spreads: [] },
        "Silly crimes Coco Wyo": { totalPages: 50, spreads: [] },
        "Little friends Coco Wyo": { totalPages: 50, spreads: [] },
        "Food, drinks & sweets Coco Wyo": { totalPages: 50, spreads: [] },
        "Cozy&Cute Coco Wyo": { totalPages: 50, spreads: [] },
        "Cute&groovy Coco Wyo": { totalPages: 50, spreads: [] },
        "Fashion vibes Coco Wyo": { totalPages: 50, spreads: [] },
        "Cozy romantasy Jade Summer": { totalPages: 40, spreads: [] },
        "Cozy Japan Jade Summer": { totalPages: 40, spreads: [] },
        "Cozy France Jade Summer": { totalPages: 50, spreads: [] },
        "Cozy Europe Jade Summer": { totalPages: 40, spreads: [] },
        "Cozy moms Jade Summer": { totalPages: 50, spreads: [] },
        "Cozy fashion Jade Summer": { totalPages: 50, spreads: [] },
        "Cozy jobs Jade Summer": { totalPages: 50, spreads: [] },
        "Cozy hawaii Jade Summer": { totalPages: 40, spreads: [] },
        "Cozy places Jade Summer": { totalPages: 50, spreads: [] },
        "Cozy kingdom Jade Summer": { totalPages: 50, spreads: [] },
        "Cat crimes Jade Summer": { totalPages: 50, spreads: [] },
        "Retro rooms Jade Summer": { totalPages: 50, spreads: [] },
        "Cozy eras Jade Summer": { totalPages: 50, spreads: [] },
        "Cozy eras 2 Jade Summer": { totalPages: 50, spreads: [] },
        "Spooky life Jade Summer": { totalPages: 50, spreads: [] },
        "Cozy k-pop Jade Summer": { totalPages: 50, spreads: [] },
        "Comfy&cozy Jade Summer": { totalPages: 50, spreads: [] },
        "Spooky moments Jade Summer": { totalPages: 50, spreads: [] },
        "Cozy life Jade Summer": { totalPages: 50, spreads: [] },
        "Spooky Christmas Jade Summer": { totalPages: 50, spreads: [] },
        "Merry christmas Jade Summer": { totalPages: 50, spreads: [] },
        "Cozy animals Jade Summer": { totalPages: 50, spreads: [] },
        "Witchy vibes Jade Summer": { totalPages: 50, spreads: [] },
        "100 bold&easy Jade Summer": { totalPages: 50, spreads: [] },
        "Fall vibes Jade Summer": { totalPages: 50, spreads: [] },
        "Cute&sweet Jade Summer": { totalPages: 50, spreads: [] },
        "Christmas Jade Summer": { totalPages: 50, spreads: [] },
        "Little friends Southern Lotus": { totalPages: 50, spreads: [] },
        "Fuzzy in love Southern Lotus": { totalPages: 50, spreads: [] },
        "Little fuzzy Southern Lotus": { totalPages: 50, spreads: [] },
        "Comfy vibes Southern Lotus": { totalPages: 50, spreads: [] },
        "Fuzzy fantasy Southern Lotus": { totalPages: 50, spreads: [] },
        "Fantasy land Southern Lotus": { totalPages: 50, spreads: [] },
        "Dreamy friends Southern Lotus": { totalPages: 50, spreads: [] },
        "Girl things Southern Lotus": { totalPages: 50, spreads: [] },
        "Breakfast club Southern Lotus": { totalPages: 50, spreads: [] },
        "Cozy times Southern Lotus": { totalPages: 50, spreads: [] },
        "Little cozy Southern Lotus": { totalPages: 50, spreads: [] },
        "Calm days Southern Lotus": { totalPages: 50, spreads: [] },
        "Fuzzy cuties Southern Lotus": { totalPages: 50, spreads: [] },
        "Little comfy Southern Lotus": { totalPages: 50, spreads: [] },
        "Girl spaces Southern Lotus": { totalPages: 50, spreads: [] },
        "Fuzzy hygge Vivi Tinta": { totalPages: 40, spreads: [] },
        "Animals Vivi Tinta": { totalPages: 50, spreads: [] },
        "Girl's day Vivi Tinta": { totalPages: 50, spreads: [] },
        "Fuzzy life Vivi Tinta": { totalPages: 50, spreads: [] },
        "Fuzzy tales Vivi Tinta": { totalPages: 50, spreads: [] },
        "Fuzzy friends Vivi Tinta": { totalPages: 50, spreads: [] },
        "Cat mom Vivi Tinta": { totalPages: 50, spreads: [] },
        "Cozy home Vivi Tinta": { totalPages: 50, spreads: [] },
        "Calmness Vivi Tinta": { totalPages: 50, spreads: [] },
        "Comfy girl Vivi Tinta": { totalPages: 50, spreads: [] },
        "Soft life Vivi Tinta": { totalPages: 50, spreads: [] },
        "Sweetheart Vivi Tinta": { totalPages: 40, spreads: [] },
        "Buzzy buddy Vivi Tinta": { totalPages: 50, spreads: [] },
        "Fuzzy hygge christmas Vivi Tinta": { totalPages: 50, spreads: [] },
        "Christmas Vivi Tinta": { totalPages: 50, spreads: [] },
        "Spooky ville Vivi Tinta": { totalPages: 50, spreads: [] },
        "Merry lights Vivi Tinta": { totalPages: 50, spreads: [] },
        "Relaxation Vivi Tinta": { totalPages: 50, spreads: [] },
        "Food&sweet Vivi Tinta": { totalPages: 50, spreads: [] },
        "Bulle de douceur Hachette": { totalPages: 50, spreads: [] },
        "Instants magiques Hachette": { totalPages: 50, spreads: [] },
        "Stitch&friends Hachette": { totalPages: 50, spreads: [] },
        "Amis pour la vie Hachette": { totalPages: 50, spreads: [] },
        "Tour du monde Hachette": { totalPages: 50, spreads: [] },
        "Instants secrets Hachette": { totalPages: 50, spreads: [] },
        "Capybaras calins Hachette": { totalPages: 50, spreads: [] },
        "Une vie de chat Hachette": { totalPages: 50, spreads: [] },
        "Infinie galaxie Hachette": { totalPages: 50, spreads: [] },
        "Contes&legendes Hachette": { totalPages: 50, spreads: [] },
        "Japon kawai Hachette": { totalPages: 50, spreads: [] },
        "Pause cocooning Hachette": { totalPages: 50, spreads: [] },
        "Enquete au poil Hachette": { totalPages: 50, spreads: [] },
        "Doux printemps Hachette": { totalPages: 50, spreads: [] },
        "Mon coin cozy Hachette": { totalPages: 50, spreads: [] },
        "Instants malicieux Hachette": { totalPages: 50, spreads: [] },
        "En famille Hachette": { totalPages: 50, spreads: [] },
        "Moments tout doux Hachette": { totalPages: 50, spreads: [] },
        "Gouters calins Hachette": { totalPages: 50, spreads: [] },
        "Contes de fees Hachette": { totalPages: 50, spreads: [] },
        "Noel enchante Hachette": { totalPages: 50, spreads: [] },
        "Bulle d'amour Hachette": { totalPages: 50, spreads: [] },
        "Tout petit monde Hachette": { totalPages: 50, spreads: [] },
        "Automne spooky Hachette": { totalPages: 50, spreads: [] },
        "Chatons trop mignons Hachette": { totalPages: 50, spreads: [] },
        "Quete enchantee Hachette": { totalPages: 50, spreads: [] },
        "Hiver douillet Hachette": { totalPages: 50, spreads: [] },
        "Reves tout doux Hachette": { totalPages: 50, spreads: [] },
        "Au bord de l'eau Hachette": { totalPages: 50, spreads: [] },
        "Petits bonheurs Hachette": { totalPages: 50, spreads: [] },
        "Chats spooky Hachette": { totalPages: 50, spreads: [] },
        "Reves kawai Hachette": { totalPages: 50, spreads: [] },
        "Boules de poils Hachette": { totalPages: 50, spreads: [] },
        "Douceurs d'ete Hachette": { totalPages: 50, spreads: [] },
        "Moments calins Hachette": { totalPages: 50, spreads: [] },
        "Soupcon d'amour Hachette": { totalPages: 50, spreads: [] },
        "Mes meilleures amies Hachette": { totalPages: 50, spreads: [] },
        "Jardins secrets Hachette": { totalPages: 50, spreads: [] },
        "Pause douceur Hachette Bisounours": { totalPages: 50, spreads: [] },
        "Pause douceur Hello Kitty Hachette": { totalPages: 50, spreads: [] },
     "Mini-mondes Hachette": { totalPages: 50, spreads: [] },
     "Pause detente Hachette": { totalPages: 50, spreads: [] },
    "Winnie l'Ourson Hachette": { totalPages: 50, spreads: [] },
    "Sunny cuties Bogiki": { totalPages: 46, spreads: [] },
    //раскраски для карандашей
        "Adorables petites poupees": { totalPages: 50, spreads: [] },
        "Petites poupees for pencils": { totalPages: 50, spreads: [] },
        "4 Saisons": { totalPages: 100, spreads: [] },
        "Thomas Kinkade Celebrations": { totalPages: 50, spreads: [] },
        "Thomas Kinkade Disney princesses": { totalPages: 50, spreads: [] },
        "Thomas Kinkade Coloring book": { totalPages: 50, spreads: [] },
};
// По умолчанию для новых/кастомных раскрасок
const DEFAULT_PAGES_CONFIG = { totalPages: 100, spreads: [] };

// Загруженные работы пользователя
let userArtworks = {};

// Текущая открытая раскраска
let currentBook = null;
let currentCategory = null;
let currentPage = null;

// Загрузка работ пользователя
async function loadUserArtworks() {
    try {
        const response = await fetch(`${SERVER_URL}/api/artworks?user_id=${userId}`);
        const data = await response.json();
        if (data && typeof data === 'object') {
            userArtworks = data;
        } else {
            userArtworks = {};
        }
    } catch (error) {
        console.error('Ошибка загрузки работ с сервера:', error);
        userArtworks = {};
    }
}

// Проверка, загружена ли страница
function isPageUploaded(bookKey, page) {
    return userArtworks[bookKey]?.hasOwnProperty(String(page)) || false;
}
// Открыть модалку со страницами
function openBookPagesModal(category, bookName) {
    currentBook = bookName;
    currentCategory = category;
    
    const bookKey = `${category}_${bookName}`;
    
    // ✅ Ищем сохранённую книгу
    const userBooks = userColoringBooks[category] || [];
    const savedBook = userBooks.find(b => {
        const name = typeof b === 'string' ? b : b.name;
        return name === bookName;
    });
    
    let config;
    // ✅ Для не-кастомных книг всегда берём свежий конфиг
    if (savedBook && typeof savedBook === 'object' && !savedBook.custom) {
        config = BOOK_PAGES_CONFIG[bookName] || {
            totalPages: savedBook.totalPages || DEFAULT_PAGES_CONFIG.totalPages,
            spreads: savedBook.spreads || []
        };
    } else if (savedBook && typeof savedBook === 'object') {
        config = {
            totalPages: savedBook.totalPages || DEFAULT_PAGES_CONFIG.totalPages,
            spreads: savedBook.spreads || []
        };
    } else if (BOOK_PAGES_CONFIG[bookName]) {
        config = BOOK_PAGES_CONFIG[bookName];
    } else {
        config = DEFAULT_PAGES_CONFIG;
    }
    
    const spreadsCount = config.spreads?.length || 0;
    const totalCells = config.totalPages - spreadsCount;
    
    document.getElementById('bookPagesTitle').innerText = bookName;
    
    const categoryNames = {
        paint_by_number: 'Раскраска по номерам',
        alcohol: 'Спиртовая раскраска',
        pencil: 'Раскраска для карандашей',
        custom: 'Моя раскраска'
    };
    
    let infoText = `${categoryNames[category] || ''} • ${config.totalPages} стр.`;
    if (spreadsCount > 0) {
        infoText += ` • ${spreadsCount} разв. • ${totalCells} ячеек`;
    }
    
    document.getElementById('bookPagesCategory').innerText = infoText;
    
    renderBookPagesGrid(bookKey, config);
    
    document.getElementById('bookPagesModal').style.display = 'flex';
}
// Рендеринг сетки страниц
function renderBookPagesGrid(bookKey, config) {
    const grid = document.getElementById('bookPagesGrid');
    const { totalPages, spreads } = config;
    
    const isOwnProfile = !window.isViewOnly;
    const escapeQuotes = (str) => String(str).replace(/'/g, "\\'");
    
    let html = '';
    let page = 1;
    
    while (page <= totalPages) {
        const isSpread = spreads.includes(page);
        const pageLabel = isSpread ? `${page}-${page + 1}` : String(page);
        const completed = isPageCompleted(bookKey, pageLabel);
        const hasArtwork = getPageArtwork(bookKey, pageLabel);
        
        if (isOwnProfile) {
            html += `
                <div class="book-page-btn ${completed ? 'completed' : ''} ${hasArtwork ? 'uploaded' : ''}" 
                     style="position:relative;overflow:hidden;">
                    ${hasArtwork ? `<img src="${hasArtwork}" alt="стр. ${pageLabel}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;border-radius:10px;" onclick="event.stopPropagation(); viewArtwork('${escapeQuotes(bookKey)}', '${pageLabel}')">` : ''}
                    <div style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;${hasArtwork ? 'pointer-events:none;' : ''}" onclick="${hasArtwork ? '' : `togglePageCompletion('${escapeQuotes(bookKey)}', '${pageLabel}', ${totalPages})`}">
                        ${hasArtwork ? '' : pageLabel}
                    </div>
                    <button class="upload-page-btn" 
                            onclick="event.stopPropagation(); uploadPageArtwork('${escapeQuotes(bookKey)}', '${pageLabel}')"
                            title="Загрузить фото">
                        <i class="fas fa-camera"></i>
                    </button>
                </div>
            `;
        } else {
            html += `
                <div class="book-page-btn ${completed ? 'completed' : ''} ${hasArtwork ? 'uploaded' : ''}" 
                     style="position:relative;overflow:hidden;" 
                     onclick="${hasArtwork ? `viewArtwork('${escapeQuotes(bookKey)}', '${pageLabel}')` : ''}">
                    ${hasArtwork ? `<img src="${hasArtwork}" alt="стр. ${pageLabel}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;border-radius:10px;">` : pageLabel}
                </div>
            `;
        }
        
        page += isSpread ? 2 : 1;
    }
    
    grid.innerHTML = html;
}
        function compressImage(file, maxWidth, quality) {
    maxWidth = maxWidth || 800;
    quality = quality || 0.7;
    
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var img = new Image();
            img.onload = function() {
                var canvas = document.createElement('canvas');
                var scale = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scale;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(function(blob) {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Не удалось сжать фото'));
                    }
                }, 'image/jpeg', quality);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
 function uploadPageArtwork(bookKey, page) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        openPhotoEditor(file, function(editedBlob) {
            if (tg && tg.MainButton) tg.MainButton.setText('Загрузка...').show();
            
            var formData = new FormData();
            formData.append('user_id', userId.toString());
            formData.append('book_key', bookKey);
            formData.append('page', String(page));
            formData.append('photo', editedBlob, 'artwork.jpg');
            
            fetch(SERVER_URL + '/api/artworks/upload', {
                method: 'POST',
                body: formData
            })
            .then(r => r.json())
            .then(function(result) {
                if (result.status === 'ok') {
                    if (!userArtworks[bookKey]) userArtworks[bookKey] = {};
                    userArtworks[bookKey][String(page)] = result.url;
                    
                    if (!userCompletedPages[bookKey]) userCompletedPages[bookKey] = {};
                    userCompletedPages[bookKey][String(page)] = true;
                    
                    if (!window.completedPagesDates) window.completedPagesDates = {};
                    window.completedPagesDates[bookKey + '|' + page] = Date.now();
                    localStorage.setItem('completed_pages_dates_' + userId, JSON.stringify(window.completedPagesDates));
                    
                    saveCompletedPages();
                    updateAllCategoriesProgress();
                    
                    renderBookPagesGrid(bookKey, BOOK_PAGES_CONFIG[currentBook] || DEFAULT_PAGES_CONFIG);
                    if (tg) { tg.MainButton.hide(); tg.showAlert('Фото загружено!'); }
                }
            })
            .catch(function(error) {
                console.error('Ошибка:', error);
                if (tg) { tg.MainButton.hide(); tg.showAlert('Ошибка загрузки'); }
            });
        });
    };
    
    input.click();
}
// ==========================================
// РЕДАКТОР ФОТО (ОБРЕЗКА → ПОВОРОТ)
// ==========================================

function openPhotoEditor(file, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
        var src = e.target.result;
        var rotation = 0;
        var crop = { x: 0, y: 0, w: 0, h: 0, active: false, saved: false };
        var dragging = false, dragCorner = '', dragStartX, dragStartY;
        
        var modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:100004;display:flex;align-items:center;justify-content:center;flex-direction:column;';
        
        modal.innerHTML = `
            <div style="position:relative;max-width:95%;max-height:55vh;" id="editorArea">
                <img id="editorPhoto" src="${src}" style="max-width:100%;max-height:55vh;display:block;user-select:none;">
                <div id="cropOverlay" style="display:none;position:absolute;top:0;left:0;width:100%;height:100%;">
                    <div id="cropClear" style="position:absolute;border:3px solid #ff4444;cursor:move;display:none;"></div>
                    <div class="crop-handle" data-corner="nw" style="position:absolute;width:22px;height:22px;background:#ff4444;border-radius:50%;cursor:nw-resize;z-index:11;display:none;"></div>
                    <div class="crop-handle" data-corner="ne" style="position:absolute;width:22px;height:22px;background:#ff4444;border-radius:50%;cursor:ne-resize;z-index:11;display:none;"></div>
                    <div class="crop-handle" data-corner="sw" style="position:absolute;width:22px;height:22px;background:#ff4444;border-radius:50%;cursor:sw-resize;z-index:11;display:none;"></div>
                    <div class="crop-handle" data-corner="se" style="position:absolute;width:22px;height:22px;background:#ff4444;border-radius:50%;cursor:se-resize;z-index:11;display:none;"></div>
                </div>
            </div>
            <p style="color:#aaa;font-size:11px;margin:5px 0;">1. Настройте рамку → 2. Нажмите кнопку обрезки → 3. Поверните → 4. Готово</p>
            <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
                <button class="editor-btn2" id="edCrop"><i class="fas fa-crop-alt"></i></button>
                <button class="editor-btn2" id="edRotateLeft"><i class="fas fa-undo"></i></button>
                <button class="editor-btn2" id="edRotateRight"><i class="fas fa-redo"></i></button>
                <button class="editor-btn2" id="edReset"><i class="fas fa-times"></i></button>
                <button class="editor-btn2" id="edDone" style="background:#34c759;color:white;width:auto;padding:0 24px;border-radius:25px;"><i class="fas fa-check"></i> Готово</button>
            </div>
            <button style="color:white;background:none;border:none;margin-top:10px;font-size:16px;cursor:pointer;" id="edCancel">Отмена</button>
        `;
        
        document.body.appendChild(modal);
        
        var img = document.getElementById('editorPhoto');
        var overlay = document.getElementById('cropOverlay');
        var cropClear = document.getElementById('cropClear');
        var handles = overlay.querySelectorAll('.crop-handle');
        
        function updateCropUI() {
            cropClear.style.display = 'block';
            cropClear.style.left = crop.x + 'px';
            cropClear.style.top = crop.y + 'px';
            cropClear.style.width = crop.w + 'px';
            cropClear.style.height = crop.h + 'px';
            handles[0].style.display = 'block'; handles[0].style.left = (crop.x-11)+'px'; handles[0].style.top = (crop.y-11)+'px';
            handles[1].style.display = 'block'; handles[1].style.left = (crop.x+crop.w-11)+'px'; handles[1].style.top = (crop.y-11)+'px';
            handles[2].style.display = 'block'; handles[2].style.left = (crop.x-11)+'px'; handles[2].style.top = (crop.y+crop.h-11)+'px';
            handles[3].style.display = 'block'; handles[3].style.left = (crop.x+crop.w-11)+'px'; handles[3].style.top = (crop.y+crop.h-11)+'px';
        }
        
        function initCrop() {
            crop.x = img.clientWidth * 0.1;
            crop.y = img.clientHeight * 0.1;
            crop.w = img.clientWidth * 0.8;
            crop.h = img.clientHeight * 0.8;
            crop.saved = false;
            updateCropUI();
        }
        
        // Обрезка — сохраняет рамку
        document.getElementById('edCrop').onclick = function() {
            if (crop.active) {
                // Сохраняем обрезку, выходим из режима
                crop.active = false;
                crop.saved = true;
                overlay.style.display = 'none';
                this.style.background = '';
                this.style.color = '';
            } else {
                // Входим в режим обрезки
                if (!crop.saved) initCrop();
                crop.active = true;
                overlay.style.display = 'block';
                this.style.background = 'var(--accent)';
                this.style.color = 'white';
            }
        };
        
        // Поворот — работает всегда
        document.getElementById('edRotateLeft').onclick = function() {
            rotation = (rotation - 90) % 360;
            if (!crop.active) img.style.transform = 'rotate(' + rotation + 'deg)';
        };
        document.getElementById('edRotateRight').onclick = function() {
            rotation = (rotation + 90) % 360;
            if (!crop.active) img.style.transform = 'rotate(' + rotation + 'deg)';
        };
        
        // Сброс
        document.getElementById('edReset').onclick = function() {
            rotation = 0; crop.active = false; crop.saved = false;
            crop.x = crop.y = crop.w = crop.h = 0;
            overlay.style.display = 'none';
            img.style.transform = 'rotate(0deg)';
            document.getElementById('edCrop').style.background = '';
        };
        
        // Перетаскивание
        overlay.addEventListener('mousedown', function(ev) {
            if (!crop.active) return;
            ev.preventDefault();
            var el = ev.target;
            dragCorner = el.getAttribute('data-corner') || (el === cropClear ? 'move' : '');
            dragStartX = ev.clientX; dragStartY = ev.clientY;
            dragging = true;
        });
        
        overlay.addEventListener('touchstart', function(ev) {
            if (!crop.active) return;
            ev.preventDefault();
            var el = ev.target;
            dragCorner = el.getAttribute('data-corner') || (el === cropClear ? 'move' : '');
            dragStartX = ev.touches[0].clientX; dragStartY = ev.touches[0].clientY;
            dragging = true;
        });
        
        function doDrag(dx, dy) {
            var w = img.clientWidth, h = img.clientHeight;
            switch (dragCorner) {
                case 'move': crop.x = Math.max(0, Math.min(crop.x+dx, w-crop.w)); crop.y = Math.max(0, Math.min(crop.y+dy, h-crop.h)); break;
                case 'nw': crop.x = Math.max(0, crop.x+dx); crop.y = Math.max(0, crop.y+dy); crop.w -= dx; crop.h -= dy; break;
                case 'ne': crop.y = Math.max(0, crop.y+dy); crop.w = Math.min(w-crop.x, crop.w+dx); crop.h -= dy; break;
                case 'sw': crop.x = Math.max(0, crop.x+dx); crop.w -= dx; crop.h = Math.min(h-crop.y, crop.h+dy); break;
                case 'se': crop.w = Math.min(w-crop.x, crop.w+dx); crop.h = Math.min(h-crop.y, crop.h+dy); break;
            }
            if (crop.w < 30) crop.w = 30;
            if (crop.h < 30) crop.h = 30;
            updateCropUI();
        }
        
        document.addEventListener('mousemove', function(ev) { if (!dragging) return; ev.preventDefault(); doDrag(ev.clientX-dragStartX, ev.clientY-dragStartY); dragStartX=ev.clientX; dragStartY=ev.clientY; });
        document.addEventListener('touchmove', function(ev) { if (!dragging) return; ev.preventDefault(); doDrag(ev.touches[0].clientX-dragStartX, ev.touches[0].clientY-dragStartY); dragStartX=ev.touches[0].clientX; dragStartY=ev.touches[0].clientY; });
        document.addEventListener('mouseup', function() { dragging = false; });
        document.addEventListener('touchend', function() { dragging = false; });
        
        // Готово
        document.getElementById('edDone').onclick = function() {
            var tempImg = new Image();
            tempImg.onload = function() {
                var nW = tempImg.width, nH = tempImg.height;
                var result;
                
                // Обрезка (если рамка была настроена)
                if (crop.saved && crop.w > 30 && crop.h > 30) {
                    var sX = nW / img.clientWidth, sY = nH / img.clientHeight;
                    var sx = crop.x * sX, sy = crop.y * sY, sw = crop.w * sX, sh = crop.h * sY;
                    sx = Math.max(0,Math.min(sx,nW-1)); sy = Math.max(0,Math.min(sy,nH-1));
                    sw = Math.min(sw,nW-sx); sh = Math.min(sh,nH-sy);
                    var cc = document.createElement('canvas'); cc.width=sw; cc.height=sh;
                    cc.getContext('2d').drawImage(tempImg, sx, sy, sw, sh, 0, 0, sw, sh);
                    result = cc;
                } else {
                    var cc = document.createElement('canvas'); cc.width=nW; cc.height=nH;
                    cc.getContext('2d').drawImage(tempImg, 0, 0);
                    result = cc;
                }
                
                // Поворот
                if (rotation % 360 !== 0) {
                    var fc = document.createElement('canvas'), fctx = fc.getContext('2d');
                    fc.width = (rotation%180===0) ? result.width : result.height;
                    fc.height = (rotation%180===0) ? result.height : result.width;
                    fctx.fillStyle='#ffffff'; fctx.fillRect(0,0,fc.width,fc.height);
                    fctx.save(); fctx.translate(fc.width/2,fc.height/2);
                    fctx.rotate((rotation*Math.PI)/180);
                    fctx.drawImage(result, -result.width/2, -result.height/2);
                    fctx.restore();
                    result = fc;
                }
                
                result.toBlob(function(b) { modal.remove(); callback(b); }, 'image/jpeg', 0.85);
            };
            tempImg.src = src;
        };
        
        document.getElementById('edCancel').onclick = function() { modal.remove(); };
        modal.onclick = function(ev) { if (ev.target === modal) modal.remove(); };
    };
    reader.readAsDataURL(file);
}
function renderPurchasedItems() {
    fetch(`${SERVER_URL}/api/stats?user_id=${userId}`)
        .then(r => r.json())
        .then(stats => {
            const ownedBgs = stats.owned_backgrounds || [];
            const ownedStatusBgs = stats.owned_status_backgrounds || [];
            const ownedBorders = stats.owned_borders || [];
            
            const currentBgId = stats.sponsor_background_id || '';
            const currentStatusBgId = stats.status_background_id || '';
            const currentBorderId = stats.avatar_border_id || '';
            
            // Подложки
            const bgContainer = document.getElementById('purchasedBackgrounds');
            if (ownedBgs.length === 0) {
                bgContainer.innerHTML = '<div class="no-results" style="grid-column: span 2;">Нет купленных подложек</div>';
            } else {
                let bgHtml = '';
                ownedBgs.forEach(bgId => {
                    const bg = BACKGROUNDS_SHOP.find(b => b.id === bgId);
                    if (!bg) return;
                    const isActive = (bgId === currentBgId);
                    bgHtml += `
                        <div class="reward-card" onclick="activateBackground('${bgId}'); renderPurchasedItems();" style="border-color: ${isActive ? 'var(--accent)' : 'var(--border-color)'};">
                            <div style="width: 100%; height: 60px; border-radius: 12px; margin-bottom: 10px; ${bg.preview || bg.css}"></div>
                            <h4>${bg.name}</h4>
                            ${isActive ? '<div style="color: var(--accent); font-size: 12px; font-weight: 600;">✅ Активна</div>' : '<button class="reward-buy-btn" style="margin-top: 5px;">Выбрать</button>'}
                        </div>
                    `;
                });
                bgContainer.innerHTML = bgHtml;
            }
            
            // Фоны статуса
            const statusContainer = document.getElementById('purchasedStatusBgs');
            if (ownedStatusBgs.length === 0) {
                statusContainer.innerHTML = '<div class="no-results" style="grid-column: span 2;">Нет купленных фонов</div>';
            } else {
                let statusHtml = '';
                ownedStatusBgs.forEach(bgId => {
                    const bg = STATUS_BG_SHOP.find(b => b.id === bgId);
                    if (!bg) return;
                    const isActive = (bgId === currentStatusBgId);
                    statusHtml += `
                        <div class="reward-card" onclick="activateStatusBg('${bgId}'); renderPurchasedItems();" style="border-color: ${isActive ? 'var(--accent)' : 'var(--border-color)'};">
                            <div style="width: 100%; height: 60px; border-radius: 12px; margin-bottom: 10px; ${bg.css}"></div>
                            <h4>${bg.name}</h4>
                            ${isActive ? '<div style="color: var(--accent); font-size: 12px; font-weight: 600;">✅ Активен</div>' : '<button class="reward-buy-btn" style="margin-top: 5px;">Выбрать</button>'}
                        </div>
                    `;
                });
                statusContainer.innerHTML = statusHtml;
            }
            
            // Обводки
            const borderContainer = document.getElementById('purchasedBorders');
            if (ownedBorders.length === 0) {
                borderContainer.innerHTML = '<div class="no-results" style="grid-column: span 2;">Нет купленных обводок</div>';
            } else {
                let borderHtml = '';
                ownedBorders.forEach(borderId => {
                    const border = AVATAR_BORDER_SHOP.find(b => b.id === borderId);
                    if (!border) return;
                    const isActive = (borderId === currentBorderId);
                    borderHtml += `
                        <div class="reward-card" onclick="activateAvatarBorder('${borderId}'); renderPurchasedItems();" style="border-color: ${isActive ? 'var(--accent)' : 'var(--border-color)'};">
                            <div style="width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 10px; ${border.css} background: var(--bg); display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-user" style="font-size: 24px; color: var(--text-gray);"></i>
                            </div>
                            <h4>${border.name}</h4>
                            ${isActive ? '<div style="color: var(--accent); font-size: 12px; font-weight: 600;">✅ Активна</div>' : '<button class="reward-buy-btn" style="margin-top: 5px;">Выбрать</button>'}
                        </div>
                    `;
                });
                borderContainer.innerHTML = borderHtml;
            }
        });
}
// ==========================================
// ИСПЫТАНИЕ СООБЩЕСТВА
// ==========================================

let communityEventData = null;

async function loadCommunityEvent() {
    try {
        const response = await fetch(`${SERVER_URL}/api/community_event?user_id=${userId}`);
        communityEventData = await response.json();
        renderCommunityEvent();
    } catch (error) {
        console.error('Error loading community event:', error);
    }
}

function toggleCommunityEvent() {
    const content = document.getElementById('communityEventContent');
    const arrow = document.getElementById('communityEventArrow');
    if (!content) return;
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        loadCommunityEvent();
    } else {
        content.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
}

function renderCommunityEvent() {
    const container = document.getElementById('communityEventContainer');
    if (!container || !communityEventData) return;
    
    const data = communityEventData;
    const totalPoints = data.total_points || 0;
    const userPoints = data.user_points || 0;
    const userLeague = data.user_league;
    const isDonater = data.is_donater || false;
    const targetPoints = data.target_points || 2000;
    const tasks = data.tasks || [];
    const tasksProgress = data.tasks_progress || {};
    const rewards = data.rewards || {};
    
    // Данные о раундах
    const currentRound = data.current_round || 1;
    const roundKey = String(currentRound);  // ✅ ПРИВОДИМ К СТРОКЕ
    const currentRoundName = data.current_round_name || "🏁 Стартовый раунд";
    const roundPoints = data.round_points || 0;
    const pointsToNextRound = data.points_to_next_round || 500;
    const roundProgress = data.round_progress || 0;
    const maxRound = data.max_round || 4;
    
    const isCompleted = totalPoints >= targetPoints;
    
    const leagueNames = { 'bronze': 'Бронзовая', 'silver': 'Серебряная', 'gold': 'Золотая', 'platinum': 'Алмазная' };
    const leagueIcons = { 'bronze': '🥉', 'silver': '🥈', 'gold': '🥇', 'platinum': '💎' };
    
    let html = `
        <div class="branch-task-card">
            <div class="branch-header">
                <h3>Испытание сообщества</h3>
                <p>${isCompleted ? '✅ Испытание пройдено!' : 'Цель: ' + targetPoints + ' очков'}</p>
            </div>
            <div class="level-card">
    `;
    
    // Блок с раундами
    html += `
        <div style="text-align: center; margin-bottom: 15px;">
            <div style="font-size: 14px; font-weight: 600; color: var(--accent);">${currentRoundName}</div>
            <div style="font-size: 12px; color: var(--text-gray); margin-bottom: 8px;">Раунд ${currentRound} из ${maxRound}</div>
            <div class="progress-bar-container" style="margin: 8px 0;">
                <div class="progress-bar-fill" style="width: ${roundProgress}%;"></div>
            </div>
            <div style="font-size: 12px; display: flex; justify-content: center; gap: 20px;">
                <span>📊 ${roundPoints} / 500 очков</span>
                <span>🎯 До следующего раунда: ${pointsToNextRound}</span>
            </div>
        </div>
    `;
    
    // Задания текущего раунда
    html += `<div style="margin-bottom: 15px;">`;
    
    const currentRoundTasks = tasks.filter(t => t.round === currentRound || (!t.round && currentRound === 1));
    
    currentRoundTasks.forEach((task, idx) => {
        const taskPoints = task.points || 50;
        // ✅ ИСПОЛЬЗУЕМ roundKey (строка) вместо currentRound (число)
        const currentTaskPoints = (tasksProgress[roundKey] && tasksProgress[roundKey][idx]) || 0;
        const isTaskDone = currentTaskPoints >= taskPoints;
        const taskPercent = Math.min(100, Math.round((currentTaskPoints / taskPoints) * 100));
        
        html += `
            <div style="margin-bottom: 12px; padding: 12px; background: var(--bg); border-radius: 12px; border: 1px solid var(--border-color);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="font-weight: 700; font-size: 15px;">${task.name}</span>
                    <span style="font-size: 12px; color: var(--accent); font-weight: 600;">${currentTaskPoints}/${taskPoints}</span>
                </div>
                ${task.desc ? `<div style="font-size: 12px; color: var(--text-gray); margin-bottom: 6px;">${task.desc}</div>` : ''}
                <div class="progress-bar-container" style="height: 6px;">
                    <div class="progress-bar-fill" style="width: ${taskPercent}%;"></div>
                </div>
                ${!isTaskDone ? `
                    <button class="task-submit-btn" style="padding: 8px; font-size: 12px; margin-top: 8px;" onclick="openCommunityTaskUpload(${idx})">
                        <i class="fas fa-camera"></i> Отправить фото
                    </button>
                ` : `
                    <div style="text-align: center; color: var(--status-green); font-size: 12px; margin-top: 5px;">
                        <i class="fas fa-check-circle"></i> Выполнено!
                    </div>
                `}
            </div>
        `;
    });
    
    html += `</div>`;
    
    // Общий прогресс
    const totalProgress = Math.min(100, Math.round((totalPoints / targetPoints) * 100));
    
    html += `
                <div style="font-size: 32px; font-weight: 900; color: var(--accent); text-align: center;">${totalPoints}</div>
                <div style="text-align: center; font-size: 14px; color: var(--text-gray); margin-bottom: 10px;">из ${targetPoints} очков</div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${totalProgress}%;"></div>
                </div>
                <div style="text-align: center; font-size: 13px; color: var(--text-gray); margin-top: 8px;">
                    ${isCompleted ? '🎉 Цель достигнута!' : `Осталось: ${targetPoints - totalPoints} очков`}
                </div>
                <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px;">
                    <div style="text-align: center;">
                        <div style="font-weight: 700; color: var(--accent); font-size: 18px;">${userPoints}</div>
                        <div style="font-size: 11px; color: var(--text-gray);">Мой вклад</div>
                    </div>
                    ${userLeague ? `
                        <div style="text-align: center;">
                            <div style="font-weight: 700; color: var(--accent); font-size: 18px;">${leagueIcons[userLeague] || ''} ${leagueNames[userLeague]}</div>
                            <div style="font-size: 11px; color: var(--text-gray);">Моя лига</div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    // ========== БЛОК: АЛМАЗНАЯ ЛИГА ==========
    let platinumBlockHtml = `
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 16px; padding: 12px 15px; margin-bottom: 15px; text-align: center;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 5px;">
                <span style="font-size: 20px;">💎</span>
                <span style="font-weight: 700; font-size: 15px; color: var(--accent);">Алмазная лига</span>
            </div>
            <div style="font-size: 12px; color: var(--text-gray); margin: 5px 0;">🎁 Награда: Набор маркеров InfiArt 288 шт.</div>
    `;

    if (!isDonater) {
        platinumBlockHtml += `
            <div style="font-size: 11px; color: var(--text-gray); margin-top: 6px;">✨ Чтобы попасть в Алмазную лигу, необходимо стать спонсором проекта</div>
            <button onclick="openSupportDialog()" style="background: var(--accent); color: white; border: none; padding: 6px 14px; border-radius: 20px; font-weight: 600; font-size: 12px; margin-top: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                <i class="fas fa-heart"></i> Поддержать
            </button>
        `;
    } else {
        platinumBlockHtml += `
            <div style="font-size: 11px; color: var(--status-green); margin-top: 6px;">✅ Спасибо за поддержку! Алмазная лига доступна</div>
        `;
    }

    platinumBlockHtml += `</div>`;
    
    html += platinumBlockHtml;
    
    // Кнопки лиг
    html += `
        <div style="display: flex; gap: 10px; margin-bottom: 10px; overflow-x: auto;">
            <button class="filter-btn ${userLeague === 'bronze' ? 'active' : ''}" onclick="showLeagueLeaderboard('bronze')">
                🥉 Бронзовая (${data.leagues?.bronze?.leaderboard?.length || 0})
            </button>
            <button class="filter-btn ${userLeague === 'silver' ? 'active' : ''}" onclick="showLeagueLeaderboard('silver')">
                🥈 Серебряная (${data.leagues?.silver?.leaderboard?.length || 0})
            </button>
            <button class="filter-btn ${userLeague === 'gold' ? 'active' : ''}" onclick="showLeagueLeaderboard('gold')">
                🥇 Золотая (${data.leagues?.gold?.leaderboard?.length || 0})
            </button>
            <button class="filter-btn ${userLeague === 'platinum' ? 'active' : ''}" onclick="showLeagueLeaderboard('platinum')">
                💎 Алмазная ${isDonater ? `(${data.leagues?.platinum?.leaderboard?.length || 0})` : ''}
            </button>
        </div>
    `;
    
    html += `<div id="communityLeaderboard"></div>`;
    
    container.innerHTML = html;
    
    if (userLeague) {
        showLeagueLeaderboard(userLeague);
    } else {
        showLeagueLeaderboard('bronze');
    }
}
function showLeagueLeaderboard(league) {
    const container = document.getElementById('communityLeaderboard');
    if (!container || !communityEventData) return;
    
    const lb = communityEventData.leagues && communityEventData.leagues[league];
    if (!lb) {
        container.innerHTML = '<div class="no-results">Нет данных</div>';
        return;
    }
    
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.filter-btn[onclick*="'${league}'"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    if (!lb.leaderboard || lb.leaderboard.length === 0) {
        container.innerHTML = '<div class="no-results" style="padding: 20px;">Пока нет участников</div>';
        return;
    }
    
    const leagueIcons = { 'bronze': '🥉', 'silver': '🥈', 'gold': '🥇', 'platinum': '💠' };
    const leagueNames = { 'bronze': 'Бронзовая', 'silver': 'Серебряная', 'gold': 'Золотая', 'platinum': 'Алмазная' };
    
    const rewards = communityEventData.rewards || {};
    const leaguePrize = rewards[league] || '';
    
    let html = '';
    if (leaguePrize) {
        html += `<div style="font-size: 13px; color: var(--text-gray); margin-bottom: 10px;">🎁 ${leaguePrize}</div>`;
    }
    
    lb.leaderboard.forEach((user, index) => {
        const isMe = String(user.user_id) === String(userId);
        const avatarUrl = user.avatar || 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av1.png';
        const placeIcon = user.place <= 3 ? ['🥇','🥈','🥉'][user.place - 1] : `#${user.place}`;
        
        const sponsorBgId = user.sponsor_background_id || '';
        const bgItem = BACKGROUNDS_SHOP.find(b => b.id === sponsorBgId);
        const textColor = bgItem ? bgItem.textColor : null;
        let nameColor = '';
        let statusTextColor = '';
        let statusDefaultBg = '';
        
        if (textColor === 'light') {
            nameColor = 'color: #ffffff;';
            statusTextColor = 'color: #ffffff;';
            statusDefaultBg = 'background: rgba(255,255,255,0.2);';
        } else if (textColor === 'dark') {
            nameColor = 'color: #1c1c1e;';
            statusTextColor = 'color: #1c1c1e;';
            statusDefaultBg = 'background: rgba(0,0,0,0.08);';
        }
        
        const statusBg = user.status_background || '';
        const statusStyle = statusBg 
            ? statusBg + ' padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; ' + statusTextColor
            : statusDefaultBg + ' padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; ' + statusTextColor;
        
        const avatarBorder = user.avatar_border || '';
        const avatarImgStyle = avatarBorder 
            ? `width: 48px; height: 48px; border-radius: 50%; object-fit: cover; ${avatarBorder}` 
            : 'width: 48px; height: 48px; border-radius: 50%; object-fit: cover;';
        
        let bgStyle = '';
        if (user.sponsor_background) {
            bgStyle = user.sponsor_background;
            if (sponsorBgId === 'utka') {
                bgStyle += ' background-position: center 30%;';
            }
        }
        if (!bgStyle) {
            bgStyle = `background: ${isMe ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'var(--card-bg)'};`;
        }
        
        html += `
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; margin-bottom: 8px; ${bgStyle} border-radius: 12px; border: 1px solid var(--border-color); cursor: pointer;" onclick="openPublicProfile('${user.user_id}')">
                <div style="font-size: 18px; font-weight: 800; color: var(--accent); min-width: 35px;">
                    ${placeIcon}
                </div>
                <img src="${avatarUrl}" style="${avatarImgStyle}" onerror="this.src='https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av1.png'">
                <div style="flex: 1; min-width: 0;">
                   <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; ${nameColor}">${user.username || user.name}</div>
                    <span style="${statusStyle}">${user.status || 'Без статуса'}</span>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 700; color: var(--accent); font-size: 16px;">${user.points}</div>
                    <div style="font-size: 11px; color: var(--text-gray);">очков</div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    const cards = container.querySelectorAll('div[style*="display: flex"]');
    cards.forEach(card => {
        const onclick = card.getAttribute('onclick') || '';
        const match = onclick.match(/openPublicProfile\('(\d+)'\)/);
        if (!match) return;
        
        const cardUserId = match[1];
        const user = lb.leaderboard.find(u => String(u.user_id) === cardUserId);
        if (!user) return;
        
        const sponsorBgId = user.sponsor_background_id || '';
        
        if (sponsorBgId && sponsorBgId.startsWith('bg_emoji_')) {
            const emoji = EMOJI_BG_MAP[sponsorBgId] || '⭐';
            const hex = getAccentHex();
            card.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 55 55'%3E%3Ctext x='8' y='25' font-size='20' fill='%23${hex}' opacity='0.15'%3E${encodeURIComponent(emoji)}%3C/text%3E%3Ctext x='30' y='45' font-size='16' fill='%23${hex}' opacity='0.10'%3E${encodeURIComponent(emoji)}%3C/text%3E%3C/svg%3E")`;
            card.style.backgroundSize = '55px 55px';
        }
        
        if (sponsorBgId === 'utka') {
            card.style.backgroundPosition = 'center 30%';
        }
        
        const bgItem2 = BACKGROUNDS_SHOP.find(b => b.id === sponsorBgId);
        if (bgItem2 && bgItem2.textColor) {
            const tc = bgItem2.textColor;
            const nameEl = card.querySelector('div[style*="font-weight: 600"]');
            const statusEl = card.querySelector('span[style*="border-radius: 20px"]');
            
            if (tc === 'light') {
                if (nameEl) nameEl.style.setProperty('color', '#ffffff', 'important');
                if (statusEl) {
                    statusEl.style.setProperty('color', '#ffffff', 'important');
                    if (!user.status_background) {
                        statusEl.style.setProperty('background', 'rgba(255,255,255,0.2)', 'important');
                    }
                }
            } else if (tc === 'dark') {
                if (nameEl) nameEl.style.setProperty('color', '#1c1c1e', 'important');
                if (statusEl) {
                    statusEl.style.setProperty('color', '#1c1c1e', 'important');
                    if (!user.status_background) {
                        statusEl.style.setProperty('background', 'rgba(0,0,0,0.08)', 'important');
                    }
                }
            }
        }
    });
}
let currentCommunitySubtask = null;

function openCommunityTaskUpload(subtaskIdx) {
    currentCommunitySubtask = subtaskIdx;
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    
    fileInput.onchange = function(event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;
        tempPhotos = files;
        
        const previewContainer = document.getElementById('taskPhotoPreviewContainer');
        if (previewContainer) {
            previewContainer.innerHTML = '';
            files.forEach((file) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.cssText = 'width: 70px; height: 70px; object-fit: cover; border-radius: 12px; margin: 5px; border: 2px solid var(--accent);';
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        }
        
        const modal = document.getElementById('taskUploadModal');
        if (modal) {
            modal.style.display = 'flex';
            const titleEl = modal.querySelector('h3');
            if (titleEl) titleEl.innerText = 'Отправка работы (Испытание сообщества)';
            
            const submitBtn = modal.querySelector('.modal-action-btn');
            if (submitBtn) {
                const newBtn = submitBtn.cloneNode(true);
                submitBtn.parentNode.replaceChild(newBtn, submitBtn);
                newBtn.onclick = (e) => {
                    e.preventDefault();
                    submitCommunityTaskPhoto();
                };
            }
        }
    };
    
    fileInput.click();
}

// ==========================================
// ОТПРАВКА ФОТО В ИСПЫТАНИЕ СООБЩЕСТВА (С СЖАТИЕМ)
// ==========================================

async function submitCommunityTaskPhoto() {
    console.log('=== SUBMIT COMMUNITY TASK PHOTO ===');
    
    if (!tempPhotos || tempPhotos.length === 0) {
        showUploadError('❌ Выберите хотя бы одно фото');
        return;
    }
    
    if (isUploading) return;
    isUploading = true;
    
    try {
        const compressedPhotos = await compressImages(tempPhotos, 1200, 0.7);
        
        const formData = new FormData();
        formData.append('user', userId.toString());
        formData.append('subtask', currentCommunitySubtask?.toString() || '0');
        
        for (let i = 0; i < compressedPhotos.length; i++) {
            formData.append('photos', compressedPhotos[i]);
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);
        
        const response = await fetch(`${SERVER_URL}/api/check_community_task`, {
            method: 'POST',
            body: formData,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
        
        const result = await response.json();
        
        if (result && result.status === 'ok') {
            showUploadSuccess('✅ Фото отправлено на проверку!');
            closeTaskUploadModal();
        } else {
            throw new Error(result?.message || 'Ошибка отправки');
        }
    } catch (error) {
        console.error('❌ Ошибка:', error);
        if (error.name === 'AbortError') {
            showUploadError('❌ Превышено время ожидания.');
        } else {
            showUploadError(`❌ Ошибка: ${error.message}`);
        }
    } finally {
        isUploading = false;
        tempPhotos = [];
    }
}
        function openMyCustomization() {
    const modal = document.getElementById('myCustomizationModal');
    const content = document.getElementById('myCustomizationContent');
    
    modal.style.display = 'flex';
    content.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Загрузка...</div>';
    
    fetch(`${SERVER_URL}/api/stats?user_id=${userId}`)
        .then(r => r.json())
        .then(stats => {
            const ownedBgs = stats.owned_backgrounds || [];
            const ownedStatusBgs = stats.owned_status_backgrounds || [];
            const ownedBorders = stats.owned_borders || [];
            
            const currentBgId = stats.sponsor_background_id || '';
            const currentStatusBgId = stats.status_background_id || '';
            const currentBorderId = stats.avatar_border_id || '';
            
            let html = '';
            
            // Подложки
            html += `<h4 style="margin: 15px 0 10px;"><i class="fas fa-paint-roller"></i> Подложки</h4>`;
            if (ownedBgs.length === 0) {
                html += '<div class="no-results" style="padding:10px;">Нет купленных подложек</div>';
            } else {
                html += '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">';
                ownedBgs.forEach(bgId => {
                    const bg = BACKGROUNDS_SHOP.find(b => b.id === bgId);
                    if (!bg) return;
                    const isActive = (bgId === currentBgId);
                    html += `
                        <div onclick="activateBackground('${bgId}'); closeMyCustomization();" 
                             style="background: var(--card-bg); border: 2px solid ${isActive ? 'var(--accent)' : 'var(--border-color)'}; border-radius: 12px; padding: 10px; cursor: pointer; text-align: center;">
                            <div style="width: 100%; height: 40px; border-radius: 8px; margin-bottom: 8px; ${bg.css}"></div>
                            <div style="font-size: 12px; font-weight: 600; color: var(--text);">${bg.name}</div>
                            ${isActive ? '<div style="font-size: 10px; color: var(--accent);">✅ Активна</div>' : ''}
                        </div>
                    `;
                });
                html += '</div>';
            }
            
            // Фоны статуса
            html += `<h4 style="margin: 15px 0 10px;"><i class="fas fa-crown"></i> Фоны статуса</h4>`;
            if (ownedStatusBgs.length === 0) {
                html += '<div class="no-results" style="padding:10px;">Нет купленных фонов</div>';
            } else {
                html += '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">';
                ownedStatusBgs.forEach(bgId => {
                    const bg = STATUS_BG_SHOP.find(b => b.id === bgId);
                    if (!bg) return;
                    const isActive = (bgId === currentStatusBgId);
                    html += `
                        <div onclick="activateStatusBg('${bgId}'); closeMyCustomization();" 
                             style="background: var(--card-bg); border: 2px solid ${isActive ? 'var(--accent)' : 'var(--border-color)'}; border-radius: 12px; padding: 10px; cursor: pointer; text-align: center;">
                            <div style="width: 100%; height: 40px; border-radius: 8px; margin-bottom: 8px; ${bg.css}"></div>
                            <div style="font-size: 12px; font-weight: 600; color: var(--text);">${bg.name}</div>
                            ${isActive ? '<div style="font-size: 10px; color: var(--accent);">✅ Активен</div>' : ''}
                        </div>
                    `;
                });
                html += '</div>';
            }
            
            // Обводки аватара
            html += `<h4 style="margin: 15px 0 10px;"><i class="fas fa-circle"></i> Обводки аватара</h4>`;
            if (ownedBorders.length === 0) {
                html += '<div class="no-results" style="padding:10px;">Нет купленных обводок</div>';
            } else {
                html += '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">';
                ownedBorders.forEach(borderId => {
                    const border = AVATAR_BORDER_SHOP.find(b => b.id === borderId);
                    if (!border) return;
                    const isActive = (borderId === currentBorderId);
                    html += `
                        <div onclick="activateAvatarBorder('${borderId}'); closeMyCustomization();" 
                             style="background: var(--card-bg); border: 2px solid ${isActive ? 'var(--accent)' : 'var(--border-color)'}; border-radius: 12px; padding: 10px; cursor: pointer; text-align: center;">
                            <div style="width: 50px; height: 50px; border-radius: 50%; margin: 0 auto 8px; ${border.css} background: var(--bg); display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-user" style="font-size: 20px; color: var(--text-gray);"></i>
                            </div>
                            <div style="font-size: 12px; font-weight: 600; color: var(--text);">${border.name}</div>
                            ${isActive ? '<div style="font-size: 10px; color: var(--accent);">✅ Активна</div>' : ''}
                        </div>
                    `;
                });
                html += '</div>';
            }
            
            content.innerHTML = html;
        });
}

function closeMyCustomization() {
    document.getElementById('myCustomizationModal').style.display = 'none';
    updateUI();
}
        // ==========================================
// СЖАТИЕ ИЗОБРАЖЕНИЙ ПЕРЕД ОТПРАВКОЙ
// ==========================================

async function compressImage(file, maxWidth = 1200, quality = 0.7) {
    return new Promise((resolve, reject) => {
        // Если файл меньше 1MB — не сжимаем
        if (file.size < 1024 * 1024) {
            resolve(file);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { 
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    console.log(`📦 Сжатие: ${Math.round(file.size / 1024)}KB → ${Math.round(compressedFile.size / 1024)}KB`);
                    resolve(compressedFile);
                }, 'image/jpeg', quality);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Сжатие нескольких файлов
async function compressImages(files, maxWidth = 1200, quality = 0.7) {
    const compressed = [];
    for (const file of files) {
        try {
            const compressedFile = await compressImage(file, maxWidth, quality);
            compressed.push(compressedFile);
        } catch (error) {
            console.error('Ошибка сжатия файла:', error);
            compressed.push(file);
        }
    }
    return compressed;
}
     function calculateUserXP() {
    return userProgress.xp || 0;
}

function getUserLevelInfo(xp) {
    const levels = [
        { level: 1, name: '🌱 Просто тыкаю', min: 0, max: 50 },
        { level: 2, name: '🎨 Вхожу в кураж', min: 50, max: 150 },
        { level: 3, name: '⭐ Творец', min: 150, max: 300 },
        { level: 4, name: '💫 Маэстро', min: 300, max: 500 },
        { level: 5, name: '👑 Легенда', min: 500, max: 999999 }
    ];
    
    for (const lvl of levels) {
        if (xp >= lvl.min && xp < lvl.max) {
            const progress = Math.round(((xp - lvl.min) / (lvl.max - lvl.min)) * 100);
            return { ...lvl, progress, xp, nextXP: lvl.max };
        }
    }
    return levels[0];
}

function renderUserLevel() {
    const xp = calculateUserXP();
    const levelInfo = getUserLevelInfo(xp);
    
    const container = document.getElementById('userLevelDisplay');
    if (!container) return;
    
    container.innerHTML = `
        <div style="font-size: 12px; color: var(--text-gray); margin-bottom: 4px;">${levelInfo.name}</div>
        <div class="progress-bar-container" style="height: 4px;">
            <div class="progress-bar-fill" style="width: ${levelInfo.progress}%;"></div>
        </div>
        <div style="font-size: 10px; color: var(--text-gray); margin-top: 2px;">${levelInfo.xp} / ${levelInfo.nextXP} XP</div>
    `;
    
    // ✅ После рендера — применить цвет подложки
    setTimeout(() => {
        const stats = JSON.parse(localStorage.getItem('coloring_user') || '{}');
        // Пробуем получить sponsor_background_id из userProgress
        const bgId = (userProgress && userProgress.sponsor_background_id) || '';
        if (bgId) {
            const bgItem = BACKGROUNDS_SHOP.find(b => b.id === bgId);
            if (bgItem && bgItem.textColor) {
                const levelEl = document.getElementById('userLevelDisplay');
                if (levelEl && bgItem.textColor === 'light') {
                    levelEl.style.setProperty('color', '#ffffff', 'important');
                    const children = levelEl.querySelectorAll('*');
                    children.forEach(c => {
                        if (c.style) c.style.setProperty('color', '#ffffff', 'important');
                    });
                } else if (levelEl && bgItem.textColor === 'dark') {
                    levelEl.style.setProperty('color', '#8e8e93', 'important');
                    const children = levelEl.querySelectorAll('*');
                    children.forEach(c => {
                        if (c.style) c.style.setProperty('color', '#8e8e93', 'important');
                    });
                }
            }
        }
    }, 100);
}
        function calculatePublicXP(profile) {
    let xp = 0;
    
    for (const [key, value] of Object.entries(profile)) {
        if (key.startsWith('branch_') && typeof value === 'number') {
            xp += value * 5;
        }
        if (key.startsWith('irina_level_') && typeof value === 'number') {
            xp += value * 3;
        }
    }
    
    return xp;
}

       // ==========================================
// МАГАЗИН
// ==========================================

let currentShopTab = 'statuses';

const STATUS_SHOP = [
    { id: 'offline', name: 'Оффлайн', price: 150 },
    { id: 'on_relax', name: 'На релаксе', price: 200 },
    { id: 'other_dimension', name: 'Из другого измерения', price: 200 },
    { id: 'madman', name: 'Безумец', price: 250 },
    { id: 'spender', name: 'Транжира', price: 800 },
    { id: 'best_of_paris', name: 'Как в лучших томах Парижа', price: 300 },
    { id: 'in_flow', name: 'В потоке', price: 300 },
    { id: 'understood_genius', name: 'Недопонятый гений', price: 300 }
];

const AVATAR_BORDER_SHOP = [
    { id: 'avatar_border_bronze', name: 'Бронза', price: 150, css: 'border: 3px solid rgba(205,127,50,0.8); box-shadow: 0 0 8px rgba(205,127,50,0.4);' },
    { id: 'avatar_border_arctic', name: 'Арктика', price: 150, css: 'border: 3px solid rgba(180,220,255,0.8); box-shadow: 0 0 8px rgba(180,220,255,0.4);' },
    { id: 'avatar_border_silver', name: 'Серебро', price: 150, css: 'border: 3px solid rgba(192,192,192,0.8); box-shadow: 0 0 8px rgba(192,192,192,0.4);' },
    { id: 'avatar_border_amethyst', name: 'Аметист', price: 150, css: 'border: 3px solid rgba(160,100,200,0.8); box-shadow: 0 0 8px rgba(160,100,200,0.4);' },
    { id: 'avatar_border_sunset', name: 'Закат', price: 150, css: 'border: 3px solid rgba(255,150,100,0.8); box-shadow: 0 0 8px rgba(255,150,100,0.4);' },
    { id: 'avatar_border_emerald', name: 'Изумруд', price: 150, css: 'border: 3px solid rgba(80,200,120,0.8); box-shadow: 0 0 8px rgba(80,200,120,0.4);' },
    { id: 'avatar_border_sapphire', name: 'Сапфир', price: 150, css: 'border: 3px solid rgba(70,130,200,0.8); box-shadow: 0 0 8px rgba(70,130,200,0.4);' },
    { id: 'avatar_border_gold', name: 'Золото', price: 150, css: 'border: 3px solid rgba(255,215,0,0.8); box-shadow: 0 0 8px rgba(255,215,0,0.4);' },
    { id: 'avatar_border_ruby', name: 'Рубин', price: 150, css: 'border: 3px solid rgba(220,60,60,0.8); box-shadow: 0 0 8px rgba(220,60,60,0.4);' },
    { id: 'avatar_border_rose_gold', name: 'Розовое золото', price: 150, css: 'border: 3px solid rgba(231,156,148,0.8); box-shadow: 0 0 8px rgba(231,156,148,0.4);' },
    { id: 'avatar_border_adaptive', name: 'Адаптивный', price: 150, css: 'border: 3px solid color-mix(in srgb, var(--accent) 60%, transparent); box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 35%, transparent);' },
    { id: 'avatar_border_platinum', name: 'Платина', price: 150, css: 'border: 3px solid rgba(180,200,220,0.8); box-shadow: 0 0 8px rgba(180,200,220,0.4);' }
];

const BACKGROUNDS_SHOP = [
    { id: 'bg_canvas', name: 'Холст', price: 200, css: 'background: repeating-linear-gradient(0deg, transparent, transparent 3px, color-mix(in srgb, var(--accent) 5%, transparent) 3px, color-mix(in srgb, var(--accent) 5%, transparent) 4px), repeating-linear-gradient(90deg, transparent, transparent 3px, color-mix(in srgb, var(--accent) 5%, transparent) 3px, color-mix(in srgb, var(--accent) 5%, transparent) 4px); border: 1px solid var(--border-color);' },
    { id: 'bg_glass', name: 'Стекло', price: 200, css: 'background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 10%, transparent), color-mix(in srgb, var(--accent) 4%, transparent)); backdrop-filter: blur(10px); border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);' },
    { id: 'bg_subtle_lines', name: 'Тонкие линии', price: 200, css: 'background: repeating-linear-gradient(45deg, transparent, transparent 5px, color-mix(in srgb, var(--accent) 5%, transparent) 5px, color-mix(in srgb, var(--accent) 5%, transparent) 10px); border: 1px solid var(--border-color);' },
  { id: 'bg_dots', name: 'Точечки', price: 200, css: 'background: radial-gradient(circle, color-mix(in srgb, var(--accent) 15%, transparent) 2.5px, transparent 2.5px); background-size: 14px 14px; border: 1px solid var(--border-color);' },

    // GIF-подложки
    
{ id: 'utka', name: 'Водные забавы', price: 2000, textColor: 'light',
  css: `background-image: url('https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/backgrounds/utka.gif'); background-size: cover;` },

    
    // ЭМОДЗИ-ПОДЛОЖКИ
   { id: 'bg_emoji_stars', name: '⭐ Звёздочки', price: 600, 
  preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27%3E%3Ctext x=%2710%27 y=%2725%27 font-size=%2720%27 fill=%27%23ff9500%27 opacity=%270.25%27%3E⭐%3C/text%3E%3C/svg%3E'); background-size: 60px 60px;`,
  css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ctext x='10' y='25' font-size='20' fill='%23${getAccentHex()}' opacity='0.20'%3E⭐%3C/text%3E%3Ctext x='35' y='50' font-size='16' fill='%23${getAccentHex()}' opacity='0.14'%3E⭐%3C/text%3E%3C/svg%3E"); background-size: 60px 60px; border: 1px solid var(--border-color);` },
    { id: 'bg_emoji_hearts', name: '❤️ Сердечки', price: 600, 
      preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2750%27 height=%2750%27 viewBox=%270 0 50 50%27%3E%3Ctext x=%275%27 y=%2730%27 font-size=%2718%27 fill=%27%23ff9500%27 opacity=%270.18%27%3E❤️%3C/text%3E%3C/svg%3E'); background-size: 50px 50px;`,
      css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Ctext x='5' y='30' font-size='18' fill='%23${getAccentHex()}' opacity='0.12'%3E❤️%3C/text%3E%3Ctext x='28' y='15' font-size='14' fill='%23${getAccentHex()}' opacity='0.08'%3E❤️%3C/text%3E%3C/svg%3E"); background-size: 50px 50px; border: 1px solid var(--border-color);` },
  { id: 'bg_emoji_money', name: '$ Доллары', price: 700, 
  preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2755%27 height=%2755%27 viewBox=%270 0 55 55%27%3E%3Ctext x=%2710%27 y=%2725%27 font-size=%2722%27 font-weight=%27bold%27 fill=%27%23ff9500%27 opacity=%270.25%27%3E$%3C/text%3E%3C/svg%3E'); background-size: 55px 55px;`,
  css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 55 55'%3E%3Ctext x='10' y='25' font-size='22' font-weight='bold' fill='%23${getAccentHex()}' opacity='0.20'%3E$%3C/text%3E%3Ctext x='35' y='45' font-size='18' fill='%23${getAccentHex()}' opacity='0.14'%3E$%3C/text%3E%3C/svg%3E"); background-size: 55px 55px; border: 1px solid var(--border-color);` },
    { id: 'bg_emoji_crowns', name: '👑 Короны', price: 700, 
      preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2765%27 height=%2765%27 viewBox=%270 0 65 65%27%3E%3Ctext x=%2710%27 y=%2730%27 font-size=%2724%27 fill=%27%23ff9500%27 opacity=%270.2%27%3E👑%3C/text%3E%3C/svg%3E'); background-size: 65px 65px;`,
      css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='65' height='65' viewBox='0 0 65 65'%3E%3Ctext x='10' y='30' font-size='24' fill='%23${getAccentHex()}' opacity='0.15'%3E👑%3C/text%3E%3Ctext x='40' y='55' font-size='18' fill='%23${getAccentHex()}' opacity='0.10'%3E👑%3C/text%3E%3C/svg%3E"); background-size: 65px 65px; border: 1px solid var(--border-color);` },
    { id: 'bg_emoji_diamonds', name: '💎 Бриллианты', price: 700, 
      preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2750%27 height=%2750%27 viewBox=%270 0 50 50%27%3E%3Ctext x=%278%27 y=%2728%27 font-size=%2720%27 fill=%27%23ff9500%27 opacity=%270.2%27%3E💎%3C/text%3E%3C/svg%3E'); background-size: 50px 50px;`,
      css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Ctext x='8' y='28' font-size='20' fill='%23${getAccentHex()}' opacity='0.15'%3E💎%3C/text%3E%3Ctext x='30' y='12' font-size='14' fill='%23${getAccentHex()}' opacity='0.10'%3E💎%3C/text%3E%3C/svg%3E"); background-size: 50px 50px; border: 1px solid var(--border-color);` },
    { id: 'bg_emoji_fire', name: '🔥 Огоньки', price: 500, 
      preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2755%27 height=%2755%27 viewBox=%270 0 55 55%27%3E%3Ctext x=%278%27 y=%2725%27 font-size=%2718%27 fill=%27%23ff9500%27 opacity=%270.2%27%3E🔥%3C/text%3E%3C/svg%3E'); background-size: 55px 55px;`,
      css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 55 55'%3E%3Ctext x='8' y='25' font-size='18' fill='%23${getAccentHex()}' opacity='0.15'%3E🔥%3C/text%3E%3Ctext x='30' y='45' font-size='14' fill='%23${getAccentHex()}' opacity='0.10'%3E🔥%3C/text%3E%3C/svg%3E"); background-size: 55px 55px; border: 1px solid var(--border-color);` },
    { id: 'bg_emoji_rocket', name: '🚀 Ракеты', price: 500, 
      preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2755%27 height=%2755%27 viewBox=%270 0 55 55%27%3E%3Ctext x=%2710%27 y=%2725%27 font-size=%2718%27 fill=%27%23ff9500%27 opacity=%270.2%27%3E🚀%3C/text%3E%3C/svg%3E'); background-size: 55px 55px;`,
      css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 55 55'%3E%3Ctext x='10' y='25' font-size='18' fill='%23${getAccentHex()}' opacity='0.15'%3E🚀%3C/text%3E%3Ctext x='32' y='45' font-size='14' fill='%23${getAccentHex()}' opacity='0.10'%3E🚀%3C/text%3E%3C/svg%3E"); background-size: 55px 55px; border: 1px solid var(--border-color);` },
    { id: 'bg_emoji_clown', name: '🤡 Клоуны', price: 600, 
      preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2755%27 height=%2755%27 viewBox=%270 0 55 55%27%3E%3Ctext x=%278%27 y=%2725%27 font-size=%2720%27 fill=%27%23ff9500%27 opacity=%270.2%27%3E🤡%3C/text%3E%3C/svg%3E'); background-size: 55px 55px;`,
      css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 55 55'%3E%3Ctext x='8' y='25' font-size='20' fill='%23${getAccentHex()}' opacity='0.15'%3E🤡%3C/text%3E%3Ctext x='30' y='45' font-size='16' fill='%23${getAccentHex()}' opacity='0.10'%3E🤡%3C/text%3E%3C/svg%3E"); background-size: 55px 55px; border: 1px solid var(--border-color);` },
    { id: 'bg_emoji_dino', name: '🦖 Ти-Рекс', price: 700, 
      preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2755%27 height=%2755%27 viewBox=%270 0 55 55%27%3E%3Ctext x=%278%27 y=%2725%27 font-size=%2720%27 fill=%27%23ff9500%27 opacity=%270.2%27%3E🦖%3C/text%3E%3C/svg%3E'); background-size: 55px 55px;`,
      css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 55 55'%3E%3Ctext x='8' y='25' font-size='20' fill='%23${getAccentHex()}' opacity='0.15'%3E🦖%3C/text%3E%3Ctext x='30' y='45' font-size='16' fill='%23${getAccentHex()}' opacity='0.10'%3E🦖%3C/text%3E%3C/svg%3E"); background-size: 55px 55px; border: 1px solid var(--border-color);` },
    { id: 'bg_emoji_dragon', name: '🐉 Драконы', price: 700, 
      preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2755%27 height=%2755%27 viewBox=%270 0 55 55%27%3E%3Ctext x=%278%27 y=%2725%27 font-size=%2720%27 fill=%27%23ff9500%27 opacity=%270.2%27%3E🐉%3C/text%3E%3C/svg%3E'); background-size: 55px 55px;`,
      css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 55 55'%3E%3Ctext x='8' y='25' font-size='20' fill='%23${getAccentHex()}' opacity='0.15'%3E🐉%3C/text%3E%3Ctext x='30' y='45' font-size='16' fill='%23${getAccentHex()}' opacity='0.10'%3E🐉%3C/text%3E%3C/svg%3E"); background-size: 55px 55px; border: 1px solid var(--border-color);` },
    { id: 'bg_emoji_rainbow', name: '🌈 Радуги', price: 500, 
      preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2755%27 height=%2755%27 viewBox=%270 0 55 55%27%3E%3Ctext x=%278%27 y=%2725%27 font-size=%2720%27 fill=%27%23ff9500%27 opacity=%270.2%27%3E🌈%3C/text%3E%3C/svg%3E'); background-size: 55px 55px;`,
      css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 55 55'%3E%3Ctext x='8' y='25' font-size='20' fill='%23${getAccentHex()}' opacity='0.15'%3E🌈%3C/text%3E%3Ctext x='30' y='45' font-size='16' fill='%23${getAccentHex()}' opacity='0.10'%3E🌈%3C/text%3E%3C/svg%3E"); background-size: 55px 55px; border: 1px solid var(--border-color);` },
    { id: 'bg_emoji_butterfly', name: '🦋 Бабочки', price: 500, 
      preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2755%27 height=%2755%27 viewBox=%270 0 55 55%27%3E%3Ctext x=%278%27 y=%2725%27 font-size=%2720%27 fill=%27%23429bdf%27 opacity=%270.25%27%3E🦋%3C/text%3E%3C/svg%3E'); background-size: 55px 55px;`,
      css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 55 55'%3E%3Ctext x='8' y='25' font-size='20' fill='%23${getAccentHex()}' opacity='0.15'%3E🦋%3C/text%3E%3Ctext x='30' y='45' font-size='16' fill='%23${getAccentHex()}' opacity='0.10'%3E🦋%3C/text%3E%3C/svg%3E"); background-size: 55px 55px; border: 1px solid var(--border-color);` },
    { id: 'bg_emoji_alien', name: '👽 Пришельцы', price: 700, 
      preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2755%27 height=%2755%27 viewBox=%270 0 55 55%27%3E%3Ctext x=%278%27 y=%2725%27 font-size=%2720%27 fill=%27%23ff9500%27 opacity=%270.2%27%3E👽%3C/text%3E%3C/svg%3E'); background-size: 55px 55px;`,
      css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 55 55'%3E%3Ctext x='8' y='25' font-size='20' fill='%23${getAccentHex()}' opacity='0.15'%3E👽%3C/text%3E%3Ctext x='30' y='45' font-size='16' fill='%23${getAccentHex()}' opacity='0.10'%3E👽%3C/text%3E%3C/svg%3E"); background-size: 55px 55px; border: 1px solid var(--border-color);` },
    { id: 'bg_emoji_flower', name: '🌸 Цветочки', price: 500, 
      preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2750%27 height=%2750%27 viewBox=%270 0 50 50%27%3E%3Ctext x=%275%27 y=%2728%27 font-size=%2718%27 fill=%27%23ff9500%27 opacity=%270.2%27%3E🌸%3C/text%3E%3C/svg%3E'); background-size: 50px 50px;`,
      css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Ctext x='5' y='28' font-size='18' fill='%23${getAccentHex()}' opacity='0.12'%3E🌸%3C/text%3E%3Ctext x='28' y='15' font-size='14' fill='%23${getAccentHex()}' opacity='0.08'%3E🌸%3C/text%3E%3C/svg%3E"); background-size: 50px 50px; border: 1px solid var(--border-color);` },
    { id: 'bg_emoji_ghost', name: '👻 Приведения', price: 600, 
      preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2755%27 height=%2755%27 viewBox=%270 0 55 55%27%3E%3Ctext x=%278%27 y=%2725%27 font-size=%2720%27 fill=%27%23ff9500%27 opacity=%270.2%27%3E👻%3C/text%3E%3C/svg%3E'); background-size: 55px 55px;`,
      css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 55 55'%3E%3Ctext x='8' y='25' font-size='20' fill='%23${getAccentHex()}' opacity='0.15'%3E👻%3C/text%3E%3Ctext x='30' y='45' font-size='16' fill='%23${getAccentHex()}' opacity='0.10'%3E👻%3C/text%3E%3C/svg%3E"); background-size: 55px 55px; border: 1px solid var(--border-color);` },
    { id: 'bg_emoji_skull', name: '💀 Черепа', price: 700, 
      preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2755%27 height=%2755%27 viewBox=%270 0 55 55%27%3E%3Ctext x=%278%27 y=%2725%27 font-size=%2720%27 fill=%27%23ff9500%27 opacity=%270.2%27%3E💀%3C/text%3E%3C/svg%3E'); background-size: 55px 55px;`,
      css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 55 55'%3E%3Ctext x='8' y='25' font-size='20' fill='%23${getAccentHex()}' opacity='0.15'%3E💀%3C/text%3E%3Ctext x='30' y='45' font-size='16' fill='%23${getAccentHex()}' opacity='0.10'%3E💀%3C/text%3E%3C/svg%3E"); background-size: 55px 55px; border: 1px solid var(--border-color);` },
    { id: 'bg_emoji_unicorn', name: '🦄 Единороги', price: 500, 
      preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2755%27 height=%2755%27 viewBox=%270 0 55 55%27%3E%3Ctext x=%278%27 y=%2725%27 font-size=%2720%27 fill=%27%23ff9500%27 opacity=%270.2%27%3E🦄%3C/text%3E%3C/svg%3E'); background-size: 55px 55px;`,
      css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 55 55'%3E%3Ctext x='8' y='25' font-size='20' fill='%23${getAccentHex()}' opacity='0.15'%3E🦄%3C/text%3E%3Ctext x='30' y='45' font-size='16' fill='%23${getAccentHex()}' opacity='0.10'%3E🦄%3C/text%3E%3C/svg%3E"); background-size: 55px 55px; border: 1px solid var(--border-color);` },
    { id: 'bg_emoji_clover', name: '🍀 Клевер', price: 500, 
      preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2750%27 height=%2750%27 viewBox=%270 0 50 50%27%3E%3Ctext x=%275%27 y=%2728%27 font-size=%2718%27 fill=%27%23ff9500%27 opacity=%270.2%27%3E🍀%3C/text%3E%3C/svg%3E'); background-size: 50px 50px;`,
      css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Ctext x='5' y='28' font-size='18' fill='%23${getAccentHex()}' opacity='0.12'%3E🍀%3C/text%3E%3Ctext x='28' y='15' font-size='14' fill='%23${getAccentHex()}' opacity='0.08'%3E🍀%3C/text%3E%3C/svg%3E"); background-size: 50px 50px; border: 1px solid var(--border-color);` },
    { id: 'bg_emoji_meteor', name: '☄️ Метеориты', price: 500, 
      preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2755%27 height=%2755%27 viewBox=%270 0 55 55%27%3E%3Ctext x=%278%27 y=%2725%27 font-size=%2720%27 fill=%27%23ff9500%27 opacity=%270.2%27%3E☄️%3C/text%3E%3C/svg%3E'); background-size: 55px 55px;`,
      css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 55 55'%3E%3Ctext x='8' y='25' font-size='20' fill='%23${getAccentHex()}' opacity='0.15'%3E☄️%3C/text%3E%3Ctext x='30' y='45' font-size='16' fill='%23${getAccentHex()}' opacity='0.10'%3E☄️%3C/text%3E%3C/svg%3E"); background-size: 55px 55px; border: 1px solid var(--border-color);` },
    { id: 'bg_emoji_lightning', name: '⚡ Молнии', price: 500, 
      preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2755%27 height=%2755%27 viewBox=%270 0 55 55%27%3E%3Ctext x=%278%27 y=%2725%27 font-size=%2720%27 fill=%27%23ff9500%27 opacity=%270.2%27%3E⚡%3C/text%3E%3C/svg%3E'); background-size: 55px 55px;`,
      css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 55 55'%3E%3Ctext x='8' y='25' font-size='20' fill='%23${getAccentHex()}' opacity='0.15'%3E⚡%3C/text%3E%3Ctext x='30' y='45' font-size='16' fill='%23${getAccentHex()}' opacity='0.10'%3E⚡%3C/text%3E%3C/svg%3E"); background-size: 55px 55px; border: 1px solid var(--border-color);` },
    { id: 'bg_emoji_pill', name: '💊 Таблетки', price: 700, 
      preview: `background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2750%27 height=%2750%27 viewBox=%270 0 50 50%27%3E%3Ctext x=%275%27 y=%2728%27 font-size=%2718%27 fill=%27%23ff9500%27 opacity=%270.2%27%3E💊%3C/text%3E%3C/svg%3E'); background-size: 50px 50px;`,
      css: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Ctext x='5' y='28' font-size='18' fill='%23${getAccentHex()}' opacity='0.12'%3E💊%3C/text%3E%3Ctext x='28' y='15' font-size='14' fill='%23${getAccentHex()}' opacity='0.08'%3E💊%3C/text%3E%3C/svg%3E"); background-size: 50px 50px; border: 1px solid var(--border-color);` }
];
        const STATUS_BG_SHOP = [
    { id: 'status_bg_bronze', name: 'Бронза', price: 350, css: 'background: linear-gradient(135deg, rgba(205,127,50,0.25), rgba(180,100,30,0.1)); border: 1px solid rgba(205,127,50,0.4);' },
    { id: 'status_bg_arctic', name: 'Арктика', price: 350, css: 'background: linear-gradient(135deg, rgba(180,220,255,0.2), rgba(140,200,240,0.08)); border: 1px solid rgba(180,220,255,0.35);' },
    { id: 'status_bg_silver', name: 'Серебро', price: 350, css: 'background: linear-gradient(135deg, rgba(192,192,192,0.25), rgba(160,160,160,0.1)); border: 1px solid rgba(192,192,192,0.4);' },
    { id: 'status_bg_amethyst', name: 'Аметист', price: 350, css: 'background: linear-gradient(135deg, rgba(160,100,200,0.2), rgba(130,70,180,0.08)); border: 1px solid rgba(160,100,200,0.35);' },
    { id: 'status_bg_sunset', name: 'Закат', price: 350, css: 'background: linear-gradient(135deg, rgba(255,150,100,0.2), rgba(200,80,150,0.08)); border: 1px solid rgba(255,150,100,0.35);' },
    { id: 'status_bg_emerald', name: 'Изумруд', price: 350, css: 'background: linear-gradient(135deg, rgba(80,200,120,0.2), rgba(50,160,90,0.08)); border: 1px solid rgba(80,200,120,0.35);' },
    { id: 'status_bg_sapphire', name: 'Сапфир', price: 350, css: 'background: linear-gradient(135deg, rgba(70,130,200,0.2), rgba(40,100,180,0.08)); border: 1px solid rgba(70,130,200,0.35);' },
    { id: 'status_bg_gold', name: 'Золото', price: 350, css: 'background: linear-gradient(135deg, rgba(255,215,0,0.25), rgba(255,180,0,0.1)); border: 1px solid rgba(255,215,0,0.4);' },
    { id: 'status_bg_ruby', name: 'Рубин', price: 350, css: 'background: linear-gradient(135deg, rgba(220,60,60,0.2), rgba(180,30,30,0.08)); border: 1px solid rgba(220,60,60,0.35);' },
    { id: 'status_bg_rose_gold', name: 'Розовое золото', price: 350, css: 'background: linear-gradient(135deg, rgba(231,156,148,0.25), rgba(200,120,110,0.1)); border: 1px solid rgba(231,156,148,0.4);' },
    { id: 'status_bg_adaptive', name: 'Адаптивный', price: 350, css: 'background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 20%, transparent), color-mix(in srgb, var(--accent) 8%, transparent)); border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);' },
    { id: 'status_bg_platinum', name: 'Платина', price: 350, css: 'background: linear-gradient(135deg, rgba(180,200,220,0.25), rgba(140,160,190,0.1)); border: 1px solid rgba(180,200,220,0.4);' }
];
const SKIP_SHOP = [
    { id: 'skip_1', name: 'Скип на 1 очко', desc: 'Пропустить одно задание (кроме Шок контент)', price: 50, amount: 1 },
    { id: 'skip_3', name: 'Скип на 3 очка', desc: 'Пропустить три задания (кроме Шок контент)', price: 125, amount: 3 },
    { id: 'skip_5', name: 'Скип на 5 очков', desc: 'Пропустить пять заданий (кроме Шок контент)', price: 200, amount: 5 }
];
        // ==========================================
// НАБОРЫ КАСТОМИЗАЦИИ
// ==========================================

const BUNDLES_SHOP = [
    {
        id: 'bundle_rose_gold',
        name: 'Розовое золото',
        price: 900, // 600+350+150=1100
        items: {
            background: 'bg_emoji_hearts',
            status_bg: 'status_bg_rose_gold',
            avatar_border: 'avatar_border_rose_gold'
        },
        description: 'Подложка Сердечки + Фон статуса Розовое золото + Обводка Розовое золото'
    },
    {
        id: 'bundle_gold',
        name: 'Золотой',
        price: 850, // 600+350+150=1100
        items: {
            background: 'bg_emoji_stars',
            status_bg: 'status_bg_gold',
            avatar_border: 'avatar_border_gold'
        },
        description: 'Подложка Звёздочки + Фон статуса Золото + Обводка Золото'
    },
    {
        id: 'bundle_diamond',
        name: 'Бриллиантовый',
        price: 950, // 700+350+150=1200
        items: {
            background: 'bg_emoji_diamonds',
            status_bg: 'status_bg_platinum',
            avatar_border: 'avatar_border_platinum'
        },
        description: 'Подложка Бриллианты + Фон статуса Платина + Обводка Платина'
    },
    {
        id: 'bundle_ruby',
        name: 'Рубиновый',
        price: 800, // 500+350+150=1000
        items: {
            background: 'bg_emoji_fire',
            status_bg: 'status_bg_ruby',
            avatar_border: 'avatar_border_ruby'
        },
        description: 'Подложка Огоньки + Фон статуса Рубин + Обводка Рубин'
    },
    {
        id: 'bundle_dragon',
        name: 'Драконий',
        price: 950, // 700+350+150=1200
        items: {
            background: 'bg_emoji_dragon',
            status_bg: 'status_bg_ruby',
            avatar_border: 'avatar_border_gold'
        },
        description: 'Подложка Драконы + Фон статуса Рубин + Обводка Золото'
    },
    {
        id: 'bundle_dark',
        name: 'Тёмный',
        price: 950, // 700+350+150=1200
        items: {
            background: 'bg_emoji_skull',
            status_bg: 'status_bg_amethyst',
            avatar_border: 'avatar_border_amethyst'
        },
        description: 'Подложка Черепа + Фон статуса Аметист + Обводка Аметист'
    },
    {
        id: 'bundle_alien',
        name: 'Космический',
        price: 950, // 700+350+150=1200
        items: {
            background: 'bg_emoji_alien',
            status_bg: 'status_bg_sapphire',
            avatar_border: 'avatar_border_sapphire'
        },
        description: 'Подложка Пришельцы + Фон статуса Сапфир + Обводка Сапфир'
    },
    {
        id: 'bundle_crown',
        name: 'Королевский',
        price: 950, // 700+350+150=1200
        items: {
            background: 'bg_emoji_crowns',
            status_bg: 'status_bg_gold',
            avatar_border: 'avatar_border_gold'
        },
        description: 'Подложка Короны + Фон статуса Золото + Обводка Золото'
    },
    {
        id: 'bundle_magic',
        name: 'Магический',
        price: 800, // 500+350+150=1000
        items: {
            background: 'bg_emoji_unicorn',
            status_bg: 'status_bg_amethyst',
            avatar_border: 'avatar_border_rose_gold'
        },
        description: 'Подложка Единороги + Фон статуса Аметист + Обводка Розовое золото'
    },
    {
        id: 'bundle_lucky',
        name: 'Счастливый',
        price: 800, // 500+350+150=1000
        items: {
            background: 'bg_emoji_clover',
            status_bg: 'status_bg_emerald',
            avatar_border: 'avatar_border_gold'
        },
        description: 'Подложка Клевер + Фон статуса Изумруд + Обводка Золото'
    },
    {
        id: 'bundle_money',
        name: 'Денежный',
        price: 950, // 700+350+150=1200
        items: {
            background: 'bg_emoji_money',
            status_bg: 'status_bg_gold',
            avatar_border: 'avatar_border_gold'
        },
        description: 'Подложка Доллары + Фон статуса Золото + Обводка Золото'
    },
    {
        id: 'bundle_ghost',
        name: 'Призрачный',
        price: 850, // 600+350+150=1100
        items: {
            background: 'bg_emoji_ghost',
            status_bg: 'status_bg_silver',
            avatar_border: 'avatar_border_silver'
        },
        description: 'Подложка Приведения + Фон статуса Серебро + Обводка Серебро'
    }
];

// Набор недели (меняется автоматически)
function getWeeklyBundle() {
    const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    return BUNDLES_SHOP[weekNumber % BUNDLES_SHOP.length];
}

function getWeeklyBundlePrice() {
    const bundle = getWeeklyBundle();
    return Math.round(bundle.price * 0.7); // скидка 30%
}

const BOOST_SHOP = [
    { id: 'boost_5', name: 'x2 буст (5 работ)', desc: 'Удвоение опыта за 5 работ', price: 100, duration: 5 },
    { id: 'boost_10', name: 'x2 буст (10 работ)', desc: 'Удвоение опыта за 10 работ', price: 175, duration: 10 },
    { id: 'boost_15', name: 'x2 буст (15 работ)', desc: 'Удвоение опыта за 15 работ', price: 250, duration: 15 },
    { id: 'boost_30', name: 'x2 буст (30 работ)', desc: 'Удвоение опыта за 30 работ', price: 400, duration: 30 }
];

function switchShopTab(tab) {
    currentShopTab = tab;
    document.querySelectorAll('.shop-tab').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) btn.classList.add('active');
    });
    document.getElementById('shop-statuses').style.display = tab === 'statuses' ? 'block' : 'none';
    document.getElementById('shop-skips').style.display = tab === 'skips' ? 'block' : 'none';
    document.getElementById('shop-boosts').style.display = tab === 'boosts' ? 'block' : 'none';
    document.getElementById('shop-bundles').style.display = tab === 'bundles' ? 'block' : 'none';
    document.getElementById('shop-backgrounds').style.display = tab === 'backgrounds' ? 'block' : 'none';
    document.getElementById('shop-status_bg').style.display = tab === 'status_bg' ? 'block' : 'none';
    document.getElementById('shop-avatar_border').style.display = tab === 'avatar_border' ? 'block' : 'none';
    if (tab === 'statuses') renderStatusShop();
    if (tab === 'skips') renderSkipShop();
    if (tab === 'boosts') renderBoostShop();
    if (tab === 'bundles') renderBundlesShop();
    if (tab === 'backgrounds') renderBackgroundsShop();
    if (tab === 'status_bg') renderStatusBgShop();
    if (tab === 'avatar_border') renderAvatarBorderShop();
}
   function renderBundlesShop() {
    const weeklyContainer = document.getElementById('weeklyBundleContainer');
    const weeklyBundle = getWeeklyBundle();
    const weeklyPrice = getWeeklyBundlePrice();
    const originalPrice = weeklyBundle.price;
    
    weeklyContainer.innerHTML = `
        <div style="background: linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,149,0,0.05)); border: 2px solid gold; border-radius: 16px; padding: 15px; text-align: center; margin-bottom: 15px; box-sizing: border-box; max-width: 100%;">
            <div style="font-size: 12px; color: gold; font-weight: 700; margin-bottom: 5px;">🔥 НАБОР НЕДЕЛИ (-30%)</div>
            <div style="font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 5px;">${weeklyBundle.name}</div>
            <div style="font-size: 12px; color: var(--text-gray); margin-bottom: 10px;">${weeklyBundle.description}</div>
            <div style="font-size: 20px; font-weight: 900; color: var(--accent); margin-bottom: 10px;">
                <span style="text-decoration: line-through; color: var(--text-gray); font-size: 14px;">${originalPrice}</span>
                ${weeklyPrice} <i class="fas fa-book-open gold-book"></i>
            </div>
            <div id="weeklyBundleButtons"></div>
        </div>
    `;
    
    fetch(`${SERVER_URL}/api/stats?user_id=${userId}`)
        .then(r => r.json())
        .then(stats => {
            const ownedBundles = stats.owned_bundles || [];
            const isWeeklyOwned = ownedBundles.includes(weeklyBundle.id);
            
            const buttonsDiv = document.getElementById('weeklyBundleButtons');
            if (buttonsDiv) {
                if (isWeeklyOwned) {
                    buttonsDiv.innerHTML = '<div style="color:green;font-size:14px;font-weight:600;">✅ Набор куплен</div>';
                } else {
                    const canBuy = user.balance >= weeklyPrice;
                    buttonsDiv.innerHTML = `
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <button class="shop-item-btn" onclick="buyBundle('${weeklyBundle.id}', ${weeklyPrice})" ${!canBuy ? 'disabled' : ''} style="width: 100%; background: gold; color: #333; font-weight: 700; padding: 12px;">
                                🎁 Купить
                            </button>
                            <button class="shop-item-btn" onclick="openGiftModal('${weeklyBundle.id}', ${weeklyPrice})" ${!canBuy ? 'disabled' : ''} style="width: 100%; background: color-mix(in srgb, var(--accent) 70%, transparent); color: white; font-weight: 600; padding: 12px;">
                                🎀 Подарить
                            </button>
                        </div>
                    `;
                }
            }
            
            const container = document.getElementById('bundlesShopGrid');
            container.innerHTML = '';
            
            BUNDLES_SHOP.forEach(bundle => {
                const isWeekly = bundle.id === weeklyBundle.id;
                const price = isWeekly ? weeklyPrice : bundle.price;
                const isOwned = ownedBundles.includes(bundle.id);
                const canBuy = !isOwned && user.balance >= price;
                
                container.innerHTML += `
                    <div class="shop-item-card" style="${isWeekly ? 'border: 2px solid gold;' : ''} box-sizing: border-box; max-width: 100%;">
                        <div style="font-size: 32px; margin-bottom: 8px;">🎁</div>
                        <div class="shop-item-title">${bundle.name}</div>
                        <div class="shop-item-desc">${bundle.description}</div>
                        <div class="shop-item-price">
                            ${isWeekly ? `<span style="text-decoration: line-through; color: var(--text-gray); font-size: 14px;">${bundle.price}</span> ` : ''}
                            ${price} <i class="fas fa-book-open gold-book"></i>
                        </div>
                        ${isOwned ? '<div style="color:green;font-size:14px;font-weight:600;">✅ Куплен</div>' : `
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <button class="shop-item-btn" onclick="buyBundle('${bundle.id}', ${price})" ${!canBuy ? 'disabled' : ''} style="width: 100%; padding: 12px;">
                                    ${canBuy ? '🎁 Купить' : '❌ Недостаточно'}
                                </button>
                                <button class="shop-item-btn" onclick="openGiftModal('${bundle.id}', ${price})" ${!canBuy ? 'disabled' : ''} style="width: 100%; background: color-mix(in srgb, var(--accent) 70%, transparent); color: white; font-weight: 600; padding: 12px;">
                                    🎀 Подарить
                                </button>
                            </div>
                        `}
                    </div>
                `;
            });
        });
}
async function buyBundle(bundleId, price) {
    const bundle = BUNDLES_SHOP.find(b => b.id === bundleId);
    if (!bundle) return;
    
    // Проверяем, не куплен ли уже набор
    try {
        const statsRes = await fetch(`${SERVER_URL}/api/stats?user_id=${userId}`);
        const stats = await statsRes.json();
        const ownedBundles = stats.owned_bundles || [];
        
        if (ownedBundles.includes(bundleId)) {
            if (tg) tg.showAlert('✅ Этот набор уже куплен!');
            return;
        }
    } catch(e) {}
    
    if (user.balance < price) return tg.showAlert(`❌ Нужно ${price} ашетиков`);
    if (!confirm(`Купить набор «${bundle.name}» за ${price} ашетиков?`)) return;
    
    try {
        let r = await fetch(`${SERVER_URL}/api/add_balance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, amount: -price, reason: `Покупка набора "${bundle.name}"` })
        });
        let res = await r.json();
        
        if (res.status === 'ok') {
            const bgItem = BACKGROUNDS_SHOP.find(b => b.id === bundle.items.background);
            if (bgItem) {
                await fetch(`${SERVER_URL}/api/save_background`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId, background: bgItem.css, background_id: bgItem.id })
                });
                applySponsorBackground(bgItem.css, bgItem.id);
            }
            
            const statusBgItem = STATUS_BG_SHOP.find(b => b.id === bundle.items.status_bg);
            if (statusBgItem) {
                await fetch(`${SERVER_URL}/api/save_status_background`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId, background: statusBgItem.css, background_id: statusBgItem.id })
                });
                applyStatusBackground(statusBgItem.css);
            }
            
            const borderItem = AVATAR_BORDER_SHOP.find(b => b.id === bundle.items.avatar_border);
            if (borderItem) {
                await fetch(`${SERVER_URL}/api/save_avatar_border`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId, border: borderItem.css, border_id: borderItem.id })
                });
                applyAvatarBorder(borderItem.css);
            }
            
            await fetch(`${SERVER_URL}/api/save_bundle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, bundle_id: bundleId })
            });
            
            user.balance = res.new_balance;
            saveUserData();
            updateUI();
            renderBundlesShop();
            renderBackgroundsShop();
            renderStatusBgShop();
            renderAvatarBorderShop();
            tg.showAlert(`✅ Набор «${bundle.name}» применён!`);
        }
    } catch(e) {
        tg.showAlert('❌ Ошибка');
    }
}
       function renderStatusBgShop() {
    const container = document.getElementById('statusBgShopGrid');
    if (!container) return;
    container.innerHTML = '';
    
    fetch(`${SERVER_URL}/api/stats?user_id=${userId}`)
        .then(r => r.json())
        .then(stats => {
            const currentBgId = stats.status_background_id || '';
            const ownedStatusBgs = stats.owned_status_backgrounds || [];
            
            STATUS_BG_SHOP.forEach(bg => {
                const isActive = (currentBgId === bg.id);
                const isOwned = ownedStatusBgs.includes(bg.id);
                const canBuy = !isOwned && user.balance >= bg.price;
                
                container.innerHTML += `
                    <div class="shop-item-card ${isActive ? 'owned' : ''}">
                        <div style="width: 100%; height: 60px; border-radius: 12px; margin-bottom: 10px; ${bg.css}"></div>
                        <div class="shop-item-title">${bg.name}</div>
                        <div class="shop-item-price">${bg.price} <i class="fas fa-book-open gold-book"></i></div>
                        ${isActive ? '<div style="color:green;font-size:12px;">✅ Активен</div>' : 
                            isOwned ? `<button class="shop-item-btn" onclick="activateStatusBg('${bg.id}')" style="background: var(--status-green);">✅ Выбрать</button>` :
                            `<button class="shop-item-btn" onclick="buyStatusBg('${bg.id}', ${bg.price})" ${!canBuy ? 'disabled' : ''}>${canBuy ? '🎨 Купить' : '❌ Недостаточно'}</button>`}
                    </div>
                `;
            });
        });
}
        function getAccentHex() {
    const style = getComputedStyle(document.documentElement);
    const accent = style.getPropertyValue('--accent').trim();
    return accent.replace('#', '');
}
function applySponsorBackground(css, bgId) {
    const profileBlock = document.querySelector('.profile-header-block');
    if (!profileBlock) return;
    
    const bgItem = BACKGROUNDS_SHOP.find(b => b.id === bgId);
    const textColor = bgItem ? bgItem.textColor : null;
    
    let fullCss = css;
    if (bgItem && bgItem.bgPosition) {
        fullCss += ' background-position: ' + bgItem.bgPosition + ';';
    }
    
    if (fullCss) {
        profileBlock.style.cssText = fullCss + ' margin: 15px; padding: 20px; border-radius: 24px; display: flex; align-items: center; gap: 20px;';
    }
    
    function forceLevelColor(color) {
        const levelEl = document.getElementById('userLevelDisplay');
        if (levelEl) {
            levelEl.style.setProperty('color', color, 'important');
            const allChildren = levelEl.querySelectorAll('*');
            allChildren.forEach(child => {
                child.style.setProperty('color', color, 'important');
            });
            const bars = levelEl.querySelectorAll('.progress-bar-fill');
            bars.forEach(b => { b.style.removeProperty('color'); });
        }
    }
    
    setTimeout(() => {
        const nameEl = document.getElementById('displayUsername');
        const statusBadge = document.getElementById('currentStatus');
        
        if (textColor === 'light') {
            if (nameEl) nameEl.style.setProperty('color', '#ffffff', 'important');
            if (statusBadge) {
                const hasStatusBg = statusBadge.style.background && 
                                   !statusBadge.style.background.includes('rgba(255,255,255,0.2)') &&
                                   statusBadge.style.background !== '';
                statusBadge.style.setProperty('color', '#ffffff', 'important');
                if (!hasStatusBg) {
                    statusBadge.style.setProperty('background', 'rgba(255,255,255,0.2)', 'important');
                    statusBadge.style.setProperty('border', 'none', 'important');
                }
            }
            forceLevelColor('#ffffff');
        } else if (textColor === 'dark') {
            if (nameEl) nameEl.style.setProperty('color', '#1c1c1e', 'important');
            if (statusBadge) {
                const hasStatusBg = statusBadge.style.background && 
                                   statusBadge.style.background !== '' &&
                                   !statusBadge.style.background.includes('rgba(0,0,0,0.08)');
                statusBadge.style.setProperty('color', '#1c1c1e', 'important');
                if (!hasStatusBg) {
                    statusBadge.style.setProperty('background', 'rgba(0,0,0,0.08)', 'important');
                    statusBadge.style.setProperty('border', 'none', 'important');
                }
            }
            forceLevelColor('#8e8e93');
        }
    }, 300);
    
    if (textColor) {
        setTimeout(() => {
            const color = textColor === 'light' ? '#ffffff' : '#8e8e93';
            const levelEl = document.getElementById('userLevelDisplay');
            if (levelEl) {
                levelEl.style.setProperty('color', color, 'important');
                const allChildren = levelEl.querySelectorAll('*');
                allChildren.forEach(child => {
                    child.style.setProperty('color', color, 'important');
                });
                const bars = levelEl.querySelectorAll('.progress-bar-fill');
                bars.forEach(b => { b.style.removeProperty('color'); });
            }
        }, 800);
    }
}
        function renderAvatarBorderShop() {
    const container = document.getElementById('avatarBorderShopGrid');
    if (!container) return;
    container.innerHTML = '';
    
    fetch(`${SERVER_URL}/api/stats?user_id=${userId}`)
        .then(r => r.json())
        .then(stats => {
            const currentBorderId = stats.avatar_border_id || '';
            const ownedBorders = stats.owned_borders || [];
            
            AVATAR_BORDER_SHOP.forEach(border => {
                const isActive = (currentBorderId === border.id);
                const isOwned = ownedBorders.includes(border.id);
                const canBuy = !isOwned && user.balance >= border.price;
                
                container.innerHTML += `
                    <div class="shop-item-card ${isActive ? 'owned' : ''}">
                        <div style="width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 10px; ${border.css} background: var(--bg); display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-user" style="font-size: 24px; color: var(--text-gray);"></i>
                        </div>
                        <div class="shop-item-title">${border.name}</div>
                        <div class="shop-item-price">${border.price} <i class="fas fa-book-open gold-book"></i></div>
                        ${isActive ? '<div style="color:green;font-size:12px;">✅ Активна</div>' : 
                            isOwned ? `<button class="shop-item-btn" onclick="activateAvatarBorder('${border.id}')" style="background: var(--status-green);">✅ Выбрать</button>` :
                            `<button class="shop-item-btn" onclick="buyAvatarBorder('${border.id}', ${border.price})" ${!canBuy ? 'disabled' : ''}>${canBuy ? '🎨 Купить' : '❌ Недостаточно'}</button>`}
                    </div>
                `;
            });
        });
}

async function buyAvatarBorder(id, price) {
    const border = AVATAR_BORDER_SHOP.find(b => b.id === id);
    if (!border) return;
    
    try {
        const statsRes = await fetch(`${SERVER_URL}/api/stats?user_id=${userId}`);
        const stats = await statsRes.json();
        const ownedBorders = stats.owned_borders || [];
        
        if (ownedBorders.includes(border.id)) {
            if (tg) tg.showAlert('✅ Эта обводка уже куплена!');
            return;
        }
    } catch(e) {}
    
    if (user.balance < price) return tg.showAlert(`❌ Нужно ${price} ашетиков`);
    if (!confirm(`Купить обводку аватара «${border.name}» за ${price} ашетиков?`)) return;
    
    try {
        let r = await fetch(`${SERVER_URL}/api/add_balance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, amount: -price, reason: `Покупка обводки аватара "${border.name}"` })
        });
        let res = await r.json();
        
        if (res.status === 'ok') {
            await fetch(`${SERVER_URL}/api/save_avatar_border`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, border: border.css, border_id: border.id })
            });
            
            user.balance = res.new_balance;
            saveUserData();
            updateUI();
            renderAvatarBorderShop();
            applyAvatarBorder(border.css);
            tg.showAlert(`✅ Обводка аватара «${border.name}» применена!`);
        }
    } catch(e) {
        tg.showAlert('❌ Ошибка');
    }
}

function applyAvatarBorder(css) {
    const avatarWrapper = document.querySelector('.avatar-wrapper');
    if (!avatarWrapper) return;
    
    if (css) {
        avatarWrapper.style.cssText = css.replace('border:', 'border:') + ' !important;' + ' width: 90px; height: 90px; border-radius: 50%; padding: 3px; background: var(--bg); position: relative; flex-shrink: 0; cursor: pointer;';
    } else {
        // Восстанавливаем стандартную рамку
        avatarWrapper.style.cssText = 'width: 90px; height: 90px; border-radius: 50%; border: 3px solid var(--accent) !important; padding: 3px; background: var(--bg); position: relative; flex-shrink: 0; cursor: pointer;';
    }
}
async function buyStatusBg(id, price) {
    const bg = STATUS_BG_SHOP.find(b => b.id === id);
    if (!bg) return;
    
    try {
        const statsRes = await fetch(`${SERVER_URL}/api/stats?user_id=${userId}`);
        const stats = await statsRes.json();
        const ownedStatusBgs = stats.owned_status_backgrounds || [];
        
        if (ownedStatusBgs.includes(bg.id)) {
            if (tg) tg.showAlert('✅ Этот фон статуса уже куплен!');
            return;
        }
    } catch(e) {}
    
    if (user.balance < price) return tg.showAlert(`❌ Нужно ${price} ашетиков`);
    if (!confirm(`Купить фон статуса «${bg.name}» за ${price} ашетиков?`)) return;
    
    try {
        let r = await fetch(`${SERVER_URL}/api/add_balance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, amount: -price, reason: `Покупка фона статуса "${bg.name}"` })
        });
        let res = await r.json();
        
        if (res.status === 'ok') {
            await fetch(`${SERVER_URL}/api/save_status_background`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, background: bg.css, background_id: bg.id })
            });
            
            user.balance = res.new_balance;
            saveUserData();
            updateUI();
            renderStatusBgShop();
            applyStatusBackground(bg.css);
            tg.showAlert(`✅ Фон статуса «${bg.name}» применён!`);
        }
    } catch(e) {
        tg.showAlert('❌ Ошибка');
    }
}
async function activateStatusBg(id) {
    const bg = STATUS_BG_SHOP.find(b => b.id === id);
    if (!bg) return;
    
    try {
        await fetch(`${SERVER_URL}/api/save_status_background`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, background: bg.css, background_id: bg.id })
        });
        
        applyStatusBackground(bg.css);
        renderStatusBgShop();
        if (typeof renderPurchasedItems === 'function') renderPurchasedItems();
        tg.showAlert(`✅ Фон статуса «${bg.name}» активирован!`);
    } catch(e) {
        tg.showAlert('❌ Ошибка');
    }
}
        async function activateAvatarBorder(id) {
    const border = AVATAR_BORDER_SHOP.find(b => b.id === id);
    if (!border) return;
    
    try {
        await fetch(`${SERVER_URL}/api/save_avatar_border`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, border: border.css, border_id: border.id })
        });
        
        applyAvatarBorder(border.css);
        renderAvatarBorderShop();
        if (typeof renderPurchasedItems === 'function') renderPurchasedItems();
        tg.showAlert(`✅ Обводка «${border.name}» активирована!`);
    } catch(e) {
        tg.showAlert('❌ Ошибка');
    }
}
function applyStatusBackground(css) {
    const statusBadge = document.getElementById('currentStatus');
    if (statusBadge && css) {
        statusBadge.style.cssText = css + ' padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; color: var(--text);';
    }
}
function renderBackgroundsShop() {
    const container = document.getElementById('backgroundsShopGrid');
    if (!container) return;
    container.innerHTML = '';
    
    fetch(`${SERVER_URL}/api/stats?user_id=${userId}`)
        .then(r => r.json())
        .then(stats => {
            const currentBgId = stats.sponsor_background_id || '';
            const ownedBackgrounds = stats.owned_backgrounds || [];
            
            BACKGROUNDS_SHOP.forEach(bg => {
                const isActive = (currentBgId === bg.id);
                const isOwned = ownedBackgrounds.includes(bg.id);
                const canBuy = !isOwned && user.balance >= bg.price;
                
                container.innerHTML += `
                    <div class="shop-item-card ${isActive ? 'owned' : ''}">
                        <div style="width: 100%; height: 60px; border-radius: 12px; margin-bottom: 10px; ${bg.preview || bg.css}"></div>
                        <div class="shop-item-title">${bg.name}</div>
                        <div class="shop-item-price">${bg.price} <i class="fas fa-book-open gold-book"></i></div>
                        ${isActive ? '<div style="color:green;font-size:12px;">✅ Активна</div>' : 
                            isOwned ? `<button class="shop-item-btn" onclick="activateBackground('${bg.id}')" style="background: var(--status-green);">✅ Выбрать</button>` :
                            `<button class="shop-item-btn" onclick="buyBackground('${bg.id}', ${bg.price})" ${!canBuy ? 'disabled' : ''}>${canBuy ? '🎨 Купить' : '❌ Недостаточно'}</button>`}
                    </div>
                `;
            });
        });
}
async function activateBackground(id) {
    const bg = BACKGROUNDS_SHOP.find(b => b.id === id);
    if (!bg) return;
    
    try {
        await fetch(`${SERVER_URL}/api/save_background`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, background: bg.css, background_id: bg.id })
        });
        
        let finalCss = bg.css;
        if (bg.id.startsWith('bg_emoji_')) {
            const freshBg = BACKGROUNDS_SHOP.find(b => b.id === bg.id);
            if (freshBg) finalCss = freshBg.css;
        }
        applySponsorBackground(finalCss, bg.id);
        renderBackgroundsShop();
        
        tg.showAlert(`✅ Подложка «${bg.name}» активирована!`);
    } catch(e) {
        tg.showAlert('❌ Ошибка');
    }
}
async function buyBackground(id, price) {
    const bg = BACKGROUNDS_SHOP.find(b => b.id === id);
    if (!bg) return;
    
    try {
        const statsRes = await fetch(`${SERVER_URL}/api/stats?user_id=${userId}`);
        const stats = await statsRes.json();
        const currentBgId = stats.sponsor_background_id || '';
        
        if (currentBgId === bg.id) {
            if (tg) tg.showAlert('✅ Эта подложка уже активна!');
            return;
        }
    } catch(e) {}
    
    if (user.balance < price) return tg.showAlert(`❌ Нужно ${price} ашетиков`);
    if (!confirm(`Купить подложку «${bg.name}» за ${price} ашетиков?`)) return;
    
    try {
        let r = await fetch(`${SERVER_URL}/api/add_balance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, amount: -price, reason: `Покупка подложки "${bg.name}"` })
        });
        let res = await r.json();
        
        if (res.status === 'ok') {
            await fetch(`${SERVER_URL}/api/save_background`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, background: bg.css, background_id: bg.id })
            });
            
            user.balance = res.new_balance;
            saveUserData();
            updateUI();
            
            // Пересоздаём CSS для эмодзи-подложек
            let finalCss = bg.css;
            if (bg.id.startsWith('bg_emoji_')) {
                const freshBg = BACKGROUNDS_SHOP.find(b => b.id === bg.id);
                if (freshBg) finalCss = freshBg.css;
            }
            applySponsorBackground(finalCss, bg.id);
            renderBackgroundsShop();
            
            tg.showAlert(`✅ Подложка «${bg.name}» применена!`);
        }
    } catch(e) {
        tg.showAlert('❌ Ошибка');
    }
}
function renderStatusShop() {
    const container = document.getElementById('statusShopGrid');
    if (!container) return;
    container.innerHTML = '';
    STATUS_SHOP.forEach(s => {
        const owned = user.unlockedStatuses && user.unlockedStatuses.includes(s.name);
        const canBuy = !owned && user.balance >= s.price;
        container.innerHTML += `
            <div class="shop-item-card ${owned ? 'owned' : ''}">
                <div class="shop-item-title">${s.name}</div>
                <div class="shop-item-price">${s.price} <i class="fas fa-book-open gold-book"></i></div>
                ${owned ? '<div style="color:green;font-size:12px;">✅ Уже открыт</div>' : 
                    `<button class="shop-item-btn" onclick="buyStatus('${s.id}', '${s.name}', ${s.price})" ${!canBuy ? 'disabled' : ''}>${canBuy ? '🔓 Открыть' : '❌ Недостаточно'}</button>`}
            </div>
        `;
    });
}

function renderSkipShop() {
    const container = document.getElementById('skipShopGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    SKIP_SHOP.forEach(s => {
        const canBuy = user.balance >= s.price;
        container.innerHTML += `
            <div class="shop-item-card">
                <div class="shop-item-title">🎫 ${s.name}</div>
                <div class="shop-item-desc">${s.desc}</div>
                <div class="shop-item-price">${s.price} <i class="fas fa-book-open gold-book"></i></div>
                <button class="shop-item-btn" onclick="buySkip(${s.amount}, ${s.price})" ${!canBuy ? 'disabled' : ''}>${canBuy ? '🎫 Купить скип' : '❌ Недостаточно'}</button>
            </div>
        `;
    });
}

function renderBoostShop() {
    const container = document.getElementById('boostShopGrid');
    if (!container) return;
    container.innerHTML = '';
    if (userBoosts.active && userBoosts.remainingWorks > 0) {
        container.innerHTML += `
            <div class="shop-item-card" style="border-color:var(--accent);background:rgba(255,149,0,0.1);">
                <div class="shop-item-title">🔥 Активный буст x2</div>
                <div class="shop-item-desc">Осталось работ: ${userBoosts.remainingWorks}</div>
            </div>
        `;
    }
    BOOST_SHOP.forEach(b => {
        const canBuy = user.balance >= b.price;
        container.innerHTML += `
            <div class="shop-item-card">
                <div class="shop-item-title">${b.name}</div>
                <div class="shop-item-desc">${b.desc}</div>
                <div class="shop-item-price">${b.price} <i class="fas fa-book-open gold-book"></i></div>
                <button class="shop-item-btn" onclick="buyBoost(${b.duration}, ${b.price})" ${!canBuy ? 'disabled' : ''}>${canBuy ? '⚡ Активировать' : '❌ Недостаточно'}</button>
            </div>
        `;
    });
}

async function buyStatus(id, name, price) {
    if (user.balance < price) return tg.showAlert(`❌ Нужно ${price} ашетиков`);
    if (!confirm(`Купить статус "${name}" за ${price} ашетиков?`)) return;
    try {
        let r = await fetch(`${SERVER_URL}/api/add_balance`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, amount: -price, reason: `Покупка статуса "${name}"` }) });
        let res = await r.json();
        if (res.status === 'ok') {
            await fetch(`${SERVER_URL}/api/sync_status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, status: name, action: 'unlock' }) });
            user.balance = res.new_balance;
            if (!user.unlockedStatuses) user.unlockedStatuses = [];
            if (!user.unlockedStatuses.includes(name)) user.unlockedStatuses.push(name);
            saveUserData(); updateUI(); renderStatusShop();
            tg.showAlert(`✅ Статус "${name}" приобретён!`);
        }
    } catch(e) { tg.showAlert('❌ Ошибка'); }
}

// Покупка пропуска
async function buySkip(amount, price) {
    if (user.balance < price) {
        alert(`❌ Недостаточно ашетиков! Нужно ${price}`);
        return;
    }
    if (!confirm(`Купить пропуск на ${amount} очк(а) за ${price} ашетиков?`)) return;
    
    try {
        // Списываем ашетики
        let r = await fetch(`${SERVER_URL}/api/add_balance`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ user_id: userId, amount: -price, reason: `Покупка пропуска на ${amount} очков` }) 
        });
        let res = await r.json();
        
        if (res.status === 'ok') {
            // Обновляем баланс
            user.balance = res.new_balance;
            
            // ✅ Отправляем на сервер новые скипы
            let skipRes = await fetch(`${SERVER_URL}/api/add_skips`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, amount: amount })
            });
            let skipData = await skipRes.json();
            
            // ✅ Обновляем ТОЛЬКО из ответа сервера
            if (skipData.status === 'ok' && typeof skipData.skips !== 'undefined') {
                userSkips = skipData.skips;
            }
            
            // Обновляем отображение
            updateSkipDisplay();
            saveUserData(); 
            updateUI();
            
            // ✅ Обновляем магазин если открыт
            if (typeof renderSkipShop === 'function') renderSkipShop();
            
            alert(`✅ Куплено пропусков: ${amount}! Всего: ${userSkips}`);
        } else {
            alert('❌ Ошибка при покупке');
        }
    } catch(e) { 
        console.error(e);
        alert('❌ Ошибка при покупке');
    }
}

// Покупка буста
async function buyBoost(duration, price) {
    if (user.balance < price) {
        alert(`❌ Недостаточно ашетиков! Нужно ${price}`);
        return;
    }
    if (!confirm(`Активировать x2 буст на ${duration} работ за ${price} ашетиков?`)) return;
    
    try {
        let r = await fetch(`${SERVER_URL}/api/buy_boost`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ user_id: userId, duration: duration, price: price }) 
        });
        let res = await r.json();
        if (res.status === 'ok') {
            user.balance = res.new_balance;
            userBoosts = res.boost;
            saveUserData();
            updateUI();
            if (typeof renderBoostShop === 'function') renderBoostShop();
            if (typeof updateBoostDisplay === 'function') updateBoostDisplay();
            alert(`✅ x2 буст активирован на ${duration} работ!`);
        } else {
            alert('❌ Ошибка: ' + (res.message || 'Неизвестная ошибка'));
        }
    } catch(e) { 
        console.error(e);
        alert('❌ Ошибка при покупке');
    }
}
        async function loadBoostStatus() {
    try {
        const response = await fetch(`${SERVER_URL}/api/get_boost_status?user_id=${userId}`);
        const boost = await response.json();
        userBoosts = boost;
        if (typeof updateBoostDisplay === 'function') updateBoostDisplay();
    } catch (error) {
        console.error('Ошибка загрузки буста:', error);
    }
}
     async function useSkipForTask(branchKey, levelIndex, subtaskIndex, currentProgress, required) {
    // Проверка: Шок контент нельзя пропускать
    if (branchKey === 'shock') {
        alert('⚠️ Задания ветки "Шок контент" нельзя пропускать!');
        return false;
    }
    
    // Проверка наличия пропусков
    if (userSkips <= 0) {
        alert('❌ Нет пропусков! Купите в магазине.');
        return false;
    }
    
    // Проверка что задание ещё не выполнено
    if (currentProgress >= required) {
        alert('✅ Это задание уже выполнено!');
        return false;
    }
    
    if (!confirm(`Использовать пропуск? (1 пропуск = +1 очко). Осталось пропусков: ${userSkips}`)) {
        return false;
    }
    
    try {
        // Отправляем запрос на добавление прогресса (сервер сам спишет скип)
        const response = await fetch(`${SERVER_URL}/api/add_progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                branch_key: branchKey,
                level_index: levelIndex,
                subtask_index: subtaskIndex,
                amount: 1
            })
        });
        
        const result = await response.json();
        console.log('Ответ add_progress:', result);
        
        if (result.status === 'ok') {
            // ✅ Сервер сам списал скип и вернул skips_left
            userSkips = result.skips_left;
            updateSkipDisplay();
            
            alert(`✅ Задание пропущено! +1 очко. Осталось пропусков: ${userSkips}`);
            
            // Обновляем прогресс
            await refreshUserProgress();
            renderBranchTasks();
            
            return true;
        } else {
            alert('❌ Ошибка: ' + (result.message || 'Неизвестная ошибка'));
            return false;
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('❌ Ошибка при пропуске задания');
        return false;
    }
}
        function openGiftModal(bundleId, price) {
    const bundle = BUNDLES_SHOP.find(b => b.id === bundleId);
    if (!bundle) return;
    
    currentGiftBundle = bundle;
    currentGiftPrice = price;
    selectedGiftUser = null;
    
    document.getElementById('giftBundleName').innerText = `Набор «${bundle.name}» за ${price} ашетиков`;
    document.getElementById('giftUsernameInput').value = '';
    document.getElementById('giftSearchResults').innerHTML = '';
    document.getElementById('giftConfirmBtn').disabled = true;
    document.getElementById('giftModal').style.display = 'flex';
}

function closeGiftModal() {
    document.getElementById('giftModal').style.display = 'none';
    currentGiftBundle = null;
    currentGiftPrice = null;
    selectedGiftUser = null;
}

let giftSearchTimeout = null;

function searchUserForGift() {
    const input = document.getElementById('giftUsernameInput');
    const query = input.value.trim();
    const resultsDiv = document.getElementById('giftSearchResults');
    const confirmBtn = document.getElementById('giftConfirmBtn');
    
    if (giftSearchTimeout) clearTimeout(giftSearchTimeout);
    
    selectedGiftUser = null;
    confirmBtn.disabled = true;
    
    if (query.length < 2) {
        resultsDiv.innerHTML = '';
        return;
    }
    
    resultsDiv.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Поиск...</div>';
    
    giftSearchTimeout = setTimeout(async () => {
        try {
            const response = await fetch(`${SERVER_URL}/api/search_users?query=${encodeURIComponent(query)}`);
            const users = await response.json();
            
            if (users.length === 0) {
                resultsDiv.innerHTML = '<div class="no-results" style="padding: 10px;">😕 Ничего не найдено</div>';
                return;
            }
            
            let html = '';
            users.forEach(user => {
                const avatarUrl = user.avatar || 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av1.png';
                
                html += `
                    <div class="user-search-card" onclick="selectGiftUser('${user.user_id}', '${user.username.replace(/'/g, "\\'")}', this)" style="cursor: pointer; padding: 10px;">
                        <img src="${avatarUrl}" class="user-search-avatar" onerror="this.src='https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av1.png'">
                        <div class="user-search-info">
                            <div class="user-search-name">${user.name}</div>
                            <div class="user-search-username">${user.username}</div>
                        </div>
                    </div>
                `;
            });
            
            resultsDiv.innerHTML = html;
        } catch (error) {
            resultsDiv.innerHTML = '<div class="no-results">❌ Ошибка поиска</div>';
        }
    }, 500);
}
function selectGiftUser(userId, username, element) {
    selectedGiftUser = { user_id: userId, username: username };
    
    document.querySelectorAll('#giftSearchResults .user-search-card').forEach(card => {
        card.style.background = '';
        card.style.border = '';
    });
    element.style.background = 'rgba(255,149,0,0.1)';
    element.style.border = '1px solid var(--accent)';
    
    document.getElementById('giftConfirmBtn').disabled = false;
}

async function confirmGift() {
    if (!selectedGiftUser || !currentGiftBundle || !currentGiftPrice) return;
    
    if (user.balance < currentGiftPrice) {
        tg.showAlert(`❌ Недостаточно ашетиков! Нужно ${currentGiftPrice}`);
        return;
    }
    
    if (!confirm(`Подарить набор «${currentGiftBundle.name}» пользователю ${selectedGiftUser.username} за ${currentGiftPrice} ашетиков?`)) return;
    
    try {
        // Списываем ашетики у дарителя
        let r = await fetch(`${SERVER_URL}/api/add_balance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, amount: -currentGiftPrice, reason: `Подарок набора "${currentGiftBundle.name}" для ${selectedGiftUser.username}` })
        });
        let res = await r.json();
        
        if (res.status === 'ok') {
            // Активируем набор получателю
            const bundle = currentGiftBundle;
            
            // Подложка
            const bgItem = BACKGROUNDS_SHOP.find(b => b.id === bundle.items.background);
            if (bgItem) {
                await fetch(`${SERVER_URL}/api/save_background`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: selectedGiftUser.user_id, background: bgItem.css, background_id: bgItem.id })
                });
            }
            
            // Фон статуса
            const statusBgItem = STATUS_BG_SHOP.find(b => b.id === bundle.items.status_bg);
            if (statusBgItem) {
                await fetch(`${SERVER_URL}/api/save_status_background`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: selectedGiftUser.user_id, background: statusBgItem.css, background_id: statusBgItem.id })
                });
            }
            
            // Обводка
            const borderItem = AVATAR_BORDER_SHOP.find(b => b.id === bundle.items.avatar_border);
            if (borderItem) {
                await fetch(`${SERVER_URL}/api/save_avatar_border`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: selectedGiftUser.user_id, border: borderItem.css, border_id: borderItem.id })
                });
            }
            
            // Сохраняем набор получателю
            await fetch(`${SERVER_URL}/api/save_bundle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: selectedGiftUser.user_id, bundle_id: bundle.id })
            });
            
            // Уведомляем получателя
            try {
                await fetch(`${SERVER_URL}/api/notify_gift`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        from_user_id: userId, 
                        to_user_id: selectedGiftUser.user_id, 
                        bundle_name: bundle.name,
                        from_username: user.name || 'Пользователь'
                    })
                });
            } catch(e) {}
            
            user.balance = res.new_balance;
            saveUserData();
            updateUI();
            closeGiftModal();
            renderBundlesShop();
            tg.showAlert(`✅ Набор «${bundle.name}» подарен ${selectedGiftUser.username}!`);
        }
    } catch(e) {
        tg.showAlert('❌ Ошибка');
    }
}
// Функция добавления кнопки пропуска в карточку задания
function addSkipButtonToTask(taskCard, branchKey, levelIndex) {
    // Не добавляем для Шок контент
    if (branchKey === 'shock') return;
    
    // Проверяем, есть ли уже кнопка
    if (taskCard.querySelector('.skip-task-btn')) return;
    
    const levelCard = taskCard.querySelector('.level-card');
    if (!levelCard) return;
    
    const existingBtn = levelCard.querySelector('.task-submit-btn');
    if (!existingBtn) return;
    
    const skipBtn = document.createElement('button');
    skipBtn.className = 'task-submit-btn skip-task-btn';
    skipBtn.style.cssText = 'background: #ff9800; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 8px;';
    skipBtn.innerHTML = '<i class="fas fa-skip-forward"></i> Пропустить (1 очко)';
    
    skipBtn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        let skips = parseInt(localStorage.getItem(`user_skips_${userId}`) || '0');
        if (skips <= 0) {
            alert('❌ Нет пропусков! Купите в магазине.');
            return;
        }
        
        if (confirm(`Использовать пропуск для этого задания? Осталось пропусков: ${skips}`)) {
            await addProgressWithoutPhoto(branchKey, levelIndex);
        }
    };
    
    existingBtn.parentNode.insertBefore(skipBtn, existingBtn.nextSibling);
} 

function loadUserBoosts() {
    let saved = localStorage.getItem(`user_boosts_${userId}`);
    if (saved) { try { userBoosts = JSON.parse(saved); } catch(e) {} }
}

function applyBoost(xp) {
    if (userBoosts.active && userBoosts.remainingWorks > 0) {
        userBoosts.remainingWorks--;
        if (userBoosts.remainingWorks === 0) userBoosts.active = false;
        localStorage.setItem(`user_boosts_${userId}`, JSON.stringify(userBoosts));
        return xp * 2;
    }
    return xp;
}

function canUseSkip(branchKey) {
    if (branchKey === 'shock') { alert('⚠️ Шок контент нельзя пропускать!'); return false; }
    let skips = parseInt(localStorage.getItem(`user_skips_${userId}`) || '0');
    if (skips <= 0) { alert('❌ Нет пропусков! Купите в магазине.'); return false; }
    if (confirm('Использовать пропуск?')) {
        localStorage.setItem(`user_skips_${userId}`, skips - 1);
        return true;
    }
    return false;
}

const originalToggleSection = toggleSection;
toggleSection = function(sectionId) {
    originalToggleSection(sectionId);
    if (sectionId === 'rewards-section') { loadUserBoosts(); renderStatusShop(); }
};
     
var teamPollingInterval = null;
var approvalPollingInterval = null;
var bossUpdateInterval = null;
var currentRenderCardNumber = null;
var currentBossLevel = 'mini'; 
      
// ==========================================
// D&D ПЕРЕМЕННЫЕ
// ==========================================
var bossUpdateInterval = null;
var dndMode = null;
var dndCharacter = null;
var dndCardHistory = [];
var dndApproved = false;
var dndIsRolling = false;
var dndSkipUsed = false; 
var pendingSkipCard = null;

       function getBossWorkRequired() {
    return dndMode === 'team' ? 4 : 2; // количество заданий
}
        function getBossPointsPerTask() {
    return 5; // очков за задание
}
        function getBossTotalPoints() {
    return getBossWorkRequired() * getBossPointsPerTask(); // 10 или 20
}
// ==========================================
// НАВИГАЦИЯ
// ==========================================

function toggleDnDEvent() {
    var content = document.getElementById('dndEventContent');
    var arrow = document.getElementById('dndEventArrow');
    if (content.style.display === 'block') {
        content.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    } else {
        content.style.display = 'block';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        checkDndPaymentStatus();
        // Всегда проверяем активные игры при открытии
        fetch(SERVER_URL + '/api/dnd/payment_status?user_id=' + userId)
            .then(r => r.json())
            .then(function(data) {
                if (data.is_paid) {
                    autoRestoreDndGame();
                }
            });
    }
}

function checkDndPaymentStatus() {
    fetch(SERVER_URL + '/api/dnd/payment_status?user_id=' + userId)
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok' && data.is_paid === true) {
                document.getElementById('dndPaySection').style.display = 'none';
                document.getElementById('dndMainMenu').style.display = 'block';
                document.getElementById('dndLobby').style.display = 'none';
                document.getElementById('dndGame').style.display = 'none';
                document.getElementById('dndSoloGame').style.display = 'none';
            } else {
                document.getElementById('dndPaySection').style.display = 'block';
                document.getElementById('dndMainMenu').style.display = 'none';
                document.getElementById('dndLobby').style.display = 'none';
                document.getElementById('dndGame').style.display = 'none';
                document.getElementById('dndSoloGame').style.display = 'none';
                
                // ✅ Принудительно скрываем меню ещё раз через 100ms
                setTimeout(function() {
                    document.getElementById('dndMainMenu').style.display = 'none';
                    document.getElementById('dndLobby').style.display = 'none';
                    document.getElementById('dndGame').style.display = 'none';
                    document.getElementById('dndSoloGame').style.display = 'none';
                }, 100);
            }
        });
}
function hideAllDndScreens() {
    var screens = ['dndLobby', 'dndGame', 'dndSoloGame'];
    for (var i = 0; i < screens.length; i++) {
        var el = document.getElementById(screens[i]);
        if (el) el.style.display = 'none';
    }
}

function openPaymentChat() {
    var username = 'SPB_Zakharin_Sergey';
    var message = encodeURIComponent('Здравствуйте! Хочу оплатить участие в D&D приключении (500 ₽).');
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openTelegramLink('https://t.me/' + username + '?text=' + message);
    } else {
        window.open('https://t.me/' + username + '?text=' + message, '_blank');
    }
}
var approvalPollingInterval = null;

function startApprovalPolling() {
    if (approvalPollingInterval) clearInterval(approvalPollingInterval);
    
    approvalPollingInterval = setInterval(function() {
        // Проверяем только если игра активна и задание НЕ одобрено
        if (!dndCharacter || dndApproved || dndCardHistory.length === 0) return;
        
        var currentCard = dndCardHistory[dndCardHistory.length - 1];
        if (currentCard === 0) return;
        
        fetch(SERVER_URL + '/api/dnd/get_progress?user_id=' + userId + '&character=' + dndCharacter)
            .then(r => r.json())
            .then(data => {
                if (data.status === 'ok' && data.progress) {
                    var completedCards = data.progress.completed_cards || [];
                    
                    if (completedCards.includes(currentCard) && !dndApproved) {
                        // Админ одобрил! Обновляем карту
                        dndApproved = true;
                        renderDndCard(currentCard);
                        console.log('✅ Админ одобрил карту ' + currentCard + '!');
                    }
                }
            });
    }, 5000); // проверка каждые 5 секунд
}

function stopApprovalPolling() {
    if (approvalPollingInterval) {
        clearInterval(approvalPollingInterval);
        approvalPollingInterval = null;
    }
}
function backToDndMenu() {
    // Если игра активна и не пройдена — не пускаем
    var finalBosses = [203, 204, 205, 206, 207, 208];
    var hasDefeatedBoss = finalBosses.some(function(boss) { return dndCardHistory.includes(boss); });
    
    if (dndCardHistory.length > 1 && !hasDefeatedBoss) {
        alert('⚠️ Сначала завершите приключение!');
        return;
    }
    
    // Останавливаем опрос команды
    if (teamPollingInterval) {
        clearInterval(teamPollingInterval);
        teamPollingInterval = null;
    }
    
    document.getElementById('dndMainMenu').style.display = 'block';
    hideAllDndScreens();
    dndMode = null;
    dndCharacter = null;
    dndCardHistory = [0];
    dndApproved = true;
}
function isGameInProgress() {
    return dndCardHistory.length > 1;
}

// ==========================================
// ЗАГРУЗКА/СОХРАНЕНИЕ ПРОГРЕССА
// ==========================================

function loadDndProgress() {
    if (!dndCharacter) { dndCardHistory = [0]; dndApproved = true; dndSkipUsed = false; return Promise.resolve(); }
    
    return fetch(SERVER_URL + '/api/dnd/get_progress?user_id=' + userId + '&character=' + dndCharacter)
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok' && data.progress) {
                dndCardHistory = data.progress.card_history || data.progress.completed_cards || [0];
                if (dndCardHistory.length === 0) dndCardHistory = [0];
                var lastCard = dndCardHistory[dndCardHistory.length - 1];
                var completedCards = data.progress.completed_cards || [];
                dndApproved = (lastCard === 0 || completedCards.includes(lastCard));
                dndSkipUsed = data.progress.skip_used || false;
            } else {
                dndCardHistory = [0];
                dndApproved = true;
                dndSkipUsed = false;
            }
        })
        .catch(function() {
            dndCardHistory = [0];
            dndApproved = true;
            dndSkipUsed = false;
        });
}
function saveDndProgress() {
    if (!dndCharacter || dndCardHistory.length === 0) return;
    fetch(SERVER_URL + '/api/dnd/update_progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: userId,
            character: dndCharacter,
            progress: { card_history: dndCardHistory, current_card: dndCardHistory[dndCardHistory.length - 1] || 0, timestamp: Date.now() }
        })
    }).catch(function() {});
}

// ==========================================
// ОТРИСОВКА КАРТ
// ==========================================

function getCardData(cardNumber) {
    if (dndCharacter === 'knight') return window.DND_CARDS?.knight?.[cardNumber];
    if (dndCharacter === 'mage') return window.DND_CARDS_MAGE?.mage?.[cardNumber];
    if (dndCharacter === 'archer') return window.DND_CARDS_ARCHER?.archer?.[cardNumber];
    if (dndCharacter === 'druid') return window.DND_CARDS_DRUID?.druid?.[cardNumber];
    if (dndCharacter === 'assassin') return window.DND_CARDS_ASSASSIN?.assassin?.[cardNumber];
    if (dndCharacter === 'bard') return window.DND_CARDS_BARD?.bard?.[cardNumber];
    return null;
}

function getCardContainer() {
    if (dndMode === 'solo') return document.getElementById('dndSoloCard');
    return document.getElementById('dndCard');
}

function renderDndCard(cardNumber) {
    currentRenderCardNumber = cardNumber;
    
    var card = getCardData(cardNumber);
    var container = getCardContainer();
    if (!container) return;
    if (!card) { container.innerHTML = '<p style="text-align:center;padding:20px;">❌ Карта #' + cardNumber + ' не найдена</p>'; return; }
    
    // ✅ Командная игра — блокируем кубик в конце уровней перед боссами
    if (dndMode === 'team' && dndApproved) {
        // Мини-босс: уровень 4, карты 40-100
        if (cardNumber >= 40 && cardNumber <= 100) {
            currentBossLevel = 'mini';
            showWaitingForTeam('mini');
            return;
        }
        // Финальный босс: уровень 9, карты 185-202
        if (cardNumber >= 185 && cardNumber <= 202) {
            currentBossLevel = 'final';
            showWaitingForTeam('final');
            return;
        }
    }
    
    if (card.isStart) { container.innerHTML = renderCardHTML(card, true, true); return; }
    
    var finalBosses = [203, 204, 205, 206, 207, 208];
    
    if (card.isFinal && dndApproved) {
        var winImage = dndMode === 'team' 
            ? 'https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/f2.png'
            : 'https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/f1.png';
        
        container.innerHTML = '<div class="branch-task-card"><div class="branch-header"><h3>🎉 Победа!</h3></div><div class="level-card" style="text-align:center;"><img src="' + winImage + '" style="width:100%;border-radius:12px;margin-bottom:15px;" onerror="this.style.display=\'none\'"><p style="font-size:18px;font-weight:700;color:var(--accent);">Ты победил ' + card.title + '!</p><p>Приключение пройдено!</p><p style="color:#ffd700;margin-top:10px;">🎫 Получен билет на розыгрыш призов D&D!</p><button class="task-submit-btn" onclick="resetDndProgress()" style="margin-top:15px;background:#ff9800;">📖 Завершить историю</button></div></div>';
        return;
    }
    
    container.innerHTML = renderCardHTML(card, dndApproved, false);
}


function submitBossWork(taskIndex) {
    currentBossTaskIndex = taskIndex || 0;
    var currentCard = dndCardHistory[dndCardHistory.length - 1];
    
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.onchange = function(event) {
        var files = Array.from(event.target.files);
        if (files.length === 0) return;
        window.tempPhotos = files;
        
        var formData = new FormData();
        formData.append('user', userId.toString());
        formData.append('character', dndCharacter);
        formData.append('card', currentCard.toString());
        formData.append('boss_work', 'true');
        formData.append('task_index', currentBossTaskIndex.toString());
        for (var i = 0; i < files.length; i++) formData.append('photos', files[i]);
        
        if (window.isUploading) return;
        window.isUploading = true;
        
        fetch(SERVER_URL + '/api/dnd/check_task', { method: 'POST', body: formData })
            .then(r => r.json())
            .then(function(result) {
                if (result && result.status === 'ok') {
                    renderDndCard(currentCard);
                    alert('✅ Работа отправлена! Ожидайте начисления очков.');
                }
            })
            .finally(function() { window.isUploading = false; window.tempPhotos = []; });
    };
    fileInput.click();
}
 function isTeamLeader() {
    var myTeamCard = document.getElementById('myTeamCard');
    if (!myTeamCard) return false;
    return myTeamCard.innerHTML.indexOf('Расформировать') !== -1;
}

function checkTeamBossReadiness(bossLevel) {
    currentBossLevel = bossLevel;
    
    fetch(SERVER_URL + '/api/dnd/team_boss_status?user_id=' + userId + '&boss_level=' + bossLevel)
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok') {
                if (data.all_ready) {
                    if (data.boss_assigned) {
                        dndCardHistory.push(data.boss_assigned);
                        dndApproved = false;
                        saveDndProgress();
                        renderDndCard(data.boss_assigned);
                    } else if (isTeamLeader()) {
                        showBossDiceButton(bossLevel);
                    } else {
                        showWaitingForLeader(bossLevel);
                    }
                } else {
                    showTeamReadinessStatus(data.members);
                }
            }
        });
}

function showTeamReadinessStatus(members) {
    var container = getCardContainer();
    var membersHtml = '';
    for (var i = 0; i < members.length; i++) {
        var m = members[i];
        membersHtml += '<div style="display:flex;align-items:center;gap:10px;padding:8px;margin-bottom:5px;background:var(--bg);border-radius:8px;"><span style="font-size:20px;">' + (m.ready ? '✅' : '⏳') + '</span><span style="flex:1;">' + escapeHtml(m.name) + '</span><span style="font-size:12px;color:var(--text-gray);">Карта ' + m.last_card + '</span></div>';
    }
    container.innerHTML = '<div class="branch-task-card"><div class="branch-header"><h3>⏳ Ожидание команды</h3></div><div class="level-card"><p style="margin-bottom:15px;">Все должны достичь уровня босса:</p>' + membersHtml + '<button class="task-submit-btn" onclick="checkTeamBossReadiness(\'' + currentBossLevel + '\')" style="margin-top:15px;">🔄 Проверить</button></div></div>';
}

function showWaitingForLeader(bossLevel) {
    var container = getCardContainer();
    container.innerHTML = '<div class="branch-task-card"><div class="branch-header"><h3>⏳ Ожидание лидера</h3></div><div class="level-card" style="text-align:center;"><p>Все готовы!</p><p style="color:var(--text-gray);">Лидер выбирает босса...</p><button class="task-submit-btn" onclick="checkTeamBossStatus()" style="margin-top:15px;">🔄 Проверить</button></div></div>';
}

function checkTeamBossStatus() {
    fetch(SERVER_URL + '/api/dnd/team_boss_status?user_id=' + userId + '&boss_level=' + currentBossLevel)
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok' && data.boss_assigned) {
                dndCardHistory.push(data.boss_assigned);
                dndApproved = false;
                saveDndProgress();
                renderDndCard(data.boss_assigned);
            } else {
                showWaitingForLeader(currentBossLevel);
            }
        });
}

function showBossDiceButton(bossLevel) {
    var container = getCardContainer();
    container.innerHTML = '<div class="branch-task-card"><div class="branch-header"><h3>⚔️ ' + (bossLevel === 'mini' ? 'Мини-босс' : 'Финальный босс') + '</h3></div><div class="level-card" style="text-align:center;"><p>Все участники готовы!</p><p>Брось кубик:</p><div id="dndDiceWrapper" style="margin:15px 0;"><div id="dndDice" class="dnd-dice" onclick="rollForTeamBoss(\'' + bossLevel + '\')"><div class="dice-face front"><span class="dot dot1"></span></div><div class="dice-face back"><span class="dot dot1"></span><span class="dot dot2"></span></div><div class="dice-face right"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span></div><div class="dice-face left"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span></div><div class="dice-face top"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span><span class="dot dot5"></span></div><div class="dice-face bottom"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span><span class="dot dot5"></span><span class="dot dot6"></span></div></div></div></div></div>';
}

function rollForTeamBoss(bossLevel) {
    var diceRoll = rollDice();
    var dice = document.getElementById('dndDice');
    dice.classList.add('rolling');
    dice.style.transform = getDiceFaceRotation(diceRoll);
    
    setTimeout(function() {
        dice.classList.remove('rolling');
        fetch(SERVER_URL + '/api/dnd/team_assign_boss', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, boss_level: bossLevel, dice_roll: diceRoll })
        })
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok') {
                dndCardHistory.push(data.boss_card);
                dndApproved = false;
                saveDndProgress();
                renderDndCard(data.boss_card);
            }
        });
    }, 800);
}       
function renderCardHTML(card, showDice, isStart) {
    var cardNumber = currentRenderCardNumber;
    var isBoss = (cardNumber >= 101 && cardNumber <= 106) || (cardNumber >= 203 && cardNumber <= 208);
    var tasksRequired = getBossWorkRequired();
    var pointsPerTask = getBossPointsPerTask();
    
    var diceHTML = showDice ? '<div id="dndDiceWrapper" style="margin:15px 0;"><div id="dndDice" class="dnd-dice" onclick="rollDndDice()"><div class="dice-face front"><span class="dot dot1"></span></div><div class="dice-face back"><span class="dot dot1"></span><span class="dot dot2"></span></div><div class="dice-face right"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span></div><div class="dice-face left"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span></div><div class="dice-face top"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span><span class="dot dot5"></span></div><div class="dice-face bottom"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span><span class="dot dot5"></span><span class="dot dot6"></span></div></div></div>' : '';
    
    var bossLabel = '';
    if (isBoss) {
        bossLabel = '<div style="font-size:12px;opacity:0.7;margin-top:4px;">👑 ' + (cardNumber <= 106 ? 'Мини-босс' : 'Финальный босс') + ' · ' + tasksRequired + ' заданий по ' + pointsPerTask + ' очков</div>';
    }
    
    var cardHTML = '<div class="branch-task-card ' + (isStart ? 'start-card' : '') + '"><div class="branch-header"><h3>' + card.title + '</h3>' + bossLabel + '</div><div class="level-card" id="card-level-' + cardNumber + '">' + (card.image ? '<img src="' + card.image + '" class="card-image" style="width:100%;border-radius:12px;margin-bottom:15px;" onerror="this.style.display=\'none\'">' : '') + (isStart ? '<p style="text-align:center;font-weight:600;">Брось кубик, чтобы начать!</p>' : '<p style="font-weight:600;margin-bottom:15px;">' + (card.task || '') + '</p>') + '<div id="card-status-' + cardNumber + '"></div>' + diceHTML + '</div></div>';
    
    setTimeout(function() {
        var statusContainer = document.getElementById('card-status-' + cardNumber);
        if (!statusContainer) return;
        
        if (isStart) {
            statusContainer.innerHTML = '';
            return;
        }
        
        if (showDice) {
            statusContainer.innerHTML = '<div style="text-align:center;color:var(--status-green);margin-bottom:10px;"><i class="fas fa-check-circle"></i> Задание одобрено!</div>';
        } else if (isBoss) {
            if (window._bossIntervals) {
                for (var key in window._bossIntervals) {
                    clearInterval(window._bossIntervals[key]);
                }
            }
            window._bossIntervals = window._bossIntervals || {};
            
         function updateBossProgress() {
    var totalPoints = tasksRequired * pointsPerTask;
    
    if (dndMode === 'team') {
        fetch(SERVER_URL + '/api/dnd/team_boss_progress?user_id=' + userId + '&card_id=' + cardNumber)
            .then(r => r.json())
            .then(function(data) {
                if (data.is_completed) {
                    clearInterval(window._bossIntervals[cardNumber]);
                    dndApproved = true;
                    renderDndCard(cardNumber);
                    return;
                }
                var el = document.getElementById('card-status-' + cardNumber);
                if (el) {
                    var tasksHTML = '<p style="color:var(--accent);font-size:12px;margin-bottom:10px;">👥 Командный счёт</p>';
                    for (var t = 0; t < tasksRequired; t++) {
                        var taskPoints = (data.tasks && data.tasks[t]) || 0;
                        var taskDone = taskPoints >= pointsPerTask;
                        var taskDesc = card.bossTasks ? card.bossTasks[t] : ('Задание ' + (t + 1));
                        tasksHTML += '<div class="subtask-card">';
                        tasksHTML += '<div class="subtask-header"><span class="subtask-name">' + taskDesc + '</span><span class="subtask-progress">' + taskPoints + '/' + pointsPerTask + '</span></div>';
                        tasksHTML += '<div class="progress-bar-container" style="height:6px;margin:0 0 8px 0;"><div class="progress-bar-fill" style="width:' + (taskPoints / pointsPerTask * 100) + '%;height:100%;"></div></div>';
                        if (!taskDone) {
                            tasksHTML += '<button class="task-submit-btn subtask-btn" onclick="submitBossWork(' + t + ')"><i class="fas fa-camera"></i> Отправить фото</button>';
                        } else {
                            tasksHTML += '<div style="text-align:center;color:var(--status-green);font-size:12px;"><i class="fas fa-check-circle"></i> Выполнено!</div>';
                        }
                        tasksHTML += '</div>';
                    }
                    el.innerHTML = tasksHTML;
                }
            });
    } else {
        fetch(SERVER_URL + '/api/dnd/get_progress?user_id=' + userId + '&character=' + dndCharacter)
            .then(r => r.json())
            .then(function(data) {
                var count = 0;
                var taskPointsArr = [];
                for (var i = 0; i < tasksRequired; i++) {
                    var bpk = 'boss_points_' + cardNumber + '_task_' + i;
                    var pts = (data.progress && data.progress[bpk]) || 0;
                    taskPointsArr.push(pts);
                    count += pts;
                }
                
                if (count >= totalPoints) {
                    clearInterval(window._bossIntervals[cardNumber]);
                    dndApproved = true;
                    renderDndCard(cardNumber);
                    return;
                }
                var el = document.getElementById('card-status-' + cardNumber);
                if (el) {
                    var tasksHTML = '';
                    for (var t = 0; t < tasksRequired; t++) {
                        var taskPoints = taskPointsArr[t];
                        var taskDone = taskPoints >= pointsPerTask;
                        var taskDesc = card.bossTasks ? card.bossTasks[t] : ('Задание ' + (t + 1));
                        tasksHTML += '<div class="subtask-card">';
                        tasksHTML += '<div class="subtask-header"><span class="subtask-name">' + taskDesc + '</span><span class="subtask-progress">' + taskPoints + '/' + pointsPerTask + '</span></div>';
                        tasksHTML += '<div class="progress-bar-container" style="height:6px;margin:0 0 8px 0;"><div class="progress-bar-fill" style="width:' + (taskPoints / pointsPerTask * 100) + '%;height:100%;"></div></div>';
                        if (!taskDone) {
                            tasksHTML += '<button class="task-submit-btn subtask-btn" onclick="submitBossWork(' + t + ')"><i class="fas fa-camera"></i> Отправить фото</button>';
                        } else {
                            tasksHTML += '<div style="text-align:center;color:var(--status-green);font-size:12px;"><i class="fas fa-check-circle"></i> Выполнено!</div>';
                        }
                        tasksHTML += '</div>';
                    }
                    el.innerHTML = tasksHTML;
                }
            });
    }
}

updateBossProgress();
window._bossIntervals[cardNumber] = setInterval(updateBossProgress, 5000);
            
        } else {
            var skipButtonHTML = '';
            if (!dndSkipUsed) {
               skipButtonHTML = '<button class="task-submit-btn" onclick="openSkipTaskModal()" style="background:#ff9800;margin-top:8px;"><i class="fas fa-book-open gold-book"></i> Пропустить (50)</button>';
            }
            
            statusContainer.innerHTML = '<button class="task-submit-btn" onclick="openDndTaskUpload()"><i class="fas fa-camera"></i> Отправить фото</button>' + skipButtonHTML + '<div style="text-align:center;color:var(--text-gray);font-size:12px;margin-top:10px;">⏳ Дождитесь одобрения администратором</div>';
        }
    }, 50);
    
    return cardHTML;
}
// ==========================================
// БРОСОК КУБИКА
// ==========================================

function rollDndDice() {
    if (dndIsRolling) return;
    var prevCard = dndCardHistory[dndCardHistory.length - 1] || 0;
    if (prevCard !== 0 && !dndApproved) { alert('⏳ Сначала дождитесь одобрения задания администратором!'); return; }
    
    dndIsRolling = true;
    var dice = document.getElementById('dndDice');
    if (!dice) { dndIsRolling = false; return; }
    
    var diceRoll = rollDice();
    var mappedValue = getMappedDiceValue(prevCard, diceRoll);
    var nextCardId = getTransition(prevCard, mappedValue);
    
    if (nextCardId === null || nextCardId === undefined || nextCardId < 0 || nextCardId > 208 || !getCardData(nextCardId)) {
        alert('⚠️ Ошибка перехода! Обновите страницу.');
        dndIsRolling = false;
        return;
    }
    
    dice.classList.add('rolling');
    dice.style.transform = getDiceFaceRotation(diceRoll);
    
    setTimeout(function() {
        dice.classList.remove('rolling');
        setTimeout(function() {
            dndIsRolling = false;
            dndCardHistory.push(nextCardId);
            dndApproved = false;
            saveDndProgress();
            renderDndCard(nextCardId);
        }, 1200);
    }, 800);
}

// ==========================================
// ОТПРАВКА ФОТО
// ==========================================

function openDndTaskUpload() {
    var currentCard = dndCardHistory[dndCardHistory.length - 1];
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.onchange = function(event) {
        var files = Array.from(event.target.files);
        if (files.length === 0) return;
        window.tempPhotos = files;
        submitDndTaskPhoto(currentCard);
    };
    fileInput.click();
}

function submitDndTaskPhoto(cardNumber) {
    if (!window.tempPhotos || window.tempPhotos.length === 0) { showUploadError('❌ Выберите фото'); return; }
    if (window.isUploading) return;
    window.isUploading = true;
    
    var formData = new FormData();
    formData.append('user', userId.toString());
    formData.append('character', dndCharacter);
    formData.append('card', cardNumber.toString());
    for (var i = 0; i < window.tempPhotos.length; i++) formData.append('photos', window.tempPhotos[i]);
    
    fetch(SERVER_URL + '/api/dnd/check_task', { method: 'POST', body: formData })
        .then(r => r.json())
        .then(function(result) {
            if (result && result.status === 'ok') {
                showUploadSuccess('✅ Фото отправлено на проверку!');
                closeTaskUploadModal();
            }
            else { showUploadError('❌ ' + (result?.message || 'Ошибка')); }
        })
        .catch(function(error) { showUploadError('❌ ' + error.message); })
        .finally(function() { window.isUploading = false; window.tempPhotos = []; });
}

// ==========================================
// СБРОС ПРОГРЕССА
// ==========================================

function resetDndProgress() {
    if (!confirm('⚠️ Сбросить прогресс? Вы вернётесь в меню.')) return;
    
    // Определяем, лидер или участник
    var isTeamMode = (dndMode === 'team');
    var resetPromise;
    
    if (isTeamMode) {
        // Сначала проверяем, лидер ли пользователь
        resetPromise = fetch(SERVER_URL + '/api/dnd/teams/my?user_id=' + userId)
            .then(r => r.json())
            .then(function(teamData) {
                var isLeader = (teamData.status === 'ok' && teamData.team && teamData.team.leader_id == userId);
                
                // Сбрасываем прогресс
                return fetch(SERVER_URL + '/api/dnd/reset_progress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId, character: dndCharacter })
                }).then(r => r.json()).then(function(resetData) {
                    if (resetData.status !== 'ok') {
                        throw new Error(resetData.message || 'Ошибка сброса');
                    }
                    
                    if (isLeader) {
                        // Лидер — удаляем команду
                        return fetch(SERVER_URL + '/api/dnd/teams/disband', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ user_id: userId })
                        }).then(r => r.json()).then(function() {
                            return { role: 'leader' };
                        });
                    } else {
                        // Участник — выходим из команды
                        return fetch(SERVER_URL + '/api/dnd/teams/leave', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ user_id: userId })
                        }).then(r => r.json()).then(function() {
                            return { role: 'member' };
                        });
                    }
                });
            });
    } else {
        // Соло — просто сбрасываем
        resetPromise = fetch(SERVER_URL + '/api/dnd/reset_progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, character: dndCharacter })
        }).then(r => r.json()).then(function(data) {
            if (data.status !== 'ok') throw new Error(data.message || 'Ошибка');
            return { role: 'solo' };
        });
    }
    
    resetPromise.then(function(result) {
        // Сбрасываем локально
        dndCardHistory = [0];
        dndApproved = true;
        dndSkipUsed = false;
        dndMode = null;
        dndCharacter = null;
        
        // Останавливаем опросы
        if (teamPollingInterval) {
            clearInterval(teamPollingInterval);
            teamPollingInterval = null;
        }
        if (approvalPollingInterval) {
            clearInterval(approvalPollingInterval);
            approvalPollingInterval = null;
        }
        
        document.getElementById('dndMainMenu').style.display = 'block';
        hideAllDndScreens();
        
        if (result.role === 'leader') {
            alert('✅ Прогресс сброшен! Команда расформирована.');
        } else if (result.role === 'member') {
            alert('✅ Прогресс сброшен! Вы вышли из команды.');
        } else {
            alert('✅ Прогресс сброшен! Можете начать заново.');
        }
    }).catch(function(error) {
        alert('❌ ' + (error.message || 'Ошибка'));
    });
}

// ==========================================
// ВСПОМОГАТЕЛЬНЫЕ
// ==========================================

function rollDice() { return Math.floor(Math.random() * 6) + 1; }

function getMappedDiceValue(cardId, diceRoll) {
    if (cardId === 0 || (cardId >= 1 && cardId <= 39)) {
        if (diceRoll === 1 || diceRoll === 2) return 1;
        if (diceRoll === 3 || diceRoll === 4) return 2;
        if (diceRoll === 5 || diceRoll === 6) return 3;
    }
    return diceRoll;
}

function getDiceFaceRotation(result) {
    var r = { 1: 'rotateX(0deg) rotateY(0deg)', 2: 'rotateX(0deg) rotateY(180deg)', 3: 'rotateX(0deg) rotateY(-90deg)', 4: 'rotateX(0deg) rotateY(90deg)', 5: 'rotateX(-90deg) rotateY(0deg)', 6: 'rotateX(90deg) rotateY(0deg)' };
    return r[result] || r[1];
}

function getTransition(cardId, mappedValue) {
    var transitions = null;
    if (dndCharacter === 'knight') transitions = window.DND_TRANSITIONS;
    else if (dndCharacter === 'mage') transitions = window.DND_TRANSITIONS_MAGE;
    else if (dndCharacter === 'archer') transitions = window.DND_TRANSITIONS_ARCHER;
    else if (dndCharacter === 'druid') transitions = window.DND_TRANSITIONS_DRUID;
    else if (dndCharacter === 'assassin') transitions = window.DND_TRANSITIONS_ASSASSIN;
    else if (dndCharacter === 'bard') transitions = window.DND_TRANSITIONS_BARD;
    if (!transitions || !transitions[cardId]) return null;
    return transitions[cardId][mappedValue];
}

function getCharacterName(char) {
    var names = { knight: '⚔️ Рыцарь', mage: '🔮 Маг', archer: '🕯️ Жрец', druid: '🌿 Друид', assassin: '🗡️ Ассасин', bard: '🎵 Бард' };
    return names[char] || char;
}

function closeTaskUploadModal() {
    console.log('🔒 Закрытие модального окна');
    
    const modal = document.getElementById('taskUploadModal');
    const previewContainer = document.getElementById('taskPhotoPreviewContainer');
    
    if (modal) modal.style.display = 'none';
    if (previewContainer) previewContainer.innerHTML = '';
    
    // Сбрасываем переменные
    currentUploadBranch = null;
    currentUploadLevel = null;
    currentSubtaskData = null;
    currentFriendTaskIdx = null;
    currentFriendLevelIdx = null;
    currentFriendSubtaskIdx = null;
    currentCommunitySubtask = null;
    tempPhotos = [];
    isUploading = false;
    
    // ✅ Обновляем прогресс с сервера
    loadFriendProgressFromServer();
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ==========================================
// СОЛО ИГРА
// ==========================================

function startSoloGame() {
    document.getElementById('soloCharacterModal').style.display = 'flex';
}

function closeSoloCharacterModal() {
    document.getElementById('soloCharacterModal').style.display = 'none';
}

function startSoloWithCharacter(character) {
    // ✅ Проверяем, нет ли уже активной игры у этого или другого персонажа
    fetch(SERVER_URL + '/api/dnd/get_progress?user_id=' + userId + '&character=' + character)
        .then(r => r.json())
        .then(progressData => {
            var history = [];
            if (progressData.status === 'ok' && progressData.progress) {
                history = progressData.progress.card_history || progressData.progress.completed_cards || [];
            }
            
            var finalBosses = [203, 204, 205, 206, 207, 208];
            var hasDefeatedBoss = finalBosses.some(function(boss) { return history.includes(boss); });
            
            if (history.length > 1 && !hasDefeatedBoss) {
                // Есть активная игра — восстанавливаем
                dndMode = 'solo';
                dndCharacter = character;
                dndCardHistory = history;
                var lastCard = history[history.length - 1];
                var completedCards = progressData.progress?.completed_cards || [];
                dndApproved = (lastCard === 0 || completedCards.includes(lastCard));
                
                closeSoloCharacterModal();
                document.getElementById('dndMainMenu').style.display = 'none';
                document.getElementById('dndSoloGame').style.display = 'block';
                document.getElementById('dndSoloTitle').innerText = '🎲 Соло: ' + getCharacterName(character);
                
                saveDndProgress();
                checkSkipAvailability();
                renderDndCard(lastCard);
                return;
            }
            
            // Проверяем другие активные игры
            var characters = ['knight', 'mage', 'archer', 'druid', 'assassin', 'bard'];
            var promises = characters.map(function(c) {
                if (c === character) return Promise.resolve({ history: history });
                return fetch(SERVER_URL + '/api/dnd/get_progress?user_id=' + userId + '&character=' + c)
                    .then(r => r.json())
                    .then(d => ({ history: (d.progress?.card_history || d.progress?.completed_cards || []) }))
                    .catch(() => ({ history: [0] }));
            });
            
            Promise.all(promises).then(function(results) {
                for (var i = 0; i < results.length; i++) {
                    var h = results[i].history;
                    var hasBoss = finalBosses.some(function(b) { return h.includes(b); });
                    if (h.length > 1 && !hasBoss) {
                        alert('⚠️ У вас уже есть активная игра за персонажа ' + getCharacterName(characters[i]) + '! Завершите её сначала.');
                        closeSoloCharacterModal();
                        return;
                    }
                }
                
                // Нет активных игр — начинаем новую
                dndMode = 'solo';
                dndCharacter = character;
                dndCardHistory = [0];
                dndApproved = true;
                dndSkipUsed = false;
                
                closeSoloCharacterModal();
                document.getElementById('dndMainMenu').style.display = 'none';
                document.getElementById('dndSoloGame').style.display = 'block';
                document.getElementById('dndSoloTitle').innerText = '🎲 Соло: ' + getCharacterName(character);
                
                saveDndProgress();
                renderDndCard(0);
            });
        });
}
// ==========================================
// КОМАНДНАЯ ИГРА
// ==========================================
function showWaitingForTeam(bossLevel) {
    var container = getCardContainer();
    if (!container) return;
    
    function checkStatus() {
        fetch(SERVER_URL + '/api/dnd/team_boss_status?user_id=' + userId + '&boss_level=' + bossLevel)
            .then(r => r.json())
            .then(data => {
                if (data.status === 'ok') {
                    if (data.boss_assigned) {
                        // Босс уже назначен — переходим
                        if (!dndCardHistory.includes(data.boss_assigned)) {
                            dndCardHistory.push(data.boss_assigned);
                        }
                        dndApproved = false;
                        saveDndProgress();
                        renderDndCard(data.boss_assigned);
                    } else if (data.all_ready && isTeamLeader()) {
                        // Лидер бросает кубик
                        container.innerHTML = '<div class="branch-task-card"><div class="branch-header"><h3>⚔️ ' + (bossLevel === 'mini' ? 'Мини-босс' : 'Финальный босс') + '</h3></div><div class="level-card" style="text-align:center;"><p style="color:var(--status-green);">✅ Все участники готовы!</p><p>Брось кубик чтобы выбрать босса:</p><div id="dndDiceWrapper" style="margin:15px 0;"><div id="dndDice" class="dnd-dice" onclick="rollForTeamBoss(\'' + bossLevel + '\')"><div class="dice-face front"><span class="dot dot1"></span></div><div class="dice-face back"><span class="dot dot1"></span><span class="dot dot2"></span></div><div class="dice-face right"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span></div><div class="dice-face left"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span></div><div class="dice-face top"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span><span class="dot dot5"></span></div><div class="dice-face bottom"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span><span class="dot dot5"></span><span class="dot dot6"></span></div></div></div></div></div>';
                    } else if (data.all_ready) {
                        // Ждём лидера
                        container.innerHTML = '<div class="branch-task-card"><div class="branch-header"><h3>⏳ Ожидание лидера</h3></div><div class="level-card" style="text-align:center;"><p>Все участники готовы!</p><p style="color:var(--text-gray);">Лидер выбирает босса...</p><button class="task-submit-btn" onclick="showWaitingForTeam(\'' + bossLevel + '\')" style="margin-top:15px;">🔄 Проверить</button></div></div>';
                    } else {
                        // Ждём — просто кнопка проверки
                        container.innerHTML = '<div class="branch-task-card"><div class="branch-header"><h3>⏳ Ожидание команды</h3></div><div class="level-card" style="text-align:center;"><p>Все участники должны достичь уровня босса</p><button class="task-submit-btn" onclick="showWaitingForTeam(\'' + bossLevel + '\')" style="margin-top:15px;">🔄 Проверить</button></div></div>';
                    }
                }
            });
    }
    
    // Показываем и запускаем авто-проверку каждые 5 секунд
    container.innerHTML = '<div class="branch-task-card"><div class="branch-header"><h3>⏳ Ожидание команды</h3></div><div class="level-card" style="text-align:center;"><p>Все участники должны достичь уровня босса</p><p style="color:var(--text-gray);">Авто-проверка каждые 5 сек...</p></div></div>';
    checkStatus();
    var interval = setInterval(function() {
        if (dndMode !== 'team' || !dndCardHistory.includes(parseInt(bossLevel === 'mini' ? '101' : '203'))) {
            checkStatus();
        } else {
            clearInterval(interval);
        }
    }, 5000);
}
      function showDndLobby() {
    document.getElementById('dndMainMenu').style.display = 'none';
    
    // ✅ Сначала проверяем, не идёт ли уже игра
    fetch(SERVER_URL + '/api/dnd/team/status?user_id=' + userId)
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok' && data.game_started) {
                // Игра уже идёт — сразу в игру
                document.getElementById('dndLobby').style.display = 'none';
                document.getElementById('dndGame').style.display = 'block';
                dndMode = 'team';
                var myself = (data.members || []).find(function(m) { return m.user_id == userId || m.id == userId; });
                dndCharacter = myself?.character || myself?.character_class;
                if (dndCharacter) {
                    loadDndProgress().then(function() {
                        checkSkipAvailability();
                        renderDndCard(dndCardHistory[dndCardHistory.length - 1] || 0);
                    });
                }
                startApprovalPolling();
            } else {
                // Игра не началась — показываем лобби
                document.getElementById('dndLobby').style.display = 'block';
                dndMode = 'team';
                refreshTeamList();
                loadMyTeam();
                startTeamPolling();
            }
        });
}
function refreshTeamList() {
    fetch(SERVER_URL + '/api/dnd/teams/list?user_id=' + userId)
        .then(r => r.json())
        .then(data => { if (data.status === 'ok') renderTeamsList(data.teams); });
}

function renderTeamsList(teams) {
    var container = document.getElementById('teamsList');
    if (!container) return;
    if (!teams || teams.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-users"></i><br>🤝 Нет открытых команд</div>';
        return;
    }
    var html = '';
    for (var i = 0; i < teams.length; i++) {
        var t = teams[i];
        html += '<div class="teams-list-item" onclick="openTeamPreview(\'' + t.id + '\')"><div class="team-name">🏰 ' + escapeHtml(t.team_name) + '</div><div class="team-count"><i class="fas fa-users"></i><span>' + t.current_members + '/' + t.members_needed + '</span></div></div>';
    }
    container.innerHTML = html;
}

function loadMyTeam() {
    console.log('🔄 Загрузка моей команды...');
    
    fetch(SERVER_URL + '/api/dnd/teams/my?user_id=' + userId)
        .then(r => r.json())
        .then(data => {
            console.log('📡 Ответ /teams/my:', data);
            
            if (data.status === 'ok' && data.team) {
                var team = data.team;
                var members = team.members || [];
                
                if (members.length === 0) {
                    document.getElementById('myTeamSection').style.display = 'none';
                    return;
                }
                
                // ✅ Загружаем публичные профили для ВСЕХ участников
                var promises = members.map(function(member) {
                    return fetch(SERVER_URL + '/api/public_profile?user_id=' + member.id)
                        .then(r => r.json())
                        .then(function(profile) {
                            console.log('📡 Профиль для ' + member.id + ':', profile);
                            return {
                                id: member.id,
                                name: profile.name || member.name || 'Пользователь',
                                avatar: profile.avatar || 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av1.png',
                                status: profile.status || 'Без статуса',
                                character_class: member.character_class
                            };
                        })
                        .catch(function(err) {
                            console.error('❌ Ошибка загрузки профиля ' + member.id + ':', err);
                            return {
                                id: member.id,
                                name: member.name || 'Пользователь',
                                avatar: 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av1.png',
                                status: 'Без статуса',
                                character_class: member.character_class
                            };
                        });
                });
                
                // ✅ Дожидаемся загрузки ВСЕХ профилей перед отрисовкой
                Promise.all(promises).then(function(updatedMembers) {
                    team.members = updatedMembers;
                    console.log('✅ Обновлённые участники:', team.members);
                    document.getElementById('myTeamSection').style.display = 'block';
                    renderMyTeam(team);
                });
                
            } else {
                document.getElementById('myTeamSection').style.display = 'none';
                var myTeamCard = document.getElementById('myTeamCard');
                if (myTeamCard) myTeamCard.innerHTML = '';
            }
        })
        .catch(err => {
            console.error('❌ Ошибка загрузки команды:', err);
            document.getElementById('myTeamSection').style.display = 'none';
        });
}

function renderMyTeam(team) {
    var isLeader = team.leader_id == userId;
    var membersHtml = '';
    for (var i = 0; i < team.members.length; i++) {
        var m = team.members[i];
        var avatarUrl = m.avatar || 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av1.png';
        var charIcon = { knight: '⚔️', mage: '🔮', archer: '🕯️', druid: '🌿', assassin: '🗡️', bard: '🎵' }[m.character_class] || '';
        var charName = { knight: 'Рыцарь', mage: 'Маг', archer: 'Жрец', druid: 'Друид', assassin: 'Ассасин', bard: 'Бард' }[m.character_class] || '';
        var isMemberLeader = (m.id == team.leader_id);
        var shortName = (m.name || 'Пользователь').length > 20 ? (m.name || 'Пользователь').substring(0, 18) + '...' : (m.name || 'Пользователь');
        
        membersHtml += '<div class="team-member-item" onclick="openPublicProfile(\'' + m.id + '\')"><img class="team-member-avatar" src="' + avatarUrl + '"><div class="team-member-info"><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:2px;"><span class="team-member-name">' + escapeHtml(shortName) + '</span>' + (isMemberLeader ? '<span class="team-leader-badge" style="display:inline-flex;align-items:center;gap:4px;background:#ffd700;color:#333;font-size:10px;padding:3px 10px;border-radius:20px;font-weight:600;"><i class="fas fa-crown"></i> Лидер</span>' : '') + (charIcon ? '<span class="team-character-badge" style="display:inline-flex;align-items:center;gap:4px;background:rgba(255,149,0,0.2);color:var(--accent);font-size:10px;padding:3px 10px;border-radius:20px;font-weight:500;">' + charIcon + ' ' + charName + '</span>' : '') + '</div><div class="team-member-status" style="margin-top:1px;">' + escapeHtml(m.status || 'Без статуса') + '</div></div></div>';
    }
    var actions = isLeader ? '<div class="team-actions"><button class="team-action-btn" onclick="showTeamCharacterModal()">🎭 Выбрать персонажа</button><button class="team-action-btn" onclick="startTeamGame()">🎮 Начать игру</button><button class="team-action-btn danger" onclick="disbandTeam()">💥 Расформировать</button></div>' : '<div class="team-actions"><button class="team-action-btn" onclick="showTeamCharacterModal()">🎭 Выбрать персонажа</button><button class="team-action-btn danger" onclick="leaveTeam()">🚪 Покинуть</button></div>';
    document.getElementById('myTeamCard').innerHTML = '<div class="my-team-card"><div class="team-header-row"><h4>' + escapeHtml(team.team_name) + '</h4><div class="team-header-count"><i class="fas fa-users"></i><span>' + team.current_members + '/6</span></div></div><div class="team-members-list">' + membersHtml + '</div>' + actions + '</div>';
}

function showCreateTeamModal() { document.getElementById('createTeamModal').style.display = 'flex'; }
function closeCreateTeamModal() { document.getElementById('createTeamModal').style.display = 'none'; }

function createTeam() {
    var name = document.getElementById('teamNameInput').value.trim();
    if (!name) { alert('Введите название'); return; }
    fetch(SERVER_URL + '/api/dnd/teams/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, team_name: name }) })
        .then(r => r.json())
        .then(data => { if (data.status === 'ok') { alert('✅ Команда создана!'); closeCreateTeamModal(); refreshTeamList(); loadMyTeam(); } else { alert('❌ ' + (data.message || 'Ошибка')); } });
}

function showTeamCharacterModal() { document.getElementById('teamCharacterModal').style.display = 'flex'; }
function closeTeamCharacterModal() { document.getElementById('teamCharacterModal').style.display = 'none'; }

function selectTeamCharacter(character) {
    fetch(SERVER_URL + '/api/dnd/team/select_character', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, character: character }) })
        .then(r => r.json())
        .then(data => { if (data.status === 'ok') { alert('✅ Персонаж выбран!'); closeTeamCharacterModal(); dndCharacter = character; dndCardHistory = [0]; dndApproved = true; saveDndProgress(); loadMyTeam(); } else { alert('❌ ' + (data.message || 'Ошибка')); } });
}

function startTeamGame() {
    if (!confirm('Начать игру? Все участники начнут приключение.')) return;
    fetch(SERVER_URL + '/api/dnd/teams/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId }) })
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok') {
                alert('🎮 Игра начинается!');
                document.getElementById('dndLobby').style.display = 'none';
                document.getElementById('dndGame').style.display = 'block';
                dndMode = 'team';
                startTeamPolling();  // ← добавить
                if (dndCharacter) { 
                    dndCardHistory = [0];
                    dndApproved = true;
                    dndSkipUsed = false;
                    checkSkipAvailability();
                    saveDndProgress();
                    renderDndCard(0); 
                }
            } else { alert('❌ ' + (data.message || 'Ошибка')); }
        });
}
function disbandTeam() {
    if (!confirm('Расформировать команду?')) return;
    fetch(SERVER_URL + '/api/dnd/teams/disband', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId }) })
        .then(r => r.json())
        .then(data => { if (data.status === 'ok') { alert('✅ Команда расформирована'); refreshTeamList(); loadMyTeam(); } });
}

function leaveTeam() {
    if (!confirm('Покинуть команду?')) return;
    fetch(SERVER_URL + '/api/dnd/teams/leave', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId }) })
        .then(r => r.json())
        .then(data => { if (data.status === 'ok') { alert('✅ Вы покинули команду'); refreshTeamList(); loadMyTeam(); } else { alert('❌ ' + (data.message || 'Ошибка')); } });
}

function openTeamPreview(teamId) {
    fetch(SERVER_URL + '/api/dnd/teams/list?user_id=' + userId)
        .then(r => r.json())
        .then(data => {
            var team = data.teams.find(function(t) { return t.id == teamId; });
            if (team) {
                document.getElementById('teamPreviewContent').innerHTML = '<div class="team-preview-header"><span class="team-preview-name">🏰 ' + escapeHtml(team.team_name) + '</span><span class="team-preview-count"><i class="fas fa-users"></i><span>' + team.current_members + '/' + team.members_needed + '</span></span></div>' + (team.leader_id == userId ? '<div class="your-team-badge">⭐ Ваша команда</div>' : '<button class="join-team-preview-btn" onclick="joinTeamFromPreview(\'' + team.id + '\')">🤝 Вступить</button>');
                document.getElementById('teamPreviewModal').style.display = 'flex';
            }
        });
}

function joinTeamFromPreview(teamId) {
    fetch(SERVER_URL + '/api/dnd/teams/join', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, team_id: teamId }) })
        .then(r => r.json())
        .then(data => { if (data.status === 'ok') { alert('✅ Вы вступили!'); closeTeamPreviewModal(); refreshTeamList(); loadMyTeam(); } else { alert('❌ ' + (data.message || 'Ошибка')); } });
}

function closeTeamPreviewModal() { document.getElementById('teamPreviewModal').style.display = 'none'; }
// При загрузке страницы — всегда показываем главное меню (если оплачено)
function resetDndUI() {
    document.getElementById('dndPaySection').style.display = 'none';
    document.getElementById('dndMainMenu').style.display = 'none';
    document.getElementById('dndLobby').style.display = 'none';
    document.getElementById('dndGame').style.display = 'none';
    document.getElementById('dndSoloGame').style.display = 'none';
}
// ==========================================
// АВТО-ВОССТАНОВЛЕНИЕ
// ==========================================

function autoRestoreDndGame() {
    console.log('🔍 autoRestoreDndGame запущен');
    
    // Блокируем кнопки меню на время проверки
    var menuButtons = document.querySelectorAll('#dndMainMenu .dnd-character-card');
    for (var i = 0; i < menuButtons.length; i++) {
        menuButtons[i].style.pointerEvents = 'none';
        menuButtons[i].style.opacity = '0.5';
    }
    
    // 1. Проверяем командную игру
    fetch(SERVER_URL + '/api/dnd/team/status?user_id=' + userId)
        .then(r => r.json())
        .then(teamData => {
            console.log('📡 Статус команды:', teamData);
            
            if (teamData.status === 'ok' && teamData.game_started) {
                console.log('🎮 Найдена активная командная игра');
                dndMode = 'team';
                var myself = (teamData.members || []).find(function(m) { return m.user_id == userId || m.id == userId; });
                dndCharacter = myself?.character || myself?.character_class;
                if (dndCharacter) {
                    document.getElementById('dndMainMenu').style.display = 'none';
                    document.getElementById('dndLobby').style.display = 'none';
                    document.getElementById('dndGame').style.display = 'block';
                    document.getElementById('dndSoloGame').style.display = 'none';
                    loadDndProgress().then(function() {
                        checkSkipAvailability();
                        renderDndCard(dndCardHistory[dndCardHistory.length - 1] || 0);
                    });
                }
                return;
            }
            
            // 2. Ищем соло с максимальным прогрессом
            var characters = ['knight', 'mage', 'archer', 'druid', 'assassin', 'bard'];
            var promises = [];
            
            for (var i = 0; i < characters.length; i++) {
                (function(char) {
                    promises.push(
                        fetch(SERVER_URL + '/api/dnd/get_progress?user_id=' + userId + '&character=' + char)
                            .then(r => r.json())
                            .then(progressData => {
                                if (progressData.status === 'ok' && progressData.progress) {
                                    var history = progressData.progress.card_history || progressData.progress.completed_cards || [];
                                    return { character: char, history: history, completedCards: progressData.progress.completed_cards || [] };
                                }
                                return { character: char, history: [0], completedCards: [] };
                            })
                            .catch(function() {
                                return { character: char, history: [0], completedCards: [] };
                            })
                    );
                })(characters[i]);
            }
            
            Promise.all(promises).then(function(results) {
                console.log('📊 Все результаты:', JSON.stringify(results));
                
                var bestResult = null;
                var maxLength = 0;
                
                for (var i = 0; i < results.length; i++) {
                    if (results[i].history.length > maxLength) {
                        maxLength = results[i].history.length;
                        bestResult = results[i];
                    }
                }
                
                console.log('🏆 Лучший:', bestResult ? bestResult.character + ' (' + maxLength + ' карт)' : 'нет');
                
                if (bestResult && maxLength > 1) {
                    dndMode = 'solo';
                    dndCharacter = bestResult.character;
                    dndCardHistory = bestResult.history;
                    
                    var lastCard = bestResult.history[bestResult.history.length - 1];
                    dndApproved = (lastCard === 0 || bestResult.completedCards.includes(lastCard));
                    
                    console.log('🎮 Восстанавливаем соло: ' + bestResult.character + ', карта ' + lastCard);
                    
                    document.getElementById('dndMainMenu').style.display = 'none';
                    document.getElementById('dndLobby').style.display = 'none';
                    document.getElementById('dndGame').style.display = 'none';
                    document.getElementById('dndSoloGame').style.display = 'block';
                    document.getElementById('dndSoloTitle').innerText = '🎲 Соло: ' + getCharacterName(bestResult.character);
                    
                    checkSkipAvailability();
                    renderDndCard(lastCard);
                } else {
                    // Нет активных игр — показываем меню и разблокируем кнопки
                    console.log('👀 Нет активных игр, показываем меню');
                    document.getElementById('dndMainMenu').style.display = 'block';
                    document.getElementById('dndLobby').style.display = 'none';
                    document.getElementById('dndGame').style.display = 'none';
                    document.getElementById('dndSoloGame').style.display = 'none';
                    
                    // Разблокируем кнопки меню
                    for (var j = 0; j < menuButtons.length; j++) {
                        menuButtons[j].style.pointerEvents = 'auto';
                        menuButtons[j].style.opacity = '1';
                    }
                }
            });
        });
}
function checkSkipAvailability() {
    if (!dndCharacter) return;
    
    fetch(SERVER_URL + '/api/dnd/get_progress?user_id=' + userId + '&character=' + dndCharacter)
        .then(r => r.json())
        .then(function(data) {
            if (data.status === 'ok' && data.progress) {
                dndSkipUsed = data.progress.skip_used || false;
            }
        });
}

function openSkipTaskModal() {
    var currentCard = dndCardHistory[dndCardHistory.length - 1];
    pendingSkipCard = currentCard;
    
    if (!currentCard) {
        alert('❌ Ошибка: нет активной карты');
        return;
    }
    
    var imgEl = document.getElementById('skipTaskImage');
    // ✅ Всегда показываем propusk.png
    imgEl.src = 'https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/propusk.png';
    imgEl.style.display = 'block';
    
    document.getElementById('skipTaskModal').style.display = 'flex';
}

function closeSkipTaskModal() {
    document.getElementById('skipTaskModal').style.display = 'none';
    pendingSkipCard = null;
}

function confirmSkipTask() {
    var cardToSkip = dndCardHistory[dndCardHistory.length - 1]; // ← берём напрямую
    
    if (!cardToSkip) {
        alert('❌ Ошибка: карта не найдена');
        return;
    }
    
    fetch(SERVER_URL + '/api/balance?user_id=' + userId)
        .then(r => r.json())
        .then(function(balanceData) {
            var balance = balanceData.balance || 0;
            if (balance < 50) {
                alert('❌ Недостаточно ашетиков! Нужно 50, у вас ' + balance);
                return;
            }
            
            if (!confirm('Потратить 50 ашетиков на пропуск задания? Можно использовать только 1 раз за приключение.')) return;
            
            fetch(SERVER_URL + '/api/dnd/skip_task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    character: dndCharacter,
                    card_id: cardToSkip
                })
            })
            .then(r => r.json())
            .then(function(result) {
                if (result.status === 'ok') {
                    dndSkipUsed = true;
                    dndApproved = true;
                    user.balance = result.new_balance;
                    updateUI();
                    closeSkipTaskModal();
                    renderDndCard(cardToSkip);
                    alert('✅ Задание пропущено! Можете бросать кубик.');
                } else {
                    alert('❌ ' + (result.message || 'Ошибка'));
                }
            });
        });
}
// ==========================================
// ИНИЦИАЛИЗАЦИЯ
// ==========================================

window.onload = async () => {
    console.log('🚀 APP STARTING...');
    
    // ========== 1. ТЕМА — ПРИМЕНЯЕТСЯ МГНОВЕННО, ДО ВСЕХ ЗАПРОСОВ ==========
    const savedTheme = localStorage.getItem('app_theme');
    if (savedTheme === 'custom') {
        applyCustomTheme(true);
    } else if (savedTheme && savedTheme !== 'light') {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        document.documentElement.setAttribute('data-theme', user.theme || 'light');
    }
    
    const savedUser = localStorage.getItem('coloring_user');
    if (savedUser) Object.assign(user, JSON.parse(savedUser));
    
    const savedCart = localStorage.getItem('coloring_cart');
    if (savedCart) cart = JSON.parse(savedCart);
    
    var savedDates = localStorage.getItem('completed_pages_dates_' + userId);
    if (savedDates) {
        try { window.completedPagesDates = JSON.parse(savedDates); }
        catch(e) { window.completedPagesDates = {}; }
    } else {
        window.completedPagesDates = {};
    }
    
    loadMarkersCollection();
  
    
    // ========== ЕДИНЫЙ ЗАПРОС ИНИЦИАЛИЗАЦИИ ==========
    try {
        console.log('⚡ Загрузка через /api/init...');
        const initResponse = await fetch(`${SERVER_URL}/api/init?user_id=${userId}`);
        const initData = await initResponse.json();
        
        if (initData.status === 'ok') {
            // Баланс
            user.balance = initData.balance;
            
            // Статистика и прогресс
            userProgress = initData.stats || {};
            localStorage.setItem(`coloring_progress_${userId}`, JSON.stringify(userProgress));
            
            // Статусы
            user.unlockedStatuses = initData.stats?.unlocked_statuses || ['Без статуса'];
            if (!user.unlockedStatuses.includes('Без статуса')) {
                user.unlockedStatuses.unshift('Без статуса');
            }
            
            // Достижения
            user.achievements = initData.achievements || [];
            
            // Бусты — берём большее из /api/init и localStorage
            const savedBoosts = JSON.parse(localStorage.getItem(`user_boosts_${userId}`) || '{}');
            const apiBoost = initData.boost || { active: false, remaining: 0 };
            if (savedBoosts.active && savedBoosts.remaining > apiBoost.remaining) {
                userBoosts = { active: savedBoosts.active, remainingWorks: savedBoosts.remaining };
            } else {
                userBoosts = { active: apiBoost.active, remainingWorks: apiBoost.remaining || 0 };
                localStorage.setItem(`user_boosts_${userId}`, JSON.stringify({ active: apiBoost.active, remaining: apiBoost.remaining || 0 }));
            }
            
            // ✅ СКИПЫ — ТОЛЬКО С СЕРВЕРА, БЕЗ localStorage
            userSkips = initData.skips || 0;
            console.log('🔄 Скипы загружены с сервера:', userSkips);
            
            // Season Pass
            claimedSeasonRewards = initData.season_rewards || { free: [], premium: [] };
            window._seasonRewardsLoaded = true;
            
            // Раскраски
            userColoringBooks = initData.coloring_books || { paint_by_number: [], alcohol: [], pencil: [], custom: [] };
            localStorage.setItem(`coloring_books_${userId}`, JSON.stringify(userColoringBooks));
            
            // Артворки
            userArtworks = initData.artworks || {};
            
            // ✅ Completed pages — загружаем и синхронизируем с artworks
            if (initData.stats?.completed_pages) {
                userCompletedPages = initData.stats.completed_pages;
            } else {
                userCompletedPages = {};
            }
            
            // ✅ Синхронизируем artworks → completed_pages
            if (userArtworks && typeof userArtworks === 'object') {
                for (const bookKey in userArtworks) {
                    if (!userCompletedPages[bookKey]) userCompletedPages[bookKey] = {};
                    for (const page in userArtworks[bookKey]) {
                        userCompletedPages[bookKey][page] = true;
                    }
                }
            }
            
            // Сохраняем синхронизированные данные
            localStorage.setItem(`completed_pages_${userId}`, JSON.stringify(userCompletedPages));
            console.log('📄 completed_pages загружены:', Object.keys(userCompletedPages).length, 'книг');
            
            // Коллекция фигурок
            userCollection = COLLECTION_FIGURES.map(f => ({
                id: f.id,
                unlocked: (initData.collection || []).includes(f.id) || (initData.collection || []).includes(String(f.id))
            }));
            
            // Друзья (базовый список, аватарки загрузятся отдельно)
            myFriends = (initData.friend_ids || []).map(fid => ({ user_id: fid, id: fid, name: '', username: '', avatar: '' }));
            
            // Органайзеры
            if (initData.organizers && initData.organizers.length > 0) {
                inventory.organizers = initData.organizers;
            }
            if (!inventory.userMarkers) inventory.userMarkers = {};
            
            // Имя
            if (initData.name) {
                user.name = initData.name;
            }
            
            // Аватар
            if (initData.avatar) {
                user.avatar = initData.avatar;
            }
            
            // Подложки — применяем сразу
            if (initData.sponsor_background) {
                applySponsorBackground(initData.sponsor_background, initData.sponsor_background_id);
            }
            if (initData.status_background) {
                applyStatusBackground(initData.status_background);
            }
            if (initData.avatar_border) {
                applyAvatarBorder(initData.avatar_border);
            }
            
            // Даты
            if (initData.stats?.completed_pages_dates) {
                for (var dk in initData.stats.completed_pages_dates) {
                    if (!window.completedPagesDates[dk]) {
                        window.completedPagesDates[dk] = initData.stats.completed_pages_dates[dk];
                    }
                }
                localStorage.setItem('completed_pages_dates_' + userId, JSON.stringify(window.completedPagesDates));
            }
            
            saveUserData();
            updateUI();
            console.log('✅ Все данные загружены через /api/init');
        } else {
            throw new Error('Init failed');
        }
    } catch (error) {
        console.error('❌ Ошибка /api/init, загружаем по-старому:', error);
        await loadUserBalance();
        await loadUserProgress();
        await loadUnlockedStatuses();
        await loadUserAchievements();
        await loadColoringBooks();
        await loadCompletedPages();
        
        // При ошибке — пробуем загрузить скипы отдельно
        try {
            const skipsRes = await fetch(`${SERVER_URL}/api/init?user_id=${userId}`);
            const skipsData = await skipsRes.json();
            userSkips = skipsData.skips || 0;
        } catch(e) {
            userSkips = 0;
        }
    }
    
    await checkBalanceStatus();
    await checkAndUnlockStatuses();
    
    // Догружаем друзей с аватарками
    try {
        await loadMyFriends();
    } catch(e) {}
    
    updateUI();
    
    // Проверяем имя и аватар (если не загрузились через /api/init)
    try {
        const response = await fetch(`${SERVER_URL}/api/stats?user_id=${userId}`);
        const stats = await response.json();
        if (stats && stats.avatar && !user.avatar) {
            user.avatar = stats.avatar;
            document.getElementById('user-avatar').src = user.avatar;
            localStorage.setItem('coloring_user', JSON.stringify(user));
        }
        
        if (stats.name && user.name === 'Без имени') {
            user.name = stats.name;
            document.getElementById('displayUsername').innerText = stats.name;
            localStorage.setItem('coloring_user', JSON.stringify(user));
        }
        
        if (stats.sponsor_background && stats.sponsor_background_id) {
            applySponsorBackground(stats.sponsor_background, stats.sponsor_background_id);
        }
        if (stats.status_background) {
            applyStatusBackground(stats.status_background);
        }
        if (stats.avatar_border) {
            applyAvatarBorder(stats.avatar_border);
        }
    } catch (error) {
        console.error('❌ Ошибка загрузки аватара:', error);
    }
    
    if (user.status && !user.unlockedStatuses.includes(user.status)) {
        user.status = 'Без статуса';
    }
    
    loadFriendTasksStatus();
    await loadFriendProgressFromServer();
    
    // ✅ Загружаем прогресс временных заданий с сервера (ВСЕГДА сохраняем)
    try {
        const timeStatusRes = await fetch(`${SERVER_URL}/api/time_tasks_status?user_id=${userId}`);
        const serverStatus = await timeStatusRes.json();
        localStorage.setItem('time_tasks_status', JSON.stringify(serverStatus || {}));
        console.log('📡 Статус временных заданий загружен:', serverStatus);
    } catch(e) {
        console.error('Ошибка загрузки статуса временных заданий:', e);
    }

    // Рендерим задания
    await renderTimeTasks();
    
    renderBranchTasks();
    renderFriendTasks();
    renderSeasonPassTasks();
    
    loadMarkers();
    renderCart();
    renderVolumes();
    loadInventory();
    loadWishlistCount();
    
    loadSeasonPremiumStatus();
    loadClaimedRewards();
    
    await loadCollection();
    
    setInterval(async () => { await checkCollectionUpdates(); }, 30000);
    setInterval(async () => { await loadFriendProgressFromServer(); }, 30000);
    
    updateUI();
    initSwipeListeners();
    
    window.onclick = function(event) {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            if (event.target === modal) {
                modal.style.display = "none";
                if (modal.id === 'answersViewerModal') {
                    document.body.style.overflow = '';
                }
            }
        });
    };
    
    // Буст — финальная проверка
    if (!userBoosts || !userBoosts.active) {
        const savedBoostsCheck = JSON.parse(localStorage.getItem(`user_boosts_${userId}`) || '{}');
        if (savedBoostsCheck.active && savedBoostsCheck.remaining > 0) {
            userBoosts = { active: true, remainingWorks: savedBoostsCheck.remaining };
        } else {
            userBoosts = userBoosts || { active: false, remainingWorks: 0 };
        }
    }
    
    // ✅ Скипы — финальная проверка (только если undefined)
    if (userSkips === undefined || userSkips === null) {
        try {
            const skipsRes = await fetch(`${SERVER_URL}/api/init?user_id=${userId}`);
            const skipsData = await skipsRes.json();
            userSkips = skipsData.skips || 0;
        } catch(e) {
            userSkips = 0;
        }
    }
    
    if (typeof updateSkipDisplay === 'function') {
        updateSkipDisplay();
    } else {
        const skipDisplay = document.getElementById('skipCountDisplay');
        if (skipDisplay) {
            skipDisplay.innerText = userSkips || 0;
        }
    }
    
    if (typeof updateBoostDisplay === 'function') {
        updateBoostDisplay();
    } else {
        const boostContainer = document.getElementById('boostStatusContainer');
        if (boostContainer) {
            if (userBoosts && userBoosts.active && userBoosts.remainingWorks > 0) {
                boostContainer.innerHTML = `
                    <div style="font-size: 11px; color: var(--text-gray);">Буст x2</div>
                    <span style="font-weight: 700; color: var(--accent); font-size: 20px;">${userBoosts.remainingWorks}</span>
                `;
            } else {
                boostContainer.innerHTML = `
                    <div style="font-size: 11px; color: var(--text-gray);">Буст x2</div>
                    <span style="font-weight: 700; color: var(--text-gray); font-size: 20px;">—</span>
                `;
            }
        }
    }
    
    setInterval(async () => {
        try {
            const response = await fetch(`${SERVER_URL}/api/get_boost_status?user_id=${userId}`);
            const boost = await response.json();
            const newBoost = {
                active: boost.active || false,
                remainingWorks: boost.remaining || 0
            };
            
            if (JSON.stringify(userBoosts) !== JSON.stringify(newBoost)) {
                userBoosts = newBoost;
                if (typeof updateBoostDisplay === 'function') {
                    updateBoostDisplay();
                }
                console.log('🔄 Буст синхронизирован с сервера:', userBoosts);
            }
        } catch (e) {}
    }, 30000);
    
    console.log('✅ APP READY');
    
    setTimeout(function() {
        fetch(SERVER_URL + '/api/dnd/payment_status?user_id=' + userId)
            .then(r => r.json())
            .then(function(data) {
                if (data.is_paid) {
                    autoRestoreDndGame();
                }
            });
    }, 300);
};
       
// ==========================================
// КОЛЛЕКЦИЯ МАРКЕРОВ (НА СЕРВЕРЕ)
// ==========================================

const MARKER_SETS = [
    { 
    id: 'guangna', 
    name: 'GuangNa', 
    brand: 'GuangNa', 
    numbers: [
        330, 331, 332, 333, 334, 335, 336, 337, 338, 339,
        340, 341, 342, 343, 344, 345, 346, 347, 348, 349,
        350, 351, 352, 353, 354, 355, 356, 357, 358, 359,
        360, 361, 362, 363, 364, 365, 366, 367, 368, 369,
        370, 371, 372, 373, 374, 375, 376, 377,
        600, 601, 602, 603, 604, 605, 606, 607, 608, 609,
        610, 611, 612, 613, 614, 615, 616, 617, 618, 619,
        620, 621, 622, 623, 624, 625, 626, 627, 628, 629,
        630, 631, 632, 633, 634, 635, 636, 637, 638, 639,
        640, 641, 642, 643, 644, 645, 646, 647, 648, 649,
        650, 651, 652, 653, 654, 655, 656, 657, 658, 659,
        660, 661, 662, 663, 664, 665, 666, 667, 668, 669,
        670, 671, 672, 673, 674, 675, 676, 677, 678, 679,
        680, 681, 682, 683, 684, 685, 686, 687, 688, 689,
        690, 691, 692, 693, 694, 695, 696, 697, 698, 699,
        700, 701, 702, 703, 704, 705, 706, 707, 708, 709,
        710, 711, 712, 713, 714, 715, 716, 717, 718, 719,
        720, 721, 722, 723, 724, 725, 726, 727, 728, 729,
        730, 731, 732, 733, 734, 735, 736, 737, 738, 739,
        740, 741, 742, 743, 744, 745, 746, 747, 748, 749,
        750, 751, 752, 753, 754, 755, 756, 757, 758, 759,
        760, 761, 762, 763, 764, 765, 766, 767, 768, 769,
        770, 771, 772, 773, 774, 775, 776, 777, 778, 779,
        780, 781, 782, 783, 784, 785, 786, 787, 788, 789,
        790, 791, 792, 793, 794, 795, 796, 797, 798, 799,
        800, 801, 802, 803, 804, 805, 806, 807, 808, 809,
        810, 811, 812, 813, 814, 815, 816, 817, 818, 819,
        820, 821, 822, 823, 824, 825, 826, 827, 828, 829,
        830, 831, 832, 833, 834, 835, 836, 837, 838, 839,
        840, 841, 842, 843, 844, 845, 846, 847, 848, 849,
        850, 851, 852, 853, 854, 855, 856, 857, 858, 859,
        860, 861, 862, 863, 864, 865, 866, 867, 868, 869,
        870, 871, 872, 873, 874, 875, 876, 877, 878, 879,
        880, 881, 882, 883, 884, 885, 886, 887, 888, 889,
        890, 891, 892, 893, 894, 895, 896, 897, 898, 899,
        900, 901, 902, 903, 904, 905, 906, 907, 908, 909,
        910, 911, 912, 913, 914, 915, 916, 917, 918, 919,
        920, 921, 922, 923, 924, 925, 926, 927, 928, 929,
        930, 931, 932, 933, 934, 935, 936, 937, 938, 939,
        940, 941, 942, 943, 944, 945, 946, 947, 948, 949,
        950, 951, 952, 953, 954, 955, 956, 957, 958, 959
    ]
},
    { 
    id: 'languo', 
    name: 'Languo', 
    brand: 'Languo', 
    numbers: [
        'AG171', 'AG172', 'AG173', 'AG174', 'AG175', 'AG176', 'AG177', 'AG178', 'AG179',
        'AG245', 'AG246', 'AG247', 'AG248', 'AG249', 'AG250', 'AG251', 'AG252', 'AG253', 'AG254', 'AG255', 'AG256',
        'BL201', 'BL202', 'BL203', 'BL204', 'BL205', 'BL206', 'BL207', 'BL208', 'BL209', 'BL210',
        'BL211', 'BL212', 'BL213', 'BL214', 'BL215', 'BL257', 'BL258', 'BL259', 'BL260', 'BL261',
        'BL262', 'BL263', 'BL264', 'BL265', 'BL266', 'BL267', 'BL268',
        'BR701', 'BR702', 'BR703', 'BR704', 'BR705', 'BR706', 'BR707', 'BR708', 'BR709', 'BR710',
        'BR711', 'BR712', 'BR713', 'BR714', 'BR715',
        'CB901', 'CB902', 'CB903', 'CB904', 'CB905', 'CB906', 'CB907', 'CB908', 'CB909', 'CB910',
        'CS141', 'CS142', 'CS143', 'CS144', 'CS145', 'CS146', 'CS147', 'CS148', 'CS149',
        'CS501', 'CS502', 'CS503', 'CS504', 'CS505', 'CS506', 'CS507', 'CS508', 'CS509', 'CS510', 'CS511',
        'DB161', 'DB162', 'DB163', 'DB164', 'DB165', 'DB166', 'DB167', 'DB168', 'DB169',
        'DB1610', 'DB1611', 'DB1612',
        'DS181', 'DS182', 'DS183', 'DS184', 'DS185', 'DS186', 'DS187', 'DS188', 'DS189',
        'GB401', 'GB402', 'GB403', 'GB404', 'GB405', 'GB406', 'GB407', 'GB408', 'GB409', 'GB410',
        'GB411', 'GB412',
        'GR101', 'GR102', 'GR103', 'GR104', 'GR105', 'GR106', 'GR107', 'GR108', 'GR109', 'GR110',
        'GR111', 'GR112', 'GR113', 'GR114', 'GR115', 'GR1010', 'GR1011', 'GR1012', 'GR1013',
        'HC131', 'HC132', 'HC133', 'HC134', 'HC135', 'HC136', 'HC137', 'HC138', 'HC139',
        'HC601', 'HC602', 'HC603', 'HC604', 'HC605', 'HC606', 'HC607', 'HC608', 'HC609',
        'LC111', 'LC112', 'LC113', 'LC114', 'LC115', 'LC116', 'LC117', 'LC118', 'LC119',
        'LC191', 'LC192', 'LC193', 'LC194', 'LC195', 'LC196', 'LC197', 'LC198', 'LC199', 'LC1110',
        'PC233', 'PC234', 'PC235', 'PC236', 'PC237', 'PC238', 'PC239', 'PC240', 'PC241', 'PC242',
        'PC243', 'PC244',
        'PC801', 'PC802', 'PC803', 'PC804', 'PC805', 'PC806', 'PC807', 'PC808', 'PC809', 'PC810',
        'PC811', 'PC812', 'PC813', 'PC814', 'PC815', 'PC816', 'PC817', 'PC818',
        'PU301', 'PU302', 'PU303', 'PU304', 'PU305', 'PU306', 'PU307', 'PU308', 'PU309', 'PU310',
        'PU311', 'PU312', 'PU313', 'PU314', 'PU315', 'PU316', 'PU317', 'PU318', 'PU319', 'PU320', 'PU321',
        'RY01', 'RY02', 'RY03', 'RY04', 'RY05', 'RY06', 'RY07', 'RY08', 'RY09', 'RY10',
        'RY11', 'RY12', 'RY13', 'RY14', 'RY15',
        'SG151', 'SG152', 'SG153', 'SG154', 'SG155', 'SG156', 'SG157', 'SG158', 'SG159',
        'SG221', 'SG222', 'SG223', 'SG224', 'SG225', 'SG226', 'SG227', 'SG228', 'SG229', 'SG230',
        'SG231', 'SG232',
        'YE121', 'YE122', 'YE123', 'YE124', 'YE125', 'YE126', 'YE127', 'YE128', 'YE129', 'YE130',
        'YE131', 'YE132', 'YE133', 'YE134', 'YE135', 'YE136',
        'YE1210', 'YE1211', 'YE1212'
    ]
},
    { 
    id: 'zibeef', 
    name: 'Zibeef', 
    brand: 'Zibeef', 
    numbers: [
        200, 201, 202, 203, 204, 205, 206, 207, 208, 209,
        210, 212, 213, 214, 215, 216, 217, 219,
        220, 221, 224, 225, 227, 229,
        232, 233, 234, 235, 236, 237,
        250, 258, 259, 260, 269,
        780, 781, 782, 783, 784, 785, 786, 787, 788, 789,
        790, 791, 792, 793, 794, 795, 796, 797, 798, 799,
        800, 801, 802, 803, 804, 805, 806, 807, 808, 809,
        810, 811, 812, 813, 814, 815, 816, 817, 818, 819,
        820, 821, 822, 823, 824, 825, 826, 827, 828, 829,
        830, 831, 832, 835, 836, 837, 838, 839, 840, 841,
        842, 843, 844, 845, 846, 847, 848, 849, 850, 851,
        852, 853, 854, 855, 856, 857, 858, 859, 860, 861,
        862, 863, 864, 865, 866, 867, 868, 869, 870, 871,
        872, 873, 874, 875, 876, 877, 878, 879, 880, 881,
        882, 883, 884, 885, 886, 887, 888, 889, 890, 891,
        892, 893, 894, 895, 896, 897, 898, 899, 900, 901,
        902, 903, 904, 905, 906, 907, 908, 909, 910, 911,
        912, 913, 914, 915, 916, 917, 918, 919, 920, 921,
        924, 925, 926, 927, 928, 929, 930, 931, 932, 933,
        934, 935, 936, 937, 938, 939, 940, 941, 942, 943,
        944, 945, 946, 947, 948, 949, 950, 951, 952, 953,
        954, 955, 956, 957, 958, 959, 960, 961, 962, 963,
        964, 965, 966, 967, 968, 969, 970, 971, 972, 973,
        974, 975, 976, 977, 978, 979, 980, 981, 982, 983,
        984, 985, 986, 987, 988
    ]
},
    { 
    id: 'grasp', 
    name: 'Grasp', 
    brand: 'Grasp', 
    numbers: [
        'B028',
        'B117', 'B118', 'B119', 'B148', 'B153', 'B166', 'B207', 'B215', 'B278', 'B688',
        'B689', 'B690', 'B708', 'B778', 'B779', 'B780', 'B781', 'B782', 'B793', 'B815',
        'BG148', 'BG344',
        'BR756', 'BR762', 'BR763', 'BR764',
        'F01', 'F04', 'F06', 'F07', 'F08', 'F702', 'F703', 'F786',
        'FP01', 'FP03',
        'G147', 'G152', 'G154', 'G183', 'G202', 'G227', 'G250', 'G275', 'G277', 'G279',
        'G281', 'G326', 'G519', 'G687', 'G694', 'G695', 'G697', 'G699', 'G770', 'G772',
        'G773', 'G774', 'G775', 'G776', 'G777',
        'GY209', 'GY376', 'GY404', 'GY504',
        'M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10', 'M11', 'M12',
        'NG212', 'NG270', 'NG271',  'NG272', 'NG274', 'NG693', 'NG767', 'NG768', 'NG769',
        'O299', 'O548', 'O5115',
        'P207', 'P264', 'P290', 'P345', 'P445', 'P520', 'P588', 'P5115',
        'R109', 'R128', 'R129', 'R144', 'R146', 'R149', 'R150', 'R151', 'R158', 'R201',
        'R207', 'R211', 'R218', 'R238', 'R260', 'R269', 'R344', 'R548', 'R605', 'R691',
        'R692', 'R698', 'R701', 'R704', 'R705', 'R707', 'R714', 'R754', 'R755', 'R757',
        'R758', 'R759', 'R760', 'R761', 'R765', 'R766', 'R783', 'R784', 'R785', 'R787',
        'R789', 'R790', 'R835', 'R848',
        'S',
        'W01', 'W706',
        'Y123', 'Y128', 'Y145', 'Y146', 'Y160', 'Y206', 'Y208', 'Y209', 'Y210', 'Y276',
        'Y320', 'Y405', 'Y408', 'Y415', 'Y416', 'Y507', 'Y713', 'Y762', 'Y771', 'Y788',
        'Y791', 'Y792', 'Y906'
    ]
},
   { 
    id: 'infiart', 
    name: 'InfiArt', 
    brand: 'InfiArt', 
    numbers: [
        // Числовые с O
        'O104', 'O105', 'O107', 'O108', 'O111', 'O116', 'O121', 'O124', 'O169', 'O177', 'O186', 'O187',
        'O193', 'O216', 'O222', 'O224', 'O226', 'O242', 'O289', 'O299', 'O305', 'O308',
        'O311', 'O323', 'O363', 'O376', 'O388', 'O398', 'O399', 'O405', 'O411',  'O415', 'O416',
        'O423', 'O479', 'O489', 'O490', 'O510', 'O513', 'O522', 'O538', 'O548',  'O587',
        'O1108', 'O1115', 'O3100', 'O4109', 'O5115',
        // Oa
        'Oa415', 'Oa513',
        // B
        'B105', 'B123', 'B124', 'B125', 'B126', 'B149', 'B153', 'B166', 'B186', 'B209',
        'B222', 'B224', 'B242', 'B244', 'B261', 'B276', 'B288', 'B359', 'B364', 'B379',
        'B408', 'B409', 'B425', 'B483', 'B564', 'B578', 'B1111',
        // BG
        'BG144', 'BG148', 'BG165', 'BG254', 'BG262', 'BG307', 'BG322', 'BG325', 'BG342', 'BG344',
        'BG390', 'BG398', 'BG425', 'BG445', 'BG446', 'BG524', 'BG548', 'BG562', 'BG589', 'BG5109',
        // F
        'F01', 'F02', 'F03', 'F04', 'F05', 'F06', 'F07', 'F08', 'F12',
        // FP
        'FP01', 'FP02', 'FP03', 'FP04', 'FP05',
        // G
        'G108', 'G148', 'G155', 'G176', 'G183', 'G212', 'G225', 'G227', 'G250', 'G289',
        'G323', 'G325', 'G326', 'G328', 'G378', 'G425', 'G427', 'G448', 'G478', 'G508',
        'G511', 'G545', 'G4109',
        // Ga
        'Ga508',
        // GY
        'GY107', 'GY153', 'GY188', 'GY193', 'GY209', 'GY213', 'GY224', 'GY307', 'GY310', 'GY362',
        'GY376', 'GY404', 'GY409', 'GY411', 'GY425', 'GY504', 'GY506', 'GY510', 'GY524', 'GY578',
        // GYa
        'GYa411',
        // M
        'M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10', 'M11', 'M12',
        // N
        'N39', 'N52',
        // Na
        'Na17',
        // P
        'P108', 'P124', 'P145', 'P164', 'P179', 'P207', 'P223', 'P224', 'P244', 'P245',
        'P246', 'P264', 'P270', 'P290', 'P345', 'P348', 'P366', 'P380', 'P420', 'P436',
        'P442', 'P443', 'P445', 'P455', 'P460', 'P471', 'P489', 'P497', 'P509', 'P5115',
        'P520', 'P525', 'P543', 'P548', 'P579', 'P588', 'P4100',
        // Pa
        'Pa164', 'Pa290',
        // R
        'R107', 'R108', 'R121', 'R127', 'R129', 'R146', 'R166', 'R179', 'R207', 'R209',
        'R264', 'R279', 'R309', 'R327', 'R344', 'R389', 'R407', 'R409', 'R425', 'R426',
        'R448', 'R508', 'R525', 'R544', 'R546', 'R548',
        // Ra
        'Ra409', 'Ra425', 'Ra489', 'Ra524', 'Ra564',
        // S
        'S119',
        // W
        'W01',
        // Y
        'Y104', 'Y105', 'Y108', 'Y109', 'Y115', 'Y123', 'Y143', 'Y146', 'Y153', 'Y160',
        'Y169', 'Y208', 'Y209', 'Y263', 'Y277', 'Y311', 'Y316', 'Y320', 'Y329', 'Y332',
        'Y333', 'Y344', 'Y405', 'Y406', 'Y408', 'Y410', 'Y415', 'Y422', 'Y442', 'Y443',
        'Y445', 'Y461', 'Y488', 'Y505', 'Y507', 'Y508', 'Y520', 'Y522', 'Y524', 'Y534',
        'Y543', 'Y562', 'Y564', 'Y579',
        // Ya
        'Ya213'
    ]
},
    
    // Tooli-Art подкатегории
    { id: 'tooliart_pastel', name: 'Tooli-Art Pastel', brand: 'Tooli-Art', subcategory: 'pastel', numbers: Array.from({length: 24}, (_, i) => i + 1) },
    { id: 'tooliart_jewel', name: 'Tooli-Art Jewel', brand: 'Tooli-Art', subcategory: 'jewel', numbers: Array.from({length: 24}, (_, i) => i + 1) },
    { id: 'tooliart_confetti', name: 'Tooli-Art Confetti', brand: 'Tooli-Art', subcategory: 'confetti', numbers: Array.from({length: 24}, (_, i) => i + 1) },
    { id: 'tooliart_metallic', name: 'Tooli-Art Metallic', brand: 'Tooli-Art', subcategory: 'metallic', numbers: Array.from({length: 24}, (_, i) => i + 1) },
    { id: 'tooliart_neon', name: 'Tooli-Art Neon', brand: 'Tooli-Art', subcategory: 'neon', numbers: Array.from({length: 24}, (_, i) => i + 1) },
    { id: 'tooliart_glitter', name: 'Tooli-Art Glitter', brand: 'Tooli-Art', subcategory: 'glitter', numbers: Array.from({length: 24}, (_, i) => i + 1) },
    { id: 'tooliart_brown', name: 'Tooli-Art Brown', brand: 'Tooli-Art', subcategory: 'brown', numbers: Array.from({length: 22}, (_, i) => i + 1) },
    { id: 'tooliart_purple', name: 'Tooli-Art Purple', brand: 'Tooli-Art', subcategory: 'purple', numbers: Array.from({length: 22}, (_, i) => i + 1) },
    { id: 'tooliart_pink', name: 'Tooli-Art Pink', brand: 'Tooli-Art', subcategory: 'pink', numbers: Array.from({length: 22}, (_, i) => i + 1) },
    { id: 'tooliart_skin', name: 'Tooli-Art Skin', brand: 'Tooli-Art', subcategory: 'skin', numbers: Array.from({length: 22}, (_, i) => i + 1) },
    { id: 'tooliart_green', name: 'Tooli-Art Green', brand: 'Tooli-Art', subcategory: 'green', numbers: Array.from({length: 22}, (_, i) => i + 1) },
    { id: 'tooliart_gray', name: 'Tooli-Art Gray', brand: 'Tooli-Art', subcategory: 'gray', numbers: Array.from({length: 22}, (_, i) => i + 1) },
    { id: 'tooliart_orange', name: 'Tooli-Art Orange', brand: 'Tooli-Art', subcategory: 'orange', numbers: Array.from({length: 22}, (_, i) => i + 1) },
    { id: 'tooliart_redpink', name: 'Tooli-Art Red&Pink', brand: 'Tooli-Art', subcategory: 'redpink', numbers: Array.from({length: 22}, (_, i) => i + 1) },
    { id: 'tooliart_bluepurple', name: 'Tooli-Art Blue&Purple', brand: 'Tooli-Art', subcategory: 'bluepurple', numbers: Array.from({length: 22}, (_, i) => i + 1) },
    { id: 'tooliart_southwest', name: 'Tooli-Art Southwest', brand: 'Tooli-Art', subcategory: 'southwest', numbers: Array.from({length: 28}, (_, i) => i + 1) },
    { id: 'tooliart_wildflower', name: 'Tooli-Art Wildflower', brand: 'Tooli-Art', subcategory: 'wildflower', numbers: Array.from({length: 24}, (_, i) => i + 1) },
    { id: 'tooliart_nocturnal', name: 'Tooli-Art Nocturnal', brand: 'Tooli-Art', subcategory: 'nocturnal', numbers: Array.from({length: 28}, (_, i) => i + 1) },
    { id: 'tooliart_essential', name: 'Tooli-Art Essential', brand: 'Tooli-Art', subcategory: 'essential', numbers: [0, 99, ...Array.from({length: 26}, (_, i) => i + 1)] },
    { id: 'tooliart_earth', name: 'Tooli-Art Earth', brand: 'Tooli-Art', subcategory: 'earth', numbers: Array.from({length: 36}, (_, i) => i + 1) }
];

let userMarkersCollection = {};

async function loadMarkersCollection() {
    // Сначала из localStorage
    const saved = localStorage.getItem(`markers_${userId}`);
    if (saved) {
        try { userMarkersCollection = JSON.parse(saved); }
        catch(e) { userMarkersCollection = {}; }
    } else {
        userMarkersCollection = {};
    }
    
    // Потом с сервера (объединяем)
    try {
        const response = await fetch(`${SERVER_URL}/api/markers_collection?user_id=${userId}`);
        const data = await response.json();
        if (data && typeof data === 'object') {
            userMarkersCollection = { ...userMarkersCollection, ...data };
        }
    } catch(e) {}
    
    localStorage.setItem(`markers_${userId}`, JSON.stringify(userMarkersCollection));
    updateMarkersCollectionStats();
}

async function updateMarkerInCollection(brand, number, action, subcategory = '') {
    let key;
    if (brand === 'Tooli-Art' && subcategory) {
        key = `${brand}_${subcategory}_${number}`;
    } else {
        key = `${brand}_${number}`;
    }
    
    if (action === 'toggle') {
        action = userMarkersCollection[key] ? 'remove' : 'add';
    }
    
    if (action === 'add') {
        userMarkersCollection[key] = true;
    } else {
        delete userMarkersCollection[key];
    }
    
    localStorage.setItem(`markers_${userId}`, JSON.stringify(userMarkersCollection));
    updateMarkersCollectionStats();
    renderMarkersCollection();
    
    // ✅ Синхронизация с сервером
    fetch(`${SERVER_URL}/api/markers_collection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: userId,
            brand: brand,
            number: number,
            subcategory: subcategory || '',
            action: action
        })
    }).catch(e => console.error('Sync error:', e));
}
async function addAllBrand(brand, subcategory, numbers) {
    console.log('📦 addAllBrand вызвана:', brand, subcategory, numbers.length);
    
    if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
        console.error('❌ numbers не массив или пуст:', numbers);
        if (tg) tg.showAlert('❌ Ошибка: неверный формат данных');
        return;
    }
    
    // Обновляем локально
    numbers.forEach(num => {
        const numStr = String(num);
        let key;
        if (brand === 'Tooli-Art' && subcategory) {
            key = `${brand}_${subcategory}_${numStr}`;
        } else {
            key = `${brand}_${numStr}`;
        }
        userMarkersCollection[key] = true;
    });
    
    localStorage.setItem(`markers_${userId}`, JSON.stringify(userMarkersCollection));
    updateMarkersCollectionStats();
    renderMarkersCollection();
    
    // Отправляем на сервер
    if (brand === 'Tooli-Art' && subcategory) {
        for (const num of numbers) {
            try {
                await fetch(`${SERVER_URL}/api/markers_collection`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: userId,
                        brand: brand,
                        number: String(num),
                        subcategory: subcategory,
                        action: 'add'
                    })
                });
            } catch (error) {
                console.error('Error syncing:', error);
            }
        }
    } else {
        try {
            await fetch(`${SERVER_URL}/api/markers_collection`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    brand: brand,
                    numbers: numbers.map(n => String(n)),
                    action: 'add_all_brand'
                })
            });
        } catch (error) {
            console.error('Error syncing:', error);
        }
    }
    
    if (tg) tg.showAlert(`✅ Добавлено ${numbers.length} маркеров`);
}
function renderMarkersCollection() {
    const container = document.getElementById('markersCollectionList');
    if (!container) return;
    
    // Сохраняем скролл для каждого открытого сета
    const scrollPositions = {};
    document.querySelectorAll('.marker-set-content').forEach(el => {
        if (el.id) {
            scrollPositions[el.id] = el.scrollTop;
        }
    });
    
    let html = '';
    
    MARKER_SETS.forEach(set => {
        const numbers = set.numbers || Array.from({length: set.maxNumber}, (_, i) => i + 1);
        const totalCount = numbers.length;
        
        const collectedCount = numbers.filter(num => {
            let key;
            if (set.brand === 'Tooli-Art' && set.subcategory) {
                key = `${set.brand}_${set.subcategory}_${num}`;
            } else {
                key = `${set.brand}_${num}`;
            }
            return userMarkersCollection[key] || false;
        }).length;
        
        const percent = Math.round((collectedCount / totalCount) * 100);
        
        // ✅ Используем data-атрибуты вместо onclick с JSON
        html += `
            <div class="marker-set-card" style="margin-bottom: 15px; border-bottom: 1px solid var(--border-color);">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <strong style="font-size: 16px;">${set.name}</strong>
                        <span style="margin-left: 10px; font-size: 13px; color: var(--text-gray);">${collectedCount}/${totalCount}</span>
                    </div>
                    <button class="add-all-brand-btn" 
                            data-brand="${set.brand}" 
                            data-subcategory="${set.subcategory || ''}" 
                            data-numbers='${JSON.stringify(numbers)}'>
                        <i class="fas fa-plus"></i> Добавить всё
                    </button>
                </div>
                <div class="progress-bar-container" style="margin: 8px 0;">
                    <div class="progress-bar-fill" style="width: ${percent}%;"></div>
                </div>
                <div class="marker-set-content ${set.brand === 'Grasp' ? 'grasp-grid' : ''} ${set.brand === 'InfiArt' ? 'infiart-grid' : ''} ${set.brand === 'Languo' ? 'languo-grid' : ''}" id="set-${set.id}">
        `;
        
        const sortedNumbers = [...numbers].sort((a, b) => {
            const aStr = String(a);
            const bStr = String(b);
            return aStr.localeCompare(bStr, undefined, { numeric: true, sensitivity: 'base' });
        });
        
        sortedNumbers.forEach(num => {
            let key;
            if (set.brand === 'Tooli-Art' && set.subcategory) {
                key = `${set.brand}_${set.subcategory}_${num}`;
            } else {
                key = `${set.brand}_${num}`;
            }
            const collected = userMarkersCollection[key] || false;
            html += `<div class="marker-number-btn ${collected ? 'collected' : ''}" onclick="updateMarkerInCollection('${set.brand}', '${num}', 'toggle', '${set.subcategory || ''}')">${num}</div>`;
        });
        
        html += `</div></div>`;
    });
    
    container.innerHTML = html;
    
    // ✅ Добавляем обработчики для кнопок "Добавить всё"
    setTimeout(() => {
        document.querySelectorAll('.add-all-brand-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const brand = this.dataset.brand;
                const subcategory = this.dataset.subcategory || '';
                const numbers = JSON.parse(this.dataset.numbers || '[]');
                
                console.log('📦 Добавить всё:', brand, subcategory, numbers.length, 'маркеров');
                addAllBrand(brand, subcategory, numbers);
            });
        });
        
        // Восстанавливаем скролл
        for (const [id, scrollTop] of Object.entries(scrollPositions)) {
            const el = document.getElementById(id);
            if (el) el.scrollTop = scrollTop;
        }
    }, 50);
}
function updateMarkersCollectionStats() {
    const count = Object.keys(userMarkersCollection).length;
    const statsEl = document.getElementById('markersCollectionStats');
    if (statsEl) statsEl.innerText = count;  // ← только число, без "/"
}

function toggleMarkersCollectionBlock() {
    const content = document.getElementById('markersCollectionContent');
    const arrow = document.getElementById('markersCollectionArrow');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        arrow.style.transform = 'rotate(180deg)';
        renderMarkersCollection();
    } else {
        content.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)';
    }
}

function filterMarkersCollection() {
    const query = document.getElementById('markersCollectionSearch')?.value.trim().toLowerCase() || '';
    
    const cards = document.querySelectorAll('.marker-set-card');
    
    cards.forEach(card => {
        const brandEl = card.querySelector('strong');
        const brand = brandEl ? brandEl.innerText.toLowerCase() : '';
        
        const numberBtns = card.querySelectorAll('.marker-number-btn');
        let hasVisibleNumber = false;
        
        numberBtns.forEach(btn => {
            const number = String(btn.innerText).trim().toLowerCase();
            
            // ✅ Ищем по бренду ИЛИ по номеру (включая буквы, например AG171)
            if (query === '' || brand.includes(query) || number.includes(query)) {
                btn.style.display = 'flex';
                hasVisibleNumber = true;
            } else {
                btn.style.display = 'none';
            }
        });
        
        // Показываем карточку бренда, если есть видимые номера или бренд совпадает с поиском
        if (query === '' || brand.includes(query) || hasVisibleNumber) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Функция для получения списка маркеров пользователя (для ИИ палитры)
function getUserMarkersList() {
    const markers = [];
    for (const key in userMarkersCollection) {
        if (userMarkersCollection[key]) {
            const [brand, number] = key.split('_');
            markers.push({ brand, number });
        }
    }
    return markers;
}
function toggleFiguresCollectionBlock() {
    const content = document.getElementById('figuresCollectionContent');
    const arrow = document.getElementById('figuresCollectionArrow');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        arrow.style.transform = 'rotate(180deg)';
        renderCollection();
    } else {
        content.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)';
    }
}
        function togglePageCompletion(bookKey, page, totalPages) {
    if (!userCompletedPages[bookKey]) {
        userCompletedPages[bookKey] = {};
    }
    
    const isCompleted = userCompletedPages[bookKey][String(page)];
    
    if (isCompleted) {
        if (tg) {
            tg.showConfirm(`Снять отметку со страницы ${page}?`, (confirm) => {
                if (confirm) {
                    delete userCompletedPages[bookKey][String(page)];
                    if (window.completedPagesDates) {
                        delete window.completedPagesDates[bookKey + '|' + page];
                        localStorage.setItem('completed_pages_dates_' + userId, JSON.stringify(window.completedPagesDates));
                    }
                    saveCompletedPages();
                    updateAllCategoriesProgress();
                    renderBookPagesGrid(bookKey, BOOK_PAGES_CONFIG[currentBook] || DEFAULT_PAGES_CONFIG);
                }
            });
        } else {
            if (confirm(`Снять отметку со страницы ${page}?`)) {
                delete userCompletedPages[bookKey][String(page)];
                if (window.completedPagesDates) {
                    delete window.completedPagesDates[bookKey + '|' + page];
                    localStorage.setItem('completed_pages_dates_' + userId, JSON.stringify(window.completedPagesDates));
                }
                saveCompletedPages();
                updateAllCategoriesProgress();
                renderBookPagesGrid(bookKey, BOOK_PAGES_CONFIG[currentBook] || DEFAULT_PAGES_CONFIG);
            }
        }
    } else {
        userCompletedPages[bookKey][String(page)] = true;
        if (!window.completedPagesDates) window.completedPagesDates = {};
        window.completedPagesDates[bookKey + '|' + page] = Date.now();
        localStorage.setItem('completed_pages_dates_' + userId, JSON.stringify(window.completedPagesDates));
        
        saveCompletedPages();
        updateAllCategoriesProgress();
        renderBookPagesGrid(bookKey, BOOK_PAGES_CONFIG[currentBook] || DEFAULT_PAGES_CONFIG);
        
        const completedCount = Object.keys(userCompletedPages[bookKey]).length;
        if (completedCount === totalPages) {
            if (tg) tg.showAlert(`🎉 Поздравляем! Вы раскрасили всю раскраску «${currentBook}»!`);
            else alert(`🎉 Поздравляем! Вы раскрасили всю раскраску «${currentBook}»!`);
        }
    }
}
        function isPageCompleted(bookKey, page) {
    return userCompletedPages[bookKey]?.hasOwnProperty(String(page)) || false;
}
function getPageArtwork(bookKey, page) {
    const url = userArtworks[bookKey]?.[String(page)];
    if (!url) return null;
    
    // Если URL начинается с /artworks — добавляем SERVER_URL
    if (url.startsWith('/artworks')) {
        return SERVER_URL + url;
    }
    return url;
}
function viewArtwork(bookKey, page) {
    const artwork = getPageArtwork(bookKey, page);
    if (!artwork) return;
    
    // ✅ Жесткая проверка: если открыт чужой профиль или режим просмотра - не показываем удаление
    const isOwnProfile = !currentPublicUserId && !window.isViewOnly;
    
    console.log('viewArtwork вызвана:', {
        bookKey,
        page,
        currentPublicUserId,
        isViewOnly: window.isViewOnly,
        isOwnProfile
    });
    
    const modal = document.createElement('div');
    modal.className = 'artwork-viewer-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:100003;display:flex;align-items:center;justify-content:center;padding:20px;';
    
    modal.innerHTML = `
        <div style="max-width:90%;max-height:90%;position:relative;">
            <img src="${artwork}" style="max-width:100%;max-height:80vh;object-fit:contain;border-radius:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
                <p style="color:white;margin:0;">Страница ${page}</p>
                ${isOwnProfile ? `
                    <button onclick="deleteArtwork('${bookKey.replace(/'/g, "\\'")}', '${page}')" style="background:var(--status-red);color:white;border:none;padding:8px 16px;border-radius:20px;font-size:14px;cursor:pointer;">
                        <i class="fas fa-trash"></i> Удалить
                    </button>
                ` : ''}
            </div>
            <button onclick="this.closest('.artwork-viewer-modal').remove()" style="position:absolute;top:-40px;right:0;background:none;border:none;color:white;font-size:30px;cursor:pointer;">&times;</button>
        </div>
    `;
    
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    document.body.appendChild(modal);
}

async function deleteArtwork(bookKey, page) {
    if (!confirm('Удалить загруженное фото? Отметка страницы тоже будет снята.')) return;
    
    try {
        // Удаляем фото
        if (userArtworks[bookKey] && userArtworks[bookKey][page]) {
            delete userArtworks[bookKey][page];
        }
        
        // Снимаем отметку страницы
        if (userCompletedPages[bookKey] && userCompletedPages[bookKey][page]) {
            delete userCompletedPages[bookKey][page];
        }
        
        // Удаляем дату
        if (window.completedPagesDates && window.completedPagesDates[bookKey + '|' + page]) {
            delete window.completedPagesDates[bookKey + '|' + page];
            localStorage.setItem('completed_pages_dates_' + userId, JSON.stringify(window.completedPagesDates));
        }
        
        // Сохраняем изменения
        saveCompletedPages();
        updateAllCategoriesProgress();
        
        // Отправляем на сервер
        await fetch(`${SERVER_URL}/api/artworks/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                book_key: bookKey,
                page: page
            })
        });
        
        // Обновляем модалку
        const config = BOOK_PAGES_CONFIG[currentBook] || DEFAULT_PAGES_CONFIG;
        renderBookPagesGrid(bookKey, config);
        
        // Закрываем просмотр
        document.querySelector('.artwork-viewer-modal')?.remove();
        
        if (tg) tg.showAlert('✅ Фото и отметка удалены');
    } catch (error) {
        console.error('Ошибка удаления:', error);
        if (tg) tg.showAlert('❌ Ошибка удаления');
    }
}
        function closeBookPagesModal() {
    document.getElementById('bookPagesModal').style.display = 'none';
    currentBook = null;
    currentCategory = null;
    currentPage = null;
    window.isViewOnly = false;
    
    var profileModal = document.getElementById('publicProfileModal');
    if (profileModal) profileModal.style.opacity = '1';
}
function changeMarkerCount(idx, delta) {
    const org = inventory.organizers.find(o => o.id === currentOrganizerId);
    if (!org || currentCellRow === null || currentCellCol === null) return;
    
    if (!org.cells[currentCellRow]) org.cells[currentCellRow] = [];
    if (!org.cells[currentCellRow][currentCellCol]) org.cells[currentCellRow][currentCellCol] = [];
    
    const cellMarkers = org.cells[currentCellRow][currentCellCol];
    const marker = cellMarkers[idx];
    
    if (!marker) return;
    
    const newCount = marker.count + delta;
    
    if (newCount <= 0) {
        // Удаляем полностью
        const key = `${marker.brand}_${marker.number}`;
        if (inventory.userMarkers) {
            inventory.userMarkers[key] = Math.max(0, (inventory.userMarkers[key] || 0) - marker.count);
            if (inventory.userMarkers[key] === 0) delete inventory.userMarkers[key];
        }
        cellMarkers.splice(idx, 1);
    } else {
        // Обновляем количество
        const oldCount = marker.count;
        marker.count = newCount;
        
        const key = `${marker.brand}_${marker.number}`;
        if (!inventory.userMarkers) inventory.userMarkers = {};
        inventory.userMarkers[key] = (inventory.userMarkers[key] || 0) + (newCount - oldCount);
    }
    
    saveInventory();
    renderCellMarkers(cellMarkers);
    renderOrganizers();
    renderBrands();
}
function filterColoringBooks() {
    const query = document.getElementById('coloringBooksSearch')?.value.toLowerCase() || '';
    
    const categories = ['paint_by_number', 'alcohol', 'pencil', 'custom'];
    
    categories.forEach(category => {
        const container = document.getElementById(`category-${category}`);
        if (!container) return;
        
        const cards = container.querySelectorAll('.coloring-book-item');
        let visibleCount = 0;
        
        cards.forEach(card => {
            const nameEl = card.querySelector('.book-name');
            const name = nameEl ? nameEl.innerText.toLowerCase() : '';
            
            if (query === '' || name.includes(query)) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Скрываем форму добавления при поиске
        const addForm = container.querySelector('.add-book-form')?.parentElement;
        if (addForm) {
            addForm.style.display = query === '' ? 'block' : 'none';
        }
    });
}
function toggleSubcategorySelect() {
    const brandSelect = document.getElementById('addMarkerBrand');
    const subcategoryGroup = document.getElementById('subcategoryGroup');
    
    if (brandSelect.value === 'Tooli-Art') {
        subcategoryGroup.style.display = 'block';
    } else {
        subcategoryGroup.style.display = 'none';
    }
}
// Поиск пользователей
let searchTimeout = null;
let currentPublicUserId = null;

function openUserSearch() {
    document.getElementById('userSearchModal').style.display = 'flex';
    document.getElementById('userSearchInput').value = '';
    document.getElementById('userSearchResults').innerHTML = '';  // ← пусто, без подсказки
    
    // Фокус на поле ввода
    setTimeout(() => {
        document.getElementById('userSearchInput').focus();
    }, 100);
}

function closeUserSearch() {
    document.getElementById('userSearchModal').style.display = 'none';
}

function searchUsers() {
    const input = document.getElementById('userSearchInput');
    const query = input.value.trim();
    const resultsDiv = document.getElementById('userSearchResults');
    
    if (searchTimeout) clearTimeout(searchTimeout);
    
    if (query.length < 2) {
        resultsDiv.innerHTML = '<div class="no-results" style="padding: 20px;">🔍 Введите хотя бы 2 символа</div>';
        return;
    }
    
    resultsDiv.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Поиск...</div>';
    
    searchTimeout = setTimeout(async () => {
        try {
            const response = await fetch(`${SERVER_URL}/api/search_users?query=${encodeURIComponent(query)}`);
            const users = await response.json();
            
            if (users.length === 0) {
                resultsDiv.innerHTML = '<div class="no-results" style="padding: 20px;">😕 Ничего не найдено</div>';
                return;
            }
            
            let html = '';
            users.forEach(user => {
                const avatarUrl = user.avatar || 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av1.png';
                
                html += `
                    <div class="user-search-card" onclick="openPublicProfile('${user.user_id}')">
                        <img src="${avatarUrl}" class="user-search-avatar" onerror="this.src='https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av1.png'">
                        <div class="user-search-info">
                            <div class="user-search-name">${user.name}</div>
                            <div class="user-search-username">${user.username}</div>
                            <div class="user-search-status">${user.status || 'Без статуса'}</div>
                        </div>
                    </div>
                `;
            });
            
            resultsDiv.innerHTML = html;
        } catch (error) {
            resultsDiv.innerHTML = '<div class="no-results">❌ Ошибка поиска</div>';
        }
    }, 500);
}

// Публичный профиль
async function openPublicProfile(userId) {
    if (!userId) {
        console.error('❌ openPublicProfile: userId не передан');
        return;
    }
    
    console.log('🔵 Открываем публичный профиль:', userId);
    
    currentPublicUserId = userId;
    window.isViewOnly = true;
    
    closeUserSearch();  // Закрываем поиск если открыт
    
    const modal = document.getElementById('publicProfileModal');
    const container = document.getElementById('publicProfileContent');
    
    modal.style.display = 'flex';
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Загрузка профиля...</div>';
    
    try {
        // Загружаем профиль
        const response = await fetch(`${SERVER_URL}/api/public_profile?user_id=${userId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const profile = await response.json();
        
        if (profile.status === 'error') {
            throw new Error(profile.message || 'Ошибка загрузки');
        }
        
        console.log('✅ Профиль загружен:', profile);
        
        // Загружаем работы пользователя
        const artworksResponse = await fetch(`${SERVER_URL}/api/artworks?user_id=${userId}`);
        if (artworksResponse.ok) {
            userArtworks = await artworksResponse.json();
            profile.artworks = userArtworks;
        }
        
        renderPublicProfile(profile);
        
    } catch (error) {
        console.error('❌ Ошибка загрузки профиля:', error);
        container.innerHTML = `<div class="no-results" style="padding: 20px;">❌ Ошибка загрузки профиля: ${error.message}</div>`;
    }
}

function closePublicProfile() {
    document.getElementById('publicProfileModal').style.display = 'none';
    currentPublicUserId = null;
    window.isViewOnly = false; // ✅ Возвращаем возможность удаления в своем профиле
    
    // ✅ Восстанавливаем свои работы
    loadUserArtworks();
}
        const EMOJI_BG_MAP = {
    'bg_emoji_stars': '⭐',
    'bg_emoji_hearts': '❤️',
    'bg_emoji_money': '$',
    'bg_emoji_crowns': '👑',
    'bg_emoji_diamonds': '💎',
    'bg_emoji_fire': '🔥',
    'bg_emoji_rocket': '🚀',
    'bg_emoji_clown': '🤡',
    'bg_emoji_dino': '🦖',
    'bg_emoji_dragon': '🐉',
    'bg_emoji_rainbow': '🌈',
    'bg_emoji_butterfly': '🦋',
    'bg_emoji_alien': '👽',
    'bg_emoji_flower': '🌸',
    'bg_emoji_ghost': '👻',
    'bg_emoji_skull': '💀',
    'bg_emoji_unicorn': '🦄',
    'bg_emoji_clover': '🍀',
    'bg_emoji_meteor': '☄️',
    'bg_emoji_lightning': '⚡',
    'bg_emoji_pill': '💊'
};
        
function renderPublicProfile(profile) {
    console.log('🔵 renderPublicProfile вызвана с профилем:', profile);
    
    const container = document.getElementById('publicProfileContent');
    if (!container) {
        console.error('❌ container не найден');
        return;
    }
    
    if (!profile || profile.status === 'error') {
        container.innerHTML = '<div class="no-results">❌ Профиль не найден</div>';
        return;
    }
    
    const profileUserId = profile.user_id || currentPublicUserId;
    const avatarUrl = profile.avatar || 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av1.png';
    const userName = profile.name || profile.username || 'Пользователь';
    const userStatus = profile.status || 'Без статуса';
    
    // Подложка и цвета текста
    const sponsorBgId = profile.sponsor_background_id || '';
    const sponsorBg = profile.sponsor_background || '';
    let profileBgStyle = 'margin: 0; padding: 15px;';
    
    // Определяем цвет текста и позицию по подложке
    const bgItem = BACKGROUNDS_SHOP.find(b => b.id === sponsorBgId);
    const textColor = bgItem ? bgItem.textColor : null;
    const bgPosition = bgItem ? bgItem.bgPosition : null;
    let nameColor = '';
    let statusColor = '';
    let statusBgStyle = '';
    let levelColor = '';
    
    if (textColor === 'light') {
        nameColor = 'color: #ffffff;';
        statusColor = 'color: #ffffff;';
        statusBgStyle = 'background: rgba(255,255,255,0.2);';
        levelColor = 'color: #ffffff;';
    } else if (textColor === 'dark') {
        nameColor = 'color: #1c1c1e;';
        statusColor = 'color: #1c1c1e;';
        statusBgStyle = 'background: rgba(0,0,0,0.08);';
        levelColor = 'color: #8e8e93;';
    }
    
    if (sponsorBg && !sponsorBgId.startsWith('bg_emoji_')) {
        profileBgStyle = sponsorBg + ' margin: 0; padding: 15px; border-radius: 24px; display: flex; align-items: center; gap: 20px;';
        // Добавляем позицию фона если указана
        if (bgPosition) {
            profileBgStyle += ' background-position: ' + bgPosition + ';';
        }
    }
    
    const statusBg = profile.status_background || '';
    const statusStyle = statusBg 
        ? statusBg + ' padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; ' + statusColor
        : statusBgStyle + ' padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; ' + statusColor;
    
    const avatarBorder = profile.avatar_border || '';
    const avatarBorderStyle = avatarBorder ? avatarBorder + ' width: 90px; height: 90px; border-radius: 50%; padding: 3px; background: var(--bg);' : '';
    
    const figures = profile.figures || [];
    const figuresCount = figures.length;
    
    const coloringBooks = profile.coloring_books || { paint_by_number: [], alcohol: [], pencil: [], custom: [] };
    let booksCount = 0;
    for (const cat in coloringBooks) {
        if (coloringBooks[cat]) {
            booksCount += coloringBooks[cat].length || 0;
        }
    }
    
    const wishlist = profile.wishlist || [];
    const wishlistCount = wishlist.length;
    
    const isOwnProfile = (String(profile.user_id) === String(profileUserId));
    const isFriend = myFriends.some(function(f) { 
        return String(f.user_id) === String(profile.user_id) || String(f.id) === String(profile.user_id); 
    });
    
    const completedPages = profile.completed_pages || {};
    const completedPagesDates = profile.completed_pages_dates || {};
    const artworks = profile.artworks || {};
    
    let totalWorks = 0, monthWorks = 0, lastMonthWorks = 0;
    const now = new Date();
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).getTime();
    
    for (const bookKey in completedPages) {
        if (completedPages.hasOwnProperty(bookKey)) {
            for (const page in completedPages[bookKey]) {
                if (completedPages[bookKey].hasOwnProperty(page)) {
                    totalWorks++;
                    const date = completedPagesDates[bookKey + '|' + page] || 0;
                    if (date >= monthAgo) monthWorks++;
                    if (date >= lastMonthStart && date <= lastMonthEnd) lastMonthWorks++;
                }
            }
        }
    }
    
    const friendButtonHtml = (function() {
        if (isOwnProfile) return '';
        if (isFriend) {
            return '<button class="already-friend-btn" disabled><i class="fas fa-check"></i> В друзьях</button>';
        }
        return '<button class="add-friend-btn" onclick="addFriend(\'' + profileUserId + '\')"><i class="fas fa-user-plus"></i> Добавить в друзья</button>';
    })();
    
    const html = `
        <div class="profile-header-block" style="${profileBgStyle}">
            <div class="avatar-wrapper" style="${avatarBorderStyle}">
                <img src="${avatarUrl}" onerror="this.src='https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av1.png'">
            </div>
            <div class="profile-info">
                <div class="name-row"><h2 style="${nameColor}">${escapeHtml(userName)}</h2></div>
                <span class="status-badge" style="${statusStyle}">${escapeHtml(userStatus)}</span>
                <div id="publicUserLevel" style="margin-top: 8px; ${levelColor}"></div>
                ${friendButtonHtml}
            </div>
        </div>
        
        <div class="inventory-main-block" style="margin-top: 10px;">
            <div class="inventory-header" onclick="toggleBlock('modalStatsContent', 'modalStatsArrow')">
                <div class="inventory-header-left"><i class="fas fa-chart-bar"></i><span>Статистика</span></div>
                <i class="fas fa-chevron-down" id="modalStatsArrow" style="transform: rotate(180deg);"></i>
            </div>
            <div id="modalStatsContent" class="inventory-content" style="display: block;">
                <div class="stats-numbers" style="margin-bottom:15px;">
                    <div class="stats-number-card active" id="pubCardLastMonth" onclick="switchPublicStats('lastmonth')">
                        <div class="number">${lastMonthWorks}</div>
                        <div class="label">За прошлый месяц</div>
                    </div>
                    <div class="stats-number-card" id="pubCardMonth" onclick="switchPublicStats('month')">
                        <div class="number">${monthWorks}</div>
                        <div class="label">За месяц</div>
                    </div>
                    <div class="stats-number-card" id="pubCardTotal" onclick="switchPublicStats('total')">
                        <div class="number">${totalWorks}</div>
                        <div class="label">Всего</div>
                    </div>
                </div>
                <div id="pubStatsBooksList"></div>
            </div>
        </div>
        
        <div class="inventory-main-block" style="margin-top: 10px;">
            <div class="inventory-header" onclick="toggleBlock('modalFiguresContent', 'modalFiguresArrow')">
                <div class="inventory-header-left"><i class="fas fa-users"></i><span>Коллекция персонажей</span></div>
                <div class="inventory-header-right"><span class="collection-badge">${figuresCount}/50</span><i class="fas fa-chevron-down" id="modalFiguresArrow"></i></div>
            </div>
            <div id="modalFiguresContent" class="inventory-content" style="display: none;">
                <div id="modalFiguresGrid" class="collection-grid"></div>
            </div>
        </div>
        
        <div class="inventory-main-block" style="margin-top: 10px;">
            <div class="inventory-header" onclick="toggleBlock('modalBooksContent', 'modalBooksArrow')">
                <div class="inventory-header-left"><i class="fas fa-book"></i><span>Коллекция раскрасок</span></div>
                <div class="inventory-header-right"><span class="collection-badge">${booksCount}</span><i class="fas fa-chevron-down" id="modalBooksArrow"></i></div>
            </div>
            <div id="modalBooksContent" class="inventory-content" style="display: none;">
                <div id="modalBooksList"></div>
            </div>
        </div>
        
        <div class="inventory-main-block" style="margin-top: 10px;">
            <div class="inventory-header" onclick="toggleBlock('modalWishlistContent', 'modalWishlistArrow')">
                <div class="inventory-header-left"><i class="fas fa-heart"></i><span>Список желаний</span></div>
                <div class="inventory-header-right"><span class="collection-badge">${wishlistCount}</span><i class="fas fa-chevron-down" id="modalWishlistArrow"></i></div>
            </div>
            <div id="modalWishlistContent" class="inventory-content" style="display: none;">
                <div id="modalWishlistGrid" class="category-items" style="grid-template-columns: repeat(2, 1fr);"></div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Применяем эмодзи-подложку через JS
    if (sponsorBgId && sponsorBgId.startsWith('bg_emoji_')) {
        setTimeout(() => {
            const block = container.querySelector('.profile-header-block');
            if (block) {
                const emoji = EMOJI_BG_MAP[sponsorBgId] || '⭐';
                const hex = getAccentHex();
                block.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 55 55'%3E%3Ctext x='8' y='25' font-size='20' fill='%23${hex}' opacity='0.15'%3E${encodeURIComponent(emoji)}%3C/text%3E%3Ctext x='30' y='45' font-size='16' fill='%23${hex}' opacity='0.10'%3E${encodeURIComponent(emoji)}%3C/text%3E%3C/svg%3E")`;
                block.style.backgroundSize = '55px 55px';
            }
        }, 150);
    }
    
    // Применяем цвета текста и позицию для GIF-подложек
    if (textColor || bgPosition) {
        setTimeout(() => {
            const block = container.querySelector('.profile-header-block');
            if (block) {
                // Применяем позицию фона
                if (bgPosition) {
                    block.style.backgroundPosition = bgPosition;
                }
                // Применяем цвет текста
                if (textColor === 'light') {
                    const nameEl = block.querySelector('h2');
                    const statusEl = block.querySelector('.status-badge');
                    const levelEl = block.querySelector('#publicUserLevel');
                    if (nameEl) nameEl.style.color = '#ffffff';
                    if (statusEl && !profile.status_background) {
                        statusEl.style.color = '#ffffff';
                        statusEl.style.background = 'rgba(255,255,255,0.2)';
                    } else if (statusEl) {
                        statusEl.style.color = '#ffffff';
                    }
                    if (levelEl) {
                        levelEl.style.color = '#ffffff';
                        const children = levelEl.querySelectorAll('*');
                        children.forEach(c => { if (c.style) c.style.color = '#ffffff'; });
                    }
                } else if (textColor === 'dark') {
                    const nameEl = block.querySelector('h2');
                    const statusEl = block.querySelector('.status-badge');
                    const levelEl = block.querySelector('#publicUserLevel');
                    if (nameEl) nameEl.style.color = '#1c1c1e';
                    if (statusEl && !profile.status_background) {
                        statusEl.style.color = '#1c1c1e';
                        statusEl.style.background = 'rgba(0,0,0,0.08)';
                    } else if (statusEl) {
                        statusEl.style.color = '#1c1c1e';
                    }
                    if (levelEl) {
                        levelEl.style.color = '#8e8e93';
                        const children = levelEl.querySelectorAll('*');
                        children.forEach(c => { if (c.style) c.style.color = '#8e8e93'; });
                    }
                }
            }
        }, 200);
    }
    
    const booksStats = {};
    for (const bookKey in completedPages) {
        if (completedPages.hasOwnProperty(bookKey)) {
            let category = 'paint_by_number';
            if (bookKey.startsWith('alcohol_')) category = 'alcohol';
            else if (bookKey.startsWith('pencil_')) category = 'pencil';
            else if (bookKey.startsWith('custom_')) category = 'custom';
            
            const bookName = bookKey.substring(category.length + 1);
            if (!booksStats[bookName]) {
                booksStats[bookName] = { works: [], cat: category };
            }
            
            for (const page in completedPages[bookKey]) {
                if (completedPages[bookKey].hasOwnProperty(page)) {
                    const date = completedPagesDates[bookKey + '|' + page] || 0;
                    const artworkUrl = (artworks[bookKey] && artworks[bookKey][page]) || '';
                    booksStats[bookName].works.push({
                        page: page,
                        date: date,
                        artwork: artworkUrl,
                        bookKey: bookKey
                    });
                }
            }
        }
    }
    
    container._pubBooksStats = booksStats;
    container._pubPeriod = 'lastmonth';
    container._pubUserId = profileUserId;
    container._lastMonthStart = lastMonthStart;
    container._lastMonthEnd = lastMonthEnd;
    container._monthAgo = monthAgo;
    container.dataset.profile = JSON.stringify(profile);
    
    if (typeof renderPublicStatsBooks === 'function') {
        renderPublicStatsBooks();
    }
    
    setTimeout(function() {
        const xp = profile.xp || 0;
        const levelInfo = getUserLevelInfo(xp);
        const levelEl = document.getElementById('publicUserLevel');
        if (levelEl) {
            levelEl.innerHTML = `
                <div style="font-size: 12px; margin-bottom: 4px; ${levelColor}">${levelInfo.name}</div>
                <div class="progress-bar-container" style="height: 4px;">
                    <div class="progress-bar-fill" style="width: ${levelInfo.progress}%;"></div>
                </div>
                <div style="font-size: 10px; margin-top: 2px; ${levelColor}">${levelInfo.xp} / ${levelInfo.nextXP} XP</div>
            `;
        }
        
        const figuresContainer = document.getElementById('modalFiguresGrid');
        if (figuresContainer && typeof renderPublicFigures === 'function') {
            renderPublicFigures(figures);
        }
        
        const booksContainer = document.getElementById('modalBooksList');
        if (booksContainer && typeof renderPublicBooks === 'function') {
            renderPublicBooks(coloringBooks, artworks, profileUserId);
        }
        
        const wishlistContainer = document.getElementById('modalWishlistGrid');
        if (wishlistContainer && typeof renderPublicWishlist === 'function') {
            renderPublicWishlist(wishlist);
        }
    }, 100);
    
    console.log('renderPublicProfile done');
}
function switchPublicStats(period) {
    var container = document.getElementById('publicProfileContent');
    container._pubPeriod = period;
    
    var lastMonthEl = document.getElementById('pubCardLastMonth');
    var monthEl = document.getElementById('pubCardMonth');
    var totalEl = document.getElementById('pubCardTotal');
    var selectorEl = document.getElementById('pubStatsMonthSelector');
    
    if (lastMonthEl) lastMonthEl.classList.toggle('active', period === 'lastmonth');
    if (monthEl) monthEl.classList.toggle('active', period === 'month');
    if (totalEl) totalEl.classList.toggle('active', period === 'total' || period === 'custom');
    if (selectorEl) selectorEl.style.display = (period === 'total' || period === 'custom') ? 'flex' : 'none';
    
    renderPublicStatsBooks();
}
function renderPublicStatsBooks() {
    console.log('🔵🔵🔵 renderPublicStatsBooks ВЫЗВАНА 🔵🔵🔵');
    
    var container = document.getElementById('publicProfileContent');
    if (!container) {
        console.error('❌ container (publicProfileContent) не найден!');
        return;
    }
    
    var booksStats = container._pubBooksStats || {};
    var period = container._pubPeriod || 'lastmonth';
    var profile = JSON.parse(container.dataset.profile || '{}');
    var profileBooks = profile.coloring_books || {};
    
    // ✅ Используем сохраненные временные метки из контейнера
    var lastMonthStart = container._lastMonthStart || 0;
    var lastMonthEnd = container._lastMonthEnd || 0;
    var monthAgo = container._monthAgo || 0;
    
    console.log('🔄 RPSB period:', period);
    console.log('🔄 lastMonthStart:', new Date(lastMonthStart), 'timestamp:', lastMonthStart);
    console.log('🔄 lastMonthEnd:', new Date(lastMonthEnd), 'timestamp:', lastMonthEnd);
    console.log('🔄 monthAgo:', new Date(monthAgo), 'timestamp:', monthAgo);
    console.log('🔄 Всего книг в booksStats:', Object.keys(booksStats).length);
    console.log('🔄 booksStats:', JSON.stringify(booksStats, null, 2));
    
    var listContainer = document.getElementById('pubStatsBooksList');
    if (!listContainer) {
        console.error('❌ pubStatsBooksList не найден!');
        return;
    }
    
    var html = '';
    var hasBooks = false;
    var totalFilteredWorks = 0;
    
    for (var bookName in booksStats) {
        var stat = booksStats[bookName];
        
        console.log(`📚 Обработка книги "${bookName}":`);
        console.log(`   Всего работ: ${stat.works.length}`);
        console.log(`   lastmonth (предподсчитано): ${stat.lastmonth}`);
        console.log(`   month (предподсчитано): ${stat.month}`);
        console.log(`   total (предподсчитано): ${stat.total}`);
        
        // Показываем первые 3 работы с датами для примера
        var sampleWorks = stat.works.slice(0, 3);
        sampleWorks.forEach(function(w, i) {
            console.log(`   Работа ${i+1}: дата=${new Date(w.date).toISOString()}, timestamp=${w.date}, page=${w.page}`);
            console.log(`      inLastMonth: ${w.date >= lastMonthStart && w.date <= lastMonthEnd}`);
            console.log(`      inMonth: ${w.date >= monthAgo}`);
        });
        
        var filteredWorks;
        if (period === 'lastmonth') {
            filteredWorks = stat.works.filter(function(w) { 
                var result = w.date > 0 && w.date >= lastMonthStart && w.date <= lastMonthEnd;
                return result;
            });
            console.log(`   📚 "${bookName}": отфильтровано за прошлый месяц=${filteredWorks.length}`);
        } else if (period === 'month') {
            filteredWorks = stat.works.filter(function(w) { 
                return w.date > 0 && w.date >= monthAgo; 
            });
            console.log(`   📚 "${bookName}": отфильтровано за месяц=${filteredWorks.length}`);
        } else {
            filteredWorks = stat.works;
            console.log(`   📚 "${bookName}": показаны все=${filteredWorks.length}`);
        }
        
        totalFilteredWorks += filteredWorks.length;
        
        if (filteredWorks.length === 0) {
            console.log(`   ⚠️ Книга "${bookName}" пропущена (нет работ за период)`);
            continue;
        }
        hasBooks = true;
        
        var coverUrl = DEFAULT_COVERS[bookName] || '';
        if (!coverUrl) {
            var cat = stat.cat || 'paint_by_number';
            var userBooks = profileBooks[cat] || [];
            var savedBook = userBooks.find(function(b) { return (typeof b === 'string' ? b : b.name) === bookName; });
            if (savedBook && typeof savedBook === 'object' && savedBook.cover) { 
                coverUrl = savedBook.cover;
                // ✅ Исправляем путь к обложке
                if (coverUrl.startsWith('/')) coverUrl = SERVER_URL + coverUrl;
            }
        }
        
        html += '<div class="inventory-subblock" style="margin-bottom:10px;background:var(--bg);border-radius:12px;border:1px solid var(--border-color);overflow:hidden;">';
        html += '<div class="subblock-header" onclick="toggleStatsBook(this)" style="display:flex;justify-content:space-between;align-items:center;padding:12px 15px;cursor:pointer;">';
        html += '<div style="display:flex;align-items:center;gap:10px;">';
        if (coverUrl) html += '<img src="' + coverUrl + '" style="width:35px;height:47px;object-fit:cover;border-radius:5px;" onerror="this.style.display=\'none\'">';
        html += '<div><strong>' + bookName + '</strong><span style="margin-left:8px;font-size:13px;color:var(--text-gray);">' + filteredWorks.length + '</span></div>';
        html += '</div>';
        html += '<i class="fas fa-chevron-down" style="color:var(--text-gray);transition:transform 0.3s;"></i>';
        html += '</div>';
        html += '<div class="subblock-content" style="display:none;padding:10px 15px;border-top:1px solid var(--border-color);">';
        html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">';
        
        filteredWorks.sort(function(a, b) { return b.date - a.date; });
        
        filteredWorks.forEach(function(w) {
            var dateStr = w.date ? new Date(w.date).toLocaleDateString('ru-RU') : '';
            if (w.artwork) {
                // ✅ Исправляем путь к artwork
                var artworkUrl = w.artwork;
                if (artworkUrl && artworkUrl.startsWith('/')) {
                    artworkUrl = SERVER_URL + artworkUrl;
                }
                
                html += '<div class="book-page-btn uploaded" style="aspect-ratio:1;overflow:hidden;border-radius:10px;cursor:pointer;position:relative;" onclick="viewArtwork(\'' + w.bookKey.replace(/'/g, "\\'") + '\', \'' + w.page + '\')">';
                html += '<img src="' + artworkUrl + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\';">';
                if (dateStr) html += '<span style="position:absolute;bottom:2px;right:4px;font-size:9px;background:rgba(0,0,0,0.6);color:white;padding:1px 4px;border-radius:4px;">' + dateStr + '</span>';
                html += '</div>';
            } else {
                html += '<div class="book-page-btn completed" style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:12px;position:relative;">';
                html += '<div style="text-align:center;"><div style="font-size:20px;">📸</div><div style="font-size:10px;">стр. ' + w.page + '</div>';
                if (dateStr) html += '<span style="font-size:9px;color:var(--text-gray);">' + dateStr + '</span>';
                html += '</div></div>';
            }
        });
        
        html += '</div></div></div>';
    }
    
    console.log(`✅ Итого отфильтровано работ: ${totalFilteredWorks}, книг показано: ${hasBooks ? 'да' : 'нет'}`);
    console.log('🔵🔵🔵 renderPublicStatsBooks ЗАВЕРШЕНА 🔵🔵🔵');
    
    if (!hasBooks) html = '<div class="no-results" style="padding:20px;text-align:center;color:var(--text-gray);">Нет работ за этот период</div>';
    listContainer.innerHTML = html;
}
function countColoringBooks(books) {
    if (!books) return 0;
    let total = 0;
    for (const cat in books) {
        total += books[cat]?.length || 0;
    }
    return total;
}


// Универсальное переключение блоков в модалке
        function toggleBlock(contentId, arrowId) {
    const content = document.getElementById(contentId);
    const arrow = document.getElementById(arrowId);
    
    if (!content || !arrow) return;
    
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        arrow.style.transform = 'rotate(180deg)';
        
        const container = document.getElementById('publicProfileContent');
        const profile = JSON.parse(container.dataset.profile || '{}');
        
        if (contentId === 'modalFiguresContent') {
            renderPublicFigures(profile.figures || []);
        } else if (contentId === 'modalMarkersContent') {
            renderPublicMarkers(profile.markers || {});
        } else if (contentId === 'modalBooksContent') {
            renderPublicBooks(profile.coloring_books || {}, profile.artworks || {}, profile.user_id);
        } else if (contentId === 'modalWishlistContent') {
            // ✅ Рендеринг вишлиста
            renderPublicWishlist(profile.wishlist || []);
        }
    } else {
        content.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)';
    }
}

// Рендеринг публичных фигурок
function renderPublicFigures(figures) {
    const container = document.getElementById('modalFiguresGrid');
    if (!container) return;
    
    let html = '';
    COLLECTION_FIGURES.forEach(figure => {
        const isUnlocked = figures.includes(figure.id) || figures.includes(String(figure.id));
        
        html += `
            <div class="collection-card">
                <div class="collection-card-image">
                    <img src="${figure.img}" class="${!isUnlocked ? 'locked' : ''}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23ff9500%22 rx=%2212%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2240%22%3E🎁%3C/text%3E%3C/svg%3E'">
                    ${!isUnlocked ? '<div class="lock-overlay"><i class="fas fa-lock"></i></div>' : ''}
                </div>
                <div class="collection-card-name">${figure.name}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Рендеринг публичных маркеров (упрощённо)
function renderPublicMarkers(markers) {
    const container = document.getElementById('modalMarkersList');
    if (!container) return;
    
    const count = Object.keys(markers).length;
    container.innerHTML = `<div style="padding: 15px; text-align: center; color: var(--text);">📊 Всего маркеров: ${count}</div>`;
}

// Рендеринг публичных раскрасок
function renderPublicBooks(books, artworks, userId) {
    const container = document.getElementById('modalBooksList');
    if (!container) return;
    
    const categories = ['paint_by_number', 'alcohol', 'pencil', 'custom'];
    const categoryNames = {
        paint_by_number: 'По номерам',
        alcohol: 'Спиртовые',
        pencil: 'Карандаши',
        custom: 'Другие'
    };
    
    let html = `
        <div class="search-box" style="margin-bottom: 15px;">
            <i class="fas fa-search"></i>
            <input type="text" 
                   id="publicBooksSearch" 
                   placeholder="Поиск по названию раскраски..." 
                   oninput="filterPublicBooks()"
                   style="width: 100%;">
        </div>
        <div id="publicBooksFilteredContent">
    `;
    
    window.publicBooksData = { books, artworks, userId };
    
    const container_profile = document.getElementById('publicProfileContent');
    const profile = JSON.parse(container_profile.dataset.profile || '{}');
    const completedPages = profile.completed_pages || {};
    
    let hasAnyBooks = false;
    
    categories.forEach(category => {
        const userBooks = books[category] || [];
        
        if (userBooks.length === 0) return;
        
        hasAnyBooks = true;
        
        html += `
            <div class="public-category" data-category="${category}">
                <h4 style="margin: 15px 0 10px;">${categoryNames[category]}</h4>
                <div class="category-items" style="grid-template-columns: repeat(2, 1fr);">
        `;
        
        userBooks.forEach(book => {
            const bookName = typeof book === 'string' ? book : book.name;
            const bookKey = `${category}_${bookName}`;
            const hasArtworks = artworks[bookKey] ? Object.keys(artworks[bookKey]).length : 0;
            
            // ✅ Получаем totalPages: кастомные из данных, обычные из конфига
            let totalPages;
            if (typeof book === 'object' && book.custom && book.totalPages) {
                totalPages = book.totalPages;
            } else {
                totalPages = BOOK_PAGES_CONFIG[bookName]?.totalPages || DEFAULT_PAGES_CONFIG.totalPages;
            }
            
            // ✅ Считаем отмеченные страницы (разворот = 2 страницы)
            const bookCompletedPages = completedPages[bookKey] || {};
            let completedCount = 0;
            
            for (const page in bookCompletedPages) {
                if (page.includes('-')) {
                    completedCount += 2;
                } else {
                    completedCount += 1;
                }
            }
            
            const progressPercent = totalPages > 0 ? Math.round((completedCount / totalPages) * 100) : 0;
            
            let coverUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23ff9500' rx='12'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='40' font-family='Arial'%3E📚%3C/text%3E%3C/svg%3E";
            
            if (typeof book === 'object' && book.cover) {
                coverUrl = book.cover;
                if (coverUrl.startsWith('/')) coverUrl = SERVER_URL + coverUrl;
            } else if (DEFAULT_COVERS[bookName]) {
                coverUrl = DEFAULT_COVERS[bookName];
            }
            
            html += `
                <div class="coloring-book-item" 
                     data-book-name="${bookName.toLowerCase()}"
                     onclick="viewPublicBook('${userId}', '${category}', '${bookName.replace(/'/g, "\\'")}', ${hasArtworks})">
                    <img src="${coverUrl}" class="book-cover" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23ff9500%22 rx=%2212%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2240%22 font-family=%22Arial%22%3E📚%3C/text%3E%3C/svg%3E'">
                    <div class="book-info">
                        <div class="book-name">${bookName}</div>
                        <div class="book-progress-container" style="margin-top: 5px;">
                            <div class="book-progress-bar" style="width: 100%; height: 4px; background: var(--border-color); border-radius: 2px; overflow: hidden;">
                                <div class="book-progress-fill" style="width: ${progressPercent}%; height: 100%; background: var(--accent);"></div>
                            </div>
                            <div class="book-progress-text" style="font-size: 10px; color: var(--text-gray); margin-top: 2px;">
                                ${completedCount}/${totalPages} (${progressPercent}%)
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `</div></div>`;
    });
    
    if (!hasAnyBooks) {
        html += '<div class="no-results" style="padding: 20px; text-align: center; color: var(--text-gray);">Нет раскрасок в коллекции</div>';
    }
    
    html += `</div>`;
    
    container.innerHTML = html;
}

// Просмотр публичной раскраски (страницы)

function viewPublicBook(userId, category, bookName, hasArtworks) {
    const container = document.getElementById('publicProfileContent');
    const profile = JSON.parse(container.dataset.profile || '{}');
    const completedPages = profile.completed_pages || {};
    
    const bookKey = `${category}_${bookName}`;
    const bookCompleted = completedPages[bookKey] || {};
    
    let completedPagesCount = 0;
    for (const page in bookCompleted) {
        if (page.includes('-')) {
            completedPagesCount += 2;
        } else {
            completedPagesCount += 1;
        }
    }
    
    if (completedPagesCount === 0) {
        if (tg) tg.showAlert('У пользователя нет отмеченных страниц в этой раскраске');
        else alert('Нет отмеченных страниц');
        return;
    }
    
    const userBooks = profile.coloring_books?.[category] || [];
    const savedBook = userBooks.find(b => {
        const name = typeof b === 'string' ? b : b.name;
        return name === bookName;
    });
    
    // ✅ Для кастомных — из данных, для обычных — из конфига
    let config;
    if (savedBook && typeof savedBook === 'object' && savedBook.custom) {
        config = {
            totalPages: savedBook.totalPages || DEFAULT_PAGES_CONFIG.totalPages,
            spreads: savedBook.spreads || []
        };
    } else {
        config = BOOK_PAGES_CONFIG[bookName] || DEFAULT_PAGES_CONFIG;
    }
    
    window.isViewOnly = true;
    
    currentBook = bookName;
    currentCategory = category;
    userCompletedPages = completedPages;
    
    document.getElementById('bookPagesTitle').innerText = bookName;
    
    let infoText = `Отмечено: ${completedPagesCount} / ${config.totalPages} стр.`;
    
    const spreadsCount = config.spreads?.length || 0;
    if (spreadsCount > 0) {
        infoText += ` • ${spreadsCount} разв.`;
    }
    
    document.getElementById('bookPagesCategory').innerText = infoText;
    
    renderBookPagesGrid(bookKey, config);
    
    const bookModal = document.getElementById('bookPagesModal');
    bookModal.style.display = 'flex';
    bookModal.style.zIndex = '100002';
    
    const profileModal = document.getElementById('publicProfileModal');
    if (profileModal) profileModal.style.opacity = '0.3';
}
// Открыть список друзей (с поиском пользователей)
// Открыть список друзей (с поиском пользователей)
async function openFriendsList() {
    const modal = document.getElementById('friendsListModal');
    const container = document.getElementById('friendsListContainer');
    
    modal.style.display = 'flex';
    container.innerHTML = `
        <h4 style="margin-bottom: 10px;">Найти друзей</h4>
        <div class="search-box" style="margin-bottom: 15px;">
            <i class="fas fa-search"></i>
            <input type="text" id="friendsSearchInput" placeholder="Поиск по username или никнейму..." oninput="searchUsersInFriends()">
        </div>
        <div id="friendsSearchResults"></div>
        <hr style="margin: 15px 0;">
        <div id="friendsListInner">
            <div class="loading"><i class="fas fa-spinner fa-spin"></i> Загрузка...</div>
        </div>
    `;
    
    try {
        await loadMyFriends();
        renderFriendsListInner();
    } catch (error) {
        document.getElementById('friendsListInner').innerHTML = '<div class="no-results">❌ Ошибка загрузки</div>';
    }
}

function renderFriendsListInner() {
    const container = document.getElementById('friendsListInner');
    if (!container) return;
    
    if (myFriends.length === 0) {
        container.innerHTML = '<div class="no-results" style="padding: 20px;">😕 У вас пока нет друзей</div>';
        return;
    }
    
    let html = '<h4 style="margin-bottom: 10px;">Мои друзья</h4>';
    myFriends.forEach(function(friend) {
        const friendUserId = friend.user_id;
        
        // ✅ Формируем отображаемое имя (без дублирования)
        let displayName = friend.name || 'Пользователь';
        let displayUsername = '';
        
        // Если username есть и он не совпадает с именем
        if (friend.username && friend.username !== displayName) {
            displayUsername = friend.username;
        }
        
        // ✅ Аватар: если есть URL — используем его, иначе дефолтный
        const avatarUrl = friend.avatar && friend.avatar !== '' 
            ? friend.avatar 
            : 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av1.png';
        
        html += `
            <div class="friend-card">
                <img src="${avatarUrl}" class="friend-avatar" onerror="this.src='https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av1.png'">
                <div class="friend-info">
                    <div class="friend-name">${escapeHtml(displayName)}</div>
                    ${displayUsername ? `<div class="friend-username">${escapeHtml(displayUsername)}</div>` : ''}
                </div>
                <div style="display: flex; gap: 5px;">
                    <button class="friend-view-btn" onclick="viewFriendProfile('${friendUserId}')">
                        <i class="fas fa-user"></i>
                    </button>
                    <button class="friend-remove-btn" onclick="confirmRemoveFriend('${friendUserId}', '${escapeHtml(displayName).replace(/'/g, "\\'")}')">
                        <i class="fas fa-user-minus"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}
let friendsSearchTimeout = null;

function searchUsersInFriends() {
    const input = document.getElementById('friendsSearchInput');
    const query = input.value.trim();
    const resultsDiv = document.getElementById('friendsSearchResults');
    
    if (friendsSearchTimeout) clearTimeout(friendsSearchTimeout);
    
    if (query.length < 2) {
        resultsDiv.innerHTML = '';
        return;
    }
    
    resultsDiv.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Поиск...</div>';
    
    friendsSearchTimeout = setTimeout(async () => {
        try {
            const response = await fetch(`${SERVER_URL}/api/search_users?query=${encodeURIComponent(query)}`);
            const users = await response.json();
            
            if (users.length === 0) {
                resultsDiv.innerHTML = '<div class="no-results" style="padding: 10px;">😕 Ничего не найдено</div>';
                return;
            }
            
            let html = '';
            users.forEach(user => {
                const avatarUrl = user.avatar || 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av1.png';
                const isFriend = myFriends.some(f => String(f.user_id) === String(user.user_id));
                const isMe = String(user.user_id) === String(userId);
                
                html += `
                    <div class="friend-card" style="cursor: pointer;" onclick="${isMe ? '' : `viewFriendProfile('${user.user_id}')`}">
                        <img src="${avatarUrl}" class="friend-avatar" onerror="this.src='https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av1.png'">
                        <div class="friend-info">
                            <div class="friend-name">${user.name} ${isMe ? '(вы)' : ''}</div>
                            <div class="friend-username">${user.username}</div>
                            <div style="font-size: 11px; color: var(--accent);">${user.status || 'Без статуса'}</div>
                        </div>
                        ${!isMe && !isFriend ? `
                            <button class="friend-view-btn" onclick="event.stopPropagation(); addFriend('${user.user_id}')" style="background: var(--accent);">
                                <i class="fas fa-user-plus"></i>
                            </button>
                        ` : ''}
                    </div>
                `;
            });
            
            resultsDiv.innerHTML = html;
        } catch (error) {
            resultsDiv.innerHTML = '<div class="no-results">❌ Ошибка поиска</div>';
        }
    }, 500);
}

function closeFriendsList() {
    document.getElementById('friendsListModal').style.display = 'none';
}

function viewFriendProfile(friendId) {
    console.log('🔵 viewFriendProfile вызвана с friendId:', friendId);
    closeFriendsList();
    if (friendId) {
        openPublicProfile(friendId);
    } else {
        console.error('❌ friendId не передан');
    }
}

function confirmRemoveFriend(friendId, friendName) {
    if (tg) {
        tg.showConfirm(`Удалить «${friendName}» из друзей?`, (confirm) => {
            if (confirm) removeFriend(friendId);
        });
    } else {
        if (confirm(`Удалить «${friendName}» из друзей?`)) {
            removeFriend(friendId);
        }
    }
}

async function removeFriend(friendId) {
    console.log('🔵 removeFriend вызвана с friendId:', friendId);
    
    try {
        const response = await fetch(`${SERVER_URL}/api/friends/remove`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, friend_id: friendId })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📡 Результат удаления друга:', result);
        
        if (result.status === 'ok') {
            await loadMyFriends();
            await openFriendsList(); // Обновляем список
            
            if (currentPublicUserId === friendId) {
                const container = document.getElementById('publicProfileContent');
                if (container && container.dataset.profile) {
                    const profile = JSON.parse(container.dataset.profile);
                    renderPublicProfile(profile);
                }
            }
            
            if (tg) tg.showAlert('❌ Удалено из друзей');
        }
    } catch (error) {
        console.error('❌ Ошибка удаления из друзей:', error);
        if (tg) tg.showAlert('❌ Ошибка при удалении из друзей');
    }
}

async function addFriend(friendId) {
    console.log('🔵 addFriend вызвана с friendId:', friendId);
    
    try {
        const response = await fetch(`${SERVER_URL}/api/friends/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, friend_id: friendId })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📡 Результат добавления друга:', result);
        
        if (result.status === 'ok') {
            await loadMyFriends();
            
            // Обновляем публичный профиль если он открыт
            if (currentPublicUserId === friendId) {
                const container = document.getElementById('publicProfileContent');
                if (container && container.dataset.profile) {
                    const profile = JSON.parse(container.dataset.profile);
                    renderPublicProfile(profile);
                }
            }
            
            // Обновляем кнопку в профиле
            const addFriendBtn = document.querySelector('.add-friend-btn');
            if (addFriendBtn) {
                addFriendBtn.outerHTML = '<button class="already-friend-btn" disabled><i class="fas fa-check"></i> В друзьях</button>';
            }
            
            if (tg) tg.showAlert('✅ Добавлено в друзья!');
        } else {
            throw new Error(result.message || 'Ошибка');
        }
    } catch (error) {
        console.error('❌ Ошибка добавления в друзья:', error);
        if (tg) tg.showAlert('❌ Ошибка при добавлении в друзья');
    }
}
async function loadMyFriends() {
    try {
        const response = await fetch(`${SERVER_URL}/api/friends?user_id=${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        console.log('📡 Загружены друзья:', data);
        
        // ✅ Сохраняем данные как есть, с аватарами
        myFriends = (data || []).map(function(friend) {
            return {
                user_id: friend.user_id,
                id: friend.id || friend.user_id,
                name: friend.name || friend.username || 'Пользователь',
                username: friend.username || '',
                avatar: friend.avatar || ''  // ← сохраняем пустым, если нет
            };
        });
        
        console.log('✅ Обработанные друзья:', myFriends);
    } catch (error) {
        console.error('Ошибка загрузки друзей:', error);
        myFriends = [];
    }
}

// Сохранение прогресса
function saveCompletedPages() {
    localStorage.setItem(`completed_pages_${userId}`, JSON.stringify(userCompletedPages));
    
    // Отправляем completed_pages
    fetch(`${SERVER_URL}/api/save_completed_pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: userId,
            completed_pages: userCompletedPages
        })
    }).catch(e => console.error('Ошибка сохранения страниц:', e));
    
    // ✅ Отправляем даты отдельно (каждую по одной)
    if (window.completedPagesDates) {
        for (var key in window.completedPagesDates) {
            fetch(`${SERVER_URL}/api/save_dates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    date_key: key,
                    date_value: window.completedPagesDates[key]
                })
            }).catch(e => console.error('Ошибка сохранения даты:', e));
        }
    }
}

// Загрузка прогресса
async function loadCompletedPages() {
    const saved = localStorage.getItem(`completed_pages_${userId}`);
    if (saved) {
        try {
            userCompletedPages = JSON.parse(saved);
        } catch(e) {
            userCompletedPages = {};
        }
    } else {
        userCompletedPages = {};
    }
    
    // Загружаем даты из localStorage
    var savedDates = localStorage.getItem('completed_pages_dates_' + userId);
    if (savedDates) {
        try {
            window.completedPagesDates = JSON.parse(savedDates);
        } catch(e) {
            window.completedPagesDates = {};
        }
    } else {
        window.completedPagesDates = {};
    }
    
    try {
        const response = await fetch(`${SERVER_URL}/api/stats?user_id=${userId}`);
        const stats = await response.json();
        if (stats && stats.completed_pages) {
            userCompletedPages = stats.completed_pages;
            localStorage.setItem(`completed_pages_${userId}`, JSON.stringify(userCompletedPages));
        }
        // ✅ Загружаем даты с сервера
        if (stats && stats.completed_pages_dates) {
            for (var key in stats.completed_pages_dates) {
                if (!window.completedPagesDates[key]) {
                    window.completedPagesDates[key] = stats.completed_pages_dates[key];
                }
            }
            localStorage.setItem('completed_pages_dates_' + userId, JSON.stringify(window.completedPagesDates));
        }
    } catch (error) {
        console.error('Ошибка загрузки с сервера:', error);
    }
    
    // ✅ Загружаем даты из отдельного API
    try {
        const datesResp = await fetch(`${SERVER_URL}/api/get_dates?user_id=${userId}`);
        const datesData = await datesResp.json();
        if (datesData && datesData.dates) {
            for (var key in datesData.dates) {
                if (!window.completedPagesDates[key]) {
                    window.completedPagesDates[key] = datesData.dates[key];
                }
            }
            localStorage.setItem('completed_pages_dates_' + userId, JSON.stringify(window.completedPagesDates));
        }
    } catch (error) {
        console.error('Ошибка загрузки дат из API:', error);
    }
    
    // ✅ Синхронизация: добавляем в completedPages все страницы, для которых есть фото в artworks
    if (userArtworks && typeof userArtworks === 'object') {
        let synced = false;
        for (const bookKey in userArtworks) {
            if (!userCompletedPages[bookKey]) userCompletedPages[bookKey] = {};
            for (const page in userArtworks[bookKey]) {
                if (!userCompletedPages[bookKey][page]) {
                    userCompletedPages[bookKey][page] = true;
                    synced = true;
                }
            }
        }
        if (synced) {
            localStorage.setItem(`completed_pages_${userId}`, JSON.stringify(userCompletedPages));
            fetch(`${SERVER_URL}/api/save_completed_pages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    completed_pages: userCompletedPages
                })
            }).catch(e => console.error('Ошибка сохранения синхронизации:', e));
            console.log('✅ Синхронизированы artworks → completedPages');
        }
    }
    
    updateAllCategoriesProgress();
}
// Обновление прогресса в карточке раскраски
function updateBookProgress(bookKey) {
    const completedCount = userCompletedPages[bookKey] ? Object.keys(userCompletedPages[bookKey]).length : 0;
    // Можно добавить отображение прогресса в карточке
}
// Фильтрация раскрасок в публичном профиле
function filterPublicBooks() {
    const searchInput = document.getElementById('publicBooksSearch');
    const filter = searchInput.value.toLowerCase().trim();
    
    const categories = document.querySelectorAll('.public-category');
    
    categories.forEach(category => {
        const items = category.querySelectorAll('.coloring-book-item');
        let visibleCount = 0;
        
        items.forEach(item => {
            const bookName = item.getAttribute('data-book-name') || '';
            
            if (filter === '' || bookName.includes(filter)) {
                item.style.display = 'flex';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Скрываем категорию если нет видимых элементов
        if (visibleCount === 0) {
            category.style.display = 'none';
        } else {
            category.style.display = 'block';
        }
    });
    
    // Показываем сообщение если ничего не найдено
    const container = document.getElementById('publicBooksFilteredContent');
    const visibleCategories = Array.from(categories).filter(c => c.style.display !== 'none');
    
    if (visibleCategories.length === 0) {
        // Добавляем сообщение если его ещё нет
        if (!document.getElementById('noPublicBooksFound')) {
            const noResults = document.createElement('div');
            noResults.id = 'noPublicBooksFound';
            noResults.className = 'no-results';
            noResults.style.cssText = 'padding: 20px; text-align: center;';
            noResults.innerHTML = '😕 Ничего не найдено';
            container.appendChild(noResults);
        }
    } else {
        const noResults = document.getElementById('noPublicBooksFound');
        if (noResults) noResults.remove();
    }
}
        function toggleWishlistBlock() {
    const content = document.getElementById('wishlistContent');
    const arrow = document.getElementById('wishlistArrow');
    
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        if (typeof Wishlist !== 'undefined') {
            Wishlist.load();
        }
    } else {
        content.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
}
       // ==========================================
// ВИШЛИСТ - УПРАВЛЕНИЕ
// ==========================================

const Wishlist = {
    currentUserId: userId,
    
    async load() {
        const grid = document.getElementById('wishlistGrid');
        const emptyEl = document.getElementById('wishlistEmpty');
        const countEl = document.getElementById('wishlistCount');
        
        if (!grid) return;
        
        try {
            const response = await fetch(`${SERVER_URL}/api/wishlist/get?user_id=${this.currentUserId}`);
            const data = await response.json();
            const wishlist = data.wishlist || [];
            
            if (countEl) countEl.textContent = wishlist.length;
            
            if (wishlist.length === 0) {
                grid.style.display = 'none';
                if (emptyEl) emptyEl.style.display = 'block';
                return;
            }
            
            grid.style.display = 'grid';
            if (emptyEl) emptyEl.style.display = 'none';
            
            grid.innerHTML = '';
            
            for (const bookId of wishlist) {
                const bookInfo = this.getBookInfo(bookId);
                const item = this.createWishlistItem(bookId, bookInfo);
                grid.appendChild(item);
            }
            
        } catch (error) {
            console.error('Ошибка загрузки вишлиста:', error);
        }
    },
    
    getBookInfo(bookId) {
        let coverUrl = DEFAULT_COVERS[bookId] || 'assets/coloriages/default.jpg';
        
        let category = 'paint_by_number';
        if (DEFAULT_COLORING_BOOKS.alcohol?.includes(bookId)) category = 'alcohol';
        else if (DEFAULT_COLORING_BOOKS.pencil?.includes(bookId)) category = 'pencil';
        
        return {
            title: bookId,
            cover: coverUrl,
            category: category
        };
    },
    
    createWishlistItem(bookId, bookInfo) {
        const div = document.createElement('div');
        div.className = 'coloring-book-item';
        div.setAttribute('data-book-name', bookId.toLowerCase());
        
        div.innerHTML = `
            <img src="${bookInfo.cover}" class="book-cover" alt="${bookInfo.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23ff9500%22 rx=%2212%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2240%22%3E📚%3C/text%3E%3C/svg%3E'">
            <div class="book-info">
                <div class="book-name">${bookInfo.title}</div>
            </div>
        `;
        
        const addBtn = document.createElement('button');
        addBtn.className = 'remove-btn';
        addBtn.innerHTML = '<i class="fas fa-plus"></i>';
        addBtn.style.cssText = 'background: var(--accent); color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-top: 8px; cursor: pointer; border: none;';
        addBtn.title = 'Добавить в коллекцию';
        addBtn.onclick = async (e) => {
            e.stopPropagation();
            const category = bookInfo.category || 'paint_by_number';
            await toggleColoringBook(category, bookId);
            await this.remove(bookId);
        };
        div.appendChild(addBtn);
        
        return div;
    },
    
    async add(bookId) {
        if (!this.currentUserId) return false;
        
        try {
            const response = await fetch(`${SERVER_URL}/api/wishlist/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: this.currentUserId, book_id: bookId })
            });
            
            const data = await response.json();
            
            if (data.status === 'ok') {
                this.updateHeartButton(bookId, true);
                await this.load();
                return true;
            }
        } catch (error) {
            console.error('Ошибка добавления:', error);
        }
        return false;
    },
    
    async remove(bookId) {
        if (!this.currentUserId) return;
        
        try {
            const response = await fetch(`${SERVER_URL}/api/wishlist/remove`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: this.currentUserId, book_id: bookId })
            });
            
            const data = await response.json();
            
            if (data.status === 'ok') {
                this.updateHeartButton(bookId, false);
                await this.load();
            }
        } catch (error) {
            console.error('Ошибка удаления:', error);
        }
    },
    
    async check(bookId) {
        if (!this.currentUserId) return false;
        
        try {
            const response = await fetch(`${SERVER_URL}/api/wishlist/get?user_id=${this.currentUserId}`);
            const data = await response.json();
            return (data.wishlist || []).includes(bookId);
        } catch (error) {
            return false;
        }
    },
    
    updateHeartButton(bookId, isInWishlist) {
        const btn = document.querySelector(`.wishlist-heart-btn[data-book-id="${bookId}"]`);
        if (!btn) return;
        
        const icon = btn.querySelector('i');
        
        if (isInWishlist) {
            btn.classList.add('active');
            if (icon) icon.className = 'fas fa-heart';
            btn.title = 'Удалить из списка желаний';
        } else {
            btn.classList.remove('active');
            if (icon) icon.className = 'far fa-heart';
            btn.title = 'Добавить в список желаний';
        }
    },
    
    showNotification(message, type = 'success') {
        try {
            if (typeof tg !== 'undefined' && tg.showAlert) {
                tg.showAlert(message);
            }
        } catch(e) {}
    },
};
// Функция переключения блока вишлиста
function toggleWishlistBlock() {
    const content = document.getElementById('wishlistContent');
    const arrow = document.getElementById('wishlistArrow');
    
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        if (typeof Wishlist !== 'undefined') {
            Wishlist.load();
        }
    } else {
        content.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
}

// Функция для добавления кнопки-сердечка на карточку раскраски
function addWishlistHeartToBookCard(cardElement, bookId) {
    if (cardElement.querySelector('.wishlist-heart-btn')) return;
    
    const heartBtn = document.createElement('button');
    heartBtn.className = 'wishlist-heart-btn';
    heartBtn.setAttribute('data-book-id', bookId);
    heartBtn.title = 'Добавить в список желаний';
    heartBtn.innerHTML = '<i class="far fa-heart"></i>';
    
    heartBtn.onclick = async (e) => {
        e.stopPropagation();
        
        const isActive = heartBtn.classList.contains('active');
        
        if (isActive) {
            await Wishlist.remove(bookId);
        } else {
            await Wishlist.add(bookId);
        }
    };
    
    Wishlist.check(bookId).then(inWishlist => {
        if (inWishlist) {
            heartBtn.classList.add('active');
            heartBtn.querySelector('i').className = 'fas fa-heart';
            heartBtn.title = 'Удалить из списка желаний';
        }
    });
    
    cardElement.style.position = 'relative';
    cardElement.appendChild(heartBtn);
}

// Модифицируем renderColoringBooks для добавления сердечек
const originalRenderColoringBooks = renderColoringBooks;
renderColoringBooks = function() {
    originalRenderColoringBooks.call(this);
    
    setTimeout(() => {
        document.querySelectorAll('.coloring-book-item').forEach(card => {
            const nameEl = card.querySelector('.book-name');
            if (nameEl) {
                const bookId = nameEl.innerText;
                addWishlistHeartToBookCard(card, bookId);
            }
        });
    }, 100);
};

// Рендеринг публичного вишлиста
function renderPublicWishlist(wishlist) {
    const container = document.getElementById('modalWishlistGrid');
    if (!container) return;
    
    if (!wishlist || wishlist.length === 0) {
        container.innerHTML = '<div class="no-results" style="grid-column: span 2; padding: 20px; text-align: center;">Список желаний пуст</div>';
        return;
    }
    
    let html = '';
    
    wishlist.forEach(bookId => {
        let coverUrl = DEFAULT_COVERS[bookId] || 'assets/coloriages/default.jpg';
        
        html += `
            <div class="coloring-book-item">
                <img src="${coverUrl}" class="book-cover" alt="${bookId}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23ff9500%22 rx=%2212%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2240%22%3E📚%3C/text%3E%3C/svg%3E'">
                <div class="book-info">
                    <div class="book-name">${bookId}</div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Текущий фильтр для раскрасок
let currentBooksFilter = 'all';

function setBooksFilter(filter) {
    currentBooksFilter = filter;
    document.getElementById('filterAllBooks')?.classList.toggle('active', filter === 'all');
    document.getElementById('filterCollectedBooks')?.classList.toggle('active', filter === 'collected');
    applyBooksFilter();
}

function applyBooksFilter() {
    const searchQuery = document.getElementById('coloringBooksSearch')?.value.toLowerCase() || '';
    
    const categories = ['paint_by_number', 'alcohol', 'pencil', 'custom'];
    
    categories.forEach(category => {
        const container = document.getElementById(`category-${category}`);
        if (!container) return;
        
        const userBooks = userColoringBooks[category] || [];
        const cards = container.querySelectorAll('.coloring-book-item');
        
        cards.forEach(card => {
            const nameEl = card.querySelector('.book-name');
            const bookName = nameEl ? nameEl.innerText : '';
            const matchesSearch = searchQuery === '' || bookName.toLowerCase().includes(searchQuery);
            const isCollected = userBooks.some(b => (typeof b === 'string' ? b : b.name) === bookName);
            const matchesFilter = currentBooksFilter === 'all' || (currentBooksFilter === 'collected' && isCollected);
            
            if (matchesSearch && matchesFilter) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
        
        const addForm = container.querySelector('.add-book-form')?.parentElement;
        if (addForm) {
            addForm.style.display = (searchQuery === '' && currentBooksFilter === 'all') ? 'block' : 'none';
        }
    });
}

const originalFilterColoringBooks = filterColoringBooks;
filterColoringBooks = function() {
    applyBooksFilter();
};

const originalRenderColoringBooks2 = renderColoringBooks;
renderColoringBooks = function() {
    originalRenderColoringBooks2.call(this);
    
    currentBooksFilter = 'all';
    document.getElementById('filterAllBooks')?.classList.add('active');
    document.getElementById('filterCollectedBooks')?.classList.remove('active');
    
    setTimeout(() => {
        document.querySelectorAll('.coloring-book-item').forEach(card => {
            const nameEl = card.querySelector('.book-name');
            if (nameEl) {
                const bookId = nameEl.innerText;
                addWishlistHeartToBookCard(card, bookId);
            }
        });
    }, 100);
};
        // ==========================================
// УПРАВЛЕНИЕ КАТЕГОРИЯМИ РАСКРАСОК
// ==========================================

function toggleCategory(category) {
    const content = document.getElementById(`category-${category}`);
    const arrow = document.getElementById(`arrow-${category}`);
    
    if (!content) return;
    
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'grid';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    } else {
        content.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
}
function openAllCategories() {
    ['paint_by_number', 'alcohol', 'pencil', 'custom'].forEach(cat => {
        const content = document.getElementById(`category-${cat}`);
        const arrow = document.getElementById(`arrow-${cat}`);
        if (content) {
            content.style.display = 'grid';
            if (arrow) arrow.style.transform = 'rotate(180deg)';
        }
    });
}

function closeAllCategories() {
    ['paint_by_number', 'alcohol', 'pencil', 'custom'].forEach(cat => {
        const content = document.getElementById(`category-${cat}`);
        const arrow = document.getElementById(`arrow-${cat}`);
        if (content) {
            content.style.display = 'none';
            if (arrow) arrow.style.transform = 'rotate(0deg)';
        }
    });
}
        // Обновление счётчиков категорий
function updateCategoryCounters() {
    const categories = ['paint_by_number', 'alcohol', 'pencil', 'custom'];
    
    categories.forEach(category => {
        const userBooks = userColoringBooks[category] || [];
        const defaultBooks = DEFAULT_COLORING_BOOKS[category] || [];
        
        const allBooks = [...new Set([
            ...defaultBooks,
            ...userBooks.map(b => typeof b === 'string' ? b : b.name)
        ])];
        
        const countEl = document.getElementById(`category-count-${category}`);
        if (countEl) {
            countEl.textContent = `${userBooks.length}/${allBooks.length}`;
        }
    });
    
    updateAllCategoriesProgress();
}
        // Загрузка счётчика вишлиста при старте
async function loadWishlistCount() {
    try {
        const response = await fetch(`${SERVER_URL}/api/wishlist/get?user_id=${userId}`);
        const data = await response.json();
        const wishlist = data.wishlist || [];
        
        const countEl = document.getElementById('wishlistCount');
        if (countEl) {
            countEl.textContent = wishlist.length;
        }
    } catch (error) {
        console.error('Ошибка загрузки счётчика вишлиста:', error);
    }
}
        // ==========================================
// ПРОГРЕСС РАСКРАСОК
// ==========================================

// Расчёт прогресса для категории (только добавленные раскраски)
function calculateCategoryProgress(category) {
    const userBooks = userColoringBooks[category] || [];
    
    if (userBooks.length === 0) {
        return { percent: 0, completed: 0, total: 0 };
    }
    
    let totalCompletedPages = 0;
    let totalPagesAll = 0;
    
    userBooks.forEach(book => {
        const bookName = typeof book === 'string' ? book : book.name;
        const bookKey = `${category}_${bookName}`;
        const completedPages = userCompletedPages[bookKey] || {};
        
        // ✅ Считаем отмеченные страницы (разворот = 2 страницы)
        let completedCount = 0;
        for (const page in completedPages) {
            if (page.includes('-')) {
                completedCount += 2; // разворот = 2 страницы
            } else {
                completedCount += 1; // обычная страница
            }
        }
        
        // ✅ Получаем totalPages
        let totalPages = DEFAULT_PAGES_CONFIG.totalPages;
        
        if (typeof book === 'object' && book.totalPages) {
            totalPages = book.totalPages;
        } else {
            const config = BOOK_PAGES_CONFIG[bookName];
            if (config) {
                totalPages = config.totalPages;
            }
        }
        
        totalCompletedPages += completedCount;
        totalPagesAll += totalPages;
    });
    
    const percent = totalPagesAll > 0 ? Math.round((totalCompletedPages / totalPagesAll) * 100) : 0;
    
    return { percent, completed: totalCompletedPages, total: totalPagesAll };
}
// Обновление прогресса для всех категорий

       function updateAllCategoriesProgress() {
    const categories = ['paint_by_number', 'alcohol', 'pencil', 'custom'];
    
    categories.forEach(category => {
        const progress = calculateCategoryProgress(category);
        const progressEl = document.getElementById(`category-progress-${category}`);
        
        if (progressEl) {
            progressEl.textContent = `${progress.percent}%`;
        }
    });
} 
        // ==========================================
// РЕНДЕРИНГ СОДЕРЖИМОГО КАТЕГОРИИ
// ==========================================

function renderCategoryContent(category) {
    const container = document.getElementById(`category-${category}`);
    if (!container) return;
    
    const userBooks = userColoringBooks[category] || [];
    
    const defaultBooks = (DEFAULT_COLORING_BOOKS[category] || []).map(name => ({
        name: name,
        custom: false,
        cover: DEFAULT_COVERS[name] || 'assets/coloriages/default.jpg'
    }));
    
    const allBooks = [...defaultBooks];
    userBooks.forEach(book => {
        const bookName = typeof book === 'string' ? book : book.name;
        if (!allBooks.find(b => b.name === bookName)) {
            allBooks.push(typeof book === 'string' ? { name: book, custom: true, cover: null } : book);
        }
    });
    
    // Обновляем счётчик и прогресс
    const collectedCount = userBooks.length;
    const totalCount = allBooks.length;
    const countEl = document.getElementById(`category-count-${category}`);
    if (countEl) countEl.textContent = `${collectedCount}/${totalCount}`;
    
    // Обновляем прогресс категории
    updateAllCategoriesProgress();
    
    let html = '';
    
    allBooks.forEach(book => {
        const bookName = book.name;
        const collected = userBooks.some(b => (typeof b === 'string' ? b : b.name) === bookName);
        
        // ✅ Получаем количество страниц (приоритет: кастомная книга > конфиг > по умолчанию)
        let totalPages = DEFAULT_PAGES_CONFIG.totalPages;
        const userBook = userBooks.find(b => (typeof b === 'string' ? b : b.name) === bookName);
        
        if (userBook && typeof userBook === 'object' && userBook.totalPages) {
            totalPages = userBook.totalPages;
        } else {
            const config = BOOK_PAGES_CONFIG[bookName] || DEFAULT_PAGES_CONFIG;
            totalPages = config.totalPages;
        }
        
        // Считаем прогресс для этой раскраски
        const bookKey = `${category}_${bookName}`;
        const completedPages = userCompletedPages[bookKey] || {};
        const completedCount = Object.keys(completedPages).length;
        const progressPercent = totalPages > 0 ? Math.round((completedCount / totalPages) * 100) : 0;
        
        let coverUrl = book.cover || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23ff9500' rx='12'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='40'%3E📚%3C/text%3E%3C/svg%3E";
        if (coverUrl && coverUrl.startsWith('/custom_covers')) {
            coverUrl = SERVER_URL + coverUrl;
        }
        
        html += `
            <div class="coloring-book-item ${collected ? 'collected' : ''}" data-book-name="${bookName.toLowerCase()}">
                <img src="${coverUrl}" class="book-cover" onclick="openBookPagesModal('${category}', '${bookName.replace(/'/g, "\\'")}')" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23ff9500%22 rx=%2212%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2240%22%3E📚%3C/text%3E%3C/svg%3E'">
                <div class="book-info" onclick="openBookPagesModal('${category}', '${bookName.replace(/'/g, "\\'")}')">
                    <div class="book-name">${bookName}</div>
                    ${collected ? `
                        <div class="book-progress-container">
                            <div class="book-progress-bar">
                                <div class="book-progress-fill" style="width: ${progressPercent}%;"></div>
                            </div>
                            <div class="book-progress-text">${completedCount}/${totalPages} (${progressPercent}%)</div>
                        </div>
                    ` : ''}
                    ${book.custom ? '<div class="book-category">Моя раскраска</div>' : ''}
                </div>
                ${book.custom ? `
                    <button class="add-cover-btn" onclick="event.stopPropagation(); uploadCustomCover('${category}', '${bookName.replace(/'/g, "\\'")}')">
                        <i class="fas fa-camera"></i> Обложка
                    </button>
                ` : ''}
                <div class="remove-btn" onclick="event.stopPropagation(); toggleColoringBook('${category}', '${bookName.replace(/'/g, "\\'")}')">
                    ${collected ? '✓' : '+'}
                </div>
            </div>
        `;
    });
    
    // ✅ Форма добавления с полем для количества страниц
    html += `
        <div style="grid-column: span 2; margin-top: 10px;">
            <div class="add-book-form">
                <input type="text" id="custom-book-${category}" placeholder="Название новой раскраски...">
                <div style="display: flex; gap: 8px; margin-top: 8px;">
                    <input type="number" id="custom-book-pages-${category}" placeholder="Страниц" value="60" min="1" max="500" style="flex: 1; padding: 10px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text); font-size: 14px;">
                    <button class="add-custom-btn" onclick="addCustomBook('${category}')" style="flex: 1;">Добавить</button>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Добавляем сердечки вишлиста
    setTimeout(() => {
        container.querySelectorAll('.coloring-book-item').forEach(card => {
            const nameEl = card.querySelector('.book-name');
            if (nameEl && typeof addWishlistHeartToBookCard === 'function') {
                addWishlistHeartToBookCard(card, nameEl.innerText);
            }
        });
    }, 50);
}

      function showDebugInfo() {
    const category = 'paint_by_number';
    const userBooks = userColoringBooks[category] || [];
    
    let info = `КАТЕГОРИЯ: ${category}\n`;
    info += `Всего раскрасок: ${userBooks.length}\n\n`;
    
    let totalCompleted = 0;
    let totalCells = 0;
    
    userBooks.forEach(book => {
        const bookName = typeof book === 'string' ? book : book.name;
        const bookKey = `${category}_${bookName}`;
        const completed = Object.keys(userCompletedPages[bookKey] || {}).length;
        
        let pages = 60;
        let spreads = [];
        
        if (typeof book === 'object') {
            pages = book.totalPages || 60;
            spreads = book.spreads || [];
        } else {
            const config = BOOK_PAGES_CONFIG[bookName];
            if (config) {
                pages = config.totalPages;
                spreads = config.spreads || [];
            }
        }
        
        const cells = pages - spreads.length;
        totalCompleted += completed;
        totalCells += cells;
        
        if (userBooks.indexOf(book) < 10) {
            info += `${bookName}: ${completed}/${cells} (${pages}стр, ${spreads.length}разв)\n`;
        }
    });
    
    const percent = totalCells > 0 ? Math.round((totalCompleted / totalCells) * 100) : 0;
    info += `\nИТОГО: ${totalCompleted}/${totalCells} = ${percent}%`;
    
    alert(info);
}
        // ==========================================
// БЕСТИАРИЙ
// ==========================================

function toggleBestiaryBlock() {
    const content = document.getElementById('bestiaryContent');
    const arrow = document.getElementById('bestiaryArrow');
    
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        renderBestiary();
    } else {
        content.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
}

function renderBestiary() {
    const grid = document.getElementById('bestiaryGrid');
    if (!grid) return;
    
    const statsEl = document.getElementById('bestiaryStats');
    if (statsEl) statsEl.textContent = BESTIARY.length;
    
    let html = '';
    
    BESTIARY.forEach(character => {
        // Считаем количество упоминаний
        let totalAppearances = 0;
        character.appearances.forEach(a => {
            totalAppearances += a.pages.length;
        });
        
        html += `
            <div class="bestiary-card" onclick="openBestiaryDetail('${character.id}')" data-film="${character.film.toLowerCase()}">
                <div class="bestiary-card-image">
                    <img src="${character.image}" 
                         alt="${character.name}" 
                         loading="lazy"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23ff9500%22 rx=%2212%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2240%22%3E🦁%3C/text%3E%3C/svg%3E'">
                </div>
                <div class="bestiary-card-name">${character.name}</div>
                <div class="bestiary-card-film" style="font-size: 10px; color: var(--accent); margin-top: 2px;">🎬 ${character.film}</div>
                <div class="bestiary-card-count">${totalAppearances} упоминаний</div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
}

function openBestiaryDetail(characterId) {
    const character = BESTIARY.find(c => c.id === characterId);
    if (!character) return;
    
    const modal = document.createElement('div');
    modal.id = 'bestiaryModal';
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.style.zIndex = '100001';
    
    let appearancesHtml = '';
    
    character.appearances.forEach(appearance => {
        // Форматируем страницы с учётом разворотов
        const pagesHtml = appearance.pages.map(p => {
            if (typeof p === 'string' && p.includes('-')) {
                return `<span class="page-badge spread">разв. ${p}</span>`;
            } else {
                return `<span class="page-badge">стр. ${p}</span>`;
            }
        }).join('');
        
        appearancesHtml += `
            <div class="appearance-item" onclick="openBookFromBestiary('${appearance.book.replace(/'/g, "\\'")}')">
                <strong>📖 ${appearance.book}</strong>
                <div class="appearance-pages">${pagesHtml}</div>
            </div>
        `;
    });
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div style="text-align: center; margin-bottom: 15px;">
                <img src="${character.image}" 
                     alt="${character.name}" 
                     style="width: 80px; height: 80px; object-fit: contain; border-radius: 16px;"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22%3E%3Crect width=%2280%22 height=%2280%22 fill=%22%23ff9500%22 rx=%2216%22/%3E%3Ctext x=%2240%22 y=%2240%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2230%22%3E🦁%3C/text%3E%3C/svg%3E'">
                <h3 style="margin: 10px 0 5px;">${character.name}</h3>
                <p style="color: var(--accent); font-size: 13px;">🎬 ${character.film}</p>
                <p style="color: var(--text-gray); font-size: 13px;">
                    Встречается в ${character.appearances.length} томах
                </p>
            </div>
            ${appearancesHtml}
            <button class="modal-close-btn" onclick="document.getElementById('bestiaryModal').remove()" style="width: 100%; margin-top: 15px;">Закрыть</button>
        </div>
    `;
    
    modal.onclick = function(e) {
        if (e.target === modal) modal.remove();
    };
    
    document.body.appendChild(modal);
}
function openBookFromBestiary(bookName) {
    // Закрываем модалку бестиария
    const modal = document.getElementById('bestiaryModal');
    if (modal) modal.remove();
    
    // Определяем категорию
    let category = 'paint_by_number';
    if (DEFAULT_COLORING_BOOKS.alcohol?.includes(bookName)) category = 'alcohol';
    else if (DEFAULT_COLORING_BOOKS.pencil?.includes(bookName)) category = 'pencil';
    
    // Открываем модалку с страницами
    openBookPagesModal(category, bookName);
}

var bestiaryFilterTimeout = null;

function filterBestiary() {
    if (bestiaryFilterTimeout) clearTimeout(bestiaryFilterTimeout);
    
    bestiaryFilterTimeout = setTimeout(function() {
        const query = document.getElementById('bestiarySearch')?.value.toLowerCase().trim() || '';
        const cards = document.querySelectorAll('.bestiary-card');
        
        if (query === '') {
            cards.forEach(function(card) { card.style.display = ''; });
            return;
        }
        
        cards.forEach(function(card) {
            const name = card.querySelector('.bestiary-card-name')?.innerText.toLowerCase() || '';
            const film = card.getAttribute('data-film') || '';
            const onclick = card.getAttribute('onclick') || '';
            const characterId = onclick.match(/'([^']+)'/)?.[1] || '';
            const character = BESTIARY.find(function(c) { return c.id === characterId; });
            
            var matches = name.includes(query) || film.includes(query);
            if (!matches && character) {
                matches = character.appearances.some(function(a) {
                    return a.book.toLowerCase().includes(query);
                });
            }
            
            card.style.display = matches ? '' : 'none';
        });
    }, 300);
}
        // ==========================================
// УБИРАЕМ КЛАВИАТУРУ ПРИ ПОИСКЕ В БЕСТИАРИИ
// ==========================================

// Показываем/скрываем кнопку «Готово» при фокусе
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('bestiarySearch');
    const btn = document.getElementById('hideKeyboardBtn');
    
    if (input && btn) {
        input.addEventListener('focus', function() {
            btn.style.display = 'block';
        });
        
        input.addEventListener('blur', function() {
            setTimeout(function() { btn.style.display = 'none'; }, 300);
        });
        
        btn.addEventListener('click', function() {
            input.blur();
            btn.style.display = 'none';
        });
    }
});
      // ==========================================
// СТАТИСТИКА
// ==========================================

function openStatsBlock(category) {
    var content = document.getElementById('stats-content-' + category);
    var arrow = document.getElementById('arrow-stats-' + category);
    
    if (!content || !arrow) return;
    
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        arrow.style.transform = 'rotate(180deg)';
        if (category === 'bestiary') {
            if (typeof renderBestiaryStats === 'function') {
                renderBestiaryStats();
            }
        } else if (category === 'chart') {
            renderMonthChart();
        } else {
            if (typeof renderStatsCategory === 'function') {
                renderStatsCategory(category);
            }
        }
    } else {
        content.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)';
    }
}
function renderStatsCategory(category) {
    var container = document.getElementById('stats-content-' + category);
    if (!container) return;
    
    var now = new Date();
    var lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
    var lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).getTime();
    var monthAgo = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    var currentMonth = now.getMonth();
    var currentYear = now.getFullYear();
    var monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    
    var booksStats = {};
    var totalLastMonth = 0, totalMonth = 0, totalAll = 0;
    
    var userBooks = userColoringBooks[category] || [];
    
    userBooks.forEach(function(book) {
        var bookName = typeof book === 'string' ? book : book.name;
        var bookKey = category + '_' + bookName;
        var pages = userCompletedPages[bookKey] || {};
        
        if (Object.keys(pages).length === 0) return;
        
        if (!booksStats[bookName]) {
            booksStats[bookName] = { lastmonth: 0, month: 0, total: 0, works: [], bookKey: bookKey };
        }
        
        for (var page in pages) {
            var date = (window.completedPagesDates && window.completedPagesDates[bookKey + '|' + page]) || 0;
            var artworkUrl = getPageArtwork(bookKey, page);
            
            booksStats[bookName].total++;
            booksStats[bookName].works.push({ page: page, date: date, artwork: artworkUrl, bookKey: bookKey });
            
            totalAll++;
            if (date >= monthAgo) { booksStats[bookName].month++; totalMonth++; }
            if (date >= lastMonthStart && date <= lastMonthEnd) { booksStats[bookName].lastmonth++; totalLastMonth++; }
        }
    });
    
    var html = '<div class="stats-numbers">';
    html += '<div class="stats-number-card active" onclick="showBooksList(\'' + category + '\', \'lastmonth\')"><div class="number">' + totalLastMonth + '</div><div class="label">За прошлый месяц</div></div>';
    html += '<div class="stats-number-card" onclick="showBooksList(\'' + category + '\', \'month\')"><div class="number">' + totalMonth + '</div><div class="label">За месяц</div></div>';
    html += '<div class="stats-number-card" onclick="showBooksList(\'' + category + '\', \'total\')"><div class="number">' + totalAll + '</div><div class="label">Всего</div></div>';
    html += '</div>';
    
    html += '<div id="stats-month-selector-wrapper-' + category + '" style="margin: 10px 0; display: none; align-items: center; gap: 10px;">';
    html += '<select id="stats-month-selector-' + category + '" onchange="showBooksList(\'' + category + '\', this.value === \'all\' ? \'total\' : \'custom\')" style="padding: 8px 12px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text); font-size: 14px;">';
    html += '<option value="all" selected>За всё время</option>';
    for (var m = 0; m < 12; m++) {
        html += '<option value="' + m + '">' + monthNames[m] + ' ' + currentYear + '</option>';
    }
    html += '</select></div>';
    
    html += '<div id="stats-books-' + category + '"></div>';
    
    container.innerHTML = html;
    container._booksStats = booksStats;
    
    showBooksList(category, 'lastmonth');
}
function showBooksList(category, period) {
    var container = document.getElementById('stats-content-' + category);
    var booksStats = container._booksStats || {};
    
    var cards = container.querySelectorAll('.stats-number-card');
    cards.forEach(function(c) { c.classList.remove('active'); });
    
    if (period === 'custom') {
        var totalCard = container.querySelector('.stats-number-card[onclick*="total"]');
        if (totalCard) totalCard.classList.add('active');
    } else {
        // Ищем точное совпадение, а не подстроку
        var allCards = container.querySelectorAll('.stats-number-card');
        for (var i = 0; i < allCards.length; i++) {
            var onclick = allCards[i].getAttribute('onclick') || '';
            if (onclick.indexOf("'" + period + "'") !== -1) {
                allCards[i].classList.add('active');
                break;
            }
        }
    }
    
    var selectorWrapper = document.getElementById('stats-month-selector-wrapper-' + category);
    if (selectorWrapper) {
        selectorWrapper.style.display = (period === 'total' || period === 'custom') ? 'flex' : 'none';
    }
    
    var now = new Date();
    var lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
    var lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).getTime();
    var monthAgo = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    var currentYear = now.getFullYear();
    
    var listContainer = document.getElementById('stats-books-' + category);
    var html = '';
    var hasBooks = false;
    
    var topBooks = [];
    for (var bookName in booksStats) {
        var stat = booksStats[bookName];
        var filteredWorks;
        if (period === 'lastmonth') {
            filteredWorks = stat.works.filter(function(w) { return w.date >= lastMonthStart && w.date <= lastMonthEnd; });
        } else if (period === 'month') {
            filteredWorks = stat.works.filter(function(w) { return w.date >= monthAgo; });
        } else if (period === 'custom') {
            var selMonth = parseInt(document.getElementById('stats-month-selector-' + category).value);
            var startOfMonth = new Date(currentYear, selMonth, 1).getTime();
            var endOfMonth = new Date(currentYear, selMonth + 1, 0, 23, 59, 59).getTime();
            filteredWorks = stat.works.filter(function(w) { return w.date >= startOfMonth && w.date <= endOfMonth; });
        } else {
            filteredWorks = stat.works;
        }
        if (filteredWorks.length > 0) {
            var pagesCount = 0;
            filteredWorks.forEach(function(w) { pagesCount += (String(w.page).includes('-') ? 2 : 1); });
            topBooks.push({ name: bookName, pages: pagesCount, works: filteredWorks, bookKey: stat.bookKey });
        }
    }
    topBooks.sort(function(a, b) { return b.pages - a.pages; });
    var top5 = topBooks.slice(0, 5);
    
    if (top5.length > 0) {
        html += '<div style="padding: 12px; background: var(--card-bg); border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 15px;">';
        html += '<div style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">🏆 Топ-5</div>';
        for (var i = 0; i < top5.length; i++) {
            var coverUrl = DEFAULT_COVERS[top5[i].name] || '';
            var bookTotalPages = BOOK_PAGES_CONFIG[top5[i].name]?.totalPages || DEFAULT_PAGES_CONFIG.totalPages;
            var bookCompletedCount = 0;
            var bookCompletedPages = userCompletedPages[top5[i].bookKey] || {};
            for (var p in bookCompletedPages) {
                bookCompletedCount += (p.includes('-') ? 2 : 1);
            }
            var bookPercent = bookTotalPages > 0 ? Math.round((bookCompletedCount / bookTotalPages) * 100) : 0;
            
            html += '<div style="display: flex; align-items: center; gap: 8px; padding: 6px 0;">';
            html += '<span style="font-size: 14px; font-weight: 600; width: 20px; color: var(--text-gray);">' + (i + 1) + '.</span>';
            if (coverUrl) html += '<img src="' + coverUrl + '" style="width: 30px; height: 40px; object-fit: cover; border-radius: 4px;" onerror="this.style.display=\'none\'">';
            html += '<span style="flex: 1; font-size: 13px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + top5[i].name + '</span>';
          html += '<span style="font-weight: 600; color: var(--accent); white-space: nowrap;">' + top5[i].pages + '</span>';
            html += '<span style="font-size: 11px; color: var(--text-gray); white-space: nowrap;">' + bookPercent + '%</span>';
            html += '</div>';
        }
        html += '</div>';
    }
    
    html += '<div style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">📚 Все раскраски</div>';
    
    for (var bookName in booksStats) {
        var stat = booksStats[bookName];
        var filteredWorks;
        if (period === 'lastmonth') {
            filteredWorks = stat.works.filter(function(w) { return w.date >= lastMonthStart && w.date <= lastMonthEnd; });
        } else if (period === 'month') {
            filteredWorks = stat.works.filter(function(w) { return w.date >= monthAgo; });
        } else if (period === 'custom') {
            var selMonth = parseInt(document.getElementById('stats-month-selector-' + category).value);
            var startOfMonth = new Date(currentYear, selMonth, 1).getTime();
            var endOfMonth = new Date(currentYear, selMonth + 1, 0, 23, 59, 59).getTime();
            filteredWorks = stat.works.filter(function(w) { return w.date >= startOfMonth && w.date <= endOfMonth; });
        } else {
            filteredWorks = stat.works;
        }
        
        if (filteredWorks.length === 0) continue;
        hasBooks = true;
        
        var pagesCount = 0;
        filteredWorks.forEach(function(w) { pagesCount += (String(w.page).includes('-') ? 2 : 1); });
        
        html += '<div class="inventory-subblock" style="margin-bottom:10px;background:var(--bg);border-radius:12px;border:1px solid var(--border-color);overflow:hidden;">';
        html += '<div class="subblock-header" onclick="toggleStatsBook(this)" style="display:flex;justify-content:space-between;align-items:center;padding:12px 15px;cursor:pointer;">';
        
        var coverUrl = DEFAULT_COVERS[bookName] || '';
        if (!coverUrl) {
            var userBooks = userColoringBooks[category] || [];
            var savedBook = userBooks.find(function(b) { return (typeof b === 'string' ? b : b.name) === bookName; });
            if (savedBook && typeof savedBook === 'object' && savedBook.cover) { coverUrl = savedBook.cover; }
        }
        if (coverUrl && !coverUrl.startsWith('http')) coverUrl = '';
        
        html += '<div style="display:flex;align-items:center;gap:10px;">';
        if (coverUrl) html += '<img src="' + coverUrl + '" style="width:40px;height:53px;object-fit:cover;border-radius:6px;" onerror="this.style.display=\'none\'">';
       html += '<div><strong>' + bookName + '</strong><span style="margin-left:10px;font-size:13px;color:var(--text-gray);">' + pagesCount + '</span></div>';
        html += '</div>';
        html += '<i class="fas fa-chevron-down" style="color:var(--text-gray);transition:transform 0.3s;"></i>';
        html += '</div>';
        html += '<div class="subblock-content" style="display:none;padding:10px 15px;border-top:1px solid var(--border-color);">';
        html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">';
        
        filteredWorks.sort(function(a, b) { return b.date - a.date; });
        
        filteredWorks.forEach(function(w) {
            var dateStr = w.date ? new Date(w.date).toLocaleDateString('ru-RU') : '';
            if (w.artwork) {
                html += '<div class="book-page-btn uploaded" style="aspect-ratio:1;overflow:hidden;border-radius:10px;cursor:pointer;position:relative;" onclick="viewArtwork(\'' + w.bookKey.replace(/'/g, "\\'") + '\', \'' + w.page + '\')">';
                html += '<img src="' + w.artwork + '" style="width:100%;height:100%;object-fit:cover;">';
                html += '<span style="position:absolute;bottom:2px;right:4px;font-size:9px;background:rgba(0,0,0,0.6);color:white;padding:1px 4px;border-radius:4px;">' + dateStr + '</span>';
                html += '</div>';
            } else {
                html += '<div class="book-page-btn completed" style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:12px;position:relative;">';
                html += '<div style="text-align:center;"><div style="font-size:20px;">📸</div><div style="font-size:10px;">стр. ' + w.page + '</div><span style="font-size:9px;color:var(--text-gray);">' + dateStr + '</span></div>';
                html += '</div>';
            }
        });
        
        html += '</div></div></div>';
    }
    
    if (!hasBooks) html += '<div class="no-results" style="padding:20px;text-align:center;color:var(--text-gray);">Нет работ за этот период</div>';
    listContainer.innerHTML = html;
}
function uploadFromStats(category, bookName, bookKey, page) {
    currentBook = bookName;
    currentCategory = category;
    uploadPageArtwork(bookKey, page);
}
function toggleStatsBook(header) {
    var content = header.nextElementSibling;
    var arrow = header.querySelector('i');
    
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    } else {
        content.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
}

function renderMonthChart() {
    var container = document.getElementById('stats-content-chart');
    if (!container) return;
    
    var now = new Date();
    var currentMonth = now.getMonth();
    var currentYear = now.getFullYear();
    
    var months = [];
    for (var i = 5; i >= 0; i--) {
        var d = new Date(currentYear, currentMonth - i, 1);
        months.push({
            name: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'][d.getMonth()],
            year: d.getFullYear(),
            timestamp: d.getTime(),
            paintCount: 0,
            alcoholCount: 0
        });
    }
    
    for (var bookKey in userCompletedPages) {
        var category;
        if (bookKey.startsWith('paint_by_number_')) category = 'paint_by_number';
        else if (bookKey.startsWith('alcohol_')) category = 'alcohol';
        else continue;
        
        for (var page in userCompletedPages[bookKey]) {
            var date = (window.completedPagesDates && window.completedPagesDates[bookKey + '|' + page]) || 0;
            if (!date) continue;
            for (var m = months.length - 1; m >= 0; m--) {
                if (date >= months[m].timestamp) {
                    if (category === 'paint_by_number') months[m].paintCount++;
                    else if (category === 'alcohol') months[m].alcoholCount++;
                    break;
                }
            }
        }
    }
    
    var maxCount = 1;
    months.forEach(function(m) {
        if (m.paintCount > maxCount) maxCount = m.paintCount;
        if (m.alcoholCount > maxCount) maxCount = m.alcoholCount;
    });
    
    var html = '<div style="display:flex;gap:20px;margin-bottom:15px;justify-content:center;font-size:12px;">';
    html += '<div><span style="display:inline-block;width:12px;height:12px;background:var(--accent);border-radius:3px;margin-right:5px;"></span> По номерам</div>';
    html += '<div><span style="display:inline-block;width:12px;height:12px;background:var(--accent);opacity:0.4;border-radius:3px;margin-right:5px;"></span> Спиртовые</div>';
    html += '</div><div class="month-chart">';
    
    months.forEach(function(m) {
        var paintH = Math.max((m.paintCount / maxCount) * 150, 2);
        var alcoholH = Math.max((m.alcoholCount / maxCount) * 150, 2);
        
        html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;">';
        html += '<div style="font-size:13px;font-weight:600;margin-bottom:2px;">' + m.paintCount + ' | ' + m.alcoholCount + '</div>';
        html += '<div style="width:100%;height:150px;display:flex;gap:3px;">';
        html += '<div style="flex:1;display:flex;flex-direction:column-reverse;"><div style="width:100%;height:' + paintH + 'px;background:var(--accent);border-radius:2px 2px 0 0;"></div></div>';
        html += '<div style="flex:1;display:flex;flex-direction:column-reverse;"><div style="width:100%;height:' + alcoholH + 'px;background:var(--accent);opacity:0.4;border-radius:2px 2px 0 0;"></div></div>';
        html += '</div>';
        html += '<div style="font-size:12px;font-weight:500;color:var(--text-gray);margin-top:4px;">' + m.name + '</div></div>';
    });
    html += '</div>';
    
    var thisM = months[months.length-1];
    var lastM = months.length>1 ? months[months.length-2] : null;
    var thisTotal = thisM.paintCount + thisM.alcoholCount;
    var lastTotal = lastM ? lastM.paintCount + lastM.alcoholCount : 0;
    var fb = thisTotal > lastTotal ? '🔥 Больше, чем в прошлом месяце!' : thisTotal === 0 ? '🎨 Начни раскрашивать!' : '👍 Продолжай в том же духе!';
    
    html += '<div class="stats-feedback">' + fb + '</div>';
    container.innerHTML = html;
}
function switchBestiaryPeriod(period) {
    bestiaryStatsCurrentPeriod = period;
    
    var cards = document.querySelectorAll('#stats-content-bestiary .stats-number-card');
    cards.forEach(function(c) { c.classList.remove('active'); });
    if (period !== 'custom') {
        var activeCard = document.querySelector('#stats-content-bestiary .stats-number-card[onclick*="' + period + '"]');
        if (activeCard) activeCard.classList.add('active');
    } else {
        var totalCard = document.querySelector('#stats-content-bestiary .stats-number-card[onclick*="total"]');
        if (totalCard) totalCard.classList.add('active');
    }
    
    // Скрываем селектор кроме "Всего"
    var selectorWrapper = document.getElementById('bestiary-month-selector-wrapper');
    if (selectorWrapper) {
        selectorWrapper.style.display = (period === 'total' || period === 'custom') ? 'flex' : 'none';
    }
    
    var data = window._bestiaryStatsData || [];
    var now = new Date();
    var lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
    var lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).getTime();
    var monthAgo = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    var currentYear = now.getFullYear();
    
    var totalLastMonth = data.reduce(function(s, c) { return s + c.lastMonthColored; }, 0);
    var totalMonth = data.reduce(function(s, c) { return s + c.monthColored; }, 0);
    var totalAll = data.reduce(function(s, c) { return s + c.totalColored; }, 0);
    
    var numbersHTML = '';
    numbersHTML += '<div class="stats-number-card' + (period === 'lastmonth' ? ' active' : '') + '" onclick="switchBestiaryPeriod(\'lastmonth\')"><div class="number">' + totalLastMonth + '</div><div class="label">За прошлый месяц</div></div>';
    numbersHTML += '<div class="stats-number-card' + (period === 'month' ? ' active' : '') + '" onclick="switchBestiaryPeriod(\'month\')"><div class="number">' + totalMonth + '</div><div class="label">За месяц</div></div>';
    numbersHTML += '<div class="stats-number-card' + (period === 'total' || period === 'custom' ? ' active' : '') + '" onclick="switchBestiaryPeriod(\'total\')"><div class="number">' + totalAll + '</div><div class="label">Всего</div></div>';
    
    var numbersContainer = document.querySelector('#stats-content-bestiary .stats-numbers');
    if (numbersContainer) numbersContainer.innerHTML = numbersHTML;
    
    var filtered = [];
    for (var i = 0; i < data.length; i++) {
        var cs = data[i];
        var colored;
        if (period === 'lastmonth') colored = cs.lastMonthColored;
        else if (period === 'month') colored = cs.monthColored;
        else if (period === 'custom') {
            var selMonth = parseInt(document.getElementById('bestiary-month-selector').value);
            var startOfMonth = new Date(currentYear, selMonth, 1).getTime();
            var endOfMonth = new Date(currentYear, selMonth + 1, 0, 23, 59, 59).getTime();
            colored = (cs.coloredDates || []).filter(function(d) { return d >= startOfMonth && d <= endOfMonth; }).length;
        } else colored = cs.totalColored;
        
        if (colored > 0) {
            filtered.push({ id: cs.id, name: cs.name, film: cs.film, image: cs.image, colored: colored });
        }
    }
    filtered.sort(function(a, b) { return b.colored - a.colored; });
    var top5 = filtered.slice(0, 5);
    
    var topHTML = '';
    if (top5.length > 0) {
        topHTML += '<div style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">🏆 Топ-5 персонажей</div>';
        for (var i = 0; i < top5.length; i++) {
            topHTML += '<div class="stats-bestiary-card" onclick="openBestiaryStatsDetail(\'' + top5[i].id + '\')" style="cursor: pointer;">';
            topHTML += '<span style="font-size: 14px; font-weight: 600; width: 20px; color: var(--text-gray);">' + (i + 1) + '.</span>';
            topHTML += '<img src="' + top5[i].image + '" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">';
            topHTML += '<div class="stats-bestiary-info" style="flex: 1;"><div class="stats-bestiary-name">' + top5[i].name + '</div><div class="stats-bestiary-film">' + top5[i].film + '</div></div>';
            topHTML += '<div class="stats-bestiary-progress">' + top5[i].colored + '</div>';
            topHTML += '</div>';
        }
    }
    document.getElementById('bestiary-top5').innerHTML = topHTML;
    
    filterBestiaryStats();
}
function renderBestiaryStats() {
    var container = document.getElementById('stats-content-bestiary');
    if (!container) return;
    
    var now = new Date();
    var lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
    var lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).getTime();
    var monthAgo = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    var currentYear = now.getFullYear();
    var monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    
    var coloredPages = {};
    for (var bookKey in userCompletedPages) {
        coloredPages[bookKey] = {};
        for (var page in userCompletedPages[bookKey]) {
            var date = (window.completedPagesDates && window.completedPagesDates[bookKey + '|' + page]) || 0;
            coloredPages[bookKey][page] = date;
        }
    }
    
    var bestiaryStatsData = [];
    
    BESTIARY.forEach(function(character) {
        var totalAppearances = 0;
        var totalColored = 0;
        var lastMonthColored = 0;
        var monthColored = 0;
        var coloredDates = [];
        
        character.appearances.forEach(function(appearance) {
            var bookName = appearance.book;
            var cat = 'paint_by_number';
            if (DEFAULT_COLORING_BOOKS.alcohol && DEFAULT_COLORING_BOOKS.alcohol.indexOf(bookName) !== -1) cat = 'alcohol';
            var bookKey = cat + '_' + bookName;
            
            var userBooks = userColoringBooks[cat] || [];
            var isInCollection = userBooks.some(function(b) {
                return (typeof b === 'string' ? b : b.name) === bookName;
            });
            
            if (!isInCollection) return;
            
            var userPages = coloredPages[bookKey] || {};
            
            appearance.pages.forEach(function(p) {
                totalAppearances++;
                var pageStr = String(p);
                if (userPages.hasOwnProperty(pageStr)) {
                    totalColored++;
                    var date = userPages[pageStr] || 0;
                    coloredDates.push(date);
                    if (date >= monthAgo) monthColored++;
                    if (date >= lastMonthStart && date <= lastMonthEnd) lastMonthColored++;
                }
            });
        });
        
        if (totalAppearances > 0) {
            bestiaryStatsData.push({
                id: character.id,
                name: character.name,
                film: character.film,
                image: character.image,
                total: totalAppearances,
                totalColored: totalColored,
                lastMonthColored: lastMonthColored,
                monthColored: monthColored,
                coloredDates: coloredDates
            });
        }
    });
    
    bestiaryStatsData.sort(function(a, b) { return b.totalColored - a.totalColored; });
    
    var totalLastMonth = bestiaryStatsData.reduce(function(s, c) { return s + c.lastMonthColored; }, 0);
    var totalMonth = bestiaryStatsData.reduce(function(s, c) { return s + c.monthColored; }, 0);
    var totalAll = bestiaryStatsData.reduce(function(s, c) { return s + c.totalColored; }, 0);
    
    var html = '';
    
    html += '<div class="stats-numbers">';
    html += '<div class="stats-number-card active" onclick="switchBestiaryPeriod(\'lastmonth\')"><div class="number">' + totalLastMonth + '</div><div class="label">За прошлый месяц</div></div>';
    html += '<div class="stats-number-card" onclick="switchBestiaryPeriod(\'month\')"><div class="number">' + totalMonth + '</div><div class="label">За месяц</div></div>';
    html += '<div class="stats-number-card" onclick="switchBestiaryPeriod(\'total\')"><div class="number">' + totalAll + '</div><div class="label">Всего</div></div>';
    html += '</div>';
    
    html += '<div id="bestiary-month-selector-wrapper" style="margin: 10px 0; display: none; align-items: center; gap: 10px;">';
    html += '<select id="bestiary-month-selector" onchange="switchBestiaryPeriod(this.value === \'all\' ? \'total\' : \'custom\')" style="padding: 8px 12px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text); font-size: 14px;">';
    html += '<option value="all" selected>За всё время</option>';
    for (var m = 0; m < 12; m++) {
        html += '<option value="' + m + '">' + monthNames[m] + ' ' + currentYear + '</option>';
    }
    html += '</select></div>';
    
    // ✅ Топ-5 по прошлому месяцу
    var top5ByLastMonth = bestiaryStatsData.slice().sort(function(a, b) { return b.lastMonthColored - a.lastMonthColored; }).slice(0, 5);
    if (top5ByLastMonth.length > 0) {
        html += '<div id="bestiary-top5"><div style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">🏆 Топ-5 персонажей</div>';
        for (var i = 0; i < top5ByLastMonth.length; i++) {
            html += '<div class="stats-bestiary-card" onclick="openBestiaryStatsDetail(\'' + top5ByLastMonth[i].id + '\')" style="cursor: pointer;">';
            html += '<span style="font-size: 14px; font-weight: 600; width: 20px; color: var(--text-gray);">' + (i + 1) + '.</span>';
            html += '<img src="' + top5ByLastMonth[i].image + '" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;" onerror="this.src=\'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22%3E%3Crect width=%2240%22 height=%2240%22 fill=%22%23ff9500%22 rx=%228%22/%3E%3Ctext x=%2220%22 y=%2220%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2216%22%3E🦁%3C/text%3E%3C/svg%3E\'">';
            html += '<div class="stats-bestiary-info" style="flex: 1;">';
            html += '<div class="stats-bestiary-name">' + top5ByLastMonth[i].name + '</div>';
            html += '<div class="stats-bestiary-film">' + top5ByLastMonth[i].film + '</div>';
            html += '</div>';
            html += '<div class="stats-bestiary-progress">' + top5ByLastMonth[i].lastMonthColored + '</div>';
            html += '</div>';
        }
        html += '</div>';
    }
    
    html += '<div style="font-size: 13px; font-weight: 600; margin: 15px 0 8px;">📚 Все персонажи</div>';
    html += '<div class="search-box" style="margin-bottom: 15px; display: flex; gap: 8px; align-items: center;">';
    html += '<i class="fas fa-search"></i>';
    html += '<input type="text" id="bestiaryStatsSearch" placeholder="Поиск персонажа..." oninput="filterBestiaryStats()" style="flex: 1;">';
    html += '<button onclick="document.getElementById(\'bestiaryStatsSearch\').blur();" style="background: var(--accent); color: white; border: none; padding: 8px 14px; border-radius: 10px; font-size: 13px; white-space: nowrap; cursor: pointer;">Готово</button>';
    html += '</div>';
    html += '<div id="bestiaryStatsList"></div>';
    
    container.innerHTML = html;
    container._bestiaryData = bestiaryStatsData;
    bestiaryStatsCurrentPeriod = 'lastmonth';
    window._bestiaryStatsData = bestiaryStatsData;
    
    filterBestiaryStats();
}
function renderBestiaryStatsWithPeriod(period, data, top5) {
    var now = new Date();
    var monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    
    // Обновляем счётчики
    var totalWeek = data.reduce(function(s, c) { return s + c.weekColored; }, 0);
    var totalMonth = data.reduce(function(s, c) { return s + c.monthColored; }, 0);
    var totalAll = data.reduce(function(s, c) { return s + c.totalColored; }, 0);
    
    var numbersHTML = '';
    numbersHTML += '<div class="stats-number-card' + (period === 'week' ? ' active' : '') + '" onclick="switchBestiaryPeriod(\'week\')"><div class="number">' + totalWeek + '</div><div class="label">За неделю</div></div>';
    numbersHTML += '<div class="stats-number-card' + (period === 'month' ? ' active' : '') + '" onclick="switchBestiaryPeriod(\'month\')"><div class="number">' + totalMonth + '</div><div class="label">За месяц</div></div>';
    numbersHTML += '<div class="stats-number-card' + (period === 'total' || period === 'custom' ? ' active' : '') + '" onclick="switchBestiaryPeriod(\'total\')"><div class="number">' + totalAll + '</div><div class="label">Всего</div></div>';
    
    document.querySelector('#stats-content-bestiary .stats-numbers').innerHTML = numbersHTML;
    
    // Обновляем топ-5
    var topHTML = '';
    if (top5.length > 0) {
        topHTML += '<div style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">🏆 Топ-5 персонажей</div>';
        for (var i = 0; i < top5.length; i++) {
            var count = period === 'week' ? top5[i].weekColored : period === 'month' ? top5[i].monthColored : top5[i].totalColored;
            topHTML += '<div class="stats-bestiary-card" onclick="openBestiaryStatsDetail(\'' + top5[i].id + '\')" style="cursor: pointer;">';
            topHTML += '<span style="font-size: 14px; font-weight: 600; width: 20px; color: var(--text-gray);">' + (i + 1) + '.</span>';
            topHTML += '<img src="' + top5[i].image + '" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">';
            topHTML += '<div class="stats-bestiary-info" style="flex: 1;"><div class="stats-bestiary-name">' + top5[i].name + '</div><div class="stats-bestiary-film">' + top5[i].film + '</div></div>';
            topHTML += '<div class="stats-bestiary-progress">' + count + '</div>';
            topHTML += '</div>';
        }
    }
    var topWrapper = document.querySelector('#stats-content-bestiary > div:nth-child(3)');
    if (topWrapper) topWrapper.innerHTML = topHTML;
    
    // Обновляем список
    filterBestiaryStats();
}

function filterBestiaryStats() {
    var query = document.getElementById('bestiaryStatsSearch')?.value.toLowerCase().trim() || '';
    var listContainer = document.getElementById('bestiaryStatsList');
    if (!listContainer) return;
    
    var data = window._bestiaryStatsData || [];
    var period = bestiaryStatsCurrentPeriod || 'lastmonth';
    var now = new Date();
    var lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
    var lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).getTime();
    var monthAgo = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    var currentYear = now.getFullYear();
    
    var filtered = [];
    
    for (var i = 0; i < data.length; i++) {
        var cs = data[i];
        var colored, total;
        total = cs.total;
        
        if (period === 'lastmonth') {
            colored = cs.lastMonthColored;
        } else if (period === 'month') {
            colored = cs.monthColored;
        } else if (period === 'custom') {
            var selMonth = parseInt(document.getElementById('bestiary-month-selector').value);
            var startOfMonth = new Date(currentYear, selMonth, 1).getTime();
            var endOfMonth = new Date(currentYear, selMonth + 1, 0, 23, 59, 59).getTime();
            colored = (cs.coloredDates || []).filter(function(d) { return d >= startOfMonth && d <= endOfMonth; }).length;
        } else {
            colored = cs.totalColored;
        }
        
        if (colored > 0 || period === 'total') {
            filtered.push({
                id: cs.id, name: cs.name, film: cs.film, image: cs.image,
                total: total, colored: colored,
                percent: total > 0 ? Math.round((colored / total) * 100) : 0
            });
        }
    }
    
    if (period === 'lastmonth') filtered.sort(function(a, b) { return b.colored - a.colored; });
    else if (period === 'month') filtered.sort(function(a, b) { return b.colored - a.colored; });
    else if (period === 'custom') filtered.sort(function(a, b) { return b.colored - a.colored; });
    
    if (query !== '') {
        filtered = filtered.filter(function(c) { return c.name.toLowerCase().includes(query) || c.film.toLowerCase().includes(query); });
    }
    
    var html = '';
    if (filtered.length === 0) {
        html = '<div class="no-results" style="padding:20px;text-align:center;color:var(--text-gray);">Нет раскрашенных персонажей за этот период</div>';
    } else {
        filtered.forEach(function(cs) {
            html += '<div class="stats-bestiary-card" onclick="openBestiaryStatsDetail(\'' + cs.id + '\')">';
            html += '<img src="' + cs.image + '" alt="' + cs.name + '" onerror="this.src=\'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22%3E%3Crect width=%2240%22 height=%2240%22 fill=%22%23ff9500%22 rx=%228%22/%3E%3Ctext x=%2220%22 y=%2220%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2216%22%3E🦁%3C/text%3E%3C/svg%3E\'">';
            html += '<div class="stats-bestiary-info">';
            html += '<div class="stats-bestiary-name">' + cs.name + '</div>';
            html += '<div class="stats-bestiary-film">' + cs.film + '</div>';
            html += '<div class="progress-bar-container" style="margin-top:5px;height:6px;"><div class="progress-bar-fill" style="width:' + cs.percent + '%;height:100%;"></div></div>';
            html += '</div>';
            html += '<div class="stats-bestiary-progress">' + cs.colored + '/' + cs.total + '</div>';
            html += '</div>';
        });
    }
    
    listContainer.innerHTML = html;
}

     function openBestiaryStatsDetail(characterId) {
    const character = BESTIARY.find(c => c.id === characterId);
    if (!character) return;
    
    let remainingHtml = '';
    let totalRemaining = 0;
    
    console.log('=== checking character:', character.name);
    
    character.appearances.forEach(appearance => {
        let category = 'paint_by_number';
        if (DEFAULT_COLORING_BOOKS.alcohol?.includes(appearance.book)) category = 'alcohol';
        else if (DEFAULT_COLORING_BOOKS.pencil?.includes(appearance.book)) category = 'pencil';
        
        const bookKey = `${category}_${appearance.book}`;
        const completedPages = userCompletedPages[bookKey] || {};
        const completedPageKeys = Object.keys(completedPages).map(k => k.replace(bookKey + '_', ''));
        
        const userBooks = userColoringBooks[category] || [];
        const isInCollection = userBooks.some(b => 
            (typeof b === 'string' ? b : b.name) === appearance.book
        );
        
        console.log(`  Book: ${appearance.book}, cat: ${category}, inCollection: ${isInCollection}, pages: ${appearance.pages}`);
        
        if (!isInCollection) return;
        
        const uncoloredPages = appearance.pages.filter(p => {
            const pageStr = String(p);
            return !completedPageKeys.includes(pageStr);
        });
        
        console.log(`  Uncolored: ${uncoloredPages.length}`);
        
        if (uncoloredPages.length > 0) {
            totalRemaining += uncoloredPages.length;
            
            const pagesHtml = uncoloredPages.map(p => {
                if (typeof p === 'string' && p.includes('-')) {
                    return `<span class="page-badge spread" style="cursor:pointer;" onclick="openBookPageFromBestiary('${category}', '${appearance.book.replace(/'/g, "\\'")}', '${p}')">разв. ${p}</span>`;
                } else {
                    return `<span class="page-badge" style="cursor:pointer;" onclick="openBookPageFromBestiary('${category}', '${appearance.book.replace(/'/g, "\\'")}', '${p}')">стр. ${p}</span>`;
                }
            }).join('');
            
            remainingHtml += `
                <div class="appearance-item">
                    <strong>📖 ${appearance.book}</strong>
                    <div class="appearance-pages">${pagesHtml}</div>
                </div>
            `;
        }
    });
    
    if (totalRemaining === 0) {
        remainingHtml = '<div style="text-align:center;padding:20px;color:var(--status-green);">✅ Все страницы с этим персонажем раскрашены!</div>';
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.style.zIndex = '100001';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div style="text-align: center; margin-bottom: 15px;">
                <img src="${character.image}" 
                     alt="${character.name}" 
                     style="width: 80px; height: 80px; object-fit: contain; border-radius: 16px;"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22%3E%3Crect width=%2280%22 height=%2280%22 fill=%22%23ff9500%22 rx=%2216%22/%3E%3Ctext x=%2240%22 y=%2240%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2230%22%3E🦁%3C/text%3E%3C/svg%3E'">
                <h3 style="margin: 10px 0 5px;">${character.name}</h3>
                <p style="color: var(--accent); font-size: 13px;">🎬 ${character.film}</p>
                <p style="color: var(--text-gray); font-size: 13px;">
                    Осталось раскрасить: ${totalRemaining} страниц
                </p>
            </div>
            ${remainingHtml}
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()" style="width: 100%; margin-top: 15px;">Закрыть</button>
        </div>
    `;
    
    modal.onclick = function(e) {
        if (e.target === modal) modal.remove();
    };
    
    document.body.appendChild(modal);
}
function openBookPageFromBestiary(category, bookName, page) {
    openBookPagesModal(category, bookName);
    const modal = document.querySelector('.modal-overlay[style*="display: flex"]');
    if (modal && modal.innerHTML.includes('Осталось раскрасить')) {
        modal.remove();
    }
}

async function uploadCustomCover(category, bookName) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append('user_id', userId.toString());
        formData.append('book_name', bookName);
        formData.append('cover', file);
        
        try {
            const response = await fetch(`${SERVER_URL}/api/upload_custom_cover`, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.status === 'ok') {
                const userBooks = userColoringBooks[category] || [];
                const book = userBooks.find(b => (typeof b === 'string' ? b : b.name) === bookName);
                if (book && typeof book === 'object') {
                    book.cover = result.url;
                } else if (book && typeof book === 'string') {
                    const idx = userBooks.indexOf(book);
                    userBooks[idx] = { name: book, custom: true, cover: result.url };
                }
                
                localStorage.setItem(`coloring_books_${userId}`, JSON.stringify(userColoringBooks));
                
                await fetch(`${SERVER_URL}/api/coloring_books`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: userId,
                        category: category,
                        book_name: bookName,
                        action: 'update_cover',
                        cover_url: result.url
                    })
                });
                
                renderColoringBooks();
                
                if (tg) tg.showAlert('✅ Обложка загружена!');
            }
        } catch (error) {
            console.error('Ошибка загрузки обложки:', error);
            if (tg) tg.showAlert('❌ Ошибка загрузки');
        }
    };
    
    input.click();
}

function openThemeModal() {
    const currentTheme = localStorage.getItem('app_theme') || user.theme || 'light';
    document.querySelectorAll('#themeModal .theme-option').forEach(el => {
        el.classList.toggle('active', el.dataset.theme === currentTheme);
    });
    document.getElementById('themeModal').style.display = 'flex';
}

function setTheme(themeName) {
    const oldStyle = document.getElementById('custom-theme-style');
    if (oldStyle) oldStyle.remove();
    if (themeName === 'custom') {
        applyCustomTheme(true);
    } else {
        document.documentElement.setAttribute('data-theme', themeName);
        user.theme = themeName;
        localStorage.setItem('app_theme', themeName);
    }
    document.querySelectorAll('.theme-option').forEach(el => {
        el.classList.remove('active');
        if (el.dataset.theme === themeName) el.classList.add('active');
    });
    var themeModal = document.getElementById('themeModal');
    if (themeModal) themeModal.style.display = 'none';
}

function toggleTasks() {
    const content = document.getElementById('tasksContent');
    const arrow = document.getElementById('tasksArrow');
    if (!content) return;
    if (content.style.display === 'block') {
        content.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    } else {
        content.style.display = 'block';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        renderBranchTasks();
        renderStatusFilters();
    }
}

function loadClaimedRewards() {
    fetch(`${SERVER_URL}/api/season_rewards?user_id=${userId}`)
        .then(r => r.json())
        .then(data => {
            claimedSeasonRewards = data || { free: [], premium: [] };
            window._seasonRewardsLoaded = true;
            saveClaimedRewards();
            renderSeasonPassTasks();
        })
        .catch(e => {
            const saved = localStorage.getItem(`season_rewards_${userId}`);
            claimedSeasonRewards = saved ? JSON.parse(saved) : { free: [], premium: [] };
            window._seasonRewardsLoaded = true;
            renderSeasonPassTasks();
        });
}

function saveClaimedRewards() {
    localStorage.setItem(`season_rewards_${userId}`, JSON.stringify(claimedSeasonRewards));
    fetch(`${SERVER_URL}/api/season_rewards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, rewards: claimedSeasonRewards })
    }).catch(e => console.error('Save rewards error:', e));
}

// ✅ Авто-восстановление D&D при загрузке
(function initDnd() {
    setTimeout(function() {
        fetch(SERVER_URL + '/api/dnd/payment_status?user_id=' + userId)
            .then(r => r.json())
            .then(function(data) {
                if (data.is_paid) {
                    autoRestoreDndGame();
                }
            });
    }, 300);
})();
        // ==========================================
// ПРИНУДИТЕЛЬНОЕ ДОБАВЛЕНИЕ КНОПКИ СТАТИСТИКИ
// ==========================================

function addStatsButton() {
    // Ищем блок с кнопками в профиле
    const headerDiv = document.querySelector('#profile > div:first-child > div:last-child');
    
    if (headerDiv) {
        // Проверяем, нет ли уже такой кнопки
        if (document.getElementById('statsShareBtn')) return;
        
        // Создаём новую кнопку
        const statsBtn = document.createElement('button');
        statsBtn.id = 'statsShareBtn';
        statsBtn.onclick = shareProfileStats;
        statsBtn.title = 'Поделиться статистикой';
        statsBtn.style.cssText = 'background: var(--accent); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);';
        statsBtn.innerHTML = '<i class="fas fa-chart-line"></i>';
        
        // Добавляем ПЕРВОЙ кнопкой
        headerDiv.insertBefore(statsBtn, headerDiv.firstChild);
        
        console.log('✅ Кнопка статистики добавлена!');
    } else {
        // Если не нашли — пробуем добавить в баланс
        const balanceControls = document.querySelector('.balance-controls');
        if (balanceControls && !document.getElementById('statsShareBtnBalance')) {
            const statsBtnBalance = document.createElement('button');
            statsBtnBalance.id = 'statsShareBtnBalance';
            statsBtnBalance.onclick = shareProfileStats;
            statsBtnBalance.className = 'balance-btn';
            statsBtnBalance.style.cssText = 'background: var(--accent); margin-top: 10px;';
            statsBtnBalance.innerHTML = '<i class="fas fa-chart-line"></i> 📊 Поделиться статистикой';
            balanceControls.appendChild(statsBtnBalance);
            console.log('✅ Кнопка статистики добавлена в баланс!');
        }
    }
}
function renderStars(difficulty) {
    let html = '';
    for (let i = 0; i < difficulty; i++) {
        html += '<i class="fas fa-star" style="color: #ffd700; font-size: 12px;"></i>';
    }
    for (let i = difficulty; i < 4; i++) {
        html += '<i class="far fa-star" style="color: #ffd700; font-size: 12px;"></i>';
    }
    return html;
}
       
function filterTasksByDifficulty(difficulty) {
    console.log('🔍 Фильтр по звёздам, выбрано:', difficulty);
    
    currentDifficultyFilter = difficulty;
    
    const cards = document.querySelectorAll('#branchTasksList .branch-task-card');
    console.log('📊 Найдено карточек:', cards.length);
    
    let visibleCount = 0;
    
    cards.forEach(card => {
        let starsSpan = card.querySelector('.stars');
        if (!starsSpan) {
            starsSpan = card.querySelector('.branch-header .stars');
        }
        if (!starsSpan) {
            card.style.display = '';
            return;
        }
        
        const cardDifficulty = parseInt(starsSpan.getAttribute('data-difficulty'));
        
        if (difficulty === 'all' || cardDifficulty === difficulty) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    console.log(`✅ Показано ${visibleCount} карточек`);
    
    // Обновляем активное состояние кнопок
    document.querySelectorAll('.difficulty-filters .filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-difficulty') == difficulty || 
            (difficulty === 'all' && btn.getAttribute('data-difficulty') === 'all')) {
            btn.classList.add('active');
        }
    });
    
    // ✅ ПЕРЕДАЁМ ФИЛЬТР СЛОЖНОСТИ В applyAllFilters
    if (typeof applyAllFilters === 'function') {
        applyAllFilters(currentDifficultyFilter);
    }
}
        // ==========================================
// ВЫПАДАЮЩИЕ МЕНЮ ДЛЯ ФИЛЬТРОВ
// ==========================================

function toggleCategoryDropdown() {
    const dropdown = document.getElementById('categoryDropdown');
    const btn = document.getElementById('categoryFilterBtn');
    
    if (!btn) return;
    
    const rect = btn.getBoundingClientRect();
    
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
        dropdown.style.top = (rect.bottom + 5) + 'px';
        dropdown.style.left = rect.left + 'px';
        dropdown.style.width = rect.width + 'px';
    }
}

function toggleDifficultyDropdown() {
    const dropdown = document.getElementById('difficultyDropdown');
    const btn = document.getElementById('difficultyFilterBtn');
    
    if (!btn) return;
    
    const rect = btn.getBoundingClientRect();
    
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
        dropdown.style.top = (rect.bottom + 5) + 'px';
        dropdown.style.left = rect.left + 'px';
        dropdown.style.width = rect.width + 'px';
    }
}
function selectCategory(category) {
    currentCategoryFilter = category;
    
    const btnSpan = document.querySelector('#categoryFilterBtn span');
    const categoryNames = {
        'all': '📂 Все категории',
        'princess': '👑 Принцессы',
        'animals': '🐾 Животные',
        'villains': '👿 Злодеи',
        'special': '✨ Особые',
        'stories': '📖 Истории'
    };
    if (btnSpan) btnSpan.innerText = categoryNames[category] || '📂 Все категории';
    
    document.getElementById('categoryDropdown').style.display = 'none';
    applyAllFilters();
}

function selectDifficulty(difficulty) {
    currentDifficultyFilter = difficulty;
    
    const btnSpan = document.querySelector('#difficultyFilterBtn span');
    const difficultyNames = {
        'all': '⭐ Все сложности',
        1: '⭐ Лёгкие',
        2: '⭐⭐ Средние',
        3: '⭐⭐⭐ Сложные',
        4: '⭐⭐⭐⭐ Экстра'
    };
    if (btnSpan) btnSpan.innerText = difficultyNames[difficulty] || '⭐ Все сложности';
    
    document.getElementById('difficultyDropdown').style.display = 'none';
    applyAllFilters();
}
// Закрытие дропдаунов при клике вне их
document.addEventListener('click', function(event) {
    if (!event.target.closest('#categoryFilterBtn')) {
        const catDropdown = document.getElementById('categoryDropdown');
        if (catDropdown) catDropdown.style.display = 'none';
    }
    if (!event.target.closest('#difficultyFilterBtn')) {
        const diffDropdown = document.getElementById('difficultyDropdown');
        if (diffDropdown) diffDropdown.style.display = 'none';
    }
});
