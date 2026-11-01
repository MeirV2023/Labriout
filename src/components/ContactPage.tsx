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
    'Panzarotto Via Provinciale Ripuaria 133 Pompei'
  )}`;

  // FAQ Data with Multilingual Support
  const faqList = [
    {
      q: isEn
        ? 'Can I order online?'
        : isRu
        ? 'Можно ли сделать заказ онлайн?'
        : 'Posso ordinare online?',
      a: isEn
        ? 'Yes, absolutely! You can browse our entire menu right here on the website, customize your panzerotti and sfizi, and choose between direct takeaway pickup or home delivery.'
        : isRu
        ? 'Да, конечно! Вы можете выбрать любые панцеротти и закуски на нашем сайте и оформить доставку на дом или самовывоз.'
        : 'Assolutamente sì! Puoi consultare l’intero menù direttamente sul sito, personalizzare i tuoi panzerotti e scegliere comodamente tra asporto in negozio o consegna rapida a domicilio.',
    },
    {
      q: isEn
        ? 'Do you offer delivery?'
        : isRu
        ? 'Есть ли у вас доставка?'
        : 'Effettuate consegne a domicilio?',
      a: isEn
        ? 'Yes! We deliver hot, freshly fried panzerotti across Pompei, Scafati, Torre Annunziata, Castellammare, and surrounding areas. Delivery is free for orders over €20!'
        : isRu
        ? 'Да! Мы доставляем горячие и хрустящие панцеротти по Помпеям, Скафати, Торре-Аннунциата, Кастелламмаре и окрестностям. Бесплатная доставка от 20€!'
        : 'Certamente! Consegniamo caldi e fragranti a Pompei, Scafati, Torre Annunziata, Castellammare e comuni limitrofi. La consegna è gratuita per ordini superiori a 20€.',
    },
    {
      q: isEn
        ? 'Are your ingredients fresh?'
        : isRu
        ? 'Свежие ли у вас ингредиенты?'
        : 'I vostri ingredienti sono freschi?',
      a: isEn
        ? '100% fresh every single day! We naturally leaven our dough for over 24 hours, and use only authentic Campania fior di latte mozzarella, San Marzano tomatoes, and prime Italian cured meats.'
        : isRu
        ? 'На 100% свежие каждый день! Тесто созревает более 24 часов, используем отборную моцареллу Кампании, томаты Сан-Марцано и свежайшие итальянские начинки.'
        : 'Al 100% freschi ogni giorno! Il nostro impasto a lunga lievitazione naturale di 24 ore è preparato quotidianamente con fior di latte campano, pomodoro San Marzano e salumi di prima scelta.',
    },
    {
      q: isEn
        ? 'What is a Panzerotto exactly?'
        : isRu
        ? 'Что такое панцеротто?'
        : 'Cos’è esattamente un Panzerotto?',
      a: isEn
        ? 'A panzerotto is a beloved traditional Italian crescent-shaped pocket of dough, stuffed with gourmet savory fillings and fried to golden, bubbling perfection (or oven-baked upon request).'
        : isRu
        ? 'Панцеротто — это знаменитый итальянский полумесяц из нежного теста с богатой начинкой из сыра и соусов, обжаренный до золотистой хрустящей корочки.'
        : 'Il panzerotto è una specialità street food a mezzaluna, farcita generosamente con ingredienti genuini e fritta al momento fino a raggiungere una doratura croccante e un cuore filante irresistibile.',
    },
    {
      q: isEn
        ? 'Do you have vegetarian or vegan options?'
        : isRu
        ? 'Есть ли вегетарианские варианты?'
        : 'Avete opzioni vegetariane o vegane?',
      a: isEn
        ? 'Yes, we have delicious vegetarian favorites like the 4 Formaggi, Ricotta & Spinach, and our Vegetariano packed with grilled zucchini, aubergines, and mozzarella.'
        : isRu
        ? 'Да, у нас есть вкуснейшие вегетарианские позиции: 4 сыра, Рикотта со шпинатом, а также Овощной панцеротто с цукини и баклажанами.'
        : 'Certamente! Abbiamo opzioni vegetariane sfiziose come il 4 Formaggi, Ricotta & Spinaci, e il Vegetariano ricco di verdure grigliate e mozzarella campana.',
    },
    {
      q: isEn
        ? 'Can I bring a big group or order for parties?'
        : isRu
        ? 'Можно ли заказать на большую компанию или праздник?'
        : 'Posso ordinare per feste o grandi comitive?',
      a: isEn
        ? 'Yes! We love catering birthdays, private parties, and office events. We offer assorted party boxes and mini-panzerotti. Reach out in advance via form or WhatsApp to coordinate your order!'
        : isRu
        ? 'Конечно! Мы с радостью готовим боксы с мини-панцеротти и комбо для дней рождения, вечеринок и мероприятий. Напишите нам в WhatsApp или через форму.'
        : 'Certamente! Prepariamo box speciali con mini-panzerotti e fritture miste per feste di compleanno, eventi e cene con amici. Contattaci in anticipo su WhatsApp o tramite il modulo!',
    },
    {
      q: isEn
        ? 'Where are you located and what are your opening hours?'
        : isRu
        ? 'Где вы находитесь и часы работы?'
        : 'Dove vi trovate e quali sono gli orari di apertura?',
      a: isEn
        ? 'We are located at Via Provinciale Ripuaria, 133 in Pompei. We are open Monday to Saturday from 19:30 to 23:00, and Sunday lunchtime from 10:00 to 14:30.'
        : isRu
        ? 'Мы находимся по адресу Via Provinciale Ripuaria, 133, Помпеи. Работаем с Пн по Сб с 19:30 до 23:00, в Воскресенье с 10:00 до 14:30.'
        : 'Ci troviamo a Pompei in Via Provinciale Ripuaria, 133. Siamo aperti dal Lunedì al Sabato dalle 19:30 alle 23:00, e la Domenica a pranzo dalle 10:00 alle 14:30.',
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
                  {isEn
                    ? 'CONTACT PANZAROTTO'
                    : isRu
                    ? 'СВЯЗЬ С PANZAROTTO'
                    : 'CONTATTA PANZAROTTO'}
                </span>

                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black font-heading text-[#ff5500] tracking-tight uppercase leading-[0.96]">
                  {isEn
                    ? 'STILL CURIOUS?'
                    : isRu
                    ? 'ОСТАЛИСЬ ВОПРОСЫ?'
                    : 'ANCORA DUBBI?'}
                </h1>
              </div>

              <p className="text-neutral-900 font-medium text-xs sm:text-sm lg:text-[14px] leading-relaxed max-w-md">
                {isEn
                  ? "We hope you found everything you needed about Panzarotto. But if you've got more questions (or just wanna talk panzerotti), hit us up."
                  : isRu
                  ? 'Надеемся, вы нашли все, что искали в Panzarotto! Но если у вас остались вопросы или вы хотите заказать для компании — свяжитесь с нами.'
                  : 'Speriamo tu abbia trovato tutto ciò che cercavi su Panzarotto. Ma se hai altre domande (o vuoi solo parlare di panzerotti caldi), scrivici subito!'}
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
                        href={`mailto:${STORE_DETAILS.email}`}
                        className="hover:text-[#ff5500] transition-colors inline-block"
                      >
                        {STORE_DETAILS.email.toUpperCase()}
                      </a>
                    </div>
                  </div>
                </div>

                {/* ADRES / ADDRESS */}
                <div className="grid grid-cols-[85px_1fr] sm:grid-cols-[105px_1fr] gap-3 items-start">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#ff5500] pt-0.5">
                    {isEn ? 'ADDRESS' : isRu ? 'АДРЕС' : 'ADRES'}
                  </span>
                  <div className="font-black text-neutral-900 text-xs sm:text-sm uppercase tracking-wider leading-snug">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#ff5500] transition-colors block"
                    >
                      VIA PROVINCIALE RIPUARIA, 133
                      <br />
                      80045 POMPEI (NA)
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
              
              {/* Monday - Saturday */}
              <div className="flex items-end justify-between gap-2">
                <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-neutral-800 shrink-0">
                  {isEn ? 'MONDAY - SATURDAY' : isRu ? 'ПОНЕДЕЛЬНИК - СУББОТА' : 'LUNEDÌ - SABATO'}
                </span>
                <div className="flex-1 border-b-2 border-dashed border-[#ff5500]/50 mx-2 sm:mx-4 mb-1 min-w-[30px]" />
                <span className="text-xs sm:text-sm md:text-base font-black text-neutral-900 shrink-0">
                  19:30 - 23:00
                </span>
              </div>

              {/* Sunday */}
              <div className="flex items-end justify-between gap-2">
                <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-neutral-800 shrink-0">
                  {isEn ? 'SUNDAY' : isRu ? 'ВОСКРЕСЕНЬЕ' : 'DOMENICA'}
                </span>
                <div className="flex-1 border-b-2 border-dashed border-[#ff5500]/50 mx-2 sm:mx-4 mb-1 min-w-[30px]" />
                <span className="text-xs sm:text-sm md:text-base font-black text-neutral-900 shrink-0">
                  10:00 - 14:30
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
