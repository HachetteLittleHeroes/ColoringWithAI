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
