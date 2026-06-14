import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Maximize, BedDouble, Bath, Calendar } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";

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

function formatPrice(price: number, listingType: string): string {
  const formatted = new Intl.NumberFormat("tr-TR").format(price);
  return listingType === "rent" ? `${formatted} ₺/ay` : `${formatted} ₺`;
}

export function PropertyCard({ property }: { property: PropertyWithImages }) {
  const { user } = useAuth();
  const primaryImage = property.images.find(i => i.isPrimary) || property.images[0];
  const imageUrl = primaryImage?.imageUrl || "https://picsum.photos/seed/default/800/600";
  const webpUrl = imageUrl.replace(/\.jpg$/, ".webp");

  const favMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/favorites/${property.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
  });

  return (
    <Link href={`/istanbul-emlak/${property.id}`}>
      <Card
        className="group overflow-hidden border border-card-border hover:shadow-lg transition-all duration-300 cursor-pointer"
        data-testid={`card-property-${property.id}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <picture>
            <source srcSet={webpUrl} type="image/webp" />
            <img
              src={imageUrl}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
              width={480}
              height={300}
            />
          </picture>
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge
              className={`text-xs font-semibold px-2.5 py-1 ${
                property.listingType === "sale"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
              data-testid={`badge-listing-type-${property.id}`}
            >
              {property.listingType === "sale" ? "Satılık" : "Kiralık"}
            </Badge>
            {property.featured && (
              <Badge className="bg-amber-500 text-white hover:bg-amber-600 text-xs font-semibold px-2.5 py-1">
                Öne Çıkan
              </Badge>
            )}
          </div>
          {user && (
            <button
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                favMutation.mutate();
              }}
              data-testid={`button-favorite-${property.id}`}
            >
              <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
            </button>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="text-white font-bold text-lg" data-testid={`text-price-${property.id}`}>
              {formatPrice(property.price, property.listingType)}
            </p>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors" data-testid={`text-title-${property.id}`}>
            {property.title}
          </h3>

          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs truncate" data-testid={`text-location-${property.id}`}>
              {property.city}, {property.district}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
            <div className="flex items-center gap-1">
              <Maximize className="w-3.5 h-3.5" />
              <span>{property.squareMeters} m²</span>
            </div>
            <div className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5" />
              <span>{property.rooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" />
              <span>{property.bathrooms}</span>
            </div>
            {property.buildingAge !== null && property.buildingAge !== undefined && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{property.buildingAge} yıl</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
