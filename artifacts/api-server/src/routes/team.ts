import { Router } from "express";
import { storage } from "../lib/storage";
import { requireRole } from "../lib/auth";

const router = Router();

router.get("/team", async (_req, res) => {
  const members = await storage.getTeamMembers(true);
  return res.json(members);
});

router.get("/team/all", requireRole("admin"), async (_req, res) => {
  const members = await storage.getTeamMembers(false);
  return res.json(members);
});

router.post("/team", requireRole("admin"), async (req, res) => {
  const member = await storage.createTeamMember(req.body);
  return res.status(201).json(member);
});

router.patch("/team/:id", requireRole("admin"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const updated = await storage.updateTeamMember(id, req.body);
  if (!updated) return res.status(404).json({ message: "Üye bulunamadı" });
  return res.json(updated);
});

router.delete("/team/:id", requireRole("admin"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  await storage.deleteTeamMember(id);
  return res.json({ ok: true });
});

export default router;
