# Mirhan Gayrimenkul — GitHub & Vercel Deployment Rehberi

Bu proje iki ayrı servisten oluşmaktadır:
- **Frontend** (`artifacts/mirhan-estate`) → **Vercel** (statik React/Vite)
- **Backend** (`artifacts/api-server`) → **Railway** (Express + PostgreSQL)

---

## 1. Adım — GitHub'a Yükle

### A) GitHub'da yeni repo oluştur
1. github.com → "New repository" → Repo adı: `mirhan-estate`
2. Private seçin → Create

### B) Replit'ten GitHub'a push et
Replit'te **Git** sekmesini aç → "Connect to GitHub" → repo'yu bağla.

Veya terminal ile:
```bash
git remote add origin https://github.com/KULLANICI_ADI/mirhan-estate.git
git push -u origin main
```

---

## 2. Adım — Backend'i Railway'e Deploy Et

1. **railway.app** → "New Project" → "Deploy from GitHub repo" → `mirhan-estate`
2. **Root Directory**: `artifacts/api-server`
3. **Environment Variables** ekle:

| Değişken | Değer |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `8080` |
| `DATABASE_URL` | Railway PostgreSQL bağlantı stringi |
| `SESSION_SECRET` | Rastgele uzun bir string |
| `CORS_ORIGIN` | Vercel domain'in (adım 3'ten sonra) |

4. Railway Dashboard → "Add PostgreSQL" → Otomatik `DATABASE_URL` oluşur
5. Deploy olduktan sonra URL'yi kopyala: `https://mirhan-estate-xxx.railway.app`

---

## 3. Adım — Frontend'i Vercel'e Deploy Et

1. **vercel.com** → "New Project" → GitHub repo'yu import et
2. **Root Directory**: `artifacts/mirhan-estate`
3. **Build Command**: `pnpm run build:vercel`
4. **Output Directory**: `dist`
5. **Install Command**: `pnpm install --frozen-lockfile=false`

### vercel.json'u Güncelle
`artifacts/mirhan-estate/vercel.json` dosyasında backend URL'yi gir:
```json
"destination": "https://mirhan-estate-xxx.railway.app/api/:path*"
```
(Railway'den aldığın URL ile değiştir)

6. Vercel'de deploy → Canlı link alırsın: `https://mirhan-estate.vercel.app`

---

## 4. Adım — CORS Ayarı

Railway'de `CORS_ORIGIN` değişkenini Vercel URL'in ile güncelle:
```
CORS_ORIGIN=https://mirhan-estate.vercel.app
```

---

## 5. Adım — Özel Domain (mirhanestate.com)

Vercel Dashboard → "Settings" → "Domains" → `mirhanestate.com` ekle.
Domain sağlayıcında (GoDaddy, Namecheap vb.) DNS kaydını güncelle:
- **CNAME**: `www` → `cname.vercel-dns.com`
- **A**: `@` → `76.76.21.21`

---

## Veritabanı Seed

İlk kurulumda Railway terminal veya local'den:
```bash
DATABASE_URL="railway-db-url" pnpm --filter @workspace/db run push
DATABASE_URL="railway-db-url" pnpm --filter @workspace/api-server run seed
```

Admin giriş: `admin@mirhanestate.com` / `admin123`

---

## Ortam Değişkenleri Özeti

### Backend (Railway)
| Değişken | Zorunlu | Açıklama |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL bağlantı URL'i |
| `SESSION_SECRET` | ✅ | Oturum şifreleme anahtarı |
| `PORT` | ✅ | `8080` |
| `NODE_ENV` | ✅ | `production` |
| `CORS_ORIGIN` | ✅ | Vercel frontend URL'i |

### Frontend (Vercel)
Ek env var gerekmez — API istekleri `vercel.json` rewrites ile backend'e iletilir.
