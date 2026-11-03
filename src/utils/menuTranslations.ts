import { Language, ProductItem, CategoryId } from '../types';

export const CATEGORY_LABELS: Record<CategoryId, Record<Language, string>> = {
  panini: {
    fr: 'Smash Burgers & Hot-Dog',
    ru: 'Смэш Бургеры и Хот-Дог',
    en: 'Smash Burgers & Hot-Dog',
    de: 'Smash Burgers & Hot-Dog',
    it: 'Smash Burgers & Hot-Dog',
  },
  panini_special: {
    fr: 'Pitas, Laffas & Baguettes',
    ru: 'Питы, Лаффы и Багеты',
    en: 'Pitas, Laffas & Baguettes',
    de: 'Pitas, Laffas & Baguettes',
    it: 'Pitas, Laffas & Baguettes',
  },
  girarrosto: {
    fr: 'Assiettes Gourmandes',
    ru: 'Сытные Тарелки (Assiettes)',
    en: 'Gourmet Platters',
    de: 'Gourmet-Teller',
    it: 'Assiettes Gourmandes',
  },
  gastronomia: {
    fr: 'Salades Fraîcheur',
    ru: 'Свежие Салаты',
    en: 'Fresh Salads',
    de: 'Frische Salate',
    it: 'Salades Fraîcheur',
  },
  friggitoria: {
    fr: 'Entrées & Accompagnements',
    ru: 'Закуски и Гарниры',
    en: 'Starters & Sides',
    de: 'Vorspeisen & Beilagen',
    it: 'Entrées & Accompagnements',
  },
  pranzo: {
    fr: 'Menu Enfants',
    ru: 'Детское Меню',
    en: 'Kids Menu',
    de: 'Kindermenü',
    it: 'Menu Enfants',
  },
  patate: {
    fr: 'Extras & Toppings',
    ru: 'Добавки и Топпинги',
    en: 'Extras & Toppings',
    de: 'Extras & Toppings',
    it: 'Extras & Toppings',
  },
  bevande: {
    fr: 'Boissons Fraîches',
    ru: 'Прохладительные Напитки',
    en: 'Cold Drinks',
    de: 'Kaltgetränke',
    it: 'Boissons Fraîches',
  },
  rosticceria: {
    fr: 'Spécialités Maison',
    ru: 'Фирменные Блюда',
    en: 'House Specialties',
    de: 'Hausspezialitäten',
    it: 'Spécialités Maison',
  },
};

export const SUBFILTER_LABELS: Record<string, Record<Language, string>> = {
  tutti: {
    fr: 'Tout voir',
    ru: 'Все блюда',
    en: 'All',
    de: 'Alle',
    it: 'Tutti',
  },
  smash: {
    fr: 'Smash Burgers',
    ru: 'Смэш Бургеры',
    en: 'Smash Burgers',
    de: 'Smash Burgers',
    it: 'Smash Burgers',
  },
  classic: {
    fr: 'Classiques & Poulet',
    ru: 'Классика и Курица',
    en: 'Classics & Chicken',
    de: 'Klassiker & Hähnchen',
    it: 'Classiques & Poulet',
  },
  shawarma_viande: {
    fr: 'Shawarma & Viandes',
    ru: 'Шаурма и Мясо гриль',
    en: 'Shawarma & Grilled Meats',
    de: 'Shawarma & Fleisch',
    it: 'Shawarma & Viandes',
  },
  falafel_veggie: {
    fr: 'Falafel & Végétarien',
    ru: 'Фалафель и Вегетарианское',
    en: 'Falafel & Vegetarian',
    de: 'Falafel & Vegetarisch',
    it: 'Falafel & Végétarien',
  },
};

