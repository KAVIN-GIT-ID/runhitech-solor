// Cloudflare Pages Serverless Function: /api/leads
// Handles Leads CRM database operations with Cloudflare D1

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

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { env } = context;
    if (!env.DB) {
      return new Response(JSON.stringify({ error: "D1 Database binding not found" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { results } = await env.DB.prepare("SELECT * FROM leads ORDER BY created_at DESC LIMIT 100").all();
    return new Response(JSON.stringify(results || []), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = await request.json() as any;

    const id = body.id || "lead_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
    const name = body.name || "Customer";
    const phone = body.phone || "";
    const email = body.email || null;
    const category = body.category || "residential";
    const location = body.location || "Tamil Nadu";
    const billOrLoad = body.billOrLoad || body.bill_or_load || null;
    const roofOrLandType = body.roofOrLandType || body.roof_or_land_type || null;
    const source = body.source || "web_form";
    const status = body.status || "new";
    const notes = body.notes || null;
    const createdAt = body.createdAt || body.created_at || Date.now();

    if (env.DB) {
      await env.DB.prepare(
        `INSERT INTO leads (id, name, phone, email, category, location, bill_or_load, roof_or_land_type, source, status, notes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(id, name, phone, email, category, location, billOrLoad, roofOrLandType, source, status, notes, createdAt).run();
    }

    // Broadcast instant cloud push notification for Admin (Instagram style clean alert)
    try {
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      await fetch("https://ntfy.sh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: "runhitech_solar_admin_leads_9080557472",
          title: "Run Hi Tech Solar",
          message: `${name} sent a new lead inquiry (${phone}) • ${category.toUpperCase()} • ${location || "Tamil Nadu"}`,
          priority: 5,
          click: `tel:${cleanPhone}`,
          actions: [
            {
              action: "view",
              label: "Call",
              url: `tel:${cleanPhone}`
            },
            {
              action: "view",
              label: "WhatsApp",
              url: `https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(name)},%20we%20received%20your%20solar%20inquiry.`
            }
          ]
        })
      });
    } catch (ntfyErr) {
      console.debug("Cloud notification broadcast note:", ntfyErr);
    }

    return new Response(JSON.stringify({
      success: true,
      lead: {
        id,
        name,
        phone,
        email,
        category,
        location,
        billOrLoad,
        roofOrLandType,
        source,
        status,
        notes,
        createdAt
      }
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = await request.json() as any;
    const { id, status, notes } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "Lead ID required" }), { status: 400 });
    }

    if (env.DB) {
      if (status && notes !== undefined) {
        await env.DB.prepare("UPDATE leads SET status = ?, notes = ? WHERE id = ?").bind(status, notes, id).run();
      } else if (status) {
        await env.DB.prepare("UPDATE leads SET status = ? WHERE id = ?").bind(status, id).run();
      } else if (notes !== undefined) {
        await env.DB.prepare("UPDATE leads SET notes = ? WHERE id = ?").bind(notes, id).run();
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Lead ID required" }), { status: 400 });
    }

    if (env.DB) {
      await env.DB.prepare("DELETE FROM leads WHERE id = ?").bind(id).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
