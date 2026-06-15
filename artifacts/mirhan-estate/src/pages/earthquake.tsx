import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useSeo } from "@/hooks/use-seo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SiWhatsapp } from "react-icons/si";
import { Shield, AlertTriangle, CheckCircle2, Phone, Info } from "lucide-react";

export default function EarthquakePage() {
  useSeo({
    title: "İstanbul Deprem Güvenlik Rehberi - Depreme Dayanıklı Konut",
    description: "İstanbul'da güvenli ev satın alma rehberi. Depreme dayanıklı yapı kriterleri, DASK sigortası, kentsel dönüşüm ve İstanbul'da güvenli yaşam bölgeleri.",
    keywords: "istanbul deprem rehberi, istanbul depreme dayanıklı bina, istanbul kentsel dönüşüm, DASK sigortası, istanbul güvenli ev, istanbul fay hattı, depremde güvenli ilçeler istanbul",
    canonical: "https://mirhanestate.com/deprem-guvenlik-rehberi",
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="py-12 bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Shield className="w-8 h-8 text-amber-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-earthquake-title">
            İstanbul Deprem Güvenlik Rehberi
          </h1>
          <p className="text-muted-foreground text-lg">
            İstanbul'da güvenli mülk satın almak için bilmeniz gereken her şey
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Card className="p-6 border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10">
            <div className="flex gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h2 className="font-semibold mb-2">İstanbul ve Deprem Riski</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  İstanbul, Kuzey Anadolu Fay Hattı'na yakın konumuyla deprem riski taşıyan bir kenttir. Ancak doğru bilgi ve dikkatli bir mülk seçimiyle bu riski önemli ölçüde azaltmak mümkündür. Türkiye'de 1999'dan bu yana yeni yapılar çok daha sıkı deprem yönetmeliklerine tabi tutulmaktadır.
                </p>
              </div>
            </div>
          </Card>

          <div>
            <h2 className="text-xl font-bold mb-5">Depreme Dayanıklı Bina Kriterleri</h2>
            <div className="space-y-4">
              {[
                {
                  title: "Yapı Yaşı ve Yönetmelik",
                  body: "2000 yılı ve sonrasında inşa edilen yapılar, 1999 Türkiye Deprem Yönetmeliği veya daha güncel 2018 TBDY kapsamındadır. 1999 öncesi yapılarda deprem güçlendirmesi yapılmış olup olmadığını mutlaka sorgulayın.",
                },
                {
                  title: "Zemin Etüdü ve İmar Belgesi",
                  body: "Satın almadan önce belediyeden zemin etüdü raporunu ve yapı ruhsatını mutlaka inceleyin. Dere yatağı, dolgu zemin veya yüksek yeraltı suyu olan bölgelerdeki yapılardan kaçının.",
                },
                {
                  title: "Kentsel Dönüşüm Durumu",
                  body: "İstanbul'da riskli yapı tespiti yapılan binalar, Kentsel Dönüşüm Kanunu (6306 sayılı) kapsamında yenilenmektedir. Kentsel dönüşüm bölgelerindeki yeni yapılar yüksek güvenlik standartlarına sahiptir.",
                },
                {
                  title: "Bağımsız Yapı Denetimi",
                  body: "Lisanslı bir yapı denetim şirketinden bağımsız teknik rapor alın. Bu rapor, binanın taşıyıcı sistemini, kolon/kiriş sağlamlığını ve depreme hazırlığını değerlendirir.",
                },
                {
                  title: "DASK (Zorunlu Deprem Sigortası)",
                  body: "Türkiye'de tüm konutlar için zorunlu olan DASK sigortası, deprem hasarlarını güvence altına alır. Prim miktarı konumun deprem riski bölgesine ve evin metrekaresine göre belirlenir.",
                },
              ].map((item, i) => (
                <Card key={i} className="p-5 border-card-border">
                  <div className="flex gap-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1.5">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-5">İstanbul'da Deprem Riski Düşük Bölgeler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "Sarıyer (Boğaz Kuzeyi)", risk: "Düşük-Orta", note: "Sağlam anakaya zemini" },
                { name: "Beykoz", risk: "Düşük-Orta", note: "Az yoğunluklu yapılaşma" },
                { name: "Şile ve Çevresi", risk: "Düşük", note: "Fay hattından uzak" },
                { name: "Çekmeköy (Yayla)", risk: "Düşük-Orta", note: "Yeni ve denetimli yapılar" },
                { name: "Başakşehir (Yeni Projeler)", risk: "Orta", note: "Modern yapılaşma" },
                { name: "Ataşehir (Yeni Yapılar)", risk: "Orta", note: "2010+ inşaat" },
              ].map((region) => (
                <div key={region.name} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                    region.risk.includes("Düşük") ? "bg-emerald-500" : "bg-amber-500"
                  }`} />
                  <div>
                    <p className="font-medium text-sm">{region.name}</p>
                    <p className="text-xs text-muted-foreground">{region.risk} Risk · {region.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-lg border border-border bg-card/50 flex gap-3">
              <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Bu bilgiler genel bir rehber niteliğindedir. Satın almadan önce mutlaka bağımsız uzman görüşü alınız. Mirhan Gayrimenkul danışmanları, sorularınızı yanıtlamak için hazırdır.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-amber-50 dark:bg-amber-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Güvenli Mülk Alımı İçin Danışın</h2>
          <p className="text-muted-foreground mb-8">
            İstanbul'da güvenli, değeri artacak bir mülk almak için Mirhan Gayrimenkul uzmanlarından destek alın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/905494492336" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <SiWhatsapp className="w-5 h-5 mr-2" />
                WhatsApp Danışmanlık
              </Button>
            </a>
            <Link href="/istanbul-satin-alma-rehberi">
              <Button size="lg" variant="outline">Satın Alma Rehberi</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
