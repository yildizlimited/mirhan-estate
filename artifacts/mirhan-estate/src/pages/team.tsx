import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone, Mail, Users } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useSeo } from "@/hooks/use-seo";

export default function TeamPage() {
  useSeo({
    title: "İstanbul Emlak Danışmanlarımız",
    description: "Mirhan Gayrimenkul'un İstanbul'da uzman emlak danışmanları. Beşiktaş, Kadıköy, Sarıyer ve tüm İstanbul'da profesyonel gayrimenkul danışmanlığı.",
    keywords: "istanbul emlak danışmanı, istanbul gayrimenkul danışmanı, mirhan gayrimenkul ekibi, istanbul satış temsilcisi",
    canonical: "https://mirhanestate.com/istanbul-emlak-danismanlari",
  });

  const { data: agents, isLoading } = useQuery<any[]>({
    queryKey: ["/api/agents"],
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="py-12 md:py-16 bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-team-title">
            Emlak Danışmanlarımız
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            İstanbul'un tüm ilçelerinde uzman kadromuzla yanınızdayız. Satış, kiralama ve yatırım süreçlerinizde güvenilir rehberiniz.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : agents && agents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agents.map((agent) => {
              const name = agent.user?.name || "Danışman";
              const email = agent.user?.email || "info@mirhanestate.com";
              const phone = agent.phone || "+905321234567";
              const initials = name.split(" ").map((n: string) => n.charAt(0)).join("").slice(0, 2);
              const waPhone = phone.replace(/[\s\-\(\)\+]/g, "");
              return (
                <Card key={agent.id} className="overflow-hidden border-card-border hover:shadow-md transition-shadow" data-testid={`card-agent-${agent.id}`}>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 p-8 text-center">
                    <div className="w-20 h-20 rounded-full mx-auto bg-amber-200 dark:bg-amber-800 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-md">
                      <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">{initials}</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg" data-testid={`text-agent-name-${agent.id}`}>{name}</h3>
                      {agent.companyName && (
                        <p className="text-sm text-muted-foreground">{agent.companyName}</p>
                      )}
                      <p className="text-xs text-primary font-medium mt-1">Mirhan Gayrimenkul</p>
                    </div>
                    {agent.description && (
                      <p className="text-xs text-muted-foreground text-center line-clamp-2">{agent.description}</p>
                    )}
                    <div className="flex flex-col gap-2 pt-2 border-t border-border">
                      <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{phone}</span>
                      </a>
                      <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{email}</span>
                      </a>
                    </div>
                    <a
                      href={`https://wa.me/${waPhone}?text=${encodeURIComponent(`Merhaba ${name}, İstanbul emlak hakkında bilgi almak istiyorum.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
                      data-testid={`link-agent-whatsapp-${agent.id}`}
                    >
                      <SiWhatsapp className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Danışman bilgisi yükleniyor</h3>
            <p className="text-muted-foreground">Lütfen biraz bekleyin.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
