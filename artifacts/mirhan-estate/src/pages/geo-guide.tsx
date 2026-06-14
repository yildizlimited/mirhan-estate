import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation, Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PropertyCard } from "@/components/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Building2, TrendingUp, Home } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";

type SeoConfig = {
  title: string;
  h1: string;
  description: string;
  keywords: string;
  city?: string;
  district?: string;
  listingType?: string;
  propertyType?: string;
  content?: string;
  relatedSlugs?: string[];
};

const GEO_PAGES: Record<string, SeoConfig> = {
  "istanbul-emlak-rehberi": {
    title: "İstanbul Emlak Rehberi 2026",
    h1: "İstanbul Emlak Rehberi",
    description: "İstanbul'da emlak alım, satım ve kiralama rehberi. İstanbul'un en değerli ilçeleri, fiyat trendleri ve yatırım fırsatları hakkında kapsamlı bilgi.",
    keywords: "istanbul emlak rehberi, istanbul gayrimenkul, istanbul ev fiyatları, istanbul ilçe rehberi, istanbul konut piyasası",
    city: "İstanbul",
    relatedSlugs: ["istanbul-yatirim-bolgeleri", "istanbul-gayrimenkul-piyasasi", "besiktas-emlak-rehberi"],
  },
  "istanbul-yatirim-bolgeleri": {
    title: "İstanbul'da En İyi Yatırım Bölgeleri 2026",
    h1: "İstanbul Yatırım Bölgeleri",
    description: "İstanbul'da gayrimenkul yatırımı için en iyi bölgeler. Kira getirisi, değer artışı ve proje potansiyeline göre ilçe analizi.",
    keywords: "istanbul yatırım bölgeleri, istanbul gayrimenkul yatırım, istanbul yükselen semtler, istanbul kira getirisi, istanbul değer artışı",
    city: "İstanbul",
    relatedSlugs: ["istanbul-emlak-rehberi", "istanbul-gayrimenkul-piyasasi"],
  },
  "istanbul-gayrimenkul-piyasasi": {
    title: "İstanbul Gayrimenkul Piyasası Analizi 2026",
    h1: "İstanbul Gayrimenkul Piyasası",
    description: "2026 yılında İstanbul gayrimenkul piyasası analizi. Fiyat trendleri, satış istatistikleri ve gelecek beklentileri.",
    keywords: "istanbul gayrimenkul piyasası, istanbul konut fiyatları 2026, istanbul emlak trendleri, istanbul satış istatistikleri",
    city: "İstanbul",
    relatedSlugs: ["istanbul-yatirim-bolgeleri", "istanbul-emlak-rehberi"],
  },
  "besiktas-emlak-rehberi": {
    title: "Beşiktaş Emlak Rehberi - Satılık ve Kiralık Daire",
    h1: "Beşiktaş Emlak Rehberi",
    description: "Beşiktaş'ta satılık ve kiralık daire, villa ve işyeri ilanları. Beşiktaş emlak fiyatları, mahalleleri ve yatırım rehberi.",
    keywords: "beşiktaş emlak, beşiktaş satılık daire, beşiktaş kiralık daire, beşiktaş ev fiyatları, beşiktaş mahalle rehberi",
    city: "İstanbul",
    district: "Beşiktaş",
    relatedSlugs: ["kadikoy-emlak-rehberi", "sariyer-emlak-rehberi", "istanbul-emlak-rehberi"],
  },
  "kadikoy-emlak-rehberi": {
    title: "Kadıköy Emlak Rehberi - Satılık ve Kiralık Daire",
    h1: "Kadıköy Emlak Rehberi",
    description: "Kadıköy'de satılık ve kiralık daire, villa ve işyeri ilanları. Moda, Bağdat Caddesi, Caferağa emlak fiyatları ve rehberi.",
    keywords: "kadıköy emlak, kadıköy satılık daire, kadıköy kiralık daire, moda satılık daire, kadıköy ev fiyatları",
    city: "İstanbul",
    district: "Kadıköy",
    relatedSlugs: ["besiktas-emlak-rehberi", "istanbul-emlak-rehberi"],
  },
  "sariyer-emlak-rehberi": {
    title: "Sarıyer Emlak Rehberi - Satılık ve Kiralık",
    h1: "Sarıyer Emlak Rehberi",
    description: "Sarıyer'de satılık ve kiralık konut ilanları. Tarabya, Büyükdere, Maslak bölgelerinde güncel emlak fiyatları.",
    keywords: "sarıyer emlak, sarıyer satılık daire, sarıyer kiralık, tarabya satılık, maslak satılık daire, sarıyer villa",
    city: "İstanbul",
    district: "Sarıyer",
    relatedSlugs: ["besiktas-emlak-rehberi", "istanbul-emlak-rehberi"],
  },
};

