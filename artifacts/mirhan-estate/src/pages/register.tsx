import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useSeo } from "@/hooks/use-seo";

export default function RegisterPage() {
  useSeo({ title: "Kayıt Ol" });
  const { register, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Kayıt başarısız");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 border-card-border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Mirhan Gayrimenkul</h1>
          <p className="text-muted-foreground mt-1">Yeni hesap oluşturun</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Ad Soyad</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adınız Soyadınız"
              required
              data-testid="input-name"
            />
          </div>
          <div>
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
              data-testid="input-email"
            />
          </div>
          <div>
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="En az 6 karakter"
              required
              minLength={6}
              data-testid="input-password"
            />
          </div>
          {error && <p className="text-sm text-destructive" data-testid="text-error">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-register">
            {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Zaten hesabınız var mı?{" "}
          <Link href="/login" className="text-primary hover:underline" data-testid="link-login">
            Giriş Yap
          </Link>
        </p>
      </Card>
    </div>
  );
}
