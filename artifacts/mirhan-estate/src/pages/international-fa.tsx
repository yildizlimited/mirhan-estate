import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useSeo } from "@/hooks/use-seo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiWhatsapp, SiTelegram } from "react-icons/si";
import { CheckCircle2, Phone, Globe } from "lucide-react";

export default function InternationalFaPage() {
  useSeo({
    title: "خرید ملک در استانبول - Mirhan Gayrimenkul",
    description: "خرید آپارتمان و ویلا در استانبول با راهنمایی فارسی زبان. اخذ اقامت و شهروندی ترکیه از طریق خرید ملک. مشاوره رایگان با Mirhan Gayrimenkul.",
    keywords: "خرید ملک استانبول, آپارتمان استانبول, شهروندی ترکیه, اقامت ترکیه, مسکن استانبول, میرحان گایریمنکول",
    canonical: "https://mirhanestate.com/farsca-emlak-hizmetleri",
  });

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Header />

      <section className="py-12 md:py-16 bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🇮🇷</span>
            <Globe className="w-6 h-6 text-amber-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-fa-title">
            خرید ملک در استانبول
          </h1>
          <p className="text-muted-foreground text-lg leading-loose">
            شرکت Mirhan Gayrimenkul، شریک مورد اعتماد شما در بازار مسکن استانبول است. ما به شهروندان ایران و سایر کشورهای فارسی‌زبان کمک می‌کنیم تا بهترین آپارتمان، ویلا یا ملک تجاری را در استانبول پیدا کنند.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" dir="rtl">
          <div>
            <h2 className="text-2xl font-bold mb-6">خدمات ما</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "خرید و فروش آپارتمان در استانبول",
                "جستجوی ملک بر اساس معیارهای شما",
                "بررسی اسناد و مشاوره حقوقی",
                "اخذ شهروندی ترکیه از طریق سرمایه‌گذاری",
                "کمک در اخذ اقامت ترکیه",
                "افتتاح حساب بانکی در ترکیه",
                "مدیریت ملک و اجاره‌داری",
                "خدمات ترجمه در طول معامله",
              ].map((service) => (
                <div key={service} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm">{service}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">محله‌های محبوب استانبول</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "بشیکتاش", desc: "منطقه لوکس با چشم‌انداز بسفر، مرکز تجاری", price: "80.000-120.000 ₺/م²" },
                { name: "کادیکوی", desc: "مرکز فرهنگی در سمت آسیایی، تقاضای بالا", price: "60.000-100.000 ₺/م²" },
                { name: "ساریر", desc: "کنار بسفر، مارینا، ویلاهای لوکس", price: "70.000-150.000 ₺/م²" },
                { name: "بیلیکدوزو", desc: "پروژه‌های جدید، قیمت مناسب، محیط خانوادگی", price: "25.000-40.000 ₺/م²" },
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
            <h2 className="text-xl font-bold mb-4">شهروندی ترکیه از طریق خرید ملک</h2>
            <p className="text-muted-foreground text-sm leading-loose mb-4">
              با خرید ملک به ارزش حداقل <strong>400.000 دلار</strong>، می‌توانید درخواست اخذ شهروندی ترکیه دهید. این فرایند معمولاً ۳ تا ۶ ماه طول می‌کشد. Mirhan Gayrimenkul از انتخاب ملک تا دریافت پاسپورت همراه شما خواهد بود.
            </p>
            <ul className="space-y-2">
              {[
                "ورود بدون ویزا به بیش از ۱۱۰ کشور",
                "شهروندی برای کل خانواده",
                "نیازی به اقامت دائمی نیست",
                "شهروندی دوگانه مجاز است",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">تماس با ما</h2>
            <p className="text-muted-foreground">مشاور فارسی‌زبان ما آماده پاسخگویی به سوالات شما است</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/905321234567?text=سلام%2C%20می‌خواهم%20درباره%20خرید%20ملک%20در%20استانبول%20بدانم." target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <SiWhatsapp className="w-5 h-5 mr-2" />
                  واتساپ
                </Button>
              </a>
              <a href="https://t.me/+905321234567" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white">
                  <SiTelegram className="w-5 h-5 mr-2" />
                  تلگرام
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
