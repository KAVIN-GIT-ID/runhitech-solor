// Database Service for Run Hi Tech Solar
// Implements Cloudflare D1 Backend with persistent IndexedDB offline fallback

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: "admin" | "super_admin" | "sales_engineer" | "auditor" | string;
  createdAt: number;
  lastLogin: number;
}

export interface LeadSubmission {
  id: string;
  name: string;
  phone: string;
  email?: string;
  category: "residential" | "commercial" | "industrial" | "survey";
  location?: string;
  billOrLoad?: string;
  roofOrLandType?: string;
  source: "home_hero_survey" | "quote_form" | "category_calculator" | "contact_page";
  status: "new" | "contacted" | "site_survey_fixed" | "subsidy_applied" | "installed" | "cancelled";
  notes?: string;
  createdAt: number;
}

const DB_NAME = "runhitech_solar_db";
const DB_VERSION = 1;

/**
 * Initialize IndexedDB with schema for Users and Form Submissions
 */
export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;

      // Table 1: Admins / Users table
      if (!db.objectStoreNames.contains("admins")) {
        const adminStore = db.createObjectStore("admins", { keyPath: "email" });
        adminStore.createIndex("role", "role", { unique: false });
        adminStore.createIndex("lastLogin", "lastLogin", { unique: false });
      }

      // Table 2: Leads & Form Submissions table
      if (!db.objectStoreNames.contains("leads")) {
        const leadStore = db.createObjectStore("leads", { keyPath: "id" });
        leadStore.createIndex("category", "category", { unique: false });
        leadStore.createIndex("status", "status", { unique: false });
        leadStore.createIndex("createdAt", "createdAt", { unique: false });
        leadStore.createIndex("phone", "phone", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ─────────────────────────────────────────────────────────────
// LEADS / FORM SUBMISSIONS CLOUDFLARE D1 + LOCAL SYNC METHODS
// ─────────────────────────────────────────────────────────────

export async function insertLead(lead: Omit<LeadSubmission, "id" | "createdAt" | "status">): Promise<LeadSubmission> {
  const fullLead: LeadSubmission = {
    ...lead,
    id: "lead_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    status: "new",
    createdAt: Date.now()
  };

  // 1. Sync to Cloudflare D1 Backend
  try {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullLead)
    });
  } catch (err) {
    console.debug("Cloudflare D1 insert lead note:", err);
  }

  // 2. Save to local IndexedDB
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("leads", "readwrite");
      const store = tx.objectStore("leads");
      const req = store.put(fullLead);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.debug("IndexedDB local insert note:", e);
  }

  window.dispatchEvent(new Event("runhitech_db_lead_updated"));
  return fullLead;
}

export async function getAllLeads(): Promise<LeadSubmission[]> {
  // 1. First attempt to fetch from Cloudflare D1 Serverless API
  try {
    const res = await fetch("/api/leads");
    if (res.ok) {
      const d1Leads = await res.json() as any[];
      if (Array.isArray(d1Leads) && d1Leads.length > 0) {
        return d1Leads.map((l) => ({
          id: l.id,
          name: l.name,
          phone: l.phone,
          email: l.email,
          category: l.category,
          location: l.location,
          billOrLoad: l.bill_or_load || l.billOrLoad,
          roofOrLandType: l.roof_or_land_type || l.roofOrLandType,
          source: l.source,
          status: l.status,
          notes: l.notes,
          createdAt: Number(l.created_at || l.createdAt)
        }));
      }
    }
  } catch (err) {
    console.debug("Cloudflare D1 fetch note (using local DB fallback):", err);
  }

  // 2. Fallback to local IndexedDB
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("leads", "readonly");
      const store = tx.objectStore("leads");
      const req = store.getAll();

      req.onsuccess = () => {
        const leads = (req.result as LeadSubmission[]) || [];
        leads.sort((a, b) => b.createdAt - a.createdAt);
        resolve(leads);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function updateLeadStatus(id: string, status: LeadSubmission["status"], notes?: string): Promise<void> {
  // 1. Sync to Cloudflare D1
  try {
    await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, notes })
    });
  } catch (err) {
    console.debug("Cloudflare D1 patch note:", err);
  }

  // 2. Update local IndexedDB
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("leads", "readwrite");
      const store = tx.objectStore("leads");
      const getReq = store.get(id);

      getReq.onsuccess = () => {
        const lead = getReq.result as LeadSubmission;
        if (lead) {
          lead.status = status;
          if (notes !== undefined) lead.notes = notes;
          store.put(lead);
        }
        resolve();
      };
      getReq.onerror = () => reject(getReq.error);
    });
  } catch (e) {
    console.debug("IndexedDB update note:", e);
  }

  window.dispatchEvent(new Event("runhitech_db_lead_updated"));
}

export async function deleteLead(id: string): Promise<void> {
  // 1. Sync to Cloudflare D1
  try {
    await fetch(`/api/leads?id=${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  } catch (err) {
    console.debug("Cloudflare D1 delete note:", err);
  }

  // 2. Delete from local IndexedDB
  try {
    const db = await openDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction("leads", "readwrite");
      const store = tx.objectStore("leads");
      store.delete(id);
      resolve();
    });
  } catch (e) {
    console.debug("IndexedDB delete note:", e);
  }

  window.dispatchEvent(new Event("runhitech_db_lead_updated"));
}

// ─────────────────────────────────────────────────────────────
// ADMIN USERS & LOGIN SESSION METHODS
// ─────────────────────────────────────────────────────────────

export async function saveAdminUser(user: Omit<AdminUser, "createdAt" | "lastLogin">): Promise<AdminUser> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("admins", "readwrite");
    const store = tx.objectStore("admins");
    const getReq = store.get(user.email);

    getReq.onsuccess = () => {
      const existing = getReq.result as AdminUser | undefined;
      const fullAdmin: AdminUser = {
        ...user,
        createdAt: existing ? existing.createdAt : Date.now(),
        lastLogin: Date.now()
      };

      const putReq = store.put(fullAdmin);
      putReq.onsuccess = () => {
        localStorage.setItem("runhitech_active_admin", JSON.stringify(fullAdmin));
        resolve(fullAdmin);
      };
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export function getActiveAdminSession(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("runhitech_active_admin");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("runhitech_active_admin");
}
