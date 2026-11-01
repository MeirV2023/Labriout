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
        ? 'FLAVOR WITH A PURPOSE'
        : isRu
        ? 'ВКУС СО СМЫСЛОМ'
        : isDe
        ? 'GESCHMACK MIT HERZ'
        : isFr
        ? 'LA SAVEUR AVEC DU SENS'
        : 'SAPORE CON UN’ANIMA',
      content: (
        <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium max-w-sm">
          {isEn
            ? 'We’re not just here to fill plates, we’re here to fire up taste buds and connect people to the real flavors of Campania, right here in Pompei. Every bite is a celebration of culture, crafted with love, tradition, and a little attitude.'
            : isRu
            ? 'Мы здесь не просто для того, чтобы наполнить тарелки — мы дарим яркие эмоции и знакомим с настоящими вкусами региона Кампания. Каждый кусочек — это праздник традиций, приготовленный с душой и любовью.'
            : 'Non siamo qui solo per riempire i piatti, siamo qui per accendere i palati e far vivere il vero sapore autentico della Campania a Pompei. Ogni morso è una festa per il palato, preparata con passione, tradizione e la giusta dose di grinta.'}
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
        ? 'BIG DREAMS, NO EGO'
        : isRu
        ? 'БОЛЬШИЕ МЕЧТЫ БЕЗ ЭГО'
        : isDe
        ? 'GROSSE TRÄUME, KEIN EGO'
        : isFr
        ? 'GRANDS RÊVES, SANS EGO'
        : 'GRANDI SOGNI, NESSUN EGO',
      content: (
        <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium max-w-sm">
          {isEn
            ? 'We’re building more than a street food spot, we’re building the go-to spot for good food, good vibes, and genuine community in Pompei. Whether it’s your lunch break, a late-night craving, or your Sunday family ritual, we’re here to make it count.'
            : isRu
            ? 'Мы создаем больше, чем просто стритфуд: мы строим место душевных встреч, отличного настроения и искреннего общения в Помпеях. Будь то быстрый обед, поздний перекус или семейный воскресный ужин — мы всегда рядом.'
            : 'Stiamo costruendo molto più di una tavola calda: un punto di ritrovo per il buon cibo, il buon umore e la vera comunità di Pompei. Che sia una pausa pranzo, uno sfizio notturno o il rito della domenica in famiglia, siamo qui per renderlo speciale.'}
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
        ? 'OUR SECRET SAUCE'
        : isRu
        ? 'НАШ СЕКРЕТНЫЙ РЕЦЕПТ'
        : isDe
        ? 'UNSER GEHEIMREZEPT'
        : isFr
        ? 'NOTRE RECETTE SECRÈTE'
        : 'IL NOSTRO SEGRETO',
      content: (
        <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium text-left space-y-1.5 max-w-sm">
          <p>
            <strong className="text-neutral-900 font-bold">
              {isEn ? 'Authenticity: ' : isRu ? 'Аутентичность: ' : 'Autenticità: '}
            </strong>
            {isEn
              ? 'Rooted in Neapolitan tradition, served with passion.'
              : isRu
              ? 'Верность неаполитанским корням и рецептам.'
              : 'Radicata nella tradizione partenopea, servita con passione.'}
          </p>
          <p>
            <strong className="text-neutral-900 font-bold">
              {isEn ? 'Innovation: ' : isRu ? 'Инновации: ' : 'Innovazione: '}
            </strong>
            {isEn
              ? 'We don’t follow food trends — we fry them.'
              : isRu
              ? 'Мы не следуем трендам — мы создаем их.'
              : 'Non seguiamo le mode: le trasformiamo in gusto croccante.'}
          </p>
          <p>
            <strong className="text-neutral-900 font-bold">
              {isEn ? 'Quality & Care: ' : isRu ? 'Качество: ' : 'Qualità e Cura: '}
            </strong>
            {isEn
              ? 'No shortcuts on fresh dough, mozzarella & local meats.'
              : isRu
              ? 'Никаких компромиссов: только фермерские продукты и свежее тесто.'
              : 'Nessuna scorciatoia su impasto a lenta lievitazione e fior di latte.'}
          </p>
          <p>
            <strong className="text-neutral-900 font-bold">
              {isEn ? 'Team Energy: ' : isRu ? 'Энергия команды: ' : 'Energia del Team: '}
            </strong>
            {isEn
              ? 'A dedicated crew that brings the heat every single day.'
              : isRu
              ? 'Команда профессионалов, влюбленная в свое дело.'
              : 'Una squadra affiatata che mette il cuore in ogni ordine.'}
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
                src="/about-us.png"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedIbb) {
                    target.dataset.triedIbb = 'true';
                    target.src = 'https://i.ibb.co/JWJ4Nwfq/About-us1.png';
                  } else if (!target.dataset.triedSecond) {
                    target.dataset.triedSecond = 'true';
                    target.src = 'https://i.ibb.co/GfSLX4K9/About-us1.png';
                  }
                }}
                alt="Panzarotto Street Food Pompei"
                className="w-full h-auto drop-shadow-[0_16px_36px_rgba(0,0,0,0.12)]"
                loading="eager"
              />
            </div>
          </div>

          {/* Right Column: Two Narrative Story Blocks */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 sm:space-y-12 pt-4 sm:pt-6 lg:pt-8">
            
            {/* Story Block 1: "IT ALL STARTED WITH A TRUCK / PASSION" (Single-line heading + compact paragraph) */}
            <div className="space-y-2 sm:space-y-3">
              <h2
                style={{
                  fontFamily: '"Bebas Neue", "Barlow Condensed", "Oswald", sans-serif',
                  letterSpacing: '0.02em',
                }}
                className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] text-[#FF5500] uppercase leading-none tracking-tight select-none font-bold whitespace-nowrap"
              >
                {isEn
                  ? 'IT ALL STARTED WITH A PASSION.'
                  : isRu
                  ? 'ВСЁ НАЧАЛОСЬ С МЕЧТЫ И СТРАСТИ.'
                  : isDe
                  ? 'ALLES BEGANN MIT EINER PASSION.'
                  : isFr
                  ? 'TOUT A COMMENCÉ AVEC UNE PASSION.'
                  : 'TUTTO È INIZIATO CON UNA PASSIONE.'}
              </h2>
              <p className="max-w-[420px] text-sm sm:text-[15px] lg:text-base text-neutral-800 leading-snug font-medium">
                {isEn
                  ? 'Back in the heart of Pompei, Panzarotto was born from a dream, a deep family heritage, and a fire to serve real-deal Neapolitan street food right beside the world-famous ruins. We rolled out with piping-hot panzerotti, fresh local ingredients, and authentic flavors that made people do double takes.'
                  : isRu
                  ? 'В самом сердце Помпей проект Panzarotto начался с мечты, семейных традиций и страсти готовить настоящий неаполитанский стритфуд прямо у древних раскопок. Мы начинали со свежайших горячих панцеротти, отборных местных продуктов и вкуса, который покоряет с первого кусочка.'
                  : 'Nel cuore pulsante di Pompei, Panzarotto nasce da un sogno, da un’antica tradizione di famiglia e dal fuoco sacro di servire il vero street food campano a due passi dagli scavi archeologici. Siamo partiti con panzerotti caldi fritti al momento, materie prime d’eccellenza e sapori veraci capaci di conquistare chiunque al primo morso.'}
              </p>
            </div>

            {/* Story Block 2: "LINES GOT LONGER, SO DID THE MENU" (Single-line heading + compact paragraph) */}
            <div className="space-y-2 sm:space-y-3">
              <h2
                style={{
                  fontFamily: '"Bebas Neue", "Barlow Condensed", "Oswald", sans-serif',
                  letterSpacing: '0.02em',
                }}
                className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] text-[#FF5500] uppercase leading-none tracking-tight select-none font-bold whitespace-nowrap"
              >
                {isEn
                  ? 'LINES GOT LONGER, SO DID THE MENU'
                  : isRu
                  ? 'ОЧЕРЕДИ РОСЛИ, И МЕНЮ РАСШИРЯЛОСЬ'
                  : isDe
                  ? 'DIE SCHLANGEN WURDEN LÄNGER, DIE KARTE GRÖSSER'
                  : isFr
                  ? 'LES FILES S’ALLONGEAIENT, LA CARTE AUSSI'
                  : 'LE FILE CRESCEVANO, E COSÌ IL NOSTRO MENÙ'}
              </h2>
              <p className="max-w-[420px] text-sm sm:text-[15px] lg:text-base text-neutral-800 leading-snug font-medium">
                {isEn
                  ? 'Turns out, golden street panzerotti were just the beginning. With every single order, we listened, experimented, and added more of what Pompei craved: generous maxi-sandwiches, golden crocchè with melting hearts, tender rotisserie meats, and sweet specialties. The menu grew because the people asked for it.'
                  : isRu
                  ? 'Оказалось, золотистые панцеротти были только началом. С каждым заказом мы слушали гостей, экспериментировали и добавляли то, чего так хотелось: сочные сытные панини, хрустящие крокке с тающей моцареллой, нежное мясо на гриле и сладкие десерты. Меню росло благодаря любви наших гостей.'
                  : 'I nostri panzerotti dorati erano solo il punto di partenza. Ordine dopo ordine, abbiamo ascoltato i nostri clienti, sperimentato e arricchito la proposta con maxi panini farciti, crocchè fumanti dal cuore filante, pollo allo spiedo succoso e dolci irresistibili. Il menù è cresciuto perché la nostra gente lo ha chiesto.'}
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* SECTION 3: "MORE FLAVOURS, MORE FAMILIA" with Layout matching Screenshot 2 */}
      <section className="py-12 sm:py-16 lg:py-24 max-w-[1000px] lg:max-w-[1060px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 items-start relative">
          
          {/* LEFT COLUMN: Polaroid 1 (Top, under right Polaroid) + Heading & Narrative Text (Bottom) */}
          <div className="flex flex-col items-center md:items-start z-10">
            
            {/* Polaroid 1: Top-Left Chef Tossing Chips (positioned under right Polaroid) */}
            <div className="relative w-[285px] sm:w-[345px] md:w-[385px] max-w-full transform -rotate-[1deg] md:translate-x-20 lg:translate-x-28 hover:rotate-0 hover:scale-[1.02] transition-all duration-300 z-10">
              <img
                src="/about-chips.png"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedIbb) {
                    target.dataset.triedIbb = 'true';
                    target.src = 'https://i.ibb.co/PvBjWRmq/23.png';
                  } else if (!target.dataset.triedSecond) {
                    target.dataset.triedSecond = 'true';
                    target.src = 'https://i.ibb.co/dwnMpSW8/23.png';
                  }
                }}
                alt="Panzarotto Chef Tossing Chips"
                className="w-full h-auto drop-shadow-[0_16px_36px_rgba(0,0,0,0.16)]"
                loading="lazy"
              />
            </div>

            {/* Narrative Story Block Underneath Polaroid 1 (positioned below the pictures) */}
            <div className="mt-8 sm:mt-10 md:mt-10 lg:mt-12 max-w-[440px] md:translate-x-16 lg:translate-x-24 xl:translate-x-28 space-y-3 sm:space-y-4">
              <h2
                style={{
                  fontFamily: '"Bebas Neue", "Barlow Condensed", "Oswald", sans-serif',
                  letterSpacing: '0.02em',
                }}
                className="text-2xl sm:text-3xl md:text-[38px] text-[#FF5500] uppercase leading-[0.95] tracking-tight select-none font-bold"
              >
                {isEn
                  ? 'MORE FLAVOURS, MORE FAMILIA'
                  : isRu
                  ? 'БОЛЬШЕ ВКУСА, БОЛЬШЕ СЕМЬИ'
                  : isDe
                  ? 'MEHR GESCHMACK, MEHR FAMILIE'
                  : isFr
                  ? 'PLUS DE SAVEURS, PLUS DE FAMILLE'
                  : 'PIÙ SAPORE, PIÙ FAMIGLIA'}
              </h2>
              <p className="text-sm sm:text-[15px] lg:text-base text-neutral-800 leading-snug font-medium">
                {isEn
                  ? 'From locals walking in every evening to travelers discovering the Roman ruins of Pompei, our culinary family continued to grow. Every kitchen we open and every panzarotto we fry carries the exact same love, craft, and crispy crunch from day one. Good food, genuine energy, and unforgettable street food moments.'
                  : isRu
                  ? 'От постоянных жителей Помпей до путешественников со всего мира, посещающих базилику и древний город, наша большая семья продолжает расти. Каждый замес теста и каждое обжаренное блюдо несут в себе ту же искреннюю заботу и тепло первого дня. Отличная еда, душевная атмосфера и незабываемые моменты.'
                  : 'Dai residenti affezionati che passano ogni sera ai viaggiatori che scoprono le meraviglie archeologiche di Pompei, la nostra famiglia gastronomica continua a espandersi. Ogni cucina che accendiamo e ogni panzarotto che friggiamo racchiude lo stesso amore, la stessa maestria e la medesima croccantezza del primo giorno: buon cibo, energia positiva e momenti indimenticabili.'}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Polaroid 2 (Top, overlapping on top of left Polaroid, tilted +7°) + Polaroid 3 */}
          <div className="flex flex-col items-center md:items-start relative mt-8 md:mt-4 z-20">
            
            {/* Polaroid 2: Top-Right Kitchen Team / Rotisserie (overlapping on top of left Polaroid) */}
            <div className="relative w-[300px] sm:w-[370px] md:w-[415px] max-w-full transform rotate-[7deg] hover:rotate-0 hover:scale-[1.02] transition-all duration-300 md:-ml-16 lg:-ml-24 z-20">
              <img
                src="/about-polaroid2.png"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedIbb) {
                    target.dataset.triedIbb = 'true';
                    target.src = 'https://i.ibb.co/SDjvB1D7/25.png';
                  } else if (!target.dataset.triedSecond) {
                    target.dataset.triedSecond = 'true';
                    target.src = 'https://i.ibb.co/mrjz4YrF/25.png';
                  }
                }}
                alt="Panzarotto Team"
                className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.20)]"
                loading="lazy"
              />
            </div>

            {/* Polaroid 3: Bottom-Right Food / Panino (reduced by 25%, tilted counter-clockwise ~ -5°, shifted 20px right) */}
            <div className="relative w-[160px] sm:w-[190px] md:w-[210px] max-w-full transform -rotate-[5deg] translate-x-[20px] hover:rotate-0 hover:scale-[1.02] transition-all duration-300 z-30 -mt-8 sm:-mt-12 md:-mt-16 ml-10 sm:ml-16 md:ml-20">
              <img
                src="/about-polaroid3.png"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedIbb) {
                    target.dataset.triedIbb = 'true';
                    target.src = 'https://i.ibb.co/VY7rspFJ/image3.png';
                  }
                }}
                alt="Panzarotto Specialità"
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

