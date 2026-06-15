import { Mail, Phone, MapPin } from "lucide-react";
import { SiWhatsapp, SiInstagram, SiX } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import { Link } from "wouter";

const SOCIAL_LINKS = [
  { icon: SiInstagram, label: "Instagram", url: "https://www.instagram.com/mirhan.gayrimenkull?igsh=MWxobjV0N2IxNmx1NA==", testId: "link-social-instagram" },
  { icon: SiX, label: "X (Twitter)", url: "https://x.com/mirhanestate", testId: "link-social-twitter" },
  { icon: FaLinkedinIn, label: "LinkedIn", url: "https://www.linkedin.com/company/mirhan-gayrimenkul/", testId: "link-social-linkedin" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <img src="/logo.png" alt="Mirhan Gayrimenkul" className="h-16 w-auto object-contain" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              İstanbul'da güvenilir emlak danışmanlığı ile hayalinizdeki evi bulmanıza yardımcı oluyoruz.
            </p>
            <a
              href="https://wa.me/905494492336"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
              data-testid="link-whatsapp"
            >
              <SiWhatsapp className="w-4 h-4" />
              WhatsApp ile İletişim
            </a>
            <div className="flex items-center gap-3" data-testid="section-social-links">
              {SOCIAL_LINKS.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" title={s.label} className="text-muted-foreground hover:text-amber-600 transition-colors" data-testid={s.testId}>
                  <s.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li><Link href="/istanbul-emlak-ilanlari?listingType=sale" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-sale">Satılık İlanlar</Link></li>
              <li><Link href="/istanbul-emlak-ilanlari?listingType=rent" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-rent">Kiralık İlanlar</Link></li>
              <li><Link href="/istanbul-satin-alma-rehberi" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-guide">Satın Alma Rehberi</Link></li>
              <li><Link href="/istanbul-emlak-blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-blog">Blog</Link></li>
              <li><Link href="/deprem-guvenlik-rehberi" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-earthquake">Deprem Rehberi</Link></li>
              <li><Link href="/istanbul-emlak-danismanlari" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-team">Ekibimiz</Link></li>
              <li><Link href="/rusca-emlak-hizmetleri" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-ru">🇷🇺 Русский</Link></li>
              <li><Link href="/farsca-emlak-hizmetleri" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-fa">🇮🇷 فارسی</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Emlak Rehberleri</h3>
            <ul className="space-y-2">
              <li><Link href="/istanbul-emlak-rehberi" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-emlak-rehberi">İstanbul Emlak Rehberi</Link></li>
              <li><Link href="/istanbul-yatirim-bolgeleri" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-yatirim">Yatırım Bölgeleri</Link></li>
              <li><Link href="/besiktas-emlak-rehberi" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-besiktas-rehber">Beşiktaş Rehberi</Link></li>
              <li><Link href="/kadikoy-emlak-rehberi" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-kadikoy-rehber">Kadıköy Rehberi</Link></li>
              <li><Link href="/sariyer-emlak-rehberi" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-sariyer-rehber">Sarıyer Rehberi</Link></li>
              <li><Link href="/istanbul-gayrimenkul-piyasasi" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-piyasa">Piyasa Analizi</Link></li>
              <li><Link href="/istanbul-emlak-sss" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-sss">Sıkça Sorulan Sorular</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://maps.google.com/?q=Nişantaşı+Şişli+İstanbul" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  Nişantaşı, Şişli/İstanbul
                </a>
              </li>
              <li>
                <a href="tel:+905494492336" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  +90 549 449 23 36
                </a>
              </li>
              <li>
                <a href="tel:+902121234567" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  +90 212 123 45 67
                </a>
              </li>
              <li>
                <a href="mailto:info@mirhanestate.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  info@mirhanestate.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Mirhan Gayrimenkul. Tüm hakları saklıdır.
          </p>
          <a
            href="https://mirhanestate.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            mirhanestate.com
          </a>
        </div>
      </div>
    </footer>
  );
}
