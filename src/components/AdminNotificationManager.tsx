import { useEffect, useState } from "react";
import { 
  Bell, 
  BellRing, 
  Phone, 
  MessageCircle, 
  Trash2, 
  Clock,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { 
  requestNotificationPermission, 
  getStoredLeads, 
  clearStoredLeads, 
  triggerLeadNotification,
  subscribeToLiveLeads,
  NTFY_URL,
  SolarLead 
} from "../services/notificationService";

export default function AdminNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [leads, setLeads] = useState<SolarLead[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check permission
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }

    // Load stored leads
    const refreshLeads = () => {
      setLeads(getStoredLeads());
    };
    refreshLeads();

    window.addEventListener("runhitech_lead_received", refreshLeads);

    // ── LIVE CLOUD PUSH LISTENER (Receives leads from ANY random user across devices) ──
    const unsubscribe = subscribeToLiveLeads((newLead) => {
      setToastMessage(`⚡ New Lead: ${newLead.name} (${newLead.phone})`);
      setTimeout(() => setToastMessage(null), 5000);
      refreshLeads();
    });

    return () => {
      window.removeEventListener("runhitech_lead_received", refreshLeads);
      unsubscribe();
    };
  }, []);

  const handleEnableNotifications = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === "granted") {
      setToastMessage("🔔 Push notifications activated! You will receive instant lead alerts.");
      setTimeout(() => setToastMessage(null), 4000);
      
      // Send a confirmation test push across cloud relay
      triggerLeadNotification({
        name: "Verification Test Lead",
        phone: "9080557472",
        category: "residential",
        location: "Namakkal, Tamil Nadu",
        billOrLoad: "₹4,500",
        roofOrLandType: "RCC Terrace"
      });
    } else {
      alert("Please allow notification permissions in your browser or Android settings to receive lead alerts.");
    }
  };

  return (
    <>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 max-w-sm text-xs sm:text-sm font-medium">
          <BellRing className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-auto text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Floating Widget (Bottom Right) - Only the Bell Icon */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex items-center floating-widget-global">
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-12 h-12 rounded-full bg-white/90 hover:bg-white backdrop-blur-xl text-slate-800 flex items-center justify-center shadow-2xl border border-white/80 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          style={{ boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.8) inset" }}
          aria-label="Admin Lead Notifications"
          title="Admin Lead Notifications"
        >
          {permission === "granted" ? (
            <BellRing className="w-5 h-5 text-amber-500" />
          ) : (
            <Bell className="w-5 h-5 text-slate-700 group-hover:rotate-12 transition-transform" />
          )}

          {/* Badge count of leads */}
          {leads.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white animate-pulse">
              {leads.length > 9 ? "9+" : leads.length}
            </span>
          )}
        </button>
      </div>

      {/* Admin Leads & Notification Drawer / Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-amber-400">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">Admin Lead Notification Engine</h3>
                  <p className="text-xs text-slate-300">Live cloud alerts for submissions from any device</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Action Bar (Push Permission & Cloud Relay) */}
            <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200/80 space-y-3">
              
              {/* Notification Permission Card */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${permission === "granted" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Browser Alerts: {permission === "granted" ? "Active" : "Disabled"}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {permission === "granted" ? "Plays sound chime & device vibration on new leads" : "Tap to enable alerts on this phone"}
                    </div>
                  </div>
                </div>

                {permission !== "granted" ? (
                  <button
                    onClick={handleEnableNotifications}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl transition-all shrink-0 cursor-pointer shadow-sm"
                  >
                    Enable Alert
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    ✓ Live Push Active
                  </span>
                )}
              </div>

              {/* Direct Android Phone Push Channel */}
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-blue-950">24/7 Android Phone Push Alerts</div>
                    <div className="text-[11px] text-blue-800/80">Get system ringtones even when phone is locked</div>
                  </div>
                </div>
                <a
                  href={NTFY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shrink-0"
                >
                  <span>Open Topic</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>

            {/* Recent Leads Feed */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Real-Time Customer Leads ({leads.length})</span>
                {leads.length > 0 && (
                  <button 
                    onClick={clearStoredLeads}
                    className="text-red-500 hover:text-red-700 inline-flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Clear History
                  </button>
                )}
              </div>

              {leads.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold">No customer leads received yet.</p>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">Whenever any visitor submits a survey form or quote on the website, it will instantly alert your phone and appear here!</p>
                </div>
              ) : (
                leads.map((lead) => (
                  <div 
                    key={lead.id} 
                    className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{lead.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-semibold text-blue-700">
                            {lead.category === "residential" ? "Home Solar" : lead.category === "commercial" ? "Commercial Bunks" : lead.category === "bulk" ? "Industrial MW" : "Survey Request"}
                          </span>
                          {lead.location && <span>• {lead.location}</span>}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(lead.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {(lead.billOrLoad || lead.roofOrLandType) && (
                      <div className="text-xs bg-slate-50 p-2 rounded-xl text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                        {lead.billOrLoad && <div><strong>Bill/Demand:</strong> {lead.billOrLoad}</div>}
                        {lead.roofOrLandType && <div><strong>Structure:</strong> {lead.roofOrLandType}</div>}
                      </div>
                    )}

                    {/* 1-Tap Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call {lead.phone}
                      </a>
                      <a
                        href={`https://wa.me/91${lead.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20contacting%20Run%20Hi%20Tech%20Solar.%20We%20received%20your%20survey%20request.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-400">
              Run Hi Tech Solar Admin Engine • Paramathi Velur, Namakkal
            </div>

          </div>
        </div>
      )}
    </>
  );
}