export const BADGE_LABELS: Record<string, Record<Language, string>> = {
  'BEST-SELLER': {
    fr: 'BEST-SELLER',
    ru: 'ХИТ ПРОДАЖ',
    en: 'BEST-SELLER',
    de: 'BESTSELLER',
    it: 'BEST-SELLER',
  },
  'DOUBLE SMASH': {
    fr: 'DOUBLE SMASH',
    ru: 'ДВОЙНОЙ СМЭШ',
    en: 'DOUBLE SMASH',
    de: 'DOUBLE SMASH',
    it: 'DOUBLE SMASH',
  },
  'TRIPLE SMASH': {
    fr: 'TRIPLE SMASH',
    ru: 'ТРОЙНОЙ СМЭШ',
    en: 'TRIPLE SMASH',
    de: 'TRIPLE SMASH',
    it: 'TRIPLE SMASH',
  },
  'RECETTE MAISON': {
    fr: 'RECETTE MAISON',
    ru: 'ДОМАШНИЙ РЕЦЕПТ',
    en: 'HOMEMADE RECIPE',
    de: 'HAUSREZEPT',
    it: 'RECETTE MAISON',
  },
  'CRUNCHY': {
    fr: 'CRUNCHY',
    ru: 'ХРУСТЯЩИЙ',
    en: 'CRUNCHY',
    de: 'KNUSPRIG',
    it: 'CRUNCHY',
  },
  'SIGNATURE': {
    fr: 'SIGNATURE',
    ru: 'ФИРМЕННЫЙ',
    en: 'SIGNATURE',
    de: 'SIGNATURE',
    it: 'SIGNATURE',
  },
  'SPÉCIALITÉ': {
    fr: 'SPÉCIALITÉ',
    ru: 'СПЕЦИАЛИТЕТ',
    en: 'SPECIALTY',
    de: 'SPEZIALITÄT',
    it: 'SPÉCIALITÉ',
  },
  'VÉGÉTARIEN': {
    fr: 'VÉGÉTARIEN',
    ru: 'ВЕГЕТАРИАНСКОЕ',
    en: 'VEGETARIAN',
    de: 'VEGETARISCH',
    it: 'VÉGÉTARIEN',
  },
  'FAIT MAISON': {
    fr: 'FAIT MAISON',
    ru: 'ДОМАШНЕЕ',
    en: 'HOMEMADE',
    de: 'HAUSGEMACHT',
    it: 'FAIT MAISON',
  },
  'GOURMAND': {
    fr: 'GOURMAND',
    ru: 'ГУРМЭ',
    en: 'GOURMET',
    de: 'GOURMET',
    it: 'GOURMAND',
  },
  'FRAÎCHEUR': {
    fr: 'FRAÎCHEUR',
    ru: 'СВЕЖЕСТЬ',
    en: 'FRESH',
    de: 'FRISCH',
    it: 'FRAÎCHEUR',
  },
  'ENFANTS': {
    fr: 'MENU ENFANT',
    ru: 'ДЕТЯМ',
    en: 'KIDS MENU',
    de: 'KINDERMENÜ',
    it: 'MENU ENFANT',
  },
};

export const PRODUCT_TRANSLATIONS: Record<
  string,
  {
    nameRu: string;
    descriptionRu: string;
    nameEn: string;
    descriptionEn: string;
    nameDe?: string;
    descriptionDe?: string;
    nameFr?: string;
    descriptionFr?: string;
  }
> = {};

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
  if (language === 'fr') return product.nameFr || tr?.nameFr || product.name;
  return product.name;
}

export function getLocalizedProductDescription(product: ProductItem, language: Language): string {
  const tr = PRODUCT_TRANSLATIONS[product.id];
  if (language === 'ru') return product.descriptionRu || tr?.descriptionRu || product.description;
  if (language === 'en') return product.descriptionEn || tr?.descriptionEn || product.description;
  if (language === 'de') return product.descriptionDe || tr?.descriptionDe || product.descriptionEn || tr?.descriptionEn || product.description;
  if (language === 'fr') return product.descriptionFr || tr?.descriptionFr || product.description;
  return product.description;
}
