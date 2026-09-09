import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sun, 
  ShieldCheck, 
  Zap, 
  Phone, 
  MessageCircle, 
  Calendar, 
  LogOut, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { getCurrentUser, logoutUser, AppUser } from "../services/authService";
import { getAllLeads, LeadSubmission } from "../services/dbService";

export default function CustomerDashboard() {
  const [user, setUser] = useState<AppUser | null>(getCurrentUser());
  const [customerLeads, setCustomerLeads] = useState<LeadSubmission[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const active = getCurrentUser();
    if (!active) {
      navigate("/login");
      return;
    }
    // If admin logged in, route them to admin CRM
    if (active.role === "admin") {
      navigate("/admin");
      return;
    }
    setUser(active);

    // Load customer's submissions
    getAllLeads().then((all) => {
      const userLeads = all.filter(
        (l) => (l.email && l.email.toLowerCase() === active.email.toLowerCase()) || l.name.toLowerCase().includes(active.name.toLowerCase())
      );
      setCustomerLeads(userLeads);
    });
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
              <Sun className="w-5 h-5 text-amber-400" />
            </div>
            <span className="font-black text-sm sm:text-base tracking-tight text-white">
              Run Hi Tech Solar <span className="text-amber-400 text-xs font-normal">Customer Portal</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden">
                {user.picture ? <img src={user.picture} alt={user.name} className="w-full h-full object-cover" /> : user.name.slice(0, 1)}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="font-bold text-white">{user.name}</div>
                <div className="text-[10px] text-slate-400">{user.email}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Solar Account
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome, {user.name.split(" ")[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Track your PM Surya Ghar ₹78,000 central government subsidy, monitor your rooftop survey schedule, and download your 30-year warranty certificates.
            </p>
          </div>
        </div>

        {/* ── PM SURYA GHAR SUBSIDY PROGRESS TRACKER ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">PM Surya Ghar Subsidy & Installation Roadmap</h2>
              <p className="text-xs text-slate-500">Live 5-step progress for your rooftop installation in Tamil Nadu</p>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
              <Zap className="w-3.5 h-3.5" /> Max Subsidy: ₹78,000
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: "01", title: "Site Survey Request", desc: "Registration logged with technical team", done: true },
              { step: "02", title: "Shadow & Structural Validation", desc: "Roof orientation & load increase study", done: true },
              { step: "03", title: "TNEB Net-Meter Filing", desc: "CEIG electrical drawing clearance", done: false },
              { step: "04", title: "Tier-1 Installation", desc: "Mono-PERC panels & hybrid inverter setup", done: false },
              { step: "05", title: "₹78,000 Subsidy Credited", desc: "Direct DBT bank transfer from MNRE", done: false }
            ].map((item, i) => (
              <div key={i} className={`p-4 rounded-2xl border ${item.done ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'} flex flex-col justify-between space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${item.done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    Step {item.step}
                  </span>
                  {item.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SAVINGS & ROI ESTIMATE SUMMARY ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Projected Annual Savings</span>
            </div>
            <div className="text-3xl font-black text-slate-900">₹16,800 – ₹42,000 <span className="text-xs text-slate-400 font-normal">/ yr</span></div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Based on standard 3 kW to 5 kW residential rooftop solar generating 12 to 20 units daily in Tamil Nadu sunshine.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">30-Year Lifetime Value:</span>
              <span className="font-bold text-emerald-600">₹5,04,000+</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Warranty & Guarantees</span>
            </div>
            <div className="text-3xl font-black text-slate-900">30 Years</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Full manufacturer linear power degradation guarantee + 10 years structure & inverter engineering support.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Degradation Rate:</span>
              <span className="font-bold text-blue-600">&lt; 0.55% / year</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                <Phone className="w-4 h-4" />
                <span>Your Assigned Solar Engineer</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-2">Run Hi Tech Engineering Liaison</h3>
              <p className="text-xs text-slate-500 mt-1">Paramathi Velur HQ • Serving Namakkal, Karur & Salem</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a
                href="tel:+919080557472"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                Call +91 90805 57472
              </a>
              <a
                href="https://wa.me/919080557472?text=Hello%20Run%20Hi%20Tech%20Solar,%20I%20am%20logged%20into%20my%20customer%20portal%20and%20would%20like%20to%20check%20my%20survey%20schedule."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </div>
          </div>

        </div>

        {/* ── CUSTOMER'S SUBMISSIONS HISTORY ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Your Solar Inquiries & Quotes</h2>
            <Link to="/contact" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1">
              Request New Survey <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {customerLeads.length === 0 ? (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <Calendar className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-medium">No previous quote requests submitted with this account.</p>
              <Link to="/contact" className="inline-block mt-2 bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl">
                Schedule a Free Rooftop Survey Now
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {customerLeads.map((lead) => (
                <div key={lead.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{lead.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {lead.category.toUpperCase()} • {lead.location || "Tamil Nadu"} • {lead.billOrLoad || "Standard 3 kW"}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                      Status: {lead.status.replace("_", " ").toUpperCase()}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
