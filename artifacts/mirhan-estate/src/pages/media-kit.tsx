import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useSeo } from "@/hooks/use-seo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Image, FileText, Mail } from "lucide-react";

export default function MediaKitPage() {
  useSeo({
    title: "Medya Kiti - Mirhan Gayrimenkul",
    description: "Mirhan Gayrimenkul medya kiti. Logo, marka kılavuzu ve basın materyalleri.",
    canonical: "https://mirhanestate.com/medya-kiti",
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="py-12 bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-mediakit-title">Medya Kiti</h1>
          <p className="text-muted-foreground text-lg">Logo, marka renkleri ve basın materyalleri</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-5">Logo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Card className="p-6 flex flex-col items-center gap-4 border-card-border">
                <div className="w-full h-32 rounded-lg bg-card flex items-center justify-center border border-border">
                  <img src="/logo-mirhan.jpeg" alt="Mirhan Gayrimenkul Logo" className="h-20 w-auto object-contain" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">Tam Logo (Renkli)</p>
                  <p className="text-xs text-muted-foreground mb-3">Açık arka plan için</p>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />İndir
                  </Button>
                </div>
              </Card>
              <Card className="p-6 flex flex-col items-center gap-4 border-card-border">
                <div className="w-full h-32 rounded-lg bg-zinc-900 flex items-center justify-center border border-border">
                  <img src="/logo-mirhan.jpeg" alt="Mirhan Gayrimenkul Logo Koyu" className="h-20 w-auto object-contain" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">Tam Logo (Koyu Arka Plan)</p>
                  <p className="text-xs text-muted-foreground mb-3">Koyu arka plan için</p>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />İndir
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-5">Marka Renkleri</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "Altın Sarısı", hex: "#D4A017", usage: "Ana renk" },
                { name: "Koyu Altın", hex: "#B8860B", usage: "Vurgu rengi" },
                { name: "Krem", hex: "#FDF6E3", usage: "Arka plan" },
                { name: "Siyah", hex: "#1A1A1A", usage: "Metin" },
              ].map(c => (
                <div key={c.name} className="space-y-2">
                  <div className="w-full h-20 rounded-lg border border-border shadow-sm" style={{ backgroundColor: c.hex }} />
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{c.hex}</p>
                  <p className="text-xs text-muted-foreground">{c.usage}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-5">Basın Materyalleri</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Şirket Tanıtım Broşürü", desc: "Mirhan Gayrimenkul hizmetleri ve ekibi hakkında kapsamlı bilgi", icon: FileText },
                { title: "Logo Paketi (ZIP)", desc: "PNG, SVG ve PDF formatlarında tüm logo varyantları", icon: Image },
                { title: "Basın Bülteni Şablonu", desc: "Medya kuruluşları için resmi basın bülteni şablonu", icon: FileText },
                { title: "Fotoğraf Galerisi", desc: "Ofis ve ekip fotoğrafları yüksek çözünürlüklü", icon: Image },
              ].map((item) => (
                <Card key={item.title} className="p-5 flex items-center gap-4 border-card-border">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-6 text-center border-card-border">
            <h2 className="text-lg font-semibold mb-2">Medya ve Basın İletişimi</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Röportaj talepleriniz ve basın soruları için bize ulaşın.
            </p>
            <a href="mailto:basin@mirhanestate.com">
              <Button>
                <Mail className="w-4 h-4 mr-2" />
                basin@mirhanestate.com
              </Button>
            </a>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
