import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useSeo } from "@/hooks/use-seo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SiWhatsapp } from "react-icons/si";
import { CheckCircle2, Phone, ChevronDown } from "lucide-react";
import { useState } from "react";

function AccordionItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors">
        <span className="font-medium text-sm pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">{a}</div>}
    </div>
  );
}

export default function BuyingGuidePage() {
  useSeo({
    title: "İstanbul'da Ev Satın Alma Rehberi",
    description: "İstanbul'da ev veya daire almak için adım adım rehber. Tapu işlemleri, vergi, ekspertiz, kredi ve Türk vatandaşlığı başvuru süreci hakkında kapsamlı bilgi.",
    keywords: "istanbul ev satın alma, istanbul tapu işlemleri, istanbul konut kredisi, türk vatandaşlığı mülk, istanbul satılık daire nasıl alınır, yabancıya ev satışı türkiye",
    canonical: "https://mirhanestate.com/istanbul-satin-alma-rehberi",
  });

  const steps = [
    {
      num: "01",
      title: "Bütçe ve Finansman Planı",
      body: "Satın alma sürecine başlamadan önce net bir bütçe belirleyin. Konut kredisi kullanacaksanız, gelir düzeyinize göre bankaların alabileceği kredi miktarını araştırın. İstanbul'da bankalar genellikle evin değerinin %70-80'ine kadar konut kredisi vermektedir. Ek masraflar için (tapu, vergi, ekspertiz) satış bedelinin yaklaşık %6-8'ini ayırın.",
    },
    {
      num: "02",
      title: "Bölge ve Mülk Araştırması",
      body: "İstanbul'un 39 ilçesi farklı fiyat segmentleri ve yaşam özelliklerine sahiptir. Beşiktaş, Sarıyer, Kadıköy, Şişli gibi merkezi ilçeler yüksek değerli ancak düşük kira getirisi sunarken; Başakşehir, Beylikdüzü, Küçükçekmece gibi ilçeler daha uygun fiyatla yüksek kira getirisi potansiyeli taşır.",
    },
    {
      num: "03",
      title: "Hukuki İnceleme ve Ekspertiz",
      body: "Mülkü satın almadan önce tapu kaydını, ipotek ya da haciz bulunup bulunmadığını kontrol ettirin. Lisanslı bir ekspertiz firmasından bağımsız değerleme raporu alın. İstanbul'daki çeşitli yapılarda kentsel dönüşüm durumunu da araştırmanız önemlidir.",
    },
    {
      num: "04",
      title: "Satış Sözleşmesi",
      body: "Satıcıyla anlaşma sağlandığında, noterde ön alım sözleşmesi (ön protokol) imzalanması tavsiye edilir. Bu aşamada genellikle %10 kaparo ödenir. Sözleşme, teslimat tarihi, ödeme planı ve tüm şartları içermelidir.",
    },
    {
      num: "05",
      title: "Tapu Devir İşlemleri",
      body: "Tapu devri İstanbul Tapu Müdürlükleri'nde gerçekleştirilir. Randevu sistemiyle (e-randevu.tkgm.gov.tr) işlem yapılır. Gerekli belgeler: kimlik/pasaport, tapu belgesi, ekspertiz raporu, döviz alım belgesi (yabancılar için), DASK poliçesi. Tapu harcı satış bedelinin %4'ü kadardır (alıcı ve satıcı %2'şer öder).",
    },
    {
      num: "06",
      title: "Teslimat ve Abonelikler",
      body: "Tapu devri sonrası ev, satıcıdan teslim alınır. IBAN ile elektrik (AYEDAŞ/BEDAŞ), doğalgaz, su (İSKİ) aboneliklerini üzerinize alın. Apartman yönetimiyle tanışarak aidat ve kuralları öğrenin.",
    },
  ];

  const faqs = [
    { q: "Yabancı uyruklu kişiler İstanbul'da ev alabilir mi?", a: "Evet. 183'ten fazla ülke vatandaşı Türkiye'de gayrimenkul satın alabilir. Rus, İranlı, Körfez ülkeleri ve Avrupa'dan yatırımcılar İstanbul'un en aktif yabancı alıcı profilini oluşturmaktadır. İşlem kolaydır; pasaport ve döviz alım belgesi temel gereksinimdir." },
    { q: "Konut almak Türk vatandaşlığı hakkı sağlar mı?", a: "Evet. 400.000 USD ve üzeri değerinde tek veya birden fazla mülk satın alarak Türk vatandaşlığı başvurusunda bulunabilirsiniz. Mülkler 3 yıl satılmamak kaydıyla vatandaşlık başvurusu yapılabilir ve süreç genellikle 3-6 ay sürer." },
    { q: "İstanbul'da tapu masrafları ne kadar?", a: "Satış bedelinin %4'ü tapu harcı (alıcı ve satıcı %2'şer öder). Buna ek olarak döner sermaye bedeli, ekspertiz ücreti (~2.000-3.000 TL), DASK poliçesi ve isteğe bağlı avukatlık ücreti gelir. Toplam ek masraf satış bedelinin yaklaşık %5-7'si kadardır." },
    { q: "İstanbul'da ortalama ev fiyatları ne kadar?", a: "2026 yılı itibarıyla İstanbul'da 2+1 daire fiyatları Beylikdüzü'nde 2.5-4 milyon TL, Kadıköy'de 6-10 milyon TL, Beşiktaş ve Sarıyer'de 8-15 milyon TL aralığında seyretmektedir. Merkezi ilçelerdeki Boğaz manzaralı daireler çok daha yüksek fiyatlara ulaşabilir." },
    { q: "Konut kredisiyle ev alınabilir mi?", a: "Türk vatandaşları için Türk bankalarında TL bazlı konut kredisi kullanılabilir. Yabancı uyruklu kişiler de bazı Türk bankalarından USD/EUR cinsinden kredi alabilmektedir. Genellikle evin ekspertiz değerinin %70'e kadar finansman mümkündür." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="py-12 bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-guide-title">İstanbul'da Ev Satın Alma Rehberi</h1>
          <p className="text-muted-foreground text-lg">
            İstanbul'da mülk satın alma sürecini adım adım açıklayan kapsamlı rehber
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Satın Alma Adımları</h2>
          <div className="space-y-6">
            {steps.map((step) => (
              <Card key={step.num} className="p-6 border-card-border">
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <span className="text-amber-700 dark:text-amber-300 font-bold text-sm">{step.num}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.body}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-card/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Sıkça Sorulan Sorular</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} q={faq.q} a={faq.a} idx={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-amber-50 dark:bg-amber-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Uzman Desteği Alın</h2>
          <p className="text-muted-foreground mb-8">Mirhan Gayrimenkul danışmanları, İstanbul'da ev satın alma sürecinin her aşamasında yanınızda.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/905321234567?text=Merhaba%2C%20İstanbul'da%20ev%20almak%20istiyorum." target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <SiWhatsapp className="w-5 h-5 mr-2" />
                WhatsApp Danışmanlık
              </Button>
            </a>
            <a href="tel:+905321234567">
              <Button size="lg" variant="outline">
                <Phone className="w-5 h-5 mr-2" />
                +90 532 123 45 67
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
