import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, 
  ShieldCheck, 
  LogOut, 
  LayoutDashboard, 
  ArrowLeft,
  Sun,
  Clock,
  Sparkles
} from "lucide-react";
import { getCurrentUser, logoutUser, AppUser } from "../services/authService";
import { getAllLeads, LeadSubmission } from "../services/dbService";

export default function ProfilePage() {
  const [user, setUser] = useState<AppUser | null>(getCurrentUser());
  const [userLeads, setUserLeads] = useState<LeadSubmission[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const active = getCurrentUser();
    if (!active) {
      navigate("/");
      return;
    }
    setUser(active);

    getAllLeads().then((all) => {
      const filtered = all.filter(
        (l) => (l.email && l.email.toLowerCase() === active.email.toLowerCase()) || l.name.toLowerCase().includes(active.name.toLowerCase())
      );
      setUserLeads(filtered);
    });
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 pt-24 sm:pt-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">

        {/* Back Link */}
        <div>
          <Link
            to={user.role === "admin" ? "/admin" : "/"}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{user.role === "admin" ? "Back to Admin CRM" : "Back to Home"}</span>
          </Link>
        </div>

        {/* Main Profile Card (Apple iOS Glass Aesthetic) */}
        <div 
          className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6"
          style={{ boxShadow: "0 20px 50px -15px rgba(0,0,0,0.08)" }}
        >
          {/* Top Avatar & Name Strip */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-black text-2xl flex items-center justify-center shadow-lg border-2 border-white overflow-hidden shrink-0">
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.slice(0, 1)
              )}
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{user.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  user.role === "admin"
                    ? "bg-amber-50 border-amber-300 text-amber-800"
                    : "bg-blue-50 border-blue-200 text-blue-700"
                }`}>
                  {user.role === "admin" ? "⭐ Super Administrator" : "👤 Verified Customer"}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.email}</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Last active: {new Date(user.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            {/* Logout CTA Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all border border-red-200 cursor-pointer shadow-xs shrink-0"
              title="Sign Out from this device"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {user.role === "admin" ? (
              <Link
                to="/admin"
                className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-between transition-all shadow-md group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Admin CRM Dashboard</div>
                    <div className="text-[10px] text-slate-300">Manage 550+ customer inquiries</div>
                  </div>
                </div>
                <span className="text-amber-400 text-xs font-bold group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="p-4 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-between transition-all shadow-md group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">PM Surya Ghar Tracker</div>
                    <div className="text-[10px] text-blue-200">Track ₹78,000 subsidy progress</div>
                  </div>
                </div>
                <span className="text-white text-xs font-bold group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            )}

            <Link
              to="/contact"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200/80 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Request Site Survey</div>
                  <div className="text-[10px] text-slate-500">Free engineering audit</div>
                </div>
              </div>
              <span className="text-blue-600 text-xs font-bold group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>

          {/* Account Security Info */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Authenticated via Google OAuth 2.0</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">ID: {user.id.slice(0, 10)}…</span>
          </div>

        </div>

        {/* Activity & Submissions */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Recent Account Activity</h2>
          {userLeads.length === 0 ? (
            <p className="text-xs text-slate-400">No quotes or site surveys submitted yet with this account.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {userLeads.map((lead) => (
                <div key={lead.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{lead.category.toUpperCase()} Inquiry</div>
                    <div className="text-slate-400 text-[11px]">{new Date(lead.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className="font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px]">
                    {lead.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
