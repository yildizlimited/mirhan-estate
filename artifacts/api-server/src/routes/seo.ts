import { Router } from "express";
import { storage } from "../lib/storage";
import { getSeoPage, getSeoPageSlugs, getSeoPageCount } from "../lib/seo-pages";

const router = Router();

router.get("/seo/pages", (_req, res) => {
  return res.json({ count: getSeoPageCount(), slugs: getSeoPageSlugs() });
});

router.get("/seo/page/:slug", async (req, res) => {
  const config = getSeoPage(req.params.slug);
  if (!config) return res.status(404).json({ message: "SEO sayfası bulunamadı" });

  const filters: Record<string, string | boolean> = { approved: true };
  if (config.city) filters.city = config.city;
  if (config.district) filters.district = config.district;
  if (config.listingType) filters.listingType = config.listingType;
  if (config.propertyType) filters.propertyType = config.propertyType;

  const properties = await storage.getProperties(filters as any);

  const relatedPages = config.relatedSlugs
    .map(s => getSeoPage(s))
    .filter(Boolean)
    .slice(0, 8);

  return res.json({ config, properties, relatedPages });
});

router.get("/seo/admin", async (_req, res) => {
  const slugs = getSeoPageSlugs();
  const pages = slugs.slice(0, 100).map(slug => getSeoPage(slug));
  return res.json({ count: getSeoPageCount(), pages });
});

export default router;
