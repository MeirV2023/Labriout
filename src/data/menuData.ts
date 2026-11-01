import { ExtraOption, ProductItem, CategoryId } from '../types';
import { PRODUCT_TRANSLATIONS } from '../utils/menuTranslations';

export interface MenuCategoryConfig {
  id: CategoryId;
  key: string;
  label: string;
  subtitle: string;
  icon: string;
  image: string;
  subFilters: { id: string; label: string }[];
}

export const CATEGORY_CONFIGS: MenuCategoryConfig[] = [
  {
    id: 'friggitoria',
    key: 'friggitoria',
    label: 'Friggitoria',
    subtitle: 'I nostri fritti artigianali, caldi e irresistibili.',
    icon: '🥟',
    image: 'https://www.edeka.de/uploads/rezepte/rez_edeka-panzerotti-rezept-i-p-1-1.jpg',
    subFilters: [
      { id: 'tutti', label: 'Tutti' },
      { id: 'panzarotto', label: 'Panzarotto & Crocchè' },
      { id: 'arancini', label: 'Arancini & Frittatine' },
      { id: 'polpette', label: 'Polpette & Mozzarella' },
      { id: 'sfizi_fritti', label: 'Specialità Fritte' },
    ],
  },
  {
    id: 'panini',
    key: 'panini',
    label: 'I Panini',
    subtitle: 'Sfilatini fragranti farciti con le migliori carni e contorni tipici.',
    icon: '🍔',
    image: 'https://recipesblob.oetker.de/assets/7e4a3efbf228408090ab65d8ed246123/1272x764/panini-brote-qf-hero-8454.webp',
    subFilters: [
      { id: 'tutti', label: 'Tutti' },
      { id: 'hamburger', label: 'Hamburger' },
      { id: 'salsiccia', label: 'Salsiccia' },
      { id: 'specialita_carne', label: 'Porchetta & Pollo' },
    ],
  },
  {
    id: 'panini_special',
    key: 'panini_special',
    label: 'Panini Special',
    subtitle: 'I giganti più ripieni, mostruosi e goduriosi di Pompei.',
    icon: '👑',
    image: 'https://www.southernliving.com/thmb/NxEWuzQ3nuFkReiW9Grc8k6YsVs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/chicken-fontina-panini_2728_beauty_196-6a6cea44c0404f7f95133c719527bb38.jpg',
    subFilters: [
      { id: 'tutti', label: 'Tutti' },
      { id: 'maxi', label: 'Maxi & Monster' },
      { id: 'doppia_carne', label: 'Doppia Carne' },
      { id: 'kebab', label: 'Kebab & Piadina' },
    ],
  },
  {
    id: 'girarrosto',
    key: 'girarrosto',
    label: 'Girarrosto',
    subtitle: 'Cotto a puntino e servito sempre con patate al forno dorate.',
    icon: '🍗',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkserDQvSX99zP9TiSpdD17iVxZvx76PexHEmF155AYqz_qLxC4MM2B8M&s=10',
    subFilters: [
      { id: 'tutti', label: 'Tutti' },
      { id: 'pollo', label: 'Pollo & Cosce' },
      { id: 'spiedo', label: 'Spiedo & Salsiccia' },
      { id: 'stinco', label: 'Stinco & Tacchino' },
    ],
  },
  {
    id: 'patate',
    key: 'patate',
    label: 'Le Patate',
    subtitle: 'Fritte croccanti o al forno, farcite con formaggi e salse speciali.',
    icon: '🍟',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    subFilters: [
      { id: 'tutti', label: 'Tutti' },
      { id: 'classiche', label: 'Classiche' },
      { id: 'farcite', label: 'Farcite & Provola' },
      { id: 'super', label: 'Super & Kebab' },
    ],
  },
  {
    id: 'gastronomia',
    key: 'gastronomia',
    label: 'Gastronomia',
    subtitle: 'Piatti caldi del giorno della vera cucina tipica napoletana e di mare.',
    icon: '🍝',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    subFilters: [
      { id: 'tutti', label: 'Tutti' },
      { id: 'primi', label: 'Primi del Giorno' },
      { id: 'secondi', label: 'Secondi del Giorno' },
      { id: 'mare', label: 'Specialità di Mare' },
      { id: 'contorni', label: 'Contorni di Stagione' },
    ],
  },
  {
    id: 'pranzo',
    key: 'pranzo',
    label: 'Pranzo da Lavoro',
    subtitle: 'Dal martedì al sabato – Solo a pranzo. Menu completo a soli € 7,00.',
    icon: '💼',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    subFilters: [
      { id: 'tutti', label: 'Tutti' },
      { id: 'menu_lavoro', label: 'Menu Completo € 7,00' },
    ],
  },
  {
    id: 'rosticceria',
    key: 'rosticceria',
    label: 'Rosticceria & Focacce',
    subtitle: 'Pizzette calde margherita e focacce farcite sfiziose.',
    icon: '🍕',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    subFilters: [
      { id: 'tutti', label: 'Tutti' },
      { id: 'pizzette', label: 'Pizzette' },
      { id: 'focacce', label: 'Focacce & Rustici' },
    ],
  },
  {
    id: 'bevande',
    key: 'bevande',
    label: 'Bibite & Birre',
    subtitle: 'Birre artigianali e commerciali, bibite ghiacciate, acqua e vino.',
    icon: '🥤',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    subFilters: [
      { id: 'tutti', label: 'Tutti' },
      { id: 'birre', label: 'Birre 33cl & 66cl' },
      { id: 'soft_drinks', label: 'Bibite & Soft Drinks' },
      { id: 'acqua_vino', label: 'Acqua & Vino' },
    ],
  },
];

// Top 4 core showcase categories that fit perfectly in the visible top viewport
export const SHOWCASE_CATEGORIES: MenuCategoryConfig[] = [
  CATEGORY_CONFIGS[0], // Friggitoria
  CATEGORY_CONFIGS[1], // I Panini
  CATEGORY_CONFIGS[2], // Panini Special
  CATEGORY_CONFIGS[3], // Girarrosto
];


export const PANZAROTTI_EXTRAS: ExtraOption[] = [
  { id: 'extra-provola', name: 'Aggiungi Provola Affumicata', nameEn: 'Add Smoked Provola', nameRu: 'Копченая провола', price: 0.50 },
  { id: 'extra-cheddar', name: 'Colata di Formaggio Cheddar', nameEn: 'Melted Cheddar drizzle', nameRu: 'Горячий чеддер', price: 0.80 },
  { id: 'extra-salame-dadini', name: 'Salame Napoli a Dadini', nameEn: 'Diced Napoli Salami', nameRu: 'Кусочки салями Неаполь', price: 0.60 },
  { id: 'extra-salse', name: 'Salsa Mayo / Ketchup / BBQ', nameEn: 'Sauce portion', nameRu: 'Порция соуса', price: 0.50 },
];

