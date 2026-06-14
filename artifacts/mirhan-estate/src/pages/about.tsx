import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useSeo } from "@/hooks/use-seo";
import { Card } from "@/components/ui/card";
import { Shield, TrendingUp, Users, Heart, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  useSeo({
    title: "Hakkımızda - Mirhan Gayrimenkul",
    description: "Mirhan Gayrimenkul, İstanbul'da 12 yıllık tecrübesiyle güvenilir emlak danışmanlığı sunan köklü bir gayrimenkul firmasıdır.",
    keywords: "mirhan gayrimenkul hakkında, istanbul emlak danışmanlığı, güvenilir istanbul gayrimenkul, mirhan estate",
    canonical: "https://mirhanestate.com/hakkimizda",
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="py-16 md:py-20 bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-about-title">Hakkımızda</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Mirhan Gayrimenkul, 2012 yılından bu yana İstanbul'da güvenilir ve profesyonel emlak danışmanlığı hizmeti sunmaktadır. Türkçe, Rusça, Farsça ve İngilizce dillerinde hizmet veren uluslararası ekibimizle, yurt içi ve yurt dışı müşterilerimize eksiksiz bir gayrimenkul deneyimi yaşatıyoruz.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">Neden Mirhan Gayrimenkul?</h2>
              <div className="space-y-4">
                {[
                  { icon: Shield, title: "Güvenilir Danışmanlık", desc: "12 yıllık tecrübemiz ve binlerce başarılı işlemimizle İstanbul'da güvenin adresi olarak öne çıkıyoruz." },
                  { icon: TrendingUp, title: "Piyasa Uzmanlığı", desc: "İstanbul'un 39 ilçesinde güncel piyasa bilgisiyle en iyi yatırım fırsatlarını sizinle buluşturuyoruz." },
                  { icon: Users, title: "Uluslararası Hizmet", desc: "Türkçe, Rusça, Farsça ve İngilizce dillerinde hizmetle yabancı yatırımcılara kapsamlı destek sağlıyoruz." },
                  { icon: Heart, title: "Müşteri Odaklı", desc: "Satış sonrası da yanınızdayız. Tapu işlemlerinden DASK sigortasına kadar tüm süreçleri takip ediyoruz." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "12+", label: "Yıllık Tecrübe" },
                { value: "4.500+", label: "Mutlu Müşteri" },
                { value: "3.100+", label: "Başarılı Satış" },
                { value: "1.200+", label: "Aktif İlan" },
              ].map((stat) => (
                <Card key={stat.label} className="p-6 text-center border-card-border">
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Vizyonumuz</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            İstanbul'un hızla büyüyen gayrimenkul piyasasında, müşterilerimizin yatırımlarını en iyi şekilde değerlendirmelerine yardımcı olmak için sürekli gelişiyor ve inovatif çözümler üretiyoruz. Teknoloji destekli emlak danışmanlığı anlayışımızla, dijital platformlardan yüz yüze hizmetlere uzanan geniş bir spektrumda varlık gösteriyoruz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/iletisim">
              <Button size="lg">İletişime Geçin</Button>
            </Link>
            <Link href="/istanbul-emlak-danismanlari">
              <Button size="lg" variant="outline">Ekibimizi Tanıyın</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
