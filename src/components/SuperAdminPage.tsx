import React, { useState, useEffect, useCallback } from 'react';
import {
  Globe2,
  Server,
  Database,
  Utensils,
  Plus,
  Save,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Tag,
  DollarSign,
  RefreshCw,
  Trash2,
  Edit3,
  ExternalLink,
  Search,
  Bell,
  Settings,
  Maximize2,
  Menu as MenuIcon,
  Home,
  ChevronRight,
  ChevronDown,
  Eye,
  Copy,
  Power,
  ChefHat,
  ClipboardList,
  Users,
  LogOut,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ProductItem, ExtraOption, CategoryId } from '../types';
import {
  CATEGORY_CONFIGS,
  getAvailableExtrasForProduct,
  getDefaultCategoryExtras,
} from '../data/menuData';
import {
  LABRIOUT_CATEGORY_CONFIGS,
  LABRIOUT_EXTRAS,
} from '../data/labrioutMenuData';
import {
  fetchAllTenants,
  createNewTenant,
  upsertCatalogProduct,
  toggleProductStopList,
  createInfluencerCoupon,
  fetchGatewayHealth,
  fetchOwnerAnalytics,
} from '../utils/api';

type AdminTab = 'menu-cms' | 'dashboard' | 'tenants' | 'tiktok-promo' | 'microservices';

const CircularGauge: React.FC<{
  percent: number;
  color?: string;
  children: React.ReactNode;
}> = ({ percent, color = '#e66430', children }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(5, Math.min(100, percent));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} fill="transparent" stroke="#eceef5" strokeWidth="6.5" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth="6.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-11 h-11 rounded-full bg-[#fff3ed] flex items-center justify-center text-[#e66430]">
          {children}
        </div>
      </div>
    </div>
  );
};

