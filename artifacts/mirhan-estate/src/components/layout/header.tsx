import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Heart, MessageSquare, User, LogOut, LayoutDashboard, Shield, Menu, Search } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/istanbul-emlak-ilanlari", label: "İlanlar" },
    { href: "/istanbul-satin-alma-rehberi", label: "Satın Alma Rehberi" },
    { href: "/istanbul-emlak-danismanlari", label: "Danışmanlarımız" },
    { href: "/istanbul-emlak-blog", label: "Blog" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center group" data-testid="link-home">
              <img
                src="/logo.png"
                alt="Mirhan Gayrimenkul"
                className="h-12 w-auto object-contain"
                width={140}
                height={48}
              />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} data-testid={`link-nav-${link.label}`}>
                  <span
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      location === link.href
                        ? "text-amber-600 bg-amber-50 dark:bg-amber-900/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/istanbul-emlak-ilanlari" className="hidden sm:flex" data-testid="link-search-header">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Search className="w-5 h-5" />
              </Button>
            </Link>

            {user ? (
              <>
                <Link href="/favorites" className="hidden sm:flex" data-testid="link-favorites">
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Heart className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/messages" data-testid="link-messages">
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700" data-testid="button-user-menu">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    {(user.role === "agent" || user.role === "admin") && (
                      <Link href="/dashboard">
                        <DropdownMenuItem className="cursor-pointer" data-testid="link-dashboard">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Panel
                        </DropdownMenuItem>
                      </Link>
                    )}
                    {user.role === "admin" && (
                      <Link href="/admin">
                        <DropdownMenuItem className="cursor-pointer" data-testid="link-admin">
                          <Shield className="w-4 h-4 mr-2" />
                          Admin
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <Link href="/favorites">
                      <DropdownMenuItem className="cursor-pointer" data-testid="link-favorites-menu">
                        <Heart className="w-4 h-4 mr-2" />
                        Favorilerim
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-destructive" onClick={logout} data-testid="button-logout">
                      <LogOut className="w-4 h-4 mr-2" />
                      Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login" data-testid="link-login">
                  <Button variant="ghost" size="sm">Giriş Yap</Button>
                </Link>
                <Link href="/register" data-testid="link-register">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">Kayıt Ol</Button>
                </Link>
              </div>
            )}

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex items-center gap-2 mb-6 mt-2">
                  <img src="/logo.png" alt="Mirhan Gayrimenkul" className="h-10 w-auto object-contain" />
                </div>
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                      <span className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-muted cursor-pointer">
                        {link.label}
                      </span>
                    </Link>
                  ))}
                  {!user && (
                    <>
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        <span className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-muted cursor-pointer">Giriş Yap</span>
                      </Link>
                      <Link href="/register" onClick={() => setMobileOpen(false)}>
                        <span className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-muted cursor-pointer">Kayıt Ol</span>
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
