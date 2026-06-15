import { Router } from "express";
import { storage } from "../lib/storage";
import { requireRole, hashPassword } from "../lib/auth";

const router = Router();

// ── Stats ─────────────────────────────────────────────────────────────────────
router.get("/admin/stats", requireRole("admin"), async (_req, res) => {
  const allUsers = await storage.getAllUsers();
  const allProperties = await storage.getProperties({});
  const transactions = await storage.getAllTransactions();
  const agents = await storage.getAllAgents();
  const teamMembers = await storage.getTeamMembers(false);

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
    teamMembers: teamMembers.length,
    totalRevenue,
  });
});

// ── Users ─────────────────────────────────────────────────────────────────────
router.get("/admin/users", requireRole("admin"), async (_req, res) => {
  const allUsers = await storage.getAllUsers();
  const safe = allUsers.map(({ password: _p, ...u }) => u);
  return res.json(safe);
});

router.post("/admin/users", requireRole("admin"), async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Ad, e-posta ve şifre zorunlu" });
  const hashed = await hashPassword(password);
  const user = await storage.createUser({ name, email, password: hashed, role: role || "user", phone });
  const { password: _p, ...safe } = user;
  return res.status(201).json(safe);
});

router.put("/admin/users/:id", requireRole("admin"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const { name, email, role, phone } = req.body;
  const updated = await storage.updateUser(id, { name, email, role, phone });
  if (!updated) return res.status(404).json({ message: "Kullanıcı bulunamadı" });
  const { password: _p, ...safe } = updated;
  return res.json(safe);
});

router.patch("/admin/users/:id", requireRole("admin"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const { name, email, role, phone } = req.body;
  const updated = await storage.updateUser(id, { name, email, role, phone });
  if (!updated) return res.status(404).json({ message: "Kullanıcı bulunamadı" });
  const { password: _p, ...safe } = updated;
  return res.json(safe);
});

router.delete("/admin/users/:id", requireRole("admin"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  await storage.deleteUser(id);
  return res.json({ ok: true });
});

// ── Properties ────────────────────────────────────────────────────────────────
router.get("/admin/properties", requireRole("admin"), async (_req, res) => {
  const props = await storage.getProperties({});
  return res.json(props);
});

router.put("/admin/properties/:id", requireRole("admin"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const { approved, featured, status } = req.body;
  const data: Record<string, unknown> = {};
  if (approved !== undefined) data.approved = approved;
  if (featured !== undefined) data.featured = featured;
  if (status !== undefined) data.status = status;
  const updated = await storage.updateProperty(id, data as Parameters<typeof storage.updateProperty>[1]);
  if (!updated) return res.status(404).json({ message: "İlan bulunamadı" });
  return res.json(updated);
});

router.patch("/admin/properties/:id/approve", requireRole("admin"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const updated = await storage.updateProperty(id, { approved: true });
  if (!updated) return res.status(404).json({ message: "İlan bulunamadı" });
  return res.json(updated);
});

router.patch("/admin/properties/:id/reject", requireRole("admin"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const updated = await storage.updateProperty(id, { approved: false });
  if (!updated) return res.status(404).json({ message: "İlan bulunamadı" });
  return res.json(updated);
});

router.delete("/admin/properties/:id", requireRole("admin"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  await storage.deleteProperty(id);
  return res.json({ ok: true });
});

// ── Blog ──────────────────────────────────────────────────────────────────────
router.get("/admin/blog", requireRole("admin"), async (_req, res) => {
  const posts = await storage.getBlogPosts();
  return res.json(posts);
});

router.post("/admin/blog", requireRole("admin"), async (req, res) => {
  const { title, content, slug, featuredImage, seoTitle, seoDescription, published } = req.body;
  if (!title || !content || !slug) return res.status(400).json({ message: "Başlık, içerik ve slug zorunlu" });
  const post = await storage.createBlogPost({
    title, content, slug, featuredImage, seoTitle, seoDescription,
    published: !!published,
    authorId: req.session.userId!,
  });
  return res.status(201).json(post);
});

router.put("/admin/blog/:id", requireRole("admin"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const updated = await storage.updateBlogPost(id, req.body);
  if (!updated) return res.status(404).json({ message: "Yazı bulunamadı" });
  return res.json(updated);
});

router.delete("/admin/blog/:id", requireRole("admin"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  await storage.deleteBlogPost(id);
  return res.json({ ok: true });
});

