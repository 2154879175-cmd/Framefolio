declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    TMDB_READ_TOKEN?: string;
    OWNER_EMAIL?: string;
  }
}
