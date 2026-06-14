import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal, X, Building2 } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";
import { useState } from "react";
import { useSearch } from "wouter";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type PropertyImage = {
  id: number;
  propertyId: number;
  imageUrl: string;
  isPrimary: boolean | null;
};

type PropertyWithImages = {
  id: number;
  title: string;
  price: number;
  city: string;
  district: string;
  listingType: string;
  propertyType: string;
  squareMeters: number;
  rooms: string;
  bathrooms: number;
  buildingAge?: number | null;
  featured: boolean | null;
  images: PropertyImage[];
};

export default function ListingsPage() {
  useSeo({
    title: "İstanbul Emlak İlanları - Satılık ve Kiralık",
    description: "İstanbul'da satılık ve kiralık daire, villa, arsa ve işyeri ilanlarını keşfedin. Beşiktaş, Kadıköy, Sarıyer, Şişli, Üsküdar bölgelerinde güncel emlak ilanları.",
    keywords: "istanbul emlak ilanları, istanbul satılık daire, istanbul kiralık daire, istanbul satılık villa, beşiktaş satılık daire, kadıköy kiralık, sarıyer satılık, şişli satılık, istanbul arsa, istanbul işyeri",
    canonical: "https://mirhanestate.com/istanbul-emlak-ilanlari",
  });
  const searchParams = useSearch();
  const params = new URLSearchParams(searchParams);

  const [filters, setFilters] = useState({
    search: params.get("search") || "",
    city: params.get("city") || "",
    district: params.get("district") || "",
    listingType: params.get("listingType") || "",
    propertyType: params.get("propertyType") || "",
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
    rooms: params.get("rooms") || "",
    furnished: false,
    insideComplex: false,
    mortgageEligible: false,
  });

  const [activeFilters, setActiveFilters] = useState(filters);
  const [mobileFilters, setMobileFilters] = useState(false);

  const buildQuery = () => {
    const p = new URLSearchParams();
    if (activeFilters.search) p.set("search", activeFilters.search);
    if (activeFilters.city) p.set("city", activeFilters.city);
    if (activeFilters.district) p.set("district", activeFilters.district);
    if (activeFilters.listingType && activeFilters.listingType !== "all") p.set("listingType", activeFilters.listingType);
    if (activeFilters.propertyType && activeFilters.propertyType !== "all") p.set("propertyType", activeFilters.propertyType);
    if (activeFilters.minPrice) p.set("minPrice", activeFilters.minPrice);
    if (activeFilters.maxPrice) p.set("maxPrice", activeFilters.maxPrice);
    if (activeFilters.rooms && activeFilters.rooms !== "all") p.set("rooms", activeFilters.rooms);
    if (activeFilters.furnished) p.set("furnished", "true");
    if (activeFilters.insideComplex) p.set("insideComplex", "true");
    if (activeFilters.mortgageEligible) p.set("mortgageEligible", "true");
    return p.toString();
  };

  const { data: properties, isLoading } = useQuery<PropertyWithImages[]>({
    queryKey: ["/api/properties", buildQuery()],
    queryFn: async () => {
      const q = buildQuery();
      const res = await fetch(`/api/properties?${q}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const applyFilters = () => {
    setActiveFilters({ ...filters });
    setMobileFilters(false);
  };

  const clearFilters = () => {
    const empty = {
      search: "", city: "", district: "", listingType: "", propertyType: "",
      minPrice: "", maxPrice: "", rooms: "", furnished: false, insideComplex: false, mortgageEligible: false,
    };
    setFilters(empty);
    setActiveFilters(empty);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-2 block">İlan Tipi</Label>
        <Select value={filters.listingType} onValueChange={(v) => setFilters({ ...filters, listingType: v })}>
          <SelectTrigger data-testid="select-filter-listing-type">
            <SelectValue placeholder="Tümü" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="sale">Satılık</SelectItem>
            <SelectItem value="rent">Kiralık</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Konut Tipi</Label>
        <Select value={filters.propertyType} onValueChange={(v) => setFilters({ ...filters, propertyType: v })}>
          <SelectTrigger data-testid="select-filter-property-type">
            <SelectValue placeholder="Tümü" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="daire">Daire</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="arsa">Arsa</SelectItem>
            <SelectItem value="isyeri">İşyeri</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Şehir / İlçe</Label>
        <Input
          placeholder="İstanbul"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          data-testid="input-filter-city"
        />
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">İlçe</Label>
        <Input
          placeholder="Beşiktaş, Kadıköy..."
          value={filters.district}
          onChange={(e) => setFilters({ ...filters, district: e.target.value })}
          data-testid="input-filter-district"
        />
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Fiyat Aralığı</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Min"
            type="number"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            data-testid="input-filter-min-price"
          />
          <Input
            placeholder="Max"
            type="number"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            data-testid="input-filter-max-price"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Oda Sayısı</Label>
        <Select value={filters.rooms} onValueChange={(v) => setFilters({ ...filters, rooms: v })}>
          <SelectTrigger data-testid="select-filter-rooms">
            <SelectValue placeholder="Tümü" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="1+0">1+0</SelectItem>
            <SelectItem value="1+1">1+1</SelectItem>
            <SelectItem value="2+1">2+1</SelectItem>
            <SelectItem value="3+1">3+1</SelectItem>
            <SelectItem value="4+1">4+1</SelectItem>
            <SelectItem value="5+2">5+2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={filters.furnished}
            onCheckedChange={(v) => setFilters({ ...filters, furnished: !!v })}
            data-testid="checkbox-furnished"
          />
          <Label className="text-sm">Eşyalı</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={filters.insideComplex}
            onCheckedChange={(v) => setFilters({ ...filters, insideComplex: !!v })}
            data-testid="checkbox-complex"
          />
          <Label className="text-sm">Site İçinde</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={filters.mortgageEligible}
            onCheckedChange={(v) => setFilters({ ...filters, mortgageEligible: !!v })}
            data-testid="checkbox-mortgage"
          />
          <Label className="text-sm">Krediye Uygun</Label>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={applyFilters} className="flex-1" data-testid="button-apply-filters">
          Filtrele
        </Button>
        <Button variant="outline" onClick={clearFilters} data-testid="button-clear-filters">
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-listings-title">
              İstanbul Emlak İlanları
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {properties?.length || 0} ilan bulundu
            </p>
          </div>

          <Sheet open={mobileFilters} onOpenChange={setMobileFilters}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="sm" data-testid="button-mobile-filters">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtreler
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filtreler</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="İlan ara..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              data-testid="input-search-listings"
            />
          </div>
          <Button onClick={applyFilters} data-testid="button-search-listings">
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border border-card-border p-5">
              <h2 className="font-semibold mb-4">Filtreler</h2>
              <FilterPanel />
            </div>
          </aside>

          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-xl" />
                ))}
              </div>
            ) : properties && properties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Building2 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">İlan Bulunamadı</h3>
                <p className="text-muted-foreground">Arama kriterlerinize uygun ilan bulunmamaktadır.</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters} data-testid="button-clear-no-results">
                  Filtreleri Temizle
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
