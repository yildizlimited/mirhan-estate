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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users, Building2, FileText, Trash2, CheckCircle2, XCircle,
  Shield, Eye, Plus, Search,
} from "lucide-react";

type User = { id: number; email: string; firstName: string; lastName: string; role: string; createdAt: string };
type Property = { id: number; title: string; price: string; district: string; listingType: string; status: string; views: number };
type BlogPost = { id: number; title: string; slug: string; published: boolean; createdAt: string };

export default function AdminPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");

  useSeo({ title: "Yönetici Paneli - Mirhan Gayrimenkul" });

  if (!user) { setLocation("/giris"); return null; }
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

  const { data: users, isLoading: loadUsers } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: properties, isLoading: loadProps } = useQuery<Property[]>({
    queryKey: ["/api/admin/properties"],
    queryFn: async () => {
      const res = await fetch("/api/admin/properties", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: posts, isLoading: loadPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog"],
    queryFn: async () => {
      const res = await fetch("/api/admin/blog", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: stats } = useQuery<{ users: number; properties: number; posts: number; messages: number }>({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats", { credentials: "include" });
      if (!res.ok) return { users: 0, properties: 0, posts: 0, messages: 0 };
      return res.json();
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/admin/users/${id}`, { method: "DELETE", credentials: "include" });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/users"] }),
  });

  const deleteProp = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/admin/properties/${id}`, { method: "DELETE", credentials: "include" });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/properties"] }),
  });

  const approveProp = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/admin/properties/${id}/approve`, { method: "POST", credentials: "include" });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/properties"] }),
  });

  const deletePost = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/admin/blog/${id}`, { method: "DELETE", credentials: "include" });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/blog"] }),
  });

  const filteredUsers = users?.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.firstName.toLowerCase().includes(search.toLowerCase())
  );

  const statCards = [
    { label: "Kullanıcı", value: stats?.users ?? 0, icon: Users, color: "text-blue-500" },
    { label: "İlan", value: stats?.properties ?? 0, icon: Building2, color: "text-amber-500" },
    { label: "Blog Yazısı", value: stats?.posts ?? 0, icon: FileText, color: "text-purple-500" },
    { label: "Mesaj", value: stats?.messages ?? 0, icon: FileText, color: "text-emerald-500" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-admin-title">Yönetici Paneli</h1>
            <p className="text-muted-foreground text-sm">Mirhan Gayrimenkul Yönetim Sistemi</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {statCards.map(s => (
            <Card key={s.label} className="p-5 flex items-center gap-3">
              <s.icon className={`w-6 h-6 ${s.color}`} />
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
            <TabsTrigger value="properties">İlanlar</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input placeholder="Ad veya e-posta ile ara..." value={search} onChange={e => setSearch(e.target.value)} className="border-0 shadow-none focus-visible:ring-0 px-0" />
              </div>
              {loadUsers ? (
                <div className="p-4 space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-12" />)}</div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredUsers?.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-4" data-testid={`row-user-${u.id}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                          {u.firstName[0]}{u.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={u.role === "admin" ? "default" : u.role === "agent" ? "secondary" : "outline"}>
                          {u.role === "admin" ? "Admin" : u.role === "agent" ? "Danışman" : "Kullanıcı"}
                        </Badge>
                        {u.id !== user.id && (
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteUser.mutate(u.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="properties">
            <Card>
              {loadProps ? (
                <div className="p-4 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14" />)}</div>
              ) : (
                <div className="divide-y divide-border">
                  {properties?.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4" data-testid={`row-prop-${p.id}`}>
                      <div>
                        <p className="font-medium text-sm">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.district} · {p.listingType === "sale" ? "Satılık" : "Kiralık"} · {p.price} TL</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={p.status === "active" ? "default" : "secondary"}>
                          {p.status === "active" ? "Aktif" : "Bekliyor"}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="w-3.5 h-3.5" />{p.views}
                        </div>
                        {p.status !== "active" && (
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600" onClick={() => approveProp.mutate(p.id)}>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteProp.mutate(p.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="blog">
            <Card>
              {loadPosts ? (
                <div className="p-4 space-y-3">{[1,2].map(i => <Skeleton key={i} className="h-12" />)}</div>
              ) : (
                <div className="divide-y divide-border">
                  {posts?.map(post => (
                    <div key={post.id} className="flex items-center justify-between p-4" data-testid={`row-blog-${post.id}`}>
                      <div>
                        <p className="font-medium text-sm">{post.title}</p>
                        <p className="text-xs text-muted-foreground">{post.slug}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Yayında" : "Taslak"}
                        </Badge>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deletePost.mutate(post.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
