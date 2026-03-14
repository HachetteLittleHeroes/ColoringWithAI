// js/profile.js

function updateNameDisplay() {
    const nameEl = document.getElementById("profileName");
    if (nameEl) {
        nameEl.textContent = userProfileData.name;
    }
}

function changeUserName() {
    const newName = prompt("Введите новое имя:");
    if (!newName) return;

    userProfileData.name = newName;
    updateNameDisplay();
}

function toggleAvatarEditor() {
    isEditingAvatar = !isEditingAvatar;

    const editor = document.getElementById("avatarEditor");
    if (!editor) return;

    editor.style.display = isEditingAvatar ? "block" : "none";
}