export const PANINI_EXTRAS: ExtraOption[] = [
  { id: 'extra-doppia-carne', name: 'Doppia Porzione di Carne', nameEn: 'Double Meat Patty', nameRu: 'Двойное мясо', price: 2.00 },
  { id: 'extra-bacon-panino', name: 'Bacon Croccante extra', nameEn: 'Crispy Bacon', nameRu: 'Хрустящий бекон', price: 1.00 },
  { id: 'extra-cheddar-panino', name: 'Formaggio Cheddar Fuso', nameEn: 'Melted Cheddar', nameRu: 'Плавленый чеддер', price: 0.80 },
  { id: 'extra-uovo', name: 'Uovo Fritto all\'Occhio di Bue', nameEn: 'Fried Egg', nameRu: 'Жареное яйцо', price: 1.00 },
  { id: 'extra-patatine-dentro', name: 'Patatine Fritte nel Panino', nameEn: 'Fries inside burger', nameRu: 'Картофель фри внутрь', price: 0.80 },
  { id: 'extra-friarielli', name: 'Friarielli Napoletani', nameEn: 'Neapolitan Broccoli Rabe', nameRu: 'Фриариелли', price: 1.00 },
];

export const GIRARROSTO_EXTRAS: ExtraOption[] = [
  { id: 'extra-patate-forno', name: 'Doppia Porzione di Patate al Forno', nameEn: 'Double Baked Potatoes', nameRu: 'Двойной печеный картофель', price: 2.00 },
  { id: 'extra-pane-fresco', name: 'Pane Casereccio Fresco', nameEn: 'Fresh Crusty Bread', nameRu: 'Свежий домашний хлеб', price: 0.50 },
  { id: 'extra-salsa-bbq', name: 'Salsa BBQ Artigianale', nameEn: 'BBQ Sauce', nameRu: 'Фирменный соус барбекю', price: 0.50 },
];

export const PATATE_EXTRAS: ExtraOption[] = [
  { id: 'extra-fonduta-provola', name: 'Fonduta di Provola Filante', nameEn: 'Melted Smoked Provola', nameRu: 'Горячая провола', price: 1.00 },
  { id: 'extra-bacon-patate', name: 'Cubetti di Bacon Croccante', nameEn: 'Crispy Bacon bits', nameRu: 'Кусочки хрустящего бекона', price: 1.00 },
  { id: 'extra-cheddar-patate', name: 'Colata di Formaggio Cheddar', nameEn: 'Cheddar cheese sauce', nameRu: 'Сырный соус Чеддер', price: 1.00 },
  { id: 'extra-wurstel', name: 'Wurstel Grigliati a Rondelle', nameEn: 'Grilled sausages', nameRu: 'Сосиски гриль', price: 1.00 },
];

export const GASTRONOMIA_EXTRAS: ExtraOption[] = [
  { id: 'extra-parmigiano-gastro', name: 'Parmigiano Reggiano Grattugiato', nameEn: 'Grated Parmesan', nameRu: 'Тертый сыр Пармезан', price: 0.80 },
  { id: 'extra-pane-gastro', name: 'Pane Fresco di Pompei', nameEn: 'Fresh Bread', nameRu: 'Свежий хлеб', price: 0.50 },
  { id: 'extra-peperoncino', name: 'Olio al Peperoncino Piccante', nameEn: 'Chili oil', nameRu: 'Острое масло с перцем', price: 0.30 },
];

export const ROSTICCERIA_EXTRAS: ExtraOption[] = [
  { id: 'extra-mozzarella', name: 'Doppia Mozzarella Filante', nameEn: 'Double Mozzarella', nameRu: 'Двойная моцарелла', price: 1.00 },
  { id: 'extra-prosciutto', name: 'Prosciutto Cotto di Alta Qualità', nameEn: 'Cooked Ham', nameRu: 'Ветчина', price: 1.00 },
  { id: 'extra-salame-picc', name: 'Salame Piccante Napoletano', nameEn: 'Spicy Salami', nameRu: 'Острая салями', price: 0.80 },
];

export const DEFAULT_EXTRAS: ExtraOption[] = [
  { id: 'extra-provola', name: 'Aggiungi Provola Affumicata', nameEn: 'Add Smoked Provola', nameRu: 'Копченая провола', price: 0.50 },
  { id: 'extra-cheddar', name: 'Colata di Formaggio Cheddar', nameEn: 'Melted Cheddar drizzle', nameRu: 'Горячий чеддер', price: 0.80 },
  { id: 'extra-salse', name: 'Salsa Mayo / Ketchup / BBQ', nameEn: 'Sauce portion', nameRu: 'Порция соуса', price: 0.50 },
];

export function getDefaultCategoryExtras(category?: CategoryId | string): ExtraOption[] {
  switch (category) {
    case 'friggitoria':
      return PANZAROTTI_EXTRAS;
    case 'panini':
    case 'panini_special':
      return PANINI_EXTRAS;
    case 'girarrosto':
      return GIRARROSTO_EXTRAS;
    case 'patate':
      return PATATE_EXTRAS;
    case 'gastronomia':
    case 'pranzo':
      return GASTRONOMIA_EXTRAS;
    case 'rosticceria':
      return ROSTICCERIA_EXTRAS;
    case 'bevande':
      return [];
    default:
      return DEFAULT_EXTRAS;
  }
}

export function getAvailableExtrasForProduct(product: ProductItem): ExtraOption[] {
  if (Array.isArray(product.availableExtras)) {
    return product.availableExtras;
  }
  return getDefaultCategoryExtras(product.category);
}

