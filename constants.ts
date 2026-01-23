import { Translations, Language, LegalArea, AnalysisTone, CaseData } from './types';

export const INITIAL_CASE_DATA: CaseData = {
  title: '',
  jurisdiction: 'Uzbekistan',
  area: LegalArea.CIVIL,
  facts: '',
  tone: AnalysisTone.PROFESSIONAL,
  isDeepAnalysis: false,
  showLegalResolution: true,
};

// Translations for the Legal Area Dropdown
export const LEGAL_AREA_TRANSLATIONS: Record<Language, Record<LegalArea, string>> = {
  en: {
    [LegalArea.ADMINISTRATIVE]: 'Administrative Law',
    [LegalArea.BANKING]: 'Banking & Finance',
    [LegalArea.BANKRUPTCY]: 'Bankruptcy',
    [LegalArea.CIVIL]: 'Civil Law',
    [LegalArea.CONSTITUTIONAL]: 'Constitutional Law',
    [LegalArea.CONTRACT]: 'Contract Law',
    [LegalArea.CORPORATE]: 'Corporate Law',
    [LegalArea.CRIMINAL]: 'Criminal Law',
    [LegalArea.CUSTOMS]: 'Customs Law',
    [LegalArea.FAMILY]: 'Family Law',
    [LegalArea.HOUSING]: 'Housing Law',
    [LegalArea.IMMIGRATION]: 'Immigration Law',
    [LegalArea.INSURANCE]: 'Insurance Law',
    [LegalArea.INTELLECTUAL_PROPERTY]: 'Intellectual Property',
    [LegalArea.INTERNATIONAL]: 'International Law',
    [LegalArea.INVESTMENT]: 'Investment Law',
    [LegalArea.LABOR]: 'Labor Law',
    [LegalArea.PROCEDURAL]: 'Procedural Law',
    [LegalArea.PROPERTY]: 'Property / Real Estate',
    [LegalArea.TAX]: 'Tax Law',
    [LegalArea.TORT]: 'Tort Law'
  },
  uz_lat: {
    [LegalArea.ADMINISTRATIVE]: "Ma'muriy huquq",
    [LegalArea.BANKING]: 'Bank va moliya',
    [LegalArea.BANKRUPTCY]: 'Bankrotlik',
    [LegalArea.CIVIL]: 'Fuqarolik huquqi',
    [LegalArea.CONSTITUTIONAL]: 'Konstitutsiyaviy huquq',
    [LegalArea.CONTRACT]: 'Shartnoma huquqi',
    [LegalArea.CORPORATE]: 'Korporativ huquq',
    [LegalArea.CRIMINAL]: 'Jinoyat huquqi',
    [LegalArea.CUSTOMS]: 'Bojxona huquqi',
    [LegalArea.FAMILY]: 'Oila huquqi',
    [LegalArea.HOUSING]: 'Uy-joy huquqi',
    [LegalArea.IMMIGRATION]: 'Migratsiya huquqi',
    [LegalArea.INSURANCE]: "Sug'urta huquqi",
    [LegalArea.INTELLECTUAL_PROPERTY]: 'Intellektual mulk',
    [LegalArea.INTERNATIONAL]: 'Xalqaro huquq',
    [LegalArea.INVESTMENT]: 'Investitsiya huquqi',
    [LegalArea.LABOR]: 'Mehnat huquqi',
    [LegalArea.PROCEDURAL]: 'Protsessual huquq',
    [LegalArea.PROPERTY]: "Mulk va ko'chmas mulk",
    [LegalArea.TAX]: 'Soliq huquqi',
    [LegalArea.TORT]: 'Delikt huquqi'
  },
  uz_cyr: {
    [LegalArea.ADMINISTRATIVE]: 'Маъмурий ҳуқуқ',
    [LegalArea.BANKING]: 'Банк ва молия',
    [LegalArea.BANKRUPTCY]: 'Банкротлик',
    [LegalArea.CIVIL]: 'Фуқаролик ҳуқуқи',
    [LegalArea.CONSTITUTIONAL]: 'Конституциявий ҳуқуқ',
    [LegalArea.CONTRACT]: 'Шартнома ҳуқуқи',
    [LegalArea.CORPORATE]: 'Корпоратив ҳуқуқ',
    [LegalArea.CRIMINAL]: 'Жиноят ҳуқуқи',
    [LegalArea.CUSTOMS]: 'Божхона ҳуқуқи',
    [LegalArea.FAMILY]: 'Оила ҳуқуқи',
    [LegalArea.HOUSING]: 'Уй-жой ҳуқуқи',
    [LegalArea.IMMIGRATION]: 'Миграция ҳуқуқи',
    [LegalArea.INSURANCE]: 'Суғурта ҳуқуқи',
    [LegalArea.INTELLECTUAL_PROPERTY]: 'Интеллектуал мулк',
    [LegalArea.INTERNATIONAL]: 'Халқаро ҳуқуқ',
    [LegalArea.INVESTMENT]: 'Инвестиция ҳуқуқи',
    [LegalArea.LABOR]: 'Меҳнат ҳуқуқи',
    [LegalArea.PROCEDURAL]: 'Процессуал ҳуқуқ',
    [LegalArea.PROPERTY]: 'Мулк ва кўчмас мулк',
    [LegalArea.TAX]: 'Солиқ ҳуқуқи',
    [LegalArea.TORT]: 'Деликт ҳуқуқи'
  },
  ru: {
    [LegalArea.ADMINISTRATIVE]: 'Административное право',
    [LegalArea.BANKING]: 'Банковское дело и финансы',
    [LegalArea.BANKRUPTCY]: 'Банкротство',
    [LegalArea.CIVIL]: 'Гражданское право',
    [LegalArea.CONSTITUTIONAL]: 'Конституционное право',
    [LegalArea.CONTRACT]: 'Договорное право',
    [LegalArea.CORPORATE]: 'Корпоративное право',
    [LegalArea.CRIMINAL]: 'Уголовное право',
    [LegalArea.CUSTOMS]: 'Таможенное право',
    [LegalArea.FAMILY]: 'Семейное право',
    [LegalArea.HOUSING]: 'Жилищное право',
    [LegalArea.IMMIGRATION]: 'Миграционное право',
    [LegalArea.INSURANCE]: 'Страховое право',
    [LegalArea.INTELLECTUAL_PROPERTY]: 'Интеллектуальная собственность',
    [LegalArea.INTERNATIONAL]: 'Международное право',
    [LegalArea.INVESTMENT]: 'Инвестиционное право',
    [LegalArea.LABOR]: 'Трудовое право',
    [LegalArea.PROCEDURAL]: 'Процессуальное право',
    [LegalArea.PROPERTY]: 'Недвижимость',
    [LegalArea.TAX]: 'Налоговое право',
    [LegalArea.TORT]: 'Деликтное право'
  }
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
      subtitle: 'The first academic platform adapted to TSUL standards. Generate professional case studies, risk assessments, and checklists in seconds.',
      cta: 'Start Analysis',
      secondaryCta: 'Quick Draft',
      resourcesBtn: 'Learn More',
    },
    features: {
      deepAnalysis: { title: 'Deep Legal Analysis', desc: 'IRAC structured reasoning based on legal principles.' },
      bilingual: { title: 'Multilingual Support', desc: 'Fluent in Uzbek, Russian, and English.' },
      security: { title: 'Security First', desc: 'Local processing. No external databases. Your client data stays yours.' },
    },
    form: {
      steps: { metadata: 'Metadata', facts: 'Facts', review: 'Review' },
      titleLabel: 'Case Title / Reference',
      jurisdictionLabel: 'Jurisdiction',
      areaLabel: 'Legal Area',
      factsLabel: 'Topic or Case Description',
      factsPlaceholder: 'Enter a legal topic (e.g. "Intellectual property dispute over software code") or specific keywords. The AI will research real-life cases for you.',
      toneLabel: 'Tone',
      depthLabel: 'Analysis Depth',
      generateBtn: 'Research & Generate',
      generating: 'Searching Case Law...',
      piiWarning: 'You are about to generate a legal case study based on the provided facts. Please ensure no sensitive personally identifiable information (PII) is included if not necessary.',
      deepAnalysisLabel: 'Enable Deep Analysis (Slower, more comprehensive)',
      resolutionLabel: 'Include Legal Resolution / Court Outcome',
      tones: {
        professional: 'Professional',
        student: 'Student'
      },
      buttons: {
        nextFacts: 'Next: Facts',
        nextSettings: 'Next: Settings',
        back: 'Back'
      },
      tooltips: {
        title: 'A unique reference or internal case number for your files.',
        jurisdiction: 'Currently limited to Uzbekistan. More regions coming soon.',
        area: 'Helps the AI select the relevant procedural code (e.g., GPK, UPK).',
        facts: 'Enter a topic, keywords, or situation. The AI will use Google Search to find real precedents.',
        tone: 'Student mode explains concepts simply; Professional mode assumes legal knowledge.',
        depth: 'Deep analysis checks more potential rules but takes longer to generate.'
      },
      validation: {
        required: 'This field is required.',
      },
    },
    result: {
      privileged: 'Privileged & Confidential',
      generatedBy: 'Generated by Casify AI',
      summaryHeader: 'Case Details & Summary',
      factsHeader: 'Real-Life Case Pattern',
      analysisHeader: 'Legal Analysis (IRAC)',
      risksHeader: 'Risk Assessment',
      evidenceHeader: 'Evidence Checklist',
      stepsHeader: 'Recommended Next Steps',
      copyBtn: 'Copy JSON',
      copySuccess: 'Copied!',
      printBtn: 'Print / PDF',
      printPreparing: 'Preparing...',
      newCaseBtn: 'New Case',
      sourcesHeader: 'Legal Sources & References',
      practiceAi: {
        title: 'Practice AI',
        greeting: 'I am here to assist you with legal research and case analysis.'
      }
    },
    about: {
      tagline: 'The Future of Jurisprudence',
      mission: { title: 'Our Mission', text: 'To digitize legal workflows and empower lawyers with instant, accurate analysis, adapted to the highest professional standards.' },
      tech: { title: 'AI Technology', text: 'Powered by advanced Google Gemini 3 Pro models, the system creates unique analyses tailored to the needs of every legal professional.' },
      team: { title: 'Developer', text: 'This platform was created by Oxforder LLC based on principles of academic and professional excellence.' },
    },
    footer: {
      platformHeader: 'Platform',
      disclaimerHeader: 'Legal Disclaimer',
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
      deepAnalysis: { title: 'Chuqur yuridik tahlil', desc: "Yuridik tamoyillarga asoslangan IRAC tuzilmasi bo'yicha tahlil." },
      bilingual: { title: 'Ko‘p tilli', desc: "O'zbek, rus va Ingliz tillarida ravon." },
      security: { title: 'Xavfsizlik birinchi o‘rinda', desc: 'Mahalliy qayta ishlash. Tashqi bazalar yo‘q. Sizning ma\'lumotlaringiz o‘zingizda qoladi.' },
    },
    form: {
      steps: { metadata: 'Ma\'lumotlar', facts: 'Faktlar', review: 'Ko‘rib chiqish' },
      titleLabel: 'Ish nomi / havola',
      jurisdictionLabel: 'Yurisdiksiya',
      areaLabel: 'Huquq sohasi',
      factsLabel: 'Mavzu yoki kazus tavsifi',
      factsPlaceholder: 'Yuridik mavzuni kiriting (masalan, "Dasturiy ta\'minot bo\'yicha mualliflik huquqi") yoki kalit so\'zlar. AI siz uchun real sud ishlarini qidirib topadi.',
      toneLabel: 'Ohang',
      depthLabel: 'Tahlil chuqurligi',
      generateBtn: 'Qidirish va tahlil qilish',
      generating: 'Sud amaliyoti qidirilmoqda...',
      piiWarning: "Siz taqdim etilgan faktlar asosida yuridik kazus tahlili va amaliyotini o'rganmoqchisiz. Iltimos, zarurat bo'lmasa, shaxsga doir maxfiy ma'lumotlar (PII) kiritilmaganligiga ishonch hosil qiling.",
      deepAnalysisLabel: "Chuqur tahlilni yoqish (sekinroq, keng qamrovli)",
      resolutionLabel: "Sud qarori / Yakuniy yechimni ko'rsatish",
      tones: {
        professional: 'Professional',
        student: 'Talaba'
      },
      buttons: {
        nextFacts: 'Keyingisi: Faktlar',
        nextSettings: 'Keyingisi: Sozlamalar',
        back: 'Orqaga'
      },
      tooltips: {
        title: 'Fayllaringiz uchun noyob havola yoki ichki ish raqami.',
        jurisdiction: 'Hozirda faqat O\'zbekiston bilan cheklangan.',
        area: 'Sun\'iy intellektga tegishli protsessual kodeksni tanlashda yordam beradi.',
        facts: 'Mavzu yoki kalit so\'zlarni kiriting. AI Google orqali real presedentlarni topadi.',
        tone: 'Talaba rejimi tushunchalarni sodda tushuntiradi; Professional rejim yuridik bilimni nazarda tutadi.',
        depth: 'Chuqur tahlil ko\'proq qoidalarni tekshiradi, lekin yaratish uchun ko\'proq vaqt oladi.'
      },
      validation: {
        required: 'Ushbu maydon to\'ldirilishi shart.',
      },
    },
    result: {
      privileged: 'Maxfiy va ishonchli',
      generatedBy: 'Casify AI tomonidan yaratilgan',
      summaryHeader: 'Kazus tafsilotlari va Xulosa',
      factsHeader: 'Real sud ishi tafsilotlari',
      analysisHeader: 'Yuridik tahlil (IRAC)',
      risksHeader: 'Risklarni baholash',
      evidenceHeader: 'Dalillar ro‘yxati',
      stepsHeader: 'Tavsiya etilgan keyingi qadamlar',
      copyBtn: 'Nusxalash',
      copySuccess: 'Nusxalandi!',
      printBtn: 'Chop etish',
      printPreparing: 'Tayyorlanmoqda...',
      newCaseBtn: 'Yangi ish',
      sourcesHeader: 'Manbalar va havolalar',
      practiceAi: {
        title: 'Practice AI',
        greeting: 'Men sizga yuridik tadqiqot va kazus tahlilida yordam berish uchun shu yerdaman.'
      }
    },
    about: {
      tagline: 'Kelajak yurisprudensiyasi',
      mission: { title: 'Bizning missiyamiz', text: 'Yuridik sohani raqamlashtirish va huquqshunoslarga eng so\'nggi texnologiyalar yordamida chuqur va aniq tahlil taqdim etish.' },
      tech: { title: 'AI texnologiyasi', text: 'Google Gemini 3 Pro modellari asosida ishlovchi tizim har bir huquqshunosning ehtiyojiga moslashtirilgan noyob yechimlarni yaratadi.' },
      team: { title: 'Ishlab chiqaruvchi', text: 'Ushbu platforma Oxforder MCHJ tomonidan akademik mukammallik tamoyillari asosida yaratilgan.' },
    },
    footer: {
      platformHeader: 'Platforma',
      disclaimerHeader: 'Yuridik Ogohlantirish',
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
      deepAnalysis: { title: 'Чуқур юридик таҳлил', desc: 'Ҳуқуқий тамойилларга асосланган IRAC тузилмаси бўйича таҳлил.' },
      bilingual: { title: 'Кўп тилли', desc: 'Ўзбек, Рус ва Инглиз тилларида равон.' },
      security: { title: 'Хавфсизлик биринчи ўринда', desc: 'Маҳаллий қайта ишлаш. Ташқи базалар йўқ. Сизнинг маълумотларингиз ўзингизда қолади.' },
    },
    form: {
      steps: { metadata: 'Маълумотлар', facts: 'Фактлар', review: 'Кўриб чиқиш' },
      titleLabel: 'Иш номи / ҳавола',
      jurisdictionLabel: 'Юрисдикция',
      areaLabel: 'Ҳуқуқ соҳаси',
      factsLabel: 'Мавзу ёки казус тавсифи',
      factsPlaceholder: 'Юридик мавзуни киритинг (масалан, "Дастурий таъминот бўйича муаллифлик ҳуқуқи") ёки калит сўзлар. АИ сиз учун реал суд ишларини қидириб топади.',
      toneLabel: 'Оҳанг',
      depthLabel: 'Таҳлил чуқурлиги',
      generateBtn: 'Қидириш ва таҳлил қилиш',
      generating: 'Суд амалиёти қидирилмоқда...',
      piiWarning: 'Сиз тақдим этилган фактлар асосида юридик казус таҳлили ва амалиётини ўрганмоқчисиз. Илтимос, зарурат бўлмаса, шахсга доир махфий маълумотлар (PII) киритилмаганлигига ишонч ҳосил қилинг.',
      deepAnalysisLabel: 'Чуқур таҳлилни ёқиш (секинроқ, кенг қамровли)',
      resolutionLabel: 'Суд қарори / Якуний ечимни кўрсатиш',
      tones: {
        professional: 'Профессионал',
        student: 'Талаба'
      },
      buttons: {
        nextFacts: 'Кейингиси: Фактлар',
        nextSettings: 'Кейингиси: Созламалар',
        back: 'Орқага'
      },
      tooltips: {
        title: 'Файлларингиз учун ноёб ҳавола ёки ички иш рақами.',
        jurisdiction: 'Ҳозирда фақат Ўзбекистон билан чекланган.',
        area: 'Сунъий интеллектга тегишли процессуал кодексни танлашда ёрдам беради.',
        facts: 'Мавзу ёки калит сўзларни киритинг. АИ Google орқали реал преседентларни топади.',
        tone: 'Талаба режими тушунчаларни содда тушунтиради; Профессионал режим юридик билимни назарда тутади.',
        depth: 'Чуқур таҳлил кўпроқ қоидаларни текширади, лекин яратиш учун кўпроқ вақт олади.'
      },
      validation: {
        required: 'Ушбу майдон тўлдирилиши шарт.',
      },
    },
    result: {
      privileged: 'Махфий ва ишончли',
      generatedBy: 'Casify AI томонидан яратилган',
      summaryHeader: 'Казус тафсилотлари ва Хулоса',
      factsHeader: 'Реал суд иши тафсилотлари',
      analysisHeader: 'Юридик таҳлил (IRAC)',
      risksHeader: 'Рискларни баҳолаш',
      evidenceHeader: 'Далиллар рўйхати',
      stepsHeader: 'Тавсия этилган кейинги қадамлар',
      copyBtn: 'Нусхалаш',
      copySuccess: 'Нусхаланди!',
      printBtn: 'Чоп этиш',
      printPreparing: 'Тайёрланмоқда...',
      newCaseBtn: 'Янги иш',
      sourcesHeader: 'Манбалар ва ҳаволалар',
      practiceAi: {
        title: 'Practice AI',
        greeting: 'Мен сизга юридик тадқиқот ва казус таҳлилида ёрдам бериш учун шу ердаман.'
      }
    },
    about: {
      tagline: 'Келажак юриспруденцияси',
      mission: { title: 'Бизнинг миссиямиз', text: 'Юридик соҳани рақамлаштириш ва ҳуқуқшуносларга энг сўнгги технологиялар ёрдамида чуқур ва аниқ таҳлил тақдим этиш.' },
      tech: { title: 'AI технологияси', text: 'Google Gemini 3 Pro моделлари асосида ишловчи тизим ҳар бир ҳуқуқшуноснинг эҳтиёжига мослаштирилган ноёб ечимларни яратади.' },
      team: { title: 'Ишлаб чиқарувчи', text: 'Ушбу платформа Oxforder МЧЖ томонидан академик мукаммаллик тамойиллари асосида яратилган.' },
    },
    footer: {
      platformHeader: 'Платформа',
      disclaimerHeader: 'Юридик Огоҳлантириш',
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
      subtitle: 'Первая академическая платформа, адаптированная к стандартам ТГЮУ. Создавайте профессиональные кейс-стади, оценки рисков и чек-листы за считанные секунды.',
      cta: 'Начать обучение',
      secondaryCta: 'Быстрый анализ',
      resourcesBtn: 'Подробнее',
    },
    features: {
      deepAnalysis: { title: 'Глубокий юридический анализ', desc: 'Структурированное обоснование IRAC на основе правовых принципов.' },
      bilingual: { title: 'Многоязычная поддержка', desc: 'Свободное владение узбекским, русским и английским языками.' },
      security: { title: 'Безопасность прежде всего', desc: 'Локальная обработка. Никаких внешних баз данных.' },
    },
    form: {
      steps: { metadata: 'Метаданные', facts: 'Факты', review: 'Проверка' },
      titleLabel: 'Название дела / ссылка',
      jurisdictionLabel: 'Юрисдикция',
      areaLabel: 'Область права',
      factsLabel: 'Тема или описание ситуации',
      factsPlaceholder: 'Введите юридическую тему (например, "Авторское право на ПО") или ключевые слова. ИИ найдет реальные судебные дела для вас.',
      toneLabel: 'Тон',
      depthLabel: 'Глубина анализа',
      generateBtn: 'Найти и создать меморандум',
      generating: 'Поиск судебной практики...',
      piiWarning: 'Вы собираетесь создать юридический анализ (кейс-стади) на основе предоставленных фактов. Пожалуйста, убедитесь, что конфиденциальная личная информация (PII) не включена без необходимости.',
      deepAnalysisLabel: 'Включить глубокий анализ (медленнее, более подробно)',
      resolutionLabel: 'Включить решение суда / Итоговый исход',
      tones: {
        professional: 'Профессиональный',
        student: 'Студент'
      },
      buttons: {
        nextFacts: 'Далее: Факты',
        nextSettings: 'Далее: Настройки',
        back: 'Назад'
      },
      tooltips: {
        title: 'Уникальная ссылка или внутренний номер дела для ваших файлов.',
        jurisdiction: 'В настоящее время ограничено Узбекистаном. Скоро будут добавлены другие регионы.',
        area: 'Помогает ИИ выбрать соответствующий процессуальный кодекс (например, ГПК, УПК).',
        facts: 'Введите тему или ключевые слова. ИИ использует Google для поиска реальных прецедентов.',
        tone: 'Режим студента объясняет просто; Профессиональный режим предполагает юридические знания.',
        depth: 'Глубокий анализ проверяет больше правил и прецедентов, но занимает больше времени.'
      },
      validation: {
        required: 'Это поле обязательно.',
      },
    },
    result: {
      privileged: 'Конфиденциально и привилегированно',
      generatedBy: 'Сгенерировано Casify AI',
      summaryHeader: 'Детали дела и Резюме',
      factsHeader: 'Обстоятельства реального дела',
      analysisHeader: 'Юридический анализ (IRAC)',
      risksHeader: 'Оценка рисков',
      evidenceHeader: 'Чек-лист доказательств',
      stepsHeader: 'Рекомендуемые шаги',
      copyBtn: 'Копировать JSON',
      copySuccess: 'Скопировано!',
      printBtn: 'Печать / PDF',
      printPreparing: 'Подготовка...',
      newCaseBtn: 'Новое дело',
      sourcesHeader: 'Источники и ссылки',
      practiceAi: {
        title: 'Practice AI',
        greeting: 'Я здесь, чтобы помочь вам с юридическими исследованиями и анализом дел.'
      }
    },
    about: {
      tagline: 'Юриспруденция будущего',
      mission: { title: 'Наша миссия', text: 'Оцифровать юридические процессы и предоставить юристам глубокий и точный анализ с использованием новейших технологий.' },
      tech: { title: 'Технология ИИ', text: 'Система, работающая на моделях Google Gemini 3 Pro, создает уникальные решения, адаптированные под нужды каждого юриста.' },
      team: { title: 'Разработчик', text: 'Эта платформа была создана ООО Oxforder на основе принципов академического совершенства.' },
    },
    footer: {
      platformHeader: 'Платформа',
      disclaimerHeader: 'Юридический отказ',
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