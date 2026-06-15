import { Router } from "express";
import { storage } from "../lib/storage";
import { requireRole } from "../lib/auth";

const router = Router();

async function getMyAgent(userId: number) {
  return storage.getAgentByUserId(userId);
}

// ── Dashboard stats for agent ─────────────────────────────────────────────────
router.get("/agent/stats", requireRole("agent", "admin"), async (req, res) => {
  const agent = await getMyAgent(req.session.userId!);
  if (!agent) return res.json({ activeListings: 0, approvedSales: 0, approvedCommission: 0, pendingCommission: 0 });

  const props = await storage.getPropertiesByAgent(agent.id);
  const txns = await storage.getTransactionsByAgent(agent.id);

  const activeListings = props.filter(p => p.status === "active").length;
  const approvedSales = txns.filter(t => t.status === "completed").length;
  const approvedCommission = txns.filter(t => t.status === "completed").reduce((s, t) => s + t.commissionAmount, 0);
  const pendingCommission = txns.filter(t => t.status === "pending").reduce((s, t) => s + t.commissionAmount, 0);

  return res.json({ activeListings, approvedSales, approvedCommission, pendingCommission });
});

// ── Agent properties ──────────────────────────────────────────────────────────
router.get("/agent/properties", requireRole("agent", "admin"), async (req, res) => {
  const agent = await getMyAgent(req.session.userId!);
  if (!agent) return res.json([]);
  const props = await storage.getPropertiesByAgent(agent.id);
  return res.json(props);
});

router.post("/agent/properties", requireRole("agent", "admin"), async (req, res) => {
  const agent = await getMyAgent(req.session.userId!);
  if (!agent) return res.status(403).json({ message: "Ajan profili bulunamadı" });

  const {
    title, description, price, city, district, neighborhood,
    propertyType, listingType, squareMeters, rooms, bathrooms,
    buildingAge, floor, totalFloors, furnished,
    insideComplex, mortgageEligible, status, featured, images,
  } = req.body;

  if (!title || !price || !propertyType || !listingType) {
    return res.status(400).json({ message: "Başlık, fiyat, tür ve ilan tipi zorunlu" });
  }

  const property = await storage.createProperty({
    title,
    description: description || "",
    price: parseInt(price),
    city: city || "İstanbul",
    district: district || "",
    neighborhood: neighborhood || "",
    propertyType: propertyType || "daire",
    listingType: listingType || "sale",
    squareMeters: squareMeters ? parseInt(squareMeters) : 0,
    rooms: rooms || "",
    bathrooms: bathrooms ? parseInt(bathrooms) : 1,
    buildingAge: buildingAge ? parseInt(buildingAge) : 0,
    floor: floor ? parseInt(floor) : 0,
    totalFloors: totalFloors ? parseInt(totalFloors) : 0,
    furnished: !!furnished,
    insideComplex: !!insideComplex,
    mortgageEligible: !!mortgageEligible,
    agentId: agent.id,
    status: status || "active",
    featured: !!featured,
    approved: false,
  });

  if (Array.isArray(images)) {
    for (let i = 0; i < images.length; i++) {
      await storage.addPropertyImage({ propertyId: property.id, imageUrl: images[i], isPrimary: i === 0 });
    }
  }

  return res.status(201).json(property);
});

router.put("/agent/properties/:id", requireRole("agent", "admin"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });

  const agent = await getMyAgent(req.session.userId!);
  if (!agent) return res.status(403).json({ message: "Ajan profili bulunamadı" });

  const props = await storage.getPropertiesByAgent(agent.id);
  if (!props.some(p => p.id === id) && req.session.userRole !== "admin") {
    return res.status(403).json({ message: "Bu ilana erişim yetkiniz yok" });
  }

  const {
    title, description, price, city, district, neighborhood,
    propertyType, listingType, squareMeters, rooms, bathrooms,
    buildingAge, floor, totalFloors, furnished,
    insideComplex, mortgageEligible, status, featured,
  } = req.body;

  const updateData: Parameters<typeof storage.updateProperty>[1] = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) updateData.price = parseInt(price);
  if (city !== undefined) updateData.city = city;
  if (district !== undefined) updateData.district = district;
  if (neighborhood !== undefined) updateData.neighborhood = neighborhood;
  if (propertyType !== undefined) updateData.propertyType = propertyType;
  if (listingType !== undefined) updateData.listingType = listingType;
  if (squareMeters !== undefined) updateData.squareMeters = parseInt(squareMeters);
  if (rooms !== undefined) updateData.rooms = rooms;
  if (bathrooms !== undefined) updateData.bathrooms = parseInt(bathrooms);
  if (buildingAge !== undefined) updateData.buildingAge = parseInt(buildingAge);
  if (floor !== undefined) updateData.floor = parseInt(floor);
  if (totalFloors !== undefined) updateData.totalFloors = parseInt(totalFloors);
  if (furnished !== undefined) updateData.furnished = !!furnished;
  if (insideComplex !== undefined) updateData.insideComplex = !!insideComplex;
  if (mortgageEligible !== undefined) updateData.mortgageEligible = !!mortgageEligible;
  if (status !== undefined) updateData.status = status;
  if (featured !== undefined) updateData.featured = !!featured;

  const updated = await storage.updateProperty(id, updateData);
  if (!updated) return res.status(404).json({ message: "İlan bulunamadı" });
  return res.json(updated);
});

