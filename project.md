Local Marketplace MVP — React + Spring Boot

**Developer:** Danrave Keh  
**Email:** danrave.keh@localslocalmarket.com

A lightweight local marketplace where sellers manage shops (with logos, addresses, schedules, products) and buyers browse & chat. Payments happen off‑platform (links, COD, in‑store). This doc gives you a production‑ready blueprint + starter code you can paste into a monorepo.

1) Feature scope (Lite)

Sellers: create a Shop (name, logo, cover, address, barangay, city, map pin lat/lng, optional phone/link)

Products: create simple listings (title, price, description, up to 4 images)

Browse/search: keyword, category, price range, barangay/city

Shop page: logo, address (with barangay), map pin, list of products

Auth: email/password with roles (SELLER/ADMIN); buyers browse without login

Moderation: admin can hide/delete shops/products

Excluded in Lite: realtime chat, WebSocket, tags, stock, reporting system, complex schedules. Keep it fast & tiny.

2) Architecture (Lite)

Frontend: React (Vite) + React Router, fetch/axios only (no state libs). Leaflet only on shop create/edit.

Backend: Spring Boot (Web, Security, Data JPA, Validation). No WebSocket.

DB: PostgreSQL (or SQLite via JDBC for the smallest single-node deploy).

Images: store on local disk under /uploads and serve via Spring static handler (switch to S3/R2 later if needed).

Containers: optional; can run jar + systemd.

React SPA ──HTTP──▶ Spring Boot REST ─▶ Postgres/SQLite
└──────────▶ /uploads (disk)
3) Data model (JPA entities)

User(id, email, passwordHash, role)

Shop(id, ownerUserId, name, barangay, city, addressLine, lat, lng, logoPath, coverPath, phone, website, createdAt)

Product(id, shopId, title, description, price, imagePathsJson, category, isActive, createdAt)

Index: LOWER(product.title), price, category, city, barangay.

Image paths stored as relative disk paths in imagePathsJson (array of strings).

4) REST API (Lite)

Base /api

Auth

POST /auth/register (seller)

POST /auth/login

Shops

POST /shops (seller)

GET /shops/{id} (public)

GET /shops (public) — q, barangay, city

PATCH /shops/{id} (owner/admin)

Products

POST /products (seller)

GET /products (public) — q, category, minPrice, maxPrice, barangay, city, shopId

GET /products/{id}

PATCH /products/{id} (owner/admin)

DELETE /products/{id} (owner/admin)

Uploads (disk)

POST /uploads/image (multipart) → {path}

Static serve /uploads/**

5) Security & validation

Spring Security (JWT or session). Buyers browse without auth; sellers must login.

Validate: shop name not blank; barangay + city required; lat/lng present; product title/price required; images ≤ 2MB each, jpeg|png|webp, max 4 per product.

Simple rate limit (per‑IP) on uploads and create endpoints (filter/interceptor).

6) Frontend (Lite)

Routing: / (browse), /shops/:id (shop page), /dashboard (seller)

Map pin: Leaflet only in shop create/edit page; saves lat/lng.

Image upload: <input type="file" multiple> → POST /uploads/image → save returned path.

State: keep it simple with useState/useEffect.

Everything else (Docker, entities, React snippets, WebSocket, uploads) remains same, extended with shop profile fields.

7) Next steps

Add shop reviews and ratings later

Add shop schedules (e.g., closed on Sunday)

Advanced search filter: filter by shop rating, open/closed now

Deliverables checklist (Lite)

✅ Minimal data model (User/Shop/Product)

✅ REST endpoints (no chat)

✅ Disk image uploads + static serving

✅ Simple React pages (browse, shop, dashboard)

✅ Basic auth (seller login)

7) Deployment (super light)

Single VPS (1GB RAM) or even a small local server.

Use SQLite for a truly tiny single‑instance setup; Postgres if you expect more traffic.

Serve SPA via Spring or Nginx; reverse proxy to /api.

Back up /uploads/ and DB file nightly.