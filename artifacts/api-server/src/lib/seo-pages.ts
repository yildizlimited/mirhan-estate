interface LocationDef {
  name: string;
  slug: string;
  city: string;
  district: string;
  neighborhood: string;
  parentSlug?: string;
  desc: string;
}

interface PropertyTypeDef {
  name: string;
  slug: string;
  type: string;
}

interface ListingTypeDef {
  name: string;
  slug: string;
  type: string;
}

const LOCATIONS: LocationDef[] = [
  { name: "İstanbul", slug: "istanbul", city: "İstanbul", district: "", neighborhood: "", desc: "İki kıtaya yayılan dünyanın en büyük şehri İstanbul'da" },

  { name: "Beşiktaş", slug: "istanbul-besiktas", city: "İstanbul", district: "Beşiktaş", neighborhood: "", parentSlug: "istanbul", desc: "Beşiktaş'ın Boğaz manzaralı prestijli lokasyonlarında" },
  { name: "Levent", slug: "besiktas-levent", city: "İstanbul", district: "Beşiktaş", neighborhood: "Levent", parentSlug: "istanbul-besiktas", desc: "Levent'in iş merkezi ve lüks rezidanslarında" },
  { name: "Etiler", slug: "besiktas-etiler", city: "İstanbul", district: "Beşiktaş", neighborhood: "Etiler", parentSlug: "istanbul-besiktas", desc: "Etiler'in elit ve sakin mahallelerinde" },
  { name: "Ortaköy", slug: "besiktas-ortakoy", city: "İstanbul", district: "Beşiktaş", neighborhood: "Ortaköy", parentSlug: "istanbul-besiktas", desc: "Ortaköy'ün Boğaz kıyısındaki büyüleyici konumlarında" },
  { name: "Bebek", slug: "besiktas-bebek", city: "İstanbul", district: "Beşiktaş", neighborhood: "Bebek", parentSlug: "istanbul-besiktas", desc: "Bebek'in Boğaz manzaralı ve prestijli yaşam alanlarında" },

  { name: "Kadıköy", slug: "istanbul-kadikoy", city: "İstanbul", district: "Kadıköy", neighborhood: "", parentSlug: "istanbul", desc: "Kadıköy'ün canlı ve kültürel yaşam merkezinde" },
  { name: "Moda", slug: "kadikoy-moda", city: "İstanbul", district: "Kadıköy", neighborhood: "Moda", parentSlug: "istanbul-kadikoy", desc: "Moda'nın sakin sahil yaşamı ve tarihi dokusunda" },
  { name: "Caferağa", slug: "kadikoy-caferaga", city: "İstanbul", district: "Kadıköy", neighborhood: "Caferağa", parentSlug: "istanbul-kadikoy", desc: "Caferağa'nın merkezi ve sosyal imkânlara yakın konumlarında" },
  { name: "Bostancı", slug: "kadikoy-bostanci", city: "İstanbul", district: "Kadıköy", neighborhood: "Bostancı", parentSlug: "istanbul-kadikoy", desc: "Bostancı'nın sahil şeridi ve modern yaşam alanlarında" },
  { name: "Fenerbahçe", slug: "kadikoy-fenerbahce", city: "İstanbul", district: "Kadıköy", neighborhood: "Fenerbahçe", parentSlug: "istanbul-kadikoy", desc: "Fenerbahçe'nin deniz kenarındaki sakin ve yeşil mahallelerinde" },

  { name: "Şişli", slug: "istanbul-sisli", city: "İstanbul", district: "Şişli", neighborhood: "", parentSlug: "istanbul", desc: "Şişli'nin ticaret ve konut merkezinde" },
  { name: "Nişantaşı", slug: "sisli-nisantasi", city: "İstanbul", district: "Şişli", neighborhood: "Nişantaşı", parentSlug: "istanbul-sisli", desc: "Nişantaşı'nın Avrupa yakasının en prestijli alışveriş ve yaşam bölgesinde" },
  { name: "Mecidiyeköy", slug: "sisli-mecidiyekoy", city: "İstanbul", district: "Şişli", neighborhood: "Mecidiyeköy", parentSlug: "istanbul-sisli", desc: "Mecidiyeköy'ün iş merkezlerine ve ulaşıma yakın konumlarında" },
  { name: "Fulya", slug: "sisli-fulya", city: "İstanbul", district: "Şişli", neighborhood: "Fulya", parentSlug: "istanbul-sisli", desc: "Fulya'nın sakin ve merkezi yaşam alanlarında" },

  { name: "Sarıyer", slug: "istanbul-sariyer", city: "İstanbul", district: "Sarıyer", neighborhood: "", parentSlug: "istanbul", desc: "Sarıyer'in Boğaz kıyısındaki doğal ve lüks yaşam alanlarında" },
  { name: "Maslak", slug: "sariyer-maslak", city: "İstanbul", district: "Sarıyer", neighborhood: "Maslak", parentSlug: "istanbul-sariyer", desc: "Maslak'ın İstanbul'un en büyük iş merkezi bölgesinde" },
  { name: "Tarabya", slug: "sariyer-tarabya", city: "İstanbul", district: "Sarıyer", neighborhood: "Tarabya", parentSlug: "istanbul-sariyer", desc: "Tarabya'nın Boğaz kıyısındaki tarihi ve lüks villalarında" },
  { name: "Bahçeköy", slug: "sariyer-bahcekoy", city: "İstanbul", district: "Sarıyer", neighborhood: "Bahçeköy", parentSlug: "istanbul-sariyer", desc: "Bahçeköy'ün Belgrad Ormanı'na yakın sakin ve yeşil bölgesinde" },

  { name: "Üsküdar", slug: "istanbul-uskudar", city: "İstanbul", district: "Üsküdar", neighborhood: "", parentSlug: "istanbul", desc: "Üsküdar'ın tarihi ve huzurlu Anadolu Yakası atmosferinde" },
  { name: "Bağlarbaşı", slug: "uskudar-baglarbaşi", city: "İstanbul", district: "Üsküdar", neighborhood: "Bağlarbaşı", parentSlug: "istanbul-uskudar", desc: "Bağlarbaşı'nın Boğaz manzaralı sakin konut bölgesinde" },
  { name: "Kuzguncuk", slug: "uskudar-kuzguncuk", city: "İstanbul", district: "Üsküdar", neighborhood: "Kuzguncuk", parentSlug: "istanbul-uskudar", desc: "Kuzguncuk'un tarihi dokusu ve Boğaz kıyısındaki özel konumlarında" },
  { name: "Beylerbeyi", slug: "uskudar-beylerbeyi", city: "İstanbul", district: "Üsküdar", neighborhood: "Beylerbeyi", parentSlug: "istanbul-uskudar", desc: "Beylerbeyi'nin Boğaz manzaralı lüks villalarında ve yalılarında" },

  { name: "Fatih", slug: "istanbul-fatih", city: "İstanbul", district: "Fatih", neighborhood: "", parentSlug: "istanbul", desc: "Fatih'in tarihi yarımada ve kültürel zenginliğinde" },
  { name: "Sultanahmet", slug: "fatih-sultanahmet", city: "İstanbul", district: "Fatih", neighborhood: "Sultanahmet", parentSlug: "istanbul-fatih", desc: "Sultanahmet'in dünyaca ünlü tarihi yapıların gölgesinde" },
  { name: "Fener-Balat", slug: "fatih-fener-balat", city: "İstanbul", district: "Fatih", neighborhood: "Fener-Balat", parentSlug: "istanbul-fatih", desc: "Fener-Balat'ın restore edilen tarihi evlerinde ve hızla değerlenen bölgesinde" },

  { name: "Beylikdüzü", slug: "istanbul-beylikduzu", city: "İstanbul", district: "Beylikdüzü", neighborhood: "", parentSlug: "istanbul", desc: "Beylikdüzü'nün modern konut projeleri ve uygun fiyatlarında" },
  { name: "Adnan Kahveci", slug: "beylikduzu-adnankahveci", city: "İstanbul", district: "Beylikdüzü", neighborhood: "Adnan Kahveci", parentSlug: "istanbul-beylikduzu", desc: "Adnan Kahveci Mahallesi'nin yeni ve kapsamlı konut projelerinde" },
  { name: "Yakuplu", slug: "beylikduzu-yakuplu", city: "İstanbul", district: "Beylikdüzü", neighborhood: "Yakuplu", parentSlug: "istanbul-beylikduzu", desc: "Yakuplu'nun hızla gelişen modern konut alanlarında" },

  { name: "Başakşehir", slug: "istanbul-basaksehir", city: "İstanbul", district: "Başakşehir", neighborhood: "", parentSlug: "istanbul", desc: "Başakşehir'in planlı kentsel dönüşümü ve modern yaşam projelerinde" },
  { name: "Kayaşehir", slug: "basaksehir-kayasehir", city: "İstanbul", district: "Başakşehir", neighborhood: "Kayaşehir", parentSlug: "istanbul-basaksehir", desc: "Kayaşehir'in büyük ölçekli kentsel konut projelerinde" },
  { name: "Güvercintepe", slug: "basaksehir-guvercintepe", city: "İstanbul", district: "Başakşehir", neighborhood: "Güvercintepe", parentSlug: "istanbul-basaksehir", desc: "Güvercintepe'nin havalimanına yakın ve gelişen bölgelerinde" },

  { name: "Ataşehir", slug: "istanbul-atasehir", city: "İstanbul", district: "Ataşehir", neighborhood: "", parentSlug: "istanbul", desc: "Ataşehir'in modern finans merkezi ve yüksek yapılarında" },
  { name: "Barbaros", slug: "atasehir-barbaros", city: "İstanbul", district: "Ataşehir", neighborhood: "Barbaros", parentSlug: "istanbul-atasehir", desc: "Barbaros Mahallesi'nin İstanbul Finans Merkezi'ne yakın konumlarında" },
  { name: "İçerenköy", slug: "atasehir-icerenkoy", city: "İstanbul", district: "Ataşehir", neighborhood: "İçerenköy", parentSlug: "istanbul-atasehir", desc: "İçerenköy'ün yerleşik ve değerli konut bölgelerinde" },

  { name: "Maltepe", slug: "istanbul-maltepe", city: "İstanbul", district: "Maltepe", neighborhood: "", parentSlug: "istanbul", desc: "Maltepe'nin sahil şeridi ve değişen kentsel dönüşüm alanlarında" },
  { name: "Bağlarbaşı", slug: "maltepe-baglarbaşi", city: "İstanbul", district: "Maltepe", neighborhood: "Bağlarbaşı", parentSlug: "istanbul-maltepe", desc: "Maltepe Bağlarbaşı'nın sakin ve köklü konut bölgesinde" },

  { name: "Pendik", slug: "istanbul-pendik", city: "İstanbul", district: "Pendik", neighborhood: "", parentSlug: "istanbul", desc: "Pendik'in sahil ve Sabiha Gökçen Havalimanı'na yakın bölgelerinde" },
  { name: "Kurtköy", slug: "pendik-kurtkoy", city: "İstanbul", district: "Pendik", neighborhood: "Kurtköy", parentSlug: "istanbul-pendik", desc: "Kurtköy'ün havalimanına yakın ve gelişen yatırım bölgelerinde" },

  { name: "Esenyurt", slug: "istanbul-esenyurt", city: "İstanbul", district: "Esenyurt", neighborhood: "", parentSlug: "istanbul", desc: "Esenyurt'un uygun fiyatlı ve kalabalık konut projelerinde" },
  { name: "Bahçeşehir", slug: "istanbul-bahcesehir", city: "İstanbul", district: "Bahçeşehir", neighborhood: "", parentSlug: "istanbul", desc: "Bahçeşehir'in planlı ve yeşil kentsel yaşam projesinde" },
  { name: "Büyükçekmece", slug: "istanbul-buyukcekmece", city: "İstanbul", district: "Büyükçekmece", neighborhood: "", parentSlug: "istanbul", desc: "Büyükçekmece'nin gölü ve denizi olan doğal yaşam bölgesinde" },
  { name: "Küçükçekmece", slug: "istanbul-kucukcekmece", city: "İstanbul", district: "Küçükçekmece", neighborhood: "", parentSlug: "istanbul", desc: "Küçükçekmece'nin göl kıyısındaki ve ulaşıma yakın konumlarında" },
  { name: "Bağcılar", slug: "istanbul-bagcilar", city: "İstanbul", district: "Bağcılar", neighborhood: "", parentSlug: "istanbul", desc: "Bağcılar'ın hızla dönüşen ve uygun fiyatlı konut alanlarında" },
  { name: "Gaziosmanpaşa", slug: "istanbul-gaziosmanpasa", city: "İstanbul", district: "Gaziosmanpaşa", neighborhood: "", parentSlug: "istanbul", desc: "Gaziosmanpaşa'nın kentsel dönüşüm projeleri ve yeni konutlarında" },
  { name: "Eyüpsultan", slug: "istanbul-eyupsultan", city: "İstanbul", district: "Eyüpsultan", neighborhood: "", parentSlug: "istanbul", desc: "Eyüpsultan'ın tarihi ve huzurlu yaşam alanlarında" },
  { name: "Kağıthane", slug: "istanbul-kagithane", city: "İstanbul", district: "Kağıthane", neighborhood: "", parentSlug: "istanbul", desc: "Kağıthane'nin hızla gelişen merkezi konumunda" },
  { name: "Zeytinburnu", slug: "istanbul-zeytinburnu", city: "İstanbul", district: "Zeytinburnu", neighborhood: "", parentSlug: "istanbul", desc: "Zeytinburnu'nun Marmara kıyısı ve kentsel dönüşüm projelerinde" },
  { name: "Bakırköy", slug: "istanbul-bakirkoy", city: "İstanbul", district: "Bakırköy", neighborhood: "", parentSlug: "istanbul", desc: "Bakırköy'ün Marmara'ya kıyı şeridi ve merkezi yaşam alanlarında" },
  { name: "Bayrampaşa", slug: "istanbul-bayrampasa", city: "İstanbul", district: "Bayrampaşa", neighborhood: "", parentSlug: "istanbul", desc: "Bayrampaşa'nın merkezi konumlu ve ulaşıma yakın bölgelerinde" },
  { name: "Güngören", slug: "istanbul-gungoren", city: "İstanbul", district: "Güngören", neighborhood: "", parentSlug: "istanbul", desc: "Güngören'in uygun fiyatlı ve merkeze yakın konut bölgelerinde" },
  { name: "Esenler", slug: "istanbul-esenler", city: "İstanbul", district: "Esenler", neighborhood: "", parentSlug: "istanbul", desc: "Esenler'in kentsel dönüşümle yükselen konut projelerinde" },
  { name: "Sultangazi", slug: "istanbul-sultangazi", city: "İstanbul", district: "Sultangazi", neighborhood: "", parentSlug: "istanbul", desc: "Sultangazi'nin yeni gelişen ve uygun fiyatlı konut alanlarında" },
  { name: "Arnavutköy", slug: "istanbul-arnavutkoy", city: "İstanbul", district: "Arnavutköy", neighborhood: "", parentSlug: "istanbul", desc: "Arnavutköy'ün havalimanı yakınındaki yatırımlık gelişim bölgesinde" },
  { name: "Silivri", slug: "istanbul-silivri", city: "İstanbul", district: "Silivri", neighborhood: "", parentSlug: "istanbul", desc: "Silivri'nin Marmara kıyısındaki tatil ve yaşam bölgelerinde" },
  { name: "Çatalca", slug: "istanbul-catalca", city: "İstanbul", district: "Çatalca", neighborhood: "", parentSlug: "istanbul", desc: "Çatalca'nın doğayla iç içe ve uygun fiyatlı arsa ve konut alanlarında" },
  { name: "Tuzla", slug: "istanbul-tuzla", city: "İstanbul", district: "Tuzla", neighborhood: "", parentSlug: "istanbul", desc: "Tuzla'nın sanayi ve marina bölgesinde yükselen konut projelerinde" },
  { name: "Sancaktepe", slug: "istanbul-sancaktepe", city: "İstanbul", district: "Sancaktepe", neighborhood: "", parentSlug: "istanbul", desc: "Sancaktepe'nin hızla büyüyen ve yatırım potansiyeli yüksek bölgesinde" },
  { name: "Çekmeköy", slug: "istanbul-cekmekoy", city: "İstanbul", district: "Çekmeköy", neighborhood: "", parentSlug: "istanbul", desc: "Çekmeköy'ün orman içindeki sakin ve yeşil konut projelerinde" },
  { name: "Sultanbeyli", slug: "istanbul-sultanbeyli", city: "İstanbul", district: "Sultanbeyli", neighborhood: "", parentSlug: "istanbul", desc: "Sultanbeyli'nin uygun fiyatlı ve gelişen konut alanlarında" },
  { name: "Beykoz", slug: "istanbul-beykoz", city: "İstanbul", district: "Beykoz", neighborhood: "", parentSlug: "istanbul", desc: "Beykoz'un Boğaz kıyısındaki doğal güzellikleri ve lüks villalarında" },
  { name: "Adalar", slug: "istanbul-adalar", city: "İstanbul", district: "Adalar", neighborhood: "", parentSlug: "istanbul", desc: "İstanbul Adaları'nın tarihi ahşap köşklerinde ve benzersiz yaşam alanlarında" },
];

