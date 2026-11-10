import { ExtraOption, ProductItem, CategoryId, Language } from '../types';
import {
  LABRIOUT_CATEGORY_CONFIGS,
  LABRIOUT_MENU_PRODUCTS,
  LABRIOUT_EXTRAS,
} from './labrioutMenuData';

export interface MenuCategoryConfig {
  id: CategoryId;
  key: string;
  label: string;
  subtitle: string;
  icon: string;
  image: string;
  subFilters: { id: string; label: string }[];
}

export const CATEGORY_CONFIGS: MenuCategoryConfig[] = LABRIOUT_CATEGORY_CONFIGS;

// Top 4 core showcase categories that fit perfectly in the visible top viewport
export const SHOWCASE_CATEGORIES: MenuCategoryConfig[] = [
  LABRIOUT_CATEGORY_CONFIGS[0], // Smash Burgers & Hot-Dog
  LABRIOUT_CATEGORY_CONFIGS[1], // Pitas, Laffas & Baguettes
  LABRIOUT_CATEGORY_CONFIGS[2], // Assiettes Gourmandes
  LABRIOUT_CATEGORY_CONFIGS[3], // Salades Fraîcheur
];

export const DEFAULT_EXTRAS: ExtraOption[] = LABRIOUT_EXTRAS;

export function getDefaultCategoryExtras(category?: CategoryId | string): ExtraOption[] {
  if (category === 'bevande' || category === 'patate') {
    return [];
  }
  return LABRIOUT_EXTRAS;
}

export function getAvailableExtrasForProduct(product: ProductItem): ExtraOption[] {
  if (Array.isArray(product.availableExtras)) {
    return product.availableExtras;
  }
  return getDefaultCategoryExtras(product.category);
}

export const MENU_PRODUCTS: ProductItem[] = LABRIOUT_MENU_PRODUCTS;

const LABRIOUT_DAILY_SLOTS = [
  '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00',
  '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15'
];

export const STORE_SCHEDULE: Record<
  number,
  {
    name: string;
    nameEn: string;
    nameRu: string;
    nameDe: string;
    nameFr: string;
    nameIt: string;
    hours: string;
    slots: string[];
    isClosed?: boolean;
  }
> = {
  0: {
    name: 'Domenica',
    nameEn: 'Sunday',
    nameRu: 'Воскресенье',
    nameDe: 'Sonntag',
    nameFr: 'Dimanche',
    nameIt: 'Domenica',
    hours: '12:00 – 22:15',
    slots: LABRIOUT_DAILY_SLOTS,
  },
  1: {
    name: 'Lunedì',
    nameEn: 'Monday',
    nameRu: 'Понедельник',
    nameDe: 'Montag',
    nameFr: 'Lundi',
    nameIt: 'Lunedì',
    hours: '12:00 – 22:15',
    slots: LABRIOUT_DAILY_SLOTS,
  },
  2: {
    name: 'Martedì',
    nameEn: 'Tuesday',
    nameRu: 'Вторник',
    nameDe: 'Dienstag',
    nameFr: 'Mardi',
    nameIt: 'Martedì',
    hours: '12:00 – 22:15',
    slots: LABRIOUT_DAILY_SLOTS,
  },
  3: {
    name: 'Mercoledì',
    nameEn: 'Wednesday',
    nameRu: 'Среда',
    nameDe: 'Mittwoch',
    nameFr: 'Mercredi',
    nameIt: 'Mercoledì',
    hours: '12:00 – 22:15',
    slots: LABRIOUT_DAILY_SLOTS,
  },
  4: {
    name: 'Giovedì',
    nameEn: 'Thursday',
    nameRu: 'Четверг',
    nameDe: 'Donnerstag',
    nameFr: 'Jeudi',
    nameIt: 'Giovedì',
    hours: '12:00 – 22:15',
    slots: LABRIOUT_DAILY_SLOTS,
  },
  5: {
    name: 'Venerdì',
    nameEn: 'Friday',
    nameRu: 'Пятница',
    nameDe: 'Freitag',
    nameFr: 'Vendredi',
    nameIt: 'Venerdì',
    hours: '12:00 – 15:00',
    slots: [
      '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00'
    ],
  },
  6: {
    name: 'Sabato',
    nameEn: 'Saturday',
    nameRu: 'Суббота',
    nameDe: 'Samstag',
    nameFr: 'Samedi',
    nameIt: 'Sabato',
    hours: '12:00 – 22:15',
    slots: LABRIOUT_DAILY_SLOTS,
  },
};

