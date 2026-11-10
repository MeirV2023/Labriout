import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  User,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Clock,
  DoorClosed,
  BellOff,
  Banknote,
  Smartphone,
  Tag,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CustomerOrderInfo, PlacedOrder } from '../types';
import { STORE_SCHEDULE, STORE_DETAILS } from '../data/menuData';

// Reusable Floating Label Input: 16px label centered when idle, shrinks to top-left 11px on focus/fill
const FloatingInput: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  name?: string;
  autoComplete?: string;
  className?: string;
}> = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  name,
  autoComplete,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hasValue = Boolean(value && value.trim().length > 0);
  const isFloating = isFocused || hasValue;

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{ height: '56px' }}
      className={`relative h-[56px] min-h-[56px] border border-[1px] border-[#E8E7E6] rounded-2xl bg-white px-3.5 transition-all cursor-text flex flex-col justify-center select-none ${
        isFocused ? 'border-[#ff5500] ring-2 ring-[#ff5500]/10' : 'hover:border-neutral-300'
      } ${className}`}
    >
      <label
        className={`absolute left-3.5 pointer-events-none transition-all duration-200 ease-out select-none truncate max-w-[calc(100%-28px)] ${
          isFloating
            ? `top-2 text-[11px] font-medium leading-none ${isFocused ? 'text-[#ff5500]' : 'text-neutral-400'}`
            : 'top-1/2 -translate-y-1/2 text-[16px] font-normal text-neutral-400 leading-none'
        }`}
      >
        {label}
      </label>
      <input
        ref={inputRef}
        type={type}
        required={required}
        name={name}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full bg-transparent font-semibold text-[#21201F] focus:outline-none transition-all select-text ${
          isFloating ? 'pt-3.5 pb-0 text-sm sm:text-base opacity-100' : 'py-0 text-sm opacity-0'
        }`}
      />
    </div>
  );
};

// Mobile Underline Floating Label Input (Matches Screen 3 & Screen 2: label floats to top-left on focus/fill)
const MobileUnderlineFloatingInput: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  rightAdornment?: React.ReactNode;
  leftAdornment?: React.ReactNode;
  className?: string;
}> = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  rightAdornment,
  leftAdornment,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hasValue = Boolean(value && value.trim().length > 0);
  const isFloating = isFocused || hasValue;

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={`relative h-[54px] min-h-[54px] border-b transition-colors flex items-center justify-between gap-2 cursor-text select-none ${
        isFocused ? 'border-[#FF4A00]' : 'border-[#F0EFED]'
      } ${className}`}
    >
      {leftAdornment && <div className="shrink-0 mr-1.5">{leftAdornment}</div>}
      <div className="relative flex-1 h-full flex flex-col justify-center min-w-0">
        <label
          className={`absolute left-0 pointer-events-none transition-all duration-200 ease-out select-none truncate max-w-full ${
            isFloating
              ? `top-1.5 text-[11px] font-medium leading-none ${
                  isFocused ? 'text-[#FF4A00]' : 'text-[#9E9B98]'
                }`
              : 'top-1/2 -translate-y-1/2 text-[15px] font-normal text-[#9E9B98] leading-none'
          }`}
        >
          {label}
        </label>
        <input
          ref={inputRef}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-transparent text-[15px] text-[#21201F] focus:outline-none transition-all select-text ${
            isFloating ? 'pt-3.5 pb-0 opacity-100' : 'py-0 opacity-0'
          }`}
        />
      </div>
      {rightAdornment && <div className="shrink-0">{rightAdornment}</div>}
    </div>
  );
};

