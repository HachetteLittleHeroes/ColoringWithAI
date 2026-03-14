// js/telegram.js

var tg = window.Telegram.WebApp;

tg.expand();
tg.ready();

function haptic(type = "light") {
    if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred(type);
    }
}
