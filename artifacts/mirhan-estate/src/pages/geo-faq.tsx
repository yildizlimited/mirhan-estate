import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useSeo } from "@/hooks/use-seo";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SiWhatsapp } from "react-icons/si";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

function FAQ({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden" data-testid={`faq-${idx}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-muted/50 transition-colors">
        <span className="font-medium text-sm sm:text-base pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">{a}</div>}
    </div>
  );
}

export default function GeoFaqPage() {
  useSeo({
    title: "İstanbul Emlak Sıkça Sorulan Sorular",
    description: "İstanbul'da ev alırken merak edilen tüm sorular. Tapu işlemleri, fiyatlar, yabancı alıcılar, vatandaşlık ve daha fazlası.",
    keywords: "istanbul emlak sss, istanbul ev alma sorular, istanbul tapu, istanbul konut fiyatları, yabancı emlak türkiye, türk vatandaşlığı mülk",
    canonical: "https://mirhanestate.com/istanbul-emlak-sss",
  });

  const faqs = [
    { q: "İstanbul'da ev almak için en iyi bölge hangisi?", a: "İstanbul'da en iyi bölge tamamen ihtiyacınıza göre değişir. Yatırım için: Başakşehir, Kağıthane, Ataşehir. Yaşam kalitesi için: Beşiktaş, Kadıköy, Sarıyer. Uygun bütçe için: Beylikdüzü, Esenyurt, Bahçelievler. Prestij için: Nişantaşı, Bebek, Etiler." },
    { q: "İstanbul'da ortalama daire fiyatı ne kadar?", a: "2026 yılı itibarıyla İstanbul geneli için ortalama konut m² fiyatı yaklaşık 55.000-65.000 TL seviyesindedir. Beşiktaş ve Kadıköy'de 80.000-120.000 TL/m², Beylikdüzü'nde 25.000-40.000 TL/m² arasında seyretmektedir." },
    { q: "Yabancı uyruklular İstanbul'da ev alabilir mi?", a: "Evet. 183'ten fazla ülke vatandaşı Türkiye'de gayrimenkul satın alabilir. Gerekli belgeler: pasaport, döviz alım belgesi ve çevrilmiş kimlik belgesidir. İşlemler tapu müdürlüğünde yaklaşık 3-5 iş günü sürer." },
    { q: "İstanbul'da ev almak için Türk vatandaşlığı gerekiyor mu?", a: "Hayır. Yabancı uyruklu kişiler de İstanbul'da ev alabilir. Tam tersi, 400.000 USD ve üzerinde mülk alanlar Türk vatandaşlığı başvurusu yapabilir." },
    { q: "İstanbul'da konut kredisi (mortgage) kullanabilir miyim?", a: "Türk vatandaşları için kolayca. Yabancı uyruklu kişiler için bazı Türk bankaları döviz cinsinden kredi vermektedir. Genellikle evin değerinin %70'ine kadar finansman mümkündür." },
    { q: "İstanbul'da tapu harcı ne kadar?", a: "Satış bedeli üzerinden %4 tapu harcı alınır (alıcı %2, satıcı %2). Döner sermaye, ekspertiz (zorunlu, yaklaşık 2.000-3.000 TL) ve DASK sigortası ek masraflar arasındadır." },
    { q: "İstanbul'da kira getirisi ne kadar?", a: "İstanbul'da brüt kira getirisi bölgeye göre %4-9 arasında değişir. Merkezi ilçelerde genellikle %4-6, gelişen ilçelerde (Başakşehir, Kağıthane) %6-9 oranında kira geliri elde edilebilir." },
    { q: "İstanbul'da en güvenli bölgeler hangileri?", a: "Hem yaşam güvenliği hem de deprem riski açısından Sarıyer'in iç bölgeleri, Beykoz, Şile ve yeni yapılaşan Başakşehir öne çıkmaktadır. Depreme dayanıklılık açısından 2000 sonrası yapılar tercih edilmelidir." },
    { q: "İstanbul'da ev almanın toplam maliyeti ne?", a: "Satış bedeline ek olarak: %4 tapu harcı, ekspertiz (2.000-3.000 TL), noter masrafı (varsa sözleşme için), DASK sigortası (yıllık 500-2.000 TL), emlak danışmanlık komisyonu (genellikle %2 KDV dahil) hesaba katılmalıdır." },
    { q: "Mirhan Gayrimenkul ne gibi hizmetler sunuyor?", a: "Mirhan Gayrimenkul; satılık ve kiralık mülk danışmanlığı, ücretsiz gayrimenkul değerleme, yatırım danışmanlığı, Türk vatandaşlığı başvuru desteği, tapu ve hukuki süreç takibi ile satış sonrası destek hizmetleri sunmaktadır. Türkçe, Rusça, Farsça ve İngilizce dillerinde hizmet verilmektedir." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(f => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <Header />

      <section className="py-12 bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-faq-title">
            İstanbul Emlak — Sıkça Sorulan Sorular
          </h1>
          <p className="text-muted-foreground text-lg">
            İstanbul'da ev alırken merak ettiğiniz tüm sorular
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {faqs.map((faq, i) => <FAQ key={i} q={faq.q} a={faq.a} idx={i} />)}
          </div>

          <div className="mt-12 text-center space-y-4">
            <p className="text-muted-foreground">
              Başka sorularınız mı var? Mirhan Gayrimenkul uzmanları yanıtlamak için burada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/905494492336" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <SiWhatsapp className="w-5 h-5 mr-2" />
                  WhatsApp ile Sorun
                </Button>
              </a>
              <Link href="/iletisim">
                <Button size="lg" variant="outline">İletişim Formu</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
