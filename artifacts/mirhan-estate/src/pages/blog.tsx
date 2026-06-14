import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowRight, FileText } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function BlogPage() {
  useSeo({
    title: "İstanbul Emlak Blog - Emlak Haberleri ve Rehberler",
    description: "İstanbul emlak sektörü haberleri, gayrimenkul yatırım rehberleri ve İstanbul'da ev alma ipuçları. Mirhan Gayrimenkul blog.",
    keywords: "istanbul emlak blog, istanbul gayrimenkul haberleri, istanbul ev alma rehberi, istanbul emlak yatırım, beşiktaş emlak fiyatları, kadıköy konut projeleri, istanbul konut piyasası",
    canonical: "https://mirhanestate.com/istanbul-emlak-blog",
  });

  const { data: posts, isLoading } = useQuery<any[]>({
    queryKey: ["/api/blog"],
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-blog-title">
            İstanbul Emlak Blog
          </h1>
          <p className="text-muted-foreground text-lg">
            İstanbul gayrimenkul dünyasından haberler ve rehberler
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/istanbul-emlak-blog/${post.slug}`}>
                <Card
                  className="overflow-hidden border-card-border hover:shadow-md transition-all cursor-pointer group"
                  data-testid={`card-blog-${post.id}`}
                >
                  <div className="flex flex-col sm:flex-row">
                    {post.featuredImage && (
                      <div className="sm:w-56 sm:shrink-0 aspect-video sm:aspect-auto overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                          width={224}
                          height={150}
                        />
                      </div>
                    )}
                    <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-2">
                      <div className="space-y-2">
                        <h2 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {post.content?.substring(0, 200)}...
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {post.createdAt
                              ? format(new Date(post.createdAt), "d MMMM yyyy", { locale: tr })
                              : ""}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Henüz blog yazısı yok</h3>
            <p className="text-muted-foreground">İstanbul emlak blog yazıları yakında eklenecektir.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