const PROPERTY_TYPES: PropertyTypeDef[] = [
  { name: "Daire", slug: "daire", type: "daire" },
  { name: "Villa", slug: "villa", type: "villa" },
  { name: "Arsa", slug: "arsa", type: "arsa" },
  { name: "Ev", slug: "ev", type: "ev" },
  { name: "İşyeri", slug: "isyeri", type: "işyeri" },
];

const LISTING_TYPES: ListingTypeDef[] = [
  { name: "Satılık", slug: "satilik", type: "sale" },
  { name: "Kiralık", slug: "kiralik", type: "rent" },
];

export interface SeoPageConfig {
  slug: string;
  title: string;
  h1: string;
  description: string;
  keywords: string;
  listingType: string;
  propertyType: string;
  city: string;
  district: string;
  neighborhood: string;
  content: string;
  relatedSlugs: string[];
}

function generateContent(loc: LocationDef, propType: PropertyTypeDef, listType: ListingTypeDef): string {
  const locName = loc.name;
  const action = listType.type === "sale" ? "satılık" : "kiralık";
  const propName = propType.name.toLowerCase();

  const paragraphs = [
    `${locName} bölgesinde ${action} ${propName} arıyorsanız doğru adrestesiniz. Mirhan Gayrimenkul olarak ${locName}'da geniş bir ${action} ${propName} portföyü sunuyoruz. Profesyonel emlak danışmanlarımız, size en uygun ${propName} seçeneklerini bulmak için yanınızda. ${locName} emlak piyasasındaki güncel ${action} ${propName} ilanlarını aşağıda inceleyebilirsiniz.`,
    `${loc.desc} ${action} ${propName} seçeneklerini keşfedin. ${listType.type === "sale" ? "Yatırım amaçlı veya yaşam alanı olarak" : "Kısa veya uzun dönem"} ${propName} ilanlarımız arasından bütçenize ve tercihlerinize en uygun seçeneği bulabilirsiniz. ${locName}'da ${action} ${propName} fiyatları, konuma, manzaraya ve bina yaşına göre değişkenlik göstermektedir.`,
    `${locName} emlak piyasası, İstanbul'un en dinamik gayrimenkul pazarlarından biridir. ${propType.slug === "daire" ? "Modern konut projeleri, site içi daireler, rezidanslar ve bağımsız daireler" : propType.slug === "villa" ? "Havuzlu villalar, müstakil evler, Boğaz manzaralı villalar ve lüks konutlar" : propType.slug === "arsa" ? "İmarlı arsalar, yatırımlık araziler ve konut projeleri için uygun parseller" : propType.slug === "isyeri" ? "Ofisler, dükkanlar, mağazalar, depo alanları ve ticari gayrimenkuller" : "Her türlü konut ve gayrimenkul seçenekleri"} arasından tercih yapabilirsiniz.`,
    `İstanbul'un ${locName} bölgesi, ${propType.slug === "villa" ? "doğayla iç içe villa yaşamı" : propType.slug === "arsa" ? "arsa yatırımı" : propType.slug === "isyeri" ? "ticari faaliyet" : "konut"} için ideal bir konumdadır. Bölgenin gelişen altyapısı, ulaşım olanakları ve sosyal donatıları sayesinde ${locName}'da gayrimenkul yatırımı yapmak avantajlı bir tercih olmaya devam etmektedir.`,
    `Mirhan Gayrimenkul'ün profesyonel emlak danışmanlığı hizmetiyle ${locName}'da ${action} ${propName} bulmak artık çok kolay. Güncel ilan portföyümüz, detaylı fotoğraflar ve şeffaf fiyat bilgileriyle doğru kararı vermenize yardımcı oluyoruz. Hemen ilanlarımızı inceleyin veya bize ulaşarak ücretsiz danışmanlık hizmeti alın.`,
  ];

  return paragraphs.join("\n\n");
}

