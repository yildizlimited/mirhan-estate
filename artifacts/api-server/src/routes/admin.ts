import { Router } from "express";
import { storage } from "../lib/storage";
import { requireRole } from "../lib/auth";
import { hashPassword } from "../lib/auth";

const router = Router();

router.get("/admin/users", requireRole("admin"), async (_req, res) => {
  const allUsers = await storage.getAllUsers();
  const safe = allUsers.map(({ password: _p, ...u }) => u);
  return res.json(safe);
});

router.patch("/admin/users/:id", requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const { name, email, role, phone } = req.body;
  const updated = await storage.updateUser(id, { name, email, role, phone });
  if (!updated) return res.status(404).json({ message: "Kullanıcı bulunamadı" });
  const { password: _p, ...safe } = updated;
  return res.json(safe);
});

router.delete("/admin/users/:id", requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  await storage.deleteUser(id);
  return res.json({ ok: true });
});

router.patch("/admin/properties/:id/approve", requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const updated = await storage.updateProperty(id, { approved: true });
  if (!updated) return res.status(404).json({ message: "İlan bulunamadı" });
  return res.json(updated);
});

router.patch("/admin/properties/:id/reject", requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const updated = await storage.updateProperty(id, { approved: false });
  if (!updated) return res.status(404).json({ message: "İlan bulunamadı" });
  return res.json(updated);
});

router.get("/admin/stats", requireRole("admin"), async (_req, res) => {
  const allUsers = await storage.getAllUsers();
  const allProperties = await storage.getProperties({});
  const transactions = await storage.getAllTransactions();
  const agents = await storage.getAllAgents();

  const approved = allProperties.filter(p => p.approved).length;
  const pending = allProperties.filter(p => !p.approved).length;
  const totalRevenue = transactions.reduce((sum, t) => sum + t.commissionAmount, 0);

  return res.json({
    users: allUsers.length,
    properties: allProperties.length,
    approvedProperties: approved,
    pendingProperties: pending,
    agents: agents.length,
    transactions: transactions.length,
    totalRevenue,
  });
});

export default router;
