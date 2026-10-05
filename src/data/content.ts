import {
  ContactDetails,
  FeatureItem,
  GalleryItem,
  LocalizedString,
  OpeningHourRow,
  Product,
  ProductCategory,
  Testimonial,
} from '../types';
import { ASSET_IMAGES } from './images';

export const BRAND_CONFIG = {
  nameEn: 'Zayt Café',
  nameAr: 'مقهى زيت',
  taglineEn: 'Specialty Coffee & Artisan Bakery',
  taglineAr: 'قهوة مختصة ومخبوزات حرفية',
  whatsappNumber: '97148882345',
  phoneDisplay: '+971 4 888 2345',
  email: 'hello@zaytcafe.com',
  addressEn: 'Warehouse 42, Alserkal Arts District, Al Quoz 1, Dubai, UAE',
  addressAr: 'مستودع ٤٢، حي السركال للفنون، القوز ١، دبي، الإمارات العربية المتحدة',
  parkingEn: 'Complimentary valet & shaded avenue parking available',
  parkingAr: 'خدمة صف سيارات مجانية ومواقف مظللة متوفرة في الحي',
};

export const NAV_LINKS: { id: string; label: LocalizedString; href: string }[] = [
  { id: 'home', label: { en: 'Home', ar: 'الرئيسية' }, href: '#home' },
  { id: 'menu', label: { en: 'Menu', ar: 'القائمة' }, href: '#menu' },
  { id: 'about', label: { en: 'About Us', ar: 'قصتنا' }, href: '#about' },
  { id: 'gallery', label: { en: 'Gallery', ar: 'المعرض' }, href: '#gallery' },
  { id: 'location', label: { en: 'Visit & Hours', ar: 'الموقع وساعات العمل' }, href: '#location' },
  { id: 'contact', label: { en: 'Contact', ar: 'تواصل معنا' }, href: '#contact' },
];

export const MENU_CATEGORIES: { id: ProductCategory; label: LocalizedString }[] = [
  { id: 'all', label: { en: 'All Items', ar: 'جميع الأصناف' } },
  { id: 'specialty-coffee', label: { en: 'Specialty Coffee', ar: 'القهوة المختصة' } },
  { id: 'hot-drinks', label: { en: 'Hot Drinks', ar: 'مشروبات ساخنة' } },
  { id: 'cold-drinks', label: { en: 'Cold Drinks', ar: 'مشروبات باردة' } },
  { id: 'pastries', label: { en: 'Pastries', ar: 'المعجنات الفاخرة' } },
  { id: 'bakery', label: { en: 'Bakery', ar: 'المخبوزات الحرفية' } },
  { id: 'breakfast', label: { en: 'Breakfast', ar: 'الفطور المتوسطي' } },
  { id: 'desserts', label: { en: 'Desserts', ar: 'الحلويات' } },
];