const RAW_MENU_PRODUCTS: ProductItem[] = [
  // ==========================================
  // 1. PRANZO DA LAVORO
  // ==========================================
  {
    id: 'pranzo-lavoro-combo',
    name: 'Menu Pranzo da Lavoro',
    icon: '💼',
    category: 'pranzo',
    subCategory: 'menu_lavoro',
    description: 'Dal martedì al sabato (solo pranzo): Primo del giorno + Secondo + Contorno + Pane fresco + Bibita 33cl a scelta.',
    price: 7.00,
    originalPrice: 9.10,
    image: 'https://1.bp.blogspot.com/-AanLMG_01aw/XE3YCJFLkDI/AAAAAAAABIw/zb-XQsnorTgQv_izn7hxXXxVfj8tMU4jACLcBGAs/s1600/cotolette%2Bdi%2Bmiglio.jpg',
    badge: 'SUPER OFFERTA',
    isPopular: true,
    availableExtras: [
      ...GASTRONOMIA_EXTRAS,
      { id: 'extra-cheader-custom', name: 'Cheader', nameEn: 'Cheddar', nameRu: 'Cheader', price: 2.99 },
    ],
  },

  // ==========================================
  // 2. FRIGGITORIA & PANZAROTTI
  // ==========================================
  {
    id: 'frig-panzarotto',
    name: 'Panzarotto',
    icon: '🥟',
    category: 'friggitoria',
    subCategory: 'panzarotto',
    description: 'Crocchè di patate con salame Napoli e cheddar, avvolto in una croccante impanatura ai corn flakes.',
    price: 1.50,
    image: 'https://www.dirussosrl.it/wp-content/uploads/2018/07/Panzerotto-Napoletano-Prontoforno-Rispo.png',
    badge: 'SPECIALITÀ DELLA CASA',
    isPopular: true,
    availableExtras: PANZAROTTI_EXTRAS,
  },
  {
    id: 'frig-crocche',
    name: 'Crocchè Classico Napoletano',
    icon: '🥔',
    category: 'friggitoria',
    subCategory: 'panzarotto',
    description: 'Crocchè di patate con prezzemolo fresco, pepe e cuore morbido filante.',
    price: 1.00,
    image: 'https://www.artigiansurgelati.it/wp-content/uploads/2018/03/Artigian-crocch%C3%A8-napoletano.jpg',
    isVegetarian: true,
    availableExtras: PANZAROTTI_EXTRAS,
  },
  {
    id: 'frig-arancino-bianco-rosso',
    name: 'Arancino Bianco o Rosso',
    icon: '🍘',
    category: 'friggitoria',
    subCategory: 'arancini',
    description: 'Arancino tradizionale napoletano al ragù di carne e piselli oppure bianco con besciamella, prosciutto e provola.',
    price: 1.00,
    image: 'https://ferrinihome.com/wp-content/uploads/2021/11/arancini-catania-.jpeg',
    isPopular: true,
  },
  {
    id: 'frig-frittatina',
    name: 'Frittatina di Pasta',
    icon: '🍝',
    category: 'friggitoria',
    subCategory: 'arancini',
    description: 'Bucatini trafilati con besciamella ricca, macinato di carne di prima scelta, pisellini fini e provola campana.',
    price: 1.00,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcK6CoOWxGPm4kM95YYVLoUSQX6bfUCPd4x4hLSqcViMMuERIv3b8ZJRY&s=10',
    badge: 'PIÙ AMATO',
    isPopular: true,
  },
  {
    id: 'frig-mozzarella-carrozza',
    name: 'Mozzarella in Carrozza',
    icon: '🧀',
    category: 'friggitoria',
    subCategory: 'polpette',
    description: 'Due fette di pane dorate e croccanti con un ripieno filante di mozzarella campana fusa.',
    price: 1.50,
    image: 'https://www.marcellinaincucina.com/wp-content/uploads/2021/10/mozzarella-in-carrozza-5.jpg',
    isVegetarian: true,
  },
  {
    id: 'frig-polpette-classiche',
    name: 'Polpette Classiche',
    icon: '🥩',
    category: 'friggitoria',
    subCategory: 'polpette',
    description: 'Polpette artigianali di carne mista macinata fresca con spezie e crosta croccante.',
    price: 1.00,
    image: 'https://www.giallozafferano.it/images/ricette/19/1973/foto_hd/hd650x433_wm.jpg',
  },
  {
    id: 'frig-polpette-melanzane',
    name: 'Polpette di Melanzane',
    icon: '🍆',
    category: 'friggitoria',
    subCategory: 'polpette',
    description: 'Polpette di melanzane profumate al basilico con cuore morbido e impanatura dorata.',
    price: 1.00,
    image: 'https://blog.giallozafferano.it/latavoladigio/wp-content/uploads/2020/08/Polpette-di-melanzane-e-zucchine-1-960x660.jpg',
    isVegetarian: true,
  },
  {
    id: 'frig-hotdog',
    name: 'Hot Dog Fritto',
    icon: '🌭',
    category: 'friggitoria',
    subCategory: 'sfizi_fritti',
    description: 'Wurstel avvolto in morbida pastella croccante dorata al momento.',
    price: 1.00,
    image: 'https://www.cucchiaio.it/content/cucchiaio/it/ricette/2022/03/corn-dog/jcr:content/header-par/image-single.img.jpg/1647850287103.jpg',
  },
  {
    id: 'frig-speedy-pollo',
    name: 'Speedy Pollo (1 pz.)',
    icon: '🍗',
    category: 'friggitoria',
    subCategory: 'sfizi_fritti',
    description: 'Bastoncino di filetto di pollo speziato con panatura extra crunchy.',
    price: 1.00,
    image: 'https://www.dirussosrl.it/wp-content/uploads/2018/07/Speedy-Pollo-Sadia.png',
  },
  {
    id: 'frig-mozzarelline',
    name: 'Mozzarelline Impanate (7 pz.)',
    icon: '🧀',
    category: 'friggitoria',
    subCategory: 'polpette',
    description: 'Porzione da 7 bocconcini di mozzarella campana dorati e filanti.',
    price: 2.00,
    image: 'https://www.elitesurgelati.it/wp-content/uploads/2019/12/mozzarelline.jpg',
    isVegetarian: true,
  },
  {
    id: 'frig-alette-pollo',
    name: 'Alette di Pollo',
    icon: '🍗',
    category: 'friggitoria',
    subCategory: 'sfizi_fritti',
    description: 'Alette di pollo fritte marinate con paprika dolce ed erbe aromatiche.',
    price: 2.50,
    image: 'https://www.finefoodgroup.com/wp-content/uploads/2021/07/Buffalo-Chikn-Wings.jpg',
  },
  {
    id: 'frig-chele-granchio',
    name: 'Chele di Granchio',
    icon: '🦀',
    category: 'friggitoria',
    subCategory: 'sfizi_fritti',
    description: 'Chele di granchio in panatura croccante e dorata con succo di limone.',
    price: 2.50,
    image: 'https://www.ilgiornaledelcibo.it/wp-content/uploads/2021/03/chele-di-granchio-surgelate.jpg',
  },
  {
    id: 'frig-panino-fritto',
    name: 'Panino Fritto',
    icon: '🥪',
    category: 'friggitoria',
    subCategory: 'sfizi_fritti',
    description: 'Panino artigianale fritto dorato con cuore soffice e ripieno gustoso.',
    price: 2.00,
    image: 'https://blog.giallozafferano.it/gustoamoreefantasie/wp-content/uploads/2023/01/22222-1-960x540.jpg',
  },
  {
    id: 'frig-calzone-ripieno',
    name: 'Calzone Ripieno Fritto',
    icon: '🥟',
    category: 'friggitoria',
    subCategory: 'panzarotto',
    description: 'Calzone fritto ripieno di ricotta fresca campana, cicoli napoletani, provola e pepe.',
    price: 2.50,
    image: 'https://cdn-italiani-media.italiani.it/site-italiani/2020/05/calzone-leccese.jpg',
    badge: 'TRADIZIONALE',
  },
  {
    id: 'frig-frittelle-alghe',
    name: 'Frittelle di Alghe di Mare',
    icon: '🌿',
    category: 'friggitoria',
    subCategory: 'sfizi_fritti',
    description: 'Zeppoline di pasta cresciuta fritte con alghe di mare fresche, calde e salate.',
    price: 1.50,
    image: 'https://www.buttalapasta.it/wp-content/uploads/2008/01/Frittelle-di-alghe-12082025-buttalapasta.it_.jpg',
    isVegetarian: true,
  },
  {
    id: 'frig-olive-ascolana',
    name: 'Olive all\'Ascolana',
    icon: '🫒',
    category: 'friggitoria',
    subCategory: 'sfizi_fritti',
    description: 'Olive verdi ripiene di carne speziata e fritte in pastella dorata.',
    price: 2.00,
    image: 'https://www.soniaperonaci.it/wp-content/uploads/2018/03/Olive-allascolana-2.jpg',
  },

  // ==========================================
  // 3. I PANINI
  // ==========================================
  {
    id: 'panino-sfizioso',
    name: 'Panino Sfizioso',
    icon: '🥓',
    category: 'panini',
    subCategory: 'hamburger',
    description: 'Hamburger di manzo fresco, bacon croccante, insalata fresca e provola filante.',
    price: 4.50,
    image: 'https://www.sfizioso.it/wp-content/uploads/2023/10/panino-con-stinco-di-vitello-e-cavolo-viola.jpg',
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'panino-classico',
    name: 'Panino Classico',
    icon: '🍔',
    category: 'panini',
    subCategory: 'hamburger',
    description: 'Hamburger di manzo, patatine fritte dorate e provola fusa.',
    price: 4.00,
    image: 'https://www.gustini.de/blog/wp/wp-content/uploads/2021/06/Panini-Classico-RezeptVorschau.jpg',
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'panino-stupendo',
    name: 'Panino Stupendo',
    icon: '🥩',
    category: 'panini',
    subCategory: 'hamburger',
    description: 'Hamburger, prosciutto crudo di Parma, melanzane arrostite e provola filante.',
    price: 4.50,
    image: 'https://www.just-eat.ch/foodwiki/uploads/sites/6/2018/01/panini-3-1080x960.jpg',
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'panino-sublime',
    name: 'Panino Sublime',
    icon: '🍄',
    category: 'panini',
    subCategory: 'hamburger',
    description: 'Hamburger, funghi champignon trifolati, patate al forno saporite e provola.',
    price: 4.50,
    image: 'https://www.gustini.de/blog/wp/wp-content/uploads/2021/06/Panini-Classico-RezeptVorschau.jpg',
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'panino-snoopy',
    name: 'Panino Snoopy',
    icon: '🌭',
    category: 'panini',
    subCategory: 'salsiccia',
    description: 'Wurstel alla piastra, patatine fritte croccanti e provola affumicata.',
    price: 3.50,
    image: 'https://rome-tourism.org/wp-content/uploads/2023/11/panini-sandwich-italien-savoureux-scaled.jpg',
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'panino-napoli',
    name: 'Panino Napoli',
    icon: '🌿',
    category: 'panini',
    subCategory: 'salsiccia',
    description: 'Salsiccia a punta di coltello alla piastra, friarielli napoletani e provola filante.',
    price: 4.50,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbJiK54_6XiU_2Y54aXBp6Kur9Q_XxFl6uY-eJmdG4gzniwzL4QfxV19DI&s=10',
    badge: 'MUST TRY',
    isPopular: true,
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'panino-crisha',
    name: 'Panino Crisha',
    icon: '🍄',
    category: 'panini',
    subCategory: 'salsiccia',
    description: 'Salsiccia alla piastra, provola fusa, pomodorini del Piennolo e funghi porcini profumati.',
    price: 4.50,
    image: 'https://images.squarespace-cdn.com/content/v1/69f0d6197391637097211cd2/8a6f615c-b198-4e1c-925b-a586656764ac/LA+PISTACCHIOSA+%232.png?format=2500w',
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'panino-gustoso',
    name: 'Panino Gustoso',
    icon: '🍟',
    category: 'panini',
    subCategory: 'salsiccia',
    description: 'Salsiccia alla piastra, provola affumicata e patatine fritte calde.',
    price: 4.00,
    image: 'https://tipsweek.ch/wp-content/uploads/2019/04/20170521_122347-01.jpeg',
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'panino-ortolano',
    name: 'Panino Ortolano',
    icon: '🍆',
    category: 'panini',
    subCategory: 'salsiccia',
    description: 'Salsiccia, melanzane, peperoni saporiti, zucchine grigliate e provola.',
    price: 4.00,
    image: 'https://mages.it/wp-content/uploads/2024/04/003100_0.jpg',
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'panino-leggero',
    name: 'Panino Leggero',
    icon: '🥗',
    category: 'panini',
    subCategory: 'specialita_carne',
    description: 'Petto di pollo grigliato tenero, insalata fresca, pomodoro ramato e provola.',
    price: 4.00,
    image: 'https://www.cucinabenesenza.it/wp-content/uploads/2021/11/FOTO-SITO2-1.jpg',
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'panino-gennari',
    name: 'Panino Gennari’',
    icon: '🌶️',
    category: 'panini',
    subCategory: 'salsiccia',
    description: 'Salsiccia alla piastra, provola fusa e peperoni spadellati.',
    price: 4.00,
    image: 'https://www.edna.de/WebRoot/EdnaDE/Shops/Edna/65BB/623B/E29D/9652/71E8/2EE8/B9BD/F7F3/9011.jpg',
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'panino-porchettato',
    name: 'Panino Porchettato',
    icon: '🐷',
    category: 'panini',
    subCategory: 'specialita_carne',
    description: 'Porchetta di Ariccia IGP tagliata calda, patate al forno, provola filante e funghi champignon.',
    price: 5.00,
    image: 'https://d37va2rovhwkkr.cloudfront.net/preview_images/news/818_0.jpg',
    badge: 'CONSIGLIATO',
    isPopular: true,
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'panino-saporito',
    name: 'Panino Saporito',
    icon: '🍗',
    category: 'panini',
    subCategory: 'specialita_carne',
    description: 'Cotoletta di pollo croccante, provola fusa, patatine fritte e insalata fresca.',
    price: 4.00,
    image: 'https://media-cdn.tripadvisor.com/media/photo-s/1a/01/d3/92/panino-saporito-salsiccia.jpg',
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'panino-crocco',
    name: 'Crocco Panino',
    icon: '🥔',
    category: 'panini',
    subCategory: 'salsiccia',
    description: 'Salsiccia alla piastra, crocchè di patate schiacciato, prosciutto cotto e provola.',
    price: 4.00,
    image: 'https://paninogiusto.it/wp-content/uploads/2023/10/CROCCO.png',
    badge: 'PIÙ AMATO',
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'panino-mortazza',
    name: 'Panino Mortazza',
    icon: '🥓',
    category: 'panini',
    subCategory: 'specialita_carne',
    description: 'Mortadella arrostita alla piastra, pesto di pistacchi di Bronte, provola e patate al forno.',
    price: 5.00,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmrZTM4Bt-kIZyT62lGfHmVgsCHB7PFA3Qop-g8RWXssyGuG_zeEztycU&s=10',
    badge: 'GOURMET',
    isPopular: true,
    availableExtras: PANINI_EXTRAS,
  },

  // ==========================================
  // 4. PANINI SPECIAL
  // ==========================================
  {
    id: 'special-bomba',
    name: 'Panino Bomba',
    icon: '💣',
    category: 'panini_special',
    subCategory: 'maxi',
    description: 'Doppio hamburger, doppio bacon croccante, doppia provola, formaggio cheddar, patatine fritte e uovo all\'occhio di bue.',
    price: 9.00,
    image: 'https://ninouballerinopalermo.it/wp-content/uploads/2020/06/panineria-prova.jpg',
    badge: 'IL PIÙ GRANDE',
    isPopular: true,
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'special-mostruoso',
    name: 'Panino Mostruoso',
    icon: '👹',
    category: 'panini_special',
    subCategory: 'maxi',
    description: 'Hamburger, bacon, formaggio cheddar, melanzane a funghetto, patate al forno, provola e una polpetta intera sopra il panino!',
    price: 8.00,
    image: 'https://www.scattidigusto.it/wp-content/uploads/2015/10/hamburger-mostruoso-halloween-1-chilo-960x641.jpg',
    badge: 'MONSTER',
    isPopular: true,
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'special-porcino',
    name: 'Panino Porcino',
    icon: '🍄',
    category: 'panini_special',
    subCategory: 'doppia_carne',
    description: 'Doppia salsiccia alla piastra, funghi porcini, doppia pancetta croccante, doppia provola e patate al forno.',
    price: 8.00,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80',
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'special-esagerato',
    name: 'Panino Esagerato',
    icon: '🔥',
    category: 'panini_special',
    subCategory: 'doppia_carne',
    description: 'Doppia porchetta di Ariccia, melanzane a funghetto, doppia provola affumicata e patatine fritte.',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=700&q=80',
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'special-maialino',
    name: 'Panino Maialino',
    icon: '🐷',
    category: 'panini_special',
    subCategory: 'doppia_carne',
    description: 'Doppia salsiccia, crema vellutata di melanzane, doppia provola, scaglie di Parmigiano Reggiano e polpette sul panino.',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80',
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'special-mitico',
    name: 'Panino Mitico',
    icon: '⚡',
    category: 'panini_special',
    subCategory: 'maxi',
    description: 'Doppio hamburger, doppia pancetta, doppio cheddar fuso, doppia cipolla caramellata, doppie patatine e doppi funghi.',
    price: 8.50,
    image: 'https://elcocinerofiel.com/wp-content/uploads/2026/02/Panino-de-Cotechino.jpg',
    badge: 'SUPER MAXI',
    availableExtras: PANINI_EXTRAS,
  },
  {
    id: 'special-kebab',
    name: 'Panino o Piadina Kebab',
    icon: '🥙',
    category: 'panini_special',
    subCategory: 'kebab',
    description: 'Kebab di carne mista speziata, contorni a scelta, provola affumicata e salse a piacere.',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=700&q=80',
    isPopular: true,
  },
  {
    id: 'special-componi',
    name: 'Componi il tuo Panino',
    icon: '🛠️',
    category: 'panini_special',
    subCategory: 'maxi',
    description: 'Personalizza il tuo panino: Scegli Carne + Contorno a scelta + Provola fusa + Salse a piacere.',
    price: 5.00,
    image: 'https://www.ilmondodelbarbecue.it/img/ybc_blog/post/17732217044856.jpg',
    badge: 'FAI DA TE',
    availableExtras: PANINI_EXTRAS,
  },

  // ==========================================
  // 5. GIRARROSTO
  // ==========================================
  {
    id: 'gira-pollo-patate',
    name: 'Pollo e Patate al Forno',
    icon: '🍗',
    category: 'girarrosto',
    subCategory: 'pollo',
    description: 'Pollo intero allo spiedo aromatizzato con erbe mediterranee, servito con ricca porzione di patate al forno.',
    price: 8.00,
    image: 'https://www.ricettealvolo.it/wp-content/uploads/2022/12/pollo-arrosto-patate.jpg',
    badge: 'PIÙ VENDUTO',
    isPopular: true,
  },
  {
    id: 'gira-salsiccia-spiedo',
    name: 'Salsiccia allo Spiedo con Patate',
    icon: '🌭',
    category: 'girarrosto',
    subCategory: 'spiedo',
    description: 'Salsiccia allo spiedo dorata alla brace con contorno di patate al forno (prezzo a pezzo).',
    price: 1.50,
    image: 'https://www.rovagnati.it/upl/ckuploads/images/Ricette/Salame/thumb_700x600_Spiedini%20con%20Salsiccia%20Secca%20Piccante%2C%20zucchine%20e%20patate.jpg',
  },
  {
    id: 'gira-coscia-tacchino',
    name: 'Coscia di Tacchino con Patate',
    icon: '🍖',
    category: 'girarrosto',
    subCategory: 'stinco',
    description: 'Coscia di tacchino gigante cotta lentamente allo spiedo, morbida e succulenta, con patate al forno.',
    price: 11.00,
    image: 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/008D9A29-130F-4BA6-99FA-E03E79789EF7/Derivates/3266400C-AAD4-4024-AA64-BFC45BAB10FF.jpg',
    badge: 'FORMATO MAXI',
  },
  {
    id: 'gira-spiedini-patate',
    name: 'Spiedini con Patate al Forno',
    icon: '🍢',
    category: 'girarrosto',
    subCategory: 'spiedo',
    description: 'Spiedino di carni miste e verdure con patate al forno croccanti (prezzo a pezzo).',
    price: 2.00,
    image: 'https://www.scarlino.it/wp-content/uploads/2020/04/spiedini-di-wurstel-scarlino-e-patate.jpg',
  },
  {
    id: 'gira-stinco-maiale',
    name: 'Stinco di Maiale con Patate',
    icon: '🍖',
    category: 'girarrosto',
    subCategory: 'stinco',
    description: 'Stinco di maiale cotto al forno con aromi e spezie fino a renderlo tenerissimo, servito con patate al forno.',
    price: 8.50,
    image: 'https://www.cucchiaio.it/content/dam/cucchiaio/it/ricette/2022/03/stinco-forno/stinco-al-forno-finale.jpg',
    badge: 'SPECIALITÀ',
    isPopular: true,
  },
  {
    id: 'gira-cosce-pollo',
    name: 'Cosce di Pollo con Patate al Forno',
    icon: '🍗',
    category: 'girarrosto',
    subCategory: 'pollo',
    description: 'Cosce di pollo succose e speziate con porzione di patate dorate al forno.',
    price: 3.00,
    image: 'https://www.moltofood.it/wp-content/uploads/2022/11/cosce-di-pollo.jpg',
  },

  // ==========================================
  // 6. GASTRONOMIA
  // ==========================================
  {
    id: 'gastro-primi-giorno',
    name: 'Primi del Giorno',
    icon: '🍝',
    category: 'gastronomia',
    subCategory: 'primi',
    description: 'Primo piatto caldo della tradizione partenopea (es. pasta e patate con provola, ragù, pasta e fagioli, lasagne).',
    price: 3.50,
    image: 'https://www.buttalapasta.it/wp-content/uploads/2016/01/pasta-spaghetti-alla-puttanesca.jpg',
    isPopular: true,
  },
  {
    id: 'gastro-secondo-giorno',
    name: 'Secondo del Giorno',
    icon: '🥩',
    category: 'gastronomia',
    subCategory: 'secondi',
    description: 'Secondo piatto di carne o verdure cotto ogni giorno dai nostri chef con contorno incluso.',
    price: 4.00,
    image: 'https://www.buttalapasta.it/wp-content/uploads/2022/07/agnello-al-forno.jpg',
  },
  {
    id: 'gastro-primo-mare',
    name: 'Primo di Mare (su prenotazione)',
    icon: '🦐',
    category: 'gastronomia',
    subCategory: 'mare',
    description: 'Spaghetti alle vongole veraci, risotto ai frutti di mare o calamarata con pescato fresco su prenotazione.',
    price: 5.00,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJIDCG9ei7YfEe6OCYH2ItbP79ydz2a9vptL04NCl4U_FD1hAoIWmZZqFp&s=10',
    badge: 'SU PRENOTAZIONE',
  },
  {
    id: 'gastro-secondo-mare',
    name: 'Secondo di Mare (su prenotazione)',
    icon: '🐟',
    category: 'gastronomia',
    subCategory: 'mare',
    description: 'Frittura di paranza, calamari e gamberi o pescato del giorno al forno su prenotazione.',
    price: 7.00,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkfW-GoAzwUZPC4lEVX2pm489r_JiHfqXtejJbcnT41USnc5wudyCvkYsn&s=10',
    badge: 'SU PRENOTAZIONE',
  },
  {
    id: 'gastro-contorni-stagione',
    name: 'Contorni di Stagione',
    icon: '🥗',
    category: 'gastronomia',
    subCategory: 'contorni',
    description: 'Friarielli, melanzane a funghetto, peperoni in padella, zucchine alla scapece o patate al forno.',
    price: 3.00,
    image: 'https://www.cucchiaio.it/content/cucchiaio/it/fotogallery/2020/01/ricette-contorni-invernali/jcr:content/header-par/gallery/editorialImagePreview.img.jpg/1736939394776.jpg',
    isVegetarian: true,
  },

  // ==========================================
  // 7. LE PATATE
  // ==========================================
  {
    id: 'pat-fritte',
    name: 'Patatine Fritte Classiche',
    icon: '🍟',
    category: 'patate',
    subCategory: 'classiche',
    description: 'Patatine a fiammifero fritte al momento in olio fresco. Croccanti, calde e dorate.',
    price: 2.50,
    image: 'https://www.soniaperonaci.it/wp-content/uploads/2024/04/Patatine-fritte-496x661.jpg',
    isVegetarian: true,
    availableExtras: PANZAROTTI_EXTRAS,
  },
  {
    id: 'pat-forno',
    name: 'Patate al Forno con Rosmarino',
    icon: '🥔',
    category: 'patate',
    subCategory: 'classiche',
    description: 'Patate a tocchetti cotte al forno con rosmarino fresco, aglio ed olio extravergine.',
    price: 2.50,
    image: 'https://www.prodottitipicitoscani.it/images/patate-al-forno-24-big.jpg',
    isVegetarian: true,
  },
  {
    id: 'pat-super',
    name: 'Patate Super',
    icon: '🧀',
    category: 'patate',
    subCategory: 'super',
    description: 'Salsiccia sbriciolata, wurstel a rondelle, kebab speziato, funghi e colata di provola affumicata.',
    price: 6.00,
    image: 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/5d188719e5fc521852ff2ac820ab0a70/Derivates/3dc34d0906f2d44e3cad789013fc8d3d58993355.jpg',
    badge: 'PIÙ RICHIESTO',
    isPopular: true,
  },
  {
    id: 'pat-kebab-provola',
    name: 'Patate con Kebab e Provola',
    icon: '🥙',
    category: 'patate',
    subCategory: 'super',
    description: 'Patatine fritte con straccetti di carne kebab speziata e provola campana fusa.',
    price: 4.00,
    image: 'https://klausenexpress.it/wp-content/uploads/2019/02/piattokebabpommes2.png',
    isPopular: true,
  },
  {
    id: 'pat-salsiccia-provola',
    name: 'Patate con Salsiccia e Provola',
    icon: '🌭',
    category: 'patate',
    subCategory: 'farcite',
    description: 'Patatine calde con salsiccia sbriciolata alla piastra e provola affumicata filante.',
    price: 4.00,
    image: 'https://www.piuricette.it/wp-content/uploads/2021/02/Schermata-2021-02-07-alle-11.37.29.png',
  },
  {
    id: 'pat-bacon-cheddar',
    name: 'Patate con Bacon e Cheddar',
    icon: '🥓',
    category: 'patate',
    subCategory: 'farcite',
    description: 'Patatine dorate ricoperte da abbondante colata di formaggio cheddar fuso e bacon croccante.',
    price: 4.00,
    image: 'https://cdn.agrodolce.it/CFyatnL-rRIZ7cGdJtaRbF9uXeo=/2300x1294/smart/https://www.agrodolce.it/app/uploads/2022/03/patate-fritte-con-formaggio.jpg',
    badge: 'GOLOSO',
    isPopular: true,
  },
  {
    id: 'pat-lime-pepe',
    name: 'Patate Lime e Pepe Rosa',
    icon: '🍋',
    category: 'patate',
    subCategory: 'farcite',
    description: 'Patatine fritte aromatizzate con scorzetta di lime fresco e granella di pepe rosa.',
    price: 4.00,
    image: 'https://i0.wp.com/ritaskitchen.org/wp-content/uploads/2022/10/IMG_4980.jpg?resize=920%2C600&ssl=1',
    isVegetarian: true,
  },
  {
    id: 'pat-cheddar-kebab-provola',
    name: 'Patate Cheddar Kebab Provola',
    icon: '🧀',
    category: 'patate',
    subCategory: 'super',
    description: 'Tris irresistibile: carne kebab, fonduta di cheddar caldo e provola filante su patatine.',
    price: 5.00,
    image: 'https://rs-menus-api.roocdn.com/images/9ce09c0d-205a-482b-b801-f1658e487d1c/image.jpeg',
  },

  // ==========================================
  // 8. ROSTICCERIA E FOCACCERIA
  // ==========================================
  {
    id: 'rost-margherita',
    name: 'Pizzetta Margherita',
    icon: '🍕',
    category: 'rosticceria',
    subCategory: 'pizzette',
    description: 'Pizzetta tonda morbida con pomodoro italiano, fior di latte e origano.',
    price: 1.00,
    image: 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/4F1526F0-0A46-4C87-A3D5-E80AD76C0D70/Derivates/df9a8be7-6ab2-4d5a-8c4d-6cbe8aceda72.jpg',
    isVegetarian: true,
    isPopular: true,
  },
  {
    id: 'rost-altri-gusti',
    name: 'Focaccia / Rustico (Tutti gli altri gusti)',
    icon: '🥪',
    category: 'rosticceria',
    subCategory: 'focacce',
    description: 'Focacce e rustici con gusti assortiti: salsiccia e friarielli, würstel e patatine, prosciutto e provola, diavola.',
    price: 1.50,
    image: 'https://static.tecnichenuove.it/cucinanaturale/2026/04/focaccia-ricotta-senza-caseina.jpg',
    isPopular: true,
  },

  // ==========================================
  // 9. BIBITE
  // ==========================================
  {
    id: 'bev-peroni-33',
    name: 'Peroni 33 cl',
    weight: '33 cl',
    icon: '🍺',
    category: 'bevande',
    subCategory: 'birre',
    description: 'Birra bionda lager italiana rinfrescante in bottiglia da 33 cl.',
    price: 1.00,
    image: 'https://i.imgur.com/5YRzY0G.jpg',
    isPopular: true,
  },
  {
    id: 'bev-peroni-66',
    name: 'Peroni 66 cl',
    weight: '66 cl',
    icon: '🍺',
    category: 'bevande',
    subCategory: 'birre',
    description: 'Birra bionda Peroni tradizionale formato grande 66 cl.',
    price: 2.00,
    image: 'https://i.imgur.com/hg3OQhR.jpg',
  },
  {
    id: 'bev-heineken-33',
    name: 'Heineken 33 cl',
    weight: '33 cl',
    icon: '🍺',
    category: 'bevande',
    subCategory: 'birre',
    description: 'Birra premium lager olandese servita ghiacciata 33 cl.',
    price: 1.50,
    image: 'https://i.imgur.com/5VKWmfj.jpg',
  },
  {
    id: 'bev-heineken-66',
    name: 'Heineken 66 cl',
    weight: '66 cl',
    icon: '🍺',
    category: 'bevande',
    subCategory: 'birre',
    description: 'Birra premium Heineken formato 66 cl.',
    price: 2.50,
    image: 'https://i.imgur.com/37i3nUv.jpg',
  },
  {
    id: 'bev-ceres',
    name: 'Ceres Strong Ale 33 cl',
    weight: '33 cl',
    icon: '🍺',
    category: 'bevande',
    subCategory: 'birre',
    description: 'Birra doppio malto danese dal gusto deciso 7.7% vol.',
    price: 3.50,
    image: 'https://i.imgur.com/utCFeLC.jpg',
    badge: 'DOPPIO MALTO',
  },
  {
    id: 'bev-tennents',
    name: 'Tennent’s Super 33 cl',
    weight: '33 cl',
    icon: '🍺',
    category: 'bevande',
    subCategory: 'birre',
    description: 'Strong lager scozzese corposa e intensa 9.0% vol.',
    price: 3.00,
    image: 'https://i.imgur.com/hrDB4Qv.jpg',
  },
  {
    id: 'bev-corona',
    name: 'Corona Extra 33 cl',
    weight: '33 cl',
    icon: '🍺',
    category: 'bevande',
    subCategory: 'birre',
    description: 'Birra messicana leggera e fresca servita con fetta di lime.',
    price: 3.00,
    image: 'https://i.imgur.com/PyjKYhU.jpg',
  },
  {
    id: 'bev-fischer',
    name: 'Fischer Tradizione 65 cl',
    weight: '65 cl',
    icon: '🍺',
    category: 'bevande',
    subCategory: 'birre',
    description: 'Birra bionda speciale alsaziana in bottiglia con tappo meccanico da 65 cl.',
    price: 5.00,
    image: 'https://i.imgur.com/ukZXwNw.jpg',
    badge: 'SPECIAL',
  },
  {
    id: 'bev-coca-cola-33',
    name: 'Coca Cola 33 cl',
    weight: '33 cl',
    icon: '🥤',
    category: 'bevande',
    subCategory: 'soft_drinks',
    description: 'Coca Cola classica in lattina da 33 cl servita fredda.',
    price: 1.00,
    image: 'https://i.imgur.com/k72G3YM.jpg',
    isPopular: true,
  },
  {
    id: 'bev-coca-cola-zero-33',
    name: 'Coca Cola Zero 33 cl',
    weight: '33 cl',
    icon: '🥤',
    category: 'bevande',
    subCategory: 'soft_drinks',
    description: 'Coca Cola Zero zuccheri in lattina da 33 cl.',
    price: 1.00,
    image: 'https://i.imgur.com/VFy8Qmr.jpg',
  },
  {
    id: 'bev-aranciata-33',
    name: 'Aranciata / Fanta 33 cl',
    weight: '33 cl',
    icon: '🍊',
    category: 'bevande',
    subCategory: 'soft_drinks',
    description: 'Aranciata frizzante agli agrumi in lattina da 33 cl.',
    price: 1.00,
    image: 'https://i.imgur.com/kaxnxTu.jpg',
  },
  {
    id: 'bev-nastro-33',
    name: 'Nastro Azzurro 33 cl',
    weight: '33 cl',
    icon: '🍺',
    category: 'bevande',
    subCategory: 'birre',
    description: 'Birra premium pilsner italiana 33 cl.',
    price: 1.50,
    image: 'https://i.imgur.com/xkYv4kl.jpg',
  },
  {
    id: 'bev-nastro-66',
    name: 'Nastro Azzurro 66 cl',
    weight: '66 cl',
    icon: '🍺',
    category: 'bevande',
    subCategory: 'birre',
    description: 'Birra Nastro Azzurro bottiglia formato 66 cl.',
    price: 2.50,
    image: 'https://i.imgur.com/R13Z1oL.jpg',
  },
  {
    id: 'bev-coca-1-5l',
    name: 'Coca Cola / Sprite 1.5 L',
    weight: '1.5 L',
    icon: '🥤',
    category: 'bevande',
    subCategory: 'soft_drinks',
    description: 'Bottiglia formato famiglia da 1.5 Litri (Coca Cola o Sprite).',
    price: 2.00,
    image: 'https://i.imgur.com/qUdUFxi.jpg',
  },
  {
    id: 'bev-aranciata-1-5l',
    name: 'Aranciata 1.5 L',
    weight: '1.5 L',
    icon: '🍊',
    category: 'bevande',
    subCategory: 'soft_drinks',
    description: 'Bottiglia formato famiglia da 1.5 Litri di aranciata.',
    price: 2.00,
    image: 'https://i.imgur.com/1iTAB1z.jpg',
  },
  {
    id: 'bev-acqua-50cl',
    name: 'Acqua Naturale 50 cl',
    weight: '50 cl',
    icon: '💧',
    category: 'bevande',
    subCategory: 'acqua_vino',
    description: 'Acqua minerale naturale in bottiglietta da 50 cl.',
    price: 1.00,
    image: 'https://i.imgur.com/QRbotdI.jpg',
    isVegetarian: true,
  },
  {
    id: 'bev-acqua-1-5l',
    name: 'Acqua Naturale 1.5 L',
    weight: '1.5 L',
    icon: '💧',
    category: 'bevande',
    subCategory: 'acqua_vino',
    description: 'Acqua minerale naturale in bottiglia da 1.5 Litri.',
    price: 1.50,
    image: 'https://i.imgur.com/ixrpvtW.jpg',
    isVegetarian: true,
  },
  {
    id: 'bev-acqua-frizz-1-5l',
    name: 'Acqua Frizzante 1.5 L',
    weight: '1.5 L',
    icon: '🫧',
    category: 'bevande',
    subCategory: 'acqua_vino',
    description: 'Acqua minerale effervescente naturale / frizzante in bottiglia da 1.5 Litri.',
    price: 1.50,
    image: 'https://i.imgur.com/mlvaebM.jpg',
    isVegetarian: true,
  },
  {
    id: 'bev-vino',
    name: 'Vino Locale della Casa',
    weight: '75 cl',
    icon: '🍷',
    category: 'bevande',
    subCategory: 'acqua_vino',
    description: 'Vino rosso o bianco tipico campano della casa (bottiglia).',
    price: 3.00,
    image: 'https://i.imgur.com/Tt92s6l.jpg',
    badge: 'CAMPANIA IGP',
  },
];

