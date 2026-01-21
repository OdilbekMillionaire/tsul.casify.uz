import { Translations, Language, LegalArea, AnalysisTone, CaseData } from './types';

export const INITIAL_CASE_DATA: CaseData = {
  title: '',
  jurisdiction: 'Uzbekistan',
  area: LegalArea.CIVIL,
  facts: '',
  claimant: '',
  respondent: '',
  tone: AnalysisTone.PROFESSIONAL,
  isDeepAnalysis: false,
};

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      newCase: 'New Case',
      resources: 'About Us',
      brand: 'Casify',
      langTooltip: 'Change the interface and AI output language.',
    },
    hero: {
      brandName: 'CASIFY',
      title: 'Transform Legal Analysis with Artificial Intelligence',
      subtitle: 'The first academic platform adapted to TSUL standards. Generate professional memoranda, risk assessments, and checklists in seconds.',
      cta: 'Start Analysis',
      secondaryCta: 'Quick Draft',
      resourcesBtn: 'Learn More',
    },
    features: {
      deepAnalysis: { title: 'Deep Legal Analysis', desc: 'IRAC structured reasoning based on legal principles.' },
      bilingual: { title: 'Multilingual Support', desc: 'Fluent in Uzbek (Lat/Cyr), Russian, and English.' },
      security: { title: 'Security First', desc: 'Local processing. No external databases. Your client data stays yours.' },
    },
    form: {
      steps: { metadata: 'Metadata', facts: 'Facts', review: 'Review' },
      titleLabel: 'Case Title / Reference',
      jurisdictionLabel: 'Jurisdiction',
      areaLabel: 'Legal Area',
      factsLabel: 'The Facts',
      factsPlaceholder: 'Describe the situation in detail. Who did what? When? What is the specific dispute?',
      partiesLabel: 'Parties Involved',
      claimantPlaceholder: 'Claimant Name',
      respondentPlaceholder: 'Respondent Name',
      toneLabel: 'Tone',
      depthLabel: 'Analysis Depth',
      generateBtn: 'Generate Memorandum',
      generating: 'Analyzing Jurisprudence...',
      tooltips: {
        title: 'A unique reference or internal case number for your files.',
        jurisdiction: 'Currently limited to Uzbekistan. More regions coming soon.',
        area: 'Helps the AI select the relevant procedural code (e.g., GPK, UPK).',
        facts: 'The most important field. Include dates, specific actions, and amounts involved.',
        parties: 'Used to identify roles (Claimant/Respondent) in the generated memo.',
        tone: 'Student mode explains concepts simply; Professional mode assumes legal knowledge.',
        depth: 'Deep analysis checks more potential rules but takes longer to generate.'
      },
      validation: {
        required: 'This field is required.',
        minLength: 'Please provide at least 50 characters for accurate analysis.',
      },
    },
    result: {
      summaryHeader: 'Executive Summary',
      factsHeader: 'Fact Pattern & Issues',
      analysisHeader: 'Legal Analysis (IRAC)',
      risksHeader: 'Risk Assessment',
      evidenceHeader: 'Evidence Checklist',
      stepsHeader: 'Recommended Next Steps',
      copyBtn: 'Copy JSON',
      copySuccess: 'Copied!',
      printBtn: 'Print / PDF',
      printPreparing: 'Preparing...',
      newCaseBtn: 'New Case',
    },
    about: {
      tagline: 'The Future of Jurisprudence',
      mission: { title: 'Our Mission', text: 'To digitize legal workflows and empower lawyers with instant, accurate analysis, adapted to the highest professional standards.' },
      tech: { title: 'AI Technology', text: 'Powered by advanced Google Gemini 3 Pro models, the system creates unique analyses tailored to the needs of every legal professional.' },
      team: { title: 'Developer', text: 'This platform was created by Oxforder LLC based on principles of academic and professional excellence.' },
    },
    footer: {
      disclaimer: 'Casify is an AI-powered legal research assistant. Content generated is for informational purposes only and does not constitute professional legal advice or attorney-client privilege.',
      copyright: '© 2026 Oxforder LLC. All Rights Reserved.',
      links: {
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        contact: 'Contact Support'
      }
    }
  },
  uz_lat: {
    nav: {
      home: 'Bosh sahifa',
      newCase: 'Yangi kazus',
      resources: 'Biz haqimizda',
      brand: 'Casify',
      langTooltip: 'Interfeys va AI tahlil tilini o\'zgartirish.',
    },
    hero: {
      brandName: 'CASIFY',
      title: "Yuridik ta'limni sun'iy intellekt bilan o'zgartiring",
      subtitle: "TDYU standartlariga moslashtirilgan birinchi akademik platforma. Soniyalar ichida mukammal darslar, sud ishlari tahlili va huquqiy doktrinalarni o'rganing.",
      cta: "O'qishni boshlash",
      secondaryCta: 'Tezkor tahlil',
      resourcesBtn: 'Batafsil',
    },
    features: {
      deepAnalysis: { title: 'Chuqur yuridik tahlil', desc: 'Huquqiy tamoyillarga asoslangan IRAC tuzilmasi.' },
      bilingual: { title: 'Ko‘p tilli', desc: 'O‘zbek (Lot/Kir), Rus va Ingliz tillarida ravon.' },
      security: { title: 'Xavfsizlik birinchi o‘rinda', desc: 'Mahalliy qayta ishlash. Tashqi bazalar yo‘q. Sizning ma\'lumotlaringiz o‘zingizda qoladi.' },
    },
    form: {
      steps: { metadata: 'Ma\'lumotlar', facts: 'Faktlar', review: 'Ko‘rib chiqish' },
      titleLabel: 'Ish nomi / havola',
      jurisdictionLabel: 'Yurisdiksiya',
      areaLabel: 'Huquq sohasi',
      factsLabel: 'Faktlar',
      factsPlaceholder: 'Vaziyatni batafsil tasvirlab bering. Kim nima qildi? Qachon? Aniq nizo nimada?',
      partiesLabel: 'Taraflar',
      claimantPlaceholder: 'Da\'vogar',
      respondentPlaceholder: 'Javobgar',
      toneLabel: 'Ohang',
      depthLabel: 'Tahlil chuqurligi',
      generateBtn: 'Xulosa yaratish',
      generating: 'Yurisprudensiya tahlil qilinmoqda...',
      tooltips: {
        title: 'Fayllaringiz uchun noyob havola yoki ichki ish raqami.',
        jurisdiction: 'Hozirda faqat O\'zbekiston bilan cheklangan.',
        area: 'Sun\'iy intellektga tegishli protsessual kodeksni tanlashda yordam beradi.',
        facts: 'Eng muhim maydon. Sanalar, aniq harakatlar va summalar kiritilishi shart.',
        parties: 'Yaratilgan xulosada rollarni aniqlash uchun ishlatiladi.',
        tone: 'Talaba rejimi tushunchalarni sodda tushuntiradi; Professional rejim yuridik bilimni nazarda tutadi.',
        depth: 'Chuqur tahlil ko\'proq qoidalarni tekshiradi, lekin yaratish uchun ko\'proq vaqt oladi.'
      },
      validation: {
        required: 'Ushbu maydon to\'ldirilishi shart.',
        minLength: 'Aniq tahlil uchun kamida 50 ta belgi kiriting.',
      },
    },
    result: {
      summaryHeader: 'Ijroiya xulosasi',
      factsHeader: 'Faktlar va muammolar',
      analysisHeader: 'Yuridik tahlil (IRAC)',
      risksHeader: 'Risklarni baholash',
      evidenceHeader: 'Dalillar ro‘yxati',
      stepsHeader: 'Tavsiya etilgan keyingi qadamlar',
      copyBtn: 'Nusxalash',
      copySuccess: 'Nusxalandi!',
      printBtn: 'Chop etish',
      printPreparing: 'Tayyorlanmoqda...',
      newCaseBtn: 'Yangi ish',
    },
    about: {
      tagline: 'Kelajak yurisprudensiyasi',
      mission: { title: 'Bizning missiyamiz', text: 'Yuridik sohani raqamlashtirish va huquqshunoslarga eng so\'nggi texnologiyalar yordamida chuqur va aniq tahlil taqdim etish.' },
      tech: { title: 'AI texnologiyasi', text: 'Google Gemini 3 Pro modellari asosida ishlovchi tizim har bir huquqshunosning ehtiyojiga moslashtirilgan noyob yechimlarni yaratadi.' },
      team: { title: 'Ishlab chiqaruvchi', text: 'Ushbu platforma Oxforder MCHJ tomonidan akademik mukammallik tamoyillari asosida yaratilgan.' },
    },
    footer: {
      disclaimer: "Casify - bu sun'iy intellektga asoslangan yuridik tadqiqot yordamchisi. Yaratilgan tarkib faqat ma'lumot olish uchun mo'ljallangan va professional yuridik maslahat hisoblanmaydi.",
      copyright: "© 2026 Oxforder MCHJ. Barcha huquqlar himoyalangan.",
      links: {
        privacy: 'Maxfiylik siyosati',
        terms: 'Foydalanish shartlari',
        contact: "Qo'llab-quvvatlash"
      }
    }
  },
  uz_cyr: {
    nav: {
      home: 'Бош саҳифа',
      newCase: 'Янги казус',
      resources: 'Биз ҳақимизда',
      brand: 'Casify',
      langTooltip: 'Интерфейс ва АИ таҳлил тилини ўзгартириш.',
    },
    hero: {
      brandName: 'CASIFY',
      title: 'Юридик таълимни сунъий интеллект билан ўзгартиринг',
      subtitle: 'ТДЮУ стандартларига мослаштирилган биринчи академик платформа. Сониялар ичида мукаммал дарслар, суд ишлари таҳлили ва ҳуқуқий доктриналарни ўрганинг.',
      cta: 'Ўқишни бошлаш',
      secondaryCta: 'Тезкор таҳлил',
      resourcesBtn: 'Батафсил',
    },
    features: {
      deepAnalysis: { title: 'Чуқур юридик таҳлил', desc: 'Ҳуқуқий тамойилларга асосланган IRAC тузилмаси.' },
      bilingual: { title: 'Кўп тилли', desc: 'Ўзбек (Лот/Кир), Рус ва Инглиз тилларида равон.' },
      security: { title: 'Хавфсизлик биринчи ўринда', desc: 'Маҳаллий қайта ишлаш. Ташқи базалар йўқ. Сизнинг маълумотларингиз ўзингизда қолади.' },
    },
    form: {
      steps: { metadata: 'Маълумотлар', facts: 'Фактлар', review: 'Кўриб чиқиш' },
      titleLabel: 'Иш номи / ҳавола',
      jurisdictionLabel: 'Юрисдикция',
      areaLabel: 'Ҳуқуқ соҳаси',
      factsLabel: 'Фактлар',
      factsPlaceholder: 'Вазиятни батафсил тасвирлаб беринг. Ким нима қилди? Қачон? Аниқ низо нимада?',
      partiesLabel: 'Тарафлар',
      claimantPlaceholder: 'Даъвогар',
      respondentPlaceholder: 'Жавобгар',
      toneLabel: 'Оҳанг',
      depthLabel: 'Таҳлил чуқурлиги',
      generateBtn: 'Хулоса яратиш',
      generating: 'Юриспруденция таҳлил қилинмоқда...',
      tooltips: {
        title: 'Файлларингиз учун ноёб ҳавола ёки ички иш рақами.',
        jurisdiction: 'Ҳозирда фақат Ўзбекистон билан чекланган.',
        area: 'Сунъий интеллектга тегишли процессуал кодексни танлашда ёрдам беради.',
        facts: 'Энг муҳим майдон. Саналар, аниқ ҳаракатлар ва суммалар киритилиши шарт.',
        parties: 'Яратилган хулосада ролларни аниқлаш учун ишлатилади.',
        tone: 'Талаба режими тушунчаларни содда тушунтиради; Профессионал режим юридик билимни назарда тутади.',
        depth: 'Чуқур таҳлил кўпроқ қоидаларни текширади, лекин яратиш учун кўпроқ вақт олади.'
      },
      validation: {
        required: 'Ушбу майдон тўлдирилиши шарт.',
        minLength: 'Аниқ таҳлил учун камида 50 та белги киритинг.',
      },
    },
    result: {
      summaryHeader: 'Ижроия хулосаси',
      factsHeader: 'Фактлар ва муаммолар',
      analysisHeader: 'Юридик таҳлил (IRAC)',
      risksHeader: 'Рискларни баҳолаш',
      evidenceHeader: 'Далиллар рўйхати',
      stepsHeader: 'Тавсия этилган кейинги қадамлар',
      copyBtn: 'Нусхалаш',
      copySuccess: 'Нусхаланди!',
      printBtn: 'Чоп этиш',
      printPreparing: 'Тайёрланмоқда...',
      newCaseBtn: 'Янги иш',
    },
    about: {
      tagline: 'Келажак юриспруденцияси',
      mission: { title: 'Бизнинг миссиямиз', text: 'Юридик соҳани рақамлаштириш ва ҳуқуқшуносларга энг сўнгги технологиялар ёрдамида чуқур ва аниқ таҳлил тақдим этиш.' },
      tech: { title: 'AI технологияси', text: 'Google Gemini 3 Pro моделлари асосида ишловчи тизим ҳар бир ҳуқуқшуноснинг эҳтиёжига мослаштирилган ноёб ечимларни яратади.' },
      team: { title: 'Ишлаб чиқарувчи', text: 'Ушбу платформа Oxforder МЧЖ томонидан академик мукаммаллик тамойиллари асосида яратилган.' },
    },
    footer: {
      disclaimer: "Casify - бу сунъий интеллектга асосланган юридик тадқиқот ёрдамчиси. Яратилган таркиб фақат маълумот олиш учун мўлжалланган ва профессионал юридик маслаҳат ҳисобланмайди.",
      copyright: "© 2026 Oxforder МЧЖ. Барча ҳуқуқлар ҳимояланган.",
      links: {
        privacy: 'Махфийлик сиёсати',
        terms: 'Фойдаланиш шартлари',
        contact: "Қўллаб-қувватлаш"
      }
    }
  },
  ru: {
    nav: {
      home: 'Главная',
      newCase: 'Новое дело',
      resources: 'О Нас',
      brand: 'Casify',
      langTooltip: 'Изменить язык интерфейса и вывода ИИ.',
    },
    hero: {
      brandName: 'CASIFY',
      title: 'Трансформируйте юридическое образование с помощью ИИ',
      subtitle: 'Первая академическая платформа, адаптированная к стандартам ТГЮУ. Создавайте профессиональные меморандумы, оценки рисков и чек-листы за считанные секунды.',
      cta: 'Начать обучение',
      secondaryCta: 'Быстрый анализ',
      resourcesBtn: 'Подробнее',
    },
    features: {
      deepAnalysis: { title: 'Глубокий юридический анализ', desc: 'Структурированное обоснование IRAC на основе правовых принципов.' },
      bilingual: { title: 'Многоязычная поддержка', desc: 'Свободное владение узбекским (Лат/Кир), русским и английским языками.' },
      security: { title: 'Безопасность прежде всего', desc: 'Локальная обработка. Никаких внешних баз данных.' },
    },
    form: {
      steps: { metadata: 'Метаданные', facts: 'Факты', review: 'Проверка' },
      titleLabel: 'Название дела / ссылка',
      jurisdictionLabel: 'Юрисдикция',
      areaLabel: 'Область права',
      factsLabel: 'Обстоятельства дела',
      factsPlaceholder: 'Подробно опишите ситуацию. Кто что сделал? Когда? В чем конкретно заключается спор?',
      partiesLabel: 'Стороны',
      claimantPlaceholder: 'Истец',
      respondentPlaceholder: 'Ответчик',
      toneLabel: 'Тон',
      depthLabel: 'Глубина анализа',
      generateBtn: 'Создать меморандум',
      generating: 'Анализ юриспруденции...',
      tooltips: {
        title: 'Уникальная ссылка или внутренний номер дела для ваших файлов.',
        jurisdiction: 'В настоящее время ограничено Узбекистаном. Скоро будут добавлены другие регионы.',
        area: 'Помогает ИИ выбрать соответствующий процессуальный кодекс (например, ГПК, УПК).',
        facts: 'Самое важное поле. Включите даты, конкретные действия и суммы.',
        parties: 'Используется для определения ролей (Истец/Ответчик) в генерируемом меморандуме.',
        tone: 'Режим студента объясняет просто; Профессиональный режим предполагает юридические знания.',
        depth: 'Глубокий анализ проверяет больше правил и прецедентов, но занимает больше времени.'
      },
      validation: {
        required: 'Это поле обязательно.',
        minLength: 'Пожалуйста, введите не менее 50 символов для точного анализа.',
      },
    },
    result: {
      summaryHeader: 'Резюме',
      factsHeader: 'Факты и проблемы',
      analysisHeader: 'Юридический анализ (IRAC)',
      risksHeader: 'Оценка рисков',
      evidenceHeader: 'Чек-лист доказательств',
      stepsHeader: 'Рекомендуемые шаги',
      copyBtn: 'Копировать JSON',
      copySuccess: 'Скопировано!',
      printBtn: 'Печать / PDF',
      printPreparing: 'Подготовка...',
      newCaseBtn: 'Новое дело',
    },
    about: {
      tagline: 'Юриспруденция будущего',
      mission: { title: 'Наша миссия', text: 'Оцифровать юридические процессы и предоставить юристам глубокий и точный анализ с использованием новейших технологий.' },
      tech: { title: 'Технология ИИ', text: 'Система, работающая на моделях Google Gemini 3 Pro, создает уникальные решения, адаптированные под нужды каждого юриста.' },
      team: { title: 'Разработчик', text: 'Эта платформа была создана ООО Oxforder на основе принципов академического совершенства.' },
    },
    footer: {
      disclaimer: "Casify — это помощник по юридическим исследованиям на базе ИИ. Генерируемый контент предназначен только для информационных целей и не является профессиональной юридической консультацией.",
      copyright: "© 2026 Oxforder LLC. Все права защищены.",
      links: {
        privacy: 'Политика конфиденциальности',
        terms: 'Условия использования',
        contact: 'Поддержка'
      }
    }
  },
};