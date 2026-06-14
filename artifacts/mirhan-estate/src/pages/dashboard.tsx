import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/lib/auth";
import { useSeo } from "@/hooks/use-seo";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Building2, Plus, Eye, Pencil, Trash2, TrendingUp, MessageSquare,
  Home, CheckCircle2, Clock, XCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Property = {
  id: number; title: string; price: string; district: string;
  listingType: string; status: string; views: number; createdAt: string;
};

type FormData = {
  title: string; description: string; price: string; currency: string;
  district: string; neighborhood: string; address: string;
  propertyType: string; listingType: string; rooms: string; bathrooms: string;
  size: string; floor: string; totalFloors: string; yearBuilt: string;
};

const defaultForm: FormData = {
  title: "", description: "", price: "", currency: "TRY",
  district: "Beşiktaş", neighborhood: "", address: "",
  propertyType: "apartment", listingType: "sale", rooms: "2+1",
  bathrooms: "1", size: "", floor: "", totalFloors: "", yearBuilt: "",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);

  useSeo({ title: "Danışman Paneli - Mirhan Gayrimenkul" });

  if (!user) { setLocation("/giris"); return null; }

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties/my"],
    queryFn: async () => {
      const res = await fetch("/api/properties/my", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: stats } = useQuery<{ views: number; messages: number; favorites: number }>({
    queryKey: ["/api/dashboard/stats"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/stats", { credentials: "include" });
      if (!res.ok) return { views: 0, messages: 0, favorites: 0 };
      return res.json();
    },
  });

  const { data: messages } = useQuery<any[]>({
    queryKey: ["/api/messages/received"],
    queryFn: async () => {
      const res = await fetch("/api/messages/received", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const url = editId ? `/api/properties/${editId}` : "/api/properties";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method, credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, city: "İstanbul" }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/properties/my"] }); setOpen(false); setForm(defaultForm); setEditId(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/properties/my"] }),
  });

  const openEdit = (p: Property) => {
    setEditId(p.id);
    setForm({ ...defaultForm, title: p.title, price: p.price, district: p.district, listingType: p.listingType });
    setOpen(true);
  };

  const f = (k: keyof FormData, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const statusBadge = (s: string) => {
    if (s === "active") return <Badge variant="default" className="bg-emerald-500"><CheckCircle2 className="w-3 h-3 mr-1" />Aktif</Badge>;
    if (s === "pending") return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Bekliyor</Badge>;
    return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Pasif</Badge>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-dashboard-title">Danışman Paneli</h1>
            <p className="text-muted-foreground text-sm">Hoş geldiniz, {user.firstName}</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditId(null); setForm(defaultForm); }}>
                <Plus className="w-4 h-4 mr-2" />İlan Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editId ? "İlanı Düzenle" : "Yeni İlan"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                <div className="sm:col-span-2">
                  <Label>Başlık</Label>
                  <Input value={form.title} onChange={e => f("title", e.target.value)} placeholder="Beşiktaş'ta 2+1 Satılık Daire" />
                </div>
                <div className="sm:col-span-2">
                  <Label>Açıklama</Label>
                  <Textarea value={form.description} onChange={e => f("description", e.target.value)} rows={3} />
                </div>
                <div>
                  <Label>Fiyat</Label>
                  <Input type="number" value={form.price} onChange={e => f("price", e.target.value)} />
                </div>
                <div>
                  <Label>Para Birimi</Label>
                  <Select value={form.currency} onValueChange={v => f("currency", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRY">TL</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>İlan Tipi</Label>
                  <Select value={form.listingType} onValueChange={v => f("listingType", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">Satılık</SelectItem>
                      <SelectItem value="rent">Kiralık</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Emlak Tipi</Label>
                  <Select value={form.propertyType} onValueChange={v => f("propertyType", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Daire</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="office">Ofis</SelectItem>
                      <SelectItem value="land">Arsa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>İlçe</Label>
                  <Input value={form.district} onChange={e => f("district", e.target.value)} />
                </div>
                <div>
                  <Label>Mahalle</Label>
                  <Input value={form.neighborhood} onChange={e => f("neighborhood", e.target.value)} />
                </div>
                <div>
                  <Label>Oda Sayısı</Label>
                  <Select value={form.rooms} onValueChange={v => f("rooms", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["1+0","1+1","2+1","3+1","4+1","5+1","6+"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Brüt m²</Label>
                  <Input type="number" value={form.size} onChange={e => f("size", e.target.value)} />
                </div>
                <div>
                  <Label>Bulunduğu Kat</Label>
                  <Input type="number" value={form.floor} onChange={e => f("floor", e.target.value)} />
                </div>
                <div>
                  <Label>Toplam Kat</Label>
                  <Input type="number" value={form.totalFloors} onChange={e => f("totalFloors", e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Adres</Label>
                  <Input value={form.address} onChange={e => f("address", e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setOpen(false)}>İptal</Button>
                <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Toplam İlan", value: properties?.length ?? 0, icon: Building2, color: "text-blue-500" },
            { label: "Toplam Görüntülenme", value: stats?.views ?? 0, icon: Eye, color: "text-amber-500" },
            { label: "Gelen Mesaj", value: messages?.length ?? 0, icon: MessageSquare, color: "text-emerald-500" },
          ].map(stat => (
            <Card key={stat.label} className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <div className="p-5 border-b border-border">
            <h2 className="font-semibold">İlanlarım</h2>
          </div>
          {isLoading ? (
            <div className="p-5 space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-14 rounded-lg" />)}
            </div>
          ) : !properties?.length ? (
            <div className="p-12 text-center">
              <Building2 className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">Henüz ilan eklemediniz.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {properties.map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors" data-testid={`row-property-${p.id}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                      <Home className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.district} · {p.listingType === "sale" ? "Satılık" : "Kiralık"} · {p.price} TL</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {statusBadge(p.status)}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{p.views}</span>
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(p)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteMutation.mutate(p.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
}