export const MENU_PRODUCTS: ProductItem[] = RAW_MENU_PRODUCTS.map((item) => {
  const tr = PRODUCT_TRANSLATIONS[item.id];
  const defaultExtras = Array.isArray(item.availableExtras)
    ? item.availableExtras.map(e => ({ ...e }))
    : getDefaultCategoryExtras(item.category).map(e => ({ ...e }));
  const defaultOriginalPrice =
    item.originalPrice !== undefined
      ? item.originalPrice
      : Number((item.price * 1.3).toFixed(2));

  return {
    ...item,
    originalPrice: defaultOriginalPrice,
    availableExtras: defaultExtras,
    nameRu: item.nameRu || tr?.nameRu,
    descriptionRu: item.descriptionRu || tr?.descriptionRu,
    nameEn: item.nameEn || tr?.nameEn,
    descriptionEn: item.descriptionEn || tr?.descriptionEn,
    nameDe: item.nameDe || tr?.nameDe || tr?.nameEn,
    descriptionDe: item.descriptionDe || tr?.descriptionDe || tr?.descriptionEn,
    nameFr: item.nameFr || tr?.nameFr || tr?.nameEn,
    descriptionFr: item.descriptionFr || tr?.descriptionFr || tr?.descriptionEn,
  };
});

export const STORE_SCHEDULE: Record<
  number,
  {
    name: string;
    nameEn: string;
    nameRu: string;
    nameDe: string;
    nameFr: string;
    hours: string;
    slots: string[];
    isClosed?: boolean;
  }