export const PRODUCTS: Product[] = [
  // Specialty Coffee
  {
    id: 'prod-pistachio-latte',
    name: { en: 'Zayt Pistachio Latte', ar: 'لاتيه الفستق المميز من زيت' },
    description: {
      en: 'Double shot of single-origin espresso with silky steamed milk and house-ground Iranian pistachio cream.',
      ar: 'جرعتان من الإسبريسو الفاخر مع حليب مبخر حريري وكريمة الفستق الحلبي المحضرة يدويًا.',
    },
    price: 28,
    currency: { en: 'AED', ar: 'د.إ' },
    category: 'specialty-coffee',
    image: ASSET_IMAGES.pistachioLatte,
    badge: { en: 'Popular', ar: 'الأكثر طلباً', type: 'popular' },
    isFeatured: true,
  },
  {
    id: 'prod-yemeni-v60',
    name: { en: 'Yemeni Haraaz V60', ar: 'قهوة مقطرة V60 حراز اليمنية' },
    description: {
      en: 'Rare ancient high-altitude varietal featuring expressive notes of dried figs, wild honey, and delicate jasmine.',
      ar: 'محصول يمني عريق نادر من جبال حراز بإيحاءات التين المجفف والعسل البري والياسمين.',
    },
    price: 34,
    currency: { en: 'AED', ar: 'د.إ' },
    category: 'specialty-coffee',
    image: ASSET_IMAGES.heroInterior,
    badge: { en: "Chef's Choice", ar: 'اختيار الباريستا', type: 'chef' },
    isFeatured: true,
  },
  {
    id: 'prod-cardamom-cortado',
    name: { en: 'Cardamom & Saffron Cortado', ar: 'كورتادو بالهيل والزعفران' },
    description: {
      en: 'Equal parts rich espresso and warm textured milk gently infused with freshly crushed green cardamom and saffron.',
      ar: 'توازن دقيق بين الإسبريسو المركز والحليب الدافئ مع لمسة الهيل الأخضر المطحون وخيوط الزعفران.',
    },
    price: 24,
    currency: { en: 'AED', ar: 'د.إ' },
    category: 'specialty-coffee',
    image: ASSET_IMAGES.pistachioLatte,
  },
  {
    id: 'prod-honey-flat-white',
    name: { en: 'Orange Blossom Flat White', ar: 'فلات وايت بماء زهر البرتقال' },
    description: {
      en: 'Silky micro-foam poured over sweet Ethiopian espresso with a hint of distilled Lebanese orange blossom water.',
      ar: 'رغوة حليب دقيقة تُسكب على إسبريسو إثيوبي بطبقات زهرية ولمسة من ماء زهر البرتقال الطبيعي.',
    },
    price: 26,
    currency: { en: 'AED', ar: 'د.إ' },
    category: 'specialty-coffee',
    image: ASSET_IMAGES.pistachioLatte,
    badge: { en: 'New', ar: 'جديد', type: 'new' },
  },

  // Hot Drinks
  {
    id: 'prod-ceremonial-matcha',
    name: { en: 'Ceremonial Matcha Latte', ar: 'ماتشا لاتيه احتفالية بالخروب' },
    description: {
      en: 'First-harvest Uji ceremonial matcha whisked with warm oat milk and a touch of wild Mediterranean carob syrup.',
      ar: 'ماتشا أوجي يابانية من القطفة الأولى تُخفق مع حليب الشوفان ولمسة من دبس الخروب الطبيعي.',
    },
    price: 30,
    currency: { en: 'AED', ar: 'د.إ' },
    category: 'hot-drinks',
    image: ASSET_IMAGES.heroInterior,
    badge: { en: 'Popular', ar: 'الأكثر طلباً', type: 'popular' },
  },
  {
    id: 'prod-spiced-karak',
    name: { en: 'Artisan Royal Karak', ar: 'كرك ملكي بالتوابل والزعفران' },
    description: {
      en: 'Slow-simmered Assam black tea with crushed cardamom, cinnamon bark, pure saffron, and rich milk.',
      ar: 'شاي أسود معتق يُطهى ببطء مع حبات الهيل وعيدان القرفة وخيوط الزعفران الفاخر.',
    },
    price: 22,
    currency: { en: 'AED', ar: 'د.إ' },
    category: 'hot-drinks',
    image: ASSET_IMAGES.pistachioLatte,
  },
  {
    id: 'prod-valrhona-chocolate',
    name: { en: 'Valrhona Sea Salt Dark Chocolate', ar: 'شوكولاتة فالرونا الداكنة بالملح البحري' },
    description: {
      en: '70% single-origin French Valrhona chocolate steamed with creamy milk and sea salt flakes.',
      ar: 'شوكولاتة فرنسية داكنة بنسبة ٧٠٪ مع حليب كامل الدسم ورشة من بلورات الملح البحري.',
    },
    price: 27,
    currency: { en: 'AED', ar: 'د.إ' },
    category: 'hot-drinks',
    image: ASSET_IMAGES.pistachioLatte,
  },

  // Cold Drinks
  {
    id: 'prod-cold-brew-tahini',
    name: { en: 'Cold Brew with Sweet Tahini Foam', ar: 'كولد برو برغوة الطحينة الحلوة' },
    description: {
      en: '24-hour steeped Colombian cold brew crowned with airy velvety sesame tahini cream and toasted sesame seeds.',
      ar: 'قهوة كولد برو كولومبية منقوعة لمدة ٢٤ ساعة تعلوها رغوة الطحينة الحريرية والسمسم المحمص.',
    },
    price: 29,
    currency: { en: 'AED', ar: 'د.إ' },
    category: 'cold-drinks',
    image: ASSET_IMAGES.pistachioLatte,
    badge: { en: 'Signature', ar: 'صنف حصري', type: 'signature' },
    isFeatured: true,
  },
  {
    id: 'prod-hibiscus-spritz',
    name: { en: 'Pomegranate & Rose Hibiscus Spritz', ar: 'سبريتز الكركديه بالرمان والورد' },
    description: {
      en: 'Cold-steeped Egyptian hibiscus infused with fresh pomegranate reduction and sparkling mineral water.',
      ar: 'كركديه مصري منقوع بارداً مع خلاصة الرمان الطازج والماء الفوار وأوراق النعناع.',
    },
    price: 25,
    currency: { en: 'AED', ar: 'د.إ' },
    category: 'cold-drinks',
    image: ASSET_IMAGES.pistachioLatte,
  },

  // Pastries
  {
    id: 'prod-cardamom-bun',
    name: { en: 'Cardamom & Saffron Morning Bun', ar: 'كعكة الصباح بالهيل والزعفران' },
    description: {
      en: 'Slow-laminated buttery brioche dough swirled with aromatic Swedish cardamom and Persian saffron sugar.',
      ar: 'عجينة بريوش مورقة مخبوزة بالسمن الحيواني الفاخر مع حشوة الهيل العطري وسكر الزعفران.',
    },
    price: 24,
    currency: { en: 'AED', ar: 'د.إ' },
    category: 'pastries',
    image: ASSET_IMAGES.cardamomPastry,
    badge: { en: 'Signature', ar: 'صنف حصري', type: 'signature' },
    isFeatured: true,
  },
  {
    id: 'prod-pistachio-croissant',
    name: { en: 'Twice-Baked Pistachio Baklava Croissant', ar: 'كرواسون البقلاوة بالفستق الحلبي' },
    description: {
      en: 'Golden flaky French butter croissant filled with pistachio frangipane, drizzled with orange blossom glaze.',
      ar: 'كرواسون فرنسي ذهبي مقرمش محشو بفرانجيبان الفستق الحلبي ومُعطّر بقطر ماء الزهر الخفيف.',
    },
    price: 26,
    currency: { en: 'AED', ar: 'د.إ' },
    category: 'pastries',
    image: ASSET_IMAGES.cardamomPastry,
    badge: { en: 'Popular', ar: 'الأكثر طلباً', type: 'popular' },
    isFeatured: true,
  },
  {
    id: 'prod-rose-bostock',
    name: { en: 'Damascene Rose & Almond Bostock', ar: 'توست البوستوك باللوز وورد الشام' },
    description: {
      en: 'Thick toasted brioche soaked in orange syrup, layered with sweet almond cream and dried Damask rose petals.',
      ar: 'شريحة بريوش مقرمشة مشربة بشراب الحمضيات مع كريمة اللوز المحمصة وبتلات الورد الجوري الدمشقي.',
    },
    price: 23,
    currency: { en: 'AED', ar: 'د.إ' },
    category: 'pastries',
    image: ASSET_IMAGES.cardamomPastry,
  },

  // Bakery
  {
    id: 'prod-zaatar-focaccia',
    name: { en: 'Wild Zaatar & Extra Virgin Olive Focaccia', ar: 'فوكاتشيا الزعتر البري وزيت الزيتون البكر' },
    description: {
      en: 'Naturally leavened sourdough focaccia with cold-pressed olive oil, roasted cherry tomatoes, and wild thyme.',
      ar: 'خبز فوكاتشيا بالتخمير الطبيعي مشبع بزيت زيتون بلدي بكر، وطماطم كرزية مشوية، وزعتر بري جبلي.',
    },
    price: 25,
    currency: { en: 'AED', ar: 'د.إ' },
    category: 'bakery',
    image: ASSET_IMAGES.zaatarFocaccia,
    badge: { en: "Chef's Choice", ar: 'اختيار الشيف', type: 'chef' },
    isFeatured: true,
  },
  {
    id: 'prod-sourdough-loaf',
    name: { en: '48-Hour Heritage Sourdough Loaf', ar: 'رغيف السور دو المعتق ٤٨ ساعة' },
    description: {
      en: 'Slow-fermented artisan country bread with deeply caramelized crust, open airy crumb, and gentle sour notes.',
      ar: 'خبز ريفي حرفي معجون بحبوب كاملة ومختمر ببطء لمدة ٤٨ ساعة بقشرة مقرمشة محمرة ولباب هوائي.',
    },
    price: 28,
    currency: { en: 'AED', ar: 'د.إ' },
    category: 'bakery',
    image: ASSET_IMAGES.zaatarFocaccia,
  },
  {
    id: 'prod-halva-babka',
    name: { en: 'Dark Chocolate & Tahini Halva Babka', ar: 'بابكا الشوكولاتة الداكنة وحلاوة الطحينية' },
    description: {
      en: 'Braided buttery yeast dough layered with 70% dark cocoa and swirls of artisanal crumbly sesame halva.',
      ar: 'جديلة من العجين المخمر الفاخر بحشوة الشوكولاتة الداكنة وقطع الحلاوة الطحينية الفاخرة.',
    },
    price: 24,
    currency: { en: 'AED', ar: 'د.إ' },
    category: 'bakery',
    image: ASSET_IMAGES.cardamomPastry,
  },

  // Breakfast
  {
    id: 'prod-whipped-labneh-eggs',
    name: { en: 'Whipped Garlic Labneh & Turkish Poached Eggs', ar: 'لبنة مخفوقة وبيض بوشيه بصلصة حلب' },
    description: {
      en: 'Organic poached eggs on creamy garlic labneh, drizzled with warm Aleppo pepper chili butter and warm sourdough.',
      ar: 'بيض عضوي مسلوق على طبقة لبنة كريمية بالثوم الخفيف مع زبدة الفلفل الحلبي الدافئة وخبز السور دو المحمص.',
    },
    price: 48,
    currency: { en: 'AED', ar: 'د.إ' },
    category: 'breakfast',
    image: ASSET_IMAGES.zaatarFocaccia,
    badge: { en: 'Popular', ar: 'الأكثر طلباً', type: 'popular' },
  },
  {
    id: 'prod-shakshuka-skillet',
    name: { en: 'Cast-Iron Heirloom Tomato Shakshuka', ar: 'شكشوكة الطماطم البلدية في مقلاة الزهر' },
    description: {
      en: 'Spiced tomato, bell pepper, and cumin stew with baked eggs, Greek feta, fresh coriander, and crusty bread.',
      ar: 'صلصة طماطم بلدية مطهوة بالكمون والفلفل المشوي مع بيض مخبوز وجبن الفيتا وأوراق الكزبرة.',
    },
    price: 46,
    currency: { en: 'AED', ar: 'د.إ' },
    category: 'breakfast',
    image: ASSET_IMAGES.zaatarFocaccia,
  },

  // Desserts
  {
    id: 'prod-kunafa-cheesecake',
    name: { en: 'Crispy Kunafa Orange Blossom Cheesecake', ar: 'تشيز كيك الكنافة المقرمشة بماء الزهر' },
    description: {
      en: 'Creamy Akkawi and mascarpone cheese filling on a crispy buttered kataifi pastry base with pistachio dust.',
      ar: 'مزيج حريري من جبن العكاوي والماسكاربوني فوق قاعدة كنافة قطايف مقرمشة بالزبدة والفستق الناعم.',
    },
    price: 36,
    currency: { en: 'AED', ar: 'د.إ' },
    category: 'desserts',
    image: ASSET_IMAGES.cardamomPastry,
    badge: { en: 'Signature', ar: 'صنف حصري', type: 'signature' },
  },
  {
    id: 'prod-olive-oil-cake',
    name: { en: 'Mediterranean Olive Oil & Citrus Cake', ar: 'كعكة زيت الزيتون المتوسطي بالحمضيات' },
    description: {
      en: 'Moist and tender crumb made with single-estate olive oil, Meyer lemon zest, and whipped vanilla ricotta.',
      ar: 'كعكة إسفنجية غنية بزيت الزيتون المعصور على البارد وبرش ليمون ماير تعلوها ريكوتا الفانيليا المخفوقة.',
    },
    price: 32,
    currency: { en: 'AED', ar: 'د.إ' },
    category: 'desserts',
    image: ASSET_IMAGES.zaatarFocaccia,
    badge: { en: 'New', ar: 'جديد', type: 'new' },
  },
];

