import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Heart, MapPin, Maximize, BedDouble, Bath, Calendar, Building, Layers,
  CheckCircle2, XCircle, Phone, Mail, MessageSquare, Eye, Share2,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useSeo } from "@/hooks/use-seo";
import { useState } from "react";

function formatPrice(price: number, listingType: string): string {
  const formatted = new Intl.NumberFormat("tr-TR").format(price);
  return listingType === "rent" ? `${formatted} ₺/ay` : `${formatted} ₺`;
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: property, isLoading } = useQuery<any>({
    queryKey: ["/api/properties", id],
    queryFn: async () => {
      const res = await fetch(`/api/properties/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
  });

  useSeo({
    title: property ? `${property.title} - ${property.city}` : "İlan Detayı",
    description: property ? `${property.title}, ${property.city} ${property.district}. ${property.squareMeters} m², ${property.rooms} oda. ${new Intl.NumberFormat("tr-TR").format(property.price)} ₺` : "Mirhan Gayrimenkul emlak ilanı detayı.",
    keywords: property ? `${property.city} ${property.listingType === 'sale' ? 'satılık' : 'kiralık'} ${property.propertyType}, ${property.district} emlak, istanbul emlak ilanı` : "istanbul emlak ilanı",
    canonical: `https://mirhanestate.com/istanbul-emlak/${id}`,
    ogImage: property?.images?.[0]?.imageUrl,
  });

  const favMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/favorites/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({ title: "Favoriler güncellendi" });
    },
  });

  const messageMutation = useMutation({
    mutationFn: (data: { receiverId: number; propertyId: number; message: string }) =>
      apiRequest("POST", "/api/messages", data),
    onSuccess: () => {
      setMessage("");
      toast({ title: "Mesajınız gönderildi" });
    },
    onError: (e: Error) => {
      toast({ title: "Hata", description: e.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">İlan Bulunamadı</h1>
          <Link href="/istanbul-emlak-ilanlari"><Button className="mt-4">İlanlara Dön</Button></Link>
        </div>
      </div>
    );
  }

  const images = property.images.length > 0 ? property.images : [{ id: 0, propertyId: property.id, imageUrl: `https://picsum.photos/seed/prop${property.id}/800/600`, isPrimary: true }];

  const specs = [
    { icon: Maximize, label: "Alan", value: `${property.squareMeters} m²` },
    { icon: BedDouble, label: "Oda", value: property.rooms },
    { icon: Bath, label: "Banyo", value: `${property.bathrooms}` },
    { icon: Calendar, label: "Bina Yaşı", value: property.buildingAge ? `${property.buildingAge} yıl` : "Belirtilmemiş" },
    { icon: Building, label: "Kat", value: property.floor ? `${property.floor}/${property.totalFloors || "?"}` : "Belirtilmemiş" },
    { icon: Layers, label: "Konut Tipi", value: property.propertyType === "daire" ? "Daire" : property.propertyType === "villa" ? "Villa" : property.propertyType },
  ];

  const features = [
    { label: "Eşyalı", value: property.furnished },
    { label: "Site İçinde", value: property.insideComplex },
    { label: "Krediye Uygun", value: property.mortgageEligible },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors" data-testid="link-breadcrumb-home">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/istanbul-emlak-ilanlari" className="hover:text-foreground transition-colors" data-testid="link-breadcrumb-listings">İlanlar</Link>
          <span>/</span>
          {property.district && (
            <>
              <Link href={`/istanbul-emlak-ilanlari?district=${encodeURIComponent(property.district)}`} className="hover:text-foreground transition-colors" data-testid="link-breadcrumb-district">{property.district}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground truncate max-w-[200px]">{property.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl overflow-hidden bg-card border border-card-border">
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={images[selectedImage]?.imageUrl}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  data-testid="img-property-main"
                  width={800}
                  height={450}
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img: any, i: number) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-colors ${
                        i === selectedImage ? "border-primary" : "border-transparent"
                      }`}
                      data-testid={`button-thumbnail-${i}`}
                    >
                      <img src={img.imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" width={80} height={56} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  className={`${
                    property.listingType === "sale"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                  data-testid="badge-detail-listing-type"
                >
                  {property.listingType === "sale" ? "Satılık" : "Kiralık"}
                </Badge>
                {property.featured && (
                  <Badge className="bg-amber-500 text-white hover:bg-amber-600">Öne Çıkan</Badge>
                )}
                <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
                  <Eye className="w-4 h-4" />
                  <span>{property.views || 0} görüntüleme</span>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-property-title">
                {property.title}
              </h1>

              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span data-testid="text-property-location">
                  {property.city}, {property.district}
                  {property.neighborhood ? `, ${property.neighborhood}` : ""}
                </span>
              </div>

              <p className="text-3xl font-bold text-primary" data-testid="text-property-price">
                {formatPrice(property.price, property.listingType)}
              </p>
            </div>

            <Card className="p-6 border-card-border">
              <h2 className="text-lg font-semibold mb-4">Özellikler</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <spec.icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">{spec.label}</p>
                      <p className="text-sm font-medium">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-card-border">
              <h2 className="text-lg font-semibold mb-4">Ek Özellikler</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {features.map((f) => (
                  <div key={f.label} className="flex items-center gap-2">
                    {f.value ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-muted-foreground/40" />
                    )}
                    <span className={`text-sm ${f.value ? "text-foreground" : "text-muted-foreground"}`}>
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-card-border">
              <h2 className="text-lg font-semibold mb-4">Açıklama</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line" data-testid="text-property-description">
                {property.description}
              </p>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">
              {property.agent && (() => {
                const agentPhone = property.agent.phone || "+905321234567";
                const agentEmail = property.agent.user?.email || "info@mirhanestate.com";
                const agentName = property.agent.user?.name || "Danışman";
                const agentInitials = agentName.split(" ").map((n: string) => n.charAt(0)).join("").slice(0, 2);
                const waPhone = agentPhone.replace(/[\s\-\(\)\+]/g, "");
                return (
                  <Card className="overflow-hidden border-card-border">
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-5 text-center">
                      <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-primary/20 flex items-center justify-center border-2 border-primary/30">
                        <span className="text-2xl font-bold text-primary">{agentInitials}</span>
                      </div>
                      <p className="text-xs font-semibold text-primary tracking-wider uppercase mb-1">Satış Temsilcisi</p>
                      <p className="text-xl font-bold" data-testid="text-agent-name">{agentName}</p>
                      <p className="text-sm text-muted-foreground mt-1">Mirhan Gayrimenkul</p>
                    </div>
                    <div className="p-5 space-y-3">
                      <a href={`tel:${agentPhone}`} className="flex items-center gap-3 text-sm hover:text-primary transition-colors" data-testid="link-agent-phone">
                        <Phone className="w-4 h-4 text-primary shrink-0" />
                        <span>{agentPhone}</span>
                      </a>
                      <a href={`mailto:${agentEmail}`} className="flex items-center gap-3 text-sm hover:text-primary transition-colors" data-testid="link-agent-email">
                        <Mail className="w-4 h-4 text-primary shrink-0" />
                        <span>{agentEmail}</span>
                      </a>
                      <div className="pt-2">
                        <a
                          href={`https://wa.me/${waPhone}?text=${encodeURIComponent(`Merhaba ${agentName}, ${property.title} ilanı hakkında bilgi almak istiyorum. (İlan No: ${property.id})`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid="link-whatsapp-property"
                        >
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                            <SiWhatsapp className="w-5 h-5 mr-2" />
                            WhatsApp ile İletişime Geç
                          </Button>
                        </a>
                      </div>
                    </div>
                  </Card>
                );
              })()}

              {user && property.agent?.user && user.id !== property.agent.user.id && (
                <Card className="p-6 border-card-border">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Danışmana Sorun
                  </h3>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Mesajınızı yazın..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      data-testid="textarea-message"
                    />
                    <Button
                      className="w-full"
                      onClick={() => {
                        if (!message.trim()) return;
                        messageMutation.mutate({
                          receiverId: property.agent!.userId,
                          propertyId: property.id,
                          message: message.trim(),
                        });
                      }}
                      disabled={messageMutation.isPending || !message.trim()}
                      data-testid="button-send-message"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {messageMutation.isPending ? "Gönderiliyor..." : "Gönder"}
                    </Button>
                  </div>
                </Card>
              )}

              <div className="flex gap-2">
                {user && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => favMutation.mutate()}
                    disabled={favMutation.isPending}
                    data-testid="button-favorite-detail"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Favorilere Ekle
                  </Button>
                )}
                <Button variant="outline" size="icon" data-testid="button-share" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              {!user && (
                <Card className="p-6 border-card-border text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Mesaj göndermek veya favorilere eklemek için giriş yapın.
                  </p>
                  <Link href="/login">
                    <Button className="w-full" data-testid="button-login-prompt">Giriş Yap</Button>
                  </Link>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8" data-testid="section-property-internal-links">
        <h2 className="text-lg font-semibold mb-3">Benzer Aramalarda Göz Atın</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/istanbul-satilik-daire"><span className="inline-block px-3 py-1.5 rounded-full bg-muted hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm transition-colors cursor-pointer">İstanbul Satılık Daire</span></Link>
          <Link href="/istanbul-kiralik-daire"><span className="inline-block px-3 py-1.5 rounded-full bg-muted hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm transition-colors cursor-pointer">İstanbul Kiralık Daire</span></Link>
          <Link href="/istanbul-satilik-villa"><span className="inline-block px-3 py-1.5 rounded-full bg-muted hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm transition-colors cursor-pointer">İstanbul Satılık Villa</span></Link>
          <Link href="/istanbul-emlak-ilanlari"><span className="inline-block px-3 py-1.5 rounded-full bg-muted hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm transition-colors cursor-pointer">Tüm İlanlar</span></Link>
          <Link href="/istanbul-satin-alma-rehberi"><span className="inline-block px-3 py-1.5 rounded-full bg-muted hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm transition-colors cursor-pointer">Satın Alma Rehberi</span></Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