export function getScheduleDayName(dayIdx: number, lang: Language): string {
  const sched = STORE_SCHEDULE[dayIdx];
  if (!sched) return '';
  if (lang === 'en') return sched.nameEn;
  if (lang === 'ru') return sched.nameRu;
  if (lang === 'de') return sched.nameDe;
  if (lang === 'it') return sched.nameIt;
  return sched.nameFr;
}

export const STORE_DETAILS = {
  name: 'LABRIOUT',
  address: '64 av. Simone Veil, Bonneuil-sur-Marne',
  phone: '0769774086',
  whatsapp: '0769774086',
  whatsappClean: '33769774086',
  email: 'labriout@eat-view.local.',
  hours: '12h-15h 18h-22h15',
  city: 'Bonneuil-sur-Marne',
  freeDeliveryThreshold: 30,
  deliveryFee: 3.50,
  minOrderDelivery: 15.00,
  asportoEstimatedMins: 15,
  deliveryEstimatedMins: 30,
  instagram: 'https://instagram.com/labriout_94',
  instagramHandle: '@labriout_94',
  facebook: 'https://facebook.com',
  tiktok: 'https://tiktok.com',
};

export const REVIEWS_DATA = [
  {
    id: 'r1',
    name: 'David Cohen',
    city: 'Bonneuil-sur-Marne (94)',
    rating: 5,
    date: 'Il y a 2 jours',
    dateFr: 'Il y a 2 jours',
    dateEn: '2 days ago',
    dateDe: 'Vor 2 Tagen',
    dateIt: '2 giorni fa',
    dateRu: '2 дня назад',
    text: 'Les meilleurs Smash Burgers et Shawarmas casher du 94 ! Viande ultra juteuse, pain laffa chaud et accueil toujours chaleureux.',
    textFr: 'Les meilleurs Smash Burgers et Shawarmas casher du 94 ! Viande ultra juteuse, pain laffa chaud et accueil toujours chaleureux.',
    textEn: 'The best kosher Smash Burgers and Shawarma in Val-de-Marne! Super juicy meat, warm laffa flatbread and always a warm welcome.',
    textDe: 'Die besten koscheren Smash Burger und Shawarmas im Val-de-Marne! Unglaublich saftiges Fleisch, warmes Laffa-Brot und immer herzlicher Empfang.',
    textIt: 'I migliori Smash Burger e Shawarma kosher della Val-de-Marne! Carne super succosa, pane laffa caldo e accoglienza sempre calorosa.',
    textRu: 'Лучшие кошерные смэш-бургеры и шаурма в Валь-де-Марн! Невероятно сочное мясо, теплая лаффа и всегда радушный прием.',
    badge: 'Client Fidèle',
    badgeFr: 'Client Fidèle',
    badgeEn: 'Loyal Guest',
    badgeDe: 'Stammgast',
    badgeIt: 'Cliente Fedele',
    badgeRu: 'Постоянный гость',
  },
  {
    id: 'r2',
    name: 'Sarah Lévy',
    city: 'Créteil (94)',
    rating: 5,
    date: 'Il y a 1 semaine',
    dateFr: 'Il y a 1 semaine',
    dateEn: '1 week ago',
    dateDe: 'Vor 1 Woche',
    dateIt: '1 settimana fa',
    dateRu: '1 неделю назад',
    text: 'Livraison rapide à Créteil ! L’Assiette Duo Parguit & Schnitzel avec houmous maison et frites de patates douces est un pur délice.',
    textFr: 'Livraison rapide à Créteil ! L’Assiette Duo Parguit & Schnitzel avec houmous maison et frites de patates douces est un pur délice.',
    textEn: 'Fast delivery to Créteil! The Duo Plate with Parguit & Schnitzel, homemade hummus and sweet potato fries is an absolute delight.',
    textDe: 'Schnelle Lieferung nach Créteil! Der Duo-Teller mit Parguit & Schnitzel, hausgemachtem Hummus und Süßkartoffel-Pommes ist ein purer Genuss.',
    textIt: 'Consegna rapida a Créteil! Il Piatto Duo con Parguit e Schnitzel, hummus fatto in casa e patatine dolci è una vera delizia.',
    textRu: 'Быстрая доставка в Кретей! Тарелка Дуо с паргитом, шницелем, домашним хумусом и бататом фри — просто восторг.',
    badge: 'Commande Vérifiée',
    badgeFr: 'Commande Vérifiée',
    badgeEn: 'Verified Order',
    badgeDe: 'Verifizierte Bestellung',
    badgeIt: 'Ordine Verificato',
    badgeRu: 'Проверенный заказ',
  },
  {
    id: 'r3',
    name: 'Yoni Haddad',
    city: 'Saint-Maur-des-Fossés (94)',
    rating: 5,
    date: 'Il y a 2 semaines',
    dateFr: 'Il y a 2 semaines',
    dateEn: '2 weeks ago',
    dateDe: 'Vor 2 Wochen',
    dateIt: '2 settimane fa',
    dateRu: '2 недели назад',
    text: 'Enfin un vrai street-food 100% Casher Badatz de Brunoy où tout est fait maison ! Le Burger Revisité au veau pressé et avocat est incroyable.',
    textFr: 'Enfin un vrai street-food 100% Casher Badatz de Brunoy où tout est fait maison ! Le Burger Revisité au veau pressé et avocat est incroyable.',
    textEn: 'Finally a real 100% Kosher Badatz de Brunoy street-food spot where everything is homemade! The Revisited Burger with pressed veal is incredible.',
    textDe: 'Endlich echtes Streetfood 100% Koscher Badatz de Brunoy, wo alles hausgemacht ist! Der Burger Revisité mit Kalbs-Bacon und Avocado ist unglaublich.',
    textIt: 'Finalmente un vero street-food 100% Kosher Badatz de Brunoy dove tutto è fatto in casa! Il Burger Revisité con vitello pressato e avocado è incredibile.',
    textRu: 'Наконец-то настоящий стритфуд 100% Кошер Бадац де Брюнуа, где всё готовится вручную! Бургер с прессованной телятиной и авокадо невероятен.',
    badge: '100% Casher',
    badgeFr: '100% Casher',
    badgeEn: '100% Kosher',
    badgeDe: '100% Koscher',
    badgeIt: '100% Kosher',
    badgeRu: '100% Кошер',
  },
];

