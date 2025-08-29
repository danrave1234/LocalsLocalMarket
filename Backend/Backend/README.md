

## Where are images stored, and what is saved in the Neon DB?
- Binary image files are saved on the server's local filesystem at the path configured by `llm.uploads.dir` (configurable via the `LLM_UPLOADS_DIR` environment variable). They are publicly served at `/uploads/**` by `StaticResourceConfig` with long-lived cache headers.
- The database (SQLite by default, or Neon Postgres when configured) stores only the string paths to those files:
  - `Shop.logoPath`
  - `Shop.coverPath`
  - `Product.imagePathsJson` (JSON string array of image paths)
- No image bytes/blobs are stored in the database. With Neon enabled, only the metadata (paths) resides in Neon; the actual files remain on disk.

### Deployment implications
- If you deploy to a cloud platform, ensure the uploads directory is on a persistent/attached volume, and set `LLM_UPLOADS_DIR` to that mount point. Otherwise, files may be ephemeral across restarts.
- Alternative: Use object storage (e.g., GCS/S3) + CDN. The current code writes to local disk; migrating to object storage would require a small change to the upload/serving logic.
- Backups: Database backups (e.g., Neon automatic backups) do not include uploaded files. Back up the uploads directory separately (or use object storage that handles durability).
- Caching/CDN: You can front `/uploads/**` with a CDN for global performance. UUID filenames returned by the upload API avoid cache collisions when files change.



## Where are images stored, and what is saved in the Neon DB?
- Binary image files are saved on the server's local filesystem at the path configured by `llm.uploads.dir` (configurable via the `LLM_UPLOADS_DIR` environment variable). They are publicly served at `/uploads/**` by `StaticResourceConfig` with long-lived cache headers.
- The database (SQLite by default, or Neon Postgres when configured) stores only the string paths to those files:
  - `Shop.logoPath`
  - `Shop.coverPath`
  - `Product.imagePathsJson` (JSON string array of image paths)
- No image bytes/blobs are stored in the database. With Neon enabled, only the metadata (paths) resides in Neon; the actual files remain on disk.

### Deployment implications
- If you deploy to a cloud platform, ensure the uploads directory is on a persistent/attached volume, and set `LLM_UPLOADS_DIR` to that mount point. Otherwise, files may be ephemeral across restarts.
- Alternative: Use object storage (e.g., GCS/S3) + CDN. The current code writes to local disk; migrating to object storage would require a small change to the upload/serving logic.
- Backups: Database backups (e.g., Neon automatic backups) do not include uploaded files. Back up the uploads directory separately (or use object storage that handles durability).
- Caching/CDN: You can front `/uploads/**` with a CDN for global performance. UUID filenames returned by the upload API avoid cache collisions when files change.
