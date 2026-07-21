function openWebLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.style.zIndex = '100005';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px; text-align: center;">
            <h3>🔑 Доступ через браузер</h3>
            <p style="color: var(--text-gray); font-size: 13px; margin-bottom: 20px;">
                Зарегистрируйте аккаунт для входа в приложение через браузер без Telegram.
            </p>
            
            <div id="webLoginForm">
                <input type="text" id="webLoginInput" placeholder="Придумайте логин" style="width: 100%; padding: 14px 16px; margin-bottom: 12px; border: 1px solid var(--border-color); border-radius: 14px; background: var(--input-bg); color: var(--text); font-size: 16px; outline: none;">
                <input type="password" id="webPasswordInput" placeholder="Придумайте пароль" style="width: 100%; padding: 14px 16px; margin-bottom: 15px; border: 1px solid var(--border-color); border-radius: 14px; background: var(--input-bg); color: var(--text); font-size: 16px; outline: none;">
                
                <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 15px; text-align: left;">
                    <input type="checkbox" id="webAgreementCheckbox" style="width: 18px; height: 18px; margin-top: 2px; flex-shrink: 0; accent-color: var(--accent);">
                    <span style="color: var(--text); font-size: 13px; line-height: 1.4;">
                        Я принимаю условия 
                        <a href="https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/legal/terms.html" target="_blank" style="color: var(--accent); text-decoration: underline;">Пользовательского соглашения</a> 
                        и 
                        <a href="https://218ea43893c4-hachette-artwork.s3.ru1.storage.beget.cloud/legal/privacy.html" target="_blank" style="color: var(--accent); text-decoration: underline;">Политики конфиденциальности</a>
                    </span>
                </div>
                
                <button class="task-submit-btn" onclick="registerWebUser()" style="width: 100%; margin-bottom: 15px;">
                    📝 Зарегистрироваться
                </button>
                
                <div style="width: 80%; height: 1px; background: var(--border-color); margin: 15px auto;"></div>
                
                <p style="color: var(--text-gray); font-size: 13px; margin-bottom: 12px;">
                    После регистрации войдите через браузер:
                </p>
                
                <a href="${SERVER_URL}/login.html" target="_blank" 
                   style="display: flex; align-items: center; justify-content: center; gap: 8px; 
                          width: 100%; padding: 14px; background: linear-gradient(135deg, #FF8C00 0%, #E65100 100%); 
                          color: white; border-radius: 14px; font-size: 15px; font-weight: 600; 
                          text-decoration: none; box-shadow: 0 4px 12px rgba(255, 149, 0, 0.3);">
                    🔗 Открыть страницу входа
                </a>
                
                <div style="width: 80%; height: 1px; background: var(--border-color); margin: 15px auto;"></div>
                
                <p style="color: var(--text-gray); font-size: 12px; margin-bottom: 8px;">Забыли пароль?</p>
                <button class="task-submit-btn" onclick="requestPasswordReset()" style="width: 100%; background: var(--status-red); margin-bottom: 15px;">
                    🔄 Сбросить пароль
                </button>
                
                <p style="color: var(--text-gray); font-size: 11px;">Новый пароль придёт в Telegram после одобрения администратором</p>
            </div>
            
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">Закрыть</button>
        </div>
    `;
    
    modal.onclick = function(e) {
        if (e.target === modal) modal.remove();
    };
    
    document.body.appendChild(modal);
}
async function registerWebUser() {
    const login = document.getElementById('webLoginInput').value.trim().toLowerCase();
    const password = document.getElementById('webPasswordInput').value;
    const checkbox = document.getElementById('webAgreementCheckbox');
    
    if (!login || !password) {
        alert('Заполните все поля');
        return;
    }
    
    if (login.length < 3) {
        alert('Логин должен быть минимум 3 символа');
        return;
    }
    
    if (password.length < 6) {
        alert('Пароль должен быть минимум 6 символов');
        return;
    }
    
    if (!checkbox || !checkbox.checked) {
        alert('Необходимо принять условия Пользовательского соглашения и Политики конфиденциальности');
        return;
    }
    
    try {
        const response = await fetch(`${SERVER_URL}/api/register_web_user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, login: login, password: password })
        });
        
        const data = await response.json();
        
        if (data.status === 'ok') {
            alert('✅ Аккаунт создан! Теперь вы можете войти через браузер.\n\nВаш логин: ' + login + '\nСсылка для входа: ' + SERVER_URL + '/login.html');
        } else {
            alert('❌ ' + (data.message || 'Ошибка регистрации'));
        }
    } catch (e) {
        alert('❌ Ошибка соединения');
    }
}

async function loginWebUser() {
    const login = document.getElementById('webLoginInput').value.trim().toLowerCase();
    const password = document.getElementById('webPasswordInput').value;
    
    if (!login || !password) {
        alert('Заполните все поля');
        return;
    }
    
    try {
        const response = await fetch(`${SERVER_URL}/api/login_web_user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login: login, password: password })
        });
        
        const data = await response.json();
        
        if (data.status === 'ok') {
            alert('✅ Успешный вход! Ссылка для входа через браузер:\n\n' + SERVER_URL + '/login.html');
        } else {
            alert('❌ ' + (data.message || 'Неверный логин или пароль'));
        }
    } catch (e) {
        alert('❌ Ошибка соединения');
    }
}

async function requestPasswordReset() {
    if (!confirm('Отправить заявку на сброс пароля? Администратор рассмотрит её и пришлёт новый пароль в Telegram.')) return;
    
    try {
        const response = await fetch(`${SERVER_URL}/api/request_password_reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        });
        
        const data = await response.json();
        
        if (data.status === 'ok') {
            alert('✅ Заявка отправлена! Ожидайте новый пароль в Telegram.');
        } else {
            alert('❌ ' + (data.message || 'Ошибка'));
        }
    } catch (e) {
        alert('❌ Ошибка соединения');
    }
}