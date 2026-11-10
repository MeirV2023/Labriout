export type CategoryId =
  | 'tutti'
  | 'pranzo'
  | 'gastronomia'
  | 'girarrosto'
  | 'friggitoria'
  | 'rosticceria'
  | 'patate'
  | 'bevande'
  | 'panini'
  | 'panini_special'
  | 'componi_panino'
  // aliases for compatibility
  | 'panzerotti'
  | 'sfizi'
  | 'arancini'
  | 'salse'
  | 'combo';

export type SubFilterId = string;

export type FulfillmentType = 'asporto' | 'consegna' | 'prenota';

export interface ExtraOption {
  id: string;
  name: string;
  nameEn?: string;
  nameDe?: string;
  nameFr?: string;
  nameIt?: string;
  nameRu?: string;
  price: number;
}

export interface ProductItem {
  id: string;
  name: string;
  nameEn?: string;
  nameDe?: string;
  nameFr?: string;
  nameIt?: string;
  nameRu?: string;
  icon?: string;
  category: CategoryId;
  subCategory?: string;
  description: string;
  descriptionEn?: string;
  descriptionDe?: string;
  descriptionFr?: string;
  descriptionIt?: string;
  descriptionRu?: string;
  ingredients?: string;
  ingredientsEn?: string;
  ingredientsDe?: string;
  ingredientsFr?: string;
  ingredientsIt?: string;
  ingredientsRu?: string;
  weight?: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  badge?: string; // 'PIÙ AMATO' | 'SPECIALE' | 'VEGETARIANO' | 'PICCANTE' | 'NOVITÀ' | 'CONSIGLIATO' | 'SU PRENOTAZIONE'
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isPopular?: boolean;
  isAvailable?: boolean;
  foodCost?: number;
  prepTimeSec?: number;
  availableExtras?: ExtraOption[];
}

export interface SelectedExtra {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  cartItemId: string; // unique UUID based on product + selected extras
  productId: string;
  product: ProductItem;
  quantity: number;
  selectedExtras: SelectedExtra[];
  specialNotes?: string;
  totalUnitPrice: number;
}

export interface CustomerOrderInfo {
  name: string;
  phone: string;
  email?: string;
  fulfillmentType: FulfillmentType;
  deliveryAddress?: string;
  deliveryCity?: string;
  postalCode?: string;
  timeSlot: string;
  paymentMethod: 'cash' | 'card' | 'satispay' | 'apple_pay';
  notes?: string;
}

export interface PackingChecklist {
  itemsChecked: Record<string, boolean>;
  napkinsIncluded: boolean;
  saucesVerified: boolean;
  thermalBagSealed: boolean;
  receiptAttached: boolean;
  packedBy?: string;
}

export interface OrderTiming {
  receivedAt: number;
  preparingAt?: number | null;
  fryingAt?: number | null;
  packingAt?: number | null;
  readyAt?: number | null;
  completedAt?: number | null;
  elapsedSeconds: number;
}

export type OrderStatus =
  | 'received'
  | 'preparing'
  | 'frying'
  | 'packing'
  | 'delivering'
  | 'ready'
  | 'completed';

export interface PlacedOrder {
  id: string;
  dbId?: string;
  tenantId?: string;
  orderNumber?: string;
  createdAt: string;
  customer: CustomerOrderInfo;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  couponCode?: string | null;
  total: number;
  estimatedFoodCost?: number;
  paymentStatus?: string;
  stripePaymentIntentId?: string | null;
  fiscalSignature?: string | null;
  status: OrderStatus;
  estimatedMinutes: number;
  packingChecklist?: PackingChecklist;
  timing?: OrderTiming;
}

export type Language = 'it' | 'en' | 'de' | 'fr' | 'ru';
