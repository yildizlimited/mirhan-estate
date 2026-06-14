import { Router } from "express";
import { storage } from "../lib/storage";
import { requireAuth } from "../lib/auth";

const router = Router();

router.get("/messages", requireAuth, async (req, res) => {
  const msgs = await storage.getMessages(req.session.userId!);
  return res.json(msgs);
});

router.get("/messages/unread-count", requireAuth, async (req, res) => {
  const count = await storage.getUnreadCount(req.session.userId!);
  return res.json({ count });
});

router.post("/messages", requireAuth, async (req, res) => {
  const { receiverId, propertyId, message } = req.body;
  if (!receiverId || !message) return res.status(400).json({ message: "Alıcı ve mesaj zorunlu" });
  const created = await storage.sendMessage({
    senderId: req.session.userId!,
    receiverId: parseInt(receiverId),
    propertyId: propertyId ? parseInt(propertyId) : undefined,
    message,
  });
  return res.status(201).json(created);
});

router.patch("/messages/:id/read", requireAuth, async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  await storage.markMessageRead(id);
  return res.json({ ok: true });
});

export default router;
