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
  CreditCard,
  Sparkles,
  Tag,
  Image as ImageIcon,
  DollarSign,
  Layers,
  RefreshCw,
  Trash2,
  Edit3,
  ExternalLink,
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
  updateTenantSettings,
  upsertCatalogProduct,
  createInfluencerCoupon,
  fetchGatewayHealth,
  fetchOwnerAnalytics,
} from '../utils/api';

type AdminTab = 'tenants' | 'menu-cms' | 'tiktok-promo' | 'microservices';

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

  // New Tenant Modal State
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantCity, setNewTenantCity] = useState('');
  const [newTenantCountry, setNewTenantCountry] = useState('IT');
  const [newTenantFee, setNewTenantFee] = useState('89');
  const [newTenantInstagram, setNewTenantInstagram] = useState('');

  // New Coupon State
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponDiscountInput, setCouponDiscountInput] = useState('15');
  const [couponChannelInput, setCouponChannelInput] = useState('TikTok Viral Reels');

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
        id: `custom-${Date.now()}`,
        name: 'Panzarotto Gourmet Tartufo & Provola',
        nameRu: 'Панцаротто Гурмэ с трюфелем и проволой',
        nameEn: 'Truffle & Smoked Provola Gourmet Panzarotto',
        category: 'friggitoria',
        subCategory: 'panzarotto',
        price: 4.5,
        originalPrice: 5.85,
        foodCost: 1.25,
        weight: '240g',
        badge: 'NOVITÀ',
        image: 'https://www.edeka.de/uploads/rezepte/rez_edeka-panzerotti-rezept-i-p-1-1.jpg',
        description:
          'Edizione speciale con crema di tartufo nero, provola affumicata di Agerola e granella croccante.',
        descriptionRu:
          'Специальная серия с кремом из черного трюфеля, копченой проволой из Аджеролы и хрустящей корочкой.',
        isAvailable: true,
        availableExtras: [
          {
            id: 'ex-provola',
            name: 'Extra Provola Affumicata',
            nameRu: 'Копченая провола',
            nameEn: 'Add Smoked Provola',
            price: 1.0,
          },
          {
            id: 'ex-cheddar',
            name: 'Salsa Cheddar Calda',
            nameRu: 'Горячий чеддер',
            nameEn: 'Melted Cheddar drizzle',
            price: 1.0,
          },
        ],
      });
    }
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
        : getDefaultCategoryExtras(editingProduct.category || 'friggitoria').map(e => ({
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
      } шт.) синхронизированы с сайтом!`
    );
  };

  const handleCreateNewTenantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName.trim()) return;
    const res = await createNewTenant({
      name: newTenantName.trim(),
      city: newTenantCity.trim() || 'Milano',
      country: newTenantCountry,
      monthlyFeeEur: Number(newTenantFee) || 89,
      subscriptionPlan: Number(newTenantFee) >= 90 ? 'GROWTH_99' : 'STARTER_59',
      instagramHandle: newTenantInstagram.trim() || '@streetfood_client',
    });
    setNewTenantName('');
    setNewTenantCity('');
    setNewTenantInstagram('');
    await loadAdminEverything();
    if (res?.tenantId) {
      setActiveTenantId(res.tenantId);
      showToast(`🚀 Новый ресторан «${newTenantName}» развернут в облаке (Подписка €${newTenantFee}/мес)!`);
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
    showToast(`🔥 Промокод ${couponCodeInput.toUpperCase()} активирован для трафика из соцсетей!`);
  };

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

  return (
    <div className="min-h-screen bg-[#0a0c12] text-neutral-100 pb-24">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#11141f]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 text-[#ff5500]" />
              <span>На сайт</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-extrabold uppercase">
                  <Globe2 className="w-3.5 h-3.5" />
                  Super-Admin SaaS CMS Microservice (Port 4001)
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  ● Тенант: {activeTenantId}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                Центр Управления Сайтами Ресторанов (SaaS €50–100/мес • Flipdish Architecture)
              </h1>
            </div>
          </div>

          {/* Tenant Quick Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTenantId('panzarotto-pompei');
                setEditingProduct(null);
                setSelectedCategoryFilter('tutti');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
                activeTenantId === 'panzarotto-pompei'
                  ? 'bg-[#ff5500] border-[#ff5500] text-white shadow-md'
                  : 'bg-[#191e2d] border-white/15 text-neutral-300 hover:text-white'
              }`}
            >
              🇮🇹 Panzarotto (Pompei)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTenantId('labriout');
                setEditingProduct(null);
                setSelectedCategoryFilter('tutti');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
                activeTenantId === 'labriout'
                  ? 'bg-rose-600 border-rose-500 text-white shadow-md'
                  : 'bg-[#191e2d] border-white/15 text-neutral-300 hover:text-white'
              }`}
            >
              🇫🇷 Labriout (France • 44 блюда)
            </button>

            <select
              value={activeTenantId}
              onChange={e => {
                setActiveTenantId(e.target.value);
                setEditingProduct(null);
                setSelectedCategoryFilter('tutti');
              }}
              className="bg-[#191e2d] border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#ff5500]"
            >
              {(tenantsData?.tenants || []).map((t: any) => (
                <option key={t.id} value={t.id}>
                  🌍 {t.name} ({t.country} • €{t.monthlyFeeEur || t.monthlySaasFeeEur || 149}/мес)
                </option>
              ))}
            </select>

            <button
              onClick={loadAdminEverything}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 cursor-pointer"
              title="Синхронизировать"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold cursor-pointer"
              >
                Выйти
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            {
              id: 'menu-cms' as AdminTab,
              label: `CMS Меню, Цены, Фото & Модификаторы (${catalogProducts.length})`,
              icon: Utensils,
            },
            {
              id: 'tenants' as AdminTab,
              label: `Клиенты SaaS по миру (${tenantsData?.tenants?.length || 3})`,
              icon: Globe2,
            },
            {
              id: 'tiktok-promo' as AdminTab,
              label: 'Промокоды для Instagram / TikTok',
              icon: Tag,
            },
            {
              id: 'microservices' as AdminTab,
              label: 'Кластер Микросервисов & SQLite БД',
              icon: Server,
            },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition cursor-pointer border ${
                  isActive
                    ? 'bg-[#ff5500] border-[#ff5500] text-white shadow-lg shadow-[#ff5500]/25'
                    : 'bg-[#181c28] border-white/10 text-neutral-300 hover:bg-[#202636]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Notification */}
      {statusBanner && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-between shadow-lg">
            <span>{statusBanner}</span>
            <span className="text-[11px] bg-black/20 px-2 py-0.5 rounded">Синхронизировано с БД</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'menu-cms' ? (
          /* TAB 1: REMOTE MENU, PRICE, PHOTO & MODIFIERS EDITOR */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Catalog List */}
            <div className="lg:col-span-7 bg-[#141824] border border-white/10 rounded-3xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-black text-white">
                    Удаленное управление меню и ценами ресторана
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Выберите любое блюдо, чтобы изменить цену, фото, описание или добавить платные модификаторы.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenProductEditor()}
                  className="px-3.5 py-2 rounded-xl bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Добавить блюдо</span>
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={searchMenu}
                  onChange={e => setSearchMenu(e.target.value)}
                  placeholder="Поиск блюда по названию..."
                  className="flex-1 bg-[#0d1017] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#ff5500]"
                />
                <select
                  value={selectedCategoryFilter}
                  onChange={e => setSelectedCategoryFilter(e.target.value)}
                  className="bg-[#0d1017] border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#ff5500]"
                >
                  <option value="tutti">Все категории ({catalogProducts.length})</option>
                  {(activeTenantId === 'labriout' ? LABRIOUT_CATEGORY_CONFIGS : CATEGORY_CONFIGS).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Products Scrollable List */}
              <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
                {filteredCatalog.slice(0, 80).map(prod => {
                  const prodExtrasCount = getAvailableExtrasForProduct(prod).length;
                  const origP =
                    prod.originalPrice !== undefined
                      ? prod.originalPrice
                      : Number((prod.price * 1.3).toFixed(2));
                  const hasDisc = Boolean(origP && origP > prod.price);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => handleOpenProductEditor(prod)}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition cursor-pointer ${
                        editingProduct?.id === prod.id
                          ? 'bg-[#ff5500]/15 border-[#ff5500]'
                          : 'bg-[#0e111a] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-13 h-13 rounded-xl object-cover shrink-0 bg-neutral-800"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-xs sm:text-sm text-white truncate">
                              {prod.name}
                            </p>
                            {prod.badge && (
                              <span className="px-1.5 py-0.5 rounded bg-[#ff5500]/20 text-[#ff8844] text-[10px] font-black shrink-0">
                                {prod.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                            {prod.nameRu || prod.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2.5 mt-1 text-[11px]">
                            <span className="font-black text-emerald-400">
                              Цена: €{Number(prod.price).toFixed(2)}
                            </span>
                            {hasDisc && (
                              <span className="text-neutral-500 line-through font-semibold">
                                €{Number(origP).toFixed(2)}
                              </span>
                            )}
                            <span className="text-neutral-400">
                              • Добавок: <strong className="text-white">{prodExtrasCount}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#ff5500] text-neutral-300 hover:text-white text-xs font-bold flex items-center gap-1 shrink-0 transition cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Изменить</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Live Product & Modifiers Form */}
            <div className="lg:col-span-5 bg-[#141824] border border-white/10 rounded-3xl p-6">
              {!editingProduct ? (
                <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <Edit3 className="w-10 h-10 text-[#ff5500]" />
                  <h3 className="text-base font-black text-white">
                    Выберите блюдо слева для редактирования
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-xs">
                    Вы можете за 5 секунд поменять цену (со скидкой и без), загрузить новое фото, изменить состав или настроить конструктор добавок (Poster POS Modifiers).
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSaveProductToDb} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#ff7733]">
                        ID: {editingProduct.id}
                      </span>
                      <h3 className="text-base font-black text-white">
                        Редактирование карточки блюда
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
                        className="px-2.5 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-[11px] font-extrabold flex items-center gap-1 cursor-pointer transition"
                        title="Открыть страницу этого товара на сайте"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Открыть на сайте</span>
                      </button>
                      <img
                        src={editingProduct.image}
                        alt="Preview"
                        className="w-12 h-12 rounded-2xl object-cover border border-white/15 shrink-0"
                      />
                    </div>
                  </div>

                  {/* Price WITH Discount, Price WITHOUT Discount (Old Price), and Food Cost */}
                  <div className="p-3.5 rounded-2xl bg-[#0c0f17] border border-white/10 space-y-3">
                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-extrabold text-emerald-400 uppercase mb-1">
                          Цена со скидкой (€) *
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
                          className="w-full bg-[#141824] border border-emerald-500/40 rounded-xl px-2.5 py-2 text-sm font-black text-emerald-400 focus:outline-none focus:border-[#ff5500]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-amber-300 uppercase mb-1">
                          Цена БЕЗ скидки (€)
                        </label>
                        <input
                          type="number"
                          step="0.10"
                          placeholder="0 = без скидки"
                          value={editingProduct.originalPrice ?? 0}
                          onChange={e =>
                            setEditingProduct({
                              ...editingProduct,
                              originalPrice: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full bg-[#141824] border border-amber-500/30 rounded-xl px-2.5 py-2 text-sm font-bold text-amber-300 focus:outline-none focus:border-[#ff5500]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
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
                          className="w-full bg-[#141824] border border-white/15 rounded-xl px-2.5 py-2 text-sm font-bold text-sky-400 focus:outline-none focus:border-[#ff5500]"
                        />
                      </div>
                    </div>

                    {/* Quick Discount Presets */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-white/5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingProduct({
                              ...editingProduct,
                              originalPrice: 0,
                            })
                          }
                          className={`px-2 py-1 rounded-lg text-[10px] font-extrabold border transition cursor-pointer ${
                            !editingProduct.originalPrice ||
                            editingProduct.originalPrice <= (editingProduct.price || 0)
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                              : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                          }`}
                        >
                          ✕ Без скидки
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingProduct({
                              ...editingProduct,
                              originalPrice: Number(((editingProduct.price || 0) / 0.85).toFixed(2)),
                            })
                          }
                          className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-neutral-300 cursor-pointer"
                        >
                          Скидка -15%
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingProduct({
                              ...editingProduct,
                              originalPrice: Number(((editingProduct.price || 0) / 0.75).toFixed(2)),
                            })
                          }
                          className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-neutral-300 cursor-pointer"
                        >
                          Скидка -25%
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingProduct({
                              ...editingProduct,
                              originalPrice: Number(((editingProduct.price || 0) * 1.3).toFixed(2)),
                            })
                          }
                          className="px-2 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-[10px] font-bold text-rose-300 cursor-pointer"
                        >
                          Скидка -30%
                        </button>
                      </div>

                      <span className="text-[10px] text-neutral-400 font-semibold">
                        {editingProduct.originalPrice &&
                        editingProduct.originalPrice > (editingProduct.price || 0) ? (
                          <>
                            На сайте:{' '}
                            <strong className="text-white">
                              €{Number(editingProduct.price || 0).toFixed(2)}
                            </strong>{' '}
                            <span className="line-through text-neutral-500">
                              €{Number(editingProduct.originalPrice).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <>
                            На сайте:{' '}
                            <strong className="text-emerald-400">
                              €{Number(editingProduct.price || 0).toFixed(2)} (без скидки)
                            </strong>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                        Название блюда (IT / Основное) *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProduct.name || ''}
                        onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full bg-[#0c0f17] border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#ff5500]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                        Название на русском (RU)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.nameRu || ''}
                        onChange={e =>
                          setEditingProduct({ ...editingProduct, nameRu: e.target.value })
                        }
                        className="w-full bg-[#0c0f17] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5500]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                        Категория меню
                      </label>
                      <select
                        value={editingProduct.category || 'friggitoria'}
                        onChange={e =>
                          setEditingProduct({
                            ...editingProduct,
                            category: e.target.value as CategoryId,
                          })
                        }
                        className="w-full bg-[#0c0f17] border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#ff5500]"
                      >
                        {CATEGORY_CONFIGS.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                        Бейдж (Хит / Новинка)
                      </label>
                      <input
                        type="text"
                        placeholder="PIÙ AMATO / NOVITÀ"
                        value={editingProduct.badge || ''}
                        onChange={e =>
                          setEditingProduct({ ...editingProduct, badge: e.target.value })
                        }
                        className="w-full bg-[#0c0f17] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5500]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                      Ссылка на фото блюда (Image URL) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.image || ''}
                      onChange={e =>
                        setEditingProduct({ ...editingProduct, image: e.target.value })
                      }
                      className="w-full bg-[#0c0f17] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff5500]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                        Описание и состав (IT)
                      </label>
                      <textarea
                        rows={2}
                        value={editingProduct.description || ''}
                        onChange={e =>
                          setEditingProduct({ ...editingProduct, description: e.target.value })
                        }
                        className="w-full bg-[#0c0f17] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5500]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                        Описание на русском (RU)
                      </label>
                      <textarea
                        rows={2}
                        value={editingProduct.descriptionRu || ''}
                        onChange={e =>
                          setEditingProduct({ ...editingProduct, descriptionRu: e.target.value })
                        }
                        className="w-full bg-[#0c0f17] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5500]"
                      />
                    </div>
                  </div>

                  {/* Product Modifiers Constructor (Poster POS / Olo Style) */}
                  <div className="pt-2 border-t border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <label className="block text-xs font-extrabold text-white">
                        Конструктор добавок на сайте ({editingProduct.availableExtras?.length || 0} шт.):
                      </label>
                      <button
                        type="button"
                        onClick={handleRestoreCategoryDefaultExtras}
                        className="text-[10px] font-bold text-neutral-400 hover:text-[#ff7733] transition cursor-pointer"
                        title="Восстановить стандартные добавки для этой категории"
                      >
                        ↺ Стандартные добавки
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {(editingProduct.availableExtras || []).length === 0 ? (
                        <div className="p-3 rounded-xl bg-[#0c0f17] border border-white/5 text-center text-[11px] text-neutral-500">
                          У этого блюда нет платных добавок. Добавьте первую ниже или нажмите «↺ Стандартные добавки».
                        </div>
                      ) : (
                        (editingProduct.availableExtras || []).map(ex => (
                          <div
                            key={ex.id}
                            className="px-2.5 py-1.5 rounded-xl bg-[#0c0f17] border border-white/10 flex items-center justify-between gap-2 text-xs"
                          >
                            <input
                              type="text"
                              value={ex.nameRu || ex.name}
                              onChange={e =>
                                handleUpdateModifierInEditing(ex.id, 'name', e.target.value)
                              }
                              className="flex-1 bg-transparent text-neutral-100 font-semibold text-xs focus:outline-none focus:bg-white/5 rounded px-1.5 py-0.5"
                              title="Изменить название добавки"
                            />
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[11px] text-emerald-400 font-bold">+€</span>
                              <input
                                type="number"
                                step="0.10"
                                value={ex.price}
                                onChange={e =>
                                  handleUpdateModifierInEditing(ex.id, 'price', e.target.value)
                                }
                                className="w-16 bg-[#141824] border border-white/10 rounded-lg px-2 py-0.5 text-xs font-black text-emerald-400 text-right focus:outline-none focus:border-[#ff5500]"
                                title="Изменить цену добавки"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveModifierFromEditing(ex.id)}
                                className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                                title="Удалить добавку с сайта"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Новая добавка (напр. Cheddar / Бекон)"
                        value={newExtraName}
                        onChange={e => setNewExtraName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddModifierToEditing();
                          }
                        }}
                        className="flex-1 bg-[#0c0f17] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5500]"
                      />
                      <input
                        type="number"
                        step="0.10"
                        value={newExtraPrice}
                        onChange={e => setNewExtraPrice(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddModifierToEditing();
                          }
                        }}
                        className="w-20 bg-[#0c0f17] border border-white/15 rounded-xl px-2.5 py-2 text-xs font-bold text-emerald-400 focus:outline-none focus:border-[#ff5500]"
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
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#ff5500] hover:bg-[#e04a00] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#ff5500]/25 transition cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Сохранить в SQLite & Обновить сайт</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : activeTab === 'tenants' ? (
          /* TAB 2: MULTI-TENANT SAAS FLEET MANAGEMENT (Flipdish White-Label Model) */
          <div className="space-y-6">
            {/* SaaS Founder Revenue Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#141824] border border-white/10 rounded-2xl p-4">
                <span className="text-[11px] font-bold uppercase text-neutral-400">
                  Ресторанов на платформе
                </span>
                <p className="text-2xl font-black text-white mt-1">
                  {tenantsData?.saasMetrics?.totalTenants || 3}
                </p>
                <span className="text-[11px] text-emerald-400">Италия, Германия, ЕС</span>
              </div>
              <div className="bg-[#141824] border border-white/10 rounded-2xl p-4">
                <span className="text-[11px] font-bold uppercase text-neutral-400">
                  Ваш MRR (Подписки/мес)
                </span>
                <p className="text-2xl font-black text-emerald-400 mt-1">
                  €{tenantsData?.saasMetrics?.mrrEur?.toFixed(2) || '247.00'} / мес
                </p>
                <span className="text-[11px] text-neutral-400">Тарифы €59 – €99 / мес</span>
              </div>
              <div className="bg-[#141824] border border-white/10 rounded-2xl p-4">
                <span className="text-[11px] font-bold uppercase text-neutral-400">
                  Прогноз ARR (За год)
                </span>
                <p className="text-2xl font-black text-[#ff7733] mt-1">
                  €{tenantsData?.saasMetrics?.arrEur?.toFixed(2) || '2964.00'} / год
                </p>
                <span className="text-[11px] text-neutral-400">Масштабируемая SaaS-модель</span>
              </div>
              <div className="bg-[#141824] border border-white/10 rounded-2xl p-4">
                <span className="text-[11px] font-bold uppercase text-neutral-400">
                  Оборот заказов (GMV)
                </span>
                <p className="text-2xl font-black text-white mt-1">
                  €{tenantsData?.saasMetrics?.platformGmvEur?.toFixed(2) || '72.80'}
                </p>
                <span className="text-[11px] text-emerald-400">Прямые выплаты на Stripe клиентов</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* List of Restaurant Clients */}
              <div className="lg:col-span-8 space-y-3">
                {(tenantsData?.tenants || []).map((t: any) => {
                  const isCurrent = t.id === activeTenantId;
                  return (
                    <div
                      key={t.id}
                      className={`p-5 rounded-3xl border transition ${
                        isCurrent
                          ? 'bg-[#1a1f30] border-[#ff5500]'
                          : 'bg-[#141824] border-white/10'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] font-black uppercase">
                              {t.country} • {t.city}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                              Тариф €{t.monthlyFeeEur}/мес
                            </span>
                            {t.stripeConnected && (
                              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                                ✓ Личный Stripe ({t.stripeMode})
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-black text-white mt-1.5">{t.name}</h3>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            📍 {t.address} • 📞 {t.phone}
                          </p>
                          <p className="text-xs text-neutral-400 mt-1">
                            📱 Трафик блогера/владельца: <strong>{t.instagramHandle}</strong> /{' '}
                            <strong>{t.tiktokHandle}</strong>
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => {
                              setActiveTenantId(t.id);
                              showToast(`Переключено на управление рестораном «${t.name}»`);
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                              isCurrent
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#ff5500] hover:bg-[#e04a00] text-white'
                            }`}
                          >
                            {isCurrent ? '✓ Активный ресторан' : 'Управлять этим сайтом'}
                          </button>
                          <span className="text-[11px] text-neutral-400">
                            Блюд в БД: {t.productsCount} • Заказов: {t.ordersCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Onboard New Street-Food Client Form */}
              <div className="lg:col-span-4 bg-[#141824] border border-white/10 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#ff5500]" />
                  <span>Подключить новый ресторан (White-Label SaaS)</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Создает изолированного тенанта в БД, клонирует шаблон меню и подготавливает шлюз под личный Stripe владельца.
                </p>

                <form onSubmit={handleCreateNewTenantSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                      Название стритфуда / ресторана *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Напр. Smash Burger Roma"
                      value={newTenantName}
                      onChange={e => setNewTenantName(e.target.value)}
                      className="w-full bg-[#0c0f17] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                        Город
                      </label>
                      <input
                        type="text"
                        placeholder="Roma / Paris / NY"
                        value={newTenantCity}
                        onChange={e => setNewTenantCity(e.target.value)}
                        className="w-full bg-[#0c0f17] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                        Код страны
                      </label>
                      <input
                        type="text"
                        placeholder="IT / DE / US"
                        value={newTenantCountry}
                        onChange={e => setNewTenantCountry(e.target.value.toUpperCase())}
                        className="w-full bg-[#0c0f17] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                        Подписка (€/мес)
                      </label>
                      <input
                        type="number"
                        value={newTenantFee}
                        onChange={e => setNewTenantFee(e.target.value)}
                        className="w-full bg-[#0c0f17] border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                        Instagram / TikTok
                      </label>
                      <input
                        type="text"
                        placeholder="@smashburger"
                        value={newTenantInstagram}
                        onChange={e => setNewTenantInstagram(e.target.value)}
                        className="w-full bg-[#0c0f17] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#ff5500] hover:bg-[#e04a00] text-white font-black text-xs uppercase cursor-pointer"
                  >
                    Развернуть сайт для клиента
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : activeTab === 'tiktok-promo' ? (
          /* TAB 3: INSTAGRAM REELS & TIKTOK TRAFFIC PROMO CODES */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-[#141824] border border-white/10 rounded-3xl p-6 space-y-4">
              <h2 className="text-base font-black text-white">
                Промокоды для видео в Instagram Reels и TikTok
              </h2>
              <p className="text-xs text-neutral-400">
                Владелец стритфуда снимает аппетитные видео и дает зрителям промокод (например, TIKTOK15) для заказа напрямую на сайте без комиссии агрегаторов.
              </p>

              <div className="space-y-2.5">
                {couponsList.map((c: any) => (
                  <div
                    key={c.code}
                    className="p-4 rounded-2xl bg-[#0d1017] border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-[#ff5500]/20 text-[#ff7733] font-mono font-black text-sm">
                          {c.code}
                        </span>
                        <span className="text-xs font-bold text-emerald-400">
                          Скидка -{c.discount_percent}%
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">Канал трафика: {c.channel}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm text-white">
                        €{Number(c.revenue_generated || 0).toFixed(2)}
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        Использован {c.usage_count} раз
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#141824] border border-white/10 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-black text-white">Создать новый промокод</h3>
              <form onSubmit={handleCreatePromoCode} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                    Код купона (латиницей) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="REELS20"
                    value={couponCodeInput}
                    onChange={e => setCouponCodeInput(e.target.value.toUpperCase())}
                    className="w-full bg-[#0c0f17] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                    Процент скидки (%)
                  </label>
                  <input
                    type="number"
                    value={couponDiscountInput}
                    onChange={e => setCouponDiscountInput(e.target.value)}
                    className="w-full bg-[#0c0f17] border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                    Источник трафика
                  </label>
                  <input
                    type="text"
                    value={couponChannelInput}
                    onChange={e => setCouponChannelInput(e.target.value)}
                    className="w-full bg-[#0c0f17] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#ff5500] hover:bg-[#e04a00] text-white font-black text-xs uppercase cursor-pointer"
                >
                  Создать промокод в БД
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* TAB 4: MICROSERVICES CLUSTER & SQLITE DATABASE HEALTH */
          <div className="space-y-6">
            <div className="bg-[#141824] border border-white/10 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">
                    {healthData?.database?.engine || 'SQLite 3 (WAL Mode)'} — Активна
                  </h2>
                  <p className="text-xs font-mono text-neutral-400">
                    Файл БД: {healthData?.database?.path || 'backend/data/streetfood_saas.sqlite'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-bold">
                  Тенантов: {healthData?.database?.tenantsCount || 3}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-bold">
                  Заказов в БД: {healthData?.database?.ordersCount || 3}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
                  Активных SSE-клиентов: {healthData?.realtimeSseClients || 1}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(healthData?.microservices || []).map((svc: any) => (
                <div
                  key={svc.id}
                  className="bg-[#141824] border border-white/10 rounded-3xl p-6 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono text-xs font-black">
                      PORT :{svc.port}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold">
                      ● {svc.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white">{svc.name}</h3>
                  <p className="text-xs text-[#ff8844] font-semibold">
                    Ориентир архитектуры: {svc.inspiration}
                  </p>
                  <div className="pt-2 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-neutral-400">
                      Эндпоинты микросервиса:
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(svc.routes || []).map((r: string) => (
                        <span
                          key={r}
                          className="px-2 py-0.5 rounded bg-black/40 border border-white/10 font-mono text-[11px] text-neutral-300"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
