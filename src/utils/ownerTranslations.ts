import { Language } from '../types';

export interface OwnerTranslations {
  sidebarToggleTitle: string;
  brandSubtitle: string;
  navDashboard: string;
  navOrdersKitchen: string;
  navKdsScreen: string;
  navOrderList: string;
  navMenusStock: string;
  navStripePos: string;
  backToStorefront: string;

  searchPlaceholder: string;
  simOrderSending: string;
  simOrderBtn: string;
  simOrderTitle: string;
  fullscreenTitle: string;
  soundOnTitle: string;
  soundOffTitle: string;
  refreshTitle: string;
  stripeSettingsTitle: string;
  greetingHello: string;
  onlineSse: string;
  logoutTitle: string;

  newOrderBanner: (id: string, customer: string, total: string) => string;
  simOrderBanner: (id: string, customer: string) => string;
  simAsap: string;
  simOnlinePaidNote: string;

  loadingKitchen: string;

  // Status badges
  statusReceived: string;
  statusPreparing: string;
  statusFrying: string;
  statusPacking: string;
  statusReady: string;
  statusCompleted: string;

  // KDS Tab
  kdsTitle: string;
  kdsBreadcrumbOrders: string;
  kdsBreadcrumbActive: string;
  slaNormal: string;
  slaWarning: string;
  slaOverdue: string;
  kdsEmptyTitle: string;
  kdsEmptySubtitle: string;
  kdsEmptyTestBtn: string;
  pickupBadge: string;
  deliveryBadge: string;
  receivedAt: (time: string) => string;
  dishesToPrepare: string;
  fallbackDishName: string;
  itemNoteLabel: string;
  orderCommentLabel: string;
  packingCheckTitle: string;
  chkNapkins: string;
  chkSauces: string;
  chkReceipt: string;
  chkBagSealed: string;
  stage1Preparing: string;
  stage2Frying: string;
  stage3Packing: string;
  btnHandOverReady: string;
  btnMarkReadyHandOver: string;
  btnCompleteArchive: string;

  // KDS Right Widgets
  shiftRevenue: string;
  totalOrdersCountLabel: (count: number) => string;
  reportLink: string;
  avgPrepTime: string;
  minShort: string;
  secShort: string;
  inProgressCount: (count: number) => string;
  completedCount: (count: number) => string;
  recentKitchenEvents: string;
  eventOrderPrefix: string;
  eventCustomerPrefix: string;

  // Order List Tab
  orderListTitle: string;
  orderListBreadcrumbOrder: string;
  filterAll: (count: number) => string;
  filterActive: (count: number) => string;
  filterCompleted: (count: number) => string;
  thOrderId: string;
  thTime: string;
  thCustomer: string;
  thItemsAddress: string;
  thDishTimer: string;
  thAmount: string;
  thStatus: string;
  thAction: string;
  pickupWithAddress: string;
  btnToArchive: string;
  btnReadyCheck: string;
  completedCheck: string;
  totalSaleWidget: string;
  kdsScreenLink: string;
  repeatCustomers: string;
  legendNew: string;
  legendReturning: string;

  // Menus & Stock Tab
  menuListTitle: string;
  menuBreadcrumbMenu: string;
  menuBreadcrumbStopStock: string;
  catAllDishes: string;
  catBurgers: string;
  catPitas: string;
  catPlates: string;
  catStarters: string;
  inStockBadge: string;
  stopListBadge: string;
  btnViewDish: string;
  btnToStopList: string;
  btnEnableDish: string;
  warehouseTitle: string;
  warehouseSubtitle: string;
  stockRemaining: string;

  // Dashboard Tab
  kpiTotalOrders: string;
  kpiOrdersDelta: string;
  kpiTotalCustomers: string;
  kpiRegularGuests: string;
  kpiTotalRevenue: string;
  kpiZeroCommission: string;
  chartTotalEarnings: string;
  chartLegendRevenue: string;
  chartLegendFoodCost: string;
  chartThisWeek: string;
  weekdays: [string, string, string, string, string, string, string];
  topCategoriesTitle: string;
  periodMonth: string;
  kosherCenterBadge: string;
  donutBurgers: string;
  donutPitas: string;
  donutPlates: string;
  donutStarters: string;
  recentOrdersTitle: string;
  openKdsKitchenLink: string;
  thOrderName: string;
  thCustomerName: string;
  thLocation: string;
  thOrderStatus: string;
  thDeliveredTime: string;
  thPrice: string;
  pickupStoreLabel: string;
  customerReviewTitle: string;

  // Stripe Tab
  stripeZeroFeeBadge: string;
  stripeHeading: string;
  stripeConnected: string;
  stripeSavedToast: string;
  stripeResetToast: string;
  stripeTestMode: string;
  stripeLiveMode: string;
  stripePubKeyLabel: string;
  stripeSecKeyLabel: string;
  stripeIbanLabel: string;
  stripeSaveBtn: string;
  stripeResetBtn: string;
  stripeRecentTxTitle: string;
  cashLabel: string;
}

