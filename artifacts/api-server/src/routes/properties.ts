import { Router } from "express";
import { storage } from "../lib/storage";
import { requireAuth, requireRole } from "../lib/auth";
import { insertPropertySchema } from "@workspace/db";

const router = Router();

router.get("/properties/featured", async (_req, res) => {
  const props = await storage.getFeaturedProperties();
  return res.json(props);
});

router.get("/properties/latest", async (req, res) => {
  const limit = parseInt(String(req.query.limit)) || 8;
  const props = await storage.getLatestProperties(limit);
  return res.json(props);
});

router.get("/properties", async (req, res) => {
  const { city, district, listingType, propertyType, minPrice, maxPrice, minSquareMeters, maxSquareMeters, rooms, furnished, insideComplex, mortgageEligible, search } = req.query;
  const userRole = req.session?.userRole;
  const isAdminOrAgent = userRole === "admin" || userRole === "agent";

  const filters: Parameters<typeof storage.getProperties>[0] = {};
  if (!isAdminOrAgent) filters.approved = true;
  if (city) filters.city = String(city);
  if (district) filters.district = String(district);
  if (listingType) filters.listingType = String(listingType);
  if (propertyType) filters.propertyType = String(propertyType);
  if (minPrice) filters.minPrice = parseInt(String(minPrice));
  if (maxPrice) filters.maxPrice = parseInt(String(maxPrice));
  if (minSquareMeters) filters.minSquareMeters = parseInt(String(minSquareMeters));
  if (maxSquareMeters) filters.maxSquareMeters = parseInt(String(maxSquareMeters));
  if (rooms) filters.rooms = String(rooms);
  if (furnished !== undefined) filters.furnished = furnished === "true";
  if (insideComplex !== undefined) filters.insideComplex = insideComplex === "true";
  if (mortgageEligible !== undefined) filters.mortgageEligible = mortgageEligible === "true";
  if (search) filters.search = String(search);

  const props = await storage.getProperties(filters);
  return res.json(props);
});

router.get("/properties/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const prop = await storage.getProperty(id);
  if (!prop) return res.status(404).json({ message: "İlan bulunamadı" });
  await storage.incrementPropertyViews(id);
  return res.json(prop);
});

router.post("/properties", requireRole("agent", "admin"), async (req, res) => {
  const parsed = insertPropertySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Geçersiz veri", errors: parsed.error.issues });
  }
  const userRole = req.session.userRole;
  const data = { ...parsed.data, approved: userRole === "admin" };
  const prop = await storage.createProperty(data);
  return res.status(201).json(prop);
});

router.patch("/properties/:id", requireRole("agent", "admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const existing = await storage.getProperty(id);
  if (!existing) return res.status(404).json({ message: "İlan bulunamadı" });

  const userRole = req.session.userRole;
  const agent = await storage.getAgentByUserId(req.session.userId!);
  if (userRole !== "admin" && existing.agentId !== agent?.id) {
    return res.status(403).json({ message: "Bu ilanı düzenleme yetkiniz yok" });
  }

  const updated = await storage.updateProperty(id, req.body);
  return res.json(updated);
});

router.delete("/properties/:id", requireRole("agent", "admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const existing = await storage.getProperty(id);
  if (!existing) return res.status(404).json({ message: "İlan bulunamadı" });

  const userRole = req.session.userRole;
  const agent = await storage.getAgentByUserId(req.session.userId!);
  if (userRole !== "admin" && existing.agentId !== agent?.id) {
    return res.status(403).json({ message: "Bu ilanı silme yetkiniz yok" });
  }

  await storage.deleteProperty(id);
  return res.json({ ok: true });
});

router.post("/properties/:id/images", requireRole("agent", "admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const { imageUrl, isPrimary } = req.body;
  if (!imageUrl) return res.status(400).json({ message: "Resim URL gerekli" });
  const image = await storage.addPropertyImage({ propertyId: id, imageUrl, isPrimary: !!isPrimary });
  return res.status(201).json(image);
});

router.delete("/properties/images/:imageId", requireRole("agent", "admin"), async (req, res) => {
  const id = parseInt(req.params.imageId);
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  await storage.deletePropertyImage(id);
  return res.json({ ok: true });
});

router.get("/properties/agent/:agentId", async (req, res) => {
  const agentId = parseInt(req.params.agentId);
  if (isNaN(agentId)) return res.status(400).json({ message: "Geçersiz ID" });
  const props = await storage.getPropertiesByAgent(agentId);
  return res.json(props);
});

export default router;
