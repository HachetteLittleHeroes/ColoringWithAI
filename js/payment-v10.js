let selectedPaymentCharacter = null;
let paymentScreenshotFile = null;

function openPaymentModal() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
    
    selectedPaymentCharacter = null;
    paymentScreenshotFile = null;
    
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff9500';
    
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; display: flex !important; align-items: center !important; justify-content: center !important; background: rgba(0,0,0,0.85) !important; z-index: 99999 !important;';
    
    modal.innerHTML = `
        <div style="
            background: #1e1e1e !important; 
            color: #ffffff !important; 
            width: 100%; 
            max-width: 400px; 
            border-radius: 24px; 
            padding: 25px; 
            border: 1px solid rgba(255,255,255,0.1); 
            max-height: 80vh; 
            overflow-y: auto;
        ">
            <h3 style="color: #ffffff; text-align: center; margin: 0 0 20px 0;">
                💰 Открыть доступ к персонажу
            </h3>
            
            <div id="paymentStep1">
                <p style="color: #8e8e93; font-size: 13px; margin-bottom: 15px; text-align: center;">
                    Загрузка...
                </p>
            </div>
            
            <div id="paymentStep2" style="display: none;">
                <div id="paymentSelectedChar" style="background: ${accent}22; border-radius: 12px; padding: 10px; text-align: center; margin-bottom: 15px; font-weight: 600; color: ${accent};"></div>
                
                <p style="color: #8e8e93; font-size: 13px; margin-bottom: 10px;">
                    1️⃣ Перейдите по ссылке и оплатите <strong style="color: #ffffff;">1000 ₽</strong>
                </p>
                <a href="https://www.tbank.ru/cf/4qQVzZbtu45" target="_blank" 
                   style="display: block; width: 100%; background: ${accent}; color: white; text-align: center; padding: 14px; border-radius: 14px; text-decoration: none; font-weight: 600; font-size: 15px; margin-bottom: 15px;">
                    💳 Перейти к оплате
                </a>
                
                <p style="color: #8e8e93; font-size: 13px; margin-bottom: 10px;">
                    2️⃣ После оплаты загрузите скриншот чека
                </p>
                
                <input type="file" id="paymentScreenshotInput" accept="image/*" style="display: none;" onchange="handlePaymentScreenshot(event)">
                <button onclick="document.getElementById('paymentScreenshotInput').click()" 
                        style="width: 100%; padding: 14px; border-radius: 14px; font-weight: 600; font-size: 14px; cursor: pointer; margin-bottom: 15px; background: #2c2c2e; color: #ffffff; border: 2px dashed ${accent};">
                    📸 Загрузить скриншот чека
                </button>
                
                <div id="paymentScreenshotPreview" style="text-align: center; margin-bottom: 15px; display: none;">
                    <img id="paymentScreenshotImg" style="width: 100%; max-height: 200px; object-fit: contain; border-radius: 12px; border: 2px solid ${accent};">
                </div>
                
                <button id="paymentSubmitBtn" onclick="submitPayment()" disabled 
                        style="width: 100%; padding: 14px; border-radius: 14px; font-weight: 600; font-size: 14px; cursor: pointer; background: #34c759; color: white; border: none; margin-bottom: 10px;">
                    ✅ Отправить на проверку
                </button>
                <p style="color: #8e8e93; font-size: 11px; text-align: center;">
                    После проверки: доступ + 2000 ашетиков
                </p>
            </div>
            
            <div id="paymentStep3" style="display: none; text-align: center;">
                <div id="paymentResultIcon" style="font-size: 48px; margin-bottom: 10px;"></div>
                <p id="paymentResultText" style="color: #ffffff; font-size: 14px; margin-bottom: 15px;"></p>
            </div>
            
            <button onclick="closePaymentModal()" 
                    style="width: 100%; padding: 12px; border-radius: 14px; font-weight: 600; font-size: 14px; cursor: pointer; background: #444; color: white; border: none; margin-top: 10px;">
                ← Назад
            </button>
        </div>
    `;
    
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
    
    // ✅ Загружаем доступ и обновляем кнопки
    const charNames = { mystic: '⚔️ Мистий', thief: '🗡️ Воровка', alchemist: '🔮 Алхимик' };
    
    fetch(`${SERVER_URL}/api/castle/check_all_access?user_id=${userId}`)
        .then(r => r.json())
        .then(data => {
            const access = data.access || {};
            
            let buttonsHtml = '';
            for (const [id, name] of Object.entries(charNames)) {
                // ✅ Воровка и Алхимик временно недоступны
                const isComingSoon = (id === 'thief' || id === 'alchemist');
                
                if (isComingSoon) {
                    buttonsHtml += `
                        <button disabled
                                style="
                                    width: 100%; 
                                    padding: 14px; 
                                    border-radius: 14px; 
                                    font-weight: 600; 
                                    font-size: 15px; 
                                    margin-bottom: 10px; 
                                    background: rgba(255,255,255,0.05); 
                                    color: rgba(255,255,255,0.3); 
                                    border: 2px solid rgba(255,255,255,0.05);
                                    cursor: not-allowed;
                                ">
                            ${name} — Скоро
                        </button>
                    `;
                } else if (access[id]) {
                    buttonsHtml += `
                        <button disabled
                                style="
                                    width: 100%; 
                                    padding: 14px; 
                                    border-radius: 14px; 
                                    font-weight: 600; 
                                    font-size: 15px; 
                                    margin-bottom: 10px; 
                                    background: rgba(52,199,89,0.2); 
                                    color: #34c759; 
                                    border: 2px solid rgba(52,199,89,0.3);
                                    cursor: not-allowed;
                                    opacity: 0.7;
                                ">
                            ✅ ${name} — Уже открыт
                        </button>
                    `;
                } else {
                    buttonsHtml += `
                        <button onclick="selectPaymentCharacter('${id}')" 
                                style="
                                    width: 100%; 
                                    padding: 14px; 
                                    border-radius: 14px; 
                                    font-weight: 600; 
                                    font-size: 15px; 
                                    cursor: pointer; 
                                    margin-bottom: 10px; 
                                    background: #2c2c2e; 
                                    color: #ffffff; 
                                    border: 2px solid rgba(255,255,255,0.1);
                                ">
                            ${name} — 1000 ₽
                        </button>
                    `;
                }
            }
            
            document.getElementById('paymentStep1').innerHTML = `
                <p style="color: #8e8e93; font-size: 13px; margin-bottom: 15px; text-align: center;">
                    Выберите персонажа, которого хотите открыть:
                </p>
                ${buttonsHtml}
            `;
        });
}
function closePaymentModal() {
    const modals = document.querySelectorAll('div[style*="z-index: 99999"]');
    modals.forEach(m => m.remove());
}
function closePaymentModal() {
    // Ищем модалку по стилям (position: fixed с z-index: 99999)
    const modals = document.querySelectorAll('div[style*="z-index: 99999"]');
    modals.forEach(m => m.remove());
}

