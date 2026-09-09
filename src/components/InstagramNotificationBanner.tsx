import { useState, useEffect } from "react";
import { Phone, MessageCircle, X } from "lucide-react";
import { getCurrentUser } from "../services/authService";
import { subscribeToLiveLeads, SolarLead } from "../services/notificationService";

export default function InstagramNotificationBanner() {
  const [activeLead, setActiveLead] = useState<SolarLead | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only subscribe and show banner if active user is an admin
    const checkAndSubscribe = () => {
      const user = getCurrentUser();
      if (!user || user.role !== "admin") return () => {};

      return subscribeToLiveLeads((lead) => {
        setActiveLead(lead);
        setVisible(true);

        // Auto dismiss after 7 seconds
        const timer = setTimeout(() => {
          setVisible(false);
        }, 7000);

        return () => clearTimeout(timer);
      });
    };

    const unsub = checkAndSubscribe();
    window.addEventListener("runhitech_auth_state_changed", checkAndSubscribe);

    return () => {
      unsub();
      window.removeEventListener("runhitech_auth_state_changed", checkAndSubscribe);
    };
  }, []);

  if (!visible || !activeLead) return null;

  return (
    <div className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-[99999] w-[94%] max-w-sm transition-all duration-300 animate-bounce-subtle pointer-events-auto">
      <div 
        className="bg-white rounded-2xl p-3.5 border border-slate-200/90 text-slate-900 shadow-2xl"
        style={{
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)"
        }}
      >
        {/* Top Header Row (Instagram style) */}
        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-[1.5px] flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-700" />
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-900 tracking-tight uppercase">RUN HI TECH SOLAR</span>
            <span className="text-[10px] text-slate-400 font-medium">• now</span>
          </div>

          <button
            onClick={() => setVisible(false)}
            className="text-slate-400 hover:text-slate-700 p-0.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lead Content */}
        <div className="pt-2 pb-2.5">
          <div className="font-extrabold text-slate-900 text-sm tracking-tight">
            {activeLead.name}
          </div>
          <div className="text-xs text-slate-600 mt-0.5 font-medium flex items-center gap-1.5">
            <span className="text-blue-700 font-bold font-mono">{activeLead.phone}</span>
            <span>•</span>
            <span className="capitalize text-slate-500">{activeLead.category} Solar</span>
          </div>
        </div>

        {/* Bottom Quick 1-Tap Action Pills */}
        <div className="flex items-center gap-2 pt-1">
          <a
            href={`tel:${activeLead.phone.replace(/[^0-9]/g, "")}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Phone className="w-3 h-3" />
            <span>Call Now</span>
          </a>

          <a
            href={`https://wa.me/91${activeLead.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(activeLead.name)},%20we%20received%20your%20solar%20inquiry%20at%20Run%20Hi%20Tech%20Solar.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <MessageCircle className="w-3 h-3" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
