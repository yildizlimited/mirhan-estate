import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone, Mail, Search, Star, Award, Users, Building2, MapPin, Briefcase, Languages } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useSeo } from "@/hooks/use-seo";
import { useState, useMemo } from "react";

type TeamMember = {
  id: number;
  name: string;
  title: string;
  phone?: string | null;
  email?: string | null;
  profileImage?: string | null;
  description?: string | null;
  specialty?: string[] | null;
  experience?: number | null;
  languages?: string[] | null;
  rating?: string | null;
  reviewCount?: number | null;
  sortOrder?: number | null;
  active?: boolean | null;
};

const SPECIALTY_FILTERS = [
  { key: "all", label: "Tüm Danışmanlar", icon: Users },
  { key: "Konut", label: "Konut Uzmanları", icon: Building2 },
  { key: "Villa", label: "Villa Uzmanları", icon: Building2 },
  { key: "Arsa", label: "Arsa Uzmanları", icon: MapPin },
  { key: "Ticari Gayrimenkul", label: "Ticari Gayrimenkul", icon: Briefcase },
  { key: "Yabancı Müşteri", label: "Yabancı Müşteri", icon: Award },
];

export default function TeamPage() {
  useSeo({
    title: "İstanbul Emlak Danışmanlarımız | Mirhan Gayrimenkul",
    description: "Mirhan Gayrimenkul'un İstanbul'da uzman emlak danışmanları. Beşiktaş, Kadıköy, Sarıyer ve tüm İstanbul'da profesyonel gayrimenkul danışmanlığı.",
    keywords: "istanbul emlak danışmanı, istanbul gayrimenkul danışmanı, mirhan gayrimenkul ekibi, istanbul satış temsilcisi",
    canonical: "https://mirhanestate.com/istanbul-emlak-danismanlari",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: members, isLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/team"],
  });

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    let filtered = members;
    if (activeFilter !== "all") {
      filtered = filtered.filter(m =>
        m.specialty && m.specialty.some(s => s === activeFilter)
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        (m.description && m.description.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [members, activeFilter, searchQuery]);

  const renderStars = (rating: string | null | undefined) => {
    const r = parseFloat(rating || "0");
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < Math.round(r) ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30"}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "Mirhan Gayrimenkul",
            url: "https://mirhanestate.com",
            employee: members?.map(m => ({
              "@type": "Person",
              name: m.name,
              jobTitle: m.title,
              telephone: m.phone,
              email: m.email,
              worksFor: { "@type": "Organization", name: "Mirhan Gayrimenkul" },
            })) || [],
          }).replace(/</g, "\\u003c"),
        }}
      />
      <Header />

      <section className="bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20 dark:to-background py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-team-title">
            Emlak Danışmanlarımız
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Deneyimli ve profesyonel ekibimizle İstanbul'da gayrimenkul yatırımlarınızda yanınızdayız.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-8" data-testid="filter-specialty">
            {SPECIALTY_FILTERS.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  activeFilter === filter.key
                    ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                    : "bg-background text-foreground border-border hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                }`}
                data-testid={`button-filter-${filter.key}`}
              >
                <filter.icon className="w-3.5 h-3.5" />
                {filter.label}
              </button>
            ))}
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Danışman ismi ile arama yapın..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-full border-border"
                data-testid="input-search-team"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-[420px] rounded-xl" />)}
            </div>
          ) : filteredMembers.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6" data-testid="text-team-count">
                <span className="font-semibold text-foreground">{filteredMembers.length}</span> danışman
                {activeFilter !== "all" && (
                  <span> — {SPECIALTY_FILTERS.find(f => f.key === activeFilter)?.label}</span>
                )}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => {
                  const initials = member.name.split(" ").map(n => n.charAt(0)).join("").slice(0, 2);
                  const whatsAppNumber = member.phone?.replace(/[\s\-\(\)]/g, "").replace(/^\+/, "") || "";
                  return (
                    <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group relative" data-testid={`card-team-member-${member.id}`}>
                      <div className="relative bg-gradient-to-br from-muted/50 via-background to-muted/30 p-6 pb-4 text-center">
                        {member.experience && (
                          <div className="absolute top-3 right-3 bg-amber-600 text-white text-[10px] font-bold w-11 h-11 rounded-lg flex flex-col items-center justify-center shadow-md" data-testid={`badge-exp-${member.id}`}>
                            <span className="text-sm leading-none">{member.experience}</span>
                            <span className="leading-none">YIL</span>
                          </div>
                        )}
                        <div className="relative inline-block mb-4">
                          {member.profileImage ? (
                            <img
                              src={member.profileImage}
                              alt={member.name}
                              className="w-32 h-32 rounded-full object-cover border-4 border-amber-200 dark:border-amber-800 shadow-lg group-hover:border-amber-400 transition-colors"
                              loading="lazy"
                              decoding="async"
                              data-testid={`img-team-member-${member.id}`}
                            />
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 flex items-center justify-center border-4 border-amber-200 dark:border-amber-800 shadow-lg group-hover:border-amber-400 transition-colors">
                              <span className="text-4xl font-bold text-amber-700 dark:text-amber-300">{initials}</span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-bold mb-0.5" data-testid={`text-team-name-${member.id}`}>{member.name}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{member.title}</p>
                        <p className="text-xs font-semibold text-amber-600">Mirhan Gayrimenkul</p>
                      </div>

                      <div className="px-6 pb-2">
                        {member.specialty && member.specialty.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3 justify-center" data-testid={`tags-specialty-${member.id}`}>
                            {member.specialty.map((s, i) => (
                              <span key={i} className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                        {member.languages && member.languages.length > 0 && (
                          <p className="text-[11px] text-center text-muted-foreground mb-3 flex items-center justify-center gap-1" data-testid={`text-languages-${member.id}`}>
                            <Languages className="w-3 h-3" />
                            {member.languages.join(", ")}
                          </p>
                        )}
                      </div>

                      <div className="border-t border-border mx-4" />

                      <div className="px-6 py-3">
                        {member.rating && (
                          <div className="flex items-center justify-between mb-3" data-testid={`rating-team-${member.id}`}>
                            {renderStars(member.rating)}
                            <span className="text-xs text-muted-foreground">{member.reviewCount || 0} Müşteri Yorumu</span>
                          </div>
                        )}
                        <div className="space-y-2">
                          {member.phone && (
                            <a href={`tel:${member.phone}`} className="flex items-center gap-2.5 text-sm hover:text-amber-600 transition-colors" data-testid={`link-team-phone-${member.id}`}>
                              <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>{member.phone}</span>
                            </a>
                          )}
                          {member.email && (
                            <a href={`mailto:${member.email}`} className="flex items-center gap-2.5 text-sm hover:text-amber-600 transition-colors truncate" data-testid={`link-team-email-${member.id}`}>
                              <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                              <span className="truncate">{member.email}</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {whatsAppNumber && (
                        <div className="px-4 pb-4">
                          <a href={`https://wa.me/${whatsAppNumber}`} target="_blank" rel="noopener noreferrer" data-testid={`link-team-whatsapp-${member.id}`}>
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
                              <SiWhatsapp className="w-4 h-4 mr-2" />
                              WhatsApp ile İletişim
                            </Button>
                          </a>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-16" data-testid="text-team-empty">
              <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">
                {searchQuery || activeFilter !== "all"
                  ? "Arama kriterlerine uygun danışman bulunamadı."
                  : "Henüz ekip üyesi eklenmemiş."}
              </p>
              {(searchQuery || activeFilter !== "all") && (
                <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveFilter("all"); }} data-testid="button-clear-filters">
                  Filtreleri Temizle
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Mirhan Gayrimenkul Ekibine Katılın</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            İstanbul'da emlak sektöründe kariyer yapmak istiyorsanız, deneyimli ekibimize katılabilirsiniz.
          </p>
          <a href="mailto:info@mirhanestate.com?subject=Kariyer%20Başvurusu" data-testid="link-team-career">
            <Button variant="outline" className="font-semibold">
              <Mail className="w-4 h-4 mr-2" />
              Kariyer Başvurusu
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