function selectPaymentCharacter(characterId) {
    selectedPaymentCharacter = characterId;
    
    const charNames = { mystic: '⚔️ Мистий', thief: '🗡️ Воровка', alchemist: '🔮 Алхимик' };
    document.getElementById('paymentSelectedChar').innerText = charNames[characterId] || characterId;
    
    document.getElementById('paymentStep1').style.display = 'none';
    document.getElementById('paymentStep2').style.display = 'block';
}

function handlePaymentScreenshot(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    paymentScreenshotFile = file;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('paymentScreenshotImg').src = e.target.result;
        document.getElementById('paymentScreenshotPreview').style.display = 'block';
        document.getElementById('paymentSubmitBtn').disabled = false;
    };
    reader.readAsDataURL(file);
}

async function submitPayment() {
    if (!selectedPaymentCharacter || !paymentScreenshotFile) {
        alert('Выберите персонажа и загрузите скриншот чека');
        return;
    }
    
    const submitBtn = document.getElementById('paymentSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.innerText = '⏳ Отправка...';
    
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('character', selectedPaymentCharacter);
    formData.append('screenshot', paymentScreenshotFile);
    
    try {
        const response = await fetch(`${SERVER_URL}/api/verify_payment`, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        document.getElementById('paymentStep2').style.display = 'none';
        document.getElementById('paymentStep3').style.display = 'block';
        
        if (result.status === 'ok') {
            document.getElementById('paymentResultIcon').innerHTML = '✅';
            document.getElementById('paymentResultText').innerHTML = `
                Доступ к персонажу <strong>${result.character_name}</strong> открыт!<br>
                Начислено <strong>${result.bonus_achetiki}</strong> ашетиков (x2 от суммы).<br>
                Баланс: <strong>${result.new_balance}</strong> ашетиков.
            `;
            
            // Обновляем баланс
            user.balance = result.new_balance;
            saveUserData();
            updateUI();
            
            // ✅ Через 3 секунды возвращаем на предпросмотр истории
            setTimeout(() => {
                backToStoryPreview();
            }, 3000);
            
        } else {
            document.getElementById('paymentResultIcon').innerHTML = '❌';
            document.getElementById('paymentResultText').innerText = result.message || 'Ошибка проверки чека. Попробуйте ещё раз или обратитесь к администратору.';
        }
    } catch (error) {
        document.getElementById('paymentStep2').style.display = 'none';
        document.getElementById('paymentStep3').style.display = 'block';
        document.getElementById('paymentResultIcon').innerHTML = '❌';
        document.getElementById('paymentResultText').innerText = 'Ошибка соединения. Попробуйте ещё раз.';
    }
    
    submitBtn.disabled = false;
    submitBtn.innerText = '✅ Отправить на проверку';
}