export const StripeCheckoutPage: React.FC = () => {
  const {
    items,
    itemsCount,
    subtotal,
    deliveryFee,
    discountAmount,
    total,
    appliedCoupon,
    removeCoupon,
    clearCart,
    setCurrentView,
    submitOrder,
    setActivePlacedOrder,
    fulfillmentType,
    setFulfillmentType,
    selectedTimeSlot,
    setSelectedTimeSlot,
    selectedDayIndex,
    setSelectedDayIndex,
    selectedSlot,
    setSelectedSlot,
    language,
  } = useCart();

  // Multi-language text dictionary
  const labels = useMemo(() => {
    switch (language) {
      case 'ru':
        return {
          back: 'Вернуться в корзину',
          title: 'Оформление заказа',
          paymentMethodTitle: 'Способ оплаты',
          cardOption: 'Банковской картой онлайн',
          cardSub: 'Visa, Mastercard, Mir через Stripe',
          applePayOption: 'Apple Pay / Google Pay',
          cashOption: 'Наличными при получении',
          linkNewCard: 'Привязать новую карту',
          cardNumber: 'Номер карты',
          expiry: 'Срок (ММ/ГГ)',
          cvc: 'CVC / CVV',
          cardHolder: 'Имя держателя карты',
          saveCard: 'Запомнить карту для будущих заказов',
          deliveryAddressTitle: 'Адрес доставки',
          pickupLocationTitle: 'Пункт самовывоза',
          streetPlaceholder: '12 Rue Paul Vaillant-Couturier, Bonneuil-sur-Marne',
          streetLabel: 'Улица, номер дома',
          apartment: 'Квартира',
          intercom: 'Домофон',
          entrance: 'Подъезд',
          floor: 'Этаж',
          courierComment: 'Комментарий курьеру',
          courierCommentPlaceholder: 'Например: код домофона #1234, оставьте у консьержа',
          deliveryOptionsTitle: 'Опции доставки',
          leaveAtDoor: 'Оставить у двери',
          leaveAtDoorSub: 'Курьер оставит заказ у двери и отойдёт',
          doNotRing: 'Не звонить в звонок',
          doNotRingSub: 'Уведомим по SMS / звонком на телефон',
          contactTitle: 'Контактные данные',
          firstName: 'Имя',
          lastName: 'Фамилия',
          phone: 'Номер телефона',
          phoneSub: 'Для связи и статуса доставки',
          email: 'Электронная почта',
          emailSub: 'Для чека и квитанции',
          timeTitle: 'Время получения',
          asap: 'Как можно скорее (~25–35 мин)',
          scheduleTime: 'Выбрать время',
          summaryTitle: 'Итого',
          deliveryTab: 'Доставка',
          pickupTab: 'Самовывоз',
          summaryDeliveryTime: 'Доставка 20–35 мин',
          summaryPickupTime: 'Готово через 15–20 мин',
          productsTotal: (count: number) => `Товары (${count})`,
          discount: 'Скидки',
          removePromo: 'Удалить',
          delivery: 'Доставка',
          free: '0 €',
          toPay: 'К оплате',
          payBtn: (val: string) => `Оплатить ${val} €`,
          processing: 'Обработка платежа...',
          emptyCart: 'Корзина пуста',
          emptyCartSub: 'Добавьте вкусные блюда в меню, чтобы оформить заказ',
          backToMenu: 'Перейти в меню',
          sslBadge: 'Stripe SSL 256-bit',
          orderSuccessTitle: 'Заказ успешно оформлен!',
          orderSuccessSub: 'Спасибо! Ваш заказ принят на кухне',
          orderSuccessPaid: 'Оплачено:',
          orderNumber: 'Номер заказа',
          deliveryTo: 'Адрес получения',
          timeConfirmed: 'Время готовности',
          trackOrder: 'Отслеживать заказ онлайн',
          pickupAddress: 'Адрес самовывоза: 64 av. Simone Veil, Bonneuil-sur-Marne',
          pickupHours: 'Часы выдачи: 12h-15h 18h-22h15',
          saveBtn: 'Сохранить',
          addCardBox: 'Добавить карту',
          addCardSheetTitle: 'Добавьте карту любого банка',
        };
      case 'en':
        return {
          back: 'Back to cart',
          title: 'Checkout',
          paymentMethodTitle: 'Payment method',
          cardOption: 'Credit / Debit card online',
          cardSub: 'Visa, Mastercard, Amex via Stripe',
          applePayOption: 'Apple Pay / Google Pay',
          cashOption: 'Cash on delivery / pickup',
          linkNewCard: 'Add new card',
          cardNumber: 'Card number',
          expiry: 'MM/YY',
          cvc: 'CVC',
          cardHolder: 'Name on card',
          saveCard: 'Save card securely for next time',
          deliveryAddressTitle: 'Delivery address',
          pickupLocationTitle: 'Pickup location',
          streetPlaceholder: '12 Rue Paul Vaillant-Couturier, Bonneuil-sur-Marne',
          streetLabel: 'Street & house number',
          apartment: 'Apartment',
          intercom: 'Intercom code',
          entrance: 'Entrance',
          floor: 'Floor',
          courierComment: 'Note to courier',
          courierCommentPlaceholder: 'e.g. Leave with doorman, ring bell twice',
          deliveryOptionsTitle: 'Delivery options',
          leaveAtDoor: 'Leave at the door',
          leaveAtDoorSub: 'Courier will leave food at your door',
          doNotRing: 'Do not ring doorbell',
          doNotRingSub: 'We will notify via SMS / call',
          contactTitle: 'Personal details',
          firstName: 'First name',
          lastName: 'Last name',
          phone: 'Mobile phone',
          phoneSub: 'For delivery notifications',
          email: 'Email address',
          emailSub: 'For your Stripe payment receipt',
          timeTitle: 'Delivery / pickup time',
          asap: 'As soon as possible (~25–35 min)',
          scheduleTime: 'Choose time slot',
          summaryTitle: 'Summary',
          deliveryTab: 'Delivery',
          pickupTab: 'Pickup',
          summaryDeliveryTime: 'Delivery in 20–35 min',
          summaryPickupTime: 'Ready in 15–20 min',
          productsTotal: (count: number) => `Items (${count})`,
          discount: 'Discount',
          removePromo: 'Remove',
          delivery: 'Delivery',
          free: 'Free',
          toPay: 'Total',
          payBtn: (val: string) => `Pay ${val} €`,
          processing: 'Processing payment...',
          emptyCart: 'Your basket is empty',
          emptyCartSub: 'Add dishes from our menu to place an order',
          backToMenu: 'Browse menu',
          sslBadge: 'Stripe SSL 256-bit',
          orderSuccessTitle: 'Order Confirmed!',
          orderSuccessSub: 'Thank you! Your order is in the kitchen',
          orderSuccessPaid: 'Total paid:',
          orderNumber: 'Order ID',
          deliveryTo: 'Destination',
          timeConfirmed: 'Scheduled time',
          trackOrder: 'Track live order',
          pickupAddress: 'Pickup location: 64 av. Simone Veil, Bonneuil-sur-Marne',
          pickupHours: 'Open: 12h-15h 18h-22h15',
          saveBtn: 'Save',
          addCardBox: 'Add card',
          addCardSheetTitle: 'Credit / Debit card online',
        };
      case 'de':
        return {
          back: 'Zurück zum Warenkorb',
          title: 'Kasse',
          paymentMethodTitle: 'Zahlungsmethode',
          cardOption: 'Kreditkarte online',
          cardSub: 'Visa, Mastercard via Stripe',
          applePayOption: 'Apple Pay / Google Pay',
          cashOption: 'Barzahlung bei Lieferung',
          linkNewCard: 'Neue Karte hinzufügen',
          cardNumber: 'Kartennummer',
          expiry: 'MM/JJ',
          cvc: 'CVC',
          cardHolder: 'Karteninhaber',
          saveCard: 'Karte sicher für später speichern',
          deliveryAddressTitle: 'Lieferadresse',
          pickupLocationTitle: 'Abholort',
          streetPlaceholder: '12 Rue Paul Vaillant-Couturier, Bonneuil-sur-Marne',
          streetLabel: 'Straße und Hausnummer',
          apartment: 'Wohnung',
          intercom: 'Gegensprechanlage',
          entrance: 'Eingang',
          floor: 'Etage',
          courierComment: 'Hinweis für den Kurier',
          courierCommentPlaceholder: 'z.B. Bei Nachbarn abgeben',
          deliveryOptionsTitle: 'Lieferoptionen',
          leaveAtDoor: 'Vor der Tür abstellen',
          leaveAtDoorSub: 'Kontaktlose Übergabe',
          doNotRing: 'Nicht klingeln',
          doNotRingSub: 'Benachrichtigung per SMS',
          contactTitle: 'Kontaktdaten',
          firstName: 'Vorname',
          lastName: 'Nachname',
          phone: 'Telefonnummer',
          phoneSub: 'Für Lieferupdates',
          email: 'E-Mail',
          emailSub: 'Für die Quittung',
          timeTitle: 'Lieferzeit',
          asap: 'So schnell wie möglich (~25–35 Min)',
          scheduleTime: 'Uhrzeit wählen',
          summaryTitle: 'Übersicht',
          deliveryTab: 'Lieferung',
          pickupTab: 'Abholung',
          summaryDeliveryTime: 'Lieferung in 20–35 Min',
          summaryPickupTime: 'Fertig in 15–20 Min',
          productsTotal: (count: number) => `Artikel (${count})`,
          discount: 'Rabatt',
          removePromo: 'Entfernen',
          delivery: 'Lieferung',
          free: 'Kostenlos',
          toPay: 'Gesamtbetrag',
          payBtn: (val: string) => `Bezahlen ${val} €`,
          processing: 'Zahlung wird verarbeitet...',
          emptyCart: 'Warenkorb ist leer',
          emptyCartSub: 'Fügen Sie leckere Speisen hinzu',
          backToMenu: 'Zur Speisekarte',
          sslBadge: 'Stripe SSL 256-bit',
          orderSuccessTitle: 'Bestellung erfolgreich!',
          orderSuccessSub: 'Vielen Dank für Ihre Bestellung',
          orderSuccessPaid: 'Bezahlt:',
          orderNumber: 'Bestellnummer',
          deliveryTo: 'Adresse',
          timeConfirmed: 'Bereit um',
          trackOrder: 'Bestellung live verfolgen',
          pickupAddress: 'Abholung: 64 av. Simone Veil, Bonneuil-sur-Marne',
          pickupHours: 'Öffnungszeiten: 12h-15h 18h-22h15',
          saveBtn: 'Speichern',
          addCardBox: 'Karte hinzufügen',
          addCardSheetTitle: 'Kreditkarte online',
        };
      case 'fr':
        return {
          back: 'Retour au panier',
          title: 'Commande',
          paymentMethodTitle: 'Moyen de paiement',
          cardOption: 'Carte bancaire en ligne',
          cardSub: 'Visa, Mastercard via Stripe',
          applePayOption: 'Apple Pay / Google Pay',
          cashOption: 'Espèces à la livraison',
          linkNewCard: 'Ajouter une carte',
          cardNumber: 'Numéro de carte',
          expiry: 'MM/AA',
          cvc: 'CVC',
          cardHolder: 'Nom du titulaire',
          saveCard: 'Enregistrer la carte en toute sécurité',
          deliveryAddressTitle: 'Adresse de livraison',
          pickupLocationTitle: 'Point de retrait',
          streetPlaceholder: '12 Rue Paul Vaillant-Couturier, Bonneuil-sur-Marne',
          streetLabel: 'Rue et numéro',
          apartment: 'Appartement',
          intercom: 'Interphone',
          entrance: 'Bâtiment / Entrée',
          floor: 'Étage',
          courierComment: 'Commentaire pour le livreur',
          courierCommentPlaceholder: 'ex: Laisser au gardien',
          deliveryOptionsTitle: 'Options de livraison',
          leaveAtDoor: 'Déposer devant la porte',
          leaveAtDoorSub: 'Livraison sans contact',
          doNotRing: 'Ne pas sonner',
          doNotRingSub: 'Notification par SMS',
          contactTitle: 'Coordonnées',
          firstName: 'Prénom',
          lastName: 'Nom',
          phone: 'Téléphone',
          phoneSub: 'Pour le suivi de livraison',
          email: 'E-mail',
          emailSub: 'Pour le reçu Stripe',
          timeTitle: 'Créneau horaire',
          asap: 'Le plus vite possible (~25–35 min)',
          scheduleTime: 'Choisir un créneau',
          summaryTitle: 'Récapitulatif',
          deliveryTab: 'Livraison',
          pickupTab: 'À emporter',
          summaryDeliveryTime: 'Livraison en 20–35 min',
          summaryPickupTime: 'Prêt en 15–20 min',
          productsTotal: (count: number) => `Articles (${count})`,
          discount: 'Remise',
          removePromo: 'Supprimer',
          delivery: 'Livraison',
          free: 'Gratuit',
          toPay: 'Total',
          payBtn: (val: string) => `Payer ${val} €`,
          processing: 'Paiement en cours...',
          emptyCart: 'Panier vide',
          emptyCartSub: 'Ajoutez des plats délicieux à votre commande',
          backToMenu: 'Voir le menu',
          sslBadge: 'Stripe SSL 256-bit',
          orderSuccessTitle: 'Commande validée !',
          orderSuccessSub: 'Merci ! Votre commande est en préparation',
          orderSuccessPaid: 'Total payé :',
          orderNumber: 'Numéro de commande',
          deliveryTo: 'Adresse de livraison',
          timeConfirmed: 'Heure estimée',
          trackOrder: 'Suivre la commande en direct',
          pickupAddress: 'Retrait : 64 av. Simone Veil, Bonneuil-sur-Marne',
          pickupHours: 'Ouvert : 12h-15h 18h-22h15',
          saveBtn: 'Enregistrer',
          addCardBox: 'Ajouter une carte',
          addCardSheetTitle: 'Carte bancaire en ligne',
        };
      default: // 'it'
        return {
          back: 'Torna al carrello',
          title: "Completa l'ordine",
          paymentMethodTitle: 'Metodo di pagamento',
          cardOption: 'Carta di credito / debito online',
          cardSub: 'Visa, Mastercard, Amex tramite Stripe',
          applePayOption: 'Apple Pay / Google Pay',
          cashOption: 'In contanti alla consegna / ritiro',
          linkNewCard: 'Collega nuova carta',
          cardNumber: 'Numero della carta',
          expiry: 'MM/AA',
          cvc: 'CVC',
          cardHolder: 'Titolare della carta',
          saveCard: 'Salva questa carta in modo sicuro',
          deliveryAddressTitle: 'Indirizzo di consegna',
          pickupLocationTitle: 'Punto di ritiro in sede',
          streetPlaceholder: '12 Rue Paul Vaillant-Couturier, Bonneuil-sur-Marne',
          streetLabel: 'Via e numero civico',
          apartment: 'Interno',
          intercom: 'Citofono',
          entrance: 'Scala',
          floor: 'Piano',
          courierComment: 'Note per il corriere',
          courierCommentPlaceholder: 'Es. Citofono Rossi, lasciare al piano terra...',
          deliveryOptionsTitle: 'Opzioni di consegna',
          leaveAtDoor: 'Lascia davanti alla porta',
          leaveAtDoorSub: "Il corriere lascerà il pacco sull'uscio",
          doNotRing: 'Non suonare al citofono',
          doNotRingSub: 'Riceverai una notifica sul cellulare',
          contactTitle: 'Dati di contatto',
          firstName: 'Nome',
          lastName: 'Cognome',
          phone: 'Telefono cellulare',
          phoneSub: 'Per aggiornamenti sulla consegna',
          email: 'Email',
          emailSub: 'Per ricevuta fiscale e Stripe',
          timeTitle: 'Orario di consegna / ritiro',
          asap: 'Il prima possibile (~25–35 min)',
          scheduleTime: 'Scegli orario programmato',
          summaryTitle: 'Riepilogo Ordine',
          deliveryTab: 'Consegna',
          pickupTab: 'Asporto',
          summaryDeliveryTime: 'Consegna in 20–35 min',
          summaryPickupTime: 'Pronto in 15–20 min',
          productsTotal: (count: number) => `Totale prodotti (${count})`,
          discount: 'Sconto',
          removePromo: 'Rimuovi',
          delivery: 'Spedizione',
          free: 'Gratis',
          toPay: 'Totale',
          payBtn: (val: string) => `Paga ${val} €`,
          processing: 'Elaborazione pagamento in corso...',
          emptyCart: 'Il tuo carrello è vuoto',
          emptyCartSub: 'Aggiungi qualcosa di delizioso dal menu',
          backToMenu: 'Torna al menu',
          sslBadge: 'Stripe SSL 256-bit',
          orderSuccessTitle: 'Ordine Confermato!',
          orderSuccessSub: 'Grazie! Il tuo ordine è stato ricevuto dalla cucina',
          orderSuccessPaid: 'Totale pagato:',
          orderNumber: 'Numero ordine',
          deliveryTo: 'Indirizzo di consegna',
          timeConfirmed: 'Orario stimato',
          trackOrder: 'Traccia ordine in tempo reale',
          pickupAddress: 'Ritiro in sede: 64 av. Simone Veil, Bonneuil-sur-Marne',
          pickupHours: 'Aperto: 12h-15h 18h-22h15',
          saveBtn: 'Salva',
          addCardBox: 'Aggiungi carta',
          addCardSheetTitle: 'Carta di credito / debito online',
        };
    }
  }, [language]);

  // Customer contact state (Pre-filled with Stripe Test Customer for instant 1-click testing)
  const [firstName, setFirstName] = useState('David');
  const [lastName, setLastName] = useState('Cohen');
  const [phone, setPhone] = useState('+33 6 12 34 56 78');
  const [email, setEmail] = useState('client@labriout.fr');

  // Address fields
  const [city] = useState('Bonneuil-sur-Marne');
  const [postalCode] = useState('94380');
  const [streetAddress, setStreetAddress] = useState('12 Rue Paul Vaillant-Couturier');
  const [apartment, setApartment] = useState('12');
  const [intercom, setIntercom] = useState('1234');
  const [entrance, setEntrance] = useState('A');
  const [floor, setFloor] = useState('2');
  const [courierNote, setCourierNote] = useState('');

  // Delivery options toggles
  const [leaveAtDoor, setLeaveAtDoor] = useState(false);
  const [doNotRing, setDoNotRing] = useState(false);

  // Payment Method selection ('card' | 'apple_pay' | 'cash')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cash'>('card');

  // Stripe Official Test Card Details (4242 4242 4242 4242) pre-filled for testing
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('424');
  const [cardName, setCardName] = useState('DAVID COHEN');
  const [saveCard, setSaveCard] = useState(true);

  // Mobile Bottom Sheet Category Modal ('address' | 'payment' | 'personal' | 'time' | null)
  const [activeMobileSheet, setActiveMobileSheet] = useState<
    'address' | 'payment' | 'personal' | 'time' | null
  >(null);
  // Keep last active sheet rendered while sliding down so content never vanishes mid-animation
  const [renderedMobileSheet, setRenderedMobileSheet] = useState<
    'address' | 'payment' | 'personal' | 'time' | null
  >(null);
  const mobileSheetPanelRef = useRef<HTMLDivElement>(null);
  const mobileSheetScrollRef = useRef<HTMLDivElement>(null);
  const [sheetDragY, setSheetDragY] = useState(0);
  const [isSheetDragging, setIsSheetDragging] = useState(false);
  const sheetTouchRef = useRef<{
    startY: number;
    startX: number;
    lastY: number;
    lastTime: number;
    velocityY: number;
    isDragging: boolean;
  }>({
    startY: 0,
    startX: 0,
    lastY: 0,
    lastTime: 0,
    velocityY: 0,
    isDragging: false,
  });

  const closeMobileSheet = () => {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setActiveMobileSheet(null);
  };

  useEffect(() => {
    if (activeMobileSheet) {
      setRenderedMobileSheet(activeMobileSheet);
      setSheetDragY(0);
      setIsSheetDragging(false);
    } else {
      setSheetDragY(0);
      setIsSheetDragging(false);
      const timer = setTimeout(() => {
        setRenderedMobileSheet(null);
      }, 340);
      return () => clearTimeout(timer);
    }
  }, [activeMobileSheet]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (activeMobileSheet && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeMobileSheet) {
        closeMobileSheet();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeMobileSheet]);

  const handleMobileSheetTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    sheetTouchRef.current = {
      startY: touch.clientY,
      startX: touch.clientX,
      lastY: touch.clientY,
      lastTime: performance.now(),
      velocityY: 0,
      isDragging: false,
    };
  };

  const handleMobileSheetTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const state = sheetTouchRef.current;
    const now = performance.now();
    const dt = Math.max(1, now - state.lastTime);
    const vy = (touch.clientY - state.lastY) / dt;
    state.velocityY = state.velocityY * 0.35 + vy * 0.65;
    state.lastY = touch.clientY;
    state.lastTime = now;

    const deltaY = touch.clientY - state.startY;
    const deltaX = touch.clientX - state.startX;
    const scrollTop = mobileSheetScrollRef.current?.scrollTop ?? 0;

    if (!state.isDragging) {
      if (scrollTop <= 0 && deltaY > 4 && Math.abs(deltaY) > Math.abs(deltaX)) {
        state.isDragging = true;
        state.startY = touch.clientY;
        setIsSheetDragging(true);
      } else {
        return;
      }
    }

    const offset = Math.max(0, touch.clientY - state.startY);
    setSheetDragY(offset);
  };

  const handleMobileSheetTouchEnd = () => {
    const state = sheetTouchRef.current;
    if (!state.isDragging) return;
    state.isDragging = false;
    setIsSheetDragging(false);

    const panelHeight = mobileSheetPanelRef.current?.offsetHeight || 420;
    if (sheetDragY > Math.min(120, panelHeight * 0.28) || (state.velocityY > 0.5 && sheetDragY > 30)) {
      closeMobileSheet();
    } else {
      setSheetDragY(0);
    }
  };

  // Status & Validation
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<PlacedOrder | null>(null);

  // Date & Time picker
  const now = new Date();
  const availableDays = useMemo(() => {
    const list = [];
    const todayLabel =
      language === 'ru'
        ? 'Сегодня'
        : language === 'en'
        ? 'Today'
        : language === 'de'
        ? 'Heute'
        : language === 'fr'
        ? "Aujourd'hui"
        : 'Oggi';
    const tomorrowLabel =
      language === 'ru'
        ? 'Завтра'
        : language === 'en'
        ? 'Tomorrow'
        : language === 'de'
        ? 'Morgen'
        : language === 'fr'
        ? 'Demain'
        : 'Domani';
    const closedLabel =
      language === 'ru'
        ? 'Закрыто'
        : language === 'en'
        ? 'Closed'
        : language === 'de'
        ? 'Geschlossen'
        : language === 'fr'
        ? 'Fermé'
        : 'Chiuso';
    const locale =
      language === 'ru'
        ? 'ru-RU'
        : language === 'en'
        ? 'en-US'
        : language === 'de'
        ? 'de-DE'
        : language === 'fr'
        ? 'fr-FR'
        : 'it-IT';

    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      const dayNum = d.getDay();
      const sched = STORE_SCHEDULE[dayNum];
      const localizedDayName = d.toLocaleDateString(locale, { weekday: 'long' });
      const capitalizedDayName =
        localizedDayName.charAt(0).toUpperCase() + localizedDayName.slice(1);

      const dateLabel =
        i === 0
          ? todayLabel
          : i === 1
          ? tomorrowLabel
          : `${capitalizedDayName} ${d.getDate()}/${d.getMonth() + 1}`;

      list.push({
        dayIndex: i,
        date: d,
        dayOfWeek: dayNum,
        name: capitalizedDayName,
        label: dateLabel,
        isClosed: sched.isClosed,
        hours: sched.isClosed ? closedLabel : sched.hours,
        slots: sched.slots,
      });
    }
    return list;
  }, [language]);

  const defaultDay = availableDays.find(d => !d.isClosed) || availableDays[0];
  const activeDayConfig = availableDays.find(d => d.dayIndex === selectedDayIndex) || defaultDay;
  const isSelectedDayClosed = activeDayConfig.isClosed;

  const hasCustomTimeInContext = Boolean(
    selectedSlot && selectedTimeSlot && selectedTimeSlot !== 'subito'
  );

  const [isAsap, setIsAsap] = useState<boolean>(() => !hasCustomTimeInContext);

  // Sync isAsap with CartContext whenever selectedTimeSlot or selectedSlot changes (e.g., from Navbar header)
  useEffect(() => {
    const scheduled = Boolean(selectedSlot && selectedTimeSlot && selectedTimeSlot !== 'subito');
    setIsAsap(!scheduled);
  }, [selectedTimeSlot, selectedSlot]);

  useEffect(() => {
    if (!isAsap && !selectedSlot && !isSelectedDayClosed && activeDayConfig.slots.length > 0) {
      const firstSlot = activeDayConfig.slots[0];
      setSelectedSlot(firstSlot);
      setSelectedTimeSlot(`${activeDayConfig.label} • ${firstSlot}`);
    }
  }, [isAsap, selectedSlot, isSelectedDayClosed, activeDayConfig, setSelectedSlot, setSelectedTimeSlot]);

  const handleSelectAsapMode = () => {
    setIsAsap(true);
    setSelectedDayIndex(0);
    setSelectedSlot('');
    setSelectedTimeSlot('subito');
  };

  const handleSelectScheduleMode = () => {
    setIsAsap(false);
    const targetDay = availableDays.find(d => d.dayIndex === selectedDayIndex && !d.isClosed) || defaultDay;
    const slotToUse = selectedSlot || targetDay.slots[0] || '';
    setSelectedDayIndex(targetDay.dayIndex);
    setSelectedSlot(slotToUse);
    if (slotToUse) {
      setSelectedTimeSlot(`${targetDay.label} • ${slotToUse}`);
    }
  };

  const handleSelectDayOnCheckout = (dayIdx: number) => {
    const targetDay = availableDays.find(d => d.dayIndex === dayIdx);
    if (!targetDay || targetDay.isClosed) return;
    setIsAsap(false);
    setSelectedDayIndex(dayIdx);
    const nextSlot =
      selectedSlot && targetDay.slots.includes(selectedSlot)
        ? selectedSlot
        : targetDay.slots[0] || '';
    setSelectedSlot(nextSlot);
    if (nextSlot) {
      setSelectedTimeSlot(`${targetDay.label} • ${nextSlot}`);
    }
  };

  const handleSelectSlotOnCheckout = (slot: string) => {
    setIsAsap(false);
    setSelectedSlot(slot);
    setSelectedTimeSlot(`${activeDayConfig.label} • ${slot}`);
  };

  // Formatted text for the "Время получения" row & Summary subtitle
  const getScheduledTimeDisplay = (withFulfillmentPrefix = false) => {
    if (isAsap || !selectedSlot) {
      if (withFulfillmentPrefix) {
        return fulfillmentType === 'asporto'
          ? labels.summaryPickupTime
          : labels.summaryDeliveryTime;
      }
      return labels.asap;
    }

    const isPickup = fulfillmentType === 'asporto';

    if (selectedDayIndex === 0) {
      if (language === 'ru') {
        return withFulfillmentPrefix
          ? `${isPickup ? 'Самовывоз' : 'Доставка'} сегодня к ${selectedSlot}`
          : `Сегодня к ${selectedSlot}`;
      }
      if (language === 'it') {
        return withFulfillmentPrefix
          ? `${isPickup ? 'Ritiro' : 'Consegna'} oggi alle ${selectedSlot}`
          : `Oggi alle ${selectedSlot}`;
      }
      if (language === 'de') {
        return withFulfillmentPrefix
          ? `${isPickup ? 'Abholung' : 'Lieferung'} heute um ${selectedSlot}`
          : `Heute um ${selectedSlot}`;
      }
      if (language === 'fr') {
        return withFulfillmentPrefix
          ? `${isPickup ? 'Retrait' : 'Livraison'} aujourd'hui à ${selectedSlot}`
          : `Aujourd'hui à ${selectedSlot}`;
      }
      return withFulfillmentPrefix
        ? `${isPickup ? 'Pickup' : 'Delivery'} today at ${selectedSlot}`
        : `Today at ${selectedSlot}`;
    }

    if (selectedDayIndex === 1) {
      if (language === 'ru') {
        return withFulfillmentPrefix
          ? `${isPickup ? 'Самовывоз' : 'Доставка'} завтра к ${selectedSlot}`
          : `Завтра к ${selectedSlot}`;
      }
      if (language === 'it') {
        return withFulfillmentPrefix
          ? `${isPickup ? 'Ritiro' : 'Consegna'} domani alle ${selectedSlot}`
          : `Domani alle ${selectedSlot}`;
      }
      if (language === 'de') {
        return withFulfillmentPrefix
          ? `${isPickup ? 'Abholung' : 'Lieferung'} morgen um ${selectedSlot}`
          : `Morgen um ${selectedSlot}`;
      }
      if (language === 'fr') {
        return withFulfillmentPrefix
          ? `${isPickup ? 'Retrait' : 'Livraison'} demain à ${selectedSlot}`
          : `Demain à ${selectedSlot}`;
      }
      return withFulfillmentPrefix
        ? `${isPickup ? 'Pickup' : 'Delivery'} tomorrow at ${selectedSlot}`
        : `Tomorrow at ${selectedSlot}`;
    }

    if (language === 'ru') {
      return withFulfillmentPrefix
        ? `${isPickup ? 'Самовывоз' : 'Доставка'} ${activeDayConfig.label} к ${selectedSlot}`
        : `${activeDayConfig.label} к ${selectedSlot}`;
    }
    if (language === 'it') {
      return withFulfillmentPrefix
        ? `${isPickup ? 'Ritiro' : 'Consegna'} ${activeDayConfig.label} alle ${selectedSlot}`
        : `${activeDayConfig.label} alle ${selectedSlot}`;
    }
    if (language === 'de') {
      return withFulfillmentPrefix
        ? `${isPickup ? 'Abholung' : 'Lieferung'} ${activeDayConfig.label} um ${selectedSlot}`
        : `${activeDayConfig.label} um ${selectedSlot}`;
    }
    if (language === 'fr') {
      return withFulfillmentPrefix
        ? `${isPickup ? 'Retrait' : 'Livraison'} ${activeDayConfig.label} à ${selectedSlot}`
        : `${activeDayConfig.label} à ${selectedSlot}`;
    }
    return withFulfillmentPrefix
      ? `${isPickup ? 'Pickup' : 'Delivery'} ${activeDayConfig.label} at ${selectedSlot}`
      : `${activeDayConfig.label} at ${selectedSlot}`;
  };

  // Card formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvc(value);
  };

  const validationTexts = {
    fr: {
      errFirstName: 'Veuillez saisir votre prénom',
      errPhone: 'Veuillez saisir un numéro de téléphone valide',
      errStreet: 'Veuillez saisir la rue et le numéro pour la livraison',
      errClosed: 'Le restaurant est fermé le jour sélectionné',
      errCardNumber: 'Veuillez saisir un numéro de carte valide (16 chiffres)',
      errExpiry: "Veuillez saisir la date d'expiration (MM/AA)",
      errCvc: 'Veuillez saisir le code CVC',
      errCardName: 'Veuillez saisir le nom du titulaire de la carte',
      stepEncrypt: 'Chiffrement des données via Stripe Elements...',
      step3ds: 'Authentification 3D Secure auprès de votre banque...',
      stepCreateOrder: 'Création et confirmation de la commande...',
      aptPrefix: 'appt.',
      entPrefix: 'bât.',
      floorPrefix: 'étage',
      intercomPrefix: 'interphone',
      kdsBtn: '👨‍🍳 Ouvrir la Cuisine KDS (/owner)',
    },
    en: {
      errFirstName: 'Please enter your first name',
      errPhone: 'Please enter a valid phone number',
      errStreet: 'Please enter your street and house number for delivery',
      errClosed: 'The restaurant is closed on the selected day',
      errCardNumber: 'Please enter a valid 16-digit card number',
      errExpiry: 'Please enter the card expiry date (MM/YY)',
      errCvc: 'Please enter the CVC code',
      errCardName: 'Please enter the cardholder name',
      stepEncrypt: 'Encrypting card details via Stripe Elements...',
      step3ds: 'Verifying 3D Secure with your bank...',
      stepCreateOrder: 'Creating and confirming your order...',
      aptPrefix: 'apt.',
      entPrefix: 'bldg.',
      floorPrefix: 'floor',
      intercomPrefix: 'intercom',
      kdsBtn: '👨‍🍳 Open Kitchen KDS (/owner)',
    },
    de: {
      errFirstName: 'Bitte geben Sie Ihren Vornamen ein',
      errPhone: 'Bitte geben Sie eine gültige Telefonnummer ein',
      errStreet: 'Bitte geben Sie Straße und Hausnummer für die Lieferung ein',
      errClosed: 'Das Restaurant ist am gewählten Tag geschlossen',
      errCardNumber: 'Bitte geben Sie eine gültige 16-stellige Kartennummer ein',
      errExpiry: 'Bitte geben Sie das Ablaufdatum der Karte ein (MM/JJ)',
      errCvc: 'Bitte geben Sie den CVC-Code ein',
      errCardName: 'Bitte geben Sie den Namen des Karteninhabers ein',
      stepEncrypt: 'Kartendaten werden über Stripe Elements verschlüsselt...',
      step3ds: '3D-Secure-Authentifizierung mit Ihrer Bank...',
      stepCreateOrder: 'Bestellung wird erstellt und bestätigt...',
      aptPrefix: 'Whg.',
      entPrefix: 'Eingang',
      floorPrefix: 'Etage',
      intercomPrefix: 'Klingel',
      kdsBtn: '👨‍🍳 Küche KDS öffnen (/owner)',
    },
    it: {
      errFirstName: 'Inserisci il tuo nome',
      errPhone: 'Inserisci un numero di telefono valido',
      errStreet: 'Inserisci la via e il numero civico per la consegna',
      errClosed: 'Il locale è chiuso nel giorno selezionato',
      errCardNumber: 'Inserisci un numero di carta valido a 16 cifre',
      errExpiry: 'Inserisci la scadenza della carta (MM/AA)',
      errCvc: 'Inserisci il codice CVC',
      errCardName: 'Inserisci il nome del titolare della carta',
      stepEncrypt: 'Crittografia dati carta tramite Stripe Elements...',
      step3ds: 'Autenticazione 3D Secure con la tua banca...',
      stepCreateOrder: 'Creazione e conferma della comanda...',
      aptPrefix: 'int.',
      entPrefix: 'scala',
      floorPrefix: 'piano',
      intercomPrefix: 'citofono',
      kdsBtn: '👨‍🍳 Apri Cucina KDS (/owner)',
    },
    ru: {
      errFirstName: 'Пожалуйста, укажите ваше имя',
      errPhone: 'Укажите контактный номер телефона',
      errStreet: 'Укажите улицу и номер дома для доставки',
      errClosed: 'Ресторан закрыт в выбранный день',
      errCardNumber: 'Введите корректный номер карты (16 цифр)',
      errExpiry: 'Укажите срок действия карты (ММ/ГГ)',
      errCvc: 'Укажите код CVC',
      errCardName: 'Укажите имя держателя карты',
      stepEncrypt: 'Шифрование данных карты через Stripe Elements...',
      step3ds: 'Подтверждение 3D Secure с банком...',
      stepCreateOrder: 'Создание и подтверждение заказа...',
      aptPrefix: 'кв.',
      entPrefix: 'подъезд',
      floorPrefix: 'этаж',
      intercomPrefix: 'домофон',
      kdsBtn: '👨‍🍳 Открыть KDS Кухню (/owner)',
    },
  }[language];

  const validateForm = () => {
    setErrorMessage('');
    if (!firstName.trim()) {
      setErrorMessage(validationTexts.errFirstName);
      setActiveMobileSheet('personal');
      return false;
    }
    if (!phone.trim() || phone.trim().length < 6) {
      setErrorMessage(validationTexts.errPhone);
      setActiveMobileSheet('personal');
      return false;
    }
    if (fulfillmentType === 'consegna') {
      if (!streetAddress.trim()) {
        setErrorMessage(validationTexts.errStreet);
        setActiveMobileSheet('address');
        return false;
      }
    }
    if (!isAsap && isSelectedDayClosed) {
      setErrorMessage(validationTexts.errClosed);
      setActiveMobileSheet('time');
      return false;
    }

    if (paymentMethod === 'card') {
      const cleanCard = cardNumber.replace(/\s+/g, '');
      if (cleanCard.length < 15) {
        setErrorMessage(validationTexts.errCardNumber);
        setActiveMobileSheet('payment');
        return false;
      }
      if (cardExpiry.length < 5) {
        setErrorMessage(validationTexts.errExpiry);
        setActiveMobileSheet('payment');
        return false;
      }
      if (cardCvc.length < 3) {
        setErrorMessage(validationTexts.errCvc);
        setActiveMobileSheet('payment');
        return false;
      }
      if (!cardName.trim()) {
        setErrorMessage(validationTexts.errCardName);
        setActiveMobileSheet('payment');
        return false;
      }
    }

    return true;
  };

  const handleProcessPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    setErrorMessage('');

    if (paymentMethod === 'card') {
      setProcessingStep(validationTexts.stepEncrypt);
      await new Promise(r => setTimeout(r, 600));
      setProcessingStep(validationTexts.step3ds);
      await new Promise(r => setTimeout(r, 700));
    } else {
      setProcessingStep(validationTexts.stepCreateOrder);
      await new Promise(r => setTimeout(r, 600));
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const chosenTime = isAsap
      ? fulfillmentType === 'consegna'
        ? labels.summaryDeliveryTime
        : labels.summaryPickupTime
      : `${activeDayConfig.label} ${selectedSlot ? `(${selectedSlot})` : ''}`;

    const addressParts = [
      streetAddress.trim(),
      apartment.trim() ? `${validationTexts.aptPrefix} ${apartment.trim()}` : null,
      entrance.trim() ? `${validationTexts.entPrefix} ${entrance.trim()}` : null,
      floor.trim() ? `${validationTexts.floorPrefix} ${floor.trim()}` : null,
      intercom.trim() ? `${validationTexts.intercomPrefix} ${intercom.trim()}` : null,
      city,
    ].filter(Boolean);

    const fullAddress = fulfillmentType === 'consegna' ? addressParts.join(', ') : undefined;

    const notesList = [
      leaveAtDoor ? labels.leaveAtDoor : null,
      doNotRing ? labels.doNotRing : null,
      courierNote.trim() || null,
    ].filter(Boolean);

    const customer: CustomerOrderInfo = {
      name: fullName,
      phone: phone.trim(),
      email: email.trim() || undefined,
      fulfillmentType,
      deliveryAddress: fullAddress,
      deliveryCity: city,
      postalCode,
      timeSlot: chosenTime,
      paymentMethod,
      notes: notesList.length > 0 ? notesList.join(' | ') : undefined,
    };

    const newOrder = submitOrder(customer);
    setCompletedOrder(newOrder);
    setIsProcessing(false);
  };

  // Summary strings for mobile collapsed rows
  const addressSummaryText = useMemo(() => {
    if (!streetAddress.trim()) return '';
    const extras = [
      apartment.trim() ? `${labels.apartment} ${apartment.trim()}` : null,
      entrance.trim() ? `${labels.entrance} ${entrance.trim()}` : null,
      floor.trim() ? `${labels.floor} ${floor.trim()}` : null,
    ].filter(Boolean);
    return extras.length > 0 ? `${streetAddress.trim()} (${extras.join(', ')})` : streetAddress.trim();
  }, [streetAddress, apartment, entrance, floor, labels]);

  const personalSummaryText = useMemo(() => {
    const parts = [`${firstName.trim()} ${lastName.trim()}`.trim(), phone.trim()].filter(Boolean);
    return parts.join(' · ');
  }, [firstName, lastName, phone]);

  const cardSavedOnMobile = Boolean(
    cardNumber.replace(/\s+/g, '').length >= 4 && (cardExpiry.trim() || cardName.trim())
  );

  // If order was completed successfully, show confirmation screen in matching light style
  if (completedOrder) {
    return (
      <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto animate-fadeIn">
        <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-10 shadow-sm text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-600 shadow-sm">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#ff5500] font-black">
              {labels.orderSuccessTitle}
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#21201F] tracking-tight">
              {labels.orderSuccessSub}
            </h1>
            <p className="text-sm text-neutral-500 max-w-md mx-auto">
              {labels.orderSuccessPaid}{' '}
              <strong className="text-[#21201F] font-bold text-base">
                {completedOrder.total.toFixed(2).replace('.', ',')} €
              </strong>
            </p>
          </div>

          <div className="bg-[#f8f9fa] border border-neutral-200/80 rounded-2xl p-5 text-left space-y-3.5 text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60">
              <span className="text-neutral-500">{labels.orderNumber}:</span>
              <span className="font-heading font-black text-[#ff5500] text-base sm:text-lg">
                #{completedOrder.id}
              </span>
            </div>

            <div className="flex items-start justify-between pb-3 border-b border-neutral-200/60 gap-4">
              <span className="text-neutral-500 shrink-0">{labels.deliveryTo}:</span>
              <span className="text-neutral-900 font-medium text-right">
                {completedOrder.deliveryAddress || STORE_DETAILS.address}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-neutral-500">{labels.timeConfirmed}:</span>
              <span className="text-neutral-900 font-semibold">{completedOrder.timeSlot}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setActivePlacedOrder(completedOrder);
              }}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-[#ff5500] hover:bg-[#ff6611] text-white font-bold text-sm shadow-md shadow-[#ff5500]/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{labels.trackOrder}</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('owner');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-[#12151f] hover:bg-[#1c2233] text-white font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{validationTexts.kdsBtn}</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-[#f2f2f4] hover:bg-neutral-200 text-neutral-800 font-semibold text-sm transition cursor-pointer"
            >
              {labels.backToMenu}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-[#ff5500]/10 border border-[#ff5500]/20 flex items-center justify-center text-[#ff5500] mb-4">
          <CreditCard className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black font-heading text-[#21201F] mb-2">{labels.emptyCart}</h2>
        <p className="text-sm text-neutral-500 mb-6 max-w-sm leading-relaxed">
          {labels.emptyCartSub}
        </p>
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-6 py-3.5 bg-[#ff5500] hover:bg-[#ff6611] text-white font-bold rounded-2xl transition shadow-md shadow-[#ff5500]/25 cursor-pointer"
        >
          {labels.backToMenu}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F4F2] md:bg-white md:min-h-screen text-[#21201F] selection:bg-[#ff5500] selection:text-white">
      {/* ===================================================================== */}
      {/* MOBILE CHECKOUT VIEW (md:hidden) - Matches Screenshots 3, 4, 5        */}
      {/* ===================================================================== */}
      <div className="md:hidden">
        {/* BLOCK 1: Header + Address Row + Courier Comment + Delivery Toggles (Screen 3) */}
        <div className="bg-white rounded-b-[28px] px-4 pt-3 pb-3">
          {/* Top Header: Left Arrow + Centered Title ("Checkout / Оформление заказа") */}
          <div className="relative flex items-center justify-center h-[44px] mb-1">
            <button
              type="button"
              onClick={() => {
                setCurrentView('cart');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title={labels.back}
              aria-label={labels.back}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-[#21201F] active:scale-90 transition cursor-pointer select-none"
            >
              <ArrowLeft className="w-[22px] h-[22px] stroke-[2]" />
            </button>

            <h1 className="text-[18px] font-semibold text-[#21201F] tracking-tight">
              {labels.title}
            </h1>
          </div>

          {/* Segmented Pickup / Delivery Switcher at the very top */}
          <div className="mb-1.5 bg-[#F5F4F2] p-1 rounded-[16px] grid grid-cols-2 gap-1 select-none">
            <button
              type="button"
              onClick={() => setFulfillmentType('asporto')}
              className={`py-2 px-3 rounded-[12px] text-[13px] font-semibold transition-all duration-200 cursor-pointer text-center ${
                fulfillmentType === 'asporto'
                  ? 'bg-white text-[#21201F] shadow-2xs'
                  : 'bg-transparent text-[#8A8784] hover:text-[#21201F]'
              }`}
            >
              {labels.pickupTab}
            </button>
            <button
              type="button"
              onClick={() => setFulfillmentType('consegna')}
              className={`py-2 px-3 rounded-[12px] text-[13px] font-semibold transition-all duration-200 cursor-pointer text-center ${
                fulfillmentType !== 'asporto'
                  ? 'bg-white text-[#21201F] shadow-2xs'
                  : 'bg-transparent text-[#8A8784] hover:text-[#21201F]'
              }`}
            >
              {labels.deliveryTab}
            </button>
          </div>

          <div className="divide-y divide-[#F0EFED]">
            {/* Row: Delivery / pickup time right under the switcher */}
            <button
              type="button"
              onClick={() => setActiveMobileSheet('time')}
              className="w-full py-3.5 flex items-center justify-between gap-3 text-left cursor-pointer select-none active:opacity-75 transition"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <Clock className="w-5 h-5 text-[#21201F] stroke-[2] shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] text-[#21201F] font-normal leading-snug">
                    {labels.timeTitle}
                  </div>
                  <div className="text-[13px] text-[#9E9B98] truncate mt-0.5">
                    {getScheduledTimeDisplay(false)}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#21201F] stroke-[2] shrink-0" />
            </button>

            {fulfillmentType !== 'asporto' ? (
              <>
                {/* Row 1: Delivery Address Trigger (opens Address Sheet matching Screen 4) */}
                <button
                  type="button"
                  onClick={() => setActiveMobileSheet('address')}
                  className="w-full py-3.5 flex items-center justify-between gap-3 text-left cursor-pointer select-none active:opacity-75 transition"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Orange ring icon matching Screen 3 */}
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      <div className="w-[15px] h-[15px] rounded-full border-[3.5px] border-[#FF4A00]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-[15px] leading-snug truncate ${
                          addressSummaryText
                            ? 'text-[#21201F] font-normal'
                            : 'text-[#9E9B98] font-normal'
                        }`}
                      >
                        {addressSummaryText || labels.deliveryAddressTitle}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#21201F] stroke-[2] shrink-0" />
                </button>

                {/* Row 2: Courier Comment inline row matching Screen 3 with floating label */}
                <MobileUnderlineFloatingInput
                  label={labels.courierComment}
                  value={courierNote}
                  onChange={e => setCourierNote(e.target.value)}
                  leftAdornment={
                    <MessageSquare className="w-5 h-5 text-[#21201F] fill-[#21201F] shrink-0" />
                  }
                  className="border-b-0"
                />

                {/* Row 3: Leave at the door toggle matching Screen 3 */}
                <div className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <DoorClosed className="w-5 h-5 text-[#21201F] stroke-[2] shrink-0" />
                    <span className="text-[15px] text-[#21201F] font-normal">
                      {labels.leaveAtDoor}
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={leaveAtDoor}
                    onClick={() => setLeaveAtDoor(!leaveAtDoor)}
                    className={`w-[50px] h-[30px] rounded-full transition-colors cursor-pointer p-[2px] relative shrink-0 ${
                      leaveAtDoor ? 'bg-[#FF4A00]' : 'bg-[#EEEDEB]'
                    }`}
                  >
                    <div
                      className={`w-[26px] h-[26px] rounded-full bg-white shadow-xs transition-transform transform ${
                        leaveAtDoor ? 'translate-x-[20px]' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Row 4: Do not ring doorbell toggle */}
                <div className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <BellOff className="w-5 h-5 text-[#21201F] stroke-[2] shrink-0" />
                    <span className="text-[15px] text-[#21201F] font-normal">
                      {labels.doNotRing}
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={doNotRing}
                    onClick={() => setDoNotRing(!doNotRing)}
                    className={`w-[50px] h-[30px] rounded-full transition-colors cursor-pointer p-[2px] relative shrink-0 ${
                      doNotRing ? 'bg-[#FF4A00]' : 'bg-[#EEEDEB]'
                    }`}
                  >
                    <div
                      className={`w-[26px] h-[26px] rounded-full bg-white shadow-xs transition-transform transform ${
                        doNotRing ? 'translate-x-[20px]' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </>
            ) : (
              <div className="py-3.5 flex items-center gap-3.5">
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <div className="w-[15px] h-[15px] rounded-full border-[3.5px] border-[#FF4A00]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-medium text-[#21201F] leading-snug">
                    {STORE_DETAILS.address}
                  </div>
                  <div className="text-[13px] text-[#9E9B98] mt-0.5">{labels.pickupHours}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BLOCK 2: Payment Method Card ("Способы оплаты / Payment method" - Screen 3) */}
        <div className="bg-white rounded-[28px] mt-2.5 px-4 py-4">
          <h2 className="text-[20px] font-bold text-[#21201F] tracking-tight mb-3">
            {labels.paymentMethodTitle}
          </h2>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-0.5">
            {/* Compact Card Box (opens Card Sheet matching Screen 3 & Screen 5) */}
            <button
              type="button"
              onClick={() => {
                setPaymentMethod('card');
                setActiveMobileSheet('payment');
              }}
              className={`w-[128px] h-[94px] rounded-[20px] border p-3 flex flex-col justify-between text-left transition cursor-pointer select-none shrink-0 ${
                cardSavedOnMobile
                  ? 'border-[#21201F] bg-white'
                  : 'border-[#E8E7E6] bg-white active:scale-[0.98]'
              }`}
            >
              <CreditCard
                className={`w-6 h-6 stroke-[1.8] ${
                  cardSavedOnMobile ? 'text-[#FF4A00]' : 'text-[#8A8784]'
                }`}
              />
              <div className="text-[13px] leading-[1.2] text-[#8A8784] font-normal line-clamp-2">
                {cardSavedOnMobile
                  ? `•••• ${cardNumber.replace(/\s+/g, '').slice(-4)}`
                  : labels.addCardBox}
              </div>
            </button>
          </div>
        </div>

        {/* BLOCK 3: Personal Details Category Row */}
        <div className="bg-white rounded-[28px] mt-2.5 px-4 py-2 divide-y divide-[#F0EFED]">
          {/* Category Row: Personal details */}
          <button
            type="button"
            onClick={() => setActiveMobileSheet('personal')}
            className="w-full py-3.5 flex items-center justify-between gap-3 text-left cursor-pointer select-none active:opacity-75 transition"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <User className="w-5 h-5 text-[#21201F] stroke-[2] shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[15px] text-[#21201F] font-normal leading-snug">
                  {labels.contactTitle}
                </div>
                {personalSummaryText && (
                  <div className="text-[13px] text-[#9E9B98] truncate mt-0.5">
                    {personalSummaryText}
                  </div>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#21201F] stroke-[2] shrink-0" />
          </button>
        </div>

        {/* BLOCK 4: Order Summary & Pay Button (Flush with Footer) */}
        <div className="bg-white rounded-t-[28px] mt-2.5 px-4 pt-4 pb-5 space-y-3.5">
          <div>
            <h2 className="text-[20px] font-bold text-[#21201F] tracking-tight">
              {labels.summaryTitle}
            </h2>

            <p className="text-[14px] text-[#9E9B98] mt-1">
              {getScheduledTimeDisplay(true)}
            </p>
          </div>

          <div className="border-t border-[#F0EFED]" />

          <div className="space-y-2 text-[15px] text-[#21201F]">
            <div className="flex items-center justify-between">
              <span className="text-[#8A8784]">{labels.productsTotal(itemsCount)}</span>
              <span className="font-semibold">
                {(Number(subtotal) || 0).toFixed(2).replace('.', ',')} €
              </span>
            </div>

            {appliedCoupon && (
              <div className="flex items-center justify-between text-[#e62e2e]">
                <span className="flex items-center gap-1 font-medium">
                  <Tag className="w-4 h-4" />
                  {labels.discount} ({appliedCoupon})
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    -{(Number(discountAmount) || 0).toFixed(2).replace('.', ',')} €
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs text-neutral-400 hover:text-red-500 underline cursor-pointer"
                  >
                    {labels.removePromo}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-[#8A8784]">{labels.delivery}</span>
              <span className="font-semibold">
                {deliveryFee === 0
                  ? labels.free
                  : `${(Number(deliveryFee) || 0).toFixed(2).replace('.', ',')} €`}
              </span>
            </div>

            <div className="border-t border-[#F0EFED] pt-2 mt-2" />

            <div className="flex items-baseline justify-between pt-0.5">
              <span className="font-bold text-[18px] text-[#21201F]">{labels.toPay}</span>
              <span className="font-bold text-[20px] text-[#21201F] tracking-tight">
                {(Number(total) || 0).toFixed(2).replace('.', ',')} €
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isProcessing && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5 animate-fadeIn">
              <div className="w-4 h-4 border-2 border-[#FF4A00] border-t-transparent rounded-full animate-spin shrink-0" />
              <span className="font-medium">{processingStep || labels.processing}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => handleProcessPayment()}
            disabled={isProcessing || items.length === 0}
            className="w-full h-[54px] rounded-[18px] bg-[#FF4A00] hover:bg-[#ff5500] active:scale-[0.99] disabled:opacity-50 text-white font-semibold text-[16px] shadow-md shadow-[#FF4A00]/25 transition flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            <span>{labels.payBtn((Number(total) || 0).toFixed(2).replace('.', ','))}</span>
            <ArrowRight className="w-5 h-5 stroke-[2.2] text-white" />
          </button>
        </div>

        {/* ================================================================= */}
        {/* MOBILE BOTTOM SHEETS FOR EACH CATEGORY (Screens 3, 4 & 5)         */}
        {/* ================================================================= */}
        <div
          aria-hidden={!activeMobileSheet}
          className={`fixed inset-0 z-[90] flex flex-col justify-end ${
            activeMobileSheet
              ? 'pointer-events-auto visible [transition:visibility_0s_linear_0s]'
              : 'pointer-events-none invisible [transition:visibility_0s_linear_0.34s]'
          }`}
          onClick={closeMobileSheet}
        >
          {/* Smooth Backdrop Overlay */}
          <div
            style={{
              opacity: activeMobileSheet ? Math.max(0, 1 - sheetDragY / 380) : 0,
              transition: isSheetDragging
                ? 'none'
                : 'opacity 0.32s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
          />

          {/* Smooth Sliding Sheet Wrapper */}
          <div
            ref={mobileSheetPanelRef}
            onClick={e => e.stopPropagation()}
            onTouchStart={handleMobileSheetTouchStart}
            onTouchMove={handleMobileSheetTouchMove}
            onTouchEnd={handleMobileSheetTouchEnd}
            onTouchCancel={handleMobileSheetTouchEnd}
            style={{
              transform: activeMobileSheet
                ? `translate3d(0, ${sheetDragY}px, 0)`
                : 'translate3d(0, 105%, 0)',
              transition: isSheetDragging
                ? 'none'
                : 'transform 0.34s cubic-bezier(0.32, 0.72, 0, 1)',
              willChange: 'transform',
            }}
            className="relative z-10 w-full flex flex-col justify-end max-h-full"
          >
            {/* Top Drag Pill Indicator */}
            <div
              onClick={closeMobileSheet}
              className="w-full pt-1.5 pb-1.5 flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing select-none"
            >
              <div className="w-10 h-1 rounded-full bg-white/80 shadow-2xs" />
            </div>

            <div
              ref={mobileSheetScrollRef}
              style={{ overscrollBehaviorY: 'contain', WebkitOverflowScrolling: 'touch' }}
              className="w-full bg-white rounded-t-[28px] px-4 pt-5 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] max-h-[90dvh] overflow-y-auto no-scrollbar shadow-[0_-10px_40px_rgba(0,0,0,0.28)]"
            >
              {/* 1. ADDRESS SHEET (Matches Screen 4 with floating top-left labels on focus/fill) */}
              {(activeMobileSheet || renderedMobileSheet) === 'address' && (
                <div>
                  <h2 className="text-[22px] font-bold text-[#21201F] tracking-tight mb-2">
                    {labels.deliveryAddressTitle}
                  </h2>

                  {/* Street & house number row with chevron & floating label */}
                  <MobileUnderlineFloatingInput
                    label={labels.streetLabel}
                    value={streetAddress}
                    onChange={e => setStreetAddress(e.target.value)}
                    rightAdornment={
                      <ChevronRight className="w-5 h-5 text-[#21201F] stroke-[2] shrink-0" />
                    }
                  />

                  {/* 2x2 Grid: Apartment, Intercom, Entrance, Floor (Screen 4 with floating labels) */}
                  <div className="grid grid-cols-2 gap-x-4 mt-0.5">
                    <MobileUnderlineFloatingInput
                      label={labels.apartment}
                      value={apartment}
                      onChange={e => setApartment(e.target.value)}
                    />
                    <MobileUnderlineFloatingInput
                      label={labels.intercom}
                      value={intercom}
                      onChange={e => setIntercom(e.target.value)}
                    />
                    <MobileUnderlineFloatingInput
                      label={labels.entrance}
                      value={entrance}
                      onChange={e => setEntrance(e.target.value)}
                    />
                    <MobileUnderlineFloatingInput
                      label={labels.floor}
                      value={floor}
                      onChange={e => setFloor(e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={closeMobileSheet}
                    className="w-full h-[52px] rounded-[18px] bg-[#FF4A00] hover:bg-[#ff5500] active:scale-[0.99] text-white font-semibold text-[16px] flex items-center justify-center mt-6 cursor-pointer select-none transition"
                  >
                    {labels.saveBtn}
                  </button>
                </div>
              )}

              {/* 2. PAYMENT / CARD SHEET (Matches Screen 5 with our fields: Card number, MM/YY, CVC, Name on card, Save card) */}
              {(activeMobileSheet || renderedMobileSheet) === 'payment' && (
                <div>
                  <button
                    type="button"
                    onClick={closeMobileSheet}
                    className="w-8 h-8 -ml-1.5 mb-2 flex items-center justify-center text-[#21201F] cursor-pointer"
                  >
                    <ChevronLeft className="w-6 h-6 stroke-[2]" />
                  </button>

                  <h2 className="text-[24px] font-bold text-[#21201F] leading-[1.15] tracking-tight mb-4">
                    {labels.addCardSheetTitle}
                  </h2>

                  <div className="space-y-3">
                    {/* Card Number */}
                    <div className="bg-[#F5F4F2] rounded-[18px] px-4 py-3">
                      <label className="block text-[12px] text-[#8A8784] mb-1">
                        {labels.cardNumber}
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          className="w-full bg-transparent text-[17px] text-[#21201F] font-mono placeholder-[#B5B2AF] focus:outline-none pr-8"
                        />
                        <CreditCard className="w-5 h-5 text-[#8A8784] shrink-0" />
                      </div>
                    </div>

                    {/* MM/YY & CVC */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#F5F4F2] rounded-[18px] px-4 py-3">
                        <label className="block text-[12px] text-[#8A8784] mb-1">
                          {labels.expiry}
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="12/28"
                          maxLength={5}
                          className="w-full bg-transparent text-[17px] text-[#21201F] font-mono placeholder-[#B5B2AF] focus:outline-none"
                        />
                      </div>
                      <div className="bg-[#F5F4F2] rounded-[18px] px-4 py-3">
                        <label className="block text-[12px] text-[#8A8784] mb-1">
                          {labels.cvc}
                        </label>
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={handleCvcChange}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full bg-transparent text-[17px] text-[#21201F] font-mono placeholder-[#B5B2AF] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Name on Card */}
                    <div className="bg-[#F5F4F2] rounded-[18px] px-4 py-3">
                      <label className="block text-[12px] text-[#8A8784] mb-1">
                        {labels.cardHolder}
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                        placeholder="DAVID COHEN"
                        className="w-full bg-transparent text-[16px] text-[#21201F] uppercase placeholder-[#B5B2AF] focus:outline-none"
                      />
                    </div>

                    {/* Save card checkbox */}
                    <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={e => setSaveCard(e.target.checked)}
                        className="w-4 h-4 accent-[#FF4A00] rounded cursor-pointer"
                      />
                      <span className="text-[13px] text-[#21201F]">{labels.saveCard}</span>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={closeMobileSheet}
                    className="w-full h-[52px] rounded-[18px] bg-[#FF4A00] hover:bg-[#ff5500] active:scale-[0.99] text-white font-semibold text-[16px] flex items-center justify-center mt-5 cursor-pointer select-none transition"
                  >
                    {labels.saveBtn}
                  </button>
                </div>
              )}

              {/* 3. PERSONAL DETAILS SHEET (Our 4 fields with floating labels: First name *, Last name, Mobile phone *, Email address) */}
              {(activeMobileSheet || renderedMobileSheet) === 'personal' && (
                <div>
                  <h2 className="text-[22px] font-bold text-[#21201F] tracking-tight mb-2">
                    {labels.contactTitle}
                  </h2>

                  <div>
                    <MobileUnderlineFloatingInput
                      label={`${labels.firstName} *`}
                      required
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                    />
                    <MobileUnderlineFloatingInput
                      label={labels.lastName}
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                    />
                    <MobileUnderlineFloatingInput
                      type="tel"
                      required
                      label={`${labels.phone} *`}
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                    <MobileUnderlineFloatingInput
                      type="email"
                      label={labels.email}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={closeMobileSheet}
                    className="w-full h-[52px] rounded-[18px] bg-[#FF4A00] hover:bg-[#ff5500] active:scale-[0.99] text-white font-semibold text-[16px] flex items-center justify-center mt-6 cursor-pointer select-none transition"
                  >
                    {labels.saveBtn}
                  </button>
                </div>
              )}

              {/* 4. DELIVERY / PICKUP TIME SHEET (Synced with CartContext & Header) */}
              {(activeMobileSheet || renderedMobileSheet) === 'time' && (
                <div>
                  <h2 className="text-[22px] font-bold text-[#21201F] tracking-tight mb-4">
                    {labels.timeTitle}
                  </h2>

                  <div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAsapMode}
                        className={`py-3 px-3 rounded-2xl text-[13px] font-semibold border transition-all duration-200 cursor-pointer select-none text-center ${
                          isAsap
                            ? 'border-[#21201F] bg-white text-[#21201F]'
                            : 'border-[#E8E7E6] bg-white text-[#8A8784]'
                        }`}
                      >
                        {labels.asap}
                      </button>
                      <button
                        type="button"
                        onClick={handleSelectScheduleMode}
                        className={`py-3 px-3 rounded-2xl text-[13px] font-semibold border transition-all duration-200 cursor-pointer select-none text-center ${
                          !isAsap
                            ? 'border-[#21201F] bg-white text-[#21201F]'
                            : 'border-[#E8E7E6] bg-white text-[#8A8784]'
                        }`}
                      >
                        {labels.scheduleTime}
                      </button>
                    </div>

                    {/* Smooth CSS Grid expandable time-slot selector */}
                    <div
                      className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                        !isAsap
                          ? 'grid-rows-[1fr] opacity-100 mt-3'
                          : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="p-3.5 bg-[#F5F4F2] rounded-2xl space-y-3">
                          <div className="w-full flex items-center justify-between gap-1 overflow-x-auto no-scrollbar pb-0.5 select-none">
                            {availableDays.map(d => (
                              <button
                                key={d.dayIndex}
                                type="button"
                                disabled={d.isClosed}
                                onClick={() => handleSelectDayOnCheckout(d.dayIndex)}
                                className={`flex-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer text-center ${
                                  d.isClosed
                                    ? 'opacity-40 cursor-not-allowed bg-white/50 text-neutral-400'
                                    : selectedDayIndex === d.dayIndex
                                    ? 'bg-[#FF4A00] text-white'
                                    : 'bg-white text-[#21201F]'
                                }`}
                              >
                                {d.label}
                              </button>
                            ))}
                          </div>

                          {activeDayConfig.slots.length > 0 && (
                            <div className="grid grid-cols-4 gap-1.5 pt-1">
                              {activeDayConfig.slots.map(slot => (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => handleSelectSlotOnCheckout(slot)}
                                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-center ${
                                    selectedSlot === slot
                                      ? 'bg-[#21201F] text-white'
                                      : 'bg-white text-[#21201F]'
                                  }`}
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closeMobileSheet}
                    className="w-full h-[52px] rounded-[18px] bg-[#FF4A00] hover:bg-[#ff5500] active:scale-[0.99] text-white font-semibold text-[16px] flex items-center justify-center mt-6 cursor-pointer select-none transition"
                  >
                    {labels.saveBtn}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* DESKTOP CHECKOUT VIEW (hidden md:block) - Kept 100% Unchanged         */}
      {/* ===================================================================== */}
      <div className="hidden md:block max-w-[990px] mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fadeIn">
        {/* 1. TOP BAR: Back Link */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => {
              setCurrentView('cart');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer group select-none font-medium"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{labels.back}</span>
          </button>
        </div>

        {/* 2. PAGE HEADER: "Оформление заказа" / "Completa l'ordine" */}
        <div className="flex items-center justify-between mb-8 pb-1">
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#21201F] tracking-tight">
            {labels.title}
          </h1>

          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-1 rounded-full text-[11px] font-medium">
              <Lock className="w-3 h-3 text-emerald-600" />
              {labels.sslBadge}
            </span>
          </div>
        </div>

        {/* 3. MAIN 2-COLUMN LAYOUT: matching Cart layout */}
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-[62px] mb-16 items-start relative">
          {/* ======================================================== */}
          {/* LEFT COLUMN: Checkout Sections (560px) */}
          {/* ======================================================== */}
          <div className="w-full lg:w-[560px] max-w-[560px] shrink-0 space-y-8">
            <form onSubmit={handleProcessPayment} className="space-y-8" id="checkout-form">
              {/* ---------------------------------------------------- */}
              {/* SECTION 1: SPOSOBO OPLATY (Payment Method - Screen 2) */}
              {/* ---------------------------------------------------- */}
              <div className="space-y-3.5">
                <h2 className="font-heading font-black text-xl sm:text-2xl text-[#21201F] tracking-tight">
                  {labels.paymentMethodTitle}
                </h2>

                {/* Payment Option Selection Pills/Cards */}
                <div className="space-y-2.5">
                  {/* Card Option (Primary default) */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`border border-[1px] rounded-2xl p-4 flex items-center justify-between cursor-pointer transition select-none ${
                      paymentMethod === 'card'
                        ? 'border-[#21201F] bg-white shadow-2xs'
                        : 'border-[#E8E7E6] bg-white hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          paymentMethod === 'card'
                            ? 'bg-[#ff5500] text-white'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 stroke-[2]" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#21201F] leading-tight">
                          {labels.cardOption}
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5">{labels.cardSub}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-neutral-400 hidden sm:inline">
                        Stripe
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition ${
                          paymentMethod === 'card' ? 'text-[#21201F] rotate-90' : 'text-neutral-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expanded Card Details Form if card is selected */}
                  {paymentMethod === 'card' && (
                    <div className="p-4 sm:p-5 bg-white border border-[1px] border-[#E8E7E6] rounded-2xl space-y-3.5 animate-fadeIn">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                          {labels.cardNumber}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="4000 1234 5678 9010"
                            maxLength={19}
                            style={{ height: '56px' }}
                            className="w-full h-[56px] min-h-[56px] bg-white border border-[1px] border-[#E8E7E6] rounded-2xl px-3.5 pr-11 text-sm sm:text-base text-[#21201F] font-mono font-semibold placeholder-neutral-400 focus:outline-none focus:border-[#ff5500] transition"
                          />
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-neutral-400 pointer-events-none">
                            <CreditCard className="w-5 h-5 text-neutral-400" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                            {labels.expiry}
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            placeholder="12/28"
                            maxLength={5}
                            style={{ height: '56px' }}
                            className="w-full h-[56px] min-h-[56px] bg-white border border-[1px] border-[#E8E7E6] rounded-2xl px-3.5 text-sm sm:text-base text-[#21201F] font-mono font-semibold placeholder-neutral-400 focus:outline-none focus:border-[#ff5500] transition"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                            {labels.cvc}
                          </label>
                          <input
                            type="password"
                            value={cardCvc}
                            onChange={handleCvcChange}
                            placeholder="•••"
                            maxLength={4}
                            style={{ height: '56px' }}
                            className="w-full h-[56px] min-h-[56px] bg-white border border-[1px] border-[#E8E7E6] rounded-2xl px-3.5 text-sm sm:text-base text-[#21201F] font-mono font-semibold placeholder-neutral-400 focus:outline-none focus:border-[#ff5500] transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                          {labels.cardHolder}
                        </label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={e => setCardName(e.target.value)}
                          placeholder="DAVID COHEN"
                          style={{ height: '56px' }}
                          className="w-full h-[56px] min-h-[56px] bg-white border border-[1px] border-[#E8E7E6] rounded-2xl px-3.5 text-sm sm:text-base text-[#21201F] font-semibold uppercase placeholder-neutral-400 focus:outline-none focus:border-[#ff5500] transition"
                        />
                      </div>

                      <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={saveCard}
                          onChange={e => setSaveCard(e.target.checked)}
                          className="w-4 h-4 accent-[#ff5500] rounded cursor-pointer"
                        />
                        <span className="text-xs text-neutral-600 font-medium">
                          {labels.saveCard}
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* SECTION 2: ADRES DOSTAVKI (Address - Only when Consegna / Delivery) */}
              {/* ---------------------------------------------------- */}
              {fulfillmentType !== 'asporto' && (
                <div className="space-y-3.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading font-black text-xl sm:text-2xl text-[#21201F] tracking-tight">
                      {labels.deliveryAddressTitle}
                    </h2>
                  </div>

                  {/* Delivery Inputs (Floating Labels: Street + 4-col grid: Apt/Intercom/Entrance/Floor + Courier note) */}
                  <div className="space-y-3">
                    {/* Main Street Address */}
                    <FloatingInput
                      label={labels.streetLabel}
                      value={streetAddress}
                      onChange={e => setStreetAddress(e.target.value)}
                    />

                    {/* 4-col Grid: Apartment, Intercom, Entrance, Floor (16px label idle, floats to top-left on focus) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <FloatingInput
                        label={labels.apartment}
                        value={apartment}
                        onChange={e => setApartment(e.target.value)}
                      />
                      <FloatingInput
                        label={labels.intercom}
                        value={intercom}
                        onChange={e => setIntercom(e.target.value)}
                      />
                      <FloatingInput
                        label={labels.entrance}
                        value={entrance}
                        onChange={e => setEntrance(e.target.value)}
                      />
                      <FloatingInput
                        label={labels.floor}
                        value={floor}
                        onChange={e => setFloor(e.target.value)}
                      />
                    </div>

                    {/* Courier Comment */}
                    <FloatingInput
                      label={labels.courierComment}
                      value={courierNote}
                      onChange={e => setCourierNote(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* SECTION 3: OPTSIY DOSTAVKI (Delivery Options - Screen 3) */}
              {/* ---------------------------------------------------- */}
              {fulfillmentType !== 'asporto' && (
                <div className="space-y-3.5">
                  <h2 className="font-heading font-black text-xl sm:text-2xl text-[#21201F] tracking-tight">
                    {labels.deliveryOptionsTitle}
                  </h2>

                  <div className="space-y-2.5">
                    {/* Toggle: Leave at door (Screen 3) */}
                    <div className="border border-[1px] border-[#E8E7E6] rounded-2xl p-4 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <DoorClosed className="w-5 h-5 text-neutral-700" />
                        <div>
                          <div className="text-sm font-semibold text-[#21201F]">
                            {labels.leaveAtDoor}
                          </div>
                          <div className="text-xs text-neutral-400">{labels.leaveAtDoorSub}</div>
                        </div>
                      </div>

                      {/* iOS-style Switch Toggle (Screen 3) */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={leaveAtDoor}
                        onClick={() => setLeaveAtDoor(!leaveAtDoor)}
                        className={`w-12 h-7 rounded-full transition-colors cursor-pointer p-0.5 relative shrink-0 ${
                          leaveAtDoor ? 'bg-[#ff5500]' : 'bg-neutral-200'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full bg-white shadow-xs transition-transform transform ${
                            leaveAtDoor ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle: Do not ring doorbell */}
                    <div className="border border-[1px] border-[#E8E7E6] rounded-2xl p-4 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BellOff className="w-5 h-5 text-neutral-700" />
                        <div>
                          <div className="text-sm font-semibold text-[#21201F]">
                            {labels.doNotRing}
                          </div>
                          <div className="text-xs text-neutral-400">{labels.doNotRingSub}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={doNotRing}
                        onClick={() => setDoNotRing(!doNotRing)}
                        className={`w-12 h-7 rounded-full transition-colors cursor-pointer p-0.5 relative shrink-0 ${
                          doNotRing ? 'bg-[#ff5500]' : 'bg-neutral-200'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full bg-white shadow-xs transition-transform transform ${
                            doNotRing ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* SECTION 4: KONTAKTNYE DANNYE (Personal Details - 134x56px, 1px #E8E7E6) */}
              {/* ---------------------------------------------------- */}
              <div className="space-y-3.5">
                <h2 className="font-heading font-black text-xl sm:text-2xl text-[#21201F] tracking-tight">
                  {labels.contactTitle}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* First Name */}
                  <FloatingInput
                    label={`${labels.firstName} *`}
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                  />

                  {/* Last Name */}
                  <FloatingInput
                    label={labels.lastName}
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                  />

                  {/* Phone */}
                  <FloatingInput
                    type="tel"
                    required
                    label={`${labels.phone} *`}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />

                  {/* Email */}
                  <FloatingInput
                    type="email"
                    label={labels.email}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* SECTION 5: VREMYA POLUCHENIYA (Timing Slot) */}
              {/* ---------------------------------------------------- */}
              <div className="space-y-3.5">
                <h2 className="font-heading font-black text-xl sm:text-2xl text-[#21201F] tracking-tight">
                  {labels.timeTitle}
                </h2>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAsapMode}
                      className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-semibold border border-[1px] transition cursor-pointer select-none text-center ${
                        isAsap
                          ? 'border-[#21201F] bg-white text-[#21201F] shadow-2xs'
                          : 'border-[#E8E7E6] bg-white text-neutral-600 hover:border-neutral-400'
                      }`}
                    >
                      {labels.asap}
                    </button>
                    <button
                      type="button"
                      onClick={handleSelectScheduleMode}
                      className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-semibold border border-[1px] transition cursor-pointer select-none text-center ${
                        !isAsap
                          ? 'border-[#21201F] bg-white text-[#21201F] shadow-2xs'
                          : 'border-[#E8E7E6] bg-white text-neutral-600 hover:border-neutral-400'
                      }`}
                    >
                      {labels.scheduleTime}
                    </button>
                  </div>

                  {/* Date & Slot Picker if scheduled */}
                  {!isAsap && (
                    <div className="p-4 bg-white border border-[1px] border-[#E8E7E6] rounded-2xl space-y-3 animate-fadeIn">
                      <div className="w-full flex items-center justify-between gap-1 overflow-x-auto sm:overflow-x-visible no-scrollbar pb-0.5 select-none">
                        {availableDays.map(d => (
                          <button
                            key={d.dayIndex}
                            type="button"
                            disabled={d.isClosed}
                            onClick={() => handleSelectDayOnCheckout(d.dayIndex)}
                            className={`flex-1 px-1.5 sm:px-2 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition cursor-pointer text-center ${
                              d.isClosed
                                ? 'opacity-40 cursor-not-allowed bg-neutral-100 text-neutral-400'
                                : selectedDayIndex === d.dayIndex
                                ? 'bg-[#ff5500] text-white shadow-xs'
                                : 'bg-white text-neutral-700 hover:bg-neutral-200'
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>

                      {activeDayConfig.slots.length > 0 && (
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 pt-1">
                          {activeDayConfig.slots.map(slot => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => handleSelectSlotOnCheckout(slot)}
                              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer text-center ${
                                selectedSlot === slot
                                  ? 'bg-[#21201F] text-white'
                                  : 'bg-white border border-[1px] border-[#E8E7E6] text-neutral-700 hover:border-neutral-400'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Processing Spinner / Loading overlay */}
              {isProcessing && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-center gap-3 animate-fadeIn">
                  <div className="w-5 h-5 border-2 border-[#ff5500] border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="font-semibold">{processingStep || labels.processing}</span>
                </div>
              )}
            </form>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Order Summary (EXACT MATCH of Cart Screen 4) */}
          {/* ======================================================== */}
          <div className="w-full lg:w-[328px] max-w-[328px] shrink-0 self-start lg:sticky lg:top-[90px] z-20">
            <div className="bg-white rounded-3xl p-0 space-y-3">
              {/* Header: "Summary" + Delivery / Pickup Switcher */}
              <div>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#21201F] tracking-tight">
                  {labels.summaryTitle}
                </h2>

                {/* Pickup / Delivery Switcher (Segmented Control matching sidebar cart & CartPage) */}
                <div className="mt-3.5 mb-2 bg-[#f0f0f2] p-1 rounded-2xl grid grid-cols-2 gap-1 select-none">
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('asporto')}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-center ${
                      fulfillmentType === 'asporto'
                        ? 'bg-white text-[#21201f] shadow-xs'
                        : 'bg-transparent text-[#737373] hover:text-neutral-900'
                    }`}
                  >
                    {labels.pickupTab}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('consegna')}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-center ${
                      fulfillmentType !== 'asporto'
                        ? 'bg-white text-[#21201f] shadow-xs'
                        : 'bg-transparent text-[#737373] hover:text-neutral-900'
                    }`}
                  >
                    {labels.deliveryTab}
                  </button>
                </div>

                <p className="text-[16px] text-neutral-400 font-medium mt-2">
                  {getScheduledTimeDisplay(true)}
                </p>
              </div>

              {/* Top Divider Line (spacing reduced by 50%) */}
              <div className="border-t border-neutral-100" />

              {/* Price Breakdown (Exact match of CartPage: 16px font size) */}
              <div className="space-y-2 text-[16px] text-neutral-600">
                <div className="flex items-center justify-between">
                  <span className="text-[16px] text-neutral-700">
                    {labels.productsTotal(itemsCount)}
                  </span>
                  <span className="font-bold text-[16px] text-neutral-900">
                    {(Number(subtotal) || 0).toFixed(2).replace('.', ',')} €
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-[#e62e2e] text-[16px]">
                    <span className="flex items-center gap-1 font-medium">
                      <Tag className="w-4 h-4" />
                      {labels.discount} ({appliedCoupon})
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        -{(Number(discountAmount) || 0).toFixed(2).replace('.', ',')} €
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-neutral-400 hover:text-red-500 underline cursor-pointer"
                      >
                        {labels.removePromo}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[16px] text-neutral-700">{labels.delivery}</span>
                  <span className="font-bold text-[16px] text-neutral-900">
                    {deliveryFee === 0
                      ? labels.free
                      : `${(Number(deliveryFee) || 0).toFixed(2).replace('.', ',')} €`}
                  </span>
                </div>

                {/* Bottom Divider Line (spacing reduced by 50%) */}
                <div className="border-t border-neutral-100 pt-1.5 mt-1.5" />

                {/* Total / To Pay Row (Both label and price 20px) */}
                <div className="flex items-baseline justify-between pt-0.5">
                  <span className="font-bold text-[20px] text-neutral-900">{labels.toPay}</span>
                  <span className="font-heading font-black text-[20px] text-[#21201F] tracking-tight">
                    {(Number(total) || 0).toFixed(2).replace('.', ',')} €
                  </span>
                </div>
              </div>

              {/* Primary Action Button (Strictly 328x56px: Brand Orange, triggers submit) */}
              <button
                type="button"
                onClick={() => handleProcessPayment()}
                disabled={isProcessing || items.length === 0}
                style={{ width: '328px', height: '56px' }}
                className="w-[328px] max-w-full h-[56px] min-h-[56px] rounded-2xl bg-[#ff5500] hover:bg-[#ff6611] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-white font-heading font-black text-base shadow-md shadow-[#ff5500]/25 hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer select-none"
                id="checkout-page-submit-btn"
              >
                <span>{labels.payBtn((Number(total) || 0).toFixed(2).replace('.', ','))}</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5] text-white" />
              </button>

              {/* Pickup Location Info (Shown ONLY when on "Pickup" filter, under the payment window) */}
              {fulfillmentType !== 'consegna' && (
                <div className="pt-2 animate-fadeIn space-y-0.5 text-xs text-neutral-600">
                  <p className="leading-snug">{labels.pickupAddress}</p>
                  <p className="text-neutral-500">{labels.pickupHours}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