function generateSeoPages(): Map<string, SeoPageConfig> {
  const pages = new Map<string, SeoPageConfig>();

  for (const loc of LOCATIONS) {
    for (const listType of LISTING_TYPES) {
      for (const propType of PROPERTY_TYPES) {
        if (propType.slug === "arsa" && listType.type === "rent") continue;
        if (propType.slug === "ev" && loc.neighborhood) continue;
        if (propType.slug === "isyeri" && loc.neighborhood) continue;

        const slug = `${loc.slug}-${listType.slug}-${propType.slug}`;
        const locName = loc.name;
        const actionTr = listType.name;
        const propNameTr = propType.name;

        const relatedSlugs: string[] = [];
        for (const lt of LISTING_TYPES) {
          for (const pt of PROPERTY_TYPES) {
            if (pt.slug === "arsa" && lt.type === "rent") continue;
            if (pt.slug === "ev" && loc.neighborhood) continue;
            if (pt.slug === "isyeri" && loc.neighborhood) continue;
            const rs = `${loc.slug}-${lt.slug}-${pt.slug}`;
            if (rs !== slug) relatedSlugs.push(rs);
          }
        }
        if (loc.parentSlug) {
          relatedSlugs.push(`${loc.parentSlug}-${listType.slug}-${propType.slug}`);
        }
        const children = LOCATIONS.filter(l => l.parentSlug === loc.slug);
        for (const child of children.slice(0, 4)) {
          relatedSlugs.push(`${child.slug}-${listType.slug}-${propType.slug}`);
        }

        pages.set(slug, {
          slug,
          title: `${locName} ${actionTr} ${propNameTr} İlanları`,
          h1: `${locName}'da ${actionTr} ${propNameTr} İlanları`,
          description: `${locName}'da ${actionTr.toLowerCase()} ${propNameTr.toLowerCase()} ilanları. Güncel fiyatlar ve detaylı bilgilerle ${locName} emlak ilanlarını keşfedin. Mirhan Gayrimenkul güvencesiyle ${locName} ${actionTr.toLowerCase()} ${propNameTr.toLowerCase()}.`,
          keywords: `${locName.toLowerCase()} ${actionTr.toLowerCase()} ${propNameTr.toLowerCase()}, ${locName.toLowerCase()} ${propNameTr.toLowerCase()} fiyatları, ${locName.toLowerCase()} emlak, ${locName.toLowerCase()} ${propNameTr.toLowerCase()} ilanları, istanbul ${loc.district ? loc.district.toLowerCase() + ' ' : ''}${actionTr.toLowerCase()} ${propNameTr.toLowerCase()}, ${locName.toLowerCase()} gayrimenkul, mirhan gayrimenkul`,
          listingType: listType.type,
          propertyType: propType.type,
          city: loc.city,
          district: loc.district,
          neighborhood: loc.neighborhood,
          content: generateContent(loc, propType, listType),
          relatedSlugs: [...new Set(relatedSlugs)].slice(0, 10),
        });
      }
    }
  }

  return pages;
}

export const SEO_PAGES = generateSeoPages();

export function getSeoPageSlugs(): string[] {
  return Array.from(SEO_PAGES.keys());
}

export function getSeoPage(slug: string): SeoPageConfig | undefined {
  return SEO_PAGES.get(slug);
}

export function getSeoPageCount(): number {
  return SEO_PAGES.size;
}
