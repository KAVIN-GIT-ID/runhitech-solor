import { useState, useRef, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  links?: { label: string; href: string }[];
  chips?: string[];
  time: string;
}

// ─── Knowledge Base ───────────────────────────────────────────────────────────
const KB = {
  company: {
    name: "Run Hi Tech Solar",
    founded: "2019",
    tagline: "MNRE Approved Solar EPC Integrator in Tamil Nadu",
    installed: "3.2 MW+ solar installed",
    projects: "550+ completed projects",
    districts: ["Namakkal", "Karur", "Salem", "Erode", "Tirupur", "Coimbatore"],
    phone: ["+91 90805 57472", "+91 96888 30274"],
    email: "info@runhitechsolar.com",
    address: "RS Block 1st Floor, Jedarpalayam Main Road, P. Velur, Namakkal(DT) – 638181",
  },
  services: [
    {
      name: "Residential Solar",
      keywords: ["home", "house", "residential", "apartment", "roof", "rooftop", "home solar", "घर"],
      desc: "Rooftop solar for homes sized 1 kW – 10 kW. Earn up to ₹78,000 PM Surya Ghar subsidy. Saves ₹15,000–₹25,000 annually. Includes 30-year panel warranty.",
      link: "/services#residential",
    },
    {
      name: "Commercial & Petrol Bunks",
      keywords: ["commercial", "bunk", "petrol", "shop", "business", "hotel", "hospital", "school", "factory", "office", "retail"],
      desc: "350+ HPCL petrol bunks solarized across TN. Save 50–70% on EB bills with 3–4 year ROI. Tax depreciation benefits available.",
      link: "/services#commercial",
    },
    {
      name: "Industrial MW EPC",
      keywords: ["industrial", "industry", "mw", "megawatt", "captive", "ppa", "textile", "mill", "spinning", "foundry"],
      desc: "MW-scale industrial solar. Captive, Group Captive & PPA (Power Purchase Agreement) models. Zero upfront with PPA. 10+ MW portfolio completed.",
      link: "/services#industrial",
    },
    {
      name: "Hybrid Solar & Battery Storage",
      keywords: ["battery", "hybrid", "backup", "storage", "lifepo4", "inverter", "power cut", "outage", "blackout"],
      desc: "LiFePO4 battery storage paired with solar for 24/7 power. Millisecond transfer during grid failure. Eliminates diesel generators.",
      link: "/services#hybrid",
    },
    {
      name: "Net Metering Liaison",
      keywords: ["net meter", "net metering", "tneb", "tangedco", "grid", "export", "units"],
      desc: "We handle complete TNEB/TANGEDCO net-metering applications, CEIG electrical drawings, and grid connectivity approvals. Takes 15–30 days.",
      link: "/services",
    },
  ],
  subsidy: {
    keywords: ["subsidy", "subsidy", "pm surya ghar", "government", "scheme", "muft bijli", "benefit", "grant", "free", "help"],
    title: "PM Surya Ghar Muft Bijli Yojana",
    desc: "Direct government subsidy deposited to your bank account after installation and TNEB commissioning.",
    matrix: [
      { size: "1 kW", subsidy: "₹30,000", space: "~100 sq.ft", units: "4–5 units/day", bill: "~₹1,000/month" },
      { size: "2 kW", subsidy: "₹60,000", space: "~200 sq.ft", units: "8–10 units/day", bill: "~₹2,500/month" },
      { size: "3 kW+", subsidy: "₹78,000", space: "~300 sq.ft", units: "12–15 units/day", bill: "~₹3,500+/month" },
    ],
    process: [
      "Site feasibility – roof survey & shadow analysis",
      "Registration on PM Surya Ghar portal + design",
      "Installation + TNEB net-meter coordination",
      "Inspection + subsidy released to bank account",
    ],
  },
  process: {
    keywords: ["process", "how", "steps", "install", "installation", "procedure", "time", "days", "long"],
    steps: [
      "Free Consultation – roof structure, shadow factors & bill pattern analysis",
      "Custom 3D Design – panel layout engineered for max performance",
      "Expert Install – certified local team, 1–2 days deployment",
      "Start Saving – TNEB net-metering live, bills zero out",
    ],
  },
  faq: [
    {
      q: "cost",
      keywords: ["cost", "price", "how much", "fees", "charges", "rate", "expensive", "cheap", "affordable"],
      a: "Cost depends on system size. A 3 kW residential system typically costs ₹1.8–₹2.5 lakhs before subsidy. After the PM Surya Ghar subsidy of up to ₹78,000, net cost is significantly lower. Commercial and industrial pricing is project-specific.",
    },
    {
      q: "warranty",
      keywords: ["warranty", "guarantee", "lifespan", "life", "panel life", "years", "durable"],
      a: "We provide: 30-year manufacturer product warranty on Tier-1 panels, 30-year linear performance guarantee, and 10-year engineering workmanship warranty on structures.",
    },
    {
      q: "cloudy",
      keywords: ["cloud", "cloudy", "rain", "monsoon", "weather", "night", "dark"],
      a: "Solar panels still generate 10–25% capacity on cloudy days. For nights and power cuts, pair with our LiFePO4 hybrid battery storage for uninterrupted supply.",
    },
    {
      q: "net metering time",
      keywords: ["how long", "net meter time", "tneb time", "approval time", "days"],
      a: "TNEB grid connectivity and bi-directional net-meter provisioning usually takes 15–30 days. Our liaison team handles all CEIG drawings, structural approvals and TNEB paperwork.",
    },
    {
      q: "savings",
      keywords: ["save", "saving", "savings", "bill reduction", "reduce bill", "how much save", "benefit", "roi", "return"],
      a: "Residential: Save ₹15,000–₹25,000 annually. Commercial: Reduce EB bills by 50–70%, with 3–4 year ROI. Industrial: Long-term energy cost reduction of 60–80%. Plus 30 years of free solar generation!",
    },
  ],
  brands: ["TATA Power Solar", "Waaree Solar", "Vikram Solar", "Adani Solar", "Luminous India", "Microtek", "Growatt Inverters", "Fronius Inverters"],
  contact: {
    keywords: ["contact", "call", "phone", "email", "address", "reach", "talk", "speak", "visit", "survey"],
    cta: "Ready to start? Our experts are just a call away.",
  },
};

