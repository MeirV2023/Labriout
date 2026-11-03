import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { STORE_DETAILS } from '../data/menuData';

export const ContactPage: React.FC = () => {
  const { setCurrentView, language } = useCart();

  const isEn = language === 'en';
  const isRu = language === 'ru';

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [termsError, setTermsError] = useState(false);

  // FAQ Accordion state (first item open by default)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setTermsError(true);
      return;
    }
    setTermsError(false);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setReason('');
      setMessage('');
      setAgreedToTerms(false);
    }, 600);
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'LABRIOUT 64 av. Simone Veil Bonneuil-sur-Marne'
  )}`;

  // FAQ Data with Multilingual Support
  const faqList = [
    {
      q: isEn
        ? 'Can I order online?'
        : isRu
        ? 'Можно ли сделать заказ онлайн?'
        : 'Puis-je commander en ligne ?',
      a: isEn
        ? 'Yes, absolutely! You can browse our entire kosher menu right here on the website, customize your Smash Burgers, Pitas, Laffas and Assiettes, and choose between store pickup or home delivery.'
        : isRu
        ? 'Да, конечно! Вы можете выбрать любые кошерные бургеры, шаурму в лаффе, питы и сытные тарелки на сайте и оформить доставку на дом или самовывоз.'
        : 'Oui, absolument ! Vous pouvez consulter toute notre carte casher sur le site, personnaliser vos Smash Burgers, Pitas, Laffas et Assiettes, et choisir entre le retrait sur place ou la livraison à domicile.',
    },
    {
      q: isEn
        ? 'Do you offer delivery?'
        : isRu
        ? 'Есть ли у вас доставка?'
        : 'Proposez-vous la livraison à domicile ?',
      a: isEn
        ? 'Yes! We deliver hot, freshly grilled orders across Bonneuil-sur-Marne, Créteil, Saint-Maur-des-Fossés, Maisons-Alfort and surrounding areas in 94. Delivery is free for orders over €30!'
        : isRu
        ? 'Да! Мы доставляем горячие блюда с огня по Бонёй-сюр-Марн, Кретею, Сен-Мор-де-Фоссе и соседним городам департамента 94. Бесплатная доставка от 30€!'
        : 'Oui ! Nous livrons vos commandes bien chaudes à Bonneuil-sur-Marne, Créteil, Saint-Maur-des-Fossés, Maisons-Alfort et dans les villes voisines du 94. Livraison offerte dès 30€ de commande !',
    },
    {
      q: isEn
        ? 'What is your Kosher certification?'
        : isRu
        ? 'Какой у вас сертификат кашрута?'
        : 'Quelle est votre certification Casher ?',
      a: isEn
        ? 'LABRIOUT is 100% Kosher meat (Bassar) under the strict rabbinical supervision of Badatz de Brunoy, with daily fresh meat and house-prepared recipes.'
        : isRu
        ? 'Ресторан LABRIOUT на 100% кошерный мясной (Басар) под строгим раввинским контролем Бадац де Брюнуа (Badatz de Brunoy).'
        : 'LABRIOUT est un restaurant 100% Casher Bassar sous la stricte surveillance rabbinique du Badatz de Brunoy, avec des viandes fraîches sélectionnées et une cuisine faite maison.',
    },
    {
      q: isEn
        ? 'What are your house specialties?'
        : isRu
        ? 'Какие ваши фирменные блюда?'
        : 'Quelles sont vos spécialités maison ?',
      a: isEn
        ? 'Our guests love our juicy Smash Burgers (with Parve melted cheddar or pressed veal), warm Laffa & Pita Shawarma, flame-grilled Parguit, sesame Schnitzel, and creamy homemade Houmous Bassar.'
        : isRu
        ? 'Гости особенно любят наши сочные Смэш-бургеры (с чеддером Парве и прессованной телятиной), шаурму в теплой лаффе и пите, паргит на углях, хрустящий шницель в кунжуте и домашний Хумус Басар.'
        : 'Nos clients adorent nos Smash Burgers juteux (avec cheddar fondant Parvé ou veau pressé), nos Laffas & Pitas Shawarma, notre Parguit mariné grillé, le Schnitzel au sésame et notre Houmous Bassar maison.',
    },
    {
      q: isEn
        ? 'Do you have vegetarian options?'
        : isRu
        ? 'Есть ли вегетарианские блюда?'
        : 'Avez-vous des options végétariennes ?',
      a: isEn
        ? 'Yes! Try our crispy herb Falafel in Pita, Laffa or Platter, our Israeli Sabich with fried eggplant and hard-boiled egg, classic Hummus, and fresh salads.'
        : isRu
        ? 'Да! Попробуйте наш хрустящий фалафель с зеленью в пите, лаффе или на тарелке, традиционный израильский Сабих с баклажанами и яйцом, классический хумус и свежие салаты.'
        : 'Oui ! Découvrez nos Falafels croustillants aux herbes fraîches (en pita, laffa ou assiette), notre Sabich israélien aux aubergines fondantes, notre Houmous classique et nos salades fraîcheur.',
    },
    {
      q: isEn
        ? 'Can I order for groups, family events or Simchas?'
        : isRu
        ? 'Можно ли заказать на большую компанию или Симху?'
        : 'Puis-je commander pour un groupe ou un événement (Simcha) ?',
      a: isEn
        ? 'Yes! We gladly prepare large platters, burger & shawarma assortments, and mezzes for birthdays, family gatherings, and office lunches. Contact us via WhatsApp or the form!'
        : isRu
        ? 'Конечно! Мы с радостью готовим большие сеты бургеров, пит, шаурмы и мезе для семейных праздников, дней рождения и корпоративов. Напишите нам в WhatsApp или через форму!'
        : 'Avec plaisir ! Nous préparons des plateaux conviviaux pour vos repas de famille, anniversaires et déjeuners d’entreprise. Contactez-nous sur WhatsApp ou via le formulaire !',
    },
    {
      q: isEn
        ? 'Where are you located and what are your opening hours?'
        : isRu
        ? 'Где вы находитесь и часы работы?'
        : 'Où êtes-vous situés et quels sont vos horaires ?',
      a: isEn
        ? 'We are located at 64 av. Simone Veil, Bonneuil-sur-Marne. Opening hours: 12h-15h & 18h-22h15. 100% Casher • Badatz de Brunoy.'
        : isRu
        ? 'Мы находимся по адресу 64 av. Simone Veil, Bonneuil-sur-Marne. Часы работы: 12h-15h и 18h-22h15. 100% Casher • Badatz de Brunoy.'
        : 'Nous sommes situés au 64 av. Simone Veil, Bonneuil-sur-Marne. Horaires : 12h-15h et 18h-22h15. 100% Casher • Badatz de Brunoy.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6ED] text-[#1f2937]">
      {/* Hero Contact Section */}
      <section className="bg-[#FAF6ED] min-h-[calc(100vh-80px)] min-h-[calc(100dvh-80px)] flex flex-col justify-center py-8 sm:py-12 lg:py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* Left Column: Heading, Subhead & Intro */}
            <div className="lg:col-span-5 space-y-3 sm:space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#ff5500] block">
                  LABRIOUT • 🥩 STREET FOOD &amp; SPÉCIALITÉS MAISON • ✡️ 100% CASHER • BADATZ DE BRUNOY
                </span>

                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black font-heading text-[#ff5500] tracking-tight uppercase leading-[0.96]">
                  {isEn
                    ? 'STILL CURIOUS?'
                    : isRu
                    ? 'ОСТАЛИСЬ ВОПРОСЫ?'
                    : 'CONTACTEZ LABRIOUT'}
                </h1>
              </div>

              <p className="text-neutral-900 font-medium text-xs sm:text-sm lg:text-[14px] leading-relaxed max-w-md">
                🥩 Street food &amp; spécialités maison • ✡️ 100% Casher • Badatz de Brunoy • 📍 64 av. Simone Veil, Bonneuil-sur-Marne • 📞 0769774086 • ⏰ 12h-15h 18h-22h15
              </p>

              {/* Typographic Contact Info (Styled like Screen 2) */}
              <div className="pt-1 sm:pt-2 space-y-3 sm:space-y-3.5 max-w-lg">
                
                {/* SOCIALS - Placeholders */}
                <div className="grid grid-cols-[85px_1fr] sm:grid-cols-[105px_1fr] gap-3 items-start">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#ff5500] pt-0.5">
                    {isEn ? 'SOCIALS' : isRu ? 'СОЦСЕТИ' : 'SOCIALS'}
                  </span>
                  <div className="space-y-0.5 font-black text-neutral-900 text-xs sm:text-sm uppercase tracking-wider">
                    <div>
                      <a
                        href="#tiktok"
                        onClick={(e) => e.preventDefault()}
                        className="hover:text-[#ff5500] transition-colors inline-block cursor-pointer"
                        title="Coming soon"
                      >
                        TIKTOK
                      </a>
                    </div>
                    <div>
                      <a
                        href="#facebook"
                        onClick={(e) => e.preventDefault()}
                        className="hover:text-[#ff5500] transition-colors inline-block cursor-pointer"
                        title="Coming soon"
                      >
                        FACEBOOK
                      </a>
                    </div>
                    <div>
                      <a
                        href="#instagram"
                        onClick={(e) => e.preventDefault()}
                        className="hover:text-[#ff5500] transition-colors inline-block cursor-pointer"
                        title="Coming soon"
                      >
                        INSTAGRAM
                      </a>
                    </div>
                  </div>
                </div>

                {/* CONTACT */}
                <div className="grid grid-cols-[85px_1fr] sm:grid-cols-[105px_1fr] gap-3 items-start">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#ff5500] pt-0.5">
                    {isEn ? 'CONTACT' : isRu ? 'КОНТАКТЫ' : 'CONTACT'}
                  </span>
                  <div className="space-y-0.5 font-black text-neutral-900 text-xs sm:text-sm uppercase tracking-wider">
                    <div>
                      <a
                        href={`tel:${STORE_DETAILS.phone}`}
                        className="hover:text-[#ff5500] transition-colors inline-block"
                      >
                        {STORE_DETAILS.phone}
                      </a>
                    </div>
                    <div>
                      <a
                        href={`https://wa.me/${STORE_DETAILS.whatsappClean}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#ff5500] transition-colors inline-block"
                      >
                        {STORE_DETAILS.whatsapp} (WHATSAPP)
                      </a>
                    </div>
                    <div>
                      <a
                        href="mailto:labriout@eat-view.local"
                        className="hover:text-[#ff5500] transition-colors inline-block lowercase"
                      >
                        labriout@eat-view.local.
                      </a>
                    </div>
                  </div>
                </div>

                {/* ADRES / ADDRESS */}
                <div className="grid grid-cols-[85px_1fr] sm:grid-cols-[105px_1fr] gap-3 items-start">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#ff5500] pt-0.5">
                    {isEn ? 'ADDRESS' : isRu ? 'АДРЕС' : 'ADRESSE'}
                  </span>
                  <div className="font-black text-neutral-900 text-xs sm:text-sm tracking-wider leading-snug">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#ff5500] transition-colors block"
                    >
                      📍 64 av. Simone Veil, Bonneuil-sur-Marne
                      <br />
                      ⏰ 12h-15h 18h-22h15
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Clean White Form */}
            <div className="lg:col-span-7 relative">
              {/* Form Card Container */}
              <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 lg:p-7 shadow-xl border border-[#000000] relative z-10">
                {isSubmitted ? (
                  <div className="py-6 text-center space-y-3 animate-fadeIn">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-neutral-900 font-heading uppercase">
                        {isEn ? 'Thank You!' : isRu ? 'Спасибо за сообщение!' : 'Messaggio Ricevuto!'}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
                        {isEn
                          ? 'We received your inquiry and will get back to you as fast as a hot panzerotto!'
                          : isRu
                          ? 'Мы получили ваше сообщение и ответим вам в самое ближайшее время!'
                          : 'Abbiamo ricevuto la tua richiesta e ti risponderemo telefonicamente o via email a breve.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ff5500] hover:bg-[#e04a00] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-md shadow-[#ff5500]/25"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Send Another Message' : isRu ? 'Отправить еще' : 'Invia un altro messaggio'}</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* First & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                      <div>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder={isEn ? 'First Name*' : isRu ? 'Имя*' : 'Nome*'}
                          className="w-full h-[52px] sm:h-[56px] bg-white border border-[#d2d6dc] focus:border-[#ff5500] focus:ring-2 focus:ring-[#ff5500]/20 rounded-xl px-4 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition flex items-center"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder={isEn ? 'Last Name*' : isRu ? 'Фамилия*' : 'Cognome*'}
                          className="w-full h-[52px] sm:h-[56px] bg-white border border-[#d2d6dc] focus:border-[#ff5500] focus:ring-2 focus:ring-[#ff5500]/20 rounded-xl px-4 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition flex items-center"
                        />
                      </div>
                    </div>

                    {/* Email & Phone Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                      <div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={isEn ? 'Email*' : isRu ? 'Email*' : 'Email*'}
                          className="w-full h-[52px] sm:h-[56px] bg-white border border-[#d2d6dc] focus:border-[#ff5500] focus:ring-2 focus:ring-[#ff5500]/20 rounded-xl px-4 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition flex items-center"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={isEn ? 'Phone Number' : isRu ? 'Телефон' : 'Telefono'}
                          className="w-full h-[52px] sm:h-[56px] bg-white border border-[#d2d6dc] focus:border-[#ff5500] focus:ring-2 focus:ring-[#ff5500]/20 rounded-xl px-4 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition flex items-center"
                        />
                      </div>
                    </div>

                    {/* Contact Reason */}
                    <div>
                      <select
                        required
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full h-[52px] sm:h-[56px] bg-white border border-[#d2d6dc] focus:border-[#ff5500] focus:ring-2 focus:ring-[#ff5500]/20 rounded-xl px-4 text-xs sm:text-sm text-neutral-800 focus:outline-none transition cursor-pointer appearance-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center',
                          backgroundSize: '1.1em',
                        }}
                      >
                        <option value="" disabled>
                          {isEn
                            ? 'Contact Reason*'
                            : isRu
                            ? 'Причина обращения*'
                            : 'Motivo del contatto*'}
                        </option>
                        <option value="takeaway_delivery">
                          {isEn ? 'Order / Delivery Question' : isRu ? 'Вопрос по заказу / доставке' : 'Informazioni Ordine / Consegna'}
                        </option>
                        <option value="table_reservation">
                          {isEn ? 'Food Reservation / Takeaway' : isRu ? 'Предзаказ на вынос' : 'Prenotazione Asporto'}
                        </option>
                        <option value="party_catering">
                          {isEn ? 'Party, Event & Catering Order' : isRu ? 'Кейтеринг, праздники и мероприятия' : 'Feste, Eventi e Catering'}
                        </option>
                        <option value="allergens">
                          {isEn ? 'Allergens & Dietary Information' : isRu ? 'Аллергены и состав' : 'Info Allergeni & Ingredienti'}
                        </option>
                        <option value="feedback">
                          {isEn ? 'Feedback / Other Inquiry' : isRu ? 'Отзыв / Другой вопрос' : 'Feedback / Altra richiesta'}
                        </option>
                      </select>
                    </div>

                    {/* Message Box */}
                    <div>
                      <textarea
                        rows={3}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                          isEn
                            ? 'How can we help you?'
                            : isRu
                            ? 'Чем мы можем вам помочь?'
                            : 'Come possiamo aiutarti?'
                        }
                        className="w-full bg-white border border-[#d2d6dc] focus:border-[#ff5500] focus:ring-2 focus:ring-[#ff5500]/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition resize-none"
                      />
                    </div>

                    {/* Terms Checkbox */}
                    <div className="space-y-0.5 pt-0.5">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => {
                            setAgreedToTerms(e.target.checked);
                            if (e.target.checked) setTermsError(false);
                          }}
                          className="mt-0.5 w-3.5 h-3.5 rounded border-[#d2d6dc] text-[#ff5500] focus:ring-[#ff5500] cursor-pointer accent-[#ff5500]"
                        />
                        <span className="text-[11px] sm:text-xs text-neutral-600 leading-snug">
                          {isEn
                            ? 'By submitting this form, you agree to our Terms & Conditions and understand that your information may be used in accordance with our privacy practices.'
                            : isRu
                            ? 'Отправляя эту форму, вы соглашаетесь с Условиями использования и подтверждаете согласие на обработку контактных данных.'
                            : 'Inviando questo modulo, accetti i Termini & Condizioni e comprendi che le informazioni fornite saranno trattate nel rispetto della privacy.'}
                        </span>
                      </label>
                      {termsError && (
                        <p className="text-[11px] text-[#ff5500] font-bold pl-6">
                          {isEn
                            ? 'Please agree to the terms before submitting.'
                            : isRu
                            ? 'Пожалуйста, подтвердите согласие.'
                            : 'Per favore conferma il consenso prima di inviare.'}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#ff5500] hover:bg-[#e04a00] active:bg-[#cc4200] text-white font-extrabold uppercase tracking-wider text-xs sm:text-sm shadow-md shadow-[#ff5500]/25 hover:shadow-lg transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>
                              {isEn
                                ? 'Submitting...'
                                : isRu
                                ? 'Отправка...'
                                : 'Invio...'}
                            </span>
                          </>
                        ) : (
                          <span>
                            {isEn ? 'SUBMIT' : isRu ? 'ОТПРАВИТЬ' : 'INVIA'}
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section (Screen 3 Cream / Light Beige Style) */}
      <section className="bg-[#FAF6ED] pt-12 sm:pt-16 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#ff5500] block mb-1">
              {isEn ? 'FAQ´S' : isRu ? 'ЧАСТЫЕ ВОПРОСЫ' : 'FAQ´S'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading text-[#ff5500] uppercase tracking-tight">
              {isEn
                ? 'YOU ASK, WE ANSWER'
                : isRu
                ? 'ВЫ СПРАШИВАЕТЕ, МЫ ОТВЕЧАЕМ'
                : 'VOI CHIEDETE, NOI RISPONDIAMO'}
            </h2>
          </div>

          {/* Accordion List with Horizontal Hairline Dividers */}
          <div className="border-t border-neutral-300">
            {faqList.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border-b border-neutral-300 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full py-5 sm:py-6 flex items-center justify-between text-left gap-4 group cursor-pointer focus:outline-none"
                  >
                    <span className="text-lg sm:text-xl md:text-2xl font-black font-heading text-neutral-900 group-hover:text-[#ff5500] transition-colors">
                      {item.q}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#ff5500]' : 'text-neutral-700'
                      }`}
                    >
                      <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  </button>

                  {/* Accordion Content */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0 pb-0'
                    }`}
                  >
                    <p className="text-sm sm:text-base text-neutral-700 font-medium leading-relaxed max-w-3xl pr-4">
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Opening Hours Card (Styled like Screen 2) */}
      <section className="bg-[#FAF6ED] pt-2 sm:pt-4 pb-14 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 md:p-12 shadow-sm border border-black/10 space-y-6 sm:space-y-8">
            
            {/* Orange Uppercase Subhead */}
            <span className="text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-widest text-[#ff5500] block">
              {isEn ? 'OPENING HOURS' : isRu ? 'ЧАСЫ РАБОТЫ' : 'ORARI DI APERTURA'}
            </span>

            {/* Schedule Rows with Orange Dashed Lines */}
            <div className="space-y-4 sm:space-y-6">
              
              {/* Midi */}
              <div className="flex items-end justify-between gap-2">
                <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-neutral-800 shrink-0">
                  {isEn ? 'LUNCH SERVICE (MIDI)' : isRu ? 'ДНЕВНОЙ СЕРВИС (ОБЕД)' : 'SERVICE MIDI'}
                </span>
                <div className="flex-1 border-b-2 border-dashed border-[#ff5500]/50 mx-2 sm:mx-4 mb-1 min-w-[30px]" />
                <span className="text-xs sm:text-sm md:text-base font-black text-neutral-900 shrink-0">
                  12h - 15h
                </span>
              </div>

              {/* Soir */}
              <div className="flex items-end justify-between gap-2">
                <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-neutral-800 shrink-0">
                  {isEn ? 'EVENING SERVICE (SOIR)' : isRu ? 'ВЕЧЕРНИЙ СЕРВИС (УЖИН)' : 'SERVICE SOIR'}
                </span>
                <div className="flex-1 border-b-2 border-dashed border-[#ff5500]/50 mx-2 sm:mx-4 mb-1 min-w-[30px]" />
                <span className="text-xs sm:text-sm md:text-base font-black text-neutral-900 shrink-0">
                  18h - 22h15
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