export default function GeoGuidePage() {
  const [location] = useLocation();
  const slug = location.replace(/^\//, "");
  const config = GEO_PAGES[slug];

  useSeo({
    title: config?.title || "İstanbul Emlak Rehberi",
    description: config?.description || "İstanbul'da güvenilir emlak danışmanlığı - Mirhan Gayrimenkul",
    keywords: config?.keywords || "",
    canonical: `https://mirhanestate.com/${slug}`,
  });

  const queryParams = new URLSearchParams();
  if (config?.city) queryParams.set("city", config.city);
  if (config?.district) queryParams.set("district", config.district);
  if (config?.listingType) queryParams.set("listingType", config.listingType);

  const { data: properties, isLoading } = useQuery<any[]>({
    queryKey: [`/api/properties?${queryParams.toString()}`],
    queryFn: async () => {
      const res = await fetch(`/api/properties?${queryParams.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!config,
  });

  if (!config) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Sayfa Bulunamadı</h1>
          <Link href="/"><Button className="mt-4">Ana Sayfaya Dön</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: config.title,
            description: config.description,
            url: `https://mirhanestate.com/${slug}`,
            provider: {
              "@type": "RealEstateAgent",
              name: "Mirhan Gayrimenkul",
              url: "https://mirhanestate.com",
              areaServed: { "@type": "City", name: "İstanbul" },
            },
          }),
        }}
      />
      <Header />

      <section className="py-12 md:py-16 bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link href="/" className="hover:text-foreground">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/istanbul-emlak-ilanlari" className="hover:text-foreground">İlanlar</Link>
            <span>/</span>
            <span className="text-foreground">{config.title}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-geo-title">{config.h1}</h1>
          <p className="text-muted-foreground text-lg max-w-3xl">{config.description}</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" data-testid="text-property-count">
              {isLoading ? "Yükleniyor..." : `${properties?.length || 0} ilan bulundu`}
            </h2>
            <Link href={`/istanbul-emlak-ilanlari?${queryParams.toString()}`}>
              <Button variant="outline" size="sm">
                Tüm İlanları Gör <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
            </div>
          ) : properties && properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.slice(0, 9).map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">Bu bölge için ilan yakında eklenecektir.</p>
              <Link href="/istanbul-emlak-ilanlari">
                <Button variant="outline" className="mt-4">Tüm İlanları Gör</Button>
              </Link>
            </div>
          )}
        </section>

        {config.relatedSlugs && config.relatedSlugs.length > 0 && (
          <section className="border-t border-border pt-8">
            <h2 className="text-lg font-semibold mb-4">İlgili Rehberler</h2>
            <div className="flex flex-wrap gap-2">
              {config.relatedSlugs.map((rs) => {
                const related = GEO_PAGES[rs];
                if (!related) return null;
                return (
                  <Link key={rs} href={`/${rs}`}>
                    <span className="inline-block px-4 py-2 rounded-full bg-muted hover:bg-amber-100 dark:hover:bg-amber-900/30 text-sm font-medium transition-colors cursor-pointer">
                      {related.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