// ─── Intent Matcher ───────────────────────────────────────────────────────────
function getReply(input: string): Omit<Message, "id" | "role" | "time"> {
  const q = input.toLowerCase().trim();

  // Greeting
  if (/^(hi|hello|hey|hola|namaste|வணக்கம்|good morning|good afternoon|good evening|start|help)/.test(q)) {
    return {
      text: "👋 Hello! Welcome to **Run Hi Tech Solar**.\n\nI can help you with:\n• Our solar services\n• PM Surya Ghar subsidy details\n• Cost & savings estimates\n• Installation process\n• Coverage areas in Tamil Nadu",
      chips: ["Our Services", "PM Surya Ghar Subsidy", "How much can I save?", "Contact us"],
    };
  }

  // WhatsApp Intent
  if (/whatsapp|wa|chat|direct message|msg|specialist|talk/.test(q)) {
    return {
      text: "🟢 **Chat directly with our Solar Specialist on WhatsApp:**\n\nYou can chat directly with our engineering and subsidy support team for instant quotes, roof survey bookings, or subsidy questions.",
      links: [
        {
          label: "💬 Open WhatsApp Chat (+91 90805 57472) ↗",
          href: "https://wa.me/919080557472?text=Hello%20Run%20Hi%20Tech%20Solar%2C%20I%20would%20like%20to%20know%20more%20about%20solar%20installation%20and%20subsidy",
        },
      ],
      chips: ["Our Services", "PM Surya Ghar Subsidy", "Check Savings"],
    };
  }

  // Services overview
  if (/service|offer|provide|do you|what do|solution/.test(q) && !/specific/.test(q)) {
    return {
      text: "🌞 **Run Hi Tech Solar** offers 4 core solar solutions:\n\n1. **Residential** – Home rooftop (1–10 kW) with PM Surya Ghar subsidy\n2. **Commercial** – Petrol bunks, hotels, schools, hospitals\n3. **Industrial MW EPC** – Captive & PPA projects for factories\n4. **Hybrid Battery** – Solar + LiFePO4 for 24/7 backup power\n\nAlso: Full **TNEB Net-Metering liaison** included.",
      links: [{ label: "View All Services →", href: "/services" }],
      chips: ["Residential Solar", "Commercial Solar", "Industrial Solar", "Battery Backup"],
    };
  }

  // Specific service lookups
  for (const svc of KB.services) {
    if (svc.keywords.some((k) => q.includes(k))) {
      return {
        text: `☀️ **${svc.name}**\n\n${svc.desc}`,
        links: [{ label: `Learn more about ${svc.name} →`, href: svc.link }],
        chips: ["Check Subsidy", "How much does it cost?", "Talk to an Expert"],
      };
    }
  }

  // Subsidy
  if (KB.subsidy.keywords.some((k) => q.includes(k))) {
    const matrix = KB.subsidy.matrix.map((m) => `• **${m.size}** → Subsidy **${m.subsidy}** | ${m.units} | Space: ${m.space}`).join("\n");
    return {
      text: `💰 **PM Surya Ghar Muft Bijli Yojana**\n\nDirect government subsidy deposited to your bank account:\n\n${matrix}\n\n✅ Run Hi Tech Solar handles the complete paperwork, portal registration & TNEB liaison for you!`,
      links: [
        { label: "Full Subsidy Details →", href: "/subsidy" },
        { label: "Check Eligibility →", href: "/contact" },
      ],
      chips: ["Installation process", "How long does it take?", "Contact us"],
    };
  }

  // Process / Installation
  if (KB.process.keywords.some((k) => q.includes(k))) {
    const steps = KB.process.steps.map((s, i) => `**Step ${i + 1}:** ${s}`).join("\n");
    return {
      text: `🔧 **Our 4-Step Installation Process:**\n\n${steps}\n\n⚡ Total time from consultation to going live: typically **7–14 days** (subject to TNEB net-meter approval).`,
      chips: ["How long for TNEB approval?", "What brands do you use?", "Contact us"],
    };
  }

  // Brands / Partners
  if (/brand|panel|manufacturer|tier|quality|products?|waaree|tata|vikram|adani|luminous|growatt|fronius/.test(q)) {
    return {
      text: `🏭 **Trusted Panel & Inverter Brands:**\n\n${KB.brands.map((b) => `• ${b}`).join("\n")}\n\nWe only source **Tier-1 MNRE-empanelled** panels with 30-year warranties.`,
      chips: ["Warranty details", "What services do you offer?", "Get a quote"],
    };
  }

  // Coverage / Location / Districts
  if (/area|district|location|cover|region|city|cities|where|serve|available|namakkal|karur|salem|erode|tirupur|coimbatore|tamil/.test(q)) {
    const districts = KB.company.districts.join(", ");
    return {
      text: `📍 **Service Coverage – Tamil Nadu:**\n\n${districts}\n\nOur field teams operate across all 6 districts with certified local technicians.\n\n🏢 **Head Office:** ${KB.company.address}`,
      links: [{ label: "Get a Free Survey →", href: "/contact" }],
      chips: ["Contact us", "How much does it cost?"],
    };
  }

  // FAQ: Cost / Price
  for (const f of KB.faq) {
    if (f.keywords.some((k) => q.includes(k))) {
      return {
        text: `💡 ${f.a}`,
        links: f.q === "cost" ? [{ label: "View Subsidy Details →", href: "/subsidy" }] : undefined,
        chips: ["Talk to an Expert", "What services do you offer?"],
      };
    }
  }

  // Contact / Call
  if (KB.contact.keywords.some((k) => q.includes(k))) {
    return {
      text: `📞 **Get in Touch with Run Hi Tech Solar:**\n\n📱 Direct Helpline: ${KB.company.phone[0]}\n📱 Secondary Line: ${KB.company.phone[1]}\n📧 Email: ${KB.company.email}\n📍 Office: ${KB.company.address}\n\n${KB.contact.cta}`,
      links: [
        {
          label: "💬 Chat on WhatsApp ↗",
          href: "https://wa.me/919080557472?text=Hello%20Run%20Hi%20Tech%20Solar%2C%20I%20would%20like%20to%20know%20more%20about%20solar%20installation%20and%20subsidy",
        },
        { label: "Request Free Survey →", href: "/contact" },
      ],
      chips: ["💬 WhatsApp Us", "Our Services", "PM Surya Ghar Subsidy"],
    };
  }

  // About company
  if (/about|who|company|run hi tech|history|since|background|founded|team/.test(q)) {
    return {
      text: `🏢 **About Run Hi Tech Solar**\n\nFounded in **${KB.company.founded}**, we are an **MNRE Approved Solar EPC Integrator** based in Tamil Nadu.\n\n✅ **${KB.company.installed}**\n✅ **${KB.company.projects}**\n✅ Coverage: ${KB.company.districts.join(", ")}\n\nSpecializing in residential, commercial, and industrial solar EPC with end-to-end project management.`,
      links: [{ label: "About Us →", href: "/about" }],
      chips: ["Our Services", "Check Subsidy", "Contact us"],
    };
  }

  // Calculator / Savings estimate
  if (/calculat|estimate|how much.*save|saving|bill|units|kw|kilowatt/.test(q)) {
    return {
      text: `🧮 **Quick Solar Savings Estimate (Tamil Nadu TNEB):**\n\nYour savings depend on your current bi-monthly electricity bill:\n\n• **₹1,500–₹2,500 bi-monthly** → 1–2 kW system → Save ~₹9,000–₹15,000/yr\n• **₹3,500–₹5,000 bi-monthly** → 3–4 kW system → Save ~₹21,000–₹30,000/yr\n• **₹7,000+ bi-monthly** → 5 kW+ → Save ₹42,000+/yr\n\n💡 Use our interactive **Solar Financial Estimator** on the home page for exact TNEB LT-1A calculations!`,
      links: [{ label: "Try Savings Calculator →", href: "/#calculator" }],
      chips: ["Check Subsidy", "Talk to an Expert"],
    };
  }

  // Fallback
  return {
    text: `🤖 I'm not sure I understood that. Here are some things I can help you with:`,
    chips: ["Our Services", "Check Subsidy", "How much can I save?", "Coverage Areas", "Talk to an Expert", "Contact us"],
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const now = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

let _id = 0;
const uid = () => ++_id;

function formatText(text: string) {
  // Bold **...** and line breaks
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={i}>
        {parts.map((p, j) =>
          p.startsWith("**") && p.endsWith("**") ? (
            <strong key={j} className="font-semibold text-slate-900">
              {p.slice(2, -2)}
            </strong>
          ) : (
            <span key={j}>{p}</span>
          )
        )}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    );
  });
}

