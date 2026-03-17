// =======================
// Общие переменные
// =======================
let userBalance = 0;
let cart = [];
let books = [];
let markers = [];
let achievements = [];
let topAchievements = [null, null, null];
let avatarPresets = [
    "https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/avatars/av1.png",
    "https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/avatars/av2.png",
    "https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/avatars/av3.png"
];
let organizers = []; // {name, cells: [{markers: []}]}
let currentTab = "profile";
let currentOrganizer = null;
let currentCell = null;

// =======================
// Вкладки
// =======================
function tab(tabName){
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(tabName).classList.add("active");
    const navMap = {profile:"btn-profile", shop:"btn-shop", answers:"btn-answers", aipalette:"btn-aipalette", cart:"btn-cart"};
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    document.getElementById(navMap[tabName]).classList.add("active");
    currentTab = tabName;
}

// =======================
// Фильтрации
// =======================
function filterBooks(){
    const q = document.getElementById("bookSearch").value.toLowerCase();
    const grid = document.getElementById("booksGrid"); grid.innerHTML="";
    books.filter(b=>b.title.toLowerCase().includes(q))
         .forEach(b=>{let d=document.createElement("div");d.className="book-card";d.innerText=b.title;d.onclick=()=>openBook(b);grid.appendChild(d);});
}
function filterMarkers(){
    const q = document.getElementById("markerSearch").value.toLowerCase();
    const list = document.getElementById("markersList"); list.innerHTML="";
    markers.filter(m=>m.number.toLowerCase().includes(q))
           .forEach(m=>{let d=document.createElement("div");d.className="marker-card";d.innerText=`${m.brand} #${m.number}`;
               let btn=document.createElement("button"); btn.className="buy-btn"; btn.innerText="Добавить в корзину"; btn.onclick=()=>addToCart(m); d.appendChild(btn); list.appendChild(d);
           });
}
function filterBrandInventory(){
    const q = document.getElementById("brandSearchInput").value.toLowerCase();
    const list = document.getElementById("brandInventoryList"); list.innerHTML="";
    const brand = document.getElementById("currentBrandTitle").innerText;
    markers.filter(m=>m.brand===brand && m.number.toLowerCase().includes(q))
           .forEach(m=>{let d=document.createElement("div"); d.className="marker-card"; d.innerText=`${m.brand} #${m.number}`;
               let btn=document.createElement("button"); btn.className="buy-btn"; btn.innerText="Добавить/Убрать"; btn.onclick=()=>toggleMarkerInTop(m); d.appendChild(btn); list.appendChild(d);
           });
}

// =======================
// Корзина
// =======================
function addToCart(marker){ cart.push(marker); updateCartDisplay(); }
function updateCartDisplay(){
    const cartList = document.getElementById("cartList"); cartList.innerHTML="";
    cart.forEach((m,idx)=>{let d=document.createElement("div"); d.className="cart-item"; d.innerText=`${m.brand} #${m.number}`;
        let btn=document.createElement("button"); btn.className="buy-btn"; btn.innerText="Удалить"; btn.onclick=()=>{cart.splice(idx,1); updateCartDisplay();};
        d.appendChild(btn); cartList.appendChild(d);
    });
    document.getElementById("mainOrderBtn").style.display=cart.length?"block":"none";
    const badge=document.getElementById("cartBadge"); badge.style.display=cart.length?"inline-block":"none"; badge.innerText=cart.length;
}
function checkout(){ if(!cart.length) return alert("Корзина пуста"); alert("Заказ оформлен!"); cart=[]; updateCartDisplay(); }

// =======================
// Профиль и аватар
// =======================
function changeNickname(){ document.getElementById("nameInputModal").style.display="flex"; }
function saveNewNickname(){
    const val=document.getElementById("newNameInput").value.trim();
    if(!val) return alert("Введите никнейм");
    document.getElementById("displayUsername").innerText=val;
    document.getElementById("nameInputModal").style.display="none";
}
function toggleAvatarEditor(){
    const block=document.getElementById("avatarEditorBlock");
    block.style.display = block.style.display==="none"?"block":"none";
}
function handleCustomAvatar(event){
    const file=event.target.files[0]; if(!file)return;
    document.getElementById("user-avatar").src=URL.createObjectURL(file);
}

// =======================
// Награды и программа лояльности
// =======================
function toggleRewards(){ const s=document.getElementById("rewards-section"); s.style.display=s.style.display==="none"?"block":"none"; }
function toggleEarnAchetiki(){ const b=document.getElementById("real-loyalty-info"); b.style.display=b.style.display==="none"?"block":"none"; }
function buyReward(name,cost){ if(userBalance<cost) return alert("Недостаточно ашетиков"); userBalance-=cost; document.getElementById("userBalance").innerText=userBalance; alert(`Вы купили ${name}`); }