export const FEATURES: FeatureItem[] = [
  {
    id: 'feat-coffee',
    title: { en: 'Ethical Single Origins', ar: 'محاصيل بن نادرة ومستدامة' },
    description: {
      en: 'Direct trade green beans from Yemen, Ethiopia, and Colombia, roasted in small batches to preserve terroir and nuanced aromatics.',
      ar: 'نستورد حبوب البن الخضراء مباشرة من مزارع حراز اليمنية وإثيوبيا وكولومبيا ونحمصها على دفعات صغيرة لإبراز النكهات الفريدة.',
    },
    iconName: 'coffee',
  },
  {
    id: 'feat-bakery',
    title: { en: '48-Hour Slow Fermentation', ar: 'تخمير طبيعي بطيء لمدة ٤٨ ساعة' },
    description: {
      en: 'Artisan sourdough and viennoiserie baked at dawn every morning using unbleached stoneground flours and cultured French butter.',
      ar: 'مخبوزات ومعجنات يومية طازجة تُخبز عند الفجر بتخمير طبيعي طويل لتحقيق قوام مثالي وسهولة هضم فائقة.',
    },
    iconName: 'croissant',
  },
  {
    id: 'feat-botanicals',
    title: { en: 'Levantine Botanical Flavors', ar: 'لمسات عطرية شامية ومتوسطية' },
    description: {
      en: 'Authentic regional infusions: wild mountain zaatar, cold-pressed olive oils, green cardamom, orange blossom, and pistachio.',
      ar: 'نجمع بين فنون المطبخ المتوسطي والشامي: الزعتر الجبلي، زيت الزيتون البكر، الهيل الأخضر، زهر البرتقال، والفستق الحلبي.',
    },
    iconName: 'sparkles',
  },
  {
    id: 'feat-hospitality',
    title: { en: 'Sanctuary of Hospitality', ar: 'ملاذ دافئ وكرم ضيافة أصيل' },
    description: {
      en: 'Natural travertine stone, shaded olive trees, curated acoustics, and genuine warmth designed for lingering conversations.',
      ar: 'مساحة مريحة مصممة بحجر الترافرتين الطبيعي وظلال أشجار الزيتون، توفر بيئة هادئة للاسترخاء واللقاءات الملهمة.',
    },
    iconName: 'heart-handshake',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: { en: 'Layla Al-Mansoor', ar: 'ليلى المنصور' },
    role: { en: 'Architecture & Design Critic', ar: 'ناقدة معمارية ومصممة' },
    content: {
      en: 'Zayt achieves what few modern cafes manage: genuine warmth without the pretense. The Pistachio Latte and Cardamom Morning Bun are simply unmatched.',
      ar: 'ينجح مقهى زيت في تقديم تجربة راقية دون تكلف. لاتيه الفستق وكعكة الهيل والزعفران هنا لا مثيل لهما في المدينة بأكملها.',
    },
    rating: 5,
    source: { en: 'Architectural Digest Middle East', ar: 'آركيتكتشرال دايجست الشرق الأوسط' },
  },
  {
    id: 'test-2',
    name: { en: 'Julian Vance', ar: 'جوليان فانس' },
    role: { en: 'Specialty Coffee Q-Grader', ar: 'خبير تذوق قهوة مختصة معتمد' },
    content: {
      en: 'Their extraction consistency on the Yemeni Haraaz V60 is extraordinary. Clear jasmine florals and dried stone fruits in every clean sip.',
      ar: 'دقة الاستخلاص في محصول حراز اليمني مذهلة حقاً. إيحاءات الياسمين والفاكهة المجففة واضحة ومتناغمة في كل رشفة.',
    },
    rating: 5,
    source: { en: 'Specialty Coffee Reviewer', ar: 'مقيّم القهوة المختصة' },
  },
  {
    id: 'test-3',
    name: { en: 'Tariq El-Husseini', ar: 'طارق الحسيني' },
    role: { en: 'Al Quoz Creative Director', ar: 'مدير إبداعي بحي القوز' },
    content: {
      en: 'The zaatar focaccia with cold-pressed olive oil has become my daily morning ritual. A modern masterpiece of Mediterranean comfort.',
      ar: 'أصبحت فوكاتشيا الزعتر وزيت الزيتون طقسي اليومي في الصباح قبل بدء العمل في الاستوديو. تحفة معاصرة في عالم المخبوزات.',
    },
    rating: 5,
    source: { en: 'Daily Regular Patron', ar: 'زبون دائم' },
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: { en: 'Sunlit Archway Interior', ar: 'المساحة الداخلية تحت الأقواس' },
    category: { en: 'Atmosphere', ar: 'أجواء المقهى' },
    image: ASSET_IMAGES.heroInterior,
    alt: {
      en: 'Sunlight casting warm shadows on limestone arches and travertine coffee counter at Zayt Café',
      ar: 'أشعة الشمس تنعكس على أقواس الحجر الجيري وكونتر القهوة المصنوع من الترافرتين في مقهى زيت',
    },
    aspect: 'wide',
  },
  {
    id: 'gal-2',
    title: { en: 'Signature Pistachio Extraction', ar: 'تحضير لاتيه الفستق المميز' },
    category: { en: 'Specialty Bar', ar: 'ركن الباريستا' },
    image: ASSET_IMAGES.pistachioLatte,
    alt: {
      en: 'Layered iced pistachio latte with crushed vibrant emerald pistachios on a stone pedestal',
      ar: 'لاتيه الفستق المثلج ذو الطبقات مع رشة من الفستق الحلبي الأخضر على قاعدة حجرية',
    },
    aspect: 'square',
  },
  {
    id: 'gal-3',
    title: { en: 'Morning Cardamom Viennoiserie', ar: 'معجنات الهيل الصباحية الفاخرة' },
    category: { en: 'Artisan Bakery', ar: 'المخبز الحرفي' },
    image: ASSET_IMAGES.cardamomPastry,
    alt: {
      en: 'Freshly baked flaky cardamom saffron buns on ceramic tableware with morning linen',
      ar: 'كعكات الهيل والزعفران المورقة المخبوزة طازجة على أوانٍ فخارية راقية',
    },
    aspect: 'square',
  },
  {
    id: 'gal-4',
    title: { en: 'Wild Zaatar Sourdough Focaccia', ar: 'فوكاتشيا الزعتر البري وزيت الزيتون' },
    category: { en: 'Oven Heritage', ar: 'أفران التراث' },
    image: ASSET_IMAGES.zaatarFocaccia,
    alt: {
      en: 'Rustic sourdough focaccia topped with wild thyme and virgin olive oil',
      ar: 'خبز فوكاتشيا ريفي بالتخمير الطبيعي مزين بالزعتر البري وزيت الزيتون البكر',
    },
    aspect: 'square',
  },
  {
    id: 'gal-5',
    title: { en: 'Olive Garden Courtyard Terrace', ar: 'تراس حديقة الزيتون الخارجية' },
    category: { en: 'Outdoor Living', ar: 'الجلسات الخارجية' },
    image: ASSET_IMAGES.terraceExterior,
    alt: {
      en: 'Quiet shaded Mediterranean outdoor cafe terrace with olive trees and modern dining chairs',
      ar: 'تراس خارجي هادئ ومظلل بأشجار الزيتون ومقاعد مريحة في الهواء الطلق',
    },
    aspect: 'wide',
  },
];

