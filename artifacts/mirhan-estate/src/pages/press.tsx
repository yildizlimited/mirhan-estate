import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useSeo } from "@/hooks/use-seo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileText, Calendar, ExternalLink, Mail } from "lucide-react";

export default function PressPage() {
  useSeo({
    title: "Basın - Mirhan Gayrimenkul",
    description: "Mirhan Gayrimenkul basın haberleri, medya bültenleri ve basın kiti. İstanbul'daki gayrimenkul haberlerimizi takip edin.",
    keywords: "mirhan gayrimenkul basın, istanbul emlak haberleri, gayrimenkul medya, mirhan estate press",
    canonical: "https://mirhanestate.com/basin",
  });

  const pressItems = [
    {
      date: "Mart 2026",
      title: "Mirhan Gayrimenkul, İstanbul'da 1000. Satış İşlemini Tamamladı",
      source: "Emlak Haberleri",
      excerpt: "İstanbul'un köklü gayrimenkul danışmanlık firmalarından Mirhan Gayrimenkul, 2026 yılının ilk çeyreğinde 1000. satış işlemini tamamlayarak sektörde önemli bir kilometre taşına ulaştı.",
    },
    {
      date: "Şubat 2026",
      title: "İstanbul Gayrimenkul Piyasasında Yabancı Yatırımcı Talebi Artıyor",
      source: "Hürriyet Emlak",
      excerpt: "Mirhan Gayrimenkul Genel Müdürü, yabancı yatırımcıların İstanbul'a olan ilgisinin son iki yılda belirgin biçimde arttığını, özellikle Beşiktaş ve Sarıyer bölgelerinde yoğun talep yaşandığını belirtti.",
    },
    {
      date: "Ocak 2026",
      title: "Mirhan Gayrimenkul Rusça ve Farsça Hizmet Kapsamını Genişletti",
      source: "Ekonomist",
      excerpt: "İstanbul merkezli gayrimenkul firması Mirhan Gayrimenkul, Rusça ve Farsça dillerindeki danışmanlık kapasitesini artırarak Orta Doğu ve Bağımsız Devletler Topluluğu'ndan gelen yatırımcılara daha kapsamlı hizmet sunmaya başladı.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="py-12 bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-press-title">Basın</h1>
          <p className="text-muted-foreground text-lg">
            Mirhan Gayrimenkul hakkındaki haberler ve duyurular
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-xl font-semibold">Basın Bültenleri</h2>

          {pressItems.map((item, i) => (
            <Card key={i} className="p-6 border-card-border" data-testid={`card-press-${i}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">{item.source}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.excerpt}</p>
                </div>
              </div>
            </Card>
          ))}

          <Card className="p-8 border-card-border mt-12 text-center">
            <h2 className="text-xl font-semibold mb-3">Basın İletişimi</h2>
            <p className="text-muted-foreground mb-6">
              Medya sorularınız ve röportaj talepleriniz için bize ulaşın.
            </p>
            <a href="mailto:basin@mirhanestate.com" className="inline-flex items-center gap-2">
              <Button size="lg">
                <Mail className="w-5 h-5 mr-2" />
                basin@mirhanestate.com
              </Button>
            </a>
            <div className="mt-4">
              <Link href="/medya-kiti" className="text-sm text-primary hover:underline">
                Medya Kitini İndirin
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
