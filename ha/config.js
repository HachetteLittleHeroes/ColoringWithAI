// js/config.js

const API_URL = "https://hlhbot-hachettelittleheroes.amvera.io";

let userInventory = [];
let markersData = [];
let cart = [];
let aiDB = [];
let organizers = [];

let currentOrgId = null;
let currentCellIndex = 0;

let userProfileData = {
    name: "Без имени",
    avatar: "",
    statusProgress: {}
};

let isEditingAvatar = false;
// js/config.js
let organizers = JSON.parse(localStorage.getItem('organizers')) || [];
let currentOrgId = null;
let currentCellIndex = null;
let modalSelectedBrand = null;
let markersData = [];
let cart = [];
let markersLoaded = false;
let aiDB = [];
let userInventory = [];
const API_URL = "https://hlhbot-hachettelittleheroes.amvera.io/api";
