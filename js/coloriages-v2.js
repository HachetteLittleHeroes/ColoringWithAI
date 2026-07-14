// ==========================================
// D&D КАРТЫ И ПЕРЕХОДЫ Рыцарь
// ==========================================

var DND_CARDS = {
    knight: {
        // СТАРТ (0)
        0: {
            title: "Рыцарь",
            image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k0.png",
            isStart: true,
            level: 0
        },
        // УРОВЕНЬ 1: 1-3
        1: { title: "Страх", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k1.png", task: "Раскрась картинку с гоблином", level: 1 },
        2: { title: "Ведьма", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k2.png", task: "Раскрась картинку со злой ведьмой", level: 1 },
        3: { title: "Темный лес", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k3.png", task: "Раскрась картинку с лесным пейзажем", level: 1 },
        
        // УРОВЕНЬ 2: 4-12
        4: { title: "Лесная чаща", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k4.png", task: "Раскрась картинку с лесом или диким животным", level: 2 },
        5: { title: "Разбойничий лагерь", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k5.png", task: "Раскрась картинку с разбойниками или схваткой", level: 2 },
        6: { title: "Заброшенная башня", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k6.png", task: "Раскрась картинку с башней или руинами", level: 2 },
        7: { title: "Арсенал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k7.png", task: "Раскрась картинку, где изображен меч", level: 2 },
        8: { title: "Пещера гоблинов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k8.png", task: "Раскрась картинку с пещерой или гоблинами", level: 2 },
        9: { title: "Орлиное гнездо", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k9.png", task: "Раскрась картинку с орлом или сокровищем", level: 2 },
        10: { title: "Ребенок", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k10.png", task: "Раскрась картинку, где изображена маленькая девочка", level: 2 },
        11: { title: "Деревня у реки", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k11.png", task: "Раскрась картинку с деревней или жителями", level: 2 },
        12: { title: "Водопад", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k12.png", task: "Раскрась картинку с водопадом или тайным проходом", level: 2 },
        
        // УРОВЕНЬ 3: 13-39
        13: { title: "Волчья стая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k13.png", task: "Раскрась картинку с волком или стаей", level: 3 },
        14: { title: "Древний дуб", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k14.png", task: "Раскрась картинку с деревом или амулетом", level: 3 },
        15: { title: "Лесной дух", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k15.png", task: "Раскрась картинку с духом или магией", level: 3 },
        16: { title: "Главарь разбойников", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k16.png", task: "Раскрась картинку с главарём или переговорами", level: 3 },
        17: { title: "Спасение каравана", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k17.png", task: "Раскрась картинку с караваном или зельем", level: 3 },
        18: { title: "Разбойничий тайник", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k18.png", task: "Раскрась картинку с сокровищами или ключом", level: 3 },
        19: { title: "Руны на стенах", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k19.png", task: "Раскрась картинку с рунами или книгой", level: 3 },
        20: { title: "Призрак рыцаря", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k20.png", task: "Раскрась картинку с призраком или магическим мечом", level: 3 },
        21: { title: "Подземный ход", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k21.png", task: "Раскрась картинку с подземельем или лестницей", level: 3 },
        22: { title: "Каменный мост", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k22.png", task: "Раскрась картинку с мостом или рекой", level: 3 },
        23: { title: "Башня призраков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k23.png", task: "Раскрась картинку с башней или призраком", level: 3 },
        24: { title: "Лабиринт", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k24.png", task: "Раскрась картинку с лабиринтом или стеной", level: 3 },
        25: { title: "Гнездо виверны", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k25.png", task: "Раскрась картинку с виверной или гнездом", level: 3 },
        26: { title: "Проклятый фонтан", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k26.png", task: "Раскрась картинку с фонтаном или водой", level: 3 },
        27: { title: "Комната пыток", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k27.png", task: "Раскрась картинку с цепями или инструментами", level: 3 },
        28: { title: "Винный погреб", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k28.png", task: "Раскрась картинку с бочками или бутылками", level: 3 },
        29: { title: "Королевская усыпальница", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k29.png", task: "Раскрась картинку с саркофагом или короной", level: 3 },
        30: { title: "Трон призрачного короля", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k30.png", task: "Раскрась картинку с троном или призраком", level: 3 },
        31: { title: "Зал фресок", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k31.png", task: "Раскрась картинку с фресками или живописью", level: 3 },
        32: { title: "Келья монаха", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k32.png", task: "Раскрась картинку с монахом или свечой", level: 3 },
        33: { title: "Гобеленовый зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k33.png", task: "Раскрась картинку с гобеленом или тканью", level: 3 },
        34: { title: "Склад оружия", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k34.png", task: "Раскрась картинку с оружием или складом", level: 3 },
        35: { title: "Кузня гномов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k35.png", task: "Раскрась картинку с кузницей или гномом", level: 3 },
        36: { title: "Шахта", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k36.png", task: "Раскрась картинку с шахтой или киркой", level: 3 },
        37: { title: "Грибная пещера", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k37.png", task: "Раскрась картинку с грибами или пещерой", level: 3 },
        38: { title: "Логово тролля", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k38.png", task: "Раскрась картинку с троллем или дубиной", level: 3 },
        39: { title: "Подземная река", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k39.png", task: "Раскрась картинку с рекой или лодкой", level: 3 },
        
        // УРОВЕНЬ 4: 40-100
        40: { title: "Сталактитовая пещера", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k40.png", task: "Раскрась картинку из подземелья!", level: 4 },
        41: { title: "Костяной зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k41.png", task: "Раскрась картинку из подземелья!", level: 4 },
        42: { title: "Алтарь жертвоприношений", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k42.png", task: "Раскрась картинку из подземелья!", level: 4 },
        43: { title: "Тюрьма душ", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k43.png", task: "Раскрась картинку из подземелья!", level: 4 },
        44: { title: "Портал в бездну", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k44.png", task: "Раскрась картинку из подземелья!", level: 4 },
        45: { title: "Комната с рычагами", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k45.png", task: "Раскрась картинку из подземелья!", level: 4 },
        46: { title: "Библиотека", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k46.png", task: "Раскрась картинку из подземелья!", level: 4 },
        47: { title: "Зал карт", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k47.png", task: "Раскрась картинку из подземелья!", level: 4 },
        48: { title: "Оружейная", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k48.png", task: "Раскрась картинку из подземелья!", level: 4 },
        49: { title: "Смотровая башня", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k49.png", task: "Раскрась картинку из подземелья!", level: 4 },
        50: { title: "Казармы стражи", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k50.png", task: "Раскрась картинку из подземелья!", level: 4 },
        51: { title: "Колодец", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k51.png", task: "Раскрась картинку из подземелья!", level: 4 },
        52: { title: "Подземный рынок", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k52.png", task: "Раскрась картинку из подземелья!", level: 4 },
        53: { title: "Таверна", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k53.png", task: "Раскрась картинку из подземелья!", level: 4 },
        54: { title: "Конюшня", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k54.png", task: "Раскрась картинку из подземелья!", level: 4 },
        55: { title: "Кладовая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k55.png", task: "Раскрась картинку из подземелья!", level: 4 },
        56: { title: "Кузнечный цех", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k56.png", task: "Раскрась картинку из подземелья!", level: 4 },
        57: { title: "Лаборатория алхимика", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k57.png", task: "Раскрась картинку из подземелья!", level: 4 },
        58: { title: "Обсерватория", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k58.png", task: "Раскрась картинку из подземелья!", level: 4 },
        59: { title: "Теплица", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k59.png", task: "Раскрась картинку из подземелья!", level: 4 },
        60: { title: "Балкон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k60.png", task: "Раскрась картинку из подземелья!", level: 4 },
        61: { title: "Зал советов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k61.png", task: "Раскрась картинку из подземелья!", level: 4 },
        62: { title: "Галерея героев", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k62.png", task: "Раскрась картинку из подземелья!", level: 4 },
        63: { title: "Зал фонтанов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k63.png", task: "Раскрась картинку из подземелья!", level: 4 },
        64: { title: "Покой рыцаря", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k64.png", task: "Раскрась картинку из подземелья!", level: 4 },
        65: { title: "Кабинет мага", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k65.png", task: "Раскрась картинку из подземелья!", level: 4 },
        66: { title: "Зал иллюзий", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k66.png", task: "Раскрась картинку из подземелья!", level: 4 },
        67: { title: "Пещера отголосков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k67.png", task: "Раскрась картинку из подземелья!", level: 4 },
        68: { title: "Зал тишины", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k68.png", task: "Раскрась картинку из подземелья!", level: 4 },
        69: { title: "Комната с ловушками", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k69.png", task: "Раскрась картинку из подземелья!", level: 4 },
        70: { title: "Зал шипов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k70.png", task: "Раскрась картинку из подземелья!", level: 4 },
        71: { title: "Гнездо змей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k71.png", task: "Раскрась картинку из подземелья!", level: 4 },
        72: { title: "Зал скорпионов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k72.png", task: "Раскрась картинку из подземелья!", level: 4 },
        73: { title: "Паучий трон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k73.png", task: "Раскрась картинку из подземелья!", level: 4 },
        74: { title: "Кокон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k74.png", task: "Раскрась картинку из подземелья!", level: 4 },
        75: { title: "Зал муравьёв", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k75.png", task: "Раскрась картинку из подземелья!", level: 4 },
        76: { title: "Улей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k76.png", task: "Раскрась картинку из подземелья!", level: 4 },
        77: { title: "Зал жуков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k77.png", task: "Раскрась картинку из подземелья!", level: 4 },
        78: { title: "Термитник", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k78.png", task: "Раскрась картинку из подземелья!", level: 4 },
        79: { title: "Зал богомолов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k79.png", task: "Раскрась картинку из подземелья!", level: 4 },
        80: { title: "Колодец скорпионов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k80.png", task: "Раскрась картинку из подземелья!", level: 4 },
        81: { title: "Зал саранчи", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k81.png", task: "Раскрась картинку из подземелья!", level: 4 },
        82: { title: "Гнездо шершней", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k82.png", task: "Раскрась картинку из подземелья!", level: 4 },
        83: { title: "Зал светлячков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k83.png", task: "Раскрась картинку из подземелья!", level: 4 },
        84: { title: "Пещера мотыльков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k84.png", task: "Раскрась картинку из подземелья!", level: 4 },
        85: { title: "Зал бабочек", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k85.png", task: "Раскрась картинку из подземелья!", level: 4 },
        86: { title: "Гусеничный зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k86.png", task: "Раскрась картинку из подземелья!", level: 4 },
        87: { title: "Коконовая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k87.png", task: "Раскрась картинку из подземелья!", level: 4 },
        88: { title: "Зал цикад", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k88.png", task: "Раскрась картинку из подземелья!", level: 4 },
        89: { title: "Пещера кузнечиков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k89.png", task: "Раскрась картинку из подземелья!", level: 4 },
        90: { title: "Зал тараканов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k90.png", task: "Раскрась картинку из подземелья!", level: 4 },
        91: { title: "Гнездо сороконожек", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k91.png", task: "Раскрась картинку из подземелья!", level: 4 },
        92: { title: "Зал мокриц", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k92.png", task: "Раскрась картинку из подземелья!", level: 4 },
        93: { title: "Пещера улиток", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k93.png", task: "Раскрась картинку из подземелья!", level: 4 },
        94: { title: "Зал слизней", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k94.png", task: "Раскрась картинку из подземелья!", level: 4 },
        95: { title: "Червивый зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k95.png", task: "Раскрась картинку из подземелья!", level: 4 },
        96: { title: "Зал пиявок", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k96.png", task: "Раскрась картинку из подземелья!", level: 4 },
        97: { title: "Пещера клещей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k97.png", task: "Раскрась картинку из подземелья!", level: 4 },
        98: { title: "Зал комаров", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k98.png", task: "Раскрась картинку из подземелья!", level: 4 },
        99: { title: "Гнездо москитов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k99.png", task: "Раскрась картинку из подземелья!", level: 4 },
        100: { title: "Зал мух", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k100.png", task: "Раскрась картинку из подземелья!", level: 4 },
        
       // В DND_CARDS.knight замени карты 101-106 и 203-208:

101: { 
    title: "Хранитель подземелья", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k101.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с боссом",
        "Раскрась картинку с эпической битвой",
        "Раскрась картинку с оружием",
        "Раскрась картинку с магией"
    ]
},
102: { 
    title: "Теневой дракон", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k102.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с драконом",
        "Раскрась картинку с тенью",
        "Раскрась картинку с пещерой",
        "Раскрась картинку с сокровищем"
    ]
},
103: { 
    title: "Король гоблинов", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k103.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с гоблином",
        "Раскрась картинку с короной",
        "Раскрась картинку с троном",
        "Раскрась картинку с армией гоблинов"
    ]
},
104: { 
    title: "Дух тьмы", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k104.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с духом",
        "Раскрась картинку с тьмой",
        "Раскрась картинку со свечой",
        "Раскрась картинку с призраком"
    ]
},
105: { 
    title: "Маг хаоса", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k105.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с магом",
        "Раскрась картинку с хаосом",
        "Раскрась картинку с заклинанием",
        "Раскрась картинку с посохом"
    ]
},
106: { 
    title: "Железный голем", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k106.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с големом",
        "Раскрась картинку с металлом",
        "Раскрась картинку с кузницей",
        "Раскрась картинку с механизмом"
    ]
},
        // УРОВЕНЬ 6: 107-112
        107: { title: "Возрождение", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k107.png", task: "Раскрась картинку с возрождением или светом!", level: 6 },
        108: { title: "Новая сила", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k108.png", task: "Раскрась картинку с силой или энергией!", level: 6 },
        109: { title: "Древний артефакт", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k109.png", task: "Раскрась картинку с артефактом или реликвией!", level: 6 },
        110: { title: "Союзники", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k110.png", task: "Раскрась картинку с союзниками или командой!", level: 6 },
        111: { title: "Карта сокровищ", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k111.png", task: "Раскрась картинку с картой или сокровищем!", level: 6 },
        112: { title: "Портал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k112.png", task: "Раскрась картинку с порталом или вратами!", level: 6 },
        
        // УРОВЕНЬ 7: 113-136
        113: { title: "Солнечный алтарь", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k113.png", task: "Раскрась космическую картинку!", level: 7 },
        114: { title: "Зал затмения", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k114.png", task: "Раскрась космическую картинку!", level: 7 },
        115: { title: "Комета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k115.png", task: "Раскрась космическую картинку!", level: 7 },
        116: { title: "Метеоритный зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k116.png", task: "Раскрась космическую картинку!", level: 7 },
        117: { title: "Галактика", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k117.png", task: "Раскрась космическую картинку!", level: 7 },
        118: { title: "Чёрная дыра", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k118.png", task: "Раскрась космическую картинку!", level: 7 },
        119: { title: "Туманность", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k119.png", task: "Раскрась космическую картинку!", level: 7 },
        120: { title: "Созвездие рыцаря", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k120.png", task: "Раскрась космическую картинку!", level: 7 },
        121: { title: "Планетария", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k121.png", task: "Раскрась космическую картинку!", level: 7 },
        122: { title: "Астероидное поле", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k122.png", task: "Раскрась космическую картинку!", level: 7 },
        123: { title: "Орбитальная станция", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k123.png", task: "Раскрась космическую картинку!", level: 7 },
        124: { title: "Космический корабль", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k124.png", task: "Раскрась космическую картинку!", level: 7 },
        125: { title: "Инопланетный лес", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k125.png", task: "Раскрась космическую картинку!", level: 7 },
        126: { title: "Кристальная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k126.png", task: "Раскрась космическую картинку!", level: 7 },
        127: { title: "Огненная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k127.png", task: "Раскрась космическую картинку!", level: 7 },
        128: { title: "Водная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k128.png", task: "Раскрась космическую картинку!", level: 7 },
        129: { title: "Воздушная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k129.png", task: "Раскрась космическую картинку!", level: 7 },
        130: { title: "Земная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k130.png", task: "Раскрась космическую картинку!", level: 7 },
        131: { title: "Пустынная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k131.png", task: "Раскрась космическую картинку!", level: 7 },
        132: { title: "Ледяная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k132.png", task: "Раскрась космическую картинку!", level: 7 },
        133: { title: "Тропическая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k133.png", task: "Раскрась космическую картинку!", level: 7 },
        134: { title: "Вулканическая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k134.png", task: "Раскрась космическую картинку!", level: 7 },
        135: { title: "Океаническая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k135.png", task: "Раскрась космическую картинку!", level: 7 },
        136: { title: "Газовая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k136.png", task: "Раскрась космическую картинку!", level: 7 },
        
        // УРОВЕНЬ 8: 137-184
        137: { title: "Кольцевая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k137.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        138: { title: "Двойная звезда", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k138.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        139: { title: "Нейтронная звезда", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k139.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        140: { title: "Сверхновая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k140.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        141: { title: "Квазар", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k141.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        142: { title: "Пульсар", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k142.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        143: { title: "Магнитар", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k143.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        144: { title: "Червовая нора", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k144.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        145: { title: "Тёмная материя", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k145.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        146: { title: "Тёмная энергия", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k146.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        147: { title: "Реликтовое излучение", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k147.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        148: { title: "Большой взрыв", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k148.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        149: { title: "Башня молний", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k149.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        150: { title: "Пещера времени", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k150.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        151: { title: "Зал забвения", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k151.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        152: { title: "Мост судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k152.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        153: { title: "Колодец желаний", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k153.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        154: { title: "Тронный зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k154.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        155: { title: "Кристалл души", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k155.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        156: { title: "Демон Бездны", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k156.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        157: { title: "Повелитель хаоса", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k157.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        158: { title: "Хранитель времени", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k158.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        159: { title: "Страж реальности", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k159.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        160: { title: "Испепелитель", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k160.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        161: { title: "Ледяной великан", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k161.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        162: { title: "Каменный голем", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k162.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        163: { title: "Властелин бурь", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k163.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        164: { title: "Повелитель морей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k164.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        165: { title: "Король небес", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k165.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        166: { title: "Бог войны", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k166.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        167: { title: "Владыка смерти", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k167.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        168: { title: "Архидемон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k168.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        169: { title: "Князь тьмы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k169.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        170: { title: "Верховный лич", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k170.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        171: { title: "Дракон апокалипсиса", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k171.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        172: { title: "Титан судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k172.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        173: { title: "Первородный хаос", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k173.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        174: { title: "Сердце вселенной", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k174.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        175: { title: "Око судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k175.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        176: { title: "Книга времён", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k176.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        177: { title: "Ключ бытия", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k177.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        178: { title: "Трон творца", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k178.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        179: { title: "Абсолютный ноль", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k179.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        180: { title: "Бесконечность", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k180.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        181: { title: "Бездна", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k181.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        182: { title: "Реликт предтеч", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k182.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        183: { title: "Звёздные врата", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k183.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        184: { title: "Грань миров", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k184.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        
        // УРОВЕНЬ 9: 185-202
        185: { title: "Тропа героев", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k185.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        186: { title: "Зал легенд", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k186.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        187: { title: "Огненная бездна", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k187.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        188: { title: "Ледяная пропасть", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k188.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        189: { title: "Зал доблести", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k189.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        190: { title: "Храм света", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k190.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        191: { title: "Пещера отражений", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k191.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        192: { title: "Мост надежды", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k192.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        193: { title: "Зал мудрости", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k193.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        194: { title: "Башня судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k194.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        195: { title: "Портал героев", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k195.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        196: { title: "Зал силы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k196.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        197: { title: "Трон победителя", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k197.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        198: { title: "Зал чести", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k198.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        199: { title: "Арена судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k199.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        200: { title: "Врата победы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k200.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        201: { title: "Зал славы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k201.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        202: { title: "Преддверие финала", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k202.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        
        // Финальные боссы
203: { 
    title: "Демон Бездны", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k203.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с демоном",
        "Раскрась картинку с бездной",
        "Раскрась картинку с пламенем",
        "Раскрась картинку с рогами"
    ]
},
204: { 
    title: "Архилич", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k204.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с личом",
        "Раскрась картинку с некромантом",
        "Раскрась картинку с черепом",
        "Раскрась картинку с кладбищем"
    ]
},
205: { 
    title: "Древний дракон", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k205.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с древним драконом",
        "Раскрась картинку с драконьим огнём",
        "Раскрась картинку с крыльями",
        "Раскрась картинку с сокровищницей"
    ]
},
206: { 
    title: "Король демонов", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k206.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с королём демонов",
        "Раскрась картинку с троном тьмы",
        "Раскрась картинку с адским пламенем",
        "Раскрась картинку с легионом"
    ]
},
207: { 
    title: "Титан бездны", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k207.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с титаном",
        "Раскрась картинку с разрушением",
        "Раскрась картинку с молниями",
        "Раскрась картинку с землетрясением"
    ]
},
208: { 
    title: "Властелин тьмы", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/k208.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с властелином тьмы",
        "Раскрась картинку с армией тьмы",
        "Раскрась картинку с чёрным замком",
        "Раскрась картинку с последней битвой"
    ]
}
    }
};

// ==========================================
// ПЕРЕХОДЫ ДЛЯ РЫЦАРЯ (KNIGHT)
// ==========================================
var DND_TRANSITIONS = {};

// 0 → 1-3 (1-2→1, 3-4→2, 5-6→3)
DND_TRANSITIONS[0] = {1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3};

// 1-3 → 4-12
DND_TRANSITIONS[1] = {1: 4, 2: 4, 3: 5, 4: 5, 5: 6, 6: 6};
DND_TRANSITIONS[2] = {1: 7, 2: 7, 3: 8, 4: 8, 5: 9, 6: 9};
DND_TRANSITIONS[3] = {1: 10, 2: 10, 3: 11, 4: 11, 5: 12, 6: 12};

// 4-12 → 13-39 (по 3 карты)
(function() {
    var c = 13;
    for (var i = 4; i <= 12; i++) {
        DND_TRANSITIONS[i] = {};
        DND_TRANSITIONS[i][1] = c; DND_TRANSITIONS[i][2] = c;
        DND_TRANSITIONS[i][3] = c+1; DND_TRANSITIONS[i][4] = c+1;
        DND_TRANSITIONS[i][5] = c+2; DND_TRANSITIONS[i][6] = c+2;
        c += 3;
    }
})();

// 13-39 → 40-100 (по 3 карты)
(function() {
    var c = 40;
    for (var i = 13; i <= 39; i++) {
        DND_TRANSITIONS[i] = {};
        DND_TRANSITIONS[i][1] = c; DND_TRANSITIONS[i][2] = c;
        DND_TRANSITIONS[i][3] = c+1; DND_TRANSITIONS[i][4] = c+1;
        DND_TRANSITIONS[i][5] = c+2; DND_TRANSITIONS[i][6] = c+2;
        c += 3;
    }
})();

// 40-100 → 101-106 (прямая зависимость)
for (var i = 40; i <= 100; i++) {
    DND_TRANSITIONS[i] = {1: 101, 2: 102, 3: 103, 4: 104, 5: 105, 6: 106};
}

// 101-106 → 107-112 (прямая зависимость)
for (var i = 101; i <= 106; i++) {
    DND_TRANSITIONS[i] = {1: 107, 2: 108, 3: 109, 4: 110, 5: 111, 6: 112};
}

// 107-112 → 113-136 (по 4 карты, только ключи 1-6)
(function() {
    var c = 113;
    for (var i = 107; i <= 112; i++) {
        DND_TRANSITIONS[i] = {};
        DND_TRANSITIONS[i][1] = c;   DND_TRANSITIONS[i][2] = c;
        DND_TRANSITIONS[i][3] = c+1; DND_TRANSITIONS[i][4] = c+1;
        DND_TRANSITIONS[i][5] = c+2; DND_TRANSITIONS[i][6] = c+3;
        c += 4;
    }
})();

// 113-136 → 137-184 (по 2 карты, с ограничением)
(function() {
    var c = 137;
    for (var i = 113; i <= 136; i++) {
        DND_TRANSITIONS[i] = {};
        DND_TRANSITIONS[i][1] = Math.min(c, 184);
        DND_TRANSITIONS[i][2] = Math.min(c, 184);
        DND_TRANSITIONS[i][3] = Math.min(c+1, 184);
        DND_TRANSITIONS[i][4] = Math.min(c+1, 184);
        DND_TRANSITIONS[i][5] = Math.min(c+1, 184);
        DND_TRANSITIONS[i][6] = Math.min(c+1, 184);
        c += 2;
    }
})();

// 137-184 → 185-202
for (var i = 137; i <= 184; i++) {
    DND_TRANSITIONS[i] = {1: 185, 2: 186, 3: 187, 4: 188, 5: 189, 6: 190};
}

// 185-202 → 203-208
for (var i = 185; i <= 202; i++) {
    DND_TRANSITIONS[i] = {1: 203, 2: 204, 3: 205, 4: 206, 5: 207, 6: 208};
}

// 203-208 — конец
for (var i = 203; i <= 208; i++) {
    DND_TRANSITIONS[i] = {};
}

        // ==========================================
// D&D КАРТЫ И ПЕРЕХОДЫ - МАГ
// ==========================================

var DND_CARDS_MAGE = {
    mage: {
        // СТАРТ (0)
        0: {
            title: "Маг",
            image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m0.png",
            isStart: true,
            level: 0
        },
        
        // УРОВЕНЬ 1: 1-3
        1: { title: "Башня магов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m1.png", task: "Раскрась картинку с магической башней!", level: 1 },
        2: { title: "Свиток заклинаний", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m2.png", task: "Раскрась картинку со свитком или руной!", level: 1 },
        3: { title: "Магический кристалл", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m3.png", task: "Раскрась картинку с кристаллом или артефактом!", level: 1 },
        
        // УРОВЕНЬ 2: 4-12
        4: { title: "Лесная чаща", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m4.png", task: "Раскрась картинку с лесом или диким животным!", level: 2 },
        5: { title: "Разбойничий лагерь", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m5.png", task: "Раскрась картинку с разбойниками или схваткой!", level: 2 },
        6: { title: "Заброшенная башня", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m6.png", task: "Раскрась картинку с башней или руинами!", level: 2 },
        7: { title: "Горный перевал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m7.png", task: "Раскрась картинку с горами или перевалом!", level: 2 },
        8: { title: "Пещера гоблинов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m8.png", task: "Раскрась картинку с пещерой или гоблинами!", level: 2 },
        9: { title: "Орлиное гнездо", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m9.png", task: "Раскрась картинку с орлом или сокровищем!", level: 2 },
        10: { title: "Старый мост", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m10.png", task: "Раскрась картинку с мостом или рекой!", level: 2 },
        11: { title: "Деревня у реки", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m11.png", task: "Раскрась картинку с деревней или жителями!", level: 2 },
        12: { title: "Водопад", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m12.png", task: "Раскрась картинку с водопадом или тайным проходом!", level: 2 },
        
        // УРОВЕНЬ 3: 13-39
        13: { title: "Волчья стая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m13.png", task: "Раскрась картинку с волком или стаей!", level: 3 },
        14: { title: "Древний дуб", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m14.png", task: "Раскрась картинку с деревом или амулетом!", level: 3 },
        15: { title: "Лесной дух", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m15.png", task: "Раскрась картинку с духом или магией!", level: 3 },
        16: { title: "Главарь разбойников", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m16.png", task: "Раскрась картинку с главарём или переговорами!", level: 3 },
        17: { title: "Спасение каравана", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m17.png", task: "Раскрась картинку с караваном или зельем!", level: 3 },
        18: { title: "Разбойничий тайник", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m18.png", task: "Раскрась картинку с сокровищами или ключом!", level: 3 },
        19: { title: "Руны на стенах", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m19.png", task: "Раскрась картинку с рунами или книгой!", level: 3 },
        20: { title: "Призрак рыцаря", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m20.png", task: "Раскрась картинку с призраком или магическим мечом!", level: 3 },
        21: { title: "Подземный ход", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m21.png", task: "Раскрась картинку с подземельем или лестницей!", level: 3 },
        22: { title: "Каменный мост", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m22.png", task: "Раскрась картинку с мостом или рекой!", level: 3 },
        23: { title: "Башня призраков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m23.png", task: "Раскрась картинку с башней или призраком!", level: 3 },
        24: { title: "Лабиринт", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m24.png", task: "Раскрась картинку с лабиринтом или стеной!", level: 3 },
        25: { title: "Гнездо виверны", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m25.png", task: "Раскрась картинку с виверной или гнездом!", level: 3 },
        26: { title: "Проклятый фонтан", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m26.png", task: "Раскрась картинку с фонтаном или водой!", level: 3 },
        27: { title: "Комната пыток", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m27.png", task: "Раскрась картинку с цепями или инструментами!", level: 3 },
        28: { title: "Винный погреб", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m28.png", task: "Раскрась картинку с бочками или бутылками!", level: 3 },
        29: { title: "Королевская усыпальница", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m29.png", task: "Раскрась картинку с саркофагом или короной!", level: 3 },
        30: { title: "Трон призрачного короля", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m30.png", task: "Раскрась картинку с троном или призраком!", level: 3 },
        31: { title: "Зал фресок", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m31.png", task: "Раскрась картинку с фресками или живописью!", level: 3 },
        32: { title: "Келья монаха", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m32.png", task: "Раскрась картинку с монахом или свечой!", level: 3 },
        33: { title: "Гобеленовый зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m33.png", task: "Раскрась картинку с гобеленом или тканью!", level: 3 },
        34: { title: "Склад оружия", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m34.png", task: "Раскрась картинку с оружием или складом!", level: 3 },
        35: { title: "Кузня гномов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m35.png", task: "Раскрась картинку с кузницей или гномом!", level: 3 },
        36: { title: "Шахта", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m36.png", task: "Раскрась картинку с шахтой или киркой!", level: 3 },
        37: { title: "Грибная пещера", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m37.png", task: "Раскрась картинку с грибами или пещерой!", level: 3 },
        38: { title: "Логово тролля", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m38.png", task: "Раскрась картинку с троллем или дубиной!", level: 3 },
        39: { title: "Подземная река", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m39.png", task: "Раскрась картинку с рекой или лодкой!", level: 3 },
        
        // УРОВЕНЬ 4: 40-100
        40: { title: "Сталактитовая пещера", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m40.png", task: "Раскрась картинку из подземелья!", level: 4 },
        41: { title: "Костяной зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m41.png", task: "Раскрась картинку из подземелья!", level: 4 },
        42: { title: "Алтарь жертвоприношений", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m42.png", task: "Раскрась картинку из подземелья!", level: 4 },
        43: { title: "Тюрьма душ", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m43.png", task: "Раскрась картинку из подземелья!", level: 4 },
        44: { title: "Портал в бездну", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m44.png", task: "Раскрась картинку из подземелья!", level: 4 },
        45: { title: "Комната с рычагами", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m45.png", task: "Раскрась картинку из подземелья!", level: 4 },
        46: { title: "Библиотека", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m46.png", task: "Раскрась картинку из подземелья!", level: 4 },
        47: { title: "Зал карт", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m47.png", task: "Раскрась картинку из подземелья!", level: 4 },
        48: { title: "Оружейная", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m48.png", task: "Раскрась картинку из подземелья!", level: 4 },
        49: { title: "Смотровая башня", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m49.png", task: "Раскрась картинку из подземелья!", level: 4 },
        50: { title: "Казармы стражи", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m50.png", task: "Раскрась картинку из подземелья!", level: 4 },
        51: { title: "Колодец", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m51.png", task: "Раскрась картинку из подземелья!", level: 4 },
        52: { title: "Подземный рынок", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m52.png", task: "Раскрась картинку из подземелья!", level: 4 },
        53: { title: "Таверна", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m53.png", task: "Раскрась картинку из подземелья!", level: 4 },
        54: { title: "Конюшня", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m54.png", task: "Раскрась картинку из подземелья!", level: 4 },
        55: { title: "Кладовая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m55.png", task: "Раскрась картинку из подземелья!", level: 4 },
        56: { title: "Кузнечный цех", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m56.png", task: "Раскрась картинку из подземелья!", level: 4 },
        57: { title: "Лаборатория алхимика", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m57.png", task: "Раскрась картинку из подземелья!", level: 4 },
        58: { title: "Обсерватория", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m58.png", task: "Раскрась картинку из подземелья!", level: 4 },
        59: { title: "Теплица", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m59.png", task: "Раскрась картинку из подземелья!", level: 4 },
        60: { title: "Балкон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m60.png", task: "Раскрась картинку из подземелья!", level: 4 },
        61: { title: "Зал советов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m61.png", task: "Раскрась картинку из подземелья!", level: 4 },
        62: { title: "Галерея героев", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m62.png", task: "Раскрась картинку из подземелья!", level: 4 },
        63: { title: "Зал фонтанов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m63.png", task: "Раскрась картинку из подземелья!", level: 4 },
        64: { title: "Покой рыцаря", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m64.png", task: "Раскрась картинку из подземелья!", level: 4 },
        65: { title: "Кабинет мага", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m65.png", task: "Раскрась картинку из подземелья!", level: 4 },
        66: { title: "Зал иллюзий", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m66.png", task: "Раскрась картинку из подземелья!", level: 4 },
        67: { title: "Пещера отголосков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m67.png", task: "Раскрась картинку из подземелья!", level: 4 },
        68: { title: "Зал тишины", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m68.png", task: "Раскрась картинку из подземелья!", level: 4 },
        69: { title: "Комната с ловушками", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m69.png", task: "Раскрась картинку из подземелья!", level: 4 },
        70: { title: "Зал шипов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m70.png", task: "Раскрась картинку из подземелья!", level: 4 },
        71: { title: "Гнездо змей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m71.png", task: "Раскрась картинку из подземелья!", level: 4 },
        72: { title: "Зал скорпионов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m72.png", task: "Раскрась картинку из подземелья!", level: 4 },
        73: { title: "Паучий трон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m73.png", task: "Раскрась картинку из подземелья!", level: 4 },
        74: { title: "Кокон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m74.png", task: "Раскрась картинку из подземелья!", level: 4 },
        75: { title: "Зал муравьёв", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m75.png", task: "Раскрась картинку из подземелья!", level: 4 },
        76: { title: "Улей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m76.png", task: "Раскрась картинку из подземелья!", level: 4 },
        77: { title: "Зал жуков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m77.png", task: "Раскрась картинку из подземелья!", level: 4 },
        78: { title: "Термитник", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m78.png", task: "Раскрась картинку из подземелья!", level: 4 },
        79: { title: "Зал богомолов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m79.png", task: "Раскрась картинку из подземелья!", level: 4 },
        80: { title: "Колодец скорпионов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m80.png", task: "Раскрась картинку из подземелья!", level: 4 },
        81: { title: "Зал саранчи", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m81.png", task: "Раскрась картинку из подземелья!", level: 4 },
        82: { title: "Гнездо шершней", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m82.png", task: "Раскрась картинку из подземелья!", level: 4 },
        83: { title: "Зал светлячков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m83.png", task: "Раскрась картинку из подземелья!", level: 4 },
        84: { title: "Пещера мотыльков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m84.png", task: "Раскрась картинку из подземелья!", level: 4 },
        85: { title: "Зал бабочек", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m85.png", task: "Раскрась картинку из подземелья!", level: 4 },
        86: { title: "Гусеничный зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m86.png", task: "Раскрась картинку из подземелья!", level: 4 },
        87: { title: "Коконовая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m87.png", task: "Раскрась картинку из подземелья!", level: 4 },
        88: { title: "Зал цикад", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m88.png", task: "Раскрась картинку из подземелья!", level: 4 },
        89: { title: "Пещера кузнечиков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m89.png", task: "Раскрась картинку из подземелья!", level: 4 },
        90: { title: "Зал тараканов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m90.png", task: "Раскрась картинку из подземелья!", level: 4 },
        91: { title: "Гнездо сороконожек", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m91.png", task: "Раскрась картинку из подземелья!", level: 4 },
        92: { title: "Зал мокриц", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m92.png", task: "Раскрась картинку из подземелья!", level: 4 },
        93: { title: "Пещера улиток", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m93.png", task: "Раскрась картинку из подземелья!", level: 4 },
        94: { title: "Зал слизней", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m94.png", task: "Раскрась картинку из подземелья!", level: 4 },
        95: { title: "Червивый зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m95.png", task: "Раскрась картинку из подземелья!", level: 4 },
        96: { title: "Зал пиявок", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m96.png", task: "Раскрась картинку из подземелья!", level: 4 },
        97: { title: "Пещера клещей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m97.png", task: "Раскрась картинку из подземелья!", level: 4 },
        98: { title: "Зал комаров", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m98.png", task: "Раскрась картинку из подземелья!", level: 4 },
        99: { title: "Гнездо москитов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m99.png", task: "Раскрась картинку из подземелья!", level: 4 },
        100: { title: "Зал мух", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m100.png", task: "Раскрась картинку из подземелья!", level: 4 },
        
        // УРОВЕНЬ 5: МИНИ-БОССЫ 101-106
        101: { 
    title: "Хранитель подземелья", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m101.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с боссом",
        "Раскрась картинку с эпической битвой",
        "Раскрась картинку с заклинанием",
        "Раскрась картинку с магическим щитом"
    ]
},
102: { 
    title: "Теневой дракон", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m102.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с драконом",
        "Раскрась картинку с тенью",
        "Раскрась картинку с магическим огнём",
        "Раскрась картинку с рунной ловушкой"
    ]
},
103: { 
    title: "Король гоблинов", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m103.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с гоблином",
        "Раскрась картинку с короной",
        "Раскрась картинку с магическим посохом",
        "Раскрась картинку с ордой гоблинов"
    ]
},
104: { 
    title: "Дух тьмы", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m104.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с духом",
        "Раскрась картинку с тьмой",
        "Раскрась картинку с заклинанием света",
        "Раскрась картинку с магическим барьером"
    ]
},
105: { 
    title: "Маг хаоса", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m105.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с магом",
        "Раскрась картинку с хаосом",
        "Раскрась картинку с порталом",
        "Раскрась картинку с разрушенным замком"
    ]
},
106: { 
    title: "Железный голем", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m106.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с големом",
        "Раскрась картинку с металлом",
        "Раскрась картинку с магической руной",
        "Раскрась картинку с алхимической лабораторией"
    ]
},
        // УРОВЕНЬ 6: 107-112
        107: { title: "Возрождение", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m107.png", task: "Раскрась картинку с возрождением или светом!", level: 6 },
        108: { title: "Новая сила", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m108.png", task: "Раскрась картинку с силой или энергией!", level: 6 },
        109: { title: "Древний артефакт", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m109.png", task: "Раскрась картинку с артефактом или реликвией!", level: 6 },
        110: { title: "Союзники", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m110.png", task: "Раскрась картинку с союзниками или командой!", level: 6 },
        111: { title: "Карта сокровищ", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m111.png", task: "Раскрась картинку с картой или сокровищем!", level: 6 },
        112: { title: "Портал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m112.png", task: "Раскрась картинку с порталом или вратами!", level: 6 },
        
        // УРОВЕНЬ 7: 113-136
        113: { title: "Солнечный алтарь", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m113.png", task: "Раскрась космическую картинку!", level: 7 },
        114: { title: "Зал затмения", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m114.png", task: "Раскрась космическую картинку!", level: 7 },
        115: { title: "Комета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m115.png", task: "Раскрась космическую картинку!", level: 7 },
        116: { title: "Метеоритный зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m116.png", task: "Раскрась космическую картинку!", level: 7 },
        117: { title: "Галактика", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m117.png", task: "Раскрась космическую картинку!", level: 7 },
        118: { title: "Чёрная дыра", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m118.png", task: "Раскрась космическую картинку!", level: 7 },
        119: { title: "Туманность", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m119.png", task: "Раскрась космическую картинку!", level: 7 },
        120: { title: "Созвездие рыцаря", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m120.png", task: "Раскрась космическую картинку!", level: 7 },
        121: { title: "Планетария", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m121.png", task: "Раскрась космическую картинку!", level: 7 },
        122: { title: "Астероидное поле", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m122.png", task: "Раскрась космическую картинку!", level: 7 },
        123: { title: "Орбитальная станция", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m123.png", task: "Раскрась космическую картинку!", level: 7 },
        124: { title: "Космический корабль", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m124.png", task: "Раскрась космическую картинку!", level: 7 },
        125: { title: "Инопланетный лес", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m125.png", task: "Раскрась космическую картинку!", level: 7 },
        126: { title: "Кристальная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m126.png", task: "Раскрась космическую картинку!", level: 7 },
        127: { title: "Огненная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m127.png", task: "Раскрась космическую картинку!", level: 7 },
        128: { title: "Водная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m128.png", task: "Раскрась космическую картинку!", level: 7 },
        129: { title: "Воздушная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m129.png", task: "Раскрась космическую картинку!", level: 7 },
        130: { title: "Земная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m130.png", task: "Раскрась космическую картинку!", level: 7 },
        131: { title: "Пустынная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m131.png", task: "Раскрась космическую картинку!", level: 7 },
        132: { title: "Ледяная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m132.png", task: "Раскрась космическую картинку!", level: 7 },
        133: { title: "Тропическая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m133.png", task: "Раскрась космическую картинку!", level: 7 },
        134: { title: "Вулканическая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m134.png", task: "Раскрась космическую картинку!", level: 7 },
        135: { title: "Океаническая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m135.png", task: "Раскрась космическую картинку!", level: 7 },
        136: { title: "Газовая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m136.png", task: "Раскрась космическую картинку!", level: 7 },
        
        // УРОВЕНЬ 8: 137-184
        137: { title: "Кольцевая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m137.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        138: { title: "Двойная звезда", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m138.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        139: { title: "Нейтронная звезда", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m139.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        140: { title: "Сверхновая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m140.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        141: { title: "Квазар", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m141.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        142: { title: "Пульсар", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m142.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        143: { title: "Магнитар", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m143.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        144: { title: "Червовая нора", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m144.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        145: { title: "Тёмная материя", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m145.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        146: { title: "Тёмная энергия", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m146.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        147: { title: "Реликтовое излучение", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m147.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        148: { title: "Большой взрыв", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m148.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        149: { title: "Башня молний", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m149.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        150: { title: "Пещера времени", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m150.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        151: { title: "Зал забвения", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m151.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        152: { title: "Мост судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m152.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        153: { title: "Колодец желаний", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m153.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        154: { title: "Тронный зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m154.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        155: { title: "Кристалл души", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m155.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        156: { title: "Демон Бездны", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m156.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        157: { title: "Повелитель хаоса", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m157.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        158: { title: "Хранитель времени", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m158.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        159: { title: "Страж реальности", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m159.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        160: { title: "Испепелитель", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m160.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        161: { title: "Ледяной великан", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m161.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        162: { title: "Каменный голем", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m162.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        163: { title: "Властелин бурь", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m163.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        164: { title: "Повелитель морей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m164.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        165: { title: "Король небес", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m165.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        166: { title: "Бог войны", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m166.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        167: { title: "Владыка смерти", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m167.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        168: { title: "Архидемон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m168.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        169: { title: "Князь тьмы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m169.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        170: { title: "Верховный лич", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m170.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        171: { title: "Дракон апокалипсиса", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m171.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        172: { title: "Титан судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m172.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        173: { title: "Первородный хаос", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m173.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        174: { title: "Сердце вселенной", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m174.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        175: { title: "Око судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m175.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        176: { title: "Книга времён", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m176.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        177: { title: "Ключ бытия", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m177.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        178: { title: "Трон творца", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m178.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        179: { title: "Абсолютный ноль", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m179.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        180: { title: "Бесконечность", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m180.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        181: { title: "Бездна", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m181.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        182: { title: "Реликт предтеч", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m182.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        183: { title: "Звёздные врата", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m183.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        184: { title: "Грань миров", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m184.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        
        // УРОВЕНЬ 9: 185-202
        185: { title: "Тропа героев", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m185.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        186: { title: "Зал легенд", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m186.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        187: { title: "Огненная бездна", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m187.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        188: { title: "Ледяная пропасть", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m188.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        189: { title: "Зал доблести", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m189.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        190: { title: "Храм света", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m190.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        191: { title: "Пещера отражений", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m191.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        192: { title: "Мост надежды", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m192.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        193: { title: "Зал мудрости", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m193.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        194: { title: "Башня судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m194.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        195: { title: "Портал героев", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m195.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        196: { title: "Зал силы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m196.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        197: { title: "Трон победителя", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m197.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        198: { title: "Зал чести", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m198.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        199: { title: "Арена судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m199.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        200: { title: "Врата победы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m200.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        201: { title: "Зал славы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m201.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        202: { title: "Преддверие финала", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m202.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        
        // УРОВЕНЬ 10: ФИНАЛЬНЫЕ БОССЫ 203-208
      203: { 
    title: "Демон Бездны", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m203.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с демоном",
        "Раскрась картинку с бездной",
        "Раскрась картинку с адским пламенем",
        "Раскрась картинку с демоническим порталом"
    ]
},
204: { 
    title: "Архилич", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m204.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с личом",
        "Раскрась картинку с некромантом",
        "Раскрась картинку с филактерией",
        "Раскрась картинку с армией нежити"
    ]
},
205: { 
    title: "Древний дракон", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m205.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с древним драконом",
        "Раскрась картинку с драконьим огнём",
        "Раскрась картинку с магическим кристаллом",
        "Раскрась картинку с драконьим логовом"
    ]
},
206: { 
    title: "Король демонов", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m206.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с королём демонов",
        "Раскрась картинку с троном тьмы",
        "Раскрась картинку с пентаграммой",
        "Раскрась картинку с жертвоприношением"
    ]
},
207: { 
    title: "Титан бездны", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m207.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с титаном",
        "Раскрась картинку с разрушением",
        "Раскрась картинку с молниями",
        "Раскрась картинку с падающими звёздами"
    ]
},
208: { 
    title: "Властелин тьмы", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/m208.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с властелином тьмы",
        "Раскрась картинку с армией тьмы",
        "Раскрась картинку с чёрной магией",
        "Раскрась картинку с последней битвой"
    ]
}
    }
};

// ==========================================
// ПЕРЕХОДЫ ДЛЯ МАГА (MAGE) — ФИНАЛЬНАЯ ВЕРСИЯ
// ==========================================

var DND_TRANSITIONS_MAGE = {};

// 0 → 1-3 (1-2→1, 3-4→2, 5-6→3)
DND_TRANSITIONS_MAGE[0] = {1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3};

// 1-3 → 4-12
DND_TRANSITIONS_MAGE[1] = {1: 4, 2: 4, 3: 5, 4: 5, 5: 6, 6: 6};
DND_TRANSITIONS_MAGE[2] = {1: 7, 2: 7, 3: 8, 4: 8, 5: 9, 6: 9};
DND_TRANSITIONS_MAGE[3] = {1: 10, 2: 10, 3: 11, 4: 11, 5: 12, 6: 12};

// 4-12 → 13-39 (по 3 карты на исходную)
(function() {
    var c = 13;
    for (var i = 4; i <= 12; i++) {
        DND_TRANSITIONS_MAGE[i] = {};
        DND_TRANSITIONS_MAGE[i][1] = c; DND_TRANSITIONS_MAGE[i][2] = c;
        DND_TRANSITIONS_MAGE[i][3] = c+1; DND_TRANSITIONS_MAGE[i][4] = c+1;
        DND_TRANSITIONS_MAGE[i][5] = c+2; DND_TRANSITIONS_MAGE[i][6] = c+2;
        c += 3;
    }
})();

// 13-39 → 40-100 (по 3 карты на исходную)
(function() {
    var c = 40;
    for (var i = 13; i <= 39; i++) {
        DND_TRANSITIONS_MAGE[i] = {};
        DND_TRANSITIONS_MAGE[i][1] = c; DND_TRANSITIONS_MAGE[i][2] = c;
        DND_TRANSITIONS_MAGE[i][3] = c+1; DND_TRANSITIONS_MAGE[i][4] = c+1;
        DND_TRANSITIONS_MAGE[i][5] = c+2; DND_TRANSITIONS_MAGE[i][6] = c+2;
        c += 3;
    }
})();

// 40-100 → 101-106 (прямая зависимость от кубика)
for (var i = 40; i <= 100; i++) {
    DND_TRANSITIONS_MAGE[i] = {1: 101, 2: 102, 3: 103, 4: 104, 5: 105, 6: 106};
}

// 101-106 → 107-112 (прямая зависимость)
for (var i = 101; i <= 106; i++) {
    DND_TRANSITIONS_MAGE[i] = {1: 107, 2: 108, 3: 109, 4: 110, 5: 111, 6: 112};
}

// 107-112 → 113-136 (по 4 карты на исходную: 6×4=24)
(function() {
    var c = 113;
    for (var i = 107; i <= 112; i++) {
        DND_TRANSITIONS_MAGE[i] = {};
        DND_TRANSITIONS_MAGE[i][1] = c;   DND_TRANSITIONS_MAGE[i][2] = c;
        DND_TRANSITIONS_MAGE[i][3] = c+1; DND_TRANSITIONS_MAGE[i][4] = c+1;
        DND_TRANSITIONS_MAGE[i][5] = c+2; DND_TRANSITIONS_MAGE[i][6] = c+3;
        c += 4;
    }
})();

// 113-136 → 137-184 (по 2 карты на исходную: 24×2=48)
(function() {
    var c = 137;
    for (var i = 113; i <= 136; i++) {
        DND_TRANSITIONS_MAGE[i] = {};
        DND_TRANSITIONS_MAGE[i][1] = Math.min(c, 184);
        DND_TRANSITIONS_MAGE[i][2] = Math.min(c, 184);
        DND_TRANSITIONS_MAGE[i][3] = Math.min(c, 184);
        DND_TRANSITIONS_MAGE[i][4] = Math.min(c+1, 184);
        DND_TRANSITIONS_MAGE[i][5] = Math.min(c+1, 184);
        DND_TRANSITIONS_MAGE[i][6] = Math.min(c+1, 184);
        c += 2;
    }
})();

// 137-184 → 185-202
for (var i = 137; i <= 184; i++) {
    DND_TRANSITIONS_MAGE[i] = {1: 185, 2: 186, 3: 187, 4: 188, 5: 189, 6: 190};
}

// 185-202 → 203-208
for (var i = 185; i <= 202; i++) {
    DND_TRANSITIONS_MAGE[i] = {1: 203, 2: 204, 3: 205, 4: 206, 5: 207, 6: 208};
}

// 203-208 — конец
for (var i = 203; i <= 208; i++) {
    DND_TRANSITIONS_MAGE[i] = {};
}

        // ==========================================
// D&D КАРТЫ И ПЕРЕХОДЫ - ЖРЕЦ
// ==========================================

var DND_CARDS_ARCHER = {
    archer: {
        // СТАРТ (0)
        0: {
            title: "Жрец",
            image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l0.png",
            isStart: true,
            level: 0
        },
        
        // УРОВЕНЬ 1: 1-3
        1: { title: "Лесная застава", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l1.png", task: "Раскрась картинку с луком или стрелами!", level: 1 },
        2: { title: "Наставник стрелков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l2.png", task: "Раскрась картинку с наставником или тренировкой!", level: 1 },
        3: { title: "Дорога к горам", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l3.png", task: "Раскрась картинку с дорогой или пейзажем!", level: 1 },
        
        // УРОВЕНЬ 2: 4-12
        4: { title: "Лесная чаща", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l4.png", task: "Раскрась картинку с лесом или диким животным!", level: 2 },
        5: { title: "Разбойничий лагерь", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l5.png", task: "Раскрась картинку с разбойниками или схваткой!", level: 2 },
        6: { title: "Заброшенная башня", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l6.png", task: "Раскрась картинку с башней или руинами!", level: 2 },
        7: { title: "Горный перевал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l7.png", task: "Раскрась картинку с горами или перевалом!", level: 2 },
        8: { title: "Пещера гоблинов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l8.png", task: "Раскрась картинку с пещерой или гоблинами!", level: 2 },
        9: { title: "Орлиное гнездо", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l9.png", task: "Раскрась картинку с орлом или сокровищем!", level: 2 },
        10: { title: "Старый мост", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l10.png", task: "Раскрась картинку с мостом или рекой!", level: 2 },
        11: { title: "Деревня у реки", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l11.png", task: "Раскрась картинку с деревней или жителями!", level: 2 },
        12: { title: "Водопад", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l12.png", task: "Раскрась картинку с водопадом или тайным проходом!", level: 2 },
        
        // УРОВЕНЬ 3: 13-39
        13: { title: "Волчья стая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l13.png", task: "Раскрась картинку с волком или стаей!", level: 3 },
        14: { title: "Древний дуб", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l14.png", task: "Раскрась картинку с деревом или амулетом!", level: 3 },
        15: { title: "Лесной дух", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l15.png", task: "Раскрась картинку с духом или магией!", level: 3 },
        16: { title: "Главарь разбойников", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l16.png", task: "Раскрась картинку с главарём или переговорами!", level: 3 },
        17: { title: "Спасение каравана", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l17.png", task: "Раскрась картинку с караваном или зельем!", level: 3 },
        18: { title: "Разбойничий тайник", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l18.png", task: "Раскрась картинку с сокровищами или ключом!", level: 3 },
        19: { title: "Руны на стенах", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l19.png", task: "Раскрась картинку с рунами или книгой!", level: 3 },
        20: { title: "Призрак рыцаря", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l20.png", task: "Раскрась картинку с призраком или магическим мечом!", level: 3 },
        21: { title: "Подземный ход", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l21.png", task: "Раскрась картинку с подземельем или лестницей!", level: 3 },
        22: { title: "Каменный мост", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l22.png", task: "Раскрась картинку с мостом или рекой!", level: 3 },
        23: { title: "Башня призраков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l23.png", task: "Раскрась картинку с башней или призраком!", level: 3 },
        24: { title: "Лабиринт", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l24.png", task: "Раскрась картинку с лабиринтом или стеной!", level: 3 },
        25: { title: "Гнездо виверны", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l25.png", task: "Раскрась картинку с виверной или гнездом!", level: 3 },
        26: { title: "Проклятый фонтан", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l26.png", task: "Раскрась картинку с фонтаном или водой!", level: 3 },
        27: { title: "Комната пыток", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l27.png", task: "Раскрась картинку с цепями или инструментами!", level: 3 },
        28: { title: "Винный погреб", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l28.png", task: "Раскрась картинку с бочками или бутылками!", level: 3 },
        29: { title: "Королевская усыпальница", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l29.png", task: "Раскрась картинку с саркофагом или короной!", level: 3 },
        30: { title: "Трон призрачного короля", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l30.png", task: "Раскрась картинку с троном или призраком!", level: 3 },
        31: { title: "Зал фресок", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l31.png", task: "Раскрась картинку с фресками или живописью!", level: 3 },
        32: { title: "Келья монаха", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l32.png", task: "Раскрась картинку с монахом или свечой!", level: 3 },
        33: { title: "Гобеленовый зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l33.png", task: "Раскрась картинку с гобеленом или тканью!", level: 3 },
        34: { title: "Склад оружия", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l34.png", task: "Раскрась картинку с оружием или складом!", level: 3 },
        35: { title: "Кузня гномов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l35.png", task: "Раскрась картинку с кузницей или гномом!", level: 3 },
        36: { title: "Шахта", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l36.png", task: "Раскрась картинку с шахтой или киркой!", level: 3 },
        37: { title: "Грибная пещера", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l37.png", task: "Раскрась картинку с грибами или пещерой!", level: 3 },
        38: { title: "Логово тролля", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l38.png", task: "Раскрась картинку с троллем или дубиной!", level: 3 },
        39: { title: "Подземная река", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l39.png", task: "Раскрась картинку с рекой или лодкой!", level: 3 },
        
        // УРОВЕНЬ 4: 40-100
        40: { title: "Сталактитовая пещера", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l40.png", task: "Раскрась картинку из подземелья!", level: 4 },
        41: { title: "Костяной зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l41.png", task: "Раскрась картинку из подземелья!", level: 4 },
        42: { title: "Алтарь жертвоприношений", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l42.png", task: "Раскрась картинку из подземелья!", level: 4 },
        43: { title: "Тюрьма душ", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l43.png", task: "Раскрась картинку из подземелья!", level: 4 },
        44: { title: "Портал в бездну", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l44.png", task: "Раскрась картинку из подземелья!", level: 4 },
        45: { title: "Комната с рычагами", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l45.png", task: "Раскрась картинку из подземелья!", level: 4 },
        46: { title: "Библиотека", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l46.png", task: "Раскрась картинку из подземелья!", level: 4 },
        47: { title: "Зал карт", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l47.png", task: "Раскрась картинку из подземелья!", level: 4 },
        48: { title: "Оружейная", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l48.png", task: "Раскрась картинку из подземелья!", level: 4 },
        49: { title: "Смотровая башня", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l49.png", task: "Раскрась картинку из подземелья!", level: 4 },
        50: { title: "Казармы стражи", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l50.png", task: "Раскрась картинку из подземелья!", level: 4 },
        51: { title: "Колодец", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l51.png", task: "Раскрась картинку из подземелья!", level: 4 },
        52: { title: "Подземный рынок", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l52.png", task: "Раскрась картинку из подземелья!", level: 4 },
        53: { title: "Таверна", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l53.png", task: "Раскрась картинку из подземелья!", level: 4 },
        54: { title: "Конюшня", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l54.png", task: "Раскрась картинку из подземелья!", level: 4 },
        55: { title: "Кладовая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l55.png", task: "Раскрась картинку из подземелья!", level: 4 },
        56: { title: "Кузнечный цех", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l56.png", task: "Раскрась картинку из подземелья!", level: 4 },
        57: { title: "Лаборатория алхимика", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l57.png", task: "Раскрась картинку из подземелья!", level: 4 },
        58: { title: "Обсерватория", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l58.png", task: "Раскрась картинку из подземелья!", level: 4 },
        59: { title: "Теплица", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l59.png", task: "Раскрась картинку из подземелья!", level: 4 },
        60: { title: "Балкон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l60.png", task: "Раскрась картинку из подземелья!", level: 4 },
        61: { title: "Зал советов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l61.png", task: "Раскрась картинку из подземелья!", level: 4 },
        62: { title: "Галерея героев", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l62.png", task: "Раскрась картинку из подземелья!", level: 4 },
        63: { title: "Зал фонтанов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l63.png", task: "Раскрась картинку из подземелья!", level: 4 },
        64: { title: "Покой рыцаря", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l64.png", task: "Раскрась картинку из подземелья!", level: 4 },
        65: { title: "Кабинет мага", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l65.png", task: "Раскрась картинку из подземелья!", level: 4 },
        66: { title: "Зал иллюзий", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l66.png", task: "Раскрась картинку из подземелья!", level: 4 },
        67: { title: "Пещера отголосков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l67.png", task: "Раскрась картинку из подземелья!", level: 4 },
        68: { title: "Зал тишины", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l68.png", task: "Раскрась картинку из подземелья!", level: 4 },
        69: { title: "Комната с ловушками", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l69.png", task: "Раскрась картинку из подземелья!", level: 4 },
        70: { title: "Зал шипов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l70.png", task: "Раскрась картинку из подземелья!", level: 4 },
        71: { title: "Гнездо змей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l71.png", task: "Раскрась картинку из подземелья!", level: 4 },
        72: { title: "Зал скорпионов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l72.png", task: "Раскрась картинку из подземелья!", level: 4 },
        73: { title: "Паучий трон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l73.png", task: "Раскрась картинку из подземелья!", level: 4 },
        74: { title: "Кокон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l74.png", task: "Раскрась картинку из подземелья!", level: 4 },
        75: { title: "Зал муравьёв", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l75.png", task: "Раскрась картинку из подземелья!", level: 4 },
        76: { title: "Улей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l76.png", task: "Раскрась картинку из подземелья!", level: 4 },
        77: { title: "Зал жуков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l77.png", task: "Раскрась картинку из подземелья!", level: 4 },
        78: { title: "Термитник", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l78.png", task: "Раскрась картинку из подземелья!", level: 4 },
        79: { title: "Зал богомолов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l79.png", task: "Раскрась картинку из подземелья!", level: 4 },
        80: { title: "Колодец скорпионов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l80.png", task: "Раскрась картинку из подземелья!", level: 4 },
        81: { title: "Зал саранчи", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l81.png", task: "Раскрась картинку из подземелья!", level: 4 },
        82: { title: "Гнездо шершней", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l82.png", task: "Раскрась картинку из подземелья!", level: 4 },
        83: { title: "Зал светлячков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l83.png", task: "Раскрась картинку из подземелья!", level: 4 },
        84: { title: "Пещера мотыльков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l84.png", task: "Раскрась картинку из подземелья!", level: 4 },
        85: { title: "Зал бабочек", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l85.png", task: "Раскрась картинку из подземелья!", level: 4 },
        86: { title: "Гусеничный зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l86.png", task: "Раскрась картинку из подземелья!", level: 4 },
        87: { title: "Коконовая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l87.png", task: "Раскрась картинку из подземелья!", level: 4 },
        88: { title: "Зал цикад", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l88.png", task: "Раскрась картинку из подземелья!", level: 4 },
        89: { title: "Пещера кузнечиков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l89.png", task: "Раскрась картинку из подземелья!", level: 4 },
        90: { title: "Зал тараканов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l90.png", task: "Раскрась картинку из подземелья!", level: 4 },
        91: { title: "Гнездо сороконожек", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l91.png", task: "Раскрась картинку из подземелья!", level: 4 },
        92: { title: "Зал мокриц", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l92.png", task: "Раскрась картинку из подземелья!", level: 4 },
        93: { title: "Пещера улиток", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l93.png", task: "Раскрась картинку из подземелья!", level: 4 },
        94: { title: "Зал слизней", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l94.png", task: "Раскрась картинку из подземелья!", level: 4 },
        95: { title: "Червивый зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l95.png", task: "Раскрась картинку из подземелья!", level: 4 },
        96: { title: "Зал пиявок", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l96.png", task: "Раскрась картинку из подземелья!", level: 4 },
        97: { title: "Пещера клещей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l97.png", task: "Раскрась картинку из подземелья!", level: 4 },
        98: { title: "Зал комаров", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l98.png", task: "Раскрась картинку из подземелья!", level: 4 },
        99: { title: "Гнездо москитов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l99.png", task: "Раскрась картинку из подземелья!", level: 4 },
        100: { title: "Зал мух", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l100.png", task: "Раскрась картинку из подземелья!", level: 4 },
        
        // УРОВЕНЬ 5: МИНИ-БОССЫ 101-106
      101: { 
    title: "Хранитель подземелья", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l101.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с боссом",
        "Раскрась картинку с эпической битвой",
        "Раскрась картинку со святым символом",
        "Раскрась картинку с молитвой"
    ]
},
102: { 
    title: "Теневой дракон", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l102.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с драконом",
        "Раскрась картинку с тенью",
        "Раскрась картинку с божественным светом",
        "Раскрась картинку с изгнанием тьмы"
    ]
},
103: { 
    title: "Король гоблинов", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l103.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с гоблином",
        "Раскрась картинку с короной",
        "Раскрась картинку с благословением",
        "Раскрась картинку с исцелением"
    ]
},
104: { 
    title: "Дух тьмы", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l104.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с духом",
        "Раскрась картинку с тьмой",
        "Раскрась картинку со святой водой",
        "Раскрась картинку с изгоняющим заклинанием"
    ]
},
105: { 
    title: "Маг хаоса", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l105.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с магом",
        "Раскрась картинку с хаосом",
        "Раскрась картинку с божественным щитом",
        "Раскрась картинку с храмом"
    ]
},
106: { 
    title: "Железный голем", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l106.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с големом",
        "Раскрась картинку с металлом",
        "Раскрась картинку с освящённым оружием",
        "Раскрась картинку с алтарём"
    ]
},
        
        // УРОВЕНЬ 6: 107-112
        107: { title: "Возрождение", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l107.png", task: "Раскрась картинку с возрождением или светом!", level: 6 },
        108: { title: "Новая сила", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l108.png", task: "Раскрась картинку с силой или энергией!", level: 6 },
        109: { title: "Древний артефакт", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l109.png", task: "Раскрась картинку с артефактом или реликвией!", level: 6 },
        110: { title: "Союзники", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l110.png", task: "Раскрась картинку с союзниками или командой!", level: 6 },
        111: { title: "Карта сокровищ", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l111.png", task: "Раскрась картинку с картой или сокровищем!", level: 6 },
        112: { title: "Портал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l112.png", task: "Раскрась картинку с порталом или вратами!", level: 6 },
        
        // УРОВЕНЬ 7: 113-136
        113: { title: "Солнечный алтарь", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l113.png", task: "Раскрась космическую картинку!", level: 7 },
        114: { title: "Зал затмения", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l114.png", task: "Раскрась космическую картинку!", level: 7 },
        115: { title: "Комета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l115.png", task: "Раскрась космическую картинку!", level: 7 },
        116: { title: "Метеоритный зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l116.png", task: "Раскрась космическую картинку!", level: 7 },
        117: { title: "Галактика", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l117.png", task: "Раскрась космическую картинку!", level: 7 },
        118: { title: "Чёрная дыра", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l118.png", task: "Раскрась космическую картинку!", level: 7 },
        119: { title: "Туманность", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l119.png", task: "Раскрась космическую картинку!", level: 7 },
        120: { title: "Созвездие рыцаря", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l120.png", task: "Раскрась космическую картинку!", level: 7 },
        121: { title: "Планетария", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l121.png", task: "Раскрась космическую картинку!", level: 7 },
        122: { title: "Астероидное поле", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l122.png", task: "Раскрась космическую картинку!", level: 7 },
        123: { title: "Орбитальная станция", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l123.png", task: "Раскрась космическую картинку!", level: 7 },
        124: { title: "Космический корабль", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l124.png", task: "Раскрась космическую картинку!", level: 7 },
        125: { title: "Инопланетный лес", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l125.png", task: "Раскрась космическую картинку!", level: 7 },
        126: { title: "Кристальная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l126.png", task: "Раскрась космическую картинку!", level: 7 },
        127: { title: "Огненная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l127.png", task: "Раскрась космическую картинку!", level: 7 },
        128: { title: "Водная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l128.png", task: "Раскрась космическую картинку!", level: 7 },
        129: { title: "Воздушная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l129.png", task: "Раскрась космическую картинку!", level: 7 },
        130: { title: "Земная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l130.png", task: "Раскрась космическую картинку!", level: 7 },
        131: { title: "Пустынная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l131.png", task: "Раскрась космическую картинку!", level: 7 },
        132: { title: "Ледяная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l132.png", task: "Раскрась космическую картинку!", level: 7 },
        133: { title: "Тропическая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l133.png", task: "Раскрась космическую картинку!", level: 7 },
        134: { title: "Вулканическая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l134.png", task: "Раскрась космическую картинку!", level: 7 },
        135: { title: "Океаническая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l135.png", task: "Раскрась космическую картинку!", level: 7 },
        136: { title: "Газовая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l136.png", task: "Раскрась космическую картинку!", level: 7 },
        
        // УРОВЕНЬ 8: 137-184
        137: { title: "Кольцевая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l137.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        138: { title: "Двойная звезда", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l138.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        139: { title: "Нейтронная звезда", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l139.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        140: { title: "Сверхновая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l140.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        141: { title: "Квазар", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l141.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        142: { title: "Пульсар", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l142.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        143: { title: "Магнитар", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l143.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        144: { title: "Червовая нора", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l144.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        145: { title: "Тёмная материя", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l145.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        146: { title: "Тёмная энергия", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l146.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        147: { title: "Реликтовое излучение", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l147.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        148: { title: "Большой взрыв", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l148.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        149: { title: "Башня молний", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l149.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        150: { title: "Пещера времени", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l150.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        151: { title: "Зал забвения", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l151.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        152: { title: "Мост судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l152.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        153: { title: "Колодец желаний", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l153.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        154: { title: "Тронный зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l154.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        155: { title: "Кристалл души", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l155.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        156: { title: "Демон Бездны", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l156.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        157: { title: "Повелитель хаоса", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l157.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        158: { title: "Хранитель времени", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l158.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        159: { title: "Страж реальности", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l159.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        160: { title: "Испепелитель", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l160.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        161: { title: "Ледяной великан", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l161.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        162: { title: "Каменный голем", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l162.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        163: { title: "Властелин бурь", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l163.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        164: { title: "Повелитель морей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l164.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        165: { title: "Король небес", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l165.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        166: { title: "Бог войны", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l166.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        167: { title: "Владыка смерти", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l167.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        168: { title: "Архидемон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l168.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        169: { title: "Князь тьмы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l169.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        170: { title: "Верховный лич", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l170.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        171: { title: "Дракон апокалипсиса", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l171.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        172: { title: "Титан судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l172.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        173: { title: "Первородный хаос", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l173.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        174: { title: "Сердце вселенной", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l174.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        175: { title: "Око судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l175.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        176: { title: "Книга времён", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l176.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        177: { title: "Ключ бытия", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l177.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        178: { title: "Трон творца", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l178.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        179: { title: "Абсолютный ноль", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l179.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        180: { title: "Бесконечность", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l180.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        181: { title: "Бездна", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l181.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        182: { title: "Реликт предтеч", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l182.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        183: { title: "Звёздные врата", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l183.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        184: { title: "Грань миров", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l184.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        
        // УРОВЕНЬ 9: 185-202
        185: { title: "Тропа героев", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l185.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        186: { title: "Зал легенд", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l186.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        187: { title: "Огненная бездна", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l187.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        188: { title: "Ледяная пропасть", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l188.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        189: { title: "Зал доблести", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l189.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        190: { title: "Храм света", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l190.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        191: { title: "Пещера отражений", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l191.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        192: { title: "Мост надежды", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l192.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        193: { title: "Зал мудрости", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l193.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        194: { title: "Башня судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l194.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        195: { title: "Портал героев", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l195.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        196: { title: "Зал силы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l196.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        197: { title: "Трон победителя", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l197.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        198: { title: "Зал чести", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l198.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        199: { title: "Арена судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l199.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        200: { title: "Врата победы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l200.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        201: { title: "Зал славы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l201.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        202: { title: "Преддверие финала", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l202.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        
        // УРОВЕНЬ 10: ФИНАЛЬНЫЕ БОССЫ 203-208
        203: { 
    title: "Демон Бездны", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l203.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с демоном",
        "Раскрась картинку с бездной",
        "Раскрась картинку с экзорцизмом",
        "Раскрась картинку с небесным воинством"
    ]
},
204: { 
    title: "Архилич", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l204.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с личом",
        "Раскрась картинку с некромантом",
        "Раскрась картинку с упокоением души",
        "Раскрась картинку с кладбищем"
    ]
},
205: { 
    title: "Древний дракон", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l205.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с древним драконом",
        "Раскрась картинку с драконьим огнём",
        "Раскрась картинку с божественным судом",
        "Раскрась картинку с небесным пламенем"
    ]
},
206: { 
    title: "Король демонов", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l206.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с королём демонов",
        "Раскрась картинку с троном тьмы",
        "Раскрась картинку со священной войной",
        "Раскрась картинку с падшим ангелом"
    ]
},
207: { 
    title: "Титан бездны", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l207.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с титаном",
        "Раскрась картинку с разрушением",
        "Раскрась картинку с божественным гневом",
        "Раскрась картинку с апокалипсисом"
    ]
},
208: { 
    title: "Властелин тьмы", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/l208.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с властелином тьмы",
        "Раскрась картинку с армией тьмы",
        "Раскрась картинку с последней молитвой",
        "Раскрась картинку с победой света"
    ]
}
    }
};

// ==========================================
// ПЕРЕХОДЫ ДЛЯ ЖРЕЦА
// ==========================================

var DND_TRANSITIONS_ARCHER = {};

// 0 → 1-3 (1-2→1, 3-4→2, 5-6→3)
DND_TRANSITIONS_ARCHER[0] = {1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3};

// 1-3 → 4-12
DND_TRANSITIONS_ARCHER[1] = {1: 4, 2: 4, 3: 5, 4: 5, 5: 6, 6: 6};
DND_TRANSITIONS_ARCHER[2] = {1: 7, 2: 7, 3: 8, 4: 8, 5: 9, 6: 9};
DND_TRANSITIONS_ARCHER[3] = {1: 10, 2: 10, 3: 11, 4: 11, 5: 12, 6: 12};

// 4-12 → 13-39 (по 3 карты)
(function() {
    var c = 13;
    for (var i = 4; i <= 12; i++) {
        DND_TRANSITIONS_ARCHER[i] = {};
        DND_TRANSITIONS_ARCHER[i][1] = c; DND_TRANSITIONS_ARCHER[i][2] = c;
        DND_TRANSITIONS_ARCHER[i][3] = c+1; DND_TRANSITIONS_ARCHER[i][4] = c+1;
        DND_TRANSITIONS_ARCHER[i][5] = c+2; DND_TRANSITIONS_ARCHER[i][6] = c+2;
        c += 3;
    }
})();

// 13-39 → 40-100 (по 3 карты)
(function() {
    var c = 40;
    for (var i = 13; i <= 39; i++) {
        DND_TRANSITIONS_ARCHER[i] = {};
        DND_TRANSITIONS_ARCHER[i][1] = c; DND_TRANSITIONS_ARCHER[i][2] = c;
        DND_TRANSITIONS_ARCHER[i][3] = c+1; DND_TRANSITIONS_ARCHER[i][4] = c+1;
        DND_TRANSITIONS_ARCHER[i][5] = c+2; DND_TRANSITIONS_ARCHER[i][6] = c+2;
        c += 3;
    }
})();

// 40-100 → 101-106 (прямая зависимость)
for (var i = 40; i <= 100; i++) {
    DND_TRANSITIONS_ARCHER[i] = {1: 101, 2: 102, 3: 103, 4: 104, 5: 105, 6: 106};
}

// 101-106 → 107-112 (прямая зависимость)
for (var i = 101; i <= 106; i++) {
    DND_TRANSITIONS_ARCHER[i] = {1: 107, 2: 108, 3: 109, 4: 110, 5: 111, 6: 112};
}

// 107-112 → 113-136 (по 4 карты, только ключи 1-6)
(function() {
    var c = 113;
    for (var i = 107; i <= 112; i++) {
        DND_TRANSITIONS_ARCHER[i] = {};
        DND_TRANSITIONS_ARCHER[i][1] = c;   DND_TRANSITIONS_ARCHER[i][2] = c;
        DND_TRANSITIONS_ARCHER[i][3] = c+1; DND_TRANSITIONS_ARCHER[i][4] = c+1;
        DND_TRANSITIONS_ARCHER[i][5] = c+2; DND_TRANSITIONS_ARCHER[i][6] = c+3;
        c += 4;
    }
})();

// 113-136 → 137-184 (по 2 карты, с ограничением)
(function() {
    var c = 137;
    for (var i = 113; i <= 136; i++) {
        DND_TRANSITIONS_ARCHER[i] = {};
        DND_TRANSITIONS_ARCHER[i][1] = Math.min(c, 184);
        DND_TRANSITIONS_ARCHER[i][2] = Math.min(c, 184);
        DND_TRANSITIONS_ARCHER[i][3] = Math.min(c+1, 184);
        DND_TRANSITIONS_ARCHER[i][4] = Math.min(c+1, 184);
        DND_TRANSITIONS_ARCHER[i][5] = Math.min(c+1, 184);
        DND_TRANSITIONS_ARCHER[i][6] = Math.min(c+1, 184);
        c += 2;
    }
})();

// 137-184 → 185-202
for (var i = 137; i <= 184; i++) {
    DND_TRANSITIONS_ARCHER[i] = {1: 185, 2: 186, 3: 187, 4: 188, 5: 189, 6: 190};
}

// 185-202 → 203-208
for (var i = 185; i <= 202; i++) {
    DND_TRANSITIONS_ARCHER[i] = {1: 203, 2: 204, 3: 205, 4: 206, 5: 207, 6: 208};
}

// 203-208 — конец
for (var i = 203; i <= 208; i++) {
    DND_TRANSITIONS_ARCHER[i] = {};
}
        // ==========================================
// D&D КАРТЫ И ПЕРЕХОДЫ - ДРУИД
// ==========================================

var DND_CARDS_DRUID = {
    druid: {
        // СТАРТ (0)
        0: {
            title: "Друид",
            image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d0.png",
            isStart: true,
            level: 0
        },
        
        // УРОВЕНЬ 1: 1-3
        1: { title: "Священная роща", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d1.png", task: "Раскрась картинку с деревьями или природой!", level: 1 },
        2: { title: "Тотемы духов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d2.png", task: "Раскрась картинку с тотемом или духом!", level: 1 },
        3: { title: "Тропа зверей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d3.png", task: "Раскрась картинку с животными или следом!", level: 1 },
        
        // УРОВЕНЬ 2: 4-12
        4: { title: "Лесная чаща", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d4.png", task: "Раскрась картинку с лесом или диким животным!", level: 2 },
        5: { title: "Разбойничий лагерь", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d5.png", task: "Раскрась картинку с разбойниками или схваткой!", level: 2 },
        6: { title: "Заброшенная башня", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d6.png", task: "Раскрась картинку с башней или руинами!", level: 2 },
        7: { title: "Горный перевал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d7.png", task: "Раскрась картинку с горами или перевалом!", level: 2 },
        8: { title: "Пещера гоблинов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d8.png", task: "Раскрась картинку с пещерой или гоблинами!", level: 2 },
        9: { title: "Орлиное гнездо", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d9.png", task: "Раскрась картинку с орлом или сокровищем!", level: 2 },
        10: { title: "Старый мост", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d10.png", task: "Раскрась картинку с мостом или рекой!", level: 2 },
        11: { title: "Деревня у реки", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d11.png", task: "Раскрась картинку с деревней или жителями!", level: 2 },
        12: { title: "Водопад", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d12.png", task: "Раскрась картинку с водопадом или тайным проходом!", level: 2 },
        
        // УРОВЕНЬ 3: 13-39
        13: { title: "Волчья стая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d13.png", task: "Раскрась картинку с волком или стаей!", level: 3 },
        14: { title: "Древний дуб", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d14.png", task: "Раскрась картинку с деревом или амулетом!", level: 3 },
        15: { title: "Лесной дух", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d15.png", task: "Раскрась картинку с духом или магией!", level: 3 },
        16: { title: "Главарь разбойников", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d16.png", task: "Раскрась картинку с главарём или переговорами!", level: 3 },
        17: { title: "Спасение каравана", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d17.png", task: "Раскрась картинку с караваном или зельем!", level: 3 },
        18: { title: "Разбойничий тайник", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d18.png", task: "Раскрась картинку с сокровищами или ключом!", level: 3 },
        19: { title: "Руны на стенах", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d19.png", task: "Раскрась картинку с рунами или книгой!", level: 3 },
        20: { title: "Призрак рыцаря", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d20.png", task: "Раскрась картинку с призраком или магическим мечом!", level: 3 },
        21: { title: "Подземный ход", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d21.png", task: "Раскрась картинку с подземельем или лестницей!", level: 3 },
        22: { title: "Каменный мост", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d22.png", task: "Раскрась картинку с мостом или рекой!", level: 3 },
        23: { title: "Башня призраков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d23.png", task: "Раскрась картинку с башней или призраком!", level: 3 },
        24: { title: "Лабиринт", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d24.png", task: "Раскрась картинку с лабиринтом или стеной!", level: 3 },
        25: { title: "Гнездо виверны", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d25.png", task: "Раскрась картинку с виверной или гнездом!", level: 3 },
        26: { title: "Проклятый фонтан", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d26.png", task: "Раскрась картинку с фонтаном или водой!", level: 3 },
        27: { title: "Комната пыток", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d27.png", task: "Раскрась картинку с цепями или инструментами!", level: 3 },
        28: { title: "Винный погреб", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d28.png", task: "Раскрась картинку с бочками или бутылками!", level: 3 },
        29: { title: "Королевская усыпальница", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d29.png", task: "Раскрась картинку с саркофагом или короной!", level: 3 },
        30: { title: "Трон призрачного короля", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d30.png", task: "Раскрась картинку с троном или призраком!", level: 3 },
        31: { title: "Зал фресок", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d31.png", task: "Раскрась картинку с фресками или живописью!", level: 3 },
        32: { title: "Келья монаха", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d32.png", task: "Раскрась картинку с монахом или свечой!", level: 3 },
        33: { title: "Гобеленовый зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d33.png", task: "Раскрась картинку с гобеленом или тканью!", level: 3 },
        34: { title: "Склад оружия", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d34.png", task: "Раскрась картинку с оружием или складом!", level: 3 },
        35: { title: "Кузня гномов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d35.png", task: "Раскрась картинку с кузницей или гномом!", level: 3 },
        36: { title: "Шахта", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d36.png", task: "Раскрась картинку с шахтой или киркой!", level: 3 },
        37: { title: "Грибная пещера", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d37.png", task: "Раскрась картинку с грибами или пещерой!", level: 3 },
        38: { title: "Логово тролля", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d38.png", task: "Раскрась картинку с троллем или дубиной!", level: 3 },
        39: { title: "Подземная река", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d39.png", task: "Раскрась картинку с рекой или лодкой!", level: 3 },
        
        // УРОВЕНЬ 4: 40-100
        40: { title: "Сталактитовая пещера", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d40.png", task: "Раскрась картинку из подземелья!", level: 4 },
        41: { title: "Костяной зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d41.png", task: "Раскрась картинку из подземелья!", level: 4 },
        42: { title: "Алтарь жертвоприношений", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d42.png", task: "Раскрась картинку из подземелья!", level: 4 },
        43: { title: "Тюрьма душ", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d43.png", task: "Раскрась картинку из подземелья!", level: 4 },
        44: { title: "Портал в бездну", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d44.png", task: "Раскрась картинку из подземелья!", level: 4 },
        45: { title: "Комната с рычагами", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d45.png", task: "Раскрась картинку из подземелья!", level: 4 },
        46: { title: "Библиотека", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d46.png", task: "Раскрась картинку из подземелья!", level: 4 },
        47: { title: "Зал карт", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d47.png", task: "Раскрась картинку из подземелья!", level: 4 },
        48: { title: "Оружейная", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d48.png", task: "Раскрась картинку из подземелья!", level: 4 },
        49: { title: "Смотровая башня", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d49.png", task: "Раскрась картинку из подземелья!", level: 4 },
        50: { title: "Казармы стражи", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d50.png", task: "Раскрась картинку из подземелья!", level: 4 },
        51: { title: "Колодец", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d51.png", task: "Раскрась картинку из подземелья!", level: 4 },
        52: { title: "Подземный рынок", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d52.png", task: "Раскрась картинку из подземелья!", level: 4 },
        53: { title: "Таверна", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d53.png", task: "Раскрась картинку из подземелья!", level: 4 },
        54: { title: "Конюшня", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d54.png", task: "Раскрась картинку из подземелья!", level: 4 },
        55: { title: "Кладовая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d55.png", task: "Раскрась картинку из подземелья!", level: 4 },
        56: { title: "Кузнечный цех", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d56.png", task: "Раскрась картинку из подземелья!", level: 4 },
        57: { title: "Лаборатория алхимика", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d57.png", task: "Раскрась картинку из подземелья!", level: 4 },
        58: { title: "Обсерватория", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d58.png", task: "Раскрась картинку из подземелья!", level: 4 },
        59: { title: "Теплица", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d59.png", task: "Раскрась картинку из подземелья!", level: 4 },
        60: { title: "Балкон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d60.png", task: "Раскрась картинку из подземелья!", level: 4 },
        61: { title: "Зал советов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d61.png", task: "Раскрась картинку из подземелья!", level: 4 },
        62: { title: "Галерея героев", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d62.png", task: "Раскрась картинку из подземелья!", level: 4 },
        63: { title: "Зал фонтанов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d63.png", task: "Раскрась картинку из подземелья!", level: 4 },
        64: { title: "Покой рыцаря", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d64.png", task: "Раскрась картинку из подземелья!", level: 4 },
        65: { title: "Кабинет мага", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d65.png", task: "Раскрась картинку из подземелья!", level: 4 },
        66: { title: "Зал иллюзий", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d66.png", task: "Раскрась картинку из подземелья!", level: 4 },
        67: { title: "Пещера отголосков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d67.png", task: "Раскрась картинку из подземелья!", level: 4 },
        68: { title: "Зал тишины", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d68.png", task: "Раскрась картинку из подземелья!", level: 4 },
        69: { title: "Комната с ловушками", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d69.png", task: "Раскрась картинку из подземелья!", level: 4 },
        70: { title: "Зал шипов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d70.png", task: "Раскрась картинку из подземелья!", level: 4 },
        71: { title: "Гнездо змей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d71.png", task: "Раскрась картинку из подземелья!", level: 4 },
        72: { title: "Зал скорпионов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d72.png", task: "Раскрась картинку из подземелья!", level: 4 },
        73: { title: "Паучий трон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d73.png", task: "Раскрась картинку из подземелья!", level: 4 },
        74: { title: "Кокон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d74.png", task: "Раскрась картинку из подземелья!", level: 4 },
        75: { title: "Зал муравьёв", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d75.png", task: "Раскрась картинку из подземелья!", level: 4 },
        76: { title: "Улей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d76.png", task: "Раскрась картинку из подземелья!", level: 4 },
        77: { title: "Зал жуков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d77.png", task: "Раскрась картинку из подземелья!", level: 4 },
        78: { title: "Термитник", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d78.png", task: "Раскрась картинку из подземелья!", level: 4 },
        79: { title: "Зал богомолов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d79.png", task: "Раскрась картинку из подземелья!", level: 4 },
        80: { title: "Колодец скорпионов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d80.png", task: "Раскрась картинку из подземелья!", level: 4 },
        81: { title: "Зал саранчи", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d81.png", task: "Раскрась картинку из подземелья!", level: 4 },
        82: { title: "Гнездо шершней", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d82.png", task: "Раскрась картинку из подземелья!", level: 4 },
        83: { title: "Зал светлячков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d83.png", task: "Раскрась картинку из подземелья!", level: 4 },
        84: { title: "Пещера мотыльков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d84.png", task: "Раскрась картинку из подземелья!", level: 4 },
        85: { title: "Зал бабочек", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d85.png", task: "Раскрась картинку из подземелья!", level: 4 },
        86: { title: "Гусеничный зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d86.png", task: "Раскрась картинку из подземелья!", level: 4 },
        87: { title: "Коконовая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d87.png", task: "Раскрась картинку из подземелья!", level: 4 },
        88: { title: "Зал цикад", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d88.png", task: "Раскрась картинку из подземелья!", level: 4 },
        89: { title: "Пещера кузнечиков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d89.png", task: "Раскрась картинку из подземелья!", level: 4 },
        90: { title: "Зал тараканов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d90.png", task: "Раскрась картинку из подземелья!", level: 4 },
        91: { title: "Гнездо сороконожек", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d91.png", task: "Раскрась картинку из подземелья!", level: 4 },
        92: { title: "Зал мокриц", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d92.png", task: "Раскрась картинку из подземелья!", level: 4 },
        93: { title: "Пещера улиток", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d93.png", task: "Раскрась картинку из подземелья!", level: 4 },
        94: { title: "Зал слизней", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d94.png", task: "Раскрась картинку из подземелья!", level: 4 },
        95: { title: "Червивый зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d95.png", task: "Раскрась картинку из подземелья!", level: 4 },
        96: { title: "Зал пиявок", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d96.png", task: "Раскрась картинку из подземелья!", level: 4 },
        97: { title: "Пещера клещей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d97.png", task: "Раскрась картинку из подземелья!", level: 4 },
        98: { title: "Зал комаров", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d98.png", task: "Раскрась картинку из подземелья!", level: 4 },
        99: { title: "Гнездо москитов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d99.png", task: "Раскрась картинку из подземелья!", level: 4 },
        100: { title: "Зал мух", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d100.png", task: "Раскрась картинку из подземелья!", level: 4 },
        
        // УРОВЕНЬ 5: МИНИ-БОССЫ 101-106
        101: { 
    title: "Хранитель подземелья", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d101.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с боссом",
        "Раскрась картинку с эпической битвой",
        "Раскрась картинку с силой природы",
        "Раскрась картинку с лесным духом"
    ]
},
102: { 
    title: "Теневой дракон", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d102.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с драконом",
        "Раскрась картинку с тенью",
        "Раскрась картинку с ядовитым плющом",
        "Раскрась картинку с лесным пожаром"
    ]
},
103: { 
    title: "Король гоблинов", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d103.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с гоблином",
        "Раскрась картинку с короной",
        "Раскрась картинку с превращением в зверя",
        "Раскрась картинку с лесной армией"
    ]
},
104: { 
    title: "Дух тьмы", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d104.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с духом",
        "Раскрась картинку с тьмой",
        "Раскрась картинку с лунным светом",
        "Раскрась картинку с тотемом"
    ]
},
105: { 
    title: "Маг хаоса", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d105.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с магом",
        "Раскрась картинку с хаосом",
        "Раскрась картинку с ураганом",
        "Раскрась картинку с землетрясением"
    ]
},
106: { 
    title: "Железный голем", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d106.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с големом",
        "Раскрась картинку с металлом",
        "Раскрась картинку с корнями деревьев",
        "Раскрась картинку с каменной лавиной"
    ]
},
        
        // УРОВЕНЬ 6: 107-112
        107: { title: "Возрождение", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d107.png", task: "Раскрась картинку с возрождением или светом!", level: 6 },
        108: { title: "Новая сила", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d108.png", task: "Раскрась картинку с силой или энергией!", level: 6 },
        109: { title: "Древний артефакт", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d109.png", task: "Раскрась картинку с артефактом или реликвией!", level: 6 },
        110: { title: "Союзники", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d110.png", task: "Раскрась картинку с союзниками или командой!", level: 6 },
        111: { title: "Карта сокровищ", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d111.png", task: "Раскрась картинку с картой или сокровищем!", level: 6 },
        112: { title: "Портал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d112.png", task: "Раскрась картинку с порталом или вратами!", level: 6 },
        
        // УРОВЕНЬ 7: 113-136
        113: { title: "Солнечный алтарь", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d113.png", task: "Раскрась космическую картинку!", level: 7 },
        114: { title: "Зал затмения", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d114.png", task: "Раскрась космическую картинку!", level: 7 },
        115: { title: "Комета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d115.png", task: "Раскрась космическую картинку!", level: 7 },
        116: { title: "Метеоритный зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d116.png", task: "Раскрась космическую картинку!", level: 7 },
        117: { title: "Галактика", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d117.png", task: "Раскрась космическую картинку!", level: 7 },
        118: { title: "Чёрная дыра", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d118.png", task: "Раскрась космическую картинку!", level: 7 },
        119: { title: "Туманность", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d119.png", task: "Раскрась космическую картинку!", level: 7 },
        120: { title: "Созвездие рыцаря", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d120.png", task: "Раскрась космическую картинку!", level: 7 },
        121: { title: "Планетария", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d121.png", task: "Раскрась космическую картинку!", level: 7 },
        122: { title: "Астероидное поле", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d122.png", task: "Раскрась космическую картинку!", level: 7 },
        123: { title: "Орбитальная станция", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d123.png", task: "Раскрась космическую картинку!", level: 7 },
        124: { title: "Космический корабль", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d124.png", task: "Раскрась космическую картинку!", level: 7 },
        125: { title: "Инопланетный лес", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d125.png", task: "Раскрась космическую картинку!", level: 7 },
        126: { title: "Кристальная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d126.png", task: "Раскрась космическую картинку!", level: 7 },
        127: { title: "Огненная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d127.png", task: "Раскрась космическую картинку!", level: 7 },
        128: { title: "Водная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d128.png", task: "Раскрась космическую картинку!", level: 7 },
        129: { title: "Воздушная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d129.png", task: "Раскрась космическую картинку!", level: 7 },
        130: { title: "Земная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d130.png", task: "Раскрась космическую картинку!", level: 7 },
        131: { title: "Пустынная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d131.png", task: "Раскрась космическую картинку!", level: 7 },
        132: { title: "Ледяная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d132.png", task: "Раскрась космическую картинку!", level: 7 },
        133: { title: "Тропическая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d133.png", task: "Раскрась космическую картинку!", level: 7 },
        134: { title: "Вулканическая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d134.png", task: "Раскрась космическую картинку!", level: 7 },
        135: { title: "Океаническая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d135.png", task: "Раскрась космическую картинку!", level: 7 },
        136: { title: "Газовая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d136.png", task: "Раскрась космическую картинку!", level: 7 },
        
        // УРОВЕНЬ 8: 137-184
        137: { title: "Кольцевая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d137.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        138: { title: "Двойная звезда", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d138.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        139: { title: "Нейтронная звезда", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d139.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        140: { title: "Сверхновая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d140.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        141: { title: "Квазар", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d141.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        142: { title: "Пульсар", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d142.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        143: { title: "Магнитар", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d143.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        144: { title: "Червовая нора", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d144.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        145: { title: "Тёмная материя", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d145.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        146: { title: "Тёмная энергия", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d146.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        147: { title: "Реликтовое излучение", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d147.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        148: { title: "Большой взрыв", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d148.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        149: { title: "Башня молний", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d149.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        150: { title: "Пещера времени", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d150.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        151: { title: "Зал забвения", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d151.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        152: { title: "Мост судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d152.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        153: { title: "Колодец желаний", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d153.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        154: { title: "Тронный зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d154.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        155: { title: "Кристалл души", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d155.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        156: { title: "Демон Бездны", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d156.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        157: { title: "Повелитель хаоса", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d157.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        158: { title: "Хранитель времени", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d158.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        159: { title: "Страж реальности", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d159.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        160: { title: "Испепелитель", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d160.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        161: { title: "Ледяной великан", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d161.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        162: { title: "Каменный голем", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d162.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        163: { title: "Властелин бурь", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d163.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        164: { title: "Повелитель морей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d164.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        165: { title: "Король небес", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d165.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        166: { title: "Бог войны", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d166.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        167: { title: "Владыка смерти", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d167.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        168: { title: "Архидемон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d168.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        169: { title: "Князь тьмы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d169.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        170: { title: "Верховный лич", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d170.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        171: { title: "Дракон апокалипсиса", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d171.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        172: { title: "Титан судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d172.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        173: { title: "Первородный хаос", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d173.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        174: { title: "Сердце вселенной", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d174.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        175: { title: "Око судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d175.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        176: { title: "Книга времён", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d176.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        177: { title: "Ключ бытия", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d177.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        178: { title: "Трон творца", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d178.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        179: { title: "Абсолютный ноль", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d179.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        180: { title: "Бесконечность", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d180.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        181: { title: "Бездна", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d181.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        182: { title: "Реликт предтеч", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d182.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        183: { title: "Звёздные врата", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d183.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        184: { title: "Грань миров", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d184.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        
        // УРОВЕНЬ 9: 185-202
        185: { title: "Тропа героев", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d185.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        186: { title: "Зал легенд", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d186.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        187: { title: "Огненная бездна", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d187.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        188: { title: "Ледяная пропасть", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d188.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        189: { title: "Зал доблести", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d189.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        190: { title: "Храм света", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d190.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        191: { title: "Пещера отражений", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d191.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        192: { title: "Мост надежды", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d192.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        193: { title: "Зал мудрости", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d193.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        194: { title: "Башня судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d194.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        195: { title: "Портал героев", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d195.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        196: { title: "Зал силы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d196.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        197: { title: "Трон победителя", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d197.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        198: { title: "Зал чести", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d198.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        199: { title: "Арена судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d199.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        200: { title: "Врата победы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d200.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        201: { title: "Зал славы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d201.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        202: { title: "Преддверие финала", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d202.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        
        // УРОВЕНЬ 10: ФИНАЛЬНЫЕ БОССЫ 203-208
       203: { 
    title: "Демон Бездны", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d203.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с демоном",
        "Раскрась картинку с бездной",
        "Раскрась картинку с пробуждением земли",
        "Раскрась картинку с древним энтом"
    ]
},
204: { 
    title: "Архилич", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d204.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с личом",
        "Раскрась картинку с некромантом",
        "Раскрась картинку с кругом жизни",
        "Раскрась картинку с возрождением"
    ]
},
205: { 
    title: "Древний дракон", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d205.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с древним драконом",
        "Раскрась картинку с драконьим огнём",
        "Раскрась картинку с ледяной бурей",
        "Раскрась картинку с грозовым небом"
    ]
},
206: { 
    title: "Король демонов", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d206.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с королём демонов",
        "Раскрась картинку с троном тьмы",
        "Раскрась картинку с силой стихий",
        "Раскрась картинку с мировым древом"
    ]
},
207: { 
    title: "Титан бездны", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d207.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с титаном",
        "Раскрась картинку с разрушением",
        "Раскрась картинку с цунами",
        "Раскрась картинку с извержением вулкана"
    ]
},
208: { 
    title: "Властелин тьмы", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/d208.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с властелином тьмы",
        "Раскрась картинку с армией тьмы",
        "Раскрась картинку с пробуждением природы",
        "Раскрась картинку с новым рассветом"
    ]
}
    }
};

// ==========================================
// ПЕРЕХОДЫ ДЛЯ ДРУИДА (DRUID)
// ==========================================

var DND_TRANSITIONS_DRUID = {};

// 0 → 1-3 (1-2→1, 3-4→2, 5-6→3)
DND_TRANSITIONS_DRUID[0] = {1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3};

// 1-3 → 4-12
DND_TRANSITIONS_DRUID[1] = {1: 4, 2: 4, 3: 5, 4: 5, 5: 6, 6: 6};
DND_TRANSITIONS_DRUID[2] = {1: 7, 2: 7, 3: 8, 4: 8, 5: 9, 6: 9};
DND_TRANSITIONS_DRUID[3] = {1: 10, 2: 10, 3: 11, 4: 11, 5: 12, 6: 12};

// 4-12 → 13-39 (по 3 карты)
(function() {
    var c = 13;
    for (var i = 4; i <= 12; i++) {
        DND_TRANSITIONS_DRUID[i] = {};
        DND_TRANSITIONS_DRUID[i][1] = c; DND_TRANSITIONS_DRUID[i][2] = c;
        DND_TRANSITIONS_DRUID[i][3] = c+1; DND_TRANSITIONS_DRUID[i][4] = c+1;
        DND_TRANSITIONS_DRUID[i][5] = c+2; DND_TRANSITIONS_DRUID[i][6] = c+2;
        c += 3;
    }
})();

// 13-39 → 40-100 (по 3 карты)
(function() {
    var c = 40;
    for (var i = 13; i <= 39; i++) {
        DND_TRANSITIONS_DRUID[i] = {};
        DND_TRANSITIONS_DRUID[i][1] = c; DND_TRANSITIONS_DRUID[i][2] = c;
        DND_TRANSITIONS_DRUID[i][3] = c+1; DND_TRANSITIONS_DRUID[i][4] = c+1;
        DND_TRANSITIONS_DRUID[i][5] = c+2; DND_TRANSITIONS_DRUID[i][6] = c+2;
        c += 3;
    }
})();

// 40-100 → 101-106 (прямая зависимость)
for (var i = 40; i <= 100; i++) {
    DND_TRANSITIONS_DRUID[i] = {1: 101, 2: 102, 3: 103, 4: 104, 5: 105, 6: 106};
}

// 101-106 → 107-112 (прямая зависимость)
for (var i = 101; i <= 106; i++) {
    DND_TRANSITIONS_DRUID[i] = {1: 107, 2: 108, 3: 109, 4: 110, 5: 111, 6: 112};
}

// 107-112 → 113-136 (по 4 карты, только ключи 1-6)
(function() {
    var c = 113;
    for (var i = 107; i <= 112; i++) {
        DND_TRANSITIONS_DRUID[i] = {};
        DND_TRANSITIONS_DRUID[i][1] = c;   DND_TRANSITIONS_DRUID[i][2] = c;
        DND_TRANSITIONS_DRUID[i][3] = c+1; DND_TRANSITIONS_DRUID[i][4] = c+1;
        DND_TRANSITIONS_DRUID[i][5] = c+2; DND_TRANSITIONS_DRUID[i][6] = c+3;
        c += 4;
    }
})();

// 113-136 → 137-184 (по 2 карты, с ограничением)
(function() {
    var c = 137;
    for (var i = 113; i <= 136; i++) {
        DND_TRANSITIONS_DRUID[i] = {};
        DND_TRANSITIONS_DRUID[i][1] = Math.min(c, 184);
        DND_TRANSITIONS_DRUID[i][2] = Math.min(c, 184);
        DND_TRANSITIONS_DRUID[i][3] = Math.min(c+1, 184);
        DND_TRANSITIONS_DRUID[i][4] = Math.min(c+1, 184);
        DND_TRANSITIONS_DRUID[i][5] = Math.min(c+1, 184);
        DND_TRANSITIONS_DRUID[i][6] = Math.min(c+1, 184);
        c += 2;
    }
})();

// 137-184 → 185-202
for (var i = 137; i <= 184; i++) {
    DND_TRANSITIONS_DRUID[i] = {1: 185, 2: 186, 3: 187, 4: 188, 5: 189, 6: 190};
}

// 185-202 → 203-208
for (var i = 185; i <= 202; i++) {
    DND_TRANSITIONS_DRUID[i] = {1: 203, 2: 204, 3: 205, 4: 206, 5: 207, 6: 208};
}

// 203-208 — конец
for (var i = 203; i <= 208; i++) {
    DND_TRANSITIONS_DRUID[i] = {};
}
        // ==========================================
// D&D КАРТЫ И ПЕРЕХОДЫ - АССАСИН
// ==========================================

var DND_CARDS_ASSASSIN = {
    assassin: {
        // СТАРТ (0)
        0: {
            title: "Ассасин",
            image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a0.png",
            isStart: true,
            level: 0
        },
        
        // УРОВЕНЬ 1: 1-3
        1: { title: "Гильдия воров", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a1.png", task: "Раскрась картинку с гильдией или скрытым входом!", level: 1 },
        2: { title: "Тренировка тени", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a2.png", task: "Раскрась картинку с тренировкой или тенью!", level: 1 },
        3: { title: "Секретный путь", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a3.png", task: "Раскрась картинку с тайным ходом или ловушкой!", level: 1 },
        
        // УРОВЕНЬ 2: 4-12
        4: { title: "Лесная чаща", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a4.png", task: "Раскрась картинку с лесом или диким животным!", level: 2 },
        5: { title: "Разбойничий лагерь", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a5.png", task: "Раскрась картинку с разбойниками или схваткой!", level: 2 },
        6: { title: "Заброшенная башня", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a6.png", task: "Раскрась картинку с башней или руинами!", level: 2 },
        7: { title: "Горный перевал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a7.png", task: "Раскрась картинку с горами или перевалом!", level: 2 },
        8: { title: "Пещера гоблинов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a8.png", task: "Раскрась картинку с пещерой или гоблинами!", level: 2 },
        9: { title: "Орлиное гнездо", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a9.png", task: "Раскрась картинку с орлом или сокровищем!", level: 2 },
        10: { title: "Старый мост", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a10.png", task: "Раскрась картинку с мостом или рекой!", level: 2 },
        11: { title: "Деревня у реки", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a11.png", task: "Раскрась картинку с деревней или жителями!", level: 2 },
        12: { title: "Водопад", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a12.png", task: "Раскрась картинку с водопадом или тайным проходом!", level: 2 },
        
        // УРОВЕНЬ 3: 13-39
        13: { title: "Волчья стая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a13.png", task: "Раскрась картинку с волком или стаей!", level: 3 },
        14: { title: "Древний дуб", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a14.png", task: "Раскрась картинку с деревом или амулетом!", level: 3 },
        15: { title: "Лесной дух", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a15.png", task: "Раскрась картинку с духом или магией!", level: 3 },
        16: { title: "Главарь разбойников", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a16.png", task: "Раскрась картинку с главарём или переговорами!", level: 3 },
        17: { title: "Спасение каравана", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a17.png", task: "Раскрась картинку с караваном или зельем!", level: 3 },
        18: { title: "Разбойничий тайник", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a18.png", task: "Раскрась картинку с сокровищами или ключом!", level: 3 },
        19: { title: "Руны на стенах", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a19.png", task: "Раскрась картинку с рунами или книгой!", level: 3 },
        20: { title: "Призрак рыцаря", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a20.png", task: "Раскрась картинку с призраком или магическим мечом!", level: 3 },
        21: { title: "Подземный ход", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a21.png", task: "Раскрась картинку с подземельем или лестницей!", level: 3 },
        22: { title: "Каменный мост", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a22.png", task: "Раскрась картинку с мостом или рекой!", level: 3 },
        23: { title: "Башня призраков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a23.png", task: "Раскрась картинку с башней или призраком!", level: 3 },
        24: { title: "Лабиринт", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a24.png", task: "Раскрась картинку с лабиринтом или стеной!", level: 3 },
        25: { title: "Гнездо виверны", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a25.png", task: "Раскрась картинку с виверной или гнездом!", level: 3 },
        26: { title: "Проклятый фонтан", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a26.png", task: "Раскрась картинку с фонтаном или водой!", level: 3 },
        27: { title: "Комната пыток", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a27.png", task: "Раскрась картинку с цепями или инструментами!", level: 3 },
        28: { title: "Винный погреб", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a28.png", task: "Раскрась картинку с бочками или бутылками!", level: 3 },
        29: { title: "Королевская усыпальница", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a29.png", task: "Раскрась картинку с саркофагом или короной!", level: 3 },
        30: { title: "Трон призрачного короля", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a30.png", task: "Раскрась картинку с троном или призраком!", level: 3 },
        31: { title: "Зал фресок", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a31.png", task: "Раскрась картинку с фресками или живописью!", level: 3 },
        32: { title: "Келья монаха", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a32.png", task: "Раскрась картинку с монахом или свечой!", level: 3 },
        33: { title: "Гобеленовый зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a33.png", task: "Раскрась картинку с гобеленом или тканью!", level: 3 },
        34: { title: "Склад оружия", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a34.png", task: "Раскрась картинку с оружием или складом!", level: 3 },
        35: { title: "Кузня гномов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a35.png", task: "Раскрась картинку с кузницей или гномом!", level: 3 },
        36: { title: "Шахта", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a36.png", task: "Раскрась картинку с шахтой или киркой!", level: 3 },
        37: { title: "Грибная пещера", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a37.png", task: "Раскрась картинку с грибами или пещерой!", level: 3 },
        38: { title: "Логово тролля", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a38.png", task: "Раскрась картинку с троллем или дубиной!", level: 3 },
        39: { title: "Подземная река", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a39.png", task: "Раскрась картинку с рекой или лодкой!", level: 3 },
        
        // УРОВЕНЬ 4: 40-100
        40: { title: "Сталактитовая пещера", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a40.png", task: "Раскрась картинку из подземелья!", level: 4 },
        41: { title: "Костяной зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a41.png", task: "Раскрась картинку из подземелья!", level: 4 },
        42: { title: "Алтарь жертвоприношений", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a42.png", task: "Раскрась картинку из подземелья!", level: 4 },
        43: { title: "Тюрьма душ", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a43.png", task: "Раскрась картинку из подземелья!", level: 4 },
        44: { title: "Портал в бездну", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a44.png", task: "Раскрась картинку из подземелья!", level: 4 },
        45: { title: "Комната с рычагами", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a45.png", task: "Раскрась картинку из подземелья!", level: 4 },
        46: { title: "Библиотека", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a46.png", task: "Раскрась картинку из подземелья!", level: 4 },
        47: { title: "Зал карт", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a47.png", task: "Раскрась картинку из подземелья!", level: 4 },
        48: { title: "Оружейная", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a48.png", task: "Раскрась картинку из подземелья!", level: 4 },
        49: { title: "Смотровая башня", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a49.png", task: "Раскрась картинку из подземелья!", level: 4 },
        50: { title: "Казармы стражи", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a50.png", task: "Раскрась картинку из подземелья!", level: 4 },
        51: { title: "Колодец", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a51.png", task: "Раскрась картинку из подземелья!", level: 4 },
        52: { title: "Подземный рынок", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a52.png", task: "Раскрась картинку из подземелья!", level: 4 },
        53: { title: "Таверна", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a53.png", task: "Раскрась картинку из подземелья!", level: 4 },
        54: { title: "Конюшня", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a54.png", task: "Раскрась картинку из подземелья!", level: 4 },
        55: { title: "Кладовая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a55.png", task: "Раскрась картинку из подземелья!", level: 4 },
        56: { title: "Кузнечный цех", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a56.png", task: "Раскрась картинку из подземелья!", level: 4 },
        57: { title: "Лаборатория алхимика", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a57.png", task: "Раскрась картинку из подземелья!", level: 4 },
        58: { title: "Обсерватория", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a58.png", task: "Раскрась картинку из подземелья!", level: 4 },
        59: { title: "Теплица", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a59.png", task: "Раскрась картинку из подземелья!", level: 4 },
        60: { title: "Балкон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a60.png", task: "Раскрась картинку из подземелья!", level: 4 },
        61: { title: "Зал советов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a61.png", task: "Раскрась картинку из подземелья!", level: 4 },
        62: { title: "Галерея героев", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a62.png", task: "Раскрась картинку из подземелья!", level: 4 },
        63: { title: "Зал фонтанов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a63.png", task: "Раскрась картинку из подземелья!", level: 4 },
        64: { title: "Покой рыцаря", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a64.png", task: "Раскрась картинку из подземелья!", level: 4 },
        65: { title: "Кабинет мага", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a65.png", task: "Раскрась картинку из подземелья!", level: 4 },
        66: { title: "Зал иллюзий", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a66.png", task: "Раскрась картинку из подземелья!", level: 4 },
        67: { title: "Пещера отголосков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a67.png", task: "Раскрась картинку из подземелья!", level: 4 },
        68: { title: "Зал тишины", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a68.png", task: "Раскрась картинку из подземелья!", level: 4 },
        69: { title: "Комната с ловушками", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a69.png", task: "Раскрась картинку из подземелья!", level: 4 },
        70: { title: "Зал шипов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a70.png", task: "Раскрась картинку из подземелья!", level: 4 },
        71: { title: "Гнездо змей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a71.png", task: "Раскрась картинку из подземелья!", level: 4 },
        72: { title: "Зал скорпионов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a72.png", task: "Раскрась картинку из подземелья!", level: 4 },
        73: { title: "Паучий трон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a73.png", task: "Раскрась картинку из подземелья!", level: 4 },
        74: { title: "Кокон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a74.png", task: "Раскрась картинку из подземелья!", level: 4 },
        75: { title: "Зал муравьёв", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a75.png", task: "Раскрась картинку из подземелья!", level: 4 },
        76: { title: "Улей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a76.png", task: "Раскрась картинку из подземелья!", level: 4 },
        77: { title: "Зал жуков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a77.png", task: "Раскрась картинку из подземелья!", level: 4 },
        78: { title: "Термитник", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a78.png", task: "Раскрась картинку из подземелья!", level: 4 },
        79: { title: "Зал богомолов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a79.png", task: "Раскрась картинку из подземелья!", level: 4 },
        80: { title: "Колодец скорпионов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a80.png", task: "Раскрась картинку из подземелья!", level: 4 },
        81: { title: "Зал саранчи", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a81.png", task: "Раскрась картинку из подземелья!", level: 4 },
        82: { title: "Гнездо шершней", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a82.png", task: "Раскрась картинку из подземелья!", level: 4 },
        83: { title: "Зал светлячков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a83.png", task: "Раскрась картинку из подземелья!", level: 4 },
        84: { title: "Пещера мотыльков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a84.png", task: "Раскрась картинку из подземелья!", level: 4 },
        85: { title: "Зал бабочек", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a85.png", task: "Раскрась картинку из подземелья!", level: 4 },
        86: { title: "Гусеничный зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a86.png", task: "Раскрась картинку из подземелья!", level: 4 },
        87: { title: "Коконовая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a87.png", task: "Раскрась картинку из подземелья!", level: 4 },
        88: { title: "Зал цикад", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a88.png", task: "Раскрась картинку из подземелья!", level: 4 },
        89: { title: "Пещера кузнечиков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a89.png", task: "Раскрась картинку из подземелья!", level: 4 },
        90: { title: "Зал тараканов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a90.png", task: "Раскрась картинку из подземелья!", level: 4 },
        91: { title: "Гнездо сороконожек", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a91.png", task: "Раскрась картинку из подземелья!", level: 4 },
        92: { title: "Зал мокриц", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a92.png", task: "Раскрась картинку из подземелья!", level: 4 },
        93: { title: "Пещера улиток", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a93.png", task: "Раскрась картинку из подземелья!", level: 4 },
        94: { title: "Зал слизней", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a94.png", task: "Раскрась картинку из подземелья!", level: 4 },
        95: { title: "Червивый зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a95.png", task: "Раскрась картинку из подземелья!", level: 4 },
        96: { title: "Зал пиявок", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a96.png", task: "Раскрась картинку из подземелья!", level: 4 },
        97: { title: "Пещера клещей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a97.png", task: "Раскрась картинку из подземелья!", level: 4 },
        98: { title: "Зал комаров", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a98.png", task: "Раскрась картинку из подземелья!", level: 4 },
        99: { title: "Гнездо москитов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a99.png", task: "Раскрась картинку из подземелья!", level: 4 },
        100: { title: "Зал мух", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a100.png", task: "Раскрась картинку из подземелья!", level: 4 },
        
        // УРОВЕНЬ 5: МИНИ-БОССЫ 101-106
        101: { 
    title: "Хранитель подземелья", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a101.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с боссом",
        "Раскрась картинку с эпической битвой",
        "Раскрась картинку со скрытым убийством",
        "Раскрась картинку с теневой ловушкой"
    ]
},
102: { 
    title: "Теневой дракон", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a102.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с драконом",
        "Раскрась картинку с тенью",
        "Раскрась картинку с отравленным клинком",
        "Раскрась картинку с ночной засадой"
    ]
},
103: { 
    title: "Король гоблинов", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a103.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с гоблином",
        "Раскрась картинку с короной",
        "Раскрась картинку с бесшумным убийством",
        "Раскрась картинку с подземным лагерем"
    ]
},
104: { 
    title: "Дух тьмы", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a104.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с духом",
        "Раскрась картинку с тьмой",
        "Раскрась картинку с призрачным клинком",
        "Раскрась картинку с побегом из тени"
    ]
},
105: { 
    title: "Маг хаоса", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a105.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с магом",
        "Раскрась картинку с хаосом",
        "Раскрась картинку с метательным ножом",
        "Раскрась картинку с башней мага"
    ]
},
106: { 
    title: "Железный голем", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a106.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с големом",
        "Раскрась картинку с металлом",
        "Раскрась картинку с взрывной ловушкой",
        "Раскрась картинку с кузницей"
    ]
},
        
        // УРОВЕНЬ 6: 107-112
        107: { title: "Возрождение", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a107.png", task: "Раскрась картинку с возрождением или светом!", level: 6 },
        108: { title: "Новая сила", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a108.png", task: "Раскрась картинку с силой или энергией!", level: 6 },
        109: { title: "Древний артефакт", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a109.png", task: "Раскрась картинку с артефактом или реликвией!", level: 6 },
        110: { title: "Союзники", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a110.png", task: "Раскрась картинку с союзниками или командой!", level: 6 },
        111: { title: "Карта сокровищ", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a111.png", task: "Раскрась картинку с картой или сокровищем!", level: 6 },
        112: { title: "Портал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a112.png", task: "Раскрась картинку с порталом или вратами!", level: 6 },
        
        // УРОВЕНЬ 7: 113-136
        113: { title: "Солнечный алтарь", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a113.png", task: "Раскрась космическую картинку!", level: 7 },
        114: { title: "Зал затмения", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a114.png", task: "Раскрась космическую картинку!", level: 7 },
        115: { title: "Комета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a115.png", task: "Раскрась космическую картинку!", level: 7 },
        116: { title: "Метеоритный зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a116.png", task: "Раскрась космическую картинку!", level: 7 },
        117: { title: "Галактика", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a117.png", task: "Раскрась космическую картинку!", level: 7 },
        118: { title: "Чёрная дыра", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a118.png", task: "Раскрась космическую картинку!", level: 7 },
        119: { title: "Туманность", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a119.png", task: "Раскрась космическую картинку!", level: 7 },
        120: { title: "Созвездие рыцаря", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a120.png", task: "Раскрась космическую картинку!", level: 7 },
        121: { title: "Планетария", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a121.png", task: "Раскрась космическую картинку!", level: 7 },
        122: { title: "Астероидное поле", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a122.png", task: "Раскрась космическую картинку!", level: 7 },
        123: { title: "Орбитальная станция", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a123.png", task: "Раскрась космическую картинку!", level: 7 },
        124: { title: "Космический корабль", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a124.png", task: "Раскрась космическую картинку!", level: 7 },
        125: { title: "Инопланетный лес", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a125.png", task: "Раскрась космическую картинку!", level: 7 },
        126: { title: "Кристальная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a126.png", task: "Раскрась космическую картинку!", level: 7 },
        127: { title: "Огненная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a127.png", task: "Раскрась космическую картинку!", level: 7 },
        128: { title: "Водная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a128.png", task: "Раскрась космическую картинку!", level: 7 },
        129: { title: "Воздушная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a129.png", task: "Раскрась космическую картинку!", level: 7 },
        130: { title: "Земная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a130.png", task: "Раскрась космическую картинку!", level: 7 },
        131: { title: "Пустынная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a131.png", task: "Раскрась космическую картинку!", level: 7 },
        132: { title: "Ледяная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a132.png", task: "Раскрась космическую картинку!", level: 7 },
        133: { title: "Тропическая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a133.png", task: "Раскрась космическую картинку!", level: 7 },
        134: { title: "Вулканическая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a134.png", task: "Раскрась космическую картинку!", level: 7 },
        135: { title: "Океаническая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a135.png", task: "Раскрась космическую картинку!", level: 7 },
        136: { title: "Газовая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a136.png", task: "Раскрась космическую картинку!", level: 7 },
        
        // УРОВЕНЬ 8: 137-184
        137: { title: "Кольцевая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a137.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        138: { title: "Двойная звезда", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a138.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        139: { title: "Нейтронная звезда", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a139.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        140: { title: "Сверхновая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a140.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        141: { title: "Квазар", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a141.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        142: { title: "Пульсар", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a142.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        143: { title: "Магнитар", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a143.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        144: { title: "Червовая нора", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a144.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        145: { title: "Тёмная материя", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a145.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        146: { title: "Тёмная энергия", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a146.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        147: { title: "Реликтовое излучение", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a147.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        148: { title: "Большой взрыв", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a148.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        149: { title: "Башня молний", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a149.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        150: { title: "Пещера времени", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a150.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        151: { title: "Зал забвения", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a151.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        152: { title: "Мост судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a152.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        153: { title: "Колодец желаний", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a153.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        154: { title: "Тронный зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a154.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        155: { title: "Кристалл души", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a155.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        156: { title: "Демон Бездны", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a156.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        157: { title: "Повелитель хаоса", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a157.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        158: { title: "Хранитель времени", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a158.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        159: { title: "Страж реальности", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a159.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        160: { title: "Испепелитель", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a160.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        161: { title: "Ледяной великан", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a161.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        162: { title: "Каменный голем", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a162.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        163: { title: "Властелин бурь", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a163.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        164: { title: "Повелитель морей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a164.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        165: { title: "Король небес", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a165.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        166: { title: "Бог войны", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a166.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        167: { title: "Владыка смерти", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a167.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        168: { title: "Архидемон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a168.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        169: { title: "Князь тьмы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a169.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        170: { title: "Верховный лич", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a170.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        171: { title: "Дракон апокалипсиса", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a171.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        172: { title: "Титан судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a172.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        173: { title: "Первородный хаос", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a173.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        174: { title: "Сердце вселенной", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a174.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        175: { title: "Око судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a175.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        176: { title: "Книга времён", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a176.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        177: { title: "Ключ бытия", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a177.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        178: { title: "Трон творца", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a178.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        179: { title: "Абсолютный ноль", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a179.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        180: { title: "Бесконечность", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a180.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        181: { title: "Бездна", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a181.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        182: { title: "Реликт предтеч", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a182.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        183: { title: "Звёздные врата", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a183.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        184: { title: "Грань миров", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a184.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        
        // УРОВЕНЬ 9: 185-202
        185: { title: "Тропа героев", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a185.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        186: { title: "Зал легенд", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a186.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        187: { title: "Огненная бездна", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a187.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        188: { title: "Ледяная пропасть", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a188.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        189: { title: "Зал доблести", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a189.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        190: { title: "Храм света", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a190.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        191: { title: "Пещера отражений", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a191.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        192: { title: "Мост надежды", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a192.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        193: { title: "Зал мудрости", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a193.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        194: { title: "Башня судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a194.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        195: { title: "Портал героев", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a195.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        196: { title: "Зал силы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a196.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        197: { title: "Трон победителя", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a197.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        198: { title: "Зал чести", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a198.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        199: { title: "Арена судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a199.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        200: { title: "Врата победы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a200.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        201: { title: "Зал славы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a201.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        202: { title: "Преддверие финала", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a202.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        
        // УРОВЕНЬ 10: ФИНАЛЬНЫЕ БОССЫ 203-208
       203: { 
    title: "Демон Бездны", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a203.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с демоном",
        "Раскрась картинку с бездной",
        "Раскрась картинку с адским ядом",
        "Раскрась картинку с последним ударом"
    ]
},
204: { 
    title: "Архилич", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a204.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с личом",
        "Раскрась картинку с некромантом",
        "Раскрась картинку с уничтожением филактерии",
        "Раскрась картинку со склепом"
    ]
},
205: { 
    title: "Древний дракон", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a205.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с древним драконом",
        "Раскрась картинку с драконьим огнём",
        "Раскрась картинку со смертельным ядом",
        "Раскрась картинку с драконьим логовом"
    ]
},
206: { 
    title: "Король демонов", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a206.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с королём демонов",
        "Раскрась картинку с троном тьмы",
        "Раскрась картинку с убийством короля",
        "Раскрась картинку с теневым побегом"
    ]
},
207: { 
    title: "Титан бездны", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a207.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с титаном",
        "Раскрась картинку с разрушением",
        "Раскрась картинку с гигантской ловушкой",
        "Раскрась картинку с падением титана"
    ]
},
208: { 
    title: "Властелин тьмы", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/a208.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с властелином тьмы",
        "Раскрась картинку с армией тьмы",
        "Раскрась картинку с последней тенью",
        "Раскрась картинку с рассветом после битвы"
    ]
}
    }
};

// ==========================================
// ПЕРЕХОДЫ ДЛЯ АССАСИНА (ASSASSIN)
// ==========================================

var DND_TRANSITIONS_ASSASSIN = {};

// 0 → 1-3 (1-2→1, 3-4→2, 5-6→3)
DND_TRANSITIONS_ASSASSIN[0] = {1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3};

// 1-3 → 4-12
DND_TRANSITIONS_ASSASSIN[1] = {1: 4, 2: 4, 3: 5, 4: 5, 5: 6, 6: 6};
DND_TRANSITIONS_ASSASSIN[2] = {1: 7, 2: 7, 3: 8, 4: 8, 5: 9, 6: 9};
DND_TRANSITIONS_ASSASSIN[3] = {1: 10, 2: 10, 3: 11, 4: 11, 5: 12, 6: 12};

// 4-12 → 13-39 (по 3 карты)
(function() {
    var c = 13;
    for (var i = 4; i <= 12; i++) {
        DND_TRANSITIONS_ASSASSIN[i] = {};
        DND_TRANSITIONS_ASSASSIN[i][1] = c; DND_TRANSITIONS_ASSASSIN[i][2] = c;
        DND_TRANSITIONS_ASSASSIN[i][3] = c+1; DND_TRANSITIONS_ASSASSIN[i][4] = c+1;
        DND_TRANSITIONS_ASSASSIN[i][5] = c+2; DND_TRANSITIONS_ASSASSIN[i][6] = c+2;
        c += 3;
    }
})();

// 13-39 → 40-100 (по 3 карты)
(function() {
    var c = 40;
    for (var i = 13; i <= 39; i++) {
        DND_TRANSITIONS_ASSASSIN[i] = {};
        DND_TRANSITIONS_ASSASSIN[i][1] = c; DND_TRANSITIONS_ASSASSIN[i][2] = c;
        DND_TRANSITIONS_ASSASSIN[i][3] = c+1; DND_TRANSITIONS_ASSASSIN[i][4] = c+1;
        DND_TRANSITIONS_ASSASSIN[i][5] = c+2; DND_TRANSITIONS_ASSASSIN[i][6] = c+2;
        c += 3;
    }
})();

// 40-100 → 101-106 (прямая зависимость)
for (var i = 40; i <= 100; i++) {
    DND_TRANSITIONS_ASSASSIN[i] = {1: 101, 2: 102, 3: 103, 4: 104, 5: 105, 6: 106};
}

// 101-106 → 107-112 (прямая зависимость)
for (var i = 101; i <= 106; i++) {
    DND_TRANSITIONS_ASSASSIN[i] = {1: 107, 2: 108, 3: 109, 4: 110, 5: 111, 6: 112};
}

// 107-112 → 113-136 (по 4 карты, только ключи 1-6)
(function() {
    var c = 113;
    for (var i = 107; i <= 112; i++) {
        DND_TRANSITIONS_ASSASSIN[i] = {};
        DND_TRANSITIONS_ASSASSIN[i][1] = c;   DND_TRANSITIONS_ASSASSIN[i][2] = c;
        DND_TRANSITIONS_ASSASSIN[i][3] = c+1; DND_TRANSITIONS_ASSASSIN[i][4] = c+1;
        DND_TRANSITIONS_ASSASSIN[i][5] = c+2; DND_TRANSITIONS_ASSASSIN[i][6] = c+3;
        c += 4;
    }
})();

// 113-136 → 137-184 (по 2 карты, с ограничением)
(function() {
    var c = 137;
    for (var i = 113; i <= 136; i++) {
        DND_TRANSITIONS_ASSASSIN[i] = {};
        DND_TRANSITIONS_ASSASSIN[i][1] = Math.min(c, 184);
        DND_TRANSITIONS_ASSASSIN[i][2] = Math.min(c, 184);
        DND_TRANSITIONS_ASSASSIN[i][3] = Math.min(c+1, 184);
        DND_TRANSITIONS_ASSASSIN[i][4] = Math.min(c+1, 184);
        DND_TRANSITIONS_ASSASSIN[i][5] = Math.min(c+1, 184);
        DND_TRANSITIONS_ASSASSIN[i][6] = Math.min(c+1, 184);
        c += 2;
    }
})();

// 137-184 → 185-202
for (var i = 137; i <= 184; i++) {
    DND_TRANSITIONS_ASSASSIN[i] = {1: 185, 2: 186, 3: 187, 4: 188, 5: 189, 6: 190};
}

// 185-202 → 203-208
for (var i = 185; i <= 202; i++) {
    DND_TRANSITIONS_ASSASSIN[i] = {1: 203, 2: 204, 3: 205, 4: 206, 5: 207, 6: 208};
}

// 203-208 — конец
for (var i = 203; i <= 208; i++) {
    DND_TRANSITIONS_ASSASSIN[i] = {};
}
        // ==========================================
// D&D КАРТЫ И ПЕРЕХОДЫ - БАРД
// ==========================================

var DND_CARDS_BARD = {
    bard: {
        // СТАРТ (0)
        0: {
            title: "Бард",
            image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b0.png",
            isStart: true,
            level: 0
        },
        
        // УРОВЕНЬ 1: 1-3
        1: { title: "Таверна у дороги", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b1.png", task: "Раскрась картинку с таверной или музыкой!", level: 1 },
        2: { title: "Струны вдохновения", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b2.png", task: "Раскрась картинку с инструментом или песней!", level: 1 },
        3: { title: "Королевский пир", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b3.png", task: "Раскрась картинку с пиром или выступлением!", level: 1 },
        
        // УРОВЕНЬ 2: 4-12
        4: { title: "Лесная чаща", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b4.png", task: "Раскрась картинку с лесом или диким животным!", level: 2 },
        5: { title: "Разбойничий лагерь", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b5.png", task: "Раскрась картинку с разбойниками или схваткой!", level: 2 },
        6: { title: "Заброшенная башня", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b6.png", task: "Раскрась картинку с башней или руинами!", level: 2 },
        7: { title: "Горный перевал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b7.png", task: "Раскрась картинку с горами или перевалом!", level: 2 },
        8: { title: "Пещера гоблинов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b8.png", task: "Раскрась картинку с пещерой или гоблинами!", level: 2 },
        9: { title: "Орлиное гнездо", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b9.png", task: "Раскрась картинку с орлом или сокровищем!", level: 2 },
        10: { title: "Старый мост", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b10.png", task: "Раскрась картинку с мостом или рекой!", level: 2 },
        11: { title: "Деревня у реки", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b11.png", task: "Раскрась картинку с деревней или жителями!", level: 2 },
        12: { title: "Водопад", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b12.png", task: "Раскрась картинку с водопадом или тайным проходом!", level: 2 },
        
        // УРОВЕНЬ 3: 13-39
        13: { title: "Волчья стая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b13.png", task: "Раскрась картинку с волком или стаей!", level: 3 },
        14: { title: "Древний дуб", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b14.png", task: "Раскрась картинку с деревом или амулетом!", level: 3 },
        15: { title: "Лесной дух", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b15.png", task: "Раскрась картинку с духом или магией!", level: 3 },
        16: { title: "Главарь разбойников", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b16.png", task: "Раскрась картинку с главарём или переговорами!", level: 3 },
        17: { title: "Спасение каравана", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b17.png", task: "Раскрась картинку с караваном или зельем!", level: 3 },
        18: { title: "Разбойничий тайник", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b18.png", task: "Раскрась картинку с сокровищами или ключом!", level: 3 },
        19: { title: "Руны на стенах", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b19.png", task: "Раскрась картинку с рунами или книгой!", level: 3 },
        20: { title: "Призрак рыцаря", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b20.png", task: "Раскрась картинку с призраком или магическим мечом!", level: 3 },
        21: { title: "Подземный ход", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b21.png", task: "Раскрась картинку с подземельем или лестницей!", level: 3 },
        22: { title: "Каменный мост", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b22.png", task: "Раскрась картинку с мостом или рекой!", level: 3 },
        23: { title: "Башня призраков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b23.png", task: "Раскрась картинку с башней или призраком!", level: 3 },
        24: { title: "Лабиринт", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b24.png", task: "Раскрась картинку с лабиринтом или стеной!", level: 3 },
        25: { title: "Гнездо виверны", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b25.png", task: "Раскрась картинку с виверной или гнездом!", level: 3 },
        26: { title: "Проклятый фонтан", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b26.png", task: "Раскрась картинку с фонтаном или водой!", level: 3 },
        27: { title: "Комната пыток", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b27.png", task: "Раскрась картинку с цепями или инструментами!", level: 3 },
        28: { title: "Винный погреб", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b28.png", task: "Раскрась картинку с бочками или бутылками!", level: 3 },
        29: { title: "Королевская усыпальница", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b29.png", task: "Раскрась картинку с саркофагом или короной!", level: 3 },
        30: { title: "Трон призрачного короля", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b30.png", task: "Раскрась картинку с троном или призраком!", level: 3 },
        31: { title: "Зал фресок", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b31.png", task: "Раскрась картинку с фресками или живописью!", level: 3 },
        32: { title: "Келья монаха", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b32.png", task: "Раскрась картинку с монахом или свечой!", level: 3 },
        33: { title: "Гобеленовый зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b33.png", task: "Раскрась картинку с гобеленом или тканью!", level: 3 },
        34: { title: "Склад оружия", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b34.png", task: "Раскрась картинку с оружием или складом!", level: 3 },
        35: { title: "Кузня гномов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b35.png", task: "Раскрась картинку с кузницей или гномом!", level: 3 },
        36: { title: "Шахта", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b36.png", task: "Раскрась картинку с шахтой или киркой!", level: 3 },
        37: { title: "Грибная пещера", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b37.png", task: "Раскрась картинку с грибами или пещерой!", level: 3 },
        38: { title: "Логово тролля", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b38.png", task: "Раскрась картинку с троллем или дубиной!", level: 3 },
        39: { title: "Подземная река", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b39.png", task: "Раскрась картинку с рекой или лодкой!", level: 3 },
        
        // УРОВЕНЬ 4: 40-100
        40: { title: "Сталактитовая пещера", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b40.png", task: "Раскрась картинку из подземелья!", level: 4 },
        41: { title: "Костяной зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b41.png", task: "Раскрась картинку из подземелья!", level: 4 },
        42: { title: "Алтарь жертвоприношений", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b42.png", task: "Раскрась картинку из подземелья!", level: 4 },
        43: { title: "Тюрьма душ", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b43.png", task: "Раскрась картинку из подземелья!", level: 4 },
        44: { title: "Портал в бездну", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b44.png", task: "Раскрась картинку из подземелья!", level: 4 },
        45: { title: "Комната с рычагами", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b45.png", task: "Раскрась картинку из подземелья!", level: 4 },
        46: { title: "Библиотека", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b46.png", task: "Раскрась картинку из подземелья!", level: 4 },
        47: { title: "Зал карт", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b47.png", task: "Раскрась картинку из подземелья!", level: 4 },
        48: { title: "Оружейная", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b48.png", task: "Раскрась картинку из подземелья!", level: 4 },
        49: { title: "Смотровая башня", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b49.png", task: "Раскрась картинку из подземелья!", level: 4 },
        50: { title: "Казармы стражи", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b50.png", task: "Раскрась картинку из подземелья!", level: 4 },
        51: { title: "Колодец", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b51.png", task: "Раскрась картинку из подземелья!", level: 4 },
        52: { title: "Подземный рынок", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b52.png", task: "Раскрась картинку из подземелья!", level: 4 },
        53: { title: "Таверна", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b53.png", task: "Раскрась картинку из подземелья!", level: 4 },
        54: { title: "Конюшня", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b54.png", task: "Раскрась картинку из подземелья!", level: 4 },
        55: { title: "Кладовая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b55.png", task: "Раскрась картинку из подземелья!", level: 4 },
        56: { title: "Кузнечный цех", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b56.png", task: "Раскрась картинку из подземелья!", level: 4 },
        57: { title: "Лаборатория алхимика", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b57.png", task: "Раскрась картинку из подземелья!", level: 4 },
        58: { title: "Обсерватория", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b58.png", task: "Раскрась картинку из подземелья!", level: 4 },
        59: { title: "Теплица", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b59.png", task: "Раскрась картинку из подземелья!", level: 4 },
        60: { title: "Балкон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b60.png", task: "Раскрась картинку из подземелья!", level: 4 },
        61: { title: "Зал советов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b61.png", task: "Раскрась картинку из подземелья!", level: 4 },
        62: { title: "Галерея героев", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b62.png", task: "Раскрась картинку из подземелья!", level: 4 },
        63: { title: "Зал фонтанов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b63.png", task: "Раскрась картинку из подземелья!", level: 4 },
        64: { title: "Покой рыцаря", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b64.png", task: "Раскрась картинку из подземелья!", level: 4 },
        65: { title: "Кабинет мага", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b65.png", task: "Раскрась картинку из подземелья!", level: 4 },
        66: { title: "Зал иллюзий", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b66.png", task: "Раскрась картинку из подземелья!", level: 4 },
        67: { title: "Пещера отголосков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b67.png", task: "Раскрась картинку из подземелья!", level: 4 },
        68: { title: "Зал тишины", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b68.png", task: "Раскрась картинку из подземелья!", level: 4 },
        69: { title: "Комната с ловушками", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b69.png", task: "Раскрась картинку из подземелья!", level: 4 },
        70: { title: "Зал шипов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b70.png", task: "Раскрась картинку из подземелья!", level: 4 },
        71: { title: "Гнездо змей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b71.png", task: "Раскрась картинку из подземелья!", level: 4 },
        72: { title: "Зал скорпионов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b72.png", task: "Раскрась картинку из подземелья!", level: 4 },
        73: { title: "Паучий трон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b73.png", task: "Раскрась картинку из подземелья!", level: 4 },
        74: { title: "Кокон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b74.png", task: "Раскрась картинку из подземелья!", level: 4 },
        75: { title: "Зал муравьёв", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b75.png", task: "Раскрась картинку из подземелья!", level: 4 },
        76: { title: "Улей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b76.png", task: "Раскрась картинку из подземелья!", level: 4 },
        77: { title: "Зал жуков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b77.png", task: "Раскрась картинку из подземелья!", level: 4 },
        78: { title: "Термитник", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b78.png", task: "Раскрась картинку из подземелья!", level: 4 },
        79: { title: "Зал богомолов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b79.png", task: "Раскрась картинку из подземелья!", level: 4 },
        80: { title: "Колодец скорпионов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b80.png", task: "Раскрась картинку из подземелья!", level: 4 },
        81: { title: "Зал саранчи", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b81.png", task: "Раскрась картинку из подземелья!", level: 4 },
        82: { title: "Гнездо шершней", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b82.png", task: "Раскрась картинку из подземелья!", level: 4 },
        83: { title: "Зал светлячков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b83.png", task: "Раскрась картинку из подземелья!", level: 4 },
        84: { title: "Пещера мотыльков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b84.png", task: "Раскрась картинку из подземелья!", level: 4 },
        85: { title: "Зал бабочек", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b85.png", task: "Раскрась картинку из подземелья!", level: 4 },
        86: { title: "Гусеничный зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b86.png", task: "Раскрась картинку из подземелья!", level: 4 },
        87: { title: "Коконовая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b87.png", task: "Раскрась картинку из подземелья!", level: 4 },
        88: { title: "Зал цикад", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b88.png", task: "Раскрась картинку из подземелья!", level: 4 },
        89: { title: "Пещера кузнечиков", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b89.png", task: "Раскрась картинку из подземелья!", level: 4 },
        90: { title: "Зал тараканов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b90.png", task: "Раскрась картинку из подземелья!", level: 4 },
        91: { title: "Гнездо сороконожек", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b91.png", task: "Раскрась картинку из подземелья!", level: 4 },
        92: { title: "Зал мокриц", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b92.png", task: "Раскрась картинку из подземелья!", level: 4 },
        93: { title: "Пещера улиток", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b93.png", task: "Раскрась картинку из подземелья!", level: 4 },
        94: { title: "Зал слизней", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b94.png", task: "Раскрась картинку из подземелья!", level: 4 },
        95: { title: "Червивый зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b95.png", task: "Раскрась картинку из подземелья!", level: 4 },
        96: { title: "Зал пиявок", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b96.png", task: "Раскрась картинку из подземелья!", level: 4 },
        97: { title: "Пещера клещей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b97.png", task: "Раскрась картинку из подземелья!", level: 4 },
        98: { title: "Зал комаров", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b98.png", task: "Раскрась картинку из подземелья!", level: 4 },
        99: { title: "Гнездо москитов", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b99.png", task: "Раскрась картинку из подземелья!", level: 4 },
        100: { title: "Зал мух", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b100.png", task: "Раскрась картинку из подземелья!", level: 4 },
        
        // УРОВЕНЬ 5: МИНИ-БОССЫ 101-106
       101: { 
    title: "Хранитель подземелья", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b101.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с боссом",
        "Раскрась картинку с эпической битвой",
        "Раскрась картинку с вдохновляющей песней",
        "Раскрась картинку с героической балладой"
    ]
},
102: { 
    title: "Теневой дракон", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b102.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с драконом",
        "Раскрась картинку с тенью",
        "Раскрась картинку с усыпляющей мелодией",
        "Раскрась картинку с легендой о драконе"
    ]
},
103: { 
    title: "Король гоблинов", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b103.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с гоблином",
        "Раскрась картинку с короной",
        "Раскрась картинку с ослепительным выступлением",
        "Раскрась картинку с таверной"
    ]
},
104: { 
    title: "Дух тьмы", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b104.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с духом",
        "Раскрась картинку с тьмой",
        "Раскрась картинку с успокаивающей арфой",
        "Раскрась картинку с изгнанием духа"
    ]
},
105: { 
    title: "Маг хаоса", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b105.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с магом",
        "Раскрась картинку с хаосом",
        "Раскрась картинку с контр-мелодией",
        "Раскрась картинку с магической дуэлью"
    ]
},
106: { 
    title: "Железный голем", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b106.png", 
    level: 5,
    bossTasks: [
        "Раскрась картинку с големом",
        "Раскрась картинку с металлом",
        "Раскрась картинку с разрушительным аккордом",
        "Раскрась картинку с концертным залом"
    ]
},
        
        // УРОВЕНЬ 6: 107-112
        107: { title: "Возрождение", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b107.png", task: "Раскрась картинку с возрождением или светом!", level: 6 },
        108: { title: "Новая сила", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b108.png", task: "Раскрась картинку с силой или энергией!", level: 6 },
        109: { title: "Древний артефакт", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b109.png", task: "Раскрась картинку с артефактом или реликвией!", level: 6 },
        110: { title: "Союзники", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b110.png", task: "Раскрась картинку с союзниками или командой!", level: 6 },
        111: { title: "Карта сокровищ", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b111.png", task: "Раскрась картинку с картой или сокровищем!", level: 6 },
        112: { title: "Портал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b112.png", task: "Раскрась картинку с порталом или вратами!", level: 6 },
        
        // УРОВЕНЬ 7: 113-136
        113: { title: "Солнечный алтарь", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b113.png", task: "Раскрась космическую картинку!", level: 7 },
        114: { title: "Зал затмения", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b114.png", task: "Раскрась космическую картинку!", level: 7 },
        115: { title: "Комета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b115.png", task: "Раскрась космическую картинку!", level: 7 },
        116: { title: "Метеоритный зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b116.png", task: "Раскрась космическую картинку!", level: 7 },
        117: { title: "Галактика", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b117.png", task: "Раскрась космическую картинку!", level: 7 },
        118: { title: "Чёрная дыра", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b118.png", task: "Раскрась космическую картинку!", level: 7 },
        119: { title: "Туманность", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b119.png", task: "Раскрась космическую картинку!", level: 7 },
        120: { title: "Созвездие рыцаря", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b120.png", task: "Раскрась космическую картинку!", level: 7 },
        121: { title: "Планетария", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b121.png", task: "Раскрась космическую картинку!", level: 7 },
        122: { title: "Астероидное поле", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b122.png", task: "Раскрась космическую картинку!", level: 7 },
        123: { title: "Орбитальная станция", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b123.png", task: "Раскрась космическую картинку!", level: 7 },
        124: { title: "Космический корабль", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b124.png", task: "Раскрась космическую картинку!", level: 7 },
        125: { title: "Инопланетный лес", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b125.png", task: "Раскрась космическую картинку!", level: 7 },
        126: { title: "Кристальная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b126.png", task: "Раскрась космическую картинку!", level: 7 },
        127: { title: "Огненная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b127.png", task: "Раскрась космическую картинку!", level: 7 },
        128: { title: "Водная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b128.png", task: "Раскрась космическую картинку!", level: 7 },
        129: { title: "Воздушная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b129.png", task: "Раскрась космическую картинку!", level: 7 },
        130: { title: "Земная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b130.png", task: "Раскрась космическую картинку!", level: 7 },
        131: { title: "Пустынная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b131.png", task: "Раскрась космическую картинку!", level: 7 },
        132: { title: "Ледяная планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b132.png", task: "Раскрась космическую картинку!", level: 7 },
        133: { title: "Тропическая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b133.png", task: "Раскрась космическую картинку!", level: 7 },
        134: { title: "Вулканическая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b134.png", task: "Раскрась космическую картинку!", level: 7 },
        135: { title: "Океаническая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b135.png", task: "Раскрась космическую картинку!", level: 7 },
        136: { title: "Газовая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b136.png", task: "Раскрась космическую картинку!", level: 7 },
        
        // УРОВЕНЬ 8: 137-184
        137: { title: "Кольцевая планета", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b137.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        138: { title: "Двойная звезда", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b138.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        139: { title: "Нейтронная звезда", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b139.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        140: { title: "Сверхновая", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b140.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        141: { title: "Квазар", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b141.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        142: { title: "Пульсар", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b142.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        143: { title: "Магнитар", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b143.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        144: { title: "Червовая нора", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b144.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        145: { title: "Тёмная материя", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b145.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        146: { title: "Тёмная энергия", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b146.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        147: { title: "Реликтовое излучение", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b147.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        148: { title: "Большой взрыв", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b148.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        149: { title: "Башня молний", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b149.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        150: { title: "Пещера времени", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b150.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        151: { title: "Зал забвения", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b151.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        152: { title: "Мост судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b152.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        153: { title: "Колодец желаний", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b153.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        154: { title: "Тронный зал", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b154.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        155: { title: "Кристалл души", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b155.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        156: { title: "Демон Бездны", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b156.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        157: { title: "Повелитель хаоса", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b157.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        158: { title: "Хранитель времени", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b158.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        159: { title: "Страж реальности", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b159.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        160: { title: "Испепелитель", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b160.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        161: { title: "Ледяной великан", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b161.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        162: { title: "Каменный голем", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b162.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        163: { title: "Властелин бурь", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b163.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        164: { title: "Повелитель морей", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b164.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        165: { title: "Король небес", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b165.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        166: { title: "Бог войны", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b166.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        167: { title: "Владыка смерти", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b167.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        168: { title: "Архидемон", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b168.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        169: { title: "Князь тьмы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b169.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        170: { title: "Верховный лич", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b170.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        171: { title: "Дракон апокалипсиса", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b171.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        172: { title: "Титан судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b172.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        173: { title: "Первородный хаос", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b173.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        174: { title: "Сердце вселенной", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b174.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        175: { title: "Око судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b175.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        176: { title: "Книга времён", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b176.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        177: { title: "Ключ бытия", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b177.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        178: { title: "Трон творца", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b178.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        179: { title: "Абсолютный ноль", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b179.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        180: { title: "Бесконечность", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b180.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        181: { title: "Бездна", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b181.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        182: { title: "Реликт предтеч", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b182.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        183: { title: "Звёздные врата", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b183.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        184: { title: "Грань миров", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b184.png", task: "Раскрась картинку из глубин вселенной!", level: 8 },
        
        // УРОВЕНЬ 9: 185-202
        185: { title: "Тропа героев", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b185.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        186: { title: "Зал легенд", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b186.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        187: { title: "Огненная бездна", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b187.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        188: { title: "Ледяная пропасть", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b188.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        189: { title: "Зал доблести", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b189.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        190: { title: "Храм света", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b190.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        191: { title: "Пещера отражений", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b191.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        192: { title: "Мост надежды", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b192.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        193: { title: "Зал мудрости", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b193.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        194: { title: "Башня судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b194.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        195: { title: "Портал героев", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b195.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        196: { title: "Зал силы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b196.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        197: { title: "Трон победителя", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b197.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        198: { title: "Зал чести", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b198.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        199: { title: "Арена судьбы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b199.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        200: { title: "Врата победы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b200.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        201: { title: "Зал славы", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b201.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        202: { title: "Преддверие финала", image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b202.png", task: "Раскрась картинку на пути к финалу!", level: 9 },
        
        // УРОВЕНЬ 10: ФИНАЛЬНЫЕ БОССЫ 203-208
       203: { 
    title: "Демон Бездны", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b203.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с демоном",
        "Раскрась картинку с бездной",
        "Раскрась картинку с симфонией света",
        "Раскрась картинку с легендарным финалом"
    ]
},
204: { 
    title: "Архилич", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b204.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с личом",
        "Раскрась картинку с некромантом",
        "Раскрась картинку с песней жизни",
        "Раскрась картинку с древним некрополем"
    ]
},
205: { 
    title: "Древний дракон", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b205.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с древним драконом",
        "Раскрась картинку с драконьим огнём",
        "Раскрась картинку с эпической поэмой",
        "Раскрась картинку с королевским двором"
    ]
},
206: { 
    title: "Король демонов", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b206.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с королём демонов",
        "Раскрась картинку с троном тьмы",
        "Раскрась картинку с последней серенадой",
        "Раскрась картинку с падением тирана"
    ]
},
207: { 
    title: "Титан бездны", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b207.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с титаном",
        "Раскрась картинку с разрушением",
        "Раскрась картинку с гимном победы",
        "Раскрась картинку с триумфальной аркой"
    ]
},
208: { 
    title: "Властелин тьмы", 
    image: "https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/b208.png", 
    level: 10, 
    isFinal: true,
    bossTasks: [
        "Раскрась картинку с властелином тьмы",
        "Раскрась картинку с армией тьмы",
        "Раскрась картинку с последней песней",
        "Раскрась картинку с новым началом"
    ]
}
    }
};

// ==========================================
// ПЕРЕХОДЫ ДЛЯ БАРДА (BARD)
// ==========================================

var DND_TRANSITIONS_BARD = {};

// 0 → 1-3 (1-2→1, 3-4→2, 5-6→3)
DND_TRANSITIONS_BARD[0] = {1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3};

// 1-3 → 4-12
DND_TRANSITIONS_BARD[1] = {1: 4, 2: 4, 3: 5, 4: 5, 5: 6, 6: 6};
DND_TRANSITIONS_BARD[2] = {1: 7, 2: 7, 3: 8, 4: 8, 5: 9, 6: 9};
DND_TRANSITIONS_BARD[3] = {1: 10, 2: 10, 3: 11, 4: 11, 5: 12, 6: 12};

// 4-12 → 13-39 (по 3 карты)
(function() {
    var c = 13;
    for (var i = 4; i <= 12; i++) {
        DND_TRANSITIONS_BARD[i] = {};
        DND_TRANSITIONS_BARD[i][1] = c; DND_TRANSITIONS_BARD[i][2] = c;
        DND_TRANSITIONS_BARD[i][3] = c+1; DND_TRANSITIONS_BARD[i][4] = c+1;
        DND_TRANSITIONS_BARD[i][5] = c+2; DND_TRANSITIONS_BARD[i][6] = c+2;
        c += 3;
    }
})();

// 13-39 → 40-100 (по 3 карты)
(function() {
    var c = 40;
    for (var i = 13; i <= 39; i++) {
        DND_TRANSITIONS_BARD[i] = {};
        DND_TRANSITIONS_BARD[i][1] = c; DND_TRANSITIONS_BARD[i][2] = c;
        DND_TRANSITIONS_BARD[i][3] = c+1; DND_TRANSITIONS_BARD[i][4] = c+1;
        DND_TRANSITIONS_BARD[i][5] = c+2; DND_TRANSITIONS_BARD[i][6] = c+2;
        c += 3;
    }
})();

// 40-100 → 101-106 (прямая зависимость)
for (var i = 40; i <= 100; i++) {
    DND_TRANSITIONS_BARD[i] = {1: 101, 2: 102, 3: 103, 4: 104, 5: 105, 6: 106};
}

// 101-106 → 107-112 (прямая зависимость)
for (var i = 101; i <= 106; i++) {
    DND_TRANSITIONS_BARD[i] = {1: 107, 2: 108, 3: 109, 4: 110, 5: 111, 6: 112};
}

// 107-112 → 113-136 (по 4 карты, только ключи 1-6)
(function() {
    var c = 113;
    for (var i = 107; i <= 112; i++) {
        DND_TRANSITIONS_BARD[i] = {};
        DND_TRANSITIONS_BARD[i][1] = c;   DND_TRANSITIONS_BARD[i][2] = c;
        DND_TRANSITIONS_BARD[i][3] = c+1; DND_TRANSITIONS_BARD[i][4] = c+1;
        DND_TRANSITIONS_BARD[i][5] = c+2; DND_TRANSITIONS_BARD[i][6] = c+3;
        c += 4;
    }
})();

// 113-136 → 137-184 (по 2 карты, с ограничением)
(function() {
    var c = 137;
    for (var i = 113; i <= 136; i++) {
        DND_TRANSITIONS_BARD[i] = {};
        DND_TRANSITIONS_BARD[i][1] = Math.min(c, 184);
        DND_TRANSITIONS_BARD[i][2] = Math.min(c, 184);
        DND_TRANSITIONS_BARD[i][3] = Math.min(c+1, 184);
        DND_TRANSITIONS_BARD[i][4] = Math.min(c+1, 184);
        DND_TRANSITIONS_BARD[i][5] = Math.min(c+1, 184);
        DND_TRANSITIONS_BARD[i][6] = Math.min(c+1, 184);
        c += 2;
    }
})();

// 137-184 → 185-202
for (var i = 137; i <= 184; i++) {
    DND_TRANSITIONS_BARD[i] = {1: 185, 2: 186, 3: 187, 4: 188, 5: 189, 6: 190};
}

// 185-202 → 203-208
for (var i = 185; i <= 202; i++) {
    DND_TRANSITIONS_BARD[i] = {1: 203, 2: 204, 3: 205, 4: 206, 5: 207, 6: 208};
}

// 203-208 — конец
for (var i = 203; i <= 208; i++) {
    DND_TRANSITIONS_BARD[i] = {};
}
var teamPollingInterval = null;
var approvalPollingInterval = null;
var bossUpdateInterval = null;
var currentRenderCardNumber = null;
var currentBossLevel = 'mini'; 
      
// ==========================================
// D&D ПЕРЕМЕННЫЕ
// ==========================================
var bossUpdateInterval = null;
var dndMode = null;
var dndCharacter = null;
var dndCardHistory = [];
var dndApproved = false;
var dndIsRolling = false;
var dndSkipUsed = false; 
var pendingSkipCard = null;

       function getBossWorkRequired() {
    return dndMode === 'team' ? 4 : 2; // количество заданий
}
        function getBossPointsPerTask() {
    return 5; // очков за задание
}
        function getBossTotalPoints() {
    return getBossWorkRequired() * getBossPointsPerTask(); // 10 или 20
}
// ==========================================
// НАВИГАЦИЯ
// ==========================================

function toggleDnDEvent() {
    var content = document.getElementById('dndEventContent');
    var arrow = document.getElementById('dndEventArrow');
    if (content.style.display === 'block') {
        content.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    } else {
        content.style.display = 'block';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        checkDndPaymentStatus();
        // Всегда проверяем активные игры при открытии
        fetch(SERVER_URL + '/api/dnd/payment_status?user_id=' + userId)
            .then(r => r.json())
            .then(function(data) {
                if (data.is_paid) {
                    autoRestoreDndGame();
                }
            });
    }
}

function checkDndPaymentStatus() {
    fetch(SERVER_URL + '/api/dnd/payment_status?user_id=' + userId)
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok' && data.is_paid === true) {
                document.getElementById('dndPaySection').style.display = 'none';
                document.getElementById('dndMainMenu').style.display = 'block';
                document.getElementById('dndLobby').style.display = 'none';
                document.getElementById('dndGame').style.display = 'none';
                document.getElementById('dndSoloGame').style.display = 'none';
            } else {
                document.getElementById('dndPaySection').style.display = 'block';
                document.getElementById('dndMainMenu').style.display = 'none';
                document.getElementById('dndLobby').style.display = 'none';
                document.getElementById('dndGame').style.display = 'none';
                document.getElementById('dndSoloGame').style.display = 'none';
                
                // ✅ Принудительно скрываем меню ещё раз через 100ms
                setTimeout(function() {
                    document.getElementById('dndMainMenu').style.display = 'none';
                    document.getElementById('dndLobby').style.display = 'none';
                    document.getElementById('dndGame').style.display = 'none';
                    document.getElementById('dndSoloGame').style.display = 'none';
                }, 100);
            }
        });
}
function hideAllDndScreens() {
    var screens = ['dndLobby', 'dndGame', 'dndSoloGame'];
    for (var i = 0; i < screens.length; i++) {
        var el = document.getElementById(screens[i]);
        if (el) el.style.display = 'none';
    }
}

function openPaymentChat() {
    var username = 'SPB_Zakharin_Sergey';
    var message = encodeURIComponent('Здравствуйте! Хочу оплатить участие в D&D приключении (500 ₽).');
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openTelegramLink('https://t.me/' + username + '?text=' + message);
    } else {
        window.open('https://t.me/' + username + '?text=' + message, '_blank');
    }
}
var approvalPollingInterval = null;

function startApprovalPolling() {
    if (approvalPollingInterval) clearInterval(approvalPollingInterval);
    
    approvalPollingInterval = setInterval(function() {
        // Проверяем только если игра активна и задание НЕ одобрено
        if (!dndCharacter || dndApproved || dndCardHistory.length === 0) return;
        
        var currentCard = dndCardHistory[dndCardHistory.length - 1];
        if (currentCard === 0) return;
        
        fetch(SERVER_URL + '/api/dnd/get_progress?user_id=' + userId + '&character=' + dndCharacter)
            .then(r => r.json())
            .then(data => {
                if (data.status === 'ok' && data.progress) {
                    var completedCards = data.progress.completed_cards || [];
                    
                    if (completedCards.includes(currentCard) && !dndApproved) {
                        // Админ одобрил! Обновляем карту
                        dndApproved = true;
                        renderDndCard(currentCard);
                        console.log('✅ Админ одобрил карту ' + currentCard + '!');
                    }
                }
            });
    }, 5000); // проверка каждые 5 секунд
}

function stopApprovalPolling() {
    if (approvalPollingInterval) {
        clearInterval(approvalPollingInterval);
        approvalPollingInterval = null;
    }
}
function backToDndMenu() {
    // Если игра активна и не пройдена — не пускаем
    var finalBosses = [203, 204, 205, 206, 207, 208];
    var hasDefeatedBoss = finalBosses.some(function(boss) { return dndCardHistory.includes(boss); });
    
    if (dndCardHistory.length > 1 && !hasDefeatedBoss) {
        alert('⚠️ Сначала завершите приключение!');
        return;
    }
    
    // Останавливаем опрос команды
    if (teamPollingInterval) {
        clearInterval(teamPollingInterval);
        teamPollingInterval = null;
    }
    
    document.getElementById('dndMainMenu').style.display = 'block';
    hideAllDndScreens();
    dndMode = null;
    dndCharacter = null;
    dndCardHistory = [0];
    dndApproved = true;
}
function isGameInProgress() {
    return dndCardHistory.length > 1;
}

// ==========================================
// ЗАГРУЗКА/СОХРАНЕНИЕ ПРОГРЕССА
// ==========================================

function loadDndProgress() {
    if (!dndCharacter) { dndCardHistory = [0]; dndApproved = true; dndSkipUsed = false; return Promise.resolve(); }
    
    return fetch(SERVER_URL + '/api/dnd/get_progress?user_id=' + userId + '&character=' + dndCharacter)
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok' && data.progress) {
                dndCardHistory = data.progress.card_history || data.progress.completed_cards || [0];
                if (dndCardHistory.length === 0) dndCardHistory = [0];
                var lastCard = dndCardHistory[dndCardHistory.length - 1];
                var completedCards = data.progress.completed_cards || [];
                dndApproved = (lastCard === 0 || completedCards.includes(lastCard));
                dndSkipUsed = data.progress.skip_used || false;
            } else {
                dndCardHistory = [0];
                dndApproved = true;
                dndSkipUsed = false;
            }
        })
        .catch(function() {
            dndCardHistory = [0];
            dndApproved = true;
            dndSkipUsed = false;
        });
}
function saveDndProgress() {
    if (!dndCharacter || dndCardHistory.length === 0) return;
    fetch(SERVER_URL + '/api/dnd/update_progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: userId,
            character: dndCharacter,
            progress: { card_history: dndCardHistory, current_card: dndCardHistory[dndCardHistory.length - 1] || 0, timestamp: Date.now() }
        })
    }).catch(function() {});
}

// ==========================================
// ОТРИСОВКА КАРТ
// ==========================================

function getCardData(cardNumber) {
    if (dndCharacter === 'knight') return window.DND_CARDS?.knight?.[cardNumber];
    if (dndCharacter === 'mage') return window.DND_CARDS_MAGE?.mage?.[cardNumber];
    if (dndCharacter === 'archer') return window.DND_CARDS_ARCHER?.archer?.[cardNumber];
    if (dndCharacter === 'druid') return window.DND_CARDS_DRUID?.druid?.[cardNumber];
    if (dndCharacter === 'assassin') return window.DND_CARDS_ASSASSIN?.assassin?.[cardNumber];
    if (dndCharacter === 'bard') return window.DND_CARDS_BARD?.bard?.[cardNumber];
    return null;
}

function getCardContainer() {
    if (dndMode === 'solo') return document.getElementById('dndSoloCard');
    return document.getElementById('dndCard');
}

function renderDndCard(cardNumber) {
    currentRenderCardNumber = cardNumber;
    
    var card = getCardData(cardNumber);
    var container = getCardContainer();
    if (!container) return;
    if (!card) { container.innerHTML = '<p style="text-align:center;padding:20px;">❌ Карта #' + cardNumber + ' не найдена</p>'; return; }
    
    // ✅ Командная игра — блокируем кубик в конце уровней перед боссами
    if (dndMode === 'team' && dndApproved) {
        // Мини-босс: уровень 4, карты 40-100
        if (cardNumber >= 40 && cardNumber <= 100) {
            currentBossLevel = 'mini';
            showWaitingForTeam('mini');
            return;
        }
        // Финальный босс: уровень 9, карты 185-202
        if (cardNumber >= 185 && cardNumber <= 202) {
            currentBossLevel = 'final';
            showWaitingForTeam('final');
            return;
        }
    }
    
    if (card.isStart) { container.innerHTML = renderCardHTML(card, true, true); return; }
    
    var finalBosses = [203, 204, 205, 206, 207, 208];
    
    if (card.isFinal && dndApproved) {
        var winImage = dndMode === 'team' 
            ? 'https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/f2.png'
            : 'https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/f1.png';
        
        container.innerHTML = '<div class="branch-task-card"><div class="branch-header"><h3>🎉 Победа!</h3></div><div class="level-card" style="text-align:center;"><img src="' + winImage + '" style="width:100%;border-radius:12px;margin-bottom:15px;" onerror="this.style.display=\'none\'"><p style="font-size:18px;font-weight:700;color:var(--accent);">Ты победил ' + card.title + '!</p><p>Приключение пройдено!</p><p style="color:#ffd700;margin-top:10px;">🎫 Получен билет на розыгрыш призов D&D!</p><button class="task-submit-btn" onclick="resetDndProgress()" style="margin-top:15px;background:#ff9800;">📖 Завершить историю</button></div></div>';
        return;
    }
    
    container.innerHTML = renderCardHTML(card, dndApproved, false);
}


function submitBossWork(taskIndex) {
    currentBossTaskIndex = taskIndex || 0;
    var currentCard = dndCardHistory[dndCardHistory.length - 1];
    
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.onchange = function(event) {
        var files = Array.from(event.target.files);
        if (files.length === 0) return;
        window.tempPhotos = files;
        
        var formData = new FormData();
        formData.append('user', userId.toString());
        formData.append('character', dndCharacter);
        formData.append('card', currentCard.toString());
        formData.append('boss_work', 'true');
        formData.append('task_index', currentBossTaskIndex.toString());
        for (var i = 0; i < files.length; i++) formData.append('photos', files[i]);
        
        if (window.isUploading) return;
        window.isUploading = true;
        
        fetch(SERVER_URL + '/api/dnd/check_task', { method: 'POST', body: formData })
            .then(r => r.json())
            .then(function(result) {
                if (result && result.status === 'ok') {
                    renderDndCard(currentCard);
                    alert('✅ Работа отправлена! Ожидайте начисления очков.');
                }
            })
            .finally(function() { window.isUploading = false; window.tempPhotos = []; });
    };
    fileInput.click();
}
 function isTeamLeader() {
    var myTeamCard = document.getElementById('myTeamCard');
    if (!myTeamCard) return false;
    return myTeamCard.innerHTML.indexOf('Расформировать') !== -1;
}

function checkTeamBossReadiness(bossLevel) {
    currentBossLevel = bossLevel;
    
    fetch(SERVER_URL + '/api/dnd/team_boss_status?user_id=' + userId + '&boss_level=' + bossLevel)
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok') {
                if (data.all_ready) {
                    if (data.boss_assigned) {
                        dndCardHistory.push(data.boss_assigned);
                        dndApproved = false;
                        saveDndProgress();
                        renderDndCard(data.boss_assigned);
                    } else if (isTeamLeader()) {
                        showBossDiceButton(bossLevel);
                    } else {
                        showWaitingForLeader(bossLevel);
                    }
                } else {
                    showTeamReadinessStatus(data.members);
                }
            }
        });
}

function showTeamReadinessStatus(members) {
    var container = getCardContainer();
    var membersHtml = '';
    for (var i = 0; i < members.length; i++) {
        var m = members[i];
        membersHtml += '<div style="display:flex;align-items:center;gap:10px;padding:8px;margin-bottom:5px;background:var(--bg);border-radius:8px;"><span style="font-size:20px;">' + (m.ready ? '✅' : '⏳') + '</span><span style="flex:1;">' + escapeHtml(m.name) + '</span><span style="font-size:12px;color:var(--text-gray);">Карта ' + m.last_card + '</span></div>';
    }
    container.innerHTML = '<div class="branch-task-card"><div class="branch-header"><h3>⏳ Ожидание команды</h3></div><div class="level-card"><p style="margin-bottom:15px;">Все должны достичь уровня босса:</p>' + membersHtml + '<button class="task-submit-btn" onclick="checkTeamBossReadiness(\'' + currentBossLevel + '\')" style="margin-top:15px;">🔄 Проверить</button></div></div>';
}

function showWaitingForLeader(bossLevel) {
    var container = getCardContainer();
    container.innerHTML = '<div class="branch-task-card"><div class="branch-header"><h3>⏳ Ожидание лидера</h3></div><div class="level-card" style="text-align:center;"><p>Все готовы!</p><p style="color:var(--text-gray);">Лидер выбирает босса...</p><button class="task-submit-btn" onclick="checkTeamBossStatus()" style="margin-top:15px;">🔄 Проверить</button></div></div>';
}

function checkTeamBossStatus() {
    fetch(SERVER_URL + '/api/dnd/team_boss_status?user_id=' + userId + '&boss_level=' + currentBossLevel)
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok' && data.boss_assigned) {
                dndCardHistory.push(data.boss_assigned);
                dndApproved = false;
                saveDndProgress();
                renderDndCard(data.boss_assigned);
            } else {
                showWaitingForLeader(currentBossLevel);
            }
        });
}

function showBossDiceButton(bossLevel) {
    var container = getCardContainer();
    container.innerHTML = '<div class="branch-task-card"><div class="branch-header"><h3>⚔️ ' + (bossLevel === 'mini' ? 'Мини-босс' : 'Финальный босс') + '</h3></div><div class="level-card" style="text-align:center;"><p>Все участники готовы!</p><p>Брось кубик:</p><div id="dndDiceWrapper" style="margin:15px 0;"><div id="dndDice" class="dnd-dice" onclick="rollForTeamBoss(\'' + bossLevel + '\')"><div class="dice-face front"><span class="dot dot1"></span></div><div class="dice-face back"><span class="dot dot1"></span><span class="dot dot2"></span></div><div class="dice-face right"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span></div><div class="dice-face left"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span></div><div class="dice-face top"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span><span class="dot dot5"></span></div><div class="dice-face bottom"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span><span class="dot dot5"></span><span class="dot dot6"></span></div></div></div></div></div>';
}

function rollForTeamBoss(bossLevel) {
    var diceRoll = rollDice();
    var dice = document.getElementById('dndDice');
    dice.classList.add('rolling');
    dice.style.transform = getDiceFaceRotation(diceRoll);
    
    setTimeout(function() {
        dice.classList.remove('rolling');
        fetch(SERVER_URL + '/api/dnd/team_assign_boss', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, boss_level: bossLevel, dice_roll: diceRoll })
        })
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok') {
                dndCardHistory.push(data.boss_card);
                dndApproved = false;
                saveDndProgress();
                renderDndCard(data.boss_card);
            }
        });
    }, 800);
}       
function renderCardHTML(card, showDice, isStart) {
    var cardNumber = currentRenderCardNumber;
    var isBoss = (cardNumber >= 101 && cardNumber <= 106) || (cardNumber >= 203 && cardNumber <= 208);
    var tasksRequired = getBossWorkRequired();
    var pointsPerTask = getBossPointsPerTask();
    
    var diceHTML = showDice ? '<div id="dndDiceWrapper" style="margin:15px 0;"><div id="dndDice" class="dnd-dice" onclick="rollDndDice()"><div class="dice-face front"><span class="dot dot1"></span></div><div class="dice-face back"><span class="dot dot1"></span><span class="dot dot2"></span></div><div class="dice-face right"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span></div><div class="dice-face left"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span></div><div class="dice-face top"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span><span class="dot dot5"></span></div><div class="dice-face bottom"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span><span class="dot dot5"></span><span class="dot dot6"></span></div></div></div>' : '';
    
    var bossLabel = '';
    if (isBoss) {
        bossLabel = '<div style="font-size:12px;opacity:0.7;margin-top:4px;">👑 ' + (cardNumber <= 106 ? 'Мини-босс' : 'Финальный босс') + ' · ' + tasksRequired + ' заданий по ' + pointsPerTask + ' очков</div>';
    }
    
    var cardHTML = '<div class="branch-task-card ' + (isStart ? 'start-card' : '') + '"><div class="branch-header"><h3>' + card.title + '</h3>' + bossLabel + '</div><div class="level-card" id="card-level-' + cardNumber + '">' + (card.image ? '<img src="' + card.image + '" class="card-image" style="width:100%;border-radius:12px;margin-bottom:15px;" onerror="this.style.display=\'none\'">' : '') + (isStart ? '<p style="text-align:center;font-weight:600;">Брось кубик, чтобы начать!</p>' : '<p style="font-weight:600;margin-bottom:15px;">' + (card.task || '') + '</p>') + '<div id="card-status-' + cardNumber + '"></div>' + diceHTML + '</div></div>';
    
    setTimeout(function() {
        var statusContainer = document.getElementById('card-status-' + cardNumber);
        if (!statusContainer) return;
        
        if (isStart) {
            statusContainer.innerHTML = '';
            return;
        }
        
        if (showDice) {
            statusContainer.innerHTML = '<div style="text-align:center;color:var(--status-green);margin-bottom:10px;"><i class="fas fa-check-circle"></i> Задание одобрено!</div>';
        } else if (isBoss) {
            if (window._bossIntervals) {
                for (var key in window._bossIntervals) {
                    clearInterval(window._bossIntervals[key]);
                }
            }
            window._bossIntervals = window._bossIntervals || {};
            
         function updateBossProgress() {
    var totalPoints = tasksRequired * pointsPerTask;
    
    if (dndMode === 'team') {
        fetch(SERVER_URL + '/api/dnd/team_boss_progress?user_id=' + userId + '&card_id=' + cardNumber)
            .then(r => r.json())
            .then(function(data) {
                if (data.is_completed) {
                    clearInterval(window._bossIntervals[cardNumber]);
                    dndApproved = true;
                    renderDndCard(cardNumber);
                    return;
                }
                var el = document.getElementById('card-status-' + cardNumber);
                if (el) {
                    var tasksHTML = '<p style="color:var(--accent);font-size:12px;margin-bottom:10px;">👥 Командный счёт</p>';
                    for (var t = 0; t < tasksRequired; t++) {
                        var taskPoints = (data.tasks && data.tasks[t]) || 0;
                        var taskDone = taskPoints >= pointsPerTask;
                        var taskDesc = card.bossTasks ? card.bossTasks[t] : ('Задание ' + (t + 1));
                        tasksHTML += '<div class="subtask-card">';
                        tasksHTML += '<div class="subtask-header"><span class="subtask-name">' + taskDesc + '</span><span class="subtask-progress">' + taskPoints + '/' + pointsPerTask + '</span></div>';
                        tasksHTML += '<div class="progress-bar-container" style="height:6px;margin:0 0 8px 0;"><div class="progress-bar-fill" style="width:' + (taskPoints / pointsPerTask * 100) + '%;height:100%;"></div></div>';
                        if (!taskDone) {
                            tasksHTML += '<button class="task-submit-btn subtask-btn" onclick="submitBossWork(' + t + ')"><i class="fas fa-camera"></i> Отправить фото</button>';
                        } else {
                            tasksHTML += '<div style="text-align:center;color:var(--status-green);font-size:12px;"><i class="fas fa-check-circle"></i> Выполнено!</div>';
                        }
                        tasksHTML += '</div>';
                    }
                    el.innerHTML = tasksHTML;
                }
            });
    } else {
        fetch(SERVER_URL + '/api/dnd/get_progress?user_id=' + userId + '&character=' + dndCharacter)
            .then(r => r.json())
            .then(function(data) {
                var count = 0;
                var taskPointsArr = [];
                for (var i = 0; i < tasksRequired; i++) {
                    var bpk = 'boss_points_' + cardNumber + '_task_' + i;
                    var pts = (data.progress && data.progress[bpk]) || 0;
                    taskPointsArr.push(pts);
                    count += pts;
                }
                
                if (count >= totalPoints) {
                    clearInterval(window._bossIntervals[cardNumber]);
                    dndApproved = true;
                    renderDndCard(cardNumber);
                    return;
                }
                var el = document.getElementById('card-status-' + cardNumber);
                if (el) {
                    var tasksHTML = '';
                    for (var t = 0; t < tasksRequired; t++) {
                        var taskPoints = taskPointsArr[t];
                        var taskDone = taskPoints >= pointsPerTask;
                        var taskDesc = card.bossTasks ? card.bossTasks[t] : ('Задание ' + (t + 1));
                        tasksHTML += '<div class="subtask-card">';
                        tasksHTML += '<div class="subtask-header"><span class="subtask-name">' + taskDesc + '</span><span class="subtask-progress">' + taskPoints + '/' + pointsPerTask + '</span></div>';
                        tasksHTML += '<div class="progress-bar-container" style="height:6px;margin:0 0 8px 0;"><div class="progress-bar-fill" style="width:' + (taskPoints / pointsPerTask * 100) + '%;height:100%;"></div></div>';
                        if (!taskDone) {
                            tasksHTML += '<button class="task-submit-btn subtask-btn" onclick="submitBossWork(' + t + ')"><i class="fas fa-camera"></i> Отправить фото</button>';
                        } else {
                            tasksHTML += '<div style="text-align:center;color:var(--status-green);font-size:12px;"><i class="fas fa-check-circle"></i> Выполнено!</div>';
                        }
                        tasksHTML += '</div>';
                    }
                    el.innerHTML = tasksHTML;
                }
            });
    }
}

updateBossProgress();
window._bossIntervals[cardNumber] = setInterval(updateBossProgress, 5000);
            
        } else {
            var skipButtonHTML = '';
            if (!dndSkipUsed) {
               skipButtonHTML = '<button class="task-submit-btn" onclick="openSkipTaskModal()" style="background:#ff9800;margin-top:8px;"><i class="fas fa-book-open gold-book"></i> Пропустить (50)</button>';
            }
            
            statusContainer.innerHTML = '<button class="task-submit-btn" onclick="openDndTaskUpload()"><i class="fas fa-camera"></i> Отправить фото</button>' + skipButtonHTML + '<div style="text-align:center;color:var(--text-gray);font-size:12px;margin-top:10px;">⏳ Дождитесь одобрения администратором</div>';
        }
    }, 50);
    
    return cardHTML;
}
// ==========================================
// БРОСОК КУБИКА
// ==========================================

function rollDndDice() {
    if (dndIsRolling) return;
    var prevCard = dndCardHistory[dndCardHistory.length - 1] || 0;
    if (prevCard !== 0 && !dndApproved) { alert('⏳ Сначала дождитесь одобрения задания администратором!'); return; }
    
    dndIsRolling = true;
    var dice = document.getElementById('dndDice');
    if (!dice) { dndIsRolling = false; return; }
    
    var diceRoll = rollDice();
    var mappedValue = getMappedDiceValue(prevCard, diceRoll);
    var nextCardId = getTransition(prevCard, mappedValue);
    
    if (nextCardId === null || nextCardId === undefined || nextCardId < 0 || nextCardId > 208 || !getCardData(nextCardId)) {
        alert('⚠️ Ошибка перехода! Обновите страницу.');
        dndIsRolling = false;
        return;
    }
    
    dice.classList.add('rolling');
    dice.style.transform = getDiceFaceRotation(diceRoll);
    
    setTimeout(function() {
        dice.classList.remove('rolling');
        setTimeout(function() {
            dndIsRolling = false;
            dndCardHistory.push(nextCardId);
            dndApproved = false;
            saveDndProgress();
            renderDndCard(nextCardId);
        }, 1200);
    }, 800);
}

// ==========================================
// ОТПРАВКА ФОТО
// ==========================================

function openDndTaskUpload() {
    var currentCard = dndCardHistory[dndCardHistory.length - 1];
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.onchange = function(event) {
        var files = Array.from(event.target.files);
        if (files.length === 0) return;
        window.tempPhotos = files;
        submitDndTaskPhoto(currentCard);
    };
    fileInput.click();
}

function submitDndTaskPhoto(cardNumber) {
    if (!window.tempPhotos || window.tempPhotos.length === 0) { showUploadError('❌ Выберите фото'); return; }
    if (window.isUploading) return;
    window.isUploading = true;
    
    var formData = new FormData();
    formData.append('user', userId.toString());
    formData.append('character', dndCharacter);
    formData.append('card', cardNumber.toString());
    for (var i = 0; i < window.tempPhotos.length; i++) formData.append('photos', window.tempPhotos[i]);
    
    fetch(SERVER_URL + '/api/dnd/check_task', { method: 'POST', body: formData })
        .then(r => r.json())
        .then(function(result) {
            if (result && result.status === 'ok') {
                showUploadSuccess('✅ Фото отправлено на проверку!');
                closeTaskUploadModal();
            }
            else { showUploadError('❌ ' + (result?.message || 'Ошибка')); }
        })
        .catch(function(error) { showUploadError('❌ ' + error.message); })
        .finally(function() { window.isUploading = false; window.tempPhotos = []; });
}

// ==========================================
// СБРОС ПРОГРЕССА
// ==========================================

function resetDndProgress() {
    if (!confirm('⚠️ Сбросить прогресс? Вы вернётесь в меню.')) return;
    
    // Определяем, лидер или участник
    var isTeamMode = (dndMode === 'team');
    var resetPromise;
    
    if (isTeamMode) {
        // Сначала проверяем, лидер ли пользователь
        resetPromise = fetch(SERVER_URL + '/api/dnd/teams/my?user_id=' + userId)
            .then(r => r.json())
            .then(function(teamData) {
                var isLeader = (teamData.status === 'ok' && teamData.team && teamData.team.leader_id == userId);
                
                // Сбрасываем прогресс
                return fetch(SERVER_URL + '/api/dnd/reset_progress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId, character: dndCharacter })
                }).then(r => r.json()).then(function(resetData) {
                    if (resetData.status !== 'ok') {
                        throw new Error(resetData.message || 'Ошибка сброса');
                    }
                    
                    if (isLeader) {
                        // Лидер — удаляем команду
                        return fetch(SERVER_URL + '/api/dnd/teams/disband', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ user_id: userId })
                        }).then(r => r.json()).then(function() {
                            return { role: 'leader' };
                        });
                    } else {
                        // Участник — выходим из команды
                        return fetch(SERVER_URL + '/api/dnd/teams/leave', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ user_id: userId })
                        }).then(r => r.json()).then(function() {
                            return { role: 'member' };
                        });
                    }
                });
            });
    } else {
        // Соло — просто сбрасываем
        resetPromise = fetch(SERVER_URL + '/api/dnd/reset_progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, character: dndCharacter })
        }).then(r => r.json()).then(function(data) {
            if (data.status !== 'ok') throw new Error(data.message || 'Ошибка');
            return { role: 'solo' };
        });
    }
    
    resetPromise.then(function(result) {
        // Сбрасываем локально
        dndCardHistory = [0];
        dndApproved = true;
        dndSkipUsed = false;
        dndMode = null;
        dndCharacter = null;
        
        // Останавливаем опросы
        if (teamPollingInterval) {
            clearInterval(teamPollingInterval);
            teamPollingInterval = null;
        }
        if (approvalPollingInterval) {
            clearInterval(approvalPollingInterval);
            approvalPollingInterval = null;
        }
        
        document.getElementById('dndMainMenu').style.display = 'block';
        hideAllDndScreens();
        
        if (result.role === 'leader') {
            alert('✅ Прогресс сброшен! Команда расформирована.');
        } else if (result.role === 'member') {
            alert('✅ Прогресс сброшен! Вы вышли из команды.');
        } else {
            alert('✅ Прогресс сброшен! Можете начать заново.');
        }
    }).catch(function(error) {
        alert('❌ ' + (error.message || 'Ошибка'));
    });
}

// ==========================================
// ВСПОМОГАТЕЛЬНЫЕ
// ==========================================

function rollDice() { return Math.floor(Math.random() * 6) + 1; }

function getMappedDiceValue(cardId, diceRoll) {
    if (cardId === 0 || (cardId >= 1 && cardId <= 39)) {
        if (diceRoll === 1 || diceRoll === 2) return 1;
        if (diceRoll === 3 || diceRoll === 4) return 2;
        if (diceRoll === 5 || diceRoll === 6) return 3;
    }
    return diceRoll;
}

function getDiceFaceRotation(result) {
    var r = { 1: 'rotateX(0deg) rotateY(0deg)', 2: 'rotateX(0deg) rotateY(180deg)', 3: 'rotateX(0deg) rotateY(-90deg)', 4: 'rotateX(0deg) rotateY(90deg)', 5: 'rotateX(-90deg) rotateY(0deg)', 6: 'rotateX(90deg) rotateY(0deg)' };
    return r[result] || r[1];
}

function getTransition(cardId, mappedValue) {
    var transitions = null;
    if (dndCharacter === 'knight') transitions = window.DND_TRANSITIONS;
    else if (dndCharacter === 'mage') transitions = window.DND_TRANSITIONS_MAGE;
    else if (dndCharacter === 'archer') transitions = window.DND_TRANSITIONS_ARCHER;
    else if (dndCharacter === 'druid') transitions = window.DND_TRANSITIONS_DRUID;
    else if (dndCharacter === 'assassin') transitions = window.DND_TRANSITIONS_ASSASSIN;
    else if (dndCharacter === 'bard') transitions = window.DND_TRANSITIONS_BARD;
    if (!transitions || !transitions[cardId]) return null;
    return transitions[cardId][mappedValue];
}

function getCharacterName(char) {
    var names = { knight: '⚔️ Рыцарь', mage: '🔮 Маг', archer: '🕯️ Жрец', druid: '🌿 Друид', assassin: '🗡️ Ассасин', bard: '🎵 Бард' };
    return names[char] || char;
}

function closeTaskUploadModal() {
    console.log('🔒 Закрытие модального окна');
    
    const modal = document.getElementById('taskUploadModal');
    const previewContainer = document.getElementById('taskPhotoPreviewContainer');
    
    if (modal) modal.style.display = 'none';
    if (previewContainer) previewContainer.innerHTML = '';
    
    // Сбрасываем переменные
    currentUploadBranch = null;
    currentUploadLevel = null;
    currentSubtaskData = null;
    currentFriendTaskIdx = null;
    currentFriendLevelIdx = null;
    currentFriendSubtaskIdx = null;
    currentCommunitySubtask = null;
    tempPhotos = [];
    isUploading = false;
    
    // ✅ Обновляем прогресс с сервера
    loadFriendProgressFromServer();
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ==========================================
// СОЛО ИГРА
// ==========================================

function startSoloGame() {
    document.getElementById('soloCharacterModal').style.display = 'flex';
}

function closeSoloCharacterModal() {
    document.getElementById('soloCharacterModal').style.display = 'none';
}

function startSoloWithCharacter(character) {
    // ✅ Проверяем, нет ли уже активной игры у этого или другого персонажа
    fetch(SERVER_URL + '/api/dnd/get_progress?user_id=' + userId + '&character=' + character)
        .then(r => r.json())
        .then(progressData => {
            var history = [];
            if (progressData.status === 'ok' && progressData.progress) {
                history = progressData.progress.card_history || progressData.progress.completed_cards || [];
            }
            
            var finalBosses = [203, 204, 205, 206, 207, 208];
            var hasDefeatedBoss = finalBosses.some(function(boss) { return history.includes(boss); });
            
            if (history.length > 1 && !hasDefeatedBoss) {
                // Есть активная игра — восстанавливаем
                dndMode = 'solo';
                dndCharacter = character;
                dndCardHistory = history;
                var lastCard = history[history.length - 1];
                var completedCards = progressData.progress?.completed_cards || [];
                dndApproved = (lastCard === 0 || completedCards.includes(lastCard));
                
                closeSoloCharacterModal();
                document.getElementById('dndMainMenu').style.display = 'none';
                document.getElementById('dndSoloGame').style.display = 'block';
                document.getElementById('dndSoloTitle').innerText = '🎲 Соло: ' + getCharacterName(character);
                
                saveDndProgress();
                checkSkipAvailability();
                renderDndCard(lastCard);
                return;
            }
            
            // Проверяем другие активные игры
            var characters = ['knight', 'mage', 'archer', 'druid', 'assassin', 'bard'];
            var promises = characters.map(function(c) {
                if (c === character) return Promise.resolve({ history: history });
                return fetch(SERVER_URL + '/api/dnd/get_progress?user_id=' + userId + '&character=' + c)
                    .then(r => r.json())
                    .then(d => ({ history: (d.progress?.card_history || d.progress?.completed_cards || []) }))
                    .catch(() => ({ history: [0] }));
            });
            
            Promise.all(promises).then(function(results) {
                for (var i = 0; i < results.length; i++) {
                    var h = results[i].history;
                    var hasBoss = finalBosses.some(function(b) { return h.includes(b); });
                    if (h.length > 1 && !hasBoss) {
                        alert('⚠️ У вас уже есть активная игра за персонажа ' + getCharacterName(characters[i]) + '! Завершите её сначала.');
                        closeSoloCharacterModal();
                        return;
                    }
                }
                
                // Нет активных игр — начинаем новую
                dndMode = 'solo';
                dndCharacter = character;
                dndCardHistory = [0];
                dndApproved = true;
                dndSkipUsed = false;
                
                closeSoloCharacterModal();
                document.getElementById('dndMainMenu').style.display = 'none';
                document.getElementById('dndSoloGame').style.display = 'block';
                document.getElementById('dndSoloTitle').innerText = '🎲 Соло: ' + getCharacterName(character);
                
                saveDndProgress();
                renderDndCard(0);
            });
        });
}
// ==========================================
// КОМАНДНАЯ ИГРА
// ==========================================
function showWaitingForTeam(bossLevel) {
    var container = getCardContainer();
    if (!container) return;
    
    function checkStatus() {
        fetch(SERVER_URL + '/api/dnd/team_boss_status?user_id=' + userId + '&boss_level=' + bossLevel)
            .then(r => r.json())
            .then(data => {
                if (data.status === 'ok') {
                    if (data.boss_assigned) {
                        // Босс уже назначен — переходим
                        if (!dndCardHistory.includes(data.boss_assigned)) {
                            dndCardHistory.push(data.boss_assigned);
                        }
                        dndApproved = false;
                        saveDndProgress();
                        renderDndCard(data.boss_assigned);
                    } else if (data.all_ready && isTeamLeader()) {
                        // Лидер бросает кубик
                        container.innerHTML = '<div class="branch-task-card"><div class="branch-header"><h3>⚔️ ' + (bossLevel === 'mini' ? 'Мини-босс' : 'Финальный босс') + '</h3></div><div class="level-card" style="text-align:center;"><p style="color:var(--status-green);">✅ Все участники готовы!</p><p>Брось кубик чтобы выбрать босса:</p><div id="dndDiceWrapper" style="margin:15px 0;"><div id="dndDice" class="dnd-dice" onclick="rollForTeamBoss(\'' + bossLevel + '\')"><div class="dice-face front"><span class="dot dot1"></span></div><div class="dice-face back"><span class="dot dot1"></span><span class="dot dot2"></span></div><div class="dice-face right"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span></div><div class="dice-face left"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span></div><div class="dice-face top"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span><span class="dot dot5"></span></div><div class="dice-face bottom"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span><span class="dot dot5"></span><span class="dot dot6"></span></div></div></div></div></div>';
                    } else if (data.all_ready) {
                        // Ждём лидера
                        container.innerHTML = '<div class="branch-task-card"><div class="branch-header"><h3>⏳ Ожидание лидера</h3></div><div class="level-card" style="text-align:center;"><p>Все участники готовы!</p><p style="color:var(--text-gray);">Лидер выбирает босса...</p><button class="task-submit-btn" onclick="showWaitingForTeam(\'' + bossLevel + '\')" style="margin-top:15px;">🔄 Проверить</button></div></div>';
                    } else {
                        // Ждём — просто кнопка проверки
                        container.innerHTML = '<div class="branch-task-card"><div class="branch-header"><h3>⏳ Ожидание команды</h3></div><div class="level-card" style="text-align:center;"><p>Все участники должны достичь уровня босса</p><button class="task-submit-btn" onclick="showWaitingForTeam(\'' + bossLevel + '\')" style="margin-top:15px;">🔄 Проверить</button></div></div>';
                    }
                }
            });
    }
    
    // Показываем и запускаем авто-проверку каждые 5 секунд
    container.innerHTML = '<div class="branch-task-card"><div class="branch-header"><h3>⏳ Ожидание команды</h3></div><div class="level-card" style="text-align:center;"><p>Все участники должны достичь уровня босса</p><p style="color:var(--text-gray);">Авто-проверка каждые 5 сек...</p></div></div>';
    checkStatus();
    var interval = setInterval(function() {
        if (dndMode !== 'team' || !dndCardHistory.includes(parseInt(bossLevel === 'mini' ? '101' : '203'))) {
            checkStatus();
        } else {
            clearInterval(interval);
        }
    }, 5000);
}
      function showDndLobby() {
    document.getElementById('dndMainMenu').style.display = 'none';
    
    // ✅ Сначала проверяем, не идёт ли уже игра
    fetch(SERVER_URL + '/api/dnd/team/status?user_id=' + userId)
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok' && data.game_started) {
                // Игра уже идёт — сразу в игру
                document.getElementById('dndLobby').style.display = 'none';
                document.getElementById('dndGame').style.display = 'block';
                dndMode = 'team';
                var myself = (data.members || []).find(function(m) { return m.user_id == userId || m.id == userId; });
                dndCharacter = myself?.character || myself?.character_class;
                if (dndCharacter) {
                    loadDndProgress().then(function() {
                        checkSkipAvailability();
                        renderDndCard(dndCardHistory[dndCardHistory.length - 1] || 0);
                    });
                }
                startApprovalPolling();
            } else {
                // Игра не началась — показываем лобби
                document.getElementById('dndLobby').style.display = 'block';
                dndMode = 'team';
                refreshTeamList();
                loadMyTeam();
                startTeamPolling();
            }
        });
}
function refreshTeamList() {
    fetch(SERVER_URL + '/api/dnd/teams/list?user_id=' + userId)
        .then(r => r.json())
        .then(data => { if (data.status === 'ok') renderTeamsList(data.teams); });
}

function renderTeamsList(teams) {
    var container = document.getElementById('teamsList');
    if (!container) return;
    if (!teams || teams.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-users"></i><br>🤝 Нет открытых команд</div>';
        return;
    }
    var html = '';
    for (var i = 0; i < teams.length; i++) {
        var t = teams[i];
        html += '<div class="teams-list-item" onclick="openTeamPreview(\'' + t.id + '\')"><div class="team-name">🏰 ' + escapeHtml(t.team_name) + '</div><div class="team-count"><i class="fas fa-users"></i><span>' + t.current_members + '/' + t.members_needed + '</span></div></div>';
    }
    container.innerHTML = html;
}

function loadMyTeam() {
    console.log('🔄 Загрузка моей команды...');
    
    fetch(SERVER_URL + '/api/dnd/teams/my?user_id=' + userId)
        .then(r => r.json())
        .then(data => {
            console.log('📡 Ответ /teams/my:', data);
            
            if (data.status === 'ok' && data.team) {
                var team = data.team;
                var members = team.members || [];
                
                if (members.length === 0) {
                    document.getElementById('myTeamSection').style.display = 'none';
                    return;
                }
                
                // ✅ Загружаем публичные профили для ВСЕХ участников
                var promises = members.map(function(member) {
                    return fetch(SERVER_URL + '/api/public_profile?user_id=' + member.id)
                        .then(r => r.json())
                        .then(function(profile) {
                            console.log('📡 Профиль для ' + member.id + ':', profile);
                            return {
                                id: member.id,
                                name: profile.name || member.name || 'Пользователь',
                                avatar: profile.avatar || 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av1.png',
                                status: profile.status || 'Без статуса',
                                character_class: member.character_class
                            };
                        })
                        .catch(function(err) {
                            console.error('❌ Ошибка загрузки профиля ' + member.id + ':', err);
                            return {
                                id: member.id,
                                name: member.name || 'Пользователь',
                                avatar: 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av1.png',
                                status: 'Без статуса',
                                character_class: member.character_class
                            };
                        });
                });
                
                // ✅ Дожидаемся загрузки ВСЕХ профилей перед отрисовкой
                Promise.all(promises).then(function(updatedMembers) {
                    team.members = updatedMembers;
                    console.log('✅ Обновлённые участники:', team.members);
                    document.getElementById('myTeamSection').style.display = 'block';
                    renderMyTeam(team);
                });
                
            } else {
                document.getElementById('myTeamSection').style.display = 'none';
                var myTeamCard = document.getElementById('myTeamCard');
                if (myTeamCard) myTeamCard.innerHTML = '';
            }
        })
        .catch(err => {
            console.error('❌ Ошибка загрузки команды:', err);
            document.getElementById('myTeamSection').style.display = 'none';
        });
}

function renderMyTeam(team) {
    var isLeader = team.leader_id == userId;
    var membersHtml = '';
    for (var i = 0; i < team.members.length; i++) {
        var m = team.members[i];
        var avatarUrl = m.avatar || 'https://raw.githubusercontent.com/HachetteLittleHeroes/ColoringWithAI/main/assets/avatars/av1.png';
        var charIcon = { knight: '⚔️', mage: '🔮', archer: '🕯️', druid: '🌿', assassin: '🗡️', bard: '🎵' }[m.character_class] || '';
        var charName = { knight: 'Рыцарь', mage: 'Маг', archer: 'Жрец', druid: 'Друид', assassin: 'Ассасин', bard: 'Бард' }[m.character_class] || '';
        var isMemberLeader = (m.id == team.leader_id);
        var shortName = (m.name || 'Пользователь').length > 20 ? (m.name || 'Пользователь').substring(0, 18) + '...' : (m.name || 'Пользователь');
        
        membersHtml += '<div class="team-member-item" onclick="openPublicProfile(\'' + m.id + '\')"><img class="team-member-avatar" src="' + avatarUrl + '"><div class="team-member-info"><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:2px;"><span class="team-member-name">' + escapeHtml(shortName) + '</span>' + (isMemberLeader ? '<span class="team-leader-badge" style="display:inline-flex;align-items:center;gap:4px;background:#ffd700;color:#333;font-size:10px;padding:3px 10px;border-radius:20px;font-weight:600;"><i class="fas fa-crown"></i> Лидер</span>' : '') + (charIcon ? '<span class="team-character-badge" style="display:inline-flex;align-items:center;gap:4px;background:rgba(255,149,0,0.2);color:var(--accent);font-size:10px;padding:3px 10px;border-radius:20px;font-weight:500;">' + charIcon + ' ' + charName + '</span>' : '') + '</div><div class="team-member-status" style="margin-top:1px;">' + escapeHtml(m.status || 'Без статуса') + '</div></div></div>';
    }
    var actions = isLeader ? '<div class="team-actions"><button class="team-action-btn" onclick="showTeamCharacterModal()">🎭 Выбрать персонажа</button><button class="team-action-btn" onclick="startTeamGame()">🎮 Начать игру</button><button class="team-action-btn danger" onclick="disbandTeam()">💥 Расформировать</button></div>' : '<div class="team-actions"><button class="team-action-btn" onclick="showTeamCharacterModal()">🎭 Выбрать персонажа</button><button class="team-action-btn danger" onclick="leaveTeam()">🚪 Покинуть</button></div>';
    document.getElementById('myTeamCard').innerHTML = '<div class="my-team-card"><div class="team-header-row"><h4>' + escapeHtml(team.team_name) + '</h4><div class="team-header-count"><i class="fas fa-users"></i><span>' + team.current_members + '/6</span></div></div><div class="team-members-list">' + membersHtml + '</div>' + actions + '</div>';
}

function showCreateTeamModal() { document.getElementById('createTeamModal').style.display = 'flex'; }
function closeCreateTeamModal() { document.getElementById('createTeamModal').style.display = 'none'; }

function createTeam() {
    var name = document.getElementById('teamNameInput').value.trim();
    if (!name) { alert('Введите название'); return; }
    fetch(SERVER_URL + '/api/dnd/teams/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, team_name: name }) })
        .then(r => r.json())
        .then(data => { if (data.status === 'ok') { alert('✅ Команда создана!'); closeCreateTeamModal(); refreshTeamList(); loadMyTeam(); } else { alert('❌ ' + (data.message || 'Ошибка')); } });
}

function showTeamCharacterModal() { document.getElementById('teamCharacterModal').style.display = 'flex'; }
function closeTeamCharacterModal() { document.getElementById('teamCharacterModal').style.display = 'none'; }

function selectTeamCharacter(character) {
    fetch(SERVER_URL + '/api/dnd/team/select_character', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, character: character }) })
        .then(r => r.json())
        .then(data => { if (data.status === 'ok') { alert('✅ Персонаж выбран!'); closeTeamCharacterModal(); dndCharacter = character; dndCardHistory = [0]; dndApproved = true; saveDndProgress(); loadMyTeam(); } else { alert('❌ ' + (data.message || 'Ошибка')); } });
}

function startTeamGame() {
    if (!confirm('Начать игру? Все участники начнут приключение.')) return;
    fetch(SERVER_URL + '/api/dnd/teams/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId }) })
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok') {
                alert('🎮 Игра начинается!');
                document.getElementById('dndLobby').style.display = 'none';
                document.getElementById('dndGame').style.display = 'block';
                dndMode = 'team';
                startTeamPolling();  // ← добавить
                if (dndCharacter) { 
                    dndCardHistory = [0];
                    dndApproved = true;
                    dndSkipUsed = false;
                    checkSkipAvailability();
                    saveDndProgress();
                    renderDndCard(0); 
                }
            } else { alert('❌ ' + (data.message || 'Ошибка')); }
        });
}
function disbandTeam() {
    if (!confirm('Расформировать команду?')) return;
    fetch(SERVER_URL + '/api/dnd/teams/disband', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId }) })
        .then(r => r.json())
        .then(data => { if (data.status === 'ok') { alert('✅ Команда расформирована'); refreshTeamList(); loadMyTeam(); } });
}

function leaveTeam() {
    if (!confirm('Покинуть команду?')) return;
    fetch(SERVER_URL + '/api/dnd/teams/leave', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId }) })
        .then(r => r.json())
        .then(data => { if (data.status === 'ok') { alert('✅ Вы покинули команду'); refreshTeamList(); loadMyTeam(); } else { alert('❌ ' + (data.message || 'Ошибка')); } });
}

function openTeamPreview(teamId) {
    fetch(SERVER_URL + '/api/dnd/teams/list?user_id=' + userId)
        .then(r => r.json())
        .then(data => {
            var team = data.teams.find(function(t) { return t.id == teamId; });
            if (team) {
                document.getElementById('teamPreviewContent').innerHTML = '<div class="team-preview-header"><span class="team-preview-name">🏰 ' + escapeHtml(team.team_name) + '</span><span class="team-preview-count"><i class="fas fa-users"></i><span>' + team.current_members + '/' + team.members_needed + '</span></span></div>' + (team.leader_id == userId ? '<div class="your-team-badge">⭐ Ваша команда</div>' : '<button class="join-team-preview-btn" onclick="joinTeamFromPreview(\'' + team.id + '\')">🤝 Вступить</button>');
                document.getElementById('teamPreviewModal').style.display = 'flex';
            }
        });
}

function joinTeamFromPreview(teamId) {
    fetch(SERVER_URL + '/api/dnd/teams/join', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, team_id: teamId }) })
        .then(r => r.json())
        .then(data => { if (data.status === 'ok') { alert('✅ Вы вступили!'); closeTeamPreviewModal(); refreshTeamList(); loadMyTeam(); } else { alert('❌ ' + (data.message || 'Ошибка')); } });
}

function closeTeamPreviewModal() { document.getElementById('teamPreviewModal').style.display = 'none'; }
// При загрузке страницы — всегда показываем главное меню (если оплачено)
function resetDndUI() {
    document.getElementById('dndPaySection').style.display = 'none';
    document.getElementById('dndMainMenu').style.display = 'none';
    document.getElementById('dndLobby').style.display = 'none';
    document.getElementById('dndGame').style.display = 'none';
    document.getElementById('dndSoloGame').style.display = 'none';
}
// ==========================================
// АВТО-ВОССТАНОВЛЕНИЕ
// ==========================================

function autoRestoreDndGame() {
    console.log('🔍 autoRestoreDndGame запущен');
    
    // Блокируем кнопки меню на время проверки
    var menuButtons = document.querySelectorAll('#dndMainMenu .dnd-character-card');
    for (var i = 0; i < menuButtons.length; i++) {
        menuButtons[i].style.pointerEvents = 'none';
        menuButtons[i].style.opacity = '0.5';
    }
    
    // 1. Проверяем командную игру
    fetch(SERVER_URL + '/api/dnd/team/status?user_id=' + userId)
        .then(r => r.json())
        .then(teamData => {
            console.log('📡 Статус команды:', teamData);
            
            if (teamData.status === 'ok' && teamData.game_started) {
                console.log('🎮 Найдена активная командная игра');
                dndMode = 'team';
                var myself = (teamData.members || []).find(function(m) { return m.user_id == userId || m.id == userId; });
                dndCharacter = myself?.character || myself?.character_class;
                if (dndCharacter) {
                    document.getElementById('dndMainMenu').style.display = 'none';
                    document.getElementById('dndLobby').style.display = 'none';
                    document.getElementById('dndGame').style.display = 'block';
                    document.getElementById('dndSoloGame').style.display = 'none';
                    loadDndProgress().then(function() {
                        checkSkipAvailability();
                        renderDndCard(dndCardHistory[dndCardHistory.length - 1] || 0);
                    });
                }
                return;
            }
            
            // 2. Ищем соло с максимальным прогрессом
            var characters = ['knight', 'mage', 'archer', 'druid', 'assassin', 'bard'];
            var promises = [];
            
            for (var i = 0; i < characters.length; i++) {
                (function(char) {
                    promises.push(
                        fetch(SERVER_URL + '/api/dnd/get_progress?user_id=' + userId + '&character=' + char)
                            .then(r => r.json())
                            .then(progressData => {
                                if (progressData.status === 'ok' && progressData.progress) {
                                    var history = progressData.progress.card_history || progressData.progress.completed_cards || [];
                                    return { character: char, history: history, completedCards: progressData.progress.completed_cards || [] };
                                }
                                return { character: char, history: [0], completedCards: [] };
                            })
                            .catch(function() {
                                return { character: char, history: [0], completedCards: [] };
                            })
                    );
                })(characters[i]);
            }
            
            Promise.all(promises).then(function(results) {
                console.log('📊 Все результаты:', JSON.stringify(results));
                
                var bestResult = null;
                var maxLength = 0;
                
                for (var i = 0; i < results.length; i++) {
                    if (results[i].history.length > maxLength) {
                        maxLength = results[i].history.length;
                        bestResult = results[i];
                    }
                }
                
                console.log('🏆 Лучший:', bestResult ? bestResult.character + ' (' + maxLength + ' карт)' : 'нет');
                
                if (bestResult && maxLength > 1) {
                    dndMode = 'solo';
                    dndCharacter = bestResult.character;
                    dndCardHistory = bestResult.history;
                    
                    var lastCard = bestResult.history[bestResult.history.length - 1];
                    dndApproved = (lastCard === 0 || bestResult.completedCards.includes(lastCard));
                    
                    console.log('🎮 Восстанавливаем соло: ' + bestResult.character + ', карта ' + lastCard);
                    
                    document.getElementById('dndMainMenu').style.display = 'none';
                    document.getElementById('dndLobby').style.display = 'none';
                    document.getElementById('dndGame').style.display = 'none';
                    document.getElementById('dndSoloGame').style.display = 'block';
                    document.getElementById('dndSoloTitle').innerText = '🎲 Соло: ' + getCharacterName(bestResult.character);
                    
                    checkSkipAvailability();
                    renderDndCard(lastCard);
                } else {
                    // Нет активных игр — показываем меню и разблокируем кнопки
                    console.log('👀 Нет активных игр, показываем меню');
                    document.getElementById('dndMainMenu').style.display = 'block';
                    document.getElementById('dndLobby').style.display = 'none';
                    document.getElementById('dndGame').style.display = 'none';
                    document.getElementById('dndSoloGame').style.display = 'none';
                    
                    // Разблокируем кнопки меню
                    for (var j = 0; j < menuButtons.length; j++) {
                        menuButtons[j].style.pointerEvents = 'auto';
                        menuButtons[j].style.opacity = '1';
                    }
                }
            });
        });
}
function checkSkipAvailability() {
    if (!dndCharacter) return;
    
    fetch(SERVER_URL + '/api/dnd/get_progress?user_id=' + userId + '&character=' + dndCharacter)
        .then(r => r.json())
        .then(function(data) {
            if (data.status === 'ok' && data.progress) {
                dndSkipUsed = data.progress.skip_used || false;
            }
        });
}

function openSkipTaskModal() {
    var currentCard = dndCardHistory[dndCardHistory.length - 1];
    pendingSkipCard = currentCard;
    
    if (!currentCard) {
        alert('❌ Ошибка: нет активной карты');
        return;
    }
    
    var imgEl = document.getElementById('skipTaskImage');
    // ✅ Всегда показываем propusk.png
    imgEl.src = 'https://s3.ru1.storage.beget.cloud/218ea43893c4-hachette-artwork/dnd/propusk.png';
    imgEl.style.display = 'block';
    
    document.getElementById('skipTaskModal').style.display = 'flex';
}

function closeSkipTaskModal() {
    document.getElementById('skipTaskModal').style.display = 'none';
    pendingSkipCard = null;
}

function confirmSkipTask() {
    var cardToSkip = dndCardHistory[dndCardHistory.length - 1]; // ← берём напрямую
    
    if (!cardToSkip) {
        alert('❌ Ошибка: карта не найдена');
        return;
    }
    
    fetch(SERVER_URL + '/api/balance?user_id=' + userId)
        .then(r => r.json())
        .then(function(balanceData) {
            var balance = balanceData.balance || 0;
            if (balance < 50) {
                alert('❌ Недостаточно ашетиков! Нужно 50, у вас ' + balance);
                return;
            }
            
            if (!confirm('Потратить 50 ашетиков на пропуск задания? Можно использовать только 1 раз за приключение.')) return;
            
            fetch(SERVER_URL + '/api/dnd/skip_task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    character: dndCharacter,
                    card_id: cardToSkip
                })
            })
            .then(r => r.json())
            .then(function(result) {
                if (result.status === 'ok') {
                    dndSkipUsed = true;
                    dndApproved = true;
                    user.balance = result.new_balance;
                    updateUI();
                    closeSkipTaskModal();
                    renderDndCard(cardToSkip);
                    alert('✅ Задание пропущено! Можете бросать кубик.');
                } else {
                    alert('❌ ' + (result.message || 'Ошибка'));
                }
            });
        });
}