export const SuperAdminPage: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const {
    activeTenantId,
    setActiveTenantId,
    catalogProducts,
    refreshCatalog,
    setCurrentView,
    openProductDetail,
  } = useCart();

  const [activeTab, setActiveTab] = useState<AdminTab>('menu-cms');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [menusSubExpanded, setMenusSubExpanded] = useState<boolean>(true);
  const [menuViewMode, setMenuViewMode] = useState<'grid' | 'list'>('grid');

  const [tenantsData, setTenantsData] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [couponsList, setCouponsList] = useState<any[]>([]);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Menu CMS Editor State
  const [searchMenu, setSearchMenu] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('tutti');
  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem> | null>(null);
  const [newExtraName, setNewExtraName] = useState('');
  const [newExtraPrice, setNewExtraPrice] = useState('1.00');

  // New Tenant State
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantCity, setNewTenantCity] = useState('');
  const [newTenantCountry, setNewTenantCountry] = useState('FR');
  const [newTenantFee, setNewTenantFee] = useState('99');
  const [newTenantInstagram, setNewTenantInstagram] = useState('');

  // New Coupon State
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponDiscountInput, setCouponDiscountInput] = useState('15');
  const [couponChannelInput, setCouponChannelInput] = useState('Instagram & TikTok Reels');

  const showToast = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner(null), 5000);
  };

  const loadAdminEverything = useCallback(async () => {
    try {
      const [tRes, hRes, aRes] = await Promise.all([
        fetchAllTenants(),
        fetchGatewayHealth(),
        fetchOwnerAnalytics(activeTenantId),
      ]);
      if (tRes) setTenantsData(tRes);
      if (hRes) setHealthData(hRes);
      if (aRes?.coupons) setCouponsList(aRes.coupons);
    } catch (err) {
      console.error('Admin load error:', err);
    }
  }, [activeTenantId]);

  useEffect(() => {
    loadAdminEverything();
  }, [loadAdminEverything]);

  const handleOpenProductEditor = (prod?: ProductItem) => {
    if (prod) {
      const resolvedExtras = getAvailableExtrasForProduct(prod).map(e => ({ ...e }));
      const resolvedOriginalPrice =
        prod.originalPrice !== undefined
          ? prod.originalPrice
          : Number((prod.price * 1.3).toFixed(2));
      setEditingProduct({
        ...prod,
        originalPrice: resolvedOriginalPrice,
        foodCost: prod.foodCost ?? Number((prod.price * 0.28).toFixed(2)),
        availableExtras: resolvedExtras,
      });
    } else {
      setEditingProduct({
        id: `lab-custom-${Date.now()}`,
        name: 'Smash Burger Signature Labriout',
        nameRu: 'Фирменный Смэш Бургер Labriout',
        nameEn: 'Labriout Signature Smash Burger',
        category: 'panini',
        subCategory: 'smash',
        price: 12.5,
        originalPrice: 15.0,
        foodCost: 3.4,
        weight: '310 g',
        badge: 'SIGNATURE',
        image:
          'https://ik.imagekit.io/3l9prqiky/eatview/migrated/labriout/bd8dcf58db7e-double-smash-burger.webp',
        description:
          'Double steak haché casher smashé à la plancha, cheddar Parvé fondant, oignons caramélisés et sauce maison.',
        descriptionRu:
          'Двойная кошерная смэш-котлета на гриле, плавленый чеддер Парве, карамелизированный лук и домашний соус.',
        isAvailable: true,
        availableExtras: LABRIOUT_EXTRAS.slice(0, 6).map(e => ({ ...e })),
      });
    }
  };

  const handleDuplicateProduct = async (prod: ProductItem) => {
    const cloned: Partial<ProductItem> = {
      ...prod,
      id: `${prod.id}-copy-${Date.now().toString().slice(-4)}`,
      name: `${prod.name} (Copie)`,
      nameRu: prod.nameRu ? `${prod.nameRu} (Копия)` : `${prod.name} (Копия)`,
      availableExtras: getAvailableExtrasForProduct(prod).map(e => ({ ...e })),
    };
    await upsertCatalogProduct(activeTenantId, cloned);
    await refreshCatalog();
    await loadAdminEverything();
    setEditingProduct(cloned);
    showToast(`📋 Блюдо «${prod.name}» дублировано! Вы можете отредактировать копию справа.`);
  };

  const handleToggleProductAvailability = async (prod: ProductItem) => {
    await toggleProductStopList(prod.id, undefined, activeTenantId);
    await refreshCatalog();
    await loadAdminEverything();
    showToast(`🔄 Статус блюда «${prod.name}» обновлен на витрине.`);
  };

  const handleAddModifierToEditing = () => {
    if (!editingProduct || !newExtraName.trim()) return;
    const cleanName = newExtraName.trim();
    const priceNum = Math.max(0, parseFloat(String(newExtraPrice).replace(',', '.')) || 1.0);
    const nextExtra: ExtraOption = {
      id: `ex-${Date.now()}`,
      name: cleanName,
      nameRu: cleanName,
      nameEn: cleanName,
      price: priceNum,
    };
    setEditingProduct({
      ...editingProduct,
      availableExtras: [...(editingProduct.availableExtras || []), nextExtra],
    });
    setNewExtraName('');
    setNewExtraPrice('1.00');
  };

  const handleUpdateModifierInEditing = (
    extraId: string,
    field: 'name' | 'price',
    value: string
  ) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      availableExtras: (editingProduct.availableExtras || []).map(ex => {
        if (ex.id !== extraId) return ex;
        if (field === 'name') {
          return {
            ...ex,
            name: value,
            nameRu: value,
            nameEn: value,
          };
        }
        return {
          ...ex,
          price: Math.max(0, parseFloat(value.replace(',', '.')) || 0),
        };
      }),
    });
  };

  const handleRestoreCategoryDefaultExtras = () => {
    if (!editingProduct) return;
    const defaults =
      activeTenantId === 'labriout'
        ? LABRIOUT_EXTRAS.map(e => ({ ...e }))
        : getDefaultCategoryExtras(editingProduct.category || 'panini').map(e => ({
            ...e,
          }));
    setEditingProduct({
      ...editingProduct,
      availableExtras: defaults,
    });
  };

  const handleRemoveModifierFromEditing = (extraId: string) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      availableExtras: (editingProduct.availableExtras || []).filter(e => e.id !== extraId),
    });
  };

  const handleSaveProductToDb = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    await upsertCatalogProduct(activeTenantId, editingProduct);
    await refreshCatalog();
    await loadAdminEverything();
    showToast(
      `✅ Блюдо «${editingProduct.nameRu || editingProduct.name}» (€${Number(
        editingProduct.price
      ).toFixed(2)}) и все добавки (${
        editingProduct.availableExtras?.length || 0
      } шт.) сохранены на сайте!`
    );
  };

  const handleCreateNewTenantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName.trim()) return;
    const res = await createNewTenant({
      name: newTenantName.trim(),
      city: newTenantCity.trim() || 'Paris',
      country: newTenantCountry,
      monthlyFeeEur: Number(newTenantFee) || 99,
      subscriptionPlan: Number(newTenantFee) >= 90 ? 'GROWTH_99' : 'STARTER_59',
      instagramHandle: newTenantInstagram.trim() || '@labriout_94',
    });
    setNewTenantName('');
    setNewTenantCity('');
    setNewTenantInstagram('');
    await loadAdminEverything();
    if (res?.tenantId) {
      setActiveTenantId(res.tenantId);
      showToast(`🚀 Новый ресторан «${newTenantName}» развернут в облаке!`);
    }
  };

  const handleCreatePromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    await createInfluencerCoupon(activeTenantId, {
      code: couponCodeInput.trim().toUpperCase(),
      discountPercent: Number(couponDiscountInput) || 15,
      channel: couponChannelInput,
    });
    setCouponCodeInput('');
    await refreshCatalog();
    await loadAdminEverything();
    showToast(`🔥 Промокод ${couponCodeInput.toUpperCase()} активирован!`);
  };

  const activeCategories =
    activeTenantId === 'labriout' ? LABRIOUT_CATEGORY_CONFIGS : CATEGORY_CONFIGS;

  const filteredCatalog = catalogProducts.filter(p => {
    if (selectedCategoryFilter !== 'tutti' && p.category !== selectedCategoryFilter) return false;
    if (searchMenu.trim()) {
      const q = searchMenu.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.nameRu && p.nameRu.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] text-[#1e293b] flex flex-col lg:flex-row font-sans pb-20 lg:pb-0">
      {/* ===================================================================== */}
      {/* RIDAY LEFT SIDEBAR (Screenshot 1 & 4)                                 */}
      {/* ===================================================================== */}
      <aside
        className={`${
          sidebarOpen ? 'w-full lg:w-[260px]' : 'hidden lg:flex lg:w-[82px]'
        } bg-white border-b lg:border-b-0 lg:border-r border-slate-200/80 shrink-0 flex flex-col justify-between transition-all duration-200 z-30 lg:min-h-screen sticky top-0`}
      >
        <div>
          {/* Top Brand Logo & Toggle */}
          <div className="h-[74px] px-5 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-9 h-9 rounded-xl hover:bg-slate-100 text-[#4c84ff] flex items-center justify-center transition cursor-pointer"
                title="Свернуть/развернуть меню"
              >
                <MenuIcon className="w-5 h-5" />
              </button>
              {sidebarOpen && (
                <div className="flex items-center gap-2.5">
                  <img
                    src="/logo-labriur.png"
                    onError={e => {
                      e.currentTarget.src = '/logo-custom.png';
                    }}
                    alt="Labriout"
                    className="h-9 w-auto object-contain"
                  />
                  <div>
                    <span className="font-black text-base text-slate-800 tracking-tight block leading-none">
                      La Briout
                    </span>
                    <span className="text-[10px] font-bold text-[#4c84ff] uppercase tracking-wider">
                      Super-Admin CMS
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Menu (Riday Style) */}
          <nav className="p-3.5 space-y-1.5">
            {/* 1. Dashboard */}
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between p-2 rounded-full transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#d6e6ff] text-[#3b76ef] font-extrabold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 font-semibold'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                    activeTab === 'dashboard'
                      ? 'bg-[#4c84ff] text-white shadow-sm shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Home className="w-4 h-4" />
                </div>
                {sidebarOpen && <span className="text-sm">Dashboard</span>}
              </div>
              {sidebarOpen && <ChevronRight className="w-4 h-4 mr-2 opacity-60" />}
            </button>

            {/* 2. Menus (Menu List / Add New Menu / Categories — Screenshot 4) */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setMenusSubExpanded(!menusSubExpanded);
                  setActiveTab('menu-cms');
                }}
                className={`w-full flex items-center justify-between p-2 rounded-full transition cursor-pointer ${
                  activeTab === 'menu-cms'
                    ? 'bg-[#d6e6ff] text-[#3b76ef] font-extrabold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 font-semibold'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                      activeTab === 'menu-cms'
                        ? 'bg-[#4c84ff] text-white shadow-sm shadow-blue-500/30'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Utensils className="w-4 h-4" />
                  </div>
                  {sidebarOpen && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Menus (CMS)</span>
                      <span className="px-1.5 py-0.5 text-[10px] font-black rounded-md bg-[#e66430] text-white">
                        {catalogProducts.length}
                      </span>
                    </div>
                  )}
                </div>
                {sidebarOpen &&
                  (menusSubExpanded ? (
                    <ChevronDown className="w-4 h-4 mr-2 opacity-70" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-2 opacity-60" />
                  ))}
              </button>

              {sidebarOpen && menusSubExpanded && (
                <div className="mt-1 ml-6 space-y-1 border-l border-slate-200 pl-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('menu-cms');
                      handleOpenProductEditor();
                    }}
                    className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl text-xs text-slate-500 hover:text-[#e66430] font-semibold transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] opacity-70">─○─</span>
                      <span>Add New Menu</span>
                    </span>
                    <Plus className="w-3.5 h-3.5 text-[#e66430]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('menu-cms');
                      setSelectedCategoryFilter('tutti');
                    }}
                    className={`w-full flex items-center justify-between py-2 px-2.5 rounded-xl text-xs transition cursor-pointer ${
                      activeTab === 'menu-cms' && selectedCategoryFilter === 'tutti'
                        ? 'text-[#3b76ef] font-extrabold bg-blue-50/60'
                        : 'text-slate-500 hover:text-slate-800 font-semibold'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] opacity-70">─○─</span>
                      <span>Menu List ({catalogProducts.length})</span>
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Online Store / Tenants */}
            <button
              type="button"
              onClick={() => setActiveTab('tenants')}
              className={`w-full flex items-center justify-between p-2 rounded-full transition cursor-pointer ${
                activeTab === 'tenants'
                  ? 'bg-[#d6e6ff] text-[#3b76ef] font-extrabold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 font-semibold'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                    activeTab === 'tenants'
                      ? 'bg-[#4c84ff] text-white shadow-sm shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Globe2 className="w-4 h-4" />
                </div>
                {sidebarOpen && <span className="text-sm">Рестораны SaaS</span>}
              </div>
              {sidebarOpen && <ChevronRight className="w-4 h-4 mr-2 opacity-60" />}
            </button>

            {/* 4. Promo Codes */}
            <button
              type="button"
              onClick={() => setActiveTab('tiktok-promo')}
              className={`w-full flex items-center justify-between p-2 rounded-full transition cursor-pointer ${
                activeTab === 'tiktok-promo'
                  ? 'bg-[#d6e6ff] text-[#3b76ef] font-extrabold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 font-semibold'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                    activeTab === 'tiktok-promo'
                      ? 'bg-[#4c84ff] text-white shadow-sm shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                </div>
                {sidebarOpen && <span className="text-sm">Промокоды</span>}
              </div>
              {sidebarOpen && <ChevronRight className="w-4 h-4 mr-2 opacity-60" />}
            </button>

            {/* 5. Microservices */}
            <button
              type="button"
              onClick={() => setActiveTab('microservices')}
              className={`w-full flex items-center justify-between p-2 rounded-full transition cursor-pointer ${
                activeTab === 'microservices'
                  ? 'bg-[#d6e6ff] text-[#3b76ef] font-extrabold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 font-semibold'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                    activeTab === 'microservices'
                      ? 'bg-[#4c84ff] text-white shadow-sm shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Server className="w-4 h-4" />
                </div>
                {sidebarOpen && <span className="text-sm">Сервер & БД</span>}
              </div>
              {sidebarOpen && <ChevronRight className="w-4 h-4 mr-2 opacity-60" />}
            </button>
          </nav>
        </div>

        {/* Bottom Switchers */}
        <div className="p-3.5 border-t border-slate-100 space-y-2">
          <button
            type="button"
            onClick={() => setCurrentView('owner')}
            className="w-full py-2.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#e66430] font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ChefHat className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Экран Кухни (KDS)</span>}
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#e66430] shrink-0" />
            {sidebarOpen && <span>На витрину сайта</span>}
          </button>
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* MAIN CONTENT AREA                                                     */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* RIDAY TOP HEADER BAR */}
        <header className="h-[74px] bg-[#f5f6fa]/90 backdrop-blur-md px-4 sm:px-7 flex items-center justify-between gap-4 sticky top-0 z-20">
          {/* Search Input */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchMenu}
              onChange={e => setSearchMenu(e.target.value)}
              placeholder="Search menu items, prices, categories..."
              className="w-full bg-white rounded-2xl pl-4 pr-10 py-2.5 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 focus:outline-none focus:border-[#4c84ff]"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Right Controls & Tenant Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenProductEditor()}
              className="px-3.5 py-2.5 rounded-xl bg-[#e66430] hover:bg-[#d45625] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm shadow-[#e66430]/25 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Добавить блюдо</span>
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="hidden sm:flex w-10 h-10 rounded-xl bg-[#ede7f6] hover:bg-[#e1d5f2] text-[#5e35b1] items-center justify-center transition cursor-pointer"
              title="Полный экран"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={loadAdminEverything}
              className="w-10 h-10 rounded-xl bg-[#e3f2fd] hover:bg-[#d0e8fc] text-[#1e88e5] flex items-center justify-center transition cursor-pointer"
              title="Синхронизировать с БД"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tenants')}
              className="relative hidden sm:flex w-10 h-10 rounded-xl bg-[#fbe9e7] hover:bg-[#f8d8d4] text-[#e65100] items-center justify-center transition cursor-pointer"
              title="Управление ресторанами"
            >
              <Settings className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#e66430] text-white text-[10px] font-black flex items-center justify-center">
                {tenantsData?.tenants?.length || 2}
              </span>
            </button>

            <div className="h-7 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block">
                <span className="text-xs text-slate-500">Hello, </span>
                <span className="text-xs font-extrabold text-slate-800">Super Admin</span>
                <span className="block text-[10px] text-[#4c84ff] font-bold uppercase">
                  ● {activeTenantId}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#d6e6ff] border-2 border-white shadow-sm flex items-center justify-center text-[#3b76ef] font-black text-sm">
                SA
              </div>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                  title="Выйти"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Status Toast */}
        {statusBanner && (
          <div className="px-4 sm:px-7 pt-2">
            <div className="bg-emerald-600 text-white px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-between shadow-lg">
              <span>{statusBanner}</span>
              <span className="text-[11px] bg-black/20 px-2.5 py-0.5 rounded-lg">
                Синхронизировано
              </span>
            </div>
          </div>
        )}

        {/* PAGE CONTENT */}
        <div className="p-4 sm:p-7 flex-1 space-y-6">
          {activeTab === 'menu-cms' ? (
            /* ================================================================= */
            /* TAB 1: RIDAY MENU LIST (Screenshot 4) + LIVE PRODUCT CMS EDITOR   */
            /* ================================================================= */
            <div className="space-y-6">
              {/* Top Breadcrumb + Category Filters + View Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">Menu List</h1>
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Home className="w-3.5 h-3.5 text-[#4c84ff]" />
                    <span>-</span>
                    <span className="text-[#4c84ff]">Menu</span>
                    <span>-</span>
                    <span className="text-slate-600 font-semibold">Menu List & Editor</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Category Filter Select */}
                  <select
                    value={selectedCategoryFilter}
                    onChange={e => setSelectedCategoryFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs focus:outline-none focus:border-[#4c84ff]"
                  >
                    <option value="tutti">Все категории ({catalogProducts.length})</option>
                    {activeCategories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>

                  {/* View Mode Toggle: Riday Circular Plate Cards vs Compact List */}
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setMenuViewMode('grid')}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        menuViewMode === 'grid'
                          ? 'bg-[#4c84ff] text-white'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                      title="Карточки Riday"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMenuViewMode('list')}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        menuViewMode === 'list'
                          ? 'bg-[#4c84ff] text-white'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                      title="Компактный список"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Left Column (7 cols): Riday Menu Cards Grid OR Compact List */}
                <div className="xl:col-span-7">
                  {menuViewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-14 pt-10">
                      {filteredCatalog.slice(0, 60).map(prod => {
                        const isSelected = editingProduct?.id === prod.id;
                        const isAvail = prod.isAvailable !== false;
                        const catConfig = activeCategories.find(c => c.id === prod.category);

                        return (
                          <div
                            key={prod.id}
                            onClick={() => handleOpenProductEditor(prod)}
                            className={`bg-white rounded-3xl pt-20 pb-5 px-4 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 transition relative flex flex-col justify-between cursor-pointer ${
                              isSelected
                                ? 'border-[#e66430] shadow-md'
                                : isAvail
                                ? 'border-transparent hover:border-slate-200 hover:shadow-md'
                                : 'border-rose-200 bg-rose-50/40 opacity-80'
                            }`}
                          >
                            {/* Floating Circular Dish Plate (Screenshot 4) */}
                            <div className="w-32 h-32 rounded-full mx-auto -mt-32 mb-3 p-1.5 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            </div>

                            <div>
                              <h3 className="font-extrabold text-sm sm:text-[15px] text-slate-800 line-clamp-1">
                                {prod.name}
                              </h3>
                              <p className="text-xs text-[#4c84ff] font-semibold mt-0.5 line-clamp-1">
                                {catConfig?.label || prod.category}
                              </p>
                              <p className="text-sm font-black text-[#e66430] mt-1">
                                €{Number(prod.price).toFixed(2)}
                              </p>
                            </div>

                            {/* 4 Round Pastel Action Buttons from Screenshot 4: View, Edit, Stop/Delete, Duplicate */}
                            <div
                              className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-3"
                              onClick={e => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => openProductDetail(prod, undefined, undefined, 'home')}
                                className="flex flex-col items-center gap-1 group cursor-pointer"
                              >
                                <span className="w-8 h-8 rounded-full bg-[#e8f5e9] group-hover:bg-emerald-500 text-emerald-600 group-hover:text-white flex items-center justify-center transition">
                                  <Eye className="w-3.5 h-3.5" />
                                </span>
                                <span className="text-[10px] font-semibold text-slate-500">
                                  View
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenProductEditor(prod)}
                                className="flex flex-col items-center gap-1 group cursor-pointer"
                              >
                                <span className="w-8 h-8 rounded-full bg-[#fbe9e7] group-hover:bg-[#e66430] text-[#e66430] group-hover:text-white flex items-center justify-center transition">
                                  <Edit3 className="w-3.5 h-3.5" />
                                </span>
                                <span className="text-[10px] font-semibold text-slate-500">
                                  Edit
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleProductAvailability(prod)}
                                className="flex flex-col items-center gap-1 group cursor-pointer"
                              >
                                <span
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                                    isAvail
                                      ? 'bg-[#e3f2fd] group-hover:bg-rose-500 text-[#1e88e5] group-hover:text-white'
                                      : 'bg-rose-600 text-white'
                                  }`}
                                >
                                  <Power className="w-3.5 h-3.5" />
                                </span>
                                <span className="text-[10px] font-semibold text-slate-500">
                                  {isAvail ? '86 Stop' : 'Off'}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDuplicateProduct(prod)}
                                className="flex flex-col items-center gap-1 group cursor-pointer"
                              >
                                <span className="w-8 h-8 rounded-full bg-[#ede7f6] group-hover:bg-purple-600 text-[#5e35b1] group-hover:text-white flex items-center justify-center transition">
                                  <Copy className="w-3.5 h-3.5" />
                                </span>
                                <span className="text-[10px] font-semibold text-slate-500">
                                  Duplicate
                                </span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Compact List Mode */
                    <div className="bg-white rounded-3xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 space-y-2">
                      {filteredCatalog.map(prod => {
                        const isSelected = editingProduct?.id === prod.id;
                        const prodExtrasCount = getAvailableExtrasForProduct(prod).length;
                        return (
                          <div
                            key={prod.id}
                            onClick={() => handleOpenProductEditor(prod)}
                            className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition cursor-pointer ${
                              isSelected
                                ? 'bg-orange-50/70 border-[#e66430]'
                                : 'bg-[#f8f9fc] border-slate-200/70 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-white shadow-xs"
                              />
                              <div className="min-w-0">
                                <p className="font-extrabold text-sm text-slate-800 truncate">
                                  {prod.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  €{Number(prod.price).toFixed(2)} • Добавок: {prodExtrasCount}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-[#e66430] hover:text-white transition"
                            >
                              Edit
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Column (5 cols): Sticky Live Product & Modifiers Editor Card */}
                <div className="xl:col-span-5 xl:sticky xl:top-24 bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100">
                  {!editingProduct ? (
                    <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-14 h-14 rounded-full bg-[#fff3ed] text-[#e66430] flex items-center justify-center">
                        <Edit3 className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-extrabold text-slate-800">
                        Выберите блюдо слева для редактирования
                      </h3>
                      <p className="text-xs text-slate-400 max-w-xs">
                        Нажмите на любую карточку блюда или кнопку «Edit», чтобы изменить цену, фото, описание или настроить платные добавки.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleOpenProductEditor()}
                        className="mt-2 px-4 py-2 rounded-xl bg-[#e66430] text-white text-xs font-extrabold cursor-pointer"
                      >
                        + Создать новое блюдо
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveProductToDb} className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 gap-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#e66430] font-bold">
                            ID: {editingProduct.id}
                          </span>
                          <h3 className="text-base font-extrabold text-slate-800">
                            Редактор блюда & модификаторов
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const found =
                                catalogProducts.find(p => p.id === editingProduct.id) ||
                                (editingProduct as ProductItem);
                              openProductDetail(found, undefined, undefined, 'home');
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-[#e3f2fd] hover:bg-[#d0e8fc] text-[#1e88e5] text-[11px] font-bold flex items-center gap-1 cursor-pointer transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>На сайте</span>
                          </button>
                          <img
                            src={editingProduct.image}
                            alt="Preview"
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                          />
                        </div>
                      </div>

                      {/* Price, Old Price, FoodCost */}
                      <div className="p-3.5 rounded-2xl bg-[#f8f9fc] border border-slate-200/80 space-y-3">
                        <div className="grid grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-extrabold text-emerald-700 uppercase mb-1">
                              Цена (€) *
                            </label>
                            <input
                              type="number"
                              step="0.10"
                              required
                              value={editingProduct.price ?? 0}
                              onChange={e =>
                                setEditingProduct({
                                  ...editingProduct,
                                  price: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-full bg-white border border-emerald-300 rounded-xl px-2.5 py-2 text-sm font-black text-emerald-700 focus:outline-none focus:border-[#4c84ff]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-extrabold text-amber-700 uppercase mb-1">
                              Старая цена (€)
                            </label>
                            <input
                              type="number"
                              step="0.10"
                              value={editingProduct.originalPrice ?? 0}
                              onChange={e =>
                                setEditingProduct({
                                  ...editingProduct,
                                  originalPrice: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-2 text-sm font-bold text-amber-700 focus:outline-none focus:border-[#4c84ff]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                              Фудкост (€)
                            </label>
                            <input
                              type="number"
                              step="0.05"
                              value={editingProduct.foodCost ?? 1.5}
                              onChange={e =>
                                setEditingProduct({
                                  ...editingProduct,
                                  foodCost: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#4c84ff]"
                            />
                          </div>
                        </div>

                        {/* Quick Discount Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-slate-200/60">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                setEditingProduct({ ...editingProduct, originalPrice: 0 })
                              }
                              className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                              Без скидки
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setEditingProduct({
                                  ...editingProduct,
                                  originalPrice: Number(
                                    ((editingProduct.price || 0) / 0.85).toFixed(2)
                                  ),
                                })
                              }
                              className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                              -15%
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setEditingProduct({
                                  ...editingProduct,
                                  originalPrice: Number(
                                    ((editingProduct.price || 0) * 1.3).toFixed(2)
                                  ),
                                })
                              }
                              className="px-2 py-1 rounded-lg bg-orange-50 border border-orange-200 text-[10px] font-bold text-[#e66430] cursor-pointer"
                            >
                              -30%
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Название блюда (FR) *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingProduct.name || ''}
                            onChange={e =>
                              setEditingProduct({ ...editingProduct, name: e.target.value })
                            }
                            className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#4c84ff]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Название на русском (RU)
                          </label>
                          <input
                            type="text"
                            value={editingProduct.nameRu || ''}
                            onChange={e =>
                              setEditingProduct({ ...editingProduct, nameRu: e.target.value })
                            }
                            className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#4c84ff]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Категория меню
                          </label>
                          <select
                            value={editingProduct.category || 'panini'}
                            onChange={e =>
                              setEditingProduct({
                                ...editingProduct,
                                category: e.target.value as CategoryId,
                              })
                            }
                            className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#4c84ff]"
                          >
                            {activeCategories.map(c => (
                              <option key={c.id} value={c.id}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Бейдж
                          </label>
                          <input
                            type="text"
                            placeholder="BEST-SELLER / SIGNATURE"
                            value={editingProduct.badge || ''}
                            onChange={e =>
                              setEditingProduct({ ...editingProduct, badge: e.target.value })
                            }
                            className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#4c84ff]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Ссылка на фото блюда (Image URL) *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.image || ''}
                          onChange={e =>
                            setEditingProduct({ ...editingProduct, image: e.target.value })
                          }
                          className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#4c84ff]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Описание (FR)
                          </label>
                          <textarea
                            rows={2}
                            value={editingProduct.description || ''}
                            onChange={e =>
                              setEditingProduct({ ...editingProduct, description: e.target.value })
                            }
                            className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#4c84ff]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Описание (RU)
                          </label>
                          <textarea
                            rows={2}
                            value={editingProduct.descriptionRu || ''}
                            onChange={e =>
                              setEditingProduct({
                                ...editingProduct,
                                descriptionRu: e.target.value,
                              })
                            }
                            className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#4c84ff]"
                          />
                        </div>
                      </div>

                      {/* Modifiers Constructor */}
                      <div className="pt-2 border-t border-slate-100 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <label className="block text-xs font-extrabold text-slate-800">
                            Платные добавки ({editingProduct.availableExtras?.length || 0} шт.):
                          </label>
                          <button
                            type="button"
                            onClick={handleRestoreCategoryDefaultExtras}
                            className="text-[11px] font-bold text-[#4c84ff] hover:underline cursor-pointer"
                          >
                            ↺ Стандартные добавки
                          </button>
                        </div>

                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {(editingProduct.availableExtras || []).map(ex => (
                            <div
                              key={ex.id}
                              className="px-2.5 py-1.5 rounded-xl bg-[#f8f9fc] border border-slate-200/80 flex items-center justify-between gap-2 text-xs"
                            >
                              <input
                                type="text"
                                value={ex.nameRu || ex.name}
                                onChange={e =>
                                  handleUpdateModifierInEditing(ex.id, 'name', e.target.value)
                                }
                                className="flex-1 bg-transparent text-slate-700 font-semibold text-xs focus:outline-none"
                              />
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[11px] text-emerald-600 font-bold">+€</span>
                                <input
                                  type="number"
                                  step="0.10"
                                  value={ex.price}
                                  onChange={e =>
                                    handleUpdateModifierInEditing(ex.id, 'price', e.target.value)
                                  }
                                  className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs font-black text-emerald-700 text-right"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveModifierFromEditing(ex.id)}
                                  className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Новая добавка (напр. Cheddar Parvé)"
                            value={newExtraName}
                            onChange={e => setNewExtraName(e.target.value)}
                            className="flex-1 bg-[#f8f9fc] border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                          />
                          <input
                            type="number"
                            step="0.10"
                            value={newExtraPrice}
                            onChange={e => setNewExtraPrice(e.target.value)}
                            className="w-20 bg-[#f8f9fc] border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-emerald-700"
                          />
                          <button
                            type="button"
                            onClick={handleAddModifierToEditing}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-extrabold text-white cursor-pointer transition shrink-0"
                          >
                            + Доп.
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 px-5 rounded-2xl bg-[#e66430] hover:bg-[#d45625] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#e66430]/20 transition cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Сохранить изменения на сайте</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === 'dashboard' ? (
            /* ================================================================= */
            /* TAB 2: RIDAY SAAS DASHBOARD (Screenshot 1)                        */
            /* ================================================================= */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-600">Блюд в каталоге</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">
                      {catalogProducts.length}
                    </p>
                  </div>
                  <CircularGauge percent={85} color="#e66430">
                    <ClipboardList className="w-5 h-5" />
                  </CircularGauge>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-600">Ресторанов SaaS</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">
                      {tenantsData?.saasMetrics?.totalTenants || 2}
                    </p>
                  </div>
                  <CircularGauge percent={70} color="#e66430">
                    <Users className="w-5 h-5" />
                  </CircularGauge>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-600">Подписки MRR</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">
                      €{tenantsData?.saasMetrics?.mrrEur?.toFixed(0) || '248'}
                    </p>
                  </div>
                  <CircularGauge percent={90} color="#e66430">
                    <DollarSign className="w-5 h-5" />
                  </CircularGauge>
                </div>
              </div>
            </div>
          ) : activeTab === 'tenants' ? (
            /* ================================================================= */
            /* TAB 3: TENANTS MANAGEMENT                                         */
            /* ================================================================= */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-3.5">
                {(tenantsData?.tenants || []).map((t: any) => {
                  const isCurrent = t.id === activeTenantId;
                  return (
                    <div
                      key={t.id}
                      className={`p-5 rounded-3xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 transition ${
                        isCurrent ? 'border-[#e66430]' : 'border-slate-100'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black uppercase">
                              {t.country} • {t.city}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black">
                              Тариф €{t.monthlyFeeEur || 99}/мес
                            </span>
                          </div>
                          <h3 className="text-lg font-extrabold text-slate-800 mt-1.5">{t.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            📍 {t.address} • 📞 {t.phone}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveTenantId(t.id);
                            showToast(`Переключено на ресторан «${t.name}»`);
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                            isCurrent
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#e66430] hover:bg-[#d45625] text-white'
                          }`}
                        >
                          {isCurrent ? '✓ Активный ресторан' : 'Выбрать ресторан'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 space-y-4">
                <h3 className="text-base font-extrabold text-slate-800">
                  Подключить новый ресторан
                </h3>
                <form onSubmit={handleCreateNewTenantSubmit} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Название ресторана *"
                    value={newTenantName}
                    onChange={e => setNewTenantName(e.target.value)}
                    className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Город"
                      value={newTenantCity}
                      onChange={e => setNewTenantCity(e.target.value)}
                      className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Страна (FR)"
                      value={newTenantCountry}
                      onChange={e => setNewTenantCountry(e.target.value.toUpperCase())}
                      className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#e66430] hover:bg-[#d45625] text-white font-black text-xs uppercase cursor-pointer"
                  >
                    Развернуть сайт
                  </button>
                </form>
              </div>
            </div>
          ) : activeTab === 'tiktok-promo' ? (
            /* ================================================================= */
            /* TAB 4: PROMO CODES                                                */
            /* ================================================================= */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 space-y-4">
                <h2 className="text-base font-extrabold text-slate-800">
                  Активные промокоды для Instagram & TikTok
                </h2>
                <div className="space-y-2.5">
                  {couponsList.map((c: any) => (
                    <div
                      key={c.code}
                      className="p-4 rounded-2xl bg-[#f8f9fc] border border-slate-200/80 flex items-center justify-between"
                    >
                      <div>
                        <span className="px-2.5 py-1 rounded-lg bg-orange-100 text-[#e66430] font-mono font-black text-sm">
                          {c.code}
                        </span>
                        <span className="ml-2 text-xs font-bold text-emerald-600">
                          -{c.discount_percent}%
                        </span>
                        <p className="text-xs text-slate-400 mt-1">{c.channel}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-sm text-slate-800">
                          €{Number(c.revenue_generated || 0).toFixed(2)}
                        </p>
                        <p className="text-[11px] text-slate-400">Заказов: {c.usage_count}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 space-y-4">
                <h3 className="text-base font-extrabold text-slate-800">Создать промокод</h3>
                <form onSubmit={handleCreatePromoCode} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Код купона (напр. LABRIOUT15)"
                    value={couponCodeInput}
                    onChange={e => setCouponCodeInput(e.target.value.toUpperCase())}
                    className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-800"
                  />
                  <input
                    type="number"
                    placeholder="Скидка %"
                    value={couponDiscountInput}
                    onChange={e => setCouponDiscountInput(e.target.value)}
                    className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-emerald-700"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#e66430] hover:bg-[#d45625] text-white font-black text-xs uppercase cursor-pointer"
                  >
                    Активировать купон
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* ================================================================= */
            /* TAB 5: MICROSERVICES & DATABASE STATUS                            */
            /* ================================================================= */
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-800">
                    {healthData?.database?.engine || 'SQLite 3 / Offline-First Cloud DB'} — Активна
                  </h2>
                  <p className="text-xs text-slate-400">
                    Все изменения меню и заказов синхронизируются в реальном времени.
                  </p>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                ● Система работает стабильно
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
