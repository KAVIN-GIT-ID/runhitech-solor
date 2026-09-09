import { Phone } from "lucide-react";

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-40 floating-widget-global">
      <a
        href="tel:+919080557472"
        className="flex items-center gap-2.5 bg-white/98 hover:bg-white text-slate-900 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full text-xs sm:text-sm font-bold shadow-xl border border-slate-200/90 transition-all hover:scale-105 active:scale-95 group"
        style={{ boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.9) inset" }}
        aria-label="Call Run Hi Tech Solar"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-xs shrink-0 group-hover:rotate-12 transition-transform">
          <Phone className="w-3.5 h-3.5 fill-current" />
        </div>
        <span className="font-mono tracking-tight text-slate-900 font-extrabold hidden min-[440px]:inline">
          +91 90805 57472
        </span>
        <span className="font-sans text-xs text-slate-900 font-bold min-[440px]:hidden">
          Call
        </span>
      </a>
    </div>
  );
}