// =======================
// Достижения
// =======================
function openAchievementPicker(slotIdx){ document.getElementById("fullAchievementsList").style.display="block"; }
function closePicker(){ document.getElementById("fullAchievementsList").style.display="none"; }
function handleAchievementPhotos(event){ const files=event.target.files; alert(`${files.length} фото выбрано для достижения`); }

// =======================
// AI Палитра
// =======================
function processAI(event){ const files=event.target.files; alert(`Обработка ${files.length} фото для AI Палитры`); }

// =======================
// Книги
// =======================
function openBook(book){ document.getElementById("viewer").style.display="block"; document.getElementById("current-page").src=book.pages[0]; document.getElementById("page-counter").innerText=`1/${book.pages.length}`; }
function closeBook(){ document.getElementById("viewer").style.display="none"; }

// =======================
// Органайзеры
// =======================
function showAddOrganizer(){
    const name=prompt("Введите название нового органайзера");
    if(!name)return;
    const org={name,cells:[{markers:[]}]} ;
    organizers.push(org);
    renderOrganizers();
}
function renderOrganizers(){
    const list=document.getElementById("organizersList"); list.innerHTML="";
    organizers.forEach((org,idx)=>{
        const div=document.createElement("div"); div.className="organizer-card"; div.innerText=org.name;
        div.onclick=()=>openOrganizerView(idx);
        list.appendChild(div);
    });
}
function openOrganizerView(idx){
    currentOrganizer=organizers[idx];
    document.getElementById("viewOrgTitle").innerText=currentOrganizer.name;
    document.getElementById("organizerDetailView").style.display="block";
    renderOrganizerGrid();
}
function closeOrganizerView(){ document.getElementById("organizerDetailView").style.display="none"; currentOrganizer=null; currentCell=null; }
function renderOrganizerGrid(){
    const grid=document.getElementById("gridContainer"); grid.innerHTML="";
    currentOrganizer.cells.forEach((cell,idx)=>{
        const div=document.createElement("div"); div.className="organizer-cell"; div.innerText=`Ячейка ${idx+1} (${cell.markers.length})`; 
        div.onclick=()=>openCellModal(idx); grid.appendChild(div);
    });
}

// =======================
// Модальные ячеек маркеров
// =======================
function openCellModal(idx){ currentCell=idx; document.getElementById("cellModalTitle").innerText=`Ячейка ${idx+1}`; renderCellMarkers(); document.getElementById("cellManageModal").style.display="flex"; }
function closeCellModal(){ document.getElementById("cellManageModal").style.display="none"; currentCell=null; }
function renderCellMarkers(){
    const list=document.getElementById("cellMarkerList"); list.innerHTML="";
    currentOrganizer.cells[currentCell].markers.forEach((m,idx)=>{
        const div=document.createElement("div"); div.className="marker-card"; div.innerText=`${m.brand} #${m.number}`;
        const btn=document.createElement("button"); btn.className="buy-btn"; btn.innerText="Удалить"; btn.onclick=()=>{ currentOrganizer.cells[currentCell].markers.splice(idx,1); renderCellMarkers(); };
        div.appendChild(btn); list.appendChild(div);
    });
}
function openAddMarkerModal(){ document.getElementById("addMarkerModal").style.display="flex"; renderModalBrands(); }
function closeAddMarkerModal(){ document.getElementById("addMarkerModal").style.display="none"; }
function renderModalBrands(){
    const grid=document.getElementById("modalBrandGrid"); grid.innerHTML="";
    [...new Set(markers.map(m=>m.brand))].forEach(b=>{
        const div=document.createElement("div"); div.className="brand-card"; div.innerText=b; div.onclick=()=>selectModalBrand(b); grid.appendChild(div);
    });
}
let selectedModalBrand=null;
function selectModalBrand(brand){ selectedModalBrand=brand; }
function confirmAddMarkerToCell(){
    const num=document.getElementById("modalMarkerSearch").value.trim();
    if(!selectedModalBrand || !num) return alert("Выберите бренд и номер");
    currentOrganizer.cells[currentCell].markers.push({brand:selectedModalBrand, number:num});
    renderCellMarkers();
    closeAddMarkerModal();
}

// =======================
// Инициализация
// =======================
window.onload=()=>{
    tab("profile");
    const grid=document.getElementById("avatarPresetsGrid");
    avatarPresets.forEach(url=>{
        const img=document.createElement("img"); img.src=url; img.className="avatar-preset"; img.onclick=()=>document.getElementById("user-avatar").src=url;
        grid.appendChild(img);
    });
};