export const OWNER_TRANSLATIONS: Record<Language, OwnerTranslations> = {
  fr: {
    sidebarToggleTitle: 'Réduire / développer le menu',
    brandSubtitle: 'Cuisine & Caisse',
    navDashboard: 'Tableau de bord',
    navOrdersKitchen: 'Commandes & Cuisine',
    navKdsScreen: 'Écran Cuisine (Minuteur)',
    navOrderList: 'Liste des commandes',
    navMenusStock: 'Menu & Stock (86)',
    navStripePos: 'Caisse Stripe',
    backToStorefront: 'Retour à la vitrine',

    searchPlaceholder: 'Rechercher une commande, un plat ou un client...',
    simOrderSending: 'Envoi...',
    simOrderBtn: '+ Commande test',
    simOrderTitle: 'Envoyer une commande test en cuisine avec signal sonore',
    fullscreenTitle: 'Plein écran (tablette cuisine)',
    soundOnTitle: 'Son cuisine ACTIVÉ (cliquer pour tester)',
    soundOffTitle: 'Son cuisine DÉSACTIVÉ',
    refreshTitle: 'Actualiser les données',
    stripeSettingsTitle: 'Paramètres de paiement Stripe',
    greetingHello: 'Bonjour, ',
    onlineSse: '● En direct SSE',
    logoutTitle: 'Se déconnecter',

    newOrderBanner: (id, customer, total) =>
      `🔔 NOUVELLE COMMANDE #${id} (${customer}) — ${total}`,
    simOrderBanner: (id, customer) =>
      `⚡ NOUVELLE COMMANDE #${id} (${customer}) PAYÉE ET ENVOYÉE EN CUISINE !`,
    simAsap: 'Dès que possible (ASAP)',
    simOnlinePaidNote: 'Payé en ligne (Stripe •••• 4242)',

    loadingKitchen: 'Chargement des données cuisine et commandes...',

    statusReceived: 'Nouvelle commande',
    statusPreparing: 'En préparation',
    statusFrying: 'Grill / Friteuse',
    statusPacking: 'Emballage',
    statusReady: 'Prêt à remettre',
    statusCompleted: 'Remis',

    kdsTitle: 'Cuisine KDS & Minuteur plats',
    kdsBreadcrumbOrders: 'Commandes',
    kdsBreadcrumbActive: 'En cours en cuisine',
    slaNormal: '● Normal < 6 min',
    slaWarning: '● Attention 6–11 min',
    slaOverdue: '● Retard > 11 min',
    kdsEmptyTitle: 'Toutes les commandes actives ont été préparées et remises !',
    kdsEmptySubtitle:
      'Les nouvelles commandes du site apparaissent ici instantanément avec signal sonore et démarrage automatique du minuteur.',
    kdsEmptyTestBtn: 'Créer une commande test pour vérifier le minuteur',
    pickupBadge: 'À emporter',
    deliveryBadge: 'Livraison',
    receivedAt: time => `Reçue à ${time}`,
    dishesToPrepare: 'Plats à préparer (cocher une fois prêts) :',
    fallbackDishName: 'Plat',
    itemNoteLabel: 'Note :',
    orderCommentLabel: 'Commentaire :',
    packingCheckTitle: 'Contrôle préparation du sac :',
    chkNapkins: 'Serviettes & couverts',
    chkSauces: 'Sauces vérifiées',
    chkReceipt: 'Ticket joint',
    chkBagSealed: 'Sac scellé',
    stage1Preparing: '1. Préparation',
    stage2Frying: '2. Grill/Friteuse',
    stage3Packing: '3. Emballage',
    btnHandOverReady: 'Remettre la commande / Prêt !',
    btnMarkReadyHandOver: 'Marquer prêt & Remettre',
    btnCompleteArchive: 'Terminer la commande (Archiver)',

    shiftRevenue: 'Chiffre du service',
    totalOrdersCountLabel: count => `${count} commandes au total`,
    reportLink: 'Rapport →',
    avgPrepTime: 'Temps moyen',
    minShort: 'm',
    secShort: 's',
    inProgressCount: count => `${count} en cours`,
    completedCount: count => `${count} remises`,
    recentKitchenEvents: 'Activité récente en cuisine',
    eventOrderPrefix: 'Commande',
    eventCustomerPrefix: 'Client :',

    orderListTitle: 'Liste des commandes',
    orderListBreadcrumbOrder: 'Commandes',
    filterAll: count => `Toutes (${count})`,
    filterActive: count => `Actives (${count})`,
    filterCompleted: count => `Remises (${count})`,
    thOrderId: 'N° Commande',
    thTime: 'Heure',
    thCustomer: 'Client',
    thItemsAddress: 'Détails / Adresse',
    thDishTimer: 'Minuteur',
    thAmount: 'Montant',
    thStatus: 'Statut',
    thAction: 'Action',
    pickupWithAddress: 'À emporter (64 av. Simone Veil)',
    btnToArchive: 'Archiver',
    btnReadyCheck: 'Prêt ✓',
    completedCheck: '✓ Remis',
    totalSaleWidget: 'Ventes totales',
    kdsScreenLink: 'Écran KDS →',
    repeatCustomers: 'Clients fidèles',
    legendNew: 'Nouveaux',
    legendReturning: 'Fidèles',

    menuListTitle: 'Carte & Disponibilité',
    menuBreadcrumbMenu: 'Menu',
    menuBreadcrumbStopStock: 'Ruptures (86) & Stock',
    catAllDishes: 'Tous les plats',
    catBurgers: 'Burgers',
    catPitas: 'Pitas & Laffas',
    catPlates: 'Assiettes',
    catStarters: 'Entrées',
    inStockBadge: 'Disponible',
    stopListBadge: 'Rupture (86)',
    btnViewDish: 'Voir',
    btnToStopList: 'Rupture 86',
    btnEnableDish: 'Activer',
    warehouseTitle: 'Stock matières premières',
    warehouseSubtitle: 'Déduction automatique à chaque commande cuisine',
    stockRemaining: 'Stock :',

    kpiTotalOrders: 'Commandes totales',
    kpiOrdersDelta: '+12% cette semaine',
    kpiTotalCustomers: 'Clients totaux',
    kpiRegularGuests: 'Clients réguliers : 94',
    kpiTotalRevenue: "Chiffre d'affaires",
    kpiZeroCommission: '0% commission agrégateurs',
    chartTotalEarnings: 'Revenus cumulés',
    chartLegendRevenue: 'Recettes',
    chartLegendFoodCost: 'Coût matière',
    chartThisWeek: 'Cette semaine',
    weekdays: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam (Soir)', 'Dim'],
    topCategoriesTitle: 'Top Catégories',
    periodMonth: 'Mois',
    kosherCenterBadge: 'Casher',
    donutBurgers: 'Burgers (38%)',
    donutPitas: 'Pitas & Laffas (27%)',
    donutPlates: 'Assiettes (20%)',
    donutStarters: 'Entrées (15%)',
    recentOrdersTitle: 'Commandes récentes',
    openKdsKitchenLink: 'Ouvrir Cuisine KDS →',
    thOrderName: 'Plat commandé',
    thCustomerName: 'Client',
    thLocation: 'Lieu',
    thOrderStatus: 'Statut',
    thDeliveredTime: 'Temps (Minuteur)',
    thPrice: 'Prix',
    pickupStoreLabel: 'Retrait Boutique',
    customerReviewTitle: 'Avis Clients',

    stripeZeroFeeBadge: 'Acquisition directe Stripe (0% commission)',
    stripeHeading: 'Configuration des clés Stripe pour La Briout',
    stripeConnected: '● Connecté',
    stripeSavedToast:
      'Clés Stripe enregistrées avec succès ! Virements directs actifs (0% commission).',
    stripeResetToast: 'Clés Stripe de test restaurées et enregistrées !',
    stripeTestMode: '🛠 Mode Test (Test)',
    stripeLiveMode: '🚀 Mode Production (Live)',
    stripePubKeyLabel: 'Clé publique Stripe (Publishable Key)',
    stripeSecKeyLabel: 'Clé secrète Stripe (Secret Key)',
    stripeIbanLabel: 'IBAN du compte restaurant',
    stripeSaveBtn: 'Enregistrer les paramètres',
    stripeResetBtn: 'Réinitialiser clés test',
    stripeRecentTxTitle: 'Transactions en ligne récentes',
    cashLabel: 'ESPÈCES',
  },

  en: {
    sidebarToggleTitle: 'Collapse / expand sidebar',
    brandSubtitle: 'Kitchen & POS',
    navDashboard: 'Dashboard',
    navOrdersKitchen: 'Orders & Kitchen',
    navKdsScreen: 'Kitchen Screen (Timer)',
    navOrderList: 'Order List (Table)',
    navMenusStock: 'Menu & Stock (86)',
    navStripePos: 'Stripe POS',
    backToStorefront: 'Back to Storefront',

    searchPlaceholder: 'Search orders, dishes or customers...',
    simOrderSending: 'Sending...',
    simOrderBtn: '+ Test Order',
    simOrderTitle: 'Send a test order to the kitchen with sound alert',
    fullscreenTitle: 'Fullscreen (kitchen tablet)',
    soundOnTitle: 'Kitchen sound ON (click to test)',
    soundOffTitle: 'Kitchen sound OFF',
    refreshTitle: 'Refresh data',
    stripeSettingsTitle: 'Stripe payment settings',
    greetingHello: 'Hello, ',
    onlineSse: '● Online SSE',
    logoutTitle: 'Sign out',

    newOrderBanner: (id, customer, total) =>
      `🔔 NEW ORDER #${id} (${customer}) — ${total}`,
    simOrderBanner: (id, customer) =>
      `⚡ NEW ORDER #${id} (${customer}) PAID & SENT TO KITCHEN!`,
    simAsap: 'As soon as possible (ASAP)',
    simOnlinePaidNote: 'Paid online (Stripe •••• 4242)',

    loadingKitchen: 'Loading kitchen and order data...',

    statusReceived: 'New Order',
    statusPreparing: 'Preparing',
    statusFrying: 'Grill / Fryer',
    statusPacking: 'Packing',
    statusReady: 'Ready for Pickup',
    statusCompleted: 'Completed',

    kdsTitle: 'Kitchen KDS & Dish Timer',
    kdsBreadcrumbOrders: 'Orders',
    kdsBreadcrumbActive: 'Active in Kitchen',
    slaNormal: '● On time < 6 min',
    slaWarning: '● Warning 6–11 min',
    slaOverdue: '● Overdue > 11 min',
    kdsEmptyTitle: 'All active orders have been prepared and handed over!',
    kdsEmptySubtitle:
      'New website orders appear here instantly with an audio chime and automatic prep stopwatch.',
    kdsEmptyTestBtn: 'Create test order to verify timer',
    pickupBadge: 'Pickup',
    deliveryBadge: 'Delivery',
    receivedAt: time => `Received at ${time}`,
    dishesToPrepare: 'Dishes to prepare (check when ready):',
    fallbackDishName: 'Dish',
    itemNoteLabel: 'Note:',
    orderCommentLabel: 'Comment:',
    packingCheckTitle: 'Package assembly check:',
    chkNapkins: 'Napkins & cutlery',
    chkSauces: 'Sauces checked',
    chkReceipt: 'Receipt attached',
    chkBagSealed: 'Bag sealed',
    stage1Preparing: '1. Preparing',
    stage2Frying: '2. Grill/Fryer',
    stage3Packing: '3. Packing',
    btnHandOverReady: 'Hand over order / Ready!',
    btnMarkReadyHandOver: 'Mark Ready & Hand Over',
    btnCompleteArchive: 'Complete Order (Archive)',

    shiftRevenue: 'Shift Revenue',
    totalOrdersCountLabel: count => `${count} total orders`,
    reportLink: 'Report →',
    avgPrepTime: 'Avg. prep time',
    minShort: 'm',
    secShort: 's',
    inProgressCount: count => `${count} active`,
    completedCount: count => `${count} completed`,
    recentKitchenEvents: 'Recent kitchen activity',
    eventOrderPrefix: 'Order',
    eventCustomerPrefix: 'Customer:',

    orderListTitle: 'Order List',
    orderListBreadcrumbOrder: 'Orders',
    filterAll: count => `All (${count})`,
    filterActive: count => `Active (${count})`,
    filterCompleted: count => `Completed (${count})`,
    thOrderId: 'Order ID',
    thTime: 'Time',
    thCustomer: 'Customer',
    thItemsAddress: 'Items / Address',
    thDishTimer: 'Dish Timer',
    thAmount: 'Amount',
    thStatus: 'Status',
    thAction: 'Action',
    pickupWithAddress: 'Pickup (64 av. Simone Veil)',
    btnToArchive: 'Archive',
    btnReadyCheck: 'Ready ✓',
    completedCheck: '✓ Completed',
    totalSaleWidget: 'Total Sales',
    kdsScreenLink: 'KDS Screen →',
    repeatCustomers: 'Repeat customers',
    legendNew: 'New',
    legendReturning: 'Returning',

    menuListTitle: 'Menu List',
    menuBreadcrumbMenu: 'Menu',
    menuBreadcrumbStopStock: '86 Stop-List & Stock',
    catAllDishes: 'All dishes',
    catBurgers: 'Burgers',
    catPitas: 'Pitas & Laffas',
    catPlates: 'Plates',
    catStarters: 'Starters',
    inStockBadge: 'Available',
    stopListBadge: '86 Stop-List',
    btnViewDish: 'View',
    btnToStopList: '86 Stop',
    btnEnableDish: 'Enable',
    warehouseTitle: 'Raw Materials Inventory',
    warehouseSubtitle: 'Auto-deducted on every kitchen order',
    stockRemaining: 'Stock:',

    kpiTotalOrders: 'Total Orders',
    kpiOrdersDelta: '+12% this week',
    kpiTotalCustomers: 'Total Customers',
    kpiRegularGuests: 'Regular guests: 94',
    kpiTotalRevenue: 'Total Revenue',
    kpiZeroCommission: '0% aggregator fees',
    chartTotalEarnings: 'Total Earnings',
    chartLegendRevenue: 'Revenue',
    chartLegendFoodCost: 'Food Cost',
    chartThisWeek: 'This week',
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat (Eve)', 'Sun'],
    topCategoriesTitle: 'Top Categories',
    periodMonth: 'Month',
    kosherCenterBadge: 'Kosher',
    donutBurgers: 'Burgers (38%)',
    donutPitas: 'Pitas & Laffas (27%)',
    donutPlates: 'Plates (20%)',
    donutStarters: 'Starters (15%)',
    recentOrdersTitle: 'Recent Orders',
    openKdsKitchenLink: 'Open Kitchen KDS →',
    thOrderName: 'Order Items',
    thCustomerName: 'Customer Name',
    thLocation: 'Location',
    thOrderStatus: 'Order Status',
    thDeliveredTime: 'Prep Time (Timer)',
    thPrice: 'Price',
    pickupStoreLabel: 'In-Store Pickup',
    customerReviewTitle: 'Customer Reviews',

    stripeZeroFeeBadge: 'Direct Stripe Acquiring (0% fee)',
    stripeHeading: 'Stripe Payment Keys Setup for La Briout',
    stripeConnected: '● Connected',
    stripeSavedToast: 'Stripe keys saved successfully! Direct payouts active (0% fee).',
    stripeResetToast: 'Default Stripe test keys activated and saved!',
    stripeTestMode: '🛠 Test Mode (Test)',
    stripeLiveMode: '🚀 Live Mode (Live)',
    stripePubKeyLabel: 'Stripe Publishable Key',
    stripeSecKeyLabel: 'Stripe Secret Key',
    stripeIbanLabel: 'Restaurant Bank IBAN',
    stripeSaveBtn: 'Save Settings',
    stripeResetBtn: 'Reset Test Keys',
    stripeRecentTxTitle: 'Recent Online Transactions',
    cashLabel: 'CASH',
  },

  de: {
    sidebarToggleTitle: 'Seitenleiste ein-/ausklappen',
    brandSubtitle: 'Küche & Kasse',
    navDashboard: 'Dashboard',
    navOrdersKitchen: 'Bestellungen & Küche',
    navKdsScreen: 'Küchenbildschirm (Timer)',
    navOrderList: 'Bestellliste (Tabelle)',
    navMenusStock: 'Menü & Lager (86)',
    navStripePos: 'Stripe-Kasse',
    backToStorefront: 'Zurück zum Shop',

    searchPlaceholder: 'Bestellungen, Gerichte oder Kunden suchen...',
    simOrderSending: 'Senden...',
    simOrderBtn: '+ Testbestellung',
    simOrderTitle: 'Testbestellung mit Signalton an die Küche senden',
    fullscreenTitle: 'Vollbild (Küchen-Tablet)',
    soundOnTitle: 'Küchen-Ton EIN (zum Testen klicken)',
    soundOffTitle: 'Küchen-Ton AUS',
    refreshTitle: 'Daten aktualisieren',
    stripeSettingsTitle: 'Stripe-Zahlungseinstellungen',
    greetingHello: 'Hallo, ',
    onlineSse: '● Live SSE',
    logoutTitle: 'Abmelden',

    newOrderBanner: (id, customer, total) =>
      `🔔 NEUE BESTELLUNG #${id} (${customer}) — ${total}`,
    simOrderBanner: (id, customer) =>
      `⚡ NEUE BESTELLUNG #${id} (${customer}) BEZAHLT & AN DIE KÜCHE GESENDET!`,
    simAsap: 'So schnell wie möglich (ASAP)',
    simOnlinePaidNote: 'Online bezahlt (Stripe •••• 4242)',

    loadingKitchen: 'Küchen- und Bestelldaten werden geladen...',

    statusReceived: 'Neue Bestellung',
    statusPreparing: 'In Zubereitung',
    statusFrying: 'Grill / Fritteuse',
    statusPacking: 'Verpackung',
    statusReady: 'Abholbereit',
    statusCompleted: 'Ausgegeben',

    kdsTitle: 'Küche KDS & Gerichte-Timer',
    kdsBreadcrumbOrders: 'Bestellungen',
    kdsBreadcrumbActive: 'Aktiv in der Küche',
    slaNormal: '● Normal < 6 Min',
    slaWarning: '● Achtung 6–11 Min',
    slaOverdue: '● Überfällig > 11 Min',
    kdsEmptyTitle: 'Alle aktiven Bestellungen wurden zubereitet und ausgegeben!',
    kdsEmptySubtitle:
      'Neue Online-Bestellungen erscheinen hier sofort mit Signalton und automatischem Zubereitungs-Timer.',
    kdsEmptyTestBtn: 'Testbestellung erstellen, um Timer zu prüfen',
    pickupBadge: 'Abholung',
    deliveryBadge: 'Lieferung',
    receivedAt: time => `Eingegangen um ${time}`,
    dishesToPrepare: 'Zuzubereitende Gerichte (fertige abhaken):',
    fallbackDishName: 'Gericht',
    itemNoteLabel: 'Hinweis:',
    orderCommentLabel: 'Kommentar:',
    packingCheckTitle: 'Verpackungskontrolle:',
    chkNapkins: 'Servietten & Besteck',
    chkSauces: 'Saucen geprüft',
    chkReceipt: 'Bon beigefügt',
    chkBagSealed: 'Beutel versiegelt',
    stage1Preparing: '1. Zubereitung',
    stage2Frying: '2. Grill/Fritteuse',
    stage3Packing: '3. Verpackung',
    btnHandOverReady: 'Bestellung ausgeben / Bereit!',
    btnMarkReadyHandOver: 'Als bereit markieren & ausgeben',
    btnCompleteArchive: 'Bestellung abschließen (Archiv)',

    shiftRevenue: 'Schichtumsatz',
    totalOrdersCountLabel: count => `${count} Bestellungen gesamt`,
    reportLink: 'Bericht →',
    avgPrepTime: 'Ø Zubereitungszeit',
    minShort: 'm',
    secShort: 's',
    inProgressCount: count => `${count} in Arbeit`,
    completedCount: count => `${count} ausgegeben`,
    recentKitchenEvents: 'Letzte Küchenaktivitäten',
    eventOrderPrefix: 'Bestellung',
    eventCustomerPrefix: 'Kunde:',

    orderListTitle: 'Bestellliste',
    orderListBreadcrumbOrder: 'Bestellungen',
    filterAll: count => `Alle (${count})`,
    filterActive: count => `Aktiv (${count})`,
    filterCompleted: count => `Ausgegeben (${count})`,
    thOrderId: 'Bestell-Nr.',
    thTime: 'Zeit',
    thCustomer: 'Kunde',
    thItemsAddress: 'Artikel / Adresse',
    thDishTimer: 'Timer',
    thAmount: 'Betrag',
    thStatus: 'Status',
    thAction: 'Aktion',
    pickupWithAddress: 'Abholung (64 av. Simone Veil)',
    btnToArchive: 'Archiv',
    btnReadyCheck: 'Bereit ✓',
    completedCheck: '✓ Ausgegeben',
    totalSaleWidget: 'Gesamtumsatz',
    kdsScreenLink: 'KDS-Ansicht →',
    repeatCustomers: 'Stammkunden',
    legendNew: 'Neu',
    legendReturning: 'Wiederkehrend',

    menuListTitle: 'Speisekarte & Bestand',
    menuBreadcrumbMenu: 'Menü',
    menuBreadcrumbStopStock: '86-Stoppliste & Lager',
    catAllDishes: 'Alle Gerichte',
    catBurgers: 'Burger',
    catPitas: 'Pitas & Laffas',
    catPlates: 'Teller',
    catStarters: 'Vorspeisen',
    inStockBadge: 'Verfügbar',
    stopListBadge: 'Ausverkauft (86)',
    btnViewDish: 'Ansehen',
    btnToStopList: '86 Stopp',
    btnEnableDish: 'Aktivieren',
    warehouseTitle: 'Rohstofflager',
    warehouseSubtitle: 'Automatischer Abzug bei jeder Küchenbestellung',
    stockRemaining: 'Bestand:',

    kpiTotalOrders: 'Bestellungen gesamt',
    kpiOrdersDelta: '+12% diese Woche',
    kpiTotalCustomers: 'Kunden gesamt',
    kpiRegularGuests: 'Stammgäste: 94',
    kpiTotalRevenue: 'Gesamtumsatz',
    kpiZeroCommission: '0% Plattform-Provision',
    chartTotalEarnings: 'Gesamteinnahmen',
    chartLegendRevenue: 'Umsatz',
    chartLegendFoodCost: 'Wareneinsatz',
    chartThisWeek: 'Diese Woche',
    weekdays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa (Abend)', 'So'],
    topCategoriesTitle: 'Top-Kategorien',
    periodMonth: 'Monat',
    kosherCenterBadge: 'Koscher',
    donutBurgers: 'Burger (38%)',
    donutPitas: 'Pitas & Laffas (27%)',
    donutPlates: 'Teller (20%)',
    donutStarters: 'Vorspeisen (15%)',
    recentOrdersTitle: 'Aktuelle Bestellungen',
    openKdsKitchenLink: 'Küche KDS öffnen →',
    thOrderName: 'Gerichte',
    thCustomerName: 'Kundenname',
    thLocation: 'Ort',
    thOrderStatus: 'Bestellstatus',
    thDeliveredTime: 'Zubereitungszeit (Timer)',
    thPrice: 'Preis',
    pickupStoreLabel: 'Abholung im Laden',
    customerReviewTitle: 'Kundenbewertungen',

    stripeZeroFeeBadge: 'Direktes Stripe-Acquiring (0% Gebühr)',
    stripeHeading: 'Stripe-Zahlungsschlüssel für La Briout',
    stripeConnected: '● Verbunden',
    stripeSavedToast:
      'Stripe-Schlüssel erfolgreich gespeichert! Direkte Auszahlungen aktiv (0% Provision).',
    stripeResetToast: 'Standard-Testschlüssel für Stripe aktiviert und gespeichert!',
    stripeTestMode: '🛠 Testmodus (Test)',
    stripeLiveMode: '🚀 Live-Modus (Live)',
    stripePubKeyLabel: 'Stripe Publishable Key',
    stripeSecKeyLabel: 'Stripe Secret Key',
    stripeIbanLabel: 'IBAN des Restaurantkontos',
    stripeSaveBtn: 'Einstellungen speichern',
    stripeResetBtn: 'Testschlüssel zurücksetzen',
    stripeRecentTxTitle: 'Letzte Online-Transaktionen',
    cashLabel: 'BAR',
  },

  it: {
    sidebarToggleTitle: 'Comprimi / espandi menu',
    brandSubtitle: 'Cucina & Cassa',
    navDashboard: 'Dashboard',
    navOrdersKitchen: 'Ordini & Cucina',
    navKdsScreen: 'Schermo Cucina (Timer)',
    navOrderList: 'Lista Ordini (Tabella)',
    navMenusStock: 'Menù & Magazzino (86)',
    navStripePos: 'Cassa Stripe',
    backToStorefront: 'Torna alla vetrina',

    searchPlaceholder: 'Cerca ordini, piatti o clienti...',
    simOrderSending: 'Invio...',
    simOrderBtn: '+ Ordine test',
    simOrderTitle: 'Invia un ordine di prova in cucina con avviso sonoro',
    fullscreenTitle: 'Schermo intero (tablet cucina)',
    soundOnTitle: 'Audio cucina ATTIVO (clicca per testare)',
    soundOffTitle: 'Audio cucina DISATTIVATO',
    refreshTitle: 'Aggiorna dati',
    stripeSettingsTitle: 'Impostazioni pagamenti Stripe',
    greetingHello: 'Ciao, ',
    onlineSse: '● Live SSE',
    logoutTitle: 'Esci dal pannello',

    newOrderBanner: (id, customer, total) =>
      `🔔 NUOVO ORDINE #${id} (${customer}) — ${total}`,
    simOrderBanner: (id, customer) =>
      `⚡ NUOVO ORDINE #${id} (${customer}) PAGATO E INVIATO IN CUCINA!`,
    simAsap: 'Il prima possibile (ASAP)',
    simOnlinePaidNote: 'Pagato online (Stripe •••• 4242)',

    loadingKitchen: 'Caricamento dati cucina e ordini...',

    statusReceived: 'Nuovo ordine',
    statusPreparing: 'In preparazione',
    statusFrying: 'Griglia / Frittura',
    statusPacking: 'Confezionamento',
    statusReady: 'Pronto al ritiro',
    statusCompleted: 'Consegnato',

    kdsTitle: 'Cucina KDS & Timer Piatti',
    kdsBreadcrumbOrders: 'Ordini',
    kdsBreadcrumbActive: 'Attivi in cucina',
    slaNormal: '● Regolare < 6 min',
    slaWarning: '● Attenzione 6–11 min',
    slaOverdue: '● In ritardo > 11 min',
    kdsEmptyTitle: 'Tutti gli ordini attivi sono stati preparati e consegnati!',
    kdsEmptySubtitle:
      'I nuovi ordini dal sito compaiono qui istantaneamente con segnale acustico e avvio automatico del timer.',
    kdsEmptyTestBtn: 'Crea ordine di prova per testare il timer',
    pickupBadge: 'Asporto',
    deliveryBadge: 'Consegna',
    receivedAt: time => `Ricevuto alle ${time}`,
    dishesToPrepare: 'Piatti da preparare (spunta i pronti):',
    fallbackDishName: 'Piatto',
    itemNoteLabel: 'Nota:',
    orderCommentLabel: 'Commento:',
    packingCheckTitle: 'Controllo preparazione sacchetto:',
    chkNapkins: 'Tovaglioli & posate',
    chkSauces: 'Salse verificate',
    chkReceipt: 'Scontrino allegato',
    chkBagSealed: 'Sacchetto sigillato',
    stage1Preparing: '1. Preparazione',
    stage2Frying: '2. Griglia/Frittura',
    stage3Packing: '3. Confezione',
    btnHandOverReady: 'Consegna ordine / Pronto!',
    btnMarkReadyHandOver: 'Segna pronto & Consegna',
    btnCompleteArchive: 'Completa ordine (Archivia)',

    shiftRevenue: 'Incasso turno',
    totalOrdersCountLabel: count => `${count} ordini totali`,
    reportLink: 'Report →',
    avgPrepTime: 'Tempo medio',
    minShort: 'm',
    secShort: 's',
    inProgressCount: count => `${count} in corso`,
    completedCount: count => `${count} completati`,
    recentKitchenEvents: 'Attività recenti cucina',
    eventOrderPrefix: 'Ordine',
    eventCustomerPrefix: 'Cliente:',

    orderListTitle: 'Lista Ordini',
    orderListBreadcrumbOrder: 'Ordini',
    filterAll: count => `Tutti (${count})`,
    filterActive: count => `Attivi (${count})`,
    filterCompleted: count => `Consegnati (${count})`,
    thOrderId: 'ID Ordine',
    thTime: 'Ora',
    thCustomer: 'Cliente',
    thItemsAddress: 'Articoli / Indirizzo',
    thDishTimer: 'Timer piatti',
    thAmount: 'Totale',
    thStatus: 'Stato',
    thAction: 'Azione',
    pickupWithAddress: 'Asporto (64 av. Simone Veil)',
    btnToArchive: 'Archivia',
    btnReadyCheck: 'Pronto ✓',
    completedCheck: '✓ Consegnato',
    totalSaleWidget: 'Vendite totali',
    kdsScreenLink: 'Schermo KDS →',
    repeatCustomers: 'Clienti abituali',
    legendNew: 'Nuovi',
    legendReturning: 'Abituali',

    menuListTitle: 'Lista Menù',
    menuBreadcrumbMenu: 'Menù',
    menuBreadcrumbStopStock: 'Stop-list (86) & Magazzino',
    catAllDishes: 'Tutti i piatti',
    catBurgers: 'Burger',
    catPitas: 'Pita & Laffa',
    catPlates: 'Piatti',
    catStarters: 'Antipasti',
    inStockBadge: 'Disponibile',
    stopListBadge: 'Esaurito (86)',
    btnViewDish: 'Vedi',
    btnToStopList: 'Stop 86',
    btnEnableDish: 'Attiva',
    warehouseTitle: 'Magazzino materie prime',
    warehouseSubtitle: 'Scarico automatico a ogni ordine in cucina',
    stockRemaining: 'Scorta:',

    kpiTotalOrders: 'Ordini Totali',
    kpiOrdersDelta: '+12% questa settimana',
    kpiTotalCustomers: 'Clienti Totali',
    kpiRegularGuests: 'Clienti abituali: 94',
    kpiTotalRevenue: 'Ricavi Totali',
    kpiZeroCommission: '0% commissioni aggregatori',
    chartTotalEarnings: 'Guadagni Totali',
    chartLegendRevenue: 'Incassi',
    chartLegendFoodCost: 'Food Cost',
    chartThisWeek: 'Questa settimana',
    weekdays: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab (Sera)', 'Dom'],
    topCategoriesTitle: 'Categorie Top',
    periodMonth: 'Mese',
    kosherCenterBadge: 'Kosher',
    donutBurgers: 'Burger (38%)',
    donutPitas: 'Pita & Laffa (27%)',
    donutPlates: 'Piatti (20%)',
    donutStarters: 'Antipasti (15%)',
    recentOrdersTitle: 'Ordini Recenti',
    openKdsKitchenLink: 'Apri Cucina KDS →',
    thOrderName: 'Piatti',
    thCustomerName: 'Cliente',
    thLocation: 'Destinazione',
    thOrderStatus: 'Stato Ordine',
    thDeliveredTime: 'Tempo (Timer)',
    thPrice: 'Prezzo',
    pickupStoreLabel: 'Ritiro in sede',
    customerReviewTitle: 'Recensioni Clienti',

    stripeZeroFeeBadge: 'Acquiring diretto Stripe (0% commissioni)',
    stripeHeading: 'Configurazione chiavi Stripe per La Briout',
    stripeConnected: '● Connesso',
    stripeSavedToast:
      'Chiavi Stripe salvate con successo! Bonifici diretti attivi (0% commissioni).',
    stripeResetToast: 'Chiavi di test Stripe ripristinate e salvate!',
    stripeTestMode: '🛠 Modalità Test (Test)',
    stripeLiveMode: '🚀 Modalità Produzione (Live)',
    stripePubKeyLabel: 'Stripe Publishable Key',
    stripeSecKeyLabel: 'Stripe Secret Key',
    stripeIbanLabel: 'IBAN conto ristorante',
    stripeSaveBtn: 'Salva impostazioni',
    stripeResetBtn: 'Ripristina chiavi test',
    stripeRecentTxTitle: 'Ultime transazioni online',
    cashLabel: 'CONTANTI',
  },

  ru: {
    sidebarToggleTitle: 'Свернуть/развернуть меню',
    brandSubtitle: 'Кухня & Касса',
    navDashboard: 'Дашборд',
    navOrdersKitchen: 'Заказы & Кухня',
    navKdsScreen: 'Экран Кухни (Таймер)',
    navOrderList: 'Список заказов (Таблица)',
    navMenusStock: 'Меню & Склад (86)',
    navStripePos: 'Касса Stripe',
    backToStorefront: 'На витрину сайта',

    searchPlaceholder: 'Поиск заказов, блюд или клиентов...',
    simOrderSending: 'Отправка...',
    simOrderBtn: '+ Тест-заказ',
    simOrderTitle: 'Отправить тестовый заказ на кухню со звуковым сигналом',
    fullscreenTitle: 'Полный экран (для планшета кухни)',
    soundOnTitle: 'Звук кухни ВКЛ (нажмите для теста)',
    soundOffTitle: 'Звук кухни ВЫКЛ',
    refreshTitle: 'Обновить данные',
    stripeSettingsTitle: 'Настройки оплаты Stripe',
    greetingHello: 'Привет, ',
    onlineSse: '● Онлайн SSE',
    logoutTitle: 'Выйти из панели',

    newOrderBanner: (id, customer, total) =>
      `🔔 НОВЫЙ ЗАКАЗ #${id} (${customer}) — ${total}`,
    simOrderBanner: (id, customer) =>
      `⚡ НОВЫЙ ЗАКАЗ #${id} (${customer}) ОПЛАЧЕН И ПОСТУПИЛ НА КУХНЮ!`,
    simAsap: 'Как можно скорее (ASAP)',
    simOnlinePaidNote: 'Оплачено онлайн (Stripe •••• 4242)',

    loadingKitchen: 'Загрузка данных кухни и заказов...',

    statusReceived: 'Новый заказ',
    statusPreparing: 'Готовится',
    statusFrying: 'На гриле / Фритюр',
    statusPacking: 'Сборка',
    statusReady: 'Готов к выдаче',
    statusCompleted: 'Выдан',

    kdsTitle: 'Кухня KDS & Таймер блюд',
    kdsBreadcrumbOrders: 'Заказы',
    kdsBreadcrumbActive: 'Активные на кухне',
    slaNormal: '● Норма < 6 мин',
    slaWarning: '● Внимание 6–11 мин',
    slaOverdue: '● Просрочка > 11 мин',
    kdsEmptyTitle: 'Все активные заказы приготовлены и выданы!',
    kdsEmptySubtitle:
      'Новые заказы с сайта появляются здесь мгновенно со звуковым сигналом и автоматическим запуском таймера приготовления.',
    kdsEmptyTestBtn: 'Создать тестовый заказ для проверки таймера',
    pickupBadge: 'Самовывоз',
    deliveryBadge: 'Доставка',
    receivedAt: time => `Принят в ${time}`,
    dishesToPrepare: 'Блюда к приготовлению (отметьте готовые):',
    fallbackDishName: 'Блюдо',
    itemNoteLabel: 'Примечание:',
    orderCommentLabel: 'Комментарий:',
    packingCheckTitle: 'Контроль сборки пакета:',
    chkNapkins: 'Салфетки & приборы',
    chkSauces: 'Соусы проверены',
    chkReceipt: 'Чек прикреплен',
    chkBagSealed: 'Пакет запечатан',
    stage1Preparing: '1. Готовится',
    stage2Frying: '2. Гриль/Фритюр',
    stage3Packing: '3. Сборка',
    btnHandOverReady: 'Выдать заказ / Готов!',
    btnMarkReadyHandOver: 'Отметить готовность & Выдать',
    btnCompleteArchive: 'Завершить заказ (Архив)',

    shiftRevenue: 'Выручка смены',
    totalOrdersCountLabel: count => `${count} всего заказов`,
    reportLink: 'Отчет →',
    avgPrepTime: 'Ср. время выдачи',
    minShort: 'м',
    secShort: 'с',
    inProgressCount: count => `${count} в работе`,
    completedCount: count => `${count} выдано`,
    recentKitchenEvents: 'Последние события кухни',
    eventOrderPrefix: 'Заказ',
    eventCustomerPrefix: 'Клиент:',

    orderListTitle: 'Список заказов',
    orderListBreadcrumbOrder: 'Заказы',
    filterAll: count => `Все (${count})`,
    filterActive: count => `Активные (${count})`,
    filterCompleted: count => `Выданные (${count})`,
    thOrderId: '№ Заказа',
    thTime: 'Время',
    thCustomer: 'Клиент',
    thItemsAddress: 'Состав / Адрес',
    thDishTimer: 'Таймер блюд',
    thAmount: 'Сумма',
    thStatus: 'Статус',
    thAction: 'Действие',
    pickupWithAddress: 'Самовывоз (64 av. Simone Veil)',
    btnToArchive: 'В архив',
    btnReadyCheck: 'Готов ✓',
    completedCheck: '✓ Выдан',
    totalSaleWidget: 'Общая выручка',
    kdsScreenLink: 'Экран KDS →',
    repeatCustomers: 'Повторные клиенты',
    legendNew: 'Новые',
    legendReturning: 'Постоянные',

    menuListTitle: 'Список блюд',
    menuBreadcrumbMenu: 'Меню',
    menuBreadcrumbStopStock: 'Стоп-лист (86) & Склад',
    catAllDishes: 'Все блюда',
    catBurgers: 'Бургеры',
    catPitas: 'Питы & Лаффы',
    catPlates: 'Тарелки',
    catStarters: 'Закуски',
    inStockBadge: 'В продаже',
    stopListBadge: 'Стоп-лист (86)',
    btnViewDish: 'Открыть',
    btnToStopList: 'В стоп',
    btnEnableDish: 'Включить',
    warehouseTitle: 'Складской учет сырья',
    warehouseSubtitle: 'Автосписание при каждом заказе на кухне',
    stockRemaining: 'Остаток:',

    kpiTotalOrders: 'Всего заказов',
    kpiOrdersDelta: '+12% за эту неделю',
    kpiTotalCustomers: 'Всего клиентов',
    kpiRegularGuests: 'Постоянные гости: 94',
    kpiTotalRevenue: 'Общая выручка',
    kpiZeroCommission: '0% комиссии агрегаторов',
    chartTotalEarnings: 'Динамика доходов',
    chartLegendRevenue: 'Выручка',
    chartLegendFoodCost: 'Фудкост',
    chartThisWeek: 'Эта неделя',
    weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб (Вечер)', 'Вс'],
    topCategoriesTitle: 'Топ категорий',
    periodMonth: 'Месяц',
    kosherCenterBadge: 'Кошер',
    donutBurgers: 'Бургеры (38%)',
    donutPitas: 'Питы & Лаффы (27%)',
    donutPlates: 'Тарелки (20%)',
    donutStarters: 'Закуски (15%)',
    recentOrdersTitle: 'Последние заказы',
    openKdsKitchenLink: 'Открыть KDS Кухню →',
    thOrderName: 'Блюда',
    thCustomerName: 'Клиент',
    thLocation: 'Адрес / Тип',
    thOrderStatus: 'Статус заказа',
    thDeliveredTime: 'Время (Таймер)',
    thPrice: 'Сумма',
    pickupStoreLabel: 'Самовывоз из зала',
    customerReviewTitle: 'Отзывы гостей',

    stripeZeroFeeBadge: 'Прямой эквайринг Stripe (0% комиссии)',
    stripeHeading: 'Настройка ключей оплаты Stripe для La Briout',
    stripeConnected: '● Подключен',
    stripeSavedToast: 'Ключи Stripe успешно сохранены! Прямые выплаты активны (0% комиссии).',
    stripeResetToast: 'Эталонные тестовые ключи Stripe активированы и сохранены!',
    stripeTestMode: '🛠 Тестовый режим (Test)',
    stripeLiveMode: '🚀 Боевой режим (Live)',
    stripePubKeyLabel: 'Публичный ключ Stripe (Publishable Key)',
    stripeSecKeyLabel: 'Секретный ключ Stripe (Secret Key)',
    stripeIbanLabel: 'IBAN счета ресторана',
    stripeSaveBtn: 'Сохранить настройки',
    stripeResetBtn: 'Сбросить тест-ключи',
    stripeRecentTxTitle: 'Последние онлайн-транзакции',
    cashLabel: 'НАЛИЧНЫЕ',
  },
};

