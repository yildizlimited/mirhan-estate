import { useEffect } from "react";

interface HrefLang {
  lang: string;
  href: string;
}

interface SeoOptions {
  title: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  hrefLangs?: HrefLang[];
}

export function useSeo(options: SeoOptions) {
  useEffect(() => {
    const suffix = " | Mirhan Gayrimenkul";
    document.title = options.title.includes("Mirhan") ? options.title : options.title + suffix;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    if (options.description) {
      setMeta("description", options.description);
    }
    if (options.keywords) {
      setMeta("keywords", options.keywords);
    }

    const ogTitle = options.ogTitle || options.title + suffix;
    const ogDesc = options.ogDescription || options.description || "";
    const ogImage = options.ogImage || "https://mirhanestate.com/images/hero-istanbul.jpg";

    setMeta("og:title", ogTitle, "property");
    setMeta("og:description", ogDesc, "property");
    if (options.ogUrl) {
      setMeta("og:url", options.ogUrl, "property");
    }
    setMeta("og:type", options.ogType || "website", "property");
    setMeta("og:image", ogImage, "property");
    setMeta("og:site_name", "Mirhan Gayrimenkul", "property");

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", ogTitle);
    setMeta("twitter:description", ogDesc);
    setMeta("twitter:image", ogImage);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (options.canonical) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = options.canonical;
    }

    const hrefLangEls: HTMLLinkElement[] = [];
    if (options.hrefLangs) {
      for (const hl of options.hrefLangs) {
        const el = document.createElement("link");
        el.rel = "alternate";
        el.hreflang = hl.lang;
        el.href = hl.href;
        document.head.appendChild(el);
        hrefLangEls.push(el);
      }
    }

    return () => {
      document.title = "Mirhan Gayrimenkul - İstanbul Güvenilir Emlak Danışmanlığı";
      hrefLangEls.forEach(el => el.remove());
    };
  }, [options.title, options.description, options.keywords, options.ogTitle, options.ogDescription, options.ogUrl, options.ogImage, options.ogType, options.canonical, options.hrefLangs]);
}