router.delete("/agent/properties/:id", requireRole("agent", "admin"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });

  const agent = await getMyAgent(req.session.userId!);
  if (!agent) return res.status(403).json({ message: "Ajan profili bulunamadı" });

  const props = await storage.getPropertiesByAgent(agent.id);
  if (!props.some(p => p.id === id) && req.session.userRole !== "admin") {
    return res.status(403).json({ message: "Bu ilana erişim yetkiniz yok" });
  }

  await storage.deleteProperty(id);
  return res.json({ ok: true });
});

router.put("/agent/properties/:id/status", requireRole("agent", "admin"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });

  const agent = await getMyAgent(req.session.userId!);
  if (!agent) return res.status(403).json({ message: "Ajan profili bulunamadı" });

  const props = await storage.getPropertiesByAgent(agent.id);
  if (!props.some(p => p.id === id) && req.session.userRole !== "admin") {
    return res.status(403).json({ message: "Bu ilana erişim yetkiniz yok" });
  }

  const { status } = req.body;
  if (!status) return res.status(400).json({ message: "Durum zorunlu" });

  const updated = await storage.updateProperty(id, { status });
  if (!updated) return res.status(404).json({ message: "İlan bulunamadı" });
  return res.json(updated);
});

// ── Agent transactions ────────────────────────────────────────────────────────
router.get("/agent/transactions", requireRole("agent", "admin"), async (req, res) => {
  const agent = await getMyAgent(req.session.userId!);
  if (!agent) return res.json([]);
  const txns = await storage.getTransactionsByAgent(agent.id);
  return res.json(txns);
});

router.post("/agent/transactions", requireRole("agent", "admin"), async (req, res) => {
  const agent = await getMyAgent(req.session.userId!);
  if (!agent) return res.status(403).json({ message: "Ajan profili bulunamadı" });

  const { propertyId, transactionType, salePrice, commissionRate, notes } = req.body;
  if (!propertyId || !transactionType || !salePrice) {
    return res.status(400).json({ message: "Zorunlu alanlar eksik" });
  }

  const rate = parseFloat(commissionRate) || 0;
  const commissionAmount = Math.round(parseInt(salePrice) * rate / 100);
  const newStatus = transactionType === "sale" ? "sold" : transactionType === "rent" ? "rented" : "active";

  const txn = await storage.createTransactionWithStatus({
    propertyId: parseInt(propertyId),
    agentId: agent.id,
    transactionType,
    salePrice: parseInt(salePrice),
    commissionAmount,
    commissionRate: rate,
    status: "completed",
    notes,
  }, parseInt(propertyId), newStatus);

  return res.status(201).json(txn);
});

// ── Sahibinden Import ─────────────────────────────────────────────────────────
router.post("/import/sahibinden", requireRole("agent", "admin"), async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ message: "URL zorunlu" });

  const ilanId = String(url).match(/\/(\d+)$/)?.[1] || "";
  return res.json({
    title: `Sahibinden İlan #${ilanId}`,
    description: "İlan açıklamasını buraya yazın.",
    price: 0,
    city: "İstanbul",
    district: "",
    neighborhood: "",
    propertyType: "daire",
    listingType: "sale",
    squareMeters: 0,
    rooms: "3+1",
    bathrooms: 1,
    buildingAge: 0,
    floor: 0,
    totalFloors: 0,
    furnished: false,
    images: [],
    _notice: "Sahibinden.com CAPTCHA koruması nedeniyle otomatik veri alınamadı. Lütfen alanları manuel doldurun.",
  });
});

// ── AI Description Generator ──────────────────────────────────────────────────
router.post("/ai/generate-description", requireRole("agent", "admin"), async (req, res) => {
  const {
    title, propertyType, listingType, city, district, neighborhood,
    squareMeters, rooms, floor, buildingAge, furnished, insideComplex,
    mortgageEligible, price,
  } = req.body;

  const typeLabel =
    propertyType === "villa" ? "Villa" :
    propertyType === "arsa" ? "Arsa" :
    propertyType === "isyeri" ? "İş Yeri" :
    "Daire";
  const listingLabel = listingType === "rent" ? "kiralık" : "satılık";
  const locationParts = [neighborhood, district, city].filter(Boolean).join(", ");

  const featuresArr: string[] = [];
  if (furnished) featuresArr.push("eşyalı");
  if (insideComplex) featuresArr.push("site içinde");
  if (mortgageEligible) featuresArr.push("krediye uygun");
  const features = featuresArr.length ? featuresArr.join(", ") : "";

  const description = [
    `${locationParts ? locationParts + " bölgesinde" : "İstanbul'da"} ${listingLabel}${squareMeters ? " " + squareMeters + " m²" : ""}${rooms ? " " + rooms : ""} ${typeLabel.toLowerCase()}.`,
    buildingAge !== undefined && buildingAge !== "" && buildingAge !== null
      ? `Bina yaşı ${buildingAge} yıl olup${floor ? ` ${floor}. katta yer almaktadır` : ""}.`
      : "",
    features
      ? `${features.charAt(0).toUpperCase() + features.slice(1)} olan mülk, modern yaşam standartlarını karşılamaktadır.`
      : "Modern yaşam standartlarını karşılamaktadır.",
    `İstanbul'un ${district || "merkezi"} konumunda, ulaşım ve sosyal olanaklara yakın bu ${typeLabel.toLowerCase()}${price ? ", " + Number(price).toLocaleString("tr-TR") + " TL fiyatıyla" : ""} yatırım ve yaşam için ideal bir fırsattır.`,
    "Mirhan Gayrimenkul güvencesiyle detaylı bilgi ve görüntüleme için bizimle iletişime geçin.",
  ].filter(Boolean).join(" ");

  return res.json({ description });
});

export default router;
