// Cloudflare Pages Serverless Function: /api/auth
// 100% Dynamic Cloudflare D1 Database-Driven Authentication & RBAC

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = any>(): Promise<T | null>;
  run(): Promise<any>;
  all<T = any>(): Promise<{ results?: T[] }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface EventContext<Env, P extends string = string, Data = Record<string, unknown>> {
  request: Request;
  env: Env;
  params: Record<P, string | string[]>;
  data: Data;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
}

type PagesFunction<Env = unknown, P extends string = string, Data = Record<string, unknown>> = (
  context: EventContext<Env, P, Data>
) => Response | Promise<Response>;

interface Env {
  DB: D1Database;
}

interface UserRow {
  id: string;
  email: string;
  name: string;
  picture: string;
  role: string;
  created_at: number;
  last_login: number;
}

// GET /api/auth?email=xxx - Fetch user profile & role directly from D1
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return new Response(JSON.stringify({ error: "Email parameter required" }), { status: 400 });
    }

    const emailLower = email.trim().toLowerCase();

    if (env.DB) {
      const user = await env.DB.prepare(
        "SELECT id, email, name, picture, role, created_at, last_login FROM users WHERE LOWER(email) = LOWER(?)"
      ).bind(emailLower).first<UserRow>();

      if (user) {
        return new Response(JSON.stringify({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            picture: user.picture,
            role: user.role || "customer",
            createdAt: user.created_at,
            lastLogin: user.last_login
          }
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // Default for unregistered
    return new Response(JSON.stringify({
      success: true,
      user: {
        email: emailLower,
        role: "customer"
      }
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

// POST /api/auth - Login / Register User dynamically with Cloudflare D1
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = await request.json() as any;
    const { email, name, picture, id } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    const emailLower = (email as string).trim().toLowerCase();
    const now = Date.now();
    let assignedRole = "customer";

    if (env.DB) {
      // 1. Query D1 to check if this user already exists and what role they have
      const existing = await env.DB.prepare(
        "SELECT id, role, created_at FROM users WHERE LOWER(email) = LOWER(?)"
      ).bind(emailLower).first<{ id: string; role: string; created_at: number }>();

      if (existing && existing.role) {
        // Retain whatever role was configured in D1 (e.g. manually set to admin in D1 Studio)
        assignedRole = existing.role;
      }

      // 2. Upsert user while strictly preserving their D1 assigned role
      await env.DB.prepare(
        `INSERT INTO users (id, email, name, picture, role, created_at, last_login)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(email) DO UPDATE SET
           name = excluded.name,
           picture = excluded.picture,
           role = COALESCE(users.role, excluded.role),
           last_login = excluded.last_login`
      ).bind(
        existing?.id || id || "usr_" + now,
        emailLower,
        name || "User",
        picture || null,
        assignedRole,
        existing?.created_at || now,
        now
      ).run();
    }

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: id || "usr_" + now,
        email: emailLower,
        name: name || "User",
        picture,
        role: assignedRole
      }
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
