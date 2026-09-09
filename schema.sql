-- Cloudflare D1 Database Schema for Run Hi Tech Solar

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  picture TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at INTEGER NOT NULL,
  last_login INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  category TEXT NOT NULL,
  location TEXT,
  bill_or_load TEXT,
  roof_or_land_type TEXT,
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at INTEGER NOT NULL
);

-- Seed initial super admin
INSERT OR REPLACE INTO users (id, email, name, role, created_at, last_login)
VALUES ('admin_kavin', 'apkavin483@gmail.com', 'Kavin (Super Admin)', 'admin', 1788357000000, 1788357000000);
