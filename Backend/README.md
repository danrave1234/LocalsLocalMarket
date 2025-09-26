# LocalsLocalMarket — Backend (Spring Boot)

**Developer:** Danrave Keh  
**Email:** danrave.keh@localslocalmarket.com

This backend implements most of the MVP described in the project blueprint (project.md) for a Local Marketplace.

## What’s implemented
- Data model (JPA)
  - User(id, email, passwordHash, role, name, createdAt)
  - Shop(id, owner, name, description, category, addressLine, lat, lng, logoPath, coverPath, phone, website, email, social links, createdAt)
  - Product(id, shop, title, description, price, imagePathsJson, category, isActive, createdAt)
- REST API under `/api`
  - Auth: see `AuthController` (login/register and profile endpoints)
  - Shops: `ShopController`
    - POST `/api/shops`
    - GET `/api/shops/{slugOrId}`
    - GET `/api/shops` with `q`, `category`, paging
    - PATCH `/api/shops/{slugOrId}` (owner/admin)
    - DELETE `/api/shops/{slugOrId}` (owner/admin)
    - GET `/api/shops/my-shops` (current seller)
    - GET `/api/shops/categories` (static list)
  - Products: `ProductController` (CRUD with filters)
  - Uploads: `UploadController` — POST `/api/uploads/image` (validates type, size) and serves via static handler
- Security & Validation
  - JWT-based security with `JwtAuthFilter` and `SecurityConfig`
  - Simple rate limiting filter `RateLimitFilter` (per-IP) applied to sensitive endpoints
  - Basic validations applied via DTOs and controller checks
- Static uploads
  - Files saved to disk directory configured by `llm.uploads.dir`
  - Served under `/uploads/**` via `StaticResourceConfig`

## How to run
1. Configure `application.properties` (or environment) with DB and uploads path. Example:
   ```
   spring.datasource.url=jdbc:h2:mem:testdb
   spring.jpa.hibernate.ddl-auto=update
   llm.uploads.dir=./uploads
   ```
2. Build & run:
   - Windows: `mvnw.cmd spring-boot:run`
   - Unix: `./mvnw spring-boot:run`

## Alignment with project.md (Lite MVP)
- Auth: sellers login; buyers can browse public endpoints ✓
- Shops: create, get, list, update, delete ✓
- Products: create, get/list with filters, update, delete ✓
- Uploads: disk image upload with validation + static serving ✓
- Search: basic keyword/category filters; extendable ✓
- Excluded features (chat, websocket, etc.): not included ✓

## Next steps suggested
- Add barangay/city fields to Shop and filtering to match the blueprint
- Add explicit price range and city/barangay filters in Product list endpoint
- Add DTO validation annotations (@NotBlank, @NotNull, etc.) where missing
- Add unit/integration tests for controllers and security flows
- Consider SQLite/Postgres configuration for production

See source:
- `org.localslocalmarket.model.*`
- `org.localslocalmarket.web.*`
- `org.localslocalmarket.security.*`
- `org.localslocalmarket.config.StaticResourceConfig`


## Performance of static image uploads
- 500 images stored under `llm.uploads.dir` will not by itself slow down the backend. Files are served directly by Spring’s static resource handler from disk.
- To improve client/perceived performance and reduce repeated bandwidth, the server now sets long-lived cache headers for `/uploads/**` (1 year). Browsers/CDNs will cache these images.
- If you replace an image but keep the same filename, caching may cause clients to see the old image. Our upload strategy uses unique UUID filenames to avoid cache collisions.
- Make sure any list endpoints that reference many images are paginated on the API side and lazy-loaded on the frontend to avoid rendering too many images at once.
- For production, consider putting `/uploads` behind a CDN for global caching and throughput.


## Scaling example: 50 sellers × 50 images (~2,500 files)
- This volume is well within what the current setup handles comfortably. Files are static on disk and served via Spring’s resource handler with 1‑year cache headers.
- Server impact: Minimal for repeat visitors due to browser/CDN caching. Initial requests are standard file reads; no directory scans are performed by the app.
- API impact: Shop and Product endpoints are paginated, so responses won’t include excessive items at once. Keep reasonable page sizes (e.g., 12–24 items) on the frontend.
- Frontend tips: Lazy‑load images (infinite scroll or intersection observer), use responsive <img> sizes, and prefer thumbnails for grid views to reduce bytes.
- Storage footprint: At the 2MB upload cap, worst‑case 2,500 images ≈ 5GB. In practice, web‑optimized images are much smaller; consider using WebP and resizing before upload.
- Optional: Put /uploads behind a CDN in production for global caching and higher throughput.

