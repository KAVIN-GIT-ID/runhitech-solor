// Notification & Cross-Device Cloud Push Alert Service for Admin

import { insertLead } from "./dbService";

export interface SolarLead {
  id: string;
  name: string;
  phone: string;
  category: "residential" | "commercial" | "bulk" | "survey";
  location?: string;
  billOrLoad?: string;
  roofOrLandType?: string;
  timestamp: number;
}

const STORAGE_KEY = "runhitech_leads_history";
// Dedicated Cloud Push Relay Channel for Run Hi Tech Solar
export const NTFY_TOPIC = "runhitech_solar_admin_leads_9080557472";
export const NTFY_URL = `https://ntfy.sh/${NTFY_TOPIC}`;

/**
 * Register Service Worker for PWA and Push Notifications
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/"
    });
    return registration;
  } catch (err) {
    console.warn("ServiceWorker registration failed:", err);
    return null;
  }
}

/**
 * Helper to display native Android OS notification via Service Worker
 */
export async function showNativeOSNotification(title: string, body: string, phone?: string) {
  if (typeof window === "undefined") return;

  // 1. First try ServiceWorkerRegistration.showNotification (Required for Android Chrome & PWAs)
  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready || (await navigator.serviceWorker.getRegistration());
      if (reg && reg.showNotification) {
        await reg.showNotification(title, {
          body,
          icon: "/logo-icon.png",
          badge: "/logo-icon.png",
          tag: "lead-" + Date.now(),
          data: { url: "/#leads", phone }
        });
        return;
      }
    }
  } catch (err) {
    console.debug("ServiceWorker showNotification note:", err);
  }

  // 2. Fallback to standard Notification constructor (Desktop browsers)
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, {
        body,
        icon: "/logo-icon.png"
      });
    } catch (err) {
      console.debug("Standard Notification fallback note:", err);
    }
  }
}

/**
 * Request Push Notification Permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Play an authentic solar chime alert sound using Web Audio API synthesis
 */
export function playLeadChime() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Play warm melodic alert tones (C5 -> E5 -> G5)
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
      
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + idx * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.36);
    });
  } catch (e) {
    console.debug("Audio chime playback:", e);
  }
}

/**
 * Listen for live leads submitted by any user from anywhere on the web
 */
export function subscribeToLiveLeads(onNewLead: (lead: SolarLead) => void): () => void {
  if (typeof window === "undefined") return () => {};

  try {
    const eventSource = new EventSource(`${NTFY_URL}/sse`);
    
    eventSource.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.event === "message" && data.message) {
          // Parse lead details
          const rawMessage: string = data.message;
          const nameMatch = rawMessage.match(/Name:\s*(.*)/);
          const phoneMatch = rawMessage.match(/Phone:\s*(.*)/);
          const categoryMatch = rawMessage.match(/Category:\s*(.*)/);

          const name = nameMatch ? nameMatch[1].trim() : (data.title?.replace("☀️ New Solar Lead: ", "").trim() || "New Customer");
          const phone = phoneMatch ? phoneMatch[1].trim() : "Phone N/A";
          const categoryRaw = categoryMatch ? categoryMatch[1].trim() : "survey";

          const receivedLead: SolarLead = {
            id: data.id || "lead_" + Date.now(),
            name,
            phone,
            category: categoryRaw.includes("Commercial") ? "commercial" : categoryRaw.includes("Industrial") ? "bulk" : "residential",
            location: "Tamil Nadu",
            timestamp: data.time ? data.time * 1000 : Date.now()
          };

          saveLeadToStorage(receivedLead);
          playLeadChime();
          
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 300]);
          }

          // Trigger Android OS native notification via Service Worker
          await showNativeOSNotification(
            `☀️ New Solar Lead: ${name}`,
            `📞 ${phone} • ${categoryRaw}`,
            phone
          );

          onNewLead(receivedLead);
        }
      } catch (err) {
        console.debug("SSE Parse error:", err);
      }
    };

    return () => {
      eventSource.close();
    };
  } catch (err) {
    console.warn("Could not connect to live push stream:", err);
    return () => {};
  }
}

/**
 * Trigger Push Notification across the cloud to Admin device and save lead
 */
export async function triggerLeadNotification(lead: Omit<SolarLead, "id" | "timestamp">): Promise<void> {
  const fullLead: SolarLead = {
    ...lead,
    id: "lead_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    timestamp: Date.now()
  };

  // 1. Save to database table & local storage
  saveLeadToStorage(fullLead);
  try {
    await insertLead({
      name: lead.name,
      phone: lead.phone,
      category: lead.category === "bulk" ? "industrial" : lead.category,
      location: lead.location,
      billOrLoad: lead.billOrLoad,
      roofOrLandType: lead.roofOrLandType,
      source: "home_hero_survey"
    });
  } catch (err) {
    console.debug("DB insert note:", err);
  }

  // 2. Play acoustic chime sound locally
  playLeadChime();

  const categoryTitle = 
    lead.category === "residential" ? "Home PM Surya Ghar" :
    lead.category === "commercial" ? "Commercial / Petrol Bunk" :
    lead.category === "bulk" ? "Industrial MW Plant" : "Quick Survey";

  // 3. BROADCAST TO CLOUD PUSH RELAY (Clean Instagram style)
  try {
    const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
    await fetch("https://ntfy.sh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic: NTFY_TOPIC,
        title: "Run Hi Tech Solar",
        message: `${lead.name} sent a new lead inquiry (${lead.phone}) • ${categoryTitle}`,
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
            url: `https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(lead.name)},%20we%20received%20your%20solar%20inquiry.`
          }
        ]
      })
    });
  } catch (err) {
    console.warn("Cloud push relay delivery note:", err);
  }

  // 4. Trigger local Service Worker notification
  await showNativeOSNotification(
    "Run Hi Tech Solar",
    `${lead.name} sent a new lead inquiry (${lead.phone}) • ${categoryTitle}`,
    lead.phone
  );
}

/**
 * Lead Storage Helpers
 */
export function getStoredLeads(): SolarLead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLeadToStorage(lead: SolarLead) {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredLeads();
    // Avoid duplicate IDs
    if (current.some((l) => l.id === lead.id)) return;
    const updated = [lead, ...current].slice(0, 50); // Keep last 50 leads
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("runhitech_lead_received"));
  } catch (e) {
    console.warn("Error saving lead:", e);
  }
}

export function clearStoredLeads() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("runhitech_lead_received"));
}
