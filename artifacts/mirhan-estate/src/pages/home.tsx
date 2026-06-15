import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Search, Building2, Home, TrendingUp, Shield, ArrowRight, MapPin, Phone, Star, Quote, ChevronDown } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useState } from "react";
import { useLocation } from "wouter";
import { useSeo } from "@/hooks/use-seo";

type PropertyImage = {
  id: number;
  propertyId: number;
  imageUrl: string;
  isPrimary: boolean | null;
};

type PropertyWithImages = {
  id: number;
  title: string;
  price: number;
  city: string;
  district: string;
  listingType: string;
  propertyType: string;
  squareMeters: number;
  rooms: string;
  bathrooms: number;
  buildingAge?: number | null;
  featured: boolean | null;
  images: PropertyImage[];
};

function HomeFAQ({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden" data-testid={`faq-item-${index}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-muted/50 transition-colors"
        data-testid={`button-faq-toggle-${index}`}
      >
        <span className="font-medium text-sm sm:text-base pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  useSeo({
    title: "Mirhan Gayrimenkul - İstanbul'un Güvenilir Emlak Danışmanlığı",
    description: "Mirhan Gayrimenkul ile İstanbul'da satılık ve kiralık emlak ilanları. Beşiktaş, Kadıköy, Sarıyer, Şişli, Üsküdar ve tüm İstanbul'da güvenilir emlak danışmanlığı.",
    keywords: "istanbul emlak, istanbul satılık daire, istanbul kiralık daire, istanbul villa, beşiktaş emlak, kadıköy emlak, sarıyer emlak, şişli satılık daire, istanbul gayrimenkul, istanbul emlak danışmanlığı, mirhan gayrimenkul, купить квартиру в Стамбуле, недвижимость Стамбул, خرید ملک در استانبول, آپارتمان استانبول",
    canonical: "https://mirhanestate.com/",
    hrefLangs: [
      { lang: "tr", href: "https://mirhanestate.com/" },
      { lang: "ru", href: "https://mirhanestate.com/rusca-emlak-hizmetleri" },
      { lang: "fa", href: "https://mirhanestate.com/farsca-emlak-hizmetleri" },
      { lang: "x-default", href: "https://mirhanestate.com/" },
    ],
  });
  const [, navigate] = useLocation();
  const [searchCity, setSearchCity] = useState("");
  const [searchType, setSearchType] = useState("sale");

  const { data: featured, isLoading: featuredLoading } = useQuery<PropertyWithImages[]>({
    queryKey: ["/api/properties/featured"],
  });

  const { data: latest, isLoading: latestLoading } = useQuery<PropertyWithImages[]>({
    queryKey: ["/api/properties/latest"],
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchCity) params.set("city", searchCity);
    if (searchType) params.set("listingType", searchType);
    navigate(`/istanbul-emlak-ilanlari?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "Mirhan Gayrimenkul",
            description: "İstanbul'da satılık ve kiralık emlak ilanları. Beşiktaş, Kadıköy, Sarıyer, Şişli, Üsküdar bölgelerinde güvenilir emlak danışmanlığı.",
            url: "https://mirhanestate.com",
            telephone: ["+905494492336", "+902121234567"],
            email: "info@mirhanestate.com",
            areaServed: {
              "@type": "City",
              name: "İstanbul",
              containedInPlace: { "@type": "Country", name: "Türkiye" },
            },
            address: {
              "@type": "PostalAddress",
              streetAddress: "Nişantaşı",
              addressLocality: "Şişli/İstanbul",
              addressRegion: "İstanbul",
              addressCountry: "TR",
            },
            knowsAbout: ["İstanbul emlak", "İstanbul satılık daire", "İstanbul kiralık daire", "İstanbul villa", "Beşiktaş emlak", "Kadıköy emlak", "Sarıyer emlak", "Şişli satılık daire", "Üsküdar emlak"],
            knowsLanguage: ["tr", "ru", "fa", "en"],
            slogan: "İstanbul'da Güvenilir Emlak Danışmanlığı",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "İstanbul'da ev fiyatları ne kadar?",
                acceptedAnswer: { "@type": "Answer", text: "İstanbul'da 2026 yılı itibarıyla ortalama konut m² fiyatı lokasyona göre büyük farklılıklar göstermektedir. Beşiktaş ve Kadıköy gibi merkezi ilçelerde 80.000-120.000 TL/m² aralığında seyrederken, Beylikdüzü ve Esenyurt gibi çeperde bu rakam 25.000-45.000 TL/m² seviyesindedir." },
              },
              {
                "@type": "Question",
                name: "İstanbul'da en iyi emlak bölgeleri neresi?",
                acceptedAnswer: { "@type": "Answer", text: "İstanbul'da yatırım ve yaşam için en çok tercih edilen bölgeler: Beşiktaş (Boğaz manzarası, prestij), Kadıköy (kültürel yaşam, merkezi konum), Sarıyer (doğa, lüks), Şişli-Nişantaşı (alışveriş, iş), Üsküdar (huzurlu Anadolu Yakası), Ataşehir (finans merkezi, modern yapılar) ve Başakşehir (yeni projeler, ailelere uygun)." },
              },
              {
                "@type": "Question",
                name: "Yabancılar İstanbul'da ev alabilir mi?",
                acceptedAnswer: { "@type": "Answer", text: "Evet, Türkiye'de 183'ten fazla ülke vatandaşı gayrimenkul satın alabilir. İstanbul, yabancı alıcılar arasında Türkiye'nin en popüler şehridir. 400.000 USD ve üzeri gayrimenkul alımlarında Türk vatandaşlığı başvurusu yapılabilir." },
              },
              {
                "@type": "Question",
                name: "İstanbul'da kiralık daire fiyatları ne kadar?",
                acceptedAnswer: { "@type": "Answer", text: "İstanbul'da 2026 yılında kiralık daire fiyatları bölgeye göre önemli farklılıklar göstermektedir. Kadıköy ve Beşiktaş'ta 2+1 daire aylık 35.000-65.000 TL, Şişli'de 30.000-55.000 TL, Beylikdüzü'nde 20.000-35.000 TL aralığındadır." },
              },
              {
                "@type": "Question",
                name: "Mirhan Gayrimenkul hangi hizmetleri sunuyor?",
                acceptedAnswer: { "@type": "Answer", text: "Mirhan Gayrimenkul, İstanbul merkezli profesyonel bir emlak danışmanlık firmasıdır. Sunduğu hizmetler: satılık ve kiralık daire, villa, arsa ve işyeri ilanları; ücretsiz gayrimenkul değerleme; yatırım danışmanlığı; Türk vatandaşlığı başvuru desteği; tapu ve noter işlemleri. Türkçe, Rusça, Farsça ve İngilizce dillerinde hizmet vermektedir." },
              },
              {
                "@type": "Question",
                name: "İstanbul'da gayrimenkul yatırımı mantıklı mı?",
                acceptedAnswer: { "@type": "Answer", text: "İstanbul, dünyanın en dinamik gayrimenkul piyasalarından birine sahiptir. İki kıtayı birleştiren stratejik konumu, güçlü turizm sektörü ve kentsel dönüşüm projeleri sayesinde uzun vadeli yatırım için oldukça cazip bir seçenektir. Yıllık kira getirisi %5-9 arasında değişmektedir." },
              },
            ],
          }),
        }}
      />
      <Header />

      <section className="relative overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&q=80"
            alt="İstanbul manzarası"
            className="w-full h-full object-cover"
            loading="eager"
            width={1600}
            height={900}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-white text-2xl font-bold tracking-tight">Mirhan Gayrimenkul</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              İstanbul'da Hayalinizdeki <span className="text-amber-400">Evi Bulun</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              İstanbul'un en güzel lokasyonlarında satılık ve kiralık emlak ilanları. Beşiktaş, Kadıköy, Sarıyer, Şişli, Üsküdar ve çevresinde uzman emlak danışmanlığı.
            </p>
          </div>

          <div className="mt-10 max-w-3xl">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="bg-gray-50 border-gray-200" data-testid="select-listing-type">
                    <SelectValue placeholder="İlan Tipi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Satılık</SelectItem>
                    <SelectItem value="rent">Kiralık</SelectItem>
                  </SelectContent>
                </Select>

                <div className="md:col-span-2">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="İlçe veya mahalle yazın..."
                      className="pl-9 bg-gray-50 border-gray-200"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      data-testid="input-search-city"
                    />
                  </div>
                </div>

                <Button onClick={handleSearch} className="w-full bg-amber-600 hover:bg-amber-700 text-white" data-testid="button-search">
                  <Search className="w-4 h-4 mr-2" />
                  Ara
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card/50" data-testid="section-stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Building2, label: "İstanbul'da Aktif İlan", value: "1.200+" },
              { icon: Home, label: "Mutlu Müşteri", value: "4.500+" },
              { icon: TrendingUp, label: "Başarılı Satış", value: "3.100+" },
              { icon: Shield, label: "Yıllık Tecrübe", value: "12+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featured && featured.length > 0 && (
        <section className="py-16" data-testid="section-featured">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">İstanbul'da Öne Çıkan İlanlar</h2>
                <p className="text-muted-foreground mt-1">İstanbul'un en gözde lokasyonlarından seçkin ilanlar</p>
              </div>
              <Link href="/istanbul-emlak-ilanlari" data-testid="link-view-all-featured">
                <Button variant="ghost" className="text-amber-600">
                  Tümünü Gör <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {featuredLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="py-16 bg-card/50" data-testid="section-latest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">İstanbul'da Son Eklenen İlanlar</h2>
              <p className="text-muted-foreground mt-1">İstanbul ve çevresinde yeni eklenen emlak ilanlarını keşfedin</p>
            </div>
            <Link href="/istanbul-emlak-ilanlari" data-testid="link-view-all-latest">
              <Button variant="ghost" className="text-amber-600">
                Tümünü Gör <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {latestLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latest?.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16" data-testid="section-istanbul-regions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">İstanbul'da Hizmet Verdiğimiz Bölgeler</h2>
            <p className="text-muted-foreground mt-2">İstanbul'un en değerli lokasyonlarında uzman emlak danışmanlığı</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Building2,
                title: "Beşiktaş",
                desc: "Boğaz manzarası, Levent iş merkezi ve Etiler'in prestijli yaşam alanlarıyla İstanbul'un en değerli ilçesi.",
              },
              {
                icon: Home,
                title: "Kadıköy",
                desc: "Moda, Bağdat Caddesi ve Caferağa'nın canlı kültürel dokusuyla Anadolu Yakası'nın kalbi.",
              },
              {
                icon: TrendingUp,
                title: "Sarıyer",
                desc: "Tarabya'nın Boğaz yalılarından Maslak'ın iş merkezlerine uzanan geniş yelpazede değer odağı.",
              },
              {
                icon: Shield,
                title: "Beylikdüzü",
                desc: "Uygun fiyatlı modern konut projeleri ve gelişen altyapısıyla yatırımcıların gözdesi.",
              },
            ].map((region) => (
              <Card
                key={region.title}
                className="p-6 text-center border-card-border hover:shadow-md transition-shadow"
                data-testid={`card-region-${region.title.toLowerCase().replace(/\s.*/, "")}`}
              >
                <div className="mx-auto w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                  <region.icon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{region.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{region.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card/50" data-testid="section-testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Müşterilerimiz Ne Diyor?</h2>
            <p className="text-muted-foreground mt-2">Binlerce mutlu müşterimizden bazıları</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Ayşe Kara",
                role: "Ev Sahibi",
                location: "İstanbul, Kadıköy",
                text: "Mirhan Gayrimenkul sayesinde hayalimdeki daireyi Kadıköy Moda'da buldum. Danışmanım her aşamada yanımda oldu, tapu işlemlerinden kredi sürecine kadar her konuda destek aldım.",
                rating: 5,
              },
              {
                name: "Mehmet Demir",
                role: "Yatırımcı",
                location: "İstanbul, Beşiktaş",
                text: "Yatırım amaçlı 3 daire aldım ve her birinde profesyonel hizmet aldım. Piyasa analizi ve fiyat değerlendirmesi konusunda çok başarılılar. Güvenilir bir emlak firması.",
                rating: 5,
              },
              {
                name: "Elena Petrova",
                role: "Yabancı Yatırımcı",
                location: "İstanbul, Sarıyer",
                text: "Türk vatandaşlığı için mülk satın aldım. Mirhan Gayrimenkul ekibi Rusça hizmet sunarak tüm süreci kolaylaştırdı. Tapu ve hukuki süreçlerde tam destek aldım.",
                rating: 5,
              },
            ].map((review) => (
              <Card key={review.name} className="p-6 border-card-border">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-amber-200 dark:text-amber-800 mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{review.text}</p>
                <div>
                  <p className="font-semibold text-sm">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.role} · {review.location}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Sıkça Sorulan Sorular</h2>
            <p className="text-muted-foreground mt-2">İstanbul emlak piyasası hakkında merak ettikleriniz</p>
          </div>
          <div className="space-y-3">
            {[
              { q: "İstanbul'da ev fiyatları ne kadar?", a: "İstanbul'da 2026 yılı itibarıyla ortalama konut m² fiyatı lokasyona göre büyük farklılıklar göstermektedir. Beşiktaş ve Kadıköy gibi merkezi ilçelerde 80.000-120.000 TL/m² aralığında seyrederken, Beylikdüzü ve Esenyurt gibi çeperde bu rakam 25.000-45.000 TL/m² seviyesindedir. Boğaz ve deniz manzaralı dairelerde bu rakamlar çok daha yüksek olabilmektedir." },
              { q: "İstanbul'da en iyi emlak bölgeleri neresi?", a: "İstanbul'da yatırım ve yaşam için en çok tercih edilen bölgeler: Beşiktaş (Boğaz manzarası, prestij, Levent iş merkezi), Kadıköy (kültürel yaşam, Moda sahili), Sarıyer (Tarabya yalıları, doğa, lüks), Şişli-Nişantaşı (alışveriş, iş), Üsküdar (huzurlu yaşam), Ataşehir (finans merkezi) ve Başakşehir (yeni projeler, ailelere uygun)." },
              { q: "Yabancılar İstanbul'da ev alabilir mi?", a: "Evet, 183'ten fazla ülke vatandaşı Türkiye'de gayrimenkul satın alabilir. İstanbul, yabancı alıcılar arasında Türkiye'nin birinci tercihidir. 400.000 USD ve üzeri gayrimenkul alımlarında Türk vatandaşlığı başvurusu yapılabilir. Tapu işlemleri ortalama 3-5 iş günü sürmektedir." },
              { q: "İstanbul'da kiralık daire fiyatları ne kadar?", a: "İstanbul'da 2026 yılında kiralık daire fiyatları bölgeye göre önemli farklılıklar göstermektedir. Kadıköy ve Beşiktaş'ta 2+1 daire aylık 35.000-65.000 TL, Şişli'de 30.000-55.000 TL, Beylikdüzü'nde 20.000-35.000 TL aralığındadır." },
              { q: "İstanbul'da tapu masrafları ne kadar?", a: "İstanbul'da gayrimenkul alım-satımında toplam tapu masrafı satış bedelinin yaklaşık %4'ü kadardır (alıcı ve satıcı %2'şer öder). Buna ek olarak noter masrafı, ekspertiz ücreti ve DASK (zorunlu deprem sigortası) giderleri bulunmaktadır." },
            ].map((faq, i) => (
              <HomeFAQ key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card/50" data-testid="section-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Hayalinizdeki İstanbul Mülkünü Bulalım</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            İstanbul'da satılık veya kiralık mülk arıyorsanız, Mirhan Gayrimenkul uzmanları her adımda yanınızda.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/905494492336?text=Merhaba%2C%20İstanbul'da%20emlak%20hakkında%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto">
                <SiWhatsapp className="w-5 h-5 mr-2" />
                WhatsApp Danışmanlık
              </Button>
            </a>
            <a href="tel:+905494492336">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Phone className="w-5 h-5 mr-2" />
                Hemen Arayın
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