> = {
  0: {
    // Domenica
    name: 'Domenica',
    nameEn: 'Sunday',
    nameRu: 'Воскресенье',
    nameDe: 'Sonntag',
    nameFr: 'Dimanche',
    hours: '10:00 – 14:30',
    slots: [
      '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
      '13:00', '13:30', '14:00', '14:30'
    ]
  },
  1: {
    // Lunedì
    name: 'Lunedì',
    nameEn: 'Monday',
    nameRu: 'Понедельник',
    nameDe: 'Montag',
    nameFr: 'Lundi',
    hours: '19:30 – 23:00',
    slots: [
      '19:30', '19:45', '20:00', '20:15', '20:30', '20:45',
      '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00'
    ]
  },
  2: {
    // Martedì
    name: 'Martedì',
    nameEn: 'Tuesday',
    nameRu: 'Вторник',
    nameDe: 'Dienstag',
    nameFr: 'Mardi',
    hours: '19:30 – 23:00',
    slots: [
      '19:30', '19:45', '20:00', '20:15', '20:30', '20:45',
      '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00'
    ]
  },
  3: {
    // Mercoledì
    name: 'Mercoledì',
    nameEn: 'Wednesday',
    nameRu: 'Среда',
    nameDe: 'Mittwoch',
    nameFr: 'Mercredi',
    hours: '19:30 – 23:00',
    slots: [
      '19:30', '19:45', '20:00', '20:15', '20:30', '20:45',
      '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00'
    ]
  },
  4: {
    // Giovedì
    name: 'Giovedì',
    nameEn: 'Thursday',
    nameRu: 'Четверг',
    nameDe: 'Donnerstag',
    nameFr: 'Jeudi',
    hours: '19:30 – 23:00',
    slots: [
      '19:30', '19:45', '20:00', '20:15', '20:30', '20:45',
      '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00'
    ]
  },
  5: {
    // Venerdì
    name: 'Venerdì',
    nameEn: 'Friday',
    nameRu: 'Пятница',
    nameDe: 'Freitag',
    nameFr: 'Vendredi',
    hours: '19:30 – 23:00',
    slots: [
      '19:30', '19:45', '20:00', '20:15', '20:30', '20:45',
      '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00'
    ]
  },
  6: {
    // Sabato
    name: 'Sabato',
    nameEn: 'Saturday',
    nameRu: 'Суббота',
    nameDe: 'Samstag',
    nameFr: 'Samedi',
    hours: '19:30 – 23:00',
    slots: [
      '19:30', '19:45', '20:00', '20:15', '20:30', '20:45',
      '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00'
    ]
  }
};

