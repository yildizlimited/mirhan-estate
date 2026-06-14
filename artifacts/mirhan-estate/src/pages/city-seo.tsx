import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PropertyCard } from "@/components/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";
import { Building2, MapPin, ArrowRight, Phone } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

type SeoPage = {
  slug: string; title: string; h1: string; description: string;
  keywords: string; district?: string; listingType?: string; content?: string;
};

type Property = {
  id: number; title: string; price: string; district: string;
  listingType: string; propertyType: string; rooms: string;
  size?: number; images?: string[];
};

export default function CitySeoPage() {
  const [location] = useLocation();
  const slug = location.replace(/^\//, "");

  const { data: seoPage, isLoading: seoLoading } = useQuery<SeoPage>({
    queryKey: [`/api/seo/page/${slug}`],
    queryFn: async () => {
      const res = await fetch(`/api/seo/page/${slug}`, { credentials: "include" });
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
    retry: false,
  });

  useSeo({
    title: seoPage?.title || "İstanbul Emlak",
    description: seoPage?.description || "İstanbul'da satılık ve kiralık mülkler",
    keywords: seoPage?.keywords || "",
    canonical: `https://mirhanestate.com/${slug}`,
  });

  const queryParams = new URLSearchParams();
  if (seoPage?.district) queryParams.set("district", seoPage.district);
  if (seoPage?.listingType) queryParams.set("listingType", seoPage.listingType);

  const { data: properties, isLoading: propsLoading } = useQuery<Property[]>({
    queryKey: [`/api/properties?${queryParams.toString()}&limit=9`],
    queryFn: async () => {
      const res = await fetch(`/api/properties?${queryParams.toString()}&limit=9`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!seoPage,
  });

  if (seoLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Skeleton className="h-10 w-80 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-72 rounded-xl" />)}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!seoPage) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Sayfa Bulunamadı</h1>
          <Link href="/istanbul-emlak-ilanlari"><Button>İlanları Gör</Button></Link>
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
            name: seoPage.title,
            description: seoPage.description,
            url: `https://mirhanestate.com/${slug}`,
            provider: {
              "@type": "RealEstateAgent",
              name: "Mirhan Gayrimenkul",
              url: "https://mirhanestate.com",
              telephone: "+905321234567",
              areaServed: { "@type": "City", name: "İstanbul" },
            },
          }),
        }}
      />
      <Header />

      <section className="py-10 md:py-14 bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link href="/" className="hover:text-foreground">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/istanbul-emlak-ilanlari" className="hover:text-foreground">İlanlar</Link>
            <span>/</span>
            <span className="text-foreground">{seoPage.h1}</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-5 h-5 text-amber-600" />
            {seoPage.district && (
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full">
                {seoPage.district}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-city-seo-title">{seoPage.h1}</h1>
          <p className="text-muted-foreground text-lg max-w-3xl">{seoPage.description}</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold" data-testid="text-result-count">
            {propsLoading ? "Yükleniyor..." : `${properties?.length || 0} ilan bulundu`}
          </h2>
          <Link href={`/istanbul-emlak-ilanlari?${queryParams.toString()}`}>
            <Button variant="outline" size="sm">
              Tümünü Gör <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {propsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-72 rounded-xl" />)}
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground mb-4">Bu kategoride ilan yakında eklenecektir.</p>
            <Link href="/istanbul-emlak-ilanlari"><Button variant="outline">Tüm İlanları Gör</Button></Link>
          </div>
        )}

        {seoPage.content && (
          <section className="mt-12 prose prose-sm dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: seoPage.content }} />
          </section>
        )}

        <section className="mt-12 p-8 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-center">
          <h2 className="text-xl font-bold mb-3">Uzman Danışmanlık Alın</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            {seoPage.district ? `${seoPage.district}'da` : "İstanbul'da"} mülk almak veya kiralamak için ücretsiz danışmanlık hizmeti alın.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/905321234567" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <SiWhatsapp className="w-5 h-5 mr-2" />WhatsApp
              </Button>
            </a>
            <a href="tel:+902121234567">
              <Button size="lg" variant="outline"><Phone className="w-5 h-5 mr-2" />0212 123 45 67</Button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
