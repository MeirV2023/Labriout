import { Language, ProductItem, CategoryId, ExtraOption, SelectedExtra } from '../types';
import { LABRIOUT_EXTRAS } from '../data/labrioutMenuData';

export const CATEGORY_LABELS: Partial<Record<CategoryId, Record<Language, string>>> = {
  tutti: {
    fr: 'Tout le menu',
    ru: 'Всё меню',
    en: 'Full Menu',
    de: 'Gesamte Speisekarte',
    it: 'Tutto il menù',
  },
  panini: {
    fr: 'Smash Burgers & Hot-Dog',
    ru: 'Смэш Бургеры и Хот-Дог',
    en: 'Smash Burgers & Hot-Dog',
    de: 'Smash Burger & Hot-Dog',
    it: 'Smash Burger & Hot-Dog',
  },
  panini_special: {
    fr: 'Pitas, Laffas & Baguettes',
    ru: 'Питы, Лаффы и Багеты',
    en: 'Pitas, Laffas & Baguettes',
    de: 'Pitas, Laffas & Baguettes',
    it: 'Pita, Laffa & Baguette',
  },
  girarrosto: {
    fr: 'Assiettes Gourmandes',
    ru: 'Сытные Тарелки (Assiettes)',
    en: 'Gourmet Platters',
    de: 'Gourmet-Teller',
    it: 'Piatti Gourmet',
  },
  gastronomia: {
    fr: 'Salades Fraîcheur',
    ru: 'Свежие Салаты',
    en: 'Fresh Salads',
    de: 'Frische Salate',
    it: 'Insalate Fresche',
  },
  friggitoria: {
    fr: 'Entrées & Accompagnements',
    ru: 'Закуски и Гарниры',
    en: 'Starters & Sides',
    de: 'Vorspeisen & Beilagen',
    it: 'Antipasti & Contorni',
  },
  pranzo: {
    fr: 'Menu Enfants',
    ru: 'Детское Меню',
    en: 'Kids Menu',
    de: 'Kindermenü',
    it: 'Menù Bambini',
  },
  patate: {
    fr: 'Extras & Toppings',
    ru: 'Добавки и Топпинги',
    en: 'Extras & Toppings',
    de: 'Extras & Toppings',
    it: 'Extra & Topping',
  },
  bevande: {
    fr: 'Boissons Fraîches',
    ru: 'Прохладительные Напитки',
    en: 'Cold Drinks',
    de: 'Kaltgetränke',
    it: 'Bevande Fresche',
  },
  rosticceria: {
    fr: 'Spécialités Maison',
    ru: 'Фирменные Блюда',
    en: 'House Specialties',
    de: 'Hausspezialitäten',
    it: 'Specialità della Casa',
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
  tutti_panini: {
    fr: 'Tous les Burgers',
    ru: 'Все Бургеры',
    en: 'All Burgers',
    de: 'Alle Burger',
    it: 'Tutti i Burger',
  },
  tutti_pita: {
    fr: 'Toutes Pitas & Baguettes',
    ru: 'Все Питы и Багеты',
    en: 'All Pitas & Baguettes',
    de: 'Alle Pitas & Baguettes',
    it: 'Tutte le Pita & Baguette',
  },
  smash: {
    fr: 'Smash Burgers',
    ru: 'Смэш Бургеры',
    en: 'Smash Burgers',
    de: 'Smash Burger',
    it: 'Smash Burger',
  },
  classic: {
    fr: 'Classiques & Poulet',
    ru: 'Классика и Курица',
    en: 'Classics & Chicken',
    de: 'Klassiker & Hähnchen',
    it: 'Classici & Pollo',
  },
  shawarma_viande: {
    fr: 'Shawarma & Viandes',
    ru: 'Шаурма и Мясо гриль',
    en: 'Shawarma & Grilled Meats',
    de: 'Shawarma & Grillfleisch',
    it: 'Shawarma & Carni',
  },
  falafel_veggie: {
    fr: 'Falafel & Végétarien',
    ru: 'Фалафель и Вегетарианское',
    en: 'Falafel & Vegetarian',
    de: 'Falafel & Vegetarisch',
    it: 'Falafel & Vegetariano',
  },
};

export const BADGE_LABELS: Record<string, Record<Language, string>> = {
  'BEST-SELLER': {
    fr: 'BEST-SELLER',
    ru: 'ХИТ ПРОДАЖ',
    en: 'BEST-SELLER',
    de: 'BESTSELLER',
    it: 'PIÙ VENDUTO',
  },
  'PIÙ AMATO': {
    fr: 'COUP DE CŒUR',
    ru: 'ЛЮБИМЫЙ ВЫБОР',
    en: 'MOST LOVED',
    de: 'AM BELIEBTESTEN',
    it: 'PIÙ AMATO',
  },
  SPECIALE: {
    fr: 'SPÉCIAL',
    ru: 'ОСОБЫЙ',
    en: 'SPECIAL',
    de: 'SPEZIAL',
    it: 'SPECIALE',
  },
  'MAXI CHEESE': {
    fr: 'MAXI CHEESE',
    ru: 'МАКСИ СЫР',
    en: 'MAXI CHEESE',
    de: 'MAXI CHEESE',
    it: 'MAXI CHEESE',
  },
  'SIGNATURE CHEF': {
    fr: 'SIGNATURE CHEF',
    ru: 'ОТ ШЕФА',
    en: "CHEF'S SIGNATURE",
    de: 'CHEF-SPEZIAL',
    it: 'FIRMA DELLO CHEF',
  },
  'SHAWARMA MAISON': {
    fr: 'SHAWARMA MAISON',
    ru: 'ДОМАШНЯЯ ШАУРМА',
    en: 'HOMEMADE SHAWARMA',
    de: 'HAUSGEMACHTES SHAWARMA',
    it: 'SHAWARMA FATTO IN CASA',
  },
  'MAXI DUO': {
    fr: 'MAXI DUO',
    ru: 'МАКСИ ДУО',
    en: 'MAXI DUO',
    de: 'MAXI DUO',
    it: 'MAXI DUO',
  },
  'KIDS BOX': {
    fr: 'MENU ENFANT',
    ru: 'ДЕТСКИЙ БОКС',
    en: 'KIDS BOX',
    de: 'KINDERBOX',
    it: 'MENU BAMBINI',
  },
  NOVITÀ: {
    fr: 'NOUVEAUTÉ',
    ru: 'НОВИНКА',
    en: 'NEW',
    de: 'NEU',
    it: 'NOVITÀ',
  },
  'DOUBLE SMASH': {
    fr: 'DOUBLE SMASH',
    ru: 'ДВОЙНОЙ СМЭШ',
    en: 'DOUBLE SMASH',
    de: 'DOUBLE SMASH',
    it: 'DOPPIO SMASH',
  },
  'TRIPLE SMASH': {
    fr: 'TRIPLE SMASH',
    ru: 'ТРОЙНОЙ СМЭШ',
    en: 'TRIPLE SMASH',
    de: 'TRIPLE SMASH',
    it: 'TRIPLO SMASH',
  },
  'RECETTE MAISON': {
    fr: 'RECETTE MAISON',
    ru: 'ДОМАШНИЙ РЕЦЕПТ',
    en: 'HOMEMADE RECIPE',
    de: 'HAUSREZEPT',
    it: 'RICETTA DELLA CASA',
  },
  CRUNCHY: {
    fr: 'CRUNCHY',
    ru: 'ХРУСТЯЩИЙ',
    en: 'CRUNCHY',
    de: 'KNUSPRIG',
    it: 'CROCCANTE',
  },
  SIGNATURE: {
    fr: 'SIGNATURE',
    ru: 'ФИРМЕННЫЙ',
    en: 'SIGNATURE',
    de: 'SIGNATURE',
    it: 'SIGNATURE',
  },
  SPÉCIALITÉ: {
    fr: 'SPÉCIALITÉ',
    ru: 'СПЕЦИАЛИТЕТ',
    en: 'SPECIALTY',
    de: 'SPEZIALITÄT',
    it: 'SPECIALITÀ',
  },
  VÉGÉTARIEN: {
    fr: 'VÉGÉTARIEN',
    ru: 'ВЕГЕТАРИАНСКОЕ',
    en: 'VEGETARIAN',
    de: 'VEGETARISCH',
    it: 'VEGETARIANO',
  },
  VEGETARIANO: {
    fr: 'VÉGÉTARIEN',
    ru: 'ВЕГЕТАРИАНСКОЕ',
    en: 'VEGETARIAN',
    de: 'VEGETARISCH',
    it: 'VEGETARIANO',
  },
  'FAIT MAISON': {
    fr: 'FAIT MAISON',
    ru: 'ДОМАШНЕЕ',
    en: 'HOMEMADE',
    de: 'HAUSGEMACHT',
    it: 'FATTO IN CASA',
  },
  GOURMAND: {
    fr: 'GOURMAND',
    ru: 'ГУРМЭ',
    en: 'GOURMET',
    de: 'GOURMET',
    it: 'GOLOSO',
  },
  FRAÎCHEUR: {
    fr: 'FRAÎCHEUR',
    ru: 'СВЕЖЕСТЬ',
    en: 'FRESH',
    de: 'FRISCH',
    it: 'FRESCHEZZA',
  },
  ENFANTS: {
    fr: 'MENU ENFANT',
    ru: 'ДЕТЯМ',
    en: 'KIDS MENU',
    de: 'KINDERMENÜ',
    it: 'MENÙ BAMBINI',
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
    nameIt?: string;
    descriptionIt?: string;
  }
> = {};

export function getCategoryLabel(
  catId: CategoryId | string,
  language: Language,
  fallback?: string
): string {
  const entry = CATEGORY_LABELS[catId as CategoryId];
  if (entry && entry[language]) return entry[language];
  return fallback || String(catId);
}

export function getSubFilterLabel(
  subId: string,
  language: Language,
  fallback?: string
): string {
  const entry = SUBFILTER_LABELS[subId];
  if (entry && entry[language]) return entry[language];
  return fallback || subId;
}

export function getBadgeLabel(
  badge: string | undefined,
  language: Language
): string | undefined {
  if (!badge) return undefined;
  const entry = BADGE_LABELS[badge];
  if (entry && entry[language]) return entry[language];
  return badge;
}

export function getLocalizedProductName(
  product: Partial<ProductItem> & { id?: string; name?: string },
  language: Language
): string {
  const tr = product.id ? PRODUCT_TRANSLATIONS[product.id] : undefined;
  if (language === 'ru') return product.nameRu || tr?.nameRu || product.name || '';
  if (language === 'en') return product.nameEn || tr?.nameEn || product.name || '';
  if (language === 'de')
    return product.nameDe || tr?.nameDe || product.nameEn || tr?.nameEn || product.name || '';
  if (language === 'it')
    return product.nameIt || tr?.nameIt || product.nameEn || tr?.nameEn || product.name || '';
  if (language === 'fr') return product.nameFr || tr?.nameFr || product.name || '';
  return product.name || '';
}

export function getLocalizedProductDescription(
  product: Partial<ProductItem> & { id?: string; description?: string },
  language: Language
): string {
  const tr = product.id ? PRODUCT_TRANSLATIONS[product.id] : undefined;
  if (language === 'ru')
    return product.descriptionRu || tr?.descriptionRu || product.description || '';
  if (language === 'en')
    return product.descriptionEn || tr?.descriptionEn || product.description || '';
  if (language === 'de')
    return (
      product.descriptionDe ||
      tr?.descriptionDe ||
      product.descriptionEn ||
      tr?.descriptionEn ||
      product.description ||
      ''
    );
  if (language === 'it')
    return (
      product.descriptionIt ||
      tr?.descriptionIt ||
      product.descriptionEn ||
      tr?.descriptionEn ||
      product.description ||
      ''
    );
  if (language === 'fr')
    return product.descriptionFr || tr?.descriptionFr || product.description || '';
  return product.description || '';
}

export function getLocalizedExtraName(
  extra: Partial<ExtraOption & SelectedExtra>,
  language: Language
): string {
  const catalogMatch = extra.id ? LABRIOUT_EXTRAS.find(e => e.id === extra.id) : undefined;
  const src: Partial<ExtraOption> = { ...catalogMatch, ...extra };

  if (language === 'ru') return src.nameRu || catalogMatch?.nameRu || src.name || '';
  if (language === 'en') return src.nameEn || catalogMatch?.nameEn || src.name || '';
  if (language === 'de')
    return src.nameDe || catalogMatch?.nameDe || src.nameEn || src.name || '';
  if (language === 'it')
    return src.nameIt || catalogMatch?.nameIt || src.nameEn || src.name || '';
  if (language === 'fr') return src.nameFr || catalogMatch?.nameFr || catalogMatch?.name || src.name || '';
  return src.name || '';
}
