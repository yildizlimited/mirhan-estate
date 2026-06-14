import { Router } from "express";
import { storage } from "../lib/storage";
import { requireRole } from "../lib/auth";

const router = Router();

router.get("/blog", async (_req, res) => {
  const posts = await storage.getBlogPosts();
  const published = posts.filter(p => p.published);
  return res.json(published);
});

router.get("/blog/all", requireRole("admin", "agent"), async (_req, res) => {
  const posts = await storage.getBlogPosts();
  return res.json(posts);
});

router.get("/blog/:slug", async (req, res) => {
  const post = await storage.getBlogPostBySlug(String(req.params.slug));
  if (!post) return res.status(404).json({ message: "Yazı bulunamadı" });
  return res.json(post);
});

router.post("/blog", requireRole("admin", "agent"), async (req, res) => {
  const { title, content, slug, featuredImage, seoTitle, seoDescription, published } = req.body;
  if (!title || !content || !slug) return res.status(400).json({ message: "Başlık, içerik ve slug zorunlu" });
  const post = await storage.createBlogPost({
    title, content, slug, featuredImage, seoTitle, seoDescription,
    published: !!published,
    authorId: req.session.userId!,
  });
  return res.status(201).json(post);
});

router.patch("/blog/:id", requireRole("admin", "agent"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const updated = await storage.updateBlogPost(id, req.body);
  if (!updated) return res.status(404).json({ message: "Yazı bulunamadı" });
  return res.json(updated);
});

router.delete("/blog/:id", requireRole("admin"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  await storage.deleteBlogPost(id);
  return res.json({ ok: true });
});

export default router;