export function getLocalizedReviewText(rev: (typeof REVIEWS_DATA)[number], lang: Language): string {
  if (lang === 'en') return rev.textEn || rev.text;
  if (lang === 'de') return rev.textDe || rev.textEn || rev.text;
  if (lang === 'it') return rev.textIt || rev.textEn || rev.text;
  if (lang === 'ru') return rev.textRu || rev.text;
  return rev.textFr || rev.text;
}

export function getLocalizedReviewDate(rev: (typeof REVIEWS_DATA)[number], lang: Language): string {
  if (lang === 'en') return rev.dateEn || rev.date;
  if (lang === 'de') return rev.dateDe || rev.dateEn || rev.date;
  if (lang === 'it') return rev.dateIt || rev.dateEn || rev.date;
  if (lang === 'ru') return rev.dateRu || rev.date;
  return rev.dateFr || rev.date;
}

export function getLocalizedReviewBadge(rev: (typeof REVIEWS_DATA)[number], lang: Language): string {
  if (lang === 'en') return rev.badgeEn || rev.badge;
  if (lang === 'de') return rev.badgeDe || rev.badgeEn || rev.badge;
  if (lang === 'it') return rev.badgeIt || rev.badgeEn || rev.badge;
  if (lang === 'ru') return rev.badgeRu || rev.badge;
  return rev.badgeFr || rev.badge;
}

export const INITIAL_SAMPLE_CART_ITEMS = [
  {
    id: 'sample-cart-1',
    cartItemId: 'sample-cart-1',
    productId: 'lab-burger-double-smash',
    product: MENU_PRODUCTS[1] || MENU_PRODUCTS[0],
    quantity: 1,
    selectedExtras: [],
    unitPrice: 13.00,
    totalUnitPrice: 13.00,
    totalPrice: 13.00,
    specialNotes: '',
  },
  {
    id: 'sample-cart-2',
    cartItemId: 'sample-cart-2',
    productId: 'lab-pita-shawarma',
    product: MENU_PRODUCTS[11] || MENU_PRODUCTS[0],
    quantity: 1,
    selectedExtras: [],
    unitPrice: 11.00,
    totalUnitPrice: 11.00,
    totalPrice: 11.00,
    specialNotes: '',
  },
];
