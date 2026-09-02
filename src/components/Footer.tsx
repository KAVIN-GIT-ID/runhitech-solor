import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-200/80 pt-12 sm:pt-16 pb-12 bg-slate-50/80 text-slate-700 overflow-hidden">
      
      {/* Background Solar Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0f3d75_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-200/70">
          
          {/* Column 1: Brand & Socials (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="/logo.png"
                alt="Run Hi Tech Solar"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>
            
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
              Empowering homes, petrol bunks, and spinning mills in Tamil Nadu with clean, government-subsidized solar energy since 2019. Over 550+ installations commissioned.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://www.facebook.com/runhitechsolar/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-all active:scale-95"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href="https://www.instagram.com/run_hi_tech_pvt_ltd/reels/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-rose-600 hover:border-rose-300 transition-all active:scale-95"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              <a
                href="https://youtube.com/@runhitechsolar6700?si=MRND1Y3BAhokuwYg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-red-600 hover:border-red-300 transition-all active:scale-95"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li><Link to="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-blue-600 transition-colors">Solar Services</Link></li>
              <li><Link to="/subsidy" className="hover:text-blue-600 transition-colors">Govt Subsidy Guide</Link></li>
              <li><Link to="/media" className="hover:text-blue-600 transition-colors">Media & Posters</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Solar Services (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
              Solar Solutions
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li><Link to="/services" className="hover:text-blue-600 transition-colors">Home Rooftop Solar (1–10 kW)</Link></li>
              <li><Link to="/services" className="hover:text-blue-600 transition-colors">Commercial Petrol Bunks Solar</Link></li>
              <li><Link to="/services" className="hover:text-blue-600 transition-colors">Industrial MW Power Plants</Link></li>
              <li><Link to="/services" className="hover:text-blue-600 transition-colors">Hybrid Solar & Battery Backup</Link></li>
              <li><Link to="/subsidy" className="hover:text-blue-600 transition-colors">TNEB Net-Metering Approval</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Office (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
              Head Office
            </h4>
            
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
              <a
                href="https://maps.app.goo.gl/DqbK9Hz9WV2q1wMf7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-blue-600 transition-colors group"
                title="View on Google Maps"
              >
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="leading-relaxed">
                  RS Block 1st Floor, Jedarpalayam Main Road, P. Velur, Namakkal (DT) – 638181 ↗
                </span>
              </a>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="flex gap-2 font-mono font-bold text-slate-800">
                  <a href="tel:+919080557472" className="hover:text-blue-600">+91 90805 57472</a>
                  <span>/</span>
                  <a href="tel:+919688830274" className="hover:text-blue-600">+91 96888 30274</a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <a href="mailto:info@runhitechsolar.com" className="font-mono text-slate-800 hover:text-blue-600">
                  info@runhitechsolar.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>MNRE Approved Solar Partner • PM Surya Ghar Integrator</span>
          </div>

          <div>
            © {new Date().getFullYear()} Run Hi Tech Solar. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
