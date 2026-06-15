import { useQuery, useMutation } from "@tanstack/react-query";
import { Redirect } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, Edit, Trash2, Eye, Home, MessageSquare, TrendingUp, Building2,
  Sparkles, Loader2, Link2, Download, CheckCircle2, Clock, XCircle,
  DollarSign, CalendarDays,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useState } from "react";

type PropertyImage = { id: number; imageUrl: string };
type PropertyWithImages = {
  id: number; title: string; description: string; price: number; city: string;
  district: string; neighborhood: string | null; address: string | null;
  propertyType: string; listingType: string; squareMeters: number; rooms: string;
  bathrooms: number; buildingAge: number | null; floor: number | null;
  totalFloors: number | null; furnished: boolean | null; insideComplex: boolean | null;
  mortgageEligible: boolean | null; approved: boolean | null; featured: boolean | null;
  status: string | null; views: number | null; createdAt: string;
  images: PropertyImage[];
};
type TransactionWithDetails = {
  id: number; propertyId: number; transactionType: string; salePrice: number;
  commissionAmount: number; commissionRate: number | null; status: string;
  transactionDate: string | null; notes: string | null;
  property?: { title: string } | null;
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR").format(price) + " ₺";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [statusModal, setStatusModal] = useState<{ propertyId: number; status: string; title: string } | null>(null);
  const [txnForm, setTxnForm] = useState({ salePrice: "", commissionAmount: "", commissionRate: "", notes: "" });

  const [form, setForm] = useState({
    title: "", description: "", price: "", city: "İstanbul", district: "", neighborhood: "",
    address: "", propertyType: "daire", listingType: "sale", squareMeters: "",
    rooms: "2+1", bathrooms: "1", buildingAge: "", floor: "", totalFloors: "",
    furnished: false, insideComplex: false, mortgageEligible: false, images: [""],
  });

  const { data: properties, isLoading } = useQuery<PropertyWithImages[]>({
    queryKey: ["/api/agent/properties"],
  });

  const { data: myTransactions } = useQuery<TransactionWithDetails[]>({
    queryKey: ["/api/agent/transactions"],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/agent/properties", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agent/properties"] });
      setAddOpen(false);
      resetForm();
      toast({ title: "İlan oluşturuldu" });
    },
    onError: (e: Error) => toast({ title: "Hata", description: e.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest("PUT", `/api/agent/properties/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agent/properties"] });
      setEditingId(null);
      resetForm();
      toast({ title: "İlan güncellendi" });
    },
    onError: (e: Error) => toast({ title: "Hata", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/agent/properties/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agent/properties"] });
      toast({ title: "İlan silindi" });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest("PUT", `/api/agent/properties/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agent/properties"] });
    },
    onError: (e: Error) => toast({ title: "Hata", description: e.message, variant: "destructive" }),
  });

  const createTxnMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/agent/transactions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agent/transactions"] });
      setStatusModal(null);
      setTxnForm({ salePrice: "", commissionAmount: "", commissionRate: "", notes: "" });
      toast({ title: "İşlem kaydedildi", description: "Onay bekliyor." });
    },
    onError: (e: Error) => toast({ title: "Hata", description: e.message, variant: "destructive" }),
  });

  const handleStatusChange = (propertyId: number, newStatus: string, title: string) => {
    if (newStatus === "sold" || newStatus === "rented") {
      setStatusModal({ propertyId, status: newStatus, title });
    } else {
      statusMutation.mutate({ id: propertyId, status: newStatus });
    }
  };

  const submitTransaction = () => {
    if (!statusModal) return;
    createTxnMutation.mutate({
      propertyId: statusModal.propertyId,
      transactionType: statusModal.status === "sold" ? "sale" : "rent",
      salePrice: Number(txnForm.salePrice),
      commissionAmount: Number(txnForm.commissionAmount),
      commissionRate: txnForm.commissionRate ? Number(txnForm.commissionRate) : undefined,
      notes: txnForm.notes || undefined,
    });
    statusMutation.mutate({ id: statusModal.propertyId, status: statusModal.status });
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    active: { label: "Aktif", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
    pending: { label: "Onay Bekliyor", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
    deposit_taken: { label: "Kaporası Alındı", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    sold: { label: "Satıldı", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" },
    rented: { label: "Kiralandı", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  };

  const approvedTxns = myTransactions?.filter(t => t.status === "approved") || [];
  const pendingTxns = myTransactions?.filter(t => t.status === "pending") || [];
  const totalApprovedCommission = approvedTxns.reduce((sum, t) => sum + (t.commissionAmount || 0), 0);
  const totalPendingCommission = pendingTxns.reduce((sum, t) => sum + (t.commissionAmount || 0), 0);

  const importFromSahibinden = async () => {
    if (!importUrl.trim()) {
      toast({ title: "URL giriniz", variant: "destructive" });
      return;
    }
    setImporting(true);
    try {
      const res = await apiRequest("POST", "/api/import/sahibinden", { url: importUrl.trim() });
      const data = await res.json();
      setForm({
        title: data.title || "",
        description: data.description || "",
        price: data.price ? String(data.price) : "",
        city: data.city || "İstanbul",
        district: data.district || "",
        neighborhood: data.neighborhood || "",
        address: "",
        propertyType: data.propertyType || "daire",
        listingType: data.listingType || "sale",
        squareMeters: data.squareMeters || "",
        rooms: data.rooms || "2+1",
        bathrooms: data.bathrooms || "1",
        buildingAge: data.buildingAge || "",
        floor: data.floor || "",
        totalFloors: data.totalFloors || "",
        furnished: !!data.furnished,
        insideComplex: false,
        mortgageEligible: false,
        images: data.images?.length > 0 ? data.images : [""],
      });
      setShowImport(false);
      setImportUrl("");
      toast({ title: "İlan bilgileri aktarıldı", description: "Bilgileri kontrol edip düzenleyebilirsiniz." });
    } catch {
      toast({ title: "Hata", description: "İlan bilgileri alınamadı. URL'yi kontrol edip tekrar deneyin.", variant: "destructive" });
    } finally {
      setImporting(false);
    }
  };

  const generateAIDescription = async () => {
    if (!form.city || !form.propertyType) {
      toast({ title: "Eksik bilgi", description: "AI açıklama için en az şehir ve konut tipi gereklidir.", variant: "destructive" });
      return;
    }
    setGeneratingAI(true);
    try {
      const res = await apiRequest("POST", "/api/ai/generate-description", form);
      const data = await res.json();
      if (data.description) {
        setForm(prev => ({ ...prev, description: data.description }));
        toast({ title: "Açıklama oluşturuldu" });
      }
    } catch {
      toast({ title: "Hata", description: "AI açıklama oluşturulamadı.", variant: "destructive" });
    } finally {
      setGeneratingAI(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "", description: "", price: "", city: "İstanbul", district: "", neighborhood: "",
      address: "", propertyType: "daire", listingType: "sale", squareMeters: "",
      rooms: "2+1", bathrooms: "1", buildingAge: "", floor: "", totalFloors: "",
      furnished: false, insideComplex: false, mortgageEligible: false, images: [""],
    });
  };

  const handleSubmit = () => {
    const data = {
      ...form,
      price: Number(form.price),
      squareMeters: Number(form.squareMeters),
      bathrooms: Number(form.bathrooms),
      buildingAge: form.buildingAge ? Number(form.buildingAge) : null,
      floor: form.floor ? Number(form.floor) : null,
      totalFloors: form.totalFloors ? Number(form.totalFloors) : null,
      images: form.images.filter(i => i.trim()),
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEdit = (prop: PropertyWithImages) => {
    setForm({
      title: prop.title,
      description: prop.description,
      price: String(prop.price),
      city: prop.city,
      district: prop.district,
      neighborhood: prop.neighborhood || "",
      address: prop.address || "",
      propertyType: prop.propertyType,
      listingType: prop.listingType,
      squareMeters: String(prop.squareMeters),
      rooms: prop.rooms,
      bathrooms: String(prop.bathrooms),
      buildingAge: prop.buildingAge ? String(prop.buildingAge) : "",
      floor: prop.floor ? String(prop.floor) : "",
      totalFloors: prop.totalFloors ? String(prop.totalFloors) : "",
      furnished: !!prop.furnished,
      insideComplex: !!prop.insideComplex,
      mortgageEligible: !!prop.mortgageEligible,
      images: prop.images.length > 0 ? prop.images.map(i => i.imageUrl) : [""],
    });
    setEditingId(prop.id);
    setAddOpen(true);
  };

  const PropertyForm = () => (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {!editingId && (
        <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50/50 dark:bg-amber-900/10 p-4">
          {showImport ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
                <Link2 className="w-4 h-4" />
                Sahibinden.com'dan İlan Aktar
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="https://www.sahibinden.com/ilan/..."
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  className="flex-1"
                  data-testid="input-import-url"
                />
                <Button
                  onClick={importFromSahibinden}
                  disabled={importing}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  data-testid="button-import-fetch"
                >
                  {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                </Button>
              </div>
              {importing && <p className="text-xs text-muted-foreground">Sahibinden.com'dan ilan bilgileri çekiliyor...</p>}
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => setShowImport(false)}>Vazgeç</Button>
            </div>
          ) : (
            <button
              onClick={() => setShowImport(true)}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400 hover:text-amber-800 transition-colors py-1"
              data-testid="button-show-import"
            >
              <Link2 className="w-4 h-4" />
              Sahibinden.com'dan URL ile İlan Aktar
            </button>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label>Başlık</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-prop-title" />
        </div>
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <Label>Açıklama</Label>
            <Button
              type="button" variant="outline" size="sm"
              onClick={generateAIDescription} disabled={generatingAI}
              className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              data-testid="button-ai-description"
            >
              {generatingAI ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1.5" />}
              {generatingAI ? "Oluşturuluyor..." : "AI ile Oluştur"}
            </Button>
          </div>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} data-testid="input-prop-description" />
        </div>
        <div>
          <Label>Fiyat (₺)</Label>
          <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} data-testid="input-prop-price" />
        </div>
        <div>
          <Label>İlan Tipi</Label>
          <Select value={form.listingType} onValueChange={(v) => setForm({ ...form, listingType: v })}>
            <SelectTrigger data-testid="select-prop-listing-type"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sale">Satılık</SelectItem>
              <SelectItem value="rent">Kiralık</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Konut Tipi</Label>
          <Select value={form.propertyType} onValueChange={(v) => setForm({ ...form, propertyType: v })}>
            <SelectTrigger data-testid="select-prop-type"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="daire">Daire</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="arsa">Arsa</SelectItem>
              <SelectItem value="isyeri">İşyeri</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Şehir</Label>
          <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} data-testid="input-prop-city" />
        </div>
        <div>
          <Label>İlçe</Label>
          <Input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} data-testid="input-prop-district" />
        </div>
        <div>
          <Label>Mahalle</Label>
          <Input value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} />
        </div>
        <div>
          <Label>m²</Label>
          <Input type="number" value={form.squareMeters} onChange={(e) => setForm({ ...form, squareMeters: e.target.value })} data-testid="input-prop-sqm" />
        </div>
        <div>
          <Label>Oda Sayısı</Label>
          <Select value={form.rooms} onValueChange={(v) => setForm({ ...form, rooms: v })}>
            <SelectTrigger data-testid="select-prop-rooms"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["1+0","1+1","2+1","3+1","4+1","5+2"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Banyo</Label>
          <Input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} />
        </div>
        <div>
          <Label>Bina Yaşı</Label>
          <Input type="number" value={form.buildingAge} onChange={(e) => setForm({ ...form, buildingAge: e.target.value })} />
        </div>
        <div>
          <Label>Kat</Label>
          <Input type="number" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} />
        </div>
        <div>
          <Label>Toplam Kat</Label>
          <Input type="number" value={form.totalFloors} onChange={(e) => setForm({ ...form, totalFloors: e.target.value })} />
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Eşyalı</Label>
          <Switch checked={form.furnished} onCheckedChange={(v) => setForm({ ...form, furnished: v })} />
        </div>
        <div className="flex items-center justify-between">
          <Label>Site İçinde</Label>
          <Switch checked={form.insideComplex} onCheckedChange={(v) => setForm({ ...form, insideComplex: v })} />
        </div>
        <div className="flex items-center justify-between">
          <Label>Krediye Uygun</Label>
          <Switch checked={form.mortgageEligible} onCheckedChange={(v) => setForm({ ...form, mortgageEligible: v })} />
        </div>
      </div>
      <div>
        <Label>Resim URL'leri</Label>
        {form.images.map((img, i) => (
          <div key={i} className="flex gap-2 mt-2">
            <Input
              value={img}
              onChange={(e) => {
                const imgs = [...form.images];
                imgs[i] = e.target.value;
                setForm({ ...form, images: imgs });
              }}
              placeholder="https://example.com/image.jpg"
            />
            {form.images.length > 1 && (
              <Button variant="ghost" size="icon" onClick={() => setForm({ ...form, images: form.images.filter((_: string, j: number) => j !== i) })}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button variant="outline" size="sm" className="mt-2" onClick={() => setForm({ ...form, images: [...form.images, ""] })}>
          + Resim Ekle
        </Button>
      </div>
      <Button onClick={handleSubmit} className="w-full" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-submit-property">
        {editingId ? "Güncelle" : "İlan Oluştur"}
      </Button>
    </div>
  );

  if (!user || (user.role !== "agent" && user.role !== "admin")) return <Redirect to="/" />;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-dashboard-title">Acente Paneli</h1>
            <p className="text-muted-foreground">Hoş geldiniz, {user.name}</p>
          </div>
          <Dialog open={addOpen} onOpenChange={(o) => { setAddOpen(o); if (!o) { setEditingId(null); resetForm(); } }}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-property">
                <Plus className="w-4 h-4 mr-2" />
                Yeni İlan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "İlan Düzenle" : "Yeni İlan Ekle"}</DialogTitle>
                <DialogDescription>İlan bilgilerini doldurun.</DialogDescription>
              </DialogHeader>
              <PropertyForm />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Home className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{properties?.filter(p => !p.status || p.status === "active").length || 0}</p>
                  <p className="text-sm text-muted-foreground">Aktif İlan</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approvedTxns.length}</p>
                  <p className="text-sm text-muted-foreground">Onaylı Satış</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatPrice(totalApprovedCommission)}</p>
                  <p className="text-sm text-muted-foreground">Onaylı Komisyon</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatPrice(totalPendingCommission)}</p>
                  <p className="text-sm text-muted-foreground">Bekleyen Komisyon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="listings" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="listings" data-testid="tab-listings">İlanlarım</TabsTrigger>
            <TabsTrigger value="sales" data-testid="tab-sales">Satışlarım / Kiralama</TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            {isLoading ? (
              <Skeleton className="h-64 rounded-xl" />
            ) : properties && properties.length > 0 ? (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>İlan</TableHead>
                        <TableHead>Fiyat</TableHead>
                        <TableHead>Konum</TableHead>
                        <TableHead>Onay</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {properties.map((prop) => {
                        const st = statusLabels[prop.status || "active"] || statusLabels.active;
                        return (
                          <TableRow key={prop.id} data-testid={`row-property-${prop.id}`}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-8 rounded overflow-hidden flex-shrink-0 bg-muted">
                                  {prop.images[0] && <img src={prop.images[0].imageUrl} alt="" className="w-full h-full object-cover" />}
                                </div>
                                <span className="text-sm font-medium line-clamp-1">{prop.title}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{formatPrice(prop.price)}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{prop.city}, {prop.district}</TableCell>
                            <TableCell>
                              <Badge variant={prop.approved ? "default" : "secondary"} className="text-xs">
                                {prop.approved ? "Onaylı" : "Bekliyor"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.color}`}>
                                  {st.label}
                                </span>
                                {(prop.status === "active" || !prop.status) && (
                                  <Select onValueChange={(v) => handleStatusChange(prop.id, v, prop.title)}>
                                    <SelectTrigger className="w-28 h-7 text-xs" data-testid={`select-status-${prop.id}`}>
                                      <SelectValue placeholder="Güncelle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="deposit_taken">Kaporası Alındı</SelectItem>
                                      <SelectItem value="sold">Satıldı</SelectItem>
                                      <SelectItem value="rented">Kiralandı</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                                {prop.status === "deposit_taken" && (
                                  <Select onValueChange={(v) => handleStatusChange(prop.id, v, prop.title)}>
                                    <SelectTrigger className="w-28 h-7 text-xs" data-testid={`select-status-${prop.id}`}>
                                      <SelectValue placeholder="Güncelle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="sold">Satıldı</SelectItem>
                                      <SelectItem value="rented">Kiralandı</SelectItem>
                                      <SelectItem value="active">Aktife Al</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => openEdit(prop)} data-testid={`button-edit-${prop.id}`}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate(prop.id)} data-testid={`button-delete-${prop.id}`}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            ) : (
              <div className="text-center py-20">
                <Building2 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Henüz ilanınız yok</h3>
                <p className="text-muted-foreground mb-4">İlk ilanınızı oluşturarak başlayın.</p>
                <Button onClick={() => setAddOpen(true)} data-testid="button-add-first">
                  <Plus className="w-4 h-4 mr-2" />
                  İlan Ekle
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sales">
            {myTransactions && myTransactions.length > 0 ? (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tarih</TableHead>
                        <TableHead>İlan</TableHead>
                        <TableHead>İşlem</TableHead>
                        <TableHead>Satış Fiyatı</TableHead>
                        <TableHead>Komisyon</TableHead>
                        <TableHead>Onay Durumu</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myTransactions.map((txn) => (
                        <TableRow key={txn.id} data-testid={`row-txn-${txn.id}`}>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                              {txn.transactionDate ? new Date(txn.transactionDate).toLocaleDateString("tr-TR") : "-"}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-medium line-clamp-1">
                            {txn.property?.title || `İlan #${txn.propertyId}`}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {txn.transactionType === "sale" ? "Satış" : "Kiralama"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{formatPrice(txn.salePrice)}</TableCell>
                          <TableCell className="text-sm font-medium">{formatPrice(txn.commissionAmount)}</TableCell>
                          <TableCell>
                            {txn.status === "approved" && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" /> Onaylandı
                              </span>
                            )}
                            {txn.status === "pending" && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full">
                                <Clock className="w-3 h-3" /> Bekliyor
                              </span>
                            )}
                            {txn.status === "rejected" && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full">
                                <XCircle className="w-3 h-3" /> Reddedildi
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            ) : (
              <div className="text-center py-20">
                <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Henüz işlem kaydı yok</h3>
                <p className="text-muted-foreground">İlanlarınızın durumunu güncelleyerek satış/kiralama kaydı oluşturabilirsiniz.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-6 text-center">
          <h3 className="font-semibold mb-2">Hızlı İletişim</h3>
          <p className="text-sm text-muted-foreground mb-4">Destek veya bilgi için bizimle iletişime geçin.</p>
          <a
            href="https://wa.me/905494492336?text=Merhaba%2C%20Acente%20Paneli%20hakkında%20yardım%20almak%20istiyorum."
            target="_blank" rel="noopener noreferrer"
          >
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <SiWhatsapp className="w-4 h-4 mr-2" />
              WhatsApp Destek
            </Button>
          </a>
        </div>

        <Dialog open={!!statusModal} onOpenChange={(o) => { if (!o) setStatusModal(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {statusModal?.status === "sold" ? "Satış" : "Kiralama"} Bilgileri
              </DialogTitle>
              <DialogDescription>İşlem detaylarını girin.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                <strong>{statusModal?.title}</strong> ilanı için {statusModal?.status === "sold" ? "satış" : "kiralama"} bilgilerini girin.
              </p>
              <div>
                <Label>Satış / Kiralama Fiyatı (₺)</Label>
                <Input
                  type="number"
                  value={txnForm.salePrice}
                  onChange={(e) => setTxnForm({ ...txnForm, salePrice: e.target.value })}
                  placeholder="0"
                  data-testid="input-txn-price"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Komisyon Tutarı (₺)</Label>
                  <Input
                    type="number"
                    value={txnForm.commissionAmount}
                    onChange={(e) => setTxnForm({ ...txnForm, commissionAmount: e.target.value })}
                    placeholder="0"
                    data-testid="input-txn-commission"
                  />
                </div>
                <div>
                  <Label>Komisyon Oranı (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={txnForm.commissionRate}
                    onChange={(e) => setTxnForm({ ...txnForm, commissionRate: e.target.value })}
                    placeholder="2"
                    data-testid="input-txn-rate"
                  />
                </div>
              </div>
              <div>
                <Label>Notlar</Label>
                <Textarea
                  value={txnForm.notes}
                  onChange={(e) => setTxnForm({ ...txnForm, notes: e.target.value })}
                  rows={2}
                  placeholder="İşlemle ilgili notlar..."
                  data-testid="input-txn-notes"
                />
              </div>
              <Button
                className="w-full"
                onClick={submitTransaction}
                disabled={createTxnMutation.isPending}
                data-testid="button-submit-txn"
              >
                {createTxnMutation.isPending ? "Kaydediliyor..." : "Kaydet ve Onaya Gönder"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
}
