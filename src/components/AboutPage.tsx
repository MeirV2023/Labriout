import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Flame,
  Sparkles,
  Smile,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

// Starburst Sticker Badge Generator matching Screenshot 4
const StarburstBadge: React.FC<{
  fillColor: string;
  strokeColor?: string;
  icon: React.ReactNode;
}> = ({ fillColor, strokeColor = '#18181b', icon }) => {
  // Generates 20-pointed sticker starburst
  const points = 20;
  const rOuter = 46;
  const rInner = 37;
  const cx = 50;
  const cy = 50;

  let d = '';
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    d += (i === 0 ? 'M' : 'L') + ` ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  d += 'Z';

  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto flex items-center justify-center shrink-0">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-sm transition-transform duration-300 hover:rotate-12"
      >
        <path
          d={d}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-white pointer-events-none">
        {icon}
      </div>
    </div>
  );
};

export const AboutPage: React.FC = () => {
  const { setCurrentView, language } = useCart();

  const isEn = language === 'en';
  const isRu = language === 'ru';
  const isDe = language === 'de';
  const isFr = language === 'fr';
  const isIt = language === 'it';

  // Mobile infinite circular horizontal carousel refs & state
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const [activePillarIndex, setActivePillarIndex] = useState(0);
  const isAdjustingScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  const pillars = [
    {
      id: 'flavor',
      badge: (
        <StarburstBadge
          fillColor="#ff5500"
          icon={<Flame className="w-7 h-7 sm:w-8 sm:h-8 fill-white stroke-white" />}
        />
      ),
      title: isEn
        ? '✡️ 100% KOSHER • BADATZ DE BRUNOY'
        : isRu
        ? '✡️ 100% КОШЕР • BADATZ DE BRUNOY'
        : isDe
        ? '✡️ 100% KOSCHER • BADATZ DE BRUNOY'
        : isIt
        ? '✡️ 100% KOSHER • BADATZ DE BRUNOY'
        : '✡️ 100% CASHER • BADATZ DE BRUNOY',
      content: (
        <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium max-w-sm">
          {isEn
            ? 'Uncompromising Kashrut standards under the strict rabbinical supervision of Badatz de Brunoy (Glatt Kosher / Beth Yosef). Every meat cut, poultry fillet, and Parve ingredient is inspected daily on-site by our Mashgiach (Chomer).'
            : isRu
            ? 'Безупречный стандарт кашрута под строгим раввинским надзором Badatz de Brunoy (Халак Бейт Йосеф). Отборная говядина, птица, свежая зелень и ингредиенты Parvé ежедневно проверяются машгиахом (шомером) прямо на нашей кухне.'
            : isDe
            ? 'Kompromisslose Kaschrut unter der strengen rabbinischen Aufsicht des Badatz de Brunoy. Unser gesamtes Fleisch, Geflügel und alle Parve-Zutaten werden täglich vor Ort von unserem Maschgiach kontrolliert.'
            : isIt
            ? 'Standard di Kasherut rigorosi sotto la stretta supervisione rabbinica del Badatz de Brunoy (Halak Beth Yosef). Ogni taglio di carne, pollame e ingrediente Parve è controllato quotidianamente in sede dal nostro Mashgiach.'
            : 'Une cacherout irréprochable sous la surveillance stricte du Badatz de Brunoy (Halak Beth Yossef). Nos viandes, volailles et ingrédients Parvé sont rigoureusement sélectionnés et contrôlés chaque jour sur place par notre Chomer.'}
        </p>
      ),
    },
    {
      id: 'dreams',
      badge: (
        <StarburstBadge
          fillColor="#eab308"
          icon={<Smile className="w-7 h-7 sm:w-8 sm:h-8 stroke-neutral-900 stroke-[2.5]" />}
        />
      ),
      title: isEn
        ? 'JEWISH HOSPITALITY ("LABRIOUT")'
        : isRu
        ? 'ЕВРЕЙСКОЕ ГОСТЕПРИИМСТВО («ЛАБРИЮТ»)'
        : isDe
        ? 'JÜDISCHE GASTFREUNDSCHAFT („LABRIOUT“)'
        : isFr
        ? 'HOSPITALITÉ & GÉNÉROSITÉ (« LABRIOUT »)'
        : 'OSPITALITÀ & GENEROSITÀ («LABRIOUT»)',
      content: (
        <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium max-w-sm">
          {isEn
            ? 'In Hebrew, "Labriout" (לבריאות) means "To your health!". We welcome every guest like family around a generous table in Bonneuil-sur-Marne — whether for a quick lunch, a festive family dinner, or pre-Shabbat gatherings.'
            : isRu
            ? 'На иврите «Лабриют» (לבריאות) означает «На здоровье!». В Бонёй-сюр-Марн мы встречаем каждого гостя как близкого друга семьи: щедрые порции, пышные питы и лаффы, атмосфера радости, уважения к традициям и домашнего уюта.'
            : isDe
            ? 'Auf Hebräisch bedeutet „Labriout“ (לבריאות) „Auf Ihre Gesundheit!“. In Bonneuil-sur-Marne empfangen wir jeden Gast wie Familie mit großzügigen Portionen, warmen Pitas und echter Herzlichkeit.'
            : isIt
            ? 'In ebraico, «Labriout» (לבריאות) significa «Alla tua salute!». A Bonneuil-sur-Marne accogliamo ogni ospite come in famiglia con piatti abbondanti, pane pita e laffa caldi e un’atmosfera conviviale e autentica.'
            : 'En hébreu, « Labriout » (לבריאות) signifie « À votre santé ! ». À Bonneuil-sur-Marne, nous recevons chaque client comme un invité de marque : des assiettes copieuses, des pains pitas et laffas généreux et une ambiance familiale chaleureuse.'}
        </p>
      ),
    },
    {
      id: 'secret',
      badge: (
        <StarburstBadge
          fillColor="#15803d"
          icon={<Sparkles className="w-7 h-7 sm:w-8 sm:h-8 stroke-white stroke-[2]" />}
        />
      ),
      title: isEn
        ? 'OUR KOSHER CRAFTSMANSHIP'
        : isRu
        ? 'СЕКРЕТЫ НАШЕЙ КОШЕРНОЙ КУХНИ'
        : isDe
        ? 'UNSERE KOSCHERE HAUSKÜCHE'
        : isFr
        ? 'NOTRE SAVOIR-FAIRE MAISON'
        : 'IL NOSTRO SAPERE ARTIGIANALE',
      content: (
        <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium text-left space-y-1.5 max-w-sm">
          <p>
            <strong className="text-neutral-900 font-bold">
              {isEn
                ? 'Strict Kashrut: '
                : isRu
                ? 'Строгий Кашрут: '
                : isDe
                ? 'Zertifizierte Kaschrut: '
                : isIt
                ? 'Kasherut Certificata: '
                : 'Cacherout Certifiée : '}
            </strong>
            {isEn
              ? '100% Kosher meat & Parve under Badatz de Brunoy supervision.'
              : isRu
              ? '100% кошерное мясо (Басар) и чеддер Parvé под контролем Badatz de Brunoy.'
              : isDe
              ? '100 % koscheres Fleisch (Bassar) & Parve unter Aufsicht des Badatz de Brunoy.'
              : isIt
              ? '100% carne Kosher (Bassar) e Parve sotto il controllo del Badatz de Brunoy.'
              : '100% Casher Bassar & Parvé sous le contrôle du Badatz de Brunoy.'}
          </p>
          <p>
            <strong className="text-neutral-900 font-bold">
              {isEn
                ? 'Flame & Plancha: '
                : isRu
                ? 'Огонь и Планча: '
                : isDe
                ? 'Grill & Smash: '
                : isIt
                ? 'Griglia & Smash: '
                : 'Grillades & Smash : '}
            </strong>
            {isEn
              ? 'Crispy Smash Burgers, spiced Shawarma, tender Parguit & artisanal Merguez.'
              : isRu
              ? 'Сочные Смэш-бургеры, пряная шаурма, нежный паргит и домашние мергез.'
              : isDe
              ? 'Knusprige Smash Burger, würziges Shawarma, zartes Parguit und hausgemachte Merguez.'
              : isIt
              ? 'Smash Burger croccanti, shawarma speziato, parguit tenero e merguez artigianali.'
              : 'Smash burgers croustillants, shawarma mariné, parguit tendre et merguez.'}
          </p>
          <p>
            <strong className="text-neutral-900 font-bold">
              {isEn
                ? 'Homemade Tradition: '
                : isRu
                ? 'Домашние рецепты: '
                : isDe
                ? 'Hausgemachte Rezepte: '
                : isIt
                ? 'Tradizione Fatta in Casa: '
                : 'Fait Maison : '}
            </strong>
            {isEn
              ? 'Creamy Hummus Bassar, golden Falafels, fresh fries & sweet potato fries.'
              : isRu
              ? 'Кремовый хумус басар, золотистый фалафель, тхина и домашний картофель фри.'
              : isDe
              ? 'Cremiger Hummus Bassar, goldene Kräuter-Falafel, Tahina und frische Hauspommes.'
              : isIt
              ? 'Hummus Bassar cremoso, falafel dorati alle erbe, tahina e patatine fresche.'
              : 'Houmous bassar onctueux, falafels dorés aux herbes, thina et frites fraîches.'}
          </p>
          <p>
            <strong className="text-neutral-900 font-bold">
              {isEn
                ? 'Warm Service: '
                : isRu
                ? 'Сервис с душой: '
                : isDe
                ? 'Familiengeist: '
                : isIt
                ? 'Spirito Familiare: '
                : 'Esprit Famille : '}
            </strong>
            {isEn
              ? 'Dine-in, takeaway & hot delivery at 64 av. Simone Veil, Bonneuil-sur-Marne.'
              : isRu
              ? 'В зале, навынос и быстрая доставка: 64 av. Simone Veil, Bonneuil-sur-Marne.'
              : isDe
              ? 'Vor Ort, zum Mitnehmen und heiße Lieferung: 64 av. Simone Veil, Bonneuil-sur-Marne.'
              : isIt
              ? 'In sala, da asporto e consegna calda: 64 av. Simone Veil, Bonneuil-sur-Marne.'
              : 'Sur place, à emporter et livraison au 64 av. Simone Veil, Bonneuil-sur-Marne.'}
          </p>
        </div>
      ),
    },
  ];

  // 5 sets of 3 pillars (15 items total) for seamless circular scrolling in both directions
  const repeatedPillars = [
    ...pillars,
    ...pillars,
    ...pillars,
    ...pillars,
    ...pillars,
  ];
  const middleSetStartIndex = pillars.length * 2; // index 6

  const centerSlideAtIndex = useCallback((slideIndex: number, smooth = false) => {
    const container = mobileCarouselRef.current;
    if (!container) return;
    const slideEl = container.children[slideIndex] as HTMLElement | undefined;
    if (!slideEl) return;
    const targetLeft = slideEl.offsetLeft - (container.clientWidth - slideEl.offsetWidth) / 2;
    if (smooth) {
      container.scrollTo({ left: targetLeft, behavior: 'smooth' });
    } else {
      container.style.scrollBehavior = 'auto';
      container.scrollLeft = targetLeft;
      container.style.scrollBehavior = '';
    }
  }, []);

  useEffect(() => {
    // Position mobile carousel at the first item of the middle set on mount
    const timer = window.setTimeout(() => {
      centerSlideAtIndex(middleSetStartIndex, false);
    }, 20);
    return () => window.clearTimeout(timer);
  }, [centerSlideAtIndex, middleSetStartIndex]);

  const handleMobileCarouselScroll = () => {
    const container = mobileCarouselRef.current;
    if (!container || isAdjustingScrollRef.current) return;

    const children = Array.from(container.children) as HTMLElement[];
    if (children.length < 15) return;

    const viewportCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIdx = middleSetStartIndex;
    let minDistance = Infinity;

    children.forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const dist = Math.abs(childCenter - viewportCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    setActivePillarIndex(closestIdx % pillars.length);

    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      if (isDraggingRef.current) return;
      const singleSetWidth = children[pillars.length].offsetLeft - children[0].offsetLeft;
      if (singleSetWidth <= 0) return;

      // If scrolled outside the middle set (sets 0, 1 or sets 3, 4), silently shift back to set 2
      if (closestIdx < pillars.length * 2 || closestIdx >= pillars.length * 3) {
        const normalizedIdx = middleSetStartIndex + (closestIdx % pillars.length);
        const offsetSets = Math.floor(closestIdx / pillars.length) - 2;
        isAdjustingScrollRef.current = true;
        container.style.scrollBehavior = 'auto';
        container.scrollLeft -= offsetSets * singleSetWidth;
        container.style.scrollBehavior = '';
        window.requestAnimationFrame(() => {
          isAdjustingScrollRef.current = false;
        });
        void normalizedIdx;
      }
    }, 140);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = mobileCarouselRef.current;
    if (!container) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX;
    startScrollLeftRef.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const container = mobileCarouselRef.current;
    if (!container) return;
    const dx = e.pageX - startXRef.current;
    container.scrollLeft = startScrollLeftRef.current - dx;
  };

  const handleMouseUpOrLeave = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    handleMobileCarouselScroll();
  };

  return (
    <div className="min-h-screen bg-[#FAF6ED] text-[#1f2937] overflow-x-hidden selection:bg-[#ff5500] selection:text-white">
      
      {/* SECTION 1 & 2: Top Hero Story with Left Polaroid overlapping ABOUT US Title (Screenshots 1 & 2) */}
      <section className="pt-6 sm:pt-8 pb-8 sm:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Title with thinner font sitting behind the polaroid card */}
        <div className="relative z-0">
          <h1
            style={{
              fontFamily: '"Bebas Neue", "Barlow Condensed", "Oswald", sans-serif',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.01em',
            }}
            className="text-[52px] sm:text-[85px] md:text-[105px] lg:text-[130px] text-neutral-900 leading-[0.85] select-none"
          >
            {isEn ? 'ABOUT US' : isRu ? 'О НАС' : isDe ? 'ÜBER UNS' : isFr ? 'À PROPOS' : 'CHI SIAMO'}
          </h1>
        </div>

        {/* 2-Column Grid: Left Polaroid overlapping the title / Right Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start relative z-10 -mt-6 sm:-mt-10 md:-mt-14 lg:-mt-18">
          
          {/* Left Column: Direct Polaroid Image with built-in frame and sticker */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative max-w-sm sm:max-w-md w-[90%] translate-y-[20px]">
              <img
                src="/about-us.png?v=labriout2"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    target.src = 'https://ik.imagekit.io/3l9prqiky/eatview/uploads/2026-10-19/f751f8e4-3f3a-4d10-a3e4-a496157a9b08-img_8355.jpg';
                  }
                }}
                alt="LABRIOUT Burger Casher Badatz de Brunoy"
                className="w-full h-auto drop-shadow-[0_16px_36px_rgba(0,0,0,0.12)]"
                loading="eager"
              />
            </div>
          </div>

          {/* Right Column: Two Narrative Story Blocks */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 sm:space-y-12 pt-4 sm:pt-6 lg:pt-8">
            
            {/* Story Block 1: Kosher Tradition & Passion */}
            <div className="space-y-2 sm:space-y-3">
              <h2
                style={{
                  fontFamily: '"Bebas Neue", "Barlow Condensed", "Oswald", sans-serif',
                  letterSpacing: '0.02em',
                }}
                className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] text-[#FF5500] uppercase leading-none tracking-tight select-none font-bold"
              >
                {isEn
                  ? 'THE ART OF AUTHENTIC KOSHER STREET FOOD'
                  : isRu
                  ? 'ИСКУССТВО НАСТОЯЩЕЙ КОШЕРНОЙ КУХНИ'
                  : isDe
                  ? 'DIE KUNST AUTHENTISCHER KOSCHERER KÜCHE'
                  : isFr
                  ? 'LA PASSION DU VRAI GOÛT CASHER'
                  : 'LA PASSIONE DEL VERO GUSTO KASHER'}
              </h2>
              <p className="max-w-[460px] text-sm sm:text-[15px] lg:text-base text-neutral-800 leading-snug font-medium">
                {isEn
                  ? 'In the heart of Bonneuil-sur-Marne (64 av. Simone Veil), LABRIOUT was born from a family calling: uniting the warmth of Jewish and Israeli culinary tradition with modern gourmet street food. Under the strict rabbinical supervision of Badatz de Brunoy (100% Kosher / Beth Yosef), we flame-grill prime kosher meats daily and serve every guest with genuine hospitality.'
                  : isRu
                  ? 'В самом сердце Бонёй-сюр-Марн (64 av. Simone Veil) ресторан LABRIOUT родился из семейного призвания: объединить щедрость еврейской и израильской гастрономии с культурой современного гурмэ-стритфуда. Под строгим раввинским контролем кашрута Badatz de Brunoy (100% Casher • Бе-ашгахат Бадац Брюнуа) мы ежедневно готовим отборное кошерное мясо на открытом огне с теплом настоящего еврейского гостеприимства.'
                  : isDe
                  ? 'Im Herzen von Bonneuil-sur-Marne (64 av. Simone Veil) entstand LABRIOUT aus einer Familientradition: die Großzügigkeit der jüdisch-israelischen Küche mit modernem Gourmet-Streetfood zu verbinden. Unter der strengen rabbinischen Aufsicht des Badatz de Brunoy (100 % Koscher) grillen wir täglich bestes koscheres Fleisch frisch über der Flamme.'
                  : isIt
                  ? 'Nel cuore di Bonneuil-sur-Marne (64 av. Simone Veil), LABRIOUT nasce da una vocazione familiare: unire la generosità della cucina ebraica e israeliana con l’eccellenza dello street food moderno. Sotto la rigorosa supervisione rabbinica del Badatz de Brunoy (100% Kosher Bassar / Halak Beth Yosef), prepariamo ogni giorno carni selezionate e grigliate alla fiamma.'
                  : 'Au cœur de Bonneuil-sur-Marne (64 av. Simone Veil), LABRIOUT est né d’une vocation familiale : réunir la générosité de la cuisine juive et israélienne avec l’excellence du street food moderne. Sous la stricte surveillance rabbinique du Badatz de Brunoy (100% Casher Bassar / Halak Beth Yossef), nous préparons chaque jour des viandes sélectionnées avec soin et grillées à la flamme.'}
              </p>
            </div>

            {/* Story Block 2: Shawarma, Parguit, Smash Burgers & Hummus Bassar */}
            <div className="space-y-2 sm:space-y-3">
              <h2
                style={{
                  fontFamily: '"Bebas Neue", "Barlow Condensed", "Oswald", sans-serif',
                  letterSpacing: '0.02em',
                }}
                className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] text-[#FF5500] uppercase leading-none tracking-tight select-none font-bold"
              >
                {isEn
                  ? 'FROM SPICED SHAWARMA TO SMASH BURGERS'
                  : isRu
                  ? 'ОТ СОЧНОЙ ШАУРМЫ И ПАРГИТА ДО СМЭШ-БУРГЕРОВ'
                  : isDe
                  ? 'VON WÜRZIGEM SHAWARMA BIS SMASH BURGERN'
                  : isFr
                  ? 'DU SHAWARMA AUX SMASH BURGERS GOURMETS'
                  : 'DALLO SHAWARMA AI NOSTRI SMASH BURGER'}
              </h2>
              <p className="max-w-[460px] text-sm sm:text-[15px] lg:text-base text-neutral-800 leading-snug font-medium">
                {isEn
                  ? 'From our crispy Smash Burgers topped with melted Parve cheddar and kosher pressed veal bacon, to warm pitas and laffas loaded with spiced shawarma, tender parguit, golden schnitzel, artisanal merguez, and creamy hummus bassar with tahini — every recipe strictly honors the laws of Kashrut with zero compromise on flavor.'
                  : isRu
                  ? 'От наших фирменных Смэш-бургеров с тающим чеддером Parvé и хрустящей прессованной телятиной до горячих пит и лафф с пряной шаурмой, сочным шашлыком паргит, золотистым шницелем, домашними колбасками мергез и кремовым хумусом басар с кунжутной тхиной — каждый рецепт бережно хранит законы кашрута и дарит незабываемый вкус.'
                  : isDe
                  ? 'Von unseren knusprigen Smash Burgern mit geschmolzenem Parve-Cheddar und koscherem Kalbs-Bacon bis hin zu warmen Pitas und Laffas mit würzigem Shawarma, zartem Parguit, goldenem Schnitzel, Merguez und hausgemachtem Hummus Bassar – jedes Gericht folgt streng den Kaschrut-Gesetzen.'
                  : isIt
                  ? 'Dai nostri Smash Burger croccanti con cheddar fuso Parve e vitello pressato kosher, fino alle laffa e pita calde farcite con shawarma marinato alle spezie, parguit tenero, schnitzel dorato al sesamo, merguez artigianali e hummus bassar fatto in casa — ogni ricetta rispetta scrupolosamente le leggi della Kasherut.'
                  : 'De nos Smash Burgers croustillants garnis de cheddar fondant Parvé et de veau pressé façon bacon casher, jusqu’à nos laffas et pitas chaudes au shawarma mariné aux épices orientales, parguit tendre, schnitzel doré, merguez artisanales et houmous bassar maison — chaque recette respecte scrupuleusement les lois de la Cacherout.'}
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* SECTION 3: "LABRIOUT : LA GÉNÉROSITÉ & LE PARTAGE" with 3 Food Polaroids */}
      <section className="py-12 sm:py-16 lg:py-24 max-w-[1000px] lg:max-w-[1060px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 items-start relative">
          
          {/* LEFT COLUMN: Polaroid 1 (Laffa Shawarma & Fries) + Heading & Narrative Text */}
          <div className="flex flex-col items-center md:items-start z-10">
            
            {/* Polaroid 1: Top-Left Laffa Shawarma & House Fries */}
            <div className="relative w-[285px] sm:w-[345px] md:w-[385px] max-w-full transform -rotate-[1deg] md:translate-x-20 lg:translate-x-28 hover:rotate-0 hover:scale-[1.02] transition-all duration-300 z-10">
              <img
                src="/about-chips.png?v=labriout2"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    target.src = 'https://ik.imagekit.io/3l9prqiky/eatview/migrated/labriout/d3b33d1f5265-laffa-shawarma.webp';
                  }
                }}
                alt="LABRIOUT Laffa Shawarma & Frites Maison"
                className="w-full h-auto drop-shadow-[0_16px_36px_rgba(0,0,0,0.16)]"
                loading="lazy"
              />
            </div>

            {/* Narrative Story Block Underneath Polaroid 1 */}
            <div className="mt-8 sm:mt-10 md:mt-10 lg:mt-12 max-w-[440px] md:translate-x-16 lg:translate-x-24 xl:translate-x-28 space-y-3 sm:space-y-4">
              <h2
                style={{
                  fontFamily: '"Bebas Neue", "Barlow Condensed", "Oswald", sans-serif',
                  letterSpacing: '0.02em',
                }}
                className="text-2xl sm:text-3xl md:text-[38px] text-[#FF5500] uppercase leading-[0.95] tracking-tight select-none font-bold"
              >
                {isEn
                  ? 'LABRIOUT (לבריאות): TO YOUR HEALTH & JOY'
                  : isRu
                  ? 'ЛАБРИЮТ (לבריאות) — НА ЗДОРОВЬЕ И В РАДОСТЬ!'
                  : isDe
                  ? 'LABRIOUT (לבריאות): AUF IHRE GESUNDHEIT!'
                  : isFr
                  ? 'LABRIOUT (לבריאות) : LA GÉNÉROSITÉ & LE PARTAGE'
                  : 'LABRIOUT (לבריאות): SALUTE, GIOIA & CONDIVISIONE'}
              </h2>
              <p className="text-sm sm:text-[15px] lg:text-base text-neutral-800 leading-snug font-medium">
                {isEn
                  ? 'In Hebrew, "Labriout" (לבריאות) means "To your good health!". That blessing inspires every dish we serve: welcoming families, friends, and the community around a generous kosher table where everything is cooked fresh to order with house-cut fries, warm fluffy pitas, and homemade sauces. Every meal is a moment of Simcha (joy) and togetherness.'
                  : isRu
                  ? 'На иврите «Лабриют» (לבריאות — «На здоровье!») — это тёплое благословение за богатым семейным столом. Именно эту душу и атмосферу Симхи (радости) мы вкладываем в каждое блюдо: щедрые мясные тарелки, свежие салаты, горячий фалафель, домашний фри и искреннее гостеприимство для всей еврейской общины и наших дорогих гостей.'
                  : isDe
                  ? 'Auf Hebräisch bedeutet „Labriout“ (לבריאות) „Auf Ihre Gesundheit!“. Genau diese Herzlichkeit steckt in jedem unserer Gerichte: großzügige Teller, hausgemachte Pommes, frische Salate und warme Pitas für die ganze Familie und Gemeinschaft.'
                  : isIt
                  ? 'In ebraico, «Labriout» (לבריאות) significa «Alla tua salute!». È l’anima della nostra casa: riunire famiglie, amici e tutta la comunità attorno a una tavola kosher ricca e gioiosa, dove ogni carne alla griglia, ogni pita calda e ogni porzione di patatine fresche è preparata al momento con amore e generosità.'
                  : 'En hébreu, « Labriout » (לבריאות) signifie « À votre santé ! ». C’est toute l’âme de notre maison : réunir les familles, les amis et la communauté autour d’une table casher abondante et joyeuse, où chaque viande grillée, chaque pita chaude et chaque barquette de frites maison est préparée à la minute avec amour et générosité.'}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Polaroid 2 (Assiette Duo) + Polaroid 3 (Houmous Bassar) */}
          <div className="flex flex-col items-center md:items-start relative mt-8 md:mt-4 z-20">
            
            {/* Polaroid 2: Top-Right Assiette Gourmande Duo */}
            <div className="relative w-[300px] sm:w-[370px] md:w-[415px] max-w-full transform rotate-[7deg] hover:rotate-0 hover:scale-[1.02] transition-all duration-300 md:-ml-16 lg:-ml-24 z-20">
              <img
                src="/about-polaroid2.png?v=labriout2"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    target.src = 'https://ik.imagekit.io/3l9prqiky/eatview/migrated/labriout/91587948ff65-assiette-duo.webp';
                  }
                }}
                alt="LABRIOUT Assiette Gourmande Casher"
                className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.20)]"
                loading="lazy"
              />
            </div>

            {/* Polaroid 3: Bottom-Right Houmous Bassar & Pita */}
            <div className="relative w-[160px] sm:w-[190px] md:w-[210px] max-w-full transform -rotate-[5deg] translate-x-[20px] hover:rotate-0 hover:scale-[1.02] transition-all duration-300 z-30 -mt-8 sm:-mt-12 md:-mt-16 ml-10 sm:ml-16 md:ml-20">
              <img
                src="/about-polaroid3.png?v=labriout2"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    target.src = 'https://ik.imagekit.io/3l9prqiky/eatview/migrated/labriout/0fe48647b6ed-houmous-bassar.webp';
                  }
                }}
                alt="LABRIOUT Houmous Bassar & Pita Chaude"
                className="w-full h-auto drop-shadow-[0_18px_36px_rgba(0,0,0,0.18)]"
                loading="lazy"
              />
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: 3-Column Pillars with Starburst Badges & Hairline Dividers (Screenshot 4) */}
      <section className="py-12 sm:py-24 border-t border-black/10 bg-[#FAF6ED]">
        {/* MOBILE ONLY: Horizontal infinite circular carousel (swipe right-to-left in a circle) */}
        <div className="md:hidden">
          <div
            ref={mobileCarouselRef}
            onScroll={handleMobileCarouselScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            style={{
              WebkitOverflowScrolling: 'touch',
              overscrollBehaviorX: 'contain',
            }}
            className="flex flex-row items-stretch overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth select-none cursor-grab active:cursor-grabbing"
          >
            {repeatedPillars.map((pillar, idx) => (
              <div
                key={`${pillar.id}-${idx}`}
                className="w-[84vw] max-w-[340px] shrink-0 snap-center py-4 px-5 flex flex-col items-center text-center space-y-4 border-r border-black/15"
              >
                {pillar.badge}
                <h3 className="font-heading font-black text-xl text-neutral-900 tracking-tight uppercase">
                  {pillar.title}
                </h3>
                {pillar.content}
              </div>
            ))}
          </div>

          {/* Mobile Carousel Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {pillars.map((pillar, idx) => (
              <button
                key={pillar.id}
                type="button"
                aria-label={pillar.title}
                onClick={() => centerSlideAtIndex(middleSetStartIndex + idx, true)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activePillarIndex === idx
                    ? 'w-5 bg-[#ff5500]'
                    : 'w-1.5 bg-black/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* DESKTOP ONLY: Unchanged 3-Column Grid */}
        <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/15">
            {pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="py-8 md:py-0 px-4 sm:px-8 flex flex-col items-center text-center space-y-4"
              >
                {pillar.badge}
                <h3 className="font-heading font-black text-xl sm:text-2xl text-neutral-900 tracking-tight uppercase">
                  {pillar.title}
                </h3>
                {pillar.content}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

