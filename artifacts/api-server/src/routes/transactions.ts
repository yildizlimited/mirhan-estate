import { Router } from "express";
import { storage } from "../lib/storage";
import { requireRole } from "../lib/auth";

const router = Router();

router.get("/transactions", requireRole("agent", "admin"), async (req, res) => {
  const userRole = req.session.userRole;
  if (userRole === "admin") {
    const txns = await storage.getAllTransactions();
    return res.json(txns);
  }
  const agent = await storage.getAgentByUserId(req.session.userId!);
  if (!agent) return res.json([]);
  const txns = await storage.getTransactionsByAgent(agent.id);
  return res.json(txns);
});

router.post("/transactions", requireRole("agent", "admin"), async (req, res) => {
  const { propertyId, transactionType, salePrice, commissionRate, notes } = req.body;
  if (!propertyId || !transactionType || !salePrice) {
    return res.status(400).json({ message: "Zorunlu alanlar eksik" });
  }
  const agent = await storage.getAgentByUserId(req.session.userId!);
  if (!agent) return res.status(403).json({ message: "Ajan profili gerekli" });

  const commissionRate_ = parseFloat(commissionRate) || 0;
  const commissionAmount = Math.round(parseInt(salePrice) * commissionRate_ / 100);
  const newStatus = transactionType === "sale" ? "sold" : transactionType === "rent" ? "rented" : "active";

  const txn = await storage.createTransactionWithStatus({
    propertyId: parseInt(propertyId),
    agentId: agent.id,
    transactionType,
    salePrice: parseInt(salePrice),
    commissionAmount,
    commissionRate: commissionRate_,
    status: "completed",
    notes,
  }, parseInt(propertyId), newStatus);

  return res.status(201).json(txn);
});

router.patch("/transactions/:id", requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const updated = await storage.updateTransactionStatus(id, req.body.status);
  if (!updated) return res.status(404).json({ message: "İşlem bulunamadı" });
  return res.json(updated);
});

export default router;
