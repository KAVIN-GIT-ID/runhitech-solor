import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  Download, 
  Trash2, 
  Search, 
  Building2, 
  Factory, 
  Home as HomeIcon,
  LogOut,
  BellRing,
  Filter,
  AlertCircle,
  ArrowLeft,
  RotateCw,
  Users
} from "lucide-react";
import { 
  getAllLeads, 
  updateLeadStatus, 
  deleteLead, 
  LeadSubmission, 
  AdminUser 
} from "../services/dbService";
import { 
  handleGoogleLogin, 
  logoutUser, 
  GOOGLE_CLIENT_ID,
  getCurrentUser 
} from "../services/authService";
import { 
  subscribeToLiveLeads, 
  requestNotificationPermission 
} from "../services/notificationService";

export default function AdminDashboard() {
  const getInitialAdmin = (): AdminUser | null => {
    const active = getCurrentUser();
    if (active && active.role === "admin") {
      return {
        id: active.id,
        email: active.email,
        name: active.name,
        picture: active.picture,
        role: "super_admin",
        createdAt: active.createdAt,
        lastLogin: active.lastLogin
      };
    }
    return null;
  };

  const [admin, setAdmin] = useState<AdminUser | null>(getInitialAdmin());
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "residential" | "commercial" | "industrial">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load leads from DB
  const refreshLeads = async () => {
    setIsRefreshing(true);
    const list = await getAllLeads();
    setLeads(list);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  useEffect(() => {
    const syncAuth = () => {
      const active = getCurrentUser();
      if (active && active.role === "admin") {
        setAdmin({
          id: active.id,
          email: active.email,
          name: active.name,
          picture: active.picture,
          role: "super_admin",
          createdAt: active.createdAt,
          lastLogin: active.lastLogin
        });
      }
    };
    window.addEventListener("runhitech_auth_state_changed", syncAuth);
    return () => window.removeEventListener("runhitech_auth_state_changed", syncAuth);
  }, []);

  useEffect(() => {
    if (admin) {
      if (admin.role !== "admin" && admin.role !== "super_admin") {
        setAdmin(null);
        setErrorMessage(`⛔ Access Denied (${admin.email}): Your account is not configured with admin access in the database.`);
        return;
      }

      refreshLeads();
      if ("Notification" in window) {
        setNotificationPermission(Notification.permission);
      }

      const unsubscribe = subscribeToLiveLeads(() => {
        refreshLeads();
      });

      window.addEventListener("runhitech_db_lead_updated", refreshLeads);
      return () => {
        window.removeEventListener("runhitech_db_lead_updated", refreshLeads);
        unsubscribe();
      };
    }
  }, [admin]);

  // Google One Tap & Sign-in Setup for Admin Portal
  useEffect(() => {
    /* global google */
    const initBtn = () => {
      if ((window as unknown as { google?: { accounts: { id: { initialize: (cfg: unknown) => void; renderButton: (el: HTMLElement | null, opt: unknown) => void } } } }).google) {
        const googleApi = (window as unknown as { google: { accounts: { id: { initialize: (cfg: unknown) => void; renderButton: (el: HTMLElement | null, opt: unknown) => void } } } }).google;
        
        googleApi.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: { credential: string }) => {
            const res = await handleGoogleLogin(response.credential);
            if (res.success && res.user) {
              if (res.user.role === "admin") {
                setAdmin({
                  id: res.user.id,
                  email: res.user.email,
                  name: res.user.name,
                  picture: res.user.picture,
                  role: "super_admin",
                  createdAt: res.user.createdAt,
                  lastLogin: res.user.lastLogin
                });
              } else {
                setErrorMessage("⛔ Access Denied: This account is not registered as an administrator. Please sign in with apkavin483@gmail.com.");
              }
            } else {
              setErrorMessage(res.error || "Login failed");
            }
          }
        });

        const btnContainer = document.getElementById("adminGoogleSignInBtn");
        if (btnContainer) {
          btnContainer.innerHTML = "";
          googleApi.accounts.id.renderButton(btnContainer, {
            theme: "outline",
            size: "large",
            shape: "pill",
            text: "continue_with",
            width: 280
          });
        }
      }
    };

    if (!admin && typeof window !== "undefined") {
      if ((window as unknown as { google?: unknown }).google) {
        initBtn();
      } else {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initBtn;
        document.body.appendChild(script);
      }
    }
  }, [admin]);

  const handleLogout = () => {
    logoutUser();
    setAdmin(null);
  };

  const handleStatusChange = async (id: string, newStatus: LeadSubmission["status"]) => {
    await updateLeadStatus(id, newStatus);
    refreshLeads();
  };

  const handleDeleteLead = async (id: string) => {
    if (confirm("Are you sure you want to delete this lead record?")) {
      await deleteLead(id);
      refreshLeads();
    }
  };

  const handleEnablePush = async () => {
    const perm = await requestNotificationPermission();
    setNotificationPermission(perm);
    if (perm === "granted") {
      alert("✅ Push notifications enabled for this device.");
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      alert("No leads to export.");
      return;
    }
    const headers = ["ID", "Name", "Phone", "Email", "Category", "Location", "Bill/Load", "Roof Type", "Status", "Date"];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      l.category,
      `"${(l.location || '').replace(/"/g, '""')}"`,
      `"${(l.billOrLoad || '').replace(/"/g, '""')}"`,
      `"${(l.roofOrLandType || '').replace(/"/g, '""')}"`,
      l.status,
      new Date(l.createdAt).toLocaleString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `runhitech_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchesTab = activeTab === "all" || l.category === activeTab;
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    const matchesSearch = 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.phone.includes(searchQuery) || 
      (l.location && l.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesStatus && matchesSearch;
  });

  // KPI Calculations
  const totalLeadsCount = leads.length;
  const residentialCount = leads.filter((l) => l.category === "residential").length;
  const commercialCount = leads.filter((l) => l.category === "commercial").length;
  const industrialCount = leads.filter((l) => l.category === "industrial" || l.category === "survey").length;

  // ─────────────────────────────────────────────────────────────
  // 1. APPLE iOS WHITE GLASS SIGN IN (UNAUTHENTICATED)
  // ─────────────────────────────────────────────────────────────
  if (!admin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
        <div 
          className="max-w-sm w-full bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 text-center space-y-5"
          style={{ boxShadow: "0 20px 50px -10px rgba(0,0,0,0.08)" }}
        >
          {/* Official Brand Logo */}
          <div className="flex justify-center pb-1">
            <img
              src="/logo.png"
              alt="Run Hi Tech Solar"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin Sign In</h1>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Please sign in with your authorized admin Google account.
            </p>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-2xl flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google Sign-in Official Button */}
          <div className="pt-2 flex justify-center min-h-[46px]">
            <div id="adminGoogleSignInBtn" />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authorized Administrator Access Only</span>
          </div>

          <div className="pt-1">
            <Link to="/" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Home</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. CLEAN APPLE iOS WHITE DASHBOARD (AUTHENTICATED)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* ── TOP HEADER CARD ── */}
        <div 
          className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Customer Inquiries
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage website quote submissions and site survey requests.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleEnablePush}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                notificationPermission === "granted"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-amber-50 border-amber-200 text-amber-800"
              }`}
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>{notificationPermission === "granted" ? "Browser Push Active" : "Enable Browser Push"}</span>
            </button>

            <a
              href="https://ntfy.sh/runhitech_solar_admin_leads_9080557472"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              title="Receive ringtone alerts on your phone 24/7 even when browser and app are closed"
            >
              <span>📱 24/7 Phone Push (Closed App)</span>
            </a>

            <button
              onClick={refreshLeads}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#0f3d75] hover:bg-[#0d3463] text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* ── 4 CLEAN iOS STATS TILES ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Total Inquiries</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">{totalLeadsCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">All submissions</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Residential</span>
              <HomeIcon className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-600 mt-2">{residentialCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">1 kW – 10 kW Rooftops</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-blue-700">
              <span>Commercial & Industrial</span>
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-blue-600 mt-2">{commercialCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">10 kW – 100+ kW Outlets</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-purple-700">
              <span>Bulk & MW Parks</span>
              <Factory className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl font-black text-purple-600 mt-2">{industrialCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">1 MW – 25+ MW Solar Farms</div>
          </div>

        </div>

        {/* ── FILTER & SEARCH CONTROLS ── */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: "all", label: "All Leads", count: totalLeadsCount },
              { id: "residential", label: "Residential", count: residentialCount },
              { id: "commercial", label: "Commercial & Industrial", count: commercialCount },
              { id: "industrial", label: "Bulk MW", count: industrialCount }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input & Status Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, phone, city…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="new">🟡 New</option>
                <option value="contacted">🔵 Contacted</option>
                <option value="site_survey_fixed">🟣 Survey Fixed</option>
                <option value="subsidy_applied">🟢 Subsidy Applied</option>
                <option value="installed">✅ Installed</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
            </div>
          </div>

        </div>

        {/* ── LEADS DATABASE TABLE / LIST ── */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          {filteredLeads.length === 0 ? (
            <div className="py-16 px-6 text-center space-y-2 text-slate-400">
              <ShieldCheck className="w-10 h-10 mx-auto text-slate-300" />
              <h3 className="text-sm font-bold text-slate-700">No customer inquiries found</h3>
              <p className="text-xs text-slate-400">Incoming quote submissions and survey requests will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-5">Customer Profile</th>
                    <th className="py-3.5 px-5">Sector Category</th>
                    <th className="py-3.5 px-5">Location & Specs</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5">Date</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                      
                      {/* Customer Info */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 text-sm">{lead.name}</div>
                        <div className="text-blue-700 font-mono font-bold mt-0.5">{lead.phone}</div>
                        {lead.email && <div className="text-[11px] text-slate-400">{lead.email}</div>}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          lead.category === "residential"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : lead.category === "commercial"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}>
                          {lead.category === "residential" && <HomeIcon className="w-3 h-3" />}
                          {lead.category === "commercial" && <Building2 className="w-3 h-3" />}
                          {lead.category === "industrial" && <Factory className="w-3 h-3" />}
                          <span className="capitalize">{lead.category}</span>
                        </span>
                      </td>

                      {/* Location & Specs */}
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-900">{lead.location || "Tamil Nadu"}</div>
                        {lead.billOrLoad && <div className="text-[11px] text-slate-500 mt-0.5">Load: {lead.billOrLoad}</div>}
                        {lead.roofOrLandType && <div className="text-[10px] text-slate-400">{lead.roofOrLandType}</div>}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-5">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadSubmission["status"])}
                          className="bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="new">🟡 New</option>
                          <option value="contacted">🔵 Contacted</option>
                          <option value="site_survey_fixed">🟣 Survey Fixed</option>
                          <option value="subsidy_applied">🟢 Subsidy Applied</option>
                          <option value="installed">✅ Installed</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-5 text-[11px] text-slate-400 font-mono">
                        {new Date(lead.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>

                      {/* 1-Tap Action Buttons */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-all cursor-pointer"
                            title="Call Customer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/91${lead.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(lead.name)},%20we%20received%20your%20solar%20inquiry%20at%20Run%20Hi%20Tech%20Solar.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all cursor-pointer"
                            title="WhatsApp Customer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
