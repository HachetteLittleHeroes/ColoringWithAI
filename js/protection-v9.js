// ==========================================
// ЗАЩИТА ОТ КОПИРОВАНИЯ КОДА
// ==========================================

// Приветственное сообщение в консоль
console.clear();
console.log("%c✨ArtFlex — Дневник любителя Hachette", "font-size: 30px; color: #ff9500; font-weight: bold;");
console.log("%cОКАК! Не ожидал тебя здесь увидеть!", "font-size: 14px; color: #aaa;");
console.log("%c📖 @hachettelittleheroes", "font-size: 14px; color: #ff9500;");
console.log("%c🔒 Копирование запрещено © ArtFlex " + new Date().getFullYear(), "font-size: 12px; color: #f44;");

// Отправка уведомления админу (без задержки)
function sendAlert(method) {
    var userInfo = {
        userId: typeof userId !== 'undefined' ? userId : 'неизвестен',
        method: method,
        userAgent: navigator.userAgent.substring(0, 100),
        screenSize: screen.width + 'x' + screen.height,
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

// Уведомление при попытке нажать запрещённые клавиши
// (сама блокировка клавиш — в inline-скрипте в <head>)
var keyAlertSent = false;
document.addEventListener('keydown', function(e) {
    if (keyAlertSent) return;
    if (
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        e.key === 'F12' ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U'))
    ) {
        keyAlertSent = true;
        sendAlert('keyboard');
    }
});

// Обнаружение открытых DevTools + уведомление админу
var sizeAlertSent = false;
setInterval(function() {
    if (sizeAlertSent) return;
    if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
        sizeAlertSent = true;
        sendAlert('window resize');
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#1a1a2e;color:#fff;font-family:sans-serif;text-align:center;"><div><div style="font-size:80px;margin-bottom:20px;">🔒</div><h1>Инструменты разработчика открыты</h1><button onclick="location.reload()" style="margin-top:20px;padding:14px 28px;background:#ff9500;color:white;border:none;border-radius:12px;font-size:16px;cursor:pointer;">🔄 Обновить</button></div></div>';
    }
}, 500);
