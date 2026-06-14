import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useSeo } from "@/hooks/use-seo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SiWhatsapp, SiTelegram } from "react-icons/si";
import { CheckCircle2, Phone, Globe } from "lucide-react";

export default function InternationalRuPage() {
  useSeo({
    title: "Недвижимость в Стамбуле - Mirhan Gayrimenkul",
    description: "Купить квартиру или виллу в Стамбуле. Русскоязычная помощь в покупке недвижимости в Турции. Гражданство Турции за инвестиции от 400 000 USD.",
    keywords: "купить квартиру стамбул, недвижимость стамбул, квартиры стамбул цены, гражданство турции инвестиции, стамбул жилье, мирхан гайрименкул",
    canonical: "https://mirhanestate.com/rusca-emlak-hizmetleri",
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "Mirhan Gayrimenkul",
            description: "Недвижимость в Стамбуле — русскоязычная помощь",
            url: "https://mirhanestate.com/rusca-emlak-hizmetleri",
            knowsLanguage: ["tr", "ru"],
            telephone: "+905321234567",
          }),
        }}
      />
      <Header />

      <section className="py-12 md:py-16 bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🇷🇺</span>
            <Globe className="w-6 h-6 text-amber-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-ru-title">
            Недвижимость в Стамбуле
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Компания Mirhan Gayrimenkul — ваш надёжный русскоязычный партнёр на рынке недвижимости Стамбула. Мы помогаем гражданам России и СНГ найти идеальную квартиру, виллу или коммерческую недвижимость в Турции.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Наши услуги</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Продажа и аренда квартир в Стамбуле",
                "Поиск недвижимости по вашим критериям",
                "Проверка документов и юридическое сопровождение",
                "Оформление турецкого гражданства за инвестиции",
                "Помощь в получении вида на жительство",
                "Открытие банковского счёта в Турции",
                "Управление недвижимостью и аренда",
                "Переводческие услуги в процессе сделки",
              ].map((service) => (
                <div key={service} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm">{service}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Популярные районы Стамбула</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "Бешикташ", desc: "Элитный район с видом на Босфор, центр деловой жизни", price: "80.000-120.000 ₺/м²" },
                { name: "Кадыкёй", desc: "Культурный центр на азиатской стороне, высокий спрос", price: "60.000-100.000 ₺/м²" },
                { name: "Сарыер", desc: "Вдоль Босфора, яхт-клубы, роскошные виллы", price: "70.000-150.000 ₺/м²" },
                { name: "Баширабека", desc: "Новые проекты, доступные цены, семейная атмосфера", price: "30.000-50.000 ₺/м²" },
              ].map((area) => (
                <Card key={area.name} className="p-5 border-card-border">
                  <h3 className="font-semibold mb-1.5">{area.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{area.desc}</p>
                  <p className="text-sm font-medium text-primary">{area.price}</p>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-6 border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10">
            <h2 className="text-xl font-bold mb-4">Гражданство Турции за инвестиции</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              При покупке недвижимости стоимостью от <strong>400 000 USD</strong> вы можете подать заявку на турецкое гражданство. Процесс занимает 3-6 месяцев. Mirhan Gayrimenkul сопровождает весь процесс от выбора объекта до получения паспорта.
            </p>
            <ul className="space-y-2">
              {[
                "Безвизовый въезд в 110+ стран",
                "Гражданство для всей семьи",
                "Нет требования к постоянному проживанию",
                "Двойное гражданство разрешено",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Связаться с нами</h2>
            <p className="text-muted-foreground">Наш русскоязычный специалист готов ответить на все ваши вопросы</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/905321234567?text=Здравствуйте%2C%20хочу%20узнать%20о%20недвижимости%20в%20Стамбуле." target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <SiWhatsapp className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
              </a>
              <a href="https://t.me/+905321234567" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white">
                  <SiTelegram className="w-5 h-5 mr-2" />
                  Telegram
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