export const OPENING_HOURS: OpeningHourRow[] = [
  {
    days: { en: 'Monday – Thursday', ar: 'الإثنين – الخميس' },
    hours: { en: '7:30 AM – 10:00 PM', ar: '٧:٣٠ ص – ١٠:٠٠ م' },
  },
  {
    days: { en: 'Friday', ar: 'الجمعة' },
    hours: { en: '7:30 AM – 11:30 PM', ar: '٧:٣٠ ص – ١١:٣٠ م' },
  },
  {
    days: { en: 'Saturday – Sunday', ar: 'السبت – الأحد' },
    hours: { en: '8:00 AM – 11:30 PM', ar: '٨:٠٠ ص – ١١:٣٠ م' },
    isToday: true,
  },
];

export const CONTACT_DATA: ContactDetails = {
  brandName: { en: 'Zayt Café', ar: 'مقهى زيت' },
  tagline: { en: 'Specialty Coffee & Artisan Bakery', ar: 'قهوة مختصة ومخبوزات حرفية' },
  address: {
    en: 'Warehouse 42, Alserkal Arts District, Al Quoz 1, Dubai',
    ar: 'مستودع ٤٢، حي السركال للفنون، القوز ١، دبي',
  },
  neighborhood: {
    en: 'Near The Yard & Concrete gallery space',
    ar: 'بالقرب من مساحة ذا يارد وقاعة كونكريت',
  },
  phone: '+97148882345',
  phoneDisplay: '+971 4 888 2345',
  whatsappNumber: '97148882345',
  email: 'hello@zaytcafe.com',
  googleMapsEmbedUrl: 'https://maps.google.com/maps?q=Alserkal+Avenue+Dubai&t=&z=15&ie=UTF8&iwloc=&output=embed',
  googleMapsDirectionsUrl: 'https://maps.google.com/?q=Alserkal+Avenue+Dubai',
  parkingInfo: {
    en: 'Valet parking available at Main Avenue Entrance. Ample public street parking within 2 minutes walk.',
    ar: 'خدمة صف السيارات متوفرة عند مدخل الجادة الرئيسي. تتوفر مواقف عامة على بُعد دقيقتين سيراً.',
  },
};

/**
 * Builds a WhatsApp wa.me link with customized pre-filled message
 */
export function buildWhatsAppUrl(productName?: string, lang: 'en' | 'ar' = 'en'): string {
  const phone = BRAND_CONFIG.whatsappNumber;
  let text = '';

  if (productName) {
    if (lang === 'ar') {
      text = `مرحباً مقهى زيت، أود أن أطلب صنف: ${productName}. هل يمكنكم تأكيد توفره وترتيب الاستلام؟`;
    } else {
      text = `Hello Zayt Café, I would like to order the "${productName}". Could you please confirm availability and pickup details?`;
    }
  } else {
    if (lang === 'ar') {
      text = `مرحباً مقهى زيت، أود الاستفسار عن القائمة وحجز طاولة أو طلب مسبق. شكرًا لكم!`;
    } else {
      text = `Hello Zayt Café, I would like to inquire about your menu, table availability, or a preorder. Thank you!`;
    }
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
