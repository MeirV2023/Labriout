import { Language, ProductItem, CategoryId } from '../types';
import { MenuCategoryConfig } from '../data/menuData';

export const CATEGORY_LABELS: Record<CategoryId, Record<Language, string>> = {
  friggitoria: {
    it: 'Friggitoria',
    ru: 'Фритюр и закуски',
    en: 'Fried Delights',
    de: 'Frittiertes',
    fr: 'Friterie',
  },
  panini: {
    it: 'I Panini',
    ru: 'Панини',
    en: 'Sandwiches',
    de: 'Panini',
    fr: 'Paninis',
  },
  panini_special: {
    it: 'Panini Special',
    ru: 'Особые Панини',
    en: 'Special Sandwiches',
    de: 'Spezial-Panini',
    fr: 'Paninis Spéciaux',
  },
  girarrosto: {
    it: 'Girarrosto',
    ru: 'Гриль на вертеле',
    en: 'Rotisserie',
    de: 'Grill-Spezialitäten',
    fr: 'Rôtisserie',
  },
  patate: {
    it: 'Le Patate',
    ru: 'Картофель',
    en: 'Potatoes & Fries',
    de: 'Kartoffeln & Pommes',
    fr: 'Pommes de terre',
  },
  gastronomia: {
    it: 'Gastronomia',
    ru: 'Кулинария',
    en: 'Gastronomy',
    de: 'Gastronomie',
    fr: 'Traiteur',
  },
  pranzo: {
    it: 'Pranzo da Lavoro',
    ru: 'Бизнес-ланч',
    en: 'Business Lunch',
    de: 'Mittagsmenü',
    fr: 'Menu Midi',
  },
  rosticceria: {
    it: 'Rosticceria & Focacce',
    ru: 'Выпечка и фокачча',
    en: 'Bakery & Focaccia',
    de: 'Rosticceria & Focaccia',
    fr: 'Focaccias & Pizzas',
  },
  bevande: {
    it: 'Bibite & Birre',
    ru: 'Напитки и пиво',
    en: 'Drinks & Beers',
    de: 'Getränke & Bier',
    fr: 'Boissons & Bières',
  },
};

export const SUBFILTER_LABELS: Record<string, Record<Language, string>> = {
  tutti: {
    it: 'Tutti',
    ru: 'Все',
    en: 'All',
    de: 'Alle',
    fr: 'Tous',
  },
  panzarotto: {
    it: 'Panzarotto & Crocchè',
    ru: 'Панзаротто и крокеты',
    en: 'Panzarotto & Croquettes',
    de: 'Panzarotto & Kroketten',
    fr: 'Panzarotto & Croquettes',
  },
  arancini: {
    it: 'Arancini & Frittatine',
    ru: 'Аранчини и фриттатине',
    en: 'Arancini & Pasta Fritters',
    de: 'Arancini & Frittatine',
    fr: 'Arancini & Frittatine',
  },
  polpette: {
    it: 'Polpette & Mozzarella',
    ru: 'Фрикадельки и моцарелла',
    en: 'Meatballs & Mozzarella',
    de: 'Fleischbällchen & Mozzarella',
    fr: 'Boulettes & Mozzarella',
  },
  sfizi_fritti: {
    it: 'Specialità Fritte',
    ru: 'Горячие закуски фри',
    en: 'Fried Specialties',
    de: 'Frittierte Spezialitäten',
    fr: 'Spécialités Frites',
  },
  hamburger: {
    it: 'Hamburger',
    ru: 'С гамбургером',
    en: 'Burgers',
    de: 'Hamburger',
    fr: 'Burgers',
  },
  salsiccia: {
    it: 'Salsiccia',
    ru: 'С колбаской',
    en: 'Sausage',
    de: 'Salsiccia',
    fr: 'Saucisse',
  },
  specialita_carne: {
    it: 'Porchetta & Pollo',
    ru: 'Поркетта и курица',
    en: 'Porchetta & Chicken',
    de: 'Porchetta & Hähnchen',
    fr: 'Porchetta & Poulet',
  },
  maxi: {
    it: 'Maxi & Monster',
    ru: 'Макси и Монстр',
    en: 'Maxi & Monster',
    de: 'Maxi & Monster',
    fr: 'Maxi & Monster',
  },
  doppia_carne: {
    it: 'Doppia Carne',
    ru: 'Двойное мясо',
    en: 'Double Meat',
    de: 'Doppelt Fleisch',
    fr: 'Double Viande',
  },
  kebab: {
    it: 'Kebab & Piadina',
    ru: 'Кебаб и пьядина',
    en: 'Kebab & Piadina',
    de: 'Kebab & Piadina',
    fr: 'Kebab & Piadina',
  },
  pollo: {
    it: 'Pollo & Cosce',
    ru: 'Курица и ножки',
    en: 'Chicken & Drumsticks',
    de: 'Hähnchen & Keulen',
    fr: 'Poulet & Cuisses',
  },
  spiedo: {
    it: 'Spiedo & Salsiccia',
    ru: 'Шашлычки и колбаски',
    en: 'Skewers & Sausage',
    de: 'Spieße & Salsiccia',
    fr: 'Brochettes & Saucisse',
  },
  stinco: {
    it: 'Stinco & Tacchino',
    ru: 'Рулька и индейка',
    en: 'Pork Shank & Turkey',
    de: 'Schweinshaxe & Pute',
    fr: 'Jarret & Dinde',
  },
  classiche: {
    it: 'Classiche',
    ru: 'Классические',
    en: 'Classic',
    de: 'Klassisch',
    fr: 'Classiques',
  },
  farcite: {
    it: 'Farcite & Provola',
    ru: 'С начинкой и проволой',
    en: 'Loaded & Provola',
    de: 'Überbacken & Provola',
    fr: 'Garnies & Provola',
  },
  super: {
    it: 'Super & Kebab',
    ru: 'Супер и с кебабом',
    en: 'Super & Kebab',
    de: 'Super & Kebab',
    fr: 'Super & Kebab',
  },
  primi: {
    it: 'Primi del Giorno',
    ru: 'Первые блюда дня',
    en: 'Daily Pasta & First Courses',
    de: 'Tages-Pasta',
    fr: 'Pâtes du Jour',
  },
  secondi: {
    it: 'Secondi del Giorno',
    ru: 'Вторые блюда дня',
    en: 'Daily Mains',
    de: 'Tages-Hauptgerichte',
    fr: 'Plats du Jour',
  },
  mare: {
    it: 'Specialità di Mare',
    ru: 'Блюда из морепродуктов',
    en: 'Seafood Specialties',
    de: 'Meeresfrüchte',
    fr: 'Spécialités de la Mer',
  },
  contorni: {
    it: 'Contorni di Stagione',
    ru: 'Сезонные гарниры',
    en: 'Seasonal Sides',
    de: 'Saisonale Beilagen',
    fr: 'Accompagnements',
  },
  menu_lavoro: {
    it: 'Menu Completo € 7,00',
    ru: 'Комплексный обед € 7,00',
    en: 'Full Lunch Menu € 7.00',
    de: 'Komplettmenü € 7,00',
    fr: 'Menu Complet 7,00 €',
  },
  pizzette: {
    it: 'Pizzette',
    ru: 'Пиццетты',
    en: 'Mini Pizzas',
    de: 'Pizzette',
    fr: 'Mini-Pizzas',
  },
  focacce: {
    it: 'Focacce & Rustici',
    ru: 'Фокачча и выпечка',
    en: 'Focaccia & Savories',
    de: 'Focaccia & Gebäck',
    fr: 'Focaccias & Feuilletés',
  },
  birre: {
    it: 'Birre 33cl & 66cl',
    ru: 'Пиво 33 сл и 66 сл',
    en: 'Beers 33cl & 66cl',
    de: 'Bier 33cl & 66cl',
    fr: 'Bières 33cl & 66cl',
  },
  soft_drinks: {
    it: 'Bibite & Soft Drinks',
    ru: 'Газировка и напитки',
    en: 'Soft Drinks',
    de: 'Softdrinks',
    fr: 'Boissons Fraîches',
  },
  acqua_vino: {
    it: 'Acqua & Vino',
    ru: 'Вода и вино',
    en: 'Water & Wine',
    de: 'Wasser & Wein',
    fr: 'Eau & Vin',
  },
};

