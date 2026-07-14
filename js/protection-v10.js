// ==========================================
// ЗАЩИТА ОТ КОПИРОВАНИЯ КОДА (ИСПРАВЛЕНО)
// ==========================================

// Приветственное сообщение в консоль
console.clear();
console.log("%c✨ArtFlex — Дневник любителя Hachette", "font-size: 30px; color: #ff9500; font-weight: bold;");
console.log("%cОКАК! Не ожидал тебя здесь увидеть!", "font-size: 14px; color: #aaa;");
console.log("%c📖 @hachettelittleheroes", "font-size: 14px; color: #ff9500;");
console.log("%c🔒 Копирование запрещено © ArtFlex " + new Date().getFullYear(), "font-size: 12px; color: #f44;");

// ==========================================
// ОПРЕДЕЛЕНИЕ СРЕДЫ
// ==========================================
function isTelegramWebView() {
    return !!(window.Telegram?.WebApp);
}

function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
}

function isTelegramDesktop() {
    // Telegram Desktop WebView
    return isTelegramWebView() && !isMobileDevice();
}

// ==========================================
// ОТПРАВКА УВЕДОМЛЕНИЯ АДМИНУ
// ==========================================
function sendAlert(method) {
    var userInfo = {
        userId: typeof userId !== 'undefined' ? userId : 'неизвестен',
        method: method,
        userAgent: navigator.userAgent.substring(0, 100),
        screenSize: screen.width + 'x' + screen.height,
        windowSize: window.innerWidth + 'x' + window.innerHeight,
        outerSize: window.outerWidth + 'x' + window.outerHeight,
        isTelegram: isTelegramWebView(),
        isMobile: isMobileDevice(),
        time: new Date().toLocaleString('ru-RU'),
        url: window.location.href
    };
    
    fetch('https://hlhbot-hachettelittleheroes.amvera.io/api/devtools_alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo),
        keepalive: true
    }).catch(function(){});
}

// ==========================================
// ЗАЩИТА ОТ КЛАВИАТУРНЫХ КОМБИНАЦИЙ
// ==========================================
var keyAlertSent = false;
document.addEventListener('keydown', function(e) {
    if (keyAlertSent) return;
    
    // Блокируем ТОЛЬКО реальные DevTools-комбинации
    var isDevToolsShortcut = 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        e.key === 'F12' ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U'));
    
    if (isDevToolsShortcut) {
        e.preventDefault();
        e.stopPropagation();
        
        if (!keyAlertSent) {
            keyAlertSent = true;
            sendAlert('keyboard');
            console.clear();
            console.log('%c⚠️ Инструменты разработчика заблокированы', 'color: #f44; font-size: 14px;');
        }
        
        return false;
    }
    
    // Блокировка ПКМ (контекстного меню)
    if (e.key === 'F12' || (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
        return false;
    }
});

// Блокировка контекстного меню (ПКМ)
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// ==========================================
// ОБНАРУЖЕНИЕ DEVTOOLS (ИСПРАВЛЕНО!)
// ==========================================
var sizeAlertSent = false;

// 🔥 КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: НЕ проверяем размеры в Telegram WebView
function shouldCheckDevTools() {
    // В Telegram WebView НЕ проверяем размеры
    if (isTelegramWebView()) {
        return false;
    }
    
    // На мобильных НЕ проверяем размеры
    if (isMobileDevice()) {
        return false;
    }
    
    // Только на ПК в обычном браузере
    return true;
}

// Запускаем проверку ТОЛЬКО если это ПК-браузер (не Telegram)
if (shouldCheckDevTools()) {
    var devToolsCheckInterval = setInterval(function() {
        if (sizeAlertSent) {
            clearInterval(devToolsCheckInterval);
            return;
        }
        
        // Используем более точную проверку
        var widthDiff = window.outerWidth - window.innerWidth;
        var heightDiff = window.outerHeight - window.innerHeight;
        
        // DevTools обычно открываются снизу или справа
        // Проверяем более реалистичную разницу
        var isDevToolsOpen = false;
        
        // Способ 1: Разница размеров (точный порог)
        if (widthDiff > 200 || heightDiff > 200) {
            isDevToolsOpen = true;
        }
        
        // Способ 2: Проверка через console.log (более надёжный)
        // DevTools добавляет задержку при console.log
        if (!isDevToolsOpen && window.console && console.log) {
            var startTime = performance.now();
            console.log('%c ', '');
            var endTime = performance.now();
            if (endTime - startTime > 100) {
                isDevToolsOpen = true;
            }
        }
        
        if (isDevToolsOpen) {
            sizeAlertSent = true;
            sendAlert('devtools_detected');
            
            // Показываем страницу блокировки
            document.body.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#1a1a2e;color:#fff;font-family:sans-serif;text-align:center;padding:20px;">
                    <div>
                        <div style="font-size:80px;margin-bottom:20px;">🔒</div>
                        <h1>Инструменты разработчика открыты</h1>
                        <p style="color:#aaa;margin-top:10px;">Закройте DevTools и обновите страницу</p>
                        <button onclick="location.reload()" style="margin-top:20px;padding:14px 28px;background:#ff9500;color:white;border:none;border-radius:12px;font-size:16px;cursor:pointer;">
                            🔄 Обновить
                        </button>
                    </div>
                </div>
            `;
        }
    }, 1000); // Проверяем раз в секунду вместо 500мс
}

// ==========================================
// ЗАЩИТА ДЛЯ TELEGRAM (БЕЗ БЛОКИРОВКИ)
// ==========================================
if (isTelegramWebView()) {
    // В Telegram WebView только блокируем клавиши (если они есть)
    // НЕ проверяем размеры окна
    
    // Запрещаем выделение текста (опционально)
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
    });
    
    // Запрещаем перетаскивание изображений
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });
}

// ==========================================
// ДОПОЛНИТЕЛЬНАЯ ЗАЩИТА (ДЛЯ ВСЕХ)
// ==========================================
(function() {
    // Защита от вставки скриптов через консоль
    var _eval = window.eval;
    window.eval = function() {
        console.clear();
        console.log('%c⚠️ Использование eval запрещено', 'color: #f44;');
        sendAlert('eval_attempt');
        return undefined;
    };
    
    // Защита от отладчика
    setInterval(function() {
        var start = performance.now();
        debugger;
        var end = performance.now();
        if (end - start > 100 && shouldCheckDevTools()) {
            sendAlert('debugger_detected');
        }
    }, 2000);
})();
