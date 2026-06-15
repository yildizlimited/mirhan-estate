import { Router } from "express";
import { storage } from "../lib/storage";
import { hashPassword, verifyPassword, requireAuth, setAuthCookie, clearAuthCookie } from "../lib/auth";
import { loginSchema, registerSchema } from "@workspace/db";

const router = Router();

router.post("/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Geçersiz form verisi" });
  }
  const { name, email, password } = parsed.data;
  const existing = await storage.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ message: "Bu e-posta zaten kayıtlı" });
  }
  const user = await storage.createUser({ name, email, password: hashPassword(password), role: "user" });
  setAuthCookie(res, user.id, user.role);
  const { password: _p, ...safeUser } = user;
  return res.json(safeUser);
});

router.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "E-posta veya şifre hatalı" });
  }
  const { email, password } = parsed.data;
  const user = await storage.getUserByEmail(email);
  if (!user || !verifyPassword(password, user.password)) {
    return res.status(401).json({ message: "E-posta veya şifre hatalı" });
  }
  setAuthCookie(res, user.id, user.role);
  const { password: _p, ...safeUser } = user;
  return res.json(safeUser);
});

router.post("/auth/logout", (req, res) => {
  clearAuthCookie(res);
  return res.json({ ok: true });
});

router.get("/auth/me", requireAuth, async (req, res) => {
  const user = await storage.getUser(req.session.userId!);
  if (!user) {
    clearAuthCookie(res);
    return res.status(401).json({ message: "Oturum bulunamadı" });
  }
  const agent = await storage.getAgentByUserId(user.id);
  const { password: _p, ...safeUser } = user;
  return res.json({ ...safeUser, agent });
});

router.patch("/auth/me", requireAuth, async (req, res) => {
  const { name, phone, profileImage } = req.body;
  const updated = await storage.updateUser(req.session.userId!, { name, phone, profileImage });
  if (!updated) return res.status(404).json({ message: "Kullanıcı bulunamadı" });
  const { password: _p, ...safeUser } = updated;
  return res.json(safeUser);
});

export default router;
