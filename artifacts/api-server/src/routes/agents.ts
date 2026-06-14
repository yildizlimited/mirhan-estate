import { Router } from "express";
import { storage } from "../lib/storage";
import { requireAuth, requireRole } from "../lib/auth";

const router = Router();

router.get("/agents", async (_req, res) => {
  const agentList = await storage.getAllAgents();
  return res.json(agentList);
});

router.get("/agents/me", requireAuth, async (req, res) => {
  const agent = await storage.getAgentByUserId(req.session.userId!);
  if (!agent) return res.status(404).json({ message: "Ajan profili bulunamadı" });
  return res.json(agent);
});

router.get("/agents/:id", async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const agent = await storage.getAgent(id);
  if (!agent) return res.status(404).json({ message: "Ajan bulunamadı" });
  return res.json(agent);
});

router.post("/agents", requireRole("admin"), async (req, res) => {
  const agent = await storage.createAgent(req.body);
  return res.status(201).json(agent);
});

router.patch("/agents/:id", requireRole("agent", "admin"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const userRole = req.session.userRole;
  const myAgent = await storage.getAgentByUserId(req.session.userId!);
  if (userRole !== "admin" && myAgent?.id !== id) {
    return res.status(403).json({ message: "Yetkiniz yok" });
  }
  const updated = await storage.updateAgent(id, req.body);
  if (!updated) return res.status(404).json({ message: "Ajan bulunamadı" });
  return res.json(updated);
});

router.get("/agents/:id/properties", async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const props = await storage.getPropertiesByAgent(id);
  return res.json(props);
});

export default router;
