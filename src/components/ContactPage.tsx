import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { STORE_DETAILS } from '../data/menuData';
import { getLabrioutTagline } from '../data/labrioutMenuData';

export const ContactPage: React.FC = () => {
  const { language, currency } = useCart();
  const freeThresholdFrItRu = currency === 'USD' ? '$30' : '30€';
  const freeThresholdEn = currency === 'USD' ? '$30' : '€30';
  const freeThresholdDe = currency === 'USD' ? '$30' : '30 €';

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

  // FAQ Data & UI Texts across all 5 languages (fr, en, de, it, ru)
  const ui = {
    fr: {
      heading: 'CONTACTEZ LABRIOUT',
      socialsLabel: 'RÉSEAUX',
      comingSoon: 'Bientôt disponible',
      contactLabel: 'CONTACT',
      addressLabel: 'ADRESSE',
      thanksTitle: 'Message reçu !',
      thanksSub:
        'Nous avons bien reçu votre demande et vous répondrons très rapidement par téléphone ou par e-mail.',
      sendAnother: 'Envoyer un autre message',
      firstNamePlaceholder: 'Prénom*',
      lastNamePlaceholder: 'Nom*',
      emailPlaceholder: 'E-mail*',
      phonePlaceholder: 'Téléphone',
      reasonPlaceholder: 'Motif du contact*',
      reasonOrder: 'Question commande / livraison',
      reasonTakeaway: 'Précommande à emporter',
      reasonCatering: 'Événements, réceptions & traiteur (Simcha)',
      reasonAllergens: 'Allergènes & cacherout',
      reasonFeedback: 'Avis / Autre demande',
      messagePlaceholder: 'Comment pouvons-nous vous aider ?',
      termsText:
        "En envoyant ce formulaire, vous acceptez nos Conditions générales et consentez au traitement de vos coordonnées conformément à notre politique de confidentialité.",
      termsErr: 'Veuillez accepter les conditions avant de valider.',
      submitting: 'Envoi...',
      submitBtn: 'ENVOYER',
      faqEyebrow: 'FAQ',
      faqHeading: 'VOS QUESTIONS, NOS RÉPONSES',
      hoursEyebrow: "HORAIRES D'OUVERTURE",
      lunchLabel: 'SERVICE MIDI (LUN–VEN)',
      dinnerLabel: 'SERVICE SOIR (DIM–JEU)',
      faqs: [
        {
          q: 'Puis-je commander en ligne ?',
          a: 'Oui, absolument ! Vous pouvez consulter toute notre carte casher sur le site, personnaliser vos Smash Burgers, Pitas, Laffas et Assiettes, et choisir entre le retrait sur place ou la livraison à domicile.',
        },
        {
          q: 'Proposez-vous la livraison à domicile ?',
          a: `Oui ! Nous livrons vos commandes bien chaudes à Bonneuil-sur-Marne, Créteil, Saint-Maur-des-Fossés, Maisons-Alfort et dans les villes voisines du 94. Livraison offerte dès ${freeThresholdFrItRu} de commande !`,
        },
        {
          q: 'Quelle est votre certification Casher ?',
          a: 'LABRIOUT est un restaurant 100% Casher Bassar sous la stricte surveillance rabbinique du Badatz de Brunoy, avec des viandes fraîches sélectionnées et une cuisine faite maison.',
        },
        {
          q: 'Quelles sont vos spécialités maison ?',
          a: 'Nos clients adorent nos Smash Burgers juteux (avec cheddar fondant Parvé ou veau pressé), nos Laffas & Pitas Shawarma, notre Parguit mariné grillé, le Schnitzel au sésame et notre Houmous Bassar maison.',
        },
        {
          q: 'Avez-vous des options végétariennes ?',
          a: 'Oui ! Découvrez nos Falafels croustillants aux herbes fraîches (en pita, laffa ou assiette), notre Sabich israélien aux aubergines fondantes, notre Houmous classique et nos salades fraîcheur.',
        },
        {
          q: 'Puis-je commander pour un groupe ou un événement (Simcha) ?',
          a: "Avec plaisir ! Nous préparons des plateaux conviviaux pour vos repas de famille, anniversaires et déjeuners d'entreprise. Contactez-nous sur WhatsApp ou via le formulaire !",
        },
        {
          q: 'Où êtes-vous situés et quels sont vos horaires ?',
          a: 'Nous sommes situés au 64 av. Simone Veil, Bonneuil-sur-Marne. Horaires : 12h-15h et 18h-22h15 (vendredi midi uniquement, fermé chabbat, ouvert dimanche soir).',
        },
      ],
    },
    en: {
      heading: 'STILL CURIOUS?',
      socialsLabel: 'SOCIALS',
      comingSoon: 'Coming soon',
      contactLabel: 'CONTACT',
      addressLabel: 'ADDRESS',
      thanksTitle: 'Thank You!',
      thanksSub:
        'We received your message and our team will get back to you very shortly by phone or email!',
      sendAnother: 'Send Another Message',
      firstNamePlaceholder: 'First Name*',
      lastNamePlaceholder: 'Last Name*',
      emailPlaceholder: 'Email*',
      phonePlaceholder: 'Phone Number',
      reasonPlaceholder: 'Contact Reason*',
      reasonOrder: 'Order / Delivery Question',
      reasonTakeaway: 'Takeaway Pre-order',
      reasonCatering: 'Party, Event & Catering Order',
      reasonAllergens: 'Allergens & Kashrut Info',
      reasonFeedback: 'Feedback / Other Inquiry',
      messagePlaceholder: 'How can we help you?',
      termsText:
        'By submitting this form, you agree to our Terms & Conditions and understand that your information will be used in accordance with our privacy policy.',
      termsErr: 'Please agree to the terms before submitting.',
      submitting: 'Submitting...',
      submitBtn: 'SUBMIT',
      faqEyebrow: 'FAQS',
      faqHeading: 'YOU ASK, WE ANSWER',
      hoursEyebrow: 'OPENING HOURS',
      lunchLabel: 'LUNCH SERVICE (MON–FRI)',
      dinnerLabel: 'EVENING SERVICE (SUN–THU)',
      faqs: [
        {
          q: 'Can I order online?',
          a: 'Yes, absolutely! You can browse our entire kosher menu right here on the website, customize your Smash Burgers, Pitas, Laffas and Plates, and choose between store pickup or home delivery.',
        },
        {
          q: 'Do you offer delivery?',
          a: `Yes! We deliver hot, freshly grilled orders across Bonneuil-sur-Marne, Créteil, Saint-Maur-des-Fossés, Maisons-Alfort and surrounding areas in 94. Delivery is free for orders over ${freeThresholdEn}!`,
        },
        {
          q: 'What is your Kosher certification?',
          a: 'LABRIOUT is 100% Kosher meat (Bassar) under the strict rabbinical supervision of Badatz de Brunoy, with daily fresh meat and house-prepared recipes.',
        },
        {
          q: 'What are your house specialties?',
          a: 'Our guests love our juicy Smash Burgers (with Parve melted cheddar or pressed veal), warm Laffa & Pita Shawarma, flame-grilled Parguit, sesame Schnitzel, and creamy homemade Hummus Bassar.',
        },
        {
          q: 'Do you have vegetarian options?',
          a: 'Yes! Try our crispy herb Falafel in Pita, Laffa or Platter, our Israeli Sabich with fried eggplant and hard-boiled egg, classic Hummus, and fresh salads.',
        },
        {
          q: 'Can I order for groups, family events or Simchas?',
          a: 'Yes! We gladly prepare large platters, burger & shawarma assortments, and mezzes for birthdays, family gatherings, and office lunches. Contact us via WhatsApp or the form!',
        },
        {
          q: 'Where are you located and what are your opening hours?',
          a: 'We are located at 64 av. Simone Veil, Bonneuil-sur-Marne. Opening hours: 12h-15h & 18h-22h15 (Friday lunch only, closed Shabbat, open Sunday evening).',
        },
      ],
    },
    de: {
      heading: 'KONTAKTIEREN SIE LABRIOUT',
      socialsLabel: 'SOCIALS',
      comingSoon: 'Demnächst verfügbar',
      contactLabel: 'KONTAKT',
      addressLabel: 'ADRESSE',
      thanksTitle: 'Vielen Dank!',
      thanksSub:
        'Wir haben Ihre Nachricht erhalten und melden uns in Kürze telefonisch oder per E-Mail bei Ihnen.',
      sendAnother: 'Weitere Nachricht senden',
      firstNamePlaceholder: 'Vorname*',
      lastNamePlaceholder: 'Nachname*',
      emailPlaceholder: 'E-Mail*',
      phonePlaceholder: 'Telefonnummer',
      reasonPlaceholder: 'Grund der Anfrage*',
      reasonOrder: 'Frage zu Bestellung / Lieferung',
      reasonTakeaway: 'Vorbestellung zur Abholung',
      reasonCatering: 'Events, Feiern & Catering (Simcha)',
      reasonAllergens: 'Allergene & Kaschrut-Informationen',
      reasonFeedback: 'Feedback / Sonstige Anfrage',
      messagePlaceholder: 'Wie können wir Ihnen helfen?',
      termsText:
        'Mit dem Absenden dieses Formulars stimmen Sie unseren AGB und der Verarbeitung Ihrer Kontaktdaten gemäß unserer Datenschutzerklärung zu.',
      termsErr: 'Bitte stimmen Sie den Bedingungen vor dem Absenden zu.',
      submitting: 'Wird gesendet...',
      submitBtn: 'SENDEN',
      faqEyebrow: 'FAQS',
      faqHeading: 'IHRE FRAGEN, UNSERE ANTWORTEN',
      hoursEyebrow: 'ÖFFNUNGSZEITEN',
      lunchLabel: 'MITTAGSSERVICE (MO–FR)',
      dinnerLabel: 'ABENDSERVICE (SO–DO)',
      faqs: [
        {
          q: 'Kann ich online bestellen?',
          a: 'Ja, natürlich! Sie können unsere gesamte koschere Speisekarte auf der Website durchsuchen, Ihre Smash Burger, Pitas, Laffas und Teller individuell anpassen und zwischen Abholung und Lieferung wählen.',
        },
        {
          q: 'Bieten Sie Lieferung nach Hause an?',
          a: `Ja! Wir liefern heiß und frisch nach Bonneuil-sur-Marne, Créteil, Saint-Maur-des-Fossés, Maisons-Alfort und in die umliegenden Städte im Département 94. Kostenlose Lieferung ab ${freeThresholdDe}!`,
        },
        {
          q: 'Welche Koscher-Zertifizierung haben Sie?',
          a: 'LABRIOUT ist ein 100 % koscheres Fleischrestaurant (Bassar) unter der strengen rabbinischen Aufsicht des Badatz de Brunoy.',
        },
        {
          q: 'Was sind Ihre Hausspezialitäten?',
          a: 'Unsere Gäste lieben unsere saftigen Smash Burger (mit Parve-Cheddar oder Kalbs-Bacon), warme Laffa- & Pita-Shawarmas, gegrilltes Parguit, Sesam-Schnitzel und hausgemachten Hummus Bassar.',
        },
        {
          q: 'Haben Sie vegetarische Gerichte?',
          a: 'Ja! Probieren Sie unsere knusprigen Kräuter-Falafel in Pita, Laffa oder als Teller, unser israelisches Sabich mit gebratenen Auberginen, klassischen Hummus und frische Salate.',
        },
        {
          q: 'Kann ich für Gruppen oder Familienfeiern (Simcha) bestellen?',
          a: 'Sehr gerne! Wir bereiten große Platten mit Burgern, Pitas, Shawarma und Mezze für Familienfeste, Geburtstage und Firmenessen zu. Schreiben Sie uns per WhatsApp oder über das Formular!',
        },
        {
          q: 'Wo befinden Sie sich und wie sind Ihre Öffnungszeiten?',
          a: 'Sie finden uns in der 64 av. Simone Veil, Bonneuil-sur-Marne. Öffnungszeiten: 12h–15h und 18h–22h15 (Freitag nur mittags, am Schabbat geschlossen, Sonntagabend geöffnet).',
        },
      ],
    },
    it: {
      heading: 'CONTATTA LABRIOUT',
      socialsLabel: 'SOCIAL',
      comingSoon: 'Disponibile a breve',
      contactLabel: 'CONTATTI',
      addressLabel: 'INDIRIZZO',
      thanksTitle: 'Messaggio Ricevuto!',
      thanksSub:
        'Abbiamo ricevuto la tua richiesta e ti risponderemo telefonicamente o via email al più presto.',
      sendAnother: 'Invia un altro messaggio',
      firstNamePlaceholder: 'Nome*',
      lastNamePlaceholder: 'Cognome*',
      emailPlaceholder: 'Email*',
      phonePlaceholder: 'Telefono',
      reasonPlaceholder: 'Motivo del contatto*',
      reasonOrder: 'Informazioni Ordine / Consegna',
      reasonTakeaway: 'Prenotazione Asporto',
      reasonCatering: 'Feste, Eventi e Catering (Simcha)',
      reasonAllergens: 'Info Allergeni & Kasherut',
      reasonFeedback: 'Feedback / Altra richiesta',
      messagePlaceholder: 'Come possiamo aiutarti?',
      termsText:
        'Inviando questo modulo, accetti i Termini & Condizioni e acconsenti al trattamento dei dati nel rispetto della nostra informativa sulla privacy.',
      termsErr: 'Per favore conferma il consenso prima di inviare.',
      submitting: 'Invio...',
      submitBtn: 'INVIA',
      faqEyebrow: 'FAQ',
      faqHeading: 'VOI CHIEDETE, NOI RISPONDIAMO',
      hoursEyebrow: 'ORARI DI APERTURA',
      lunchLabel: 'SERVIZIO PRANZO (LUN–VEN)',
      dinnerLabel: 'SERVIZIO CENA (DOM–GIO)',
      faqs: [
        {
          q: 'Posso ordinare online?',
          a: 'Sì, certamente! Puoi consultare tutto il nostro menù kosher sul sito, personalizzare i tuoi Smash Burger, Pita, Laffa e Piatti e scegliere tra ritiro in sede o consegna a domicilio.',
        },
        {
          q: 'Effettuate consegne a domicilio?',
          a: `Sì! Consegniamo piatti caldi appena grigliati a Bonneuil-sur-Marne, Créteil, Saint-Maur-des-Fossés, Maisons-Alfort e nei comuni limitrofi del 94. Consegna gratuita oltre i ${freeThresholdFrItRu}!`,
        },
        {
          q: 'Qual è la vostra certificazione Kosher?',
          a: 'LABRIOUT è un ristorante 100% Kosher di carne (Bassar) sotto la stretta supervisione rabbinica del Badatz de Brunoy, con carni fresche selezionate e cucina fatta in casa.',
        },
        {
          q: 'Quali sono le vostre specialità della casa?',
          a: 'I nostri ospiti amano gli Smash Burger succosi (con cheddar fuso Parve o vitello pressato), Laffa e Pita Shawarma, il Parguit marinato alla griglia, lo Schnitzel al sesamo e l’Hummus Bassar fatto in casa.',
        },
        {
          q: 'Avete opzioni vegetariane?',
          a: 'Sì! Prova i nostri Falafel croccanti alle erbe fresche (in pita, laffa o piatto), il Sabich israeliano con melanzane fritte, l’Hummus classico e le nostre insalate fresche.',
        },
        {
          q: 'Posso ordinare per gruppi o eventi familiari (Simcha)?',
          a: 'Con piacere! Prepariamo vassoi conviviali per feste di famiglia, compleanni e pranzi aziendali. Scrivici su WhatsApp o tramite il modulo!',
        },
        {
          q: 'Dove vi trovate e quali sono gli orari di apertura?',
          a: 'Siamo in 64 av. Simone Veil, Bonneuil-sur-Marne. Orari: 12h-15h e 18h-22h15 (venerdì solo a pranzo, chiuso di Shabbat, aperto domenica sera).',
        },
      ],
    },
    ru: {
      heading: 'ОСТАЛИСЬ ВОПРОСЫ?',
      socialsLabel: 'СОЦСЕТИ',
      comingSoon: 'Скоро',
      contactLabel: 'КОНТАКТЫ',
      addressLabel: 'АДРЕС',
      thanksTitle: 'Спасибо за сообщение!',
      thanksSub:
        'Мы получили ваш запрос и свяжемся с вами по телефону или электронной почте в самое ближайшее время!',
      sendAnother: 'Отправить ещё',
      firstNamePlaceholder: 'Имя*',
      lastNamePlaceholder: 'Фамилия*',
      emailPlaceholder: 'Email*',
      phonePlaceholder: 'Телефон',
      reasonPlaceholder: 'Причина обращения*',
      reasonOrder: 'Вопрос по заказу / доставке',
      reasonTakeaway: 'Предзаказ навынос',
      reasonCatering: 'Кейтеринг, праздники и Симха',
      reasonAllergens: 'Аллергены и кашрут',
      reasonFeedback: 'Отзыв / Другой вопрос',
      messagePlaceholder: 'Чем мы можем вам помочь?',
      termsText:
        'Отправляя эту форму, вы соглашаетесь с Условиями использования и подтверждаете согласие на обработку контактных данных.',
      termsErr: 'Пожалуйста, подтвердите согласие.',
      submitting: 'Отправка...',
      submitBtn: 'ОТПРАВИТЬ',
      faqEyebrow: 'ЧАСТЫЕ ВОПРОСЫ',
      faqHeading: 'ВЫ СПРАШИВАЕТЕ, МЫ ОТВЕЧАЕМ',
      hoursEyebrow: 'ЧАСЫ РАБОТЫ',
      lunchLabel: 'ДНЕВНОЙ СЕРВИС (ПН–ПТ)',
      dinnerLabel: 'ВЕЧЕРНИЙ СЕРВИС (ВС–ЧТ)',
      faqs: [
        {
          q: 'Можно ли сделать заказ онлайн?',
          a: 'Да, конечно! Вы можете выбрать любые кошерные бургеры, шаурму в лаффе, питы и сытные тарелки на сайте и оформить доставку на дом или самовывоз.',
        },
        {
          q: 'Есть ли у вас доставка?',
          a: `Да! Мы доставляем горячие блюда с огня по Бонёй-сюр-Марн, Кретею, Сен-Мор-де-Фоссе и соседним городам департамента 94. Бесплатная доставка от ${freeThresholdFrItRu}!`,
        },
        {
          q: 'Какой у вас сертификат кашрута?',
          a: 'Ресторан LABRIOUT на 100% кошерный мясной (Басар) под строгим раввинским контролем Бадац де Брюнуа (Badatz de Brunoy).',
        },
        {
          q: 'Какие ваши фирменные блюда?',
          a: 'Гости особенно любят наши сочные Смэш-бургеры (с чеддером Парве и прессованной телятиной), шаурму в тёплой лаффе и пите, паргит на углях, хрустящий шницель в кунжуте и домашний Хумус Басар.',
        },
        {
          q: 'Есть ли вегетарианские блюда?',
          a: 'Да! Попробуйте наш хрустящий фалафель с зеленью в пите, лаффе или на тарелке, традиционный израильский Сабих с баклажанами и яйцом, классический хумус и свежие салаты.',
        },
        {
          q: 'Можно ли заказать на большую компанию или Симху?',
          a: 'Конечно! Мы с радостью готовим большие сеты бургеров, пит, шаурмы и мезе для семейных праздников, дней рождения и корпоративов. Напишите нам в WhatsApp или через форму!',
        },
        {
          q: 'Где вы находитесь и часы работы?',
          a: 'Мы находимся по адресу 64 av. Simone Veil, Bonneuil-sur-Marne. Часы работы: 12h-15h и 18h-22h15 (в пятницу только обед, в Шаббат закрыто, открыты в воскресенье вечером).',
        },
      ],
    },
  }[language];

  const faqList = ui.faqs;
  const tagline = getLabrioutTagline(language);

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
                  LABRIOUT • {tagline}
                </span>

                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black font-heading text-[#ff5500] tracking-tight uppercase leading-[0.96]">
                  {ui.heading}
                </h1>
              </div>

              <p className="text-neutral-900 font-medium text-xs sm:text-sm lg:text-[14px] leading-relaxed max-w-md">
                {tagline} • 📍 64 av. Simone Veil, Bonneuil-sur-Marne • 📞 0769774086 • ⏰ 12h-15h 18h-22h15
              </p>

              {/* Typographic Contact Info (Styled like Screen 2) */}
              <div className="pt-1 sm:pt-2 space-y-3 sm:space-y-3.5 max-w-lg">
                
                {/* SOCIALS - Placeholders */}
                <div className="grid grid-cols-[85px_1fr] sm:grid-cols-[105px_1fr] gap-3 items-start">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#ff5500] pt-0.5">
                    {ui.socialsLabel}
                  </span>
                  <div className="space-y-0.5 font-black text-neutral-900 text-xs sm:text-sm uppercase tracking-wider">
                    <div>
                      <a
                        href="#tiktok"
                        onClick={(e) => e.preventDefault()}
                        className="hover:text-[#ff5500] transition-colors inline-block cursor-pointer"
                        title={ui.comingSoon}
                      >
                        TIKTOK
                      </a>
                    </div>
                    <div>
                      <a
                        href="#facebook"
                        onClick={(e) => e.preventDefault()}
                        className="hover:text-[#ff5500] transition-colors inline-block cursor-pointer"
                        title={ui.comingSoon}
                      >
                        FACEBOOK
                      </a>
                    </div>
                    <div>
                      <a
                        href={STORE_DETAILS.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#ff5500] transition-colors inline-block cursor-pointer"
                      >
                        INSTAGRAM
                      </a>
                    </div>
                  </div>
                </div>

                {/* CONTACT */}
                <div className="grid grid-cols-[85px_1fr] sm:grid-cols-[105px_1fr] gap-3 items-start">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#ff5500] pt-0.5">
                    {ui.contactLabel}
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
                    {ui.addressLabel}
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
                        {ui.thanksTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
                        {ui.thanksSub}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ff5500] hover:bg-[#e04a00] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-md shadow-[#ff5500]/25"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{ui.sendAnother}</span>
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
                          placeholder={ui.firstNamePlaceholder}
                          className="w-full h-[52px] sm:h-[56px] bg-white border border-[#d2d6dc] focus:border-[#ff5500] focus:ring-2 focus:ring-[#ff5500]/20 rounded-xl px-4 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition flex items-center"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder={ui.lastNamePlaceholder}
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
                          placeholder={ui.emailPlaceholder}
                          className="w-full h-[52px] sm:h-[56px] bg-white border border-[#d2d6dc] focus:border-[#ff5500] focus:ring-2 focus:ring-[#ff5500]/20 rounded-xl px-4 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition flex items-center"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={ui.phonePlaceholder}
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
                          {ui.reasonPlaceholder}
                        </option>
                        <option value="takeaway_delivery">{ui.reasonOrder}</option>
                        <option value="table_reservation">{ui.reasonTakeaway}</option>
                        <option value="party_catering">{ui.reasonCatering}</option>
                        <option value="allergens">{ui.reasonAllergens}</option>
                        <option value="feedback">{ui.reasonFeedback}</option>
                      </select>
                    </div>

                    {/* Message Box */}
                    <div>
                      <textarea
                        rows={3}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={ui.messagePlaceholder}
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
                          {ui.termsText}
                        </span>
                      </label>
                      {termsError && (
                        <p className="text-[11px] text-[#ff5500] font-bold pl-6">
                          {ui.termsErr}
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
                            <span>{ui.submitting}</span>
                          </>
                        ) : (
                          <span>{ui.submitBtn}</span>
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
              {ui.faqEyebrow}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading text-[#ff5500] uppercase tracking-tight">
              {ui.faqHeading}
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
              {ui.hoursEyebrow}
            </span>

            {/* Schedule Rows with Orange Dashed Lines */}
            <div className="space-y-4 sm:space-y-6">
              
              {/* Midi */}
              <div className="flex items-end justify-between gap-2">
                <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-neutral-800 shrink-0">
                  {ui.lunchLabel}
                </span>
                <div className="flex-1 border-b-2 border-dashed border-[#ff5500]/50 mx-2 sm:mx-4 mb-1 min-w-[30px]" />
                <span className="text-xs sm:text-sm md:text-base font-black text-neutral-900 shrink-0">
                  12h - 15h
                </span>
              </div>

              {/* Soir */}
              <div className="flex items-end justify-between gap-2">
                <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-neutral-800 shrink-0">
                  {ui.dinnerLabel}
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
