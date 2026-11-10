import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface PanzerottiBannerProps {
  onDiscoverAll: () => void;
  onSelectSubCategory?: (subCategory: 'classici' | 'speciali' | 'vegetariani' | 'tutti') => void;
}

export const PanzerottiBanner: React.FC<PanzerottiBannerProps> = ({
  onDiscoverAll,
  onSelectSubCategory,
}) => {
  const { language } = useCart();

  const copy = {
    fr: {
      title: 'SPÉCIALITÉS',
      tagline: 'Classiques ou signatures, toujours irrésistibles.',
      desc: 'Viandes grillées minute, pains moelleux, recettes maison et saveurs généreuses qui séduisent dès la première bouchée.',
      cta: 'TOUT DÉCOUVRIR',
      subs: [
        { key: 'classici' as const, name: 'CLASSIQUES', subtitle: 'Les grands incontournables qui ne déçoivent jamais.' },
        { key: 'speciali' as const, name: 'SPÉCIAUX', subtitle: 'Recettes signatures et saveurs inédites.' },
        { key: 'vegetariani' as const, name: 'FRAÎCHEUR', subtitle: 'Léger, frais et toujours plein de goût.' },
      ],
    },
    en: {
      title: 'SPECIALTIES',
      tagline: 'Classic or signature, always irresistible.',
      desc: 'Freshly grilled meats, soft artisan breads, homemade recipes and bold flavors from the very first bite.',
      cta: 'DISCOVER ALL',
      subs: [
        { key: 'classici' as const, name: 'CLASSICS', subtitle: 'Timeless favorites that never disappoint.' },
        { key: 'speciali' as const, name: 'SPECIALS', subtitle: 'Signature recipes and bold new flavors.' },
        { key: 'vegetariani' as const, name: 'FRESH & LIGHT', subtitle: 'Light, crisp and packed with flavor.' },
      ],
    },
    de: {
      title: 'SPEZIALITÄTEN',
      tagline: 'Klassisch oder exklusiv, immer unwiderstehlich.',
      desc: 'Frisch gegrilltes Fleisch, fluffiges Brot, hausgemachte Rezepte und voller Geschmack ab dem ersten Bissen.',
      cta: 'ALLE ENTDECKEN',
      subs: [
        { key: 'classici' as const, name: 'KLASSIKER', subtitle: 'Zeitlose Favoriten, die immer überzeugen.' },
        { key: 'speciali' as const, name: 'SPEZIAL', subtitle: 'Neue Rezepte, unvergessliche Aromen.' },
        { key: 'vegetariani' as const, name: 'FRISCH & LEICHT', subtitle: 'Leichter Genuss voller Geschmack.' },
      ],
    },
    it: {
      title: 'SPECIALITÀ',
      tagline: 'Classici o speciali, sempre irresistibili.',
      desc: 'Carni grigliate al momento, pane soffice, ricette fatte in casa e tutto il gusto che conquista al primo morso.',
      cta: 'SCOPRI TUTTI',
      subs: [
        { key: 'classici' as const, name: 'CLASSICI', subtitle: 'I grandi intramontabili che non deludono mai.' },
        { key: 'speciali' as const, name: 'SPECIALI', subtitle: 'Nuove ricette, nuovi sapori.' },
        { key: 'vegetariani' as const, name: 'FRESCHEZZA', subtitle: 'Gusto leggero, sempre pieno di sapore.' },
      ],
    },
    ru: {
      title: 'ФИРМЕННОЕ',
      tagline: 'Классика или авторские рецепты — всегда безупречно.',
      desc: 'Сочное мясо с гриля, мягкий свежий хлеб, домашние соусы и насыщенный вкус с первого укуса.',
      cta: 'СМОТРЕТЬ ВСЕ',
      subs: [
        { key: 'classici' as const, name: 'КЛАССИКА', subtitle: 'Проверенные хиты, которые никогда не подводят.' },
        { key: 'speciali' as const, name: 'СПЕЦИАЛЬНЫЕ', subtitle: 'Авторские рецепты и яркие сочетания.' },
        { key: 'vegetariani' as const, name: 'СВЕЖЕСТЬ', subtitle: 'Лёгкий и насыщенный вкус каждый день.' },
      ],
    },
  }[language];

  const images = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
  ];

  const subCategories = copy.subs.map((s, i) => ({
    ...s,
    image: images[i],
  }));

  return (
    <div
      id="panzerotti-featured-banner"
      className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden mb-10 shadow-2xl border border-white/10"
      style={{
        backgroundImage: 'url(/panzerotti-banner.png), url(https://i.imgur.com/7freWBa.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '480px',
      }}
    >
      {/* Dark vignette & readability gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/80 pointer-events-none" />
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Main Content Grid matching Screen 2 */}
      <div className="relative z-10 p-5 sm:p-7 md:p-8 lg:p-10 h-full flex flex-col justify-between min-h-[480px] lg:min-h-[520px]">
        {/* Top & Center content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center flex-1">
          {/* Left Spacer on Desktop (leaves the delicious panzerotti artwork visible) */}
          <div className="hidden lg:block lg:col-span-3 xl:col-span-4 pointer-events-none" />

          {/* Center Column: Title, Subtitles & Big CTA Button */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col items-start justify-center space-y-3 sm:space-y-4">
            {/* Main Category Title */}
            <div>
              <h2 className="font-brush text-4xl sm:text-5xl md:text-5.5xl lg:text-6xl font-black text-white uppercase tracking-wider leading-none drop-shadow-xl">
                {copy.title}
              </h2>
              {/* Orange brush underline */}
              <div className="w-40 sm:w-52 md:w-60 h-1.5 sm:h-2 bg-[#ff5500] rounded-full mt-2 -rotate-1 origin-left shadow-md shadow-[#ff5500]/60" />
            </div>

            {/* Handwritten Subtitle */}
            <p className="font-brush text-base sm:text-lg md:text-xl text-[#ffaa33] italic tracking-wide drop-shadow-md leading-snug">
              {copy.tagline}
            </p>

            {/* Description Text */}
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium drop-shadow-md max-w-md">
              {copy.desc}
            </p>

            {/* Orange CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onDiscoverAll}
                className="bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-black text-xs sm:text-sm md:text-base tracking-wider uppercase px-6 sm:px-7 py-3 sm:py-3.5 rounded-full shadow-xl shadow-[#ff5500]/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 group cursor-pointer"
              >
                <span>{copy.cta}</span>
                <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:translate-x-1.5" />
              </button>
            </div>
          </div>

          {/* Right Column: 3 Subcategory Cards matching Screen 2 (exact 350px width x 130px height) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-center lg:items-end gap-3.5 w-full">
            {subCategories.map((sub) => (
              <div
                key={sub.key}
                onClick={() => onSelectSubCategory?.(sub.key)}
                className="group relative w-full sm:w-[350px] min-w-0 sm:min-w-[350px] max-w-[350px] h-[130px] min-h-[130px] max-h-[130px] bg-black/75 hover:bg-black/90 backdrop-blur-md border border-[#939293]/50 hover:border-[#ff5500] rounded-2xl p-2.5 transition-all duration-300 flex items-center justify-between gap-3.5 cursor-pointer shadow-xl hover:shadow-[#ff5500]/25 select-none"
              >
                {/* Left: 110x110px Image Thumbnail */}
                <div className="w-[110px] h-[110px] min-w-[110px] max-w-[110px] rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-md bg-neutral-900">
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Middle: Title & Subtitle */}
                <div className="flex flex-col justify-center text-left flex-1 min-w-0 pr-1">
                  <span className="font-brush text-lg sm:text-xl font-bold text-white tracking-wider uppercase truncate">
                    {sub.name}
                  </span>
                  <span className="text-xs text-neutral-300 leading-snug line-clamp-2 mt-1">
                    {sub.subtitle}
                  </span>
                </div>

                {/* Right: Orange arrow */}
                <div className="shrink-0 pr-1 text-[#ff5500]">
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom subtle orange brush accent matching Screen 2 */}
        <div className="w-full pt-4 flex justify-center opacity-70 pointer-events-none">
          <div className="w-2/3 h-1 bg-gradient-to-r from-transparent via-[#ff5500] to-transparent rounded-full" />
        </div>
      </div>
    </div>
  );
};