router.post("/admin/blog/auto-generate", requireRole("admin"), async (req, res) => {
  const topics = [
    {
      title: "İstanbul'da Ev Almanın 10 Altın Kuralı",
      slug: "istanbul-ev-alma-altin-kurallar",
      content: `İstanbul'da gayrimenkul yatırımı yapmak, doğru adımlar atıldığında oldukça karlı bir karar olabilir.\n\n**1. Bölge Seçimi**\nBeşiktaş, Sarıyer, Kadıköy gibi merkezi ilçeler her zaman değer kazanma potansiyeli taşır.\n\n**2. Ulaşım Altyapısı**\nMetro, metrobüs ve köprü bağlantıları mülk değerini doğrudan etkiler. Yeni metro hatlarının geçtiği güzergahlardaki bölgeler yatırım için idealdir.\n\n**3. Tapu Durumu**\nSatın alma öncesinde tapu sorgulama işlemlerini mutlaka gerçekleştirin. İmar durumu, haciz ve ipotek gibi bilgileri kontrol edin.\n\n**4. Bina Güvenliği**\nDeprem yönetmeliğine uygunluğu, binanın yaşı ve yapı kalitesi en önemli kriterler arasındadır.\n\n**5. Uzman Desteği**\nMirhan Gayrimenkul danışmanları, İstanbul'daki tüm ilçelerde kapsamlı hizmet sunmaktadır.`,
      seoTitle: "İstanbul'da Ev Almanın 10 Altın Kuralı - Mirhan Gayrimenkul",
      seoDescription: "İstanbul'da ev veya daire satın alırken dikkat etmeniz gereken önemli kurallar. Mirhan Gayrimenkul uzmanlarından profesyonel rehber.",
    },
    {
      title: "İstanbul'un En Değerli İlçeleri: 2025 Yatırım Rehberi",
      slug: "istanbul-en-degerli-ilceler-yatirim-rehberi-2025",
      content: `İstanbul, her yıl milyonlarca kişiye ev sahipliği yapan ve gayrimenkul yatırımcıları için cazip fırsatlar sunan bir metropoldür.\n\n**Beşiktaş**\nBoğaz manzarası, lüks rezidanslar ve merkezi konumuyla İstanbul'un en değerli ilçelerinden biridir.\n\n**Sarıyer**\nBelgrad Ormanı'na yakınlığı ve Boğaz manzaralı villalarıyla son yıllarda büyük ilgi görmektedir.\n\n**Kadıköy**\nAnadolu yakasının kültür merkezi, sanatçılar ve genç profesyoneller arasında popülerdir.\n\n**Çekmeköy ve Ümraniye**\nAltyapı yatırımları ve uygun fiyatlarıyla orta vadeli yatırımcılar için ideal seçenekler sunmaktadır.`,
      seoTitle: "İstanbul'un En Değerli İlçeleri 2025 - Mirhan Gayrimenkul",
      seoDescription: "2025 yılında İstanbul'da gayrimenkul yatırımı için en değerli ilçeler. Beşiktaş, Sarıyer, Kadıköy ve daha fazlası.",
    },
    {
      title: "İstanbul'da Yabancılara Mülk Satışı: Bilmeniz Gerekenler",
      slug: "istanbul-yabancilara-mulk-satisi-rehber",
      content: `İstanbul, yabancı yatırımcılar için gayrimenkul satın alma sürecinde önemli kolaylıklar sunmaktadır.\n\n**Kimler Türkiye'den Mülk Alabilir?**\nPek çok ülke vatandaşı Türkiye'de gayrimenkul satın alabilmektedir.\n\n**Türk Vatandaşlığı İçin Yatırım Şartı**\nEn az 400.000 USD değerinde mülk satın alan ve bu mülkü 3 yıl boyunca satmayan yabancı yatırımcılar Türk vatandaşlığına başvurabilmektedir.\n\n**Mirhan Gayrimenkul'ün Desteği**\nRusça, Arapça ve İngilizce konuşan danışmanlarımızla yabancı yatırımcılara eksiksiz hizmet sunuyoruz.`,
      seoTitle: "İstanbul'da Yabancılara Mülk Satışı - Mirhan Gayrimenkul",
      seoDescription: "Yabancı yatırımcılar için İstanbul'da gayrimenkul satın alma rehberi. Türk vatandaşlığı ve Mirhan Gayrimenkul desteği.",
    },
  ];

  let created = 0;
  for (const topic of topics) {
    try {
      const existing = await storage.getBlogPostBySlug(topic.slug);
      if (!existing) {
        await storage.createBlogPost({
          ...topic,
          published: true,
          authorId: req.session.userId!,
        });
        created++;
      }
    } catch (_e) {
      // slug çakışması varsa atla
    }
  }

  return res.json({ created, message: `${created} İstanbul odaklı blog yazısı oluşturuldu` });
});

// ── Team ──────────────────────────────────────────────────────────────────────
router.get("/admin/team", requireRole("admin"), async (_req, res) => {
  const members = await storage.getTeamMembers(false);
  return res.json(members);
});

router.post("/admin/team", requireRole("admin"), async (req, res) => {
  const member = await storage.createTeamMember(req.body);
  return res.status(201).json(member);
});

router.put("/admin/team/:id", requireRole("admin"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const updated = await storage.updateTeamMember(id, req.body);
  if (!updated) return res.status(404).json({ message: "Üye bulunamadı" });
  return res.json(updated);
});

router.delete("/admin/team/:id", requireRole("admin"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  await storage.deleteTeamMember(id);
  return res.json({ ok: true });
});

// ── Transactions (Komisyonlar) ─────────────────────────────────────────────────
router.get("/admin/transactions", requireRole("admin"), async (_req, res) => {
  const txns = await storage.getAllTransactions();
  return res.json(txns);
});

router.put("/admin/transactions/:id", requireRole("admin"), async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz ID" });
  const { status } = req.body;
  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Geçersiz durum" });
  }
  const updated = await storage.updateTransactionStatus(id, status);
  if (!updated) return res.status(404).json({ message: "İşlem bulunamadı" });
  return res.json(updated);
});

export default router;