## Image compression/conversion on upload
- The server now converts uploaded images to a space‑efficient format by default (WebP) without visible quality loss.
- Defaults (configurable via env):
  - LLM_UPLOADS_IMAGE_FORMAT=webp
  - LLM_UPLOADS_IMAGE_QUALITY=0.95  (0..1; used for lossy encoders, tuned for visually lossless output)
  - LLM_UPLOADS_WEBP_LOSSLESS=false (set true to use WebP lossless when supported)
- Supported input types: jpg, jpeg, png, webp (max 2MB per file). Output will be normalized to the configured format with a new UUID filename.
- If the configured encoder isn’t available at runtime, the server falls back to PNG or copying the original bytes.


## Deploying the database (SQLite vs Postgres/Neon)
SQLite (default: llm.db) is great for local dev and small single‑instance deployments. For cloud (GCP, Fly.io, Render, Railway, etc.), prefer a managed Postgres (e.g., Neon, Cloud SQL, Supabase, Railway) if you expect:
- Multiple app instances or autoscaling
- Concurrent writes and higher traffic
- Automated backups/HA and easier observability

This project already supports both via environment variables (see application.properties). Defaults are SQLite; override to Postgres without code changes.

### Use Postgres/Neon
Set these environment variables in your deployment (replace <>):
- LLM_DB_URL=jdbc:postgresql://<host>:<port>/<db>?sslmode=require
- LLM_DB_DRIVER=org.postgresql.Driver
- LLM_DB_DIALECT=org.hibernate.dialect.PostgreSQLDialect
- LLM_DB_USER=<username>
- LLM_DB_PASS=<password>
- LLM_JPA_DDL=update  # or validate in prod once schema is stable

Example (Neon):
- LLM_DB_URL=jdbc:postgresql://ep-xxx.neon.tech:5432/neondb?sslmode=require
- LLM_DB_DRIVER=org.postgresql.Driver
- LLM_DB_DIALECT=org.hibernate.dialect.PostgreSQLDialect
- LLM_DB_USER=neondb_owner
- LLM_DB_PASS=supersecret

No code change required; Spring picks up the env vars at startup.

### Keep SQLite (llm.db) when
- Single VM/small instance, low write concurrency
- You’re OK with file‑based backup/restore and no horizontal scaling
- Simpler ops and lowest cost

### Migrating data from SQLite → Postgres (one‑time)
1) Stop the app (to freeze writes).
2) Export SQLite tables to SQL or CSV. Example using sqlite3 CLI:
   - sqlite3 llm.db ".mode sqlite" ".output dump.sql" ".dump" ".quit"
   Or export per table to CSV and import with Postgres COPY.
3) Create a fresh Postgres database and user.
4) Apply DDL: Let Hibernate create schema by temporarily using LLM_JPA_DDL=update on first run, or run your DDL migration manually.
5) Load data:
   - If using SQL dump: transform incompatible SQLite syntax or use a tool (pgloader) to migrate automatically.
   - If using CSV: COPY into corresponding tables.
6) Start the app pointing to Postgres (env vars above) and verify.

Tip: For production, lock LLM_JPA_DDL=validate and manage schema with migrations (Flyway/Liquibase) once stable.

### GCP/Cloud notes
- Cloud Run/App Engine: set the env vars; consider VPC connector/Cloud SQL Proxy if using Cloud SQL. For Neon, direct SSL connection works with sslmode=require.
- Backups & HA: Managed Postgres handles this; SQLite would need VM disk snapshots.
- Images: keep using llm.uploads.dir on attached disk or switch to object storage (GCS/S3) + CDN for durability and global performance.

## Response caching (server-side)
This backend now caches JSON responses for popular read endpoints to reduce DB load and speed up page loads. Caching is safe-by-default and auto‑invalidates on writes.

What is cached:
- GET /api/shops?… (paged list; cache key includes q, category, page, size)
- GET /api/shops/{slugOrId}
- GET /api/shops/categories
- GET /api/products?… (paged list; cache key includes q, category, minPrice, maxPrice, shopId, page, size)
- GET /api/products/{id}

When cache is cleared (auto):
- Shops: POST/PATCH/DELETE → clears shops_by_id and shops_list
- Products: POST (create), PATCH (edit), DELETE, POST /{id}/decrement-stock → clears products_by_id (for that id) and all products_list entries

