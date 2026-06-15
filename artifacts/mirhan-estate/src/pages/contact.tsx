import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useSeo } from "@/hooks/use-seo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ContactPage() {
  useSeo({
    title: "İletişim - Mirhan Gayrimenkul",
    description: "Mirhan Gayrimenkul ile iletişime geçin. İstanbul'da emlak alım, satım ve kiralama için uzman danışmanlarımız yanınızda.",
    keywords: "mirhan gayrimenkul iletişim, istanbul emlak iletişim, istanbul gayrimenkul danışmanlık telefon",
    canonical: "https://mirhanestate.com/iletisim",
  });

  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await apiRequest("POST", "/api/contact", form);
      toast({ title: "Mesajınız gönderildi", description: "En kısa sürede geri dönüş yapacağız." });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast({ title: "Hata", description: "Mesaj gönderilemedi, lütfen tekrar deneyin.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="py-12 bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-contact-title">İletişim</h1>
          <p className="text-muted-foreground text-lg">İstanbul'daki emlak ihtiyaçlarınız için bizimle iletişime geçin</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Bize Ulaşın</h2>

              {[
                {
                  icon: MapPin,
                  title: "Adres",
                  lines: ["Nişantaşı Mahallesi", "Şişli / İstanbul"],
                  link: "https://maps.google.com/?q=Nişantaşı+Şişli+İstanbul",
                },
                {
                  icon: Phone,
                  title: "Telefon",
                  lines: ["+90 549 449 23 36 (Mobil)", "+90 212 123 45 67 (Ofis)"],
                  link: "tel:+905494492336",
                },
                {
                  icon: Mail,
                  title: "E-posta",
                  lines: ["info@mirhanestate.com"],
                  link: "mailto:info@mirhanestate.com",
                },
                {
                  icon: Clock,
                  title: "Çalışma Saatleri",
                  lines: ["Hafta İçi: 09:00 - 19:00", "Cumartesi: 10:00 - 17:00", "Pazar: Randevuyla"],
                },
              ].map((item) => (
                <Card key={item.title} className="p-5 border-card-border">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">{item.title}</p>
                      {item.lines.map((line) => (
                        <p key={line} className="text-sm text-muted-foreground">{line}</p>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}

              <a
                href="https://wa.me/905494492336?text=Merhaba%2C%20İstanbul'da%20emlak%20hakkında%20bilgi%20almak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-whatsapp-contact"
              >
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" size="lg">
                  <SiWhatsapp className="w-5 h-5 mr-2" />
                  WhatsApp ile Hemen İletişime Geçin
                </Button>
              </a>
            </div>

            <Card className="p-8 border-card-border">
              <h2 className="text-xl font-semibold mb-6">Mesaj Gönderin</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Adınız Soyadınız"
                      required
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+90 5xx xxx xx xx"
                      data-testid="input-contact-phone"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="ornek@email.com"
                    required
                    data-testid="input-contact-email"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Mesajınız</Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Aradığınız mülk hakkında bilgi verin..."
                    rows={5}
                    required
                    data-testid="textarea-contact-message"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={sending} data-testid="button-contact-submit">
                  {sending ? "Gönderiliyor..." : "Mesaj Gönder"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-8">
        <h2 className="text-xl font-bold mb-4 text-center" data-testid="text-map-title">Ofisimizin Konumu</h2>
        <div className="rounded-xl overflow-hidden border border-border shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.6!2d28.9985!3d41.0475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAyJzUxLjAiTiAyOMKwNTknNTQuNiJF!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str&q=Nişantaşı+Şişli+İstanbul"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mirhan Gayrimenkul Ofis Konumu - Nişantaşı, Şişli/İstanbul"
            data-testid="map-office-location"
          />
        </div>
        <p className="text-sm text-muted-foreground text-center mt-3">
          Nişantaşı, Şişli/İstanbul
        </p>
      </section>

      <section className="text-center bg-card rounded-xl border border-border p-8 mx-4 sm:mx-6 lg:mx-8 max-w-5xl lg:mx-auto mb-12" data-testid="section-contact-seo">
        <h2 className="text-xl font-bold mb-3">İstanbul'da Gayrimenkul Danışmanlığı</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Satılık veya kiralık mülk mü arıyorsunuz? Mülkünüzü satmak veya kiralamak mı istiyorsunuz? Mirhan Gayrimenkul olarak İstanbul'un tüm bölgelerinde — Beşiktaş, Kadıköy, Sarıyer, Şişli, Üsküdar, Ataşehir — profesyonel emlak danışmanlığı hizmeti sunuyoruz.
        </p>
      </section>

      <Footer />
    </div>
  );
}
