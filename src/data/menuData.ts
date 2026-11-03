import { ExtraOption, ProductItem, CategoryId } from '../types';
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
    hours: string;
    slots: string[];
    isClosed?: boolean;
  }
> = {
  0: {
    name: 'Dimanche',
    nameEn: 'Sunday',
    nameRu: 'Воскресенье',
    nameDe: 'Sonntag',
    nameFr: 'Dimanche',
    hours: '12:00 – 22:15',
    slots: LABRIOUT_DAILY_SLOTS,
  },
  1: {
    name: 'Lundi',
    nameEn: 'Monday',
    nameRu: 'Понедельник',
    nameDe: 'Montag',
    nameFr: 'Lundi',
    hours: '12:00 – 22:15',
    slots: LABRIOUT_DAILY_SLOTS,
  },
  2: {
    name: 'Mardi',
    nameEn: 'Tuesday',
    nameRu: 'Вторник',
    nameDe: 'Dienstag',
    nameFr: 'Mardi',
    hours: '12:00 – 22:15',
    slots: LABRIOUT_DAILY_SLOTS,
  },
  3: {
    name: 'Mercredi',
    nameEn: 'Wednesday',
    nameRu: 'Среда',
    nameDe: 'Mittwoch',
    nameFr: 'Mercredi',
    hours: '12:00 – 22:15',
    slots: LABRIOUT_DAILY_SLOTS,
  },
  4: {
    name: 'Jeudi',
    nameEn: 'Thursday',
    nameRu: 'Четверг',
    nameDe: 'Donnerstag',
    nameFr: 'Jeudi',
    hours: '12:00 – 22:15',
    slots: LABRIOUT_DAILY_SLOTS,
  },
  5: {
    name: 'Vendredi',
    nameEn: 'Friday',
    nameRu: 'Пятница',
    nameDe: 'Freitag',
    nameFr: 'Vendredi',
    hours: '12:00 – 15:00',
    slots: [
      '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00'
    ],
  },
  6: {
    name: 'Samedi',
    nameEn: 'Saturday',
    nameRu: 'Суббота',
    nameDe: 'Samstag',
    nameFr: 'Samedi',
    hours: '12:00 – 22:15',
    slots: LABRIOUT_DAILY_SLOTS,
  }
};

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
    text: 'Les meilleurs Smash Burgers et Shawarmas casher du 94 ! Viande ultra juteuse, pain laffa chaud et accueil toujours chaleureux.',
    textEn: 'The best kosher Smash Burgers and Shawarma in Val-de-Marne! Super juicy meat, warm laffa flatbread and always a warm welcome.',
    textRu: 'Лучшие кошерные смэш-бургеры и шаурма в Валь-де-Марн! Невероятно сочное мясо, теплая лаффа и всегда радушный прием.',
    badge: 'Client Fidèle',
  },
  {
    id: 'r2',
    name: 'Sarah Lévy',
    city: 'Créteil (94)',
    rating: 5,
    date: 'Il y a 1 semaine',
    text: 'Livraison rapide à Créteil ! L’Assiette Duo Parguit & Schnitzel avec houmous maison et frites de patates douces est un pur délice.',
    textEn: 'Fast delivery to Créteil! The Duo Plate with Parguit & Schnitzel, homemade hummus and sweet potato fries is an absolute delight.',
    textRu: 'Быстрая доставка в Кретей! Тарелка Дуо с паргитом, шницелем, домашним хумусом и бататом фри — просто восторг.',
    badge: 'Commande Vérifiée',
  },
  {
    id: 'r3',
    name: 'Yoni Haddad',
    city: 'Saint-Maur-des-Fossés (94)',
    rating: 5,
    date: 'Il y a 2 semaines',
    text: 'Enfin un vrai street-food 100% Casher Badatz de Brunoy où tout est fait maison ! Le Burger Revisité au veau pressé et avocat est incroyable.',
    textEn: 'Finally a real 100% Kosher Badatz de Brunoy street-food spot where everything is homemade! The Revisited Burger with pressed veal is incredible.',
    textRu: 'Наконец-то настоящий стритфуд 100% Кошер Бадац де Брюнуа, где всё готовится вручную! Бургер с прессованной телятиной и авокадо невероятен.',
    badge: '100% Casher',
  },
];

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
