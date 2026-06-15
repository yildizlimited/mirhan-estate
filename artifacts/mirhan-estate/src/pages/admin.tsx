import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/lib/auth";
import { useSeo } from "@/hooks/use-seo";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Users, Building2, FileText, Trash2, CheckCircle2, XCircle,
  Shield, Plus, Edit, Star, UserCheck, DollarSign, Clock,
  CalendarDays, Wand2,
} from "lucide-react";

type SafeUser = { id: number; name: string; email: string; role: string; phone?: string; createdAt: string };
type PropertyWithImages = {
  id: number; title: string; price: number; city: string; district: string;
  listingType: string; status: string; approved: boolean; featured: boolean;
  images: { id: number; imageUrl: string }[];
};
type BlogPost = { id: number; title: string; slug: string; content: string; seoTitle?: string; seoDescription?: string; published: boolean; createdAt: string };
type TeamMember = {
  id: number; name: string; title: string; phone?: string; email?: string;
  profileImage?: string; description?: string; specialty?: string[];
  experience?: number; languages?: string[]; rating?: string;
  sortOrder?: number; active?: boolean;
};
type TransactionWithDetails = {
  id: number; transactionType: string; salePrice: number; commissionAmount: number;
  status: string; transactionDate?: string;
  agent?: { user?: { name?: string } };
  property?: { title?: string };
  propertyId?: number;
};

async function apiFetch(method: string, url: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "İstek başarısız");
  }
  return res.json();
}