const INVENTORY_ITEM_NAMES: Record<string, Record<Language, string>> = {
  'inv-smash-beef': {
    fr: 'Steak Haché Smashé 100% Casher',
    en: '100% Kosher Smashed Beef Patty',
    de: '100% Koscheres Smash-Rindfleischpatty',
    it: 'Hamburger Smash di Manzo 100% Kosher',
    ru: 'Мраморная говядина 100% Кошер для Smash',
  },
  'inv-shawarma': {
    fr: 'Broche Shawarma Dinde & Veau Mariné',
    en: 'Marinated Turkey & Veal Shawarma Spit',
    de: 'Marinierter Puten- & Kalbs-Shawarma-Spieß',
    it: 'Spiedo Shawarma di Tacchino e Vitello Marinato',
    ru: 'Маринованная шаурма из индейки и телятины',
  },
  'inv-pains-pitas': {
    fr: 'Pains Buns Briochés, Pitas & Laffas Artisanales',
    en: 'Artisan Brioche Buns, Pitas & Laffas',
    de: 'Hausgemachte Brioche-Buns, Pitas & Laffas',
    it: 'Panini Brioche, Pita e Laffa Artigianali',
    ru: 'Булочки бриошь, пита и ремесленная лаффа',
  },
  'inv-frites-maison': {
    fr: 'Pommes de Terre Frites Maison & Patates Douces',
    en: 'Homemade French Fries & Sweet Potatoes',
    de: 'Hausgemachte Pommes Frites & Süßkartoffeln',
    it: 'Patatine Fritte Artigianali & Patate Dolci',
    ru: 'Домашний картофель фри и батат',
  },
  'inv-cheddar-parve': {
    fr: 'Cheddar Fondant Parvé & Veau Pressé',
    en: 'Melting Parve Cheddar & Pressed Veal',
    de: 'Schmelzender Parve-Cheddar & Kalbs-Bacon',
    it: 'Cheddar Fuso Parve & Vitello Pressato',
    ru: 'Плавленый чеддер Parvé и телячий бекон',
  },
  'inv-dough': {
    fr: 'Pâte Levée 36h',
    en: '36h Leavened Dough',
    de: '36h gereifter Hefeteig',
    it: 'Impasto Lievitato 36h',
    ru: 'Ферментированное тесто 36ч',
  },
  'inv-fiordilatte': {
    fr: 'Fior di Latte de Campanie',
    en: 'Campania Fior di Latte Mozzarella',
    de: 'Fior di Latte aus Kampanien',
    it: 'Fior di Latte Campano Fresco',
    ru: 'Свежая моцарелла Fior di Latte',
  },
  'inv-pomodoro': {
    fr: 'Tomate San Marzano AOP',
    en: 'San Marzano DOP Tomatoes',
    de: 'San-Marzano-Tomaten g.U.',
    it: 'Pomodoro San Marzano DOP',
    ru: 'Томаты Сан-Марцано DOP',
  },
  'inv-oil': {
    fr: 'Huile de Friture Haute Stabilité',
    en: 'High-Stability Frying Oil',
    de: 'Hochstabiles Frittieröl',
    it: 'Olio Alto Oleico Frittura Pulita',
    ru: 'Высокоолеиновое масло для фритюра',
  },
  'inv-packaging': {
    fr: 'Emballages Thermiques & Sacs',
    en: 'Thermal Anti-Grease Packaging & Bags',
    de: 'Thermoverpackungen & Tragetaschen',
    it: 'Packaging Termico Anti-Unto & Sacchetti',
    ru: 'Термоупаковка и крафт-пакеты',
  },
};

const INVENTORY_UNITS: Record<string, Record<Language, string>> = {
  pcs: { fr: 'pcs', en: 'pcs', de: 'Stk.', it: 'pz', ru: 'шт' },
  g: { fr: 'g', en: 'g', de: 'g', it: 'g', ru: 'г' },
  ml: { fr: 'ml', en: 'ml', de: 'ml', it: 'ml', ru: 'мл' },
};

export function getLocalizedInventoryName(item: { id?: string; name?: string }, lang: Language): string {
  if (item.id && INVENTORY_ITEM_NAMES[item.id]?.[lang]) {
    return INVENTORY_ITEM_NAMES[item.id][lang];
  }
  // Strip trailing Russian parenthetical if present
  return (item.name || '').replace(/\s*\([А-Яа-яЁё][^)]*\)\s*$/, '');
}

export function getLocalizedInventoryUnit(unit: string | undefined, lang: Language): string {
  const key = (unit || '').toLowerCase();
  return INVENTORY_UNITS[key]?.[lang] || unit || '';
}
