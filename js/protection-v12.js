// ==========================================
// ЗАЩИТА ОТ КОПИРОВАНИЯ КОДА (ПОЛНОСТЬЮ ИСПРАВЛЕНО)
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
// 🔥 ЗАЩИТА ОТ КЛАВИАТУРНЫХ КОМБИНАЦИЙ (ИСПРАВЛЕНО!)
// ==========================================
var keyAlertSent = false;

// Все запрещённые комбинации
var blockedKeys = [
    { key: 'F12', code: 'F12', ctrl: false, shift: false, alt: false, meta: false },
    { key: 'I', code: 'KeyI', ctrl: true, shift: true, alt: false, meta: false },
    { key: 'i', code: 'KeyI', ctrl: true, shift: true, alt: false, meta: false },
    { key: 'J', code: 'KeyJ', ctrl: true, shift: true, alt: false, meta: false },
    { key: 'j', code: 'KeyJ', ctrl: true, shift: true, alt: false, meta: false },
    { key: 'C', code: 'KeyC', ctrl: true, shift: true, alt: false, meta: false },
    { key: 'c', code: 'KeyC', ctrl: true, shift: true, alt: false, meta: false },
    { key: 'U', code: 'KeyU', ctrl: true, shift: false, alt: false, meta: false },
    { key: 'u', code: 'KeyU', ctrl: true, shift: false, alt: false, meta: false },
    // Mac: Cmd+Option+I
    { key: 'I', code: 'KeyI', ctrl: false, shift: false, alt: true, meta: true },
    { key: 'i', code: 'KeyI', ctrl: false, shift: false, alt: true, meta: true },
    // Mac: Cmd+Option+J
    { key: 'J', code: 'KeyJ', ctrl: false, shift: false, alt: true, meta: true },
    { key: 'j', code: 'KeyJ', ctrl: false, shift: false, alt: true, meta: true },
];

// 🔥 ИСПОЛЬЗУЕМ window С ФАЗОЙ ПЕРЕХВАТА (true) — это ключевое исправление!
window.addEventListener('keydown', function(e) {
    for (var i = 0; i < blockedKeys.length; i++) {
        var combo = blockedKeys[i];
        
        // Проверяем совпадение клавиши (key или code)
        var keyMatch = (e.key === combo.key || e.code === combo.code);
        
        // Проверяем модификаторы
        var ctrlMatch = combo.ctrl ? (e.ctrlKey || e.metaKey) : (!combo.ctrl || !e.ctrlKey);
        var shiftMatch = combo.shift ? e.shiftKey : (!combo.shift || !e.shiftKey);
        var altMatch = combo.alt ? e.altKey : (!combo.alt || !e.altKey);
        var metaMatch = combo.meta ? e.metaKey : (!combo.meta || !e.metaKey);
        
        // Для Mac Cmd+Option проверяем точнее
        if (combo.meta && combo.alt) {
            ctrlMatch = !e.ctrlKey;
            metaMatch = e.metaKey;
            altMatch = e.altKey;
        }
        
        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            console.clear();
            console.log('%c🚫 Доступ запрещён', 'color: #f44; font-size: 16px; font-weight: bold;');
            console.log('%cИнструменты разработчика заблокированы', 'color: #aaa;');
            
            if (!keyAlertSent) {
                keyAlertSent = true;
                sendAlert('keyboard_blocked');
            }
            
            return false;
        }
    }
}, true); // ← ВАЖНО: true = фаза перехвата!

// Дублируем на keyup для надёжности
window.addEventListener('keyup', function(e) {
    for (var i = 0; i < blockedKeys.length; i++) {
        var combo = blockedKeys[i];
        var keyMatch = (e.key === combo.key || e.code === combo.code);
        
        if (keyMatch && 
            (combo.ctrl ? (e.ctrlKey || e.metaKey) : true) && 
            (combo.shift ? e.shiftKey : true)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
}, true);

// Блокировка контекстного меню (ПКМ)
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    if (e.ctrlKey || e.shiftKey || e.altKey) {
        sendAlert('contextmenu_devtools');
    }
    return false;
});

// ==========================================
// ОБНАРУЖЕНИЕ DEVTOOLS (ИСПРАВЛЕНО!)
// ==========================================
var sizeAlertSent = false;

// НЕ проверяем размеры в Telegram WebView и на мобильных
function shouldCheckDevTools() {
    if (isTelegramWebView()) return false;
    if (isMobileDevice()) return false;
    return true;
}

if (shouldCheckDevTools()) {
    var devToolsCheckInterval = setInterval(function() {
        if (sizeAlertSent) {
            clearInterval(devToolsCheckInterval);
            return;
        }
        
        var widthDiff = window.outerWidth - window.innerWidth;
        var heightDiff = window.outerHeight - window.innerHeight;
        var isDevToolsOpen = false;
        
        // Способ 1: Разница размеров
        if (widthDiff > 200 || heightDiff > 200) {
            isDevToolsOpen = true;
        }
        
        // Способ 2: Задержка console.log
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
    }, 1000);
}

// ==========================================
// ЗАЩИТА ДЛЯ TELEGRAM (БЕЗ БЛОКИРОВКИ РАЗМЕРОВ)
// ==========================================
if (isTelegramWebView()) {
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });
    
    // Блокировка копирования/вставки
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    });
    
    document.addEventListener('cut', function(e) {
        e.preventDefault();
        return false;
    });
    
    document.addEventListener('paste', function(e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            return false;
        }
    });
}

// ==========================================
// ДОПОЛНИТЕЛЬНАЯ ЗАЩИТА (ДЛЯ ВСЕХ)
// ==========================================
(function() {
    // Защита от eval
    var _eval = window.eval;
    window.eval = function() {
        console.clear();
        console.log('%c⚠️ Использование eval запрещено', 'color: #f44;');
        sendAlert('eval_attempt');
        return undefined;
    };
    
    // Защита от отладчика (только на ПК)
    setInterval(function() {
        if (!shouldCheckDevTools()) return;
        var start = performance.now();
        debugger;
        var end = performance.now();
        if (end - start > 100) {
            sendAlert('debugger_detected');
        }
    }, 2000);
})();