export const BADGE_LABELS: Record<string, Record<Language, string>> = {
  'SUPER OFFERTA': {
    it: 'SUPER OFFERTA',
    ru: 'СУПЕР ЦЕНА',
    en: 'SUPER DEAL',
    de: 'SUPER ANGEBOT',
    fr: 'SUPER OFFRE',
  },
  'SPECIALITÀ DELLA CASA': {
    it: 'SPECIALITÀ DELLA CASA',
    ru: 'ФИРМЕННОЕ БЛЮДО',
    en: 'HOUSE SPECIALTY',
    de: 'HAUSSPEZIALITÄT',
    fr: 'SPÉCIALITÉ MAISON',
  },
  'PIÙ AMATO': {
    it: 'PIÙ AMATO',
    ru: 'ЛЮБИМОЕ',
    en: 'MOST LOVED',
    de: 'AM BELIEBTESTEN',
    fr: 'LE PLUS AIMÉ',
  },
  'TRADIZIONALE': {
    it: 'TRADIZIONALE',
    ru: 'ТРАДИЦИОННОЕ',
    en: 'TRADITIONAL',
    de: 'TRADITIONELL',
    fr: 'TRADITIONNEL',
  },
  'MUST TRY': {
    it: 'MUST TRY',
    ru: 'ХИТ ВКУСА',
    en: 'MUST TRY',
    de: 'PROBIER-TIPP',
    fr: 'À ESSAYER',
  },
  'CONSIGLIATO': {
    it: 'CONSIGLIATO',
    ru: 'РЕКОМЕНДУЕМ',
    en: 'RECOMMENDED',
    de: 'EMPFOHLEN',
    fr: 'RECOMMANDÉ',
  },
  'GOURMET': {
    it: 'GOURMET',
    ru: 'ГУРМЭ',
    en: 'GOURMET',
    de: 'GOURMET',
    fr: 'GOURMET',
  },
  'IL PIÙ GRANDE': {
    it: 'IL PIÙ GRANDE',
    ru: 'САМЫЙ БОЛЬШОЙ',
    en: 'THE BIGGEST',
    de: 'DER GRÖSSTE',
    fr: 'LE PLUS GRAND',
  },
  'MONSTER': {
    it: 'MONSTER',
    ru: 'МОНСТР',
    en: 'MONSTER',
    de: 'MONSTER',
    fr: 'MONSTER',
  },
  'SUPER MAXI': {
    it: 'SUPER MAXI',
    ru: 'СУПЕР МАКСИ',
    en: 'SUPER MAXI',
    de: 'SUPER MAXI',
    fr: 'SUPER MAXI',
  },
  'FAI DA TE': {
    it: 'FAI DA TE',
    ru: 'СОБЕРИ САМ',
    en: 'BUILD YOUR OWN',
    de: 'SELBST MIXEN',
    fr: 'SUR MESURE',
  },
  'PIÙ VENDUTO': {
    it: 'PIÙ VENDUTO',
    ru: 'ХИТ ПРОДАЖ',
    en: 'BESTSELLER',
    de: 'BESTSELLER',
    fr: 'MEILLEURE VENTE',
  },
  'FORMATO MAXI': {
    it: 'FORMATO MAXI',
    ru: 'БОЛЬШАЯ ПОРЦИЯ',
    en: 'MAXI SIZE',
    de: 'MAXI-FORMAT',
    fr: 'FORMAT MAXI',
  },
  'SPECIALITÀ': {
    it: 'SPECIALITÀ',
    ru: 'ФИРМЕННОЕ',
    en: 'SPECIALTY',
    de: 'SPEZIALITÄT',
    fr: 'SPÉCIALITÉ',
  },
  'SU PRENOTAZIONE': {
    it: 'SU PRENOTAZIONE',
    ru: 'ПО ПРЕДЗАКАЗУ',
    en: 'PRE-ORDER',
    de: 'AUF VORBESTELLUNG',
    fr: 'SUR COMMANDE',
  },
  'PIÙ RICHIESTO': {
    it: 'PIÙ RICHIESTO',
    ru: 'ПОПУЛЯРНОЕ',
    en: 'TOP PICK',
    de: 'SEHR GEFRAGT',
    fr: 'TRÈS DEMANDÉ',
  },
  'GOLOSO': {
    it: 'GOLOSO',
    ru: 'ОЧЕНЬ СЫТНО',
    en: 'INDULGENT',
    de: 'HERZHAFT',
    fr: 'GOURMAND',
  },
  'DOPPIO MALTO': {
    it: 'DOPPIO MALTO',
    ru: 'КРЕПКОЕ',
    en: 'DOUBLE MALT',
    de: 'DOPPELMALZ',
    fr: 'DOUBLE MALT',
  },
  'SPECIAL': {
    it: 'SPECIAL',
    ru: 'ОСОБОЕ',
    en: 'SPECIAL',
    de: 'SPEZIAL',
    fr: 'SPÉCIAL',
  },
  'CAMPANIA IGP': {
    it: 'CAMPANIA IGP',
    ru: 'КАМПАНИЯ IGP',
    en: 'CAMPANIA IGP',
    de: 'KAMPANIEN IGP',
    fr: 'CAMPANIE IGP',
  },
};