Tuning via environment:
- LLM_CACHE_ENABLED=true|false (default: true)
- LLM_CACHE_TTL_SECONDS=600 (default: 10 minutes)
- LLM_CACHE_MAX_SIZE=1000 (entries per cache)

Notes:
- Authenticated, user-specific endpoints (e.g., /api/shops/my-shops) are not cached to avoid leaking private data.
- Static uploads under /uploads/** already use long-lived HTTP caching.

## Orders: require login or allow guests
You can control whether customers must be logged in to place an order (POST /api/orders) via application properties or environment variables.

Property (application.properties):

```
# If true, only authenticated users can place orders; if false, guests can also order
app.orders.require-auth=false
```

Environment variable equivalent:
- APP_ORDERS_REQUIRE_AUTH=false|true

Behavior:
- When set to true: the /api/orders endpoint requires a valid JWT. Unauthenticated requests get 401 Unauthorized with message "Authentication required to place orders".
- When false (default): the endpoint accepts guest orders.

This is enforced both at the Spring Security layer (request matcher) and within OrderController for defense-in-depth.

## Email configuration and avoiding SMTP 553 relaying errors
Many SMTP providers only allow sending from verified email addresses/domains. If you see an error like:

```
SMTPSendFailedException: 553 Relaying disallowed as noreply@localslocalmarket.com
```

it means the configured From address isn't allowed by your SMTP.

Configure these properties to use an authorized address and set proper Reply-To:

```
# Global From address (recommended: a verified address on your SMTP provider)
app.mail.from=notifications@your-verified-domain.com

# Automatically set Reply-To to the customer's email on order notifications
app.mail.reply-to-customer=true

# (Optional) Where feedback emails should be sent; defaults to app.mail.from if blank
app.feedback.to=support@your-verified-domain.com
```

If `app.mail.from` is not set, the application will fall back to `spring.mail.username` as the From address, which is usually permitted by your SMTP provider. As a last resort (development), it falls back to `no-reply@localhost`.

Typical Spring Mail settings (example for Gmail SMTP or a transactional provider):

```
spring.mail.host=smtp.sendgrid.net
spring.mail.port=587
spring.mail.username=apikey-or-verified@your-domain.com
spring.mail.password=YOUR_SMTP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

With this setup, order emails will:
- Use a permitted From address (app.mail.from or spring.mail.username)
- Set Reply-To to the buyer's email so shop owners can reply directly

Note: do not attempt to set the From to the buyer's email; most SMTP servers will reject it (spoofing) and cause 553/550 errors.


## Deploying to Google Cloud

### Option A: Cloud Run (Container)
Prereqs: gcloud CLI, a GCP project, Artifact/Container Registry enabled.

1) Build & push image via Cloud Build:
   - gcloud builds submit --tag gcr.io/PROJECT_ID/llm-backend:latest .

2) Deploy to Cloud Run with Neon PostgreSQL:
   - First, set the database environment variables in Google Cloud Console or via gcloud:
     ```
     gcloud run services update llm-backend \
       --region REGION \
       --set-env-vars "LLM_DB_URL=jdbc:postgresql://ep-xxx.neon.tech:5432/neondb?sslmode=require,LLM_DB_DRIVER=org.postgresql.Driver,LLM_DB_USER=neondb_owner,LLM_DB_PASS=your_password,LLM_JWT_SECRET=your-secure-32-byte-secret"
     ```
   
   - Then deploy:
     ```
     gcloud run deploy llm-backend \
       --image gcr.io/PROJECT_ID/llm-backend:latest \
       --region REGION \
       --platform managed \
       --allow-unauthenticated \
       --memory 512Mi \
       --set-env-vars "LLM_UPLOADS_DIR=/tmp/uploads,LLM_JPA_DDL=update"
     ```

Notes:
- Cloud Run container filesystem is mostly read-only; only /tmp is writable. Use LLM_UPLOADS_DIR=/tmp/uploads or switch to GCS/S3 for durable storage.
- Health check endpoint: GET /api/health
- The app binds to $PORT automatically (server.port=${PORT:8080}).

### Option B: App Engine Standard (Java 21)
1) Review app.yaml (provided). It sets runtime: java21 and LLM_UPLOADS_DIR=/tmp/uploads.
2) Deploy:
   - gcloud app deploy --project PROJECT_ID --quiet
3) (Optional) Set DB env vars in app.yaml for Postgres (Neon/Cloud SQL/etc.).

### Option C: App Engine Flexible (alternative)
Use Dockerfile with app.yaml (env: flex) if you prefer Flex; Cloud Run is recommended for simplicity and cost.