export const STORE_DETAILS = {
  name: 'Panzarotto Pompei',
  address: 'Via Provinciale Ripuaria, 133, 80045 Pompei (NA)',
  phone: '+39 081 850 1234',
  whatsapp: '+39 347 123 4567',
  whatsappClean: '393471234567',
  email: 'info@panzarotto.it',
  hours: 'Lun–Sab: 19:30–23:00 | Dom: 10:00–14:30',
  city: 'Pompei (NA)',
  freeDeliveryThreshold: 25,
  deliveryFee: 5.00,
  minOrderDelivery: 10.00,
  asportoEstimatedMins: 20,
  deliveryEstimatedMins: 35,
  instagram: 'https://instagram.com/panzarotto_pompei',
  instagramHandle: '@panzarotto_pompei',
  facebook: 'https://facebook.com/panzarottopompei',
  tiktok: 'https://tiktok.com/@panzarotto_pompei',
};

export const REVIEWS_DATA = [
  {
    id: 'r1',
    name: 'Marco De Luca',
    city: 'Pompei (NA)',
    rating: 5,
    date: '2 giorni fa',
    text: 'I migliori panzerotti e panini di tutta la zona vesuviana! Frittura dorata, asciutta e saporita.',
    textEn: 'The best panzerotti and sandwiches in the whole Vesuvius area! Golden, crispy and savory frying.',
    textRu: 'Лучшие панцеротти и панини во всей округе! Золотистая, хрустящая и нежная корочка.',
    badge: 'Cliente Abituale',
  },
  {
    id: 'r2',
    name: 'Chiara Esposito',
    city: 'Scafati (SA)',
    rating: 5,
    date: '1 settimana fa',
    text: 'Consegna a domicilio rapidissima a Scafati. Pollo allo spiedo morbidissimo e crocchè giganti squisiti.',
    textEn: 'Super fast delivery to Scafati. Tender rotisserie chicken and delicious giant croquettes.',
    textRu: 'Быстрая доставка на дом. Нежнейшая курочка гриль и огромные вкусные крокеты.',
    badge: 'Acquisto Verificato',
  },
  {
    id: 'r3',
    name: 'Antonio Russo',
    city: 'Torre Annunziata (NA)',
    rating: 5,
    date: '3 settimane fa',
    text: 'Pranzo di lavoro da 7€ imbattibile per qualità e quantità! Ingredienti freschissimi ogni giorno.',
    textEn: 'Unbeatable €7 business lunch for quality and quantity! Super fresh daily ingredients.',
    textRu: 'Бизнес-ланч за 7€ непревзойденный по качеству и сытности! Свежие ингредиенты каждый день.',
    badge: 'Pranzo di Lavoro',
  },
];

export const INITIAL_SAMPLE_CART_ITEMS = [
  {
    id: 'sample-cart-1',
    cartItemId: 'sample-cart-1',
    productId: 'frig-panzarotto',
    product: MENU_PRODUCTS[1] || MENU_PRODUCTS[0], // Panzarotto
    quantity: 1,
    selectedExtras: [],
    unitPrice: 1.50,
    totalUnitPrice: 1.50,
    totalPrice: 1.50,
    specialNotes: '',
  },
  {
    id: 'sample-cart-2',
    cartItemId: 'sample-cart-2',
    productId: 'frig-crocche',
    product: MENU_PRODUCTS[2] || MENU_PRODUCTS[1], // Crocchè Classico Napoletano
    quantity: 2,
    selectedExtras: [],
    unitPrice: 1.00,
    totalUnitPrice: 1.00,
    totalPrice: 2.00,
    specialNotes: '',
  },
];