export default function AdminPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const { toast } = useToast();

  useSeo({ title: "Yönetici Paneli - Mirhan Gayrimenkul" });

  // ── Queries ──────────────────────────────────────────────────────────────────
  const { data: users, isLoading: loadUsers } = useQuery<SafeUser[]>({
    queryKey: ["/api/admin/users"],
    queryFn: () => apiFetch("GET", "/api/admin/users"),
    enabled: !!user && user.role === "admin",
  });

  const { data: properties, isLoading: loadProps } = useQuery<PropertyWithImages[]>({
    queryKey: ["/api/admin/properties"],
    queryFn: () => apiFetch("GET", "/api/admin/properties"),
    enabled: !!user && user.role === "admin",
  });

  const { data: posts, isLoading: loadPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog"],
    queryFn: () => apiFetch("GET", "/api/admin/blog"),
    enabled: !!user && user.role === "admin",
  });

  const { data: teamMembers, isLoading: loadTeam } = useQuery<TeamMember[]>({
    queryKey: ["/api/admin/team"],
    queryFn: () => apiFetch("GET", "/api/admin/team"),
    enabled: !!user && user.role === "admin",
  });

  const { data: transactions, isLoading: loadTxns } = useQuery<TransactionWithDetails[]>({
    queryKey: ["/api/admin/transactions"],
    queryFn: () => apiFetch("GET", "/api/admin/transactions"),
    enabled: !!user && user.role === "admin",
  });

  // ── User mutations ────────────────────────────────────────────────────────────
  const [userModal, setUserModal] = useState(false);
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", role: "user", phone: "" });

  const createUserMut = useMutation({
    mutationFn: (data: typeof userForm) => apiFetch("POST", "/api/admin/users", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setUserModal(false);
      setUserForm({ name: "", email: "", password: "", role: "user", phone: "" });
      toast({ title: "Kullanıcı oluşturuldu" });
    },
    onError: (e: Error) => toast({ title: "Hata", description: e.message, variant: "destructive" }),
  });

  const updateRoleMut = useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) => apiFetch("PUT", `/api/admin/users/${id}`, { role }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Rol güncellendi" });
    },
    onError: (e: Error) => toast({ title: "Hata", description: e.message, variant: "destructive" }),
  });

  const deleteUserMut = useMutation({
    mutationFn: (id: number) => apiFetch("DELETE", `/api/admin/users/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Kullanıcı silindi" });
    },
  });

  // ── Property mutations ────────────────────────────────────────────────────────
  const updatePropMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PropertyWithImages> }) =>
      apiFetch("PUT", `/api/admin/properties/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/properties"] });
      toast({ title: "İlan güncellendi" });
    },
    onError: (e: Error) => toast({ title: "Hata", description: e.message, variant: "destructive" }),
  });

  const deletePropMut = useMutation({
    mutationFn: (id: number) => apiFetch("DELETE", `/api/admin/properties/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/properties"] });
      toast({ title: "İlan silindi" });
    },
  });

  // ── Blog mutations ────────────────────────────────────────────────────────────
  const [blogModal, setBlogModal] = useState(false);
  const [editBlogId, setEditBlogId] = useState<number | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: "", content: "", slug: "", seoTitle: "", seoDescription: "", published: false,
  });

  const resetBlogForm = () => {
    setBlogForm({ title: "", content: "", slug: "", seoTitle: "", seoDescription: "", published: false });
    setEditBlogId(null);
  };

  const openEditBlog = (post: BlogPost) => {
    setBlogForm({
      title: post.title, content: post.content, slug: post.slug,
      seoTitle: post.seoTitle || "", seoDescription: post.seoDescription || "",
      published: !!post.published,
    });
    setEditBlogId(post.id);
    setBlogModal(true);
  };

  const createBlogMut = useMutation({
    mutationFn: (data: typeof blogForm) => apiFetch("POST", "/api/admin/blog", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      setBlogModal(false);
      resetBlogForm();
      toast({ title: "Blog yazısı oluşturuldu" });
    },
    onError: (e: Error) => toast({ title: "Hata", description: e.message, variant: "destructive" }),
  });

  const updateBlogMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: typeof blogForm }) =>
      apiFetch("PUT", `/api/admin/blog/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      setBlogModal(false);
      resetBlogForm();
      toast({ title: "Blog yazısı güncellendi" });
    },
    onError: (e: Error) => toast({ title: "Hata", description: e.message, variant: "destructive" }),
  });

  const deleteBlogMut = useMutation({
    mutationFn: (id: number) => apiFetch("DELETE", `/api/admin/blog/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({ title: "Blog yazısı silindi" });
    },
  });

  const autoGenerateMut = useMutation({
    mutationFn: () => apiFetch("POST", "/api/admin/blog/auto-generate"),
    onSuccess: (data: { created: number; message: string }) => {
      qc.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({ title: data.message });
    },
    onError: (e: Error) => toast({ title: "Hata", description: e.message, variant: "destructive" }),
  });

  // ── Team mutations ────────────────────────────────────────────────────────────
  const [teamModal, setTeamModal] = useState(false);
  const [editTeamId, setEditTeamId] = useState<number | null>(null);
  const [teamForm, setTeamForm] = useState({
    name: "", title: "", phone: "", email: "", profileImage: "",
    description: "", specialtyStr: "", languagesStr: "", experience: 0,
    rating: "5.0", sortOrder: 0, active: true,
  });

  const resetTeamForm = () => {
    setTeamForm({ name: "", title: "", phone: "", email: "", profileImage: "", description: "", specialtyStr: "", languagesStr: "", experience: 0, rating: "5.0", sortOrder: 0, active: true });
    setEditTeamId(null);
  };

  const openEditTeam = (m: TeamMember) => {
    setTeamForm({
      name: m.name, title: m.title, phone: m.phone || "", email: m.email || "",
      profileImage: m.profileImage || "", description: m.description || "",
      specialtyStr: (m.specialty || []).join(", "),
      languagesStr: (m.languages || []).join(", "),
      experience: m.experience || 0, rating: m.rating || "5.0",
      sortOrder: m.sortOrder || 0, active: m.active !== false,
    });
    setEditTeamId(m.id);
    setTeamModal(true);
  };

  const teamPayload = () => ({
    name: teamForm.name,
    title: teamForm.title,
    phone: teamForm.phone,
    email: teamForm.email,
    profileImage: teamForm.profileImage,
    description: teamForm.description,
    specialty: teamForm.specialtyStr.split(",").map(s => s.trim()).filter(Boolean),
    languages: teamForm.languagesStr.split(",").map(s => s.trim()).filter(Boolean),
    experience: Number(teamForm.experience),
    rating: teamForm.rating,
    sortOrder: Number(teamForm.sortOrder),
    active: teamForm.active,
  });

  const createTeamMut = useMutation({
    mutationFn: () => apiFetch("POST", "/api/admin/team", teamPayload()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/team"] });
      setTeamModal(false);
      resetTeamForm();
      toast({ title: "Danışman eklendi" });
    },
    onError: (e: Error) => toast({ title: "Hata", description: e.message, variant: "destructive" }),
  });

  const updateTeamMut = useMutation({
    mutationFn: (id: number) => apiFetch("PUT", `/api/admin/team/${id}`, teamPayload()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/team"] });
      setTeamModal(false);
      resetTeamForm();
      toast({ title: "Danışman güncellendi" });
    },
    onError: (e: Error) => toast({ title: "Hata", description: e.message, variant: "destructive" }),
  });

  const deleteTeamMut = useMutation({
    mutationFn: (id: number) => apiFetch("DELETE", `/api/admin/team/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/team"] });
      toast({ title: "Danışman silindi" });
    },
  });

  // ── Transaction mutations ──────────────────────────────────────────────────────
  const updateTxnMut = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiFetch("PUT", `/api/admin/transactions/${id}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/transactions"] });
      toast({ title: "Komisyon durumu güncellendi" });
    },
    onError: (e: Error) => toast({ title: "Hata", description: e.message, variant: "destructive" }),
  });

  // ── Auth guard ────────────────────────────────────────────────────────────────
  if (!user) { setLocation("/login"); return null; }
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <Shield className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Erişim Yetkisi Yok</h1>
          <p className="text-muted-foreground">Bu sayfayı görüntülemek için yönetici yetkisi gereklidir.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const pendingTxns = transactions?.filter(t => t.status === "pending").length || 0;
  const approvedTxns = transactions?.filter(t => t.status === "approved").length || 0;
  const totalCommission = transactions?.filter(t => t.status === "approved").reduce((s, t) => s + (t.commissionAmount || 0), 0) || 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-admin-title">Yönetici Paneli</h1>
            <p className="text-muted-foreground text-sm">Mirhan Gayrimenkul Yönetim Sistemi</p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Kullanıcı", value: users?.length ?? 0, icon: Users, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
            { label: "İlan", value: properties?.length ?? 0, icon: Building2, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
            { label: "Blog Yazısı", value: posts?.length ?? 0, icon: FileText, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
            { label: "Danışman", value: teamMembers?.length ?? 0, icon: UserCheck, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
            { label: "Komisyon", value: transactions?.length ?? 0, icon: DollarSign, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-900/30" },
          ].map(s => (
            <Card key={s.label} className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
            <TabsTrigger value="properties">İlanlar</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="team">Danışmanlar</TabsTrigger>
            <TabsTrigger value="commissions">Komisyonlar</TabsTrigger>
          </TabsList>

          {/* ── USERS ── */}
          <TabsContent value="users">
            <div className="flex justify-end mb-4">
              <Dialog open={userModal} onOpenChange={setUserModal}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-user">
                    <Plus className="w-4 h-4 mr-2" /> Kullanıcı Ekle
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Yeni Kullanıcı</DialogTitle>
                    <DialogDescription>Sisteme yeni bir kullanıcı ekleyin.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Ad Soyad</Label>
                      <Input value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} placeholder="Ahmet Yılmaz" />
                    </div>
                    <div>
                      <Label>E-posta</Label>
                      <Input type="email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} placeholder="ahmet@mirhanestate.com" />
                    </div>
                    <div>
                      <Label>Şifre</Label>
                      <Input type="password" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} />
                    </div>
                    <div>
                      <Label>Telefon</Label>
                      <Input value={userForm.phone} onChange={e => setUserForm({ ...userForm, phone: e.target.value })} placeholder="+90 549 449 23 36" />
                    </div>
                    <div>
                      <Label>Rol</Label>
                      <Select value={userForm.role} onValueChange={v => setUserForm({ ...userForm, role: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Kullanıcı</SelectItem>
                          <SelectItem value="agent">Danışman</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full" onClick={() => createUserMut.mutate(userForm)} disabled={createUserMut.isPending}>
                      {createUserMut.isPending ? "Oluşturuluyor..." : "Oluştur"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {loadUsers ? <Skeleton className="h-64" /> : (
              <Card className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ad Soyad</TableHead>
                      <TableHead>E-posta</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map(u => (
                      <TableRow key={u.id} data-testid={`row-user-${u.id}`}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{u.email}</TableCell>
                        <TableCell>
                          <Badge variant={u.role === "admin" ? "default" : u.role === "agent" ? "secondary" : "outline"} className="text-xs">
                            {u.role === "admin" ? "Admin" : u.role === "agent" ? "Danışman" : "Kullanıcı"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Select onValueChange={v => updateRoleMut.mutate({ id: u.id, role: v })}>
                              <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Rol Değiştir" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">Kullanıcı</SelectItem>
                                <SelectItem value="agent">Danışman</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            {u.id !== user.id && (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => deleteUserMut.mutate(u.id)}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!users || users.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">Henüz kullanıcı bulunmuyor.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          {/* ── PROPERTIES ── */}
          <TabsContent value="properties">
            {loadProps ? <Skeleton className="h-64" /> : (
              <Card className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>İlan</TableHead>
                      <TableHead>Konum</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties?.map(p => (
                      <TableRow key={p.id} data-testid={`row-prop-${p.id}`}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-8 rounded overflow-hidden flex-shrink-0 bg-muted">
                              {p.images?.[0] && <img src={p.images[0].imageUrl} alt="" className="w-full h-full object-cover" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium line-clamp-1">{p.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Intl.NumberFormat("tr-TR").format(p.price)} ₺ · {p.listingType === "sale" ? "Satılık" : "Kiralık"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{p.city}, {p.district}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            <Badge variant={p.approved ? "default" : "secondary"} className="text-xs">
                              {p.approved ? "Onaylı" : "Bekliyor"}
                            </Badge>
                            {p.featured && (
                              <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-xs">Öne Çıkan</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" title={p.approved ? "Onayı Kaldır" : "Onayla"}
                              onClick={() => updatePropMut.mutate({ id: p.id, data: { approved: !p.approved } })}>
                              <CheckCircle2 className={`w-4 h-4 ${p.approved ? "text-emerald-500" : "text-muted-foreground"}`} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title={p.featured ? "Öne Çıkan Kaldır" : "Öne Çıkar"}
                              onClick={() => updatePropMut.mutate({ id: p.id, data: { featured: !p.featured } })}>
                              <Star className={`w-4 h-4 ${p.featured ? "text-amber-500" : "text-muted-foreground"}`} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => deletePropMut.mutate(p.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!properties || properties.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">Henüz ilan bulunmuyor.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          {/* ── BLOG ── */}
          <TabsContent value="blog">
            <div className="flex justify-end gap-2 mb-4">
              <Button variant="outline" onClick={() => autoGenerateMut.mutate()} disabled={autoGenerateMut.isPending} data-testid="button-auto-generate">
                <Wand2 className="w-4 h-4 mr-2" />
                {autoGenerateMut.isPending ? "Oluşturuluyor..." : "Otomatik Oluştur"}
              </Button>
              <Dialog open={blogModal} onOpenChange={v => { setBlogModal(v); if (!v) resetBlogForm(); }}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-blog">
                    <Plus className="w-4 h-4 mr-2" /> Blog Yazısı Ekle
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editBlogId ? "Blog Yazısını Düzenle" : "Yeni Blog Yazısı"}</DialogTitle>
                    <DialogDescription>İstanbul emlak piyasasına yönelik içerik oluşturun.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Başlık</Label>
                      <Input value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} placeholder="İstanbul'da Ev Almanın Altın Kuralları" />
                    </div>
                    <div>
                      <Label>Slug (URL)</Label>
                      <Input value={blogForm.slug} onChange={e => setBlogForm({ ...blogForm, slug: e.target.value })} placeholder="istanbul-ev-alma-altin-kurallari" />
                    </div>
                    <div>
                      <Label>İçerik</Label>
                      <Textarea rows={8} value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} placeholder="Blog içeriğini buraya yazın..." />
                    </div>
                    <div>
                      <Label>SEO Başlığı</Label>
                      <Input value={blogForm.seoTitle} onChange={e => setBlogForm({ ...blogForm, seoTitle: e.target.value })} />
                    </div>
                    <div>
                      <Label>SEO Açıklaması</Label>
                      <Textarea rows={2} value={blogForm.seoDescription} onChange={e => setBlogForm({ ...blogForm, seoDescription: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch checked={blogForm.published} onCheckedChange={v => setBlogForm({ ...blogForm, published: v })} />
                      <Label>Yayınla</Label>
                    </div>
                    <Button className="w-full" disabled={createBlogMut.isPending || updateBlogMut.isPending}
                      onClick={() => editBlogId
                        ? updateBlogMut.mutate({ id: editBlogId, data: blogForm })
                        : createBlogMut.mutate(blogForm)
                      }>
                      {editBlogId ? "Güncelle" : "Oluştur"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {loadPosts ? <Skeleton className="h-64" /> : (
              <Card className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Başlık</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts?.map(post => (
                      <TableRow key={post.id} data-testid={`row-blog-${post.id}`}>
                        <TableCell className="font-medium text-sm">{post.title}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{post.slug}</TableCell>
                        <TableCell>
                          <Badge variant={post.published ? "default" : "secondary"} className="text-xs">
                            {post.published ? "Yayında" : "Taslak"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString("tr-TR") : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditBlog(post)}>
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => deleteBlogMut.mutate(post.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!posts || posts.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          Henüz blog yazısı yok. "Otomatik Oluştur" butonu ile İstanbul içerikleri ekleyebilirsiniz.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          {/* ── TEAM ── */}
          <TabsContent value="team">
            <div className="flex justify-end mb-4">
              <Dialog open={teamModal} onOpenChange={v => { setTeamModal(v); if (!v) resetTeamForm(); }}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-team">
                    <Plus className="w-4 h-4 mr-2" /> Danışman Ekle
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editTeamId ? "Danışmanı Düzenle" : "Yeni Danışman"}</DialogTitle>
                    <DialogDescription>Mirhan Gayrimenkul ekibine danışman ekleyin.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Ad Soyad</Label>
                        <Input value={teamForm.name} onChange={e => setTeamForm({ ...teamForm, name: e.target.value })} placeholder="Ahmet Yılmaz" />
                      </div>
                      <div>
                        <Label>Unvan</Label>
                        <Input value={teamForm.title} onChange={e => setTeamForm({ ...teamForm, title: e.target.value })} placeholder="Kıdemli Emlak Danışmanı" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Telefon</Label>
                        <Input value={teamForm.phone} onChange={e => setTeamForm({ ...teamForm, phone: e.target.value })} placeholder="+90 549 449 23 36" />
                      </div>
                      <div>
                        <Label>E-posta</Label>
                        <Input type="email" value={teamForm.email} onChange={e => setTeamForm({ ...teamForm, email: e.target.value })} placeholder="ahmet@mirhanestate.com" />
                      </div>
                    </div>
                    <div>
                      <Label>Profil Fotoğrafı URL</Label>
                      <Input value={teamForm.profileImage} onChange={e => setTeamForm({ ...teamForm, profileImage: e.target.value })} placeholder="https://..." />
                    </div>
                    <div>
                      <Label>Açıklama</Label>
                      <Textarea rows={3} value={teamForm.description} onChange={e => setTeamForm({ ...teamForm, description: e.target.value })} placeholder="Danışman hakkında kısa bilgi..." />
                    </div>
                    <div>
                      <Label>Uzmanlık Alanları (virgülle ayır)</Label>
                      <Input value={teamForm.specialtyStr} onChange={e => setTeamForm({ ...teamForm, specialtyStr: e.target.value })} placeholder="Konut, Villa, Yabancı Müşteri" />
                    </div>
                    <div>
                      <Label>Konuşulan Diller (virgülle ayır)</Label>
                      <Input value={teamForm.languagesStr} onChange={e => setTeamForm({ ...teamForm, languagesStr: e.target.value })} placeholder="Türkçe, İngilizce, Rusça" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label>Deneyim (yıl)</Label>
                        <Input type="number" min={0} value={teamForm.experience} onChange={e => setTeamForm({ ...teamForm, experience: Number(e.target.value) })} />
                      </div>
                      <div>
                        <Label>Puan (0-5)</Label>
                        <Input value={teamForm.rating} onChange={e => setTeamForm({ ...teamForm, rating: e.target.value })} placeholder="4.9" />
                      </div>
                      <div>
                        <Label>Sıra</Label>
                        <Input type="number" min={0} value={teamForm.sortOrder} onChange={e => setTeamForm({ ...teamForm, sortOrder: Number(e.target.value) })} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch checked={teamForm.active} onCheckedChange={v => setTeamForm({ ...teamForm, active: v })} />
                      <Label>Aktif</Label>
                    </div>
                    <Button className="w-full" disabled={createTeamMut.isPending || updateTeamMut.isPending}
                      onClick={() => editTeamId ? updateTeamMut.mutate(editTeamId) : createTeamMut.mutate()}>
                      {editTeamId ? "Güncelle" : "Ekle"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {loadTeam ? <Skeleton className="h-64" /> : (
              <Card className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Danışman</TableHead>
                      <TableHead>Unvan</TableHead>
                      <TableHead>İletişim</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers?.map(m => (
                      <TableRow key={m.id} data-testid={`row-team-${m.id}`}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {m.profileImage ? (
                              <img src={m.profileImage} alt={m.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-amber-700">
                                  {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                </span>
                              </div>
                            )}
                            <span className="font-medium text-sm">{m.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">{m.title}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div>{m.phone}</div>
                          <div className="text-xs">{m.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={m.active ? "default" : "outline"} className="text-xs">
                            {m.active ? "Aktif" : "Pasif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditTeam(m)}>
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => deleteTeamMut.mutate(m.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!teamMembers || teamMembers.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Henüz danışman bulunmuyor.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          {/* ── COMMISSIONS ── */}
          <TabsContent value="commissions">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{pendingTxns}</p>
                      <p className="text-sm text-muted-foreground">Onay Bekleyen</p>
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
                      <p className="text-2xl font-bold">{approvedTxns}</p>
                      <p className="text-sm text-muted-foreground">Onaylanmış</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold">{new Intl.NumberFormat("tr-TR").format(totalCommission)} ₺</p>
                      <p className="text-sm text-muted-foreground">Toplam Onaylı</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {loadTxns ? <Skeleton className="h-64" /> : (
              <Card className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Danışman</TableHead>
                      <TableHead>İlan</TableHead>
                      <TableHead>İşlem</TableHead>
                      <TableHead>Satış Fiyatı</TableHead>
                      <TableHead>Komisyon</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions?.map(txn => (
                      <TableRow key={txn.id} data-testid={`row-txn-${txn.id}`}>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <CalendarDays className="w-3.5 h-3.5" />
                            {txn.transactionDate ? new Date(txn.transactionDate).toLocaleDateString("tr-TR") : "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-medium">{txn.agent?.user?.name || "-"}</TableCell>
                        <TableCell className="text-sm max-w-[120px] truncate">{txn.property?.title || `#${txn.propertyId}`}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {txn.transactionType === "sale" ? "Satış" : "Kiralama"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{new Intl.NumberFormat("tr-TR").format(txn.salePrice)} ₺</TableCell>
                        <TableCell className="text-sm font-medium">{new Intl.NumberFormat("tr-TR").format(txn.commissionAmount)} ₺</TableCell>
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
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {txn.status !== "approved" && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" title="Onayla"
                                onClick={() => updateTxnMut.mutate({ id: txn.id, status: "approved" })}>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              </Button>
                            )}
                            {txn.status !== "rejected" && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" title="Reddet"
                                onClick={() => updateTxnMut.mutate({ id: txn.id, status: "rejected" })}>
                                <XCircle className="w-4 h-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!transactions || transactions.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          Henüz komisyon kaydı bulunmuyor.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
