import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowLeft } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery<any>({
    queryKey: ["/api/blog", slug],
    queryFn: async () => {
      const res = await fetch(`/api/blog/${slug}`, { credentials: "include" });
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
  });

  useSeo({
    title: post ? post.title : "Blog Yazısı",
    description: post ? post.content?.substring(0, 160) : "Mirhan Gayrimenkul blog yazısı",
    canonical: post ? `https://mirhanestate.com/istanbul-emlak-blog/${slug}` : undefined,
    ogImage: post?.featuredImage,
    ogType: "article",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Yazı Bulunamadı</h1>
          <Link href="/istanbul-emlak-blog">
            <Button className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Bloga Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.content?.substring(0, 160),
            image: post.featuredImage,
            datePublished: post.createdAt,
            dateModified: post.updatedAt || post.createdAt,
            author: { "@type": "Organization", name: "Mirhan Gayrimenkul" },
            publisher: {
              "@type": "Organization",
              name: "Mirhan Gayrimenkul",
              url: "https://mirhanestate.com",
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": `https://mirhanestate.com/istanbul-emlak-blog/${slug}` },
          }),
        }}
      />
      <Header />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <Link href="/istanbul-emlak-blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors" data-testid="link-back-blog">
          <ArrowLeft className="w-4 h-4" />
          Blog'a Dön
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-blog-post-title">
          {post.title}
        </h1>

        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Calendar className="w-4 h-4" />
          <span>
            {post.createdAt
              ? format(new Date(post.createdAt), "d MMMM yyyy", { locale: tr })
              : ""}
          </span>
        </div>

        {post.featuredImage && (
          <div className="rounded-xl overflow-hidden mb-8 aspect-video">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="eager"
              width={800}
              height={450}
              data-testid="img-blog-featured"
            />
          </div>
        )}

        <div
          className="prose prose-slate dark:prose-invert max-w-none"
          data-testid="text-blog-content"
          dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, "<br/>") || "" }}
        />

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Mirhan Gayrimenkul · İstanbul Emlak Blog
          </p>
        </div>
      </article>
      <Footer />
    </div>
  );
}