export interface ProductTranslationItem {
  nameRu: string;
  descriptionRu: string;
  nameEn: string;
  descriptionEn: string;
  nameDe?: string;
  descriptionDe?: string;
  nameFr?: string;
  descriptionFr?: string;
}

export const PRODUCT_TRANSLATIONS: Record<string, ProductTranslationItem> = {
  // 1. PRANZO DA LAVORO
  'pranzo-lavoro-combo': {
    nameRu: 'Комплексный бизнес-ланч',
    descriptionRu: 'Со вторника по субботу (только в обед): Первое блюдо дня + Второе + Гарнир + Свежий хлеб + Напиток 33 сл на выбор.',
    nameEn: 'Business Lunch Combo',
    descriptionEn: 'Tuesday to Saturday (lunch only): Daily first course + Main course + Side dish + Fresh bread + 33cl drink of choice.',
  },

  // 2. FRIGGITORIA & PANZAROTTI
  'frig-panzarotto': {
    nameRu: 'Панзаротто',
    descriptionRu: 'Картофельный крокет с салями Наполи и сыром чеддер в хрустящей панировке из кукурузных хлопьев.',
    nameEn: 'Panzarotto',
    descriptionEn: 'Potato croquette with Napoli salami and cheddar cheese, wrapped in a crunchy cornflake crust.',
  },
  'frig-crocche': {
    nameRu: 'Классический неаполитанский крокет',
    descriptionRu: 'Картофельный крокет со свежей петрушкой, чёрным перцем и нежной тянущейся сырной начинкой.',
    nameEn: 'Classic Neapolitan Croquette',
    descriptionEn: 'Potato croquette with fresh parsley, black pepper and a soft melting cheese heart.',
  },
  'frig-arancino-bianco-rosso': {
    nameRu: 'Аранчино белый или красный',
    descriptionRu: 'Традиционный неаполитанский рисовый шарик с мясным рагу и горошком или белый с соусом бешамель, ветчиной и проволой.',
    nameEn: 'White or Red Arancino',
    descriptionEn: 'Traditional Neapolitan rice ball with meat ragù and peas, or white with béchamel, ham and smoked provola.',
  },
  'frig-frittatina': {
    nameRu: 'Фриттатина из пасты',
    descriptionRu: 'Паста букатини с насыщенным соусом бешамель, отборным мясным фаршем, нежным горошком и сыром провола.',
    nameEn: 'Neapolitan Pasta Frittatina',
    descriptionEn: 'Bucatini pasta patty with rich béchamel, prime minced meat, sweet peas and Campania provola cheese.',
  },
  'frig-mozzarella-carrozza': {
    nameRu: 'Моцарелла в карете (в хлебе)',
    descriptionRu: 'Два золотистых хрустящих ломтика тостового хлеба с сочной тянущейся моцареллой внутри.',
    nameEn: 'Mozzarella in Carrozza',
    descriptionEn: 'Two golden crispy bread slices stuffed with a melting Campania mozzarella center.',
  },
  'frig-polpette-classiche': {
    nameRu: 'Классические мясные фрикадельки',
    descriptionRu: 'Домашние фрикадельки из свежего смешанного фарша с ароматными специями и хрустящей корочкой.',
    nameEn: 'Classic Meatballs',
    descriptionEn: 'Artisanal meatballs made from fresh mixed minced meat with herbs and a crispy crust.',
  },
  'frig-polpette-melanzane': {
    nameRu: 'Баклажановые крокеты',
    descriptionRu: 'Ароматные крокеты из печёных баклажанов с базиликом, нежной сердцевиной и золотистой панировкой.',
    nameEn: 'Eggplant Balls',
    descriptionEn: 'Fragrant basil-scented eggplant balls with a soft center and golden breading.',
  },
  'frig-hotdog': {
    nameRu: 'Жареный хот-дог в тесте',
    descriptionRu: 'Сочная сосиска в мягком золотистом хрустящем тесте, обжаренная прямо при заказе.',
    nameEn: 'Crispy Fried Hot Dog',
    descriptionEn: 'Savory frankfurter wrapped in a soft, golden crispy batter fried to order.',
  },
  'frig-speedy-pollo': {
    nameRu: 'Куриный стрипс Speedy Pollo (1 шт.)',
    descriptionRu: 'Палочка из куриного филе со специями в супер-хрустящей панировке.',
    nameEn: 'Speedy Chicken Strip (1 pc)',
    descriptionEn: 'Spiced chicken breast fillet strip with an extra crunchy coating.',
  },
  'frig-mozzarelline': {
    nameRu: 'Мини-моцарелла в панировке (7 шт.)',
    descriptionRu: 'Порция из 7 золотистых шариков моцареллы во фритюре с тянущимся сыром внутри.',
    nameEn: 'Breaded Mozzarella Bites (7 pcs)',
    descriptionEn: 'Portion of 7 golden, melting Campania mozzarella bites.',
  },
  'frig-alette-pollo': {
    nameRu: 'Куриные крылышки фри',
    descriptionRu: 'Хрустящие куриные крылышки, маринованные со сладкой паприкой и душистыми травами.',
    nameEn: 'Crispy Chicken Wings',
    descriptionEn: 'Fried chicken wings marinated with sweet paprika and aromatic herbs.',
  },
  'frig-chele-granchio': {
    nameRu: 'Крабовые клешни в панировке',
    descriptionRu: 'Нежные крабовые клешни в хрустящей золотистой панировке с каплей лимонного сока.',
    nameEn: 'Breaded Crab Claws',
    descriptionEn: 'Crab claws in a crunchy golden breading served with a touch of lemon.',
  },
  'frig-panino-fritto': {
    nameRu: 'Жареный панини (Панцеротто)',
    descriptionRu: 'Домашняя золотистая жареная булочка с воздушным тестом и сочной сырно-мясной начинкой.',
    nameEn: 'Fried Stuffed Bun',
    descriptionEn: 'Artisanal golden fried bun with a fluffy interior and savory filling.',
  },
  'frig-calzone-ripieno': {
    nameRu: 'Жареный закрытый кальцоне',
    descriptionRu: 'Кальцоне во фритюре с начинкой из свежей рикотты, неаполитанских шкварок чиколи, проволы и чёрного перца.',
    nameEn: 'Stuffed Fried Calzone',
    descriptionEn: 'Deep-fried calzone filled with fresh Campania ricotta, Neapolitan pork cracklings, provola and black pepper.',
  },
  'frig-frittelle-alghe': {
    nameRu: 'Оладьи с морскими водорослями',
    descriptionRu: 'Пышные неаполитанские пончики дзепполине из дрожжевого теста со свежими морскими водорослями.',
    nameEn: 'Seaweed Dough Fritters',
    descriptionEn: 'Savory Neapolitan leavened dough puffs fried hot with fresh seaweeds.',
  },
  'frig-olive-ascolana': {
    nameRu: 'Оливки по-асколански с мясом',
    descriptionRu: 'Крупные зелёные оливки, фаршированные пряным мясом и обжаренные в золотистой панировке.',
    nameEn: 'Stuffed Ascolana Olives',
    descriptionEn: 'Green olives stuffed with seasoned minced meat and fried in a golden crust.',
  },

  // 3. I PANINI
  'panino-sfizioso': {
    nameRu: 'Панини Сфициозо',
    descriptionRu: 'Бифштекс из свежей говядины, хрустящий бекон, свежий листовой салат и тянущаяся провола.',
    nameEn: 'Sfizioso Sandwich',
    descriptionEn: 'Fresh beef burger patty, crispy bacon, crisp lettuce and melting provola cheese.',
  },
  'panino-classico': {
    nameRu: 'Панини Классико',
    descriptionRu: 'Сочный говяжий бифштекс, золотистый картофель фри и расплавленный сыр провола.',
    nameEn: 'Classic Sandwich',
    descriptionEn: 'Beef burger patty, golden french fries and melted provola cheese.',
  },
  'panino-stupendo': {
    nameRu: 'Панини Ступендо',
    descriptionRu: 'Говяжий бифштекс, пармская сыровяленая ветчина прошутто крудо, печёные баклажаны и тянущаяся провола.',
    nameEn: 'Stupendo Sandwich',
    descriptionEn: 'Beef burger, aged Parma prosciutto crudo, roasted eggplants and melting provola.',
  },
  'panino-sublime': {
    nameRu: 'Панини Сублиме',
    descriptionRu: 'Говяжий бифштекс, обжаренные шампиньоны с чесноком и зеленью, печёный картофель и провола.',
    nameEn: 'Sublime Sandwich',
    descriptionEn: 'Beef burger, sautéed button mushrooms, savory oven-baked potatoes and provola.',
  },
  'panino-snoopy': {
    nameRu: 'Панини Снупи',
    descriptionRu: 'Поджаренная на гриле сосиска, хрустящий картофель фри и копчёная провола.',
    nameEn: 'Snoopy Sandwich',
    descriptionEn: 'Grilled frankfurter sausage, crispy french fries and smoked provola cheese.',
  },
  'panino-napoli': {
    nameRu: 'Панини Наполи',
    descriptionRu: 'Рубленая свиная колбаска на гриле, неаполитанская зелень фриариелли и тянущаяся провола.',
    nameEn: 'Napoli Sandwich',
    descriptionEn: 'Knife-chopped grilled pork sausage, traditional Neapolitan broccoli rabe (friarielli) and melting provola.',
  },
  'panino-crisha': {
    nameRu: 'Панини Криша',
    descriptionRu: 'Колбаска на гриле, расплавленная провола, сладкие везувианские томаты Пьенноло и белые грибы.',
    nameEn: 'Crisha Sandwich',
    descriptionEn: 'Grilled sausage, melted provola, Vesuvian Piennolo cherry tomatoes and fragrant porcini mushrooms.',
  },
  'panino-gustoso': {
    nameRu: 'Панини Густозо',
    descriptionRu: 'Свиная колбаска на гриле, копчёная провола и горячий картофель фри.',
    nameEn: 'Gustoso Sandwich',
    descriptionEn: 'Grilled pork sausage, smoked provola cheese and hot french fries.',
  },
  'panino-ortolano': {
    nameRu: 'Панини Ортолано',
    descriptionRu: 'Колбаска на гриле, баклажаны, сладкий перец, кабачки на гриле и сыр провола.',
    nameEn: 'Ortolano Sandwich',
    descriptionEn: 'Grilled sausage, eggplants, savory bell peppers, grilled zucchini and provola.',
  },
  'panino-leggero': {
    nameRu: 'Панини Леджеро (Лёгкий)',
    descriptionRu: 'Нежное куриное филе на гриле, свежий салат, спелые томаты и сыр провола.',
    nameEn: 'Leggero Light Sandwich',
    descriptionEn: 'Tender grilled chicken breast, crisp lettuce, vine-ripened tomatoes and provola.',
  },
  'panino-gennari': {
    nameRu: 'Панини Дженнари',
    descriptionRu: 'Свиная колбаска на гриле, расплавленная провола и обжаренный сладкий перец.',
    nameEn: 'Gennari’ Sandwich',
    descriptionEn: 'Grilled pork sausage, melted provola cheese and pan-sautéed bell peppers.',
  },
  'panino-porchettato': {
    nameRu: 'Панини с Поркеттой',
    descriptionRu: 'Горячая запечённая свиная рулька Поркетта ди Аричча IGP, печёный картофель, провола и шампиньоны.',
    nameEn: 'Porchettato Sandwich',
    descriptionEn: 'Warm sliced Ariccia IGP roast pork (porchetta), baked potatoes, melting provola and mushrooms.',
  },
  'panino-saporito': {
    nameRu: 'Панини Сапорито',
    descriptionRu: 'Хрустящая куриная котлета в панировке, расплавленная провола, картофель фри и свежий салат.',
    nameEn: 'Saporito Sandwich',
    descriptionEn: 'Crispy breaded chicken cutlet, melted provola, french fries and fresh lettuce.',
  },
  'panino-crocco': {
    nameRu: 'Крокко-Панини',
    descriptionRu: 'Колбаска на гриле, размятый картофельный крокет, варёная ветчина и тянущаяся провола.',
    nameEn: 'Crocco Sandwich',
    descriptionEn: 'Grilled sausage, smashed potato croquette, cooked ham and melting provola.',
  },
  'panino-mortazza': {
    nameRu: 'Панини с Мортаделлой и фисташками',
    descriptionRu: 'Поджаренная на гриле мортаделла, песто из сицилийских фисташек Бронте, провола и печёный картофель.',
    nameEn: 'Mortazza Gourmet Sandwich',
    descriptionEn: 'Seared mortadella, Bronte pistachio pesto, smoked provola and oven-baked potatoes.',
  },

  // 4. PANINI SPECIAL
  'special-bomba': {
    nameRu: 'Панини Бомба',
    descriptionRu: 'Двойной бифштекс, двойной хрустящий бекон, двойная провола, сыр чеддер, картофель фри и глазунья!',
    nameEn: 'Bomba Giant Sandwich',
    descriptionEn: 'Double beef burger, double crispy bacon, double provola, cheddar cheese, french fries and a fried egg!',
  },
  'special-mostruoso': {
    nameRu: 'Панини Монструозо (Монстр)',
    descriptionRu: 'Бифштекс, бекон, чеддер, баклажаны с томатами, печёный картофель, провола и целая фрикаделька сверху панини!',
    nameEn: 'Mostruoso Monster Sandwich',
    descriptionEn: 'Burger patty, bacon, cheddar, sautéed eggplants, baked potatoes, provola and a whole meatball on top!',
  },
  'special-porcino': {
    nameRu: 'Панини Порчино (с белыми грибами)',
    descriptionRu: 'Двойная колбаска на гриле, белые грибы, двойная хрустящая панчетта, двойная провола и печёный картофель.',
    nameEn: 'Porcino Double Sandwich',
    descriptionEn: 'Double grilled sausage, porcini mushrooms, double crispy pancetta, double provola and baked potatoes.',
  },
  'special-esagerato': {
    nameRu: 'Панини Эзаджерато',
    descriptionRu: 'Двойная порция поркетты из Ариччи, баклажаны с томатами, двойная копчёная провола и картофель фри.',
    nameEn: 'Esagerato Sandwich',
    descriptionEn: 'Double Ariccia roast porchetta, sautéed eggplants, double smoked provola and french fries.',
  },
  'special-maialino': {
    nameRu: 'Панини Майялино',
    descriptionRu: 'Двойная колбаска, нежный крем из баклажанов, двойная провола, хлопья пармезана и мясные фрикадельки.',
    nameEn: 'Maialino Sandwich',
    descriptionEn: 'Double sausage, velvety eggplant cream, double provola, Parmigiano Reggiano flakes and meatballs.',
  },
  'special-mitico': {
    nameRu: 'Панини Митико (Легендарный)',
    descriptionRu: 'Двойной бифштекс, двойная панчетта, двойной чеддер, двойной карамелизированный лук, двойной фри и грибы.',
    nameEn: 'Mitico Legendary Sandwich',
    descriptionEn: 'Double burger, double pancetta, double melted cheddar, double caramelized onion, double fries and mushrooms.',
  },
  'special-kebab': {
    nameRu: 'Панини или Пьядина с Кебабом',
    descriptionRu: 'Пряное мясо кебаб, свежие овощи и гарниры на выбор, копчёная провола и фирменные соусы.',
    nameEn: 'Kebab Sandwich or Piadina Wrap',
    descriptionEn: 'Spiced roasted kebab meat, toppings of choice, smoked provola cheese and signature sauces.',
  },
  'special-componi': {
    nameRu: 'Собери свой Панини',
    descriptionRu: 'Создайте свой идеальный панини: выберите мясо + гарнир на выбор + расплавленная провола + любимые соусы.',
    nameEn: 'Build Your Own Sandwich',
    descriptionEn: 'Customize your sandwich: Choose Meat + Side topping + Melted Provola + Sauces of your choice.',
  },

  // 5. GIRARROSTO
  'gira-pollo-patate': {
    nameRu: 'Целая курица-гриль с печёным картофелем',
    descriptionRu: 'Целая курица на вертеле со средиземноморскими травами и большой порцией золотистого печёного картофеля.',
    nameEn: 'Whole Rotisserie Chicken & Baked Potatoes',
    descriptionEn: 'Whole spit-roasted chicken seasoned with Mediterranean herbs, served with a generous portion of baked potatoes.',
  },
  'gira-salsiccia-spiedo': {
    nameRu: 'Колбаска на вертеле с картофелем',
    descriptionRu: 'Подрумяненная на углях свиная колбаска на вертеле с гарниром из печёного картофеля (цена за 1 шт.).',
    nameEn: 'Spit-Roasted Sausage with Potatoes',
    descriptionEn: 'Golden charcoal-roasted sausage on the spit served with oven-baked potatoes (price per piece).',
  },
  'gira-coscia-tacchino': {
    nameRu: 'Гигантская ножка индейки с картофелем',
    descriptionRu: 'Большая сочная голень индейки медленного томления на вертеле с гарниром из печёного картофеля.',
    nameEn: 'Giant Turkey Leg with Potatoes',
    descriptionEn: 'Slow-roasted giant turkey leg on the spit, tender and juicy, served with oven-baked potatoes.',
  },
  'gira-spiedini-patate': {
    nameRu: 'Мясной шашлычок с печёным картофелем',
    descriptionRu: 'Шашлычок из ассорти мяса и овощей с хрустящим запечённым картофелем (цена за 1 шпажку).',
    nameEn: 'Mixed Meat Skewers with Baked Potatoes',
    descriptionEn: 'Mixed meat and vegetable skewer served with crispy oven-baked potatoes (price per skewer).',
  },
  'gira-stinco-maiale': {
    nameRu: 'Запечённая свиная рулька с картофелем',
    descriptionRu: 'Томлённая в печи нежнейшая свиная рулька с душистыми травами и специями, подаётся с печёным картофелем.',
    nameEn: 'Roasted Pork Shank with Potatoes',
    descriptionEn: 'Oven-braised pork shank with herbs and spices cooked until fork-tender, served with baked potatoes.',
  },
  'gira-cosce-pollo': {
    nameRu: 'Куриные бёдрышки с печёным картофелем',
    descriptionRu: 'Сочные пряные куриные ножки на вертеле с порцией золотистого запечённого картофеля.',
    nameEn: 'Chicken Drumsticks with Baked Potatoes',
    descriptionEn: 'Juicy spiced chicken drumsticks served with a portion of golden oven-baked potatoes.',
  },

  // 6. GASTRONOMIA
  'gastro-primi-giorno': {
    nameRu: 'Первое блюдо дня (Горячая паста)',
    descriptionRu: 'Горячее блюдо неаполитанской традиции (паста с картофелем и проволой, рагу, паста с фасолью или лазанья).',
    nameEn: 'Daily First Course (Hot Pasta)',
    descriptionEn: 'Traditional Neapolitan hot pasta dish of the day (e.g., pasta and potatoes with provola, ragù, lasagna).',
  },
  'gastro-secondo-giorno': {
    nameRu: 'Второе блюдо дня с гарниром',
    descriptionRu: 'Мясное или овощное горячее блюдо дня от нашего шеф-повара с гарниром в комплекте.',
    nameEn: 'Daily Main Course with Side',
    descriptionEn: 'Meat or vegetable main dish cooked fresh daily by our chefs, side dish included.',
  },
  'gastro-primo-mare': {
    nameRu: 'Паста или ризотто с морепродуктами (по предзаказу)',
    descriptionRu: 'Спагетти с вонголе, ризотто с морепродуктами или каламарата со свежим уловом по предварительному заказу.',
    nameEn: 'Seafood Pasta or Risotto (Pre-order)',
    descriptionEn: 'Spaghetti with clams, seafood risotto or calamarata with fresh catch of the day upon reservation.',
  },
  'gastro-secondo-mare': {
    nameRu: 'Горячее из рыбы и морепродуктов (по предзаказу)',
    descriptionRu: 'Ассорти жареных кальмаров, креветок и мелкой рыбы фриттура ди паранца или запечённый улов дня по предзаказу.',
    nameEn: 'Seafood Main Course (Pre-order)',
    descriptionEn: 'Fried mixed fish, calamari and shrimp or oven-baked catch of the day upon reservation.',
  },
  'gastro-contorni-stagione': {
    nameRu: 'Сезонные овощные гарниры',
    descriptionRu: 'Неаполитанские фриариелли, баклажаны с томатами, сладкий перец на сковороде, кабачки скапече или печёный картофель.',
    nameEn: 'Seasonal Vegetable Sides',
    descriptionEn: 'Friarielli broccoli rabe, sautéed eggplants, pan-fried peppers, marinated zucchini or baked potatoes.',
  },

  // 7. LE PATATE
  'pat-fritte': {
    nameRu: 'Классический картофель фри',
    descriptionRu: 'Тонкие ломтики картофеля, обжаренные в свежем масле прямо перед подачей. Хрустящие, горячие и золотистые.',
    nameEn: 'Classic French Fries',
    descriptionEn: 'Shoestring fries cooked to order in fresh oil. Crispy, piping hot and golden.',
  },
  'pat-forno': {
    nameRu: 'Печёный картофель с розмарином',
    descriptionRu: 'Дольки картофеля, запечённые в духовке со свежим розмарином, чесноком и оливковым маслом первого отжима.',
    nameEn: 'Rosemary Oven-Baked Potatoes',
    descriptionEn: 'Potato wedges roasted in the oven with fresh rosemary, garlic and extra virgin olive oil.',
  },
  'pat-super': {
    nameRu: 'Картофель Супер',
    descriptionRu: 'Рубленая колбаска, кружочки сосисок, пряный кебаб, грибы и обильная шапка тянущейся копчёной проволы.',
    nameEn: 'Super Loaded Fries',
    descriptionEn: 'Crumbled sausage, sliced frankfurters, spiced kebab meat, mushrooms and melted smoked provola.',
  },
  'pat-kebab-provola': {
    nameRu: 'Картофель фри с кебабом и проволой',
    descriptionRu: 'Хрустящий картофель фри с кусочками пряного мяса кебаб и расплавленным сыром провола.',
    nameEn: 'Fries with Kebab & Provola',
    descriptionEn: 'Crispy french fries topped with spiced kebab meat strips and melted Campania provola.',
  },
  'pat-salsiccia-provola': {
    nameRu: 'Картофель с колбаской и проволой',
    descriptionRu: 'Горячий картофель фри с обжаренной на гриле рубленой колбаской и тянущейся копчёной проволой.',
    nameEn: 'Fries with Sausage & Provola',
    descriptionEn: 'Hot fries topped with grilled crumbled pork sausage and melting smoked provola.',
  },
  'pat-bacon-cheddar': {
    nameRu: 'Картофель с беконом и чеддером',
    descriptionRu: 'Золотистый картофель фри под густым горячим сырным соусом чеддер с кусочками хрустящего бекона.',
    nameEn: 'Bacon & Cheddar Cheese Fries',
    descriptionEn: 'Golden fries smothered in rich melted cheddar cheese sauce and crispy bacon bits.',
  },
  'pat-lime-pepe': {
    nameRu: 'Картофель фри с лаймом и розовым перцем',
    descriptionRu: 'Авторский картофель фри с ароматной цедрой свежего лайма и дроблёным розовым перцем.',
    nameEn: 'Lime & Pink Peppercorn Fries',
    descriptionEn: 'French fries seasoned with fresh lime zest and crushed pink peppercorns.',
  },
  'pat-cheddar-kebab-provola': {
    nameRu: 'Картофель Чеддер, Кебаб и Провола',
    descriptionRu: 'Неотразимое трио: сочное мясо кебаб, горячий сырный соус чеддер и тянущаяся провола на картофеле фри.',
    nameEn: 'Cheddar, Kebab & Provola Fries',
    descriptionEn: 'Irresistible trio: kebab meat, hot cheddar fondue and melting provola over crispy fries.',
  },

  // 8. ROSTICCERIA E FOCACCERIA
  'rost-margherita': {
    nameRu: 'Пиццетта Маргарита',
    descriptionRu: 'Мягкая круглая мини-пицца с итальянским томатным соусом, моцареллой фьор-ди-латте и орегано.',
    nameEn: 'Margherita Mini Pizza',
    descriptionEn: 'Soft round mini pizza with Italian tomato sauce, fior di latte mozzarella and oregano.',
  },
  'rost-altri-gusti': {
    nameRu: 'Фокачча / Рустико (разные начинки)',
    descriptionRu: 'Фокачча и слоёные рустико с начинками: колбаска и фриариелли, сосиска и фри, ветчина и провола, дьявола.',
    nameEn: 'Stuffed Focaccia / Rustico (Assorted)',
    descriptionEn: 'Focaccias and savory pastries with assorted fillings: sausage & friarielli, frankfurter & fries, ham & provola, spicy salami.',
  },

  // 9. BIBITE
  'bev-peroni-33': {
    nameRu: 'Пиво Peroni 33 сл',
    descriptionRu: 'Освежающий итальянский светлый лагер в стеклянной бутылке 33 сл.',
    nameEn: 'Peroni Beer 33 cl',
    descriptionEn: 'Refreshing Italian pale lager in a 33 cl glass bottle.',
  },
  'bev-peroni-66': {
    nameRu: 'Пиво Peroni 66 сл',
    descriptionRu: 'Традиционное итальянское светлое пиво Peroni в большой бутылке 66 сл.',
    nameEn: 'Peroni Beer 66 cl',
    descriptionEn: 'Traditional Peroni Italian lager in a large 66 cl bottle.',
  },
  'bev-heineken-33': {
    nameRu: 'Пиво Heineken 33 сл',
    descriptionRu: 'Премиальный голландский светлый лагер, подаётся охлаждённым, 33 сл.',
    nameEn: 'Heineken Beer 33 cl',
    descriptionEn: 'Premium Dutch lager served ice-cold, 33 cl bottle.',
  },
  'bev-heineken-66': {
    nameRu: 'Пиво Heineken 66 сл',
    descriptionRu: 'Премиальное пиво Heineken в большой бутылке 66 сл.',
    nameEn: 'Heineken Beer 66 cl',
    descriptionEn: 'Premium Heineken lager in a large 66 cl bottle.',
  },
  'bev-ceres': {
    nameRu: 'Пиво Ceres Strong Ale 33 сл',
    descriptionRu: 'Датский крепкий эль двойного солода с насыщенным вкусом (7,7% алк.).',
    nameEn: 'Ceres Strong Ale 33 cl',
    descriptionEn: 'Full-bodied Danish double malt strong ale (7.7% ABV).',
  },
  'bev-tennents': {
    nameRu: 'Пиво Tennent’s Super 33 сл',
    descriptionRu: 'Плотный и насыщенный шотландский крепкий лагер (9,0% алк.).',
    nameEn: 'Tennent’s Super 33 cl',
    descriptionEn: 'Rich and intense Scottish strong lager (9.0% ABV).',
  },
  'bev-corona': {
    nameRu: 'Пиво Corona Extra 33 сл',
    descriptionRu: 'Лёгкое освежающее мексиканское пиво, идеально с долькой лайма.',
    nameEn: 'Corona Extra 33 cl',
    descriptionEn: 'Crisp and refreshing Mexican lager.',
  },
  'bev-fischer': {
    nameRu: 'Пиво Fischer Tradizione 65 сл',
    descriptionRu: 'Особое эльзасское светлое пиво в бутылке с бугельной пробкой 65 сл.',
    nameEn: 'Fischer Tradizione 65 cl',
    descriptionEn: 'Special Alsatian blonde beer in a 65 cl swing-top bottle.',
  },
  'bev-coca-cola-33': {
    nameRu: 'Coca-Cola 33 сл',
    descriptionRu: 'Классическая охлаждённая Coca-Cola в баночке 33 сл.',
    nameEn: 'Coca-Cola 33 cl',
    descriptionEn: 'Classic chilled Coca-Cola in a 33 cl can.',
  },
  'bev-coca-cola-zero-33': {
    nameRu: 'Coca-Cola Zero 33 сл',
    descriptionRu: 'Охлаждённая Coca-Cola Zero без сахара в баночке 33 сл.',
    nameEn: 'Coca-Cola Zero 33 cl',
    descriptionEn: 'Zero-sugar chilled Coca-Cola in a 33 cl can.',
  },
  'bev-aranciata-33': {
    nameRu: 'Аранчата / Fanta 33 сл',
    descriptionRu: 'Искрящийся апельсиновый лимонад Fanta в баночке 33 сл.',
    nameEn: 'Orange Soda / Fanta 33 cl',
    descriptionEn: 'Sparkling citrus orange soda in a 33 cl can.',
  },
  'bev-nastro-33': {
    nameRu: 'Пиво Nastro Azzurro 33 сл',
    descriptionRu: 'Итальянский премиальный пилснер Nastro Azzurro, 33 сл.',
    nameEn: 'Nastro Azzurro 33 cl',
    descriptionEn: 'Premium Italian pilsner beer, 33 cl bottle.',
  },
  'bev-nastro-66': {
    nameRu: 'Пиво Nastro Azzurro 66 сл',
    descriptionRu: 'Итальянское пиво Nastro Azzurro в большой бутылке 66 сл.',
    nameEn: 'Nastro Azzurro 66 cl',
    descriptionEn: 'Nastro Azzurro Italian pilsner in a 66 cl bottle.',
  },
  'bev-coca-1-5l': {
    nameRu: 'Coca-Cola / Sprite 1.5 л',
    descriptionRu: 'Большая семейная бутылка 1,5 литра (Coca-Cola или Sprite).',
    nameEn: 'Coca-Cola / Sprite 1.5 L',
    descriptionEn: 'Family-size 1.5 Liter bottle (Coca-Cola or Sprite).',
  },
  'bev-aranciata-1-5l': {
    nameRu: 'Аранчата / Fanta 1.5 л',
    descriptionRu: 'Большая семейная бутылка апельсинового напитка 1,5 литра.',
    nameEn: 'Orange Soda / Fanta 1.5 L',
    descriptionEn: 'Family-size 1.5 Liter bottle of sparkling orange soda.',
  },
  'bev-acqua-50cl': {
    nameRu: 'Вода без газа 50 сл',
    descriptionRu: 'Природная минеральная негазированная вода в бутылочке 50 сл.',
    nameEn: 'Still Mineral Water 50 cl',
    descriptionEn: 'Natural still mineral water in a 50 cl bottle.',
  },
  'bev-acqua-1-5l': {
    nameRu: 'Вода без газа 1.5 л',
    descriptionRu: 'Природная минеральная негазированная вода в бутылке 1,5 литра.',
    nameEn: 'Still Mineral Water 1.5 L',
    descriptionEn: 'Natural still mineral water in a 1.5 Liter bottle.',
  },
  'bev-acqua-frizz-1-5l': {
    nameRu: 'Вода газированная 1.5 л',
    descriptionRu: 'Природная игристая / газированная минеральная вода в бутылке 1,5 литра.',
    nameEn: 'Sparkling Mineral Water 1.5 L',
    descriptionEn: 'Natural sparkling mineral water in a 1.5 Liter bottle.',
  },
  'bev-vino': {
    nameRu: 'Домашнее местное вино 75 сл',
    descriptionRu: 'Традиционное красное или белое домашнее вино региона Кампания (бутылка 75 сл).',
    nameEn: 'Local House Wine 75 cl',
    descriptionEn: 'Traditional Campania red or white house wine (75 cl bottle).',
  },
};