// ─── INITIAL BOT MESSAGE ─────────────────────────────────────────────────────
const INITIAL_MESSAGES: Message[] = [
  {
    id: uid(),
    role: "bot",
    text: "👋 Hi! Welcome to **Run Hi Tech Solar**.\n\nAsk me anything about our solar services, subsidies, pricing, or coverage areas in Tamil Nadu!",
    chips: ["Our Services", "PM Surya Ghar Subsidy", "How much can I save?", "Contact us"],
    time: now(),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  // Listen for global open event (e.g. from header)
  useEffect(() => {
    const handleOpenEvent = () => {
      setOpen(true);
    };
    window.addEventListener("open-solarbot", handleOpenEvent);
    return () => window.removeEventListener("open-solarbot", handleOpenEvent);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      setInput("");

      const userMsg: Message = { id: uid(), role: "user", text, time: now() };
      setMessages((prev) => [...prev, userMsg]);
      setTyping(true);

      // Simulate "thinking" delay
      await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));

      const reply = getReply(text);
      const botMsg: Message = { id: uid(), role: "bot", time: now(), ...reply };
      setTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* ── Floating Action Buttons (WhatsApp + AI Chat in Apple iOS Frosted Glass Theme) ── */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2.5 sm:gap-3 floating-widget-global">
        {/* WhatsApp Direct 1-Tap Floating Button */}
        <a
          href="https://wa.me/919080557472?text=Hello%20Run%20Hi%20Tech%20Solar%2C%20I%20would%20like%20to%20know%20more%20about%20solar%20installation%20and%20subsidy"
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on WhatsApp (+91 90805 57472)"
          aria-label="Chat on WhatsApp"
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white/98 hover:bg-white text-emerald-600 shadow-xl border border-slate-200/90 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          style={{ boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.9) inset" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>

        {/* AI Chat Floating Button */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Open Solar Support Chat"
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white/98 hover:bg-white text-blue-600 shadow-xl border border-slate-200/90 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer relative"
          style={{ boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.9) inset" }}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="9" cy="10" r="1" fill="currentColor" />
              <circle cx="12" cy="10" r="1" fill="currentColor" />
              <circle cx="15" cy="10" r="1" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Chat Panel ── */}
      <div
        className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[380px] max-w-[400px] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 transition-all duration-300 floating-widget-global"
        style={{
          transform: open ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          background: "rgba(255,255,255,0.98)",
          backdropFilter: "blur(24px)",
          height: "540px",
          maxHeight: "min(580px, calc(100dvh - 110px))",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #065F46 0%, #059669 35%, #0F3D75 75%, #1E3A8A 100%)" }}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white p-1 flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden border border-white/40">
            <img
              src="/logo-icon.png"
              alt="runhitech Ai"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm sm:text-base font-bold text-white leading-tight truncate">Runhitech Ai</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-100/90 font-medium">AI Solar Assistant • Online</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setMessages(INITIAL_MESSAGES)}
              title="Reset conversation"
              className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-3.09" />
              </svg>
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition cursor-pointer"
              aria-label="Close Chat"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4 touch-pan-y"
          style={{
            minHeight: 0,
            WebkitOverflowScrolling: "touch"
          }}
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {msg.role === "bot" && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white p-0.5 flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5 overflow-hidden border border-slate-200">
                  <img
                    src="/logo-icon.png"
                    alt="runhitech Ai"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1.5`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "user"
                    ? "bg-gradient-to-br from-[#059669] via-[#0284c7] to-[#1d4ed8] text-white rounded-tr-sm"
                    : "bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-sm"
                    }`}
                >
                  {formatText(msg.text)}
                </div>

                {/* Links */}
                {msg.links && msg.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {msg.links.map((l, i) => (
                      <a
                        key={i}
                        href={l.href}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 transition-all ${l.href.includes("wa.me")
                          ? "bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xs active:scale-95"
                          : "text-[#059669] hover:text-[#0284c7] underline underline-offset-2"
                          }`}
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}

                {/* Quick Chips */}
                {msg.chips && msg.chips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {msg.chips.map((chip, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(chip)}
                        className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-[#059669]/20 text-[#059669] bg-[#059669]/5 hover:bg-[#059669]/10 hover:border-[#059669]/40 transition-all"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-slate-400 px-1">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white p-0.5 flex items-center justify-center flex-shrink-0 shadow-xs overflow-hidden border border-slate-200">
                <img
                  src="/logo-icon.png"
                  alt="runhitech Ai"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-slate-400"
                    style={{ animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-3 py-2.5 border-t border-slate-100 flex-shrink-0 bg-white"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about solar, subsidies, pricing…"
            className="flex-1 text-sm px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#059669]/40 focus:ring-2 focus:ring-[#059669]/10 transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #059669, #0284c7, #1d4ed8)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>

        {/* Keyframe injection */}
        <style>{`
          @keyframes typingDot {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-5px); opacity: 1; }
          }
        `}</style>
      </div>
    </>
  );
}
