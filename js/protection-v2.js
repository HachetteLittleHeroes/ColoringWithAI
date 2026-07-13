// ==========================================
// ЗАЩИТА ОТ КОПИРОВАНИЯ КОДА
// ==========================================

// Приветственное сообщение в консоль
(function() {
    console.clear();
    console.log("%c✨ArtFlex — Дневник любителя Hachette", "font-size: 30px; color: #ff9500; font-weight: bold;");
    console.log("%cОКАК! Не ожидал тебя здесь увидеть! Тебе здесь нечего делать. Мы за честность, наш код защищен авторским правом, копирование кода запрещено © ArtFlex", "font-size: 14px; color: #aaa;");
    console.log("%c📖 Наша группа: @hachettelittleheroes в Telegram", "font-size: 14px; color: #ff9500;");
    console.log("%c🔒 Копирование кода запрещено © ArtFlex, " + new Date().getFullYear(), "font-size: 12px; color: #f44;");
})();

// Отправка уведомления админу
function sendDevToolsAlert(method) {
    var userInfo = {
        userAgent: navigator.userAgent,
        screenSize: screen.width + 'x' + screen.height,
        time: new Date().toLocaleString('ru-RU'),
        url: window.location.href,
        userId: typeof userId !== 'undefined' ? userId : 'неизвестен',
        method: method
    };
    
    fetch('https://hlhbot-hachettelittleheroes.amvera.io/api/devtools_alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo)
    }).catch(function() {});
}

// Блокировка правой кнопки мыши
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Блокировка горячих клавиш разработчика + уведомление
var keyAlertSent = false;
document.addEventListener('keydown', function(e) {
    var blocked = false;
    var keyName = '';
    
    // Ctrl+Shift+I (DevTools)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        blocked = true;
        keyName = 'Ctrl+Shift+I';
    }
    // F12
    if (e.key === 'F12') {
        blocked = true;
        keyName = 'F12';
    }
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        blocked = true;
        keyName = 'Ctrl+Shift+J';
    }
    // Ctrl+U (View Source)
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        blocked = true;
        keyName = 'Ctrl+U';
    }
    // Ctrl+S (Save)
    if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        blocked = true;
        keyName = 'Ctrl+S';
    }
    
    if (blocked) {
        e.preventDefault();
        
        // Отправляем уведомление при попытке
        if (!keyAlertSent) {
            keyAlertSent = true;
            sendDevToolsAlert('keyboard: ' + keyName);
        }
        
        return false;
    }
});

// Обнаружение открытых DevTools + уведомление админу в Telegram
(function() {
    var devToolsOpen = false;
    var threshold = 160;
    var sizeAlertSent = false;
    
    setInterval(function() {
        var widthThreshold = window.outerWidth - window.innerWidth > threshold;
        var heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if ((widthThreshold || heightThreshold) && !devToolsOpen) {
            devToolsOpen = true;
            
            if (!sizeAlertSent) {
                sizeAlertSent = true;
                sendDevToolsAlert('window resize');
            }
            
            document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#1a1a2e;color:#fff;font-family:sans-serif;text-align:center;"><div><div style="font-size:80px;margin-bottom:20px;">🔒</div><h1>Инструменты разработчика открыты</h1><p style="color:#888;">Пожалуйста, закройте DevTools для продолжения</p><button onclick="location.reload()" style="margin-top:20px;padding:14px 28px;background:#ff9500;color:white;border:none;border-radius:12px;font-size:16px;cursor:pointer;">🔄 Обновить страницу</button></div></div>';
        }
    }, 500);
})();

// Защита от debugger
setInterval(function() {
    var start = performance.now();
    debugger;
    var end = performance.now();
    if (end - start > 100) {
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#666;"><h1>🔒 Доступ ограничен</h1></div>';
    }
}, 200);
    }
}, 200);