export function getCategoryLabel(catId: CategoryId | string, language: Language, fallback?: string): string {
  const entry = CATEGORY_LABELS[catId as CategoryId];
  if (entry && entry[language]) return entry[language];
  return fallback || String(catId);
}

export function getSubFilterLabel(subId: string, language: Language, fallback?: string): string {
  const entry = SUBFILTER_LABELS[subId];
  if (entry && entry[language]) return entry[language];
  return fallback || subId;
}

export function getBadgeLabel(badge: string | undefined, language: Language): string | undefined {
  if (!badge) return undefined;
  const entry = BADGE_LABELS[badge];
  if (entry && entry[language]) return entry[language];
  return badge;
}

export function getLocalizedProductName(product: ProductItem, language: Language): string {
  const tr = PRODUCT_TRANSLATIONS[product.id];
  if (language === 'ru') return product.nameRu || tr?.nameRu || product.name;
  if (language === 'en') return product.nameEn || tr?.nameEn || product.name;
  if (language === 'de') return product.nameDe || tr?.nameDe || product.nameEn || tr?.nameEn || product.name;
  if (language === 'fr') return product.nameFr || tr?.nameFr || product.nameEn || tr?.nameEn || product.name;
  return product.name;
}

export function getLocalizedProductDescription(product: ProductItem, language: Language): string {
  const tr = PRODUCT_TRANSLATIONS[product.id];
  if (language === 'ru') return product.descriptionRu || tr?.descriptionRu || product.description;
  if (language === 'en') return product.descriptionEn || tr?.descriptionEn || product.description;
  if (language === 'de') return product.descriptionDe || tr?.descriptionDe || product.descriptionEn || tr?.descriptionEn || product.description;
  if (language === 'fr') return product.descriptionFr || tr?.descriptionFr || product.descriptionEn || tr?.descriptionEn || product.description;
  return product.description;
}
