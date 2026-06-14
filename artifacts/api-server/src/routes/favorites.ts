import { Router } from "express";
import { storage } from "../lib/storage";
import { requireAuth } from "../lib/auth";

const router = Router();

router.get("/favorites", requireAuth, async (req, res) => {
  const props = await storage.getFavorites(req.session.userId!);
  return res.json(props);
});

router.post("/favorites/:propertyId", requireAuth, async (req, res) => {
  const propertyId = parseInt(req.params.propertyId);
  if (isNaN(propertyId)) return res.status(400).json({ message: "Geçersiz ID" });
  const userId = req.session.userId!;
  const already = await storage.isFavorite(userId, propertyId);
  if (already) {
    await storage.removeFavorite(userId, propertyId);
    return res.json({ added: false });
  }
  await storage.addFavorite({ userId, propertyId });
  return res.json({ added: true });
});

router.delete("/favorites/:propertyId", requireAuth, async (req, res) => {
  const propertyId = parseInt(req.params.propertyId);
  if (isNaN(propertyId)) return res.status(400).json({ message: "Geçersiz ID" });
  await storage.removeFavorite(req.session.userId!, propertyId);
  return res.json({ ok: true });
});

export default router;
